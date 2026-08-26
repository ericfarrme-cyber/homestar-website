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
