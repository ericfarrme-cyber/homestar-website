# Meta launch spec

Build sheet for Ads Manager. Decisions confirmed with Eric on 2026-08-26:
**build as drafts (Eric publishes), $50/day, traffic to the website estimate form.**

---

## Tracking status

| | Status |
|---|---|
| Meta Pixel `275995906389395` | ✅ **Live.** Installed 2026-08-26, PageView confirmed received in Test Events |
| Pixel on all 238 site routes | ✅ Verified in the production build |
| Privacy policy disclosure | ✅ Added |
| `Lead` event on estimate submit | ⚠️ **Waiting on the form app** — see below |

The pixel existed in the ad account but had **never received a single event**
before today; Events Manager showed "your pixel hasn't received any activity",
which matched the code exactly. It now fires PageView on every route, so
retargeting audiences start building immediately.

### The one piece still missing

The estimate form is a cross-origin iframe from
`homestar-project-manager.vercel.app`, so this site physically cannot see a
submit — that is a browser security boundary, not a config problem. The
listener is already deployed in `LeadForm` (`src/App.jsx`); the form app just
has to announce the submit.

**Add this to the form app, in its success handler:**

```js
// Tell the embedding page a lead was captured, so it can fire
// the Meta Pixel Lead event. Must run after a successful submit.
if (window.parent !== window) {
  window.parent.postMessage(
    { type: "homestar-form-submitted" },
    "https://www.thehomestarservice.com"
  );
}
```

That is the whole change. The parent already validates the message origin and
fires `fbq('track','Lead')` plus a GA4 `generate_lead`, deduplicated so a
double-submit only counts once.

**Until that ships**, the campaign can only optimise for Landing Page Views.
Build the drafts now by all means, but switch the ad sets to optimise for Leads
once the event is flowing — drafts can be re-pointed before they ever run.

---

## Campaign structure

```
Campaign: HomeStar — Hamilton County — 2026-08
  Objective:  Leads
  Budget:     $50/day, campaign-level (Advantage campaign budget ON)
  Schedule:   continuous, no end date
  Category:   none — remodeling is a service, not a Housing special ad category
              (that applies to housing sale and rental advertising)
```

### Ad set 1 — Whole-home (focal) · ~45% of delivery
```
Conversion location: Website
Audience:  8–12 mi radius around Carmel, Fishers, Westfield, Zionsville,
           Noblesville, Geist
           Age 33+, all genders
           No interest stack — the radius is already tight enough that
           layering interests will starve delivery
Placements: Advantage+ placements (leave on)
Ads:        V1 video (primary), 01, 01b, 01c
```

### Ad set 2 — Trust · ~35%
```
Same audience and placements
Ads: 02 in-house trades, 06 who we are
```

### Ad set 3 — Proof & offer · ~20%
```
Same audience and placements
Ads: 03 basement sq ft, 04 waterproofing, 05 pricing, 07 entertaining floor, V2 video
```

---

## Creative → file map

Upload the **feed 4:5** file as the primary and add the 1:1 and 9:16 as
placement customisations. Videos are the full-resolution files, not the
downscaled previews embedded in the review page.

| Ad | Feed 4:5 | Square 1:1 | Reels 9:16 |
|----|----------|-----------|------------|
| 01 whole-home | `renders/01-whole-home--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 01b schedules | `renders/01b-whole-home-schedules--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 01c kitchen | `renders/01c-whole-home-kitchen--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 02 in-house trades | `renders/02-in-house-trades--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 03 basement sq ft | `renders/03-basement-sqft--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 04 waterproofing | `renders/04-waterproofing-warranty--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 05 pricing | `renders/05-price-transparency--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 06 who we are | `renders/06-who-we-are--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| 07 entertaining floor | `renders/07-entertaining-floor--feed.jpg` | `--square.jpg` | `--reels.jpg` |
| V1 whole-home video | `renders/V1-whole-home-three-baths--reels-video.mp4` | — | — |
| V2 entertaining floor | `renders/V2-entertaining-floor--reels-video.mp4` | — | — |

Primary text, headline and description for each ad are in `CAMPAIGN.md`.
CTA button: **Get a quote** on 01/01b/01c/02/06/V1, **Learn more** on
03/04/05/07/V2.

### Video audio

Both cuts ship silent by design (the Geist source carries an unlicensed music
bed; the Westfield source is already silent). Add a track from Meta's own
royalty-free library at the ad level in Ads Manager — it is cleared for paid
placements.

---

## Destination URLs

All UTM-tagged so Google Analytics can attribute them, with the `#estimate`
fragment last so the page still scrolls to the form.

```
01   https://www.thehomestarservice.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=01-whole-home#estimate
01b  https://www.thehomestarservice.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=01b-whole-home-schedules#estimate
01c  https://www.thehomestarservice.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=01c-whole-home-kitchen#estimate
02   https://www.thehomestarservice.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=02-in-house-trades#estimate
03   https://www.thehomestarservice.com/basement-finishing?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=03-basement-sqft
04   https://www.thehomestarservice.com/bathroom-remodeling?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=04-waterproofing
05   https://www.thehomestarservice.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=05-pricing#estimate
06   https://www.thehomestarservice.com/team?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=06-who-we-are
07   https://www.thehomestarservice.com/basement-finishing?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=07-entertaining-floor
V1   https://www.thehomestarservice.com/whole-home-renovation?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=V1-three-baths
V2   https://www.thehomestarservice.com/basement-finishing?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=V2-entertaining-floor
```

Concepts 03, 04, 06, 07 and the videos point at the matching service or team
page rather than the homepage form, because the ad promises specific content
that lives there. Those pages all carry their own estimate CTA.

---

## Access

Logged in and verified on 2026-08-26. Ad account **530732507357770** (Eric Farr),
270 existing campaigns. 7 stale unpublished drafts were discarded so the
pending-changes bucket is clean before anything new is built.

Still needs a human decision before the build can finish:

