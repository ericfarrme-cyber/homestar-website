# ChatGPT Business Hub — claiming HomeStar

Started 2026-11-13. OpenAI launched Businesses in ChatGPT on 10 November 2026.

## Why we are doing this

Not to appear — we already do. OpenAI: *"ChatGPT may show information about
your business whether or not you have an agent."* And claiming *"does not
guarantee higher placement or sales."*

We are doing it for **Insights**: mentions, website clicks and discovery
topics over a rolling 28 days. That is the first real measurement of the AI
visibility that `docs/ai-share-of-voice-log.md` has only ever inferred.

For a local business a mention counts **when ChatGPT shows a result for the
location, even with no click** — a friendlier count than the online-business
rule, which needs a website citation.

Not available to us: **Business Agents** (US ecommerce and online service
businesses only). No action there.

## Blocker resolved — the listing exists

2026-11-13. Searched Business Hub for "HomeStar Services". Nine results; the
first is ours:

> **HomeStar Services and Contracting** — https://www.thehomestarservice.com/

Matched by website, with no street address shown, unlike the eight unrelated
companies below it (Homestar Security ADT in CA and CO, HomeStar Remodeling in
DE, The Homestar Group in GA, HomeStar Security in WA, Homestar Property
Solutions in MN, HomeStar Services in FL). So there is an existing listing to
claim and the local-business restriction does not block us.

Signed in as **eric@thehomestarservice.com** — the business-domain account,
which is the one that should own the claim, since the claiming account becomes
admin and grants teammate or agency access later.

The claim dialog offers three benefits, one of which does not apply to us:
"Let your business agent answer their questions" — Business Agents are US
ecommerce and online service only, so expect no agent option to appear.

## Verification route

DNS for thehomestarservice.com is at **GoDaddy** (`ns49/ns50.domaincontrol.com`),
so the website-domain TXT method needs the GoDaddy login. Faster options:

| Method | What it needs |
|---|---|
| Business phone | 317-279-4798 — SMS or automated call, enter the code |
| Business email | code to the business address |
| Website domain | TXT record in GoDaddy DNS |
| Shopify | n/a |

Then **Persona identity verification** — government ID, business registration,
proof of authorization. Required before publishing changes, seeing insights or
anything else. The blue check comes from Persona, not from claiming.

Trap: *"If you use Persona to create a new profile, OpenAI's approval
automatically publishes the profile. There's no separate publishing step."*

## Profile data — from our own structured data (src/App.jsx:6851)

- **Name** HomeStar Services & Contracting
- **Legal entity** HomeStar Services and Contracting, Inc. *(per BBB listing —
  confirm against official records; Persona wants an exact match)*
- **Phone** +1-317-279-4798
- **Website** https://www.thehomestarservice.com
- **Location** Fishers, IN, US — 39.9568, -86.0131
- **Hours** Mon-Fri 08:00-17:00
- **Price range** $$
- **Rating** 5.0 from 85 reviews
- **Founders** Eric Farr, Robb Rice
- **Member of** Builders Association of Greater Indianapolis (BAGI)
- **Service area** Fishers, Carmel, Geist, Westfield, Noblesville, Zionsville,
  Brownsburg, Pendleton, McCordsville, Fortville — 40 km radius

**Category** Design-build remodeling contractor / general contractor.

**Description** (the canonical one already on the site — keep it identical so
ChatGPT sees one consistent story):

> Schluter Pro Certified design-build remodeler based in Fishers, serving
> Hamilton County, Indiana. Four specialties, each run to the same depth:
> bathroom remodeling — more than half of every project we take — plus
> basement finishing, kitchen remodeling and whole-home renovation. Licensed
> plumbers and electricians in-house, 3D renderings before demolition, and a
> client portal on every project with unused allowance credited back.

**Profiles already linked from our schema** (`sameAs`) — Facebook, Instagram,
BBB, Angi, BAGI directory, Houzz.

## Status

