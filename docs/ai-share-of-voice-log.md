# AI SHARE-OF-VOICE LOG — HomeStar Services & Contracting
### Protocol: 3 logged-out ChatGPT runs per query. Log appearances/3, average position, competitors named, verbatim quotes of our content. A single missed run = noise; a single great run = also noise. Place in docs/.

## Scoring
- **Share of voice** = appearances / 3 runs
- **Avg position** = mean rank across runs where we appear
- **Moat evidence** = any sentence where ChatGPT quotes or paraphrases OUR site/review content

## How to run it (solved 2026-08-05 — automation works)
Logged-out ChatGPT accepts a prefilled query by URL: `https://chatgpt.com/?q=<url-encoded question>`
— it auto-submits, so no login and no typing. Use the `playwright-incognito` MCP server so the
persistent Google profile can't contaminate a "logged-out" run. Vary phrasing slightly across the 3
runs of a query; that's the point, it tests robustness rather than one exact string.
**This is no longer a human-only task.**

---

# ✅ 2026-08-05 — FULL 3-RUN PROTOCOL (12 logged-out runs, incognito, desktop)

| Query | Appeared | Avg pos | Leader | Notes |
|---|---|---|---|---|
| Overall remodeler, Fishers | **3/3** | **~1.0** | **HomeStar** | #1 in all three runs |
| Bathroom remodeler, Fishers | **3/3** | ~2.3 | mixed | #1, #5, #1 — named "Best overall" in 2 of 3 |
| Basement finishing, Fishers | **3/3** | ~5.7 | Building Concepts | honorable-mention/8th, #4, #5 |
| **Kitchen remodeler, Fishers** | **0/3** | **—** | MJ Woodstone / Chateau | **Absent entirely — no map pack, no list, no summary** |

## Headline: kitchen is 0/3, not #3

July's baseline said kitchen "#3". Under a real 3-run logged-out protocol HomeStar does not appear
**at all**, across three different phrasings. Materially worse than the single-run baseline implied —
and the strongest possible justification for the Round 2 kitchen cluster.

**But content alone will not close it:**

| Competitor | Reviews | ChatGPT's attributed moat |
|---|---|---|
| Chateau Kitchens (Carmel) | **295** | "largest and most established kitchen specialist", "custom cabinetry" |
| Everything Home (Carmel) | 68 | "design-build", "Best of Houzz awards, 100+ five-star Houzz reviews" |
| MJ Woodstone (Fishers) | 21 | "craftsmanship", "down-to-the-studs remodels", "boutique, hands-on" |
| The HomeWright (Carmel) | 39 | "project management, communication, staying on schedule" |
| Indy Renovation (Fishers) | 23 | "quality workmanship, tile work, responsiveness" |
| **HomeStar** | **79** | — (absent from kitchen entirely) |

MJ Woodstone outranks us on kitchen with **21 reviews against our 79**. Review *volume* is not the
blocker — **category and corpus association** is. Every map-pack entry labels HomeStar *"Bathroom
remodeler"*, because that is our GBP **primary** category.

**Important correction (Eric, 2026-08-05):** Kitchen and Basement are **already secondary GBP
categories**. The categories aren't missing. And the primary is **not** changing — bathroom produces
~8 leads/week and sits 3/3 at avg 2.3 here; trading that for a speculative kitchen gain is a bad trade
that can't be A/B tested. So the category lever is already at its safe maximum, and kitchen has to be
won on the other three inputs: **review language that names the room, Houzz presence, and project
proof** (we have zero kitchen projects anywhere).

## Three competitors we were not tracking
1. **Everything Home** (Carmel, 4.9, 68) — appeared in **every query, all 12 runs**, repeatedly given
   "best design-build" / "best overall". Cited via **Houzz** nearly every time.
2. **Chateau Kitchens** — 295 reviews, the kitchen category leader.
3. **Building Concepts** (Noblesville) — #1 for basement in 3/3. Nicholas Design Build, our assumed
   basement rival, barely appears; Building Concepts has effectively replaced it.

Also newly observed: Indy Renovation, Baths By Bee (93 reviews), Rabin Restoration (100+), Absolute
Renovations, Majestic Construction, Preferred Custom Remodeling, MJ Brown Renovations, Arete General
Contracting, Worthington Design & Remodeling, Benjamin Design Build. The real competitive set is far
larger than the 4–5 names previously tracked.

## Moat evidence — our review corpus is still what gets quoted
- "communication, staying on schedule, and clean job sites"
- "communication, detailed project planning, and keeping projects on schedule"
- "projects finishing on or ahead of schedule"
- "family-owned", "one company coordinating multiple trades"

That last one is our own positioning repeated back — "one GC coordinating everything" is landing.

