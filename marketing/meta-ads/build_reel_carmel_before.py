"""FF - Carmel whole home, the before reel.

Cut from the walkthrough footage Eric shot on 29 Sep 2026, the day before the
job starts. There is no after yet, and that is the point: this is the
anticipation piece, and the end card asks people to come back for part two.

Why these shots, in this order:

  The footage is already a sequence. Eric filmed the truck pulling up, the walk
  down the drive, the front door, and then room after room without stopping, so
  the reel barely has to construct anything - it follows him in.

  The primary bath lands last and gets the longest hold. Carpet running up to a
  corner jetted tub is the most arresting thing in the house, and the bathroom
  reels have already trained this audience to care about exactly that.

Music is "Coming Up", started at 0. That track opens about 17 dB under its own
body and lifts hard at 2.0s - the sharpest entrance of the four Eric added -
so the front door opens on the lift rather than somewhere in the middle of it.

    python build_reel_carmel_before.py
"""
"""
Re-cut 2026-09-29 after Eric watched the first pass: "I dont like Robb in the
kitchen video. Also it feels rushed."

  Robb walks into the kitchen shot at about 114s and is out again by 130s, so
  the kitchen now starts at 109.4s and ends before he arrives.

  On the pacing: holds went from ~2.4s to ~3.8s and the dissolves from 0.4s to
  0.6s. Fewer, slower changes - the footage is a walk through a quiet empty
  house and it should feel like one.
"""
import json, os, re, subprocess, sys
import imageio_ffmpeg
from PIL import Image

import build_ads as BRAND
import build_video_ads as V

FF = imageio_ffmpeg.get_ffmpeg_exe()
DL = r"C:\Users\ericf\Downloads\Carmel Whole Home Remodel"
V1 = os.path.join(DL, "20260929_114817_920.mp4")   # truck arriving, 9.1s
V2 = os.path.join(DL, "20260929_114821_670.mp4")   # the long walk-in, 137.8s
V4 = os.path.join(DL, "20260929_114939_017.mp4")   # back hall and laundry, 43.3s
V5 = os.path.join(DL, "20260929_114954_996.mp4")   # primary bath, 55.2s

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "renders")
os.makedirs(OUT_DIR, exist_ok=True)
OUT = os.path.join(OUT_DIR, "FF-carmel-whole-home-before--reels-video.mp4")
OUT_MUSIC = os.path.join(OUT_DIR, "FF-carmel-whole-home-before--reels-upload.mp4")

W, H, FPS = 1080, 1920, 30
XFADE = 0.6

MUSIC = os.path.join(os.path.expanduser("~"), "Downloads", "Coming Up.mp3")
MUSIC_LUFS = -20
FADE_IN, FADE_OUT = 1.2, 2.2

# ── beat lock ────────────────────────────────────────────────────────────────
# `beat_map.py` measured Coming Up at 129.2 BPM, one bar = 1.858s, and wrote
# every downbeat to _beatmaps/. Cuts are taken from that grid rather than from
# round numbers, so every change of shot lands on a downbeat by construction.
#
# The music starts at the track's first clean downbeat (1.927s) so that video
# time 0 IS a downbeat - otherwise the whole grid sits at an offset and nothing
# lines up.
BEATMAP = os.path.join(HERE, "_beatmaps", "Coming Up.json")
MUSIC_START = 1.927

# Bars per shot. 2 is the base hold; the kitchen gets 3 because it is the room
# the reel is really about, and a longer hold still lands on the grid.
SHOT_BARS = [2, 2, 2, 3, 2, 2, 2]

# (source, start, note) - the hold is no longer chosen here, the music sets it.
SHOTS = [
    (V1,   1.00, "truck at the kerb, walking up"),
    (V2,  19.80, "front door, the hello mat, stepping in"),
    (V2,  30.40, "entry, oak stair, carpet runner"),
    (V2, 132.00, "kitchen, under-cabinet lights on - three bars, the hero shot"),
    # The walk-in is 23-27s: through the doorway, the room opening up, window
    # and washer coming into view. Past 28s the camera has settled on the
    # counter and it is just a close-up of cabinet doors.
    (V4,  23.00, "walking into the laundry - blue walls, white laminate"),
    (V5,   2.60, "primary bath wide - carpet to the tub deck"),
    (V5,  27.20, "the fibreglass shower - brass handheld, framed glass"),
]


def beat_locked_segments():
    """Turn the bar counts into cut times taken from the measured downbeats.

    xfade means the visible cut sits at the cumulative boundary, and the
    builder's arithmetic is  cumulative = sum(durations) - n*XFADE.  So each
    duration is its musical hold plus one XFADE, which puts every boundary
    exactly on a downbeat.
    """
    m = json.load(open(BEATMAP, encoding="utf-8"))
    downs = [d for d in m["downbeats"] if d >= MUSIC_START - 1e-6]
    if len(downs) < sum(SHOT_BARS) + 1:
        sys.exit("beat map does not reach far enough for %d bars" % sum(SHOT_BARS))

    cuts, idx = [0.0], 0
    for bars in SHOT_BARS:
        idx += bars
        cuts.append(round(downs[idx] - MUSIC_START, 3))

    segs = []
    for i, (src, ss, note) in enumerate(SHOTS):
        hold = cuts[i + 1] - cuts[i]
        segs.append((src, ss, round(hold + XFADE, 3), note, round(cuts[i], 3), round(hold, 3)))
    return segs, cuts, m