- **Page and Instagram account** to run the ads from
- **Payment method** must already be on the account
- **Publishing** — everything is left in draft; Eric publishes

---

## Build progress (2026-08-26)

**Tracking — complete.**
- Meta Pixel `275995906389395` live on all 238 routes; PageView confirmed
  received in Events Manager Test Events.
- `homestar-project-manager` deployed with the postMessage on submit. Verified
  the shipped bundle contains the message and the specific parent origin (no
  wildcard). The chain is now: form submit → postMessage → parent verifies
  origin → `fbq('track','Lead')` + GA4 `generate_lead`.
- The first real form submission will register the Lead in Events Manager.
  Nothing has fired one yet, so `Lead` still shows under "Inactive events".

**Campaign — built as a draft, nothing published.**

| Layer | State |
|---|---|
| Campaign `HomeStar - Hamilton County - 2026-08` | Leads objective, Auction, **$50/day** campaign budget (Advantage+ on), no end date |
| Ad set `01 Whole-home (focal)` | Conversion location **Website**, performance goal **Maximize number of leads**, conversion event **Lead**, Facebook Page **HomeStar Services and Contracting**, location **Carmel, Indiana +15mi** (audience 1.4M–1.7M) |
| Ad `New Leads Ad` | placeholder, not yet configured |

The 7 stale unpublished drafts that were sitting in this account were discarded
first, so the pending-changes bucket contains only this campaign.

### Resolved since

- **Instagram** — already linked. `thehomestarservice` populates automatically
  from the Facebook Page; nothing to connect.
- **Minimum age** — 25 is Meta's ceiling, not a bug. With Advantage+ audience
  on you can only set a *minimum* age and it caps at 25. Reaching 33+ means
  switching Advantage+ audience off and using original targeting, which for
  lead gen usually delivers worse. With a 15-mile radius already constraining
  the audience, 25 is the right call — age is a weak proxy for "homeowner with
  $60K" anyway.
- **Multi-advertiser ads** — turned off. A premium remodeler should not appear
  in a shared ad unit beside competitors.
- **Call button** — Meta pre-filled (317) 279-4798 with Mon–Sat 8am–6pm
  business hours on the ad. Left on; it is a free second conversion path.

### BLOCKED: creative upload needs a human

Meta's media uploader does not keep an `input[type=file]` in the DOM. It builds
one transiently on click and hands straight off to the **native OS file
picker**, which browser automation cannot see or drive. Verified: zero file
inputs in the document before and after clicking Upload, and no iframe holding
one. This is not a workaround-able limitation.

**What Eric needs to do, once:**

Open the media picker in any ad (Ad creative → Set up creative → Video ad or
Image ad → Upload) and drag in everything from:

```
marketing/meta-ads/upload-to-meta/
```

29 files, 21MB total — all 27 stills plus both videos, re-encoded to 6.3MB and
7.2MB so they upload quickly. Meta re-encodes every upload anyway, so the
smaller files are visually identical once transcoded.

Once those sit in the account's media library, the thumbnails are ordinary
clickable elements and everything else can be finished by automation: selecting
creative per ad, primary text, headlines, descriptions, destination URLs, CTA
buttons, library music on the videos, and duplicating the ad set twice for
Trust and Proof & offer.

### Then still to do

1. **Ad sets 2 and 3** — Trust (02, 06) and Proof & offer (03, 04, 05, 07, V2),
   duplicated from ad set 1 so targeting matches.
2. **The 11 ads** — creative, copy from `CAMPAIGN.md`, destination URLs above,
   CTA per ad, and a track from Meta's royalty-free library on the two videos.

### On adding audio

Higgsfield cannot generate music — its audio tool is speech-only and explicitly
refuses standalone music, and its music model is reserved for another pipeline.
So the options are:

- **Meta's royalty-free library, chosen per ad in Ads Manager.** Free, licensed
  for paid placements, nothing to re-render, and it cannot trigger a rights
  claim. This is the recommendation.
- **A licensed stock track** (Epidemic Sound, Artlist) if the same cut is also
  posted organically, where Meta's library is not available.
- **Not** an AI-generated or unlicensed track baked into the file. Music of
  unclear provenance is exactly what gets ads muted or rejected.


---

## Build log - ad 1 complete (2026-08-26)

Creative is uploaded and the first ad is fully assembled. Everything is still
**In draft**; Ads Manager shows "Review and publish (3)" and nothing has been
published.

### `V1 Three bathrooms (video)` - done

| Field | Value |
|---|---|
| Media | V1 video, 1080x1920 |
| Primary text | Three bathrooms in one Geist home... (full text in `CAMPAIGN.md`) |
| Headline | Three Bathrooms, One Contractor |
| Description | Whole-home renovation |
| CTA | **Get quote** |
| Destination | `/whole-home-renovation` with UTM tags |
| Multi-advertiser ads | **Off** |

### Four Meta AI features switched off, deliberately

Meta enables these by default and each one would have damaged the work:

1. **Text improvements** - was generating its own primary text and headlines.
   One variant read *"WARNING: Most Remodelers Will Lie to You!"* - an
   unsubstantiated attack on competitors that is both off-brand and a Meta
   policy risk. Others were generic filler like "Whole-Home Renovations You
   Can Trust".
2. **Video touch-ups** (Meta AI) - would let Meta alter the actual footage.
   This is the exact thing this account's core rule forbids.
3. **Add details to ad layout** - overlays extra auto-generated text on
   creatives that are already typeset.
4. **Create sticker CTA** - pastes an AI sticker over the designed end card.

These are per-ad settings, so **they must be switched off again on every new
ad**, or set once account-wide under Advertising settings.

### Outstanding

- **Music** - Meta's royalty-free library sits behind the media customization
  tools. The Ads Manager renderer became unstable (self-zooming, screenshot
  timeouts) before this could be reached. For these two cuts the right choice
  is **low-level ambient / minimal piano** from the Chill or Cinematic
  category: the footage is calm and premium, and upbeat corporate pop would
  fight the on-screen text and cheapen the imagery. Keep it under the
  narration-free visuals, never let it peak.
