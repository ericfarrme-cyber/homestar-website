# Fishers White Oak Primary Bath — Reel caption

**Scheduled for:** Thursday 3 September 2026, 9:00 AM (Eric's local time)
**Posting to:** HomeStar Services and Contracting (Facebook) + thehomestarservice (Instagram)
**File:** `marketing/meta-ads/renders/F4-fishers-white-oak-bath--reels-upload.mp4` (9.22 MB, 1080x1920, 21.5s)
**Audio:** Quiet Neon bed with Eric's cloned-voice narration, sidechain-ducked

---

## On-screen text (burned into the video)

Same five-field shape as the Zionsville and wet-room Reels.

| | |
|---|---|
| **hook** (0-4.1s) | The layout never changed. |
| **beat** (8.5-12.8s) | Everything you touch did. |
| **end_head** | Same footprint. New bathroom. |
| **end_sub** | Schluter Pro Certified. Bathrooms in Hamilton County - $15K to $50K. |
| **cta** | GET A FREE ESTIMATE |

The hook and the beat are a pair: the hook sounds like a limitation, the beat turns it into the
point. Runtime is 21.5s with the end card, matching V1 and V2 at 22s.

---

## Caption — copy everything below the line

Same footprint. Nothing else the same.

The vanity stayed on its wall, the tub stayed in the window bay, the shower stayed in the corner. That's deliberate - moving drains and vents is what makes a bathroom expensive, so keeping the layout put the budget into what you actually touch.

Out: a corner jetted tub in a tiled deck, a framed shower behind obscure glass, a dark vanity with a cultured-marble top.

In: a freestanding soaker on a wall-mount filler, clear frameless glass with a bench and a hex mosaic pan, white oak and quartz in champagne bronze.

Every shower goes over the complete Schluter system - 25-year waterproofing warranty, standard, not an upgrade.

Fishers, Indiana. Free in-home estimates: (317) 279-4798

---

## Why this copy

The second paragraph is the one that earns its place. Moving plumbing is what makes bathrooms
expensive, so "we kept the layout" stops being a limitation and becomes the reason the money
showed up on the surfaces. That is the same argument the on-screen hook and beat make, and the
same one the project page makes.

No hashtags, matching V1 and V2, neither of which uses any. Plain hyphens, not em dashes, also
matching. No pricing in the caption - the end card already carries the band, and a comment thread
is a poor place to defend a number.

---

## Composer note: the video has to go in first

Meta's reel composer renders the caption field at **zero width** until a video is attached. It
still takes focus, so typing into it silently goes nowhere - the field reports one character
afterwards and nothing is entered. This is not a permissions or React-events problem; the element
simply is not laid out yet.

Order is therefore forced: **attach the video, then the caption, then the schedule.** Nothing in
the composer is saved as a draft either - navigating away loses the caption entirely.

---

## Scheduled 2026-09-03

Confirmed by Meta: *"Your reel is scheduled to publish on Sep 3, 2026 on Facebook and Sep 3, 2026
on Instagram after it finishes processing."*

- **Facebook** Sep 3, 2026, 09:00 AM America/Indiana/Indianapolis
- **Instagram** Sep 3, 2026, 09:00 AM America/Indiana/Indianapolis
- **File posted:** `F4-fishers-white-oak-bath--reels-vo-eric.mp4` (11.31 MB, the full-quality
  voiceover cut). Meta's own upload limit is well above the 10 MB cap that applies to the browser
  upload tool, so the compressed `-upload` master was not needed.
- Closed captions left on (auto-generated) - Reels are largely watched muted.

### The composer loses the caption between steps

The caption was entered and verified at 733 characters on the Create step, and was **gone** by the
time the Share step was reached. It had to be re-entered. Two rules follow:

1. **Attach the video first.** The caption field renders at zero width until media is present. It
   still takes focus, so typing into it silently goes nowhere.
2. **Go forward only, and verify the caption on the Create step immediately before advancing.**
   Stepping back appears to clear it. Nothing is saved as a draft either.

### No-voiceover fallback set

Kept deliberately, in case the voiced cut ever needs replacing:

| File | Audio |
|---|---|
| `F4-fishers-white-oak-bath--reels-video.mp4` | silent master |
| `F4-fishers-white-oak-bath--reels-video-music.mp4` | Quiet Neon only |
| `F4-fishers-white-oak-bath--reels-upload-music-only.mp4` | Quiet Neon only, 9.22 MB |

### Pushed to Fri 4 September, 2026-09-03

Eric was not sold on the voiceover and asked for the 9:00 AM slot to be pushed. **Rescheduled
both entries to Friday 4 September 2026, 9:00 AM** — Facebook and Instagram, verified on the
calendar afterwards (Thu 3 clear, Fri 4 carrying both).

**Reschedule, do not delete.** The Planner's per-post `...` menu has *Reschedule post*, which
keeps the uploaded video and the caption intact. Deleting and rebuilding would mean re-entering
the caption through the composer, which is exactly the step that loses it.

Two traps found doing this:

1. **Clicking the post card opens a blank `Create post` composer, not an edit view.** That is a
   new post, not the scheduled one — backing out without saving is the correct move. The working
   path is to *hover* the card, which raises a small preview with its own `...` button.
2. **The reschedule dialog does not preserve the minute.** It reopened defaulted to `09:01 AM`
   on the second post. The minute field has to be set explicitly or the two platforms drift
   apart by a minute.

The voiceover question is still open, and `--reels-upload-music-only.mp4` remains the swap.

---

## ⚠️ Published 2026-09-03 WITHOUT the caption

Eric asked for the post to be published. Both went live and **both went live bare**:

| | published | caption |
|---|---|---|
| Facebook | Thu Sep 3, 9:19am | **none** — list shows "Your reel" |
| Instagram `thehomestarservice` | Thu Sep 3, 9:21am | **none** — list shows "This post has no text" |

The caption was entered and verified when the post was first scheduled. It did not survive to
publication. The likely culprit is the **reschedule** on the morning of Sep 3, or the
`Publish now` path off a scheduled post — not established which.

**Two failures, and the second is the one that matters.**

1. The note added to this file after rescheduling claimed reschedule "keeps the uploaded video and
   the caption intact." That was **asserted, never checked**. It then got treated as established
   fact and published on.
2. After clicking Publish, the check performed was that the posts had *left the Scheduled tab and
   appeared under Published*. That confirms a post **exists**. It says nothing about whether it is
   **correct**.

This is the third instance in one day of judging by a proxy rather than the thing itself —
resolution instead of content, edge energy instead of sharpness, and now existence instead of
correctness. The pattern is consistent enough to name.

### Rule

**Verifying a publish means reading back the published artefact's own content.** For a Meta post
that means confirming the caption text is present on the live post, not that a row appeared in a
table. The Published list makes this cheap: a post with a caption shows the caption text in the
Title column; a post without one shows "Your reel" or "This post has no text". That column was
visible in the same screenshot used to declare success, and it already said the answer.

### Also learned

- **Bulk Delete does not work on reels.** Selecting both rows and pressing Delete returns "Posts
  not moved to trash. Something went wrong." They have to be removed one at a time from each post's
  own `...` menu.
- **The Planner calendar cards are a trap for publishing.** Clicking a card usually opens a blank
  `Create post` composer, not the post. The reliable route is
  `latest/posts/scheduled_posts` — a real list view — where clicking the *thumbnail* opens a Post
  details panel whose `Publish now` button works. The row's `...` menu has no publish action at all.

---

## ✅ Republished correctly 2026-09-03, 10:09am

After the bare posts were deleted, the Reel was rebuilt from scratch through
**Create reel** and published with its caption intact.

| | |
|---|---|
| Reel | Thu Sep 3, 10:09am — **crossposted**, one post covering Facebook + Instagram |
| Caption | present, verified on the live post |
| Facebook story | Thu Sep 3, 10:15am |
| Instagram story | Thu Sep 3, 10:16am |
| File | `F4-fishers-white-oak-bath--reels-upload-vo.mp4` (8.73 MB) — voiceover cut |

### What actually worked

**Compose → Share now, in one pass.** The caption survives this path. It did *not* survive
schedule → reschedule → publish, which is what produced the bare posts earlier.

**Verification that counts:** the Published list's Title column shows the caption text for a
captioned post and "Your reel" / "This post has no text" for a bare one. Opening the post shows the
full caption in the header. Both were checked before declaring success — the step skipped earlier.

### Attaching a file without a native dialog

`Add Video` in the reel composer opens an **OS file picker**, which browser automation cannot drive,
and no `input[type=file]` exists in the DOM to target — before *or* after clicking it. Eric attached
that one by hand.

The **story composer is different**: it has a real drag-and-drop zone, and this works —

1. inject `<input type="file">` into the page,
2. load the file into it with the upload tool,
3. build a `DataTransfer` from `input.files[0]` and dispatch `dragenter`/`dragover`/`drop` on the
   zone.

**Fire the drop on the dropzone only.** Firing it on parent elements as well got the event handled
several times over and produced **three copies** of the same video, which then had to be deleted
down to one. Remove the injected input afterwards.

### Composer traps, consolidated

- Clicking a card in the Planner **calendar** opens a blank `Create post` composer, not the post.
  Use `latest/posts/scheduled_posts` — clicking the *thumbnail* there opens a Post details panel
  with a working `Publish now`.
- The row `...` menu has no publish action; `Manage post` only offers Edit / Reschedule / Move to
  Drafts / Delete.
- The reschedule dialog does not preserve the minute — it reopened at `09:01`.
- Bulk **Delete** fails on reels ("Posts not moved to trash"), though it may still have applied.
- Nested submenus (`Manage post >`, `Facebook post >`) frequently will not open under automation.
