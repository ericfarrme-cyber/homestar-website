# Meta launch spec

Build sheet for Ads Manager. Decisions confirmed with Eric on 2026-08-26:
**build as drafts (Eric publishes), $50/day, traffic to the website estimate form.**

---

## ⚠️ Read this before spending anything

**There is no conversion tracking between Meta and the estimate form.** Three
separate gaps, all confirmed:

1. **No Meta Pixel on thehomestarservice.com.** `index.html` loads Google
   Analytics (`G-TYW2NB8JNY`) and nothing else.
2. **No Meta Pixel on the form app either.** The form is served from
   `homestar-project-manager.vercel.app`.
3. **The form is a cross-origin iframe** (`LeadForm` in `src/App.jsx:474`).
   Even with a Pixel on the main site, it *cannot* observe a submit that
   happens inside a third-party iframe. This is a browser security boundary,
   not a configuration mistake.

### What that means in practice

With the website as the destination and no Pixel, the campaign can only
optimise for **Landing Page Views** — Meta has no way to learn which people
actually fill the form in. On a $45K–$200K purchase that is the wrong signal:
you pay for the cheapest scrollers rather than the people who convert. It is
the exact failure mode the account structure notes warn about.

### The three ways out, cheapest first

**A. postMessage bridge (recommended).** The iframe already talks to the
parent — `LeadForm` listens for a `homestar-form-height` message. Add a
`homestar-form-submitted` message on successful submit, and have the parent
fire `fbq('track', 'Lead')` when it arrives. Needs: a Pixel ID, a small edit
to `LeadForm`, and one edit in the `homestar-project-manager` app.

**B. Pixel directly on the form app.** Put the Pixel inside
`homestar-project-manager` and fire `Lead` there. Simpler, but the Pixel then
lives on an app used by other flows, so scope it carefully.

**C. Conversions API.** Fire `Lead` server-side wherever submissions are
processed. Most robust, most work, immune to ad blockers and iOS.

**Until one of these is live**, the honest options are to run the website
campaign optimised for Landing Page Views and accept that Meta is guessing,
or switch the destination to a **Meta instant lead form**, which needs no
Pixel at all because the submit happens inside Meta.

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

Ads Manager was not logged in when this was written — the browser landed on
the Meta login page. Log in to `adsmanager.facebook.com` in Chrome first;
Claude will not enter credentials.

Once logged in, what still needs a human decision:

- **Which ad account** to build under, if there is more than one
- **Payment method** must already be on the account
- **Page and Instagram account** to run the ads from
- **Publishing** — everything will be left in draft
