# Warranty Reimbursement Atlas

Interactive reference covering automotive warranty reimbursement rules across all 50 states.

## Publishing

GitHub Pages publishes the `docs/` folder from the `main` branch. Changes pushed or merged into `main` automatically trigger publication. Local edits and unmerged pull requests are not live. Check the repository Actions tab for deployment status.

This repository is the source of truth for the GitHub Pages site. The earlier ChatGPT Sites address is a separate deployment and does not automatically synchronize with this repository.

## Files

- `docs/data.js`: All 50 state summaries, 13 rule definitions, classifications, citations, original-source links, and review status. Start here when reviewing the research.
- `docs/app.js`: Search, filtering, comparison, state details and share links.
- `docs/index.html`: Page structure, methodology and coverage statements.
- `docs/styles.css`: Presentation and responsive styles.

No build step or dependencies are needed. Preview with `python -m http.server 8000 --directory docs`.

## Research status at migration

Research date: September 21, 2026. Original statutory text linked for 33 states, official access pages for 7, original links unconfirmed for 10. Mississippi's original link covers only the labor provision. Only 11 state summaries have been checked against official text; 39 comparisons remain pending. A source link is not proof that the summary has been verified.

This is a working public-source reference, not an exhaustive legal update. It contains no actual approved SOA dealer rates, internal rate master, or paid claims.

## Reviewing with Claude or another assistant

Read `docs/data.js` directly if the interactive website cannot be rendered. Independently verify claims against current official statutes, distinguish mandatory rules from elections and conditional fallbacks, and identify exact state-specific corrections with supporting links. Preserve unresolved questions and verification status.

## Editing

Make changes in this repository, review the diff, then commit or merge to `main` to publish. Update coverage figures in `docs/index.html` and this README if verification status changes. Do not mark a summary officially verified merely because its original link was found.
