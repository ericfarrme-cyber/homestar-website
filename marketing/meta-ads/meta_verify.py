"""Check that everything queued or published actually has its caption.

This exists because two reels went out with no caption at all. The composer
dropped it silently, and "Scheduled -> Published" was read as proof the caption
survived. It was not proof. This is.

It reads Facebook and Instagram and reports, per post, whether a caption is
present and whether it matches the approved copy in the markdown files. It
posts nothing, edits nothing and deletes nothing - every call is a GET.

    python meta_verify.py                 everything: scheduled, then recent
    python meta_verify.py --scheduled     only what is queued and not yet live
    python meta_verify.py --recent 10     only what already published

One asymmetry worth knowing, because it changes what this can promise:

  Facebook scheduled posts ARE visible before they publish, so a missing
  caption can be caught while there is still time to fix it.

  Instagram has no scheduling in its API, and posts scheduled in Business Suite
  do not appear until they go live. So Instagram can only be checked after the
  fact - which still beats never noticing, but it is a warning, not a save.
"""

import argparse
import difflib
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE = os.path.join(HERE, ".token")

GRAPH = "https://graph.facebook.com"
VERSION = "v25.0"
PAGE_ID = os.environ.get("META_PAGE_ID", "482409631622420")
IG_USER_ID = os.environ.get("META_IG_USER_ID", "17841470404585555")


def load_token():
    value = os.environ.get("META_PAGE_TOKEN")
    if value:
        return value.strip()
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE) as handle:
            value = handle.read().strip()
        if value:
            return value
    sys.exit("No token. Set META_PAGE_TOKEN or write %s" % TOKEN_FILE)


TOKEN = load_token()


def scrub(text):
    text = str(text)
    if TOKEN and TOKEN in text:
        text = text.replace(TOKEN, "<TOKEN REDACTED>")
    for leaked in re.findall(r"EAA[A-Za-z0-9_-]{20,}", text):
        text = text.replace(leaked, "<TOKEN REDACTED>")
    return text


def api(path, params=None, token=None):
    url = "%s/%s/%s" % (GRAPH, VERSION, path.lstrip("/"))
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url)
    req.add_header("Authorization", "Bearer " + (token or TOKEN))
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return True, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        try:
            return False, json.loads(exc.read().decode("utf-8"))
        except Exception:
            return False, {"error": {"message": "HTTP %s" % exc.code}}
    except Exception as exc:
        return False, {"error": {"message": str(exc)}}


def page_token():
    good, payload = api(PAGE_ID, {"fields": "access_token"})
    if not good or not payload.get("access_token"):
        sys.exit(scrub("Could not get a Page access token: %s" % payload))
    return payload["access_token"]


# ------------------------------------------------------- approved captions


def approved():
    """The captions Eric signed off, straight from the markdown."""
    sys.path.insert(0, HERE)
    import meta_publish
    return meta_publish.load_captions()


def _norm(text):
    return re.sub(r"\s+", " ", (text or "")).strip().lower()


def match_approved(caption, library):
    """Which approved caption is this, and is it intact?

    Returns (code, verdict). Verdict is one of:
      exact   - identical to the approved copy
      close   - same post, but the text drifted (edited, or truncated)
      unknown - not one of ours, which is fine for posts we did not write
    """
    if not caption:
        return None, "bare"
    target = _norm(caption)
    best_code, best_ratio = None, 0.0
    for code, text in library.items():
        candidate = _norm(text)
        if candidate == target:
            return code, "exact"
        ratio = difflib.SequenceMatcher(None, candidate, target).ratio()
        if ratio > best_ratio:
            best_code, best_ratio = code, ratio
    if best_ratio >= 0.85:
        return best_code, "close"
    return None, "unknown"


def stamp(value):
    if not value:
        return "-"
    try:
        if str(value).isdigit():
            return datetime.fromtimestamp(int(value)).strftime("%a %d %b %H:%M")
        return datetime.strptime(value[:19], "%Y-%m-%dT%H:%M:%S").strftime("%a %d %b %H:%M")
    except Exception:
        return str(value)[:16]


