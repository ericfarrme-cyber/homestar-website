"""Publish a multi-photo carousel to the Facebook Page and to Instagram.

`meta_publish.py` only knows how to schedule a Reel. The Westfield wet bar post
is eight photos, and the slot it was meant to fill on 20 Sep passed with nothing
created because there was no tool for it. This is that tool.

The photo order and the caption are read from the same markdown file Eric
reviews, so the post cannot drift from the copy that was approved:

    ## Caption          everything under this heading, up to the next heading
    | # | file | ...    the table above it gives the order

Facebook and Instagram need opposite things:

  Facebook can schedule. Each photo is uploaded unpublished, then one feed post
  attaches all of them at a future time.

  Instagram cannot schedule - the API publishes immediately. So the Instagram
  half is queued in `ig-queue.json` under "carousels" and published by
  `ig_publish.py` on its next run after the time named there, the same way reels
  already work.

    python publish_carousel.py --file CAPTION-WESTFIELD-WET-BAR-CAROUSEL.md \\
        --at "2026-09-27 11:00"
    python publish_carousel.py --file ... --at "2026-09-27 11:00" --confirm

Dry run is the default. Nothing reaches Meta without --confirm.

Every photo URL is checked before anything is uploaded, and the finished post is
read back and its caption compared to the approved text - the same read-back
that meta_publish.py does, for the same reason.
"""

import argparse
import json
import os
import re
import sys

import meta_publish as mp

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
QUEUE = os.path.join(HERE, "ig-queue.json")
PAGE_ID = mp.PAGE_ID
IG_USER_ID = os.environ.get("META_IG_USER_ID", "17841470404585555")

RAW = ("https://raw.githubusercontent.com/ericfarrme-cyber/homestar-website/"
       "main/public/images/%s")


def page_token():
    """Ignore the 13-character leftover in META_PAGE_TOKEN, as ig_publish does."""
    env = (os.environ.get("META_PAGE_TOKEN") or "").strip()
    if env and len(env) < 40:
        print("note: ignoring META_PAGE_TOKEN (%d chars, too short to be a token)" % len(env))
        with open(mp.TOKEN_FILE, encoding="utf-8") as fh:
            mp.TOKEN = fh.read().strip()
    return mp.get_page_token()


def parse_spec(path):
    """Photo filenames in order, and the approved caption."""
    with open(path, encoding="utf-8") as fh:
        text = fh.read()

    photos = []
    for line in text.splitlines():
        # | 1 | `westfield-basement-wet-bar-1.jpg` | why it is here |
        m = re.match(r"\|\s*(\d+)\s*\|\s*`([^`]+)`\s*\|", line)
        if m:
            photos.append((int(m.group(1)), m.group(2).strip()))
    photos = [name for _, name in sorted(photos)]

    m = re.search(r"^##\s+Caption\s*$(.*?)(?=^##\s|\Z)", text, re.M | re.S)
    if not m:
        sys.exit("no '## Caption' section in %s" % path)
    caption = m.group(1).strip()

    if not photos:
        sys.exit("no photo table found in %s" % path)
    return photos, caption


def fb_schedule(token, photos, caption, when, confirm):
    import urllib.request

    print("Facebook: %d photos, %d-character caption, %s"
          % (len(photos), len(caption), when.strftime("%a %d %b %Y, %I:%M %p")))

    urls = [RAW % name for name in photos]
    for url in urls:
        req = urllib.request.Request(url, method="HEAD")
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                if r.status != 200:
                    sys.exit("photo not reachable: %s" % url)
        except Exception as exc:
            sys.exit("photo not reachable: %s (%s)" % (url, exc))
    print("  all %d photo URLs reachable" % len(urls))

    if not confirm:
        print("  DRY RUN. Nothing sent. Add --confirm to schedule it.")
        return None

    media_ids = []
    for i, url in enumerate(urls, 1):
        good, payload = mp.api("POST", "%s/photos" % PAGE_ID,
                               {"url": url, "published": "false"}, token=token)
        if not good:
            sys.exit(mp.scrub("photo %d upload failed: %s" % (i, payload)))
        media_ids.append(payload["id"])
        print("  %d/%d uploaded (%s)" % (i, len(urls), payload["id"]))

    params = {
        "message": caption,
        "published": "false",
        "scheduled_publish_time": str(int(when.timestamp())),
    }
    for i, mid in enumerate(media_ids):
        params["attached_media[%d]" % i] = json.dumps({"media_fbid": mid})

    good, payload = mp.api("POST", "%s/feed" % PAGE_ID, params, token=token)
    if not good:
        sys.exit(mp.scrub("scheduling failed: %s" % payload))
    post_id = payload["id"]
    print("  scheduled as %s" % post_id)

    good, back = mp.api("GET", post_id,
                        {"fields": "id,message,scheduled_publish_time"}, token=token)
    if not good:
        print("  COULD NOT VERIFY: %s" % mp.scrub(back))
        return post_id
    got = (back.get("message") or "").strip()
    if got != caption.strip():
        print("  FAIL: caption came back different (sent %d chars, got %d)"
              % (len(caption.strip()), len(got)))
        return post_id
    print("  VERIFIED: caption present and identical (%d chars)" % len(got))
    return post_id


def ig_queue(photos, caption, when, confirm):
    """Hand the Instagram half to ig_publish.py, which already runs on a timer."""
    entry = {
        "code": "CAROUSEL-WESTFIELD-WETBAR",
        "description": "Westfield wet bar basement, 8 photos",
        "publish_at_local": when.strftime("%Y-%m-%dT%H:%M:00"),
        "timezone": "America/New_York",
        "image_urls": [RAW % name for name in photos],
        "caption": caption,
    }
    if not confirm:
        print("Instagram: DRY RUN. Would queue %s for %s"
              % (entry["code"], entry["publish_at_local"]))
        return

    with open(QUEUE, encoding="utf-8") as fh:
        data = json.load(fh)
    carousels = data.setdefault("carousels", [])
    carousels[:] = [c for c in carousels if c["code"] != entry["code"]]
    carousels.append(entry)
    with open(QUEUE, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print("Instagram: queued %s for %s (ig_publish.py will post it)"
          % (entry["code"], entry["publish_at_local"]))


def main():
    ap = argparse.ArgumentParser(description="Schedule a photo carousel to Facebook and Instagram.")
    ap.add_argument("--file", required=True, help="markdown file with the photo table and caption")
    ap.add_argument("--at", required=True, metavar='"YYYY-MM-DD HH:MM"', help="local Eastern time")
    ap.add_argument("--confirm", action="store_true", help="actually send; without it, dry run")
    args = ap.parse_args()

    path = args.file if os.path.isabs(args.file) else os.path.join(HERE, args.file)
    photos, caption = parse_spec(path)
    when = mp.parse_when(args.at)

    print("Photos  : %s" % ", ".join(photos))
    print("Caption : %d characters, opening line:" % len(caption))
    print("          %s" % caption.split("\n")[0][:70])
    print("When    : %s %s" % (when.strftime("%a %d %b %Y, %I:%M %p"), when.tzname()))
    print("")

    token = page_token()
    fb_schedule(token, photos, caption, when, args.confirm)
    print("")
    ig_queue(photos, caption, when, args.confirm)
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
