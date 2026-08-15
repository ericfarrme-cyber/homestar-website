# Houzz Upload Package — 2 New Zionsville Projects (2026-08-15)

Ready-to-paste content for the only two website projects not yet on Houzz.

- Upload URL: `https://www.houzz.com/uploadSpaces/uploadTo=project`
- Photo folder: `C:\Users\ericf\OneDrive\Documents\GitHub\homestar-website\public\images`
- Website link for every project: `https://www.thehomestarservice.com`

**Diff verified from source, not assumed.** Between the 2026-08-05 Houzz reconciliation commit
(`8ebe203`) and HEAD, the `PROJECTS` array gained exactly two entries and lost none, and **no existing
project's `desc` field was edited**. So these two are the entire Houzz gap — nothing already on Houzz
needs its description refreshed.

**All 18 photos verified present on disk and already web-sized** (227–641 KB each, well under the
limit that caused the `-200` rejections on the wet-room set in August). No resizing needed.

⚠️ **Cost and Year left blank on both** — we have no published figure for either project and no
verified completion year. Inventing them would breach the authenticity guardrail. Eric can add them in
a couple of minutes if he knows them.

---

## 1. Basement Bar, Wine Room & Lounge — Zionsville, IN

**Photos (10):** `zionsville-basement-1.jpg` … `zionsville-basement-10.jpg`
*(Recommended lead photo: `zionsville-basement-2.jpg` — the bar with the full-height slab backsplash.
That is the shot the website leads with.)*

**Style:** Transitional
**Cost:** *(leave blank)*
**Keywords:** basement finishing, wet bar, wine room, media lounge, guest bathroom, walkout basement,
stone slab backsplash, Zionsville, Boone County, entertaining space

**Deep link:** `https://www.thehomestarservice.com/projects/zionsville-basement-bar-wine-room`

**Description:**
> A daylight lower level in Zionsville, Indiana finished as a true entertaining floor. The centerpiece
> is a full wet bar under soaring ceilings — a polished black natural stone countertop carried up the
> wall as a full-height slab backsplash rather than tile, with floating stained-oak shelves on
> integrated LED lighting, shaker cabinetry, a beverage drawer and a glass-front wine refrigerator.
> The space beneath the stairs became a walk-in wine room with full-height black metal racking on
> three walls. A media lounge and a fully tiled guest bathroom complete the floor, with wide-plank
> flooring running unbroken through every zone so the level reads as one space.
>
> Designed in collaboration with the homeowners' own Denver-based designer, Holly Johnson — HomeStar
> built to her drawings and finish schedule from 1,000 miles away. All plumbing and electrical by our
> own licensed tradespeople; the guest bath is waterproofed to Schluter Pro standards. This is phase
> one of a larger whole-home renovation.

---

## 2. Kitchen & Main-Level Renovation — Zionsville, IN  ★ HIGHEST PRIORITY

**Photos (8):** `zionsville-kitchen-main-level-1.jpeg` … `zionsville-kitchen-main-level-8.jpeg`
**Note the `.jpeg` extension** — these are the only project photos in the library that are not `.jpg`.
*(Recommended lead photo: `zionsville-kitchen-main-level-1.jpeg` — the island and slab backsplash.)*

**Style:** Transitional
**Cost:** *(leave blank)*
**Keywords:** kitchen remodel, full height slab backsplash, custom range hood, butler's bar, kitchen
island, dining room, home study, built-ins, great room, Zionsville

**Deep link:** `https://www.thehomestarservice.com/projects/zionsville-kitchen-main-level`

**Description:**
> A main-floor renovation in Zionsville, Indiana. Cream raised-panel cabinetry with a hand-applied
> glaze runs the perimeter and returns on a long island topped in soft-veined white stone — carried up
> the wall behind the cooktop as a full-height slab rather than tile, under a custom painted hood that
> conceals task lighting. Three seeded-glass lanterns banded in matte black and brass hang over the
> island. Off the kitchen, a niche became a butler's bar with black floating shelves over a stone
> counter. The dining room sits under a dark botanical mural and a bronze tray ceiling; the study went
> the other way entirely, chocolate brown on walls and ceiling with floor-to-ceiling stained built-ins.
> The great room was kept open to the kitchen to hold the sightline.
>
> Phase two of the whole-home renovation that began in this family's lower level, again built to the
> drawings of their Denver-based designer, Holly Johnson. All plumbing and electrical by our own
> licensed tradespeople.

### Why this one matters more than its size suggests