- **Advantage+ translation** - still set to all languages. Low priority: it
  only triggers for non-English audiences, and the targeting is English-speaking
  Hamilton County. Worth switching off so Spanish copy never lands over English
  text baked into the video.
- **10 more ads and 2 more ad sets.** Fastest route is to **duplicate this ad**
  rather than build from scratch - duplication carries the AI-off settings, the
  CTA and the tracking, leaving only creative, copy and URL to swap.


---

## Music - solved, and it is free

**Ads Manager has no music option for this ad type.** Confirmed by inspection:
Customize media offers exactly four tools - Placements, Crop, Trim, Thumbnail.
There is no audio anywhere in the ad-level flow. That is a Meta product
limitation, not a setting anyone missed.

**The answer is Meta Sound Collection** at `business.facebook.com/sound/collection`
- Meta's own library, free, and tracks are downloadable as files.

The licence (read in full at `business.facebook.com/sound/collection/terms`,
last modified 16 March 2022) says:

> Meta hereby grants you a non-exclusive, royalty-free licence to use the SC
> Audio Content for **commercial** or non-commercial purposes in content you
> create, upload, and distribute **on the Meta Company Products** ... only. You
> may not perform, distribute, make available or otherwise use the SC Audio
> Content **separately from the Meta Company Products**.

So:

- **Paid Facebook and Instagram ads are covered.** "Commercial purposes" is
  explicit, and no royalty is owed.
- **It cannot travel.** If the same cut is ever posted to YouTube, embedded on
  thehomestarservice.com, or used anywhere off Meta, that version needs a
  separately licensed track. Keep two exports if the video is reused.

### Why Eric has to click, not Claude

The collection is gated behind a terms-of-use agreement that states: *"If you
are accepting on behalf of a legal entity, you represent and warrant that you
are an authorized representative of such entity with the authority to bind
it."* That is a legal agreement binding HomeStar Services & Contracting. It is
Eric's assent to give, so the "I agree" click stays with him.

### The plan once accepted

1. Pick two tracks - low-level ambient or minimal piano. The footage is calm
   and premium; upbeat corporate pop fights the on-screen text and cheapens
   the imagery.
2. Download them, mix under each cut with ffmpeg at a low level so the
   typography still leads, fade out under the end card.
3. Re-upload V1 and V2 and swap the media on the two video ads.

Only the two videos need audio - the nine stills have none.

## Ad sets - all three built

| Ad set | Contains |
|---|---|
| `01 Whole-home (focal)` | V1 video (complete) |
| `02 Trust` | duplicated, ready for 02 and 06 |
| `03 Proof and offer` | duplicated, ready for 03, 04, 05, 07, V2 |

All three carry identical targeting (Carmel +15mi, age 25+), the Facebook
Pixel, the Lead conversion event, and the AI-off settings. Meta's duplicate
dialog offers to "Add an image" via AI on each copy - **unchecked both times**.

Still to build: 9 still ads and the V2 video ad, once music is settled.


---

## Music - done and mixed

Terms accepted 2026-08-26. Track pulled from Meta Sound Collection:

**"Deepest Blue" - Company Money - Ambient, Slow, 1:09**

Mixed into both cuts:

- Trimmed to each video's exact length, resampled to 48 kHz
- `loudnorm` to -16 LUFS, then measured at **mean -18.2 dB, peak -8.3 dB** - a
  bed that supports the visuals rather than competing with the typography
- 1.2s fade in, 2.2s fade out landing under the brand end card

Files:

| | Path |
|---|---|
| Masters | `renders/V1-whole-home-three-baths--reels-video-music.mp4` (13MB), `renders/V2-entertaining-floor--reels-video-music.mp4` (15MB) |
| Upload copies | `_upload/V1-whole-home-three-baths-music.mp4` (6.7MB), `_upload/V2-entertaining-floor-music.mp4` (7.6MB) |
| Source track | `assets/music-deepest-blue.m4a` |

### Two honest caveats

1. **Claude cannot hear the track.** It was chosen on genre, tempo and length
   metadata - Ambient, Slow - not by listening. Eric should approve it by ear.
2. **Only one track downloaded.** Chrome blocked the repeated automatic
   downloads after the first, so "Luminous Stillness", "Rose Petals" and
   "Collective Dream" never landed. Both videos currently share the same bed.
   To get alternates, allow multiple downloads for business.facebook.com and
   click the download arrow on those rows.

### Licence reminder

Meta Sound Collection audio is licensed for Meta platforms **only**. These
music versions must not go on YouTube or be embedded on thehomestarservice.com.
The silent masters in `renders/` remain the versions for anywhere off Meta.

### Re-upload needed

The music versions are new files, so they have to go into the Meta media
library the same way the originals did - drag-and-drop, because the uploader
hands off to the native OS picker. Then swap the media on the two video ads.


---

## Can other tools curate the music?

Asked and answered properly rather than assumed.

**Higgsfield cannot.** Its audio tool is speech-only and its own contract is
explicit: *"it cannot generate music or sound effects for general use, and
there is no standalone music/SFX model here - decline general music or
sound-effect requests rather than substituting a speech model."* Its music
model is reserved for a separate game pipeline and must not be used here. So
Higgsfield can neither generate nor select music for these ads.

**Higgsfield can analyse the finished cut.** `virality_predictor` scores hook
strength, attention, retention risk and creative performance, and
`video_analysis_create` does a scene-by-scene read. Neither judges music
directly, but running the same cut with different beds would give a comparative
signal. Worth doing only after a human has narrowed the field by ear.

**The best curation tool was already in front of us: Meta's own filters.**
The first track was picked from a plain text search for "ambient" with no mood
filter, which is why it was a guess. Sound Collection actually filters on
Genres, Moods, Durations, Vocals and Tempos.

Filtering **Moods = Confident** and **Tempos = Slow** produces a completely
different, far better-matched shortlist - "Confident" is the register that fits
*Major Projects. Master Craftsmanship.*

