"""Build the "what a remodel actually costs" feed carousel.

Six 1080x1350 slides for the Sunday feed. The premise is that no remodeler in
Hamilton County publishes prices, so doing it is both a differentiator and a
filter: HomeStar walks every estimate personally, so an enquiry that was never
going to fit is expensive. A homeowner who reads the bands and rules themselves
out has saved everyone a visit.

Every number here is copied from what the website already publishes. Do not
invent per-project costs - the site gives category ranges, not job prices, and
captioning a specific bathroom with a specific figure would be a fabrication.

Photo choices deliberately favour Carmel and Noblesville. Across the six-week
plan Zionsville is mentioned 12 times and Geist 11, against 4 each for Carmel
and Noblesville, so a mixed-project post is the cheapest way to start
rebalancing without burning a hero project on a single slot.

LAYOUT: full-bleed photograph, copy over a gradient scrim (variant B of three
Eric reviewed on 2026-09-06). See the scrim and eyebrow notes in build() - both
encode a failure the other treatments do not have.

    python build_cost_carousel.py
"""

import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "..", "..", "public", "images")
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "renders", "cost-carousel")

W, H = 1080, 1350
MARGIN = 96
NAVY = (27, 42, 74)
NAVY_DEEP = (14, 23, 43)
GREEN = (92, 184, 50)
WHITE = (255, 255, 255)
MUTED = (214, 223, 236)

SLIDES = [
    dict(photo="bathroom-green-tile-3.jpg", bias=0.45,
         eyebrow="HAMILTON COUNTY · 2026",
         head="What a remodel\nactually costs.",
         sub="Real numbers, published rather than guarded."),
    dict(photo="bathroom-green-tile-1.jpg", bias=0.45,
         eyebrow="BATHROOMS",
         head="$15K – $50K",
         sub="Most land around $35K, depending on size and finishes."),
    dict(photo="zionsville-kitchen-main-level-1.jpeg", bias=0.50,
         eyebrow="KITCHENS",
         head="From $40K",
         sub="Layout changes, cabinetry, stone, full gut renovations."),
    dict(photo="westfield-basement-masterpiece-6.jpg", bias=0.45,
         eyebrow="BASEMENTS",
         head="$45K – $200K",
         sub="$55–$75 a square foot, and it recoups 70–75% at resale."),
    dict(photo="noblesville-floor-to-ceiling-tile-1.jpg", bias=0.40,
         eyebrow="WHAT MOVES THE NUMBER",
         head="Scope, not taste.",
         sub="Moving plumbing, tiling floor to ceiling, and the waterproofing behind it."),
    dict(photo="carmel-double-shower-2.jpg", bias=0.45,
         eyebrow="HOW WE QUOTE",
         head="Every estimate\nitemized.",
         sub="Eric or Robb walks every one personally.  (317) 279-4798"),
]


def font(weight, px):
    return ImageFont.truetype(os.path.join(FONTS, "PlusJakartaSans-%s.ttf" % weight), px)