This is the **first kitchen project HomeStar will have on Houzz** — the profile currently has zero, and
Houzz does not even list a kitchen category for us. That is the same blind spot documented on GBP, and
Houzz is the single most-cited source in the 12-run ChatGPT protocol. We sit **0/3 on kitchen queries**
and 3/3 on overall remodeler. A real kitchen project with photos on the platform AI answers actually
quote is the cheapest available move against that gap.

**Worth doing at the same time:** check whether Houzz will let us add **Kitchen & Bath Remodelers** (or
similar) as a profile category now that we have a kitchen project to justify it.

---

## Still outstanding on Houzz from the August round (unchanged)

- **Houzz reviews: still 1.** Verified on the live public profile 2026-08-15. Everything Home has 100+.
  This remains the single highest-leverage item on the entire board and no amount of project uploading
  substitutes for it.
- **"About Us" bio still needs the review count corrected** — it reads "62+ reviews"; actual is 78+.
- **Project Year blank** on the six projects uploaded 2026-08-05.

---

# ✅ COMPLETED 2026-08-15 — both projects uploaded and verified

Eric signed into Houzz; both projects were created, populated and verified by re-fetching the saved
record, not assumed from a click.

| Project | Houzz ID | Photos | Description | Style | Keywords | Deep link |
|---|---|---|---|---|---|---|
| Basement Bar, Wine Room & Lounge — Zionsville, IN | **7896965** | 10 ✅ | 999 chars ✅ | Transitional | 11 ✅ | ✅ |
| Kitchen & Main-Level Renovation — Zionsville, IN | **7896971** | 8 ✅ | 979 chars ✅ | Transitional | 10 ✅ | ✅ |

Public profile now reads **26 Projects**, with both new projects at the top of the list.
Year and Cost deliberately left blank on both — no verified completion year, no published figure.

**HomeStar now has a kitchen project on Houzz for the first time.**

## Things learned doing this — read before the next Houzz upload

1. **The photo uploader is Dropzone.js, and `file_upload` alone does NOT work.** The visible
   `input[type=file][name=Filedata]` is a legacy `.flash fallback` element that the page ignores.
   Setting files on it does nothing, and dispatching a synthetic `drop` with a hand-built
   `DataTransfer` also fails — Chrome ignores `dataTransfer` passed to the `DragEvent` constructor.
   **What works:** load the files onto the fallback input with `file_upload` (it accepts multiple
   paths even though the input reports `multiple:false`), then hand them to Dropzone directly:
   ```js
   const files=[...document.querySelector('input[type=file]').files];
   Dropzone.forElement('#hz-dropzone').files.length; // instance exists, maxFiles 100
   files.forEach(f=>Dropzone.forElement('#hz-dropzone').addFile(f));
   ```
2. **"Link to Website" is PRE-FILLED** with `http://www.thehomestarservice.com`. It looks like grey
   placeholder text but it is a real value. Clicking and typing APPENDS, producing a mangled URL like
   `http://www.thehomestarservice.comhttps://www.thehomestarservice.com/projects/...`. Always
   select-all + Delete first. Caught on project 1 and fixed before submitting.
3. **Typing into Keywords silently failed once.** On project 2 the first attempt produced an empty
   field; a screenshot caught it and a re-type worked. Do not trust the type action's own success
   message — look at the chips.
4. **Project Address does not populate the hidden `city`/`zip` fields.** Selecting a Google
   autocomplete suggestion left `city=Fishers, zip=46037` (the business defaults) in hidden inputs
   inside the same submit form, which would have tagged a Zionsville project as Fishers. Checking the
   Aug-5 uploads showed they were created with the address field **blank** and display correctly,
   because the city comes from the project NAME. **Leave Project Address blank and put the city in the
   project name** — that is the proven-safe pattern.
5. Creating a project is a two-stage flow: the upload form creates the project and lands on a
   per-photo metadata editor (Close → Done), and only then does the real project ID appear in the URL.
   The **description is not on the create form at all** — set it afterwards at
   `/organizeCollection/type=proj/id={ID}/action=edit`, then Save.

## ⚠️ Count discrepancy worth reconciling next run
Website has **25** projects; Houzz now has **26**. Before today it was 23 vs 24. So Houzz has carried
one project the website does not have since at least the August round — the 2026-08-05 doc recorded
"24 vs 24" and appears to have miscounted the website side. Not urgent and nothing is broken, but a
future run should identify which Houzz project has no website counterpart and decide whether to build
the page or retire the listing.
