# Job video archive — review and social plan

### Reviewed 2026-09-03. 36 files from Drive `HomeStar / Videos / Archive`, now in `Pending/Archive`.

**Quality is the headline.** 29 of the 36 are **4K portrait, 2160x3840** — six times the pixel count
of the Fishers bath clips the last Reel was cut from, which were 720p. 15 minutes of footage across
15 shoot dates, Aug 2025 to Aug 2026.

---

## ⚠️ Two files to deal with before anything is published

**`20250913_091519.mp4` (43s, 210 MB) is not a job video.** It is family footage — an older man and
a small child sitting on a green tractor, outdoors. It must not go into any social material, and it
is worth knowing it is sitting in a business archive folder. Recommend moving it out.

**`20260710_124318.mp4` is the only landscape file** (3840x2160). Everything else is portrait. It
either needs a centre-crop to 9:16 or should be paired with portrait clips from the same job.

---

## What is in there

| Date | Clips | What it shows | Notes |
|---|---|---|---|
| 2025-08-11 | 1 | Freestanding tub, brass fixtures, chandelier, LED-lit shower niche | Finished, high end |
| 2025-09-10 | 1 | Geometric mosaic shower pan laid, drywall raw, blue tape | **In progress** |
| 2025-09-13 | 1 | — | ⚠️ **personal, not a job** |
| 2025-09-18 | 1 | Light vertical tile alcove tub/shower | |
| 2025-10-03 | 3 | White oak vanity, black soapstone top, oval porthole window, arched mirrors, patterned marble mosaic floor | Finished, very high end |
| 2025-10-15 | 9 | **Two spaces.** Morning: charcoal bath, black fixtures, hex mosaic, backlit mirror. Afternoon: panelled primary suite with coffered LED ceiling and fireplace, plus loft with LED built-ins and library ladder | Richest day, 999 MB |
| 2025-11-24 | 3 | Freestanding tub under shutters, square rain head, linear tile, heated towel rail | Finished |
| 2026-01-16 | 2 | **Dated bathroom first, finished bathroom second** | **Before and after in one day** |
| 2026-03-18 | 1 | White brick tile, black fixtures, freestanding tub, dark hex floor | Strong contrast |
| 2026-04-03 | 3 | Navy vanity, brass hardware, marble-look shower; third clip is **green waterproofing membrane over a tub** | **In progress** |
| 2026-05-01 | 1 | Navy picket tile feature wall, freestanding tub | 78s, longest clip |
| 2026-05-05 | 2 | Stacked grey tile shower, pebble floor, brass, window in shower | Two takes, same space |
| 2026-06-23 | 1 | **Green vertical stacked tile**, freestanding tub, mid-build | A *second* green bath, not Carmel |
| 2026-07-10 | 2 | Dark vanity, marble counter, arched mirrors, pebble shower floor | One is landscape |
| 2026-08-04 | 1 | Black and white checkerboard floor being set, spacers visible | **In progress** |

Four more are re-compressed shares (`Messenger_creation` x3, `Business Suite_creation`), 368x640 to
720x1280.

**Correction: three of those are the Carmel job.** They were first written off as unusable on
resolution alone, without anyone looking at what was in them. That was the wrong filter - it sorted
by file property rather than content, and nearly buried the only footage of a project that already
has a page on the site. **Judge footage by what it shows first, then by whether it is usable.**

The consequence is real though: there is **no 4K footage of Carmel**. The best available is
720x1280, the same resolution as the Fishers bath source. A Reel can be cut from it, but it will be
soft next to the 4K material, and it should be reshot if that bathroom is still accessible.

## Matching to the website

Only **2 of the 27 projects carry any date**, so this cannot be done from metadata. Matching has to
be visual, and most of it needs Eric to confirm. Best reads so far:

- **The three `Messenger_creation` files ARE `green-tile-bathroom-carmel`.** Confirmed against the
  project photos: green vertical stacked tile, the black-and-white basketweave shower pan, walnut
  vanity, arched mirror, brass, plantation shutters, drum pendant, freestanding oval tub.
- **2026-06-23 is a different green bathroom** - brighter green, wider grout, plain pale shower
  floor, wood-look flooring. HomeStar has done at least two green tile baths and this is the other one.
