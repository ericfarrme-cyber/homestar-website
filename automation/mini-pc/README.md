# Mini PC kit

Everything needed to take the always-on box from a fresh Windows install to running
HomeStar's marketing automation unattended.

**Start with [SETUP.md](SETUP.md).** Work it top to bottom; it assumes nothing.

| file | what it is |
|---|---|
| `SETUP.md` | the guide — Windows settings, software, repo, token, scheduled tasks, guardrails |
| `check-setup.py` | preflight. Proves the box works before you trust it. Publishes nothing |
| `register-tasks.ps1` | creates the Task Scheduler entries. Idempotent — re-run to apply changes |

## What is not in here

**The Meta token.** It lives at `marketing/meta-ads/.token`, is gitignored, and is not in
this repo or in any copy of this folder. It has to be moved to the box by hand — SETUP.md
Part 3 says how.

**The reel videos.** Instagram pulls each one from its public URL in the repo, so there is
nothing to copy or host.

## Related

- `docs/automation-plan.md` — the *what and why*: which jobs are worth automating, what each
  subagent may touch, and in what order to build them. This folder is the *how*.
- `marketing/meta-ads/META-API.md` — how the Meta and Instagram publishing actually works,
  including why Instagram needs its own scheduler at all.
