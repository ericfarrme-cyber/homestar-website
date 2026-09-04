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

import glob
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

    dict(key="S6", src="zionsville-basement-4.jpg",
         head="That backsplash\nisn't tile. It's the\ncountertop, continued.",
         sub="Zionsville basement bar",
         bias_x=0.34,
         note="Second replacement. The marble niche was true but grey on "
              "grey and it did not stop a thumb. Green quartzite slab run "
              "full height as the backsplash, matte black tap, integrated "
              "sink. Claim is visible in frame - the slab and counter are "
              "the same stone, which tile could not fake. Landscape source "
              "cropped left of centre because the tap sits left."),

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

    dict(key="S9", src="noblesville-floor-to-ceiling-tile-1.jpg",
         head="The light is\ninside the wall.",
         sub="Noblesville floor to ceiling tile",
         note="Second replacement. Concealed LED above the feature wall "
              "and inside the full-width niche - the channels have to be "
              "roughed in before a single tile goes on, which is the point "
              "of the line. F9 caption names it: 'light running the length "
              "of the shower niche'."),

    dict(key="S10", src="zionsville-jack-and-jill-2.jpg",
         head="A star cut from marble.\nRepeated across\na whole floor.",
         sub="Zionsville jack and jill",
         bias=0.42,
         note="Eric's call - the star-pattern marble mosaic beats the plain "
              "penny round it replaced. Cropped hard to the bottom of the "
              "frame because the floor is the subject; the default upward "
              "bias would have framed the ceiling. F7 caption names it: "
              "'A star-pattern marble mosaic floor.'"),

    # ---- second set ----------------------------------------------------
    # Same rule as above: every headline describes something visible in its
    # own frame. Where a number or a material would have been the obvious
    # line, it is left out unless a project page or approved caption states
    # it - a shuffleboard I cannot measure does not get a length.

    dict(key="S11", src="zionsville-basement-6.jpg",
         head="Somewhere to put\nthe good bottles.",
         sub="Zionsville basement",
         note="Wine wall. No count claimed - the bottles are not all visible "
              "and the rack may not be full."),

    dict(key="S12", src="zionsville-basement-3.jpg",
         head="Brass, glass,\nand a slab worth\nlooking at.",
         sub="Zionsville basement bar",
         note="Same green stone as S6, shot wide with the shelving. Space "
              "these two apart when scheduling - same room, same stone."),

    dict(key="S13", src="noblesville-floor-to-ceiling-tile-3.jpg",
         head="Nothing in this room\nthat doesn't earn it.",
         sub="Noblesville floor to ceiling tile",
         note="Freestanding tub, chandelier, narrow window. Deliberately no "
              "claim about the window - cannot tell backlit from daylight."),

    dict(key="S14", src="geist-upper-level-3.jpg",
         head="A ladder means\nthe shelves go\nall the way up.",
         sub="Geist upper level",
         note="Library ladder on a rail, visible in frame."),

    dict(key="S15", src="westfield-basement-masterpiece-13.jpg",
         head="The basement got\na shuffleboard court.",
         sub="Westfield luxury basement",
         mode="fit",
         note="Landscape source and the table's length is the subject, so it "
              "is letterboxed. No dimension claimed - I cannot measure it."),

    dict(key="S16", src="geist-upper-level-6.jpg",
         head="Panelling is just trim\nuntil somebody gets\nthe spacing right.",
         sub="Geist upper level",
         note="Dropped the Fishers black-on-white shower: a shampoo bottle "
              "sat in the niche and the composition was ordinary. Applied "
              "wall panelling instead - F8's caption already sells this as "
              "the work nobody photographs, and the panel layout is the "
              "whole skill."),

    dict(key="S17", src="modern-farmhouse-3.jpg",
         head="Farmhouse doesn't\nhave to mean plain.",
         sub="Modern farmhouse",
         note="Patterned floor against a simple palette."),

    dict(key="S18", src="zionsville-kitchen-main-level-6.jpeg",
         head="A whole room built\nfor sitting still.",
         sub="Zionsville main level",
         bias=0.02, zoom=1.30,
         note="Replaced the Fortville pavilion - no exterior work, standing "
              "rule from Eric. Floor-to-ceiling built-ins, dark walls, "
              "sputnik fitting. Cropped hard to the top because the lower "
              "frame holds a waste bin and a drop cloth, which is why this "
              "shot was passed over the first time."),

    dict(key="S19", src="noblesville-floor-to-ceiling-tile-4.jpg",
         head="The mirror is\nthe light fixture.",
         sub="Noblesville floor to ceiling tile",
         note="Replaced the white oak tub, which was warm but ordinary. F9's "
              "caption names both parts: 'a backlit mirror over a floating "
              "vanity'."),

    dict(key="S20", src="fishers-spa-retreat-2.jpg",
         head="Two oval mirrors, and\na wall that didn't need\nanything else.",
         sub="Fishers spa retreat",
         note="Built the Westfield bar top first and cut it: the crop held no "
              "brass tap, so the headline named something not in frame - the "
              "mantle mistake again. Oval mirrors and sconces, both visible."),

    # ---- third set -----------------------------------------------------
    # Interiors only from here.

    dict(key="S21", src="zionsville-kitchen-main-level-7.jpeg",
         head="Dark ceilings make\na room feel bigger.\nNobody believes us.",
         sub="Zionsville main level",
         note="Dining room with the ceiling carried in a dark colour. The "
              "claim is offered as a design opinion, not as a fact."),

    dict(key="S22", src="zionsville-kitchen-main-level-2.jpeg",
         head="Three lanterns doing\nthe work of a\nwhole ceiling.",
         sub="Zionsville main level",
         note="Sculptural pendant cluster. The count is visible in frame."),

    dict(key="S23", src="carmel-double-shower-2.jpg",
         head="A vanity that\ndisappears into\nthe dark.",
         sub="Carmel double shower",
         note="Dark cabinetry under a backlit mirror. Kept distinct from S19 "
              "by making the vanity the subject rather than the light."),

    dict(key="S24", src="fishers-full-gut-walk-in-2.jpg",
         head="Sconces between\nthe mirrors.\nNot above them.",
         sub="Fishers full gut walk-in",
         note="A real and visible layout decision - most vanities put the "
              "light over the glass, which lights the top of your head."),

    dict(key="S25", src="bathroom-green-tile-7.jpg",
         head="Green tile is a\ncommitment.\nSo commit.",
         sub="Carmel green tile bath",
         note="Interior of the green shower. Pairs with S2 - space them."),

    dict(key="S26", src="zionsville-jack-and-jill-5.jpg",
         head="An arch costs more.\nIt's also the only\nthing you'll notice.",
         sub="Zionsville jack and jill",
         note="Arched tiled alcove over the tub, plainly in frame."),

    dict(key="S27", src="westfield-basement-masterpiece-3.jpg",
         head="Lit shelves turn\nthe bottles into\nthe decoration.",
         sub="Westfield luxury basement",
         note="FB's caption names integrated LED shelving, so the lighting "
              "claim is supported rather than inferred."),

    dict(key="S28", src="fishers-wetroom-2.jpg",
         head="A bench, because not\nevery shower is\na quick one.",
         sub="Fishers wet room",
         note="Built the raking-ceiling shot first and cut it - mostly blank "
              "plaster, and it did not show the courses it claimed."),

    dict(key="S29", src="fishers-double-shower-5.jpg",
         head="Pebble underfoot.\nGlass everywhere else.",
         sub="Fishers double shower",
         note="The first version claimed two shower heads and only one was "
              "visible. Materials in frame instead; the project name carries "
              "the double-shower point without counting fixtures."),

    dict(key="S30", src="geist-upper-level-9.jpg",
         head="A staircase rebuilt\none tread at a time.",
         sub="Geist upper level",
         note="Built the range hood first and cut it - white on white with "
              "kitchen clutter in the corner. F8's caption states this one "
              "directly: 'A staircase rebuilt one tread at a time.'\n"
              "Then built it against geist-upper-level-11 and caught THAT on "
              "review: it is a sitting room with a sofa, no staircase in it. "
              "The contact sheet sorts -10, -11, -12 ahead of -2, and I read "
              "a grid position instead of a filename. Verify the file, not "
              "the tile."),
]