## Citation sources ChatGPT actually used
**Houzz** (constantly, especially for Everything Home) · **Reddit** (threads naming Nicholas Design
Build, MJ Woodstone, Fishers Fixer Upper, CMH Builders, Centennial Construction) · Angi · BBB.

**Our own site was never cited in any of the 12 runs.** For basement pricing ChatGPT quoted **Angi's**
"$30,000 to $80,000+" instead of our published $45,000–$200,000+ — despite our cost report, calculator,
and four basement articles. Third-party platforms are outranking our first-party content as sources.

## What this changes
1. **Houzz is no longer a nice-to-have — it is now the top item.** Most-cited source in the data set,
   and the competitor beating us everywhere is cited through it. Verified 2026-08-05: **we have 1 Houzz
   review; Everything Home has 100+ and multiple Best of Houzz awards** — while we have MORE Google
   reviews than them (78 vs 68). Pure distribution gap on one platform, and the cheapest fix on the
   board. See `docs/houzz-reconciliation-2026-08-05.md`.
2. ~~**The GBP primary category is the likely root cause for kitchen.**~~ **CORRECTED 2026-08-05 by
   Eric: Kitchen and Basement are ALREADY secondary GBP categories.** So the categories are not
   missing — the *primary* is Bathroom, and that is what shows in the map pack. Changing the primary
   is **rejected**: bathroom generates ~8 leads/week and sits 3/3 at avg 2.3 here. Trading a proven
   lead engine for a speculative kitchen gain is a bad trade, and it can't be A/B tested — you'd only
   learn by losing the leads. **The category lever is already at its safe maximum.** Kitchen must be
   won through review language, Houzz presence, and project proof instead.
3. **Reddit corroboration is real and measurable** — surfaced in 4 of 12 runs.
4. **Review requests must name the room.** Our corpus currently reads as bathroom-and-basement.

## GBP discovery-term evidence (captured same day, corroborating)
GBP → Performance → Searches breakdown, Mar–Aug 2026. 20 searches surfaced the profile:
`homestar` (20) · `basement renovation in camel indiana` · `bathroom near me` · `bathroom remodel
fishers` · `best shower remodel 46037` — all <15.
**Zero kitchen terms.** Bathroom and basement appear; kitchen does not. Same story as the ChatGPT data,
from an independent source.
Interactions: Mar 24 · Apr 35 · May 26 · Jun 45 · **Jul 50**. Views Mar–Aug 1,467.
Reviews **78/5.0**. *(Site schema said 62 — corrected to 78 in code 2026-08-05. The Houzz "About Us" bio still says "62+ reviews" and needs editing — Eric.)*

---

## 2026-08-05 — PROVISIONAL ENTRY (single logged-in run, NON-PROTOCOL — SUPERSEDED by the 3-run data above)

**Query: overall home remodeler, Fishers**
- HomeStar: **#1 — "Probably my best all-around recommendation"**
- ChatGPT cited: strong for kitchens, bathrooms, finished basements, flooring, multi-room · reviews mention **staying on schedule, communication, quality tile work** · "good fit if you want one GC to coordinate everything"
- **Moat evidence: ChatGPT is quoting our review corpus.** Review language is confirmed as the #1 AI citation input. Every review request should steer service + city language.
- Competitors + their attributed moats:
  - #2 MJ Woodstone Kitchen and Bath — "craftsmanship and custom finishes… built-ins, custom woodwork… creative or non-standard designs"
  - #3 Home Redemption Construction LLC — "solid local Fishers contractor… communication and staying organized"
  - #4 NKM Construction — "larger than a simple remodel… additions, structural work… permits and complex builds"
  - Outside Fishers: The HomeWright, LLC (Carmel) — "high-end remodels and whole-home"

**Strategic read:** Our "one GC coordinates everything" positioning is landing. The open flanks are MJ Woodstone's craftsmanship/kitchen language and NKM's large-project language — both answered by pushing "Major Projects. Master Craftsmanship." + in-house licensed trades harder in kitchen content (Round 2 kitchen cluster) and by review velocity with kitchen/basement mentions.

---

## July 2026 baseline (from handoff — now known to be single-run and partly WRONG)
- Bathroom remodeler Fishers: **#1** — *3-run check: 3/3 at avg 2.3. Broadly holds.*
- Overall remodeler Fishers: **#1** — *3-run check: 3/3 at #1. Confirmed.*
- Basement Fishers: **#3** (behind Nicholas Design Build) — *3-run check: avg ~5.7, and the leader is
  **Building Concepts**, not Nicholas Design Build. Both the rank and the rival were wrong.*
- Kitchen Fishers: **#3** (behind Chateau Kitchens, MJ Woodstone) — ***3-run check: 0/3. We do not
  appear at all. The baseline was wrong.***

