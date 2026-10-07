# Warranty Reimbursement Atlas

Interactive 50-state reference for franchised passenger-vehicle dealers. Public legal methods; actual retailer payment data are not included.

## Publishing

GitHub Pages serves `docs/` from `main`. A successful Pages deployment publishes committed changes automatically. The older ChatGPT Sites deployment is separate and does not synchronize with this repository.

## Coverage research v3

Imported September 25, 2026 from Claude's September 25 v3 reconciliation: all 50 states and all four coverage types, 200 entries. V3 supersedes v2 values. Source types reported by the supplied research: 40 official-statute records, 5 enacted-law records, 5 code reproductions. Importing this research does not claim that every source was independently rechecked.

The following totals apply with the date selector set to **October 1, 2026 or later**:

| Coverage | Required | Conditional | Not reached | Not addressed |
|---|---:|---:|---:|---:|
| Factory warranty | 50 | 0 | 0 | 0 |
| Mfr-backed service contract | 4 | 9 | 1 | 36 |
| CPO warranty | 9 | 8 | 0 | 33 |
| Independent service contract | 0 | 3 | 6 | 41 |

| Factory paid-hours method | Count |
|---|---:|
| Factory time (reasonable/adequate standard where stated) | 30 |
| Independent/retail time guide | 5 |
| OEM time × multiplier | 2 |
| Actual technician time | 1 |
| Negotiated/other | 1 |
| Statute silent on time | 11 |

Through September 30, 2026, Rhode Island factory hours are Statute silent on time and CPO is Not addressed. The corresponding CPO counts are **8 / 8 / 0 / 34**, Actual technician time is **0**, and Statute silent on time is **12**. All other totals are unchanged. Both tables, state cells, filters, detail panels and warranty flags use the selected date; research files retain the supplied enacted-law values unchanged. This applies documented effective dates, not an exhaustive certification of the law on every selectable date.

Required concerns statutory scope, not an unconditional payment method. Conditional cells show the specific condition. Not reached is an exclusion or scope limit. Not addressed is researched silence in the reviewed provisions, not Unverified and not a finding that no other law applies.

Manufacturer-backed service-contract and CPO views carry the program-scope note: Required/Conditional applies only to contracts the manufacturer, distributor or qualifying affiliate actually issues or reimburses. Program branding does not establish the legal obligor; check the state-specific contract. Independent contracts are Conditional in NJ, ND and PA only through the stated manufacturer connection. PA covers claim approval/payment timing only.

NC manufacturer service contracts and PA manufacturer/independent service contracts display **Not established** for rate and hours. Their supplied paid-hours code `silent` is retained for the count bucket; factory methods are not inherited. The factory rate remains available separately as context in the drawer.

Mississippi's qualified-technician benchmark is in Factory time, not individual technician clock time. Rhode Island is the only primary Actual technician time state from October 1. Wisconsin remains Negotiated/other in the supplied primary-method taxonomy: its adjustment is in the hourly-rate denominator, and paid hours remain OEM time.

The original v3 JSON and Markdown are preserved verbatim under `docs/research/`. V2 remains there as a historical source and is not loaded by the current site. The adapter reconciles older narrative sentences in FL, IL, WI, ND and NJ with the final v3 cells. Original quotations and pinpoints are retained; the RI pre-effective-date drawer labels the enacted quotation as upcoming and also shows prior statutory text. PA's independent-contract drawer shows the claim-timing scope quotation separately from its supplied warranty-rate quotation.

## Site layout (September 25, 2026 redesign)

Tabs: **Map: U.S. Audit Climate** (home) · **Matrix: State-by-State Rules** · **Dashboard: Overview of Rule Types** as the three main tabs, with smaller secondary tabs on the right: **Cases & Laws** · **News** · **Downloads** · **Update log**. Rendered by `docs/extras.js` / `docs/extras.css`.

