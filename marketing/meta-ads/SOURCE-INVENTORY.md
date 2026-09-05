# Source inventory — every clip, identified by frames

Built 2026-09-04, after Eric's fair complaint that cuts were being made without a full grasp of the
footage. Four separate errors trace directly to that gap:

- a 14-foot mantle claimed over a crop the mantle was not in
- a reel built for the wrong Westfield basement
- the Zionsville star mosaic floor overlooked in favour of a plain penny round

**A filename is a claim about a clip. A frame is evidence.** Every entry here was identified by
looking at three frames — a quarter, half and three quarters through — via `identity_sheets.py`.
Re-run it whenever clips are added or renamed:

```bash
python identity_sheets.py --per 8
```

---

## Corrected: the six Fishers spa clips are one job

**Eric confirmed 2026-09-04: `spa retreat fishers*.mp4` and `fishers spa finished*.mp4` are the
same job, and the progress clips are the same room.** I raised them as two bathrooms. That was
wrong, and the record is kept here rather than quietly deleted, because the reasoning is worth
not repeating.

What I read as two rooms:

| | progress clips | finished clips |
|---|---|---|
| Vanity | light, raised panel | dark stained, recessed |
| Metal | chrome | brass |
| Shower | glass enclosure, bench | walk-in, linear drain |

What that was actually showing: the progress clip is shot in hard direct sun through an
uncovered window, at a stage before the room was finished out. Colour and door profile both
read differently under that light and at that angle.

**The evidence I underweighted was the fixture that does not change** - a chrome ladder towel
rail, on the wall in the progress clip and beside the tub in the finished ones. Cabinet colour
shifts with light and with stage. A towel rail does not.

> **Rule this earns: identify a room by what cannot change** - ceiling shape, window position and
> proportion, the fixtures already fitted. Not by finish colour, not by what is still missing, and
> not by anything the light can alter. Colour is the least reliable evidence in a photograph and I
> used it as the strongest.

Nothing is re-attributed. **FA, FI and FK all stand**, and all three are the Spa Retreat.

### What is still true and still matters

There is **no true before** for this job - no pre-demolition footage anywhere. The FK pills read
**DEMO** and **DONE** for that reason, and that stays right: the opening state is our own
demolition, not how the homeowner lived with the room.

## Rotation: the coded size is not the frame size

Almost every clip reports **3840x2160**, which reads as landscape. It is not. These are phone
recordings carrying a display matrix, so they *decode* as 2160x3840 portrait — which is why the
contact sheets come out upright without special handling.

Two clips are natively portrait and need no rotation at all:

| clip | coded | note |
|---|---|---|
| `wet room finished 2.mp4` | **2160x3840** | the only native-portrait 4K in the archive |
| `fishers spa finished 4.mp4` | **1080x1920** | native reel size, 35.8s |

Low-resolution, use with care: `Messenger_creation_17323097` (640x368, unusable),
`Messenger_creation_3F51ECFC` / `CF3FD133` (1280x720, Topaz-upscaled for F5),
`fishers full gut waterproofing.mp4` (540x720), `geist three bath finished 4.mp4` (1280x720),
`VID_20260623_182030.mp4` (1920x1440).

---

## Progress folder — `Pending/new in progress/` (14 clips)

