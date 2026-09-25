/* Presentation adapter for supplied v3 research. Effective-date overrides do not alter the source JSON. */
(() => {
 'use strict';
 const programScope="Required/Conditional applies only to contracts the manufacturer, distributor or qualifying affiliate actually issues or reimburses. Program branding (e.g., 'Subaru-backed', 'factory-backed') does not establish the legal obligor — check the obligor named in the state-specific contract.";
 const types=[
  {id:'factory',key:'factory_warranty',name:'Factory warranty',note:'Manufacturer warranty repairs. Required describes statutory scope; time-guide elections, waivers and fallback conditions still apply.'},
  {id:'manufacturer_contract',key:'mfr_service_contract',name:'Mfr-backed service contract',note:'Includes programs such as Subaru Added Security only when the issuer, obligor, affiliation and payment conditions are met.',programScope},
  {id:'cpo',key:'cpo',name:'CPO warranty',note:'CPO warranty claims, separate from certification inspections, reconditioning and separately purchased contracts.',programScope},
  {id:'independent_contract',key:'independent_service_contract',name:'Independent service contract',note:'NJ, ND and PA are Conditional only through the stated manufacturer connection; PA addresses claim timing only. A truly independent contract is not covered on its own terms. Independent contract obligors differ from independent guide publishers.'}
 ];
 const statuses=[
  {id:'yes',name:'Required',symbol:'✓',description:'The researched provisions reach this coverage type. Method-specific conditions and elections remain in the notes.'},
  {id:'conditional',name:'Conditional',symbol:'!',description:'Scope depends on the issuer, obligor, manufacturer payment, or a stated interpretation. Read the condition in the cell.'},
  {id:'no',name:'Not reached',symbol:'×',description:'Outside the reviewed provisions because of an express exclusion or limitation to manufacturer-issued or sponsored work.'},
  {id:'silent',name:'Not addressed',symbol:'—',description:'The statute was researched and does not address this coverage type. This is not an unverified entry or an affirmative exclusion.'}
 ];
 const methods=[
  {id:'factory',name:'Factory time (reasonable/adequate standard where stated)',description:'Research grouping for manufacturer/warrantor time allowances, including reasonable-and-adequate standards and additional-time rights. Mississippi uses a qualified-technician benchmark, not the dealer’s own clock time. It does not mean every statute mandates a named OEM guide.'},
  {id:'independent_guide',name:'Independent/retail time guide',description:'Independent or customer-pay guide. Alaska permits agreement otherwise; Montana gives a choice; Minnesota and North Dakota have actual-time fallbacks.'},
  {id:'multiplier',name:'OEM time × multiplier',description:'Illinois: 1.5× only if no guide is agreed or the guide omits the repair. New Jersey: dealer-elected customer-pay/OEM-hours ratio, effective April 1, 2026.'},
  {id:'actual_time',name:'Actual technician time',description:'Rhode Island only, from October 1, 2026: the particular technician’s documented time. Mississippi’s qualified-technician benchmark is in Factory time. Guide-specific fallbacks and heavy-truck exceptions are not counted here.'},
  {id:'negotiated_other',name:'Negotiated/other',description:'Wisconsin normalizes its hourly rate: retail labor revenue divided by OEM hours. Paid hours stay OEM time. Do not apply the time difference twice.'},
  {id:'silent',name:'Statute silent on time',description:'No general repair-time allowance standard identified for this coverage. NC and PA service-contract cells show Not established because factory paid-hours rules are not clearly extended to them. Specific diagnostic or assistance-time protections can still apply.'},
  {id:'n/a',name:'—',description:'No paid-hours method assigned to a coverage type classified Not reached or Not addressed.'}
 ];
 const conditions={
  FL:{all:'Issued by the licensee or a common entity that is itself a manufacturer. Non-manufacturer common-entity issuers are excluded; check the named obligor.'},
  GA:{all:'Interpretive scope: the contract must fit the new-vehicle warranty definition. The exclusion may spare manufacturer-controlled extended warranties, but may also exclude all service contracts.'},
  IL:{manufacturer_contract:'Reached through affiliate-issued warranty/service/repair plans in § 6(f) and the extended-warranty guide clause, rather than an express service-contract scope sentence.',cpo:'CPO is not named. This depends on treating manufacturer- or affiliate-issued and compensated CPO work as warranty or factory-compensated repair.'},
  MA:{all:'Issued by the manufacturer, distributor, or a common entity that is itself a manufacturer. Non-manufacturer common-entity issuers are excluded.'},
  MS:{all:'CPO appears in the parts-oriented warranty-work definition, § 63-17-55(ee). Extending the labor rule to CPO is an interpretation, not an express labor-scope provision.'},
  NC:{all:'Manufacturer extended warranty appears in the dealer-obligation list, but the factory retail-rate and paid-hours rules are not clearly extended to it. Rate and hours are not established for this coverage.'},
  ND:{independent_contract:'Only if the manufacturer or distributor sponsors, issues or requires the service contract. A third-party obligor alone does not establish scope under § 51-07-29(1)(a).'},
  NJ:{all:'Repair service must be offered and reimbursed by the franchisor, subject to affiliate rules and the circumstances for administered plans in (g) and (h). CPO is not expressly named.',independent_contract:'Only if the franchisor offers and reimburses the repair service, subject to § 56:10-15 and its affiliate/administered-plan provisions. A third-party obligor alone does not establish scope.'},
  NY:{all:'CPO must fall within the franchisor’s own warranty agreement or a factory-compensated repair; CPO is not expressly named.'},
  PA:{all:'Claim approval/payment timing only under § 307(e)(1), when the service-contract claim is filed with the manufacturer or distributor. No retail-rate or paid-hours rule is established for this coverage.'},
  VA:{all:'Manufacturer or distributor must compensate the work. Whether a separate insurance or service-contract affiliate qualifies remains unresolved.'},
  WI:{all:'Manufacturer, importer or distributor must require, request or approve the work, or agree to pay for it.'}
 };
 const hourNotes={
  AK:'Independent-guide floor applies unless otherwise agreed.',
  IL:'1.5× OEM time is a fallback only when no guide is agreed or the agreed guide does not cover the repair.',
  NJ:'Dealer election: customer-paid billed hours ÷ OEM-guide hours, applied to OEM time. Effective April 1, 2026.',
  MS:'Reasonable and adequate allowances benchmarked to time required by a qualified technician of ordinary skill. This is not the dealer’s own clock time.',
  RI:'Documented technician time, including diagnostic and OEM assistance time. Effective October 1, 2026.',
  KY:'Passenger vehicles use factory time. Class 7+ heavy trucks have an actual-hours exception, expanded July 15, 2026, outside this comparison.',
  MN:'Dealer’s retail guide with an actual-time fallback; effective October 1, 2023.',
  MT:'Dealer chooses the manufacturer’s guide or its customer-pay guide.',
  ND:'Customer-pay guide with an actual-time fallback when it omits the repair.',
  WI:'Paid hours remain OEM time. The retail/factory time difference is incorporated into the hourly rate’s denominator.',
  NC:'Documented requests for modified or additional diagnosis/repair time may not be unreasonably denied; the old reasonable-and-adequate sentence was deleted July 1, 2025.',
  NE:'Allowances must be adequate for a qualified technician; documented requests to modify or add time may not be unreasonably denied.',
  WV:'The dealer’s written modification request is presumed reasonable; diagnostic time includes manufacturer communications.',
  OR:'Additional-time protections apply to new or renewed franchises from January 1, 2026.',
  PA:'Factory time, no statutory standard: § 307 requires disclosure of the time allowance but sets no reasonableness standard.',
  CT:'Diagnosis and warranty-service time allowances must be reasonable and adequate for the work to be performed.',
  VA:'No general repair-time standard; diagnostic work includes manufacturer technical-assistance communications.'
 };
 const sourceNames={official:'Official statute',enrolled_act:'Enacted-law text',mirror:'Code reproduction'};
 const byState=new Map(window.COVERAGE_V3.map(r=>[r.state,r]));
 const sourceUrls=raw=>[...new Set((raw.match(/https?:\/\/[^\s<>"']+/g)||[]).map(u=>u.replace(/[),.;]+$/,'')))];
 function displayNotes(raw){return raw
  .replace("CPO is expressly named and is normally issued by the licensee itself, hence 'yes' (same issuer qualifier applies).",'CPO has the same issuer qualifier; v3 classifies it as Conditional.')
  .replace(/MFR SC = yes because .*?holder\./,'Manufacturer-backed service contracts are Conditional under v3: § 6(f) reaches affiliate-issued plans, but coverage remains interpretive.')
  .replace("A third-party obligor is not a 'manufacturer, importer, or distributor', so independent contracts are not reached.",'The v3 cell is Not addressed for independent contracts; the manufacturer-limited wording is not treated as an express exclusion in this record.')
  .replace("Independent contracts: 'service contracts' are covered only as 'manufacturer or distributor sponsored, issued, or required items', so third-party contracts are outside the section by scope limit, not by an express exclusion.",'Independent contracts are Conditional: they must be manufacturer or distributor sponsored, issued or required.')
  .replace(/Cross-check 9\/24: Grok marked independent service contracts 'conditional' here\..*?a true third-party contract is Not reached\./,'Earlier September 24 classification superseded by v3: ND is Conditional when the manufacturer/distributor sponsors, issues or requires the contract; NH remains Not reached for independent contracts.')
  .replace('Third-party contracts fall outside the franchisor-offered-and-reimbursed limit; no carve-out names them.','Third-party contracts are Conditional when the franchisor offers and reimburses the repair service; otherwise they fall outside the reviewed scope.');}
 function effectiveCell(raw,type,asOf){
  const cell=raw.coverage[type.key];
  if(raw.state==='RI'&&asOf<'2026-10-01'){
   if(type.id==='factory')return {...cell,paid_hours:'silent'};
   if(type.id==='cpo')return {...cell,applies:'silent',paid_hours:'n/a'};
  }
  return cell;
 }
 function record(state,coverage,asOf){
  const raw=byState.get(state.abbr),type=types.find(t=>t.id===coverage),cell=effectiveCell(raw,type,asOf);
  const condition=cell.applies==='conditional'?(conditions[state.abbr]?.[coverage]||conditions[state.abbr]?.all):'';
  const assigned=['yes','conditional'].includes(cell.applies),status=statuses.find(s=>s.id===cell.applies);
  const dated=state.abbr==='RI'&&['factory','cpo'].includes(coverage),upcoming=dated&&asOf<'2026-10-01';
  const notEstablished=(state.abbr==='NC'&&coverage==='manufacturer_contract')||(state.abbr==='PA'&&['manufacturer_contract','independent_contract'].includes(coverage));
  const scopeEvidence=state.abbr==='PA'&&coverage==='independent_contract'?raw.coverage.mfr_service_contract:null;
  const currentEvidence=upcoming?{quote:'Every manufacturer shall properly fulfill any warranty agreement and adequately and fairly compensate each of its motor vehicle dealers for labor and parts.',pinpoint:'§ 31-5.1-6(a), pre-October 1, 2026 text',url:'https://webserver.rilegislature.gov/Statutes/TITLE31/31-5.1/31-5.1-6.htm'}:null;
  return {state:state.abbr,coverage,applicability:cell.applies,statusLabel:status.name,condition,applicabilityNote:condition||status.description,
   hourlyRate:notEstablished?'Not established. The reviewed provisions do not clearly extend the factory-warranty hourly-rate rule to this service-contract coverage.':assigned?raw.hourly_rate_method:cell.applies==='no'?'Not reached under the reviewed provisions; no statutory hourly-rate method assigned to this coverage.':'Not addressed by the reviewed provisions; no coverage-specific hourly-rate method assigned.',
   stateHourlyRate:raw.hourly_rate_method,contextOnly:!assigned||notEstablished,paidHoursId:cell.paid_hours,paidHours:notEstablished?'Not established':methods.find(m=>m.id===cell.paid_hours).name,
   hoursNote:notEstablished?'No paid-hours rule established for this service-contract coverage. Counted in the Statute silent on time bucket; no factory method is inherited.':upcoming?(coverage==='factory'?'Through September 30, 2026, no general time-allowance provision. The actual-technician-time rule starts October 1.':'CPO is not expressly addressed through September 30, 2026; no paid-hours method is assigned.'):(assigned?(hourNotes[state.abbr]||'Read the quoted provision and notes for the time-allowance requirements.'):'No paid-hours classification assigned to this coverage.'),
   quote:cell.quote,pinpoint:cell.pinpoint,primaryCite:raw.primary_cite,definitionCite:raw.definition_cite,notes:displayNotes(raw.notes),effectiveNotes:raw.effective_notes,
   confidence:raw.confidence,sourceQuality:raw.source_quality,sourceName:sourceNames[raw.source_quality],sourceNote:raw.official_url,urls:sourceUrls(raw.official_url),upcoming,
   dateNote:dated?(upcoming?'Upcoming October 1, 2026: actual technician time and CPO Required. The displayed classification and counts use the prior rule for the selected date.':'Effective October 1, 2026. Actual technician time and CPO Required are included in the selected-date counts.'):'',
   programScope:type.programScope||'',notEstablished,currentEvidence,scopeEvidence,
   evidenceLabel:upcoming?'Supplied quotation · enacted October 1 text, not yet effective':scopeEvidence?'Supplied quotation · warranty-rate provision, not a service-contract rate grant':'Quoted statutory evidence',reviewStatus:'v3_researched'};
 }
 const tallies=asOf=>types.map(t=>({coverage:t.id,name:t.name,counts:Object.fromEntries(statuses.map(s=>[s.id,window.COVERAGE_V3.filter(r=>effectiveCell(r,t,asOf).applies===s.id).length]))}));
 window.LABOR_COVERAGE={types,statuses,methods,record,tallies,sourceUrls,programScope,researchDate:'2026-09-25',byState};
})();
