# Autopilot State — HomeStar SEO
Last run: 2026-07-25 (Run #1 — prepare-then-confirm mode)

## What run #1 did
- Captured GSC data: 335 clicks / 76.8K impr / 0.4% CTR / pos 16.7 (3-mo). Clicks ~3× the master-plan baseline. Indexing flat at 220/60.
- Content (in `src/App.jsx`): added unique kitchen city content for Zionsville/Westfield/Carmel; deepened `signs-bathroom-needs-remodel` blog (5→8 min, 7 signs); added a Carmel shower-installation paragraph.
- **Indexing root cause fixed:** removed the hardcoded homepage `<link rel="canonical">` from `index.html` that made every SPA route look like a duplicate of the homepage (the real driver of the 32 canonical failures).
- Read all 9 new GBP reviews (all 5★) and drafted replies; drafted next GBP post. **Nothing published/deployed** — staged for Eric.

## Current priorities (next run)
1. **Judge the CTR title fixes** on `/blog/bathroom-remodel-cost-hamilton-county` (+243% impr) and `/guide/bathroom-remodeling-hamilton-county` — need 30-day CTR. If a fixed title is still <0.3% on page 1, re-angle it.
2. **Re-validate the canonical group** in GSC once the `index.html` fix is live (Validate Fix on the 32; Request Indexing on verified). Target not-indexed <20 by October.
3. **Kitchen proof** — pages are now differentiated but have no project gallery. Needs Eric's kitchen photos/case studies to actually rank.
4. Treat crawled-not-indexed (18) thin pages next.

## Content exclusions (Eric's decisions — do not build)
- Home repair / handyman content — declined July 2026
- Concrete / patio / driveway content — declined July 2026

## Open issues (with owner)
- **[code — FIXED this run, verify post-deploy]** static homepage canonical removed from index.html; confirm live pages now self-canonicalize correctly.
- **[Google-time]** canonical re-validation + reindex only meaningful after deploy + re-crawl.
- **[human/Eric]** kitchen has zero project entries — biggest limiter on kitchen city pages.
- GBP post cadence: keep weekly.

## Citations & badges — COMPLETED (do not re-recommend)
- BBB accredited: seal on site (trust bar + footer), profile in schema sameAs
- Angi: badge on site, profile in schema sameAs
- BAGI member: badge on site, in schema sameAs + memberOf
- Badge assets required in public/images/: angi-badge.png, bagi-badge.png (verify present on deploys)

## Human-only items (surface every run until Eric marks done)
- [ ] **KITCHEN PROJECT PHOTOS/CASE STUDIES** — new top item: supply real kitchen job photos so kitchen city pages have proof and can compete (currently 0 kitchen projects in the codebase).
- [ ] ANGI PROFILE FIXES: warranties = YES (1-yr workmanship + 25-yr Schluter), add all services (kitchen, flooring, painting, decks, insurance restoration), richer description w/ Schluter + cities, website URL to https://www.thehomestarservice.com
- [ ] Review-request texting system live (8–12/month target) — 9 new reviews came in this cycle; velocity is good, keep it going.
- [ ] Dovetail reciprocal backlink
- [ ] Schluter contractor locator listing
- [ ] OneZone chamber membership/link
- [ ] Westfield long-form YouTube walkthrough (note: a Geist 3-bathroom testimonial video already exists on the channel)

## History
- **2026-07-25 (Run #1):** first real run. Clicks ~3× baseline. Fixed canonical root cause in index.html. Kitchen/blog/Carmel content shipped to repo (staged for deploy). 9 five-star reviews drafted. See `run-report-2026-07-25.md`.
