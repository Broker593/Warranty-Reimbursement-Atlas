/* Coverage-specific research. Existing warranty flags are leads, not new scope reviews. */
(() => {
  'use strict';
  const types = [
    {id:'factory', name:'Factory warranty', note:'Original manufacturer warranty repairs. Existing warranty summaries are carried forward; coverage applicability and mandatory versus optional treatment need a dedicated review.'},
    {id:'manufacturer_contract', name:'Manufacturer-backed service contract', note:'Includes programs such as Subaru Added Security. Verify the issuer, obligor, administrator and manufacturer affiliation; the program name alone does not establish statutory coverage.'},
    {id:'cpo', name:'CPO warranty', note:'Certified pre-owned warranty repair claims. Separate these from certification inspections, reconditioning and any separately purchased service contract.'},
    {id:'independent_contract', name:'Independent service contract', note:'A service contract with an independent obligor. A third-party labor-time guide is a different concept and does not establish coverage for these contracts.'}
  ];
  const methods = [
    {id:'retail_benchmark', axis:'rate', name:'Retail rate benchmark', legacy:'retail_labor', description:'Broad reference, floor or available route based on retail charges. Does not by itself establish an unconditional retail rate or a particular sample formula.'},
    {id:'posted_rate', axis:'rate', name:'Posted retail rate', legacy:'posted_labor', description:'Express use of the dealer’s posted hourly rate, with applicable statutory conditions.'},
    {id:'financial_rate', axis:'rate', name:'Financial-statement formula', legacy:'financial_labor', description:'An hourly-rate alternative calculated from dealership financial information.'},
    {id:'normalized_rate', axis:'rate', name:'OEM-hour-normalized rate', legacy:'normalized_rate', description:'Retail labor revenue divided by OEM-guide hours. The time difference is incorporated into the rate; do not apply an additional time multiplier without authority.'},
    {id:'other_rate', axis:'rate', name:'Other hourly-rate method', description:'A specified method not captured above, such as a contract rate, negotiated rate, regional benchmark or statutory minimum. Describe the method and who may choose it.'},
    {id:'multiplier', axis:'hours', name:'Multiplier on factory hours', legacy:'time_multiplier', description:'An explicit factor changes OEM-guide paid hours. Record the exact factor or ratio, conditions and election rights; this is not an hourly-dollar-rate multiplier.'},
    {id:'factory_guide', axis:'hours', name:'Factory / OEM guide', description:'Express legal use of OEM-guide hours, including an election where applicable. Do not assume this category merely because no alternative rule was found.'},
    {id:'third_party_guide', axis:'hours', name:'Third-party time guide', description:'An independent labor-guide publisher supplies allowed hours. This does not mean an independent service-contract provider.'},
    {id:'retail_guide', axis:'hours', name:'Dealer customer-pay guide', description:'The dealer’s guide used for retail customer-paid repairs. May overlap with a third-party guide when the text supports both.'},
    {id:'agreed_guide', axis:'hours', name:'Agreed time guide', description:'A time guide selected by agreement. Using an extended-warranty guide for factory warranty pricing does not itself bring service contracts within the statute.'},
    {id:'actual_time', axis:'hours', name:'Actual technician time', legacy:'actual_time', description:'Documented actual time, whether the primary method or a conditional fallback. Record which, including diagnostic and technical-assistance treatment.'},
    {id:'other_hours', axis:'hours', name:'Other paid-hours method', description:'Describe any other express time method. Silence about time allowances is not an OEM-guide mandate or a reasonable-time standard.'},
    {id:'guide_unsplit', axis:'hours', name:'Guide rule — split pending', legacy:'retail_time', description:'Existing broad category combining retail, independent and agreed guides. Its count must not be presented as the count for any one of those narrower categories.'}
  ];
  // Future claim-backed records replace the complete corresponding default record.
  // See labor-coverage-template.json and labor-coverage-research-prompt.md.
  const findings = [];
  function record(state, coverage, asOf, ruleValue, effectiveTime) {
    const reviewed = findings.find(r=>r.state===state.abbr && r.coverage===coverage && r.asOf===asOf);
    if (reviewed) return reviewed;
    const factory = coverage==='factory';
    return {
      state:state.abbr, coverage, asOf,
      reviewStatus:factory?'existing_summary':'unverified',
      applicability:'unverified',
      applicabilityNote:factory?'Existing warranty research; a coverage-specific applicability review is still needed.':'No coverage-specific review has been completed. This does not mean no reimbursement protection exists.',
      hourlyRate:factory?state.labor:'Unverified for this coverage type.',
      paidHours:factory?effectiveTime(state):'Unverified for this coverage type.',
      methods:methods.map(m=>{
        const value=factory && m.legacy ? ruleValue(state,m.legacy) : null;
        return {id:m.id, finding:value===true?'identified':value===false?'not_identified':'unverified', operation:'unverified', condition:'', evidenceIds:[], basis:value==null?'unverified':'existing_summary'};
      }),
      evidence:[],
      unresolved:factory?['Verify statutory scope and required, optional or conditional treatment for each method.','Split the combined guide category using the exact text; review factory-guide, actual-time fallback and other methods separately.']:['Identify the legal obligor and applicable statutory definitions.','Verify hourly-rate and paid-hours protections independently.'],
      amendments:[]
    };
  }
  window.LABOR_COVERAGE = {types, methods, findings, record};
})();
