# GSC pull — 2026-10-03

Read live from the Search Console UI (`sc-domain:thehomestarservice.com`, Web),
**3 months to 29 September 2026**. Captured by scraping the rendered performance table with the
CTR and Position metrics enabled and 1,000 query rows in the DOM — not a CSV download.

## Totals

| metric | 3 mo to 29 Sep | 3 mo to 5 Sep (Sept report) | change |
|---|---|---|---|
| Clicks | **498** | 439 | +59 (+13%) |
| Impressions | **90,400** | 84,800 | +5,600 (+6.6%) |
| Average CTR | **0.6%** | 0.5% | +0.1pp |
| Average position | **15.0** | 16.1 | **+1.1 better** |

The windows overlap heavily, so this is drift rather than a clean month-over-month. Direction is
positive on all four.

## Brand share
Brand queries (`homestar*`, `home star*`) account for **158 of the top-1,000 rows' 191 clicks**.
Across the whole property that is roughly 31% of all clicks — unchanged from September.

Top-1,000 rows cover 54,337 of 90,400 impressions; the remainder is long tail.

## Strike zone — non-brand, position 8–25, impressions >= 40

**168 queries. 16,593 impressions. Essentially zero clicks.**

`strike-zone.tsv` holds the top 52 by impressions. The shape of it is the finding: the list is
dominated by **service-by-city** terms sitting at positions 8–23 — the same pages measured at 82%
duplication in the September addendum. Google is showing these pages constantly and nobody clicks,
which is what page-two thin content looks like.

Clusters worth treating, by total impressions:
- **Bathroom x city** — noblesville in (284 @14.2), fishers in (248 @22.5), fishers (172 @19.0),
  fishers in (128 @21.7), zionsville in (114 @14.2), noblesville (110 @13.6)
- **Basement x city** — carmel (312 @20.8), fishers (148 @11.2), finishing fishers (140 @9.8),
  contractor fishers (138), remodeling fishers (103 @8.5), renovation fishers (93 @8.5),
  finished basement fishers (93 @16.3), westfield in (95 @8.7), entertainment basement fishers (100)
- **Kitchen x city** — zionsville in (210 @19.0), hamilton county indiana (106 @8.9),
  fishers in (95 @12.9), westfield in (53 @8.9 — the only one converting, 1 click)
- **Whole home** — home remodeling westfield in (173 @11.2), whole home remodel westfield
  (150 @20.8), home remodeling carmel in (136 @21.3), interior remodeling westfield (95 @8.9)
- **Head terms** — remodeler (668 @9.0), bathroom remodeling (639 @22.7), bathroom remodeler
  (455 @17.6), bathroom remodel (297 @9.6), kitchen remodeler (226 @14.4)
- **design build vs general contractor** (471 @19.6) — the blog post, now with a service page
  behind it at `/design-build-fishers-in`

## Impressions that are not ours to win
- `concrete patio installation fishers` (223 @10.7) and `stamped concrete fishers` (149 @13.8)
  belong to the sister listing, **Hamilton County Concrete and Patios**, but are ranking on this
  domain.
- `composite decking vs wood cost` and variants (380 + 165 + 103 + 85 = 733 impressions) — decking
  content pulling traffic HomeStar does not sell.
- `basement remodeling estimates kingsport tn` (107) — wrong state.
- `home improvement franchise opportunities westfield` (231) — wrong intent entirely.
- `storm damage repair fishers` (133), `flooded bathroom` (120), `basement handyman` (123) —
  adjacent intent, not the business.

Roughly **1,300 of the strike zone's 16,593 impressions are queries HomeStar should not be
chasing.** The real addressable set is about 15,000.
