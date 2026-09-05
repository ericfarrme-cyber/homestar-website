"""Schedule a built Reel to the HomeStar Facebook Page, and prove it landed.

The whole reason this exists rather than clicking through Business Suite: after
creating the post it fetches the post back and asserts the caption is present
and identical. Two reels once published with no caption at all, because the
composer silently dropped it and "Scheduled -> Published" was taken as proof
that the caption survived. It was not proof. Read-back is.

Captions are read from the same markdown files Eric reviews, not from a
separate copy, so a caption cannot be edited in review and then published from
a stale duplicate.

    python meta_publish.py --list
    python meta_publish.py --show FB
    python meta_publish.py --schedule FB --at "2026-09-08 09:00"
    python meta_publish.py --schedule FB --at "2026-09-08 09:00" --confirm

Dry run is the default. Nothing reaches Meta without --confirm.
"""

import argparse
import glob
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
RENDERS = os.path.join(HERE, "renders")
TOKEN_FILE = os.path.join(HERE, ".token")

GRAPH = "https://graph.facebook.com"
VERSION = "v25.0"
PAGE_ID = os.environ.get("META_PAGE_ID", "482409631622420")

# Eric is in Indiana. Indianapolis observes DST but has its own zone, so naming
# it explicitly is what stops a post landing an hour wrong twice a year.
#
# Windows ships no tz database, so ZoneInfo imports fine and then fails on
# lookup unless the tzdata package is installed. Fall back to the machine's own
# zone, which on Eric's box and the mini PC is the right one anyway. Either way
# the resolved zone and offset get printed before anything is scheduled, so a
# wrong zone is visible rather than silent.
def _resolve_tz():
    try:
        return ZoneInfo("America/Indiana/Indianapolis"), "America/Indiana/Indianapolis"
    except Exception:
        return None, "system local time (tzdata not installed)"


LOCAL_TZ, TZ_SOURCE = _resolve_tz()


def localise(naive):
    """Attach the local zone to a naive datetime."""
    if LOCAL_TZ is not None:
        return naive.replace(tzinfo=LOCAL_TZ)
    return naive.astimezone()


def now_local():
    if LOCAL_TZ is not None:
        return datetime.now(LOCAL_TZ)
    return datetime.now().astimezone()

# Meta rejects anything under 10 minutes out. 20 leaves room for the upload.
MIN_LEAD = timedelta(minutes=20)
MAX_LEAD = timedelta(days=75)

CAPTION_FILES = ["CAPTIONS-F7-FI.md"]
SINGLE_CAPTION_FILES = {
    "F4": "F4-REEL-CAPTION.md",
    "F5": "F5-CARMEL-CAPTION.md",
    "F6": "F6-NAVY-BEFOREAFTER-CAPTION.md",
}


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
    """Neither the user token nor any Page token reaches stdout."""
    text = str(text)
    if TOKEN and TOKEN in text:
        text = text.replace(TOKEN, "<TOKEN REDACTED>")
    for leaked in re.findall(r"EAA[A-Za-z0-9_-]{20,}", text):
        text = text.replace(leaked, "<TOKEN REDACTED>")
    return text


# ---------------------------------------------------------------- captions


def _clean(lines):
    text = "\n".join(lines).strip()
    # Collapse the blank-line runs a markdown blockquote leaves behind, but keep
    # single blank lines - those are the paragraph breaks Meta renders.
    return re.sub(r"\n{3,}", "\n\n", text)


