"""Build 9:16 story cards from project photos.

Stories are the one format the API can never fully automate - polls, question
boxes, link stickers and countdowns are phone-only, and nothing on either
platform can be scheduled through the API. So the labour worth removing is not
the posting, it is the making. This produces finished cards; Eric posts them
from his phone and taps share to Instagram.

Design deliberately matches the reel plates: bottom navy scrim, short green
rule, Plus Jakarta, generous left margin. A story that looks like the reels
reads as the same company.

Text sits inside the story safe area - Instagram and Facebook both overlay UI
across roughly the top 250px and bottom 250px, and a headline underneath the
reply box is a headline nobody reads.

    python build_stories.py            build everything
    python build_stories.py S1 S4      build only those
"""

import os
import sys

from PIL import Image, ImageDraw, ImageFont

import build_ads as BRAND

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(HERE, "..", "..", "public", "images")
OUT = os.path.join(HERE, "renders", "stories")
FONTS = os.path.join(HERE, "fonts")

W, H = 1080, 1920
S = 2  # supersample, then downsample - keeps the type crisp

# Story-safe area. Anything outside this is under platform chrome.
SAFE_TOP = 260
SAFE_BOTTOM = 340

LEFT = 72


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size * S)


# Each card: source photo, headline, the small line under it, and the project
# the claim is traceable to. Nothing here is inferred from the photo alone -
# every detail named appears on the project page or in an approved caption.
STORIES = [
    dict(key="S1", src="fishers-full-gut-walk-in-4.jpg",
         head="Even the drain\ngot a decision.",
         sub="Fishers full gut walk-in",
         note="Pierced bronze square drain set into hex mosaic. Visible in frame."),

    dict(key="S2", src="bathroom-green-tile-5.jpg",
         head="Two patterns.\nOne room.\nNo argument.",
         sub="Carmel green tile bath",
         note="Black-and-white basketweave pan against full-height green tile - "
              "both named in the F5 caption."),

    dict(key="S3", src="fishers-spa-retreat-4.jpg",
         head="A linear drain\nlets the floor\nrun flat.",
         sub="Fishers spa retreat",
         note="FI caption: 'a linear drain so the floor runs flat and unbroken "
              "to the glass'."),

    dict(key="S4", src="carmel-double-shower-5.jpg",
         head="Where two tiles\nmeet is where\nthe work shows.",
         sub="Carmel double shower",
         note="Hex mosaic meeting large-format at the threshold. Craft claim "
              "only - no spec named."),

    dict(key="S5", src="fishers-wetroom-4.jpg",
         head="Chosen once.\nTouched every day.",
         sub="Fishers wet room",
         note="Brushed fixture close-up. No finish named - photo alone cannot "
              "prove brass over nickel."),

    dict(key="S6", src="fishers-full-gut-walk-in-6.jpg",
         head="Nobody photographs\nthe faucet.\nEverybody touches it.",
         sub="Fishers full gut walk-in",
         note="Replaced the Zionsville oval window: the window was small in "
              "frame and the crop was mostly cabinet and door. No stone named "
              "here - the photo cannot prove marble over quartz."),

    dict(key="S7", src="geist-three-bath-2.jpg",
         head="The tile that\nmade the room.",
         sub="Geist three-bathroom remodel",
         note="The blue tile Eric identified as the after in this project."),

    dict(key="S8", src="westfield-basement-masterpiece-6.jpg",
         head="Fourteen feet of\nstained red oak.",
         sub="Westfield luxury basement",
         mode="fit",
         note="FB caption: '14-foot custom stained red oak mantle'. Landscape "
              "source, so it is letterboxed rather than cropped - a 9:16 crop "
              "threw the mantle out of frame entirely, and a run that long "
              "needs the width to read as long. This is the exact plate/frame "
              "mismatch that has bitten the reels four times."),

    dict(key="S9", src="fishers-spa-retreat-6.jpg",
         head="A heated rail is\na small thing you\nnotice every day.",
         sub="Fishers spa retreat",
         note="FI caption names the heated towel rail."),

    dict(key="S10", src="fishers-wetroom-6.jpg",
         head="The floor is the part\nthat has to be\nperfect.",
         sub="Fishers wet room",
         note="Mosaic field. Craft claim only."),
]


