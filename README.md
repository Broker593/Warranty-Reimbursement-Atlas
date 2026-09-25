# Warranty Reimbursement Atlas

Interactive 50-state reference for franchised passenger-vehicle dealers. Public legal methods; actual retailer payment data are not included.

## Publishing

GitHub Pages serves `docs/` from `main`. A successful Pages deployment publishes committed changes automatically. The older ChatGPT Sites deployment is separate and does not synchronize with this repository.

## Coverage research v2

Imported September 25, 2026 from Claude's September 24 v2 research: all 50 states and all four coverage types, 200 entries. Source types reported by the supplied research: 40 official-statute records, 5 enacted-law records, 5 code reproductions. Importing this research is not a claim that every source was independently rechecked.

| Coverage | Required | Conditional | Not reached | Not addressed |
|---|---:|---:|---:|---:|
| Factory warranty | 50 | 0 | 0 | 0 |
| Mfr-backed service contract | 4 | 9 | 1 | 36 |
| CPO warranty | 9 | 8 | 0 | 33 |
| Independent service contract | 0 | 0 | 8 | 42 |

Factory paid-hours research counts: Factory time 29; Independent/retail time guide 5; OEM time × multiplier 2; Actual technician time 2; Negotiated/other 1; Statute silent on time 11.

These are enacted-law research classifications, including Rhode Island's October 1, 2026 provisions. The date selector updates upcoming/effective labels in the coverage view; it does not remove enacted future provisions from its fixed research totals. The original warranty matrix still applies its dated rule flags. Before October 1, Rhode Island's time and CPO changes are explicitly marked upcoming.

Required concerns statutory scope, not an unconditional payment method. Conditional cells show the specific condition. Not reached is an exclusion or scope limit. Not addressed is researched silence in the reviewed provisions, not Unverified and not a finding that no other law applies.

Factory time includes general time-allowance standards and additional-time rights. Mississippi's qualified-technician actual-time standard differs from Rhode Island's individual technician clock time. Wisconsin remains Negotiated/other in the supplied primary-method taxonomy: its time adjustment is in the hourly-rate denominator; paid hours remain OEM time.

The original JSON and Markdown patch are preserved verbatim under `docs/research/`. The display adapter reconciles older affirmative draft wording in FL/IL notes and WI's independent-contract narrative with the v2 cells; no supplied applicability or paid-hours value is changed.

## Warranty corrections

Connecticut's reasonable-and-adequate time language is restored. Pennsylvania is factory time with no statutory standard. North Carolina and Nebraska reflect the 2025 time-request amendments. Tennessee retains its retail labor-rate floor. Wyoming's retail ceiling and 2025 submission process, Virginia's deleted presumption, Hawaii's floor/cap, and Maine's posting condition are clarified. Mississippi's actual-time standard is included. The original actual-time checkbox now describes the primary standard, excluding guide-only fallbacks.

Earlier source availability and verification records are retained separately from the imported coverage research. The warranty source banner therefore differs from the v2 coverage banner. Historic checks are not silently converted into comprehensive current official reviews.

## Files

- `docs/research/labor-by-coverage-v2.json`: supplied 50-state JSON, unchanged.
- `docs/research/labor-by-coverage-patch-v2.md`: supplied patch and research notes, unchanged.
- `docs/coverage-data.js`: executable copy of the supplied JSON for the static site; keep it in sync with the source JSON.
- `docs/coverage.js`: coverage/status mappings, visible conditions, primary paid-hours taxonomy, date notes, and count calculation.
- `docs/data.js`: original 50-state warranty matrix and corrections, source links and review history.
- `docs/app.js`: rendering, filters, comparison, evidence drawers and share URLs.
- `docs/index.html`, `docs/styles.css`: structure, methodology and high-contrast visual labels.
- `docs/research.html`, `docs/labor-coverage-research-prompt.md`: reusable research instructions.
- `docs/labor-coverage-template.json`: original blank research template, not site data.

No build step or dependencies. Preview with `python -m http.server 8000 --directory docs`.

## Editing and validation

Read `AGENTS.md`. Update data, narrative and flags together; preserve conditions, source provenance and effective dates. Validate all 200 records and the exact tally/state lists, then test coverage/status/method filters, deep links, comparisons, evidence drawers, and the Rhode Island date boundary. Run `node --check` on each changed JavaScript file.
