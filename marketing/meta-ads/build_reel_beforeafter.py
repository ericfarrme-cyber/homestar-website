"""
Cut a 9:16 before-and-after Reel.

Source is the only true before-and-after pair in the archive: a dated builder
primary bath filmed 2026-01-16, and the navy picket tile bath the same room
became, filmed 2026-05-01. Eric confirmed the pairing; the visual evidence is
the **same vaulted ceiling** over the vanity wall in both clips, which is what
makes the match real rather than a shared date.

Structure is all-before then all-after, deliberately. Alternating matched pairs
is more elegant but needs a persistent BEFORE/AFTER label to stay legible on a
muted scroll; one block each, with a tag on the footage, cannot be misread.

Quality runs backwards on this pair - the before is true 4K (2160x3840) and the
after is 720x1280 - so the AFTER is the clip that gets the Topaz lift, trimmed
to its first 48s first, which keeps every timestamp below valid.

Renders SILENT. Music is added in the pass at the bottom.
"""
import json, os, re, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageFilter

import build_ads as BRAND
import build_video_ads as V

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
ARCH = os.path.join(REPO, "Pending", "Archive")

BEFORE = os.path.join(ARCH, "20260116_142314.mp4")
AFTER = os.path.join(ARCH, "_upscaled", "navy-after-topaz-1080.mp4")

OUT_DIR = os.path.join(HERE, "renders")
os.makedirs(OUT_DIR, exist_ok=True)
OUT = os.path.join(OUT_DIR, "F6-navy-picket-primary-bath--reels-video.mp4")

W, H, FPS = 1080, 1920, 30
XFADE = 0.4

# (source, start, duration, tag, note)
#
# Two things are deliberately avoided in the before segments: the 14-16s window,
# which looks onto the street with neighbouring houses and a parked vehicle in
# frame and could identify the property, and 21.8-22.6s, where the person filming
# is reflected in the vanity mirror. The first AFTER segment stops at 2.3s for
# the same reason - a figure appears in the shower glass just after it.
SEGMENTS = [
    (BEFORE,  0.6, 2.4, "BEFORE", "from the doorway - framed shower, vaulted ceiling"),
    (BEFORE,  9.2, 2.2, "BEFORE", "framed shower panning to the corner jetted tub"),
    (BEFORE, 23.2, 1.8, "BEFORE", "white raised-panel double vanity"),
    (AFTER,   0.2, 2.1, "AFTER",  "from the same doorway"),
    (AFTER,  15.0, 3.4, "AFTER",  "navy picket tile, bench and niche"),
    (AFTER,  32.6, 3.0, "AFTER",  "freestanding tub against the tile"),
    (AFTER,  43.0, 3.4, "AFTER",  "vanity, LED mirrors - same vaulted ceiling"),
]

AD = {
    "hook":     "This was the primary bath.",
    "beat":     "Same room. Same ceiling.",
    "end_head": "Nothing else the same.",
    "end_sub":  "Schluter Pro Certified. Bathrooms in Hamilton County - $15K to $50K.",
    "cta":      "GET A FREE ESTIMATE",
    "badge_r":  "5.0 ★ GOOGLE",
}
END_DUR = 3.6
HOOK_FADE_IN, HOOK_FADE_OUT = 0.80, 0.75
BEAT_FADE_IN, BEAT_FADE_OUT = 0.75, 0.85

LOGO_PNG = os.path.join(HERE, "_ba_chrome.png")
HOOK_PNG = os.path.join(HERE, "_ba_hook.png")
BEAT_PNG = os.path.join(HERE, "_ba_beat.png")
END_PNG = os.path.join(HERE, "_ba_end.png")
TAG_BEFORE_PNG = os.path.join(HERE, "_ba_tag_before.png")
TAG_AFTER_PNG = os.path.join(HERE, "_ba_tag_after.png")


