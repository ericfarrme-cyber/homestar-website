# ChatGPT Ads — 30-day read
### Designed 2026-09-01. Not launched. Launching needs Eric (account, payment, publish).

**The offer being tested:** a Hamilton County remodeler with $15K–$200K project values buying
clicks at roughly $3–5 against high-intent AI conversations.

---

## 1. What this test can and cannot tell us

Be honest about this up front, because the temptation at the end will be to over-read it.

At $15/day for 30 days (~$450) and $3–5 CPC, this buys roughly **100–150 clicks**.

- **It can answer:** is there *any* conversion signal here? Zero estimate requests on 120+
  clicks puts the true lead rate under roughly 2.5%, which is a real answer and a clean stop.
- **It cannot answer:** what our cost-per-lead is. Distinguishing a 2% lead rate from 4% needs
  an order of magnitude more clicks than this budget buys. Any CPL computed off 2–3 leads is
  noise wearing a decimal point.

Design the decision around the first question. Do not let a lucky week become a strategy.

## 2. The structural fact that should temper expectations

**ChatGPT ads sit in a labeled card *below* the answer and explicitly do not influence it.**

We already win the answer itself. The 2026-08-26 sweep: 3/3 bathroom Fishers, 3/3 kitchen
Fishers, 2/3 basement Fishers at position 1, with ChatGPT quoting our own site. This test does
not improve that and cannot hurt it. It buys a **second, lower slot on queries we already
lead** — a legitimate thing to buy, just not the thing people assume they are buying.

Also: **only Free and Go tier users see ads.** Plus, Pro, Business and Enterprise are ad-free.
That skews away from exactly the affluent demographic buying a $95K basement. How much is
unknown. It is a reason to expect a weak result, not a reason to skip the test.

---

## 3. Budget and pacing

| | |
|---|---|
| **Daily budget** | $15/day (daily budgets are new-campaigns-only, so set it at creation) |
| **Duration** | 30 days |
| **Total** | ~$450 |
| **Objective** | Clicks (CPC), not Reach — we are testing conversion, not awareness |
| **Funding** | Pause the weakest Meta ad rather than adding to the $64/day already running |

That last line matters. Adding a second paid channel on top of a first one nobody is watching is
how spend leaks quietly. If this is purely additive, the test is worse than not running it.

## 4. Targeting

Geo only. The platform has no keyword or audience controls — matching is contextual, off the
conversation topic, chat history and past ad interaction. **We cannot buy "bathroom remodel
Fishers" the way we buy a Google keyword.** Creative relevance is the only steering available,
and it is weighted in the auction, so the copy is doing double duty.

**Target ZIPs.** Verified against the Hamilton County list; Zionsville, Fortville and
McCordsville sit outside the county but inside our stated service area.

```
46032, 46033          Carmel
46037, 46038          Fishers
46060, 46062          Noblesville
46074                 Westfield
46280, 46290          Carmel / north-side Indianapolis
46077                 Zionsville        (Boone County)
46040                 Fortville         (Hancock County)
46055                 McCordsville      (Hancock County)
46256                 Geist spillover   (optional)
```

**Excluded on purpose:** 46061, 46082 and 46085 are PO-box-only and carry no residents. Also
skip the rural north county — Arcadia, Atlanta, Cicero, Sheridan — outside where we work.

⚠️ **Do not fall back to DMA targeting.** Indianapolis DMA is roughly 2.6M people against a
~370K service area, so about 85% of that spend lands on people we cannot serve. If ZIP targeting
is not selectable in the UI, **do not launch** — the test is not viable at DMA granularity.
OpenAI's API docs still list only country/region/DMA while the Ads Manager UI reportedly does
ZIP. Confirm in the UI before funding anything.

## 5. Creative — three cards

The card is small. OpenAI's help docs point to a title of roughly **16–24 characters** and body
of roughly **32–48**; third-party guides claim 30/60 and 50/100 and disagree with each other.
Everything below is written to the *shortest* reported limit so it survives whichever is real.
**Confirm the real limits in Ads Manager and do not let it truncate silently** — that is exactly
how the Houzz FAQ lost a sentence today.

