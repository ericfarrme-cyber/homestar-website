# HomeStar Website Action Plan
_Rewritten every orchestrator run from that run's data. Last: 2026-07-25 (Run #1)._

## EXECUTED THIS RUN
- **Kitchen city content (Zionsville, Westfield, Carmel)** — unique Quick Answer + local body added to differentiate the 3 priority kitchen pages from the 6 other templated kitchen-city pages. *Data: `kitchen remodeling zionsville in` 232 imp @ pos 19.8; kitchen is the most-untreated service with demand.*
- **`signs-bathroom-needs-remodel` deepened** — 5→8 min, 7 signs w/ urgency + grounded cost framing. *Data: 613 impressions across variants @ ~pos 39, previously a thin listicle.*
- **Carmel shower-installation section** — added to the Carmel bathroom page. *Data: `shower installation carmel` 154 imp + `carmel bathroom remodeling` 272 imp, both ~pos 26.*
- **Canonical root-cause fix** — removed the hardcoded homepage `<link rel="canonical">` from `index.html`. *Data: 32 "Alternate page with proper canonical" failures, flat for 16 days; prior JS-only fix was incomplete.*

## AUTONOMOUS QUEUE (next 1–2 runs — system executes)
1. **Re-validate canonical group + reindex** once the index.html fix is live. *32 pages; expect not-indexed to fall toward the <20 October target.* (Google-time after deploy.)
2. **Treat crawled-not-indexed thin pages (18)** — Quick Answer + unique content, then reindex the treated pages only.
3. **Kitchen city content for remaining cities** (Fishers, Noblesville, Geist, Fortville, McCordsville, Pendleton) — extend the unique-content treatment so all 9 kitchen pages are differentiated, reducing near-duplicate risk. Lower priority until kitchen has project proof.
4. **Roll the CTR title formula wider** — if the two fixed pages show CTR lift at 30 days, apply the year + real-price + local formula to the next tier of high-impression/low-CTR pages.

## NEEDS ERIC'S DECISION
- **Kitchen project photos/case studies — yes/no?** *For:* kitchen city pages have no gallery/proof and can't compete on trust; this is the single biggest limiter on kitchen ranking. *Against:* time to gather photos + write-ups. **Ask: can you send 1–3 completed kitchen jobs (photos + a few details) so we can build real kitchen project pages?**
- **GBP post cadence / next projects** — confirm the marble-bathroom July post is live; approve the drafted Geist 3-bathroom post (below in chat).
- **Deploy + reindex + review replies** — approve this run's staged outward actions (see chat).

## WATCHING (experiments in flight, with judge date)
- **CTR title fixes** on `/blog/bathroom-remodel-cost-hamilton-county` (+243% impr) & `/guide/bathroom-remodeling-hamilton-county` — judge CTR ~**2026-08-25** (30-day). Re-angle any title still <0.3% on page 1.
- **Canonical fix** — judge not-indexed count after next crawl/validation (~2–4 weeks post-deploy).
- **Kitchen Zionsville/Westfield/Carmel content** — judge position movement on kitchen-city queries next run.
- **Carmel shower-installation** — judge `shower installation carmel` position next run.

_Content exclusions respected: no handyman/home-repair, no concrete/patio/driveway. Nothing declined has been queued._