### Shortlist and comparison mixes

| Track | Artist | Genre | Why |
|---|---|---|---|
| **New Diggs** | Lightbox Music | Cinematic, Slow, 1:13 | Cinematic weight for a reveal; the name is a happy accident for a remodeler |
| **Looking Around** | cloud cover | Cinematic, Slow, 1:08 | Fits a walkthrough tour exactly |
| **Spacious Fields** | Fellow Travelers | Ambient, Slow, 1:03 | Airy and unobtrusive under typography |
| Deepest Blue | Company Money | Ambient, Slow, 1:09 | The original guess, kept for comparison |

All four mixed onto the identical V1 cut with identical settings
(-16 LUFS, 1.2s fade in, 2.2s fade out) so the comparison is fair. Files in
`_compare/`, source tracks in `assets/`.

**Claude still cannot hear any of them.** The shortlist is curated on Meta's
own mood, genre and tempo metadata, which is a real signal, but the final call
is Eric's ear.


---

## Music - final, approved by ear

Eric chose, after listening to four beds on the identical cut:

| Video | Track | Artist | Genre |
|---|---|---|---|
| **V1 - Three bathrooms** | **Spacious Fields** | Fellow Travelers | Ambient, Slow, 1:03 |
| **V2 - Entertaining floor** | **New Diggs** | Lightbox Music | Cinematic, Slow, 1:13 |

Cinematic weight for the basement reveal, airy and unobtrusive for the
bathrooms. Both from Meta Sound Collection, so both are licensed for paid
Facebook and Instagram placements at no cost.

### Mix

Both normalised to **-20 LUFS** with a 1.2s fade in and a 2.2s fade out landing
under the brand end card. Measured peaks -4.8 dB and -5.3 dB, so roughly 5 dB
of headroom before Meta's own transcode.

Getting there took two corrections worth recording:

1. A first pass at -16 LUFS left peaks at -1.2 dB - too hot for a bed that
   sits under typography, and close enough to clipping to risk artefacts after
   Meta re-encodes.
2. Adding `alimiter` to fix it made things worse, not better: the limiter
   applies makeup gain by default, which pushed peaks up to -0.4 dB. Removing
   it and simply lowering the loudnorm target was the correct fix.

### Files

| | Path |
|---|---|
| Masters | `renders/V1-whole-home-three-baths--reels-video-music.mp4`, `renders/V2-entertaining-floor--reels-video-music.mp4` |
| Upload copies | `_upload/V1-whole-home-three-baths-music.mp4` (6.7MB), `_upload/V2-entertaining-floor-music.mp4` (7.6MB) |
| Source tracks | `assets/spacious-fields.m4a`, `assets/new-diggs.m4a` |

The silent masters in `renders/*--reels-video.mp4` stay untouched - those remain
the versions for YouTube or the website, where this audio is not licensed.


---

## V1 ad now runs the music version

Media swapped from `V1-whole-home-three-baths--reels-video.mp4` (silent) to
`V1wholehomethreebathsmusic.mp4`. Copy, headline, description and the Get quote
CTA all survived the swap. Still in draft.

### Important: Meta's AI settings reset when you change the media

This is the single thing most likely to spoil the work if it is not watched.
Swapping the video re-enabled, silently:

- **Video touch-ups** - back ON. This is the one that lets Meta AI alter the
  footage, the exact thing this account forbids.
- **Advantage+ creative text generation** - both blocks back ON, regenerating
  headlines and primary text.

The three enhancements toggled off at the ad level (sticker CTA, text
improvements, add details to layout) *did* persist. Video touch-ups did not,
because it is tied to the media.

**Rule: after every media change, re-open Enhancements and Text and confirm all
four are off before saving.** Do not assume a previous pass holds.

### Translation switched off

Was set to Spanish plus 14 other languages. AI-translating the copy while the
on-screen text stays in English would have looked broken. Now **0 languages
selected**. There is a master "Select all other (14 languages)" checkbox that
clears them in one click.

### Duplicate uploads in the library

The media library now holds two copies each of `V2entertainingfloormusic.mp4`
and `V2-entertaining-floor--reels-video.mp4`. Harmless, but worth tidying so
the wrong one is not picked later. The V1 music file uploaded once.

### Remaining

- V2 ad: point it at `V2entertainingfloormusic.mp4` and write its copy
- 9 still ads across `02 Trust` and `03 Proof and offer`


---

## Ad 02 built - and a deeper layer of Meta AI found

Ad `02 In-house trades` in the Trust ad set now has:

- All three placements selected (1080x1350 feed, 1080x1080 square, 1080x1920 reels)
- Correct primary text, headline "Our Licensed Trades Are In-House",
  description, and the Get quote CTA
- Advantage+ text generation off (both blocks)
- Translation off (0 languages)

**Outstanding on this ad: the destination URL is still V1's.** It inherited
`/whole-home-renovation?...utm_content=V1-three-baths` from the duplicate and
resisted three attempts to change it - typing did not land, and setting it
programmatically was reverted by React's controlled input. It must be corrected
to the 02 URL before this ad runs, or it will send people to the wrong page.

### Image ads have their own three AI features, all on by default

Different from the video ad's set:

| Feature | What it does |
|---|---|
| **Visual touch-ups** | Alters the photograph. Off. |
| **Add music** | Meta AI adds a track to a still ad. Off. |
| **Add animation** | Animates the still, moving the typeset creative. Off. |

Turning off **Add music** opens a dialog demanding a reason before it will
comply; "I need more control over these optimizations" is the honest one.

Note this partly answers the earlier music question: Meta *does* offer to add
music, but only as an AI auto-add on **image** ads. There is still no library
picker for a video ad.

### A second tier exists that is harder to reach

After saving, the ad summary reveals more than the wizard showed:

```
Advantage+ creative enhancements (1/5)
  Turned off: Visual touch-ups, Add music, Text improvements and 1 more
  Turned on:  Add overlays
Essential enhancements (4/4)
  Turned on:  Relevant comments, Enhance CTA, Adjust brightness and contrast
              and 1 more
```

