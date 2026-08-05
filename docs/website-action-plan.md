# HomeStar Website Action Plan
_Rewritten every orchestrator run from that run's data. Last: 2026-08-05 (Run #2)._

## EXECUTED THIS RUN

- **Kitchen Domination Cluster** — 4 city treatments (new Fishers + rewritten Carmel/Zionsville/
  Westfield), a cost pillar with 10 AI-citable FAQs, 4 blog posts, the 2026 Kitchen Cost Report
  guide, and `/tools/kitchen-cost-calculator`. *Data: kitchen pages already pull 421/242/75/61
  impressions at positions 19–22 with zero treatment; `get free quote for kitchen remodel in
  westfield indiana` sits at 4.6.*
- **Kitchen pricing sweep to Eric's authoritative tiers** — $25K minimum · $25–50K · $50–100K ·
  $100K+. Every stale sub-$25K figure removed sitewide, verified by script. *Why it matters beyond
  consistency: a published $25K floor qualifies leads, and a named $100K+ premium tier is the direct
  counter to NKM's "larger projects" and MJ Woodstone's "high-end custom" moats.*
- **Geographic disambiguation on both failed CTR pages** — "Indiana" now leads title and meta.
  *Data: 4,279 impressions at page-one position with 0 clicks, from `*bathroom remodel cost hamilton`
  queries that are almost certainly other Hamiltons (OH/TN/NJ). A third copy rewrite would have been
  the same failed tactic; this is a different mechanism.*
- **`signs-bathroom-needs-remodel`** — quickAnswer + 5 FAQs + bathroom resource links. *Data: 238
  impr @ pos 38.2. Prose was already deepened run #1, so only genuinely new elements were added.*
- **`schluter-vs-cement-board` → "Kerdi Board vs Cement Board"** + quickAnswer + 4 FAQs. *Data:
  `kerdi board vs cement board` 109 impr @12.9 — the page never used the word "Kerdi" in its title.*
- **`BlogPostPage` now supports `quickAnswer` + `faq` with FAQ schema** — reusable for every post.
- **Shipped:** 2 commits, deploy verified in the live JS bundle, sitemap 223→229, IndexNow 17 URLs
  (200), GSC reindex 11 URLs.

## THE BIGGEST FINDING OF THIS RUN (12-run logged-out ChatGPT protocol)

**Kitchen is 0/3, not #3.** HomeStar does not appear at all for kitchen queries in Fishers — no map
pack, no list, no summary, across three phrasings. July's "#3" came from a single run and was wrong.

**And more content will not fix it.** MJ Woodstone outranks us on kitchen with **21 reviews to our
79**. Every ChatGPT map-pack entry labels HomeStar *"Bathroom remodeler"* — we are never categorised
as a kitchen remodeler, so we are not retrieved for kitchen queries regardless of on-site content.
The Round 2 kitchen cluster was necessary but is not sufficient.

**Two levers that are now higher-priority than any further kitchen content:**
1. **GBP categories** — add Kitchen Remodeler + Basement Remodeling Service. *Needs Eric.*
2. **Houzz** — the most-cited source across all 12 runs. Everything Home beats us in every query and
   is cited through Houzz nearly every time.

Also: **our own site was never cited once in 12 runs.** For basement pricing ChatGPT quoted *Angi's*
$30–80K rather than our published $45K–$200K+, despite our cost report, calculator and four articles.
Third-party platforms are outranking our first-party content as AI citation sources.

Full detail, competitor table and verbatim quotes: `docs/ai-share-of-voice-log.md`.

## AUTONOMOUS QUEUE (next 1–2 runs — system executes)

1. **Judge the geo-disambiguation experiment ~2026-09-05.** Measure *clicks* and qualified-query
   impressions, not blended CTR — the junk "hamilton" impressions may never go away.
2. **Refresh the stale `aggregateRating` in schema** — site says `reviewCount: 62`, GBP now shows
   **78 reviews / 5.0**. Cheap credibility win, currently understating us by 16 reviews.
3. **Treat the remaining strike zone (pos 8–25, untreated):** `bathroom remodeling` 112 @10.6 ·
   `bathroom remodeling noblesville in` 111 @14.1 · `bathroom remodeling near me` 93 @10.8 ·
   `basement contractor fishers` 66 @10.4 · `home remodeling westfield in` 71 @12.0.
4. **Extend kitchen city content to the remaining 5 cities** (Noblesville, Geist, Fortville,
   McCordsville, Pendleton) — **deprioritised.** The 0/3 kitchen result shows the constraint is
   category association and third-party citation, not on-site kitchen coverage. Do the GBP category
   and Houzz work first and re-measure before writing more kitchen pages.
5. **Re-run the 3-run ChatGPT protocol monthly** (now automated). Watch specifically for HomeStar
   entering kitchen results at all, and for Building Concepts on basement.
6. **Crawled-not-indexed (18): treat thin pages, then resubmit only what changed.** Golden rule holds.

## DECISIONS MADE 2026-08-05 (all three resolved same day)

1. **Kitchen flagship project — Eric confirmed he HAS one.** ⏳ **Blocked on materials.** Needed:
   photos (before shots too), city/neighborhood + whether it can be named, scope (cabinets, counters,
   island, layout change, wall removal, flooring, lighting), timeline, whether an investment figure is
   publishable, design partner to credit, client quote. **Building this page is the #1 content
   priority of the next run** — the kitchen cluster currently has zero proof behind it.
2. **Per-route canonical fix — Eric said BUILD IT NOW.** ✅ Shipped and verified live the same day.
3. **Kitchen GBP post — Eric deleted it manually.** GBP weekly posting is **paused** until he says
   otherwise; do not auto-publish.

## WATCHING (experiments in flight, with judgment dates)

- **Geo-disambiguation on the two bathroom-cost pages** — judge **~2026-09-05**. If it fails, do NOT
  write a fourth title; reclassify those impressions as unqualified instead.
- **Per-route canonical injection (shipped 2026-08-05)** — **first check next run:** re-inspect
  `/kitchen-remodeling-zionsville-in` in GSC. It was the confirmed "Duplicate without user-selected
  canonical" page and now serves a static self-referencing canonical on first fetch. If it clears, the
  fix is proven end-to-end. Judge the overall not-indexed count **~2026-09-05** (a full re-crawl cycle),
  which supersedes the old 8/22 watch-only date.
- **Kitchen cluster** — judge position movement on kitchen city queries and `/kitchen-remodeling`
  next run. Pre-cluster baseline recorded in the run report and share-of-voice log.
- **Kitchen in GBP discovery terms** — currently **absent** from the top 5 (bathroom and basement
  both appear). A kitchen term entering that list is the cleanest signal the cluster is landing.
- **`signs-bathroom-needs-remodel`** — pos 38.2. If FAQ schema + quickAnswer doesn't move it, the
  problem is authority, not on-page, and it should stop consuming run time.

_Content exclusions respected: no handyman/home-repair, no concrete/patio/driveway, no Angi profile
work. `home repair` (157 impr @28.9) and the concrete queries (91/58/53) were surfaced by the data
and deliberately not acted on._
