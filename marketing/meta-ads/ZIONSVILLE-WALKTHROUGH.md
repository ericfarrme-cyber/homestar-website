# Zionsville basement — walkthrough commercial treatment

Built from an actual read of all ten frames in
`public/images/zionsville-basement-*.jpg` (2400x1600, shot 2026-08-13), not from
a generic basement script.

## What the space actually is

Seven distinct zones, in a **walkout**:

| Zone | Frames | What's there |
|------|--------|--------------|
| **Wet bar** | 1, 2, 3, 4 | Black accent wall, dark stained cabinetry, green-black quartzite counter *and* full-height backsplash, floating shelves on integrated lighting, undercounter + wine fridge, matte black faucet, undermount sink |
| **Dining nook** | 1 | Bench under twin windows, pedestal table, velvet chairs, twin ring chandeliers, double-height ceiling |
| **Wine room** | 6 | Under-stair conversion — saddle-leather walls, gold geometric paper on the sloped ceiling, black wall racks on three walls, ~60 bottles |
| **Media lounge** | 7, 8 | Charcoal accent wall, wall-mounted TV, boucle sectional, tan leather swivels, safari slings, hide rug, **lit display niche with warm wood surround** |
| **Card table** | 5 | Antique round table, wishbone chairs with sheepskin, cowhide rug, dark sideboard |
| **Guest bath** | 9 | Walk-in shower, sliding glass, subway tile, matte black fixtures, white oak vanity |
| **Drop zone** | 10 | Floating console, round mirror — styling vignette, weakest commercially |

**Adjacency is readable from the frames.** Frame 8's doorway shows the card
table's pulley lamp, so lounge and card room connect. Frame 9's mirror reflects
the staircase and an amber chandelier, tying the bath back to the stair core.
The bar and dining share the bright walkout end.

**Material palette:** green-black quartzite, dark stained oak, matte black
hardware, saddle leather, brass, white oak, hide and sheepskin.

## The thing worth selling

Not "we finished a basement." The frames say something better:

> **You walk down the stairs expecting a basement. You don't find one.**

Frame 1 is the proof — full-height windows, a door to grade, real daylight,
green trees. Nothing about it reads *below grade*. Add a wine room hidden under
the stairs and a bar with real stone, and this is a floor of a house.

That is a narrative a slideshow cannot tell. It needs to be ordered as a **walk**.

## Shot order — a descent, not a gallery

| # | Frame | Motion | Beat |
|---|-------|--------|------|
| 1 | 9 (mirror) | slow push on the reflected staircase | the stairs — you think you know what's coming |
| 2 | 1 | wide, slow drift right toward the windows | the reveal: daylight, trees, a door to grade |
| 3 | 2 | push in on the bar wall | the bar, full height |
| 4 | 3 | slow drift across stone and shelves | the material — backlit shelves, whiskey, stone |
| 5 | 4 | tight, near-static | craftsmanship: faucet, undermount sink, veining |
| 6 | 6 | push into the wine room | the discovery — *under the stairs* |
| 7 | 7 | wide drift across the lounge | where people actually sit |
| 8 | 8 | drift to the lit niche | the built-in detail |
| 9 | 5 | settle on the card table | the room keeps going |
| 10 | end card | — | brand + CTA |

Frame 10 is cut. It's styling, not craft.

## Copy

**Hook (over shot 1-2):**
> You expect a basement.

**Turn (shot 2, as the windows land):**
> This is a walkout in Zionsville.

**Body beats:**
> A bar with real stone. | A wine room under the stairs. | A room nobody wants to leave.

**End card:**
> Head: The best room in the house is the one you haven't built yet.
> Sub: Finished basements in Hamilton County — $45K to $200K.
> CTA: TOUR THIS BASEMENT

## Build options

1. **Deterministic** — Ken Burns / parallax over the real frames using the
   existing `build_video_ads.py` overlay, safe-zone, music and 9:16 + 4:5
   machinery. Zero invented pixels, no credits.
2. **Higgsfield image-to-video** — real parallax per shot
   (`cinematic_studio_video_v2` has camera control; `kling3_0`, `seedance_2_5`,
   `flux_3_video` all accept a start image). Costs credits, and every clip needs
   frame-by-frame review against the AI-detail rule in CAMPAIGN.md.
3. **Hybrid** — deterministic base, AI motion only on shots that survive review.

The shot order above is the deliverable either way. It is what the review
produced, and it is what makes this a walkthrough rather than a slideshow.
