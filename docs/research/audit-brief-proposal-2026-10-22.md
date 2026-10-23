Review request: "Audit brief" for each state page of the Warranty Atlas. Please critique before I build it. I will answer your points and we go back and forth until we agree, up to three rounds.

CURRENT STATE OF THE SITE (it has changed since you built it): tabs are Audit Climate (map, 0-100 score from 14 limits), State Rules (matrix, 50 rows), Rule Patterns (counts), Who Governs, Cases & Laws, News, Downloads, Updates. Each state page has Key facts (labor rate, rate requests, response, paid hours, parts, service contracts, audits & chargebacks), then an Audit procedures section (12 yes/no rows with statute quotes), then the audit climate score box, then full statute details. Data lives in docs/data/audit-fields.json (claims, chargebacks, rate submission, penalties, with quotes and pinpoints) and docs/data/audit-procedures.json (12 procedure fields per state, each with required/limit/rule, detail, pinpoint, quote). No company names appear on the site.

WHAT THE AUDITOR ASKED FOR (reviewed the site Oct 16): the score is "nice to have" but he can't run an audit or support a chargeback from it. He wants, per state: "You're going to perform an audit in Florida. What do you need to know before you walk in that door?" One page, listing ONLY the rules that apply ("if it doesn't apply, I don't need to know about it"), with the actual answer on the line (e.g. "lookback 12 months", not a level or dots), statute link beside each line, printable for field staff doing claim reviews. He found the same state's rules spread across three sections and had to Ctrl-F. He also asked whether the fixed set of 14 limits could be missing unusual state rules, and named two he believes exist: California requires a local attorney review and a DMV board review before a chargeback; Illinois has "odd language around analytics". Keep the score, but he wouldn't use it.

PROPOSED DESIGN
1. A new "Audit brief" block at the top of every state page, above Key facts, generated from the existing data. Six groups, in the order an audit runs:
   A. Window: lookback from payment; what happens after it; fraud rule.
   B. Before the audit: advance notice, frequency cap, must the dealer be told why it was selected.
   C. What can be charged back: grounds (fraud, unsubstantiated, work not performed, etc.), documentation limits, clerical-error protection, extrapolation rule.
   D. After the audit: written reasons, dealer response period, internal appeal, is the chargeback held during a dispute, deadlines to take it.
   E. If done wrong: penalties and where the dealer protests.
   F. State-specific: anything that doesn't fit A-E.
   Only rules the state has appear. One closing line: "Not in this state's statute: advance notice, frequency cap, extrapolation" so the negative is still confirmed without 14 rows of "no".
   Each line: plain English, the actual value, a pinpoint cite that links to the statute, and the existing copy button.
2. The audit climate score box moves below the brief, collapsed by default.
3. A one-page "Audit brief" PDF per state in Downloads, separate from the existing state PDF (which he said has too much other material).
4. A research pass: (a) make "chargeback grounds" its own field for all 50 states (today it sits inside free text in claims.denial_requirements and chargebacks.limits); (b) check the California attorney-review and Illinois analytics claims against the statutes; (c) look for other "F. State-specific" rules the 14 limits miss.

DRAFT BRIEFS FROM THE CURRENT DATA (four review states)

FLORIDA (Fla. Stat. §§ 320.64(25), 320.696)
A. Window: 12 months from payment. After that, payments are final "for any reason notwithstanding any otherwise applicable law" - no fraud carve-out.
B. Before: no advance-notice requirement. No more than one warranty/service audit per calendar year; audits must be "reasonable and periodic". The dealer must be given a written statement of why it was selected (at the post-audit meeting).
C. Grounds: only the portion of a claim proven false or fraudulent, or not in substantial compliance with reasonable, written, uniformly applied procedures. No chargeback for failing to meet ALL claim-description or processing requirements. Extrapolation not addressed; claim-by-claim proof is implied by "only that portion ... proven".
D. After: within 30 days of the audit, meet the dealer (in person, phone or video) with a detailed explanation and documentation for each proposed chargeback. Dealer gets at least 45 days to respond; the basis can't change later without new information. Written notice of the final amount after internal dispute processes (an internal appeal isn't mandated). Dealer may protest to DHSMV within 30 days; no recovery until the department's final determination; licensee bears the burden.
E. If done wrong: an improper audit is a listed violation; treble damages, costs and attorney's fees; license sanctions for a pattern.
F. The same procedure covers incentive audits (12 months from payment).
Not in statute: internal appeal requirement, extrapolation rule.