| clip | len | what the frames show | project | crew |
|---|---|---|---|---|
| `double shower.mp4` | 13.2s | Tiler setting wall tile, kneeling, whole clip | Fishers double shower | **yes, throughout** |
| `geist upper level 1.mp4` | 14.0s | Stair balusters masked, panelled walls, chandelier | Geist upper level | no |
| `geist upper level 2.mp4` | 16.8s | Bare stair treads, worker kneeling on landing | Geist upper level | **yes** |
| `geist upper level(1).mp4` | 10.6s | Hallway, balusters, papered floor | Geist upper level | **yes** |
| `geist upper level.mp4` | 18.9s | Panelled rooms, papered floors, materials stacked | Geist upper level | no |
| `noblesville bathroom 2.mp4` | 19.2s | Wall tile going up, hands in frame | Noblesville | **hands only** |
| `noblesville bathroom 3.mp4` | 11.8s | Orange KERDI board, green membrane, tile | Noblesville | **yes** |
| `noblesville bathroom.mp4` | 8.6s | Floor tile with levelling clips, glass block window | Noblesville | no |
| `spa retreat fishers 1.mp4` | 11.4s | **Demolition** — studs, subfloor, vaulted ceiling | Fishers Spa Retreat | **yes 4.5–7s** |
| `spa retreat fishers(1).mp4` | 12.2s | **Orange KERDI board**, floor tile with clips, chrome towel rail | Fishers Spa Retreat | **yes 0s, 10–12s** |
| `spa retreat fishers.mp4` | 14.4s | Near-finished — light vanity, glass shower with bench | Fishers Spa Retreat | no |
| `westfield basement.mp4` | 20.4s | Bare slab, framing, unfinished basement | Westfield luxury basement | distant |
| `zionsville bath 3.mp4` | 22.5s | **Star mosaic floor**, white vanity, alcove tub | Zionsville jack and jill | no |
| `zionsville bathroom.mp4` | 15.6s | Empty room, hardwood, **oval porthole window** | Zionsville jack and jill (before) | no |

## Archive — `Pending/Archive/` (33 clips)

| clip | len | what the frames show | project | crew |
|---|---|---|---|---|
| `Messenger_creation_17323097…` | 33.2s | Green tile bath, wood vanity — **640x368, unusable** | Carmel green tile | no |
| `Messenger_creation_3F51ECFC…` | 17.2s | Green tile, freestanding tub, arched mirror | Carmel green tile | no |
| `Messenger_creation_CF3FD133…` | 30.2s | Green tile, tub, drum pendant, dark floor | Carmel green tile | no |
| `VID_20260623_182030.mp4` | 9.3s | **Green vertical stacked tile shower, mid-build** | unidentified green bath | no |
| `carmel double finished 1.mp4` | 19.5s | Grey large-format, hex pan, black fixtures | Carmel double shower | no |
| `carmel double finished 2.mp4` | 11.1s | Hex pan, grey tile, black fixtures | Carmel double shower | no |
| `carmel double finished.mp4` | 33.3s | Grey tile, backlit mirror, dark vanity — **longest** | Carmel double shower | no |
| `fishers double finished.mp4` | 12.7s | Wood vanity, glass shower, pebble floor | Fishers double shower | no |
| `fishers full gut finished 2.mp4` | 25.0s | Wood vanity, beige tile, hex pan | Fishers full gut | no |
| `fishers full gut finished.mp4` | 37.8s | Beige shower, niche, hex mosaic pan — **longest** | Fishers full gut | no |
| `fishers full gut waterproofing.mp4` | 16.1s | **KERDI-BOARD legible** — 540x720 | Fishers full gut | no |
| `fishers spa finished 1.mp4` | 38.4s | Dark vanity, brass ovals, tub under blinds | Fishers Spa Retreat | no |
| `fishers spa finished 3.mp4` | 10.3s | Rain head, lit niche, vertical tile | Fishers Spa Retreat | no |
| `fishers spa finished 4.mp4` | 35.8s | Same room — **native 1080x1920** | Fishers Spa Retreat | no |
| `geist three bath before.mp4` | 26.5s | **True before** — dated shower, jetted tub, clutter | Geist three bath | no |
| `geist three bath finished 2.mp4` | 17.6s | White vanity, LED mirrors, dark floor | Geist three bath | no |
| `geist three bath finished 3.mp4` | 19.1s | Navy vanity, marble shower, brass | Geist three bath | no |
| `geist three bath finished 4.mp4` | 78.5s | **Blue picket tile** — 1280x720, longest in library | Geist three bath | no |
| `geist three bath tile.mp4` | 9.5s | **Navy picket tile, green levelling clips, orange KERDI** | Geist three bath | no |
| `geist upper level finished 1.mp4` | 16.7s | Primary bedroom, coffered LED ceiling, fireplace | Geist upper level | no |
| `geist upper level finished 3.mp4` | 19.3s | LED-lit built-ins, library ladder | Geist upper level | no |
| `geist upper level finished 4.mp4` | 7.7s | Built-ins, ladder, stair | Geist upper level | no |
| `geist upper level finished 5.mp4` | 13.0s | Art over stair, ladder, built-ins | Geist upper level | no |
| `geist upper level finished 6 long.mp4` | 63.3s | Stair, built-ins, bedroom — **longest** | Geist upper level | no |
| `geist upper level finsihed 2.mp4` | 19.5s | Bedroom, panelled wall, fireplace *(sic — filename typo)* | Geist upper level | no |
| `laundry tile.mp4` | 11.9s | **Marble checkerboard, levelling clips** | one-off, Fishers per Eric | no |
| `noblesville finished.mp4` | 19.9s | Light shower, LED niche, brass, alcove tub | Noblesville | no |
| `wet room finished 1.mp4` | 33.6s | Navy vanity, oval mirrors, textured tile | Fishers wet room | **person 32.4–33.6s** |
| `wet room finished 2.mp4` | 32.4s | Same room — **native portrait 2160x3840** | Fishers wet room | no |
| `zionsville finished 2.mp4` | 20.1s | Oak vanity, porthole, arched alcove tub | Zionsville jack and jill | no |
| `zionsville finished.mp4` | 45.4s | Same room, black soapstone, star floor — **longest** | Zionsville jack and jill | no |
| `zionsville progress.mp4` | 13.2s | Arched alcove being tiled, white subway | Zionsville jack and jill | no |
| `zionsville tile 2.mp4` | 12.3s | Star mosaic floor, alcove tub, niches | Zionsville jack and jill | no |
| `zionsville tile.mp4` | 10.4s | **Star mosaic going down**, drain, unpainted walls | Zionsville jack and jill | no |

