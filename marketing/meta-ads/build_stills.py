"""Turn project photographs into motion clips, so stills-only jobs can be Reels.

Several of the strongest projects have photographs and no video at all - the
Zionsville basement bar and wine room, the Zionsville main level, the marble
master bath, the Carmel basement bath, both children's bathrooms, both
laundries. Until now those could only ever be story cards.

This renders each still as a short 1080x1920 clip with slow, deliberate
movement, and writes them to `_stills/<key>/`. They are then fed to
`build_progress.py` as ordinary segments, which means the plates, crossfades,
loudness pass, rotation assert and plate-coverage report are all the same
tested code paths the shot Reels already use. Nothing about the output format
is new; only where the pixels come from.

    python build_stills.py zionsville-basement

Two kinds of movement, chosen by what the photograph is:

  push / pull   for a portrait or near-square frame. A slow zoom about the
                centre. Keeps the whole composition, adds life.

  pan-l / pan-r for a landscape frame. A 9:16 crop of a landscape photo keeps
                barely a third of its width, so instead of throwing two thirds
                away the window travels across it. The constraint becomes the
                movement.

Everything is rendered at 2x and scaled down, because a zoom on a
1:1-sampled still shows its pixels immediately.
"""

import argparse
import os
import subprocess
import sys

import imageio_ffmpeg
from PIL import Image

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
IMAGES = os.path.join(REPO, "public", "images")
OUT_ROOT = os.path.join(HERE, "_stills")

W, H, FPS = 1080, 1920, 30
S = 2                     # render at 2x, then scale down
ZOOM = 0.11               # total zoom travel on a push or pull
TARGET = W / float(H)


# (image, seconds, movement, note). Notes are for the plate-coverage report,
# so they must describe what is actually on screen.
SETS = {
    # Zionsville basement bar and wine room. Photographs only - there is no
    # video of this job anywhere in the library.
    #
    # Copy is from the project page's story block: "a polished black natural
    # stone countertop carried up the wall as a full-height slab backsplash
    # rather than tile - a detail that leaves nowhere to hide, since the
    # veining has to run continuously through the sink cutout and the seams
    # have to disappear."
    "zionsville-basement": [
        # Order matters: the hook is the slab claim, so the slab has to open.
        # First pass led on the wide bar panning right, which travelled off
        # the bar onto windows and dining chairs while the hook was still up.
        # A pan can walk away from its own subject - my movement, my mistake.
        ("zionsville-basement-4.jpg", 3.0, "push", "the slab - counter and backsplash, one stone"),
        ("zionsville-basement-1.jpg", 3.2, "pan-l", "the bar under the tall windows"),
        ("zionsville-basement-3.jpg", 2.8, "pan-l", "floating oak shelves, integrated LED"),
        ("zionsville-basement-8.jpg", 2.8, "pan-r", "the media lounge under the dark feature wall"),
        ("zionsville-basement-6.jpg", 3.2, "push", "the wine room built under the stairs"),
    ],
}


def probe(path):
    with Image.open(path) as im:
        return im.width, im.height


def filter_for(path, dur, move):
    """ffmpeg filter chain for one still. Returns the chain string."""
    w, h = probe(path)
    frames = max(2, int(round(dur * FPS)))
    src_aspect = w / float(h)

    if move in ("pan-l", "pan-r"):
        # Scale so height fills, leaving width to travel across.
        big_h = H * S
        big_w = int(round(big_h * src_aspect))
        win_w = W * S
        if big_w <= win_w:
            # Not actually wide enough to pan; fall back to a push.
            return filter_for(path, dur, "push")
        travel = big_w - win_w
        # x moves linearly across the surplus width over the clip's duration.
        expr = ("(%d)*t/%.4f" % (travel, dur)) if move == "pan-r" \
            else ("(%d)-(%d)*t/%.4f" % (travel, travel, dur))
        return (
            "scale=%d:%d:flags=lanczos,"
            "crop=%d:%d:x='min(max(%s,0),%d)':y=0,"
            "scale=%d:%d:flags=lanczos,setsar=1,fps=%d,format=yuv420p"
            % (big_w, big_h, win_w, H * S, expr, travel, W, H, FPS)
        )

    # push / pull - crop to 9:16 first so the zoom window keeps its aspect,
    # then move the zoom. zoompan always crops a region matching the INPUT
    # aspect, so cropping first is what stops it distorting.
    if src_aspect > TARGET:
        c_h = H * S
        c_w = int(round(c_h * TARGET))
        big_h = c_h
        big_w = int(round(big_h * src_aspect))
    else:
        c_w = W * S
        c_h = int(round(c_w / TARGET))
        big_w = c_w
        big_h = int(round(big_w / src_aspect))

    rate = ZOOM / float(frames)
    if move == "pull":
        z = "max(%.6f-%.8f*on,1.0)" % (1.0 + ZOOM, rate)
    else:
        z = "min(1.0+%.8f*on,%.6f)" % (rate, 1.0 + ZOOM)

    return (
        "scale=%d:%d:flags=lanczos,crop=%d:%d,"
        "zoompan=z='%s':d=%d:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        ":s=%dx%d:fps=%d,setsar=1,format=yuv420p"
        % (big_w, big_h, c_w, c_h, z, frames, W, H, FPS)
    )


def render(key):
    if key not in SETS:
        sys.exit("no still set called %r. Have: %s" % (key, ", ".join(sorted(SETS))))
    out_dir = os.path.join(OUT_ROOT, key)
    os.makedirs(out_dir, exist_ok=True)

    made = []
    for i, (name, dur, move, note) in enumerate(SETS[key], 1):
        src = os.path.join(IMAGES, name)
        if not os.path.exists(src):
            sys.exit("missing photo: %s" % src)
        dst = os.path.join(out_dir, "%02d.mp4" % i)
        chain = filter_for(src, dur, move)
        cmd = [FF, "-y", "-hide_banner", "-loglevel", "error",
               "-loop", "1", "-t", "%.2f" % dur, "-i", src,
               "-filter_complex", "[0:v]" + chain + "[v]",
               "-map", "[v]", "-an",
               "-c:v", "libx264", "-preset", "slow", "-crf", "16",
               "-pix_fmt", "yuv420p", dst]
        subprocess.run(cmd, check=True)

        # Verify rather than assume - a still that silently rendered at the
        # wrong size would only show up as a squashed Reel.
        err = subprocess.run([FF, "-i", dst], capture_output=True, text=True).stderr
        assert "%dx%d" % (W, H) in err, "wrong size: %s" % dst
        made.append(dst)
        print("  %2d  %-34s %4.1fs  %-6s  %s" % (i, name, dur, move, note))

    print("")
    print("%d clips in %s" % (len(made), out_dir))
    print("Add these to build_progress.py PROJECTS as segments starting at 0.0")
    return made


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("key", nargs="?")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()
    if args.list or not args.key:
        for k, v in sorted(SETS.items()):
            print("%-28s %d stills" % (k, len(v)))
        return 0
    render(args.key)
    return 0


if __name__ == "__main__":
    sys.exit(main())
