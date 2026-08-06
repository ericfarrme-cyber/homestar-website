# Houzz ↔ Website Project Reconciliation — 2026-08-05

**Houzz profile:** https://www.houzz.com/pro/homestarservicesandcontracting
(canonical listing URL: `houzz.com/hznb/professionals/general-contractors/homestar-services-and-contracting-inc-pfvwus-pf~634607625`)
**Added to schema `sameAs` on the site this run** — that checklist item is now closed.

**Website:** 24 projects · **Houzz:** 18 projects · **Gap: 6 missing from Houzz**

---

## 🔴 Missing from Houzz — upload these 6

Ordered by strategic value, not by size.

| # | Website project | Imgs | Why it matters |
|---|---|---|---|
| 1 | **Luxury Basement Transformation in Westfield** (`westfield-basement-masterpiece`) | **13** | **The single most valuable asset we own and it is not on Houzz.** ~$150,000 build — custom bar with kegerator, theater, gym, 14-ft red oak mantle, Dovetail Group partnership. Basement is a flank we are *losing* (avg ~5.7 in ChatGPT, leader Building Concepts). This is the proof that answers it. |
| 2 | **Three-Bathroom Remodel in Geist, Fishers** (`three-bathroom-remodel-geist`) | 10 | Largest bathroom scope we have; already has a testimonial video on the channel. |
| 3 | **Wet Room Master Bathroom Remodel in Fishers** (`wet-room-bathroom-fishers`) | 10 | Distinctive, high-design; wet rooms are a differentiated search term. |
| 4 | **Marble Master Bath Transformation in Fishers** (`marble-master-bathroom-fishers`) | 5 | Premium finish work; already flagged on the human checklist. |
| 5 | **Basement Bathroom Remodel in Carmel** (`basement-bathroom-carmel`) | 6 | Doubles as basement *and* bathroom proof — covers both. |
| 6 | **Composite Deck Build in Fishers** (`composite-deck-fishers`) | 3 | Only outdoor-living build missing; lowest priority of the six. |

Photos for all six are already local: `public/images/`.

## ⚠️ Naming and data mismatches to fix on Houzz

| Website | Houzz | Issue |
|---|---|---|
| "Floor-to-Ceiling Tile Bathroom Remodel in Noblesville" | "Spa-Like Modern Bathroom Retreat" | Same project, different name. The website name carries the searchable term ("floor-to-ceiling tile"); the Houzz name is generic. **Rename on Houzz to match.** |
| Modern Farmhouse Bathroom — 4 images | 3 images | One photo missing on Houzz. |
| "Full Upper Level Home Remodel — Geist, IN" | location shows **Fortville, IN** | Location label appears wrong. |
| "Two Children's Bathroom Remodels — Geist, IN" | location shows **McCordsville, IN** | Location label appears wrong. |

Those two location mismatches matter more than they look: Houzz location is what drives local matching, and both are currently pointing at the wrong town.

## ✅ Correctly matched (18)
Green Tile Carmel (8) · Double Shower Fishers (6) · Spa Retreat Fishers (6) · Upper Level Geist (12) ·
Laundry Noblesville (3) · Children's Bathrooms Geist (6) · Jack & Jill Zionsville (9) · Quick Basement
Fishers (3) · Fishers Bathroom Renovation (4) · Teenage Bathroom Fishers (4) · Budget Basement Westfield
(4) · Double Shower Carmel (7) · Pavilion Patio Fortville (3) · Stamped Concrete Fishers (2) · Stamped
Concrete Noblesville (4) · Modern Farmhouse Fishers (3) · Laundry Geist (2) · Spa-Like Noblesville (4)

---

## The bigger finding: Houzz is where we are losing, and it is fixable

The 12-run ChatGPT protocol showed **Houzz is the single most-cited source** in AI answers about
Fishers remodelers. Compare:

| | HomeStar | Everything Home (beats us in every query) |
|---|---|---|
| Houzz reviews | **1** | **100+ five-star** |
| Best of Houzz awards | 0 | multiple |
| Projects on Houzz | 18 | — |
| Google reviews | 78 | 68 |

**We have more Google reviews than Everything Home and 1/100th the Houzz reviews.** ChatGPT cites them
through Houzz constantly and never cites us. This is not a content problem or a quality problem — it is
a distribution problem on one specific platform, and it is the cheapest gap on the entire board to close.

**Highest-leverage action available right now:** ask past clients to leave their review on **Houzz** as
well as Google. We already have 78 happy Google reviewers. Even 10–15 Houzz reviews would move us from
invisible to credible on the platform that AI answers actually quote.

## Also found
- Houzz "About Us" says **"5.0 Google rating with 62+ reviews"** — stale. Now **78**.
  *(The site schema said 62 too; fixed to 78 in code this run. The Houzz bio still needs editing.)*
- Houzz categories listed: General Contractors, Accessory Dwelling Units, Home Remodeling, Home
  Additions, Basement Remodeling. **No Kitchen category on Houzz either** — same blind spot as GBP.
- **Zero kitchen projects on Houzz** (there are none on the website either). Eric has confirmed a
  kitchen project exists — when its photos arrive, publish it to **both** the website and Houzz.

## Blocked on Eric
Uploading projects and editing the bio requires being signed into the Houzz pro account, which this
session is not. All six uploads, the two location corrections, the rename, and the bio review-count fix
need either Eric's login or Eric doing them. Photos are ready in `public/images/`.
