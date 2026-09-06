"""Build the "what a remodel actually costs" feed carousel.

Six 1080x1350 slides for the Sunday feed. The premise is that no remodeler in
Hamilton County publishes prices, so doing it is both a differentiator and a
filter: HomeStar walks every estimate personally, and the scarcest thing the
business has is a Saturday. A homeowner who reads the bands and rules
themselves out has saved everyone a truck roll.

Every number here is copied from what the website already publishes. Do not
invent per-project costs - the site gives category ranges, not job prices, and
captioning a specific bathroom with a specific figure would be a fabrication.

Photo choices deliberately favour Carmel and Noblesville. Across the six-week
plan Zionsville is mentioned 12 times and Geist 11, against 4 each for Carmel
and Noblesville, so a mixed-project post is the cheapest way to start
rebalancing without burning a hero project on a single slot.

    python build_cost_carousel.py
"""

import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "..", "..", "public", "images")
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "renders", "cost-carousel")

W, H = 1080, 1350
PANEL = 430                 # fixed on every slide - see build()
COUNTER = 56                # strip reserved at the panel foot for "n / 6"
MARGIN = 96
NAVY = (27, 42, 74)
GREEN = (92, 184, 50)
WHITE = (255, 255, 255)
MUTED = (176, 189, 209)

SLIDES = [
    dict(photo="bathroom-green-tile-3.jpg", bias=0.45,
         eyebrow="HAMILTON COUNTY · 2026",
         head="What a remodel\nactually costs.",
         sub="Real numbers, published rather than guarded."),
    dict(photo="bathroom-green-tile-1.jpg", bias=0.45,
         eyebrow="BATHROOMS",
         head="$15K – $50K",
         sub="Most homeowners invest $20K–$35K."),
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
         eyebrow="BEFORE YOU SPEND A SATURDAY",
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


def centred(d, y, s, f, fill, tracking=0.0):
    """Draw one line centred on the canvas. Returns the advance height."""
    width = d.textlength(s, font=f) + tracking * max(len(s) - 1, 0)
    x = (W - width) / 2
    if tracking:
        for ch in s:
            d.text((x, y), ch, font=f, fill=fill)
            x += d.textlength(ch, font=f) + tracking
    else:
        d.text((x, y), s, font=f, fill=fill)


def fit_head(d, text, max_w):
    """Largest size at which every line of the headline fits the column.

    Two-line headlines start smaller. At the single-line size they overran the
    fixed panel, which pushed the eyebrow up onto the green seam and dropped the
    sub onto the slide counter.
    """
    lines = text.split("\n")
    start = 112 if len(lines) == 1 else 88
    for px in range(start, 58, -2):
        f = font("ExtraBold", px)
        if all(d.textlength(ln, font=f) <= max_w for ln in lines):
            return f, lines
    return font("ExtraBold", 58), lines


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
    """One slide.

    The panel is a fixed height on every slide and the copy is centred inside
    it, vertically and horizontally. An earlier version sized the panel to its
    own content, which meant the navy block changed height as you swiped and
    the set read as unbalanced. A constant panel with the type optically
    centred inside it holds still, which is what makes a carousel feel
    considered rather than assembled.
    """
    photo_h = H - PANEL
    card = Image.new("RGB", (W, H), NAVY)
    card.paste(cover(os.path.join(IMG, slide["photo"]), (W, photo_h), slide["bias"]), (0, 0))
    d = ImageDraw.Draw(card)

    # The green seam the rest of the ad set uses, so this reads as family.
    d.rectangle([0, photo_h - 6, W, photo_h], fill=GREEN)

    col = W - MARGIN * 2
    f_eye = font("ExtraBold", 25)
    f_head, head_lines = fit_head(d, slide["head"], col)
    f_sub = font("Medium", 33)
    sub_lines = wrap(d, slide["sub"], f_sub, col)
    f_num = font("Bold", 24)

    eye_h, head_lh, sub_lh = 40, int(f_head.size * 1.04), 44
    block = eye_h + 26 + head_lh * len(head_lines) + 20 + sub_lh * len(sub_lines)

    # Centre the block in the panel, less the counter's reserved strip so the
    # type sits optically centred rather than mathematically centred. Assert it
    # actually fits: a silent overflow is what put the eyebrow on the seam.
    avail = PANEL - COUNTER
    assert block <= avail, "panel overflow on slide %d: %d > %d" % (idx, block, avail)
    y = photo_h + (avail - block) / 2

    centred(d, y, slide["eyebrow"], f_eye, GREEN, tracking=3.4)
    y += eye_h + 26
    for ln in head_lines:
        centred(d, y, ln, f_head, WHITE)
        y += head_lh
    y += 20
    for ln in sub_lines:
        centred(d, y, ln, f_sub, MUTED)
        y += sub_lh

    centred(d, H - 52, "%d / %d" % (idx, len(SLIDES)), f_num, MUTED, tracking=1.6)
    return card


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
