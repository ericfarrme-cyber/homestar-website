"""
Cut a 9:16 "middle of the job" Reel — in-progress footage, no before/after.

Same brand furniture as build_beforeafter.py (chrome, hook, beat, end card) but
without the BEFORE/AFTER pills, because there is nothing to contrast; the whole
point is the part of the job nobody photographs.

    python build_progress.py <key>
    python build_progress.py --list

Renders SILENT, then adds music in a second pass.
"""
import argparse, json, os, re, subprocess, sys
import imageio_ffmpeg
from PIL import Image, ImageFilter

import build_ads as BRAND
import build_video_ads as V

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
NEW = os.path.join(REPO, "Pending", "new in progress")
MUSIC_DIR = os.path.join(REPO, "Pending", "music")
OUT_DIR = os.path.join(HERE, "renders")

W, H, FPS = 1080, 1920, 30
XFADE = 0.4
END_DUR = 3.6
HOOK_FADE_IN, HOOK_FADE_OUT = 0.80, 0.75
BEAT_FADE_IN, BEAT_FADE_OUT = 0.75, 0.85
MUSIC_LUFS = -20
FADE_IN, FADE_OUT = 1.2, 2.2

G = lambda n: os.path.join(NEW, n)

PROJECTS = {
    # Every window below was chosen to contain NO PEOPLE. The crew appear in
    # roughly a third of this footage and Eric asked what is left without them;
    # the answer is 38.8s of the 60.3s shot, including the best material. Ranges
    # were mapped at 1-second resolution off contact sheets:
    #   geist upper level.mp4     clear 4.6-14.6
    #   geist upper level 1.mp4   clear 0-3.5, 11.8-14.0
    #   geist upper level 2.mp4   clear 0-11.5, 13.6-16.8
    #   geist upper level(1).mp4  clear 0-1.8, 4.0-10.6
    "geist-progress": dict(
        out="F8-geist-upper-level-progress",
        slug="geist-upper-level-remodel",
        music=("Brisa de Nylon.mp3", 48.8),
        ad={
            # The beat has to describe what is actually on screen when it appears.
            # It first read "Every baluster, taped by hand" - true of the footage under
            # the HOOK, but the beat lands over the stair treads, so the line was
            # describing a shot the viewer was no longer looking at.
            "hook":     "Nobody posts this part.",
            "beat":     "Rebuilt one tread at a time.",
            "end_head": "This is what careful looks like.",
            "end_sub":  "Schluter Pro Certified. Whole-home remodels across Hamilton County.",
            "cta":      "GET A FREE ESTIMATE",
            "badge_r":  "5.0 ★ GOOGLE",
        },
        segments=[
            (G("geist upper level 1.mp4"), 12.0, 2.0, "masked balusters, floor papered"),
            (G("geist upper level.mp4"),    7.6, 3.0, "applied wall panelling, glue still showing"),
            (G("geist upper level 2.mp4"),  2.2, 3.2, "new white oak treads going in"),
            (G("geist upper level 2.mp4"),  7.6, 3.0, "treads against the panelled wall"),
            (G("geist upper level.mp4"),   12.4, 2.2, "hallway, staircase framed out"),
            (G("geist upper level(1).mp4"), 4.6, 3.4, "the landing, finished"),
        ],
    ),

    # The Schluter story, which no finished photo can tell. Every project page
    # claims the complete system and a 25-year warranty, and every finished
    # photo hides it under tile. noblesville bathroom 3 is the only footage in
    # the library where the membrane is actually on camera.
    #
    # Copy deliberately does NOT name the membranes. The orange is
    # unmistakably Schluter Ditra, but the green sheet on the shower wall is
    # not identifiable from the frame and could be another manufacturer.
    # "Schluter Pro Certified" sits in the end_sub as a certification
    # statement, which is verifiable, rather than as a product ID of a sheet
    # nobody has confirmed. Worth asking Eric what the green is - if it is
    # Kerdi, "orange for floors, green for walls" is a better beat.
    #
    # People: noblesville bathroom 2 has a hand in frame 8-10s. Avoided.
    "noblesville-progress": dict(
        out="F9-noblesville-waterproofing-progress",
        slug="floor-to-ceiling-tile-noblesville",
        music=("Before _ After (1).mp3", 83.8),
        ad={
            "hook":     "Under every tile we set.",
            "beat":     "Waterproofed before a single tile goes on.",
            "end_head": "That's the 25-year warranty.",
            "end_sub":  "Schluter Pro Certified. Bathrooms in Hamilton County - $15K to $50K.",
            "cta":      "GET A FREE ESTIMATE",
            "badge_r":  "5.0 ★ GOOGLE",
        },
        segments=[
            (G("noblesville bathroom 3.mp4"), 0.4, 3.2, "membrane sheets stacked, room stripped back"),
            (G("noblesville bathroom 3.mp4"), 5.4, 3.4, "waterproofing taped up the shower wall"),
            (G("noblesville bathroom.mp4"),   0.6, 3.0, "tile going on over it, laser line, levelling clips"),
            (G("noblesville bathroom 2.mp4"), 11.4, 3.0, "close on the wedges holding every joint flat"),
            (G("noblesville bathroom.mp4"),   5.0, 3.4, "floor and wall, joints lining through"),
        ],
    ),
}