**"Add overlays" is still on**, and the four "Essential enhancements" include
**"Adjust brightness and contrast"** - another feature that modifies the
photograph. These are not surfaced in the creative wizard's Enhancements step;
they sit behind the **Edit** button on the ad summary.

Worth a deliberate pass over both groups before anything publishes, and worth
checking whether Essential enhancements can be disabled at all.


---

## Build status (end of session)

| Ad set | Ad | State |
|---|---|---|
| 01 Whole-home (focal) | `V1 Three bathrooms (video)` | **Complete** - music version, full copy, Get quote, UTM URL, AI off |
| 02 Trust | `02 In-house trades` | **Complete** - 3 placements, full copy, Get quote, correct UTM URL, AI off, translation off |
| 02 Trust | `06 Who we are` | Created and renamed only. Still needs media, copy and URL |
| 03 Proof and offer | (unconverted duplicate) | Still the copied V1 video ad |

Still to build: 06 (finish), 03, 04, 05, 07 and the V2 video ad.

### The URL fix that works

The destination URL resists both plain typing and programmatic setting - React
reverts it. What works: scroll the field into view, **triple-click directly on
the field** so its text is selected, then type. Verified on ad 02, which now
correctly points at `?...utm_content=02-in-house-trades#estimate` rather than
the inherited V1 URL.

Worth checking every duplicated ad for this: a duplicate silently inherits the
source ad's URL, so an unchecked ad will send people to the wrong page.

### Duplicating an ad re-offers AI

Meta's duplicate dialog now offers **"Add music to Reels"**, pre-checked, with a
"Higher clickthrough rate" badge. Uncheck it, the same as the ad set duplicate's
"Add an image".

### UI notes

`scroll_to` on a resolved element reference intermittently opens the left
navigation instead of scrolling, and clicking a stale reference can open the
wrong dialog (the ad-name template builder rather than the media picker).
Re-resolve references after any page change, and prefer clicking by coordinate
from a fresh screenshot.


---

## Ad 06 complete - and duplication IS the shortcut, with one caveat

`06 Who we are` is finished: founders creative in all three placements, full
copy, headline "A Fishers Remodeler, Owner-Run", description
"Family-owned - Hamilton County", Get quote CTA, and the `/team` URL with UTMs.

### The efficiency finding

**Duplicating an ad preserves the AI-off state.** All four Meta AI features
(Visual touch-ups, Add music, Text improvements, Add animation) came through the
duplicate already off, and Advantage+ text generation showed "0 of 5" without
intervention. Translation stayed at 0 languages too.

That is the opposite of what happens when you change an existing ad's media,
which silently re-enables Video touch-ups and both text-generation blocks.

**So the fast path is: build one ad properly, then duplicate it for each new
concept and swap only creative, copy and URL.** That removes roughly half the
per-ad work.

**The caveat: a duplicate inherits the source ad's destination URL**, and it is
easy to miss. Every duplicate needs its URL replaced - triple-click the field,
then type.

### Ad-building recipe that works

1. Duplicate an existing finished ad (uncheck "Add music to Reels" in the dialog)
2. Rename it
3. Change selections -> search the concept slug -> select feed, square, reels
   (the grid reorders after each click, so re-screenshot between clicks)
4. Clear the previous concept's media: search its slug, click each selected tile
5. Text step: triple-click each field and type
6. Confirm the four enhancements are still off
7. **Replace the destination URL** - triple-click, then type

### Status

| Ad set | Ad | State |
|---|---|---|
| 01 Whole-home (focal) | V1 Three bathrooms (video) | Complete |
| 02 Trust | 02 In-house trades | Complete |
| 02 Trust | 06 Who we are | **Complete** |
| 03 Proof and offer | (unconverted duplicate) | Still the copied V1 video ad |

Remaining: 03, 04, 05, 07 and the V2 video ad - all in `03 Proof and offer`.


---

## Session end status

| Ad set | Ad | State |
|---|---|---|
| 01 Whole-home (focal) | `V1 Three bathrooms (video)` | **Complete** |
| 02 Trust | `02 In-house trades` | **Complete** |
| 02 Trust | `06 Who we are` | **Complete** |
| 03 Proof and offer | `03 Basement square footage` | Renamed, URL set. **Media and copy still needed** - it still carries the V1 video and V1 copy |

Not started: 04 waterproofing, 05 pricing, 07 entertaining floor, V2 video.

### Why it stopped here

The Ads Manager tab degraded over a long session: the page began self-zooming
between actions, and `Page.captureScreenshot` started timing out repeatedly
while the DOM itself stayed responsive. Clicking blind in a live ad account is
not worth the risk, so work stopped rather than continuing without being able
to see the result.

A full page reload clears the zoom temporarily but the timeouts return. **A
fresh browser session is the fix**; the remaining ads should go quickly with
the recipe above, since duplication now carries the AI-off state.

### Ad 03 - exactly what remains

1. Change selections -> deselect the V1 video -> Images tab -> search
   `03-basement-sqft` -> select 1080x1350, 1080x1080, 1080x1920
2. Primary text, headline "Finish The Space You Already Own",
   description "$45K-$200K - Real numbers"
3. CTA -> Learn more
4. Confirm the four AI enhancements are still off

The URL is already correct:
`/basement-finishing?...utm_content=03-basement-sqft`


---

## Ad 03 complete - 4 of 11

`03 Basement square footage` is finished: three placements of the basement
creative, full copy, headline "Finish The Space You Already Own", description
"$45K-$200K - Real numbers", **Learn more** CTA (it lands on the service page,
not a quote form, so Get quote would over-promise), and the
`/basement-finishing` URL with UTMs.

### Fixing the renderer

Opening a **brand new tab** cleared the self-zooming and screenshot timeouts
completely. The old tab was unrecoverable; a fresh one is instant. Worth doing
every 3-4 ads rather than waiting for it to degrade.

