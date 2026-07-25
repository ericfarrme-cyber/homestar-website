# HomeStar SEO Master Plan — July 2026
### Built from your full GSC export (1,000 queries, 216 pages) + GBP performance data

---

## THE ONE NUMBER THAT EXPLAINS EVERYTHING

**Non-brand searches: 40,001 impressions → 15 clicks (0.04% CTR).**
**Brand searches: 1,629 impressions → 97 clicks (6% CTR).**

Google is showing you to 40,000 strangers and you're capturing almost none of them. Your visibility problem is largely SOLVED (216 pages getting impressions, indexed pages up from 83 → 220 since April). Your **capture** problem is the whole game now. Every plan item below attacks capture.

---

## FINDING 1 — The CTR Catastrophe (FIXED TODAY, watch it)

Your two best-ranking pages were getting page-1 visibility and ZERO clicks:

| Page | Impressions | Position | Clicks | CTR |
|---|---|---|---|---|
| /blog/bathroom-remodel-cost-hamilton-county | **7,623** | 8.7 | 1 | 0.01% |
| /guide/bathroom-remodeling-hamilton-county | **2,649** | 10.2 | 0 | 0.00% |

Position 8-10 should earn 2-4% CTR = **200-380 clicks** from these two pages alone. You got 1.

**Why:** (a) generic titles that don't compel a click vs. competitors, and (b) AI Overviews now answer "cost" questions directly on the results page (zero-click searches) — partially outside our control, but a sharper title still wins the clicks that DO happen.

**What I did today:** rewrote both titles/metas with 2026 + real prices + local specificity:
- "Bathroom Remodel Cost in Hamilton County (2026): Real Prices From a Fishers Contractor"
- "Bathroom Remodeling in Hamilton County: 2026 Costs, Timeline & Contractor Guide"

**Your action:** deploy, request re-indexing on both URLs, and watch CTR in 3-4 weeks. If CTR jumps, we roll this title formula across every high-impression page.

---

## FINDING 2 — The Strike-Zone Keywords (your next 90 days of ranking wins)

Non-brand keywords at position 8-25 with real volume — one push from page-1 money:

| Keyword | Impr | Pos | Play |
|---|---|---|---|
| **bathroom remodeling near me** | 478 | **10.3** | GBP + reviews (Map Pack keyword) |
| bathroom remodeling fishers in | 353 | 23.7 | Fresh unique content live — reindex + wait |
| bathroom remodeling noblesville in | 302 | 16.4 | Same treatment as Fishers page (done) |
| concrete patio installation fishers | 324 | **9.3** | Hidden gem — see Finding 4 |
| carmel home remodeler | 244 | 18.4 | Carmel city page (treated — maturing) |
| kitchen remodeling zionsville in | 232 | 19.8 | Needs the unique-content treatment |
| basement remodel carmel | 206 | 17.4 | Basement-Carmel treated — maturing |
| **basement remodeling fishers in** | 190 | **8.7** | ALREADY PAGE 1 — push to top 3 |
| home remodeling westfield in | 141 | 12.8 | Treated — closest city page to page 1 |

**Priority actions:**
1. Kitchen city pages (Zionsville, Westfield, Carmel) need the unique-content treatment next — kitchen is your most untreated service with real demand.
2. "signs you need bathroom remodel" (351+169+93 = **613 impressions** across variants, pos ~39) — your existing signs-bathroom-needs-remodel blog is weak. Rewrite/deepen it; it has proven demand.
3. "shower installation carmel" (154, pos 26.6) + "carmel bathroom remodeling" (272, pos 26.6) — the Carmel bathroom page needs to get stronger still; consider a dedicated shower-installation content section.

---

## FINDING 3 — Desktop Impressions Are Inflated; Mobile Is Your Truth

| Device | Clicks | Impressions | CTR |
|---|---|---|---|
| Mobile | 189 | 17,718 | **1.07%** |
| Desktop | 112 | 53,388 | 0.21% |

Desktop shows 3x the impressions at 1/5th the CTR. A large share of desktop "impressions" is rank-tracker bots and scrapers, not humans. **Read mobile as your real performance** — and mobile CTR of ~1.1% at avg position 16.6 is actually normal-healthy. Your real human funnel is better than the blended numbers suggest.

---

## FINDING 4 — Hidden Gems & Junk in the Query Data

