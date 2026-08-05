# SEO Orchestrator Run Report — 2026-08-05 (Run #2, "Distance the Lead")

Mode: **autonomous execution**. Code shipped, deployed, and verified live. Two commits pushed.

---

## Headline: three findings that changed the plan

### 1. The CTR "judgment day" verdict was a trap
Both July-fixed pages fail the <0.3% test:

| Page | Impr | Clicks | CTR | **Position** |
|---|---|---|---|---|
| /blog/bathroom-remodel-cost-hamilton-county | 3,576 | 1 | 0.0% | **7.6** |
| /guide/bathroom-remodeling-hamilton-county | 1,237 | 1 | 0.1% | **9.6** |

The literal reading is "rewrite the title with a new angle." But look at the driving queries:

| Query | Impr | Pos | CTR |
|---|---|---|---|
| full bathroom remodel cost hamilton | 2,227 | 6.4 | 0% |
| average bathroom remodel cost hamilton | 1,034 | 6.5 | 0% |
| small bathroom remodel cost hamilton | 1,018 | 6.3 | 0% |

**4,279 impressions, page-one placement, exactly zero clicks.** A weak headline does not produce
a 0.00% CTR at position 6 — it produces a bad CTR. Zero means the audience is wrong. The queries
say "hamilton", not "hamilton county indiana", and 95% of all traffic is US (22,964 of 24.1K), so
this is not foreign traffic. It is **other Hamiltons** — Hamilton County OH (Cincinnati), Hamilton
OH, Hamilton County TN (Chattanooga), Hamilton NJ — seeing a page that says "a Fishers contractor"
and correctly deciding it's the wrong state.

**Mechanism changed rather than repeated.** A third CTR-copywriting pass would have been the same
failed tactic a third time. Instead: geographic disambiguation. "Indiana" now leads both the title
and meta on both pages.
- Blog: → *"Bathroom Remodel Cost in Hamilton County, Indiana (2026 Prices)"*
- Guide: → *"Bathroom Remodeling in Hamilton County, Indiana: 2026 Costs & Contractor Guide"*

Judge at 30 days (~2026-09-05). The success metric is **not** total CTR — those 4,279 junk
impressions may persist. Watch clicks and impressions-from-Indiana-qualified queries.

### 2. The canonical fix works — but only partway
Aggregate is still 220 indexed / 60 not indexed. **That number proves nothing**: GSC's page-indexing
report says "Last update: 7/23/26", which is *before* the 7/25 fix deployed. Two URL Inspections
tell the real story:

- `/kitchen-remodeling-carmel-in` → **"URL is on Google / Page is indexed"** ✅
  This is the exact page that at run #1 was "Crawled – not indexed" with User-declared canonical =
  the homepage. The fix rescued it. That is direct proof the fix targets the right thing.
- `/kitchen-remodeling-zionsville-in` → **"Duplicate without user-selected canonical"**,
  User-declared canonical: **None**. ❌

I verified the live raw HTML: the static homepage canonical is genuinely gone (only the warning
comment remains). But pre-JS, every deep route still serves the **homepage `<title>`** and no
canonical at all. Googlebot's first pass sees identical head signals on every URL. It renders JS
eventually — which is why Carmel got indexed — but pages that don't get the render budget get
grouped as duplicates.

That is exactly the failure mode the per-route `<head>`-injection build fix solves. Your standing
decision is WATCH until ~2026-08-22, so I did not implement it. The evidence to pull it forward now
is in `indexing-health-log.txt`.

### 3. Kitchen has zero project proof — and I did not manufacture any
`PROJECTS` contains 12 Bathroom, 3 Basement, 4 Exterior, 2 Laundry, 2 Children's Bathroom,
1 Whole Home — and **0 Kitchen**. Per the authenticity guardrail I built no flagship kitchen case
study. This is the single biggest remaining hole in the cluster and it needs you.

---

## Executed