### The translation preview proves the point

On this ad Meta's own preview showed the failure mode side by side: Spanish
body copy above an image whose baked-in English headline stays English, with
Meta's own warning *"The overlay for this image can't be translated into all
selected languages."* Turned off, as on every other ad.

### Two AI features come back on a media change

Confirmed again here. After swapping media:
- **Advantage+ text generation** returned on both the primary-text and headline
  blocks
- **Add music** returned under Media enhancements

The other three stayed off. So after any media change, check those two.

### Status

| Ad set | Ad | State |
|---|---|---|
| 01 Whole-home (focal) | V1 Three bathrooms (video) | Complete |
| 02 Trust | 02 In-house trades | Complete |
| 02 Trust | 06 Who we are | Complete |
| 03 Proof and offer | 03 Basement square footage | **Complete** |

Remaining: 04 waterproofing, 05 pricing, 07 entertaining floor, V2 video -
all to be duplicated from ad 03 inside `03 Proof and offer`.


---

## STOP POINT - ad 04 is incomplete, do not publish it

`04 Waterproofing warranty` is **half-built and currently has no media**:

| Field | State |
|---|---|
| Name | Set - `04 Waterproofing warranty` |
| Destination URL | Set and verified - `/bathroom-remodeling?...utm_content=04-waterproofing` |
| **Media** | **EMPTY** - removed and not yet re-added |
| Copy | Still ad 03's basement text, headline and description |
| CTA | Learn more (inherited, correct) |

Meta requires media on an ad, so it cannot publish in this state - it will be
blocked rather than run wrong. But it must be finished before the campaign goes
live, and it should not be left as-is.

### Why the media ended up empty

The duplicate inherited ad 03's basement creatives. Swapping them proved
unreliable: the selection counter reported 3, then 5, then 3 again for the same
state, and the tiles gave no readable selected/unselected attribute, so there
was no safe way to tell which three were selected. Rather than guess and risk
the wrong images going live, the media was cleared with **Remove media** to get
a deterministic empty state - but the browser degraded before the correct three
could be added back.

### To finish ad 04

1. Ad creative -> **Add media** -> Images -> search `04-waterproofing` ->
   select 1080x1350, then 1080x1080, then 1080x1920
2. Primary text: the waterproofing copy from `CAMPAIGN.md`
3. Headline: `25-Year Waterproofing Warranty`
4. Description: `Schluter Pro Certified`
5. Re-check the four AI toggles (a media change re-enables text generation and
   Add music)

### The real blocker

The Ads Manager tab degrades within roughly 15 minutes of active use - self-
zooming, screenshot timeouts, refs resolving to the wrong elements (a click
landed on the Help menu). A brand new tab fixes it, but the cycle repeats, and
each reset costs several minutes. Four ads remain (04 to finish, 05, 07, V2).

This is an environment limit, not a Meta one. Doing the last four in one sitting
in a normal browser window would be faster than continuing to automate through
a degrading tab.


---

## Ad 04 - media restored, copy still wrong

The empty-media problem is fixed. Ad 04 now holds the three correct
waterproofing creatives, built from a verified empty state so there is no doubt
about which images it has.

| Field | State |
|---|---|
| Name | `04 Waterproofing warranty` |
| Destination URL | `/bathroom-remodeling?...utm_content=04-waterproofing` |
| Media | **3 waterproofing creatives** (feed, square, reels) - committed |
| Translation | 0 languages |
| Visual touch-ups / Text improvements / Add animation | Off |
| **Add music** | **ON** - needs turning off |
| **Add overlays** | **ON** - needs turning off |
| **Primary text / headline / description** | **Still ad 03's basement copy** |

### To finish ad 04

1. Primary text -> the waterproofing copy from `CAMPAIGN.md`
2. Headline -> `25-Year Waterproofing Warranty`
3. Description -> `Schluter Pro Certified`
4. Enhancements -> turn off **Add music** and **Add overlays**

### A better way to read this UI

Screenshots became unusable, but the DOM stayed responsive throughout. Reading
`[role=switch]` elements and their `aria-checked` attribute gives the
enhancement states **directly and unambiguously** - far more reliable than
looking at a screenshot:

```js
[...document.querySelectorAll('[role=switch]')].map(s => ({
  label: /* nearest ancestor text */, checked: s.getAttribute('aria-checked')
}))
```

That is how "Add music: true, Add overlays: true" was confirmed without being
able to see the page. Element references (`find` -> click by ref) also kept
working long after coordinate clicks stopped landing. **Prefer refs and DOM
reads over coordinates and screenshots** once a session has been running a
while.

### Status: 4 complete, 1 partial

| Ad | State |
|---|---|
| V1 Three bathrooms (video) | Complete |
| 02 In-house trades | Complete |
| 06 Who we are | Complete |
| 03 Basement square footage | Complete |
| 04 Waterproofing warranty | **Media + URL right, copy wrong, 2 toggles on** |

Not started: 05 pricing, 07 entertaining floor, V2 video.


---

## Ad 04 complete - 5 of 11

`04 Waterproofing warranty` is finished and verified by reading the DOM rather
than trusting screenshots:

| Field | Value |
|---|---|
| Media | 3 waterproofing creatives (feed, square, reels) |
| Primary text | Schluter waterproofing copy |
| Headline | `25-Year Waterproofing Warranty` |
| Description | `Schluter Pro Certified` |
| CTA | Learn more |
| URL | `/bathroom-remodeling?...utm_content=04-waterproofing` |
| AI enhancements | **All 5 off** - "Turned off: Add overlays, Visual touch-ups, Add music and 2 more" |
| AI text variants | 0 selected (verified - the only checked boxes on the page were UI state) |
| Translation | 0 languages |

### "Add overlays" is reachable after all

Earlier this was recorded as sitting behind the ad summary and hard to reach.
It is actually in the **Advanced preview** dialog, opened from the *Edit* button
beside the "Advantage+ creative enhancements" summary. That dialog shows all
five toggles side by side - Add overlays, Visual touch-ups, Add music, Text
improvements, Add animation - and a single Save commits them.

