"""Render the cost carousel's word area three ways, for choosing between.

Same photo, same copy, three treatments:

    A  panel    solid navy block beneath the photo (what ships today)
    B  overlay  photo full-bleed, copy over a gradient scrim
    C  card     photo full-bleed, copy on an inset floating card

Each is rendered for slide 2 (one-line headline, the archetype) and slide 6
(two-line headline, the layout stress case), because a treatment that only
works for one of those is not a treatment.

    python build_cost_variants.py
"""

import os
from PIL import Image, ImageDraw, ImageFont

from build_cost_carousel import (SLIDES, W, H, MARGIN, NAVY, GREEN, WHITE,
                                 MUTED, font, cover, centred, wrap)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "renders", "cost-variants")
IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "images")
NAVY_DEEP = (14, 23, 43)


def left(d, x, y, s, f, fill, tracking=0.0):
    if tracking:
        for ch in s:
            d.text((x, y), ch, font=f, fill=fill)
            x += d.textlength(ch, font=f) + tracking
    else:
        d.text((x, y), s, font=f, fill=fill)


def fit(d, text, max_w, single=112, multi=88):
    lines = text.split("\n")
    start = single if len(lines) == 1 else multi
    for px in range(start, 54, -2):
        f = font("ExtraBold", px)
        if all(d.textlength(ln, font=f) <= max_w for ln in lines):
            return f, lines
    return font("ExtraBold", 54), lines


def scrim(w, h, rgb, a_top, a_bottom, ease=1.8):
    """Vertical alpha ramp. Eased so the photo stays open at the top of it."""
    g = Image.new("RGBA", (1, h))
    px = g.load()
    for y in range(h):
        t = (y / max(h - 1, 1)) ** ease
        px[0, y] = rgb + (int(a_top + (a_bottom - a_top) * t),)
    return g.resize((w, h), Image.BILINEAR)


# ── A: solid panel ─────────────────────────────────────────────────────
def variant_panel(slide, idx):
    PANEL, COUNTER = 430, 56
    photo_h = H - PANEL
    card = Image.new("RGB", (W, H), NAVY)
    card.paste(cover(os.path.join(IMG, slide["photo"]), (W, photo_h), slide["bias"]), (0, 0))
    d = ImageDraw.Draw(card)
    d.rectangle([0, photo_h - 6, W, photo_h], fill=GREEN)

    col = W - MARGIN * 2
    f_eye, f_sub = font("ExtraBold", 25), font("Medium", 33)
    f_head, head_lines = fit(d, slide["head"], col)
    sub_lines = wrap(d, slide["sub"], f_sub, col)
    lh = int(f_head.size * 1.04)
    block = 40 + 26 + lh * len(head_lines) + 20 + 44 * len(sub_lines)
    y = photo_h + (PANEL - COUNTER - block) / 2

    centred(d, y, slide["eyebrow"], f_eye, GREEN, 3.4); y += 66
    for ln in head_lines:
        centred(d, y, ln, f_head, WHITE); y += lh
    y += 20
    for ln in sub_lines:
        centred(d, y, ln, f_sub, MUTED); y += 44
    centred(d, H - 52, "%d / 6" % idx, font("Bold", 24), MUTED, 1.6)
    return card