- [x] Sign in to Business Hub and search for an existing HomeStar listing — found 2026-11-13
- [x] Claim + verify — domain verified 2026-11-13, claim submitted and in review
- [ ] Persona identity verification
- [ ] Check profile information against the table above
- [ ] First Insights read

## Claim in progress — domain verification, 2026-11-13

Only two verification methods were offered for this listing: **Business phone**
and **Website domain**. No business-email option. Chose Website domain, because
the listing is keyed to the domain (it matched on the website and showed no
street address), and because the phone method sends a code to whatever number
OpenAI holds on file, which we cannot see or correct from inside the flow.

OpenAI is verifying **www.thehomestarservice.com**, not the apex, so the record
sits one label below www.

| Field | Value |
|---|---|
| Type | `TXT` |
| Name or host | `openai-business-claim.www` |
| Value | `openai-business-claim=KszIvxC-XZXTNxJK3n6SGDrI5jmAjq1PPaiggeHZ7zM` |

Full name resolved: `openai-business-claim.www.thehomestarservice.com`
Record expires **14 November 2026, 10:27 AM** — the token is short-lived, and a
new one is issued if it lapses.

**GoDaddy trap:** the Name field is relative to the zone. Enter
`openai-business-claim.www` only. Pasting the FQDN makes GoDaddy append the zone
a second time and the record never matches.

Three TXT records already exist at the apex and must not be touched:
`v=spf1 include:_spf-usg1.ppe-hosted.com include:secureserver.net ~all`,
the `google-site-verification=` for Search Console, and
`NETORG17738854.onmicrosoft.com` for Microsoft 365. The new record is at a
different host, so it does not collide.

Check propagation before clicking **Verify domain** — clicking early is the
usual failure:

    nslookup -type=TXT openai-business-claim.www.thehomestarservice.com 8.8.8.8

Confirmed absent at 2026-11-13 before the record was added.

### 2026-11-13 — DNS route blocked at GoDaddy, record NOT added

The TXT record was composed correctly in GoDaddy (type TXT, name
`openai-business-claim.www`, value verified character-for-character against the
token, 25 and 65 chars) and Save was clicked. GoDaddy then showed:

> Updating DNS Records — By clicking Continue & Verify, you agree to update 1
> DNS records **after verifying your identity**.

Confirming that led to a two-step challenge, and from there into GoDaddy
**Account Recovery** (`sso.godaddy.com/account/security/persona/disable2sv/...`)
demanding a photo of a government ID and a selfie. Not completed, and nothing
in that flow was submitted.

**Verified outcome — the record was never written.** Authoritative check
against GoDaddy's own nameserver, not a cache:

    nslookup -type=TXT openai-business-claim.www.thehomestarservice.com ns49.domaincontrol.com
    -> Non-existent domain

**Zone confirmed undamaged:** apex still carries exactly 3 TXT records (SPF,
`NETORG17738854.onmicrosoft.com`, `google-site-verification=`), apex A is
216.198.79.1, www resolves, and all three `ppe-hosted.com` MX records are
intact, so mail was never at risk.

**Lesson, the same one as the Ads Manager stale-coordinate bug:** the browser
coordinate frame changed from 1568x735 to 1440x675 between the screenshot and
the click on "Send code", so the click landed on "Try another way" and opened
account recovery. Re-screenshot after every dialog transition; never reuse
coordinates across one.

**Conclusion: prefer the phone method.** GoDaddy gates DNS writes behind its own
identity verification, so the DNS route costs an ID check at GoDaddy *and* the
Persona check at OpenAI. The phone method needs neither.

### 2026-11-13 — the token rotates on every failed Verify

**The trap:** clicking **Verify domain** before the TXT record resolves does not
just fail. OpenAI discards the token and issues a new one, so the record already
published is instantly stale and has to be rewritten — which at GoDaddy costs
another SMS identity code each time. It is a loop if you keep retrying.

Observed: first token `...KszIvxC-XZXTNxJK3n6SGDrI5jmAjq1PPaiggeHZ7zM`
(expiry 10:27) became `...doZLOMF-AeELaVT64P-_6NzpUaEKdiGzL8cY6edDZOc`
(expiry 10:48) after one premature attempt, with the notice *"We haven't
verified the record yet."*