def report(rows, library, heading, note=None):
    print("")
    print(heading)
    if note:
        print("  " + note)
    print("-" * 88)
    if not rows:
        print("  nothing found")
        return 0
    problems = 0
    for row in rows:
        code, verdict = match_approved(row["caption"], library)
        if verdict == "bare":
            flag, detail = "BARE", "NO CAPTION AT ALL"
            problems += 1
        elif verdict == "exact":
            flag, detail = "ok", "%s, %d ch" % (code, len(row["caption"]))
        elif verdict == "close":
            flag, detail = "DRIFT", "looks like %s but text differs" % code
            problems += 1
        else:
            flag, detail = "?", "not one of ours, %d ch" % len(row["caption"])
        print("  %-6s %-16s %-34s %s"
              % (flag, stamp(row.get("when")), detail, row.get("id", "")[:28]))
    return problems


# ---------------------------------------------------------------- gathering


def facebook_scheduled(token):
    rows = []
    good, payload = api("%s/scheduled_posts" % PAGE_ID, {
        "fields": "id,message,scheduled_publish_time,created_time",
        "limit": "50",
    }, token=token)
    if not good:
        print("  could not read scheduled posts: %s"
              % scrub(payload.get("error", {}).get("message", "?")))
        return rows
    for item in payload.get("data", []):
        rows.append({
            "id": item.get("id", ""),
            "caption": item.get("message"),
            "when": item.get("scheduled_publish_time"),
        })
    return rows


def facebook_recent(token, limit):
    """The Page's own posts, plus its reels.

    Deliberately not /feed. That edge also returns posts written by other
    people on the Page, so Meta gates it behind Page Public Content Access -
    a permission we do not have and do not want. /published_posts is the
    Page's own output, which is the only thing worth checking anyway.

    Reels are fetched separately because they do not reliably appear in
    published_posts, and reels are most of what we publish.
    """
    rows = []
    seen = set()

    good, payload = api("%s/published_posts" % PAGE_ID, {
        "fields": "id,message,created_time",
        "limit": str(limit),
    }, token=token)
    if good:
        for item in payload.get("data", []):
            rows.append({
                "id": item.get("id", ""),
                "caption": item.get("message"),
                "when": item.get("created_time"),
            })
            seen.add(item.get("id", ""))
    else:
        print("  could not read published posts: %s"
              % scrub(payload.get("error", {}).get("message", "?")))

    good, payload = api("%s/video_reels" % PAGE_ID, {
        "fields": "id,description,updated_time",
        "limit": str(limit),
    }, token=token)
    if good:
        for item in payload.get("data", []):
            if item.get("id") in seen:
                continue
            rows.append({
                "id": item.get("id", ""),
                "caption": item.get("description"),
                "when": item.get("updated_time"),
            })
    else:
        print("  could not read reels: %s"
              % scrub(payload.get("error", {}).get("message", "?")))

    return rows


def instagram_recent(token, limit):
    rows = []
    good, payload = api("%s/media" % IG_USER_ID, {
        "fields": "id,caption,media_type,timestamp",
        "limit": str(limit),
    }, token=token)
    if not good:
        print("  could not read Instagram media: %s"
              % scrub(payload.get("error", {}).get("message", "?")))
        return rows
    for item in payload.get("data", []):
        rows.append({
            "id": item.get("id", ""),
            "caption": item.get("caption"),
            "when": item.get("timestamp"),
        })
    return rows


def main():
    parser = argparse.ArgumentParser(
        description="Read-only caption check across Facebook and Instagram.")
    parser.add_argument("--scheduled", action="store_true",
                        help="only what is queued and not yet live")
    parser.add_argument("--recent", type=int, metavar="N", nargs="?", const=10,
                        help="only what already published (default 10)")
    args = parser.parse_args()

    do_scheduled = args.scheduled or not (args.scheduled or args.recent)
    limit = args.recent or 10
    do_recent = bool(args.recent) or not (args.scheduled or args.recent)

    library = approved()
    token = page_token()
    print("Checking against %d approved captions. Read-only." % len(library))

    problems = 0

    if do_scheduled:
        problems += report(
            facebook_scheduled(token), library,
            "FACEBOOK - queued, not yet published",
            "a problem here is still fixable, which is the point")

    if do_recent:
        problems += report(
            facebook_recent(token, limit), library,
            "FACEBOOK - already published")
        problems += report(
            instagram_recent(token, limit), library,
            "INSTAGRAM - already published",
            "Instagram cannot be checked before it goes live; the API does not "
            "expose queued posts")

    print("")
    print("=" * 88)
    if problems:
        print("%d post(s) need attention." % problems)
        print("BARE means no caption - the failure that happened before.")
        print("DRIFT means the text no longer matches the approved copy.")
        return 1
    print("Every post checked carries its approved caption.")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
