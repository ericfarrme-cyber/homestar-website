#!/usr/bin/env python3
"""
Zionsville basement walkthrough — a commercial cut from stills.

Nothing here is generated. Every frame is a real photograph; the only motion is
a camera move across it, so this obeys the same rule as the rest of the account
(see CAMPAIGN.md): we crop and composite real photography, we never redraw it.

Why pans and not push-ins: the sources are 3:2 landscape (2400x1600). Hard
cropping those to 9:16 destroys the room - the same reason build_ads.py gives
Reels its own card layout. Instead each still is scaled to fill the frame
*height* and the camera pans across it. That keeps ceiling-to-floor framing
intact and reads as a dolly move, which is what a walkthrough actually is.

Shot order is a descent, not a gallery. See ZIONSVILLE-WALKTHROUGH.md.

Usage:  python build_walkthrough.py [feed|reels]
"""

import os
import subprocess
import sys

from PIL import Image, ImageDraw

import build_ads as B
import build_video_ads as V

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(B.REPO, "public", "images")
OUT = os.path.join(HERE, "renders")
TMP = os.path.join(HERE, "_wtmp")

FPS = 30
XFADE = 0.6          # cross-dissolve between shots
SHOT = 2.6           # seconds per shot
END_DUR = 3.6


# ── The read of the space ──────────────────────────────────────────────
# pan: (start, end) as a fraction of the available horizontal travel.
# A short throw reads as a hold; a long one as a move.
AD = {
    "slug": "Z2-zionsville-hybrid",
    "hook": "You expect a basement.",
    "beat": "This is a walkout in Zionsville.",
    "end_head": "This is what a basement can be.",
    "end_sub": "Finished basements in Hamilton County - $45K to $200K.",
    "cta": "TOUR THIS BASEMENT",
    "badge_r": "5.0 \u2605 GOOGLE",
    "music": "new-diggs.m4a",
    # kind "img": a still, panned. kind "vid": an AI-generated clip that already
    # carries its own camera move, so the crop window sits still on it.
    #
    # Which shots got AI motion, and why, is the whole point of the hybrid.
    # Every clip was frame-checked against its source at the last frame, where
    # drift is worst. Shots 6 and 4 were generated and REJECTED - see
    # ZIONSVILLE-WALKTHROUGH.md - so they fall back to deterministic pans.
    "shots": [
        ("img", "zionsville-basement-9.jpg", 0.55, 0.45),  # mirror - AI invents faces in it
        ("vid", "_ai/ai-01.mp4",             0.50, 0.50),  # the reveal - AI found the French doors
        ("vid", "_ai/ai-02.mp4",             0.50, 0.50),  # the bar wall - AI push, verified clean
        ("img", "zionsville-basement-3.jpg", 1.00, 0.00),  # stone and backlit shelves
        ("img", "zionsville-basement-4.jpg", 0.40, 0.60),  # craftsmanship - AI drifted too far
        ("img", "zionsville-basement-6.jpg", 0.00, 0.85),  # wine room - AI put a person in the mirror
        ("img", "zionsville-basement-7.jpg", 1.00, 0.15),  # the lounge - TV screen, too risky
        ("img", "zionsville-basement-8.jpg", 0.10, 0.90),  # the lit niche - TV screen
        ("vid", "_ai/ai-05.mp4",             0.50, 0.50),  # card room - AI drift, verified clean
    ],
}


