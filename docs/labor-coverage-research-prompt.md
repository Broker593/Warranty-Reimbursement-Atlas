# Deep research: labor reimbursement by state and coverage

Independently research labor reimbursement protections for franchised passenger-vehicle dealers in all 50 U.S. states, with particular attention to Subaru of America (SOA). Produce evidence that can update this public reference:

- Website: https://broker593.github.io/Warranty-Reimbursement-Atlas/?view=labor
- Repository: https://github.com/Broker593/Warranty-Reimbursement-Atlas
- Existing warranty research: `docs/data.js`
- Coverage definitions and bucket IDs: `docs/coverage.js`
- Machine-readable starting template: https://broker593.github.io/Warranty-Reimbursement-Atlas/labor-coverage-template.json

Read the repository files directly if you cannot render the website. Treat its classifications as research leads, not established conclusions. Do not publish or modify the live site; return a reviewable research package.

## 1. Scope: 200 state / coverage records

Research each state separately for:

1. **Factory warranty** — original manufacturer warranty repair claims.
2. **Manufacturer-backed service contracts** — including Subaru Added Security; distinguish issuer, legal obligor, administrator and affiliated companies.
3. **CPO warranty** — repairs under certified pre-owned warranty coverage, separately from certification inspections, reconditioning and separately purchased service contracts.
4. **Independent service contracts** — contracts with independent obligors, even when sold by a franchised dealer.

Do not assume that a branded program falls within a statute. Trace definitions of warranty, manufacturer, affiliate, distributor, service contract, extended warranty and covered vehicle. If treatment varies by program or obligor within one category, record conditional subcases. Distinguish general state-law coverage from whether a specific Subaru contract qualifies. Identify the internal program documents needed to resolve any remaining Subaru questions.

Use the actual research date as the as-of date. Include enacted future changes with separate effective and applicability dates. Keep passenger vehicles separate from RVs and heavy trucks.

## 2. Separate hourly rates from paid hours

**Hourly dollar rate:** retail benchmark; sampled effective retail rate; posted rate; financial-statement formula; OEM-hour-normalized rate; negotiated or contract rate; regional/reasonable-compensation standard; other expressly supported methods. Split categories further when useful; do not force the findings into a fixed number of buckets.

**Paid hours:** OEM/factory guide; multiplier on OEM hours; third-party published guide; dealer customer-pay guide; agreed guide; documented actual technician time; other explicit methods. Record exact factors, ratios, denominators, election rights and fallback triggers. Distinguish actual time as the main method from actual time only when a guide lacks an operation.

For coverage applicability and each method, distinguish mandatory, dealer election, agreement required, conditional, fallback, expressly excluded and unverified. A method may belong to several buckets. A third-party time-guide publisher is not a third-party contract provider. A statute's use of an extended-warranty time guide for factory repairs does not prove that the statute covers service-contract repairs.

Do not assign OEM hours by default to states lacking an identified alternative. Do not invent a reasonable-time standard where the text is silent. Distinguish a rate multiplier from an hours multiplier and avoid double-counting a normalized-rate formula. A sample exclusion for CPO or service-contract repairs is not necessarily exclusion from reimbursement protection.

Check diagnostic time, technical assistance, agreed alternatives and whether service-contract repairs enter the retail-rate sample when material to the result. Public statutory methods do not establish actual dealer-specific rates or actual paid amounts.

## 3. Evidence and currency

Prioritize direct official statutory sections, enacted laws, regulations, agency orders and controlling decisions. Check amendments and effective dates against the current code; an accessible official page can still be superseded. Use enacted bill versions, not introduced bills. Where official text is inaccessible, identify the official access route and label any reproduction actually reviewed.

For every substantive finding, record: state, coverage, field, precise claim, statute and subsection, brief supporting excerpt, direct URL, publisher/source type, code edition or act, checked date, effective/applicability dates, conditions and unresolved interpretation. Verify that links reach the correct provision. Record access, currency and claim verification separately; a working portal is not verified statutory text. Leave unavailable data unverified and explain the next source needed.

Recheck high-risk existing distinctions, including Illinois's conditional multiplier, New Jersey's ratio and program scope, Wisconsin's normalized-rate denominator, and Rhode Island's October 2026 actual-time change. Independently verify the text and dates; do not simply repeat this prompt or the existing site.

## 4. Deliverables

1. **A 200-row CSV and completed JSON**, one record per state / coverage combination, using the template's IDs. Use method-level evidence references and conditional subcases. Return a proposed schema extension for useful new buckets. Keep unverified values explicit.
2. **Count tables by coverage and method:** identified states, mandatory/elected/conditional/fallback subsets, expressly excluded states, and unverified states. List state names behind every count. Count each state once within a bucket; explain overlap across buckets. Keep explicit exclusion separate from “not identified after a described search.”
3. **A claim-level evidence ledger** and link-check report, including stale text, portal-only access, amendment conflicts and sources still needed.
4. **Exact proposed site-data patches** with affected records, replacement wording, evidence and date logic. Resolve the existing combined-guide bucket into supported subtypes; never report its count as the third-party-guide count.
5. **A short findings and gaps memo**, prioritizing conclusions that could change reimbursement and identifying the SOA rate approvals, policy manuals, Added Security/CPO contracts or claims data needed for actual-payment analysis.

Do not claim “all 50 states verified” merely because all records have links. State exactly which claims were verified, through which source types, and which coverage questions remain unresolved.

