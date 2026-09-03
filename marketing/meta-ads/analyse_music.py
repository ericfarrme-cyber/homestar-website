"""Catalogue the music library and find the best window in each track.

A Reel needs 15-25 seconds of bed that is loud, steady and does not open on a
near-silent intro. Picking that by ear is slow and easy to get wrong - Quiet
Neon opens about 12 dB under its own average, so starting at 0 would have
opened the Reel almost silent. This measures instead.

For each track it reports the loudest, steadiest window of a given length,
scored as (mean level) - (level variation), so a window that is loud but lurches
loses to one slightly quieter and even.

    python analyse_music.py [--window 20]

Writes MUSIC.md next to this script.
"""
import argparse, array, math, os, re, subprocess
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
MUSIC_DIR = os.path.join(REPO, "Pending", "music")
SR = 8000            # plenty for envelope work, and fast
HOP = 0.25           # seconds per envelope sample


def envelope(path):
    """Per-HOP RMS in dBFS across the whole track."""
    raw = subprocess.run(
        [FF, "-v", "quiet", "-i", path, "-f", "s16le", "-acodec", "pcm_s16le",
         "-ac", "1", "-ar", str(SR), "-"],
        capture_output=True).stdout
    a = array.array("h")
    a.frombytes(raw)
    n = int(SR * HOP)
    out = []
    for i in range(len(a) // n):
        c = a[i * n:(i + 1) * n]
        r = math.sqrt(sum(x * x for x in c) / len(c))
        out.append(20 * math.log10(r / 32768) if r > 0 else -90.0)
    return out


def best_window(env, seconds):
    """Highest (mean - spread) window. Spread is mean absolute deviation, which
    is less twitchy than stdev on short windows with one loud transient."""
    w = int(seconds / HOP)
    if len(env) <= w:
        return None
    best = None
    for i in range(len(env) - w):
        seg = env[i:i + w]
        m = sum(seg) / w
        spread = sum(abs(x - m) for x in seg) / w
        score = m - spread
        if best is None or score > best[0]:
            best = (score, i * HOP, m, spread)
    return best


def loudnorm(path):
    """Integrated LUFS and true peak, measured over the whole file."""
    err = subprocess.run(
        [FF, "-hide_banner", "-i", path, "-af", "loudnorm=print_format=json",
         "-f", "null", "-"], capture_output=True, text=True).stderr
    blocks = re.findall(r"\{[\s\S]*?\}", err)
    if not blocks:
        return None, None
    import json
    d = json.loads(blocks[-1])
    return float(d["input_i"]), float(d["input_tp"])


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--window", type=float, default=20.0)
    a = ap.parse_args()

    tracks = sorted(f for f in os.listdir(MUSIC_DIR) if f.lower().endswith((".mp3", ".wav", ".m4a")))
    rows = []
    for fn in tracks:
        p = os.path.join(MUSIC_DIR, fn)
        env = envelope(p)
        dur = len(env) * HOP
        bw = best_window(env, a.window)
        li, tp = loudnorm(p)
        opening = sum(env[:int(6 / HOP)]) / max(1, int(6 / HOP))
        overall = sum(env) / len(env)
        rows.append(dict(file=fn, dur=dur, lufs=li, tp=tp,
                         start=bw[1], wmean=bw[2], wspread=bw[3],
                         open_delta=opening - overall))
        r = rows[-1]
        print(f"{fn[:32]:32} {dur:6.1f}s  LUFS {li:6.1f}  TP {tp:5.1f}  "
              f"best {a.window:.0f}s @ {r['start']:6.1f}s "
              f"(mean {r['wmean']:6.1f} dB, spread {r['wspread']:4.1f})  "
              f"intro {r['open_delta']:+5.1f} dB vs avg")

    with open(os.path.join(HERE, "MUSIC.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write("# Music library\n\n")
        f.write("Beds for Reels. Files live in `Pending/music/` (gitignored - audio stays out of the repo).\n\n")
        f.write("**Licensing:** \"Quiet Neon\" is Eric's own Mureka track and is unconstrained. The rest\n")
        f.write("were added by Eric on 2026-09-03 and are assumed to be his own generated tracks too -\n")
        f.write("**worth confirming before any of them go anywhere other than Meta.** Meta Sound Collection\n")
        f.write("audio is licensed for Meta surfaces only and must never be used on a cut that also has to\n")
        f.write("serve YouTube or the website.\n\n")
        f.write(f"## Best {a.window:.0f}-second window per track\n\n")
        f.write("Scored as mean level minus level variation, so a loud but lurching window loses to a\n")
        f.write("slightly quieter, steadier one. `intro` is how far the first 6 seconds sit under the\n")
        f.write("track average - a large negative number means starting at 0 would open the Reel almost\n")
        f.write("silent, which is exactly the trap Quiet Neon sets.\n\n")
        f.write("| track | length | LUFS | true peak | best start | window mean | spread | intro vs avg |\n")
        f.write("|---|---|---|---|---|---|---|---|\n")
        for r in rows:
            f.write(f"| `{r['file']}` | {r['dur']:.0f}s | {r['lufs']:.1f} | {r['tp']:.1f} | "
                    f"**{r['start']:.1f}s** | {r['wmean']:.1f} dB | {r['wspread']:.1f} | "
                    f"{r['open_delta']:+.1f} dB |\n")
        f.write("\n## How to use\n\n")
        f.write("In a reel builder set `MUSIC_START` to the **best start** above and keep the existing\n")
        f.write("two-pass `loudnorm` to -20 LUFS. Always verify the finished mix per-second from decoded\n")
        f.write("PCM rather than trusting integrated loudness - an average happily reports a healthy\n")
        f.write("number for a file that is silent for its last two seconds.\n")
    print(f"\nwrote {os.path.join(HERE, 'MUSIC.md')}")
