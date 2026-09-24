# Warranty Reimbursement Atlas

Interactive reference covering automotive warranty reimbursement rules across all 50 states.

## Publishing

GitHub Pages publishes the `docs/` folder from the `main` branch. Changes pushed or merged into `main` automatically trigger publication. Local edits and unmerged pull requests are not live. Check the repository Actions tab for deployment status.

This repository is the source of truth for the GitHub Pages site. The earlier ChatGPT Sites address is a separate deployment and does not automatically synchronize with this repository.

## Files

- `docs/data.js`: All 50 state summaries, 16 rule definitions, classifications, citations, original-source links, and review status. Start here when reviewing the research.
- `docs/app.js`: Search, filtering, comparison, state details and share links.
- `docs/index.html`: Page structure, methodology and coverage statements.
- `docs/styles.css`: Presentation and responsive styles.

No build step or dependencies are needed. Preview with `python -m http.server 8000 --directory docs`.

## Research status, September 24, 2026

All 50 entries now include either a direct original-text/act link (38) or a code access page (12). An access page is not a direct provision, and located links are not necessarily tested links. Each original link includes its recorded retrieval status.

Verification remains separate: 11 existing official-text reviews, 9 partial official checks and 30 reproduction-based entries. Per-state `review` and `checks` fields document dates, scope and supporting URLs. The external reviewer’s blanket “50 of 50 verified” claim was not adopted.

Corrections include Maryland’s citation, Oregon time protections, Oklahoma’s 2025 rate procedures, Kentucky’s Class 7+ history, Maine’s weight boundary, and unsupported time-allowance wording. Pennsylvania retains the actual requirement to provide time allowances, without inventing a reasonable-and-adequate standard. Rhode Island retains its prior-month labor-rate sample while its October 1, 2026 amendment changes paid hours to documented actual time.

The 16-column matrix includes actual technician time, accuracy-limited rate challenges and automatic rate effectiveness. These new fields use `null` for unclassified states. Empty and unknown boxes are clickable. Rate-submission approval and warranty-claim approval are separate fields.

The date control applies only documented changes, not an exhaustive historical/current-law reconstruction. Shared URLs preserve that date. Pending review notes retain unresolved items for GA, IN, MI, NE, WI, ID and HI.

This is a working public-source reference. It contains no actual approved SOA dealer rates, internal rate master, or paid claims.

## Reviewing with Claude or another assistant

Read `docs/data.js` directly if the interactive website cannot be rendered. Independently verify claims against current official statutes, distinguish mandatory rules from elections and conditional fallbacks, and identify exact state-specific corrections with supporting links. Preserve unresolved questions and verification status.

## Editing

Make changes in this repository, review the diff, then commit or merge to `main` to publish. Update coverage figures in `docs/index.html` and this README if verification status changes. Do not mark a summary officially verified merely because its original link was found.

