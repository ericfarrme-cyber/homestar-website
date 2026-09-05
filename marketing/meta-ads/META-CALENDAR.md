# Meta calendar

A standing plan for Facebook and Instagram, built from what HomeStar already owns. Nothing here is
scheduled — this is the plan Eric approves and I then execute against.

Last updated 2026-09-04.

---

## What exists to post from

| asset | count | notes |
|---|---|---|
| **Reels, built and captioned** | 16 | `POSTING-QUEUE.md`. 1080x1920, music-only, upload copies under 10 MB |
| **Project photos** | 170 | across 28 project pages, already colour-corrected and web-sized |
| **Before/after pairs on the site** | 3 | **Corrected 2026-09-04.** One project carries a `beforeAfter` array - `white-oak-primary-bath-fishers` - and it holds 3 pairs, each with a written label. The earlier count of 4 came from counting code occurrences, not data. |
| **YouTube videos** | 3 | 2 project walkthroughs + 1 client testimonial |
| **Blog posts** | 26 | cost, permits, ROI, design ideas — link-sticker material |
| **Google rating** | 5.0 from 85 | the single strongest trust asset and currently unused socially |
| **Raw archive footage** | ~50 clips | most already cut; the remainder is per-project surplus |
| **Cloned voices** | 2 | Eric and Robb, both audio-eligible |

**At three posts a week, the reels alone are five weeks of feed.** The photos and blog posts extend
that well past six months without reshooting anything.

---

## Cadence

| surface | frequency | why |
|---|---|---|
| **Reels** | 2 per week — Tue and Fri, 9:00 AM | Reach. Every reel crossposts FB + IG as one post |
| **Feed photo / carousel** | 1 per week — Sun | Depth. Carousels hold attention longer than a single image |
| **Stories** | 3-4 per week | Frequency and recency. They cost minutes, not hours |

That is roughly **7 touches a week** for an hour of work, once the queue is built.

**Do not post two reels from the same project inside a fortnight.** Several jobs now have two or
three assets each and running them close together makes a large body of work look like a small one.

---

## Sequencing rules

1. **F8 before FG.** FG's caption closes with "if you saw our earlier post of this job…". Run them
   the other way and that line is nonsense — cut it or reorder.
2. **Alternate format.** Before/after → mid-job → walkthrough → before/after. Three walkthroughs in
   a row reads as a slideshow.
3. **Alternate city.** Fishers dominates the library; spacing Carmel, Zionsville, Noblesville,
   Westfield and Geist between them makes the service area look as wide as it is.
4. **Lead with a before/after after any gap.** They are the strongest openers and the best-performing
   format for remodelers generally.

## Suggested first six weeks

| week | Tue reel | Fri reel | Sun feed |
|---|---|---|---|
| 1 | **FB** Westfield luxury basement (before/after) | **F9** Noblesville waterproofing arc | Carousel: Geist three-bath photos |
| 2 | **F7** Zionsville Jack & Jill (before/after) | **F8** Geist upper level (mid-job) | Before/after stills: white oak Fishers |
| 3 | **FD** Fishers full gut arc | **FE** Carmel double shower | Carousel: Westfield luxury basement |
| 4 | **F6** Geist three-bath (before/after) | **FA** Spa Retreat stages | Blog link: kitchen remodel cost |
| 5 | **FF** Fishers wet room | **FG** Geist finished *(F8 ran wk 2)* | Carousel: Zionsville Jack & Jill |
| 6 | **FC** Zionsville mosaic craft | **FH** Fishers double shower | Client testimonial video |

Leaves **F5 Carmel green tile**, **FI Spa Retreat finished** and **FJ checkerboard** in reserve for
weeks 7-8, plus anything new.

---

## Stories — what to use

**Corrected 2026-09-04.** The nine formats below were written before the API was tested. Four of
them can never be automated: **polls, question boxes, blog link stickers and countdowns all rely on
interactive stickers, which Meta has never exposed to the API.** Those are phone-only, permanently.

And a second limit that applies to all nine: **nothing on either platform can be scheduled through
the API.** Facebook can schedule reels and feed posts; stories cannot be scheduled on Facebook or
Instagram. So a story fires the moment something calls it, which needs either a person or the
mini PC.

