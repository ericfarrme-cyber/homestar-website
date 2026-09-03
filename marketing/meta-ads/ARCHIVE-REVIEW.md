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

---

## Correction: the 2026-01-16 before does NOT pair with the 2026-01-16 after

The original review read `20260116_142314` (dated builder bath) and `20260116_151342` (oak vanity,
pebble-pan double shower) as a before-and-after **because they were shot 50 minutes apart**. Eric
corrected it: the after that belongs to that before is the **navy picket tile** bath,
`VID_20260501_144649`.

**Same-day is not the same job.** Eric shoots more than one property in an afternoon, so a shared
date proves nothing. That is the third time on this archive that a *file property* — resolution,
edge energy, and now timestamp — has been treated as evidence about *content*. The only reliable
method is to look at the frames.

The visual evidence for the corrected pairing is structural and much stronger than a timestamp:
both clips show the **same vaulted ceiling** over the vanity wall, and the room proportions and
doorway position match. Ceilings do not change in a remodel, which makes them the thing to match on.

| | before | after |
|---|---|---|
| file | `20260116_142314.mp4` | `VID_20260501_144649.mp4` |
| shot | 2026-01-16 | 2026-05-01 |
| display | **2160x3840 (true 4K)** | 720x1280 |
| length | 26.5s | 78.5s |
| room | framed sliding-glass shower, corner jetted tub in a tiled deck, white raised-panel double vanity with a counter hutch, beige tile | navy elongated-picket tile, brass, freestanding tub, large walk-in shower with bench and niche, LED-lit mirrors, wood double vanity with tower cabinet, herringbone floor |

**The quality runs backwards here:** the before is true 4K and the after is 720p, so the *after*
needs the Topaz lift, not the before. Trimmed to the first 48s before upscaling — everything used
in the cut sits inside that, and it keeps every timestamp in the edit valid.

**Two privacy notes for this footage.** The before is a lived-in room: toiletries, medication
bottles, a laundry basket, a pet bowl. And at 14-16s the window looks out onto the street with
neighbouring houses and a parked vehicle in frame. Neither belongs in a published cut — the street
view especially, since it can identify the property. Both avoided in the selected segments.

`20260116_151342` (oak vanity, pebble pan, black hardware, double shower) is therefore a **separate,
still-unmatched job** — and a candidate for a project page of its own.

---

## Job match confirmed: the before/after is the Geist three-bathroom project

Eric confirmed it. `20260116_142314` (before) and `VID_20260501_144649` (after) are the **master
bath of `three-bathroom-remodel-geist`** — "Three-Bathroom Remodel in Geist, Fishers". City is
**Fishers**, so the end card's Hamilton County line is correct.

Every detail in the after clip matches that project page rather than merely being consistent with
it: navy crackle-glaze picket tile, double vanities with backlit mirrors, the custom storage tower
between the sinks, champagne bronze against matte black, herringbone floor tile, and the vintage
pendant over the freestanding tub. This is a verified match, not a visual guess.

**Job duration is two months (Eric).** The gap between the two videos is 3.5 months and is *not*
the build time — the before was filmed well ahead of the work. The first caption said "four months
later" off the video dates, which would have published a wrong number about how long HomeStar takes.
**Dates on footage describe when it was filmed, nothing else.**

The project page also gave the story the first cut was missing. The master's layout would not
accommodate the shower the homeowners wanted, because an awkward entry door and a linen closet were
eating the space; HomeStar relocated the door and reconfigured the closet to unlock it. That is the
Reel's spine now — *"This was the primary bath." / "The shower wouldn't fit." / "So we moved the
door."* — and it beats any line invented from looking at the footage.

**Read the project page before writing the copy.** Three of the strongest details in this caption —
the hand-glazing, the storage tower, the morning light on the tub — are invisible in the footage and
would never have been recovered from frames alone.

**One question still open:** the project page lists "vaulted ceilings" among what the remodel
delivered, but the before footage already shows a vaulted ceiling. If it was pre-existing, *"Same
room. Same ceiling."* is the better on-screen beat and is a two-minute swap. The shipped copy does
not depend on the answer.

### Still unmatched

`20260116_151342` (oak vanity, pebble-pan double shower, black hardware) — filmed the same
afternoon as the Geist before, but a **different job**, and it does not correspond to any project
page yet.

---

## New batch, 2026-09-03: `Pending/new in progress/` — 14 clips, all native 4K

Eric named these by project, which removes the matching bottleneck entirely. **All 14 are
2160x3840 portrait at ~41 Mbps** — the best material in the library by a wide margin, six times the
pixel count of anything cut so far and no upscaling needed.

| Project | Clips | What they show |
|---|---|---|
| `geist-upper-level-remodel` | 4 | Trim carpentry, applied wall panelling, a new white-oak staircase going in over dark treads, every baluster individually masked for paint |
| `spa-retreat-bathroom-fishers` | 3 | Late finishing — quartz in, freestanding tub, heated towel rail, frameless glass, floors still papered |
| `floor-to-ceiling-tile-noblesville` | 3 | Large-format tile being set with levelling clips and a laser line |
| `jack-and-jill-zionsville` | 2 | **A before and a finished walkthrough** |
| `double-shower-*` | 1 | A tiler setting the stacked tile by hand |
| `basement-finish-westfield` | 1 | Framing, drywall, recessed lighting over bare concrete |