def _strip_rotation(path):
    """Remove any inherited display-matrix rotation from a finished file.

    ffmpeg auto-rotates on decode, so the filtered pixels are already upright -
    but the rotation flag from the source stream sometimes rides through
    filter_complex onto the output, and a player then rotates the upright
    pixels again. It is inconsistent: an identical code path produced a clean
    file for one project and a -90 flag for the next.

    `-display_rotation 0` on the *input* of a stream-copy remux clears it.
    Setting `rotate=0` metadata or `-map_metadata -1` does not - both were
    tried and left the flag in place.
    """
    tmp = path + ".rot.mp4"
    r = subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error",
                        "-display_rotation", "0", "-i", path,
                        "-c", "copy", "-movflags", "+faststart", tmp],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-1500:]); sys.exit(1)
    os.replace(tmp, path)


def _assert_upright(path, w=1080, h=1920):
    """Decode a real frame and check it comes out portrait.

    Dimensions reported by the container are not enough - a 1080x1920 file
    carrying a 90-degree rotation flag decodes to 1920x1080 and publishes
    sideways. This checks the pixels a viewer actually gets.
    """
    from PIL import Image as _I
    q = path + ".probe.png"
    subprocess.run([FF, "-y", "-loglevel", "error", "-ss", "1", "-i", path,
                    "-frames:v", "1", q], check=False)
    if not os.path.exists(q):
        sys.exit(f"could not decode a frame from {path}")
    got = _I.open(q).size
    os.remove(q)
    if got != (w, h):
        sys.exit(f"ORIENTATION FAULT: {os.path.basename(path)} decodes to "
                 f"{got[0]}x{got[1]}, expected {w}x{h}")
    return got


