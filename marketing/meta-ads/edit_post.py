"""Edit the message on a live Facebook Page post, and prove it took.

Editing an ordinary Page post keeps its ID, so likes, comments, shares and
reach all survive; Facebook only adds an "Edited" marker. That is the whole
reason this is safe to do and deleting-and-reposting is not.

Same discipline as meta_publish.py: after the write, the post is fetched back
and the new text asserted. Two reels once published with no caption because
"it looked like it worked" was treated as proof.

    python edit_post.py --show <post_id>
    python edit_post.py --set  <post_id> --file new_text.txt
    python edit_post.py --set  <post_id> --file new_text.txt --confirm

Dry run by default. Nothing is written without --confirm.
"""

import argparse
import io
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE = os.path.join(HERE, ".token")
GRAPH = "https://graph.facebook.com"
VERSION = "v25.0"
PAGE_ID = os.environ.get("META_PAGE_ID", "482409631622420")


def load_token():
    v = os.environ.get("META_PAGE_TOKEN")
    if v:
        return v.strip()
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE) as fh:
            v = fh.read().strip()
        if v:
            return v
    sys.exit("No token. Set META_PAGE_TOKEN or write %s" % TOKEN_FILE)


TOKEN = load_token()


def scrub(t):
    t = str(t)
    if TOKEN and TOKEN in t:
        t = t.replace(TOKEN, "<TOKEN REDACTED>")
    for leak in re.findall(r"EAA[A-Za-z0-9_-]{20,}", t):
        t = t.replace(leak, "<TOKEN REDACTED>")
    return t


def api(method, path, params=None, token=None):
    url = "%s/%s/%s" % (GRAPH, VERSION, path.lstrip("/"))
    body = None
    if method == "GET":
        if params:
            url += "?" + urllib.parse.urlencode(params)
    elif params:
        body = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Authorization", "Bearer " + (token or TOKEN))
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return True, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return False, json.loads(e.read().decode("utf-8"))
        except Exception:
            return False, {"error": {"message": "HTTP %s" % e.code}}
    except Exception as e:
        return False, {"error": {"message": str(e)}}


def page_token():
    ok, p = api("GET", PAGE_ID, {"fields": "access_token"})
    if not ok or not p.get("access_token"):
        sys.exit(scrub("Could not get a Page access token: %s" % p))
    return p["access_token"]


def read_post(pid, tok):
    ok, p = api("GET", pid, {"fields": "id,message,created_time,permalink_url"}, token=tok)
    if not ok:
        sys.exit(scrub("Could not read %s: %s" % (pid, p)))
    return p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--show", metavar="POST_ID")
    ap.add_argument("--set", metavar="POST_ID")
    ap.add_argument("--file", metavar="PATH")
    ap.add_argument("--confirm", action="store_true")
    a = ap.parse_args()
    tok = page_token()

    if a.show:
        p = read_post(a.show, tok)
        print("id        :", p["id"])
        print("created   :", p.get("created_time"))
        print("permalink :", p.get("permalink_url"))
        print("-" * 74)
        print(p.get("message"))
        print("-" * 74)
        return 0

    if not a.set:
        ap.print_help()
        return 0
    if not a.file:
        sys.exit("--set needs --file")

    new = io.open(a.file, encoding="utf-8").read().strip()
    before = read_post(a.set, tok)
    old = (before.get("message") or "").strip()

    print("post      :", before["id"])
    print("permalink :", before.get("permalink_url"))
    print("")
    print("BEFORE (%d chars)" % len(old))
    print("-" * 74)
    print(old)
    print("")
    print("AFTER (%d chars)" % len(new))
    print("-" * 74)
    print(new)
    print("")

    if not a.confirm:
        print("DRY RUN. Nothing was written. Add --confirm to apply.")
        return 0

    ok, res = api("POST", a.set, {"message": new}, token=tok)
    if not ok:
        sys.exit(scrub("edit failed: %s" % res))

    after = read_post(a.set, tok)
    got = (after.get("message") or "").strip()
    if got != new:
        print("FAIL: the post did not come back with the new text.")
        print("  wanted %d chars, got %d" % (len(new), len(got)))
        return 1
    print("VERIFIED: read back and identical (%d chars)." % len(got))
    print("Likes, comments and reach are unaffected - the post ID never changed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
