# HomeStar SEO Autopilot — Claude Code Automation Pack
### Turn the July 2026 Master Plan into autonomous recurring tasks

**Setup (one time):**
1. Open Claude Code in your `homestar-website` repo folder
2. Keep `seo-master-plan-july-2026.md` and `local-seo-playbook.skill` in the repo root (or a `/docs` folder) so Claude Code always has context
3. Run the prompts below on the schedule shown. Each is designed to run start-to-finish without pausing and end with a single summary report.

---

## TASK 1 — Deploy & Index Pipeline (run after ANY content change)

```
Read docs/seo-master-plan-july-2026.md for context. Then, without pausing for confirmation:

1. Run a syntax check on src/App.jsx using @babel/parser (install if needed). If it fails, fix the syntax error and re-check until valid.
2. Commit all changes with a descriptive message and push to main.
3. Wait 3 minutes, then verify the Vercel deployment succeeded by fetching https://www.thehomestarservice.com and confirming it returns 200 and contains recent content.
4. Submit any new or modified URLs to IndexNow via curl:
   POST https://api.indexnow.org/indexnow with host www.thehomestarservice.com, key 3d0da3d219054effbd1a34b32bb1be9e, keyLocation https://www.thehomestarservice.com/3d0da3d219054effbd1a34b32bb1be9e.txt
5. Output a single summary: what changed, deploy status, URLs submitted.
```

---

## TASK 2 — GSC Indexing Robot (run 2-3x per week, browser automation)

```
Using browser automation, without pausing for confirmation:

1. Open Google Search Console for thehomestarservice.com (I will be logged in).
2. Read docs/indexing-queue.txt — a list of URLs, one per line, with a marker # DONE on completed lines.
3. For the next 10 unmarked URLs: paste each into the URL Inspection bar, wait for inspection, click "Request Indexing", wait for confirmation.
4. Mark each completed URL with # DONE and the date in indexing-queue.txt.
5. Also check Indexing → Pages: report the current Indexed vs Not Indexed counts, and whether "Alternate page with proper canonical tag" validation has passed. If it shows Failed and no validation is running, click Validate Fix.
6. Output one summary: URLs indexed today, remaining queue count, indexing health numbers.
```

*(Create `docs/indexing-queue.txt` once with your backlog of URLs; every new page gets appended.)*

---

## TASK 3 — Weekly GBP Post (run every Monday, browser automation)

```
Read docs/local-seo-playbook (GBP post rules) and src/App.jsx PROJECTS array. Without pausing:

1. Pick the next project in rotation that has not been posted recently (track in docs/gbp-post-log.txt).
2. Write a compliant GBP post: emoji formatting, feature bullets, city mention, hashtags. NO phone number in body, NO links in body, no review solicitation, no incentives.
3. Using browser automation, open business.google.com (I will be logged in), create an Update post with the text, attach the project's best photo from public/images/ if the UI allows upload, set the button to "Learn more" linking to the project URL.
4. Publish. Log the post (project, date, text) in docs/gbp-post-log.txt and commit.
5. Output one summary with the post text and status.
```

---

## TASK 4 — Monthly Data Analysis & Re-Plan (run 1st of each month)

```
I have placed this month's GSC export files (Queries.csv, Pages.csv, Chart.csv, Devices.csv) in docs/gsc-exports/YYYY-MM/. Without pausing:

1. Parse all CSVs. Compare against the prior month's folder if present.
2. Produce docs/seo-report-YYYY-MM.md containing:
   - Brand vs non-brand clicks/impressions and month-over-month change
   - The strike-zone table: non-brand queries at position 8-25 with impressions >= 40, sorted by impressions
   - CTR check on the two fixed pages (/blog/bathroom-remodel-cost-hamilton-county and /guide/bathroom-remodeling-hamilton-county) — did the title rewrite move CTR?
   - Pages that moved up or down more than 3 positions
   - Indexed vs not-indexed trend from Chart.csv
   - A prioritized top-5 action list for next month, following the logic in docs/seo-master-plan-july-2026.md
3. If any query has >=150 impressions at position 8-25 and its target page lacks a Quick Answer block or unique local content in src/App.jsx, add the treatment (matching the existing CITY_SVC_CONTENT / quickAnswer / deepContent patterns), run the syntax check, and include it in the report.
4. Run TASK 1 (deploy & index pipeline) for anything changed.
5. Output one summary pointing to the report file.
```

---

## TASK 5 — Content Treatment Batch (run when the monthly report flags targets)

