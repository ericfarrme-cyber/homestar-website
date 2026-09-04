"""First contact with the Graph API.

Answers three questions and changes nothing:

  1. Does the token work at all, and what is it?
  2. Can it see the HomeStar Page, and can it get a Page access token?
  3. Does the Page hand us the Instagram account?

Question 3 is the one that matters. Instagram publishing normally routes through
the Page rather than a separate Instagram asset grant, so if this returns an ID
then the "Login needed" flag on @thehomestarservice is irrelevant to us.

Read-only. No POSTs, nothing published, nothing scheduled.

Usage:
    python meta_check.py

The token is read from META_PAGE_TOKEN and never printed. It is sent as an
Authorization header, never as a query parameter, so it cannot leak into a URL
that shows up in an error message or a log. Everything printed is scrubbed
against the token as a last line of defence.
"""

import json
import os
import sys
import urllib.error
import urllib.request

# Newest first. Meta retires versions after about two years, so the one that
# was current when this was written will not stay current. Probing beats
# hardcoding and then wondering why everything 400s in a year.
CANDIDATE_VERSIONS = ["v25.0", "v24.0", "v23.0", "v22.0", "v21.0", "v20.0"]

# Two ways to supply the token, both of which keep it out of the repo, out of
# the conversation, and out of every log line this script writes.
#
#   1. the META_PAGE_TOKEN environment variable
#   2. a file called .token sitting next to this script (gitignored)
#
# The file exists because setx only affects terminals opened afterwards, which
# is a confusing failure to debug. The file works immediately.
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".token")


def _load_token():
    from_env = os.environ.get("META_PAGE_TOKEN")
    if from_env:
        return from_env.strip(), "META_PAGE_TOKEN"
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as handle:
            value = handle.read().strip()
        if value:
            return value, ".token file"
    return None, None


TOKEN, TOKEN_SOURCE = _load_token()
PAGE_ID = os.environ.get("META_PAGE_ID", "482409631622420")
IG_USER_ID = os.environ.get("META_IG_USER_ID", "17841470404585555")


def scrub(text):
    """Never let the token reach stdout, whatever happens."""
    if TOKEN and TOKEN in text:
        text = text.replace(TOKEN, "<TOKEN REDACTED>")
    return text


def get(version, path, fields=None):
    """GET a Graph endpoint. Returns (ok, payload)."""
    url = "https://graph.facebook.com/%s/%s" % (version, path.lstrip("/"))
    if fields:
        url += "?fields=" + ",".join(fields)
    req = urllib.request.Request(url)
    req.add_header("Authorization", "Bearer " + TOKEN)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return True, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        try:
            return False, json.loads(exc.read().decode("utf-8"))
        except Exception:
            return False, {"error": {"message": "HTTP %s" % exc.code}}
    except Exception as exc:
        return False, {"error": {"message": str(exc)}}


def fail(message):
    print("  FAIL  " + scrub(message))


def ok(message):
    print("  ok    " + scrub(message))


def main():
    if not TOKEN:
        print("No token found. Supply it either way:")
        print("")
        print("  setx META_PAGE_TOKEN \"...\"      (then open a NEW terminal)")
        print("  or paste it into %s" % TOKEN_FILE)
        print("")
        print("The .token file is gitignored and takes effect immediately.")
        return 2

    print("Token loaded from %s (%d chars)." % (TOKEN_SOURCE, len(TOKEN)))
    print("Never printed; sent as an Authorization header, not a URL parameter.")
    print("")

    # 1. Which API version answers?
    print("1. API version")
    version = None
    for candidate in CANDIDATE_VERSIONS:
        good, payload = get(candidate, "me", ["id", "name"])
        if good:
            version = candidate
            ok("%s responds. Identity: %s (id %s)"
               % (candidate, payload.get("name", "?"), payload.get("id", "?")))
            break
    if not version:
        fail("no Graph version accepted this token. Last error: %s"
             % payload.get("error", {}).get("message", "?"))
        return 1
    print("")

    # 2. Scopes actually granted, as opposed to scopes we ticked in a wizard.
    print("2. Granted scopes")
    good, payload = get(version, "me/permissions")
    if good:
        granted = sorted(p["permission"] for p in payload.get("data", [])
                         if p.get("status") == "granted")
        wanted = ["instagram_basic", "instagram_content_publish",
                  "pages_manage_posts", "pages_read_engagement", "pages_show_list"]
        for scope in wanted:
            if scope in granted:
                ok(scope)
            else:
                fail("%s MISSING" % scope)
        extra = [g for g in granted if g not in wanted]
        if extra:
            print("  note  also granted: %s" % ", ".join(extra))
    else:
        print("  note  /me/permissions not available for this token type: %s"
              % scrub(payload.get("error", {}).get("message", "?")))
        print("        not fatal - the calls below are the real test.")
    print("")

    # 3. The Page.
    print("3. The Facebook Page")
    good, payload = get(version, PAGE_ID, ["name", "access_token", "instagram_business_account"])
    if not good:
        fail("cannot read the Page: %s"
             % payload.get("error", {}).get("message", "?"))
        return 1
    ok("Page readable: %s" % payload.get("name", "?"))
    if payload.get("access_token"):
        ok("Page access token obtainable (%d chars) - this is what publishing uses"
           % len(payload["access_token"]))
    else:
        fail("no Page access token returned - publishing will not work")
    print("")

    # 4. The question this script exists to answer.
    print("4. Instagram, reached through the Page")
    iga = payload.get("instagram_business_account")
    if iga and iga.get("id"):
        ok("Page returns Instagram account id %s" % iga["id"])
        if iga["id"] == IG_USER_ID:
            ok("matches the recorded IG user ID")
        else:
            fail("does NOT match recorded %s - check which account this is"
                 % IG_USER_ID)
        good, ig = get(version, iga["id"], ["username", "name"])
        if good:
            ok("Instagram account readable: @%s" % ig.get("username", "?"))
            print("")
            print("  => The 'Login needed' flag does not block us.")
            print("     Instagram publishing routes through the Page.")
        else:
            fail("IG id returned but not readable: %s"
                 % ig.get("error", {}).get("message", "?"))
            print("")
            print("  => Partial. The link exists but the token cannot read it;")
            print("     the Instagram asset assignment probably is needed.")
    else:
        fail("Page returns no instagram_business_account")
        print("")
        print("  => The Instagram asset assignment IS needed after all.")
        print("     Back to the 'Login needed' flow in Business settings.")

    print("")
    print("Nothing was posted, scheduled or changed.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(scrub("Unexpected error: %s" % exc))
        sys.exit(1)
