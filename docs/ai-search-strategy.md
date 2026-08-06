# How HomeStar Wins AI Search
_Written 2026-08-05, grounded in the 12-run logged-out ChatGPT protocol, GSC data, GBP insights, and the Houzz audit._

---

## The finding that should reframe everything

Across 12 logged-out ChatGPT runs, the sources actually cited were **Houzz, Reddit, Angi, and BBB.**

**thehomestarservice.com was cited zero times.**

Meanwhile ChatGPT quoted HomeStar's **Google reviews verbatim** — "communication, staying on schedule,
clean job sites," "projects finishing on or ahead of schedule."

That is the whole strategic picture in two facts. **AI search does not rank your pages. It retrieves
and synthesizes an entity from third-party corpora, then quotes the language it finds there.** For a
local service business, your website is mostly a conversion asset and a consistency signal — it is not
the thing being quoted.

We have spent two runs building excellent first-party content. It was necessary and it will help
conventional search. But it is not what wins AI search, and continuing to pour effort there has
sharply diminishing returns.

---

## Where we actually stand

| Query | Result | Read |
|---|---|---|
| Overall remodeler, Fishers | **3/3, #1** | Our crown jewel. Defend it. |
| Bathroom remodeler | 3/3, avg 2.3 | Strong. ~8 leads/week. Defend it. |
| Basement finishing | 3/3, avg 5.7 | Present but mid-pack. Winnable. |
| Kitchen remodeler | **0/3** | Absent entirely. |

---

## The five plays, ranked by evidence and leverage

### 1. Engineer the review corpus — PROVEN, highest ROI
ChatGPT demonstrably quotes our reviews. That means **the content of our reviews determines what we
get recommended for.** Right now the corpus says *bathroom, schedule, communication* — and that is
precisely what ChatGPT recommends us for. The system is working exactly as designed; we've just never
aimed it.

**The fix is not manipulation — it's asking a specific question instead of a generic one.** A request
that says "if you have a minute, would you mention which room we did and how the scheduling went?"
produces honest reviews that happen to contain the words we need retrieved. A generic "please leave us
a review" produces "great job, highly recommend," which is useless to a retrieval system.

Priorities for what reviews should naturally mention: **the room** (kitchen especially), **the city**,
and **multi-room scope** ("they did our kitchen and both bathrooms").

### 2. Fix the platform distribution — PROVEN competitor mechanism
**78 Google reviews / 1 Houzz review** is a badly distributed portfolio. Everything Home beats us in
every query with **fewer** Google reviews than us and **100+ on Houzz**. Houzz was the most-cited
source in the entire data set.

This is the cheapest gap on the board. Ten to fifteen Houzz reviews changes our retrievability more
than another twenty pages of content would.

### 3. Reddit — observed, untapped, and it must be done honestly
Reddit was cited in **4 of 12 runs**, naming Nicholas Design Build, MJ Woodstone, Fishers Fixer Upper,
CMH Builders, and Centennial Construction. We appear in none of it.

**The only acceptable play here is genuine participation with disclosed affiliation.** Answer real cost
questions in r/Indianapolis and local subs with our actual pricing data, and say plainly that we're a
Fishers contractor. Our cost breakdowns are genuinely the most specific local data available — that is
real value to a homeowner asking, not spam.

**Do not astroturf.** Fake or undisclosed recommendations are dishonest, they violate Reddit's rules,
and they are catastrophic to a local reputation when discovered. The upside is not worth it and it is
not who HomeStar is.

### 4. Pick a fight we can win — the most important strategic call here
Kitchen is a **bad head-on fight.** Chateau Kitchens has **295 reviews** and owns "established kitchen
specialist." MJ Woodstone beats us with 21 reviews because they are *categorised* as a kitchen and bath
company. We would be fighting on their terms with a corpus that says "bathroom."

**But look at what nobody owns:** "one contractor for the whole project," "whole-home renovation,"
"multi-room remodel," "kitchen and bath together." Our genuine structural advantage — a licensed GC
with plumbers *and* electricians in-house — is the actual answer to those queries, and no competitor
has claimed them. We're already 3/3 at #1 for the closest existing query.

