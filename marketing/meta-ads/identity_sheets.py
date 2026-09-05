"""Build identity sheets for every source clip in the library.

Written after Eric's fair complaint that cuts were being made without a full
grasp of the footage. Four separate errors trace to exactly that: a mantle
claimed over a crop it was not in, a reel built for the wrong Westfield
basement, a star mosaic floor overlooked for a plain penny round, and two
bathrooms that may have been treated as one job.

Filenames are a claim about a clip. Frames are the evidence. This packs every
clip into labelled rows of three frames - a quarter, half and three quarters
through - so the whole library can be identified by eye in a handful of
sheets rather than one clip at a time.

    python identity_sheets.py            every clip, 8 per sheet
    python identity_sheets.py --per 6    fewer per sheet, larger frames
"""

import argparse
import glob
import os
import re
import subprocess
import sys

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT_DIR = os.path.join(HERE, "_sheets")
FONT = os.path.join(HERE, "fonts", "PlusJakartaSans-Bold.ttf")

SOURCES = [
    ("progress", os.path.join(REPO, "Pending", "new in progress")),
    ("archive", os.path.join(REPO, "Pending", "Archive")),
]

TH = 300          # thumbnail width
FRACTIONS = (0.25, 0.5, 0.75)


def duration(path):
    err = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    if not m:
        return None
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))


def dims(path):
    err = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    m = re.search(r"(\d{3,5})x(\d{3,5})", err)
    return (int(m.group(1)), int(m.group(2))) if m else (0, 0)


def frame(path, t):
    tmp = os.path.join(OUT_DIR, "_id_tmp.png")
    subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error",
                    "-ss", "%.2f" % t, "-i", path, "-frames:v", "1", tmp],
                   check=False)
    if not os.path.exists(tmp):
        return None
    im = Image.open(tmp).convert("RGB")
    im.load()
    os.remove(tmp)
    return im


def collect():
    clips = []
    for label, folder in SOURCES:
        if not os.path.isdir(folder):
            continue
        for path in sorted(glob.glob(os.path.join(folder, "*.mp4"))):
            clips.append((label, path))
    return clips


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--per", type=int, default=8)
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    clips = collect()
    print("%d clips" % len(clips))

    rows = []
    for label, path in clips:
        dur = duration(path)
        if not dur:
            print("  UNREADABLE %s" % os.path.basename(path))
            continue
        w, h = dims(path)
        ims = [frame(path, dur * f) for f in FRACTIONS]
        ims = [i for i in ims if i is not None]
        if not ims:
            print("  NO FRAMES %s" % os.path.basename(path))
            continue
        rows.append((label, os.path.basename(path), dur, (w, h), ims))
        print("  %-9s %-38s %5.1fs %dx%d" % (label, os.path.basename(path)[:38], dur, w, h))

    per = args.per
    fnt = ImageFont.truetype(FONT, 17)
    for start in range(0, len(rows), per):
        chunk = rows[start:start + per]
        rh = int(TH * 16 / 9) + 34
        canvas = Image.new("RGB", (3 * (TH + 8) + 8, len(chunk) * rh), (18, 18, 22))
        d = ImageDraw.Draw(canvas)
        for r, (label, name, dur, wh, ims) in enumerate(chunk):
            y = r * rh
            for c, im in enumerate(ims[:3]):
                im = im.copy()
                im.thumbnail((TH, int(TH * 16 / 9)))
                canvas.paste(im, (c * (TH + 8) + 8, y + 26))
            d.text((8, y + 5), "%s  |  %s  |  %.1fs  %dx%d"
                   % (label, name, dur, wh[0], wh[1]), font=fnt, fill=(245, 245, 250))
        out = os.path.join(OUT_DIR, "identity-%02d.jpg" % (start // per + 1))
        canvas.save(out, quality=88)
        print("wrote %s (%d clips)" % (out, len(chunk)))


if __name__ == "__main__":
    sys.exit(main())
