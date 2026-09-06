# The message contract between the site and the estimate form

**Status 2026-09-06: all three messages are implemented on both sides.** No
handoff is needed any more — this file is the record of the contract.

The estimate form is a cross-origin iframe, so the marketing site cannot observe
anything that happens inside it. Everything the site knows, the form has to tell
it by `postMessage`.

## Where the two halves live

| | repo | file |
|---|---|---|
| sender | `homestar-pmhub` at `C:\Users\ericf\my-app` (deployed `homestar-project-manager.vercel.app`) | `src/job-manager.jsx`, `LeadForm` ~8338 |
| receiver | `homestar-website` | `src/App.jsx`, `LeadForm` ~509 |

## The three messages

| message | when | what the site does |
|---|---|---|
| `homestar-form-height` | continuously, on resize | resizes the iframe |
| `homestar-form-started` | first focus of any field, once per load | Meta `FormStart` (custom), GA4 `form_start` |
| `homestar-form-submitted` | successful submit only, once | Meta `Lead`, GA4 `generate_lead`, OpenAI `lead_created` |

## Rules that must not be relaxed

- **Never `"*"` as targetOrigin** for the two conversion messages. They drive ad
  spend, so a wildcard would let any page that framed the form forge
  conversions. The allow-list is `LEAD_PARENT_ORIGINS` at module scope in
  `job-manager.jsx`; the site checks `e.origin` against `FORM_ORIGIN`.
  Height stays origin-agnostic on purpose, so a domain change cannot silently
  freeze the iframe.
- **One per page load.** Both sides guard independently.
- The form serves two brands (`?company=homestar`, `?company=hcc`). HCC has no
  pixel or listener, so it gets no conversion messages — add its origin to the
  map if that changes.

## Why FormStart exists

Meta needs roughly 50 conversions per ad set per week to leave its learning
phase. HomeStar produces about six leads a month, so optimising delivery on
completed leads is unreachable — on measured numbers (146 landing page views at
about $3 each, sub-1% site conversion) it would cost around $21K/week/ad set.
FormStart is 10-20x more frequent and still carries intent. Completed leads stay
the number the business reports on.

## How to verify a change here

A code change is not proof, and neither is a stubbed pixel. Browser resource
timing does **not** show the Meta pixel's beacons, so "no request sent" there
means nothing.

Use Events Manager → Test events → enter the site URL → take the action.
`FormReached` was confirmed this way on 2026-09-06 (`Processed`, 1:20:11 PM).
