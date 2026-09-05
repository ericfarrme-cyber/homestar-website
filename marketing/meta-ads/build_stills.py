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
import re
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

# Maximum pan speed in OUTPUT pixels per frame.
#
# The first version travelled the full surplus width of the photo, which on a
# 2400x1600 source is 3600px at 2x - about 19 output pixels per frame, and it
# strobed. A hand-held or dolly pan in a film sits nearer 2-4. Capping the
# speed and letting the pan cover less ground is the fix; covering the whole
# photograph was never the point.
MAX_PAN_PX_PER_FRAME = 3.2

# Ease in and out rather than starting and stopping abruptly. smoothstep:
# u*u*(3-2*u), which has zero gradient at both ends.
def _smoothstep(u):
    return "(%s)*(%s)*(3-2*(%s))" % (u, u, u)


# (image, seconds, movement, focus, note). `focus` is where along the
# photograph the pan sits, 0 left to 1 right - the pan no longer crosses the
# whole frame, so it has to be told which part of it matters. Notes are for
# the plate-coverage report and must describe what is on screen.
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
        ("zionsville-basement-4.jpg", 3.0, "push",  0.50, "the slab - counter and backsplash, one stone"),
        ("zionsville-basement-1.jpg", 3.2, "pan-l", 0.28, "the bar under the tall windows"),
        ("zionsville-basement-3.jpg", 2.8, "pan-l", 0.45, "floating oak shelves, integrated LED"),
        ("zionsville-basement-8.jpg", 2.8, "pan-r", 0.55, "the media lounge under the dark feature wall"),
        ("zionsville-basement-6.jpg", 3.2, "push",  0.50, "the wine room built under the stairs"),
    ],
}


def probe(path):
    with Image.open(path) as im:
        return im.width, im.height


def filter_for(path, dur, move, focus=0.5):
    """Filter chain and input arguments for one still.

    Returns (chain, input_args). The two movements need DIFFERENT inputs:

      pan   animates `crop` over `t`, so it needs a real stream of frames -
            -loop 1 -t dur at the output framerate.

      push  uses zoompan, whose `d` is output frames PER INPUT FRAME. Given a
            looped 90-frame input and d=90 it emitted 8100 frames - a 270s
            clip where 3s was asked for. The builder then took the first 3s,
            which is one ninetieth of the zoom, so the shot was effectively
            frozen. zoompan gets exactly one input frame.
    """
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
            return filter_for(path, dur, "push", focus)
        available = big_w - win_w

        # Travel only as far as the speed cap allows, centred on `focus`.
        span = min(available, int(round(frames * MAX_PAN_PX_PER_FRAME * S)))
        centre = available * min(1.0, max(0.0, focus))
        x0 = int(round(min(max(centre - span / 2.0, 0), available - span)))

        u = "(t/%.4f)" % dur
        eased = _smoothstep(u)
        expr = ("%d+(%d)*(%s)" % (x0, span, eased)) if move == "pan-r" \
            else ("%d+(%d)*(1-(%s))" % (x0, span, eased))
        chain = (
            "scale=%d:%d:flags=lanczos,"
            "crop=%d:%d:x='min(max(%s,0),%d)':y=0,"
            "scale=%d:%d:flags=lanczos,setsar=1,format=yuv420p"
            % (big_w, big_h, win_w, H * S, expr, available, W, H)
        )
        return chain, ["-framerate", str(FPS), "-loop", "1", "-t", "%.3f" % dur]

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

    # Ease the zoom as well, so a push does not jerk into motion at a cut.
    u = "(on/%d)" % max(1, frames - 1)
    eased = _smoothstep(u)
    if move == "pull":
        z = "%.6f-%.6f*(%s)" % (1.0 + ZOOM, ZOOM, eased)
    else:
        z = "1+%.6f*(%s)" % (ZOOM, eased)

    chain = (
        "scale=%d:%d:flags=lanczos,crop=%d:%d,"
        "zoompan=z='%s':d=%d:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        ":s=%dx%d:fps=%d,setsar=1,format=yuv420p"
        % (big_w, big_h, c_w, c_h, z, frames, W, H, FPS)
    )
    # No -loop and no -t: exactly one input frame, so d= is the whole clip.
    return chain, []


def render(key):
    if key not in SETS:
        sys.exit("no still set called %r. Have: %s" % (key, ", ".join(sorted(SETS))))
    out_dir = os.path.join(OUT_ROOT, key)
    os.makedirs(out_dir, exist_ok=True)

    made = []
    for i, (name, dur, move, focus, note) in enumerate(SETS[key], 1):
        src = os.path.join(IMAGES, name)
        if not os.path.exists(src):
            sys.exit("missing photo: %s" % src)
        dst = os.path.join(out_dir, "%02d.mp4" % i)
        chain, in_args = filter_for(src, dur, move, focus)
        cmd = ([FF, "-y", "-hide_banner", "-loglevel", "error"] + in_args +
               ["-i", src,
                "-filter_complex", "[0:v]" + chain + "[v]",
                "-map", "[v]", "-an", "-r", str(FPS),
                "-c:v", "libx264", "-preset", "slow", "-crf", "16",
                "-pix_fmt", "yuv420p", dst])
        subprocess.run(cmd, check=True)

        # Verify BOTH size and duration. The first version asserted size only,
        # and size was never the thing that broke - two clips rendered 90x too
        # long and the assert passed them, because they were the right shape.
        err = subprocess.run([FF, "-i", dst], capture_output=True, text=True).stderr
        assert "%dx%d" % (W, H) in err, "wrong size: %s" % dst
        m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
        assert m, "no duration: %s" % dst
        got = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
        assert abs(got - dur) < 0.25,             "%s is %.1fs, wanted %.1fs" % (os.path.basename(dst), got, dur)
        made.append(dst)
        print("  %2d  %-34s %4.1fs  %-6s f=%.2f  %s" % (i, name, dur, move, focus, note))

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