def plates(cfg, tag):
    ad = cfg["ad"]
    p = lambda n: os.path.join(HERE, f"_{tag}_{n}.png")
    logo, hook, beat, end = p("chrome"), p("hook"), p("beat"), p("end")

    V.use_format("reels")
    assert (V.W, V.H) == (W, H), f"format mismatch: {(V.W, V.H)} vs {(W, H)}"

    V.plate_chrome({"badge_r": ad["badge_r"]}, logo)
    plate = Image.open(logo).convert("RGBA")
    shadow = Image.new("RGBA", plate.size, (0, 0, 0, 0))
    shadow.putalpha(plate.getchannel("A").point(lambda a: int(a * 0.55)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    comp = Image.new("RGBA", plate.size, (0, 0, 0, 0))
    comp.alpha_composite(shadow, (0, 3))
    comp.alpha_composite(plate)
    comp.save(logo)

    V.plate_hook(ad, hook)
    V.plate_endcard(ad, end)

    img, d = V._layer()
    Sx = BRAND.S
    pad = int(56 * Sx)
    f, lines, tr = BRAND.fit_lines(d, ad["beat"], "ExtraBold", V.W * Sx - pad * 2,
                                   max_px=int(58 * Sx), min_px=int(36 * Sx), max_lines=2)
    lh = int(f.size * 1.06)
    y = (V.H - V.SAFE_BOTTOM) * Sx - int(40 * Sx) - lh * len(lines)
    scrim_top = max(y - int(130 * Sx), 0)
    grad = BRAND.vgradient(V.W, (V.H * Sx - scrim_top) // Sx, BRAND.NAVY_DARK, 0, 244, ease=1.15)
    img.alpha_composite(grad.resize((V.W * Sx, V.H * Sx - scrim_top), Image.BILINEAR), (0, scrim_top))
    d.rectangle([pad, y - int(30 * Sx), pad + int(74 * Sx), y - int(23 * Sx)], fill=BRAND.GREEN + (255,))
    for ln in lines:
        V._shadowed(d, (pad, y), ln, f, tr, Sx)
        y += lh
    V._down(img, beat)
    return logo, hook, beat, end


def build(key):
    cfg = PROJECTS[key]
    segs = cfg["segments"]
    for src, *_ in segs:
        if not os.path.exists(src):
            sys.exit(f"missing source: {src}")
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, cfg["out"] + "--reels-video.mp4")
    logo, hook_p, beat_p, end_p = plates(cfg, key)

    body, t = 0.0, 0.0
    for _, _, dur, _ in segs:
        body = t + dur
        t += dur - XFADE
    hook_out = min(4.2, body - 1.0)
    beat_in = hook_out + 1.6
    beat_out = min(beat_in + 4.4, body - 0.4)

    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error"]
    for src, ss, dur, _ in segs:
        cmd += ["-ss", f"{ss:.2f}", "-t", f"{dur:.2f}", "-i", src]

    parts = []
    for i, (_, _, dur, _) in enumerate(segs):
        parts.append(
            f"[{i}:v]scale={W}:{H}:force_original_aspect_ratio=increase:"
            f"out_range=tv:flags=lanczos,crop={W}:{H},"
            f"fps={FPS},format=yuv420p,setsar=1[s{i}]")
    prev, acc = "s0", segs[0][2]
    for i in range(1, len(segs)):
        parts.append(f"[{prev}][s{i}]xfade=transition=fade:duration={XFADE}:offset={acc - XFADE:.3f}[x{i}]")
        acc += segs[i][2] - XFADE
        prev = f"x{i}"

    n = len(segs)
    for src, dur in ((logo, body), (hook_p, body), (beat_p, body), (end_p, END_DUR)):
        cmd += ["-loop", "1", "-t", f"{dur:.2f}", "-i", src]
    parts.append(f"[{n}:v]format=rgba,fade=t=in:st=0.25:d=0.7:alpha=1[lg]")
    parts.append(f"[{n+1}:v]format=rgba,fade=t=in:st=0.30:d={HOOK_FADE_IN}:alpha=1,"
                 f"fade=t=out:st={hook_out:.2f}:d={HOOK_FADE_OUT}:alpha=1[hk]")
    parts.append(f"[{n+2}:v]format=rgba,fade=t=in:st={beat_in:.2f}:d={BEAT_FADE_IN}:alpha=1,"
                 f"fade=t=out:st={beat_out - BEAT_FADE_OUT:.2f}:d={BEAT_FADE_OUT}:alpha=1[bt]")
    parts.append(f"[{n+3}:v]scale={W}:{H},fps={FPS},format=yuv420p,setsar=1[ec]")
    parts.append(f"[{prev}][lg]overlay=0:0:format=auto[o1]")
    parts.append("[o1][hk]overlay=0:0:format=auto[o2]")
    parts.append("[o2][bt]overlay=0:0:format=auto[o3]")
    parts.append("[o3]format=yuv420p[bod]")
    parts.append(f"[bod][ec]xfade=transition=fade:duration={XFADE}:offset={body - XFADE:.3f}[out]")

    cmd += ["-filter_complex", ";".join(parts), "-map", "[out]", "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "19",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
            "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
            "-movflags", "+faststart", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:]); sys.exit(1)
    _strip_rotation(out)
    _assert_upright(out)
    return out, body + END_DUR - XFADE, (hook_out, beat_in, beat_out)


def add_music(cfg, video, video_len):
    name, start = cfg["music"]
    music = os.path.join(MUSIC_DIR, name)
    if not os.path.exists(music):
        sys.exit(f"missing music: {music}")
    out = video.replace("--reels-video.mp4", "--reels-video-music.mp4")
    shape = (f"afade=t=in:st=0:d={FADE_IN},"
             f"afade=t=out:st={max(0.0, video_len - FADE_OUT):.2f}:d={FADE_OUT}")
    norm = f"loudnorm=I={MUSIC_LUFS}:TP=-1.5:LRA=11"
    probe_r = subprocess.run(
        [FF, "-hide_banner", "-ss", f"{start}", "-t", f"{video_len:.2f}", "-i", music,
         "-af", f"{shape},{norm}:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True)
    blocks = re.findall(r"\{[\s\S]*?\}", probe_r.stderr)
    if blocks:
        d = json.loads(blocks[-1])
        norm += (f":measured_I={d['input_i']}:measured_TP={d['input_tp']}"
                 f":measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}"
                 f":offset={d['target_offset']}:linear=true")
    af = f"{shape},{norm},aresample=48000"
    r = subprocess.run(
        [FF, "-y", "-hide_banner", "-loglevel", "error",
         "-i", video, "-ss", f"{start}", "-t", f"{video_len:.2f}", "-i", music,
         "-filter_complex", f"[1:a]{af}[a]", "-map", "0:v", "-map", "[a]",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
         "-shortest", "-movflags", "+faststart", out],
        capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:]); sys.exit(1)
    _strip_rotation(out)
    _assert_upright(out)
    return out


def probe(path):
    err = subprocess.run([FF, "-hide_banner", "-i", path], capture_output=True, text=True).stderr
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    dims = re.search(r"Video: .*?, (\d+)x(\d+)", err)
    return (int(dur.group(2)) * 60 + float(dur.group(3)) if dur else 0.0,
            (dims.group(1), dims.group(2)) if dims else ("?", "?"), err)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("key", nargs="?")
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()
    if a.list or not a.key:
        for k, c in PROJECTS.items():
            print(f"{k:16} -> {c['out']}   ({c['slug']})")
        sys.exit(0)
    cfg = PROJECTS[a.key]
    video, expected, marks = build(a.key)
    secs, dims, err = probe(video)
    print(f"wrote {os.path.basename(video)}")
    print(f"  dimensions : {dims[0]}x{dims[1]}")
    print(f"  duration   : {secs:.2f}s  (expected {expected:.2f}s)")
    print(f"  audio      : {'PRESENT - unexpected' if 'Audio:' in err else 'none (silent, as intended)'}")
    print(f"  size       : {os.path.getsize(video)/1048576:.1f} MB")
    for i, (src, ss, dur, note) in enumerate(cfg["segments"], 1):
        print(f"  {i}. {os.path.basename(src)[:26]:26} {ss:5.1f}s +{dur:.1f}s  {note}")
    mus = add_music(cfg, video, secs)
    msecs, _, merr = probe(mus)
    s = re.search(r"Audio: (\w+).*?(\d+) Hz, (\w+)", merr)
    print(f"\nwrote {os.path.basename(mus)}")
    print(f"  duration   : {msecs:.2f}s  (video {secs:.2f}s)")
    print(f"  audio      : {s.group(1)} {s.group(2)} Hz {s.group(3)}" if s else "  audio: MISSING")
    print(f"  music      : {cfg['music'][0]} from {cfg['music'][1]}s")
    print(f"  size       : {os.path.getsize(mus)/1048576:.1f} MB")