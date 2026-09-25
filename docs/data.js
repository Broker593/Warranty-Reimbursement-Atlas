window.REFERENCE = {
  "date": "September 25, 2026",
  "rules": [
    {
      "id": "retail_parts",
      "group": "Parts",
      "name": "Retail parts benchmark",
      "short": "Retail parts",
      "description": "The dealer’s retail parts price or markup is a statutory reference, floor or available reimbursement route. This broad flag includes reasonableness-based benchmarks; it does not mean an unconditional retail entitlement.",
      "example": "Typical method: eligible retail parts sales ÷ eligible parts cost − 1."
    },
    {
      "id": "special_parts",
      "group": "Parts",
      "name": "Special parts formula or floor",
      "short": "Special parts formula",
      "description": "The reviewed ordinary-parts provision includes a financial-statement/list-price alternative or a stated gross-profit minimum. This flag does not attempt to classify all free-part, battery or major-assembly exceptions.",
      "example": "Florida has alternative calculations. Kentucky’s gross-profit wording needs careful interpretation."
    },
    {
      "id": "retail_labor",
      "group": "Hourly rate",
      "name": "Retail hourly-rate benchmark",
      "short": "Retail hourly rate",
      "description": "The dealer’s retail labor charges are a statutory reference, floor or rate-setting route. Requirements differ between sampled effective rates, posted rates and reasonable-compensation benchmarks.",
      "example": "A common effective rate is eligible labor sales ÷ eligible customer-billed hours."
    },
    {
      "id": "posted_labor",
      "group": "Hourly rate",
      "name": "Posted retail labor rate",
      "short": "Posted retail rate",
      "description": "The reviewed statute expressly connects labor reimbursement to the dealer’s posted retail labor rate.",
      "example": "Identified in Maine, Tennessee and Vermont."
    },
    {
      "id": "financial_labor",
      "group": "Hourly rate",
      "name": "Financial-statement labor alternative",
      "short": "Financial formula",
      "description": "A separate labor-rate route uses dealership financial statements and technician wages, rather than only the ordinary sampled retail rate.",
      "example": "Florida’s no-agreement route offers the greater result under specified methods."
    },
    {
      "id": "independent_guide_floor",
      "group": "Paid hours",
      "name": "Independent-guide floor (unless agreed)",
      "short": "Independent-guide floor",
      "description": "Time allowances may not be below independent labor time guides unless otherwise agreed. This is a waivable floor, not a mandatory dealer retail guide.",
      "example": "Alaska."
    },
    {
      "id": "agreed_time_guide",
      "group": "Paid hours",
      "name": "Agreed guide with multiplier fallback",
      "short": "Agreed guide",
      "description": "An agreed extended-warranty guide may be used. If no guide is agreed or it omits the repair, OEM time × 1.5 applies.",
      "example": "Illinois. The separate multiplier box identifies that conditional fallback."
    },
    {
      "id": "retail_time",
      "group": "Paid hours",
      "name": "Dealer retail time guide",
      "short": "Dealer retail guide",
      "description": "The reviewed provision uses the time guide the dealer uses for customer-pay repairs. Actual-time fallbacks are classified separately; Montana’s OEM-or-retail election is a separate flag.",
      "example": "Minnesota, New York and North Dakota."
    },
    {
      "id": "guide_election",
      "group": "Paid hours",
      "name": "Dealer elects OEM or retail guide",
      "short": "OEM / retail election",
      "description": "The dealer may elect the manufacturer’s time guide or its own customer-pay guide.",
      "example": "Montana."
    },
    {
      "id": "actual_time_fallback",
      "group": "Paid hours",
      "name": "Actual time when retail guide is unavailable",
      "short": "Actual-time fallback",
      "description": "Actual time is a fallback when the relevant customer-pay guide is unavailable or does not cover the repair, subject to the retail-time floor. This is not the primary actual-time rule.",
      "example": "Minnesota and North Dakota."
    },
    {
      "id": "time_multiplier",
      "group": "Paid hours",
      "name": "Explicit multiplier on OEM hours",
      "short": "OEM time multiplier",
      "description": "An express factor adjusts OEM labor-guide hours. This is a change to paid time, distinct from the nominal hourly rate.",
      "example": "Illinois: conditional 1.5 factor. New Jersey: dealer-derived ratio of customer-billed hours to OEM hours."
    },
    {
      "id": "normalized_rate",
      "group": "Hourly rate",
      "name": "OEM-hour-normalized labor rate",
      "short": "OEM-hour rate conversion",
      "description": "Customer labor charges are divided by OEM-guide hours for the same repairs. The resulting effective rate is applied to OEM warranty hours, incorporating the time difference into the rate. This is an hourly-dollar-rate conversion. OEM warranty hours remain the paid-hours basis; do not apply a second time multiplier.",
      "example": "Wisconsin. Do not apply a second time multiplier to duplicate the adjustment."
    },
    {
      "id": "actual_time",
      "group": "Paid hours",
      "name": "Primary actual-time labor standard",
      "short": "Actual-time standard",
      "description": "The primary paid-hours rule uses the particular technician’s documented actual time. Rhode Island only, effective October 1, 2026. Mississippi’s qualified-technician reasonableness benchmark, guide-specific fallbacks and heavy-truck exceptions are not counted here.",
      "example": "Rhode Island uses documented technician time from October 1, 2026. Before that date, no state in this passenger-vehicle comparison is checked."
    },
    {
      "id": "sample_100_90",
      "group": "Rate submissions",
      "name": "100 repair orders / 90-day sample",
      "short": "100 ROs / 90 days",
      "description": "At least one reviewed rate-setting procedure offers or uses 100 sequential repair orders and a 90-day sample. Dealer choice, fewer-order rules and greater-average rules are not equivalent; consult state details.",
      "example": "A common pattern uses the fewer number of qualifying orders, with repairs within 180 days."
    },
    {
      "id": "sample_60",
      "group": "Rate submissions",
      "name": "60-day sample alternative",
      "short": "60-day sample",
      "description": "At least one reviewed parts or labor rate procedure uses a 60-day alternative to a 100-order sample. This is a sampling period, not an approval deadline.",
      "example": "Connecticut, Maine, Massachusetts, North Carolina, Rhode Island and Vermont."
    },
    {
      "id": "prior_month",
      "group": "Rate submissions",
      "name": "Prior-month labor sample",
      "short": "Prior-month labor",
      "description": "A labor-rate route uses qualifying repair orders from the preceding month.",
      "example": "Connecticut and Rhode Island; also Florida’s effective-rate route."
    },
    {
      "id": "lookback_90",
      "group": "Rate submissions",
      "name": "90-day submission recency limit",
      "short": "90-day recency",
      "description": "The ordinary submitted repair orders must generally be from the preceding 90 days. This limits the age of evidence; it differs from a 90-day sampling period.",
      "example": "Colorado, subject to its additional-order rules."
    },
    {
      "id": "special_sample",
      "group": "Rate submissions",
      "name": "Other special sample selection",
      "short": "Special sample selection",
      "description": "A reviewed procedure has a distinct selection rule: 50 repairs, an all-order fallback, a separate 100-order labor sample, comparison by total cost, or the greater of labor averages.",
      "example": "See California, Florida, Hawaii, Illinois, Maine, Texas and Vermont for the exact requirement."
    },
    {
      "id": "accuracy_only",
      "group": "Rate submissions",
      "name": "Accuracy-limited rate challenge",
      "short": "Accuracy-limited challenge",
      "description": "The reviewed rate-submission challenge is limited to accuracy or completeness rather than a broader market-reasonableness comparison. Read the state detail for materiality, supplemental-order procedures and deadlines. This does not classify claim audits.",
      "example": "Maryland: material inaccuracy. Oklahoma: inaccuracy or incompleteness."
    },
    {
      "id": "automatic_rate",
      "group": "Rate submissions",
      "name": "Rate effective without express approval",
      "short": "Automatic rate effect",
      "description": "A qualifying submitted rate becomes effective, or is deemed approved, if no timely rebuttal occurs. This is a rate-submission rule, not a warranty-claim payment deadline. State-specific conditions and effective dates still apply.",
      "example": "Maryland: day 31 without timely rebuttal. Oregon: deemed approval after 30 days, followed by another 30 days to effectiveness."
    }
  ],
  "states": [
    {
      "state": "Alabama",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Ala. Code § 8-20-7",
      "note": "Retail rate remains subject to statutory reasonableness and comparable-dealer factors.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/alabama-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "AL",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://alison.legislature.state.al.us/code-of-alabama?section=8-20-7",
        "kind": "portal",
        "note": "ALISON code viewer; navigate to §8-20-7. Link availability does not verify the summary.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Link supplied by external review; browser access and exact destination not independently confirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Alaska",
      "parts": "Average retail percentage markup.",
      "labor": "At least the dealer’s retail rate for similar work, unless otherwise agreed.",
      "time": "Unless otherwise agreed, time allowances may not be below independent labor time guides.",
      "sample": "Parts: Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "AS 45.25.210",
      "note": "2025 code reproduction includes the independent-time-guide provision omitted from the older vendor page.",
      "basis": "2025 code reproduction (Justia); official enactment history checked.",
      "sourceDate": "2025 code",
      "url": "https://law.justia.com/codes/alaska/title-45/chapter-25/article-2/section-45-25-210/",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/alaska-retail-warranty-reimbursement-law/",
      "abbr": "AK",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": true,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "http://www.akleg.gov/basis/statutes.asp#45.25.210",
        "kind": "portal",
        "note": "Alaska statutory viewer. The reviewed source remains the 2025 Justia reproduction.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Link supplied by external review; browser access and exact destination not independently confirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied v3 taxonomy: independent, agreed, retail and elected guides and actual-time fallbacks are separate flags. Wisconsin’s OEM-hour conversion belongs to the hourly-rate group; OEM hours remain the paid-hours basis.",
          "url": "https://www.akleg.gov/basis/statutes.asp?media=print&secStart=45.25.010&secEnd=45.25.990",
          "sourceType": "Supplied v3 research; taxonomy correction"
        }
      ]
    },
    {
      "state": "Arizona",
      "parts": "Fair compensation; dealer may elect its customary retail markup.",
      "labor": "Dealer may elect its customary retail labor rate.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "A.R.S. § 28-4451(D)–(E)",
      "note": "Reasonableness can consider comparable same-line dealers; retail-rate validation can lead to a prospective decrease.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/arizona-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "AZ",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.azleg.gov/ars/28/04451.htm",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Arkansas",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Retail-equivalent compensation, subject to reasonableness and comparable-market provisions.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Ark. Code §§ 23-112-310(d), 23-112-313",
      "note": "Parts calculation uses OEM parts; mixed repair orders may still qualify.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/arkansas-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "AR",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.lexisnexis.com/hottopics/arcode/Default.asp",
        "kind": "portal",
        "note": "Arkansas Code public-access route supplied by external review. Navigate to §§23-112-310 and 23-112-313.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Link supplied by external review; browser access and exact destination not independently confirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "California",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate time; blanket percentage cuts in repair time are prohibited.",
      "sample": "Dealer choice: 100 consecutive qualified ROs, including intervening nonqualified ROs, or all ROs in 90 consecutive days; within 180 days.",
      "statute": "Cal. Veh. Code §§ 3065, 3065.2",
      "note": "A voluntary written alternative may be used if it fairly compensates the dealer.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/california-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "CA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": true,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=3065.2.&lawCode=VEH",
        "kind": "text",
        "note": "Official §3065.2 (retail-rate submissions). Read alongside §3065 for the general warranty framework. Summary comparison remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Colorado",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable time allowances; rate disputes focus on material accuracy.",
      "sample": "Dealer choice: 100 sequential ROs or all ROs in 90 consecutive days. Submitted repair orders generally must be from the preceding 90 days.",
      "statute": "Colo. Rev. Stat. § 44-20-141.5",
      "note": "The source uses a 90-day recency window, rather than the 180-day window common elsewhere.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/colorado-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "CO",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": true,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://leg.colorado.gov/laws/colorado-revised-statutes",
        "kind": "portal",
        "note": "Official code access directory. Locate §44-20-141.5 and check the applicable edition and later amendments. A 2024 PDF alone does not establish 2026 currency.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Official access directory retrieved 2026-09-24; links to the LexisNexis code. Section text not retrieved."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Connecticut",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Retail rate: all nonwarranty customer-paid ROs from the month before submission; total labor sales ÷ labor hours. Presumed fair unless rebutted within 30 days vs other same line-make dealers 'in the vicinity'; effective 30 days after declaration; protest to the DMV Commissioner; ≤2 declarations per calendar year.",
      "time": "Time allowances for diagnosis and performance of warranty work and service must be reasonable and adequate for the work to be performed. Conn. Gen. Stat. § 42-133s(h). The earlier silence classification was incorrect.",
      "sample": "Parts: fewer of 100 sequential ROs or 60 days, within 180 days. Labor: all qualifying customer-pay ROs in the preceding month.",
      "statute": "Conn. Gen. Stat. § 42-133s",
      "note": "Parts and labor use different sampling periods; comparable-dealer reasonableness applies.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/connecticut-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "CT",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": true,
        "prior_month": true,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": false,
        "automatic_rate": true,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.cga.ct.gov/current/pub/chap_739.htm#sec_42-133s",
        "kind": "text",
        "note": "§42-133s. Parts and labor have different samples; see the 2026 supplement for any applicable amendments.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Relevant text retrieved on 2026-09-24."
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Earlier time-allowance classification superseded by the September 25 v2 correction. Section 42-133s(h) requires reasonable and adequate time allowances. Earlier rate-submission review retained."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Checked the cited warranty section for the time-allowance correction. Broader summary verification remains incomplete. The prior time-silence conclusion was corrected on September 25, 2026 using v2’s quotation of subsection (h).",
          "url": "https://www.cga.ct.gov/current/pub/chap_739.htm#sec_42-133s",
          "sourceType": "Official text"
        },
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Time allowances for diagnosis and performance of warranty work and service must be reasonable and adequate for the work to be performed. Conn. Gen. Stat. § 42-133s(h). The earlier silence classification was incorrect.",
          "url": "https://www.cga.ct.gov/current/pub/chap_739.htm",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "process": {
        "challenge": "Reasonableness against same-line dealers in the vicinity; rebut within 30 days.",
        "rateApproval": "Declared retail parts and labor rates take effect 30 days after declaration, subject to audit and timely rebuttal.",
        "claimApproval": "Claim-approval mechanics not classified in this update."
      },
      "extraSources": [
        {
          "url": "https://www.cga.ct.gov/current/pub/chap_739.htm",
          "label": "V2 labor research source"
        },
        {
          "url": "https://www.cga.ct.gov/2026/ACT/PA/PDF/2026PA-00024-R00SB-00413-PA.PDF",
          "label": "V2 labor research source"
        }
      ]
    },
    {
      "state": "Delaware",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "6 Del. C. § 4903",
      "note": "Rate-change requests generally permitted every nine months; statutory exclusions apply.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/delaware-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "DE",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://delcode.delaware.gov/title6/c049/index.html#4903",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Florida",
      "parts": "Agreed markup; absent agreement, greatest statutory result: mean markup from 50 repairs, highest OEM list/suggested price, or financial-statement gross-profit method.",
      "labor": "Agreed rate; absent agreement, dealer may elect the greater of prior-month effective retail rate or the statutory gross-profit / technician-wage method.",
      "time": "OEM time allowances must be reasonable and adequate; the rate formula alone does not set paid hours.",
      "sample": "Parts sample: 50 consecutive repairs within 3 months (or all if fewer). Other routes use two months of financials. Labor effective-rate route uses prior month.",
      "statute": "Fla. Stat. § 320.696",
      "note": "Parts sample uses a mean of individual markups, not the usual aggregate sales/cost calculation. See statute for selection and negotiation rules.",
      "basis": "Official statute checked.",
      "sourceDate": "Official current page",
      "url": "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0300-0399/0320/Sections/0320.696.html",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/florida-warranty-reimbursement-law/",
      "abbr": "FL",
      "flags": {
        "retail_parts": true,
        "special_parts": true,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": true,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": false,
        "prior_month": true,
        "lookback_90": false,
        "special_sample": true,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0300-0399/0320/Sections/0320.696.html",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Georgia",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "O.C.G.A. § 10-1-641",
      "note": "Reasonableness considers comparable same-line dealers in the relevant geographic area.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/georgia-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "GA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://advance.lexis.com/container?config=00JAAzZDgzNzU2ZC05MDA0LTRmMDItYjkzMS0xOGY3MjE3OWNlODIKAFBvZENhdGFsb2fcIFfJnJ2IC8XZi1AYM4Ne",
        "kind": "portal",
        "note": "Georgia General Assembly Public Access, hosted by LexisNexis. Navigate to Title 10, Chapter 1, §10-1-641. This is an access portal, not a direct section link.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Public-access container located in search; section content and interactive access not verified."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "pendingNote": "External review reports 2025 SB81 compensation for OTA/remote-update assistance. Verify the enacted text and current §10-1-641 before relying on this addition; a direct section link remains pending."
    },
    {
      "state": "Hawaii",
      "parts": "At least dealer retail markup, if reasonable against same-line dealers in Hawaii.",
      "labor": "Retail rate: warranty labor rate per hour can be no less than the rate the dealer charges retail customers, and no more than it. The statute gives no RO-sample method for labor; the RO method in § 437-56(b) is for parts markup only.",
      "time": "Statute silent on a general paid-hours allowance standard. Hourly compensation must be neither below nor above the dealer’s retail hourly rate.",
      "sample": "Parts: 100 qualifying customer-paid ROs. If unavailable within the preceding two months, submit all types of ROs for that two-month period.",
      "statute": "HRS §§ 437-56, 437-28(a)(21)(G)",
      "note": "Official parts and labor sections checked. Engine/transmission assemblies are excluded from the parts rate sample.",
      "basis": "Official parts and labor statutes checked.",
      "sourceDate": "Official current pages",
      "url": "https://data.capitol.hawaii.gov/hrscurrent/Vol10_Ch0436-0474/HRS0437/HRS_0437-0056.htm",
      "additional": "https://data.capitol.hawaii.gov/hrscurrent/Vol10_Ch0436-0474/HRS0437/HRS_0437-0028.htm",
      "abbr": "HI",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": true,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://data.capitol.hawaii.gov/hrscurrent/Vol10_Ch0436-0474/HRS0437/HRS_0437-0056.htm",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Relevant official text retrieved on 2026-09-24. See the review record for which provisions were compared.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-24",
        "scope": "Checked §437-56 and §437-28(a)(21) for time-allowance wording. Keep hourly-rate compensation distinct from the number of paid hours."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Checked §437-56 and §437-28(a)(21) for time-allowance wording. Keep hourly-rate compensation distinct from the number of paid hours.",
          "url": "https://data.capitol.hawaii.gov/hrscurrent/Vol10_Ch0436-0474/HRS0437/HRS_0437-0056.htm",
          "sourceType": "Official text"
        },
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Statute silent on a general paid-hours allowance standard. Hourly compensation must be neither below nor above the dealer’s retail hourly rate.",
          "url": "https://data.capitol.hawaii.gov/hrscurrent/Vol10_Ch0436-0474/HRS0437/HRS_0437-0028.htm",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "pendingNote": "External review flags potentially different claim deadlines in §437-56(d) and §437-28(a)(21)(G). Applicability needs reconciliation before classifying a single claim-payment deadline.",
      "extraSources": []
    },
    {
      "state": "Idaho",
      "parts": "Retail-rate benchmark, subject to statutory reasonableness. An express dealer-cost-plus-markup formula has not been independently confirmed.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Idaho Code § 49-1626(11)",
      "note": "Retail rate cannot be unreasonable against relevant same-line / competitive franchise comparisons.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/idaho-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "ID",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://legislature.idaho.gov/statutesrules/idstat/Title49/T49CH16/SECT49-1626/",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "pendingNote": "External review questions whether the statute expressly supports a cost-plus formula. The text below has been softened to avoid an unsupported formula."
    },
    {
      "state": "Illinois",
      "parts": "Dealer cost, including shipping, plus the qualifying retail markup.",
      "labor": "Same effective labor rate received for customer-pay repairs.",
      "time": "Time at least equivalent to retail. Agreed extended-warranty guide may replace actual time; without an agreed guide or covered operation, use OEM time × 1.5.",
      "sample": "Parts: Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days. Labor: 100 sequential ROs, excluding simple maintenance.",
      "statute": "815 ILCS 710/6",
      "note": "The 1.5 factor is conditional; it is not an across-the-board 50% increase to the hourly rate.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/illinois-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "IL",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": true,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": true,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": true,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.ilga.gov/legislation/ilcs/documents/081507100K6.htm",
        "kind": "text",
        "note": "Direct section page for 815 ILCS 710/6, supplied by external review. Existing official-text review status retained.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Retrieval attempt 2026-09-24 failed with a gateway error; browser availability remains unconfirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied v3 taxonomy: independent, agreed, retail and elected guides and actual-time fallbacks are separate flags. Wisconsin’s OEM-hour conversion belongs to the hourly-rate group; OEM hours remain the paid-hours basis.",
          "url": "https://www.ilga.gov/Documents/legislation/ilcs/documents/081507100K6.htm",
          "sourceType": "Supplied v3 research; taxonomy correction"
        }
      ]
    },
    {
      "state": "Indiana",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Retail-based reasonable labor rate, unless otherwise agreed; statewide uniform labor rates are prohibited.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Ind. Code §§ 9-32-13-15, 15.5, 16",
      "note": "Separate voluntary uniform-parts/time programs have additional statutory conditions.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/indiana-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "IN",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://iga.in.gov/laws/2025/ic/titles/9",
        "kind": "portal",
        "note": "Official 2025 Title 9 viewer. Navigate to Article 32, Chapter 13. The review-supplied PDF URL returned an application shell; exact current section text remains unverified.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Checked 2026-09-24: interactive viewer shell retrieved; section text not retrieved."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "pendingNote": "External review reports P.L.92-2025 removed a pre-complaint mediation-demand requirement. Amendment comparison remains pending."
    },
    {
      "state": "Iowa",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Iowa Code § 322A.5",
      "note": "Retail calculations remain subject to the statute’s reasonableness and exclusion provisions.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/iowa-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "IA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.legis.iowa.gov/docs/code/322A.5.pdf",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Kansas",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "K.S.A. § 8-2415",
      "note": "Reasonable compensation; dealer-specific retail submission establishes the requested rates.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/kansas-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "KS",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.kslegislature.gov/b2025_26/laws/008_000_0000_chapter/008_024_0000_article/008_024_0015_section/008_024_0015_k/",
        "kind": "text",
        "note": "Official §8-2415 text. Recheck the biennium-specific URL in 2027.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Relevant text retrieved on 2026-09-24."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Kentucky",
      "parts": "Retail benchmark includes the statutory phrase “dealer cost plus thirty percent (30%) gross profit”; filed warranty schedule is also referenced.",
      "labor": "Reasonable compensation with dealer retail and filed manufacturer-schedule benchmarks.",
      "time": "General vehicle rule requires reasonable diagnostic, repair and administrative compensation.",
      "sample": "No standard 100-RO / 90-day rate-submission formula identified in the reviewed general-vehicle provision.",
      "statute": "KRS § 190.046",
      "note": "Do not label the statutory gross-profit wording simply 30% markup. Class 7+ commercial-vehicle provisions began with 2024 HB592 (effective July 15, 2024) and were expanded by 2026 chapter 83 (effective July 15, 2026). Those provisions are separate from Subaru passenger-vehicle rules.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "June 25, 2026",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/kentucky-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "KY",
      "flags": {
        "retail_parts": true,
        "special_parts": true,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=57533",
        "kind": "text",
        "note": "Official section PDF; includes amendment effective July 15, 2026. Summary comparison remains pending.",
        "linkStatus": "Relevant official text retrieved on 2026-09-24. See the review record for which provisions were compared.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Checked the current section amendment history and the official 2024 HB592 enacted summary for the origin of Class 7+ provisions."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Checked the current section amendment history and the official 2024 HB592 enacted summary for the origin of Class 7+ provisions.",
          "url": "https://apps.legislature.ky.gov/record/24rs/hb592.html",
          "sourceType": "Official text"
        }
      ]
    },
    {
      "state": "Louisiana",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "La. R.S. § 32:1262",
      "note": "Qualifying retail mix and statutory exclusions govern the rate calculation.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/louisiana-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "LA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://legis.la.gov/legis/Law.aspx?d=321503",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Maine",
      "parts": "Customary retail parts rate for vehicles not over 10,000 lb GVWR; dealer-specific markup.",
      "labor": "The 'retail rate customarily charged by that franchisee for the same labor when not performed in satisfaction of a warranty', as long as the nonwarranty labor rate is 'routinely posted in a place conspicuous to its service customer'. The statute has no RO-sample method for labor; the 100-RO / 60-day method is for parts markup only.",
      "time": "Statute silent on a general paid-hours allowance standard. The customary retail hourly rate applies only when routinely posted conspicuously for service customers.",
      "sample": "Parts: 100 sequential ROs or 60 days, whichever is less in total cost; repairs within 180 days.",
      "statute": "10 M.R.S. § 1176",
      "note": "Vehicle-weight distinction matters. Parts markup requests may be made twice per calendar year.",
      "basis": "Official statute checked.",
      "sourceDate": "2025 code extraction",
      "url": "https://legislature.maine.gov/statutes/10/title10sec1176.html",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/maine-warranty-reimbursement-law/",
      "abbr": "ME",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": true,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": true,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": true,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://legislature.maine.gov/statutes/10/title10sec1176.html",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Relevant official text retrieved on 2026-09-24. See the review record for which provisions were compared.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-24",
        "scope": "Confirmed §1176 vehicle-weight boundary: the separate rule is for vehicles over 10,000 lb GVWR, so exactly 10,000 is included in the ordinary retail-parts rule."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Confirmed §1176 vehicle-weight boundary: the separate rule is for vehicles over 10,000 lb GVWR, so exactly 10,000 is included in the ordinary retail-parts rule.",
          "url": "https://legislature.maine.gov/statutes/10/title10sec1176.html",
          "sourceType": "Official text"
        },
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Statute silent on a general paid-hours allowance standard. The customary retail hourly rate applies only when routinely posted conspicuously for service customers.",
          "url": "https://legislature.maine.gov/statutes/10/title10sec1176.html",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "extraSources": []
    },
    {
      "state": "Maryland",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "At least current retail labor rate for like nonwarranty repairs.",
      "time": "Reasonable and adequate time allowances for labor, including diagnostic labor and associated administrative requirements.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Md. Code, Transp. §15-212(c)",
      "note": "Rate-submission disputes are limited to material inaccuracy. Annual rate verification may change compensation prospectively. Warranty chargebacks generally have a nine-month window, with a fraud exception; §15-212.1 is a separate incentive-claims provision.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/maryland-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "MD",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": true,
        "automatic_rate": true,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gtr&section=15-212&enactments=false",
        "kind": "text",
        "note": "Warranty reimbursement is §15-212(c). Section 15-212.1 concerns incentive claims.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Relevant text retrieved on 2026-09-24."
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Corrected citation; checked retail floors, sample, time allowances, rate challenges and approval, and warranty claim approval/chargeback provisions in §15-212(c)."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Corrected citation; checked retail floors, sample, time allowances, rate challenges and approval, and warranty claim approval/chargeback provisions in §15-212(c).",
          "url": "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gtr&section=15-212&enactments=false",
          "sourceType": "Official text"
        }
      ],
      "process": {
        "challenge": "Material inaccuracy only; written rebuttal with substantiating evidence within 30 days.",
        "rateApproval": "Without timely rebuttal, effective on day 31 after receipt. If expressly approved, compensation begins within 30 days after approval. Timely disputes have separate resolution timing.",
        "claimApproval": "Claims not approved or disapproved within 30 days are deemed approved; payment or credit within 30 days of approval."
      }
    },
    {
      "state": "Massachusetts",
      "parts": "Agreed markup or dealer-specific average retail markup.",
      "labor": "Dealer’s qualifying effective retail labor rate.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 sequential ROs or 60 days; repairs within 180 days.",
      "statute": "Mass. Gen. Laws ch. 93B, § 9",
      "note": "RV-specific handling provisions should not be applied to Subaru passenger vehicles.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/massachusetts-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "MA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": true,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter93B/Section9",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Michigan",
      "parts": "Reasonable compensation using the dealer’s retail parts markup.",
      "labor": "Reasonable compensation using the dealer’s qualifying retail labor rate.",
      "time": "Reasonable diagnosis / repair time; supported requests for additional time cannot be unreasonably denied.",
      "sample": "Fewer of 100 qualifying sequential ROs or 90 days; see statute for eligibility and exclusions.",
      "statute": "MCL §§ 445.1577, 445.1577a",
      "note": "Reasonableness may consider same-line dealers in the relevant geographic market.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/michigan-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "MI",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-445-1577a",
        "kind": "portal",
        "note": "Interactive section viewer for §445.1577a; read alongside §445.1577.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Link supplied by external review; browser access and exact destination not independently confirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "pendingNote": "External review reports a 180-day repair-order recency limit in §445.1577a(2)(a). Independent comparison remains pending."
    },
    {
      "state": "Minnesota",
      "parts": "Cost plus reasonable markup, or dealer may elect the statutory retail-markup method.",
      "labor": "Effective nonwarranty retail labor rate.",
      "time": "Use the time guide used for customer-pay repairs. If unavailable, actual time cannot be less than similar retail time. Include diagnosis / technical assistance.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Minn. Stat. § 80E.041",
      "note": "Retail time is a separate payment driver; same-line reasonableness provisions still matter.",
      "basis": "Official statute checked.",
      "sourceDate": "2025 code",
      "url": "https://www.revisor.mn.gov/statutes/cite/80E.041",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/minnesota-warranty-reimbursement-law/",
      "abbr": "MN",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": true,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": true
      },
      "original": {
        "url": "https://www.revisor.mn.gov/statutes/cite/80E.041",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied v3 taxonomy: independent, agreed, retail and elected guides and actual-time fallbacks are separate flags. Wisconsin’s OEM-hour conversion belongs to the hourly-rate group; OEM hours remain the paid-hours basis.",
          "url": "https://www.revisor.mn.gov/statutes/cite/80E.041",
          "sourceType": "Supplied v3 research; taxonomy correction"
        }
      ]
    },
    {
      "state": "Mississippi",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "At the dealer's written request, the retail rate is total labor charges on qualified repairs divided by hours. The sample is all consecutive ROs containing 100 sequential qualified-repair ROs, or all ROs closed in 90 consecutive days, whichever gives fewer, no older than 180 days. The rate is presumed reasonable and takes effect 45 days after receipt unless the manufacturer rebuts once. The dealer may protest to the Motor Vehicle Commission, where the manufacturer bears the burden. At most once per 12 months.",
      "time": "Factory time with a reasonable-and-adequate standard benchmarked to the actual time required by a qualified technician of ordinary skill. This is not the dealer’s own clock time. § 63-17-85(j), effective July 1, 2021.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Miss. Code §§ 63-17-85(j), 63-17-86",
      "note": "No fixed statewide parts percentage or labor dollar amount.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/mississippi-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "MS",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.lexisnexis.com/hottopics/mscode/",
        "kind": "portal",
        "note": "Mississippi Code public-access route supplied by external review; navigate to §§63-17-85 and 63-17-86. Removed the agency page flagged as outdated; current-code comparison remains pending.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Link supplied by external review; browser access and exact destination not independently confirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Time allowances must be reasonable and adequate using the actual time required by a qualified technician of ordinary skill. This is a qualified-technician reasonableness standard, not necessarily the individual technician’s clock time. § 63-17-85(j), effective July 1, 2021.",
          "url": "https://billstatus.ls.state.ms.us/documents/2021/html/HB/0700-0799/HB0746SG.htm",
          "sourceType": "Supplied v2 research; enacted-law text"
        },
        {
          "date": "2026-09-25",
          "scope": "Supplied v3 supersedes the v2 actual-time classification: the qualified-technician benchmark belongs to factory/reasonable-time, not individual clock time. The statutory quotation is unchanged.",
          "url": "https://billstatus.ls.state.ms.us/documents/2021/html/HB/0700-0799/HB0746SG.htm",
          "sourceType": "Supplied v3 research; enacted-law text"
        }
      ],
      "extraSources": [
        {
          "url": "https://billstatus.ls.state.ms.us/documents/2021/html/HB/0700-0799/HB0746SG.htm",
          "label": "V2 labor research source"
        },
        {
          "url": "https://law.justia.com/codes/mississippi/title-63/chapter-17/distribution-and-sales/section-63-17-85/",
          "label": "V2 labor research source"
        }
      ]
    },
    {
      "state": "Missouri",
      "parts": "Reasonable compensation; dealer retail parts charges are a primary factor.",
      "labor": "Reasonable compensation; dealer retail labor charges are a primary factor.",
      "time": "Reasonable and adequate time for professional diagnosis and repair.",
      "sample": "No prescribed 100-RO / 90-day submission formula identified in the reviewed section.",
      "statute": "Mo. Rev. Stat. § 407.828",
      "note": "Do not treat the retail benchmark as an unconditional exact-retail entitlement; increases may be requested twice yearly.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/missouri-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "MO",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://revisor.mo.gov/main/OneSection.aspx?section=407.828",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Montana",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Dealer may elect either the OEM time guide or the guide it uses for customer-paid repairs.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "MCA § 61-4-213",
      "note": "Retail-rate challenges focus on material accuracy. Labor-guide choice directly affects payment.",
      "basis": "Official statute checked.",
      "sourceDate": "Official current page",
      "url": "https://mca.legmt.gov/bills/mca/title_0610/chapter_0040/part_0020/section_0130/0610-0040-0020-0130.html",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/montana-warranty-reimbursement-law/",
      "abbr": "MT",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": true,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://mca.legmt.gov/bills/mca/title_0610/chapter_0040/part_0020/section_0130/0610-0040-0020-0130.html",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied v3 taxonomy: independent, agreed, retail and elected guides and actual-time fallbacks are separate flags. Wisconsin’s OEM-hour conversion belongs to the hourly-rate group; OEM hours remain the paid-hours basis.",
          "url": "https://mca.legmt.gov/bills/mca/title_0610/chapter_0040/part_0020/section_0130/0610-0040-0020-0130.html",
          "sourceType": "Supplied v3 research; taxonomy correction"
        }
      ]
    },
    {
      "state": "Nebraska",
      "parts": "At least dealer retail or fleet charges under the updated statute.",
      "labor": "Principal factor: 'the prevailing wage rates being paid by dealers in the community'. The floor is the dealer's own rates for like service to retail or fleet customers, excluding listed maintenance work. There is no statutory labor-rate declaration formula; the 100 ROs/90 days/180-day method is written for parts markup. The manufacturer may request up to 100 additional ROs from a 90-day window to test the declared 'retail labor rate' and may adjust if the dealer's retail rates are lower. Negotiated rates are allowed.",
      "time": "Manufacturer time allowances must be adequate for a qualified technician. A documented request to modify or add diagnostic/repair time may not be unreasonably denied. LB667 operative September 3, 2025. LB972 excludes RVs from this section October 1, 2026; passenger-vehicle coverage remains.",
      "sample": "Parts: Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Neb. Rev. Stat. § 60-1438",
      "note": "Official text checked; 2025 amendments effective September 3, 2025.",
      "basis": "Official statute checked; includes 2025 amendments.",
      "sourceDate": "Official current page",
      "url": "https://nebraskalegislature.gov/laws/statutes.php?statute=60-1438",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/nebraska-warranty-reimbursement-law/",
      "abbr": "NE",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://nebraskalegislature.gov/laws/statutes.php?statute=60-1438",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "pendingNote": "RV scope changes October 1, 2026 under LB972. This comparison concerns passenger vehicles.",
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Manufacturer time allowances must be adequate for a qualified technician. A documented request to modify or add diagnostic/repair time may not be unreasonably denied. LB667 operative September 3, 2025. LB972 excludes RVs from this section October 1, 2026; passenger-vehicle coverage remains.",
          "url": "https://nebraskalegislature.gov/laws/statutes.php?statute=60-1438",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "extraSources": []
    },
    {
      "state": "Nevada",
      "parts": "No less than retail parts charges; no-cost supplied parts still receive the normal markup.",
      "labor": "No less than retail labor charges.",
      "time": "Reasonable compensation includes diagnosis and administrative costs.",
      "sample": "No prescribed 100-RO / 90-day submission formula identified in the reviewed section.",
      "statute": "NRS § 482.36385(3)",
      "note": "Public statute establishes a retail floor, not a single statewide rate.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/nevada-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "NV",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.leg.state.nv.us/NRS/NRS-482.html#NRS482Sec36385",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "New Hampshire",
      "parts": "Agreed markup or customary retail parts markup, subject to comparable same-line reasonableness.",
      "labor": "At least retail charges for like nonwarranty work.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Parts fallback: Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days. No separate labor sample summarized here.",
      "statute": "RSA §§ 357-C:5, 382-A:2-329",
      "note": "A separately negotiated parts markup is permitted; retail verification may cause a prospective adjustment.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/new-hampshire-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "NH",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://gc.nh.gov/rsa/html/XXXI/357-C/357-C-5.htm",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "New Jersey",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Average retail labor charges divided by billed labor hours.",
      "time": "Dealer may apply for a time multiplier: customer-billed hours ÷ OEM hours for the same sampled repairs; multiply OEM warranty times by that factor.",
      "sample": "Parts, labor rate and time factor: fewer of 100 sequential customer-pay ROs or 90 days; repairs within 180 days.",
      "statute": "N.J.S.A. § 56:10-15",
      "note": "New framework effective April 1, 2026. Dealer-derived time factor is separate from the hourly rate; not a fixed statewide 1.5 multiplier.",
      "basis": "Updated secondary statutory reproduction; effective date corroborated by NJ CAR.",
      "sourceDate": "March 31, 2026",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/new-jersey-warranty-reimbursement-law/",
      "additional": "https://www.njcar.org/latest-news/nj-car-celebrates-signing-of-landmark-motor-vehicle-open-recall-notice-and-fair-compensation-act/",
      "abbr": "NJ",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": true,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://pub.njleg.state.nj.us/Bills/2024/PL25/140_.PDF",
        "kind": "act",
        "note": "P.L.2025, chapter 140, §7 amends C.56:10-15. Approved September 11, 2025; effective April 1, 2026.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Relevant text retrieved on 2026-09-24."
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Confirmed P.L.2025 chapter 140 effective April 1, 2026 and the dealer-specific OEM-hour time-factor provision."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Confirmed P.L.2025 chapter 140 effective April 1, 2026 and the dealer-specific OEM-hour time-factor provision.",
          "url": "https://pub.njleg.state.nj.us/Bills/2024/PL25/140_.PDF",
          "sourceType": "Official text"
        }
      ]
    },
    {
      "state": "New Mexico",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "No separate standard for the number of paid labor hours identified in the reviewed section. Retail-rate or fair-compensation language alone is not an express time-allowance requirement.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "N.M. Stat. § 57-16-7",
      "note": "Reasonableness may consider comparable dealers; rate requests generally permitted twice yearly.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/new-mexico-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "NM",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://nmonesource.com/nmos/en/nav.do",
        "kind": "portal",
        "note": "Official compilation access. Search for 57-16-7. Reviewed reproduction is separately identified.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Link supplied by external review; browser access and exact destination not independently confirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-24",
        "scope": "Removed unsupported time-allowance boilerplate after checking the 2025 reproduction of §57-16-7. Official-text verification remains pending."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Removed unsupported time-allowance boilerplate after checking the 2025 reproduction of §57-16-7. Official-text verification remains pending.",
          "url": "https://law.justia.com/codes/new-mexico/chapter-57/article-16/section-57-16-7/",
          "sourceType": "Third-party code reproduction"
        }
      ]
    },
    {
      "state": "New York",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Reasonable compensation at least equal to the qualifying retail labor rate.",
      "time": "Reasonable and adequate time using a time guide reasonably utilized by the dealer for customer-paid repairs.",
      "sample": "Parts: Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "N.Y. VTL § 465",
      "note": "Official current section includes customer-pay time-guide language missing from the older vendor reproduction.",
      "basis": "Official statute checked; supersedes older secondary time-language.",
      "sourceDate": "Revision Sep 6, 2024",
      "url": "https://www.nysenate.gov/legislation/laws/VAT/465",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/new-york-warranty-reimbursement-law/",
      "abbr": "NY",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": true,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.nysenate.gov/legislation/laws/VAT/465",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied v3 taxonomy: independent, agreed, retail and elected guides and actual-time fallbacks are separate flags. Wisconsin’s OEM-hour conversion belongs to the hourly-rate group; OEM hours remain the paid-hours basis.",
          "url": "https://www.nysenate.gov/legislation/laws/VAT/465",
          "sourceType": "Supplied v3 research; taxonomy correction"
        }
      ]
    },
    {
      "state": "North Carolina",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Not less than the dealer's 'current retail labor rate'. Dealer may declare it from 100 sequential non-warranty customer-paid ROs containing warranty-like parts or 60 consecutive days of such ROs, whichever is less (within 180 days). Presumed accurate. Manufacturer may rebut within 30 days by substantiating inaccuracy. Protest goes to the DMV Commissioner.",
      "time": "Manufacturer time allowances. Since July 1, 2025, the former reasonable-and-adequate sentence has been removed. Section 20-305.1(a5) bars unreasonable denial of documented requests to modify a uniform allowance or add diagnosis/repair time.",
      "sample": "Fewer of 100 qualifying sequential ROs or 60 consecutive days; repairs within 180 days.",
      "statute": "N.C. Gen. Stat. § 20-305.1",
      "note": "2025 amendments limit retail-rate challenges to submission accuracy rather than comparable-market reasonableness.",
      "basis": "Official statute checked; includes 2025 amendments.",
      "sourceDate": "Official current page",
      "url": "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-305.1.html",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/north-carolina-warranty-reimbursement-law/",
      "abbr": "NC",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": true,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-305.1.html",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Manufacturer time allowances. Since July 1, 2025, the former reasonable-and-adequate sentence has been removed. Section 20-305.1(a5) bars unreasonable denial of documented requests to modify a uniform allowance or add diagnosis/repair time.",
          "url": "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-305.1.html",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "extraSources": []
    },
    {
      "state": "North Dakota",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Use dealer’s customer-pay time guide. If none covers the job, use actual time, at least equal to same/similar retail time.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "N.D.C.C. § 51-07-29",
      "note": "2025 amendments effective August 1, 2025; rate challenges focus on material accuracy.",
      "basis": "Official code PDF checked, § 51-07-29 (PDF pages 15–16).",
      "sourceDate": "Current code PDF",
      "url": "https://www.ndlegis.gov/cencode/t51c07.pdf",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/north-dakota-warranty-reimbursement-law/",
      "abbr": "ND",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": true,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": true
      },
      "original": {
        "url": "https://www.ndlegis.gov/cencode/t51c07.pdf",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied v3 taxonomy: independent, agreed, retail and elected guides and actual-time fallbacks are separate flags. Wisconsin’s OEM-hour conversion belongs to the hourly-rate group; OEM hours remain the paid-hours basis.",
          "url": "https://www.ndlegis.gov/cencode/t51c07.pdf",
          "sourceType": "Supplied v3 research; taxonomy correction"
        }
      ]
    },
    {
      "state": "Ohio",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable compensation includes diagnosis, including technical-assistance time.",
      "sample": "Dealer choice: 100 sequential qualifying ROs or 90 days; repairs within 180 days.",
      "statute": "Ohio Rev. Code § 4517.52",
      "note": "Official statute effective September 30, 2025; challenges focus on material accuracy.",
      "basis": "Official statute checked; effective Sep 30, 2025.",
      "sourceDate": "Official current page",
      "url": "https://codes.ohio.gov/ohio-revised-code/section-4517.52",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/ohio-warranty-reimbursement-law/",
      "abbr": "OH",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://codes.ohio.gov/ohio-revised-code/section-4517.52",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Oklahoma",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "At least qualifying retail labor compensation.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "47 O.S. § 565",
      "note": "2025 HB2158 and HB2160 amendments effective November 1, 2025: a written rate rebuttal must substantiate inaccuracy or incompleteness within 45 days. Additional repair-order requests can suspend deadlines. Rates take effect 30 days after approval. Dealer protest deadline: 30 days after the proposed adjustment. Rate revalidation is limited to once in 12 months.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/oklahoma-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "OK",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": true,
        "automatic_rate": false,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.oklegislature.gov/cf_pdf/2025-26%20ENR/hB/HB2160%20ENR.PDF",
        "kind": "act",
        "note": "HB2160 enrolled act, §565 amendments, effective November 1, 2025. Official bill history confirms it became law May 29, 2025. Read alongside HB2158.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Relevant text retrieved on 2026-09-24."
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Checked 2025 enrolled §565 rate rebuttal, supplemental orders, approval timing, protest and revalidation provisions; enactment status confirmed in official bill histories."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Checked 2025 enrolled §565 rate rebuttal, supplemental orders, approval timing, protest and revalidation provisions; enactment status confirmed in official bill histories.",
          "url": "https://www.oklegislature.gov/cf_pdf/2025-26%20ENR/hB/HB2160%20ENR.PDF",
          "sourceType": "Official text"
        }
      ],
      "extraSources": [
        {
          "url": "https://www.oklegislature.gov/cf_pdf/2025-26%20ENR/hB/HB2158%20ENR.PDF",
          "label": "HB2158 enrolled act, effective November 1, 2025"
        },
        {
          "url": "https://www.oklegislature.gov/BillInfo.aspx?Bill=hb2160&Session=2500",
          "label": "Official HB2160 enactment history"
        },
        {
          "url": "https://www.oklegislature.gov/BillInfo.aspx?Bill=hb2158&Session=2500",
          "label": "Official HB2158 enactment history"
        }
      ],
      "process": {
        "challenge": "Inaccuracy or incompleteness; initial rebuttal within 45 days. Supplemental repair-order procedures may suspend deadlines.",
        "rateApproval": "Effective 30 days after manufacturer approval. The reviewed rate provision does not expressly deem an unanswered submission approved.",
        "claimApproval": "Approve or disapprove within 30 days of receipt; pay within 30 days after approval. These are separate from rate-submission deadlines."
      }
    },
    {
      "state": "Oregon",
      "parts": "Retail markup proposal subject to reasonableness against same-line dealers in contiguous markets.",
      "labor": "No less than the dealer’s retail hourly labor rate.",
      "time": "Time allowances must be reasonable and adequate for a qualified technician. The manufacturer may not unreasonably deny a documented written request to modify a specific warranty repair allowance or add diagnostic or repair time.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "ORS § 650.158",
      "note": "At most annually, the manufacturer may verify retail rates and the dealer may propose an increase. Decreases may support prospective reductions. The 2025 edition of §650.158 incorporates the additional time protections.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/oregon-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "OR",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": false,
        "automatic_rate": true,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.oregonlegislature.gov/bills_laws/ors/ors650.html",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Relevant official text retrieved on 2026-09-24. See the review record for which provisions were compared.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Checked §650.158(2): time protections, rate challenge grounds, approval mechanics and annual verification; checked claim approval in subsection (4)."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Checked §650.158(2): time protections, rate challenge grounds, approval mechanics and annual verification; checked claim approval in subsection (4).",
          "url": "https://www.oregonlegislature.gov/bills_laws/ors/ors650.html",
          "sourceType": "Official text"
        }
      ],
      "process": {
        "challenge": "May challenge accuracy, comparable-market reasonableness or other relevant evidence; statutory dealer-comparison requirements apply.",
        "rateApproval": "No contest within 30 days means approval; the proposal takes effect 30 days after approval. A contested proposal requires an adjustment proposal within 30 days of submission.",
        "claimApproval": "Claims not approved or disapproved within 30 days are deemed approved; pay within 60 days of receipt for those claims."
      }
    },
    {
      "state": "Pennsylvania",
      "parts": "Retail parts markup, including major assemblies.",
      "labor": "Dealer's retail rate: declared average labor rate = total labor sales ÷ total labor hours from the lesser of 100 sequential non-warranty customer-paid ROs or 90 consecutive days (within 180 days). Presumed reasonable and effective 60 days after declaration. Manufacturer may rebut within 60 days and propose an adjustment. Protest to the State Board of Vehicle Manufacturers, Dealers and Salespersons. One declaration per calendar year. Dealer may opt out (revert to nonretail) once a year to avoid a surcharge.",
      "time": "Factory time, no statutory standard. Section 307(a)(1) requires disclosure of the time allowance in the manufacturer’s compensation schedule but sets no reasonableness or other paid-hours standard.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "63 P.S. § 818.307",
      "note": "Submission may be challenged for material accuracy or reasonableness; statutory timing differs from 30-day states.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/pennsylvania-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "PA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": false,
        "automatic_rate": true,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.legis.state.pa.us/WU01/LI/LI/US/HTM/1983/0/0084..HTM",
        "kind": "text",
        "note": "Official Board of Vehicles Act compilation. Open Section 307 (63 P.S. §818.307). Summary comparison remains pending.",
        "linkStatus": "Relevant official text retrieved on 2026-09-24. See the review record for which provisions were compared.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Checked the cited warranty section for the time-allowance correction. Broader summary verification remains incomplete. Also checked the rate-submission challenge and effectiveness provisions."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Checked the cited warranty section for the time-allowance correction. Broader summary verification remains incomplete.",
          "url": "https://www.legis.state.pa.us/WU01/LI/LI/US/HTM/1983/0/0084..HTM",
          "sourceType": "Official text"
        },
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Factory time, no statutory standard. Section 307(a)(1) requires disclosure of the time allowance in the manufacturer’s compensation schedule but sets no reasonableness or other paid-hours standard.",
          "url": "https://www.legis.state.pa.us/WU01/LI/LI/US/HTM/1983/0/0084..HTM",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "process": {
        "challenge": "Unreasonableness or material inaccuracy; rebut within 60 days.",
        "rateApproval": "Rate takes effect 60 days after declaration unless audited and rebutted under §307(a).",
        "claimApproval": "Claim-approval mechanics not classified in this update."
      },
      "extraSources": []
    },
    {
      "state": "Rhode Island",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Prior-month qualifying labor sales divided by billed labor hours.",
      "time": "Through September 30, 2026: statute silent on a general paid-hours allowance. From October 1, the actual-technician-time rule applies as shown below.",
      "sample": "Parts: fewer of 100 sequential ROs or 60 days, within 180 days. Labor: all qualifying customer-pay ROs in the preceding month.",
      "statute": "R.I. Gen. Laws § 31-5.1-6",
      "note": "The prior-month sample determines the hourly labor rate and remains in the October 1, 2026 amendment. The amendment changes paid warranty hours to documented actual technician time; it does not replace that hourly-rate sample.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/rhode-island-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "RI",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": true,
        "prior_month": true,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://webserver.rilegislature.gov/Statutes/TITLE31/31-5.1/31-5.1-6.htm",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Confirmed actual-time requirements, retained prior-month labor-rate sample, and October 1, 2026 effective-date clause in official S2347 Substitute A. Enactment status corroborated by LegiScan."
      },
      "changes": [
        {
          "effective": "2026-10-01",
          "title": "Actual technician time for warranty labor",
          "time": "From October 1, 2026: nonwarranty labor rate × actual technician time for necessary repairs performed under manufacturer procedures, including diagnostic and manufacturer technical-assistance time. Support with technician time punches, relevant electronic records, and dealer attestation of accuracy.",
          "flags": {
            "actual_time": true
          },
          "url": "https://webserver.rilegislature.gov/BillText26/SenateText26/S2347A.pdf"
        }
      ],
      "extraSources": [
        {
          "url": "https://webserver.rilegislature.gov/BillText26/SenateText26/S2347A.pdf",
          "label": "2026 S2347 Substitute A: actual-time text and October 1 effective date"
        },
        {
          "url": "https://legiscan.com/RI/bill/S2347/2026",
          "label": "LegiScan enactment-status corroboration (third party)"
        }
      ],
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Confirmed actual-time requirements, retained prior-month labor-rate sample, and October 1, 2026 effective-date clause in official S2347 Substitute A. Enactment status corroborated by LegiScan.",
          "url": "https://webserver.rilegislature.gov/BillText26/SenateText26/S2347A.pdf",
          "sourceType": "Official text"
        }
      ]
    },
    {
      "state": "South Carolina",
      "parts": "Dealer may request cost plus its qualifying retail parts markup.",
      "labor": "Dealer may request its qualifying effective retail labor rate.",
      "time": "No separate standard for the number of paid labor hours identified in the reviewed section. Retail-rate or fair-compensation language alone is not an express time-allowance requirement.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "S.C. Code § 56-15-60",
      "note": "Source updated April 3, 2026; use the listed statutory exclusions in a submission.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "April 3, 2026",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/south-carolina-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "SC",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": false,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.scstatehouse.gov/code/t56c015.php",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Relevant official text retrieved on 2026-09-24. See the review record for which provisions were compared.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "partial",
        "date": "2026-09-24",
        "scope": "Checked the cited warranty section for the time-allowance correction. Broader summary verification remains incomplete. Also checked the rate-submission challenge and effectiveness provisions."
      },
      "checks": [
        {
          "date": "2026-09-24",
          "scope": "Checked the cited warranty section for the time-allowance correction. Broader summary verification remains incomplete.",
          "url": "https://www.scstatehouse.gov/code/t56c015.php",
          "sourceType": "Official text"
        }
      ],
      "process": {
        "challenge": "Challenge grounds not fully classified in this update.",
        "rateApproval": "Rate takes effect 30 days after approval; additional-documentation requests can extend the review period. No express deemed-approval rule identified in §56-15-60(C)(4).",
        "claimApproval": "Claim-approval mechanics not classified in this update."
      }
    },
    {
      "state": "South Dakota",
      "parts": "At least customary retail parts compensation.",
      "labor": "At least customary retail hourly labor rate.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Dealer’s written compensation schedule; manufacturer cannot impose an unduly burdensome transaction-by-transaction method.",
      "statute": "SDCL §§ 32-6B-58, 32-6B-61",
      "note": "No standard 100-RO / 90-day method identified in the reviewed sections.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/south-dakota-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "SD",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://sdlegislature.gov/api/Statutes/32-6B-61.html",
        "kind": "text",
        "note": "Labor provision. Companion parts provision is §32-6B-58.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Relevant text retrieved on 2026-09-24."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "extraSources": [
        {
          "url": "https://sdlegislature.gov/api/Statutes/32-6B-58.html",
          "label": "Official companion parts provision: §32-6B-58 (link supplied by external review)"
        }
      ]
    },
    {
      "state": "Tennessee",
      "parts": "Retail parts markup established by the statutory sample.",
      "labor": "The warranty hourly rate may not be less than 'the dealer's retail labor rate for similar repairs' unless the manufacturer shows the Motor Vehicle Commission that the rate is 'improper in light of all economic circumstances'. The dealer may not charge more than its posted retail labor rate. Dealers file sworn labor-rate statements with the commission. The 100-RO/90-day submission in (d)(2)(C) covers parts markup only.",
      "time": "Statute silent on a general paid-hours allowance standard. The retail hourly-rate floor and posted-rate ceiling remain separate requirements; this is not a finding that Tennessee has no reimbursement law.",
      "sample": "Parts: Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Tenn. Code § 55-17-121",
      "note": "Retail labor rates are reported to the commission; posted rate should not be replaced with an assumed statewide average.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/tennessee-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "TN",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": true,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://www.lexisnexis.com/hottopics/tncode/",
        "kind": "portal",
        "note": "Tennessee Code public-access route supplied by external review. Navigate to §55-17-121.",
        "locatedDate": "2026-09-24",
        "linkStatus": "Link supplied by external review; browser access and exact destination not independently confirmed."
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Statute silent on a general paid-hours allowance standard. The retail hourly-rate floor and posted-rate ceiling remain separate requirements; this is not a finding that Tennessee has no reimbursement law.",
          "url": "https://law.justia.com/codes/tennessee/2025/title-55/chapter-17/part-1/section-55-17-121/",
          "sourceType": "Supplied v2 research; code reproduction"
        }
      ],
      "extraSources": [
        {
          "url": "https://law.justia.com/codes/tennessee/2025/title-55/chapter-17/part-1/section-55-17-121/",
          "label": "V2 labor research source"
        }
      ]
    },
    {
      "state": "Texas",
      "parts": "Warranty-work retail reimbursement floor includes parts; no fixed statewide markup stated.",
      "labor": "Comparable retail rate; statutory floor is the greater of the two prescribed labor averages.",
      "time": "Paid amount also depends on allowed warranty hours; no fixed numeric multiplier identified in reviewed sections.",
      "sample": "Labor: greater average from 100 sequential ROs or 90 consecutive days within the prior six months; routine maintenance excluded.",
      "statute": "Tex. Occ. Code §§ 2301.002(37), 2301.402–.403",
      "note": "Texas says greater of the labor averages, not fewer of the two samples. No separate parts sample summarized in the reviewed section.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/texas-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "TX",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": true,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://statutes.capitol.texas.gov/",
        "kind": "portal",
        "note": "Select Occupations Code, Chapter 2301, §§2301.402–2301.403. Older deep links currently return the statute home page.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Utah",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Dealer’s qualifying retail labor rate; no fixed statewide $/hour.",
      "time": "Reasonable and adequate diagnostic / repair time; no statewide numeric multiplier identified in reviewed text.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Utah Code § 13-14-204",
      "note": "Separate RV parts provisions should not be applied to Subaru passenger vehicles.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/utah-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "UT",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://le.utah.gov/xcode/Title13/Chapter14/13-14-S204.html",
        "kind": "portal",
        "note": "Official viewer for §13-14-204. Current section text was not retrievable during this check; an older superseded PDF was excluded.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Vermont",
      "parts": "Customary retail parts markup.",
      "labor": "Customary retail labor rate, conspicuously posted.",
      "time": "Retail compensation framework; no numeric time multiplier identified in reviewed section.",
      "sample": "Parts: 100 sequential ROs or 60 days, whichever is less in total cost; repairs within 180 days.",
      "statute": "9 V.S.A. § 4086",
      "note": "Reasonableness rebuttal uses specified comparable-dealer evidence; parts markup requests permitted twice yearly.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/vermont-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "VT",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": true,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": false,
        "sample_60": true,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": true,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://legislature.vermont.gov/statutes/section/09/108/04086",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Virginia",
      "parts": "Retail OEM-parts markup, established by agreement approximating retail or by the statutory average.",
      "labor": "Compensation must be at least 'the amounts charged by the dealer ... to retail customers for nonwarranty service'. Increases are requested in writing and based on 100 consecutive ROs or all ROs over a 90-day period, 'whichever occurs first'. Only retail ROs count; menu pricing, internal work, group or special-event discounts and insurance repairs are excluded.",
      "time": "Statute silent on general repair-time allowances. Diagnostic work includes all qualifying technician time communicating with manufacturer technical assistance. Do not imply a general reasonable-time standard.",
      "sample": "Parts: 100 consecutive ROs or all ROs over 90 consecutive days, whichever occurs first.",
      "statute": "Va. Code § 46.2-1571",
      "note": "Official updated text checked. Recall parts have a special prior-12-month highest-price basis; do not apply that automatically to all warranty parts. V2 correction: 2025 chapters 546/558, effective July 1, 2025, removed the deemed-reasonable clause. The current retail compensation floor is retained.",
      "basis": "Official statute checked; includes 2025 amendments.",
      "sourceDate": "Official current page",
      "url": "https://law.lis.virginia.gov/vacode/title46.2/chapter15/section46.2-1571/",
      "additional": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/virginia-warranty-reimbursement-law/",
      "abbr": "VA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://law.lis.virginia.gov/vacode/title46.2/chapter15/section46.2-1571/",
        "kind": "text",
        "note": "Original source used for this summary.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "official",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Statute silent on general repair-time allowances. Diagnostic work includes all qualifying technician time communicating with manufacturer technical assistance. Do not imply a general reasonable-time standard.",
          "url": "https://law.lis.virginia.gov/vacode/title46.2/chapter15/section46.2-1571/",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "extraSources": []
    },
    {
      "state": "Washington",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Retail labor compensation for similar work.",
      "time": "Reasonable time includes required documentation, photos, data entry and paperwork; no duplicate payment for already included tasks.",
      "sample": "Parts: Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "RCW § 46.96.105",
      "note": "Reasonableness may consider comparable same-line dealers; review separate labor submission requirements.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 27, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/washington-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "WA",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://app.leg.wa.gov/RCW/default.aspx?cite=46.96.105",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "West Virginia",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "Retail-equivalent labor rate and time compensation.",
      "time": "Reasonable time includes required manufacturer communications; supported modification requests receive statutory protection.",
      "sample": "100 sequential ROs or 90 days within 180 days; parts and labor may be submitted separately or together.",
      "statute": "W. Va. Code § 17A-6A-8a",
      "note": "Source updated July 16, 2026; apply the current submission and time provisions.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "July 16, 2026",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/west-virginia-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "WV",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://code.wvlegislature.gov/17A-6A-8A/",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      }
    },
    {
      "state": "Wisconsin",
      "parts": "Cost × (qualifying retail parts sales ÷ qualifying parts cost). This statutory ratio includes recovery of cost.",
      "labor": "Qualifying customer labor charges ÷ OEM-guide hours for those same repairs. This is an hourly-dollar-rate conversion. OEM warranty hours remain the paid-hours basis; do not apply a second time multiplier.",
      "time": "Multiply that effective rate by OEM-guide warranty hours. The retail/OEM time difference is incorporated in the hourly-rate calculation.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Wis. Stat. § 218.0125(3m)–(4m)",
      "note": "Do not divide labor sales by customer-billed hours here. Do not add 1 again to the statutory parts sales/cost ratio.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "November 28, 2024",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/wisconsin-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "WI",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": true,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://docs.legis.wisconsin.gov/statutes/statutes/218/i/0125",
        "kind": "text",
        "note": "Original statutory text located. Summary comparison against this source remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "pendingNote": "External review references 2025 Act 247 and a motorcycle exclusion. Verify applicability and current text; do not extrapolate the passenger-vehicle classification to motorcycles.",
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied v3 taxonomy: independent, agreed, retail and elected guides and actual-time fallbacks are separate flags. Wisconsin’s OEM-hour conversion belongs to the hourly-rate group; OEM hours remain the paid-hours basis.",
          "url": "https://docs.legis.wisconsin.gov/statutes/statutes/218/i/0125",
          "sourceType": "Supplied v3 research; taxonomy correction"
        }
      ]
    },
    {
      "state": "Wyoming",
      "parts": "Dealer cost plus the dealer’s qualifying retail parts markup; no fixed statewide percentage.",
      "labor": "The rate is set by mutual agreement or by dealer submission. Rate = total labor charged on qualified ROs ÷ 'total number of hours worked' on those ROs, from 100 sequential qualified ROs or 90 consecutive days, whichever is less, within 180 days. It takes effect 45 days after receipt unless the manufacturer requests more ROs or contests it (material incompleteness, inaccuracy or unreasonableness). A contest goes to 60 days of mediation, then court, where the manufacturer bears the burden. One submission per 12 months. The retained § 31-16-117(b) sentence says the warranty rate shall not exceed the nonwarranty rate; it is a ceiling, not a floor.",
      "time": "Manufacturer time allowances must be reasonable and adequate. The hourly-rate sentence is a retail-rate ceiling, not a floor; the July 1, 2025 amendment supplies a dealer rate-submission process.",
      "sample": "Fewer of 100 qualifying sequential customer-pay ROs or 90 consecutive days; repairs within 180 days.",
      "statute": "Wyo. Stat. § 31-16-117",
      "note": "2025 amendments effective July 1, 2025 added retail-rate submission procedures.",
      "basis": "Secondary statutory reproduction (Armatus); current official code not independently checked.",
      "sourceDate": "March 27, 2025",
      "url": "https://www.dealeruplift.com/state-retail-warranty-reimbursement-laws/wyoming-warranty-reimbursement-law/",
      "additional": "",
      "abbr": "WY",
      "flags": {
        "retail_parts": true,
        "special_parts": false,
        "retail_labor": true,
        "posted_labor": false,
        "financial_labor": false,
        "retail_time": false,
        "time_multiplier": false,
        "normalized_rate": false,
        "sample_100_90": true,
        "sample_60": false,
        "prior_month": false,
        "lookback_90": false,
        "special_sample": false,
        "actual_time": false,
        "accuracy_only": null,
        "automatic_rate": null,
        "independent_guide_floor": false,
        "agreed_time_guide": false,
        "guide_election": false,
        "actual_time_fallback": false
      },
      "original": {
        "url": "https://wyoleg.gov/statutes/compress/title31.pdf#page=435",
        "kind": "text",
        "note": "Official Title 31 PDF; §31-16-117 begins on PDF page 435. Summary comparison remains pending.",
        "linkStatus": "Located in earlier research; not retested in this update.",
        "locatedDate": "2026-09-21"
      },
      "review": {
        "status": "reproduction",
        "date": "2026-09-21",
        "scope": "Existing payment-method and sample summary. No claim of an exhaustive legal update."
      },
      "checks": [
        {
          "date": "2026-09-25",
          "scope": "Applied supplied Claude v2 labor correction. Manufacturer time allowances must be reasonable and adequate. The hourly-rate sentence is a retail-rate ceiling, not a floor; the July 1, 2025 amendment supplies a dealer rate-submission process.",
          "url": "https://wyoleg.gov/statutes/compress/title31.pdf",
          "sourceType": "Supplied v2 research; official statute"
        }
      ],
      "extraSources": [
        {
          "url": "https://wyoleg.gov/statutes/compress/title31.pdf",
          "label": "V2 labor research source"
        },
        {
          "url": "https://wyoleg.gov/2025/Enroll/SF0106.pdf",
          "label": "V2 labor research source"
        }
      ]
    }
  ],
  "reviewDate": "2026-09-24",
  "coverageImport": {
    "version": 3,
    "researchDate": "2026-09-25",
    "importedDate": "2026-09-25",
    "records": 200,
    "source": "research/labor-by-coverage-v3.json"
  }
};
