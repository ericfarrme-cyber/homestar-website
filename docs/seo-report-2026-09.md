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

---

# Addendum, same day — three findings that change the action list

## 1. The indexing queue is the wrong instrument

Checked before submitting anything. 222 pages indexed, 72 not, and the bucket that
matters is **28 "Crawled – currently not indexed" with validation already FAILED**.
"Discovered – currently not indexed" is zero and the sitemap was last read 3 Sep, so
discovery works. Google has seen these pages and declined them.

Root cause measured on the prerendered HTML. **The first measurement here was wrong**
and is corrected below: the nine `home-remodeling-<city>` pages are 54% similar, not
93–96% — that figure came from `quick_ratio`, which compares character counts rather
than sequences. Re-measured with `SequenceMatcher.ratio` on main content, the real
duplication sits elsewhere: **flooring-by-city at 91% across ten pages, and the 72
service-by-city pages at 82%**, all shorter than the hubs. The city hubs are the
strongest programmatic pages on the site, not the weakest. Around 165 of the 240
sitemap URLs are programmatic location or service-by-city pages.

Re-submitting cannot overturn a quality judgement — the failed validation is that
attempt, already made. Full detail in `indexing-health-log.txt`. **No URLs were
submitted this session**, deliberately.

The fix is differentiation of the **service-by-city** pages, and only where HomeStar has
actually built that service in that town — about ten combinations qualify. The component
already filters projects by city, so this is per-combination copy rather than two dozen
rewrites. Flooring and painting by city are secondary services with no project proof and
the highest duplication in the set; consolidation is the honest answer there.

## 2. Google Business Profile exists and is verified — Bing is the gap

`business.google.com/locations` shows **HomeStar Services and Contracting, Verified**,
covering Carmel, Fishers and eight further areas. So the zero-map-pack finding is not a
missing Google listing.

ChatGPT's business cards are not Google's. The 2026-08-14 entry in the AI log already
diagnosed the **Bing listing as unmanaged and mis-located**, and that is the surface
those cards come from. Bing Places is the actionable item, not GBP.

Not verified this session: the GBP *category* set. The profile page bounced to an
account chooser and signing in on Eric's behalf was not appropriate. Worth checking,
because ChatGPT labels competitors by category — "Bathroom remodeler", "Kitchen
remodeler", "General contractor" — and a profile categorised only as a general
contractor will not surface in bathroom-remodeler cards.

## 3. "Design-build" is unclaimed, and the content to claim it already exists

Searched every built page. **Exactly one page carries "design-build" in its title, and
it is a blog comparison** — *Designer vs. Design-Build vs. General Contractor*. That
page explains the category neutrally and never asserts HomeStar is one. There is no
service page, no URL containing the phrase, and the strongest material lives at
`#design` — a homepage anchor, which cannot rank on its own.

Meanwhile ChatGPT's whole-home leader is **Nicholas Design Build**, whose name carries
the category for free. HomeStar's name does not, so the site has to.

The material is already written and it is better than a generic claim. The homepage
section *"Design Your Way, Built By One Team"* offers **three paths**: HomeStar's
in-house design-build team, the homeowner's own designer or architect, or an
introduction to a firm HomeStar has built for. Most design-build firms require you to
use their designer — offering all three is a real differentiator, and there is proof
behind it: three completed projects with Dovetail Group, preferred-contractor status on
the Westfield basement, and the Zionsville job that ran basement then whole main floor
with the same designer and crews across both phases.
