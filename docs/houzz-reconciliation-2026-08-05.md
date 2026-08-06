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

---

# ✅ COMPLETED 2026-08-05 — all 6 projects uploaded

Houzz now shows **24 projects, exactly matching the website.** Verified on the live public profile.

| Project | Houzz ID | Photos | Description |
|---|---|---|---|
| Luxury Basement Transformation — Westfield, IN | 7889667 | 13 ✅ | 659 chars ✅ |
| Three-Bathroom Remodel — Geist, Fishers, IN | 7889669 | 10 ✅ | 642 chars ✅ |
| Wet Room Master Bathroom Remodel — Fishers, IN | 7889671 | 10 ✅ | 559 chars ✅ |
| Marble Master Bath Transformation — Fishers, IN | 7889672 | 5 ✅ | 473 chars ✅ |
| Basement Bathroom Remodel — Carmel, IN | 7889673 | 6 ✅ | 511 chars ✅ |
| Composite Deck Build — Fishers, IN | 7889674 | 3 ✅ | 309 chars ✅ |

Each carries style, keywords, and a deep link to its matching page on thehomestarservice.com.
Project **cost was set only on the Westfield basement** ($100,001–$150,000, the one real published
figure). Year was left blank on all six — we don't have verified completion years, and inventing them
would breach the authenticity guardrail. **Eric can add years in ~2 minutes if he knows them.**

## 🚨 Problem discovered during upload: the website is serving enormous images

Houzz rejected 9 of 10 wet-room photos with error `-200`. Cause: **`fishers-wetroom-*.jpg` are
16320 × 12240 pixels, 13–20 MB each.**

They were resized to 2400×1800 (415–751KB) for Houzz and uploaded successfully. **But the originals
are still what the website serves.** `/projects/wet-room-bathroom-fishers` loads ten of them —
roughly **150 MB of images on a single page**.

This is a real and serious SEO defect, not a cosmetic one:
- Core Web Vitals (LCP) will be catastrophic on that page, and Core Web Vitals are a ranking factor
- On mobile data it is effectively unusable
- It likely suppresses the whole `/projects/*` cluster, several of which already show 0 clicks

Every other project's photos are fine (1094–1536px, 100–650KB). **Only the 9 wet-room files are
oversized.** Recommended fix: resize those 9 in `public/images/` to ~2400px wide and redeploy —
a ~99% byte reduction on that page with no visible quality loss. Resized copies already exist at
`.playwright-mcp/houzz-resized/` (gitignored) and can be copied straight in.

**Not done automatically** because it overwrites binary source assets — Eric's call.

---

# Follow-up round — corrections applied 2026-08-05

## ✅ Rename done
`Spa-Like Modern Bathroom Retreat` → **`Floor-to-Ceiling Tile Bathroom Remodel — Noblesville, IN`**
(project 7734672). The Houzz URL slug updated to match. Now carries the searchable term and matches
the website.

## ❌ CORRECTION — the two "wrong locations" were NOT wrong. I was.
My earlier finding said the Geist projects were mislabeled Fortville and McCordsville. Checking the
actual records:
- Full Upper Level Home Remodel — address on file: **14634 Faucet Lane, Fortville, IN**
- Two Children's Bathroom Remodels — address on file: **9738 Reston Lane, McCordsville, IN**

These are **real client street addresses**, and Fortville and McCordsville are genuine municipalities
bordering Geist Reservoir. Houzz displays the true municipality; the website uses "Geist" as the
regional marketing name. **Both are accurate** — it is a naming-convention difference, not an error.

**No change made.** Overwriting correct client address data on the strength of a misread would have
been worse than the imagined problem. Removed from the to-do list.

## ✅ Broken website image found and fixed — Houzz was right, the site was wrong
The "Houzz is missing a farmhouse photo" finding turned out backwards. `modern-farmhouse-2.jpg` is
referenced in `PROJECTS` but **does not exist in `public/images`**. Because `vercel.json` rewrites
`/(.*)` to index.html, the URL returned **HTTP 200 with content-type `text/html`** instead of 404 —
so it passed a status-code check while rendering as a visibly broken image to real visitors.

Houzz had 3 photos because 3 is all that exists. Dead reference removed; the project now correctly
shows 3 on both. No substitute photo invented. **Audited all 141 image references sitewide — this was
the only broken one.**

## ✅ Page-weight defect fixed and deployed
Applied a 2400px-wide cap across the image library. **26 files: 193.0 MB → 13.8 MB (93% reduction).**
Verified live:
- `/projects/wet-room-bathroom-fishers` — **143 MB → 5.3 MB**
- `/projects/three-bathroom-remodel-geist` — **~42 MB → 4.5 MB**
- carmel-double-shower, modern-farmhouse also reduced

All 138 images verified to still decode; none now exceeds 2400px or 2MB. Originals recoverable from
git history.

## ⏳ Still outstanding — needs Eric
- **Houzz "About Us" bio still says "5.0 Google rating with 62+ reviews"** — actual is **78**. The
  inline profile editor did not expose the bio field in this session; it is likely behind Houzz Pro.
  Two-minute manual edit. *(The site's own schema was already corrected to 78 in code.)*
- **Project Year** is blank on the 6 newly uploaded projects — left deliberately blank rather than
  guessed. Eric can set them quickly if known.
- **Houzz reviews: still 1.** Unchanged and still the single highest-leverage item on the board.
  24 polished projects do not outweigh Everything Home's 100+ Houzz reviews.