def cover(path):
    """Fill 1080x1920 without distorting - crop the overflow."""
    im = Image.open(path).convert("RGB")
    target = (W * S) / float(H * S)
    ratio = im.width / float(im.height)
    if ratio > target:
        new_w = int(im.height * target)
        im = im.crop(((im.width - new_w) // 2, 0,
                      (im.width - new_w) // 2 + new_w, im.height))
    else:
        new_h = int(im.width / target)
        # Bias the crop upward: in a room photo the subject is rarely at the
        # very bottom, and the bottom is where the scrim goes anyway.
        top = int((im.height - new_h) * 0.35)
        im = im.crop((0, top, im.width, top + new_h))
    return im.resize((W * S, H * S), Image.LANCZOS)


def vgradient(width, height, colour, a_top, a_bottom, ease=1.35):
    grad = Image.new("RGBA", (1, height))
    px = grad.load()
    for y in range(height):
        t = y / float(max(1, height - 1))
        px[0, y] = colour + (int(a_top + (a_bottom - a_top) * (t ** ease)),)
    return grad.resize((width, height))


def brightness(img, top, bottom):
    """Mean luminance of the band the headline will sit in."""
    band = img.convert("RGB").crop((0, max(0, top), img.width,
                                    min(img.height, bottom)))
    band = band.resize((32, 32), Image.BILINEAR)
    pixels = list(band.getdata())
    return sum(0.299 * r + 0.587 * g + 0.114 * b for r, g, b in pixels) / len(pixels)


def wrap_lines(text):
    return [line for line in text.split("\n") if line.strip()]


def letterbox(path):
    """Full-width photo on navy, for landscape sources.

    Cropping a wide room shot to 9:16 keeps about a third of its width, which
    is fine for a texture and fatal for anything whose point is its length.
    """
    im = Image.open(path).convert("RGB")
    band_w = W * S
    band_h = int(band_w * im.height / float(im.width))
    im = im.resize((band_w, band_h), Image.LANCZOS)
    canvas = Image.new("RGBA", (W * S, H * S), BRAND.NAVY_DARK + (255,))
    # Sit the photo above centre so the headline below it stays in safe area.
    canvas.paste(im, (0, int(H * S * 0.30) - band_h // 2))
    return canvas


def build(card):
    src = os.path.join(IMAGES, card["src"])
    if not os.path.exists(src):
        print("  MISSING PHOTO %s" % card["src"])
        return None

    fitted = card.get("mode") == "fit"
    canvas = letterbox(src) if fitted else cover(src).convert("RGBA")

    f_head = font("PlusJakartaSans-ExtraBold.ttf", 74)
    f_sub = font("PlusJakartaSans-Medium.ttf", 30)

    lines = wrap_lines(card["head"])
    line_h = int(92 * S)
    block_h = line_h * len(lines)

    sub_gap = int(38 * S)
    baseline = (H - SAFE_BOTTOM) * S
    head_top = baseline - block_h - sub_gap - int(40 * S)

    if not fitted:
        # Measure what the headline will actually sit on before deciding how
        # heavy the scrim needs to be. A gradient tuned on a dark tiled shower
        # leaves white type nearly invisible over a white basin, and the top
        # line is worst hit because that is where the gradient is thinnest.
        lum = brightness(canvas, head_top - int(30 * S), baseline)
        boost = min(1.0, max(0.0, (lum - 85) / 150.0))

        # Always start the gradient at fully transparent. Raising the top alpha
        # to darken a bright photo leaves a hard horizontal seam across the
        # frame where the scrim begins. Reach higher and ramp sooner instead.
        scrim_h = int(H * S * (0.52 + 0.28 * boost))
        canvas.alpha_composite(
            vgradient(W * S, scrim_h, BRAND.NAVY_DARK,
                      0, int(238 + 14 * boost),
                      ease=1.35 - 0.75 * boost),
            (0, H * S - scrim_h))
        # A whisper at the top too - stories put the profile row up there.
        canvas.alpha_composite(
            vgradient(W * S, int(H * S * 0.16), BRAND.NAVY_DARK, 150, 0), (0, 0))

    d = ImageDraw.Draw(canvas)

    # Green rule, same proportions as the reel plates.
    rule_y = head_top - int(34 * S)
    d.rectangle([LEFT * S, rule_y, LEFT * S + int(78 * S), rule_y + int(7 * S)],
                fill=BRAND.GREEN + (255,))

    y = head_top
    for line in lines:
        d.text((LEFT * S + 3, y + 3), line, font=f_head, fill=(0, 0, 0, 90))
        d.text((LEFT * S, y), line, font=f_head, fill=BRAND.WHITE + (255,))
        y += line_h

    d.text((LEFT * S, y + int(14 * S)), card["sub"], font=f_sub,
           fill=BRAND.WHITE + (205,))

    out = canvas.convert("RGB").resize((W, H), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, "%s-%s" % (card["key"], card["src"]))
    out.save(path, quality=92)
    return path


def main():
    wanted = [a.upper() for a in sys.argv[1:]]
    built = []
    for card in STORIES:
        if wanted and card["key"] not in wanted:
            continue
        path = build(card)
        if path:
            built.append(path)
            print("  %-4s %s" % (card["key"], os.path.basename(path)))
    print("")
    print("%d card(s) in %s" % (len(built), OUT))


if __name__ == "__main__":
    main()
