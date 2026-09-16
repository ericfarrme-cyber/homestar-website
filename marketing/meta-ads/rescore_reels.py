"""Swap the music bed on a finished reel, keeping the picture untouched.

The reels in `renders/` are already muxed with a track. Re-rendering them to try
a different bed would re-encode the video for no reason; this copies the video
stream and builds a fresh audio track beside it, which takes seconds and cannot
degrade the picture.

Everything about the audio matches build_progress.add_music: same 1.2s in /
2.2s out fades, same two-pass loudnorm to -20 LUFS, same AAC settings. A reel
scored here and a reel scored there should sit at the same level in the feed.

Start times come from MUSIC.md - the loudest, steadiest window in each track.
Six of the eight new tracks open more than 5 dB under their own average, so
starting at 0 would open a reel almost silent.

    python rescore_reels.py              # write previews for everything below
    python rescore_reels.py F8 FD        # only those

Previews land in `renders/previews/` and are not the files the queue publishes.
Swapping one in is a deliberate second step - see promote() at the bottom.
"""
import json
import os
import re
import subprocess
import sys

import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
MUSIC_DIR = os.path.join(REPO, "Pending", "music")
RENDERS = os.path.join(HERE, "renders")
OUT_DIR = os.path.join(RENDERS, "previews")

FADE_IN, FADE_OUT = 1.2, 2.2
MUSIC_LUFS = -20

# reel -> (file stem, track, start seconds, why this pairing)
PAIRINGS = {
    "F8": ("F8-geist-upper-level-progress", "Foundations.mp3", 51.8,
           "Mid-job progress cut. Foundations builds rather than arrives, which "
           "suits a reel that ends before the room is finished."),
    "FD": ("FD-fishers-full-gut-walk-in", "Key Handover.mp3", 117.2,
           "Full arc, gut to finished. Key Handover is the steadiest window in "
           "the library (0.8 dB spread) and lands where the reel does."),
    "FO": ("FO-six-floors", "Open House.mp3", 50.5,
           "Six floors in a row, ends on a question. Open House is even and "
           "unfussy so the cuts carry the rhythm, not the track."),
    "F6": ("F6-geist-three-bath-beforeafter", "Where Are You Now.mp3", 142.0,
           "Three bathrooms, before and after. Loudest window we have; the "
           "reveals need the lift."),
    "FE": ("FE-carmel-double-shower", "Glass Veranda.mp3", 73.2,
           "Single room, close detail. Glass Veranda is the quietest of the "
           "five and stays out of the way."),
}


def probe_len(path):
    err = subprocess.run([FF, "-hide_banner", "-i", path],
                         capture_output=True, text=True).stderr
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    if not m:
        sys.exit("could not read duration: %s" % path)
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))


def rescore(stem, track, start):
    video = os.path.join(RENDERS, stem + "--reels-upload.mp4")
    music = os.path.join(MUSIC_DIR, track)
    for p in (video, music):
        if not os.path.exists(p):
            sys.exit("missing: %s" % p)

    length = probe_len(video)
    shape = (f"afade=t=in:st=0:d={FADE_IN},"
             f"afade=t=out:st={max(0.0, length - FADE_OUT):.2f}:d={FADE_OUT}")
    norm = f"loudnorm=I={MUSIC_LUFS}:TP=-1.5:LRA=11"

    # First pass measures the chosen window so the second pass can land on the
    # target instead of guessing at it - a bed that drifts 3 dB between reels is
    # audible when two of them play back to back.
    probe_r = subprocess.run(
        [FF, "-hide_banner", "-ss", f"{start}", "-t", f"{length:.2f}", "-i", music,
         "-af", f"{shape},{norm}:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True)
    blocks = re.findall(r"\{[\s\S]*?\}", probe_r.stderr)
    if blocks:
        d = json.loads(blocks[-1])
        norm += (f":measured_I={d['input_i']}:measured_TP={d['input_tp']}"
                 f":measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}"
                 f":offset={d['target_offset']}:linear=true")

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, "%s--%s.mp4" % (stem, os.path.splitext(track)[0].lower().replace(" ", "-")))
    r = subprocess.run(
        [FF, "-y", "-hide_banner", "-loglevel", "error",
         "-i", video, "-ss", f"{start}", "-t", f"{length:.2f}", "-i", music,
         "-filter_complex", f"[1:a]{shape},{norm},aresample=48000[a]",
         "-map", "0:v", "-map", "[a]",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
         "-shortest", "-movflags", "+faststart", out],
        capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2000:])
        sys.exit("ffmpeg failed on %s" % stem)
    return out, length


def promote(preview):
    """Make a preview the file the queue publishes.

    Deliberately separate from rescore(): ig-queue.json points at the repo copy
    by raw URL, and a reel already scheduled on the Facebook Page keeps whatever
    file it was scheduled with. Swapping the repo file changes Instagram only -
    the Page post has to be rescheduled by hand.
    """
    stem = os.path.basename(preview).split("--")[0]
    target = os.path.join(RENDERS, stem + "--reels-upload.mp4")
    os.replace(preview, target)
    return target


if __name__ == "__main__":
    keys = [a.upper() for a in sys.argv[1:]] or list(PAIRINGS)
    for key in keys:
        if key not in PAIRINGS:
            sys.exit("unknown reel %s - known: %s" % (key, ", ".join(PAIRINGS)))
        stem, track, start, why = PAIRINGS[key]
        out, length = rescore(stem, track, start)
        print("%-3s %-28s %5.1fs  <- %s @ %.1fs" %
              (key, os.path.basename(out)[:28], length, track, start))
        print("    %s" % why)
    print("\npreviews in %s" % OUT_DIR)