---

## Strong material never used in any cut

1. **`geist three bath tile.mp4`** — navy picket tile with green levelling clips over orange KERDI.
   The Geist three-bath has a before/after (F6) but **no process cut**, and this is the best
   tile-setting footage in the library after the Zionsville star floor.
2. **`wet room finished 2.mp4`** — the only **native-portrait 4K** clip. FF was built from
   `wet room finished 1` and cropped; this one needs no crop at all.
3. **`fishers spa finished 4.mp4`** — 35.8s, native reel size, better framed in places than the
   clip FI actually uses.
4. **`zionsville finished.mp4`** (45.4s) and **`geist upper level finished 6 long.mp4`** (63.3s) —
   the two longest finished masters, both barely touched.
5. **`geist three bath finished 4.mp4`** — 78.5s, the longest clip in the library. Only 1280x720,
   but that is Topaz territory and F5 proved the workflow.
6. **`VID_20260623_182030.mp4`** — a green tile shower mid-build that belongs to **no identified
   project**. Worth Eric naming.

## Still genuinely missing

- **True befores.** Only two exist in the whole library: `geist three bath before.mp4`, and the
  three `white-oak-primary-bath-fishers-before-*.jpg` stills. Every other "before" in the queue is
  really demolition or bare construction, and is labelled accordingly.
- **A finished room for Noblesville's double shower** and for the Westfield mid-job footage.

## Standing rules this inventory exists to serve

- **Identify by frame, never by filename.** Eric's renaming made matching far easier and is not the
  problem here; two jobs simply ended up with confusable names.
- **Check the site's project photos before attributing a clip.** That is what settled the spa
  question, and it would have settled the Westfield basement mix-up too.
- **Sample at 0.7s when auditing for people.** A 4-second sheet once stepped straight over someone
  who was in frame for two.
