# Posting queue

Everything built and held for later. **Nothing below is scheduled.** Renders live in
`marketing/meta-ads/renders/` and are committed to git, so they survive and are versioned.

Every cut is 1080x1920, H.264, music-only (no voiceover), with a `--reels-upload` copy under 10 MB
for the browser upload path. Music is Eric's own Mureka, so these masters are also clear for
YouTube Shorts and the website.

Last updated 2026-09-03.

---

## Published

| | project | posted |
|---|---|---|
| **F4** | `white-oak-primary-bath-fishers` | Thu 3 Sep, 10:09am — Reel crossposted FB+IG **with caption**; stories both platforms 10:15/10:16am. Voiceover cut. |

## Ready to post — awaiting Eric

| | project | length | what it is | caption |
|---|---|---|---|---|
| **F5** | `green-tile-bathroom-carmel` | 20.6s | Finished walkthrough. Topaz-upscaled from the only Carmel footage that exists. | `F5-CARMEL-CAPTION.md` |
| **F6** | `three-bathroom-remodel-geist` | 20.0s | **Before/after.** Master bath. After rebuilt from the project's own 59 Mbps master. | `F6-NAVY-BEFOREAFTER-CAPTION.md` |
| **F7** | `jack-and-jill-zionsville` | 19.0s | **Before/after.** Both sides native 4K. "Two kids. One bathroom." | `CAPTIONS-F7-FI.md` |
| **F8** | `geist-upper-level-remodel` | 18.0s | **Mid-job.** Trim, panelling, oak staircase. Zero people in frame. | `CAPTIONS-F7-FI.md` |
| **F9** | `floor-to-ceiling-tile-noblesville` | 19.0s | **Full arc.** Membrane → tile → finished room. Rebuilt once the finished footage was named. | `CAPTIONS-F7-FI.md` — **needs a refresh**, it describes the old waterproofing-only cut |
| **FA** | `spa-retreat-bathroom-fishers` | 17.4s | **Whole job in order:** studs → waterproofing → tile → finished. | `CAPTIONS-F7-FI.md` |
| **FB** | `westfield-basement-masterpiece` | 19.6s | **Before/after.** Bare slab → finished luxury lower level. Dovetail credit. | `CAPTIONS-F7-FI.md` |
| **FC** | `jack-and-jill-zionsville` | 17.4s | **Craft cut.** Star marble mosaic going down, then grouted. Second asset from that job. | `CAPTIONS-F7-FI.md` |
| **FD** | `fishers-full-gut-walk-in` | 18.8s | **Full arc.** Studs and Kerdi-Board → finished walk-in. Matches the new project page. | `CAPTIONS-F7-FI.md` |
| **FE** | `double-shower-carmel` | 17.2s | Walkthrough. Charcoal vanity, backlit mirror, grey large-format tile, hex pan. | `CAPTIONS-F7-FI.md` |
| **FF** | `wet-room-bathroom-fishers` | 16.8s | Walkthrough. "The vanity stayed. The tub didn't." | `CAPTIONS-F7-FI.md` |
| **FG** | `geist-upper-level-remodel` | 17.8s | Finished suite and loft. **Payoff companion to F8 — run F8 first.** | `CAPTIONS-F7-FI.md` |
| **FH** | `double-shower-fishers` | 14.8s | Walkthrough. Two heads plainly on camera. Shortest cut - only 12.7s of source. | `CAPTIONS-F7-FI.md` |
| **FI** | `spa-retreat-bathroom-fishers` | 17.6s | Finished walkthrough. Second asset from that job; FA is its process arc. | `CAPTIONS-F7-FI.md` |
| **FJ** | *(one-off, no project page)* | 14.4s | Marble checkerboard going down. Fishers, per Eric. Named no project on the end card. | `CAPTIONS-F7-FI.md` |
| **FK** | `spa-retreat-bathroom-fishers` | 19.2s | **Demo → done.** Two-beat reveal: studs, then the finished room. **Pills read DEMO/DONE, not BEFORE/AFTER** — no true before exists for this job. Third asset from it. | `CAPTIONS-F7-FI.md` |

| **FL** | `three-bathroom-remodel-geist` | 15.0s | **Craft cut.** Navy crackle-glaze picket going on with levelling clips over orange Schluter board, then the finished wall. Companion to F6, which is this project's before/after. | `CAPTIONS-F7-FI.md` |

| **FM** | `zionsville-basement-bar-wine-room` | 16.6s | **Built from photographs.** First cut with no video source at all - ten stills given motion by `build_stills.py`. Black slab bar, oak shelving, wine room under the stairs. Holly Johnson credited. | `CAPTIONS-F7-FI.md` |