**This is the fastest way to set all five at once**, rather than hunting them
across the creative wizard's tabs.

### Still not disableable

"Essential enhancements" remain on and offer no toggle:
`Relevant comments, Enhance CTA, Adjust brightness and contrast and 1 more`.
**Adjust brightness and contrast does modify the photograph.** It appears to be
mandatory on this ad type - worth raising with Meta support if it matters.

### Status

| Ad | State |
|---|---|
| V1 Three bathrooms (video) | Complete |
| 02 In-house trades | Complete |
| 06 Who we are | Complete |
| 03 Basement square footage | Complete |
| 04 Waterproofing warranty | **Complete** |

Remaining: 05 pricing, 07 entertaining floor, V2 video.


---

## Ad 05 - renamed shell only, DO NOT PUBLISH

`05 Price transparency` exists but is **still a duplicate of ad 04 in every
respect except its name**:

| Field | State |
|---|---|
| Name | `05 Price transparency` |
| Media | ad 04's waterproofing creatives |
| Copy | ad 04's waterproofing text, headline, description |
| URL | `/bathroom-remodeling?...utm_content=04-waterproofing` |
| AI enhancements | all off (inherited from 04) |

If published as-is it would run as a **second identical waterproofing ad**
pointing at the bathroom page. It is coherent, not broken - but it is wrong.

### To finish ad 05

1. Media -> Remove media, then Add media -> Images -> `05-price-transparency`
   -> select feed, square, reels
2. Primary text -> the pricing copy from `CAMPAIGN.md`
3. Headline -> `Real 2026 Remodeling Prices`
4. Description -> `Itemized - No surprises`
5. URL -> `https://www.thehomestarservice.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=homestar-2026-08&utm_content=05-pricing#estimate`
6. Re-check the five AI toggles via Advanced preview

### Two techniques worth keeping

**JS `element.click()` succeeds where coordinate clicks fail.** That is how the
duplicate was finally created after two coordinate attempts silently did
nothing. It works for buttons, checkboxes and menu items.

**But `element.value = x` does NOT work** - React's controlled inputs revert it,
even with input/change events dispatched. Text still requires a real
triple-click plus typing, which is exactly what stops working when the renderer
degrades. That asymmetry is the core problem: buttons stay drivable, text
fields do not.

### Honest assessment of the automation

Completion rate is now roughly one ad per two or three fresh tabs, and falling.
Each tab survives about ten minutes. Five ads took most of a session; the
remaining two and a half would likely take as long again.

Everything needed to finish by hand is written down: exact copy in
`CAMPAIGN.md`, exact URLs and the per-ad recipe here.


---

## BREAKTHROUGH: type without coordinates

The blocker all along was that text entry needed a healthy renderer, because it
depended on clicking a field at the right pixel. It does not.

**Focus the field with JavaScript, then type.** The `type` action goes to
`document.activeElement`, so no coordinates are involved and the zoom bug
becomes irrelevant:

```js
// contenteditable (Primary text)
const el = [...document.querySelectorAll('[contenteditable="true"]')]
  .find(x => /some text already in it/.test(x.textContent||''));
el.focus();
const r = document.createRange(); r.selectNodeContents(el);
const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
// then: computer type "new text"

// input / textarea (Headline, Description, URL)
el.focus();
el.setSelectionRange(0, el.value.length);
// then: computer type "new text"
```

This is **not** the same as `el.value = x`, which React reverts. Here the field
is only focused and selected; the typing itself is real keyboard input, so
React sees genuine events.

Using it, ad 05's primary text, headline and description were all set in three
quick steps on an already-degraded tab that could not be scrolled or clicked.

**This should be the default method for every remaining text field.**

## Ad 05 - copy done, media outstanding

| Field | State |
|---|---|
| Name | `05 Price transparency` |
| URL | `/?...utm_content=05-pricing#estimate` |
| Primary text | Pricing copy |
| Headline | `Real 2026 Remodeling Prices` |
| Description | `Itemized - No surprises` |
| CTA | Learn more |
| **Media** | **EMPTY** - cleared, not yet re-added |

Meta blocks publishing an ad with no media, so it cannot run wrong.

**To finish:** Add media -> Add image -> search `05-price-transparency` ->
select feed, square, reels. Then re-check the five AI toggles via Advanced
preview, since a media change re-enables text generation and Add music.

## Status: 5 complete, 1 nearly there

| Ad | State |
|---|---|
| V1 Three bathrooms (video) | Complete |
| 02 In-house trades | Complete |
| 06 Who we are | Complete |
| 03 Basement square footage | Complete |
| 04 Waterproofing warranty | Complete |
| 05 Price transparency | Everything except media |

Remaining: 05's media, then 07 entertaining floor and V2 video.

---

## Ad 05 finished — and the bug that cost two attempts

Ad 05 Price transparency is complete: three creatives attached, all five AI
toggles off, still In draft.

**The Advanced preview wizard commits on "Done", not on "Next".**

The steps are Media -> Text -> Image generation -> Enhancements -> Translation.
"Next" advances; only the final step's **Done** writes the changes back to the
ad. Two earlier attempts walked forward with Next, never reached Done, and the
dialog closed discarding *everything* — the media selection and the toggle
changes both. The ad still read `* Media / Add media` after a full page reload,
which is what exposed it.

Two related traps, both hit on this ad:

- **The step chips at the top are navigation, not tabs.** Clicking `Media (1)`
  from the Enhancements step jumps back to wizard step 1 and loses your place.
- **DOM text extraction of the selection counter is stale.** It reported
  `0 of 10 selected` while the screenshot showed `3 of 10 selected` and three
  thumbnails in the tray. For this dialog, trust the screenshot, not innerText.
  Toggle state via `aria-checked` *is* reliable — read it before and after the
  click and compare.

`Add music` was ON again at the Enhancements step, as expected after a media
change. Turned off, verified `before=true` -> `Add music=false`.

