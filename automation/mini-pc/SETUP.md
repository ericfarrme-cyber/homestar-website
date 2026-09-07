# Mini PC setup — from bare Windows to running

This takes the always-on box from a fresh Windows install to running HomeStar's marketing
automation unattended. Work top to bottom; each part assumes the one above it is done.

`docs/automation-plan.md` is the *what and why* — which jobs are worth automating, what each
subagent may and may not touch, and in what order to build them. **This document is the
*how*.** Read the plan once before starting; you do not need it open while working.

Budget about 90 minutes, most of it waiting on installers.

---

## Before you start

Have these to hand. Every one of them blocks a later step.

| You need | Where it is | Used for |
|---|---|---|
| The Meta token | `marketing/meta-ads/.token` on your current PC | Publishing reels to Instagram |
| Your Google account | — | Search Console, Google Business Profile |
| Your Meta login | — | Ads Manager, Business Suite |
| The GitHub repo | `ericfarrme-cyber/homestar-website` (public) | Everything |

**The token is the only secret that has to move by hand.** It is gitignored on purpose, so it
is not in the clone and never will be. Copy it on a USB stick or paste it into a file on the
box — do not email it to yourself.

---

## Part 1 — Windows, so the box stays awake

An always-on box that goes to sleep is a box that silently stops working. Three settings, in
an **Administrator** PowerShell:

```powershell
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
powercfg /change monitor-timeout-ac 15
powercfg /hibernate off
```

Never sleep, never hibernate, screen off after 15 minutes. The screen turning off is fine —
that does not suspend anything.

**Then set the machine to log in automatically.** This matters more than it looks, and Part 5
explains why: any job that drives a browser needs a real logged-in desktop session to draw
into. Run `netplwiz`, untick *Users must enter a user name and password*, enter the password
once.

That does mean anyone with physical access to the box is logged in as you. It sits at home, so
that is a reasonable trade — but it is a real one, so make it knowingly.

---

## Part 2 — Software

Install in this order. Tick **"Add to PATH"** on every installer that offers it.

1. **Python 3.12+** — https://python.org/downloads — tick *Add python.exe to PATH*
2. **Node.js LTS** — https://nodejs.org — needed for the website build and its checks
3. **Git** — https://git-scm.com/download/win
4. **Google Chrome** — the browser jobs use a real signed-in profile
5. **Claude Code** — https://claude.com/claude-code

Verify all five in a **new** terminal (PATH changes need a fresh one):

```powershell
python --version; node --version; git --version; claude --version
```

Four version numbers means Part 2 is done. A "not recognized" error means that installer did
not add itself to PATH — reinstall it rather than fighting PATH by hand.

**Nothing needs `pip install`.** The automation scripts use only the Python standard library.
That is deliberate: no dependency can rot on an unattended box.

---

## Part 3 — The repo and the token

```powershell
mkdir C:\homestar
cd C:\homestar
git clone https://github.com/ericfarrme-cyber/homestar-website.git
cd homestar-website
```

`C:\homestar` rather than `Documents\GitHub` on purpose — this box's copy is not synced to
OneDrive. Two machines syncing the same git working tree through OneDrive corrupts it.

Now put the token in place. Paste its contents into:

```
C:\homestar\homestar-website\marketing\meta-ads\.token
```

It must be the token text alone — no quotes, no `META_PAGE_TOKEN=`, no trailing blank line.
`.gitignore` already covers `.token` and anything else matching `.*token*`, so it cannot be
committed by accident.

**Sign Chrome in, once.** Open Chrome on the box and sign in to Google (Search Console access)
and to Meta. Leave it signed in. Browser jobs reuse this profile — that is the entire reason
this box exists rather than a cloud runner.

---

## Part 4 — Prove it works before you trust it

```powershell
cd C:\homestar\homestar-website\automation\mini-pc
python check-setup.py
```

This checks the things that actually break: Python's version, the repo, whether the token is
present *and still valid with Meta*, whether the reel queue parses, and whether each queued
video is reachable at its public URL. It publishes nothing.

Fix anything it reports before continuing. A green run here is the difference between a box
you can leave alone and one you have to keep checking.

---

## Part 5 — Scheduled tasks

```powershell
# Administrator PowerShell
cd C:\homestar\homestar-website\automation\mini-pc
.\register-tasks.ps1
```

Then confirm in Task Scheduler (`taskschd.msc`) that the tasks exist under **HomeStar**.