SEG_FULL, CUTS, BEATMAP_DATA = beat_locked_segments()
SEGMENTS = [(s, ss, dur, note) for s, ss, dur, note, _, _ in SEG_FULL]

AD = {
    "hook":     "The last day this house looks like this.",
    # Was "That is carpet. In the bathroom." - Eric pulled it 2026-09-29 as a
    # joke at the homeowner's expense. This one respects the house, which is
    # genuinely well built, and still names the job.
    "beat":     "Good bones. Every finish original.",
    "end_head": "Whole home. Carmel.",
    "end_sub":  "Every surface. Follow to see what it becomes.",
    "cta":      "GET A FREE ESTIMATE",
    "badge_r":  "5.0 \u2605 GOOGLE",
}

# Hook and beat are anchored to the grid too: the hook clears on the cut into
# the entry, and the line rides the whole three-bar kitchen hold.
HOOK_OUT = CUTS[2] - 0.10
BEAT_IN = CUTS[3] + 0.45
BEAT_OUT = CUTS[4] - 0.75
HOOK_FADE_IN, HOOK_FADE_OUT = 0.80, 0.75
BEAT_FADE_IN, BEAT_FADE_OUT = 0.75, 0.85
END_DUR = 3.4

LOGO_PNG = os.path.join(HERE, "_carmel_chrome.png")
HOOK_PNG = os.path.join(HERE, "_carmel_hook.png")
BEAT_PNG = os.path.join(HERE, "_carmel_beat.png")
END_PNG = os.path.join(HERE, "_carmel_end.png")


def make_logo_plate():
    # use_format binds W/H/SAFE_TOP inside build_video_ads; the plate builders
    # read those globals, and they are None until this is called.
    V.use_format("reels")
    assert (V.W, V.H) == (W, H), f"format mismatch: {(V.W, V.H)} vs {(W, H)}"
    V.plate_chrome(AD, LOGO_PNG)
    return LOGO_PNG


def make_beat_plate():
    from PIL import ImageDraw as _D
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
    make_logo_plate()
    V.plate_hook(AD, HOOK_PNG)
    make_beat_plate()
    V.plate_endcard(AD, END_PNG)

    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error"]
    for src, ss, dur, _ in SEGMENTS:
        cmd += ["-ss", f"{ss:.2f}", "-t", f"{dur:.2f}", "-i", src]

    parts = []
    for i, (_, _, dur, _) in enumerate(SEGMENTS):
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
    parts.append(
        f"[{n+2}:v]format=rgba,"
        f"fade=t=in:st={BEAT_IN:.2f}:d={BEAT_FADE_IN}:alpha=1,"
        f"fade=t=out:st={BEAT_OUT:.2f}:d={BEAT_FADE_OUT}:alpha=1[bt]")

    parts.append(f"[{prev}][lg]overlay=0:0[v1]")
    parts.append(f"[v1][hk]overlay=0:0[v2]")
    parts.append(f"[v2][bt]overlay=0:0[v3]")
    parts.append(f"[{n+3}:v]scale={W}:{H},fps={FPS},format=yuv420p,setsar=1[ec]")
    parts.append(
        f"[v3][ec]xfade=transition=fade:duration=0.5:offset={body - 0.5:.3f}[vout]")

    cmd += ["-filter_complex", ";".join(parts), "-map", "[vout]",
            "-c:v", "libx264", "-preset", "slow", "-crf", "19",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", OUT]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-3000:])
        sys.exit(1)
    return body + END_DUR - 0.5


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
        print(r.stderr[-2500:])
        sys.exit(1)


expected = build()
info = subprocess.run([FF, "-hide_banner", "-i", OUT], capture_output=True, text=True).stderr
dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
dims = re.search(r"Video: .*?, (\d+)x(\d+)", info)
secs = int(dur.group(2)) * 60 + float(dur.group(3)) if dur else 0
print(f"wrote {os.path.basename(OUT)}")
print(f"  dimensions : {dims.group(1)}x{dims.group(2)}" if dims else "  dimensions : ?")
print(f"  duration   : {secs:.2f}s  (expected {expected:.2f}s)")
print(f"  size       : {os.path.getsize(OUT)/1048576:.1f} MB")
print(f"  beat lock  : {BEATMAP_DATA['bpm']} BPM, bar {BEATMAP_DATA['bar_seconds']}s, "
      f"music from {MUSIC_START}s")
for i, (src, ss, dur_, note, cut, hold) in enumerate(SEG_FULL, 1):
    bars = SHOT_BARS[i - 1]
    print(f"  {i}. {os.path.basename(src)[-10:-4]}  src {ss:6.1f}s  "
          f"cut@{cut:6.3f}s  hold {hold:.3f}s ({bars} bars)  {note}")
add_music(secs)
print(f"wrote {os.path.basename(OUT_MUSIC)} with Coming Up @ {MUSIC_START:.1f}s")