def load_captions():
    """Pull every caption out of the markdown, keyed by reel code."""
    captions = {}

    for name in CAPTION_FILES:
        path = os.path.join(HERE, name)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as handle:
            lines = handle.read().split("\n")
        code = None
        buf = []
        for line in lines:
            heading = re.match(r"^##\s+([A-Z0-9]{2})\s+[-—]", line)
            if heading:
                if code and buf:
                    captions[code] = _clean(buf)
                code, buf = heading.group(1), []
                continue
            if code is None:
                continue
            if line.startswith(">"):
                rest = line[1:]
                buf.append(rest[1:] if rest[:1] == " " else rest)
            elif line.strip() == "":
                if buf:
                    buf.append("")
            elif buf:
                # Ordinary prose resumed, so the blockquote is over.
                captions[code] = _clean(buf)
                code, buf = None, []
        if code and buf:
            captions[code] = _clean(buf)

    for code, name in SINGLE_CAPTION_FILES.items():
        path = os.path.join(HERE, name)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as handle:
            lines = handle.read().split("\n")
        collecting = False
        buf = []
        for line in lines:
            if re.match(r"^##\s+Caption\b", line):
                collecting = True
                continue
            if collecting:
                if line.startswith("## ") or line.strip() == "---":
                    break
                buf.append(line)
        if buf:
            captions[code] = _clean(buf)

    return captions


def find_render(code):
    pattern = os.path.join(RENDERS, "%s-*--reels-upload.mp4" % code)
    matches = sorted(glob.glob(pattern))
    return matches[0] if matches else None


def inventory():
    codes = set()
    for path in glob.glob(os.path.join(RENDERS, "*--reels-upload.mp4")):
        codes.add(os.path.basename(path).split("-", 1)[0])
    captions = load_captions()
    rows = []
    for code in sorted(codes):
        render = find_render(code)
        rows.append({
            "code": code,
            "render": render,
            "mb": os.path.getsize(render) / 1048576.0 if render else 0.0,
            "caption": captions.get(code),
        })
    return rows


# ------------------------------------------------------------------- graph


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
        with urllib.request.urlopen(req, timeout=120) as resp:
            return True, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        try:
            return False, json.loads(exc.read().decode("utf-8"))
        except Exception:
            return False, {"error": {"message": "HTTP %s" % exc.code}}
    except Exception as exc:
        return False, {"error": {"message": str(exc)}}


def get_page_token():
    good, payload = api("GET", PAGE_ID, {"fields": "access_token"})
    if not good or not payload.get("access_token"):
        sys.exit(scrub("Could not get a Page access token: %s" % payload))
    return payload["access_token"]


def parse_when(text):
    try:
        naive = datetime.strptime(text, "%Y-%m-%d %H:%M")
    except ValueError:
        sys.exit('--at must look like "2026-09-08 09:00"')
    when = localise(naive)
    now = now_local()
    if when - now < MIN_LEAD:
        sys.exit("That time is under 20 minutes away. Meta will reject it.")
    if when - now > MAX_LEAD:
        sys.exit("That time is over 75 days out. Meta will reject it.")
    return when


# ---------------------------------------------------------------- commands


def cmd_list():
    rows = inventory()
    print("%-6s %-9s %-9s %s" % ("CODE", "RENDER", "CAPTION", "FILE"))
    print("-" * 78)
    ready = 0
    for row in rows:
        size = "%.1f MB" % row["mb"] if row["render"] else "MISSING"
        if row["caption"]:
            cap = "%d ch" % len(row["caption"])
            if row["render"]:
                ready += 1
        else:
            cap = "NONE"
        name = os.path.basename(row["render"]) if row["render"] else "-"
        print("%-6s %-9s %-9s %s" % (row["code"], size, cap, name))
    print("-" * 78)
    print("%d of %d ready to schedule." % (ready, len(rows)))
    missing = [r["code"] for r in rows if not r["caption"]]
    if missing:
        print("No caption yet: %s" % ", ".join(missing))
    return 0


def cmd_show(code):
    render = find_render(code)
    caption = load_captions().get(code)
    print("Code    : %s" % code)
    print("Render  : %s" % (render or "MISSING"))
    if render:
        print("Size    : %.1f MB" % (os.path.getsize(render) / 1048576.0))
    print("Page    : %s" % PAGE_ID)
    print("")
    if not caption:
        print("CAPTION : NONE - this cut cannot be scheduled yet.")
        return 1
    print("Caption : %d characters" % len(caption))
    print("-" * 78)
    print(caption)
    print("-" * 78)
    return 0


