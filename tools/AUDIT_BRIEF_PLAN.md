# Audit brief: agreed approach (2026-10-22)

Agreed after a three-round review with ChatGPT ("Warranty Atlas – Reviews" chat) of the
proposal written from the warranty auditor's feedback of 2026-10-16. Statutory claims raised in
the review were checked against the official text before being adopted.

## What it is
A per-state "Audit brief" generated from structured data: what an auditor needs to know before
auditing a dealer's paid factory-warranty claims and charging any back. It appears at the top of
every state page (above Key facts) and as a one-page PDF, which is the primary design target. The
audit climate score moves below the brief, collapsed. Nothing is hand-written per state; the brief
and the PDF render from the same data as the State Rules matrix.

## Layout
"Covers:" line (programs the rules reach; factory warranty first, others only where the statute
treats them differently, shown as conditional rules), then five sections:
1. Audit eligibility: which claims and programs can be audited, how far back, from what date.
2. Planning restrictions: frequency cap, advance notice, selection basis.
3. Testing and findings: chargeback grounds, documentation limits, clerical errors, sampling and
   extrapolation, proof requirements, recovery scope.
4. Chargeback process: written reasons, dealer response and cure, internal appeal, stay during a
   dispute, recovery deadline.
5. Exceptions and escalation: post-window (fraud) exception, unusual state rules, legal-review
   flags, where the dealer protests. Penalties as one short closing line.

Only applicable rules appear. One footer line: "Not expressly addressed in reviewed statutes
(verified <source verification date>): ..." scoped to the programs the brief covers. The website
adds a collapsed "Other topics reviewed" section with the longer notes. Any rule whose
interpretation_status is conflict or unresolved renders a "LEGAL REVIEW REQUIRED" block that
stays until the interpretation is resolved and documented in the data.

## Data model (new fields per state)
- claim_denial_grounds: express grounds for disapproving a submitted claim before payment.
- paid_claim_chargeback_grounds: express grounds for reversing a paid or credited claim. Denial
  grounds carry over only by explicit cross-reference or clear equivalence in the text.
- proof_requirements: evidence, findings, materiality, burden, and any court or board
  determination; distinguish an ordinary finding from a mandated adjudication.
- cure_rights: what the dealer may correct, at which stage, trigger, deadline, effect of cure.
- recovery_scope: improper portion only | entire claim | not expressly specified (never infer
  whole-claim recovery from silence).
- post_window_exception: which window is extended, qualifying circumstances, trigger date,
  outside deadline, prerequisites.
- audit_window and recovery_deadline kept separate (an audit deadline is not a deduction deadline).
- Each rule carries: rule_effect (required | prohibited | permitted | conditional |
  not_expressly_addressed), interpretation_status (express | reasoned_interpretation | conflict |
  unresolved, with a one-sentence reason unless express), coverage type, pinpoint, verbatim quote,
  source version, verified date. A not-expressly-addressed finding carries the sources reviewed,
  their scope and the verification date instead of a quote.

## State-specific decisions from the review
- California: no attorney-review rule (no statutory basis found). Board protest stay (§ 3065(e)(5))
  and the fraud-extension Board order (§ 3065(f)) are two separate rules. Frequency: one random
  audit per 9 months; additional audits need written basis. Recovery window keyed to the written
  notice; protest stay separate.
- Illinois: the § 6(b) conflict ("false or unsubstantiated" vs "absent a finding of fraud or
  illegal actions") renders as a LEGAL REVIEW REQUIRED block using the agreed wording; add the
  Motor Vehicle Review Board protest (§ 12); analytics limited to what the text says.
- Florida: add § 320.64(41) (used-vehicle warranty and recall repairs); distinguish the
  calendar-year cap (warranty, retail repair, service audits) from incentive audits; keep the
  "new information within 30 days" rule; § 320.64(26) as a conditional incentive rule.
- Arkansas: clerical-error rule is a disapproval rule, not a chargeback rule; incentives measured
  from the transaction date; fraud exception keeps the court-finding condition and 2-year limit.

## Sequence
1. Phase 1: structured validation of every existing field plus an open-ended exception search
   (outside the 14 limits) for FL, CA, IL and AR.
2. Phase 2: generate the four briefs and PDFs; before/after example pages for review; the auditor
   walks real scenarios (a proposed chargeback, a dispute, a claim outside the window). His
   acceptance tests usability, not legal correctness; material ambiguities stay flagged.
3. Phase 3: the other 46 states with the approved schema and layout, resolving material
   exceptions before each brief publishes.

PDFs carry the version and verification date in the footer and file name so superseded copies are
identifiable.

## Status
- 2026-10-23: Phase 1 done for FL, CA, IL and AR (research files in `docs/research/audit-brief/`; corrections applied to audit-fields.json and audit-procedures.json: FL payment trigger and protest wording; CA chargeback limits, advance notice reclassified as not addressed, clerical-error wording; IL clerical-error wording (kept as applying, conflict flagged); AR denial requirements, chargeback limits, sanctions qualifier, rate-submission standard, clerical-error rule noted as a disapproval rule). Phase 2 built: `docs/data/audit-brief/`, the state-page block, the one-page PDFs and check 13. Awaiting the auditor's scenario walk-through before Phase 3.
