# Houzz Upload Package — 6 Missing Projects

Ready-to-paste content for the 6 website projects not yet on Houzz.
Upload URL: `https://www.houzz.com/uploadSpaces/uploadTo=project`
Photo folder: `C:\Users\ericf\OneDrive\Documents\GitHub\homestar-website\public\images`
Website link for every project: `https://www.thehomestarservice.com`

**All 47 photos verified present on disk.**

⚠️ **Cost and Year are left blank except where we have a real published figure.** Do not guess these —
invented numbers would violate the authenticity guardrail and Houzz shows them publicly.

---

## 1. Luxury Basement Transformation — Westfield, IN  ★ HIGHEST PRIORITY
**Photos (13):** `westfield-basement-masterpiece-1.jpg` … `-13.jpg`
**Cost:** $100,000 – $250,000 *(real: ~$150,000)*
**Style:** Transitional
**Keywords:** basement finishing, custom bar, home theater, home gym, fireplace, tongue and groove ceiling, Westfield, Hamilton County, entertainment space

**Description:**
> A complete lower-level transformation in Westfield, Indiana. This basement was an empty shell and is
> now the most-used space in the home: a full custom bar with porcelain brick backsplash and kegerator,
> a 14-foot stained red oak mantle above an electric fireplace, tongue-and-groove wood ceilings with
> faux beam wraps, a dedicated home gym, a theater area, and "chairs and squares" wainscoting
> throughout. Designed in partnership with Dovetail Group.
>
> Every trade was handled in-house by HomeStar — framing, licensed electrical, licensed plumbing, HVAC,
> flooring, and all final finishes — with full permitting and inspections. Approximate investment:
> $150,000.

*Why this one first: it is our single best proof asset, and basement is the category where we currently
rank ~5.7 in AI answers behind Building Concepts.*

---

## 2. Three-Bathroom Remodel — Geist, Fishers, IN
**Photos (10):** `geist-three-bath-1.jpg` … `-10.jpg`
**Style:** Transitional
**Keywords:** bathroom remodel, master bath, freestanding tub, picket tile, children's bathroom, Geist, Fishers, Schluter

**Description:**
> A whole-home bathroom transformation near Geist in Fishers, Indiana — three bathrooms remodeled in a
> single coordinated project. The master bath features navy crackle-glaze picket tile, a freestanding
> soaker tub, and a reconfigured layout that made far better use of the existing footprint. Two
> children's bathrooms were remodeled alongside it with coordinated finishes so the whole upper level
> reads as one design.
>
> Every shower is built on the complete Schluter waterproofing system — Ditra for floors, Kerdi for
> walls — backed by a 25-year manufacturer's warranty. All plumbing by licensed plumbers, all electrical
> by licensed electricians.

---

## 3. Wet Room Master Bathroom — Fishers, IN
**Photos (10):** `fishers-wetroom-1.jpg` … `-10.jpg`
**Style:** Contemporary
**Keywords:** wet room, master bathroom, floor to ceiling tile, dual showerhead, frameless glass, penny mosaic, champagne bronze, Fishers

**Description:**
> A wet room master bathroom in Fishers, Indiana. The entire shower and tub zone sits inside one
> waterproofed enclosure, finished with floor-to-ceiling stacked vertical tile that carries across the
> shower ceiling as well. Dual showerheads with a Delta raincan system, frameless glass panels, a penny
> mosaic floor for slip resistance, and champagne bronze Delta trim throughout.
>
> Wet rooms live or die on waterproofing. This one is built on the complete Schluter Kerdi system with a
> 25-year manufacturer's warranty, installed by Schluter Pro Certified installers.

---

## 4. Marble Master Bath Transformation — Fishers, IN
**Photos (5):** `marble-master-bathroom-fishers-1.jpg` … `-5.jpg`
**Style:** Traditional
**Keywords:** marble bathroom, Carrara marble, master bath, mosaic niche, frameless glass shower, double vanity, Fishers

**Description:**
> A builder-basic master bath in Fishers, Indiana rebuilt as an elevated retreat. Carrara marble tile
> throughout, a mosaic flower-pattern accent niche, a frameless glass shower enclosure, and a double
> marble vanity.
>
> Marble is unforgiving of sloppy layout — the veining has to run correctly and the cuts have to land
> where they should. Installed by Schluter Pro Certified installers over the complete Schluter
> waterproofing system, backed by a 25-year manufacturer's warranty.

---

## 5. Basement Bathroom Remodel — Carmel, IN
**Photos (6):** `carmel-basement-bath-1.jpg` … `-6.jpg`
**Style:** Transitional
**Keywords:** basement bathroom, porcelain tile, glass shower, brushed gold, quartz vanity, Carmel, Hamilton County

**Description:**
> A 20-year-old basement bathroom in Carmel, Indiana brought fully up to date: marble-look porcelain
> tile flooring, a glass shower with brushed gold accents, a dark vanity with a quartz top, and a warm
> transitional palette throughout.
>
> Basement bathrooms carry moisture risk that above-grade bathrooms don't, so this one is built on the
> complete Schluter waterproofing system with a 25-year manufacturer's warranty. Licensed plumbers and
> licensed electricians handled all trade work, fully permitted and inspected.

---

## 6. Composite Deck Build — Fishers, IN
**Photos (3):** `fishers-composite-deck-1.jpg` … `-3.jpg`
**Style:** Traditional
**Keywords:** composite deck, deck builder, outdoor living, low maintenance decking, Fishers, Hamilton County

**Description:**
> A custom composite deck in Fishers, Indiana with white railing, dual staircases, and a layout built
> for entertaining. Composite decking was chosen for the obvious reason: it stands up to Indiana
> freeze-thaw cycles without the annual sanding, staining, and board replacement that pressure-treated
> wood demands.

---

# Corrections to EXISTING Houzz projects

| Project on Houzz | Fix |
|---|---|
| "Full Upper Level Home Remodel — Geist, IN" | Location shows **Fortville, IN** → change to **Fishers/Geist, IN** |
| "Two Children's Bathroom Remodels — Geist, IN" | Location shows **McCordsville, IN** → change to **Fishers/Geist, IN** |
| "Spa-Like Modern Bathroom Retreat" (Noblesville) | Rename → **"Floor-to-Ceiling Tile Bathroom Remodel — Noblesville, IN"** (matches the site and carries the searchable term) |
| "Modern Farmhouse Bathroom Remodel — Fishers" | Has 3 photos; site has 4. Add the missing one. |
| **About Us bio** | Says *"5.0 Google rating with 62+ reviews"* → now **78 reviews**. (Site schema already corrected in code.) |

# ⚠️ The bigger Houzz task
Uploading projects raises quality. **It does not fix the actual gap.** We have **1 Houzz review**;
Everything Home — which beats us in all 12 ChatGPT runs — has **100+ plus multiple Best of Houzz
awards**, while having *fewer* Google reviews than us (68 vs 78). Ask past clients to post on Houzz too.
That is the highest-leverage action available.

# Method note for whoever automates this
Houzz's edit form uses JS change detection. Setting a textarea via JavaScript (`.value = ...`) does
**not** mark the form dirty — "Done" will navigate away and silently discard the change. Text must be
entered with **real simulated keystrokes**. Dropdowns (Year, Cost, Style) are fine to set normally
because the browser fires native change events on `<select>`.