def cmd_schedule(code, when_text, confirm):
    render = find_render(code)
    caption = load_captions().get(code)
    when = parse_when(when_text)

    if not render:
        sys.exit("No upload render for %s." % code)
    if not caption:
        sys.exit("No caption for %s. Refusing to post a bare reel." % code)

    size = os.path.getsize(render)
    print("Reel    : %s" % code)
    print("File    : %s (%.1f MB)" % (os.path.basename(render), size / 1048576.0))
    print("Caption : %d characters, opening line:" % len(caption))
    print("          %s" % caption.split("\n")[0][:70])
    print("When    : %s %s" % (when.strftime("%a %d %b %Y, %I:%M %p"), when.tzname()))
    print("Zone    : %s (UTC%s)" % (TZ_SOURCE, when.strftime("%z")))
    print("Epoch   : %d" % int(when.timestamp()))
    print("")

    if not confirm:
        print("DRY RUN. Nothing was sent. Add --confirm to actually schedule.")
        return 0

    token = get_page_token()

    print("1/4 opening upload session")
    good, payload = api("POST", "%s/video_reels" % PAGE_ID,
                        {"upload_phase": "start"}, token=token)
    if not good:
        sys.exit(scrub("start failed: %s" % payload))
    video_id = payload.get("video_id")
    upload_url = payload.get("upload_url")
    if not video_id or not upload_url:
        sys.exit(scrub("start returned no upload session: %s" % payload))
    print("    video_id %s" % video_id)

    print("2/4 uploading %.1f MB" % (size / 1048576.0))
    with open(render, "rb") as handle:
        blob = handle.read()
    req = urllib.request.Request(upload_url, data=blob, method="POST")
    req.add_header("Authorization", "OAuth " + token)
    req.add_header("offset", "0")
    req.add_header("file_size", str(size))
    req.add_header("Content-Type", "application/octet-stream")
    try:
        with urllib.request.urlopen(req, timeout=900) as resp:
            up = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        sys.exit(scrub("upload failed: %s" % exc))
    if not up.get("success"):
        sys.exit(scrub("upload did not report success: %s" % up))
    print("    uploaded")

    print("3/4 scheduling with the caption attached")
    good, payload = api("POST", "%s/video_reels" % PAGE_ID, {
        "video_id": video_id,
        "upload_phase": "finish",
        "video_state": "SCHEDULED",
        "scheduled_publish_time": str(int(when.timestamp())),
        "description": caption,
    }, token=token)
    if not good:
        sys.exit(scrub("finish failed: %s" % payload))
    print("    accepted")

    # The entire reason this script exists.
    print("4/4 reading the post back to verify the caption")
    good, back = api("GET", video_id,
                     {"fields": "id,description,scheduled_publish_time"},
                     token=token)
    if not good:
        print("    COULD NOT VERIFY: %s" % scrub(back))
        print("    Check it by hand in the Planner before trusting it.")
        return 1

    got = (back.get("description") or "").strip()
    if not got:
        print("    FAIL: the post came back with NO caption.")
        print("    This is exactly the failure that happened before. Delete it.")
        return 1
    if got != caption.strip():
        print("    FAIL: caption came back different from what was sent.")
        print("    sent %d chars, got %d chars" % (len(caption.strip()), len(got)))
        return 1

    print("    VERIFIED: caption present and identical (%d chars)" % len(got))
    print("")
    print("Scheduled. It sits in the Planner for Eric to glance at before it goes.")
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Schedule a built Reel to the HomeStar Page, with read-back.")
    parser.add_argument("--list", action="store_true",
                        help="show every cut and whether it is ready")
    parser.add_argument("--show", metavar="CODE",
                        help="print exactly what would be sent")
    parser.add_argument("--schedule", metavar="CODE")
    parser.add_argument("--at", metavar="WHEN",
                        help='local time, "2026-09-08 09:00"')
    parser.add_argument("--confirm", action="store_true",
                        help="actually send it; without this it is a dry run")
    args = parser.parse_args()

    if args.list:
        return cmd_list()
    if args.show:
        return cmd_show(args.show.upper())
    if args.schedule:
        if not args.at:
            sys.exit("--schedule needs --at")
        return cmd_schedule(args.schedule.upper(), args.at, args.confirm)
    parser.print_help()
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
