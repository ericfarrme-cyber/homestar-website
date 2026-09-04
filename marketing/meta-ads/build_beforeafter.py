"""
Cut a 9:16 before-and-after Reel for any project.

Generalised from build_reel_beforeafter.py, which was written for the Geist
master bath and then wanted copying for every other job. Everything that was
constant there is a PROJECTS entry here; the pipeline itself is unchanged.

    python build_beforeafter.py <key>          # key from PROJECTS below
    python build_beforeafter.py --list

Structure is all-before then all-after, with a BEFORE/AFTER pill that crossfades
at the reveal. Alternating matched pairs is more elegant but needs a persistent
label to stay legible on a muted scroll; one block each cannot be misread.

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
ARCH = os.path.join(REPO, "Pending", "Archive")
NEW = os.path.join(REPO, "Pending", "new in progress")
MUSIC_DIR = os.path.join(REPO, "Pending", "music")
OUT_DIR = os.path.join(HERE, "renders")
# the finished luxury-basement walkthrough already ships on the project page
MOV = os.path.join(REPO, "public", "images", "westfield-basement-masterpiece-video.mov")
# the Geist project page ships its own finished walkthrough - 1080x1920 native at
# 59 Mbps, a real master. The first cut of F6 used a Topaz upscale of a 2.42 Mbps
# phone clip because nobody had looked in public/images. Both these files are
# gitignored (public/images/*.mp4|mov), so they are local-only sources.
GEIST_MOV = os.path.join(REPO, "public", "images", "geist-three-bath-video.mp4")

W, H, FPS = 1080, 1920, 30
XFADE = 0.4
END_DUR = 3.6
HOOK_FADE_IN, HOOK_FADE_OUT = 0.80, 0.75
BEAT_FADE_IN, BEAT_FADE_OUT = 0.75, 0.85
MUSIC_LUFS = -20
FADE_IN, FADE_OUT = 1.2, 2.2

# ── Projects ────────────────────────────────────────────────────────────────
# segments: (source, start, duration, "BEFORE"|"AFTER", note)
# music_start comes from MUSIC.md, which measures the loudest steadiest window
# in each track rather than guessing.
PROJECTS = {
    "geist": dict(
        out="F6-geist-three-bath-beforeafter",
        slug="three-bathroom-remodel-geist",
        music=("Quiet Neon.mp3", 70.5),
        ad={
            "hook":     "This was the primary bath.",
            "beat":     "The shower wouldn't fit.",
            "end_head": "So we moved the door. And we'd do the same for you.",
            "end_sub":  "Schluter Pro Certified. Bathrooms in Hamilton County - $15K to $50K.",
            "cta":      "GET A FREE ESTIMATE",
            "badge_r":  "5.0 ★ GOOGLE",
        },
        segments=[
            (os.path.join(ARCH, "20260116_142314.mp4"),  0.6, 2.4, "BEFORE", "doorway - framed shower, vaulted ceiling"),
            (os.path.join(ARCH, "20260116_142314.mp4"),  9.2, 2.2, "BEFORE", "framed shower panning to the jetted tub"),
            (os.path.join(ARCH, "20260116_142314.mp4"), 23.2, 1.8, "BEFORE", "white raised-panel double vanity"),
            (GEIST_MOV,  6.2, 3.4, "AFTER", "navy picket tile, brass shower fixtures"),
            (GEIST_MOV, 20.5, 3.0, "AFTER", "pendant over the tub"),
            (GEIST_MOV, 30.5, 3.2, "AFTER", "freestanding tub, wall-mount brass filler"),
            (GEIST_MOV, 47.5, 3.2, "AFTER", "the double vanity and backlit mirrors"),
        ],
    ),

    # Zionsville: the first project with a before AND a finished walkthrough in
    # the same batch, both native 4K portrait at ~41 Mbps. No upscaling needed.
    # The before clip opens on an empty bedroom; only the bathroom section
    # (9.2-15.4s) is used, and it stops at 15.0s because a person walks into
    # frame at the right edge just after.
    "zionsville": dict(
        out="F7-zionsville-jack-and-jill-beforeafter",
        slug="jack-and-jill-zionsville",
        music=("Before _ After.mp3", 92.5),
        ad={
            "hook":     "Two kids. One bathroom.",
            "beat":     "So we gave them a sink each.",
            "end_head": "Shared. But not a compromise.",
            "end_sub":  "Schluter Pro Certified. Bathrooms in Zionsville and Boone County - $15K to $50K.",
            "cta":      "GET A FREE ESTIMATE",
            "badge_r":  "5.0 ★ GOOGLE",
        },
        segments=[
            (os.path.join(NEW, "zionsville bathroom.mp4"),  9.4, 2.7, "BEFORE", "cultured-marble vanity, beige tile, round window"),
            (os.path.join(NEW, "zionsville bathroom.mp4"), 12.3, 2.7, "BEFORE", "toilet alcove, dated tile floor"),
            (os.path.join(NEW, "zionsville bath 3.mp4"),  7.4, 3.4, "AFTER", "oak vanity, black mirror and sconces"),
            (os.path.join(NEW, "zionsville bath 3.mp4"),  4.6, 2.4, "AFTER", "marble star mosaic floor"),
            (os.path.join(NEW, "zionsville bath 3.mp4"), 13.2, 3.6, "AFTER", "alcove tub, stacked tile, twin niches"),
            (os.path.join(NEW, "zionsville bath 3.mp4"),  0.4, 3.0, "AFTER", "black marble with the white vein"),
        ],
    ),

    # Eric confirmed the in-progress clip is the LUXURY basement
    # (westfield-basement-masterpiece), not the budget one. There are two
    # Westfield basement projects on the site and the filename says only
    # "westfield basement" - the first cut assumed the budget project and put
    # "you don't have to overspend to do it right" on a job with a kegerator
    # and a 14-foot red oak mantle. Exactly wrong.
    #
    # AFTER is the finished walkthrough already shipping on the project page,
    # public/images/westfield-basement-masterpiece-video.mov - 1080x1920, 78.7s,
    # no people. The AFTER block opens on the wide fireplace shot rather than
    # the bar so that the beat, which names the mantle, lands over the mantle.
    "westfield-luxury": dict(
        out="FB-westfield-luxury-basement-beforeafter",
        slug="westfield-basement-masterpiece",
        # American Reveal has the steadiest 20s window in the library - spread 0.7 dB
        # against 1.1-1.7 for every other track. Least likely to lurch under a reveal.
        music=("American Reveal.mp3", 113.0),
        ad={
            "hook":     "Bare concrete and studs.",
            "beat":     "Fourteen feet of red oak later.",
            "end_head": "The cheapest square footage in your house.",
            "end_sub":  "Basement finishing in Westfield and across Hamilton County.",
            "cta":      "GET A FREE ESTIMATE",
            "badge_r":  "5.0 ★ GOOGLE",
        },
        segments=[
            (os.path.join(NEW, "westfield basement.mp4"),  0.2, 2.8, "BEFORE", "bare slab, first walls framed"),
            (os.path.join(NEW, "westfield basement.mp4"),  3.0, 2.8, "BEFORE", "rooms framed, cans in, nothing finished"),
            (MOV, 34.6, 3.4, "AFTER", "fireplace and the oak mantle, bar behind"),
            (MOV,  9.0, 3.2, "AFTER", "the bar, backlit shelving"),
            (MOV, 58.0, 3.2, "AFTER", "the full lower level"),
            (MOV, 44.0, 3.0, "AFTER", "shuffleboard under the wood ceiling"),
        ],
    ),

    # Fishers Spa Retreat. There is NO true before for this job - no
    # pre-demolition footage, no before photos on the project page, no
    # beforeAfter array. The only genuine befores in the whole library are
    # "geist three bath before.mp4" and three white-oak stills.
    #
    # So this is not sold as one. The pills read DEMO and DONE, because the
    # opening state is our own demolition rather than how the homeowner lived
    # with the room. Labelling it BEFORE would tell people their bathroom
    # looked like a building site, which is the same class of error as pairing
    # the Geist rooms by date or publishing a video-date gap as a job duration.
    #
    # Distinct from FA, which is the four-stage progression of this same job.
    # This is a two-beat reveal: gutted, then done.
    "spa-retreat": dict(
        out="FK-fishers-spa-retreat-demo-to-done",
        slug="spa-retreat-bathroom-fishers",
        # Calmest family in the library and distinct from both existing spa
        # cuts - FA runs Brisa de Nylon (1), FI runs Before _ After.
        music=("Before _ After (1).mp3", 83.8),
        labels=("DEMO", "DONE"),
        ad={
            "hook":     "We took it back to nothing.",
            "beat":     "Then built a spa in it.",
            "end_head": "Everything you see, we put there.",
            "end_sub":  "Schluter Pro Certified. Bathrooms in Hamilton County - $15K to $50K.",
            "cta":      "GET A FREE ESTIMATE",
            "badge_r":  "5.0 ★ GOOGLE",
        },
        # Both demo windows dodge the crew member visible around 4.5s and 6.0s.
        # Crew in frame is still an open question with Eric, so no face here.
        segments=[
            (os.path.join(NEW, "spa retreat fishers 1.mp4"),  1.4, 2.8, "BEFORE", "studs and subfloor, window wall open"),
            (os.path.join(NEW, "spa retreat fishers 1.mp4"),  8.6, 2.6, "BEFORE", "bare framing, tub still standing on end"),
            (os.path.join(ARCH, "fishers spa finished 1.mp4"), 16.6, 3.4, "AFTER", "freestanding tub under the window"),
            (os.path.join(ARCH, "fishers spa finished 1.mp4"),  0.6, 3.2, "AFTER", "oak vanity, oval mirrors, brass"),
            (os.path.join(ARCH, "fishers spa finished 1.mp4"), 22.8, 3.2, "AFTER", "walk-in shower, rain head and handheld"),
            (os.path.join(ARCH, "fishers spa finished 1.mp4"), 12.4, 2.8, "AFTER", "quartz run to the heated towel rail"),
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
    """Build every overlay PNG for this project. Returns the paths."""
    ad = cfg["ad"]
    p = lambda n: os.path.join(HERE, f"_{tag}_{n}.png")
    logo, hook, beat, end = p("chrome"), p("hook"), p("beat"), p("end")
    tb, ta = p("tag_before"), p("tag_after")

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

    # beat plate - mirror of build_walkthrough.plate_beat, copied rather than
    # imported because that module runs format setup at import time
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

    # The two state pills, centred under the wordmark. Text is per project
    # because "BEFORE" is not always honest: on the Westfield basement the
    # opening state genuinely is the homeowner's before - an unfinished
    # basement is how they lived with it. On a gutted bathroom it is not. That
    # room was a finished, dated bathroom until we demolished it, so labelling
    # our own demolition "BEFORE" tells people their bathroom looked like a
    # building site. Same pill, honest words.
    before_label, after_label = cfg.get("labels", ("BEFORE", "AFTER"))
    for label, bg, path in ((before_label, (188, 62, 62, 235), tb),
                            (after_label, BRAND.GREEN + (235,), ta)):
        img, d = V._layer()
        fnt = BRAND.font("ExtraBold", int(30 * Sx))
        wpx, _ = BRAND.pill(d, 0, -10_000, label, fnt, bg, BRAND.WHITE + (255,),
                            tracking=0.10, pad_x=int(26 * Sx), pad_y=int(14 * Sx))
        BRAND.pill(d, (V.W * Sx - wpx) // 2, (V.SAFE_TOP + 96) * Sx, label, fnt,
                   bg, BRAND.WHITE + (255,), tracking=0.10,
                   pad_x=int(26 * Sx), pad_y=int(14 * Sx))
        V._down(img, path)

    return logo, hook, beat, end, tb, ta


def build(key):
    cfg = PROJECTS[key]
    segs = cfg["segments"]
    for src, *_ in segs:
        if not os.path.exists(src):
            sys.exit(f"missing source: {src}")
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, cfg["out"] + "--reels-video.mp4")

    logo, hook_p, beat_p, end_p, tb_p, ta_p = plates(cfg, key)

    spans, t = [], 0.0
    for _, _, dur, _, _ in segs:
        spans.append((t, t + dur))
        t += dur - XFADE
    body = spans[-1][1]
    # Segments still carry the literal words BEFORE/AFTER as their state, which
    # is what splits the reel. Only the pill wording is per project.
    n_before = sum(1 for s in segs if s[3] == "BEFORE")
    if n_before == 0 or n_before == len(segs):
        sys.exit("%s needs both BEFORE and AFTER segments" % key)
    before_end = spans[n_before - 1][1]
    after_start = spans[n_before][0]
    hook_out = before_end - 0.8
    beat_in = after_start + 0.8
    beat_out = min(beat_in + 4.6, body - 0.4)

    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error"]
    for src, ss, dur, _, _ in segs:
        cmd += ["-ss", f"{ss:.2f}", "-t", f"{dur:.2f}", "-i", src]

    parts = []
    for i, (_, _, dur, _, _) in enumerate(segs):
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
    for src, dur in ((logo, body), (hook_p, body), (beat_p, body),
                     (tb_p, body), (ta_p, body), (end_p, END_DUR)):
        cmd += ["-loop", "1", "-t", f"{dur:.2f}", "-i", src]

    parts.append(f"[{n}:v]format=rgba,fade=t=in:st=0.25:d=0.7:alpha=1[lg]")
    parts.append(f"[{n+1}:v]format=rgba,fade=t=in:st=0.30:d={HOOK_FADE_IN}:alpha=1,"
                 f"fade=t=out:st={hook_out:.2f}:d={HOOK_FADE_OUT}:alpha=1[hk]")
    parts.append(f"[{n+2}:v]format=rgba,fade=t=in:st={beat_in:.2f}:d={BEAT_FADE_IN}:alpha=1,"
                 f"fade=t=out:st={beat_out - BEAT_FADE_OUT:.2f}:d={BEAT_FADE_OUT}:alpha=1[bt]")
    parts.append(f"[{n+3}:v]format=rgba,fade=t=in:st=0.45:d=0.5:alpha=1,"
                 f"fade=t=out:st={before_end - 0.5:.2f}:d=0.45:alpha=1[tb]")
    parts.append(f"[{n+4}:v]format=rgba,fade=t=in:st={after_start:.2f}:d=0.45:alpha=1[ta]")
    parts.append(f"[{n+5}:v]scale={W}:{H},fps={FPS},format=yuv420p,setsar=1[ec]")
    parts.append(f"[{prev}][lg]overlay=0:0:format=auto[o1]")
    parts.append("[o1][tb]overlay=0:0:format=auto[o2]")
    parts.append("[o2][ta]overlay=0:0:format=auto[o3]")
    parts.append("[o3][hk]overlay=0:0:format=auto[o4]")
    parts.append("[o4][bt]overlay=0:0:format=auto[o5]")
    parts.append("[o5]format=yuv420p[bod]")
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
    return out, body + END_DUR - XFADE, (before_end, after_start, hook_out, beat_in, beat_out)


def add_music(cfg, video, video_len):
    name, start = cfg["music"]
    music = os.path.join(MUSIC_DIR, name)
    if not os.path.exists(music):
        sys.exit(f"missing music: {music}")
    out = video.replace("--reels-video.mp4", "--reels-video-music.mp4")
    shape = (f"afade=t=in:st=0:d={FADE_IN},"
             f"afade=t=out:st={max(0.0, video_len - FADE_OUT):.2f}:d={FADE_OUT}")
    norm = f"loudnorm=I={MUSIC_LUFS}:TP=-1.5:LRA=11"
    probe = subprocess.run(
        [FF, "-hide_banner", "-ss", f"{start}", "-t", f"{video_len:.2f}", "-i", music,
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
            print(f"{k:14} -> {c['out']}   ({c['slug']})")
        sys.exit(0)
    if a.key not in PROJECTS:
        sys.exit(f"unknown key {a.key!r}; try --list")

    cfg = PROJECTS[a.key]
    video, expected, marks = build(a.key)
    before_end, after_start, hook_out, beat_in, beat_out = marks
    secs, dims, err = probe(video)
    print(f"wrote {os.path.basename(video)}")
    print(f"  dimensions : {dims[0]}x{dims[1]}")
    print(f"  duration   : {secs:.2f}s  (expected {expected:.2f}s)")
    print(f"  audio      : {'PRESENT - unexpected' if 'Audio:' in err else 'none (silent, as intended)'}")
    print(f"  size       : {os.path.getsize(video)/1048576:.1f} MB")
    print(f"  reveal at  : {after_start:.2f}s  (before block ends {before_end:.2f}s)")
    for i, (src, ss, dur, tag, note) in enumerate(cfg["segments"], 1):
        print(f"  {i}. {tag:6} {os.path.basename(src)[:28]:28} {ss:5.1f}s +{dur:.1f}s  {note}")

    mus = add_music(cfg, video, secs)
    msecs, _, merr = probe(mus)
    s = re.search(r"Audio: (\w+).*?(\d+) Hz, (\w+)", merr)
    print(f"\nwrote {os.path.basename(mus)}")
    print(f"  duration   : {msecs:.2f}s  (video {secs:.2f}s)")
    print(f"  audio      : {s.group(1)} {s.group(2)} Hz {s.group(3)}" if s else "  audio: MISSING")
    print(f"  music      : {cfg['music'][0]} from {cfg['music'][1]}s")
    print(f"  size       : {os.path.getsize(mus)/1048576:.1f} MB")