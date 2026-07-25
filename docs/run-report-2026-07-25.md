# SEO Orchestrator Run Report — 2026-07-25 (Run #1)

Mode this run: **prepare-then-confirm** (Eric's choice). All in-repo work executed autonomously; all outward-facing/customer-visible actions staged below for Eric's go-ahead. Nothing was published or deployed.

---

## Phase 1 — Data (captured from GSC, 3-month window)

| Metric | Run 1 (2026-07-25) | Master-plan baseline | Move |
|---|---|---|---|
| Total clicks | **335** | ~112 | ▲ ~3× |
| Total impressions | **76.8K** | ~41.6K | ▲ ~85% |
| Avg CTR | 0.4% | ~0.27% blended | ▲ |
| Avg position | 16.7 | 16.6 | flat |
| Indexed / Not-indexed | **220 / 60** | 220 / 60 | flat |

- **Leading indicator:** GSC Recommendations flagged `/blog/bathroom-remodel-cost-hamilton-county` at **+243% impressions** — one of the two July CTR-fixed pages is being surfaced far more. Impressions are up; clicks are the thing to watch at the 30-day mark.
- Full 1,000-row per-query CSV was **not** archived this run (scaled browser made the export unreliable and it wasn't needed to decide/act — the master-plan strike-zone table already carries the query detail). Flagged for next run if an archived export is wanted.
- Indexing appended to `docs/indexing-health-log.txt` (220/60, unchanged vs the July 9 baseline).

## Phase 2 — Decisions (top 5, ranked)

1. **Kitchen city pages — Zionsville, Westfield, Carmel** (code) — unique Quick Answer + local body. `kitchen remodeling zionsville in` 232 imp, pos 19.8.
2. **Deepen `/blog/signs-bathroom-needs-remodel`** (code) — 613 proven impressions, ~pos 39.
3. **Reinforce Carmel bathroom + shower-installation** (code) — `carmel bathroom remodeling` 272 imp / `shower installation carmel` 154 imp.
4. **Indexing remediation** (code fix + held actions) — root cause found & fixed; see Phase 4.
5. **Verify CTR fixes** (watch) — bathroom-cost page +243% impr; judge CTR at 30 days.

**Real constraint surfaced (Eric flagged live):** kitchen has **zero project entries** in the codebase (2 blogs + 1 guide + 1 service page only). Every kitchen city page renders the same templated text with no project gallery — thin and near-duplicate across all 9 kitchen cities. The content added this run differentiates the 3 priority cities, but the true ceiling on kitchen ranking is **kitchen project photos/case studies** — an Eric item (see action plan).

## Phase 3 — Content executed (in `src/App.jsx`)

- **`CITY_SVC_CONTENT`**: added unique `kitchen-remodeling-Zionsville`, `kitchen-remodeling-Westfield`, `kitchen-remodeling-Carmel` (Quick Answer + 3 unique paragraphs each). Real neighborhoods (Holliday Farms/Promontory/Bradley Ridge; Chatham Hills/Bridgewater/Harmony/Centennial; Bridgewater Club/WestClay/Jackson's Grant/Springmill). Pricing anchored to the repo's existing kitchen cost tiers ($10–20k / $25–50k / $50–80k+) — no invented numbers.
- **`signs-bathroom-needs-remodel` blog**: rewritten from a thin 5-min listicle to an 8-min, snippet-friendly article — 7 signs with urgency framing (which fixes can't wait), grounded cost context (repo's $15–50k bathroom range only), Schluter/licensed differentiators, local cities. Title → "7 Signs Your Bathroom Needs a Remodel (and Which Ones Can't Wait)"; excerpt rewritten for CTR.
- **`bathroom-remodeling-Carmel`**: added a 4th body paragraph dedicated to **shower installation in Carmel** (Kerdi shower system, curbless/walk-in, frameless glass) targeting `shower installation carmel`.
- **Syntax check:** passed (esbuild JSX parse — @babel/parser not installed in repo; esbuild is Vite's parser and equivalent).
- **Sitemap:** no new URLs created (all pages already routed & in `sitemap.xml`) — no change needed.

## Phase 4 — Indexing remediation (ROOT CAUSE FOUND + FIXED)

The 32 "Alternate page with proper canonical" failures were **not fully fixed** by the prior deploy. `index.html` still hardcoded `<link rel="canonical" href="https://www.thehomestarservice.com/">` on **every** route. `useCanonical()` corrects it after JS runs, but the static homepage canonical is inherited by every SPA route pre-render — which is exactly why Google treated ~32 pages as duplicates of the homepage. **Fix applied:** removed the static homepage canonical from `index.html` (with a comment so it isn't re-added); `useCanonical()` now owns the per-route canonical. Worst case a page has no canonical pre-render and Google self-canonicalizes to the correct URL — strictly better than declaring the homepage.

**Held for Eric (post-deploy, outward):** after this ships, re-run "Validate Fix" on the 32-page canonical group in GSC and Request Indexing on verified pages. Crawled-not-indexed (18): treat thin pages first. Golden rule respected — nothing resubmitted unchanged.

## Phase 5 — Deploy pipeline (COMMITTED; PUSH PENDING via GitHub Desktop)

Eric approved "do all." Commit `154fa54` created locally with the content + canonical fix; a second commit records the published reviews/GBP + these doc updates. **The CLI push hung (no push auth) — Eric pushes via GitHub Desktop.** Once pushed & Vercel deploys: IndexNow POST the changed URLs + GSC Request Indexing on the changed URLs (rest to `indexing-queue.txt`), then Validate Fix the canonical group. **These are HELD until the deploy is live** (they only help post-crawl) — I'll run them once Eric confirms the push.

## Phase 6 — GBP + reviews (PUBLISHED ✅)

- **9 new reviews, all 5★** — all 9 replies **published** to the Business Profile (Unreplied queue now empty). Brief/warm/never-guess formula, rotated openings, service/city woven only when certain. Full text in `docs/review-response-log.md`. None were negative, so none needed Eric's personal handling.
- **GBP post published** ✅ — "Three Bathrooms, One Stunning Transformation — Geist" (Update + Learn more → /projects/three-bathroom-remodel-geist). Text-only; Eric can add a `geist-three-bath` photo. Correctly skipped cross-posting to the unrelated "Hamilton County Concrete and Patios" profile. Verified: marble-bathroom July post is live.

## Phase 7 — Self-assessment

- **Working:** clicks ~3×, impressions ~+85%, and the #1 CTR-fixed page is being surfaced +243%. The content engine + CTR-title formula are paying off.
- **Not working / stuck:** not-indexed flat at 60 for 16 days — now explained (canonical fix was incomplete; addressed this run). Kitchen remains proof-thin (no projects).
- **Changed approach:** for the canonical issue, stopped trusting the JS-only fix and fixed the static HTML root cause instead — do not just re-request these pages again without the code change live (that was the failed tactic).

Next run: judge CTR on the two fixed pages (30-day), re-validate canonical group post-deploy, and push Eric on kitchen photos + review-request velocity.
