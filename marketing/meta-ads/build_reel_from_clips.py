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


def build():
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

    cmd += ["-filter_complex", ";".join(parts), "-map", f"[{prev}]", "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "19",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
            "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
            "-movflags", "+faststart", OUT]

    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:]); sys.exit(1)
    return acc


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