| **FN** | `white-oak-primary-bath-fishers` | 13.6s | **True before/after, from photographs.** The only project on the site with a real `beforeAfter` array. Two of three pairs used - see the caption note on the mirror reflection. Second asset after F4. | `CAPTIONS-F7-FI.md` |

**FA, FI and FK are all the same job - confirmed by Eric 2026-09-04.** Spread them widely. FK and FI share their strongest shots,
so those two want the most distance of the three.

## People-in-frame audit — 2026-09-03

**A person's face nearly published.** The first cut of FF ran its last segment to 34.4s of
`wet room finished 1.mp4`; someone walks into the doorway at 32.4s and is fully face-on by 33.0s.
The contact sheet that footage was chosen from sampled every 4 seconds and stepped straight over it.
Trimmed to end at 32.0s.

**Sampling interval is a safety setting, not a convenience one.** A 4-second sheet can miss a person
who is in frame for two. Every cut was then re-audited frame-by-frame at 0.7s against the rendered
master rather than the source:

| cut | verdict |
|---|---|
| FC Zionsville craft | clean |
| FE Carmel double | clean |
| F9 Noblesville | clean |
| FF wet room (after trim) | clean |
| F8 Geist progress | clean - built from mapped people-free windows |
| F6, FB | professionally shot website assets, no crew present |
| FD Fishers full gut | person at 37.5s of source, already excluded |

## Open questions blocking publication

1. **Crew in frame.** F5-FB are all clear, but `double shower.mp4` is only usable with the tiler
   visible. Eric's nod needed before any cut showing crew.
2. **The green membrane** in the Noblesville footage — the orange is unmistakably Schluter Ditra, the
   green is not identifiable from the frame. If it is Kerdi, *"Orange for floors. Green for walls."*
   is a better beat than what shipped.
3. **Westfield square footage** — Eric mentioned "over a thousand", which would be a strong specific
   line on the FB end card. Needs confirming before it goes in copy.
4. **F6 homeowner comfort** — the before footage shows toiletries, medication bottles, a laundry
   basket. Normal for a before, but that family also appears in the testimonial video.

---

## Rules these were built under

- **Music-only is the default.** No voiceover on a cut unless Eric asks for it on that cut.
- **A date on footage says when the camera rolled.** The before is shot before work starts and the
  after a week or two after it finishes, so the gap between clips is an upper bound on the job, never
  the duration. Any build time in copy comes from Eric.
- **Read the project page before writing copy.** The hand-glazing, the storage tower, the tub set
  where the morning light lands - none of it is visible in footage.
- **A plate must describe the frame under it**, not something elsewhere in the clip.
- **Verify by reading back the artefact**, not by watching a row move between tabs. For video that
  means decoding a frame; for a publish it means reading the caption off the live post.
- **Never claim a product from a frame.** Certifications are verifiable; a sheet of membrane at
  4K from across a room is not.

## Source material

| folder | what | state |
|---|---|---|
| `Pending/new in progress/` | 14 clips, project-named, **all native 4K portrait ~41 Mbps** | best material available; no upscaling needed |
| `Pending/Archive/` | 36 clips from Drive | mixed; 29 are 4K, Carmel needed Topaz |
| `Pending/music/` | 6 Mureka tracks | catalogued with best-window analysis in `MUSIC.md` |
| `Pending/Archive/_upscaled/` | Topaz outputs | Carmel and the Geist after |

`Pending/` is gitignored — raw client media never enters the repo.

## Corrected along the way

