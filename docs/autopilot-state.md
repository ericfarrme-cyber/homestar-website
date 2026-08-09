# Autopilot State — HomeStar SEO
Last run: 2026-08-05 (Run #2 — "Distance the Lead", autonomous execution) — **PAUSED at Eric's request, all work committed and deployed**

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

**Data inconsistency to fix:** homepage says "100+ Projects Completed", Eric's author bio says "50+
Hamilton County Projects Completed". Both public. Which is right?

## 🔴 TOP FINDING 2026-08-06 — we do not hold the gatekeeper term for whole-home
On "who should I hire for a whole home renovation in Hamilton County Indiana" ChatGPT opened with
*"I'd focus on **design-build firms**"* and then listed only design-build firms. **HomeStar was absent.**
The filter was category membership, not quality.

**We qualify and never say it:** in-house design, 3D renderings before demolition, permits, all
licensed trades on our own payroll, one contract. Two firms beating us have "Design Build" in their
literal business name.

**Action: claim "design-build" explicitly** on the whole-home pillar, homepage, GBP services and Houzz.
Costs nothing — the capability already exists. Full research: `docs/ai-research-whole-home-and-designer-2026-08-06.md`.

## ⏭️ START HERE NEXT RUN
1. **Houzz reviews — the standing #1 item.** Still 1 review vs Everything Home's 100+. Surface it first,
   every run, until it is meaningfully above 10–15. (Also in persistent memory.)
2. **Re-inspect `/kitchen-remodeling-zionsville-in` in GSC.** It was "Duplicate without user-selected
   canonical"; the per-route canonical fix shipped 2026-08-05 should have cleared it. This is the single
   check that proves the fix end-to-end.
3. **GSC manual index requests** for `/whole-home-renovation`, `/guide/renovation-sequencing-guide`,
   `/tools/renovation-sequence-planner` — IndexNow submitted, manual queue pending (see indexing-queue.txt).
4. **Kitchen flagship project** — Eric confirmed he has one; still awaiting photos + details.
5. **Eric's whole-home price floor** — the pillar deliberately publishes no whole-home range. Ask for
   the smallest genuine whole-home/multi-room figure and the typical main-level number.
6. **Judge ~2026-09-05:** the geo-disambiguation experiment (measure clicks, not blended CTR) and the
   not-indexed count after a full re-crawl cycle.

## Human-only items (surface every run until Eric marks done)
_Re-prioritised 2026-08-05 by the 12-run logged-out ChatGPT protocol — see `ai-share-of-voice-log.md`._

- [x] ~~**GBP CATEGORIES**~~ — **CLOSED 2026-08-05, no action. Eric confirmed Kitchen and Basement are
      ALREADY secondary categories; Bathroom is primary.** My earlier "add the categories" recommendation
      was wrong — they exist. And the primary must **NOT** change: bathroom produces **~8 leads/week**
      and sits 3/3 at avg 2.3 in ChatGPT. Trading a proven lead engine for a speculative kitchen gain is
      a bad trade with no way to A/B it. **The category lever is already pulled as far as is safe.**
      Kitchen therefore has to be won through review language, Houzz, and project proof — not categories.
- [ ] **HOUZZ REVIEWS — now the single highest-leverage item on this list.** Houzz was the most-cited
      source across all 12 ChatGPT runs. We have **1 Houzz review**; Everything Home — which beats us in
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
  If that fails at ~2026-09-05, do NOT write a fourth title. Reclassify those impressions as
  unqualified and stop judging the page on blended CTR.
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
