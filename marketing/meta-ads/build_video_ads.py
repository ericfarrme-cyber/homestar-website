#!/usr/bin/env python3
"""
HomeStar Meta video ad builder — cuts the two project walkthroughs into
Reels/Stories ads.

Both source videos are already native 1080x1920, so nothing is reframed or
regenerated: we trim to the strongest moments, composite brand overlays, and
append an end card. The footage itself is untouched, same rule as the stills.

Audio is dropped on purpose:
  - geist-three-bath-video.mp4 carries a loud music bed (max -0.6 dB) of
    unknown licence. Shipping it in a paid ad is a rights risk.
  - westfield-basement-masterpiece-video.mov is silent (-91 dB) anyway.
Add a track from Meta's own royalty-free library in Ads Manager instead.

Usage:  python build_video_ads.py [slug-filter]
"""

import json
import os
import re
import subprocess
import sys

from PIL import Image, ImageDraw

import build_ads as B

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(B.REPO, "public", "images")
OUT = os.path.join(HERE, "renders")
TMP = os.path.join(HERE, "_vtmp")

# Output formats. Overlays are composited at output size *after* the crop, so a
# 4:5 render re-lays the type for the new frame. Cropping a finished 9:16 render
# down to 4:5 would instead slice 285px off each end and take the hook with it.
FORMATS = {
    "reels": dict(w=1080, h=1920, safe_top=250, safe_bottom=420,
                  suffix="reels-video"),
    # Reels/Stories UI covers the top and bottom of the frame. In-feed video
    # does not, so 4:5 needs only enough margin to keep type off the edges.
    "feed": dict(w=1080, h=1350, safe_top=48, safe_bottom=110,
                 suffix="feed-video"),
}

W = H = SAFE_TOP = SAFE_BOTTOM = SUFFIX = None
FPS = 30
S = B.S


def use_format(name):
    """Rebind the frame globals that the plate builders read."""
    global W, H, SAFE_TOP, SAFE_BOTTOM, SUFFIX
    f = FORMATS[name]
    W, H = f["w"], f["h"]
    SAFE_TOP, SAFE_BOTTOM = f["safe_top"], f["safe_bottom"]
    SUFFIX = f["suffix"]


def ffmpeg_exe():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


# ── Overlay plates ─────────────────────────────────────────────────────
def _layer():
    img = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def _down(img, path):
    img.resize((W, H), Image.LANCZOS).save(path)
    return path


def plate_chrome(ad, path):
    """Persistent wordmark + trust badge, pinned inside the top safe zone."""
    img, d = _layer()
    pad = int(56 * S)
    top = (SAFE_TOP + 30) * S
    B.wordmark(d, pad, top, S, on_dark=True)
    B._badges(d, {"badge_r": ad.get("badge_r")}, W, pad, top=top - int(6 * S),
              right_only=True)
    return _down(img, path)