- **Matrix: State-by-State Rules** (`#states`): one row per state with plain-English columns: labor rate, rate increase requests (frequency and RO sample), manufacturer response, paid hours (labor-time guide), parts markup, and service contracts and CPO. Search and a "Show" filter; the full data is in the Excel workbook. Last column: Audits & chargebacks (lookback window, chargeback held during appeal, audit climate score).
- **Matrix detailed view** (`#states/detailed`): every field (36 columns in 8 categories: labor rate, paid hours, parts, service contracts & CPO, claims, audits & chargebacks, audit climate score, law dates and franchise), sortable by any column, filterable per column, with categories shown or hidden.
- **Compare** (`#compare/CA,NY,TX`): tick 2–6 states on the matrix (or "Add to compare" on the map panel or a state page); side-by-side table of key facts, claims and chargebacks, audit procedures and audit climate score, with rows that differ marked. The link is shareable.
- **State overview** (`#state/XX`): key facts with "Full details" fold-outs (statute quotes, pinpoints, conditions), then claims, audits and chargebacks, penalties, and sources. Links to the one-page PDF and the official statute. It shows the law in effect today and flags scheduled changes.
- **Dashboard: Overview of Rule Types** (`#summary`, sections at `#summary/<id>`): a dashboard of answer counts for every column (labor rate, request frequency, RO sample, manufacturer response and silence, paid hours, multiplier, parts markup, service contracts and CPO, claim deadlines, late claims, filing deadline, chargeback lookback). Below it, each answer has a plain-English definition and its states, each linking to the state page. Groups are defined once in `dims()` in `docs/extras.js`; labor and parts groups come from `labor_type` / `parts_type` in `docs/data/key-facts.json`. The original September 21 20-feature classification is collapsed at the bottom.
- **Map: U.S. Audit Climate** (`#map`): U.S. heat map of the audit climate score (0–100, higher = more restrictive toward warranty audits, chargebacks and rate validation). Each of 14 statutory limits gets a level 0–3; points = weight × level ÷ 3; weights add up to 100 (set in `tools/audit_index.py`). Two sub-scores that add up to the score: Chargeback limits (75%) and Process and oversight (25%). Weights are whole numbers, so every score is a whole number. Hover or click a state for its breakdown; "How the score works" shows the full levels-and-weights table.
- **Cases & Laws** (`#cases`, items at `#cases/<id>`): key board decisions, court cases and statutes on rate submissions, rate validation, audits, chargebacks and cost recovery, from `docs/data/cases.json`, each labeled with how it was verified.
- **Flagged states:** CT, MA, ME, NH, RI, VT, NY, northern NJ and HI are outlined in gold on the map and labeled Flagged on the Matrix, state pages and exports (`docs/data/flagged-states.json`). Site text never names a specific manufacturer or company.
- **News** (`#news`): two labeled streams from `docs/data/news.json`: law changes and rulings (up to 5 a week) and industry commentary from reliable publications (up to 3 a week, e.g., Warranty Week cost reports, dealer trade press, the manufacturer trade group). The weekly check works through the `sources` list in that file, which the News tab also displays.
- Every tab opens with a plain-English intro: a one-line lead, **What's here** and **Use it to** bullets (`intro()` in `docs/extras.js`). The Summary tab's section bar stays pinned while scrolling and highlights the current section.
- **Update log** (`#updates`): the Monday law-change checks and site updates from `docs/data/weekly-checks.json`.
- The original interactive matrix (`docs/app.js`, date selector, count boxes) was retired on September 25, 2026; it is in git history (commit 072b010) if ever needed.
- Old links still work: `#atlas`, `#audit`, `#calculator` → `#states`; `#audit?state=XX` → `#state/XX`; `#weekly` → `#updates`; `#research` → `#summary`.