def cover(path, bias=0.35, zoom=1.0, bias_x=0.5):
    """Fill 1080x1920 without distorting - crop the overflow.

    bias is where the crop sits vertically: 0 is the top of the photo, 1 the
    bottom. The default leans upward because in a room shot the subject is
    rarely on the floor. A card whose subject IS the floor needs the opposite,
    which is what bias is for - the alternative is a headline about a mosaic
    over a photo of a ceiling.

    zoom > 1 takes a tighter region, for when the subject is a small part of
    a wide shot. bias_x does the same horizontally - a subject sitting left
    of centre in a wide shot is lost by a centred crop.
    """
    im = Image.open(path).convert("RGB")
    target = (W * S) / float(H * S)

    box_w = min(im.width, im.height * target)
    box_h = box_w / target
    if box_h > im.height:
        box_h = im.height
        box_w = box_h * target

    box_w, box_h = box_w / zoom, box_h / zoom
    left = (im.width - box_w) * min(1.0, max(0.0, bias_x))
    top = (im.height - box_h) * min(1.0, max(0.0, bias))

    im = im.crop((int(left), int(top), int(left + box_w), int(top + box_h)))
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
    canvas = (letterbox(src) if fitted else
              cover(src, card.get("bias", 0.35), card.get("zoom", 1.0),
                    card.get("bias_x", 0.5)).convert("RGBA"))

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
    # Always .jpg. Letting the output inherit the source extension produced a
    # lone .jpeg among the cards, which any *.jpg glob then silently skipped.
    stem = os.path.splitext(card["src"])[0]
    path = os.path.join(OUT, "%s-%s.jpg" % (card["key"], stem))

    # Clear any earlier card for this key. Swapping a card's source photo
    # leaves the previous render sitting in the folder under the same key, and
    # a stale card in the folder Eric posts from is a card that gets posted.
    for old in glob.glob(os.path.join(OUT, "%s-*" % card["key"])):
        if os.path.basename(old) != os.path.basename(path):
            os.remove(old)
            print("       removed stale %s" % os.path.basename(old))
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
