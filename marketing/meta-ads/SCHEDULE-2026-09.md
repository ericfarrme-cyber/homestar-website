# Posting schedule — six weeks from Mon 7 September 2026

Concrete slots, concrete assets. Every reel below is built, captioned and audited. Every story card
is rendered and sitting in `renders/stories/`.

**The loop:** I schedule, Eric glances in the Planner, it publishes. Nothing goes out unseen, and
boosting and ad spend stay entirely Eric's.

**FN is excluded** — Eric turned it down. **F4 is already published** (3 Sep).

## Scheduled as of 2026-09-06

Weeks 1 to 4 are queued on the Page and each caption was read back from Meta after scheduling,
not merely sent. Independently re-audited with `meta_verify.py`.

| when | reel | caption | post id |
|---|---|---|---|
| **Mon 7 Sep 09:00** | F7 Zionsville jack & jill | 851 ch, verified | `..._122173088258632361` |
| Fri 11 Sep 09:00 | F9 Noblesville waterproofing | 848 ch, verified | `..._122173088378` |
| **Mon 14 Sep 09:00** | FB Westfield basement | 714 ch, verified | `..._122173088486632361` |
| Fri 18 Sep 09:00 | F8 Geist upper level | 627 ch, verified | `..._122173088600` |
| Mon 21 Sep 09:00 | FD Fishers full gut | 940 ch, verified | `..._122173106438` |
| Fri 25 Sep 09:00 | FO Six floors | 678 ch, verified | `..._122173106528` |
| Mon 28 Sep 09:00 | F6 Geist three-bath | 1285 ch, verified | `..._122173106684` |
| Fri 2 Oct 09:00 | FE Carmel double shower | 662 ch, verified | `..._122173106756` |

Stopped at four weeks. Scheduling all six removes the ability to react to what the early weeks
actually do, and editing a queued reel's caption is awkward — reels store text as `description`
on the video object, not `message` on the post.

**Note for the next run:** `meta_verify.py` did not list F8 immediately after scheduling; it
appeared seconds later. Scheduled posts take a moment to show up in `scheduled_posts`. Re-run
before concluding anything is missing.

Stories are Eric's to post from the phone. Week 1 cards were sent to him on 6 Sep: S8, S1, S13, S25.

---

## The cadence

| surface | when | why |
|---|---|---|
| **Reel** | Mon + Fri, 9:00 AM | Reach. Crossposts FB + IG as one action |
| **Feed** | Sun, 11:00 AM | Depth. Carousels hold attention longer than one image |
| **Stories** | Tue, Wed, Thu, Sat | Frequency. Two minutes a week from the phone |

Seven touches a week, one per day, and **every week is identical** — Eric's call on 6 Sep. Reels
moved from Tuesdays to Mondays so the story days could be Tue/Wed/Thu/Sat without a reel and a
story colliding on the same day. Mon 7 Sep is Labor Day; the reel still goes, since it publishes
itself.

## Reels — Mondays and Fridays, 9:00 AM

| week | Mon | Fri |
|---|---|---|
| **1** — 7 / 11 Sep | **F7** Zionsville jack & jill *(before/after)* | **F9** Noblesville, membrane to finished |
| **2** — 14 / 18 Sep | **FB** Westfield luxury basement *(before/after)* | **FD** Fishers full gut *(full arc)* |
| **3** — 21 / 25 Sep | **F8** Geist upper level *(mid-job)* | **FO** Six floors *(ends on a question)* |
| **4** — 28 Sep / 2 Oct | **F6** Geist three-bath *(before/after)* | **FE** Carmel double shower |
| **5** — 5 / 9 Oct | **FM** Zionsville basement bar | **FP** What's under your tile |
| **6** — 12 / 16 Oct | **FL** Geist navy picket *(craft)* | **FF** Fishers wet room |

**Swapped on Eric's call 2026-09-04:** F7 opens, FB moves to week 2.

**Why this order.** Opens on a before/after, which is the strongest format for a remodeler and the
best thing to lead a cold audience with. Format alternates so it never reads as a slideshow:
before/after → arc → before/after → mid-job → arc → comparison. City alternates so the service area
looks as wide as it is. No project appears twice inside a fortnight. Closest pairs: Geist three-bath on
28 Sep and 12 Oct, and Zionsville jack & jill on 7 Sep with the Zionsville BASEMENT - a different
job - on 5 Oct. Both fine.

**Held back deliberately:** FA, FI and FK are all the Fishers spa retreat, and three cuts of one job
inside six weeks would make a large body of work look small. FC and FG are second assets for jobs
already running. FH, FJ, F5 are the reserve for weeks 7-8.

**F8 runs before FG, always.** FG's caption refers back to it. The 2026-09-16 swap keeps that —
F8 moved to 21 Sep, FG is still weeks 7-8.

**Swapped 2026-09-16 on Eric's call:** FD takes Friday 18 Sep, F8 takes Monday 21 Sep. Both the
Page's scheduled posts and `ig-queue.json` were moved, and each caption travelled with its own
reel rather than staying on the date.

**Rescored 2026-09-16.** FD carries Opalite, F8 Halfway There — Eric's picks from the new library.
The repo files are the new scores, so Instagram publishes them. **The Facebook posts were
scheduled with the old beds and keep them** unless the posts are deleted and re-uploaded; the
video Meta holds is a copy, not a link to the repo.

## Feed — Sundays, 11:00 AM