def plate_hook(ad, path):
    """Opening hook, bottom-anchored above Meta's UI strip."""
    img, d = _layer()
    pad = int(56 * S)
    inner = W * S - pad * 2

    f, lines, tr = B.fit_lines(d, ad["hook"], "ExtraBold", inner,
                               max_px=int(64 * S), min_px=int(38 * S), max_lines=3)
    lh = int(f.size * 1.06)
    block = lh * len(lines)
    y = (H - SAFE_BOTTOM) * S - int(40 * S) - block

    # Legibility scrim so the hook reads over any frame of footage.
    scrim_top = max(y - int(150 * S), 0)
    grad = B.vgradient(W, (H * S - scrim_top) // S, B.NAVY_DARK, 0, 225, ease=1.3)
    img.alpha_composite(grad.resize(((W * S), (H * S - scrim_top)), Image.BILINEAR),
                        (0, scrim_top))

    d.rectangle([pad, y - int(34 * S), pad + int(74 * S), y - int(27 * S)],
                fill=B.GREEN + (255,))
    for ln in lines:
        B.draw_tracked(d, (pad, y), ln, f, B.WHITE, tr)
        y += lh
    return _down(img, path)


def plate_endcard(ad, path):
    """Solid brand end card — the only fully synthetic frame in the cut."""
    img = Image.new("RGBA", (W * S, H * S), B.NAVY + (255,))
    d = ImageDraw.Draw(img)
    pad = int(76 * S)
    inner = W * S - pad * 2

    f, lines, tr = B.fit_lines(d, ad["end_head"], "ExtraBold", inner,
                               max_px=int(86 * S), min_px=int(46 * S), max_lines=4)
    lh = int(f.size * 1.05)
    f_s = B.font("Medium", int(33 * S))
    sub = B.wrap(d, ad["end_sub"], f_s, inner)
    sub_lh = int(f_s.size * 1.36)

    block = lh * len(lines) + int(24 * S) + sub_lh * len(sub)
    y = (H * S - block) // 2 - int(40 * S)

    d.rectangle([pad, y - int(46 * S), pad + int(84 * S), y - int(38 * S)],
                fill=B.GREEN + (255,))
    for ln in lines:
        B.draw_tracked(d, (pad, y), ln, f, B.WHITE, tr)
        y += lh
    y += int(20 * S)
    for ln in sub:
        d.text((pad, y), ln, font=f_s, fill=B.GREEN_LT)
        y += sub_lh

    f_c = B.font("ExtraBold", int(27 * S))
    B.pill(d, pad, y + int(44 * S), ad["cta"], f_c, B.GREEN + (255,), B.WHITE,
           tracking=1.0 * S, pad_x=int(32 * S), pad_y=int(18 * S))

    B.wordmark(d, pad, (H - SAFE_BOTTOM - 120) * S, S, on_dark=True)
    return _down(img, path)


# ── Encode ─────────────────────────────────────────────────────────────
def build(ad):
    os.makedirs(TMP, exist_ok=True)
    ff = ffmpeg_exe()
    src = os.path.join(SRC, ad["video"])
    if not os.path.isfile(src):
        print(f"  ! missing source: {ad['video']}")
        return None

    tag = f"{ad['slug']}-{SUFFIX}"
    chrome = plate_chrome(ad, os.path.join(TMP, f"{tag}-chrome.png"))
    hook = plate_hook(ad, os.path.join(TMP, f"{tag}-hook.png"))
    end = plate_endcard(ad, os.path.join(TMP, f"{tag}-end.png"))

    segs = ad["segments"]
    end_dur = ad.get("end_dur", 3.0)
    body_dur = sum(b - a for a, b in segs)

    parts, labels = [], []
    for i, (a, b) in enumerate(segs):
        parts.append(
            f"[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,"
            f"scale={W}:{H}:force_original_aspect_ratio=increase,"
            f"crop={W}:{H},fps={FPS},format=yuv420p[s{i}]"
        )
        labels.append(f"[s{i}]")

    parts.append(
        f"[1:v]scale={W}:{H},fps={FPS},format=yuv420p,"
        f"trim=duration={end_dur},setpts=PTS-STARTPTS[endc]"
    )
    labels.append("[endc]")

    parts.append("".join(labels) + f"concat=n={len(labels)}:v=1:a=0[cat]")
    # Hook holds for ~3s then fades; chrome rides the footage but not the end card.
    parts.append("[2:v]format=rgba,fade=out:st=3.0:d=0.7:alpha=1[hk]")
    parts.append("[3:v]format=rgba[ch]")
    parts.append(f"[cat][hk]overlay=0:0:enable='lt(t,3.75)'[o1]")
    parts.append(f"[o1][ch]overlay=0:0:enable='lt(t,{body_dur:.2f})'[o2]")
    parts.append(f"[o2]fade=t=in:st=0:d=0.4,format=yuv420p[out]")

    out = os.path.join(OUT, f"{ad['slug']}--{SUFFIX}.mp4")
    cmd = [
        ff, "-y", "-loglevel", "error",
        "-i", src,
        "-loop", "1", "-t", str(end_dur + 1), "-i", end,
        "-i", hook,
        "-i", chrome,
        "-filter_complex", ";".join(parts),
        "-map", "[out]", "-an",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-r", str(FPS),
        out,
    ]
    subprocess.run(cmd, check=True)
    return out, body_dur + end_dur


# ── Music ──────────────────────────────────────────────────────────
# Meta Sound Collection tracks: licensed for Meta platforms only, so the silent
# masters stay the versions for YouTube or thehomestarservice.com.
#
# -20 LUFS, not -16. A first pass at -16 left peaks at -1.2 dB, and adding
# alimiter made it worse (its makeup gain pushed peaks to -0.4 dB). Lowering the
# target was the fix.
MUSIC_LUFS = -20
FADE_IN = 1.2
FADE_OUT = 2.2


def mux_music(video, ad, dur):
    track = ad.get("music")
    if not track:
        return None
    src = os.path.join(HERE, "assets", track)
    if not os.path.isfile(src):
        print(f"  ! missing track: {track}")
        return None

    out = video.replace(".mp4", "-music.mp4")
    ff = ffmpeg_exe()
    shape = (f"atrim=duration={dur:.2f},"
             f"afade=t=in:st=0:d={FADE_IN},"
             f"afade=t=out:st={max(dur - FADE_OUT, 0):.2f}:d={FADE_OUT}")
    norm = f"loudnorm=I={MUSIC_LUFS}:TP=-2:LRA=11"

    # Two-pass loudnorm. Single-pass is a rough estimate and undershoots on
    # quieter, more dynamic tracks - Stardust landed 2.5 dB under target and
    # 5 dB down on peaks versus the other cuts. Pass 1 measures the *shaped*
    # audio, pass 2 applies those measurements, which lands on target.
    probe = subprocess.run(
        [ff, "-i", src, "-af", f"{shape},{norm}:print_format=json",
         "-f", "null", "-"],
        capture_output=True, text=True)
    blocks = re.findall(r"\{[\s\S]*?\}", probe.stderr)
    if blocks:
        d = json.loads(blocks[-1])
        norm += (f":measured_I={d['input_i']}:measured_TP={d['input_tp']}"
                 f":measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}"
                 f":offset={d['target_offset']}:linear=true")

    # aresample goes *after* loudnorm: loudnorm resamples internally and will
    # otherwise hand back 96k/192k, which is not what the masters ship at.
    af = f"{shape},{norm},aresample=48000"
    subprocess.run([
        ff, "-y", "-loglevel", "error",
        "-i", video, "-i", src,
        "-filter_complex", f"[1:a]{af}[a]",
        "-map", "0:v", "-map", "[a]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
        "-shortest", "-movflags", "+faststart",
        out,
    ], check=True)
    return out


# ── Cuts ───────────────────────────────────────────────────────────────
VIDEO_ADS = [
    {
        "slug": "V1-whole-home-three-baths",
        "video": "geist-three-bath-video.mp4",
        # Three *visibly distinct* bathrooms — the maple vanity, the dark-tile
        # wet area, then the marble double vanity. An earlier cut spent 12s in
        # one room, which quietly broke the "three bathrooms" claim.
        "segments": [(2.6, 7.2), (17.4, 22.6), (41.6, 45.8), (46.6, 51.0)],
        "hook": "Three bathrooms. One house. One contractor.",
        "end_head": "One contractor. One schedule. One warranty.",
        "end_sub": "Whole-home and multi-room renovations across Hamilton County, Indiana.",
        "cta": "GET A FREE ESTIMATE",
        "badge_r": "5.0 ★ GOOGLE",
        "end_dur": 3.4,
        "music": "spacious-fields.m4a",
    },
    {
        "slug": "V2-entertaining-floor",
        "video": "westfield-basement-masterpiece-video.mov",
        # Two beats deliberately avoided: the gym at 61-65s and the fireplace
        # wall at 30-34s both read as near-black on a phone in daylight, which
        # is where Reels is actually watched. Brighter equivalents used instead.
        "segments": [(0.5, 4.6), (9.0, 14.6), (35.0, 39.6), (50.5, 55.0)],
        "hook": "This was storage.",
        "end_head": "The best room in the house was the one nobody used.",
        "end_sub": "Finished basements in Hamilton County — $45K to $200K.",
        "cta": "TOUR THIS BASEMENT",
        "badge_r": "5.0 ★ GOOGLE",
        "end_dur": 3.4,
        "music": "new-diggs.m4a",
    },
]


def main():
    os.makedirs(OUT, exist_ok=True)
    args = [a.lower() for a in sys.argv[1:]]
    fmts = [a for a in args if a in FORMATS] or list(FORMATS)
    flt = next((a for a in args if a not in FORMATS), None)

    for name in fmts:
        use_format(name)
        print(f"{name}  {W}x{H}")
        for ad in VIDEO_ADS:
            if flt and flt not in ad["slug"].lower():
                continue
            res = build(ad)
            if not res:
                continue
            path, dur = res
            for f in (path, mux_music(path, ad, dur)):
                if f:
                    mb = os.path.getsize(f) / 1024 / 1024
                    print(f"  {os.path.basename(f):<46} {dur:.1f}s  {mb:.1f} MB")


if __name__ == "__main__":
    main()
