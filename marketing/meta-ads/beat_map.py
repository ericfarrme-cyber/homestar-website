"""Measure a track so cuts can land on the music instead of near it.

The problem this solves
-----------------------
Every reel so far was cut to round numbers - 3.6s, 4.2s, 4.8s - chosen by eye
from the footage and then music was laid underneath. Sometimes that lands on
the beat and sometimes it does not, and nobody could tell which without
listening. Eric can hear it. I cannot.

I do not need to. A beat is a measurable event, and measuring it is strictly
more precise than hearing it: this reports the tempo, every beat, every bar
line, the downbeats, where the track changes section, and where its energy
jumps - all as timestamps accurate to a few milliseconds. A cut placed on one
of those numbers is on the beat by construction.

What it gives you
-----------------
    python beat_map.py "Coming Up.mp3"
    python beat_map.py "Coming Up.mp3" --start 0 --length 31 --hold 4

`--hold` is the interesting one. Give it a rough hold length in seconds and it
returns the nearest musically sensible cut points - bar lines where possible,
half-bars where a bar is too long - so a reel can be built from those numbers
rather than from round ones.

Writes a JSON map next to the track under `_beatmaps/` so the reel builders can
read it without re-analysing, and prints a human summary.
"""
import argparse
import json
import os
import sys

import numpy as np
import librosa

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "_beatmaps")
os.makedirs(CACHE, exist_ok=True)
DL = os.path.join(os.path.expanduser("~"), "Downloads")
SR = 22050          # plenty for beat work and four times faster than 44.1k


def resolve(name):
    """Accept a bare track name, a Downloads name, or a full path."""
    for cand in (name, os.path.join(DL, name), os.path.join(DL, name + ".mp3")):
        if os.path.exists(cand):
            return cand
    sys.exit("cannot find %s (looked in %s)" % (name, DL))


def analyse(path):
    y, sr = librosa.load(path, sr=SR, mono=True)
    dur = len(y) / sr

    onset_env = librosa.onset.onset_strength(y=y, sr=sr, aggregate=np.median)
    tempo, beat_frames = librosa.beat.beat_track(
        onset_envelope=onset_env, sr=sr, trim=False)
    tempo = float(np.atleast_1d(tempo)[0])
    beats = librosa.frames_to_time(beat_frames, sr=sr).tolist()

    # Downbeats: assume 4/4 and pick the phase whose beats carry the most onset
    # energy. Crude next to a trained downbeat model, but it only has to be
    # right about which of four beats feels like "one".
    strength = onset_env[beat_frames] if len(beat_frames) else np.array([])
    phase, best = 0, -1.0
    for p in range(4):
        s = float(strength[p::4].mean()) if len(strength[p::4]) else -1.0
        if s > best:
            phase, best = p, s
    downbeats = beats[phase::4]

    # Energy contour, and the biggest sustained lifts in it - a "drop" is just
    # the largest step change between two adjacent windows.
    hop = 512
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    rms_t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
    win = max(1, int(2.0 * sr / hop))          # two-second windows
    lifts = []
    for i in range(win, len(rms) - win):
        before = float(rms[i - win:i].mean())
        after = float(rms[i:i + win].mean())
        if before > 1e-6:
            lifts.append((20 * np.log10(after / before), float(rms_t[i])))
    lifts.sort(reverse=True)
    top_lifts = [{"db": round(d, 1), "at": round(t, 2)} for d, t in lifts[:6]]

    # Structural boundaries - where the track changes character.
    try:
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        bounds = librosa.segment.agglomerative(mfcc, 8)
        sections = librosa.frames_to_time(bounds, sr=sr).tolist()
    except Exception:
        sections = []

    return {
        "file": os.path.basename(path),
        "duration": round(dur, 2),
        "bpm": round(tempo, 1),
        "beat_seconds": round(60.0 / tempo, 4) if tempo else None,
        "bar_seconds": round(4 * 60.0 / tempo, 4) if tempo else None,
        "beats": [round(b, 3) for b in beats],
        "downbeats": [round(b, 3) for b in downbeats],
        "sections": [round(s, 2) for s in sections],
        "biggest_lifts": top_lifts,
    }


def cut_plan(m, start, length, hold):
    """Cut points from `start`, roughly `hold` apart, landing on the music.

    Prefers bar lines. If a bar is much longer than the hold asked for it falls
    back to half-bars, because a 15-second reel cut on 4-second bars only gets
    three shots.
    """
    bar = m["bar_seconds"] or 2.0
    grid = m["downbeats"] or m["beats"]
    if bar and hold < bar * 0.75:
        grid = m["beats"][::2] or grid          # half-bar grid
    grid = [g for g in grid if g >= start - 1e-6]

    cuts, t = [start], start
    while t < start + length and grid:
        target = t + hold
        nxt = min(grid, key=lambda g: abs(g - target))
        if nxt <= t + 0.05:
            after = [g for g in grid if g > t + 0.05]
            if not after:
                break
            nxt = after[0]
        if nxt > start + length + hold * 0.5:
            break
        cuts.append(round(nxt, 3))
        t = nxt
    spans = [round(cuts[i + 1] - cuts[i], 3) for i in range(len(cuts) - 1)]
    return cuts, spans


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("track")
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--length", type=float, default=30.0)
    ap.add_argument("--hold", type=float, default=4.0,
                    help="roughly how long each shot should be")
    ap.add_argument("--json", action="store_true", help="print the full map")
    args = ap.parse_args()

    path = resolve(args.track)
    cache = os.path.join(CACHE, os.path.splitext(os.path.basename(path))[0] + ".json")
    if os.path.exists(cache):
        m = json.load(open(cache, encoding="utf-8"))
        note = "(cached)"
    else:
        m = analyse(path)
        json.dump(m, open(cache, "w", encoding="utf-8"), indent=1)
        note = "(analysed)"

    print("%s %s" % (m["file"], note))
    print("  length      : %.1fs" % m["duration"])
    print("  tempo       : %.1f BPM   beat %.3fs   bar %.3fs"
          % (m["bpm"], m["beat_seconds"], m["bar_seconds"]))
    print("  beats found : %d   downbeats %d" % (len(m["beats"]), len(m["downbeats"])))
    if m["biggest_lifts"]:
        print("  biggest lifts:")
        for l in m["biggest_lifts"][:4]:
            print("      %+5.1f dB at %6.2fs" % (l["db"], l["at"]))
    if m["sections"]:
        print("  sections    : " + ", ".join("%.1f" % s for s in m["sections"]))

    cuts, spans = cut_plan(m, args.start, args.length, args.hold)
    print("\n  cut plan from %.2fs, %d shots, target hold %.1fs:"
          % (args.start, max(0, len(cuts) - 1), args.hold))
    for i, sp in enumerate(spans):
        print("      shot %d  start %6.3fs  hold %.3fs" % (i + 1, cuts[i], sp))
    if spans:
        print("      total %.2fs" % sum(spans))
    if args.json:
        print(json.dumps(m, indent=1)[:4000])


if __name__ == "__main__":
    main()
