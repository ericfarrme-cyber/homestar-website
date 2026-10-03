# SEO report — October 2026

Run 2026-10-03 against the live site and a logged-out ChatGPT sweep.

**The two-month data blocker is cleared.** TASK 4 reads GSC exports from
`docs/gsc-exports/YYYY-MM/` and the newest folder was 2026-08, which is why September's report ran
blind and this one nearly did. Rather than wait for a CSV drop, the performance table was read
directly from the Search Console UI with CTR and Position enabled and all 1,000 query rows in the
DOM, and written to `docs/gsc-exports/2026-09/`. **The strike zone now exists.**

Still unavailable without a proper export: the indexed-vs-not trend from `Chart.csv`, and a clean
month-over-month comparison (the two windows are overlapping three-month trailing periods, not
discrete months).

## Autopilot status

| | |
|---|---|
| Last full autopilot run | **2026-08-26 (Run #4)** — five weeks ago |
| Last SEO report | 2026-09-07 |
| Last AI sweep | 2026-09-19 (Run #5, protocol) + 2026-10-03 (Run #6, single-pass) |
| GSC exports available | 2026-07, 2026-08, **2026-09 (written this session)** |

## Headline — 3 months to 29 September

| metric | to 29 Sep | to 5 Sep | change |
|---|---|---|---|
| Clicks | **498** | 439 | +13% |
| Impressions | **90,400** | 84,800 | +6.6% |
| Average CTR | **0.6%** | 0.5% | +0.1pp |
| Average position | **15.0** | 16.1 | **1.1 better** |

Overlapping windows, so this is drift rather than a clean month-over-month — but all four moved
the right way. Brand is still ~31% of clicks.

**Strike zone: 168 non-brand queries at position 8-25 with >=40 impressions. 16,593 impressions.
Essentially zero clicks.** It is dominated by service-by-city terms — the same pages measured at
82% duplication in September. The duplication thesis and the click data now agree, which is what
makes the content work below the highest-confidence action on the list. Full table in
`gsc-exports/2026-09/`.

About 1,300 of those impressions are queries HomeStar should not chase at all: decking comparisons
(733), `concrete patio installation fishers` and `stamped concrete fishers` (372 — those belong to
the sister listing, Hamilton County Concrete and Patios, but rank on this domain),
`home improvement franchise opportunities westfield` (231), and one for Kingsport, Tennessee.

## What was verified live

| check | result |
|---|---|
| Meta description corruption (the `$1` backreference bug) | **Clean.** Five sampled pages including all three known-corrupted ones render correct descriptions. No regression. |
| Served encoding | Valid UTF-8, `charset=utf-8`, em dashes intact. A `?` seen during the audit was a console artefact, not a site fault. |
| Canonicals | Present and correct on every sampled page. The homepage has none **by design** - see below. |
| sitemap.xml | 200, **242 URLs** |
| robots.txt | 200, GPTBot and the other AI crawlers explicitly allowed |
| `/design-build-fishers-in` | **Live.** 1,018 words. Schema: Service, FAQPage, HomeAndConstructionBusiness, AggregateRating, BreadcrumbList, City. Did not exist at the September report. |

### Corrected: the homepage canonical is deliberate, not a defect

An earlier pass of this report listed the missing homepage canonical as a bug. It is not.
`scripts/build-route-heads.mjs` refuses to write one into `dist/index.html` on purpose, and says
why: `vercel.json` rewrites every unknown URL to that same file, so a baked-in homepage canonical
would make each of those URLs declare itself the homepage. That exact mistake caused **32
"Alternate page with proper canonical" failures** earlier in 2026. Real routes get their own
canonical from the prerender step; the root template deliberately gets none and lets Google
self-canonicalise. **No action.**

## What has not moved since September

**The indexing queue is still untouched.** `docs/indexing-queue.txt` holds **44 URLs and zero DONE
markers** — it was 42 and zero a month ago. It was ranked action #1 in the September report.

The September addendum is the reason to be careful here, and it still stands: re-submitting does
not overturn a quality judgement, and the bucket that matters was **28 "Crawled – currently not
indexed" with validation already Failed**. The fix was never "submit the queue" — it was
differentiating the ~10 service-by-city combinations where HomeStar has actually built that service
in that town, and consolidating flooring- and painting-by-city, which have no project proof and the
highest duplication (91% and 82%). None of that has been done either.

**Bing Places is still the map-pack gap**, diagnosed 2026-08-14 and unaddressed since. Checked
live this session and it is worse than diagnosed — see below.

## AI standings

Full detail in `ai-share-of-voice-log.md` Run #6. One run per query, not the three-run protocol —
directional only.

HomeStar appeared in **4 of 4** answers. That is not the problem any more. The problem is what
happens at the end of each answer.

ChatGPT now closes these answers with a "how I'd narrow it down" section. That section is the
actual recommendation; the list above it is a longlist. **HomeStar is excluded from it in three of
four categories** — routed to "smaller or more straightforward renovation" in kitchen, to "bathroom
plus other renovations" in bathroom, and omitted entirely from the basement three-bid list.
Whole-home is the single exception and the only category where it made the real shortlist.

That routing inverts the business. HomeStar walks every estimate; recent work is a 1,754 sq ft
basement, a 4,000 sq ft whole home and full guts.

**Review volume is not the lever.** HomeStar's 5.0 from 85 sits below MJ Woodstone (21 reviews) and
Indy Renovation (31) in bathroom, and below Nicholas Design Build (15 on Houzz) in kitchen. What
those firms have is a category label and a specialisation sentence.

## Verified live this session — two of my own findings were wrong

**The GBP categories are already correct.** September flagged them as unverified and I ranked
fixing them as action #1. Checked in Business Profile Manager: the profile is Verified, covering
Carmel, Fishers and eight further areas, and the category set is

> **Bathroom remodeler (PRIMARY)**, Painting, Remodeler, Deck builder, Tile contractor,
> Kitchen remodeler, General contractor, Flooring contractor

Primary is already the exact label MJ Woodstone carries in the AI business cards. **The
category hypothesis is dead.** What remains arguable is dilution: Deck builder, Painting and
Flooring contractor are peripheral to the business and are the same three services whose
by-city pages carry the highest duplication and no project proof. Trimming them is a judgement
call on a live listing, so it is left for Eric rather than done unilaterally.

**Bing has no business entity for HomeStar at all.** This is the real mechanism, and it is worse
than the August "unmanaged and mis-located" diagnosis. On an exact brand-name search —
`HomeStar Services and Contracting Fishers Indiana` — Bing returns four sponsored ads, then the
website, BBB and Houzz, and **renders no knowledge panel and no business card.** Bing Places is
not claimed; the dashboard redirects to a signed-out marketing page.

Bing is the search layer behind ChatGPT. Competitors render as cards with a category and a star
rating because they exist as Bing business entities. HomeStar can only ever be mentioned in prose.

## The ranked actions

1. **Claim Bing Places.** This is now action #1 and it replaces the GBP item, which is already
   correct. It needs a Microsoft sign-in and will need phone or postcard verification, so it is
   Eric's to start: bingplaces.com, claim the listing, match name/address/phone to the GBP exactly,
   set the category to Bathroom remodeler. Nothing else on this list touches the AI business cards.
2. **Houzz: 5 reviews against ~15.** Unchanged across four sweeps and still the mechanism by which
   Nicholas (15), ACo (17) and Everything Home (122) outrank HomeStar in kitchen. Standing item.
3. **Keep differentiating service-by-city pages.** Three shipped this session (below); the strike
   zone says the remaining bathroom and basement combinations are worth the same treatment.
4. **Consolidate flooring-by-city and painting-by-city.** 91% and 82% duplication, no project
   proof, and no strike-zone demand. These are the pages most likely to be dragging the
   programmatic set down.
5. **Decide what replaces the "100+ projects / in-house licensed plumbers and electricians"
   claim** before anyone removes it. Retired from the ads, still live on the site, still the
   sentence ChatGPT quotes to justify recommending HomeStar for whole-home.

## Shipped this session

Three `CITY_SVC_CONTENT` entries added, chosen by the September rule — differentiate only where
HomeStar has actually built that service in that town — and cross-checked against the strike zone:

| page | project proof | strike-zone demand |
|---|---|---|
| `bathroom-remodeling-Zionsville` | Jack & Jill Bathroom Remodel in Zionsville | *bathroom remodeling zionsville in* 114 @ 14.2 |
| `basement-finishing-Zionsville` | Basement Bar, Wine Room & Lounge in Zionsville | basement cluster, 100-312 impressions |
| `bathroom-remodeling-Geist` | Three-Bathroom Remodel in Geist; Two Children's Bathrooms in Geist; Geist Upper Level | Geist sits inside the Fishers bathroom cluster |

Measured with `SequenceMatcher.ratio` — the correct instrument, per the September correction —
the highest similarity of any new page to any existing page is **23%**. The untreated
service-by-city pages measure 82%.

Coverage is now 14 of 63 service-by-city combinations with unique content.

## What this report could not answer

- Clicks, impressions, CTR and average position for September — no export.
- Whether the two fixed cost pages' CTR moved — no export.
- Which pages gained or lost more than three positions — no prior-month data in a comparable format.
- Whether the design-build page caused the whole-home improvement — one AI run cannot establish that.
- Bing Places and GBP category state — both need Eric's login.