**Lesson:** every one of these came from single runs. Two of the four were materially wrong. This is
exactly why the 3-run protocol exists — do not record single-run results as baselines again.

---

## Template for protocol entries

### YYYY-MM-DD — 3-run logged-out check
| Query | Runs appeared | Avg pos | Leader | Notes |
|---|---|---|---|---|
| bathroom remodeler Fishers | /3 | | | |
| overall remodeler Fishers | /3 | | | |
| basement finishing Fishers | /3 | | | |
| kitchen remodeler Fishers | /3 | | | |

Competitor moat language observed:
Verbatim quotes of our content:
Changes vs last check:


---

# ✅ 2026-08-14 — FULL 3-RUN PROTOCOL (12 logged-out runs, desktop)

**Method note:** the `playwright-incognito` MCP server was not available this session. Runs used the
`claude-in-chrome` browser instead. Logged-out state was **verified before running** — the page showed
"Log in / Sign up for free" and one run surfaced "You're using our basic model. Log in or sign up for
more intelligence." Precise-location sharing was **declined**; ChatGPT inferred "Fishers" from IP,
which is what a real local prospect gets. So the runs are protocol-valid, just via a different driver.

| Query | Appeared | Avg pos | Positions | vs 2026-08-05 |
|---|---|---|---|---|
| Overall remodeler, Fishers | **3/3** | ~2.7 | 1, 1, 6 | ⬇️ was ~1.0 |
| Bathroom remodeler, Fishers | **3/3** | **~1.0** | 1, 1, 1 | ⬆️ was ~2.3 |
| Basement finishing, Fishers | **3/3** | ~2.3 | 1, 5, 1 | ⬆️⬆️ was ~5.7 |
| **Kitchen remodeler, Fishers** | **3/3** | ~2.7 | 4, 2, 2 | ⬆️⬆️⬆️ **was 0/3** |

**Share of voice: 12/12 runs, up from 9/12.** Named the single top pick in 7 of 12.

## Headline: kitchen went 0/3 → 3/3

The Round 2 kitchen cluster worked. On 2026-08-05 HomeStar did not appear in kitchen results at all
across three phrasings. Now it appears in all three, twice at #2, and is named in the closing
"get bids from" shortlist in 2 of 3 runs. MJ Woodstone still leads kitchen on 21 reviews vs our 79 —
category association, not review volume, is still what ranks there.

Bathroom hardened to #1 in all three runs ("🥇 My top pick", "Best overall", "Best overall starting
point"), one run rendering a full business card with phone and directions. Basement moved from
honorable-mention to #1 in two of three.

## 🔴 The whole-home gatekeeper problem is NOT fixed

The one regression. On the whole-house framing — *"who should I hire to remodel my house in Fishers
Indiana?"* — HomeStar fell to **#6** and was **cut from the final "who I'd actually interview" list**
(Nicholas Design Build + The HomeWright + Carrington + Centennial). ChatGPT's own words:

> HomeStar Services and Contracting — another Fishers-based option, **especially if the project is
> primarily kitchen/bath/interior remodeling**

That is the Aug 6 finding restated: on whole-home, the filter is **category membership**. The answer
opened by telling the reader to interview "design-build/general contractors", then named firms
ChatGPT itself labels design-build — Nicholas Design Build, Building Concepts, Everything Home,
The HomeWright.

**We shipped the design-build claim to the website (homepage + whole-home pillar) and the AI corpus
has not absorbed it.** That is expected — corpus lag is real — but it means the website half alone
does not move this. The off-site half (GBP services, Houzz) is still open and is now the live lever.

## 🔴 NEW STRUCTURAL FINDING — we are in zero map packs

Across all 12 runs, HomeStar appeared in the map pack **0 times**, while being the #1 prose
recommendation in 7. Map-pack slots went to MJ Woodstone, Everything Home, Nicholas Design Build,
Carrington, Centennial, Chateau, MJ Brown, Baths By Bee, Indy Renovation, Home Redemption, HomeWright,
Building Concepts, AY Remodeling, CMH Builders.

Our entire AI visibility is **prose/corpus-driven**, not local-index-driven. This is consistent with
the Aug 6 geographic thesis and with the GBP primary category being "Bathroom remodeler". It also
means our AI position is more fragile than the rankings suggest — it rests on the review/directory
corpus rather than on Google's local index.

