# HomeStar Automation Plan — the always-on box
### Written 2026-08-31, for the Windows mini PC arriving this week

**What this machine is:** a Windows mini PC at home running Claude Code 24/7 with Remote
Control, Dispatch, scheduled tasks, and a logged-in Chrome profile for browser automation.
Eric triggers work from his phone; scheduled tasks run unattended.

**What this document is:** the build order. Everything below is grounded in evidence already
in this repo — no generic advice. Start at section 5.

---

## What actually happens in this repo

This is not a website project. It is an autonomous SEO and marketing operation with a
documented memory system:

- `docs/seo-orchestrator.md` — a five-phase autonomous run, four completed (07-25, 08-05, 08-14, 08-26)
- `docs/autopilot-state.md` — the system's memory, written as running findings across runs
- `docs/claude-code-seo-autopilot.md` — seven tasks already specified with cadences
- `marketing/meta-ads/` — a live Meta campaign plus a scripted video pipeline

Git history shows work happening in **intense multi-day bursts**, then nothing for a week or
more. That is the pattern automation should absorb: the box keeps the drumbeat between bursts.

### Three things are stalled right now

| Stall | Evidence |
|---|---|
| August SEO report never produced | `docs/seo-report-2026-08.md` missing; TASK 4 fully specified |
| Indexing queue untouched | `docs/indexing-queue.txt` — **44 pending, 0 marked DONE** |
| Sitemap resubmit | `indexing-health-log.txt`: "STILL BLOCKED ON ERIC — now three runs running" |

---

## 1. Recurring work — scheduled

Ranked by hours saved per month. *Hours saved* and *value created* are kept separate on
purpose; conflating them would flatter the list.

### 1. Monthly SEO report + strike zone — ~2.5 hr/mo
- **When:** 1st of month, 06:00
- **Reads:** `docs/gsc-exports/<YYYY-MM>/*.csv`, prior month's folder, `docs/seo-master-plan-july-2026.md`
- **Produces:** `docs/seo-report-YYYY-MM.md` — brand vs non-brand, strike-zone table
  (non-brand, position 8–25, impressions >= 40), CTR on previously-rewritten titles,
  pages moving +/-3 positions, ranked top-5 actions
- **Why:** TASK 4 is fully written and August's report was never generated. July has 8 CSVs;
  August has only TSVs and a summary — the pipeline degraded.

### 2. AI share-of-voice sweep — ~2 hr/mo
- **When:** alternate Mondays, 07:00
- **Reads:** `docs/ai-share-of-voice-log.md` for the query set and protocol
- **Produces:** dated section appended — appearances/3, average position, competitors named,
  verbatim quotes of HomeStar content
- **Why:** the log solves its own automation. Logged-out ChatGPT accepts a prefilled query by
  URL and auto-submits. Run through `playwright-incognito` so the persistent Google profile
  cannot contaminate a "logged-out" run. The doc states outright: *"This is no longer a
  human-only task."*

### 3. Indexing queue worker — ~1.5 hr/mo
- **When:** Tue / Thu / Sat, 06:00
- **Reads:** `docs/indexing-queue.txt`
- **Produces:** 10 URLs inspected and submitted in GSC, each marked DONE with the date;
  indexed / not-indexed totals appended to `docs/indexing-health-log.txt`
- **Why:** 44 pending, zero done. A backlog nobody is working.

### 4. Review sweep — ~1 hr/mo
- **When:** Monday, 07:00
- **Reads:** GBP reviews, `docs/review-response-log.md`, `docs/houzz-review-request-kit.md`
- **Produces:** drafts in `docs/review-response-drafts.md`; a note on which completed jobs are
  due a Houzz review request
- **Why:** run #2 correctly spotted that three unreplied reviews belonged to a *different
  business*. That discrimination is worth encoding once rather than re-deriving monthly.

