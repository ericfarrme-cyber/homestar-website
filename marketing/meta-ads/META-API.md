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
| **System user's app role** | **done** — Partial access: **Develop app** (not Manage app) |
| **Token wizard** | **staged** — app picked, Never, 5 scopes ticked. Awaiting Eric's click |
| **Instagram assigned** | **blocked** — see below. May not matter; see the Page route |

### The app-role gap (found and fixed 2026-09-04)

The first run of **Generate token** died on:

> **No permissions available.** Assign an app role to the system user or select another app to continue.

Assigning a system user *assets* is not the same as giving it a role on the *app*. Both are needed
and the second is easy to miss, because the system user's own **Installed apps** tab has no add
button - it only fills in after a token exists. The grant lives on the other side:

**Business settings → Accounts → Apps → HomeStar Publishing → Assign people → HomeStar Publisher
(System user) → Develop app.**

**Develop app**, deliberately, not **Manage app**. Manage app is full access and can rewrite the
app's roles and settings. A credential whose whole job is to post reels has no business being able
to re-permission itself.

### Where the token wizard is parked

Staged and verified, one click from done:

| step | value |
|---|---|
| App | HomeStar Publishing |
| Expiration | **Never** |
| Permissions | `instagram_basic`, `instagram_content_publish`, `pages_manage_posts`, `pages_read_engagement`, `pages_show_list` |

All five were confirmed **by name in the list**, not by trusting the "5 options selected" counter.

**Expiration is Never on purpose.** 60 days is Meta's default and it would strand the scheduler in
early November - failing the way these always fail, silently, with a post that simply never goes
out. The cost of Never is a credential that does not self-revoke if it leaks; that is acceptable
because it is scoped to Content and Insights on one Page with **no Ads access**, and **Revoke
tokens** sits on the same screen.

**Why it is parked rather than finished.** The final button carries this:

> By clicking "Continue," you agree to **Meta Platform Terms** and **Developer Policies** as well as
> all other applicable terms and policies. You also agree to add the missing permissions to the app.

That is accepting legal terms on Eric's behalf, so it is his click - the same line I held at the
Non-discrimination policy. Four of the five scopes are not yet on the app and Continue adds them.

### The Instagram blocker

`@thehomestarservice` is in the portfolio and attached to the system user, but carries a
**"Login needed"** flag, and while it is set every permission toggle is greyed out and Save is dead.

Eric logged in on 2026-09-04 and it failed, landing on:

> **Sorry, something went wrong.** — at `business.facebook.com/page/instagram/oidclink/?code=...`

**Read the URL: the `code` parameter means the login itself succeeded.** Instagram authenticated him
and issued an authorization code; Meta then failed to exchange it and write the link. That is a
server-side fault on Meta's side, not a credential or permissions problem. Retrying the flow put the
popup in a separate browser window that could not be driven, and the flag was still set afterwards -
verified by reloading the settings page, not by trusting the redirect.

**This may not need solving.** Instagram publishing through the Graph API normally flows through the
**Facebook Page**, not through a separate Instagram asset grant:

```
GET /482409631622420?fields=instagram_business_account
```

If that returns the IG ID on the system user's token, then `POST /{ig-user-id}/media` and
`/media_publish` work with the same token and the asset assignment is redundant. Meta's own dialog
confirms the two are joined - *"the connected HomeStar Services and Contracting Facebook Page"*.
The Page is already assigned with Content. **So this is one API call to settle, not a blocker to
fight.** Test it first; only go back to the login flow if that call comes back empty.

### Deliberate permission choices

The Page was given **Content and Insights only**. Explicitly left off: Ads, Revenue, Creator content,
Creator management, Messages and calls, Community activity. Content covers publishing and reading
back what published; Insights is read-only performance. **Ads is the one that touches money and it
stays off.**

Left off the token as well: `business_management`, `pages_manage_engagement` (posting comments and
reactions), `pages_read_user_content` (reading other people's comments), and `read_insights`. If
per-post insights are wanted later, `read_insights` is the one to add - it needs a new token.

---

## What is left

### 1. Eric clicks Continue, then Generate token

The wizard is staged at **Business settings → Users → System users → HomeStar Publisher →
Generate token**. If it has timed out, re-run it with the table above.

On the last screen, **confirm it says the token never expires** before copying.

### 2. Eric puts it in the environment

```bash
setx META_PAGE_TOKEN "paste-it-here"
setx META_PAGE_ID "482409631622420"
setx META_IG_USER_ID "17841470404585555"
```

Then open a **new** terminal - `setx` does not affect the one it ran in.

### 3. I test the Page-to-Instagram route

One call decides whether the Instagram blocker matters at all.

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