def make_logo_plate():
    V.use_format("reels")
    assert (V.W, V.H) == (W, H), f"format mismatch: {(V.W, V.H)} vs {(W, H)}"
    V.plate_chrome({"badge_r": AD["badge_r"]}, LOGO_PNG)
    plate = Image.open(LOGO_PNG).convert("RGBA")
    shadow = Image.new("RGBA", plate.size, (0, 0, 0, 0))
    shadow.putalpha(plate.getchannel("A").point(lambda a: int(a * 0.55)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    out = Image.new("RGBA", plate.size, (0, 0, 0, 0))
    out.alpha_composite(shadow, (0, 3))
    out.alpha_composite(plate)
    out.save(LOGO_PNG)


def make_tag(label, bg, fg, path):
    """Small pill under the wordmark saying which half of the story this is.

    A muted viewer scrolling past needs to know instantly which state they are
    looking at; past tense in the hook is not enough on its own.
    """
    img, d = V._layer()
    Sx = BRAND.S
    f = BRAND.font("ExtraBold", int(30 * Sx))
    w, _ = BRAND.pill(d, 0, -10_000, label, f, bg, fg, tracking=0.10,
                      pad_x=int(26 * Sx), pad_y=int(14 * Sx))   # measure off-canvas
    x = (V.W * Sx - w) // 2
    y = (V.SAFE_TOP + 96) * Sx
    BRAND.pill(d, x, y, label, f, bg, fg, tracking=0.10,
               pad_x=int(26 * Sx), pad_y=int(14 * Sx))
    return V._down(img, path)


def make_beat_plate():
    img, d = V._layer()
    Sx = BRAND.S
    pad = int(56 * Sx)
    inner = V.W * Sx - pad * 2
    f, lines, tr = BRAND.fit_lines(d, AD["beat"], "ExtraBold", inner,
                                   max_px=int(58 * Sx), min_px=int(36 * Sx), max_lines=2)
    lh = int(f.size * 1.06)
    y = (V.H - V.SAFE_BOTTOM) * Sx - int(40 * Sx) - lh * len(lines)
    scrim_top = max(y - int(130 * Sx), 0)
    grad = BRAND.vgradient(V.W, (V.H * Sx - scrim_top) // Sx, BRAND.NAVY_DARK, 0, 244, ease=1.15)
    img.alpha_composite(grad.resize((V.W * Sx, V.H * Sx - scrim_top), Image.BILINEAR), (0, scrim_top))
    d.rectangle([pad, y - int(30 * Sx), pad + int(74 * Sx), y - int(23 * Sx)],
                fill=BRAND.GREEN + (255,))
    for ln in lines:
        V._shadowed(d, (pad, y), ln, f, tr, Sx)
        y += lh
    return V._down(img, BEAT_PNG)


def timeline():
    """Absolute (start, end) of every segment on the assembled body."""
    spans, t = [], 0.0
    for i, (_, _, dur, _, _) in enumerate(SEGMENTS):
        spans.append((t, t + dur))
        t += dur - XFADE
    return spans, spans[-1][1]


def build():
    for p in (BEFORE, AFTER):
        if not os.path.exists(p):
            sys.exit(f"missing source: {p}")

    make_logo_plate()
    V.plate_hook(AD, HOOK_PNG)
    make_beat_plate()
    V.plate_endcard(AD, END_PNG)
    make_tag("BEFORE", (188, 62, 62, 235), BRAND.WHITE + (255,), TAG_BEFORE_PNG)
    make_tag("AFTER", BRAND.GREEN + (235,), BRAND.WHITE + (255,), TAG_AFTER_PNG)

    spans, body = timeline()
    n_before = sum(1 for s in SEGMENTS if s[3] == "BEFORE")
    before_end = spans[n_before - 1][1]          # last BEFORE segment ends
    after_start = spans[n_before][0]             # first AFTER segment begins

    # hook rides the before block, beat lands just after the reveal
    hook_out = before_end - 0.8
    beat_in = after_start + 0.8
    beat_out = min(beat_in + 4.6, body - 0.4)

    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error"]
    for src, ss, dur, _, _ in SEGMENTS:
        cmd += ["-ss", f"{ss:.2f}", "-t", f"{dur:.2f}", "-i", src]

    parts = []
    for i, (_, _, dur, _, _) in enumerate(SEGMENTS):
        parts.append(
            f"[{i}:v]scale={W}:{H}:force_original_aspect_ratio=increase:"
            f"out_range=tv:flags=lanczos,crop={W}:{H},"
            f"fps={FPS},format=yuv420p,setsar=1[s{i}]")

    prev, acc = "s0", SEGMENTS[0][2]
    for i in range(1, len(SEGMENTS)):
        tag = f"x{i}"
        parts.append(
            f"[{prev}][s{i}]xfade=transition=fade:duration={XFADE}:offset={acc - XFADE:.3f}[{tag}]")
        acc += SEGMENTS[i][2] - XFADE
        prev = tag

    n = len(SEGMENTS)
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", LOGO_PNG]
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", HOOK_PNG]
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", BEAT_PNG]
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", TAG_BEFORE_PNG]
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", TAG_AFTER_PNG]
    cmd += ["-loop", "1", "-t", f"{END_DUR:.2f}", "-i", END_PNG]

    parts.append(f"[{n}:v]format=rgba,fade=t=in:st=0.25:d=0.7:alpha=1[lg]")
    parts.append(
        f"[{n+1}:v]format=rgba,fade=t=in:st=0.30:d={HOOK_FADE_IN}:alpha=1,"
        f"fade=t=out:st={hook_out:.2f}:d={HOOK_FADE_OUT}:alpha=1[hk]")
    parts.append(
        f"[{n+2}:v]format=rgba,fade=t=in:st={beat_in:.2f}:d={BEAT_FADE_IN}:alpha=1,"
        f"fade=t=out:st={beat_out - BEAT_FADE_OUT:.2f}:d={BEAT_FADE_OUT}:alpha=1[bt]")
    # the tags cross over at the reveal: BEFORE fades out as AFTER fades in
    parts.append(
        f"[{n+3}:v]format=rgba,fade=t=in:st=0.45:d=0.5:alpha=1,"
        f"fade=t=out:st={before_end - 0.5:.2f}:d=0.45:alpha=1[tb]")
    parts.append(
        f"[{n+4}:v]format=rgba,fade=t=in:st={after_start:.2f}:d=0.45:alpha=1[ta]")
    parts.append(f"[{n+5}:v]scale={W}:{H},fps={FPS},format=yuv420p,setsar=1[ec]")

    parts.append(f"[{prev}][lg]overlay=0:0:format=auto[o1]")
    parts.append("[o1][tb]overlay=0:0:format=auto[o2]")
    parts.append("[o2][ta]overlay=0:0:format=auto[o3]")
    parts.append("[o3][hk]overlay=0:0:format=auto[o4]")
    parts.append("[o4][bt]overlay=0:0:format=auto[o5]")
    parts.append("[o5]format=yuv420p[bod]")
    parts.append(f"[bod][ec]xfade=transition=fade:duration={XFADE}:offset={body - XFADE:.3f}[out]")

    cmd += ["-filter_complex", ";".join(parts), "-map", "[out]", "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "19",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
            "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
            "-movflags", "+faststart", OUT]

    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:]); sys.exit(1)
    return body + END_DUR - XFADE, (hook_out, beat_in, beat_out, before_end, after_start)


MUSIC = os.path.join(REPO, "Pending", "Quiet Neon.mp3")
OUT_MUSIC = OUT.replace("--reels-video.mp4", "--reels-video-music.mp4")
MUSIC_START, MUSIC_LUFS = 70.5, -20
FADE_IN, FADE_OUT = 1.2, 2.2


def add_music(video_len):
    shape = (f"afade=t=in:st=0:d={FADE_IN},"
             f"afade=t=out:st={max(0.0, video_len - FADE_OUT):.2f}:d={FADE_OUT}")
    norm = f"loudnorm=I={MUSIC_LUFS}:TP=-1.5:LRA=11"
    probe = subprocess.run(
        [FF, "-hide_banner", "-ss", f"{MUSIC_START}", "-t", f"{video_len:.2f}", "-i", MUSIC,
         "-af", f"{shape},{norm}:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True)
    blocks = re.findall(r"\{[\s\S]*?\}", probe.stderr)
    if blocks:
        d = json.loads(blocks[-1])
        norm += (f":measured_I={d['input_i']}:measured_TP={d['input_tp']}"
                 f":measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}"
                 f":offset={d['target_offset']}:linear=true")
    af = f"{shape},{norm},aresample=48000"
    r = subprocess.run(
        [FF, "-y", "-hide_banner", "-loglevel", "error",
         "-i", OUT, "-ss", f"{MUSIC_START}", "-t", f"{video_len:.2f}", "-i", MUSIC,
         "-filter_complex", f"[1:a]{af}[a]", "-map", "0:v", "-map", "[a]",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
         "-shortest", "-movflags", "+faststart", OUT_MUSIC],
        capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:]); sys.exit(1)


def probe(path):
    err = subprocess.run([FF, "-hide_banner", "-i", path], capture_output=True, text=True).stderr
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    dims = re.search(r"Video: .*?, (\d+)x(\d+)", err)
    return (int(dur.group(2)) * 60 + float(dur.group(3)) if dur else 0.0,
            (dims.group(1), dims.group(2)) if dims else ("?", "?"), err)


if __name__ == "__main__":
    expected, marks = build()
    hook_out, beat_in, beat_out, before_end, after_start = marks
    secs, dims, err = probe(OUT)
    print(f"wrote {os.path.basename(OUT)}")
    print(f"  dimensions : {dims[0]}x{dims[1]}")
    print(f"  duration   : {secs:.2f}s  (expected {expected:.2f}s)")
    print(f"  audio      : {'PRESENT - unexpected' if 'Audio:' in err else 'none (silent, as intended)'}")
    print(f"  size       : {os.path.getsize(OUT)/1048576:.1f} MB")
    print(f"  reveal at  : {after_start:.2f}s   (before block ends {before_end:.2f}s)")
    print(f"  hook out   : {hook_out:.2f}s      beat {beat_in:.2f}-{beat_out:.2f}s")
    for i, (src, ss, dur_, tag, note) in enumerate(SEGMENTS, 1):
        print(f"  {i}. {tag:6} {ss:5.1f}s +{dur_:.1f}s   {note}")

    add_music(secs)
    msecs, _, merr = probe(OUT_MUSIC)
    a = re.search(r"Audio: (\w+).*?(\d+) Hz, (\w+)", merr)
    print(f"\nwrote {os.path.basename(OUT_MUSIC)}")
    print(f"  duration   : {msecs:.2f}s  (video {secs:.2f}s)")
    print(f"  audio      : {a.group(1)} {a.group(2)} Hz {a.group(3)}" if a else "  audio: MISSING")
    print(f"  size       : {os.path.getsize(OUT_MUSIC)/1048576:.1f} MB")
