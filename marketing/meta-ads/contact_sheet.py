"""Build a labelled contact sheet from a video so footage gets judged by what it
shows, not by its file properties.

Written after two mistakes on the same archive: three Carmel clips were nearly
discarded on resolution without anyone looking at them, and a sharpness scan was
misread as "the footage goes soft" when the camera was simply crossing plain
dark floor tile. Both would have been caught by looking at frames first.

    python contact_sheet.py <video> [more videos...] [--every 2.5] [--cols 6]

Writes <name>-sheet.jpg next to the script's _sheets/ directory and prints the
paths. ffmpeg applies the display matrix on decode, so rotated phone footage
comes out the right way up without special handling.
"""
import argparse, os, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageDraw

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "_sheets")


def duration(path):
    err = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    import re
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    if not m:
        sys.exit(f"could not read duration: {path}")
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))


def sheet(path, every, cols, width):
    os.makedirs(OUT_DIR, exist_ok=True)
    name = os.path.splitext(os.path.basename(path))[0]
    tmp = os.path.join(OUT_DIR, f"_{name}")
    os.makedirs(tmp, exist_ok=True)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))

    dur = duration(path)
    times = [t * every for t in range(int(dur / every) + 1)]
    for i, t in enumerate(times):
        subprocess.run([FF, "-y", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", path,
                        "-frames:v", "1", "-vf", f"scale={width}:-1",
                        os.path.join(tmp, f"f{i:03d}.png")], check=False)

    frames = sorted(f for f in os.listdir(tmp) if f.endswith(".png"))
    if not frames:
        sys.exit(f"no frames extracted: {path}")
    ims = [Image.open(os.path.join(tmp, f)).convert("RGB") for f in frames]
    w, h = ims[0].size
    rows = (len(ims) + cols - 1) // cols
    out = Image.new("RGB", (cols * w, rows * (h + 20)), (18, 18, 18))
    d = ImageDraw.Draw(out)
    for i, im in enumerate(ims):
        x, y = (i % cols) * w, (i // cols) * (h + 20)
        out.paste(im.resize((w, h)), (x, y))
        d.text((x + 5, y + h + 5), f"{times[i]:.1f}s", fill=(255, 220, 120))

    dst = os.path.join(OUT_DIR, f"{name}-sheet.jpg")
    out.save(dst, "JPEG", quality=90)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    return dst, dur, len(ims)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("videos", nargs="+")
    ap.add_argument("--every", type=float, default=2.5, help="seconds between frames")
    ap.add_argument("--cols", type=int, default=6)
    ap.add_argument("--width", type=int, default=300)
    a = ap.parse_args()
    for v in a.videos:
        dst, dur, n = sheet(v, a.every, a.cols, a.width)
        print(f"{os.path.basename(v):46} {dur:6.1f}s  {n:3d} frames  ->  {dst}")