**Eric's test, 2026-09-04:** posting a story to Facebook offers a one-tap share to Instagram. So
crossposting is solved by hand and was never the problem - scheduling is.

**Which means the labour worth removing is making the cards, not posting them.** `build_stories.py`
produces finished 9:16 cards from the project photos; Eric posts them from his phone in about two
minutes a week and taps share to Instagram. When the mini PC arrives it takes over the firing for
the five plain formats. The four sticker formats stay manual forever, and that is fine - they are
also the cheapest to make.

| format | can the API post it | can anything schedule it |
|---|---|---|
| Detail crops | yes | only the mini PC |
| Reel teasers | yes | only the mini PC |
| Two-card before/afters | yes | only the mini PC |
| Process stills | yes | only the mini PC |
| The 5.0 rating card | yes | only the mini PC |
| **Polls** | **no** | no |
| **Question box** | **no** | no |
| **Blog link stickers** | **no** | no |
| **Countdown** | **no** | no |


Stories are 24-hour, low-production and high-frequency. They should **not** be reels reposted. Nine
formats, all buildable from what exists:

**1. Detail crops.** The single best untapped asset. 170 project photos, and the most arresting
things in them are small: the decorative square drain in the Fishers full gut, the star mosaic in
Zionsville, the black marble vein, the checkerboard corner, the KERDI-BOARD printing. Crop to 9:16,
one detail per card. Costs minutes.

**2. Reel teasers.** A still from a reel with "new one up" and an arrow to the feed. Posted an hour
after the reel goes live, it recovers the followers who missed it.

**3. Two-card before/afters.** Card one the before, card two the after. The site already carries
four written before/after pairs with labels — the copy is done.

**4. Polls.** "Which floor?" with two mosaics. "Freestanding or built-in?" Cheap engagement, and the
answers are genuinely useful for design conversations.

**5. Question box.** "What's the one thing you'd change about your bathroom?" Answers become both
content and lead signal.

**6. The 5.0 rating.** 85 reviews at 5.0 and it has never been posted. One clean card, once a month.
The most persuasive thing HomeStar owns and the least used.

**7. Blog link stickers.** 26 posts. The cost, permits and ROI articles answer what people actually
search. A story link outperforms a caption "link in bio".

**8. Process stills.** Single frames of membrane, levelling clips, masked balusters. Same argument
as the mid-job reels, at a fraction of the effort.

**9. Countdown.** Before a project reveal, an obscured detail with "Friday". Costs one crop.

## Feed, beyond reels

- **Photo carousels, one per project.** 28 projects, 4-8 photos each, already shot and corrected.
  This alone is half a year of Sundays.
- **The three YouTube videos** posted natively rather than linked — Meta suppresses outbound links.
- **The client testimonial** is the strongest single asset not yet used on social.

---

## What I need from Eric

1. **Approval of the cadence and the first six weeks**, or a redline of them.
2. ~~Where the approval line sits.~~ **Settled 2026-09-04: I schedule, Eric glances before it
   publishes.** So the working loop is - I build the cut, write the caption, schedule it, and tell
   him it is queued. He reviews it in the Planner and it goes at its time. Nothing publishes without
   having sat in front of him first. Boosting and ad spend stay entirely his.
3. **Crew in frame** — a standing yes or no. It affects several unbuilt clips.
4. **The Meta Graph API.** Setup steps are in `META-API.md` - about 20-30 minutes of your time,
   once. It does not change the approval loop above; it makes the publishing step reliable, and adds
   an automatic read-back check that would have caught the two reels that published with no caption.
   Two things to know going in: **Instagram's API cannot schedule** (Facebook's can, so IG needs our
   own timer), and **Instagram fetches the video from a public URL** rather than accepting an upload.

## Standing constraints

- **Music-only is the default.** Voiceover only where asked for on that specific cut.
- **All beds are Eric's own Mureka tracks**, so every master is clear for YouTube and the website as
  well as Meta. Meta Sound Collection audio would silently forfeit that.
- **Nothing publishes without Eric.** Money actions — boost, spend, ads — are always his.
- **No client surnames**, no street views, no identifiable faces without a yes.
