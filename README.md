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

Tabs: **States** (home) · **Weekly checks** · **News** · **Downloads** · **Research detail**. Rendered by `docs/extras.js` / `docs/extras.css`.

- **States** (`#states`): one row per state with plain-English columns: labor rate, rate increase requests (frequency and RO sample), manufacturer response, paid hours (labor-time guide), parts markup, and service contracts and CPO. Search, a "Show" filter and a CSV export.
- **State overview** (`#state/XX`): key facts with "Full details" fold-outs (statute quotes, pinpoints, conditions), then claims, audits and chargebacks, penalties, and sources. Links to the one-page PDF and the official statute. It shows the law in effect today and flags scheduled changes.
- **Research detail** (`#research`): the original 20-feature matrix, coverage counts and date selector (`docs/app.js`), unchanged.
- Old links still work: `#atlas` → `#research`; `#audit` → `#states`; `#audit?state=XX` → `#state/XX`.

| File | Contents |
|---|---|
| `docs/data/key-facts.json` | Short plain-English labels (labor rate, request frequency, parts markup, plus manufacturer-response, paid-hours and multiplier overrides where needed). Summaries only, no new research; update the state's entry whenever enacted law changes one of these rules. |
| `docs/data/audit-fields.json` | 50 states: claim decision/payment deadlines, deemed approval, dealer filing deadlines, chargeback windows, rate-submission frequency and sample rules, exclusions, manufacturer response deadline and challenge standard, dispute forum, penalties, law dates (last amended, amending act, original enactment, next scheduled change), verification dates, and a `calc` block summarizing each state's retail-rate sample rule. Every block carries a verbatim quote (40 words max) and pinpoint. |
| `docs/data/weekly-checks.json` | Weekly legislative check log (newest entry shown first). |
| `docs/data/news.json` | 3–5 relevant items per week, labeled by source type and perspective. |
| `docs/downloads/` | Excel workbook, one-page PDF per state, all-states PDF and ZIP. Built by `tools/build_exports.py`. |

"Silent" / "Not set in statute" means the reviewed statute says nothing; contracts, regulations or other law may still apply.

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
- `docs/app.js`, `docs/index.html`, `docs/styles.css`: interactive interface with text, symbols and distinct high-contrast borders.

No build is required. Run `node --check` for each JavaScript file. Validate all 200 imported cells against v3; check exact totals on both sides of October 1; confirm 20 Conditional notes, NC/PA exceptions, separate guide flags, Wisconsin grouping, filters, comparisons, share URLs, source details and original-file byte identity.