### 5. Post-deploy value check — ~0.5 hr/mo, highest leverage on the list
- **When:** 5 minutes after any push to main; plus a 06:00 daily sweep
- **Reads:** live URLs from `public/sitemap.xml`
- **Produces:** pass/fail on the **rendered value** of every title and meta description
- **Why:** the price-substitution bug in `scripts/build-route-heads.mjs` shipped **6 corrupted
  pages, 5 live for weeks**, and survived repeated "verified live" runs *because each grepped
  for the tag, not the value inside it*. It also invalidated the geo-disambiguation experiment,
  pushing judgment from Sep 5 to ~Sep 26. `autopilot-state.md` records this as a standing
  lesson. This check is that lesson made executable.

### 6. Ad performance watch — 0 hr saved, but ~$1,900/mo of exposure
- **When:** daily, 07:00
- **Reads:** Meta Ads Manager — 8 image ads at $50/day, plus two Reel boosts at $7/day each
- **Produces:** spend, reach, frequency, link clicks, **Website Lead** count; flags frequency
  above 2.5, zero leads after 7 days, any ad entering a Fix-error state
- **Why:** live since 2026-08-27 with **nothing watching them**. Not hours saved — a gap.

### 7. GBP weekly post — ~1.3 hr/mo, DELIBERATELY PAUSED
`gbp-post-log.txt` ends: *"weekly cadence remains PAUSED... do not resume auto-posting without
a fresh instruction."* Schedule it to **draft only**. Do not restart publishing without Eric
saying so explicitly.

---

## 2. Phone-triggered work

| Text | What the box does |
|---|---|
| **ads** | Yesterday's spend, leads, frequency per ad; flags anything wrong. The most-used one. |
| **where do we rank for `<service>` in `<city>`** | Runs the 3-run logged-out protocol on that query, appends to the log, replies with appearances/3 and who placed above us. |
| **walkthrough for `<project-slug>`** | Reviews the frames, writes a shot list, builds 9:16 and 4:5. Already a one-argument job: `python build_walkthrough.py <project>`. |
| **finished the `<name>` job** | Drafts the Houzz review request from the kit, drafts a GBP post, appends the project URL to the indexing queue. All drafts. |
| **what should I do today** | Reads `autopilot-state.md` + latest report + ad numbers; returns a ranked five with open blockers surfaced. |
| **any new reviews** | Checks GBP and Houzz, drafts replies, reports the Houzz count against the competitor benchmark. |

---

## 3. Subagents

| Name | Role | Tools | Must NOT have |
|---|---|---|---|
| **ads-watch** | Read-only Meta reporting. Reads campaign / ad-set / ad rows; extracts spend, reach, frequency, clicks, Lead conversions; compares to yesterday and the 7-day trend; flags frequency creep, zero-lead ads past learning, validation errors. Writes a dated log line, returns a phone-sized summary. Reports; never touches a control. | Browser (read), Read, Write, Bash | Publish / Boost / budget fields / on-off toggles. No `git push`. |
| **seo-analyst** | Pure data. Parses GSC exports; computes brand vs non-brand, strike zone, CTR deltas on rewritten titles, position movers, indexed trend. Writes the monthly report and a ranked action list. Decides *what* should change and hands it off. | Read, Write, Bash, Grep, Glob | No browser. No edits to `src/`. No push. |
| **indexing-worker** | GSC browser labour. Works the queue ten URLs at a time: URL Inspection, Request Indexing, mark DONE with date. Records indexed / not-indexed totals. Honours the master-plan golden rule — never resubmit an unchanged rejected page — and escalates rather than retrying a control that has already failed twice. | Browser, Read, Edit (`docs/*.txt` only) | No edits to `src/`. No push. No sitemap resubmit attempts. |
| **ai-visibility** | Runs the 3-run logged-out ChatGPT protocol per query, varying phrasing across runs. Records appearances, position, competitors, and any verbatim quote of HomeStar content. Appends to the share-of-voice log. | `playwright-incognito`, Read, Write | **Must not** use the persistent Chrome profile — the log warns it contaminates a logged-out run. |
| **content-treater** | Applies established treatments in `src/App.jsx` — `quickAnswer` / `deepContent` for city pages, `CITY_SVC_CONTENT` for service-city pages — with genuinely unique local phrasing and the real pricing bands. Runs the `@babel/parser` syntax check after every edit. Commits, does not push. | Read, Edit, Bash, Grep | No browser. **No `git push`** — a human sees the diff. |
| **video-builder** | Owns the walkthrough pipeline: reviews frames, writes the shot list, generates AI motion, frame-checks every clip at its last frame against the source, renders both formats. Rejects any clip that invents content. | Bash, Read, Write, Higgsfield | No publishing to Meta. No browser. |