def plate_beat(ad, path):
    """Second text beat - the turn, after the reveal lands."""
    img, d = V._layer()
    S = B.S
    pad = int(56 * S)
    inner = V.W * S - pad * 2
    f, lines, tr = B.fit_lines(d, ad["beat"], "ExtraBold", inner,
                               max_px=int(58 * S), min_px=int(36 * S), max_lines=2)
    lh = int(f.size * 1.06)
    y = (V.H - V.SAFE_BOTTOM) * S - int(40 * S) - lh * len(lines)
    scrim_top = max(y - int(130 * S), 0)
    grad = B.vgradient(V.W, (V.H * S - scrim_top) // S, B.NAVY_DARK, 0, 215, ease=1.3)
    img.alpha_composite(grad.resize((V.W * S, V.H * S - scrim_top), Image.BILINEAR),
                        (0, scrim_top))
    d.rectangle([pad, y - int(30 * S), pad + int(74 * S), y - int(23 * S)],
                fill=B.GREEN + (255,))
    for ln in lines:
        B.draw_tracked(d, (pad, y), ln, f, B.WHITE, tr)
        y += lh
    return V._down(img, path)


def build(ad):
    os.makedirs(TMP, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    ff = V.ffmpeg_exe()
    tag = f"{ad['slug']}-{V.SUFFIX}"

    chrome = V.plate_chrome(ad, os.path.join(TMP, f"{tag}-chrome.png"))
    hook = V.plate_hook(ad, os.path.join(TMP, f"{tag}-hook.png"))
    beat = plate_beat(ad, os.path.join(TMP, f"{tag}-beat.png"))
    end = V.plate_endcard(ad, os.path.join(TMP, f"{tag}-end.png"))

    cmd = [ff, "-y", "-loglevel", "error"]
    for kind, name, _, _ in ad["shots"]:
        if kind == "img":
            cmd += ["-loop", "1", "-t", f"{SHOT:.2f}", "-i", os.path.join(SRC, name)]
        else:
            cmd += ["-i", os.path.join(HERE, name)]
    n = len(ad["shots"])
    cmd += ["-loop", "1", "-t", f"{END_DUR:.2f}", "-i", end]
    # Plates are looped for the full runtime. A single still sits at t=0 and
    # never advances, so fade=in never starts and the plate stays transparent.
    total = n * SHOT + END_DUR - n * XFADE
    for plate in (hook, beat, chrome):
        cmd += ["-loop", "1", "-t", f"{total:.2f}", "-i", plate]

    parts = []
    # Scale each still to fill the frame height, then pan the crop window
    # across it. iw after scaling is wider than the output, and that surplus
    # is the dolly travel.
    for i, (kind, _, a, b) in enumerate(ad["shots"]):
        pre = "" if kind == "img" else f"trim=duration={SHOT:.2f},setpts=PTS-STARTPTS,"
        parts.append(
            f"[{i}:v]{pre}scale=-2:{V.H}:out_range=tv,"
            f"crop={V.W}:{V.H}:"
            f"x='(iw-{V.W})*({a}+({b}-{a})*t/{SHOT:.2f})':y=0,"
            f"fps={FPS},format=yuv420p,setsar=1[s{i}]"
        )
    parts.append(f"[{n}:v]scale={V.W}:{V.H}:out_range=tv,fps={FPS},format=yuv420p,setsar=1[ec]")

    # Chained cross-dissolves. Offsets accumulate on the *result* length.
    prev, acc = "[s0]", SHOT
    for i in range(1, n + 1):
        nxt = f"[s{i}]" if i < n else "[ec]"
        off = acc - XFADE
        lbl = f"[x{i}]"
        parts.append(f"{prev}{nxt}xfade=transition=fade:duration={XFADE}:offset={off:.2f}{lbl}")
        acc = acc + (SHOT if i < n else END_DUR) - XFADE
        prev = lbl
    body = total - END_DUR + XFADE      # chrome/hook ride the footage, not the end card

    parts.append(f"[{n+1}:v]format=rgba,fade=out:st=3.2:d=0.7:alpha=1[hk]")
    parts.append(f"[{n+2}:v]format=rgba,fade=in:st=4.4:d=0.6:alpha=1,"
                 f"fade=out:st=8.0:d=0.7:alpha=1[bt]")
    parts.append(f"[{n+3}:v]format=rgba[ch]")
    parts.append(f"{prev}[hk]overlay=0:0:enable='lt(t,3.9)'[o1]")
    parts.append(f"[o1][bt]overlay=0:0:enable='between(t,4.4,8.7)'[o2]")
    parts.append(f"[o2][ch]overlay=0:0:enable='lt(t,{body:.2f})'[o3]")
    parts.append(f"[o3]fade=t=in:st=0:d=0.5,format=yuv420p[out]")

    out = os.path.join(OUT, f"{ad['slug']}--{V.SUFFIX}.mp4")
    cmd += ["-filter_complex", ";".join(parts), "-map", "[out]", "-an",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-profile:v", "high", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", "-r", str(FPS),
            "-color_range", "tv", "-colorspace", "bt709",
            "-color_primaries", "bt709", "-color_trc", "bt709", out]
    subprocess.run(cmd, check=True)
    return out, total


def main():
    args = [a.lower() for a in sys.argv[1:]]
    fmts = [a for a in args if a in V.FORMATS] or list(V.FORMATS)
    for name in fmts:
        V.use_format(name)
        print(f"{name}  {V.W}x{V.H}")
        path, dur = build(AD)
        for f in (path, V.mux_music(path, AD, dur)):
            if f:
                mb = os.path.getsize(f) / 1024 / 1024
                print(f"  {os.path.basename(f):<52} {dur:.1f}s  {mb:.1f} MB")


if __name__ == "__main__":
    main()