Image is optional, square, minimum 256×256, JPG/PNG/WEBP. Reuse the square crops already cut for
Meta. The CTA is auto-selected by OpenAI; advertisers cannot choose it yet.

**Card A — Cost.** The single most common thing anyone asks an AI about remodeling.

> **Title:** Real Remodel Prices
> **Body:** Hamilton County. Baths $15K-$35K.

**Card B — The waterproofing moat.** Our most defensible technical claim.

> **Title:** 25-Year Warranty
> **Body:** Schluter Pro Certified bathrooms.

**Card C — Local and owner-run.** Matches "who should I hire near me" conversations.

> **Title:** Fishers Remodelers
> **Body:** Family-owned. Free in-home estimate.

⚠️ **Card A revives the pricing angle deleted from Meta.** Eric killed concept 05 on 2026-08-27.
It is here because cost is the dominant AI query type and the numbers are already public on the
site — but that was a deliberate call once, so it is his call again. Drop Card A and run two if
he wants it out.

## 6. Measurement

Three independent signals, so no single failure blinds the test.

1. **oaiq pixel** — already installed and inert in `index.html`. Paste the Pixel ID from Ads
   Manager > Conversions into `window.OAI_PIXEL_ID` and deploy. `lead_created` then fires from
   the same origin-verified iframe bridge that already feeds Meta and GA4.
2. **UTMs** — matching the existing Meta convention, with `paid_ai` so the two channels can
   never be confused in GA4:

```
A  https://www.thehomestarservice.com/?utm_source=chatgpt&utm_medium=paid_ai&utm_campaign=homestar-chatgpt-2026-09&utm_content=A-pricing#estimate
B  https://www.thehomestarservice.com/bathroom-remodeling?utm_source=chatgpt&utm_medium=paid_ai&utm_campaign=homestar-chatgpt-2026-09&utm_content=B-waterproofing
C  https://www.thehomestarservice.com/?utm_source=chatgpt&utm_medium=paid_ai&utm_campaign=homestar-chatgpt-2026-09&utm_content=C-local#estimate
```

3. **Ask the human.** "How did you hear about us?" on every estimate call. At single-digit lead
   counts this is not a soft signal — it is the most reliable one available.

**On switch-on:** init once with `debug:true` and confirm `page_viewed` fires exactly once. The
docs never state whether `init` emits it automatically, and a double count corrupts the only
number this pixel exists to produce.

## 7. Decision rule — written down before spending

Cost checkpoints at **day 7** and **day 14**; the real decision at **day 30**.

| Checkpoint | Trigger | Action |
|---|---|---|
| Day 7 | CPC above $8 | Pause. The auction is not favourable at our creative quality |
| Day 7 | Zero clicks | Creative is matching no conversations. Rewrite, do not add budget |
| Day 14 | On pace, no leads | Let it run. 60 clicks is too early to call |
| Day 30 | **3+ estimate requests** | Working. Extend 60 days, raise to $25/day |
| Day 30 | **1–2 estimate requests** | Ambiguous. Extend 30 days at $15 for a readable sample |
| Day 30 | **0 leads on 100+ clicks** | Stop. Lead rate is under ~2.5%; it does not convert |

**One job pays for years of this.** A $25K bathroom at a 10–20% close rate on web leads makes a
single lead worth roughly $2,500–5,000 in revenue. The risk here is not the $450 — it is
concluding something confident from too little data. Hence the table.

## 8. Who does what

**Eric must do these. I cannot:**

1. Create the account at `ads.openai.com` — I do not create accounts
2. Add a payment method — I do not enter payment details
3. Create the Pixel ID in Conversions and hand it over
4. Click Publish — money actions are always human

**I can do these once he has:**

1. Paste the Pixel ID, verify no double-count, deploy
2. Build the three cards and the square images
3. Set geo, budget, objective and UTMs, stopping at the Publish button
4. Read the numbers at day 7, 14 and 30 against the table above

## 9. The thing that still beats this

**Houzz reviews, 5 → ~15.** Free, and it is the documented mechanism behind the organic
placement this test sits underneath. Every competitor ranked above us was justified with a Houzz
citation. Ten more asks, to people who already left 5-star Google reviews. If only one thing
gets done this month, it is that one — not this.