**Recommendation: stop attacking "best kitchen remodeler" and own "best contractor for a multi-room /
whole-home renovation."** Kitchen then arrives as a byproduct — a homeowner doing a kitchen *and* a
hearth room *and* flooring is our ideal client anyway, and a bigger job than a kitchen-only bid.

### 5. Become a cited data source
ChatGPT quoted **Angi's** basement pricing ($30–80K) over ours ($45–200K+) despite our cost report,
calculator, and four articles. Angi gets cited because Angi is an established entity, not because their
number is better.

To get our numbers quoted, they need to appear **somewhere other than our own site**: BAGI, the OneZone
chamber, local press, contractor directories. Third-party repetition is what makes a figure quotable.
Pitching "2026 Hamilton County remodeling cost data" to a local outlet is worth more than another
self-published guide.

---

## What to stop doing
- **Writing more city-service pages for kitchen.** The 0/3 result is not a content deficit. Nine more
  kitchen pages will not produce a single AI citation.
- **Treating the website as the AI-search surface.** It is the conversion surface. Different job.
- **Judging AI position from single runs.** Two of four July baselines were wrong. Three runs minimum.

## What to protect
- **#1 for overall remodeler (3/3).** Most valuable position we hold.
- **The GBP primary category.** Bathroom drives ~8 leads/week. Not worth risking for kitchen.
- **The review response habit.** Every review answered, in our voice, is corpus we control.

---

## Honest uncertainty
- These are inferences from **one** 12-run protocol. Directionally strong, but re-measure monthly.
- We know Houzz and Reddit get *cited*; we don't know their exact weighting.
- `llms.txt`, schema tweaks, and similar "AI SEO" tactics are **unproven**. Cheap to add, but no
  evidence they move anything. Do not let them displace review work.
- ChatGPT's retrieval changes without notice. The protocol is how we find out, not a one-time answer.

## The one-sentence version
**Our content is already good enough; our corpus isn't — so spend the next quarter on reviews,
platforms, and third-party citation rather than on pages.**

---

# Execution log — the whole-home position

## Shipped 2026-08-05

**`/whole-home-renovation`** — the missing pillar. Seven service pages existed and none covered the
differentiator we're actually #1 for. 10 AI-citable FAQs aimed at the questions where "one contractor"
*is* the answer. Cost section deliberately prices as the sum of published per-room bands rather than
inventing a whole-home range.

**`/guide/renovation-sequencing-guide`** — the asset no contractor in this market publishes. Sequencing
is what actually decides a multi-room budget and whether a family can stay in the house, and nobody
writes about it because it isn't the fun part. Includes a section titled **"When You Should NOT Hire
One Contractor."** That candor is the point: it is genuinely useful, it is hard to copy without
knowing the work, and being the source that tells the truth is exactly what gets quoted.

**`/tools/renovation-sequence-planner`** — select rooms and conditions, get the real construction
sequence with phase durations, what's out of service when, and why each phase sits where it does. The
living-in-the-house toggle materially changes the plan (bathrooms stagger so one always works).
Engine verified across **1,024 room/condition combinations** asserting real construction constraints.

**Distribution:** whole-home added to the homepage service grid and footer; every city page now links
into the pillar from its Quick Answer; sitemap 229 → 232; IndexNow submitted.

## Why these three, specifically

The 3,488 impressions already sitting on the home-remodeling city pages at positions 18–25 had nowhere
to go — no pillar, no tool, no supporting content. The category was being searched and we had nothing
to receive it with.

More importantly, these are **corpus assets, not page assets.** A sequencing guide that answers "what
order should I remodel in" and "can I live in my house during a renovation" is the kind of thing that
gets retrieved and quoted, because it is specific, useful, and almost unopposed. Nine more city-service
pages would not have moved a single AI citation.

## Still to do on this position
1. **Rewrite the 9 home-remodeling city pages** around multi-room rather than generic remodeling —
   that is where the existing impressions are. *(Next.)*
2. **Steer reviews toward multi-room language.** "They did our kitchen and both bathrooms" is the single
   most valuable sentence a reviewer could write for this position. Same lever as the Houzz reviews.
3. **Eric's real whole-home project range** — the pillar deliberately does not invent one.