- **2025-10-15 afternoon** → possibly `geist-upper-level-remodel`, which is the only whole-upper-level
  project on the site
- Everything else is unconfirmed, and several look like **jobs with no project page at all** — which
  is the useful finding, because those are new projects worth adding.

## What is worth making

**1. The 2026-01-16 before-and-after.** The single most valuable asset here. A dated bathroom and its
finished replacement, shot the same day, in 4K. Before-and-after is the most persuasive thing a
remodeler owns and the site has almost none of it. This should be the next Reel.

**2. The three in-progress clips** (2025-09-10 pan, 2026-04-03 waterproofing membrane, 2026-08-04
checkerboard being set). These are the "what's behind your tile" story the whole Schluter positioning
rests on, and nobody else posts them because most contractors do not film the middle of the job.
Higher differentiation per second than another finished-room pan.

**3. 2025-10-15**, on volume alone. Nine clips and two distinct spaces supports a proper multi-room
cut, and the panelled suite with the LED coffered ceiling is the most premium footage in the archive.

**Deliberately not first:** the single finished-bathroom clips. They are good, but they are the same
thing the last Reel already did, and there are eight of them.

---

## Refining the Carmel footage — tested 2026-09-03

**The starting point is better than first reported.** The two good Carmel clips are 1280x720 at
**1.87 Mbps**. The Fishers bath source that produced the last Reel was 1280x720 at 2.42 Mbps — same
resolution, about three quarters the bitrate. Not a different quality tier, and the earlier "it will
be soft" framing overstated it.

| clip | res | dur | bitrate | verdict |
|---|---|---|---|---|
| `Messenger_creation_CF3FD133` | 1280x720 | 30.2s | 1.88 Mbps | usable |
| `Messenger_creation_3F51ECFC` | 1280x720 | 17.2s | 1.86 Mbps | usable |
| `Messenger_creation_17323097` | 640x368 | 33.2s | 0.78 Mbps | **drop** |

That leaves **47 seconds of usable Carmel footage** — more than enough for a 20s Reel.

**Three upscale routes compared at 1:1 on the same frame:**

- **Straight lanczos to 1080x1920** — soft, mushy edges.
- **ffmpeg cleanup** (`deblock` + `hqdn3d` + lanczos + `unsharp`) — cleaner edges, but the denoise
  flattens wood grain. Modest gain.
- **Topaz Video, 1080p, 9:16** — clearly best. Cabinet handle, panel edges and countertop line are
  genuinely resolved rather than sharpened-looking. A real step change, not a cosmetic one.

**Method: Topaz-upscale each clip to 1080p before cutting**, then run the normal Reel pipeline.
Note that upscaling is per-clip and costs credits, and the tool has no cost preflight.

**Also worth knowing:** most of the residual softness is motion blur from the handheld pan, not
compression. No amount of processing fixes that — the lever is shot selection, choosing the steadiest
moments, exactly as the Fishers cut did.

### Carmel Reel built 2026-09-03

`F5-carmel-green-tile-bath` — 20.57s, 1080x1920, cut in `build_reel_carmel.py`. Both usable clips
were Topaz-upscaled first (720x1280 / 1.87 Mbps → 1080x1920 / ~18 Mbps) and staged in
`Pending/Archive/_upscaled/`, which is gitignored along with the rest of the raw client media.

Clip B is the spine — a single clean take that moves shower → tub → vanity. Clip A supplies the two
shower angles B does not cover.

**Shot selection was measured, and the measurement was wrong on its own.** A per-half-second
sharpness scan showed edge energy collapsing after ~6.5s in both clips, which reads as the footage
going soft. It is not: the camera is crossing large areas of plain dark floor tile and blank wall,
which have no edges to measure. Contact sheets settled it. **Edge energy scores content, not
quality** — the same trap as judging the Carmel files by resolution instead of looking at them.

Audio verified per-second from raw samples rather than by integrated loudness: steady at ~-21 dB
through 18s, then the intended fade. No dead tail. `astats` with `reset=` did not actually reset and
returned a cumulative average that looked like a smooth ramp — decoding to PCM and measuring
directly is the reliable check.

Three files: silent master, music master, and an 8.72 MB `-upload` copy for the browser upload cap.
**Not scheduled.** Caption and on-screen text in `F5-CARMEL-CAPTION.md`.
