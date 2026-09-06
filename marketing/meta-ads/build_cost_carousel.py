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
NAVY = (27, 42, 74)
GREEN = (92, 184, 50)
WHITE = (255, 255, 255)
MUTED = (188, 199, 216)

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
         head="From $25K",
         sub="Layout changes, cabinetry, stone, full gut renovations."),
    dict(photo="westfield-basement-masterpiece-6.jpg", bias=0.45,
         eyebrow="BASEMENTS",
         head="$45K – $200K",
         sub="$55–$75 a square foot, and it recoups 70–75% at resale."),
    dict(photo="noblesville-floor-to-ceiling-tile-1.jpg", bias=0.40,
         eyebrow="WHAT MOVES THE NUMBER",
         head="Scope, not taste.",
         sub="Moving plumbing, tiling floor to ceiling, and what goes on behind it."),
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


def tracked(d, xy, s, f, fill, tracking):
    x, y = xy
    for ch in s:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + tracking


def band_height(slide, d):
    """Size the panel to its own content.

    A fixed band left a lot of dead navy under the one-line slides, which read
    as a mistake rather than as space. Measuring first keeps the photo as large
    as it can be on every slide while the panel stays visually consistent.
    """
    head_px = 92 if "\n" in slide["head"] else 104
    lines = slide["head"].count("\n") + 1
    fs = font("Medium", 34)
    sub_lines, line = 1, ""
    for wd in slide["sub"].split():
        trial = (line + " " + wd).strip()
        if d.textlength(trial, font=fs) > W - 168 and line:
            sub_lines += 1
            line = wd
        else:
            line = trial
    return 46 + 56 + int(head_px * 1.06) * lines + 14 + 46 * sub_lines + 44


def build(slide, idx):
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    photo_h = H - band_height(slide, probe)
    card = Image.new("RGB", (W, H), NAVY)
    card.paste(cover(os.path.join(IMG, slide["photo"]), (W, photo_h), slide["bias"]), (0, 0))
    d = ImageDraw.Draw(card)

    # A hairline of green where the photo meets the panel: the same seam the
    # rest of the ad set uses, so the carousel reads as part of the family.
    d.rectangle([0, photo_h - 6, W, photo_h], fill=GREEN)

    x, y = 84, photo_h + 46
    tracked(d, (x, y), slide["eyebrow"], font("ExtraBold", 25), GREEN, 3.2)
    y += 56

    head_px = 92 if "\n" in slide["head"] else 104
    fh = font("ExtraBold", head_px)
    for line in slide["head"].split("\n"):
        d.text((x, y), line, font=fh, fill=WHITE)
        y += int(head_px * 1.06)

    y += 14
    fs = font("Medium", 34)
    words, line = slide["sub"].split(), ""
    for wd in words:
        trial = (line + " " + wd).strip()
        if d.textlength(trial, font=fs) > W - 2 * x and line:
            d.text((x, y), line, font=fs, fill=MUTED)
            y += 46
            line = wd
        else:
            line = trial
    if line:
        d.text((x, y), line, font=fs, fill=MUTED)

    # Slide counter, so a swiper always knows how much is left.
    fc = font("Bold", 26)
    tag = "%d / %d" % (idx, len(SLIDES))
    d.text((W - 84 - d.textlength(tag, font=fc), photo_h + 50), tag, font=fc, fill=MUTED)

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
