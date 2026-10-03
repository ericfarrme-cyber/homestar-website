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

---

# Addendum 2026-10-03 — the indexing regression, and what is causing it

Pulled from the live Page Indexing report (GSC data current to 28 Sep, so today's
content changes are not reflected).

## The trend is down, and accelerating

| date | indexed | not indexed | "Crawled - currently not indexed" |
|---|---|---|---|
| 2026-09-07 | 222 | 72 | 28 |
| 2026-09-19 | 212 | 83 | 41 |
| **2026-10-03** | **185** | **109** | **68** |

**Indexed pages have fallen 37 in under a month — down 17%.** The quality-judgement bucket has
grown 143% in the same window. This is not drift; Google is actively removing pages from the index
faster than it is adding them.

## The cause: the neighbourhood tier

Of the 68 "Crawled - currently not indexed" URLs, roughly **57 are service x neighbourhood x city
pages**:

```
/kitchen-remodeling-jacksons-grant-carmel-in
/kitchen-remodeling-holliday-farms-zionsville-in
/kitchen-remodeling-village-of-westclay-carmel-in
/basement-finishing-bradley-ridge-zionsville-in
/basement-finishing-reserve-at-springmill-carmel-in
/remodeling-olio-road-fishers-in
/remodeling-brooks-school-fishers-in
/remodeling-116th-street-carmel-in
...
```

The sitemap carries **87 of these**, 36% of its 242 URLs. About two thirds of the tier has now been
rejected. These are a level below the service-by-city pages that September measured at 82%
duplication — same template, narrower slice, even less unique content, and no project proof for
most of them.

Three more are leftovers that should not exist at all: `/portfolio-items/kitchen-one/`,
`/portfolio-items/painting-one/` and `/portfolio-items/kyle-kitchen-before/` — demo-content slugs
from a previous platform.

## Why this matters beyond the pages themselves

"Crawled - currently not indexed" at this scale is a judgement about the site, not only about those
URLs. Google spent crawl budget on 87 near-identical pages, declined most of them, and the rest of
the domain sits at average position 15 with 0.6% CTR. The strike zone - 168 non-brand queries at
position 8-25, 16,593 impressions, near-zero clicks - is what that looks like from the query side.

**The neighbourhood-page decision Eric deferred in September (~75 redirects) is now forced by the
data.** The recommendation is to 301 the neighbourhood tier into its parent service-by-city page
and drop it from the sitemap, taking the submitted set from 242 to ~155 and concentrating the
signal on pages that can actually carry unique content and project proof.

## One page to re-check
`/bathroom-remodeling-zionsville-in` appears in the not-indexed list. That snapshot predates
today's content change; it should be re-inspected after the next crawl rather than treated as a
failure of the new copy.

---

# Addendum 2026-10-03 (later) — items 1-3 executed

## Item 1 — service-by-city differentiation is complete, at 14

Not because 63 pages were written, but because **the proof-backed set is exhausted.** Audited every
service x city combination against the PROJECTS array: there are now **zero combinations where
HomeStar has a completed project in that town and the page lacks unique content.**

| | |
|---|---|
| combinations with project proof | 14 |
| of those, with unique copy | **14** |
| remaining combinations | 49, none with a project in that town for that service |

Writing the other 49 would mean inventing local detail for towns where the work has not been done —
which is precisely what produced the 82% duplication and the rejections in the first place. The
September rule was right and it has now been followed to its end.

**Recommendation for those 49:** the same treatment flooring and painting just received.
Consolidate into the city hub or the service hub rather than maintaining thin variants.

## Item 2 — flooring and painting by city, consolidated

36 permanent redirects (Vercel emits 308, which Google treats as 301 for consolidation). Nine
flooring and nine painting city pages now resolve to their service hub. Sitemap **242 -> 224**.
Verified live: `/flooring-services-carmel-in`, `/painting-services-fishers-in` and
`/flooring-services-geist-in` all 308 to the correct hub.

This also aligns the site with the Google Business Profile, where Eric is trimming the same
peripheral services.

## Item 3 — the bathroom head terms

The bathroom hub was **the only page in SERVICE_PAGES without a `quickAnswer` block** — basement,
kitchen and whole-home all had one. It is also the largest head-term target on the site:

