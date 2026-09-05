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


# Each entry is a dict:
#   src    photograph in public/images
#   dur    seconds
#   move   push | pull | pan-l | pan-r
#   focus  where along the photo a pan sits, 0 left to 1 right. A pan no
#          longer crosses the whole frame, so it must be told what matters.
#   rect   optional (x0, y0, x1, y1) as fractions, applied BEFORE any motion.
#          This is how a person reflected in a mirror, or a litter box on a
#          tub deck, gets left out of the frame entirely rather than cropped
#          around and hoped about.
#   note   for the plate-coverage report; must describe what is on screen.
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
        dict(src="zionsville-basement-4.jpg", dur=3.0, move="push",  focus=0.50, note="the slab - counter and backsplash, one stone"),
        dict(src="zionsville-basement-1.jpg", dur=3.2, move="pan-l", focus=0.28, note="the bar under the tall windows"),
        dict(src="zionsville-basement-3.jpg", dur=2.8, move="pan-l", focus=0.45, note="floating oak shelves, integrated LED"),
        dict(src="zionsville-basement-8.jpg", dur=2.8, move="pan-r", focus=0.55, note="the media lounge under the dark feature wall"),
        dict(src="zionsville-basement-6.jpg", dur=3.2, move="push",  focus=0.50, note="the wine room built under the stairs"),
    ],

    # White Oak primary bath, Fishers. The only project on the site carrying a
    # real beforeAfter array - three pairs, each with a label HomeStar wrote.
    #
    # Only two pairs are used, and that is a people decision rather than a
    # taste one:
    #
    #   before-1  a man is reflected in the mirror, and the mirror spans the
    #             whole wall - no horizontal crop removes him. Cropped BELOW
    #             the mirror line instead, which still shows exactly what the
    #             pair is about: dark cabinets and a cultured-marble top.
    #   before-5  crops clean of people, but an automatic litter box sits on
    #             the tub deck and dominates the frame. Left out; Eric can
    #             say if he wants it in.
    #   before-2  clean.
    "white-oak": [
        dict(src="white-oak-primary-bath-fishers-before-1.jpg", dur=2.6, move="pan-r",
             focus=0.50, rect=(0.30, 0.66, 1.00, 1.00),
             note="BEFORE the vanity wall - dark cabinets, cultured-marble top"),
        dict(src="white-oak-primary-bath-fishers-before-2.jpg", dur=2.8, move="push",
             focus=0.50,
             note="BEFORE corner whirlpool in a tiled deck, framed obscure glass"),
        dict(src="white-oak-primary-bath-fishers-1.jpg", dur=3.0, move="pan-l",
             focus=0.45,
             note="AFTER white oak vanity, quartz, champagne bronze"),
        dict(src="white-oak-primary-bath-fishers-2.jpg", dur=3.2, move="push",
             focus=0.50,
             note="AFTER freestanding soaker, clear frameless glass"),
    ],

    # Six floors, six jobs, one reel. Structurally unlike everything else in
    # the queue: every other cut is one project, start to finish. This one is
    # a comparison, and it ends on a question rather than a claim - nothing
    # else built so far invites a reply.
    #
    # No blanket waterproofing claim in the copy. The end card carries
    # "Schluter Pro Certified" as a company credential, which is always true,
    # rather than asserting the complete system on six jobs individually.
    "six-floors": [
        dict(src="fishers-full-gut-walk-in-4.jpg", dur=2.4, move="push", focus=0.50,
             note="hexagon mosaic with the pierced bronze drain - Fishers"),
        dict(src="zionsville-jack-and-jill-2.jpg", dur=2.2, move="push", focus=0.50,
             rect=(0.0, 0.52, 1.0, 1.0),
             note="star-pattern marble mosaic - Zionsville"),
        dict(src="bathroom-green-tile-5.jpg", dur=2.2, move="push", focus=0.50,
             rect=(0.0, 0.45, 1.0, 1.0),
             note="black and white basketweave pan - Carmel"),
        dict(src="marble-master-bathroom-fishers-3.jpg", dur=2.4, move="push", focus=0.50,
             rect=(0.0, 0.30, 1.0, 1.0),
             note="waterjet marble mosaic, pattern centred on the drain - Fishers"),
        dict(src="fishers-double-shower-5.jpg", dur=2.2, move="push", focus=0.50,
             rect=(0.06, 0.52, 1.0, 1.0),
             note="pebble pan - Fishers"),
        dict(src="fishers-wetroom-6.jpg", dur=2.4, move="push", focus=0.50,
             note="mosaic field - Fishers"),
    ],
}


def probe(path):
    with Image.open(path) as im:
        return im.width, im.height


def filter_for(path, dur, move, focus=0.5, rect=None):
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
    pre = ""
    if rect:
        x0, y0, x1, y1 = rect
        cw, ch = int(round((x1 - x0) * w)), int(round((y1 - y0) * h))
        pre = "crop=%d:%d:%d:%d," % (cw, ch, int(round(x0 * w)), int(round(y0 * h)))
        w, h = cw, ch
    frames = max(2, int(round(dur * FPS)))
    src_aspect = w / float(h)

    if move in ("pan-l", "pan-r"):
        # Scale so height fills, leaving width to travel across.
        big_h = H * S
        big_w = int(round(big_h * src_aspect))
        win_w = W * S
        if big_w <= win_w:
            # Not actually wide enough to pan; fall back to a push.
            return filter_for(path, dur, "push", focus, rect)
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
            pre + "scale=%d:%d:flags=lanczos,"
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
        pre + "scale=%d:%d:flags=lanczos,crop=%d:%d,"
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
    for i, c in enumerate(SETS[key], 1):
        name, dur, move = c["src"], c["dur"], c["move"]
        focus, rect, note = c.get("focus", 0.5), c.get("rect"), c["note"]
        src = os.path.join(IMAGES, name)
        if not os.path.exists(src):
            sys.exit("missing photo: %s" % src)
        dst = os.path.join(out_dir, "%02d.mp4" % i)
        chain, in_args = filter_for(src, dur, move, focus, rect)
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
        print("  %2d  %-40s %4.1fs  %-6s%s  %s"
              % (i, name, dur, move, "  cropped" if rect else "", note))

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