# ── B: full-bleed with a gradient scrim ────────────────────────────────
def variant_overlay(slide, idx):
    card = cover(os.path.join(IMG, slide["photo"]), (W, H), slide["bias"]).convert("RGBA")
    # Two passes. A long soft ramp keeps the photo open through the middle of
    # the frame; a shorter, harder one underneath guarantees the eyebrow has
    # something to sit on. With a single ramp the green eyebrow disappeared
    # into the tile, which is the failure mode overlays are prone to.
    card.alpha_composite(scrim(W, 900, NAVY_DEEP, 0, 200, ease=1.5), (0, H - 900))
    card.alpha_composite(scrim(W, 460, NAVY_DEEP, 0, 226, ease=1.2), (0, H - 460))
    d = ImageDraw.Draw(card)

    col = W - MARGIN * 2
    f_eye, f_sub = font("ExtraBold", 25), font("Medium", 33)
    f_head, head_lines = fit(d, slide["head"], col)
    sub_lines = wrap(d, slide["sub"], f_sub, col)
    lh = int(f_head.size * 1.04)
    block = 40 + 26 + lh * len(head_lines) + 20 + 44 * len(sub_lines)
    y = H - 96 - block

    # The green rule carries the brand; the eyebrow itself is white. Green type
    # this small has nothing like enough contrast against a photograph - on the
    # teal tile it vanished completely - and an accent colour survives as a
    # shape where it dies as text.
    d.rectangle([MARGIN, y - 30, MARGIN + 76, y - 23], fill=GREEN)
    left(d, MARGIN, y, slide["eyebrow"], f_eye, WHITE, 3.4); y += 66
    for ln in head_lines:
        left(d, MARGIN, y, ln, f_head, WHITE); y += lh
    y += 20
    for ln in sub_lines:
        left(d, MARGIN, y, ln, f_sub, (214, 223, 236)); y += 44

    f_c = font("Bold", 24)
    tag = "%d / 6" % idx
    left(d, W - MARGIN - d.textlength(tag, font=f_c), H - 78, tag, f_c, (170, 184, 205))
    return card.convert("RGB")


# ── C: full-bleed with an inset card ───────────────────────────────────
def variant_card(slide, idx):
    card = cover(os.path.join(IMG, slide["photo"]), (W, H), slide["bias"]).convert("RGBA")
    card.alpha_composite(scrim(W, 520, NAVY_DEEP, 0, 130), (0, H - 520))
    d = ImageDraw.Draw(card)

    inset, bottom = 56, 56
    col = W - inset * 2 - 76 * 2
    f_eye, f_sub = font("ExtraBold", 24), font("Medium", 31)
    f_head, head_lines = fit(d, slide["head"], col, single=98, multi=78)
    sub_lines = wrap(d, slide["sub"], f_sub, col)
    lh = int(f_head.size * 1.04)
    block = 38 + 22 + lh * len(head_lines) + 18 + 42 * len(sub_lines)
    card_h = block + 108

    top = H - bottom - card_h
    panel = Image.new("RGBA", (W - inset * 2, card_h), NAVY + (252,))
    pd = ImageDraw.Draw(panel)
    pd.rectangle([0, 0, panel.width, 6], fill=GREEN + (255,))   # green cap, not a seam
    card.alpha_composite(panel, (inset, top))

    y = top + 54
    cx = W / 2
    def mid(s, f, fill, tracking=0.0):
        wdt = d.textlength(s, font=f) + tracking * max(len(s) - 1, 0)
        x = cx - wdt / 2
        if tracking:
            for ch in s:
                d.text((x, y), ch, font=f, fill=fill)
                x += d.textlength(ch, font=f) + tracking
        else:
            d.text((x, y), s, font=f, fill=fill)

    mid(slide["eyebrow"], f_eye, GREEN, 3.2); y += 60
    for ln in head_lines:
        mid(ln, f_head, WHITE); y += lh
    y += 18
    for ln in sub_lines:
        mid(ln, f_sub, MUTED); y += 42

    f_c = font("Bold", 23)
    tag = "%d / 6" % idx
    d.text((W - inset - 40 - d.textlength(tag, font=f_c), top + card_h - 42), tag,
           font=f_c, fill=(150, 165, 190))
    return card.convert("RGB")


VARIANTS = [("A-panel", variant_panel), ("B-overlay", variant_overlay), ("C-card", variant_card)]


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, fn in VARIANTS:
        for idx in (2, 6):
            img = fn(SLIDES[idx - 1], idx)
            assert img.size == (W, H), (name, img.size)
            p = os.path.join(OUT, "%s-slide%d.jpg" % (name, idx))
            img.save(p, "JPEG", quality=92, optimize=True, progressive=True)
            print("  %s" % os.path.basename(p))
    print("\n%d renders -> %s" % (len(VARIANTS) * 2, OUT))


if __name__ == "__main__":
    main()
