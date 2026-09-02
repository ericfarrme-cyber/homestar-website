"""
Cut a 9:16 Reel from real phone footage (as opposed to build_walkthrough.py,
which animates stills).

Source here is the Fishers white-oak primary bath: two vertical 720x1280 clips
shot the same afternoon. Clip A is the clean spine - no hands in frame. Clip B
contributes two beats A does not cover well, both verified hand-free before
being cut in.

Renders SILENT on purpose. Music gets added natively in the Instagram or YouTube
app: Meta Sound Collection audio is licensed for Meta surfaces only, and this
master also has to serve YouTube Shorts and the project page.
"""
import json, os, re, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter

import build_ads as BRAND
import build_video_ads as V

FF = imageio_ffmpeg.get_ffmpeg_exe()
DL = r"C:\Users\ericf\Downloads"
A = os.path.join(DL, "VID_20260902_143917.mp4")
B = os.path.join(DL, "VID_20260902_143919.mp4")

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "renders")
os.makedirs(OUT_DIR, exist_ok=True)
OUT = os.path.join(OUT_DIR, "F4-fishers-white-oak-bath--reels-video.mp4")

W, H, FPS = 1080, 1920, 30
XFADE = 0.4

# (source, start, duration, note)
SEGMENTS = [
    (A,  1.5, 4.5, "vanity establishing, pan right"),
    (A,  8.6, 3.8, "freestanding tub under the window"),
    (B, 10.0, 3.4, "approach on the frameless shower"),
    (B, 18.6, 2.8, "shower interior, fixture and niches"),
    (A, 23.0, 5.4, "pull back past the tub, land on the vanity"),
]


# ── corner wordmark ──────────────────────────────────────────────────────────
# Reuses build_video_ads.plate_chrome, the same lockup already running on the
# Zionsville and Fishers Reels: HOMESTAR over SERVICES & CONTRACTING top-left,
# 5.0 GOOGLE badge top-right, both pinned inside the Reels top safe zone. Reused
# rather than reimplemented so this cut is visually identical to the others.
LOGO_PNG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_reel_chrome.png")


def make_logo_plate():
    V.use_format("reels")          # binds W/H/SAFE_TOP that the plate builder reads
    assert (V.W, V.H) == (W, H), f"format mismatch: {(V.W, V.H)} vs {(W, H)}"
    V.plate_chrome({"badge_r": "5.0 ★ GOOGLE"}, LOGO_PNG)

    # The lockup was designed over a dark basement. This cut is a bright bathroom,
    # and measured against the pale wall and ceiling the white wordmark drops to
    # roughly 1.4:1 contrast. Drop a blurred copy of the plate's own alpha behind
    # it: the lockup itself is untouched, it just stops dissolving into quartz.
    plate = Image.open(LOGO_PNG).convert("RGBA")
    shadow = Image.new("RGBA", plate.size, (0, 0, 0, 0))
    shadow.putalpha(plate.getchannel("A").point(lambda a: int(a * 0.55)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    out = Image.new("RGBA", plate.size, (0, 0, 0, 0))
    out.alpha_composite(shadow, (0, 3))
    out.alpha_composite(plate)
    out.save(LOGO_PNG)
    return LOGO_PNG


def build():
    make_logo_plate()
    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error"]
    for src, ss, dur, _ in SEGMENTS:
        cmd += ["-ss", f"{ss:.2f}", "-t", f"{dur:.2f}", "-i", src]

    parts = []
    for i, (_, _, dur, _) in enumerate(SEGMENTS):
        # force_original_aspect_ratio=increase then crop keeps the framing full-bleed
        # at 9:16 without letterboxing; out_range=tv avoids the full-range shift that
        # bit the still pipeline.
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

    # logo rides the whole cut, easing in so it does not pop on frame one
    li = len(SEGMENTS)
    cmd += ["-loop", "1", "-t", f"{acc:.2f}", "-i", LOGO_PNG]
    parts.append(f"[{li}:v]format=rgba,fade=t=in:st=0.25:d=0.7:alpha=1[lg]")
    parts.append(f"[{prev}][lg]overlay=0:0:format=auto,format=yuv420p[out]")
    prev = "out"

    cmd += ["-filter_complex", ";".join(parts), "-map", f"[{prev}]", "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "19",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
            "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
            "-movflags", "+faststart", OUT]

    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:]); sys.exit(1)
    return acc


# ── music pass ───────────────────────────────────────────────────────────────
MUSIC = r"C:\Users\ericf\OneDrive\Documents\GitHub\homestar-website\Pending\Quiet Neon.mp3"
OUT_MUSIC = OUT.replace("--reels-video.mp4", "--reels-video-music.mp4")

# Quiet Neon opens soft - its first six seconds sit ~12 dB under the track average,
# so starting at 0 would open the Reel almost silent. 70.5s is the loudest, steadiest
# 18s window in the track (mean -12.2 dBFS, sd 1.4 dB), measured rather than guessed.
MUSIC_START = 70.5
MUSIC_LUFS = -20
FADE_IN, FADE_OUT = 1.2, 2.2


def add_music(video_len):
    shape = (f"afade=t=in:st=0:d={FADE_IN},"
             f"afade=t=out:st={max(0.0, video_len - FADE_OUT):.2f}:d={FADE_OUT}")
    norm = f"loudnorm=I={MUSIC_LUFS}:TP=-1.5:LRA=11"

    # Two-pass loudnorm: pass 1 measures the *shaped* audio so the fades are included
    # in the measurement, pass 2 applies the correction with those numbers.
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
    # aresample AFTER loudnorm - the other order silently leaves the file at 96 kHz.
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


expected = build()
info = subprocess.run([FF, "-hide_banner", "-i", OUT], capture_output=True, text=True).stderr
dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
dims = re.search(r"Video: .*?, (\d+)x(\d+)", info)
secs = int(dur.group(2)) * 60 + float(dur.group(3)) if dur else 0

print(f"wrote {os.path.basename(OUT)}")
print(f"  dimensions : {dims.group(1)}x{dims.group(2)}" if dims else "  dimensions : ?")
print(f"  duration   : {secs:.2f}s  (expected {expected:.2f}s)")
print(f"  audio      : {'PRESENT - unexpected' if 'Audio:' in info else 'none (silent master, as intended)'}")
print(f"  size       : {os.path.getsize(OUT)/1048576:.1f} MB")
for i, (src, ss, dur_, note) in enumerate(SEGMENTS, 1):
    print(f"  {i}. {os.path.basename(src)[-10:-4]}  {ss:5.1f}s +{dur_:.1f}s   {note}")

add_music(secs)
m = subprocess.run([FF, "-hide_banner", "-i", OUT_MUSIC], capture_output=True, text=True).stderr
mdur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", m)
astream = re.search(r"Audio: (\w+).*?(\d+) Hz, (\w+)", m)
msecs = int(mdur.group(2)) * 60 + float(mdur.group(3)) if mdur else 0
print(f"\nwrote {os.path.basename(OUT_MUSIC)}")
print(f"  duration   : {msecs:.2f}s  (video {secs:.2f}s)")
print(f"  audio      : {astream.group(1)} {astream.group(2)} Hz {astream.group(3)}" if astream else "  audio: MISSING")
print(f"  music from : {MUSIC_START:.1f}s, normalised to {MUSIC_LUFS} LUFS")
print(f"  size       : {os.path.getsize(OUT_MUSIC)/1048576:.1f} MB")