| File | Contents |
|---|---|
| `docs/data/key-facts.json` | Short plain-English labels (labor rate, request frequency, parts markup, plus manufacturer-response, paid-hours and multiplier overrides where needed) and the `labor_type` / `parts_type` answer categories used by the Summary. Summaries only, no new research; update the state's entry whenever enacted law changes one of these rules. |
| `docs/data/governance.json` | 50 states: whether the rules come from the statute alone or also a state agency rule (`law`, `rule_note`), the agency and its official website (`agency`, `agency_url`), and the dispute forum (`forum`, `forum_kind`). Shown on the Governing Bodies tab and in the Excel workbook. |
| `docs/data/audit-fields.json` | 50 states: claim decision/payment deadlines, deemed approval, dealer filing deadlines, chargeback windows, rate-submission frequency and sample rules, exclusions, manufacturer response deadline and challenge standard, dispute forum, penalties, law dates (last amended, amending act, original enactment, next scheduled change), verification dates, and a `calc` block summarizing each state's retail-rate sample rule. Every block carries a verbatim quote (40 words max) and pinpoint. |
| `docs/data/weekly-checks.json` | Weekly legislative check log (newest entry shown first). |
| `docs/data/news.json` | 3–5 relevant items per week, labeled by source type and perspective. |
| `docs/downloads/` | Excel workbook, one-page PDF per state and an all-states PDF. Built by `tools/build_exports.py`. (The state-PDF ZIP and CSV exports were retired 2026-09-28.) |

"Silent" / "Not set in statute" means the reviewed statute says nothing and no state agency rule was found (all 50 states' rules checked 2026-10-06); contracts or other law may still apply. Where an agency rule sets a limit (Tennessee), the Atlas records it with the rule citation.

A retail-rate calculator was built and removed on September 25, 2026 pending a redesign; the sample rules remain on each state page and in the Excel workbook.

The weekly check runs Mondays at 7 AM ET and follows `tools/WEEKLY_CHECK.md`. Pending bills are logged, never loaded as law.

## Warranty corrections retained and extended

Connecticut's reasonable-and-adequate language remains restored. Pennsylvania remains factory time with no statutory standard. North Carolina and Nebraska retain the 2025 time-request amendments. Tennessee's retail labor-rate floor, Wyoming's ceiling and 2025 submission process, Virginia's deleted presumption, Hawaii's floor/cap, and Maine's posting condition are preserved.

Wisconsin's `normalized_rate` belongs to Hourly rate: this is an hourly-dollar-rate conversion; OEM warranty hours remain the paid-hours basis, so do not apply a second time multiplier.

The combined guide flag is split into five distinct features, producing 20 total rule features:

| Feature | States |
|---|---|
| Independent-guide floor, unless otherwise agreed | AK |
| Agreed guide; OEM × 1.5 fallback | IL |
| Dealer retail guide | MN, NY, ND |
| Dealer elects OEM or retail guide | MT |
| Actual-time fallback when retail guide is unavailable | MN, ND |

Earlier source availability and verification records remain separate from imported coverage research. Historic checks are not silently upgraded to comprehensive current official reviews. Pending legislation is displayed as a dated watchlist, not enacted law.

## Files and validation

- `docs/research/labor-by-coverage-v3.json`: supplied JSON, unchanged.
- `docs/research/labor-by-coverage-patch-v3.md`: supplied patch, unchanged.
- `docs/coverage-data.js`: same JSON records wrapped for a static browser page.
- `docs/coverage.js`: display labels, coverage-specific conditions, scope notes and RI date overrides.
- `docs/data.js`: original warranty records and corrected rule taxonomy.
- `docs/index.html`, `docs/extras.js`, `docs/extras.css`, `docs/styles.css`: the site shell and interface (high-contrast, text labels, never color alone).

`tools/build_exports.py` runs `tools/check_consistency.py` first and stops if a short label contradicts the verified research, a scheduled law change has passed its effective date, a stale-source label remains, an agency-rule citation is missing from `governance.json`, or a Conditional service-contract/CPO cell has no short condition in `COND_SHORT` in `extras.js`. No build is required. Run `node --check` for each JavaScript file. Validate all 200 imported cells against v3; check exact totals on both sides of October 1; confirm 20 Conditional notes, NC/PA exceptions, separate guide flags, Wisconsin grouping, filters, comparisons, share URLs, source details and original-file byte identity.

The Summary dashboard highlights tracked enacted changes effective within the trailing nine calendar months (inclusive, using America/New_York dates). It combines recorded amendment dates and enacted weekly-log entries, excludes pending proposals, and keeps future effective dates separate. The States filter and state overview callouts use the same window. Dates roll forward on page load; this does not perform a fresh legislative check.
