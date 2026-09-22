# Editing this project

- GitHub Pages serves `docs/` from `main`. Committed updates publish automatically after deployment succeeds.
- Use this repository as the shared source of truth; inspect current files before editing because other assistants may change them.
- Do not invent reimbursement rates. This project summarizes public legal methods, not actual SOA-approved rates.
- Keep original-source availability distinct from summary verification. Preserve publisher and source-date information.
- Check current official statutes for legal changes and link the exact provision. An accessible statute alone does not justify upgrading verification status.
- Maintain state conditions, elections, exclusions and passenger-vehicle scope. Check that checkbox classifications agree with state narratives.
- If coverage changes, update the coverage statements in `docs/index.html` and README.md.
- Static site, no build needed. For JavaScript edits run `node --check docs/app.js` and `node --check docs/data.js`; verify affected interactions when a browser is available.
- The older ChatGPT Sites deployment is independent. Do not claim it auto-syncs with GitHub.
