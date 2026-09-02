# Autopilot State — HomeStar SEO
Last run: 2026-08-26 (Run #4). Eric opened the run reporting **no inbound leads for a while**, then
narrowed the concern to AI and SEO rankings.

Prior: 2026-08-14 (Run #3) — **RESUMED.** Eric turned autopilot back on 2026-08-14 and asked not
to be prompted for permission mid-run.

## 🔴 RUN #4 2026-08-26 — META DESCRIPTIONS WERE CORRUPTED BY THEIR OWN PRICES

`scripts/build-route-heads.mjs` injected each route's description using `String.replace()` with a
**template-string** replacement containing `$1`. A replacement string expands `$1`, `$&`, `` $` ``
and `$'`. Our descriptions are full of prices — so a description containing **"$15,000"** or
**"$100,000"** had its own `$1` consumed as a backreference, splicing the matched
`<meta name="description" content=` into the middle of the description.

**Six pages shipped corrupted; five had been that way for some time.** Live, before the fix:
- `/blog/bathroom-remodel-cost-hamilton-county` → *"...Westfield, Indiana — `<meta name="description" content=`5K refreshes to $50K+..."*
- `/guide/bathroom-remodeling-hamilton-county` → *"Real Indiana costs (`<meta name="description" content=`5K–$50K+)..."*
- `/blog/kitchen-remodel-cost-hamilton-county-2026` → *"what $50K–`<meta name="description" content=`00K actually buys"*

**🔴 This lands directly on the retired-tactics entry.** The first two are the exact bathroom cost
pages that "CTR-copywriting rewrites" were tried on twice and then retired. The geographic-mismatch
diagnosis may still be correct — those queries really do come from other Hamiltons — but **the
geo-disambiguation experiment scheduled for judgment ~2026-09-05 has been running on a corrupted
artifact.** Its "Indiana"-leading description was live but mangled mid-string, which independently
destroys a snippet. **Do not judge that experiment on 09-05 as originally planned.** The repaired
descriptions deployed 2026-08-26, so judge no earlier than **~2026-09-26**, after a full re-crawl.

**Fixed:** every replacement in the script is now a **function**, which disables `$`-substitution
outright. A comment in the file says why they must not be converted back to strings. Rebuild
confirms **0 corrupted pages** (was 6), verified in `dist` and again live after deploy.

**Standing lesson:** never pass a template string containing interpolated content as a
`String.replace` replacement — use a function. Content with prices, or with `$&`, corrupts silently
and passes every status-code and tag-presence check. This survived multiple runs of "verified live"
because each one grepped for the tag, not for the value inside it. Check the value.

## ✅ RUN #4 2026-08-26 — WHOLE-HOME REPRICED (Eric's numbers)
Eric, 2026-08-26: **"ok 100k-750k+ is fine"** and **"we arent done taking work under 50k"**.

| Tier | Was | Now |
|---|---|---|
| Two Connected Rooms | $50,000 – $100,000 | **unchanged** |
| Main Level or Upper Level | $100,000 – $200,000 | $100,000 – $250,000 |
| Whole-Home Renovation | $200,000 – $300,000 | **$250,000 – $750,000+** |
| Headline | "$50,000 to $300,000" | **whole-home $100,000–$750,000+, multi-room from $50,000** |

Removed: *"Our whole-home projects top out around $300,000. Above that the work is usually a custom
build rather than a renovation, and we will tell you so."*

**The $50–100K entry tier was deliberately kept.** Eric confirmed sub-$50K work continues, and that
band is the page's own stated "most common starting point" — raising the floor sitewide would have
cut real lead flow to chase a positioning win. Applied across metaDesc, heroSub, quickAnswer,
costIntro, the tier table and the cost FAQ. Zero `300,000` and zero "top out" references remain.

**Expectation setting:** the published number now matches the band ChatGPT treats as whole-home, but
**the ranking will move on portfolio, not on the number.** Only one PROJECTS entry is genuinely
multi-room across room types. Publishing a bigger ceiling without matching project proof widens the
exact gap run 3's exclusion filter looks for. Multi-room project photos remain the real unlock.

## ✅ RUN #4 2026-08-26 — FULL CATEGORY SWEEP: every category improved
Eric named basement, bathroom and whole-home as his three concerns; kitchen was tested first.
12 logged-out incognito runs, directly comparable to the 2026-08-05 baseline.

| Query | 2026-08-05 | 2026-08-26 | Positions |
|---|---|---|---|
| Bathroom, Fishers | 3/3 @ ~2.3 | **3/3 @ ~1.7** | 1, 3, 1 |
| Basement, Fishers | 3/3 @ ~5.7 | **2/3 @ ~1.0** | 1, 1, absent |
| Kitchen, Fishers | **0/3** | **3/3** | last, 3, 4 |
| Whole-home, Hamilton Co. | **0/3** | **1/3** | 3 |

**🟢 The website is now being cited — it was cited zero times in 12 runs on 2026-08-05.** ChatGPT
quoted the basement project page and, on whole-home, read back the pillar's in-house-licensed-trades
positioning verbatim with a `HomeStar Services & Contracting` source chip. The content strategy is
working; keep it.

**🔴 Houzz is confirmed as the ranking mechanism, across categories.** In every bathroom and kitchen
run, each firm placed above HomeStar was justified with a **Houzz** citation while HomeStar was
justified from its Google listing. **And HomeStar's tiny Houzz corpus is already being cited** —
basement run 2 put HomeStar first on the strength of it. (Count re-verified live 2026-08-26: it is
**2**, not 1 as recorded earlier.) Two reviews do measurable work; ~15 would be decisive. This retires any doubt that Houzz converts into AI placement.

**🔴 WHOLE-HOME — corrected diagnosis. It is NOT a missing price range; it is portfolio evidence
and band mismatch.**

> ⚠️ **PARTLY SUPERSEDED the same day — read the "WHOLE-HOME REPRICED" section above first.** The
> analysis below is preserved as the reasoning of record, but two of its conclusions no longer hold:
> Eric decided the range should be **$100K–$750K+** ("ok 100k-750k+ is fine"), and the "$300K
> top-out" sentence quoted below has been **removed from the site**. So "do not inflate it" was
> answered by the owner with real capacity, not overridden. What still stands, and is the operative
> point: **portfolio evidence is the actual blocker, and the number alone will not move the ranking.**

**First, a correction to this document.** Open question 5 has long said "the pillar deliberately
publishes no whole-home range." **That is stale and wrong — verified against the live page
2026-08-26.** `/whole-home-renovation` publishes **$50,000–$300,000** five times in the prerendered
HTML, plus a full three-tier table: Two Connected Rooms $50–100K, Main Level or Upper Level
$100–200K, Whole-Home Renovation $200–300K. Anyone reading only the old open-question line would
have gone off and rebuilt work that already exists. Fixed below.

So the real question is why ChatGPT quotes Nicholas Design Build's range and not HomeStar's. Two
reasons, and neither is fixed by writing more copy:

1. **Band mismatch.** Nicholas publishes **$250K–$750K+, over $1M with additions**. HomeStar
   publishes **$50K–$300K** and explicitly self-selects out of the top: *"Our whole-home projects
   top out around $300,000. Above that the work is usually a custom build rather than a renovation,
   and we will tell you so."* ChatGPT frames "whole-home renovation" as a major high-end project —
   moving walls, reworking the floor plan, high-end finishes. HomeStar's own page says that is not
   the work it does. **That line is honest and good for lead quality. Do not inflate it.**
2. **Portfolio evidence.** Only four `PROJECTS` entries carry `cats: ["Whole Home"]`, and three of
   them are single-room-type jobs — a basement, a three-bathroom job, two children's bathrooms.
   **Exactly one — "Kitchen & Main-Level Renovation in Zionsville" — is genuinely multi-room across
   room types.** Run 3's exclusion filter was *"rather than a kitchen/bath contractor that happens
   to advertise 'whole home'."* Against this portfolio, that is an accurate read, not a mistake.

**Strategic implication — whole-home may be the wrong target.** The luxury whole-home query is not
honestly winnable at a published $300K ceiling. The winnable, honest, already-proven band is
**multi-room / two-connected-rooms / main-level at $50–200K**, where HomeStar has real pricing and
real work. Recommend competing there explicitly rather than chasing a query the company has said in
its own words it does not serve. **Decision for Eric, not for a future run to assume either way.**

**What would actually move whole-home:** more genuinely multi-room project pages. That is blocked on
photos and details, not on copy.

**🟡 Map pack:** HomeStar was absent from the map-pack block in nearly every run across all four
categories while appearing in the prose. Exactly as the geographic-ceiling finding predicts. Do not
chase the map pack; keep spending on the prose half, which is being won.

Full evidence and verbatim quotes: `docs/ai-share-of-voice-log.md` (both 2026-08-26 entries).

## ✅ RUN #4 2026-08-26 — KITCHEN IS NO LONGER INVISIBLE TO AI (0/3 → 3/3)
Re-ran the 3-run logged-out ChatGPT protocol on kitchen/Fishers. **HomeStar appeared in all three
runs**, up from absent-in-all-three on 2026-08-05. The Round 2 kitchen cluster worked.

**But HomeStar placed last in every run** ("one more I'd get a quote from") and made the explicit
"my first three calls" shortlist **0 of 3 times**. In run 1 it was missing from the 15-entry map
pack while still appearing in the prose — exactly the split the geographic-ceiling finding predicts.

**🔴 The mechanism is now visible and it is Houzz.** Every firm ranked above HomeStar was justified
with a **Houzz** citation. HomeStar was justified from the Google listing in all three runs and was
**never once cited from Houzz**. HomeStar has **80 Google reviews — the most of any firm named** —
and still ranks last. Volume is not the blocker; the kitchen-specific corpus is, and that corpus is
Houzz.

**The number that changes the ask:** Nicholas Design Build earns a cited, above-HomeStar slot on
**15 Houzz reviews**; ACo on **17**. The bar is ~15–20, not Everything Home's 122. The standing #1
item is therefore **"get from 1 to ~15 Houzz reviews"** — about 14 asks to clients who already left
a 5-star Google review. Full evidence: `docs/ai-share-of-voice-log.md` (2026-08-26 entry).

**Shipped this run** (commit `f6ef4eb`, deployed and verified live):
- **Breadcrumb schema fixed on all 9 `/guide/*` routes + `/tools/remodel-cost-calculator`.** Root
  cause: a *middle* `BreadcrumbList` item with no `item` URL is invalid — `item` is optional only on
  the final crumb. `GuidePage`'s "Guides" crumb and `CostCalculator`'s "Tools" crumb both omitted it.
  This was filed as a single-page bug (item 3c, `/guide/renovation-sequencing-guide`); it was
  actually 10 pages. Verified in the live HTML, not assumed.
- Two stale "62+ Google reviews" prose strings aligned to the 78 already published sitewide. These
  are the strings AI assistants quote.

**Lead form checked and healthy** — every `LeadForm` on the site is one iframe to
`homestar-project-manager.vercel.app`, a single point of failure for the whole site. It renders,
mounts, and is not frame-blocked. **Not verified: that a submission actually delivers.** Testing that
means putting a fake lead in the CRM, so it needs Eric's OK first.

**Review-count drift:** ChatGPT read **80** Google reviews in all 3 runs; schema publishes **78**.
Not changed on third-party say-so — Eric should confirm the live GBP number, then sweep
`aggregateRating.reviewCount`.

**Scope of "auto", stated explicitly so no future run has to guess:** autopilot = work this queue
during a session. **GBP weekly auto-posting stays OFF** — Eric re-confirmed this 2026-08-14 when it
was raised. It is a separate switch he paused after deleting an auto-post; do not fold it into a
general "turn on auto". See `docs/gbp-post-log.txt`.

Prior: Run #2 2026-08-05 ("Distance the Lead", autonomous execution) — paused at Eric's request, all
work committed and deployed.

## 🔴 INDEXING GAP FOUND 2026-08-08 — everything new was invisible to Google
URL Inspection returned **"URL is unknown to Google"** for all five of: `/whole-home-renovation`,
`/client-portal`, `/blog/designer-vs-design-build-vs-general-contractor`,
`/guide/renovation-sequencing-guide`, `/tools/renovation-sequence-planner`. Not "crawled and not
indexed" — **never discovered at all.** Pages were live with correct canonicals the whole time.

**Cause:** GSC last read the sitemap **Aug 4** and still reports 223 pages vs 235 live. Only **3 of
235** entries carried `<lastmod>`, so Google had no freshness signal and deprioritized re-reading.
Resubmitting the sitemap does not force a re-read, and the old `google.com/ping` and `bing.com/ping`
sitemap endpoints are **retired** (404 / 410) — they were deprecated in 2023 and are no longer a lever.

**Correction (Aug 8, later):** the sitemap resubmit I reported as done had **not** registered.
I set the input via JS and clicked SUBMIT; the tool returned success but the row still read
`Submitted: Jul 9 | Last read: Aug 4 | 223`. I attributed the unchanged row to Google's crawl
schedule — true of *Last read*, but **Submitted updates instantly on success**, so the stale Jul 9
was proof of failure. Eric submitted it manually: it flipped immediately to
`Submitted Aug 8 | Last read Aug 8 | **235 pages**`, which is what actually unblocked discovery.
Lesson recorded in memory as `verify-web-form-actions`.

**Fixed Aug 8:** stamped `<lastmod>` on the 14 entries genuinely created/edited this run (dates
2026-08-05 / 08-06 / 08-08). Deliberately did NOT stamp the other 221 — a uniform date across every
URL is the fabricated-freshness pattern Google discounts, which would poison the true signals.
All five URLs manually requested via GSC the same day.

**Watch:** re-inspect these five around **2026-08-15**. If still "unknown to Google" a week after a
manual request + lastmod, the problem is not discovery and needs a different diagnosis.

**Standing lesson:** IndexNow ≠ Google. IndexNow returns 200 and covers Bing/Copilot only. Google
discovery runs on sitemap re-reads and manual requests. Never treat an IndexNow 200 as "indexed."

## 🔴 GEOGRAPHIC CEILING 2026-08-06 — AI visibility is Fishers-only
ChatGPT returns HomeStar for **Fishers** queries and **not for Carmel or Westfield** — even though our
flagship ~$150K basement is physically in Westfield with a full case study. Every firm returned for
those cities has a physical presence there (Everything Home's listing literally reads "Showroom located
in the Indiana Design Center").

**This explains the GSC anomaly:** the 9 `home-remodeling-{city}-in` pages pull 3,488 impressions and 4
clicks. Google ranks the pages; AI never surfaces the business outside Fishers. Content was never the
bottleneck — business address is.

**Implication:** stop expecting AI visibility from more city pages. The map-pack half is likely
unwinnable without a physical presence. The winnable half is the prose half, which is driven by
reviews/Reddit/Houzz — so **city-association must come from the review corpus** ("they remodeled our
Carmel kitchen"). Full detail: `docs/ai-research-round3-2026-08-06.md`.

## 🟡 TRUST OBJECTION — "very new company" is surfaced to every prospect who checks
ChatGPT on "is HomeStar legit": no complaint pattern ✅, 5.0/79 reviews ✅, BBB Accredited A- ✅ — but
it flags "very new company… no long track record" from our BBB profile (business started Nov 2024) and
recommends extra due diligence. We publish no counter-evidence, and Eric's bio ("background in real
estate and small business") reinforces it. Counter with volume/velocity (100+ projects, 79 reviews in
<2 years) rather than tenure. **Question for Eric: do you or Robb have prior construction experience
we can publish?** Do not invent it.

**Data inconsistency — RESOLVED 2026-08-14.** Eric confirmed **100+** is correct. The author bio
credential (`src/App.jsx`, AUTHORS → eric-farr) was changed from "50+ Hamilton County Projects
Completed" to "100+", so it now agrees with the homepage stat and with the volume/velocity counter
to the tenure objection above. Note: `outputs/App.jsx` still carries the old "50+" string — it is a
gitignored stale copy, not a build artifact of current source. Do not treat it as a live surface.

## 🔴 TOP FINDING 2026-08-06 — we do not hold the gatekeeper term for whole-home
On "who should I hire for a whole home renovation in Hamilton County Indiana" ChatGPT opened with
*"I'd focus on **design-build firms**"* and then listed only design-build firms. **HomeStar was absent.**
The filter was category membership, not quality.

**We qualify and never say it:** in-house design, 3D renderings before demolition, permits, all
licensed trades on our own payroll, one contract. Two firms beating us have "Design Build" in their
literal business name.

**Action: claim "design-build" explicitly** on the whole-home pillar, homepage, GBP services and Houzz.
Costs nothing — the capability already exists. Full research: `docs/ai-research-whole-home-and-designer-2026-08-06.md`.

**STATUS 2026-08-14 — the website half is DONE; verified in source, not assumed.** The homepage now
opens the positioning with "We are a design-build remodeler" (`src/App.jsx:1384`), and the whole-home
pillar carries an explicit Q&A — "Is HomeStar a design-build firm?" → "Yes" (`src/App.jsx:3192`) —
plus a hero subhead and a three-ways-to-design-it block naming in-house design-build first
(`src/App.jsx:3154`, `:3158`, `:3397`). 18 occurrences across the file. **Still open: GBP services
and Houzz**, which are off-site surfaces this doc cannot verify from the repo. Do not re-do the
website work — a future run reading only the action line above will otherwise repeat finished work.

## ⏭️ START HERE NEXT RUN
0. ~~**ERIC: RESUBMIT THE SITEMAP IN GSC**~~ — **DONE 2026-08-26, blocker closed after four runs.**
   Eric submitted it manually. GSC now reads `Submitted Aug 26, 2026 | Last read Aug 26, 2026 |
   Success | **238 discovered pages**`, which matches the live sitemap exactly. Google now has a
   record of all 238 URLs including `/team` and the repaired neighborhood URLs. Confirmed from the
   GSC screenshot, and the count cross-checked against the live file.
0b. ~~Upload the two new Zionsville projects to Houzz~~ — **DONE 2026-08-15.** Eric signed in and both
   went up, verified by re-fetching the saved records: Basement Bar (ID 7896965, 10 photos, 999-char
   description) and Kitchen & Main-Level (ID 7896971, 8 photos, 979-char description). Both carry
   Transitional style, keywords and a deep link to their website page. Houzz now shows **26 projects**.
   **HomeStar has a kitchen project on Houzz for the first time.** Year and Cost left blank on both —
   no verified year, no published figure. Hard-won mechanics (the Dropzone uploader, the pre-filled
   website field, the address/city trap) are written up in
   `docs/houzz-upload-package-zionsville-2026-08-15.md` — read it before the next Houzz upload.
1. **Houzz reviews — the standing #1 item, and Run #4 proved the mechanism.** **2 reviews** as of
   2026-08-26 (verified on the live profile — was recorded as 1; the second is a bathroom review).
   **📋 `docs/houzz-review-request-kit.md` has the whole thing ready to go:** Houzz's built-in
   request tool takes a comma-separated email list and one message, so this is a single sitting, not
   14 emails. The kit has the URL, the priority order for who to ask (kitchen first, then multi-room,
   then Carmel/Westfield/Zionsville), and the message text to paste. **Eric must send it — there is a
   reCAPTCHA, and this is outbound contact with his clients.**
   Everything Home is now at **122** (ChatGPT quoted it, 2026-08-26). **Target ~15**, not 122 —
   competitors are earning cited slots above us on 15 and 17 Houzz reviews. This is the difference
   between HomeStar being the "one more I'd get a quote from" and being in the first three calls.
   ~14 asks to clients who already left a 5-star Google review. Surface first, every run.
   (Also in persistent memory.)
2. ~~Re-inspect `/kitchen-remodeling-zionsville-in`~~ — **CLOSED 2026-08-15. It is INDEXED**, with
   breadcrumbs and review snippets both valid. The per-route canonical fix is proven end-to-end.
3. ~~GSC manual index requests~~ — **DONE 2026-08-15.** Both sequencing pages came back already
   indexed. Fresh requests confirmed (dialog read, not assumed) for `/whole-home-renovation`,
   `/client-portal` and `/blog/designer-vs-design-build-vs-general-contractor`.
3b. **Re-inspect the duplicate cluster ~2026-08-29.** `/whole-home-renovation` and `/client-portal`
   both return "Duplicate, Google chose different canonical" pointing at `/flooring-services-carmel-in`
   — but both were crawled **Aug 13, one day before the per-route head tags shipped**. The cause is
   already fixed and live; these verdicts are stale. If they have NOT cleared after a re-crawl, the
   head tags were not enough and the empty-body/SSG problem is the real cause. Full detail in
   `docs/indexing-health-log.txt`.
3c. ~~Fix the breadcrumb schema on `/guide/renovation-sequencing-guide`~~ — **DONE 2026-08-26, and it was 10 pages, not 1.** See Run #4 above. Original note follows: it was indexed but reported
   "1 invalid item". Its sibling `/tools/renovation-sequence-planner` reports 1 *valid* item, so the
   bug is specific to the guide route, not the schema in general.
4. **Kitchen flagship project** — Eric confirmed he has one; still awaiting photos + details.
   *(Note: the Zionsville kitchen & main-level project shipped 2026-08-14 and is a real kitchen entry —
   `PROJECTS` is no longer 0-for-kitchen. The flagship is still worth having.)*
4b. **Claim design-build on GBP services and Houzz** — the website half shipped (see TOP FINDING
   status above). These two off-site surfaces are the remainder.
5. ~~**Eric's whole-home price floor** — the pillar deliberately publishes no whole-home range~~ —
   **CLOSED 2026-08-26 AS FACTUALLY WRONG. The range IS published**: $50,000–$300,000, five times in
   the prerendered HTML, plus a three-tier table ($50–100K / $100–200K / $200–300K). Verified against
   the live page, not assumed. This line sat here stale for weeks and would have sent a run off to
   rebuild finished work. **The open whole-home question is not pricing — it is portfolio evidence
   and whether to compete for luxury whole-home at all.** See Run #4 above.
6. **Judgment dates — BOTH MOVED 2026-08-26. Do not use 09-05.**
   - **Geo-disambiguation experiment → judge ~2026-09-26**, measuring clicks, not blended CTR. It ran
     inside a **corrupted meta description** until 2026-08-26 (see the meta-corruption section at the
     top). Judging it on 09-05 would read a build bug as a failed strategy.
   - **Not-indexed count → judge ~2026-09-26 as well.** Google only received the full 238-URL sitemap
     on 2026-08-26; a re-crawl cycle starts from there, not from 08-05.

## Human-only items (surface every run until Eric marks done)
_Re-prioritised 2026-08-05 by the 12-run logged-out ChatGPT protocol — see `ai-share-of-voice-log.md`._

- [x] ~~**GBP CATEGORIES**~~ — **CLOSED 2026-08-05, no action. Eric confirmed Kitchen and Basement are
      ALREADY secondary categories; Bathroom is primary.** My earlier "add the categories" recommendation
      was wrong — they exist. And the primary must **NOT** change: bathroom produces **~8 leads/week**
      and sits 3/3 at avg 2.3 in ChatGPT. Trading a proven lead engine for a speculative kitchen gain is
      a bad trade with no way to A/B it. **The category lever is already pulled as far as is safe.**
      Kitchen therefore has to be won through review language, Houzz, and project proof — not categories.
- [ ] **HOUZZ REVIEWS — now the single highest-leverage item on this list.** Houzz was the most-cited
      source across all 12 ChatGPT runs. We have **2 Houzz reviews** (re-verified live 2026-08-26; this line said 1); Everything Home — which beats us in
      *every* query — has **100+ plus multiple Best of Houzz awards**. We have MORE Google reviews than
      they do (78 vs 68). This is purely a distribution gap on one platform. **Ask past clients to post
      their review on Houzz too.** Even 10–15 would move us from invisible to credible there.
- [x] ~~**HOUZZ PROJECTS — 6 missing**~~ — **DONE 2026-08-05. All 6 uploaded with photos,
      descriptions, style, keywords and deep links. Houzz now shows 24 projects, matching the website.**
      The "Spa-Like Modern Bathroom Retreat" rename is also done. Profile URL added to schema `sameAs`.
      Remaining on Houzz for Eric: the About Us bio still says "62+ reviews" (actual 78), and Project
      Year is blank on the 6 new uploads — Eric said he'd handle both. Details in
      `docs/houzz-reconciliation-2026-08-05.md`.
- [ ] **KITCHEN PROJECT PHOTOS/CASE STUDY** — **Eric confirmed he HAS one (2026-08-05); awaiting
      materials.** `PROJECTS` has 0 kitchen entries vs 12 bathroom.
- [ ] Review-request texting system live (8–12/mo, SMS within 48hrs) — **must name the room.** Our
      corpus reads as bathroom-and-basement, which is exactly how ChatGPT categorises us. Reviews
      saying "kitchen" are what would build kitchen association.
- [ ] Dovetail reciprocal backlink (highest-value link; we already credit them on 3 project pages)
- [ ] Schluter contractor locator listing
- [ ] OneZone chamber membership/link
- [ ] Westfield long-form YouTube walkthrough — script written. **Note: the basement rival is now
      Building Concepts (Noblesville), #1 in 3/3 runs — not Nicholas Design Build, which barely
      appears.** Reddit corroboration is confirmed real (surfaced in 4 of 12 runs).
- [ ] GBP housekeeping: Geist + Pendleton service areas, opening date, hours (site says Mo-Fr 8–5)

**No longer human-only:** the 3-run logged-out ChatGPT check is **automated** as of 2026-08-05 —
`https://chatgpt.com/?q=<encoded>` auto-submits in the `playwright-incognito` browser. Run it every
month. Method documented at the top of `ai-share-of-voice-log.md`.

## Open questions for Eric (yes/no)
1. **Kitchen flagship project — Eric confirmed YES (2026-08-05). AWAITING MATERIALS:** photos,
   city/neighborhood (and whether it can be named), scope (cabinets/counters/island/layout change/
   wall removal/flooring/lighting), timeline in weeks, whether an investment figure may be published,
   design partner to credit, client quote. **Build the project page as soon as these arrive — this is
   the top content priority of the next run.**
2. ~~Per-route `<head>` canonical fix~~ — **Eric said BUILD IT NOW. Done and deployed 2026-08-05.**
3. ~~Delete the kitchen GBP post~~ — **Eric deleted it manually 2026-08-05.** GBP weekly-post cadence
   is **PAUSED**; do not auto-publish GBP posts in future runs unless Eric re-enables it.

## Whole-home / multi-room position — built 2026-08-05 (second half of run #2)
Strategic pivot from the 12-run ChatGPT protocol: we are 3/3 #1 for "overall remodeler" and 0/3 for
kitchen. Chateau Kitchens owns kitchen with 295 reviews. Nobody owns "one contractor for the whole
project" — and an in-house-licensed-trades GC is the genuine answer to it. Full reasoning in
`docs/ai-search-strategy.md`.

Shipped and verified live:
- **`/whole-home-renovation`** — the missing 8th service pillar, 10 AI-citable FAQs.
- **`/guide/renovation-sequencing-guide`** — sequencing logic nobody in this market publishes,
  including a "When You Should NOT Hire One Contractor" section.
- **`/tools/renovation-sequence-planner`** — room selection → real construction sequence, phase
  durations, what's out of service, living-in-house toggle that staggers bathrooms. Engine verified
  across 1,024 room/condition combinations.
- **9 city pages repositioned** around multi-room, each with a unique city-specific paragraph
  (verified 0 duplicates), all funneling into the pillar.
- Optional secondary `cats` on PROJECTS so genuinely multi-room jobs surface on the pillar.
- sitemap 229 → 232. IndexNow submitted for all new + changed URLs.

**Note:** the `services` array on CITIES entries is dead data — it is not rendered anywhere. Adding
Whole-Home to those lists had no effect. Don't rely on it.

## Image page-weight fix — 2026-08-05
26 project photos were oversized (wet-room set was 16320×12240 at 13–20MB each; the wet-room project
page alone served ~143MB). Capped everything at 2400px wide, quality 88: **193.0 MB → 13.8 MB, a 93%
reduction.** Verified live. Also removed a dead `modern-farmhouse-2.jpg` reference that was returning
the SPA fallback HTML instead of a 404 — a visibly broken image that passed status-code checks.
Originals recoverable from git history.

## What run #2 did
- **Kitchen Domination Cluster shipped and deployed**: 4 city treatments (new Fishers; Carmel/
  Zionsville/Westfield rewritten), cost pillar with 10 AI-citable FAQs, 4 blog posts, 2026 Kitchen
  Cost Report guide, and `/tools/kitchen-cost-calculator` (all 5 SPA routing pieces wired).
- **Kitchen pricing sweep to Eric's authoritative tiers** — see below. Verified clean by script.
- **CTR judgment day resolved with a NEW mechanism** (see "Retired tactics").
- `signs-bathroom-needs-remodel` + `schluter-vs-cement-board` upgraded; `BlogPostPage` gained
  `quickAnswer`/`faq` + FAQ schema support.
- Deployed (2 commits), sitemap 223→229, IndexNow 17 URLs (200), GSC reindex 11 URLs.
- GBP kitchen post published + verified live. Reviews: none needed action (all 7 replied, none <4★).

## KITCHEN PRICING — Eric's numbers, 2026-08-05 (AUTHORITATIVE — SWEEP COMPLETE ✅)
**Minimum kitchen project is $25,000.**

| Tier | Range |
|---|---|
| Cosmetic / Basic | $25,000 – $50,000 |
| Mid-Range / Full | $50,000 – $100,000 |
| Premium Full | $100,000+ |

Headline: *"Kitchen remodeling in Hamilton County starts at $25,000 and typically runs $50,000–
$100,000 for a full remodel, with premium custom kitchens $100,000+."*

All five sweep targets from run #1's list are **done**: `SERVICE_PAGES` costs, the `CostCalculator`
kitchen matrix, the three city quick answers, `GUIDES["kitchen-remodeling-hamilton-county"]`, and the
Carmel city FAQ. Holliday Farms raised into the premium band. Basement *kitchenettes* ($12–28K wet
bars) intentionally untouched — different product, not a violation.
Audit script confirms: **zero sub-$25K figures on any kitchen-context line.**

## Retired tactics (do not repeat)
- **CTR-copywriting rewrites on the two bathroom-cost pages.** Two attempts, no movement. Run #2
  established *why*: they rank page 1 (pos 7.6 / 9.6) with ~0 clicks because 4,279 impressions come
  from `*bathroom remodel cost hamilton` queries belonging to other Hamiltons (OH/TN/NJ), 95% US.
  Run #2 used a different mechanism — **geographic disambiguation**, "Indiana" leading title+meta.
  **⚠️ AMENDED 2026-08-26 — READ BEFORE RETIRING THIS PAGE.** The geo rewrite has never actually been
  tested. Both of these pages served a **corrupted meta description** — the "Indiana"-leading copy was
  live but spliced through with a literal `<meta name="description" content=` fragment, because a
  build bug expanded the `$1` in "$15,000". Repaired and deployed 2026-08-26. So the geo mechanism
  gets its **first real trial now**, and the verdict is due **~2026-09-26**, not 09-05.
  If it fails *then*, do NOT write a fourth title: reclassify those impressions as unqualified and
  stop judging the page on blended CTR. Until 09-26, this tactic is under test, not retired.
- **Re-requesting indexing on unchanged pages.** Golden rule stands.

## Content exclusions (Eric's decisions — do not build)
- Home repair / handyman content — declined July 2026 (surfaced again in run #2 data at 157 impr
  @28.9; correctly not acted on)
- Concrete / patio / driveway content — declined July 2026
- **Angi profile work — declined July 2026 (standing).** Keep the badge + schema `sameAs` exactly as
  is. Removed from the human-only list 2026-08-05; do not re-add.

## Open issues (with owner)
- **[code — RESOLVED 2026-08-05]** Per-route canonical injection **shipped and verified live**.
  `scripts/build-route-heads.mjs` runs after `vite build` and writes one static HTML file per sitemap
  URL (228) carrying that route's own self-referencing canonical + og:url. Random live sample of 12
  routes: 12/12 correct.
  **Two rules that must not be broken by future edits:**
  1. **Never write a canonical into the root `dist/index.html`.** `vercel.json` rewrites `/(.*)` to it,
     so it is the fallback for every unknown/junk URL. The first version of the script did this and it
     briefly re-created the July bug live (every unknown URL declared itself a homepage duplicate).
     Caught and fixed the same day. The verify script now asserts this.
  2. **`index.html` must stay canonical-free at source**, or per-route files would carry two canonicals.
     The script aborts the build if it detects one.
  Note: titles are still NOT injected per route (deliberate — the app sets them at runtime and Google
  renders them correctly; static titles would risk being worse). Only the canonical was broken.
  **`npm run build` now depends on `public/sitemap.xml` being present and current** — new URLs must be
  added to the sitemap or they get no static canonical.
- **[code — quick win]** Schema `aggregateRating.reviewCount` says **62**; GBP now shows **78 / 5.0**.
- **[human/Eric]** kitchen has zero project entries — biggest limiter on the new kitchen cluster.
- **[Google-time]** canonical + reindex results only meaningful after re-crawl; judge ~2026-08-22.

## Indexing status (2026-08-05)
220 indexed / 60 not indexed — **unchanged, and uninformative**: GSC's report was last updated
7/23/26, *before* the 7/25 canonical fix deployed. Spot-checks tell the real story:
- `/kitchen-remodeling-carmel-in` → **indexed ✅** (was the confirmed broken page at run #1)
- `/kitchen-remodeling-zionsville-in` → "Duplicate without user-selected canonical", canonical: None ❌

**As of 2026-08-05 the second page's root cause is fixed at the source** — it now serves a static
self-referencing canonical on first fetch, no JS render required. **Next run: re-inspect
`/kitchen-remodeling-zionsville-in` in GSC.** If it clears, the fix is proven end-to-end and the
remaining canonical-group pages should follow as Google re-crawls. Judge the not-indexed count
~2026-09-05 (allow a full re-crawl cycle), not 8/22 — the 8/22 date was set for the *old* watch-only
plan, which this supersedes.

**⚠️ AMENDED 2026-08-26: the not-indexed judgment moves to ~2026-09-26.** Google did not hold the
full sitemap until Eric resubmitted it on 08-26 (`Submitted Aug 26 | Last read Aug 26 | 238`). A
re-crawl cycle is only meaningful from that date, so 09-05 would be measuring a crawl that had never
seen most of these URLs listed.

## Tooling
- **Syntax gate:** repo has **no `node_modules`**, so esbuild is unavailable. `@babel/parser` is
  installed in the session scratchpad; `check.cjs` there is the hard gate. Also there: `linkcheck.cjs`
  (internal href resolution) and `calccheck.cjs` (calculator band/floor verification).
- **`playwright`** (persistent Chrome profile) — Google logins persist; used for GSC + GBP. Works.
- **`playwright-incognito`** — intended for logged-out ChatGPT runs. Declined during run #2.
- **Git push** requires `GIT_TERMINAL_PROMPT=0` or it hangs on the credential manager.
- **IndexNow on Windows:** avoid shell quoting entirely — write the JSON to a file and
  `curl --data-binary @file`. Key `3d0da3d219054effbd1a34b32bb1be9e`, key file verified reachable.

## Citations & badges — COMPLETED (do not re-recommend)
BBB (trust bar + footer + schema `sameAs`) · Angi (badge + `sameAs`) · BAGI (badge + `sameAs` +
`memberOf`). Assets `angi-badge.png` + `bagi-badge.png` confirmed present in `public/images/`.

## History
- **2026-07-25 (Run #1):** first real run. Clicks ~3× baseline. Fixed the canonical root cause in
  `index.html`. Kitchen/blog/Carmel content shipped. 9 five-star review replies + Geist GBP post
  published. See `run-report-2026-07-25.md`.
- **2026-08-05 (Run #2):** Kitchen Domination Cluster built and deployed; kitchen pricing sweep
  completed; CTR failure re-diagnosed as geographic mismatch and fixed with a new mechanism;
  canonical fix confirmed working on one real page and failing on another. See
  `run-report-2026-08-05.md`.

## ✅ 2026-09-01 — HOUZZ REVIEWS: 2 → 5, VERIFIED LIVE AND LOGGED OUT

Eric reported five reviews; verified rather than recorded, because this count has now been wrong
twice and was corrected both times only by checking.

**`houzz.com/pro/homestarservicesandcontracting` — 5.0 rating, 5 reviews.** Confirmed in the
signed-in admin view and independently in a logged-out `playwright-incognito` session, which
rendered *"Average rating: 5 out of 5 stars, 5 Reviews"* alongside a Sign In link.

**The admin view shows a "Private Profile — Only you can see this view" banner. It is not private.**
That banner labels the editing view. The logged-out check resolves it: the profile, the rating and
the review count are all publicly visible, and the page carries a "Read Reviews from Fishers
Homeowners Like You" section. Worth recording so nobody panics at that banner again — if the
profile really were private, the entire Houzz strategy would be dead and this is how to tell.

**Progress against the real bar.** Run #4 established the bar as **~15–20, not 122** — the firms
placed above HomeStar sit on 15 and 17. So 5 is a third of the way, not a rounding error. Remaining
ask is roughly **10 more**, to clients who already left 5-star Google reviews (~80 of those exist).

**Correction to prior sign-offs:** the standing reminder had been carrying "1 review vs a
competitor's 100+". Both halves were stale — the count had moved, and 100+ was never the bar this
repo's own analysis identified. Memory corrected.

**Profile checklist sits at 4 of 7 (57%).** Outstanding: Add Highlights (premium), Add Highlight
Video (premium), Add FAQs (free, new). FAQs is the only free one and is worth doing — it adds
crawlable text to a profile whose corpus is the ranking constraint.

## ✅ 2026-09-01 — HOUZZ FAQs PUBLISHED: FIVE ANSWERS, EMITTED AS `FAQPage` SCHEMA

Added the five free FAQs to the Houzz profile. Checklist moved **4 of 7 → 5 of 7**.

**The payoff is bigger than crawlable text.** Houzz renders these into
`application/ld+json` as **`FAQPage` / `Question` / `Answer`** structured data — verified logged
out. That is the format Google rich results and AI answer engines consume directly, so this is
materially better than the plain profile prose it sits beside. Houzz's own dialog says it out
loud: *"may increase your visibility in AI search engines."* Full logged-out `@type` set now:
LocalBusiness, PostalAddress, AggregateRating, GeoCoordinates, place, OfferCatalog, PropertyValue,
BreadcrumbList, ListItem, **FAQPage, Question, Answer**.

**The five questions**, chosen to cover the axes AI engines match on — cost, timeline, trust,
geography, credentials: bathroom/kitchen/basement cost in Fishers and Hamilton County; how long a
remodel takes; subcontractors vs. own crews; areas served; licensed/insured and warranty.

**Answers are hard-capped at 500 characters** (`maxLength=500`; the Question field is uncapped).
The cap is silent — the first answer was pasted at 540 chars and Houzz truncated it mid-word at
*"after a free i"* with no error. Every answer was then measured before entry and re-read from the
DOM after. Final lengths: 496 / 490 / 493 / 402 / 493. **This is the "verify the value, not the
tag" lesson again, in a third system.** Confirmed intact after a reload and in a logged-out
session, so the truncation was not merely a local artifact.

**Every figure is repo-sourced, not invented** — pricing, timelines, Schluter certification, the
25-year manufacturer and 1-year workmanship warranties, the on-payroll trades, and the paid-permits
claim were each grepped out of `src/App.jsx` before being written into public copy.

### ⚠️ Opened by this work: the site contradicts itself on basement pricing

The basement service content states **$45,000–$200,000+, most homeowners $55,000–$95,000**
($75–$110/sq ft premium, $110–$175/sq ft luxury). The city-page FAQs state materially lower and
mutually inconsistent numbers for the same work: **Westfield $20,000–$50,000**, Olio-corridor
Fishers **$25,000–$45,000**, Bridgewater Club **$30,000–$55,000**. Westfield's floor is less than
half the canonical figure while its own signature Westfield project is described at ~$150,000.
The Houzz FAQ uses the canonical service-page numbers. The city pages should be reconciled to
match — a prospect comparing the two pages sees a contractor who cannot quote its own work.

### Correction, same day — FAQ 3 rewritten: the in-house claim was overstated

Eric corrected the premise: the model is **a mix — licensed trades both on and off payroll, plus
the most experienced subcontractors in their field** — chosen for the best outcome, not for
purity. The published answer ("Every licensed trade is on our own payroll... not subcontracted
out") claimed more than is true and was replaced within the hour. Verified logged out: new text
public, old claim gone, carried in the `FAQPage` schema.

The question was deliberately kept as *"Do you use subcontractors, or your own crews?"* because
that is what homeowners actually type. Only the answer changed, from a purity claim to a quality
claim: the decision rule is which trade produces the better result, never which is cheapest or
soonest. That is both true and a stronger premium signal — a blanket "we never subcontract" is
easy to disprove and undersells using the best specialist for a craft.

### ⚠️ The website makes the same overstated claim in two places

`src/App.jsx` states it broadly at **line 3221** (*"every licensed trade is on our own payroll"*)
and **line 3033** (*"we don't subcontract out the licensed trades"*). Both are contradicted by
Eric's correction and should be reworded.

Distinguish these from the **narrow plumbing/electrical claims** at lines 613, 2171, 3081 and 3220
(*"licensed plumbers and electricians are HomeStar employees"*), which Eric did not dispute and
which are the actual wedge — do not touch those without confirming. Line 852 (*"not
subcontractors we've never worked with"*) and line 2190 (*"not the lowest-bid subcontractors"*)
are already consistent with the mixed model and need no change.

**Resolved same day (`d3292bd`).** Both broad claims reworded to the premium framing: trades are
chosen for craft and never for lowest bid, with one company accountable for the sequence. The
narrow plumbing/electrical employee claims were left intact as the wedge. Babel parse and full
build pass, 237/237 routes retain title and description. **Deployed and verified live 2026-09-01** (`636ef8c`): new copy present and old claim absent on /basement-finishing, /whole-home-renovation, and the city basement routes (11 routes total), all HTTP 200.

## ✅ 2026-09-02 — GENERATIVE CLEANUP OF PROJECT PHOTOS: TESTED, AND IT WORKS

Eric asked whether the Fishers bath photos could be cleaned up by removing clutter. Tested on the
shower niches — the hardest case, chosen deliberately, because the niche backs are elongated
hexagon picket tile and reconstructing tile geometry is where generative fill usually fails.

**It held.** Nano Banana 2, 2 credits. The bottles came out and the picket tile behind them was
continued faithfully: same hexagon shape, same orientation, same proportions, grout lines landing
where they should. The showerhead is the same fixture. The niche openings are unchanged.

**Correction, recorded on purpose.** My first read of this test called it a failure — that it had
swapped the tile for a different profile and changed the showerhead. That was wrong, and Eric
caught it. The error came from comparing a soft source against a crisp output: the input crop was
a 3x upscale of a 184px-wide region, so it is genuinely mushy, while the output is clean 2K. I read
the sharpness difference as a change of material. **Judging fidelity from a downscaled comparison
is how you reach a confident wrong answer — zoom to native pixels on both sides before calling it.**

**What is actually true about the method.**
- There is no working mask path. The catalogue lists a `mask` role for `nano_banana_2`, but the MCP
  layer rejects it with *"Unknown media role: mask"* while the backend refuses `is_inpaint` without
  one. So every edit regenerates the whole frame rather than patching a region.
- Crop-and-composite is therefore the workflow: crop tight around the target, edit, paste back at
  the exact original pixel dimensions. Everything outside the crop is then untouched by construction.
- The model reframes — 552x1350 in, 1536x2752 out — so the return has to be resized back to the
  source crop box, not trusted to line up.
- **The output is sharper than the surrounding photograph.** Pasted back raw it will read as a
  patch, so the edited region needs its sharpness and grain matched to the host image.
- Every output still gets eyeballed at native resolution before it ships. Not because the model is
  unreliable here, but because the failure mode when it does slip is plausible-looking and quiet.

**What is still not worth removing.** Towels and rugs are styling, not clutter — interior
photography includes them deliberately, and a bathroom stripped of soft goods reads as a vacant
listing. The worthwhile targets are personal effects: toothbrushes, shampoo bottles, the loofah.

**And the free fix still beats all of it: stage the room before shooting.** Two minutes clearing
counters costs nothing and cannot introduce an artifact.
