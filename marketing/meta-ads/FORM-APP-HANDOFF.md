# Handoff to the homestar-project-manager repo

Paste the block below into the Claude Code tab that has access to that repo.
The receiving code on the website side is already built, tested and verified
(see LeadForm in src/App.jsx of homestar-website).

---

The estimate form in this repo is embedded as a cross-origin iframe on
https://www.thehomestarservice.com (deployed at homestar-project-manager.vercel.app).

It already posts two messages to the parent, and both work:
  { type: "homestar-form-height", height: N }   - continuously
  { type: "homestar-form-submitted" }           - on successful submit

ADD A THIRD. On the FIRST focus of any form field, post:

  window.parent.postMessage(
    { type: "homestar-form-started" },
    "https://www.thehomestarservice.com"
  );

REQUIREMENTS
- Fire once per page load, on the first field focus only. Not on every focus,
  not on blur, not on keystrokes.
- Use that exact targetOrigin string, not "*". The parent origin-checks it,
  because a forged event would corrupt ad delivery and spend real money.
- The type string must match exactly: "homestar-form-started".
- Only when embedded (window.parent !== window), so a standalone visit to the
  form does not throw.
- Model it on the existing homestar-form-submitted call, which already does the
  parent check and uses the correct targetOrigin.

WHY THIS MATTERS
Meta needs roughly 50 conversions per ad set per week to leave the learning
phase. HomeStar generates about 6 leads a MONTH, so optimising ad delivery on
completed leads is unreachable at any sane budget - it would cost on the order
of $21K/week/ad set. A first field focus is perhaps 10-20x more frequent and
still carries real intent. Meta will optimise against this event; completed
leads stay the number the business reports on.

VERIFY BEFORE CALLING IT DONE - a code change is not proof
1. Open the live site, scroll to the estimate form, click into the first field.
2. In Meta Events Manager > Test Events, confirm a FormStart event arrives.
3. Confirm it fires exactly once, not once per field.
4. Confirm submitting still produces the Lead event - do not regress it.

Tell me what you changed and what the test events showed.