**Rule: never click Verify domain until an authoritative DNS query returns the
value currently displayed on screen.** Read the token from the DOM, not from a
screenshot — it is a long mixed-case random string and OCR is not trustworthy:

    openai-business-claim.www.thehomestarservice.com

**Phone verification is dead for this listing.** OpenAI rejected the business
line outright: *"This type of phone number isn't supported for verification."*
4798 is a VoIP number, and the rejection is on the number, not the delivery
method — selecting Text message instead of Phone call left the whole control
group greyed out with Get code disabled. Being able to receive SMS on it does
not help. DNS is the only route.

**GoDaddy coordinate note:** the page viewport is 1920x900 while the screenshot
coordinate frame is 1568x735 — a scale of 0.8167. Multiply page coordinates by
that before clicking, or measure the element and convert. On the identity
dialog, `Send code` and `Try another way` sit only ~48px apart in frame terms,
and hitting the latter opens the account-recovery flow that demands a
government ID.

### 2026-11-13 — domain verified, claim submitted

The TXT record was rewritten with the reissued token, confirmed live on both
GoDaddy's authoritative nameserver and Google's public resolver, and only then
was **Verify domain** clicked. First click returned a rate-limit cooldown
("Check again in 24 seconds") without rotating the token; the retry 30 seconds
later passed.

Business Hub now shows:

- **Claim received** — complete
- **Review in progress** — current
- **Decision reached** — pending; OpenAI will email **eric@thehomestarservice.com**

A claim can be withdrawn at any point during review.

**No Persona prompt appeared yet.** Consistent with the setup guide: identity
verification comes *after* the claim is approved, and it gates publishing
profile changes, insights and any agent. So the government-ID step is still
ahead, not skipped.

**What worked, for next time:** DNS was the only viable route, since the
business line is VoIP and rejected. The sequence that succeeded was — publish
the record, confirm it authoritatively, re-read the on-screen token to be sure
it had not rotated, then click Verify once.

### 2026-11-13 — CLAIM APPROVED, first insights baseline

Approved the same day. Profile: `bizprof_2f3e5e0fe3c4819e9c38550216e545a0`.

**First AI visibility numbers we have ever had.** Rolling 28 days:

| Metric | Current 28d | Previous 28d | Change |
|---|---|---|---|
| Mentions | **24** | 76 | -52 (-68.4%) |
| Profile views | **1** | 0 | new |
| Website clicks | **4** | 8 | -4 (-50%) |

Website access **confirmed**, last crawled 19 Oct 2026. Discovery topics empty:
"Topics will appear here when there are enough mentions."

**Do not act on the -68% yet.** The product launched 10 November; OpenAI warns
"counts may be incomplete… data is still being collected", missing days render
as gaps, and we cannot tell whether the prior window was computed the same way.
The value of this reading is as a **baseline**. The comparison worth trusting is
the next one, around **11 December 2026**, measured the same way.

For a local business a mention counts when ChatGPT shows a result for the
location, even with no click — so 24 mentions is not 24 website visits. The 4
website clicks are the harder number.

**Correction to the earlier assumption:** Persona does NOT gate insights. It is
required only "before editing business info or publishing your business agent".
So the government-ID step can wait until we actually want to edit the profile.

Pending behind Persona: **business category** and **business address**, both
flagged as missing. The staged profile data above cannot be saved until then.

### 2026-11-14 — Persona cleared, profile filled

Identity verification passed. Confirmed functionally, not by the banner's
absence: the "Verify your identity with a government-issued ID" banner is gone,
**Edit business info** opens `/edit/about` instead of bouncing to a
verification wall, and the profile preview now carries the **blue check**.

Saved and re-verified after a full page reload (not against a greyed Save
button — see the lesson below):