## Trust objection — partially self-correcting
BBB was cited **positively** in 2 runs ("listed as an A-rated BBB-accredited general contractor in
Fishers") rather than as the newness caution seen on 2026-08-06. Not a fix, but the A- accreditation
is now doing visible work. The founding-date objection was not raised unprompted in any of the 12.

## Houzz — the standing item, restated with fresh numbers
Houzz was cited as a source in **8 of 12 runs**, almost always for a competitor:
- **Everything Home — Houzz 5.0/122 reviews** (was 100+ on Aug 5; still growing) + Best of Houzz
  through 2026. Cited in kitchen, bathroom, overall.
- **The HomeWright — Houzz 5.0/76–77 reviews.**
- HomeStar Houzz reviews: **1.**

Houzz is the single most-cited third-party source in these answers and it is where we are weakest.

## New competitors observed this round
Yesteryear Construction Services (Angi 4.9/45, called out specifically for kitchens), CMH Builders
(basement specialist since 2006, **recommended by a homeowner in a Fishers Reddit thread**), R J & E
Corp (Fishers, 24+ yrs), Home Redemption Construction (Fishers, 5.0/27 — appeared in 3 categories),
AY Remodeling (5.0/73), Watson's Remodeling (5.0/64), JEM Renovations (5.0/25), Absolute Renovations
(4.9/80), Centennial Construction (since 1993, HomeAdvisor 4.4/362), Carrington Homes (4.8/52),
MJ Brown Renovations (5.0/55).

**Reddit was cited directly** in a basement run, both for a contractor recommendation and for a
Fishers price range ($22k–$80k+). Reddit remains an uncontrolled corpus source we have no presence in.

## Changes vs last check
- Kitchen 0/3 → 3/3 — the single biggest movement recorded so far.
- Bathroom 2.3 → 1.0; Basement 5.7 → 2.3.
- Overall 1.0 → 2.7, entirely from the whole-house framing run.
- Map-pack absence identified as a structural ceiling, newly measured.

## 🔴 MAP-PACK DIAGNOSIS 2026-08-14 — the Bing listing is unmanaged and mis-located

Followed up the zero-map-pack finding. Verified on Bing (ChatGPT's local answers are Bing-backed):

**1. Bing has HomeStar in the wrong city.** Searching `"HomeStar Services and Contracting" Fishers
Indiana` returns the business card as:
> HomeStar Services and Contracting · **"Bathroom remodeling in Westfield" · Westfield, Indiana · 7.6 mi**

Bing Maps resolves the business to **Westfield, Hamilton Co.** (40.010, -86.140) — roughly 7.6 miles
northwest of the Fishers address. Google/BBB/Angi/our own site all correctly say Fishers.

**2. It is not just the wrong city — the listing is unmanaged.** The obvious inference would be
"wrong city, so it ranks in Westfield instead." It does not. `bathroom remodeler Westfield IN` returns
Mills & Mills, Indigo Renovations and Bowden Ceramic Tile (5/5 from **244** Bing reviews) — **no
HomeStar.** Absent from the Fishers pack AND the Westfield pack means the listing is almost certainly
unclaimed/unverified and carries no authority. The wrong city is a *symptom* of an unmanaged listing,
not the whole cause.

**3. Bing shows zero reviews for us.** Our Bing card carries no star rating at all, while Google shows
5.0/79. Several competitors in the Fishers Bing pack are equally thin (Superior Bath System 5/5 from
**3**, Tremain 5/5 from **4**, ACo 4/5 from **17**) — so unlike Houzz, **the bar in Bing is near zero.**
Bowden's 244 shows the ceiling is real, but the Fishers bathroom pack is winnable with a handful.

### What this changes
The Aug 6 conclusion — *"the map-pack half is likely unwinnable without a physical presence"* — was
drawn from **Carmel and Westfield** queries and is still right for those. It does **not** explain being
out of the pack in **Fishers, where we do have an address.** That is a data-hygiene problem, not a
geography problem, and it is free to fix.

**Prose and pack are two different systems with two different levers:**
| Layer | Source | Our state | Lever |
|---|---|---|---|
| Prose recommendation | web corpus — site, reviews, BBB, Angi, Houzz, Reddit | **winning** (7/12 top pick) | keep feeding |
| Map pack | local index — GBP for Google, Bing Places for Bing/ChatGPT | **absent, 0/12** | claim + correct listing |

### Actions
1. **Claim Bing Places for Business** (bingplaces.com) — correct the address to Fishers, set categories,
   hours, photos. Highest-leverage item found this run and it costs nothing. **Eric must do this** —
   it needs account creation and phone/postcard verification.
2. **Apple Business Connect** — same class of unmanaged-listing risk, feeds Apple Maps. Claim while there.
3. **Ask for a few Bing/Facebook reviews.** The Fishers Bing pack bar is 3–17 reviews. Cheapest
   competitive win available — far cheaper than closing the 1-vs-122 Houzz gap.
4. **Re-run this protocol ~4 weeks after the Bing listing is corrected** to measure whether pack
   inclusion follows. This is a clean before/after test.
5. **Verify the Google side too** — confirm GBP shows a real Fishers street address rather than a
   hidden service-area configuration. Not yet checked.
