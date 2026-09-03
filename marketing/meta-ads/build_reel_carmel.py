"""
Cut a 9:16 Reel for the Carmel green tile bathroom.

Same five-field format as the Fishers white-oak cut in build_reel_from_clips.py,
built off different source. The only Carmel footage that exists is three
Messenger re-compressions - there is no 4K original - so both usable clips were
run through Topaz first. Measured before and after:

    source   720x1280   1.87 Mbps   (same tier as the Fishers Reel source)
    topaz   1080x1920  17.9 Mbps

The third file (368x640, 0.78 Mbps) is not usable and is not referenced here.

Clip B is the spine: a clean, well-composed walkthrough that moves shower ->
tub -> vanity in one take. Clip A supplies the two shower angles B does not
cover. Shot selection was measured rather than eyeballed - see SEGMENTS.

Renders SILENT on purpose. Music is added in the music pass below, or natively
in the app: Meta Sound Collection audio is licensed for Meta surfaces only, and
this master also has to serve YouTube Shorts and the project page.
"""
import json, os, re, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageFilter

import build_ads as BRAND
import build_video_ads as V

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
UP = os.path.join(os.path.dirname(os.path.dirname(HERE)),
                  "homestar-website", "Pending", "Archive", "_upscaled")
if not os.path.isdir(UP):   # running from the repo root layout
    UP = os.path.join(os.path.dirname(os.path.dirname(HERE)), "Pending", "Archive", "_upscaled")
A = os.path.join(UP, "carmel-A-topaz-1080.mp4")
B = os.path.join(UP, "carmel-B-topaz-1080.mp4")

OUT_DIR = os.path.join(HERE, "renders")
os.makedirs(OUT_DIR, exist_ok=True)
OUT = os.path.join(OUT_DIR, "F5-carmel-green-tile-bath--reels-video.mp4")

W, H, FPS = 1080, 1920, 30
XFADE = 0.4

# (source, start, duration, note)
#
# Chosen off a per-half-second sharpness/motion scan of both clips plus a visual
# contact sheet. The scan alone was misleading - it scores edge energy, which
# collapses when the camera crosses plain dark floor tile even though the
# footage there is fine. The windows below are the ones that are both steady and
# actually pointed at something.
SEGMENTS = [
    (B,  2.6, 4.2, "shower interior - green tile, window, rain head"),
    (B,  7.2, 3.4, "freestanding tub, brass floor filler, drum pendant"),
    (B, 10.8, 3.6, "vanity, arched mirror, brass sconces"),
    (A, 22.0, 3.6, "shower and tub together, second angle"),
    (A, 25.8, 4.2, "shower fixtures down to the basketweave pan"),
]

LOGO_PNG = os.path.join(HERE, "_carmel_chrome.png")
HOOK_PNG = os.path.join(HERE, "_carmel_hook.png")
BEAT_PNG = os.path.join(HERE, "_carmel_beat.png")
END_PNG  = os.path.join(HERE, "_carmel_end.png")


def make_logo_plate():
    """Same lockup as every other Reel, with the same contrast fix behind it."""
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
    return LOGO_PNG


# ── text beats ───────────────────────────────────────────────────────────────
# hook  - the decision the whole room hangs on
# beat  - its consequence
# end   - the turn: the striking part is the tile, the part that decides whether
#         it lasts is the waterproofing nobody sees. Both claims are already on
#         the project page, so nothing here overstates the job.
AD = {
    "hook":     "Nobody picks green by accident.",
    "beat":     "Everything else follows it.",
    "end_head": "Bold tile. Boring waterproofing.",
    "end_sub":  "Schluter Pro Certified. Bathrooms in Hamilton County - $15K to $50K.",
    "cta":      "GET A FREE ESTIMATE",
    "badge_r":  "5.0 ★ GOOGLE",
}
HOOK_OUT, BEAT_IN, BEAT_OUT = 3.9, 7.6, 12.4
HOOK_FADE_IN, HOOK_FADE_OUT = 0.80, 0.75
BEAT_FADE_IN, BEAT_FADE_OUT = 0.75, 0.85
END_DUR = 3.6


def make_beat_plate():
    """Mirror of build_walkthrough.plate_beat - imported rather than reused only
    because that module runs format setup at import time."""
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