### Remaining

| Ad | Ad set | Type |
|----|--------|------|
| 01 Whole-home (focal) | 01 Whole-home | still |
| 01b Four rooms, one schedule | 01 Whole-home | still |
| 01c One project, not three jobs | 01 Whole-home | still |
| 07 The entertaining floor | 03 Proof and offer | still |
| V2 This was storage | 03 Proof and offer | video |

Duplicated ads inherit the source ad's URL — the `utm_content` must be reset on
every one.

## Ad 07 built — and the Destination field's lazy mount

Ad 07 The entertaining floor is complete and verified after a full reload:
name, primary text, headline, description, the three `07-entertaining-floor`
creatives, URL with `utm_content=07-entertaining-floor`, and enhancements 0/5.

**The Website URL field does not exist until you scroll to it.** The Destination
card sits between *Ad setup* and *Ad creative* and is lazily mounted. Before it
mounts, the input is in the DOM with the inherited URL but has a 0x0 bounding
box, 25 ancestors deep — so `focus()` silently fails and typed text lands in
whatever field still had focus. That is exactly how the URL ended up appended to
the **Description** field ("Westfield, IN - ~$150Khttps://www...").

Two consequences worth keeping:

- **Scroll the Destination card into view first, confirm the input has a
  non-zero height, and only then focus and type.** Verify with a reload, not
  just a read-back.
- Setting a React-controlled input from JS needs the value tracker cleared
  (`el._valueTracker.setValue('')`) before the native setter, or React reverts
  it. But even when that makes the DOM read correct, **it does not reach Meta's
  save state** — the URL looked right and came back as the old one after a
  reload. Only real typing into a mounted field persisted.

Also: a duplicate arrives carrying Meta AI text variations ("Transform your
unfinished basement into a luxury space!", "From drab to fab!"). They are
*suggestions*, not applied copy — the panel reads **Apply all (0 of 5)** and the
real field is "Primary text (1 of 5)". Leave them unchecked and they never ship.

**7 of 11 built.** Remaining: 01, 01b, 01c (ad set *01 Whole-home*), and V2.

---

## All 11 ads built — and the audit that caught two real defects

Every concept in CAMPAIGN.md now exists as a draft ad. **Nothing is published.**

| Ad set | Ads |
|--------|-----|
| 01 Whole-home (focal) | 01 Whole-home, 01b Four rooms one schedule, 01c One project not three jobs, V1 Three bathrooms (video) |
| 02 Trust | 02 In-house trades, 06 Who we are |
| 03 Proof and offer | 03 Basement square footage, 04 Waterproofing warranty, 05 Price transparency, 07 The entertaining floor, V2 This was storage (video) |

Cross-ad-set placement: Meta's Duplicate dialog has **no destination picker** —
both Duplicate and Quick duplicate stay in the source ad set. To move an ad
between ad sets, use **Copy on the ad, then Paste on the target ad set**.

### Two defects the audit caught

**1. Headline and description silently reverted on ad 01.** Set them, verified
them, ran the media wizard, clicked Done — and both came back as ad 07's values
(the ad it was copied from). The primary text survived; those two did not.

The cause was focus: I typed into a field and moved straight on without
blurring it. **Press Tab after every field, then verify.** Every ad set after
that fix held its copy through the wizard and a reload.

**2. Ad 03 had `Add overlays` ON.** Every other ad reads
`Advantage+ creative enhancements (0/5)`; ad 03 read `(1/5)`. Add overlays lets
Meta AI stamp its own text over the creative — on stills that already carry a
designed headline, that is the enhancement most likely to wreck the work. Now
off; ad 03 reads 0/5.

That toggle lives behind the **Edit** button on the enhancements row, and that
editor commits on **Save** — not Done, and not Next.

### How to read this UI without being lied to

Three of this session's wrong turns came from trusting a stale read:

- **Selection counters and field values via innerText are stale.** The media
  dialog reported `0 of 10 selected` while the screenshot showed 3 with
  thumbnails in the tray.
- **Values leak between ads.** After clicking a different ad in the tree, the
  form can still hold the previous ad's headline and description. Reading 01b
  that way returned ad 01's copy.
- The fix for both: **filter to elements with a non-zero bounding box.**
  Unmounted and stale fields have `height === 0`. `.filter(h > 0)` gave a
  correct read on every ad. A fresh reload plus the ad preview panel is the
  second opinion.

### Verified per ad (after reload)

Name, primary text, headline, description, `utm_content`, media, and
enhancements 0/5 (0/4 on the two video ads, which have a different toggle set:
Create sticker CTA, Video touch-ups, Text improvements, Add details to layout).

V2 uses `V2entertainingfloormusic.mp4` (New Diggs); V1 uses the Spacious Fields
cut. Both tracks are Meta Sound Collection — licensed for Meta platforms only,
so neither video may be posted to YouTube or the website.

### Still open

- **Eric publishes.** Everything is In draft; Publish was never clicked.
- **Houzz: still 1 review against a competitor's 100+.** Standing flag.

---

## 05 Price transparency deleted (2026-08-27)

Eric asked for it gone. Deleted from ad set *03 Proof and offer* — Meta warns
the delete is unrecoverable, and it is. Campaign is now **10 ads**, all still
In draft.

`02 In-house trades` was briefly named for removal in the same breath and then
retracted. It is **untouched** — verified still present in *02 Trust* alongside
`06 Who we are`.

Nothing was published. The `Review and publish (14)` button was never clicked.

| Ad set | Ads |
|--------|-----|
| 01 Whole-home (focal) | 01, 01b, 01c, V1 (video) |
| 02 Trust | 02 In-house trades, 06 Who we are |
| 03 Proof and offer | 03, 04, 07, V2 (video) |

The price-transparency angle is not lost — the copy is still in CAMPAIGN.md and
the three renders are still in `renders/`, so it can be rebuilt if the pricing
angle is wanted later. The three images also remain in the Meta account image
library, where they are now unused by any ad.