**Gems (demand you didn't know you had):**
- "best shower remodel 46037" appearing in GBP discovery — zip-code-level shower searches. Reinforces shower-focused content.
- ~~Concrete/patio content~~ and ~~home repair / handyman content~~: **DECLINED by Eric (July 2026) — do not build.** The demand exists in the data ("concrete patio installation fishers" 324 imp pos 9.3; "home repair" cluster 780+ imp), but these are outside the current business focus. Autonomous runs must NOT create content for these topics. Revisit only if Eric changes this decision in the state file.

**Junk (ignore, don't chase):**
- "lvp vs hardwood flooring for denver homes", "munster kitchen remodeling", franchise-opportunity queries — irrelevant geography/intent noise from blog content. Harmless.

---

## FINDING 5 — Indexing Health & Remediation Program (standing task)

- Indexed pages: **83 (April) → 220 (now).** Excellent trajectory — the indexing engine works. But **60 pages remain not indexed**, broken down by GSC as: 32 "Alternate page with proper canonical" (validation FAILED), 18 "Crawled - not indexed," 7 "Page with redirect," 2 "noindex," 1 "Discovered - not indexed."

**This is now a standing remediation program, not a one-time check. Every month:**

1. **Export the not-indexed URL lists.** GSC → Indexing → Pages → click each exclusion reason → EXPORT. This produces the exact URL list per reason.
2. **Triage each URL by reason:**
   - **"Alternate page with proper canonical" (32, validation FAILED):** Pages where Google saw the wrong canonical (the old SPA race-condition bug). The code fix is deployed; for each URL, run URL Inspection → confirm the "User-declared canonical" now matches the URL itself → Request Indexing. If a page still declares the homepage as canonical, the fix isn't reaching that route — flag it for code review. Re-run VALIDATE FIX on the whole group after spot-checking 3-5 URLs.
   - **"Crawled - currently not indexed" (18):** Google saw the page and passed. Usually thin/templated content on a young domain. Fix = strengthen the page (Quick Answer + unique content treatment) and re-request indexing. Any URL in this bucket 60+ days with zero impressions gets prioritized for content treatment or considered for consolidation.
   - **"Page with redirect" (7):** Expected for http→https and non-www→www variants. Verify each 301s to the canonical URL and ignore — these should NOT be "fixed."
   - **"Excluded by noindex" (2):** Verify intentional. If either is a real content page, the noindex tag is a bug — remove immediately.
   - **"Discovered - not indexed" (1):** Crawl-queue backlog; resolves on its own. Request indexing to accelerate.
3. **Track the trend.** The number that matters: not-indexed count month over month (60 today). Target: **under 20 within 90 days**, with the remainder being intentional redirects/noindex only.
4. **Golden rule:** never mass-resubmit unchanged pages. Fix the underlying issue (canonical, content depth) FIRST, then request indexing — resubmitting an unchanged rejected page does nothing.

---

## FINDING 6 — GBP Is Quietly Working (and where the near-me money is confirmed)

6-month GBP: **1,530 profile views, 192 interactions, 168 website clicks, 24 calls.** June was your best month ever (~40 clicks) — trending up.

Discovery searches prove the thesis: "bathroom near me," "bathroom remodel fishers," "best shower remodel 46037," "basement renovation in carmel" — **your GBP is surfacing for non-brand money searches.** But "homestar" is still the #1 term, and 24 calls in 6 months (~4/month) is the number that must grow 10x.

The math to internalize: GBP converts at ~11% (168 clicks + 24 calls from 1,530 views). **Every point of Map Pack ranking = more views = proportional calls.** Reviews remain the #1 lever. Nothing else on this plan compounds like review velocity.

---

## THE 90-DAY EXECUTION PLAN

### Weeks 1-2 (deploy + fix)
- [ ] Deploy today's title/meta CTR fixes → re-index both URLs
- [ ] Re-run "Validate Fix" on the 32-page canonical issue in GSC
- [ ] Start the review system (8-12/month) — from the near-me playbook
- [ ] IndexNow + GSC re-index the marble bathroom project + treated city pages (if not done)

### Weeks 3-6 (content strike zone)
- [ ] I treat the kitchen city pages (Zionsville, Westfield, Carmel) with unique content
- [ ] I rewrite/deepen the "signs you need a bathroom remodel" blog (613 proven impressions)
- [ ] Decide: concrete/patio page? home repair page? (proven demand — your call on business fit)
- [ ] Weekly GBP posts continue (marble bathroom post is ready)

### Weeks 7-12 (authority + measure)
- [x] ~~BBB accreditation~~ — DONE July 2026: profile live, dynamic seal on site, in schema sameAs
- [x] ~~Angi listing~~ — DONE July 2026: profile live (5.0, 5 reviews), badge on site, in schema sameAs. **Profile fixes still pending (human):** warranties FAQ says "No" (must be Yes — 1-yr workmanship + 25-yr Schluter), services list missing kitchen/flooring/painting/decks/insurance, thin description, website URL should be https://www
- [x] ~~BAGI membership~~ — DONE July 2026: directory listing live, badge on site, in schema sameAs + memberOf
- [ ] Dovetail backlink (highest-value single link available to you)
- [ ] Schluter contractor locator listing + OneZone chamber
- [ ] Monthly data drop to me (same GSC export + GBP screenshots) → I measure CTR-fix impact, strike-zone movement, and re-prioritize

### The measuring stick (what "winning" looks like by October)
- Non-brand clicks: 15 → **75+** (5x)
- The two CTR-fixed pages: 1 click → **50+ combined**
- "bathroom remodeling near me": position 10.3 → **top 5** + Map Pack appearances
- GBP calls: 4/month → **10+/month**
- 3+ new quality backlinks

---

## THE HONEST $100M FRAME

The website is now a genuine asset — 220 indexed pages, page-1 rankings emerging, the content engine built. What this data says is that the next $1M of revenue doesn't come from more pages. It comes from: **(1) capturing the 40K impressions you already earn** (CTR fixes — started today), **(2) the Map Pack** (reviews — only you can do this), and **(3) authority** (backlinks — Dovetail first). Send me this same export monthly and I'll keep the plan honest and data-driven.