| date | post | note |
|---|---|---|
| **13 Sep** | Carousel: Geist three-bath, 6 photos | Follows the F8 mid-job reel from the Friday |
| **20 Sep** | **Carousel: Westfield wet bar basement, 8 photos** | **Moved up 2026-09-15 on Eric's call.** The Hackman job, shot professionally and never posted, and the case study is already live at `/projects/westfield-basement-wet-bar`. Order and caption: `CAPTION-WESTFIELD-WET-BAR-CAROUSEL.md` |
| **27 Sep** | **The 5.0 from 85 reviews** | **Built** - `renders/cards/review-5-0-feed.jpg` (1080x1350) and `review-5-0-story.jpg`. Moved back a week from 20 Sep, which also buys time to confirm the review count against Google before it goes out claiming 85 |
| ~~27 Sep~~ | ~~Carousel: Westfield luxury basement, 8 photos~~ | Moved to week 7 — two Westfield basements a fortnight apart would read as one job. Dovetail credited when it runs |
| **4 Oct** | **Client testimonial, posted natively** | **Blocked - needs the source video file from Eric.** It exists only as YouTube `k6XhQcUEHh0`, and Meta suppresses outbound links, so it has to be uploaded natively rather than linked |
| **11 Oct** | Carousel: Zionsville jack & jill, 8 photos | Star mosaic floor leads |
| **18 Oct** | Carousel: Fishers full gut walk-in, 6 photos | The pierced bronze drain leads |

## Stories — Tue, Wed, Thu, Sat

Four a week from the 30 cards, spaced so no project repeats inside a week and the towns rotate.

Story days are **Tue, Wed, Thu, Sat** in every week. The reels sit on Mon and Fri, so no day ever
carries two posts and no day is empty.

| week | Tue | Wed | Thu | Sat |
|---|---|---|---|---|
| **1** | S8 Westfield mantle | S1 Fishers drain | S9 Noblesville shower | S25 Carmel green tile |
| **2** | S30 Geist staircase *(posted 15 Sep)* | **S32 Westfield play door** | **S31 Westfield basement kitchen** | **S33 Westfield basement bath** |
| **3** | S24 Fishers sconces | S6 Zionsville slab | S10 Zionsville star floor | S21 Zionsville ceilings |
| **4** | S7 Geist blue tile | S3 Fishers linear drain | S27 Westfield lit shelves | S19 Geist shelves |
| **5** | S11 Zionsville wine wall | S13 Noblesville tile | S16 Geist panelling | S14 Geist ladder |
| **6** | S12 Zionsville slab wide | S2 Carmel patterns | S26 Zionsville arch | S5 Fishers fixtures |

Reserve: S15, S17, S18, S20, S22, S23, S28, S4 and S29.

**Added 2026-09-15 — the Westfield wet bar basement (S31, S32, S33).** Built from the professional
shoot of the Hackman job: S32 the under-stair play door, S31 the kitchen full frame, S33 the fluted
oak double vanity. The case study is live at `/projects/westfield-basement-wet-bar`, so every card
has somewhere to send people.

**Front-loaded 2026-09-15 on Eric's call — all three run this week, playhouse first.** The rule
about one project per week is deliberately broken here: the carousel now lands Sunday 20 Sep, and
three cards in the four days before it warm the same audience for the same job rather than
scattering across a month. S10, S3 and S16 take the vacated slots in weeks 3, 4 and 5, so nothing
is lost, only reordered. Order matters — S32 first because the playhouse is the frame people reply
to, then the kitchen, then the bath.

**No reel for this project yet.** There is no walkthrough video — 63 stills and nothing moving.
A reel needs footage from the site; until Eric shoots one, this job runs as a carousel and stories.

**Swapped 2026-09-10 on Eric's call:** S9 and S13 traded slots. Both are the Noblesville
floor-to-ceiling tile job; he wanted the shower rather than the wider tile shot on the day. A
straight swap, so the same two cards still run and they stay four weeks apart.

**Swapped 2026-09-15 on Eric's call:** S30 and S10 traded Tue/Wed in week 2. The Geist staircase
runs Tuesday, the Zionsville star floor Wednesday. Geist still appears twice in week 2 (S30 Tue,
S16 Sat), now four days apart instead of three.

**Space the pairs.** S6 and S12 are the same room and the same stone - three weeks apart above.
S2 and S25 are the same shower - weeks 1 and 6. S8, S15 and S27 are all Westfield.

**The four sticker formats stay manual and stay Eric's**: polls, question box, blog link stickers,
countdowns. No API can post them, and they are the cheapest to make anyway. Worth one poll a week
on top of the four cards above - "which floor?" with two of the six from FO is a ready-made one.

---

## What has to be built before this runs

1. ~~The 5.0 review card for 20 Sep.~~ **Done 2026-09-04** - `build_review_card.py`, feed
   (1080x1350) and story (1080x1920). Rating and review count are read from the site's own
   structured data so the card cannot drift from what the site claims.
2. ~~The warranty sweep.~~ **Done 2026-09-04** - six captions corrected. They read
   *"Schluter's 25-year manufacturer warranty covers the waterproofing, and our own 1-year
   workmanship warranty covers the job."* The published F4 was already correct: it says
   "25-year **waterproofing** warranty", which scopes it properly.
3. **The testimonial exported** for native upload on 4 Oct. **Still outstanding** - it lives on
   YouTube and there is no local copy in the repo. Eric to supply the file.

Everything else on this schedule exists and is ready.
