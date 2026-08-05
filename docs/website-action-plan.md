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

## AUTONOMOUS QUEUE (next 1–2 runs — system executes)

1. **Judge the geo-disambiguation experiment ~2026-09-05.** Measure *clicks* and qualified-query
   impressions, not blended CTR — the junk "hamilton" impressions may never go away.
2. **Refresh the stale `aggregateRating` in schema** — site says `reviewCount: 62`, GBP now shows
   **78 reviews / 5.0**. Cheap credibility win, currently understating us by 16 reviews.
3. **Treat the remaining strike zone (pos 8–25, untreated):** `bathroom remodeling` 112 @10.6 ·
   `bathroom remodeling noblesville in` 111 @14.1 · `bathroom remodeling near me` 93 @10.8 ·
   `basement contractor fishers` 66 @10.4 · `home remodeling westfield in` 71 @12.0.
4. **Extend kitchen city content to the remaining 5 cities** (Noblesville, Geist, Fortville,
   McCordsville, Pendleton) once the first four show movement.
5. **Crawled-not-indexed (18): treat thin pages, then resubmit only what changed.** Golden rule holds.

## NEEDS ERIC'S DECISION (yes/no)

1. **Do you have a completed kitchen project — photos + story — I can build into a flagship case
   study?** *This is the single biggest missing piece of the kitchen cluster.* There are 0 kitchen
   entries in `PROJECTS` (vs 12 bathroom, 3 basement), so every kitchen city page ships with zero
   proof while the bathroom pages have galleries. I did not invent one. **Y/N** — and if yes, is
   there an investment figure you're willing to publish?
2. **Pull the per-route `<head>`-injection canonical fix forward now, or hold to the 8/22 judgment
   date?** New evidence: `/kitchen-remodeling-carmel-in` is now indexed ✅ but
   `/kitchen-remodeling-zionsville-in` reads "Duplicate without user-selected canonical / User-declared
   canonical: None". Every deep route still serves the **homepage title** and no canonical pre-JS.
   **Y/N.**
3. **Delete the kitchen GBP post?** It was published and verified live before you asked to skip GBP.
   **Y/N.**

## WATCHING (experiments in flight, with judgment dates)

- **Geo-disambiguation on the two bathroom-cost pages** — judge **~2026-09-05**. If it fails, do NOT
  write a fourth title; reclassify those impressions as unqualified instead.
- **Canonical fix** — judge **~2026-08-22** per your standing decision. Aggregate 220/60 is stale
  (GSC last updated 7/23, pre-deploy) and will stay uninformative until Google re-crawls.
- **Kitchen cluster** — judge position movement on kitchen city queries and `/kitchen-remodeling`
  next run. Pre-cluster baseline recorded in the run report and share-of-voice log.
- **Kitchen in GBP discovery terms** — currently **absent** from the top 5 (bathroom and basement
  both appear). A kitchen term entering that list is the cleanest signal the cluster is landing.
- **`signs-bathroom-needs-remodel`** — pos 38.2. If FAQ schema + quickAnswer doesn't move it, the
  problem is authority, not on-page, and it should stop consuming run time.

_Content exclusions respected: no handyman/home-repair, no concrete/patio/driveway, no Angi profile
work. `home repair` (157 impr @28.9) and the concrete queries (91/58/53) were surfaced by the data
and deliberately not acted on._