**The folder name is not the stage.** It is called "new in progress", but `zionsville bathroom.mp4`
is a *before* and `zionsville bath 3.mp4` is a *finished* walkthrough. Every clip still has to be
looked at. Same lesson as resolution, edge energy and timestamps: the label is not the content.

### Built: `F7-zionsville-jack-and-jill-beforeafter` — 18.97s

First project with a before and after **both native 4K**. Copy is built on the actual problem the
project page describes — a bathroom two siblings have to share:

> "Two kids. One bathroom." / "So we gave them a sink each." / "Shared. But not a compromise."

**End card names Zionsville and Boone County, not Hamilton.** Zionsville is in Boone County, and
reusing the Hamilton line there would have read as boilerplate at best and wrong at worst. Local
specificity is also better for the thing the whole SEO thesis rests on.

Two things the footage forced:

- The before opens on an **empty bedroom**; only 9.2-15.4s is the bathroom. It is cut at 15.0s
  because **a person walks into the right of frame** just after.
- The before block was first cut at 3.8s and that was too short — the payoff landed before the
  viewer had registered the problem. Widened to 5.0s. The Geist cut runs 5.6s, which is about right.

### Also new: a measured music library

`analyse_music.py` catalogues `Pending/music/` and finds the loudest, steadiest window in each
track, scored as mean level minus level variation. Output in `MUSIC.md`.

It validates against the one window that was picked by ear: it independently chose **69.2s** for
Quiet Neon where 70.5s had been hand-tuned. It also confirms why that mattered — **Quiet Neon opens
11.9 dB under its own average**, so starting at zero would open a Reel nearly silent.

Worth knowing: **`Arco d'Avanguardia` has a true peak of +0.2 dBTP** — above full scale. Usable, but
it needs limiting rather than being dropped in as-is.

---

## People in frame: what survives without them

Eric asked what the content looks like if the clips containing crew are avoided. Mapped at
1-second resolution rather than estimated:

| clip | length | people-free | what survives |
|---|---|---|---|
| `geist upper level 2.mp4` | 16.8s | **14.7s** (0-11.5, 13.6-16.8) | new treads going in — the best shot in the batch |
| `geist upper level.mp4` | 18.9s | **10.0s** (4.6-14.6) | applied wall panelling with glue still showing, hallway, staircase |
| `geist upper level(1).mp4` | 10.6s | **8.4s** (0-1.8, 4.0-10.6) | the finished landing |
| `geist upper level 1.mp4` | 14.0s | **5.7s** (0-3.5, 11.8-14.0) | stacked trim, masked balusters |
| **Geist total** | 60.3s | **38.8s** | |
| `double shower.mp4` | 13.2s | **~3.0s** (1.0-4.0) | floor tile only |

**Geist loses nothing that matters.** 38.8 seconds is nearly double a Reel's needs and the crew are
absent from the strongest material. `F8-geist-upper-level-progress` (17.97s) is cut entirely from
those windows.

**`double shower.mp4` does not survive.** The tiler is in frame from 4s to the end; what is left is
three seconds before the interesting work starts. That project needs content from finished footage
instead — the clip itself is only usable with a person in it.

### Embedded dates — useful, but they are NOT job durations

Every clip carries a 2025 `creation_time`.

**Do not publish a build time derived from these dates.** Eric: the before is shot *before the
project starts*, and the after *a week or two after it finishes*. So the gap between two videos is
the build **plus** a pre-start buffer **plus** a post-completion tail. It bounds the duration from
above and never gives it.

Zionsville's clips are eight weeks apart, so the build was **less than eight weeks** — how much
less, only Eric knows. This is the same error that nearly published "four months later" on the Geist
Reel off a 3.5-month video gap, and Eric corrected that to two months. The generalised rule:

> **A date on footage says when the camera rolled. Any claim about how long a job took has to come
> from Eric, not from arithmetic on filenames.**

| project | shot |
|---|---|
| `floor-to-ceiling-tile-noblesville` | Jun 2025 |
| `jack-and-jill-zionsville` | Aug 2025 (before) → Oct 2025 (after) |
| `geist-upper-level-remodel` | Aug 2025 |
| `spa-retreat-bathroom-fishers` | Oct-Nov 2025 |
| `basement-finish-westfield` | Oct 2025 |
| `double-shower-*` | Dec 2025 |

### Copy has to match the frame under it

The first cut's beat read *"Every baluster, taped by hand."* That is true of the footage under the
**hook**, but the beat lands four seconds later over the stair treads — so the line described a shot
the viewer had already left. Now *"Rebuilt one tread at a time."*

**Check what is actually on screen when a plate appears, not what is in the clip somewhere.**