def build():
    for p in (A, B):
        if not os.path.exists(p):
            sys.exit(f"missing source: {p}")

    make_logo_plate()
    V.plate_hook(AD, HOOK_PNG)
    make_beat_plate()
    V.plate_endcard(AD, END_PNG)

    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error"]
    for src, ss, dur, _ in SEGMENTS:
        cmd += ["-ss", f"{ss:.2f}", "-t", f"{dur:.2f}", "-i", src]

    parts = []
    for i, (_, _, dur, _) in enumerate(SEGMENTS):
        # sources are already 1080x1920, so this is a passthrough - kept so the
        # script still works if a differently-sized master is swapped in
        parts.append(
            f"[{i}:v]scale={W}:{H}:force_original_aspect_ratio=increase:"
            f"out_range=tv:flags=lanczos,crop={W}:{H},"
            f"fps={FPS},format=yuv420p,setsar=1[s{i}]")

    prev, acc = "s0", SEGMENTS[0][2]
    for i in range(1, len(SEGMENTS)):
        off = acc - XFADE
        tag = f"x{i}"
        parts.append(
            f"[{prev}][s{i}]xfade=transition=fade:duration={XFADE}:offset={off:.3f}[{tag}]")
        acc = acc + SEGMENTS[i][2] - XFADE
        prev = tag

    body = acc
    n = len(SEGMENTS)
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", LOGO_PNG]
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", HOOK_PNG]
    cmd += ["-loop", "1", "-t", f"{body:.2f}", "-i", BEAT_PNG]
    cmd += ["-loop", "1", "-t", f"{END_DUR:.2f}", "-i", END_PNG]
    parts.append(f"[{n}:v]format=rgba,fade=t=in:st=0.25:d=0.7:alpha=1[lg]")
    parts.append(
        f"[{n+1}:v]format=rgba,"
        f"fade=t=in:st=0.30:d={HOOK_FADE_IN}:alpha=1,"
        f"fade=t=out:st={HOOK_OUT:.2f}:d={HOOK_FADE_OUT}:alpha=1[hk]")
    # alpha fades, not enable= - fade=in holds alpha at 0 until st, so the plate
    # is simply absent before it and never pops
    parts.append(
        f"[{n+2}:v]format=rgba,"
        f"fade=t=in:st={BEAT_IN:.2f}:d={BEAT_FADE_IN}:alpha=1,"
        f"fade=t=out:st={BEAT_OUT - BEAT_FADE_OUT:.2f}:d={BEAT_FADE_OUT}:alpha=1[bt]")
    parts.append(f"[{n+3}:v]scale={W}:{H},fps={FPS},format=yuv420p,setsar=1[ec]")
    parts.append(f"[{prev}][lg]overlay=0:0:format=auto[o1]")
    parts.append(f"[o1][hk]overlay=0:0:format=auto[o2]")
    parts.append(f"[o2][bt]overlay=0:0:format=auto[o3]")
    parts.append(f"[o3]format=yuv420p[bod]")
    parts.append(f"[bod][ec]xfade=transition=fade:duration={XFADE}:offset={body - XFADE:.3f}[out]")

    cmd += ["-filter_complex", ";".join(parts), "-map", "[out]", "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "19",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
            "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
            "-movflags", "+faststart", OUT]

    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:]); sys.exit(1)
    return body + END_DUR - XFADE


# ── music pass ───────────────────────────────────────────────────────────────
MUSIC = os.path.join(os.path.dirname(os.path.dirname(HERE)), "Pending", "Quiet Neon.mp3")
OUT_MUSIC = OUT.replace("--reels-video.mp4", "--reels-video-music.mp4")

# 70.5s is the loudest, steadiest 18s window in the track (mean -12.2 dBFS,
# sd 1.4 dB) - measured, not guessed. The track opens ~12 dB down, so starting
# at 0 would open the Reel almost silent.
MUSIC_START = 70.5
MUSIC_LUFS = -20
FADE_IN, FADE_OUT = 1.2, 2.2


def add_music(video_len):
    shape = (f"afade=t=in:st=0:d={FADE_IN},"
             f"afade=t=out:st={max(0.0, video_len - FADE_OUT):.2f}:d={FADE_OUT}")
    norm = f"loudnorm=I={MUSIC_LUFS}:TP=-1.5:LRA=11"

    # two-pass: measure the *shaped* audio so the fades are in the measurement
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
    # aresample AFTER loudnorm - the other order silently leaves the file at 96 kHz
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
    secs = int(dur.group(2)) * 60 + float(dur.group(3)) if dur else 0.0
    return secs, (dims.group(1), dims.group(2)) if dims else ("?", "?"), err


if __name__ == "__main__":
    expected = build()
    secs, dims, err = probe(OUT)
    print(f"wrote {os.path.basename(OUT)}")
    print(f"  dimensions : {dims[0]}x{dims[1]}")
    print(f"  duration   : {secs:.2f}s  (expected {expected:.2f}s)")
    print(f"  audio      : {'PRESENT - unexpected' if 'Audio:' in err else 'none (silent master, as intended)'}")
    print(f"  size       : {os.path.getsize(OUT)/1048576:.1f} MB")
    for i, (src, ss, dur_, note) in enumerate(SEGMENTS, 1):
        tag = "A" if src == A else "B"
        print(f"  {i}. clip {tag}  {ss:5.1f}s +{dur_:.1f}s   {note}")

    add_music(secs)
    msecs, _, merr = probe(OUT_MUSIC)
    astream = re.search(r"Audio: (\w+).*?(\d+) Hz, (\w+)", merr)
    print(f"\nwrote {os.path.basename(OUT_MUSIC)}")
    print(f"  duration   : {msecs:.2f}s  (video {secs:.2f}s)")
    print(f"  audio      : {astream.group(1)} {astream.group(2)} Hz {astream.group(3)}"
          if astream else "  audio      : MISSING")
    print(f"  size       : {os.path.getsize(OUT_MUSIC)/1048576:.1f} MB")
