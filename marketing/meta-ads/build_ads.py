#!/usr/bin/env python3
"""
HomeStar Meta/Facebook ad creative builder.

Composites brand typography over REAL project photography. The source photo is
never regenerated, restyled or redrawn -- it is only cropped and scaled, so
what a homeowner sees in the ad is what HomeStar actually built.

Overlay graphics are drawn on a 3x supersampled RGBA layer and downsampled with
LANCZOS, which gives print-grade type edges without needing a huge source photo.

Usage:
    python build_ads.py            # render every ad in ADS
    python build_ads.py basement   # render ads whose slug contains "basement"
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
IMG = os.path.join(REPO, "public", "images")
FONTS = os.path.join(HERE, "fonts")
ASSETS = os.path.join(HERE, "assets")   # upscaled / prepped sources
OUT = os.path.join(HERE, "renders")

# ── Brand tokens (mirrors C in src/App.jsx) ────────────────────────────
NAVY = (27, 42, 74)
NAVY_DARK = (17, 29, 53)
GREEN = (92, 184, 50)
GREEN_LT = (111, 209, 60)
WHITE = (255, 255, 255)

S = 3  # supersample factor for the overlay layer

# Meta placements. safe_top/safe_bottom are the UI-reserved zones Meta
# overlays on Reels & Stories -- nothing readable may sit inside them.
PLACEMENTS = {
    "feed":    {"size": (1080, 1350), "safe_top": 0,   "safe_bottom": 0},
    "square":  {"size": (1080, 1080), "safe_top": 0,   "safe_bottom": 0},
    "reels":   {"size": (1080, 1920), "safe_top": 250, "safe_bottom": 420},
}


def photo_path(name):
    """Prefer a prepped asset (e.g. an upscale) over the raw site image."""
    local = os.path.join(ASSETS, name)
    return local if os.path.isfile(local) else os.path.join(IMG, name)


def font(weight, px):
    path = os.path.join(FONTS, f"PlusJakartaSans-{weight}.ttf")
    return ImageFont.truetype(path, px)


def text_w(draw, s, f, tracking=0):
    if not s:
        return 0
    w = draw.textlength(s, font=f)
    return w + tracking * (len(s) - 1)


def draw_tracked(draw, xy, s, f, fill, tracking=0):
    """Draw text with manual letter-spacing."""
    x, y = xy
    if tracking == 0:
        draw.text((x, y), s, font=f, fill=fill)
        return
    for ch in s:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f) + tracking


def wrap(draw, words_or_text, f, max_w, tracking=0):
    """Greedy word wrap to max_w. Honours explicit \n."""
    lines = []
    for para in str(words_or_text).split("\n"):
        cur = ""
        for word in para.split():
            trial = word if not cur else cur + " " + word
            if text_w(draw, trial, f, tracking) <= max_w or not cur:
                cur = trial
            else:
                lines.append(cur)
                cur = word
        lines.append(cur)
    return lines


def fit_lines(draw, text, weight, max_w, max_px, min_px, tracking_ratio=-0.02,
              max_lines=3):
    """Shrink until the text wraps into <= max_lines within max_w."""
    px = max_px
    while px > min_px:
        f = font(weight, px)
        tr = px * tracking_ratio
        lines = wrap(draw, text, f, max_w, tr)
        if len(lines) <= max_lines and all(
            text_w(draw, ln, f, tr) <= max_w for ln in lines
        ):
            return f, lines, tr
        px -= 2
    f = font(weight, min_px)
    tr = min_px * tracking_ratio
    return f, wrap(draw, text, f, max_w, tr), tr


def pill(draw, x, y, label, f, bg, fg, tracking, pad_x, pad_y, radius=None):
    """Rounded badge. Returns (width, height) of the drawn pill."""
    tw = text_w(draw, label, f, tracking)
    asc, desc = f.getmetrics()
    th = asc
    w = tw + pad_x * 2
    h = th + pad_y * 2
    r = radius if radius is not None else h / 2
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=bg)
    draw_tracked(draw, (x + pad_x, y + pad_y - desc * 0.12), label, f, fg, tracking)
    return w, h


def smart_crop(im, target_w, target_h, fx=0.5, fy=0.5):
    """Cover-crop to target aspect, biased to a focal point in 0..1."""
    tw, th = target_w, target_h
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    nw, nh = max(tw, int(round(sw * scale))), max(th, int(round(sh * scale)))
    im = im.resize((nw, nh), Image.LANCZOS)
    left = int(round((nw - tw) * fx))
    top = int(round((nh - th) * fy))
    return im.crop((left, top, left + tw, top + th))


def vgradient(w, h, rgb, a_top, a_bottom, ease=2.0):
    """Vertical alpha ramp used for the photo scrim."""
    g = Image.new("RGBA", (1, h))
    px = g.load()
    for y in range(h):
        t = (y / max(h - 1, 1)) ** ease
        a = int(round(a_top + (a_bottom - a_top) * t))
        px[0, y] = (rgb[0], rgb[1], rgb[2], a)
    return g.resize((w, h), Image.BILINEAR)


def wordmark(draw, x, y, scale, on_dark=True):
    """HOMESTAR / SERVICES & CONTRACTING lockup. Returns height drawn."""
    f1 = font("ExtraBold", int(30 * scale))
    f2 = font("Bold", int(12 * scale))
    c1 = WHITE if on_dark else NAVY
    c2 = GREEN_LT if on_dark else GREEN
    draw_tracked(draw, (x, y), "HOMESTAR", f1, c1, tracking=1.5 * scale)
    draw_tracked(draw, (x, y + int(36 * scale)), "SERVICES & CONTRACTING", f2, c2,
                 tracking=3.0 * scale)
    return int(56 * scale)


# ── Layout: solid band ─────────────────────────────────────────────────
def render_band(ad, placement):
    spec = PLACEMENTS[placement]
    W, H = spec["size"]
    src = Image.open(photo_path(ad["photo"])).convert("RGB")

    pad = int(W * 0.068) * S
    inner_w = W * S - pad * 2
    lift = spec["safe_bottom"]

    # Measure the copy first, then size the band to it. A fixed band ratio
    # leaves dead navy under short headlines and crowds long ones.
    probe = ImageDraw.Draw(Image.new("RGBA", (8, 8)))
    f_h, lines, tr = fit_lines(
        probe, ad["headline"], "ExtraBold", inner_w,
        max_px=int(ad.get("h_px", 66) * S), min_px=int(30 * S), max_lines=3,
    )
    lh = int(f_h.size * 1.06)
    content = int(46 * S) + lh * len(lines)

    sub_lines, f_s, sub_lh = [], None, 0
    if ad.get("sub"):
        f_s = font("Medium", int(ad.get("s_px", 27) * S))
        sub_lines = wrap(probe, ad["sub"], f_s, inner_w)
        sub_lh = int(f_s.size * 1.34)
        content += int(16 * S) + sub_lh * len(sub_lines)
    content += int(112 * S)  # CTA row + breathing room

    band_h = int(min(max(content / S, H * 0.26), H * 0.46))
    photo_h = H - band_h - lift

    canvas = Image.new("RGB", (W, H), NAVY)
    canvas.paste(smart_crop(src, W, photo_h, ad.get("fx", .5), ad.get("fy", .5)), (0, 0))

    ov = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)

    band_top = photo_h * S
    d.rectangle([0, band_top, W * S, H * S], fill=NAVY + (255,))
    d.rectangle([0, band_top, W * S, band_top + int(7 * S)], fill=GREEN + (255,))

    y = band_top + int(46 * S)
    for ln in lines:
        draw_tracked(d, (pad, y), ln, f_h, WHITE, tr)
        y += lh

    if sub_lines:
        y += int(16 * S)
        for ln in sub_lines:
            d.text((pad, y), ln, font=f_s, fill=GREEN_LT)
            y += sub_lh

    # CTA chip + wordmark share the band's bottom line.
    base_y = H * S - lift * S - int(52 * S)
    if ad.get("cta"):
        f_c = font("ExtraBold", int(23 * S))
        pill(d, pad, base_y - int(8 * S), ad["cta"], f_c, GREEN + (255,), WHITE,
             tracking=1.0 * S, pad_x=int(26 * S), pad_y=int(15 * S))

    wm_w = int(200 * S)
    wordmark(d, W * S - pad - wm_w, base_y - int(2 * S), S, on_dark=True)

    _badges(d, ad, W, pad, top=int(42 * S) + spec["safe_top"] * S)

    canvas = Image.alpha_composite(canvas.convert("RGBA"),
                                   ov.resize((W, H), Image.LANCZOS))
    return canvas.convert("RGB")


# ── Layout: editorial scrim ────────────────────────────────────────────
def render_scrim(ad, placement):
    spec = PLACEMENTS[placement]
    W, H = spec["size"]
    src = Image.open(photo_path(ad["photo"])).convert("RGB")

    canvas = smart_crop(src, W, H, ad.get("fx", .5), ad.get("fy", .5)).convert("RGBA")

    # Two stacked ramps: a long soft one for mood, a short hard one under the
    # type so the headline stays legible over a bright photo.
    scrim_h = int(H * ad.get("scrim", 0.62))
    canvas.alpha_composite(
        vgradient(W, scrim_h, NAVY_DARK, 0, 232, ease=1.5), (0, H - scrim_h)
    )
    hard_h = int(H * 0.34)
    canvas.alpha_composite(
        vgradient(W, hard_h, NAVY_DARK, 0, 236, ease=1.1), (0, H - hard_h)
    )
    canvas.alpha_composite(vgradient(W, int(H * 0.26), NAVY_DARK, 175, 0, ease=1.0), (0, 0))

    ov = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)

    pad = int(W * 0.075) * S
    inner_w = W * S - pad * 2
    bottom = (H - spec["safe_bottom"]) * S - int(54 * S)

    blocks = []
    f_h, lines, tr = fit_lines(
        d, ad["headline"], "ExtraBold", inner_w,
        max_px=int(ad.get("h_px", 72) * S), min_px=int(32 * S), max_lines=3,
    )
    blocks.append(("h", f_h, lines, tr, int(f_h.size * 1.05)))

    if ad.get("sub"):
        f_s = font("Medium", int(ad.get("s_px", 28) * S))
        blocks.append(("s", f_s, wrap(d, ad["sub"], f_s, inner_w), 0,
                       int(f_s.size * 1.34)))

    total = sum(len(b[2]) * b[4] for b in blocks) + (int(18 * S) if len(blocks) > 1 else 0)
    cta_h = int(74 * S) if ad.get("cta") else 0
    y = bottom - cta_h - total

    # Green rule anchors the text block to the brand.
    d.rectangle([pad, y - int(34 * S), pad + int(74 * S), y - int(34 * S) + int(7 * S)],
                fill=GREEN + (255,))

    for kind, f, lines, trk, lh in blocks:
        if kind == "s":
            y += int(18 * S)
        for ln in lines:
            draw_tracked(d, (pad, y), ln, f, WHITE if kind == "h" else GREEN_LT, trk)
            y += lh

    if ad.get("cta"):
        f_c = font("ExtraBold", int(23 * S))
        pill(d, pad, bottom - int(56 * S), ad["cta"], f_c, GREEN + (255,), WHITE,
             tracking=1.0 * S, pad_x=int(26 * S), pad_y=int(15 * S))

    top = int(48 * S) + spec["safe_top"] * S
    wordmark(d, pad, top, S, on_dark=True)
    _badges(d, ad, W, pad, top=top, right_only=True)

    canvas = Image.alpha_composite(canvas, ov.resize((W, H), Image.LANCZOS))
    return canvas.convert("RGB")


def _badges(d, ad, W, pad, top, right_only=False):
    """Trust badges pinned to the top corners of the photo."""
    if ad.get("badge_l") and not right_only:
        f = font("ExtraBold", int(19 * S))
        pill(d, pad, top, ad["badge_l"], f, NAVY + (238,), WHITE,
             tracking=1.1 * S, pad_x=int(20 * S), pad_y=int(13 * S))
    if ad.get("badge_r"):
        f = font("ExtraBold", int(19 * S))
        tw = text_w(d, ad["badge_r"], f, 1.1 * S) + int(40 * S)
        pill(d, W * S - pad - tw, top, ad["badge_r"], f, WHITE + (240,), NAVY,
             tracking=1.1 * S, pad_x=int(20 * S), pad_y=int(13 * S))


# ── Layout: Reels / Stories card ───────────────────────────────────────
def render_reels(ad):
    """9:16 for Reels & Stories.

    A landscape interior hard-cropped to 9:16 loses the room, which is the
    whole product. So the photo is placed at its native aspect as a card over
    a blurred, darkened copy of itself, and every element is laid out top-down
    inside Meta's safe zone (250px top / 420px bottom are covered by Reels UI).
    """
    spec = PLACEMENTS["reels"]
    W, H = spec["size"]
    top_lim = spec["safe_top"]
    bot_lim = H - spec["safe_bottom"]
    src = Image.open(photo_path(ad["photo"])).convert("RGB")

    bg = smart_crop(src, W, H, ad.get("fx", .5), ad.get("fy", .5))
    bg = bg.filter(ImageFilter.GaussianBlur(52)).convert("RGBA")
    bg.alpha_composite(Image.new("RGBA", (W, H), NAVY_DARK + (196,)))

    margin = 56
    card_w = W - margin * 2
    card_y = top_lim + 130

    ov = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    pad = margin * S
    inner_w = W * S - pad * 2

    # Measure the copy block first so the photo card can take exactly the
    # space that is left. A fixed card height overruns Meta's UI zone as soon
    # as a headline wraps to a third line.
    f_h, lines, tr = fit_lines(
        d, ad["headline"], "ExtraBold", inner_w,
        max_px=int(58 * S), min_px=int(34 * S), max_lines=2,
    )
    head_h = int(f_h.size * 1.06) * len(lines)

    sub_lines, f_s, sub_lh = [], None, 0
    if ad.get("sub"):
        f_s = font("Medium", int(25 * S))
        sub_lines = wrap(d, ad["sub"], f_s, inner_w)[:2]
        sub_lh = int(f_s.size * 1.32)

    f_c = font("ExtraBold", int(24 * S))
    cta_h = (f_c.getmetrics()[0] + int(32 * S)) if ad.get("cta") else 0

    text_h = (int(54 * S) + int(7 * S) + int(38 * S) + head_h
              + (int(14 * S) + sub_lh * len(sub_lines) if sub_lines else 0)
              + (int(26 * S) + cta_h if cta_h else 0))

    room = (bot_lim - card_y) * S - text_h
    natural = int(round(card_w * src.size[1] / src.size[0]))
    card_h = max(min(natural, 840, int(room / S)), 420)

    card = smart_crop(src, card_w, card_h, ad.get("fx", .5), ad.get("fy", .5))
    bg.paste(card, (margin, card_y))

    # Everything below flows strictly downward, so the CTA can never be
    # pushed above the headline when copy runs long.
    y = (card_y + card_h + 54) * S
    d.rectangle([pad, y, pad + int(74 * S), y + int(7 * S)], fill=GREEN + (255,))
    y += int(38 * S)

    for ln in lines:
        draw_tracked(d, (pad, y), ln, f_h, WHITE, tr)
        y += int(f_h.size * 1.06)

    if sub_lines:
        y += int(14 * S)
        for ln in sub_lines:
            d.text((pad, y), ln, font=f_s, fill=GREEN_LT)
            y += sub_lh

    if ad.get("cta"):
        cta_y = y + int(26 * S)
        _, ch = pill(d, pad, cta_y, ad["cta"], f_c, GREEN + (255,), WHITE,
                     tracking=1.0 * S, pad_x=int(28 * S), pad_y=int(16 * S))
        bottom_px = (cta_y + ch) / S
        if bottom_px > bot_lim:
            print(f"    ! {ad['slug']} reels: content ends at {bottom_px:.0f}px, "
                  f"safe limit is {bot_lim}px")
        else:
            _REELS_FIT.append((ad["slug"], round(bottom_px), bot_lim))

    top = (top_lim + 30) * S
    wordmark(d, pad, top, S, on_dark=True)
    _badges(d, ad, W, pad, top=top - int(6 * S), right_only=True)

    return Image.alpha_composite(bg, ov.resize((W, H), Image.LANCZOS)).convert("RGB")


_REELS_FIT = []

LAYOUTS = {"band": render_band, "scrim": render_scrim}


# ── Ad definitions ─────────────────────────────────────────────────────
# Every claim below is load-bearing and traceable to src/App.jsx.
ADS = [
    # ── FOCAL: whole-home / multi-room. Three creative variants so it has
    # real A/B depth, plus the V1 video cut. This is the concept to scale.
    {
        "slug": "01-whole-home",
        "layout": "scrim",
        "photo": "geist-upper-level-1.jpg",
        "fy": 0.50,
        "headline": "One contractor. One schedule. One warranty.",
        "h_px": 70,
        "sub": "Kitchen, bathrooms, basement and flooring — run as one project instead of four subcontractors hoping the dates line up.",
        "cta": "START YOUR PROJECT",
        "badge_r": "5.0 ★ GOOGLE",
        "scrim": 0.64,
    },
    {
        "slug": "01b-whole-home-schedules",
        "layout": "band",
        # Kitchen, great room and upper landing in a single frame — the only
        # still in the library that shows a multi-room scope on its own.
        "photo": "zionsville-kitchen-main-level-8.jpeg",
        "fy": 0.50,
        "headline": "Renovating four rooms shouldn't mean four schedules.",
        "h_px": 58,
        "sub": "Our plumbers and electricians are on our payroll. That's why a multi-room project runs on one calendar instead of whoever shows up.",
        "cta": "GET A FREE ESTIMATE",
        "badge_l": "HAMILTON COUNTY, IN",
        "badge_r": "5.0 ★ GOOGLE",
    },
    {
        "slug": "01c-whole-home-kitchen",
        "layout": "band",
        "photo": "zionsville-kitchen-main-level-1.jpeg",
        "fy": 0.55,
        "headline": "Your kitchen, your baths, your basement. One project.",
        "h_px": 56,
        "sub": "Whole-home renovation with one point of contact from design through final inspection. Permits pulled and paid.",
        "cta": "PLAN YOUR RENOVATION",
        "badge_l": "WHOLE-HOME RENOVATION",
        "badge_r": "LICENSED & INSURED",
    },

    {
        "slug": "02-in-house-trades",
        "layout": "band",
        "photo": "zionsville-basement-1.jpg",
        "fy": 0.42,
        "headline": "Your plumber doesn't work for your contractor.\nOurs does.",
        "h_px": 58,
        "sub": "We employ our own licensed plumbers and electricians. One schedule, one point of contact, one warranty.",
        "cta": "GET A FREE ESTIMATE",
        "badge_l": "FISHERS, IN · FAMILY-OWNED",
        "badge_r": "5.0 ★ GOOGLE",
    },
    {
        "slug": "03-basement-sqft",
        "layout": "scrim",
        "photo": "zionsville-basement-7.jpg",
        "fy": 0.52,
        "headline": "You already own the square footage.",
        "h_px": 74,
        "sub": "Finished basements across Hamilton County — $45K to $200K, and 70–75% of it comes back at resale.",
        "cta": "SEE BASEMENT PRICING",
        "badge_r": "5.0 ★ GOOGLE",
        "scrim": 0.66,
    },
    {
        "slug": "04-waterproofing-warranty",
        "layout": "band",
        "photo": "geist-three-bath-1.jpg",
        "fy": 0.40,
        "headline": "A 25-year warranty on the part you'll never see.",
        "h_px": 58,
        "sub": "Schluter Pro Certified waterproofing behind every shower we build. The tile is the easy part.",
        "cta": "GET A FREE ESTIMATE",
        "badge_l": "SCHLUTER PRO CERTIFIED",
        "badge_r": "5.0 ★ GOOGLE",
    },
    {
        "slug": "05-price-transparency",
        "layout": "band",
        "photo": "zionsville-basement-3.jpg",
        "fy": 0.46,
        "headline": "Most contractors won't put a number on it. Here's ours.",
        "h_px": 54,
        "sub": "Bathrooms $15K–$50K. Kitchens from $25K. Basements $45K–$200K. Published, itemized, and permitted.",
        "cta": "SEE REAL 2026 PRICING",
        "badge_l": "HAMILTON COUNTY, IN",
        "badge_r": "LICENSED & INSURED",
    },
    {
        # Rewritten: the first version assumed you already knew the brand.
        # A cold audience needs the company explained before the founders.
        "slug": "06-who-we-are",
        "layout": "scrim",
        "photo": "team-founders.jpg",
        "fy": 0.28,
        # Was "with a licensed crew of their own". The problem was never the
        # word LICENSED - HomeStar is a licensed contractor and that is a real
        # credential worth stating. The problem was "of their own", which
        # promises the crew is exclusively HomeStar's employees and rules out
        # bringing in a specialist sub. Three words removed, credential kept.
        #
        # This was also the smallest change that would do, which matters: the
        # ad is performing, and rewriting a winner further than necessary is
        # its own risk.
        "headline": "HomeStar is two friends from Fishers with a licensed crew of their own.",
        "h_px": 54,
        "sub": "Kitchens, baths, basements and whole-home renovations across Hamilton County — and Eric or Robb walks every estimate personally.",
        "cta": "MEET THE TEAM",
        "badge_l": "FAMILY-OWNED · FISHERS, IN",
        "badge_r": "5.0 ★ GOOGLE",
        "scrim": 0.62,
    },
    {
        "slug": "07-entertaining-floor",
        "layout": "band",
        # 1080x720 original, upscaled to 4096px via Higgsfield before use.
        "photo": "westfield-masterpiece-2-upscaled.jpg",
        "fy": 0.55,
        "headline": "The best room in the house was the one nobody used.",
        "h_px": 56,
        "sub": "Custom bar, theater, gym and a 14-foot red oak mantle. Westfield, Indiana — about $150K.",
        "cta": "TOUR THIS BASEMENT",
        "badge_l": "WESTFIELD, IN",
        "badge_r": "5.0 ★ GOOGLE",
    },
]


def main():
    os.makedirs(OUT, exist_ok=True)
    flt = sys.argv[1].lower() if len(sys.argv) > 1 else None
    n = 0
    for ad in ADS:
        if flt and flt not in ad["slug"]:
            continue
        for placement in ("feed", "square", "reels"):
            if placement == "reels":
                img = render_reels(ad)
            else:
                img = LAYOUTS[ad["layout"]](ad, placement)
            path = os.path.join(OUT, f"{ad['slug']}--{placement}.jpg")
            img.save(path, "JPEG", quality=92, optimize=True, progressive=True)
            n += 1
            print(f"  {os.path.basename(path):<44} {img.size[0]}x{img.size[1]}")
    print(f"\n{n} creatives -> {OUT}")
    if _REELS_FIT:
        print("\nReels safe-zone check — content bottom vs Meta's 1500px limit:")
        for slug, got, lim in _REELS_FIT:
            print(f"  {slug:<26} {got}px / {lim}px   slack {lim - got}px")


if __name__ == "__main__":
    main()
