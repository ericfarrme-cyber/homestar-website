# Posting to Meta through the Graph API

What it takes, what it fixes, and what it does not. Written 2026-09-04.

---

## First, the honest framing

**The approval model Eric chose — I schedule, he glances, it publishes — already works today**
through Business Suite. The API does not unlock that. What it fixes is *reliability*.

Every one of these happened in a single afternoon of driving Business Suite by browser:

- clicking a scheduled post opened a **blank Create post composer**, not the post
- the reschedule dialog silently changed **9:00 to 9:01**
- the caption field renders at **zero width** until media is attached, and swallows typing
- a caption entered and verified on one step was **gone by the next**
- two reels **published with no caption at all** and had to be deleted and redone
- bulk Delete on reels fails with "Posts not moved to trash" — but sometimes deletes anyway

All survivable while a human is watching. None safe on a timer. That is the case for the API, and
it is the only case — the workflow stays the same.

---

## Two constraints worth knowing before you start

**1. Instagram's API cannot schedule.** Facebook's can: a Page post takes
`published=false` plus a `scheduled_publish_time` and Meta holds it. The Instagram Content
Publishing API has no equivalent — you create a media container and publish it, immediately. To
schedule Instagram, *something of ours* has to fire at the right minute. That is what the mini PC in
`docs/automation-plan.md` is for.

**2. Instagram fetches the video from a public URL.** It will not accept an upload from disk the way
Facebook's resumable endpoint does. The reel has to sit at an address Meta's servers can reach for
the minute or two it takes them to pull it. Simplest option is a path on the existing Vercel site;
it costs nothing and needs no new service, but it does mean the file is briefly public.

Neither is a blocker. Both change the shape of the thing, so better known now than discovered later.

---

## Progress — 2026-09-04

### IDs (none of these are secrets; only the token is)

| | |
|---|---|
| App ID | `1077386074681616` |
| Business portfolio ID | `1099391968256327` |
| Facebook Page ID | `482409631622420` |
| Instagram user ID | `17841470404585555` |
| System user ID | `61593697727654` |

### State

| step | state |
|---|---|
| Developer account | **done** |
| App "HomeStar Publishing" | **done** — in development, Eric Farr portfolio |
| Use cases | **done** — Instagram content + Page management |
| App Review | **not required** — Meta reported no requirements |
| System user "HomeStar Publisher" | **done** — Employee access |
| **Facebook Page assigned** | **done** — Partial access: **Content and Insights** |
| **Instagram assigned** | **blocked** — attached to the system user, but "Nothing assigned yet" |
| Token generated | **not started** |

### The Instagram blocker

`@thehomestarservice` is in the portfolio and attached to the system user, but carries a
**"Login needed"** flag:

> Log in for settings that let you give people, partners and **apps** access to manage the
> @thehomestarservice Instagram profile

With that flag set, every permission toggle in **Manage assignments** is greyed out and Save is
inactive. It is not a permissions problem or a wrong-portfolio problem - Meta simply will not let
apps be granted access to that profile until someone logs into Instagram from Business settings.

**Eric has to do this**, at Business settings → Instagram accounts → @thehomestarservice → **Log in**.
It needs Instagram credentials, which I do not handle.

Once logged in, the toggles unlock and Instagram needs **Content** on, matching the Page. Leave
**Ads** off on both - nothing in this integration should be able to spend.

### Deliberate permission choices

The Page was given **Content and Insights only**. Explicitly left off: Ads, Revenue, Creator content,
Creator management, Messages and calls, Community activity. Content covers publishing and reading
back what published; Insights is read-only performance. **Ads is the one that touches money and it
stays off.**

## What you need to create

I cannot do any of this part — it involves creating an app and generating a credential.

### 1. Confirm the Instagram account is a Business account linked to the Page

`thehomestarservice` almost certainly is already, since it appears in Business Suite alongside the
Page. Worth confirming in **Instagram → Settings → Account type and tools**.

### 2. Create a Meta app

**developers.facebook.com → My Apps → Create App → type: Business.** Name it something like
"HomeStar Publishing". It does not need to be public and **does not need App Review** for our
purposes — see below.

### 3. Create a System User token, not a user token

Business Manager → **Business settings → Users → System users → Add**. Give it Admin access, then
**Assign assets**: the HomeStar Facebook Page and the Instagram account, both with full content
permissions.

Then **Generate new token**, select the app from step 2, and tick these scopes:

| scope | for |
|---|---|
| `pages_show_list` | finding the Page |
| `pages_read_engagement` | reading back what published |
| `pages_manage_posts` | creating and scheduling Page posts |
| `instagram_basic` | reading the IG account |
| `instagram_content_publish` | publishing reels and stories to IG |

**Use a System User token rather than a personal one.** A user token expires in an hour, or sixty
days if you exchange it. A System User token does not expire, which is the entire point if this is
to run on a schedule.

### 4. App Review is not required here

`pages_manage_posts` and `instagram_content_publish` normally need App Review — but only for apps
acting on assets belonging to *other* people. An app in Development mode, operated by someone with
an admin role on the Page and the app, can act on its own assets without review. That is exactly our
case.

---

## How the token gets handled

**I will not store, read, print or commit the token.** The integration will read it from an
environment variable and nothing else:

```bash
setx META_PAGE_TOKEN "paste-it-here"
setx META_PAGE_ID "the-page-id"
setx META_IG_USER_ID "the-instagram-user-id"
```

Set those once in a terminal on your machine. Scripts I write reference `os.environ[...]`, so the
value passes from your environment to Meta without ever appearing in the repo, in a log, or in our
conversation. If you ever paste a token into chat, revoke it and generate another — that is the
correct response, not a reason for embarrassment.

The Page ID and IG user ID are not secrets and can live in the repo; only the token is sensitive.

---

## What I would build against it

1. **`meta_publish.py`** — one command that takes a reel key from `POSTING-QUEUE.md`, uploads the
   video, attaches the caption, and creates a Facebook post scheduled for a given time.
2. **Read-back verification, built in.** After every call, fetch the created post and assert the
   caption is present and matches. That single check is what would have caught the two bare reels
   before they were live, and it is the whole reason to prefer the API.
3. **An Instagram runner** for the mini PC — holds the container, publishes at the scheduled minute,
   and reports back.
4. **A dry-run mode** that prints exactly what would be sent and posts nothing, so a schedule can be
   reviewed before it exists.

## Rough effort

| | |
|---|---|
| Your setup (steps 1-4 above) | 20-30 minutes, once |
| Facebook publish + verify | half a day |
| Instagram publish | half a day, plus the hosting decision |
| Scheduler on the mini PC | depends on that box being up |

## What does not change

Boosting, ad spend and budget stay manual and stay yours. The API makes publishing reliable; it does
not make spending decisions, and nothing here should be wired to a card.
