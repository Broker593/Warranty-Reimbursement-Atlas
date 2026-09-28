# Weekly check procedure (runs Mondays 7 AM ET)

The scheduled Claude task follows this file. Keep it the single source of truth for how the weekly check works.

## 0. Setup
- `git clone https://github.com/broker593/Warranty-Reimbursement-Atlas.git && cd Warranty-Reimbursement-Atlas`
- Read `AGENTS.md`, this file, and the latest entry in `docs/data/weekly-checks.json`.
- `pip install reportlab openpyxl pypdf` if missing.
- Check date = today in America/New_York (YYYY-MM-DD).

## 1. Legislative check (all 50 states)
Goal: find anything **enacted, taking effect, or moving** that changes a state's warranty-reimbursement rules for passenger vehicles — labor rate, paid hours/time allowances, parts, coverage of service contracts/extended warranty/CPO, claim deadlines, audits/chargebacks, rate submissions, manufacturer response, penalties.

1. Re-check every item in the latest entry whose category is `pending` or `enacted_upcoming` on the **official legislature site**. Record new status and last action date.
2. Effective dates reached since the last check: note them (e.g., Rhode Island 10/1/2026). The site's date selector and `tools/build_exports.py` `DATE_GATED` handle date-gated cells automatically; confirm they still match.
3. Search for new bills and new acts in each state touching the sections in `docs/data/audit-fields.json` → `cites` (search terms: "warranty reimbursement", "retail labor rate", "time allowance", "labor time guide", "chargeback", "certified pre-owned", "service contract" + "dealer"/"franchise"). Prioritize legislatures in session. Confirm every item on an official site before listing it.
4. Pending bills are **never** loaded into the data as law. List them only in the weekly entry.

## 2. When enacted law changes a rule
- Read the enacted text (official site or enrolled act). Quote verbatim, 40 words max, with pinpoint.
- Audit fields: update the state's record in `docs/data/audit-fields.json` (the changed block, `law_dates`, `verified.audit_fields` = check date). If the change is enacted but not yet effective, put it in `law_dates.next_scheduled_change` instead of changing current values.
- Coverage cells (`docs/research/labor-by-coverage-v3.json`, mirrored in `docs/coverage-data.js` and adapted by `docs/coverage.js`): do **not** hand-edit unless the change is clear-cut and you update all three consistently and run `node --check`. Otherwise log "Coverage cell change needed" under `site_changes` so a person reviews it.
- Key facts: if the change affects the labor rate, rate-request frequency, parts markup, manufacturer response, paid hours or multiplier, update that state's short label in `docs/data/key-facts.json` (plain English, summary only), re-check its `labor_type` / `parts_type` category, and set the file's `updated` date.
- Audit procedures: if enacted law changes audit, chargeback or rate-validation procedure, update that state in `docs/data/audit-procedures.json` (verbatim quote, 40 words max, and pinpoint) and re-check its `classification` (rate_validation_limited, audit_consequence) against the definitions in that file's `method`. The audit climate score (`docs/data/audit-index.json`, shown on the Map: U.S. Audit Climate tab) is recalculated automatically by `tools/build_exports.py`; note any tier change in the weekly entry.
- Distributor-franchised states (`docs/data/distributors.json`): note in the weekly entry if a change affects how a state's statute treats distributors.
- For every state you scanned, set `verified.last_change_check` = check date.

## 3. News and industry commentary (two labeled streams; zero is fine)
Work through the source list in `docs/data/news.json` → `sources` (law firms, boards, bill trackers, dealer associations, Warranty Week, Automotive News, dealer trade press, the manufacturer trade group, retail-rate vendors). Also run general searches.
- Window: published since the last check (about 7 days; up to 14 if the prior week was thin).
- **Law or ruling** (`kind: "law"`, up to 5 a week): new laws, bills that moved, board or court decisions on state warranty reimbursement: retail-rate and labor-time laws, service-contract or CPO reimbursement, claims, audits and chargebacks. Prefer official sources and law-firm client alerts.
- **Industry commentary** (`kind: "commentary"`, up to 3 a week): analysis or opinion from a named, reliable publication that helps the team understand the industry: manufacturer warranty cost and claims trends (e.g., Warranty Week reports), what dealers, rate vendors, dealer associations or manufacturers are saying about retail-rate reimbursement, labor time, audits, chargebacks, recalls or service-contract/CPO reimbursement, and dealer fixed-ops economics tied to warranty. Commentary is context, not law.
- Not in either stream: consumer lemon-law, consumer warranty shopping advice, individual recalls, F&I product pricing, press releases that are pure marketing.
- Vendor or advocacy content is allowed only when it signals a trend (for example, a push for rate filings after acquisitions). Label it: perspective `dealer-side` or `manufacturer-side`, and name the author's company in `publisher`.
- Paywalled sources (Automotive News): include only what the headline and public summary support, and say so in `topic`.
- Each item: `kind, date, title, publisher, url, source_type, states, topic (neutral summary with key numbers), why_it_matters (what it means for a manufacturer's warranty compliance or audit team), perspective (dealer-side | manufacturer-side | neutral)`.
- If a law item reports a new board or court decision on rate submissions, rate validation, audits, chargebacks or cost recovery, also add it to `docs/data/cases.json` with the same fields as existing items and an honest `verification` value ("verified — primary source read" only if you read the decision).
- Append one object to `docs/data/news.json` → `weeks` with `week_of` = Monday of the check week. Respect `limits` (law 5, commentary 3). If you find a reliable new source worth checking weekly, add it to `sources` and note it in `site_changes`.

## 4. Log the check
Append one object to `docs/data/weekly-checks.json` → `entries`:
```
{ "check_date", "type": "weekly", "run_by": "Claude (scheduled)", "headline", "summary",
  "items": [ { "category": "enacted_upcoming|enacted_recent|pending|dead_or_stalled", "state", "bill", "effective",
               "status", "last_action_date", "summary_short", "summary", "source_url", "atlas_impact" } ],
  "site_changes": [ ... ], "no_change_states": [ ... ], "gaps": [ ... ], "method": "..." }
```
Headline format: `N enacted changes, N pending bills, N law-data updates`. If nothing changed, say so plainly.

## 5. Rebuild, verify, publish
- `python3 tools/build_exports.py --date <check date>` (must report 50 states; every state PDF must be one page). This also rewrites `docs/data/audit-index.json`.
- `for f in data coverage coverage-data extras; do node --check docs/$f.js; done`
- `python3 -c "import json;[json.load(open(p)) for p in ['docs/data/audit-fields.json','docs/data/weekly-checks.json','docs/data/news.json','docs/data/key-facts.json','docs/data/audit-procedures.json','docs/data/distributors.json','docs/data/cases.json','docs/data/audit-index.json']];k=json.load(open('docs/data/key-facts.json'))['states'];a=json.load(open('docs/data/audit-fields.json'));assert sorted(k)==sorted(r['state'] for r in a)"`
- Commit to `main`: `Weekly check <date>: <headline>` and push. GitHub Pages publishes in a few minutes.
- If the push is refused (no repository access), do not work around it: report that the repo must be added to the task's sources, and attach the changed JSON files to the run summary.

## 6. Run summary (for the owner)
Five lines max: headline, any enacted change and its effective date, any data updated, top news item, and any gap or failure.
