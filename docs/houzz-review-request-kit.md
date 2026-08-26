# Houzz Review Request Kit
### Everything needed to take Houzz from 2 reviews to ~15 in one sitting
_Created 2026-08-26 (Run #4), after the 12-run ChatGPT sweep proved Houzz is the ranking mechanism._

---

## Why this is the #1 item

Across 12 logged-out ChatGPT runs on 2026-08-26, **every firm that outranked HomeStar in bathroom and
kitchen answers was justified with a Houzz citation.** HomeStar was justified from its Google listing
every time — while holding **80 Google reviews, the most of any firm named.** Volume is not the
blocker. The platform is.

**The bar is lower than it looks.** Nicholas Design Build earns a cited slot *above* HomeStar on
**15 Houzz reviews**; ACo on **17**. Not Everything Home's 122. Target is **~15**.

**And it demonstrably works at n=2.** In basement run 2, the sentence that put HomeStar in first
place was sourced to Houzz: *"A July 2026 customer specifically reported having a basement remodeled
with a bar and entertainment area."* Two reviews are already being quoted.

---

## The mechanism — do NOT write 14 individual emails

Houzz has a built-in request tool. It takes a comma-separated list of email addresses and one shared
message, and emails each person a direct write-a-review link.

**URL:** https://www.houzz.com/requestForReview/homestarservicesandcontracting

- One field: *"Enter client email addresses, separated by commas."*
- One message box (pre-filled with a generic default — replace it, see below)
- A reCAPTCHA, so this has to be a human sitting at the keyboard. **Eric sends this, not automation.**

Houzz's own guidance on the page: *"Details are key. Ask your reviewers to include photos of
construction and the finished space, and to comment specifically on your contributions."*

Requests already sent are tracked under the **"Past Review Requests"** tab, so a second batch later
will not double-send blindly.

---

## Who to ask, in priority order

Pull from clients who **already left a 5-star Google review** — they have proven willingness, so this
is a re-ask on a new platform, not a cold request.

Prioritise in this order, because it fixes the weakest categories first:

1. **Kitchen clients.** Kitchen is 3/3 present but placed last in every run. The corpus reads as
   bathroom-and-basement, which is exactly how ChatGPT categorises the business.
2. **Multi-room / whole-home clients.** Only one genuinely multi-room project is published. Review
   language saying *"they did our kitchen and both bathrooms"* is portfolio evidence that costs
   nothing to produce.
3. **Carmel, Westfield and Zionsville clients — any room.** AI visibility is Fishers-only. City
   association has to come from the review corpus, because the map pack tracks physical presence and
   that is not winnable with content.
4. Everyone else with a 5-star Google review.

Aim for **13+ sends** to land ~15 total. Expect some non-response; over-ask rather than under-ask.

---

## The message — paste this over Houzz's default

> Hi — Eric from HomeStar Services & Contracting.
>
> You were kind enough to leave us a review after your project, and I have a small favour to ask.
> We're building out our profile on Houzz, which is where a lot of Hamilton County homeowners start
> when they're looking for a remodeler, and we've only got a couple of reviews there so far.
>
> If you have five minutes, would you post a version of your review on Houzz as well? The link below
> goes straight to it.
>
> Three things that genuinely help someone deciding:
>
> - **Name the room and your town** — "our Carmel kitchen", "the basement in Westfield". It's how
>   people searching for that exact work actually find us.
> - **Add a photo or two** of the finished space if you have any handy. Houzz is a visual site and
>   photos get read far more than text alone.
> - **Say what the project was actually like to live through** — the schedule, the crew, how problems
>   got handled. That's what people are really trying to find out.
>
> Write it however you found it — I'm asking for your honest experience, not a particular verdict.
>
> Thank you either way. The early projects are what got us here.
>
> — Eric

### Rules this message deliberately follows
- **No incentive of any kind.** Offering anything for a review violates Houzz and Google policy and
  can get reviews stripped and the profile penalised.
- **No rating steering.** It asks for an honest review, not a 5-star one. Review gating is a
  policy violation and it is also the thing that makes a review corpus read as fake.
- **It asks for room + town** because that is the specific gap: category and city association.
- **It asks for photos** because Houzz's own algorithm and readers weight them.

---

## After sending

1. Note the date and count here so the next run can measure.
2. Re-check the live profile in ~2 weeks: https://www.houzz.com/pro/homestarservicesandcontracting
3. Re-run the 3-run kitchen protocol once the count passes ~10 and compare against the 2026-08-26
   baseline in `docs/ai-share-of-voice-log.md`. If the Houzz thesis is right, HomeStar should move
   off "one more I'd get a quote from" and into the named shortlist.

## Log
| Date | Requests sent | Houzz review count after |
|---|---|---|
| 2026-08-26 | — (kit created) | **2** |

---

## Pulling the client list out of PMHub

Client data lives in the PMHub Supabase project (`C:\Users\ericf\my-app`). **The `jobs` table is
`(id, data)` — every field is a key inside a JSONB blob**, not a real column. The app reads it as
`{ id: r.id, ...r.data }`. Selecting `client_name` directly fails with `42703 column does not exist`;
use `data->>'client_name'`.

Run in the Supabase SQL editor, set the row limit to **No limit**, export CSV:

```sql
select
  data->>'client_name'  as client_name,
  data->>'client_email' as client_email,
  data->>'address'      as address,
  data->>'city'         as city,
  data->>'status'       as status
from jobs
where data->>'company' = 'homestar'
  and data->>'status'  = 'Complete'
  and coalesce(trim(data->>'client_email'), '') <> ''
order by data->>'city', data->>'client_name';
```

To confirm key names without exposing any client data:

```sql
select key, count(*) as jobs_with_key
from jobs, lateral jsonb_object_keys(data) as key
group by key order by key;
```

### Non-obvious filters
- **`company = 'homestar'` is required.** HCC is the concrete/patio business; those clients have no
  experience of the remodeling work this Houzz profile represents.
- **`backups/*.json` in PMHub are LEADS, not jobs.** Prospects who may never have hired us. Wrong list.
- **Dedupe by email** — repeat clients have multiple job rows.
- `status = 'Complete'` is the last value in `JOB_STATUSES`
  (`Bidding, In Design, Pending Schedule, Scheduled, In Progress, Punch List, On Hold, Complete`).

### Credentials
There is no `.env` in the PMHub repo; `SUPABASE_SERVICE_ROLE_KEY` lives in Vercel. **Do not
`vercel env pull` just to read email addresses** — that key bypasses every RLS policy in
`SECURITY_RLS_DESIGN.md` and would then sit on disk. Eric runs the query in the SQL editor instead.

### Who sends
**Eric.** The Houzz request form has a reCAPTCHA, so the send cannot be automated, and this is
outbound contact with real clients either way. Claude assembles and prioritises the list; Eric
reviews it and presses send.