### Kitchen Domination Cluster (the headline build)
- **4 city treatments** — new `kitchen-remodeling-Fishers`; Carmel / Zionsville / Westfield fully
  rewritten. Counter-positioning throughout: kitchens as *main-floor* projects, in-house licensed
  plumbers AND electricians, "Major Projects. Master Craftsmanship." — aimed at MJ Woodstone's
  craftsmanship moat and Chateau Kitchens' specialist moat.
- **Kitchen cost pillar** on the service page — quickAnswer, rebuilt tiers, add-ons, and **10
  AI-citable FAQs** including "Why is there a $25,000 minimum?" and "Do I need a general contractor
  or can a kitchen specialist do it?"
- **4 blog posts** — cost / permits / ROI / design ideas. Inserted at the head of `BLOG` so
  Eric/Robb authorship alternates (and, being an even count, existing posts keep their parity).
- **2026 Hamilton County Kitchen Cost Report** guide, sitemap priority 0.9.
- **`/tools/kitchen-cost-calculator`** — island, layout-change/wall-removal, appliance and lighting
  add-ons; hard $25,000 floor; FAQ + WebApplication schema; all five SPA routing pieces wired.

### Kitchen pricing sweep (your authoritative tiers, 2026-08-05)
$25,000 minimum · $25–50K Cosmetic/Basic · $50–100K Mid-Range/Full · $100,000+ Premium Full.
Replaced every stale sub-$25K figure across `SERVICE_PAGES`, the `CostCalculator` matrix, the city
quick answers, the kitchen guide, and the Carmel city FAQ. Holliday Farms raised into the premium
band. **Verified by script: zero sub-$25K figures remain on any kitchen-context line.** Basement
*kitchenettes* ($12–28K wet bars) correctly left alone — different product.

### Other content
- `signs-bathroom-needs-remodel` (238 impr @ pos 38.2) — added quickAnswer, 5 FAQs, and bathroom
  resource links. Prose was already deepened in run #1, so it was **not** rewritten again.
- `schluter-vs-cement-board` retitled → **"Kerdi Board vs Cement Board"** to match the exact
  109-impression query (`kerdi board vs cement board`, pos 12.9) that the old title never used the
  word for. Plus quickAnswer + 4 FAQs. This page is already the #2 performer (1,716 impr, 9 clicks).
- **`BlogPostPage` now renders `post.quickAnswer` and `post.faq` with FAQ schema** — a reusable
  upgrade available to every future blog post.

