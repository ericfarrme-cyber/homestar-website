#!/usr/bin/env python3
"""Publish queued reels to Instagram at their scheduled time.

Why this exists
---------------
Facebook's API can schedule a reel: post it with `published=false` and a
`scheduled_publish_time` and Meta holds it until the minute you named. The
Instagram Content Publishing API has no equivalent - you create a media container
and publish it, immediately. So an Instagram reel cannot be queued with Meta; the
scheduling has to live on our side. That is this script.

On 2026-09-07 that gap cost us: eight reels were queued on the Page through
2 October and Instagram received none of them, leaving a four-day silence on the
account nobody noticed until a reel visibly failed to appear.

How it decides what to publish
------------------------------
Each run reads `ig-queue.json`, works out which entries are due, and publishes
them. "Due" means the scheduled local time has passed and is less than
GRACE_HOURS old - the upper bound so that a queue file left unattended for a
month cannot suddenly publish a backlog of stale reels all at once.

Duplicate protection reads Instagram itself rather than a state file. Before
publishing, the script pulls recent media and compares the opening of each
caption; if this reel is already up, it skips. A state file would have to be
committed back by the workflow and can drift out of sync with reality - the
account cannot. This makes the script safe to run as often as you like.

Running it
----------
    python ig_publish.py --dry-run     # say what would happen, publish nothing
    python ig_publish.py               # publish anything due
    python ig_publish.py --force F9    # publish one entry regardless of its time

Needs META_PAGE_TOKEN in the environment, or a `.token` file beside this script.
The token is a never-expiring system-user token carrying
`instagram_content_publish`; see META-API.md.
"""
import argparse
import datetime as dt
import json
import os
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
QUEUE = os.path.join(HERE, "ig-queue.json")
IG_USER_ID = os.environ.get("META_IG_USER_ID", "17841470404585555")

GRACE_HOURS = 8          # publish something up to this late, never later
POLL_SECONDS = 10        # between container status checks
POLL_ATTEMPTS = 42       # ~7 minutes; a 10 MB reel has taken well under 1
MATCH_CHARS = 60         # caption prefix used to recognise an already-posted reel


# ── time ────────────────────────────────────────────────────────────────────
# Implemented directly rather than through zoneinfo, which needs the `tzdata`
# package on Windows and would make the mini PC's setup one step more fragile.
# US Eastern has run on this rule since 2007: DST from the second Sunday in
# March to the first Sunday in November.
def _nth_sunday(year, month, nth):
    d = dt.date(year, month, 1)
    d += dt.timedelta(days=(6 - d.weekday()) % 7)     # first Sunday
    return d + dt.timedelta(weeks=nth - 1)


def eastern_is_dst(naive_local):
    start = dt.datetime.combine(_nth_sunday(naive_local.year, 3, 2), dt.time(2))
    end = dt.datetime.combine(_nth_sunday(naive_local.year, 11, 1), dt.time(2))
    return start <= naive_local < end


def eastern_to_utc(naive_local):
    return naive_local + dt.timedelta(hours=4 if eastern_is_dst(naive_local) else 5)


# ── graph ───────────────────────────────────────────────────────────────────
# A real Meta system-user token is around 200 characters. Anything much shorter is
# a placeholder or a bad paste, not a credential.
MIN_PLAUSIBLE_TOKEN = 50


def load_token():
    path = os.path.join(HERE, ".token")
    env = (os.environ.get("META_PAGE_TOKEN") or "").strip()
    from_file = ""
    if os.path.exists(path):
        with open(path) as fh:
            from_file = fh.read().strip()

    # The environment wins, because that is how the GitHub workflow supplies it - but
    # only if it looks like a token at all. On 2026-09-11 META_PAGE_TOKEN was set to a
    # 13-character placeholder on Eric's machine, which shadowed a perfectly good
    # .token and failed with Meta's useless "Cannot parse access token". Falling back
    # with a loud warning beats failing: on an unattended box a stray environment
    # variable should not silently cost a reel.
    if env and len(env) < MIN_PLAUSIBLE_TOKEN:
        print("WARNING: META_PAGE_TOKEN is set but only %d characters - too short to be a"
              % len(env))
        print("         Meta token. Ignoring it. Unset it to silence this warning.")
        if from_file:
            print("         Using %s instead." % path)
            return from_file
        sys.exit("No usable token: the environment variable is malformed and %s is missing." % path)

    if env:
        return env
    if from_file:
        return from_file
    sys.exit("No token. Set META_PAGE_TOKEN or write %s" % path)


