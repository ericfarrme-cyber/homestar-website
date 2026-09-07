# SEO report — September 2026

Pulled live from Search Console on 2026-09-07, covering **6 June – 5 September 2026**
(`sc-domain:thehomestarservice.com`, Web).

This is the first report the pipeline has actually produced. TASK 4 has been written since July
and no report exists for July or August, so there is no prior-month comparison in here — the
numbers below are a baseline, not a trend.

## Headline

| metric | 3 months to 5 Sep |
|---|---|
| Clicks | **439** |
| Impressions | **84,800** |
| Average CTR | **0.5%** |
| Average position | **16.1** |

**The whole story is in the gap between those middle two rows.** 84,800 impressions is real
visibility — Google is showing the site constantly. 439 clicks against it is not. A 0.5% CTR at an
average position of 16.1 is the signature of ranking on the second page for nearly everything:
seen, never clicked.

For scale, holding impressions flat and moving average position from 16 to 8 would plausibly take
CTR to 2–3%, which is 1,700–2,500 clicks a quarter instead of 439. Nothing else in the marketing
plan has that multiple available to it.

## Brand versus non-brand

Top ten queries by clicks:

| query | clicks | impressions | type |
|---|---|---|---|
| homestar services and contracting | 77 | 306 | brand |
| homestar services | 29 | 77 | brand |
| homestar contracting | 11 | 105 | brand |
| kerdi board vs cement board | 5 | 488 | **non-brand** |
| bathroom remodel fishers | 3 | 144 | **non-brand** |
| home star | 3 | 30 | brand |
| homestar construction | 3 | 19 | brand |
| home star services | 3 | 10 | brand |
| homestar renovations | 2 | 112 | brand |
| basement finishing calculator | 2 | 70 | **non-brand** |

Roughly **128 of 439 clicks — about 29% — come from people typing the company name.** Those are
people who already knew about HomeStar; search only routed them. The genuinely new-customer clicks
are the non-brand rows, and they are tiny.

Two of the three non-brand entries are informational, not commercial: *kerdi board vs cement board*
(488 impressions, 5 clicks) is a tradesperson's question, and *basement finishing calculator* is a
tool-seeker. The one commercial query in the top ten — *bathroom remodel fishers* — took 3 clicks
from 144 impressions.

## What this means alongside the AI result

The 2026-09-07 ChatGPT sweep put HomeStar in 11 of 12 answers, usually in the top three. Google
puts the site at position 16.1.

That divergence is the single most useful fact in this report. An AI assistant reads the site,
the reviews and the certifications and concludes HomeStar is one of the best three choices in
Fishers. Google's ranking does not reflect that yet. The content is persuasive; its search
authority is not.

## Blockers in the pipeline itself

1. **No September exports.** `docs/gsc-exports/` has `2026-07` and `2026-08` only, and August is
   TSVs plus a summary rather than the eight CSVs July had. The strike-zone table — non-brand,
   position 8–25, impressions ≥ 40 — cannot be built from the UI alone and needs those exports.
2. **The indexing queue has never been worked.** `docs/indexing-queue.txt` holds 42 URLs and zero
   are marked DONE. Pages that are not indexed cannot rank at any position.
3. **No prior report to compare against**, so "moving up or down" is unanswerable until October.

## The ranked actions

1. **Work the indexing queue.** 42 URLs, none submitted. This is the cheapest possible win and it
   gates everything else — an unindexed page has no position to improve.
2. **Get the September CSV exports** so the strike zone can actually be built. Everything in
   positions 8–25 with real impressions is one improvement away from page one, and right now we
   cannot see that list.
3. **Fix the listings problem, which is not an SEO task.** Twelve ChatGPT runs rendered four or
   five Google business cards each and HomeStar appeared in none of them. That is Google Business
   Profile and Bing Places, and no amount of on-site work touches it.
4. **Houzz.** Competitors are being cited *through Houzz* by name and review count — 62, 77 and 122
   reviews against HomeStar's 5. See the AI log entry for the verbatim quotes.