**FB was built for the wrong project.** There are two Westfield basements on the site -
`basement-finish-westfield` ("on a Budget") and `westfield-basement-masterpiece` ("Luxury
Transformation") - and the source file is named only `westfield basement.mp4`. The first cut assumed
the budget project and put *"You don't have to overspend to do it right"* over a job with a
kegerator and a 14-foot stained red oak mantle.

Eric confirmed it is the luxury one. Rebuilt as a before/after against the finished walkthrough
already shipping on that project page. **A filename that names a city and a room type does not name
a project when the company has done two.**

## Audio, chosen per clip

Eric's instruction: pick the best track for each cut on its own merits, not by carrying over what
was used last. `MUSIC.md` gives the measured basis - loudest steadiest window, and how far each
track's intro sits under its own average.

**Steadiness is not calmness, and that distinction cost two rebuilds.** American Reveal has the
steadiest window in the library and was chosen for FH on that basis; Eric rejected it. Measuring
properly - transient density, high-frequency energy ratio, dynamic variation - showed why: it is the
**brightest** track by a wide margin (0.292 against 0.10-0.19 for everything else) and the second
busiest at 2.06 onsets per second. Even and forward at once. For a quiet room the measure that
matters is onsets and brightness, not spread.

| track | onsets/s | brightness | spread | calm |
|---|---|---|---|---|
| `Before _ After.mp3` | 1.11 | 0.126 | 0.192 | **0.30** |
| `Before _ After (1).mp3` | 1.11 | 0.116 | 0.218 | 0.48 |
| `Arco d_Avanguardia (1).mp3` | 1.00 | 0.183 | 0.218 | 0.78 |
| `Quiet Neon.mp3` | 1.61 | 0.098 | 0.265 | 0.98 |
| `Arco d_Avanguardia.mp3` | 1.72 | 0.188 | 0.211 | 1.01 |
| `American Reveal.mp3` | 2.06 | 0.292 | 0.179 | 1.38 |
| `Brisa de Nylon.mp3` | 3.50 | 0.103 | 0.266 | 1.70 |
| `Brisa de Nylon (1).mp3` | 3.78 | 0.119 | 0.292 | 2.11 |

Lower is calmer. Reproduce with the scoring block in the session notes, or re-derive: onsets are
frame-to-frame level jumps above 1.6x, brightness is mean absolute first-difference over mean
absolute amplitude.

| cut | track | why |
|---|---|---|
| F6 Geist | Quiet Neon @ 70.5s | as originally chosen |
| F7 Zionsville | Before / After @ 92.5s | as originally chosen |
| F8 Geist progress | Brisa de Nylon @ 48.8s | quiet and even under slow craft footage |
| F9 Noblesville | Before / After (1) @ 83.8s | as originally chosen |
| FA Spa Retreat | Brisa de Nylon (1) @ 59.2s | as originally chosen |
| FB Westfield | **American Reveal @ 113.0s** | steadiest window in the library, spread 0.7 dB - the right bed under a reveal |
| FC Zionsville craft | Arco d'Avanguardia (1) @ 138.5s | the one track nothing else uses; builds rather than holds, which suits a craft montage |
| FD Fishers full gut | Before / After @ 92.5s | steadiest intro of any track (-1.0 dB), and this cut opens on a quiet stripped room |
| FE Carmel double | Quiet Neon @ 69.2s | Arco read too bold over charcoal and black; Quiet Neon is cooler and more minimal |
| FF Fishers wet room | Brisa de Nylon @ 48.8s | warm and guitar-led, matching taupe tile and champagne bronze |
| FG Geist finished | Brisa de Nylon @ 48.8s | warm against wood and cove light; Arco was rejected as too brassy. Same bed as F8, which pairs them deliberately |
| FH Fishers double | Before / After (1) @ 83.8s | second calmest measured - 1.11 onsets/s, 0.116 brightness. American Reveal was rejected: brightest track in the library |
| FI Spa retreat finished | Before / After @ 92.5s | **calmest track on every measure taken.** Arco was rejected as too busy |

## Site video assets — swept 2026-09-03

Only two videos live in `public/images/`, both gitignored and therefore local-only:

| file | project | use |
|---|---|---|
| `geist-three-bath-video.mp4` | `three-bathroom-remodel-geist` | **1080x1920 native, 59.45 Mbps.** Now the AFTER for F6. |
| `westfield-basement-masterpiece-video.mov` | `westfield-basement-masterpiece` | 1080x1920, 78.7s. The AFTER for FB. |

**F6's after was originally a Topaz upscale of a 2.42 Mbps phone clip** while the project's own
59 Mbps master sat in `public/images/` unlooked-at. Check the repo's existing assets before
reaching for reconstruction.

No other project has a local video. **Superseded 2026-09-03:** once Eric renamed the archive,
`noblesville finished.mp4` turned up - 2160x3840 at 40.9 Mbps, confirmed the same room by its
floor-to-ceiling large-format tile. F9 was rebuilt as a full arc ending on the finished room rather
than on a close-up of levelling wedges.

There is still **no true before** for Noblesville - nothing pre-demolition - so it is an arc, not a
before/after, and carries no BEFORE/AFTER pill. The double shower remains without finished footage.

## Needs Eric before it can be built

**`laundry tile.mp4`** - a black and white marble checkerboard floor going down, levelling clips
still in. Striking footage, but the filename names a room type and **there are two laundry projects**
(`laundry-room-noblesville` and `laundry-room-geist`). Not guessing which. It is also tile-laying
only, with no finished laundry footage anywhere, so on its own it is thin for a standalone cut.

## Still unbuilt

- **`double-shower-*`** — in-progress clip unusable without the tiler; needs finished footage instead.
- **`20260116_151342.mp4`** — oak vanity, pebble-pan double shower. A real job with **no project page**.
- **Finished walkthroughs** to pair against Noblesville and Westfield, which would give both a
  before/after as well as the mid-job cut they already have.
- **Captions** for F7-FB.
