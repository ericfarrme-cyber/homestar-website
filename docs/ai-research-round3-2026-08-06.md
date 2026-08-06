# AI Research Round 3 — Reputation & Geographic Reach
_Logged-out ChatGPT, incognito, 2026-08-06._

---

## 🔴 FINDING 1 — Our AI visibility is essentially Fishers-only

| Query | HomeStar |
|---|---|
| best home remodeling contractor in **Fishers** Indiana | **appears** (#1–#3 depending on phrasing) ✅ |
| best home remodeling contractor in **Carmel** Indiana | **ABSENT** ❌ |
| best home remodeling contractor in **Westfield** Indiana | **ABSENT** ❌ |

Westfield is the striking one: our **flagship ~$150,000 basement project is physically in Westfield**, it has a full case study, it is on Houzz, and we still do not appear.

**Every firm returned for Carmel and Westfield has a physical presence in or adjacent to those cities.** Everything Home's entry even reads *"Showroom located in the Indiana Design Center"* — a Carmel address. ChatGPT's map pack is drawing on Google's local index, which ranks on proximity to the queried city. A Fishers address does not rank for a Carmel query.

**This explains the GSC anomaly we could not previously account for.** The nine `home-remodeling-{city}-in` pages pull **3,488 impressions and 4 clicks**. Google ranks the pages; AI never surfaces the business outside Fishers. Content was never the bottleneck — geography is.

### What this means strategically
- **The map-pack half of this is likely unwinnable without a physical presence.** No amount of content changes a business address. That is a business decision, not an SEO one, and I would not spend further content budget trying to force it.
- **The prose half is winnable.** ChatGPT often names businesses in the body beyond the map pack (it did for Nicholas Design Build, Form Building, Tracy Fisher Design). Those mentions come from reviews, Reddit, Houzz and directories — the corpus, not proximity.
- **Therefore: city-association has to come from the review corpus.** A review that says *"they remodeled our Carmel kitchen"* is the single most direct city signal we control. Our review requests should ask for the city by name.
- **Reset expectations on the city pages.** They are worth keeping for classic SEO, but they will not produce AI citations for cities where we have no physical footprint. Do not build more of them expecting AI visibility.

---

## 🟡 FINDING 2 — "New company" is being surfaced as a caution to every prospect who checks

Query: *"is HomeStar Services and Contracting in Fishers Indiana legit? any complaints?"*

**The good news is genuinely good:**
- ✅ "Legitimate local business"
- ✅ 5.0 from ~79 reviews
- ✅ BBB Accredited, **A- rating**
- ✅ **"I did not find a pattern of complaints"**
- ✅ It correctly distinguished us from same-named businesses in Georgia and Texas

**The vulnerability:** ChatGPT repeatedly flags newness, sourced from our BBB profile:
> *"it's also a very new company, so there isn't a long history to judge"*
> Business started: **November 2024** · BBB file opened: Oct 2025 · Accredited: Dec 2025
> *"⚠️ The company is relatively new, so there isn't a long track record spanning many years."*

It then recommends extra due diligence — references, insurance verification, avoiding large deposits.

**Why this matters more for us than for most:** the upper-middle/lower-upper buyer we are targeting is precisely the buyer who runs this check before calling. AI is pre-loading a trust objection into their research.

**We have no counter-evidence published.** Worse, Eric's bio currently reads *"a background in real estate and small business"* — which reinforces rather than answers the concern. Robb's says only *"Experienced in Residential Construction."*

### What can honestly counter it
We cannot change a founding date, and we must not invent experience. But three verifiable facts do real work and are underused:
1. **Volume and velocity.** ~79 five-star reviews and 100+ completed projects in under two years is a *stronger* signal than a 20-year-old firm with 12 reviews. Framed as throughput rather than tenure, newness becomes irrelevant.
2. **Third-party credentials that take time to earn:** BBB Accredited A-, Schluter Pro Certified, BAGI member.
3. **Prior trade experience of the founders — if it exists.** *This is a question for Eric.* If Robb or Eric has years in construction before founding HomeStar, publishing it directly answers ChatGPT's objection. If not, do not manufacture it; lean on volume instead.

**Data inconsistency found while checking:** Eric's author bio credentials say **"50+ Hamilton County Projects Completed"** while the homepage stat bar says **"100+ Projects Completed."** One of these is wrong and both are public. Worth correcting.

---

## FINDING 3 — Competitor attribute patterns worth noting

Everything Home has now appeared in **20 of 20 queries** across three research sessions. Their recurring attributes in ChatGPT's own words: *design-build*, *interior designers on staff*, *Best of Houzz*, *showroom in the Indiana Design Center*. Three of those four are things we could plausibly claim or acquire; the showroom is the one we cannot.

Chateau Kitchens' moat is almost purely **review volume (≈300)**. The HomeWright's is a **NARI Certified Remodeler** credential — a specific, nameable certification that ChatGPT repeats every time. That is a cheap, ownable trust token we do not have.

**Actionable:** NARI certification is a credential ChatGPT demonstrably quotes. Worth pricing out.

---

## Recommended next research (not yet run)
1. **Other engines** — Perplexity, Gemini, Copilot. We have only tested ChatGPT. Different retrieval, different sources; Copilot leans on Bing where our IndexNow submissions land fastest.
2. **Price-anchored queries** — "what can I get for a $150,000 remodel in Hamilton County" — tests whether the new published pricing is being picked up.
3. **Head-to-head** — "HomeStar vs MJ Woodstone" style comparisons.
4. **Re-run the core 4-query protocol in ~30 days** to measure everything shipped this week.

## Honest limits
One run per query this round — enough to establish presence/absence, which is binary and reliable, but not enough to rank-order. The Westfield query was served inside a ChatGPT A/B test ("you're giving feedback on a new version"), so that specific result may reflect a variant model.
