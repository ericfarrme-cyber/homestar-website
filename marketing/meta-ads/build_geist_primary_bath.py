"""Geist primary bath - Facebook before/after cards and the website images.

One script for both, so the grade and the framing of every frame live in one
place and the site and the feed show the same photographs.

**Sources.** Camera originals (Insta360, 7040x5288, 4:3) staged in
`source-photos/geist-primary-bath/{before,after}` - gitignored; the full shoot,
including the progress set and the clips, lives in the "Herman Master" Drive
folder. Client surname stays out of every filename and off the page.

**Pairs are matched by vantage, not by subject.** Each before/after pair was
chosen from a full review of all 52 files so the two frames stand roughly where
the same person would stand. The fifth pair (the shower) is the exception: the
only before of the old stall is a portrait frame shot from its doorway.

**Grade.** Photographic only - nothing moved, added or removed.
  - Exposure: a gamma per frame, aimed at a common midtone, capped both ways so
    no frame is pushed past its own range. Gamma lifts midtones and leaves black
    and white where they are, so windows do not blow out.
  - White balance: the befores are left alone. Their warm readings are real
    colour - the almond tub and tile, the sage walls - and neutralising them
    would misrepresent the room as it was. Only the three afters lit warm by
    the vanity sconce or the shower can are pulled part-way toward the cooler
    frames of the same walls (`wb` is the change in R-B, in 8-bit points).

    python build_geist_primary_bath.py preview   review sheets -> _geist_preview/
    python build_geist_primary_bath.py build     cards -> renders/carousel/
                                                 web   -> public/images/
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(ROOT, "source-photos", "geist-primary-bath")
CARDS = os.path.join(HERE, "renders", "carousel")
WEB = os.path.join(ROOT, "public", "images")
PREVIEW = os.path.join(HERE, "_geist_preview")
FONTS = os.path.join(HERE, "fonts")
SLUG = "glass-half-wall-primary-bath-geist"

NAVY = (27, 42, 74)
GREEN = (92, 184, 50)

TARGET_MID = 130.0
GAMMA_MIN, GAMMA_MAX = 1.0, 1.35    # lift only: darkening a bright before would flatter the after

# file -> white-balance change in R-B (negative cools). Absent = untouched.
WB = {
    "after/054345_604.jpg": -8,   # vanity under the sconce, R-B +13
    "after/054308_378.jpg": -7,   # same wall, R-B +12
    "after/054347_796.jpg": -9,   # shower wall under the can light, R-B +19
}

# A frame: (file, cx, cy, zoom). cx/cy are the crop centre as a fraction of the
# source; zoom 1.0 is the largest crop of the target aspect that fits, smaller
# is tighter. Centres are clamped so a crop never runs off the source.
PAIRS = [
    # key, before frame, after frame
    ("room",   ("before/060837_710.jpg", .50, .56, 1.0), ("after/054338_486.jpg", .50, .55, 1.0)),
    ("door",   ("before/060830_859.jpg", .45, .55, 1.0), ("after/054354_806.jpg", .50, .55, 1.0)),
    # 054343, not 054340: both befores and this after face the window head-on,
    # and 054340 stands where 054354 (card 2) stands - two cards, one vantage.
    ("tub",    ("before/060835_520.jpg", .50, .62, 1.0), ("after/054343_415.jpg", .50, .58, 1.0)),
    ("vanity", ("before/060833_187.jpg", .50, .58, 1.0), ("after/054345_604.jpg", .50, .55, 1.0)),
    ("shower", ("before/060828_858.jpg", .50, .62, 1.0), ("after/054347_796.jpg", .50, .50, 1.0)),
]

# Full-bleed after that closes the carousel. A second vanity frame (054357)
# was cut: card 4 already shows that wall.
SOLO = [
    ("after/054352_691.jpg", .50, .50, 1.0),
]

# Website: 3:4 crops for the before/after section (it renders a 3:4 box with
# a centred cover, so the crop is chosen here instead of left to the browser).
WEB_PAIRS = [
    ("room",   ("before/060837_710.jpg", .66, .55, 1.0), ("after/054338_486.jpg", .64, .55, 1.0)),
    ("door",   ("before/060830_859.jpg", .50, .55, 1.0), ("after/054354_806.jpg", .55, .55, 1.0)),
    ("tub",    ("before/060835_520.jpg", .42, .55, 1.0), ("after/054343_415.jpg", .42, .55, 1.0)),
    ("vanity", ("before/060833_187.jpg", .40, .55, 1.0), ("after/054345_604.jpg", .45, .55, 1.0)),
]

# Website gallery, 4:3 as shot. First is the lead image (portfolio card, schema).
GALLERY = [
    "after/054338_486.jpg",
    "after/054354_806.jpg",            # 054340 left out: same vantage as this one
    "after/054343_415.jpg",
    "after/054345_604.jpg",
    "after/054347_796.jpg",
    "after/054357_265.jpg",
    "after/054352_691.jpg",
]

_cache = {}


def load(rel):
    """Original, transposed and graded once, as float RGB."""
    if rel in _cache:
        return _cache[rel]
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, rel))).convert("RGB")
    a = np.asarray(im).astype(np.float32)

    small = np.asarray(im.resize((im.width // 8, im.height // 8))).astype(np.float32)
    lum = small @ np.array([.299, .587, .114], np.float32)
    med = float(np.median(lum))
    g = np.log(med / 255.0) / np.log(TARGET_MID / 255.0)
    g = float(np.clip(g, GAMMA_MIN, GAMMA_MAX))

    d = WB.get(rel, 0)
    if d:
        rb = small[..., 0].mean() + small[..., 2].mean()
        k = -d / rb
        a[..., 0] *= (1 - k)
        a[..., 2] *= (1 + k)
        a = np.clip(a, 0, 255)

    a = 255.0 * (a / 255.0) ** (1.0 / g)
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    _cache[rel] = (out, med, g)
    return _cache[rel]


def crop(rel, cx, cy, zoom, aspect):
    im = load(rel)[0]
    W, H = im.size
    if W / H > aspect:
        ch = H * zoom
        cw = ch * aspect
    else:
        cw = W * zoom
        ch = cw / aspect
    x0 = min(max(cx * W - cw / 2, 0), W - cw)
    y0 = min(max(cy * H - ch / 2, 0), H - ch)
    return im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))


def fit(im, w, h):
    im = im.resize((w, h), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=55, threshold=2))


GREEN_LIGHT = (124, 214, 74)
GREEN_DARK = (62, 150, 26)


def _star(cx, cy, r_out, r_in):
    pts = []
    for i in range(10):
        r = r_out if i % 2 == 0 else r_in
        a = -np.pi / 2 + i * np.pi / 5
        pts.append((cx + r * np.cos(a), cy + r * np.sin(a)))
    return pts


def badge(card, x, y, text, kind, size=29):
    """A label that reads as designed rather than typed.

    BEFORE is frosted glass: the photo under it, blurred and tinted navy, with
    a white hairline and a hollow ring. AFTER is a glossy HomeStar-green
    gradient with a white star. Both sit on a soft drop shadow. Drawn at 3x
    and downsampled so the curves and the type stay clean at feed size.
    """
    S = 3
    f = ImageFont.truetype(os.path.join(FONTS, "PlusJakartaSans-ExtraBold.ttf"), size * S)
    track = .17 * size * S
    adv = [f.getlength(c) for c in text]
    tw = sum(adv) + track * (len(text) - 1)
    cap = f.getbbox("H")
    cap_h = cap[3] - cap[1]

    h = round(size * 2.05 * S)
    icon = round(size * .66 * S)
    padl, gap, padr = round(size * .78 * S), round(size * .52 * S), round(size * .95 * S)
    w = padl + icon + gap + round(tw) + padr
    bw, bh = -(-w // S), -(-h // S)
    w, h = bw * S, bh * S
    r = h // 2

    # shadow, on the card itself
    sh = Image.new("L", (bw + 60, bh + 60), 0)
    ImageDraw.Draw(sh).rounded_rectangle((30, 36, 30 + bw, 36 + bh), radius=bh // 2, fill=110)
    sh = sh.filter(ImageFilter.GaussianBlur(11))
    card.paste((0, 0, 0), (x - 30, y - 30), sh)

    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)

    if kind == "before":
        under = card.crop((x, y, x + bw, y + bh)).filter(ImageFilter.GaussianBlur(9))
        base = under.resize((w, h), Image.LANCZOS).convert("RGB")
        tint = Image.new("RGB", (w, h), NAVY)
        base = Image.blend(base, tint, .62)
        # faint top sheen
        sheen = Image.linear_gradient("L").resize((w, h)).point(lambda v: int((255 - v) * .10))
        base.paste((255, 255, 255), (0, 0), sheen)
        rim, rim_a = (255, 255, 255), 105
    else:
        g = np.linspace(0, 1, h)[:, None, None]
        top, bot = np.array(GREEN_LIGHT, float), np.array(GREEN_DARK, float)
        arr = np.broadcast_to(top * (1 - g) + bot * g, (h, w, 3)).astype(np.uint8)
        base = Image.fromarray(arr.copy())
        # glossy highlight across the upper half
        hl = Image.new("L", (w, h), 0)
        ImageDraw.Draw(hl).rounded_rectangle((round(h * .18), round(h * .07), w - round(h * .18), round(h * .52)),
                                            radius=round(h * .22), fill=42)
        hl = hl.filter(ImageFilter.GaussianBlur(h * .06))
        base.paste((255, 255, 255), (0, 0), hl)
        rim, rim_a = (190, 245, 160), 150

    d = ImageDraw.Draw(base, "RGBA")
    lw = max(2, round(1.4 * S))
    d.rounded_rectangle((lw // 2, lw // 2, w - 1 - lw // 2, h - 1 - lw // 2), radius=r - lw // 2,
                        outline=rim + (rim_a,), width=lw)

    cx, cy = padl + icon / 2, h / 2
    if kind == "before":
        rr = icon * .40
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), outline=(255, 255, 255, 215), width=round(2.4 * S))
    else:
        d.polygon(_star(cx, cy + icon * .02, icon * .52, icon * .22), fill=(255, 255, 255, 255))

    tx = padl + icon + gap
    ty = (h - cap_h) / 2 - cap[1]
    for c, a in zip(text, adv):
        # a hair of shadow under the type keeps it crisp on the gradient
        d.text((tx, ty + S), c, font=f, fill=(0, 0, 0, 45))
        d.text((tx, ty), c, font=f, fill=(255, 255, 255, 255))
        tx += a + track

    small = base.resize((bw, bh), Image.LANCZOS)
    card.paste(small, (x, y), mask.resize((bw, bh), Image.LANCZOS))


CW, CH, GAP = 1080, 1350, 10
HALF = (CH - GAP) // 2
INSET = 36


def split_card(before, after):
    card = Image.new("RGB", (CW, CH), (255, 255, 255))
    top = fit(crop(*before, aspect=CW / HALF), CW, HALF)
    bot = fit(crop(*after, aspect=CW / HALF), CW, HALF)
    card.paste(top, (0, 0))
    card.paste(bot, (0, CH - HALF))
    badge(card, INSET, INSET - 4, "BEFORE", "before")
    badge(card, INSET, CH - HALF + INSET - 4, "AFTER", "after")
    return card


def solo_card(frame):
    return fit(crop(*frame, aspect=CW / CH), CW, CH)


def build_cards(outdir, prefix):
    os.makedirs(outdir, exist_ok=True)
    paths = []
    n = 0
    for key, b, a in PAIRS:
        n += 1
        p = os.path.join(outdir, f"{prefix}-{n:02d}.jpg")
        split_card(b, a).save(p, quality=92, subsampling=0)
        paths.append((p, f"pair:{key}"))
    for fr in SOLO:
        n += 1
        p = os.path.join(outdir, f"{prefix}-{n:02d}.jpg")
        solo_card(fr).save(p, quality=92, subsampling=0)
        paths.append((p, f"solo:{fr[0]}"))
    return paths


def build_web(outdir):
    # 1600px long edge: the site-wide ceiling set in f2f3592 after the homepage
    # shipped 11.9 MB and cards failed to load. Nothing displays above ~800 CSS px.
    os.makedirs(outdir, exist_ok=True)
    out = []
    for i, rel in enumerate(GALLERY, 1):
        p = os.path.join(outdir, f"{SLUG}-{i}.jpg")
        fit(crop(rel, .5, .5, 1.0, 4 / 3), 1600, 1200).save(p, quality=84, optimize=True, progressive=True)
        out.append(p)
    for i, (key, b, a) in enumerate(WEB_PAIRS, 1):
        for tag, fr in (("before", b), ("after", a)):
            p = os.path.join(outdir, f"{SLUG}-{tag}-{i}.jpg")
            fit(crop(*fr, aspect=3 / 4), 1200, 1600).save(p, quality=84, optimize=True, progressive=True)
            out.append(p)
    return out


def report():
    rels = sorted({f[0] for _, b, a in PAIRS for f in (b, a)} | {f[0] for f in SOLO} | set(GALLERY))
    for r in rels:
        _, med, g = load(r)
        print(f"  {r:24} median {med:5.1f}  gamma {g:4.2f}  wb {WB.get(r, 0):+d}")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "preview"
    report()
    if mode == "preview":
        cards = build_cards(PREVIEW, "card")
        web = build_web(os.path.join(PREVIEW, "web"))
        print(f"preview: {len(cards)} cards, {len(web)} web images in {PREVIEW}")
    elif mode == "build":
        cards = build_cards(CARDS, "geist-primary-bath")
        web = build_web(WEB)
        for p in [c for c, _ in cards] + web:
            print(f"  {os.path.relpath(p, ROOT)}  {os.path.getsize(p) // 1024} KB")
    else:
        sys.exit(f"unknown mode {mode}")