def cover(path, size, bias=0.45):
    """Fill `size` from `path`, cropping the overflow. bias 0 = keep the top."""
    im = Image.open(path).convert("RGB")
    tw, th = size
    target, cur = tw / th, im.width / im.height
    if cur > target:
        nw = int(im.height * target)
        im = im.crop(((im.width - nw) // 2, 0, (im.width + nw) // 2, im.height))
    else:
        nh = int(im.width / target)
        top = int((im.height - nh) * bias)
        im = im.crop((0, top, im.width, top + nh))
    return im.resize((tw, th), Image.LANCZOS)


def scrim(w, h, rgb, a_top, a_bottom, ease=1.8):
    """Vertical alpha ramp."""
    g = Image.new("RGBA", (1, h))
    px = g.load()
    for y in range(h):
        t = (y / max(h - 1, 1)) ** ease
        px[0, y] = rgb + (int(a_top + (a_bottom - a_top) * t),)
    return g.resize((w, h), Image.BILINEAR)


def left(d, x, y, s, f, fill, tracking=0.0):
    if tracking:
        for ch in s:
            d.text((x, y), ch, font=f, fill=fill)
            x += d.textlength(ch, font=f) + tracking
    else:
        d.text((x, y), s, font=f, fill=fill)


def centred(d, y, s, f, fill, tracking=0.0):
    """Kept for build_cost_variants.py, which renders the rejected treatments."""
    width = d.textlength(s, font=f) + tracking * max(len(s) - 1, 0)
    x = (W - width) / 2
    left(d, x, y, s, f, fill, tracking)


def fit_head(d, text, max_w):
    """Largest size at which every line of the headline fits the column."""
    lines = text.split("\n")
    start = 112 if len(lines) == 1 else 88
    for px in range(start, 54, -2):
        f = font("ExtraBold", px)
        if all(d.textlength(ln, font=f) <= max_w for ln in lines):
            return f, lines
    return font("ExtraBold", 54), lines


def wrap(d, text, f, max_w):
    out, line = [], ""
    for word in text.split():
        trial = (line + " " + word).strip()
        if d.textlength(trial, font=f) > max_w and line:
            out.append(line)
            line = word
        else:
            line = trial
    if line:
        out.append(line)
    return out


def build(slide, idx):
    card = cover(os.path.join(IMG, slide["photo"]), (W, H), slide["bias"]).convert("RGBA")

    # Two scrim passes. A long soft ramp keeps the photograph open through the
    # middle of the frame; a shorter, harder one underneath guarantees the
    # smallest type has something to sit on. With a single ramp the eyebrow
    # disappeared into the tile, which is the failure mode overlays are prone to.
    card.alpha_composite(scrim(W, 900, NAVY_DEEP, 0, 200, ease=1.5), (0, H - 900))
    card.alpha_composite(scrim(W, 460, NAVY_DEEP, 0, 226, ease=1.2), (0, H - 460))
    d = ImageDraw.Draw(card)

    col = W - MARGIN * 2
    f_eye, f_sub = font("ExtraBold", 25), font("Medium", 33)
    f_head, head_lines = fit_head(d, slide["head"], col)
    sub_lines = wrap(d, slide["sub"], f_sub, col)
    lh = int(f_head.size * 1.04)
    block = 40 + 26 + lh * len(head_lines) + 20 + 44 * len(sub_lines)
    y = H - 96 - block
    assert y > 380, "copy block too tall on slide %d" % idx

    # The green rule carries the brand; the eyebrow itself is white. Green type
    # this small has nothing like enough contrast against a photograph - on the
    # teal tile it vanished completely - and an accent colour survives as a
    # shape where it dies as text.
    d.rectangle([MARGIN, y - 30, MARGIN + 76, y - 23], fill=GREEN)
    left(d, MARGIN, y, slide["eyebrow"], f_eye, WHITE, 3.4)
    y += 66
    for ln in head_lines:
        left(d, MARGIN, y, ln, f_head, WHITE)
        y += lh
    y += 20
    for ln in sub_lines:
        left(d, MARGIN, y, ln, f_sub, MUTED)
        y += 44

    f_c = font("Bold", 24)
    tag = "%d / %d" % (idx, len(SLIDES))
    left(d, W - MARGIN - d.textlength(tag, font=f_c), H - 78, tag, f_c, (170, 184, 205))
    return card.convert("RGB")


def main():
    os.makedirs(OUT, exist_ok=True)
    for i, s in enumerate(SLIDES, 1):
        img = build(s, i)
        assert img.size == (W, H), img.size
        p = os.path.join(OUT, "cost-%02d.jpg" % i)
        img.save(p, "JPEG", quality=92, optimize=True, progressive=True)
        print("  %-14s %s  %s" % (os.path.basename(p), img.size, s["photo"]))
    print("\n%d slides -> %s" % (len(SLIDES), OUT))


if __name__ == "__main__":
    main()