```
Read docs/seo-master-plan-july-2026.md and the latest docs/seo-report-*.md. Without pausing:

1. For each flagged target page, add genuinely unique content following the established patterns in src/App.jsx:
   - City pages: quickAnswer + deepContent fields (match the Carmel/Fishers examples — real neighborhoods, home types, local remodel patterns)
   - Service-city pages: add an entry to CITY_SVC_CONTENT (match the bathroom-remodeling-Fishers example)
   - Never duplicate phrasing between cities. Each must read like a local wrote it.
2. Real pricing to use: bathroom $15K-$50K+ (most $20-35K), basement Essential $45-65K / Premium $65-95K / Luxury $95-200K+ (Westfield ≈ $150K), kitchen $25K-$100K+.
3. Syntax check after every edit. Update sitemap.xml if any new URLs are created.
4. Run TASK 1. Append new URLs to docs/indexing-queue.txt.
5. Single summary: pages treated, what was added, deploy status.
```

---

## TASK 6 — Review Response Drafts (run weekly; drafts only, you approve)

```
Using browser automation, open the Google Business Profile reviews page (I will be logged in). Without pausing:

1. Find reviews without an owner response.
2. For each, draft a response that: thanks them by first name, naturally mentions the service + city if known (e.g., "your Westfield basement finish"), stays warm and brief, never offers incentives.
3. Do NOT publish. Write all drafts to docs/review-response-drafts.md for my approval.
4. Summary: how many reviews found, drafts written.
```

*(Publishing stays manual so every public reply gets your eyes — flip this to auto-publish later if you trust the output.)*

---

## TASK 7 — Indexing Remediation (run monthly, browser automation + code)

```
Read docs/seo-master-plan-july-2026.md (Finding 5 — the triage rules). Using browser automation and code access, without pausing for confirmation:

1. Open Google Search Console → Indexing → Pages (I will be logged in). Record the current Indexed and Not Indexed totals and append them with today's date to docs/indexing-health-log.txt.
2. For EACH "Why pages aren't indexed" reason, click into it and EXPORT the URL list. Save the exports to docs/gsc-exports/indexing/YYYY-MM/.
3. Triage per the master plan rules:
   a. "Alternate page with proper canonical tag": URL-inspect 5 sample URLs. For each, check whether the User-declared canonical matches the page's own URL.
      - If canonicals are now correct: click VALIDATE FIX on the group (if not already running), and Request Indexing on up to 10 of these URLs.
      - If any page still declares the homepage or another URL as canonical: open src/App.jsx, find the useCanonical logic and the route for that page type, diagnose why the canonical is wrong for that route, fix it, run the syntax check, and note it in the report. Do NOT request indexing on unfixed pages.
   b. "Crawled - currently not indexed": cross-reference each URL against the latest docs/seo-report-*.md and Pages.csv. For any URL with zero impressions that lacks a quickAnswer/unique-content treatment in src/App.jsx, add the treatment following the existing CITY_SVC_CONTENT / quickAnswer / deepContent patterns (unique local phrasing, real pricing). Then Request Indexing on treated URLs only.
   c. "Page with redirect": fetch 3 sample URLs with curl -I and verify each returns a 301 to the correct canonical https://www URL. If yes, mark healthy and take no action. If any redirect is broken or loops, fix vercel.json.
   d. "Excluded by 'noindex' tag": list the URLs in the report. If either is a genuine content page (not an intentional exclusion), search src/App.jsx and index.html for the noindex source, remove it, and flag prominently in the summary.
   e. "Discovered - currently not indexed": Request Indexing on up to 5.
4. If any code changed: run the full deploy pipeline (syntax check → commit → push → verify Vercel → IndexNow the affected URLs).
5. Write docs/indexing-remediation-YYYY-MM.md: counts per reason vs last month, actions taken per bucket, URLs still broken and why, and the trend toward the target (<20 not-indexed within 90 days).
6. Output a single summary pointing to the report.
```

*(Create `docs/indexing-health-log.txt` empty on setup; the task appends a dated line each run so the trend is tracked in-repo.)*

---

## What Stays Human (the 20% automation can't do)
- **Sending review-request texts to customers** (Task 6 can draft the template; the send is yours — it's personal)
- **Backlink outreach**: Dovetail, Schluter locator, OneZone chamber — relationships, not scripts
- **Filming project videos** and approving anything customer-facing

## The Cadence at a Glance
| When | Task |
|---|---|
| After any change | 1 — Deploy & Index Pipeline |
| Mon/Wed/Fri | 2 — GSC Indexing Robot |
| Every Monday | 3 — GBP Post |
| Weekly | 6 — Review Response Drafts |
| 1st of month | 4 — Data Analysis & Re-Plan (drop exports in the folder first) |
| 1st of month | 7 — Indexing Remediation (right after Task 4) |
| As flagged | 5 — Content Treatment Batch |

Run this loop for 90 days and the master plan largely executes itself — with you only touching the human 20%: reviews, relationships, and final approvals.