| Field | Value |
|---|---|
| Business category | **Remodeler** |
| Description | 293 chars, exact match, see below |
| Hours | Mon-Fri **8:00 AM - 5:00 PM**, Sat/Sun Closed |
| Time zone | **Eastern Time (Indianapolis)**, GMT-05:00 |
| Phone | +1 317 279 4798 (already correct) |
| Website | www.thehomestarservice.com (already correct) |

Category chosen as **Remodeler** over the other suggestion, General contractor,
to match the positioning already on the site — bathroom specialism stated,
flooring/painting/decks demoted. General contractor is the larger and less
distinctive pool.

**The description field caps at 300 characters** with no `maxlength` attribute —
it silently truncates on input. The canonical 430-char site description was cut
mid-sentence at "Licensed plumbers and". The 293-char version that fits:

> Schluter Pro Certified design-build remodeler in Fishers, serving Hamilton
> County, Indiana. Bathroom remodeling is more than half of every project we
> take, plus basement finishing, kitchen and whole-home renovation. Licensed
> plumbers and electricians in-house, 3D renderings before demolition.

Only loss against the site copy: "kitchen remodeling" became "kitchen", and the
client portal / allowance credit-back clause was dropped. Every protected claim
survives intact.

**Hours tip:** each day has a "Copy <day> hours" control that opens a day-picker
with checkboxes, so Monday's 8-5 was applied to Tue-Fri in one action with the
weekend left closed. The time zone list does not surface Indianapolis under a
search for "Indiana" — that query returns only the exception counties (Knox,
Marengo, Petersburg, Tell City, Vevay, Vincennes, Winamac). Search
"Indianapolis" to get `Eastern Time (Indianapolis)`, which is Hamilton County's.

### Still open

- [ ] **Street address** — the Location tab requires an address picked from
      autocomplete and keeps Save disabled without one. There is no
      service-area-only option. Our structured data deliberately publishes
      locality only (Fishers, IN, no street). **Eric's call**, because it would
      put an address on a public ChatGPT profile.
- [ ] **Photos** — profile shows "No photos yet". Candidates: Adams primary
      bath and the Carmel whole-home set.
- [ ] **Business email** — Contact tab shows "Not added". Eric's call whether
      to publish one.
- [ ] **Agent builder** — now visible in the Hub's left nav alongside Products,
      which contradicts the earlier reading that Business Agents are US
      ecommerce/online-service only. OpenAI's policy says eligibility is judged
      per business and that "business verification alone does not guarantee
      agent eligibility", so the only way to know is to try to publish one.
- [ ] **Insights re-read ~11 December 2026** against the 28-day baseline of
      24 mentions / 1 profile view / 4 website clicks.

**Lesson repeated from the meta-ads work:** a greyed-out Save proves only that
nothing is pending, not that anything was written. Every field above was
re-read from the DOM after a full reload, with the description compared
character-for-character against the intended string.

### 2026-11-14 (later) — photos, email, address decision

**Address: deliberately left off.** The Location tab contains nothing but
"Business address" — a street-address autocomplete, a unit field and a map. The
page has exactly two inputs and **no service-area control anywhere in the
editor**. So leaving the address blank costs nothing: there is no service area
to forfeit. Our service area reaches ChatGPT through the site's structured data
(ten towns, 40 km GeoCircle) and through the profile description's "serving
Hamilton County". Eric's call was to leave the address off rather than publish
Robb's home office address.

**Business email** set to eric@thehomestarservice.com. It is **not** a plain
field — saving it kicks off an ownership-verification flow that emails a code
to that address. Code entry is Eric's step.

**Photos — 9 live.** Chosen by contact-sheeting all 182 project images in the
delivery crop first, per the rule in [[review-every-asset-first]], not by
filename. Exteriors excluded (demoted services).