CALIFORNIA (Cal. Veh. Code §§ 3065(e)-(f), 3065.1(g)-(h), 3065.4)
A. Window: 9 months from payment or credit. Longer only for a false claim submitted with intent to defraud, and only with a New Motor Vehicle Board order.
B. Before: one random audit per 9 months; any additional audit in that period needs written disclosure of its basis with the notice. Never punitive, retaliatory or discriminatory. No nonroutine or nonrandom audit in response to a rate request.
C. Grounds: same as denial grounds - false or fraudulent claim, repairs not properly made, repairs inappropriate due to the dealer's improper act or omission, or MATERIAL noncompliance with reasonable, nondiscriminatory documentation/administrative requirements (dealer gets 30 days to cure; a cured claim can't be charged back). Extrapolation only from a random sample with a reasonable, statistically valid method.
D. After: written disapproval notice stating specific grounds within 30 days of the audit. At least 30 days to rebut and cure. A reasonable appeal process is required; "Final Denial" notice within 30 days after the appeal ends. No chargeback until 45 days after the notice; it must be taken within 90 days. If the dealer files a Board protest (within 6 months) first, no offset or collection until the Board's final order, then 90 days to charge back.
E. If done wrong: Board protest with the franchisor bearing the burden; DMV may suspend or revoke the license for willful violation.
F. Incentive audits follow the same procedure (§ 3065.1(g)), with ineligibility under program terms as an added ground.
Not in statute: a general advance-notice requirement for the one random audit.
Open question: the attorney-review and DMV board review the auditor described. Our data shows the Board protest process and the Board order for fraud lookback; nothing about an attorney review. Do you know of any provision that supports it? Cite the text if so.

ILLINOIS (815 ILCS 710/6(b))
A. Window: 1 year from payment or credit. After that, a fraudulent claim can be charged back only if fraud is established in an Illinois court.
B. Before: nothing in the statute (no notice, selection, or frequency rule).
C. Grounds: the statute says the manufacturer may charge back "false or unsubstantiated" claims, and separately that "no debit reduction or charge back of any item on a warranty repair order may be made absent a finding of fraud or illegal actions by the dealer". The two sentences aren't reconciled; read literally the second bars clerical-only chargebacks. Documentation: may require only "reasonable documentation". No reductions based on market norms or averages; no failure-rate-index limits on repair frequency. Extrapolation: silent.
D. After: nothing for chargebacks (the 30-day written-grounds and correct-and-resubmit rules cover disapproval of submitted claims, not chargebacks of paid claims).
E. If done wrong: damages, injunction, treble damages if willful; fees to a dealer that substantially prevails. No license sanction on manufacturers.
F. The same 1-year rule covers all incentive and reimbursement programs.
Not in statute: advance notice, selection basis, frequency cap, written reasons before chargeback, response period, appeal, stay, extrapolation.
Open question: "odd language around analytics". The closest we have is the ban on reductions "based on market norms or averages" and failure-rate limits. Is there other text? Cite it if so.

ARKANSAS (Ark. Code Ann. § 23-112-313(e))
A. Window: 1 year from payment or credit. A fraudulent claim may be charged back within 2 years of the claim date, but only if fraud is established in an Arkansas court.
B. Before: statute silent on notice, selection and frequency.
C. Grounds: only "false or unsubstantiated" claims. The manufacturer may require documentation (no stated limit). A claim may not be disapproved for a clerical error that doesn't change the amount. Extrapolation: silent.
D. After: no rebuttal period before a chargeback. Dealer may appeal any chargeback to the Motor Vehicle Commission within 90 days of notification; once filed, the chargeback may not be levied until resolved; hearing within 120 days.
E. If done wrong: Commission appeal (automatic bar on levying while pending); license sanctions for failing to fairly compensate; damages and fees for willful noncompliance.
F. Same rules for incentive and reimbursement programs, 12 months from the transaction date.
Not in statute: advance notice, selection basis, frequency cap, written reasons before chargeback, response period, internal appeal, extrapolation.

QUESTIONS FOR YOU
1. Is the A-F order right for how an audit actually runs, and is anything an auditor needs missing from the groups?
2. "Only what applies, plus one 'not in statute' line": right call, or should every item show with its answer?
3. Chargeback grounds as a dedicated field for all 50 states: agree? How would you define it so it's extracted consistently (denial grounds vs chargeback grounds vs post-window fraud)?
4. The California and Illinois open questions above.
5. What would you change in the four draft briefs? Flag anything that reads wrong against the statute text you know.
6. One-page PDF: anything to add or cut for field staff doing claim reviews?
