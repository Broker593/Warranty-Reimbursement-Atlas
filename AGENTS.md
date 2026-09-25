# Editing this project

- GitHub Pages serves `docs/` from `main`. Committed updates publish automatically after deployment succeeds.
- Use this repository as the shared source of truth; inspect current files before editing because other assistants may change them.
- Do not invent reimbursement rates. This project summarizes public legal methods, not actual SOA-approved rates.
- Keep original-source availability distinct from summary verification. Preserve publisher and source-date information.
- Check current official statutes for legal changes and link the exact provision. An accessible statute alone does not justify upgrading verification status.
- Maintain state conditions, elections, exclusions and passenger-vehicle scope. Check that checkbox classifications agree with state narratives.
- If coverage changes, update the coverage statements in `docs/index.html` and README.md.
- Static site, no build needed. For JavaScript edits run `node --check` on `docs/data.js`, `docs/coverage-data.js`, `docs/coverage.js` and `docs/extras.js`; verify affected interactions when a browser is available.
- The older ChatGPT Sites deployment is independent. Do not claim it auto-syncs with GitHub.
- The site (States home, state pages, Summary dashboard, News, Downloads, Update log) renders through `docs/extras.js` from `docs/data/*.json` (audit fields, key facts, weekly checks, news) plus `docs/data.js` and `docs/coverage.js`. Run `node --check docs/extras.js` after edits.
- `docs/data/key-facts.json` holds the short labels on the States table. Keep each label a faithful summary of the underlying record; when enacted law changes a rule, update the record and the label together.
- After any data change run `python3 tools/build_exports.py` so the Excel and PDF downloads match the site. Each state PDF must stay one page.
- The Monday weekly check follows `tools/WEEKLY_CHECK.md`. Never load pending bills as enacted law.