TOKEN = load_token()


def scrub(text):
    return str(text).replace(TOKEN, "<TOKEN REDACTED>")


def call(path, params=None, post=False):
    url = "https://graph.facebook.com/v25.0/" + path
    body = None
    if post:
        body = urllib.parse.urlencode(params or {}).encode()
    elif params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, data=body)
    req.add_header("Authorization", "Bearer " + TOKEN)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except Exception as exc:
        detail = exc.read().decode("utf8", "replace") if hasattr(exc, "read") else ""
        raise SystemExit("Graph call failed: %s\n%s" % (scrub(exc), scrub(detail)[:800]))


def already_posted(caption):
    """Is this reel already on the account? Read Instagram rather than trust a file."""
    media = call(IG_USER_ID + "/media", {"fields": "caption", "limit": "40"})
    key = caption[:MATCH_CHARS].strip()
    for item in media.get("data", []):
        if (item.get("caption") or "").strip().startswith(key):
            return True
    return False


def reachable(url):
    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status == 200, r.headers.get("Content-Length")
    except Exception as exc:
        return False, str(exc)


def publish(entry):
    caption = entry["caption"]
    ok, info = reachable(entry["video_url"])
    if not ok:
        print("    video URL not reachable (%s) - skipping" % info)
        return False
    print("    video ok, %s bytes" % info)

    container = call(IG_USER_ID + "/media", {
        "media_type": "REELS",
        "video_url": entry["video_url"],
        "caption": caption,
        "share_to_feed": "true",
    }, post=True)
    cid = container.get("id")
    print("    container %s" % cid)

    for attempt in range(POLL_ATTEMPTS):
        time.sleep(POLL_SECONDS)
        status = call(cid, {"fields": "status_code,status"}).get("status_code")
        if status == "FINISHED":
            break
        if status in ("ERROR", "EXPIRED"):
            print("    container %s - not publishing" % status)
            return False
        if attempt % 6 == 5:
            print("    still %s" % status)
    else:
        print("    container never finished - not publishing")
        return False

    published = call(IG_USER_ID + "/media_publish", {"creation_id": cid}, post=True)
    info = call(published["id"], {"fields": "permalink,timestamp"})
    print("    PUBLISHED %s" % info.get("permalink"))
    return True


# ── main ────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="report only, publish nothing")
    ap.add_argument("--force", metavar="CODE", help="publish this entry regardless of its time")
    args = ap.parse_args()

    with open(QUEUE, encoding="utf-8") as fh:
        reels = json.load(fh)["reels"]

    now = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)
    print("now %sZ - %d reels in the queue" % (now.strftime("%Y-%m-%d %H:%M"), len(reels)))

    published = 0
    for entry in reels:
        local = dt.datetime.fromisoformat(entry["publish_at_local"])
        due_utc = eastern_to_utc(local)
        age = (now - due_utc).total_seconds() / 3600.0
        forced = args.force and args.force.upper() == entry["code"]

        if not forced:
            if age < 0:
                print("  %-3s %s  not yet (in %.1f h)" % (entry["code"], entry["publish_at_local"][:10], -age))
                continue
            if age > GRACE_HOURS:
                print("  %-3s %s  missed by %.1f h - left alone" % (entry["code"], entry["publish_at_local"][:10], age))
                continue

        print("  %-3s %s  DUE%s" % (entry["code"], entry["publish_at_local"][:10],
                                    " (forced)" if forced else ""))
        if already_posted(entry["caption"]):
            print("    already on Instagram - skipping")
            continue
        if args.dry_run:
            print("    dry run - would publish %d-char caption" % len(entry["caption"]))
            continue
        if publish(entry):
            published += 1

    print("published %d reel(s)" % published)


if __name__ == "__main__":
    main()
