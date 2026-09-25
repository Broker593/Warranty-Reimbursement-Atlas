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
- For every state you scanned, set `verified.last_change_check` = check date.

## 3. News (3–5 items, zero is fine)
- Window: published since the last check (about 7 days; up to 14 if the prior week was thin).
- Must be directly about state warranty-reimbursement law: retail-rate/labor-time laws, service-contract or CPO reimbursement, claims/chargebacks/audits, board or court rulings on these. No consumer lemon-law, recall or generic warranty stories. No vendor marketing unless it reports a concrete law change.
- Prefer official sources, law-firm client alerts, state dealer associations, Automotive News.
- Each item: `date, title, publisher, url, source_type, states, topic, why_it_matters (manufacturer-compliance view), perspective (dealer-side | manufacturer-side | neutral)`.
- Append a new object to `docs/data/news.json` → `weeks` with `week_of` = Monday of the check week. Never more than 5 items.

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
- `python3 tools/build_exports.py --date <check date>` (must report 50 states; every state PDF must be one page).
- `node --check docs/app.js docs/data.js docs/coverage.js docs/coverage-data.js docs/extras.js`
- `python3 -c "import json;[json.load(open(p)) for p in ['docs/data/audit-fields.json','docs/data/weekly-checks.json','docs/data/news.json']]"`
- Commit to `main`: `Weekly check <date>: <headline>` and push. GitHub Pages publishes in a few minutes.
- If the push is refused (no repository access), do not work around it: report that the repo must be added to the task's sources, and attach the changed JSON files to the run summary.

## 6. Run summary (for the owner)
Five lines max: headline, any enacted change and its effective date, any data updated, top news item, and any gap or failure.
