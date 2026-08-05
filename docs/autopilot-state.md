# Autopilot State — HomeStar SEO
Last run: 2026-07-25 (Run #1 — prepare-then-confirm mode)

## What run #1 did
- Captured GSC data: 335 clicks / 76.8K impr / 0.4% CTR / pos 16.7 (3-mo). Clicks ~3× the master-plan baseline. Indexing flat at 220/60.
- Content (in `src/App.jsx`): added unique kitchen city content for Zionsville/Westfield/Carmel; deepened `signs-bathroom-needs-remodel` blog (5→8 min, 7 signs); added a Carmel shower-installation paragraph.
- **Indexing root cause fixed:** removed the hardcoded homepage `<link rel="canonical">` from `index.html` that made every SPA route look like a duplicate of the homepage (the real driver of the 32 canonical failures).
- Read all 9 new GBP reviews (all 5★), **published** all 9 replies + **published** the Geist 3-bathroom GBP post.
- **DEPLOYED** (Eric pushed via GitHub Desktop, verified live): content + canonical fix are live. **IndexNow** POSTed 6 changed URLs (200). **GSC Request Indexing** done on 5 priority pages (kitchen Zionsville/Westfield/Carmel, signs blog, Carmel bathroom).
- Confirmed the canonical bug on a REAL page: URL Inspection showed `/kitchen-remodeling-carmel-in` "crawled – not indexed" with User-declared canonical = the homepage (pre-fix crawl). Validates the index.html fix.

## Current priorities (next run)
1. **Judge the CTR title fixes** on `/blog/bathroom-remodel-cost-hamilton-county` (+243% impr) and `/guide/bathroom-remodeling-hamilton-county` — need 30-day CTR. If a fixed title is still <0.3% on page 1, re-angle it.
2. **Re-check the canonical group** in GSC (fix is LIVE; IndexNow + 5 reindex requests already fired this run). Target not-indexed <20 by October. **Decision (Eric, 2026-07-25): WATCH 2–4 weeks (judge ~2026-08-22).** NOTE: the 32-page group is mostly legacy URLs (`/portfolio-items/...`, `/remodeling-*-proper-in`) that hit the SPA homepage fallback, so some may legitimately stay excluded — don't expect the full 32 to clear. The fix mainly rescues REAL pages like kitchen-carmel. GSC didn't expose a "Validate Fix" button this run; retry it next run. If real pages still don't clear, do the lighter per-route `<head>`-injection build fix — NOT full puppeteer prerender.
3. **Kitchen proof** — pages are now differentiated but have no project gallery. Needs Eric's kitchen photos/case studies to actually rank.
4. Treat crawled-not-indexed (18) thin pages next.

## Content exclusions (Eric's decisions — do not build)
- Home repair / handyman content — declined July 2026
- Concrete / patio / driveway content — declined July 2026
- **Angi profile work — declined July 2026 (standing).** Keep the Angi badge + schema `sameAs` citation exactly as-is. Never recommend or perform Angi profile refinement. Removed from the human-only list 2026-08-05; do not re-add.

## KITCHEN PRICING — Eric's numbers, 2026-08-05 (AUTHORITATIVE, execute next run)
**Minimum kitchen project is $25,000.** Official tiers, direct from Eric:
| Tier | Range |
|---|---|
| Cosmetic / Basic | **$25,000 – $50,000** |
| Mid-Range / Full | **$50,000 – $100,000** |
| Premium Full | **$100,000+** |

Headline band for quickAnswer/AI-citable copy: **"Kitchen remodeling in Hamilton County starts at $25,000 and typically runs $50,000–$100,000 for a full remodel, with premium custom kitchens $100,000+."**

These supersede all previously published kitchen figures. **Sites-wide sweep required — every sub-$25K kitchen figure must go:**
1. `SERVICE_PAGES["kitchen-remodeling"].costs` — 3 tiers (~App.jsx:2748–2750): $10–20K / $25–50K / $50–80K+ → replace with the table above.
2. **`CostCalculator` kitchen matrix (~App.jsx:4444)** — `basic:{s:[8000,14000],m:[12000,18000],l:[15000,22000]}` is entirely below the $25K floor; `mid` starts at $22,000. Rebuild all three scope tiers inside the new bands.
3. `CITY_SVC_CONTENT` quick answers for **kitchen-remodeling-Carmel / -Westfield / -Zionsville** (shipped run #1) — all say "cosmetic refreshes starting around $10,000" and "$50,000 to $80,000+". Rewrite to the new tiers.
4. `GUIDES["kitchen-remodeling-hamilton-county"]` — contains $10,000.
5. Carmel city page FAQ (~App.jsx:1881) — "Minor updates start around $15,000... can reach $75,000+".

Neighborhood FAQ kitchen figures are all already ≥$25K (Thorpe Creek $25–55K, Admirals Pointe $30–60K, Holliday Farms $40–80K+) — no violation, but consider raising the ultra-tier hoods (Holliday Farms, Promontory) into the $100K+ premium band.

**Why this matters beyond consistency:** a published $25K floor is a lead-qualification signal, and a named $100K+ premium tier is the direct counter to NKM's "larger projects" and MJ Woodstone's "high-end custom" moats in ChatGPT results (see `ai-share-of-voice-log.md`). The old $10K cosmetic tier argued the opposite case for us.

## Tooling (browser automation — added 2026-08-05)
Run #2 opened with **no browser tool available** (`mcpServers` was empty), which blocks GSC, GBP, and ChatGPT phases. Two MCP servers are now registered at **user scope** in `~/.claude.json`:
- **`playwright`** — `npx -y @playwright/mcp@latest`. Uses installed Google Chrome with a **persistent profile** (`%LOCALAPPDATA%\ms-playwright\mcp-chrome-profile`). Google logins persist across runs — log in once. Use for GSC, GBP, Bing Webmaster Tools.
- **`playwright-incognito`** — same, plus `--isolated` (fresh context each run, no cookies). **Use this one for the Phase 2 logged-out ChatGPT share-of-voice protocol** — the persistent profile would otherwise contaminate "logged-out" runs.

MCP servers load at session start, so a config change requires restarting Claude Code before the tools appear.

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
- [ ] Review-request texting system live (8–12/month target) — 9 new reviews came in this cycle; velocity is good, keep it going.
- [ ] Dovetail reciprocal backlink
- [ ] Schluter contractor locator listing
- [ ] OneZone chamber membership/link
- [ ] Westfield long-form YouTube walkthrough (note: a Geist 3-bathroom testimonial video already exists on the channel)

## History
- **2026-07-25 (Run #1):** first real run. Clicks ~3× baseline. Fixed canonical root cause in index.html. Kitchen/blog/Carmel content shipped to repo (staged for deploy). 9 five-star reviews drafted. See `run-report-2026-07-25.md`.
