"""Read the lyrics of a track, with timestamps.

`beat_map.py` answers "where are the beats". This answers "what is it saying,
and when" - which matters for two reasons Eric raised:

  1. A lyric can contradict the picture. A line about leaving lands badly over
     a family's new kitchen, and nobody notices until it is posted.
  2. The best place for on-screen text is usually where a lyric lands, not on
     an arbitrary downbeat.

Sung vocals are harder than speech, so treat the transcript as a good draft
rather than gospel - the timings are reliable, the words less so, and anything
the model was unsure about is flagged.

    python lyrics_map.py "Coming Up.mp3"
    python lyrics_map.py "Coming Up.mp3" --window 0 32

Writes JSON beside the beat maps so the builders can read both.
"""
import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "_beatmaps")
os.makedirs(CACHE, exist_ok=True)
DL = os.path.join(os.path.expanduser("~"), "Downloads")


def resolve(name):
    for cand in (name, os.path.join(DL, name), os.path.join(DL, name + ".mp3")):
        if os.path.exists(cand):
            return cand
    sys.exit("cannot find %s" % name)


def decode(path, sr=16000):
    """16 kHz mono float32, decoded by ffmpeg.

    faster-whisper's own loader goes through PyAV, and the PyAV installed here
    rejects the keyword it passes (`metadata_errors`). Decoding with the ffmpeg
    binary we already ship for every other job avoids the version fight
    entirely, and transcribe() accepts a numpy array directly.
    """
    import subprocess
    import numpy as np
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run(
        [ff, "-v", "quiet", "-i", path, "-f", "s16le", "-acodec", "pcm_s16le",
         "-ac", "1", "-ar", str(sr), "-"],
        capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype("float32") / 32768.0


def transcribe(path, model_size="small"):
    from faster_whisper import WhisperModel
    # int8 on CPU: a few times faster than float32 and accurate enough for
    # lyrics, where the limiting factor is singing, not quantisation.
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        decode(path), language="en", word_timestamps=True,
        vad_filter=True, beam_size=5)

    lines = []
    for seg in segments:
        words = [{"w": w.word.strip(), "t": round(w.start, 2),
                  "p": round(w.probability, 2)}
                 for w in (seg.words or []) if w.word.strip()]
        lines.append({
            "start": round(seg.start, 2),
            "end": round(seg.end, 2),
            "text": seg.text.strip(),
            "confidence": round(sum(w["p"] for w in words) / len(words), 2) if words else None,
            "words": words,
        })
    return {"file": os.path.basename(path),
            "language": info.language,
            "model": model_size,
            "lines": lines}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("track")
    ap.add_argument("--model", default="small",
                    help="tiny/base/small/medium - bigger is slower and better")
    ap.add_argument("--window", nargs=2, type=float, metavar=("FROM", "TO"),
                    help="only print lines inside this range")
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()

    path = resolve(args.track)
    cache = os.path.join(
        CACHE, os.path.splitext(os.path.basename(path))[0] + ".lyrics.json")

    if os.path.exists(cache) and not args.refresh:
        d = json.load(open(cache, encoding="utf-8"))
        note = "(cached)"
    else:
        d = transcribe(path, args.model)
        json.dump(d, open(cache, "w", encoding="utf-8"), indent=1)
        note = "(transcribed with %s)" % args.model

    print("%s %s" % (d["file"], note))
    lo, hi = (args.window if args.window else (0.0, 1e9))
    shown = 0
    for ln in d["lines"]:
        if ln["end"] < lo or ln["start"] > hi:
            continue
        shown += 1
        flag = ""
        if ln["confidence"] is not None and ln["confidence"] < 0.6:
            flag = "   <- low confidence, check by ear"
        print("  %6.2f - %6.2f  %s%s" % (ln["start"], ln["end"], ln["text"], flag))
    if not shown:
        print("  (no vocal detected in that range - instrumental)")


if __name__ == "__main__":
    main()
