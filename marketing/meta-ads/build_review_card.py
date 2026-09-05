"""The 5.0 card - the most persuasive asset HomeStar owns, and the least used.

78 reviews at a 5.0 average, and it has never been posted once. Everything
else in the queue argues that the work is good. This is the only asset where
somebody else says it.

Renders two sizes from one design:
    1080x1350  feed (4:5, the tallest Meta allows in-feed)
    1080x1920  story

    python build_review_card.py

Numbers come from the site's own structured data - ratingValue 5.0,
reviewCount 78 - so the card cannot drift from what the site claims. If Google
moves, update SITE_RATING/SITE_REVIEWS here and in src/App.jsx together.
"""

import os

from PIL import Image, ImageDraw, ImageFont

import build_ads as BRAND

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "renders", "cards")
FONTS = os.path.join(HERE, "fonts")

SITE_RATING = "5.0"
SITE_REVIEWS = "78"

# Deliberately NOT claimed on this card: that every review is a five, that
# they are all Hamilton County, or anything about competitors. A 5.0 average
# is a rounded figure and the rest is unverified. The number speaks by itself.
TOWNS = "Fishers · Carmel · Zionsville · Noblesville · Westfield · Geist"
PHONE = "Free in-home estimates · (317) 279-4798"

SIZES = {"feed": (1080, 1350), "story": (1080, 1920)}
S = 2


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size * S)


def star(d, cx, cy, r, fill):
    """Five-pointed star, point up."""
    import math
    pts = []
    for i in range(10):
        ang = math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.42
        pts.append((cx + rad * math.cos(ang), cy - rad * math.sin(ang)))
    d.polygon(pts, fill=fill)


def vgradient(w, h, colour, a_top, a_bottom):
    g = Image.new("RGBA", (1, h))
    px = g.load()
    for y in range(h):
        t = y / float(max(1, h - 1))
        px[0, y] = colour + (int(a_top + (a_bottom - a_top) * t),)
    return g.resize((w, h))


def build(kind):
    W, H = SIZES[kind]
    cw, ch = W * S, H * S
    img = Image.new("RGB", (cw, ch), BRAND.NAVY_DARK)
    img = img.convert("RGBA")
    img.alpha_composite(vgradient(cw, ch, BRAND.NAVY, 210, 0))
    d = ImageDraw.Draw(img)

    f_huge = font("PlusJakartaSans-ExtraBold.ttf", 250 if kind == "story" else 220)
    f_mid = font("PlusJakartaSans-Bold.ttf", 46)
    f_small = font("PlusJakartaSans-Medium.ttf", 26)
    f_mark = font("PlusJakartaSans-ExtraBold.ttf", 34)

    # Vertical rhythm differs between the two shapes; the story has room to
    # breathe, the feed card does not.
    cx = cw // 2
    # Nudged down from 0.30/0.24. The first pass left the whole block in the
    # top third with dead space beneath it, which read as unfinished rather
    # than spacious.
    top = int(ch * (0.33 if kind == "story" else 0.27))

    # Green rule, centred - the same mark the reels use, so the card reads as
    # part of the same family rather than a one-off graphic.
    rule_w, rule_h = int(78 * S), int(7 * S)
    d.rectangle([cx - rule_w // 2, top, cx + rule_w // 2, top + rule_h],
                fill=BRAND.GREEN)

    y = top + int(64 * S)
    tw = d.textlength(SITE_RATING, font=f_huge)
    d.text((cx - tw / 2, y), SITE_RATING, font=f_huge, fill=BRAND.WHITE)

    bbox = d.textbbox((cx - tw / 2, y), SITE_RATING, font=f_huge)
    y = bbox[3] + int(34 * S)

    r = int(30 * S)
    gap = int(78 * S)
    sx = cx - gap * 2
    for i in range(5):
        star(d, sx + i * gap, y + r, r, BRAND.GREEN)
    y += r * 2 + int(52 * S)

    line = "%s reviews on Google" % SITE_REVIEWS
    tw = d.textlength(line, font=f_mid)
    d.text((cx - tw / 2, y), line, font=f_mid, fill=BRAND.WHITE)
    y += int(96 * S)

    mark = "HOMESTAR"
    tw = d.textlength(mark, font=f_mark)
    d.text((cx - tw / 2, y), mark, font=f_mark, fill=BRAND.WHITE)
    y += int(56 * S)

    tw = d.textlength(TOWNS, font=f_small)
    d.text((cx - tw / 2, y), TOWNS, font=f_small, fill=BRAND.WHITE + (185,))

    # The phone line sits low, which balances the composition and puts the
    # number where a thumb already is on a story.
    py = int(ch * (0.80 if kind == "story" else 0.86))
    tw = d.textlength(PHONE, font=f_small)
    d.text((cx - tw / 2, py), PHONE, font=f_small, fill=BRAND.WHITE + (150,))

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, "review-5-0-%s.jpg" % kind)
    img.convert("RGB").resize((W, H), Image.LANCZOS).save(path, quality=94)

    # Verify the value, not the tag: check the file is the size asked for.
    with Image.open(path) as check:
        assert check.size == (W, H), "%s came out %s" % (path, check.size)
    print("  %-6s %dx%d  %s" % (kind, W, H, os.path.basename(path)))
    return path


if __name__ == "__main__":
    for kind in SIZES:
        build(kind)
    print("")
    print("%s / %s reviews - both taken from src/App.jsx structured data."
          % (SITE_RATING, SITE_REVIEWS))