| # | File | Why |
|---|---|---|
| 1 | geist-three-bath-1.jpg | Blue picket wet area, freestanding tub. The hero — leads the profile card |
| 2 | bathroom-green-tile-1.jpg | Deep green tile, woven pendant, tub with tray |
| 3 | westfield-basement-wet-bar-13.jpg | Fluted white oak vanity, gold fixtures |
| 4 | zionsville-basement-3.jpg | Green marble slab bar |
| 5 | zionsville-kitchen-main-level-1.jpeg | White kitchen, marble slab |
| 6 | zionsville-kitchen-main-level-7.jpeg | Dining room, botanical mural |
| 7 | noblesville-primary-bath-3.jpg | Adams — vanity + wallpaper, arched gold mirrors |
| 8 | geist-upper-level-3.jpg | Built-ins with library ladder, trim |
| 9 | westfield-basement-masterpiece-5.jpg | Leather sectional, beams, fireplace |

Dropped after Eric's review: `white-oak-primary-bath-fishers-2.jpg` (half wall
+ freestanding tub) and `fishers-spa-retreat-6.jpg` (tub with towel warmer).

**The Adams photos are not on the website.** `noblesville-primary-bath-*.jpg`
(12 shots plus 4 before) sit in `public/images` but are referenced nowhere in
`src/`. There is no project entry for that job yet — worth building, since it
is now the Adams job's only public showing.

**Photo upload traps:**
- One of eight failed silently on the first batch with "Some photos couldn't be
  uploaded" — a **Try again** button recovers just the failed one. Always count
  the tiles against what you sent.
- The button is **Submit**, not Save: photos go through moderation
  ("Reviewing your change…").
- **After every submit the client hangs** on "Reviewing your change…" and shows
  "Couldn't refresh your profile. Your unsaved edits are still here". This is
  cosmetic — both times the change had already landed server-side. Reload and
  count the tiles rather than trusting the banner.
- Uploaded files are renamed to hashes (`profile-media/<hash>.png`), so after a
  reload you cannot map tiles back to filenames. Identify them visually, and
  remove from the **last** position backwards since the grid reflows.
- Grid tiles are square, so judge candidates square-cropped, not 4:3.

## 2026-11-14, later — photo swap finished and email confirmed

**Business email is live on the profile:** `eric@thehomestarservice.com` renders
on the public profile card, alongside the blue check and the "Remodeler"
category. The verification code Eric entered did land; the earlier uncertainty
was only that I never re-read the card after it saved.

**Dining room photo replaced with the Couch primary bath.** Eric asked for "the
one of couch where you see the shower and drop in tub".

- Reviewed all 14 `couch-primary-bath-*.jpg` in the **square crop the Hub
  actually renders** (tiles are 165x180, preview card ~320x310), not in the
  1200x1600 source. Only two frames carry both fixtures: `#2` and `#13`.
- Chose **`couch-primary-bath-2.jpg`**. Same framing as `#13` but the window
  stays in shot, which lifts an otherwise grey travertine room, and it keeps
  the white hallway door out of the frame. Shows the drop-in tub, the tiled
  half wall and the frameless glass shower in one frame.
- Order of operations: **upload first, then delete.** The grid never dropped
  below 9, so a failed upload could not have cost a photo.
- The dining room was **photo 6** (hash `5fcff30b51f8...`). Confirmed by
  hovering the tile and seeing the "Move photo 6 ..." controls appear, then
  zooming the tile before clicking Remove.

**Traps confirmed again this round:**
- "Reviewing your change..." stalled on Submit for the third time. Still
  cosmetic. A full reload showed 9 tiles, the dining hash gone and a new
  server-renamed `cf9498b61a...` in its place. **The reload is the proof, not
  the banner.**
- Immediately after the reload the grid read **0 tiles** — the page had not
  finished rendering. A check for "is the old photo gone?" passes trivially
  against an empty grid. Always assert the expected count first, then absence.
- The Hub was fully unresponsive for ~20 minutes before this (blank panels,
  script-injection timeouts). It recovered on its own with no action taken.

**Current photo set (9), in order:** Geist blue-tile bath (hero), Carmel green
tile bath, Adams wood vanity, Westfield wet bar, Zionsville kitchen, Couch
wallpaper bath, Geist upper-level built-ins, Westfield basement, **Couch
travertine primary bath** (new, position 9).