### Pipeline
- @babel/parser gate passed on every save (harness installed in scratchpad — the repo has no
  `node_modules`, so run #1's esbuild approach was unavailable).
- Internal-link resolution scripted: 26 static internal hrefs checked, **all resolve**.
- sitemap.xml 223 → **229 URLs**, XML validated.
- 2 commits pushed; Vercel deploy confirmed by grepping the live JS bundle for the new strings.
- **IndexNow: 17 URLs, HTTP 200.** Key file verified reachable.
- **GSC Request Indexing: 11 URLs** (kitchen city pages → calculator → cost report → blogs). No
  quota warning. Remainder appended to `indexing-queue.txt`.
- Sitemap already registered and healthy (Success; shows 223 from its Aug 4 read — refreshes to 229
  on next read).

### A bug I introduced and caught
The first calculator build let the sqft slider produce estimates that contradicted the tier label
(600 sq ft on "Cosmetic/Basic" showed $69K–$126K against a published $25–50K band). Caught during
verification, fixed with per-tier clamps, and verified exhaustively: **153 sqft/tier combos, 0
failures, none below the $25,000 floor.** That was the second commit.

---

## Not done

- **Phase 2 AI share-of-voice (3 logged-out runs × 4 queries)** — the incognito browser session was
  declined mid-run. No logged-out data collected. Moved to the human-only monthly checklist. A
  partial run was not substituted, because noise is exactly what that protocol exists to prevent.
- **GBP** — the weekly kitchen post **was published and verified live** before you asked to skip
  GBP; say the word and I'll delete it. Review queue needed no action: all 7 HomeStar reviews
  already carry replies, no new ones, none under 4 stars. Nothing drafted, nothing to escalate.
  Discovery terms were captured before stopping (below).

---

## Data

**Totals** — 28 days: 121 clicks / 24.1K impr / 0.5% CTR / pos 17.0.
3 months: 360 / 82.7K / 0.4% / **16.4** (run #1: 335 / 76.8K / 16.7 — still climbing).

**90-day target tracking (Oct):**

| Target | July | Aug 5 | Status |
|---|---|---|---|
| Non-brand clicks → 75+ | 15 | ~3 (28d, named queries) | **OFF TRACK** |
| CTR-fix pages → 50+ clicks | 1 | 2 | **OFF TRACK** — cause now diagnosed |
| "bathroom remodeling near me" → top 5 | 10.3 | 10.8 | flat/slightly worse |
| basement remodeling fishers → hold page 1 | 8.7 | **6.2** | **IMPROVED** ✅ |
| not-indexed → <20 | 60 | 60 (stale data) | unmeasurable this run |
| Kitchen pages treated | — | ✅ | **DONE this run** |
| 3+ backlinks | 0 | 0 | human items untouched |

Note on non-brand clicks: July's "15" and today's "~3" are not the same measurement (window and
counting method differ), so treat the trend as directional, not a 5× collapse. What is solid: brand
queries dominate clicks, and non-brand pages are accumulating impressions at positions 10–25 without
converting them.

**Kitchen demand, pre-cluster baseline (the thing this run is meant to move):**
`/kitchen-remodeling-westfield-in` 421 impr @22.4 · `/kitchen-remodeling-carmel-in` 242 @19.5 ·
`/kitchen-remodeling` 75 @20.7 · `/guide/kitchen-remodeling-hamilton-county` 61 @22.6 ·
`/kitchen-remodeling-zionsville-in` 26 @12.0.
Queries: `kitchen remodeler` 72 @14.6 · `kitchen remodeling zionsville in` 72 @19.9 ·
`get free quote for kitchen remodel in westfield indiana` 44 @**4.6** · `kitchen remodeling` 37.

**GBP (captured before stopping):** 180 profile interactions Mar–Aug (Mar 24 · Apr 35 · May 26 ·
Jun 45 · **Jul 50**). 1,467 profile views. **78 reviews / 5.0** — note the site schema still says
`reviewCount: 62`, which is stale. Discovery terms top 5: `homestar` (20), `basement renovation in
camel indiana`, `bathroom near me`, `bathroom remodel fishers`, `best shower remodel 46037`.
**No kitchen term appears** — a clean pre-cluster baseline to measure against.

---

## Self-assessment

**Working:** the content engine. Clicks and impressions keep climbing quarter over quarter, basement
is consolidating on page 1 (6.2, improved from 8.7), and the Schluter/waterproofing article is a
genuine performer at 1,716 impressions.

**Not working:** click conversion. We rank on page 1–2 for a lot of terms and convert almost none of
it. The bathroom-cost pages turned out to be an audience-mismatch problem, not a copy problem — but
that diagnosis doesn't explain the *other* zero-CTR pages at positions 10–25, which are a genuine
snippet-quality problem still to solve.

**Tactic retired:** CTR-copywriting rewrites on the bathroom-cost pages. Two attempts, no movement.
The third attempt deliberately used a different mechanism (geographic disambiguation). If that also
fails at ~2026-09-05, the next move is not a fourth title — it is to accept those impressions as
unqualified and stop measuring the page by blended CTR.

**Structural risk:** every deep route serves the homepage `<title>` and no canonical pre-JS. That is
one root cause sitting underneath both the indexing problem and, plausibly, the CTR problem. The
per-route `<head>`-injection fix addresses both at once and is the highest-leverage engineering work
available right now.