---

## 4. Guardrails

**Money — always human.** Publishing ads, boosting, changing budgets, adding payment methods.
Current run rate is $64/day. Agents propose; Eric approves in writing. The environment's own
safety classifier already blocks actions near the Publish control — treat that as a feature.

**Client-facing output — draft, never publish.** GBP posts, review replies, Reel captions.
The repo already encodes this: review responses moved to drafts-only after run #1, and GBP is
explicitly paused. An agent posting under the business name is one bad sentence from damage
that cannot be withdrawn.

**Website content — verify the value, not the tag.** Non-negotiable, because it already bit.
Any agent writing meta content must re-fetch the live page and assert the rendered string, and
must fail if a meta-tag fragment or a regex substitution token appears inside a content
attribute.

**External state.** Nothing here writes a database, but `job-manager.jsx` in the separate
`my-app` project has no git history. Any agent touching it takes a timestamped backup first and
never edits it unattended.

**When unsure, an agent must:** stop, write the uncertainty into `docs/autopilot-state.md` with
what it saw and what it needs, and surface it in the run report. Never guess. Never retry a
control that has already failed twice — the sitemap resubmit is the model: two documented
attempts, then escalation.

### One change needed to the existing orchestrator

`docs/seo-orchestrator.md` says: *"You make decisions; you do not ask permission."* That was
right when scope was SEO content. It is **wrong now that money and public posting are in
scope.** Scope that sentence to Phases 2–4 and explicitly exclude anything that spends money or
publishes publicly.

---

## 5. BUILD THIS FIRST — post-deploy value check

Highest value, lowest risk, and the only item with hard evidence of the failure it prevents.
Read-only, no money, no public output, cannot break anything.

**Plan:**

1. `scripts/verify-live-heads.mjs` — read `public/sitemap.xml`, fetch every URL, parse the
   rendered `<title>` and `<meta name="description">`.
2. Assert per URL: non-empty; title at most 60 chars; description 120–160 chars; and **no
   meta-tag fragment or regex substitution token inside either value** (the exact failure from
   the August bug). Also flag any two routes sharing an identical description.
3. Exit non-zero with a table of failures.
4. Wire two ways: a 06:00 scheduled run writing `docs/head-health-YYYY-MM-DD.md` that only
   notifies on failure, and `npm run verify:heads` for manual use after a deploy.
5. Backfill once against all ~238 live URLs to set a clean baseline. A clean result is itself
   proof the August fix held.

Roughly an hour to build. Runs forever.

**Then, in order:**

1. **ads-watch** — daily, read-only, protects live spend
2. **seo-analyst** — recovers the missing August report
3. **indexing-worker** — clears the 44-URL backlog

---

## Two decisions still open

1. **May `ads-watch` pause an ad on its own** — if frequency spikes or spend runs with zero
   leads — or should it only ever report?
2. **Resume the GBP weekly cadence as drafts?** The log says not to restart without fresh
   instruction, so it stays off until Eric says otherwise.

---

## Standing item, unrelated to automation

**Houzz remains the ranking mechanism blocking AI citations.** `autopilot-state.md` run #4:
every firm placed above HomeStar in bathroom and kitchen runs was justified with a Houzz
citation, while HomeStar was justified from its Google listing. HomeStar has roughly 1–2 Houzz
reviews against a competitor's 100+. No automation fixes this; it needs review requests to real
customers. The kit is written and ready at `docs/houzz-review-request-kit.md`.