| query | impressions | position |
|---|---|---|
| bathroom remodeling | 639 | 22.7 |
| bathroom remodeler | 455 | 17.6 |
| bathroom remodel | 297 | 9.6 |
| **total** | **1,391** | |

Added one, written with the specificity Run #7 showed ChatGPT rewards — named towns, named project
types, the Kerdi-versus-cement-board distinction stated as a material fact. Verified live.

**Kitchen positioning.** Run #7 put HomeStar in all three kitchen answers and none of the three
shortlists, with the reason stated outright: *"a local contractor who can coordinate the various
trades without necessarily going with the most design-oriented firm."* Appended the three-paths
design-build sentence the whole-home page already carries.

Both edits are additive. The protected copy — 100+ completed projects, licensed plumbers, licensed
electricians — is byte-identical and was verified so after the change.

## Still outstanding and still the biggest item

**The neighbourhood tier.** 87 pages in the sitemap, ~57 of the 68 index rejections, and not
covered by items 1-3 so not touched. Until it is redirected, indexed-page count is likely to keep
falling. This remains Eric's decision.

---

# Addendum 2026-10-03 (evening) — the job mix, and the positioning change it justified

Eric asked whether cutting flooring and painting would help the four core categories grow. The PM
hub answers it. Across **32 HomeStar jobs** (the 13 `company=hcc` rows are Hamilton County Concrete
and Patios, the sister business, and are excluded — an unfiltered first pass wrongly showed decks at
27% of jobs):

| category | jobs | share | share of contract value |
|---|---|---|---|
| **bathroom** | **20** | **62%** | **48%** |
| basement | 5 | 16% | 24% |
| kitchen | 2 | 6% | 7% |
| whole-home | 2 | 6% | 8% |
| **core four** | **29** | **91%** | **87%** |
| flooring / painting / decks | 2 | 6% | **2.8%** |

Flooring, painting and decks are **2.8% of contract value**. They were occupying two GBP categories,
four homepage tiles, eighteen city pages and a line in every city page's service list — and, per
Run #7, the clause in ChatGPT's own description of HomeStar that sorts it below specialists.

Average bathroom contract: **$35,873** across 20 jobs. The site's published range
($20,000-$35,000 for most) is accurate and slightly conservative.

## What changed

- Homepage services grid: **8 tiles -> 4**
- `ServiceCityLinks`: flooring/painting/decks removed. It had been generating internal links
  straight into the 301s added earlier the same day.
- Per-city service lists trimmed on **9 city pages**
- Bathroom specialism stated as a fact in two places: *"more than half of every project we take on
  is a bathroom"* (62%, rounded down, no pricing)

The four pages themselves still exist and still rank for nothing; they are simply no longer part of
what the site says HomeStar **is**.

## Google Business Profile description — for Eric to paste (720 of 750 chars)

> HomeStar Services & Contracting is a Schluter Pro Certified remodeling contractor based in
> Fishers, Indiana, serving Hamilton County homeowners. More than half of every project we take on
> is a bathroom - full gut renovations, custom walk-in tile showers, wet rooms and shared
> children's baths. We also finish basements, remodel kitchens, and take on whole-home renovations.
> Every shower is built on the complete Schluter waterproofing system, Kerdi on the walls and Ditra
> underfoot, carrying a 25-year manufacturer warranty. Plumbing and electrical are performed by our
> own licensed trades, not subcontractors, and every project carries a 1-year workmanship warranty.
> Owners Eric and Robb walk every estimate personally.

Leads with the specialism, keeps the four core categories, keeps the licensed-trades claim verbatim,
drops flooring/painting/decks entirely.

## The tension to watch

Whole-home is a breadth claim and it is the category where HomeStar most often reaches the AI
shortlist. The goal is not fewest services, it is a **coherent identity**: bathrooms, basements,
kitchens and whole-home all require licensed plumbing, licensed electrical, permits and inspections.
Flooring, painting and decks do not, which is why listing them read as "general contractor" rather
than "remodeler". Nicholas Design Build offers everything HomeStar does and still reads as one
thing. That, not narrowness, is the target.