### The one thing to understand about these tasks

Task Scheduler offers *Run whether user is logged on or not*. It sounds strictly better. It is
not, and picking it wrongly is the classic way these setups fail silently:

- **Jobs with no browser** — the Instagram publisher — run fine unattended. They are registered
  that way.
- **Jobs that drive Chrome** need a real desktop session to render into. Run them
  "whether logged on or not" and they execute in a session with **no display**, where a browser
  window has zero width and height. Pages load and lay out to nothing.

This is not theoretical. On 2026-09-07 exactly this cost us: Ads Manager was open in a logged-in
Chrome, but the window was minimised, so its table rendered **one row — the header** — and the
boosted-reel numbers could not be read at all. A minimised window and a session with no display
fail the same way.

So: browser jobs run **only when the user is logged on**, which is why Part 1 sets auto-login.

---

## Part 6 — What runs, and when

Registered by `register-tasks.ps1` today:

| Task | When | What it does | Browser? |
|---|---|---|---|
| `HomeStar\InstagramReels` | Daily 09:00 | Publishes any reel due from `ig-queue.json` | No |

That is deliberately short. **A scheduled task that runs a job which does not exist yet is
worse than no task at all** — it fails nightly, you learn to ignore the failures, and then you
ignore a real one. The rest get registered as they are built, one line each in the script.

The reel publisher is safe to run daily even though reels are Monday and Friday only: it reads
the queue, finds nothing due, and exits. It also refuses to post a reel that is already on the
account, so an extra run can never double-post.

---

## Part 7 — What this box must never do on its own

From `docs/automation-plan.md` section 4. These are not preferences.

**Money is always human.** Publishing ads, boosting, changing budgets, adding a payment method.
Run rate is roughly $64/day. Agents propose; you approve in writing.

**Client-facing output is drafted, never published.** Google Business Profile posts and review
replies are drafts. GBP weekly posting is **explicitly paused** and must not be resumed without
you saying so in fresh words. An agent posting under the business name is one bad sentence away
from damage that cannot be withdrawn.

Reel captions are the deliberate exception: they are written and reviewed in advance, in the
repo, and the publisher posts exactly what was approved. It composes nothing.

**Website content — verify the value, not the tag.** Any job writing meta content must re-fetch
the live page and assert the *rendered string*. A previous check grepped for the tag rather than
what was inside it, and shipped six corrupted pages, five of them live for weeks.

**When unsure, stop.** Write the uncertainty into `docs/autopilot-state.md` with what was seen
and what is needed, and surface it. Never guess, and never retry a control that has already
failed twice.

---

## Part 8 — What to build next

Setup is done at Part 6. This is the build order from the plan, highest value first.

1. **Post-deploy head check** — `scripts/verify-live-heads.mjs`. Fetch every URL in
   `public/sitemap.xml`, assert the rendered title and description are present, correctly
   sized, free of markup fragments, and not duplicated across routes. Read-only, spends
   nothing, publishes nothing, and it is the executable form of the lesson above. About an
   hour. The plan says build this first and it is right.
2. **ads-watch** — daily read-only Meta reporting. Protects live spend. *Blocked:* the ad
   account is not in the business portfolio and the token has neither `ads_read` nor
   `read_insights`, so this cannot be built until that is resolved.
3. **seo-analyst** — parses the Search Console exports and produces the monthly report.
4. **indexing-worker** — works the 44-URL queue ten at a time.

---

## Troubleshooting

**A task shows 0x1 in Task Scheduler.** It ran and the script exited non-zero. Run the same
command by hand in a terminal to see the actual error — Task Scheduler never shows you output.

**"No token" from a script.** `.token` is missing, empty, or has quotes or a variable name in
it. It is the raw token text and nothing else.

**Meta calls fail with an OAuth error.** The token was regenerated somewhere else and this copy
is stale. Regenerating in Business Settings invalidates the previous token everywhere. Paste
the new one over `.token` on every machine that has it.

**A browser job sees an empty page.** Almost always the session problem in Part 5 — the task is
set to "run whether logged on or not", or the box is not auto-logging-in, or the window is
minimised. Check that first; it is far more often this than the site.

**Reels did not post.** Run it by hand and read what it says:

```powershell
python C:\homestar\homestar-website\marketing\meta-ads\ig_publish.py --dry-run
```

It prints every queued reel and why it is or is not due. `--force F9` publishes one entry
immediately, which is how a missed reel gets caught up.
