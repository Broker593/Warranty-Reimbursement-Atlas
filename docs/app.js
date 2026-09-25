(() => {
  'use strict';
  const { states, rules } = window.REFERENCE;
  const labor = window.LABOR_COVERAGE;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const groups = ['Parts', 'Hourly rate', 'Paid hours', 'Rate submissions'];
  const groupClass = {'Parts':'parts','Hourly rate':'hourly','Paid hours':'hours','Rate submissions':'samples'};
  const common = new Set(['retail_parts','retail_labor']);
  const ruleMap = new Map(rules.map(r => [r.id,r]));
  const stateMap = new Map(states.map(s => [s.abbr,s]));
  const initial = new URLSearchParams(location.search);
  const ui = {
    q: initial.get('q') || '',
    asOf: /^\d{4}-\d{2}-\d{2}$/.test(initial.get('asof') || '') && initial.get('asof') >= '2026-09-24' && initial.get('asof') <= '2099-12-31' && !Number.isNaN(Date.parse(initial.get('asof'))) ? initial.get('asof') : new Date().toISOString().slice(0,10),
    view: ['payments','submissions','all','labor'].includes(initial.get('view')) ? initial.get('view') : 'payments',
    coverage: labor.types.some(t=>t.id===initial.get('coverage')) ? initial.get('coverage') : 'factory',
    applicability: labor.statuses.some(s=>s.id===initial.get('applicability')) ? initial.get('applicability') : 'all',
    method: labor.methods.some(m=>m.id===initial.get('method')) ? initial.get('method') : '',
    rules: new Set((initial.get('rules') || '').split(',').filter(id => ruleMap.has(id))),
    selected: new Set((initial.get('selected') || '').split(',').filter(id => stateMap.has(id))),
    match: initial.get('match') === 'any' ? 'any' : 'all',
    evidence: ['official','partial','secondary'].includes(initial.get('evidence')) ? initial.get('evidence') : 'all',
    hideCommon: initial.get('differences') !== '0',
    compare: initial.get('compare') === '1',
    state: stateMap.has(initial.get('state')) ? initial.get('state') : null,
    detailRule: ruleMap.has(initial.get('detail_rule')) ? initial.get('detail_rule') : null
  };
  let toastTimer;
  const status = s => s.review?.status || (s.basis.startsWith('Official')?'official':'reproduction');
  const ruleValue = (s,id) => {
    let value=s.flags[id];
    for(const change of s.changes || []) if(change.effective<=ui.asOf && Object.hasOwn(change.flags || {},id)) value=change.flags[id];
    return value;
  };
  const effectiveTime = s => (s.changes || []).filter(c=>c.effective<=ui.asOf && c.time).at(-1)?.time || s.time;
  function renderCoverage() {
    const text=states.filter(s=>s.original && ['text','pdf','act'].includes(s.original.kind)).length;
    const portals=states.filter(s=>s.original?.kind==='portal').length;
    const official=states.filter(s=>status(s)==='official').length;
    const partial=states.filter(s=>status(s)==='partial').length;
    $('coverage').innerHTML='<strong>Warranty sources</strong><span>'+text+' direct text / act links</span><span>'+portals+' access pages</span><span>'+(50-text-portals)+' link pending</span><span class="coverage-pending">'+official+' existing official reviews · '+partial+' partial official checks · '+(50-official-partial)+' reproduction-based</span>';
    if(ui.view==='labor')$('coverage').innerHTML='<strong>Coverage research v2</strong><span>50 states · 200 entries</span><span>40 official-statute records · 5 enacted-law records · 5 code reproductions</span><span>Research dated September 24, 2026</span>';
    $('coverageDetail').textContent='Coverage is calculated from the state records: '+official+' existing official-text reviews, '+partial+' partial official checks, and '+(50-official-partial)+' entries based on reproductions. Partial checks identify exactly which provisions were compared. No status represents legal sign-off or an exhaustive update of all amendments.';
  }
  function sourceInfo(url) {
    const host = new URL(url).hostname.replace(/^www\./,'');
    if (host === 'dealeruplift.com') return {name:'Armatus',type:'Third-party statutory reproduction',host};
    if (host === 'law.justia.com') return {name:'Justia',type:'Third-party code reproduction',host};
    if (host === 'njcar.org') return {name:'NJ CAR',type:'Dealer-association announcement',host};
    const official=states.some(s=>s.basis.startsWith('Official') && (s.url===url || s.additional===url));
    return {name:official?'Official state website':host,type:official?'Official statute / code':'Supporting source',host};
  }
  function reviewLabel(s) {
    return status(s)==='official' ? 'Official text reviewed' : status(s)==='partial' ? 'Partial official check' : sourceInfo(s.url).name+' text reviewed';
  }
  function sourceLink(url, primary) {
    const info=sourceInfo(url);
    return '<a class="source-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer"><strong>'+esc(primary?'Source reviewed: '+info.name:'Supporting source: '+info.name)+' ↗</strong><span>'+esc(info.type)+' · '+esc(info.host)+'</span></a>';
  }
  function originalLink(s) {
    const o=s.original;
    if(!o) return '<p class="original-gap">Original source link not yet confirmed. The reviewed source remains available below.</p>';
    const label=o.kind==='act'?'Official enacted-law text':o.kind==='pdf'?'Official code PDF':o.kind==='text'?'Original statutory text':'Code access page — navigation required';
    return '<a class="source-link original-source" href="'+esc(o.url)+'" target="_blank" rel="noopener noreferrer"><strong>'+label+' ↗</strong><span>'+esc(new URL(o.url).hostname.replace(/^www\./,''))+'</span></a><p class="original-note">'+esc(o.note)+'<br><small>'+esc(o.linkStatus || 'Link not retested in this update.')+'<br>Located: '+esc(o.locatedDate || '2026-09-21')+'. Link availability and summary verification are separate.</small></p>';
  }
  function sourceLinks(s) {
    return originalLink(s)+(s.original && s.original.url===s.url?'':sourceLink(s.url,true))+(s.additional?sourceLink(s.additional,false):'')+(s.extraSources || []).map(x=>'<a class="source-link" href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer"><strong>'+esc(x.label)+' ↗</strong><span>'+esc(new URL(x.url).hostname)+'</span></a>').join('');
  }
  function ruleCell(s,r) {
    const value=ruleValue(s,r.id), unknown=value==null;
    const label=unknown?'not yet classified':value?'identified':'not identified under this definition';
    return '<button class="mark '+(unknown?'unknown':value?'yes':'no')+' rule-check" data-state="'+s.abbr+'" data-state-rule="'+r.id+'" aria-label="Explain '+esc(r.name)+' in '+esc(s.state)+': '+label+'" title="'+esc(label)+'; click for explanation">'+(unknown?'?':value?'✓':'')+'</button>';
  }
  function ruleExplanation(s,id) {
    const r=ruleMap.get(id);
    if(!r)return '';
    const value=ruleValue(s,id);
    const body=id==='accuracy_only'?s.process?.challenge:id==='automatic_rate'?s.process?.rateApproval:r.group==='Parts'?s.parts:r.group==='Hourly rate'?s.labor:r.group==='Paid hours'?(id==='normalized_rate'?s.labor+' '+effectiveTime(s):effectiveTime(s)):s.sample;
    const explanation=value==null?'This feature has not yet been classified for this state. A question mark is not a finding that the rule is absent.':value?'The reviewed provision matches this definition, subject to the conditions below.':'The reviewed provision was not classified under this definition. This does not establish that the law contains no related protection.';
    return '<aside class="rule-explanation"><div class="section-label">'+(value==null?'Not yet classified':value?'Why this box is checked':'Why this box is empty')+'</div><h3>'+esc(r.name)+'</h3><p>'+esc(explanation)+'</p><small>Definition: '+esc(r.description)+'</small>'+(body?'<p>'+esc(body)+'</p>':'')+'</aside>';
  }
  function reviewRecord(s) {
    return '<div class="review-status '+(status(s)==='official'?'reviewed':'pending')+'"><strong>'+esc(reviewLabel(s))+'</strong><span>'+esc(s.review.scope)+'</span><span>Last recorded review: '+esc(s.review.date)+'</span></div>';
  }
  function changeNotice(s) {
    return (s.changes || []).map(c=>'<aside class="change-notice"><strong>'+(c.effective>ui.asOf?'Upcoming: ':'Effective: ')+esc(c.effective)+' · '+esc(c.title)+'</strong><p>'+esc(c.time)+'</p><a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer">Read the official amendment ↗</a></aside>').join('')+(s.pendingNote?'<aside class="change-notice pending"><strong>Follow-up verification needed</strong><p>'+esc(s.pendingNote)+'</p></aside>':'');
  }
  const laborRecord = s => labor.record(s,ui.coverage,ui.asOf);
  const coverageType = () => labor.types.find(t=>t.id===ui.coverage);
  const laborMethod = id => labor.methods.find(m=>m.id===id);
  const statusBadge = r => '<span class="coverage-status status-'+r.applicability+'"><span aria-hidden="true">'+labor.statuses.find(x=>x.id===r.applicability).symbol+'</span> '+esc(r.statusLabel)+'</span>';
  const dateBadge = r => r.dateNote?'<p class="effective-status '+(r.upcoming?'upcoming':'effective')+'">'+esc(r.dateNote)+'</p>':'';
  function renderLabor() {
    const type=coverageType(),rows=filteredStates(),records=states.map(laborRecord);
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===ui.view)));
    $('coverageType').value=ui.coverage;$('applicabilityFilter').value=ui.applicability;
    $('laborScope').textContent=type.note;
    $('laborProgress').textContent='50 states researched · 200 coverage entries populated · Claude v2 research dated September 24, 2026';
    $('coverageTally').innerHTML='<caption>Coverage counts · all 50 states</caption><thead><tr><th scope="col">Coverage</th>'+labor.statuses.map(s=>'<th scope="col">'+s.name+'</th>').join('')+'</tr></thead><tbody>'+labor.tallies().map(t=>'<tr class="'+(t.coverage===ui.coverage?'current-coverage':'')+'"><th scope="row">'+esc(t.name)+'</th>'+labor.statuses.map(s=>'<td><button data-coverage-count="'+t.coverage+'" data-count-status="'+s.id+'" aria-label="Show '+t.counts[s.id]+' '+s.name+' states for '+esc(t.name)+'">'+t.counts[s.id]+'</button></td>').join('')+'</tr>').join('')+'</tbody>';
    $('laborDateNotice').textContent='Enacted-law research totals include Rhode Island’s October 1, 2026 actual-time and CPO provisions. On the selected date ('+ui.asOf+'), those provisions are '+(ui.asOf<'2026-10-01'?'UPCOMING, not yet effective.':'EFFECTIVE.')+' The date selector updates effective-date notes; it does not remove enacted future provisions from these research totals.';
    $('hoursHeading').textContent='Paid-hours counts · '+type.name;
    $('laborBuckets').innerHTML=labor.methods.filter(m=>m.id!=='n/a'||ui.coverage!=='factory').map(m=>{
      const matches=records.filter(r=>r.paidHoursId===m.id),codes=matches.map(r=>r.state).join(', ');
      return '<button class="labor-bucket" data-labor-method="'+m.id+'" aria-pressed="'+(ui.method===m.id)+'" aria-label="'+esc(m.name)+': '+matches.length+' states. Filter this paid-hours bucket." title="'+esc(m.description)+'"><span>'+esc(m.name)+(m.id==='n/a'?' No method assigned':'')+'</span><strong>'+matches.length+'</strong><small>'+esc(codes||'No states')+'</small></button>';
    }).join('');
    $('laborCountNote').textContent='One primary paid-hours bucket per state and coverage type. Counts always cover all 50 states, independent of search or comparison filters. Factory time includes general time-allowance standards. Wisconsin stays Negotiated/other because its time adjustment is in the hourly-rate formula; its paid hours remain OEM time.';
    $('matrixHead').innerHTML='<tr><th rowspan="2" class="state-head" scope="col">State<span>Select to compare · click for evidence</span></th><th class="group-samples" scope="colgroup">Coverage applicability</th><th class="group-hourly" scope="colgroup">Hourly dollar rate</th><th class="group-hours" scope="colgroup">Paid labor hours</th></tr><tr><th scope="col">Status and condition</th><th scope="col">How the rate is established</th><th scope="col">Time method and exceptions</th></tr>';
    $('matrixBody').innerHTML=rows.map(s=>{
      const r=laborRecord(s);
      return '<tr class="'+(ui.selected.has(s.abbr)?'selected':'')+'"><td class="state-cell"><div class="state-inner"><input type="checkbox" class="compare-check" data-select="'+s.abbr+'" aria-label="Select '+esc(s.state)+' for comparison" '+(ui.selected.has(s.abbr)?'checked':'')+'><button class="state-name" data-state="'+s.abbr+'"><span class="state-text">'+esc(s.state)+'</span><span class="abbr">'+s.abbr+'</span><span class="evidence-label">Confidence: '+esc(r.confidence)+'</span><span class="evidence-label">'+esc(r.sourceName)+'</span></button></div></td><td>'+statusBadge(r)+'<p class="'+(r.condition?'condition-note':'')+'">'+(r.condition?'<strong>Condition: </strong>':'')+esc(r.applicabilityNote)+'</p>'+dateBadge(r)+'<button class="text-button" data-state="'+s.abbr+'">Quote, notes &amp; source →</button></td><td><p>'+esc(r.hourlyRate)+'</p></td><td><strong class="hours-label">'+esc(r.paidHours)+'</strong><p>'+esc(r.hoursNote)+'</p></td></tr>';
    }).join('');
    $('empty').hidden=rows.length>0;$('matrix').hidden=rows.length===0;
    $('emptyMessage').textContent='No states match the selected coverage, status, paid-hours bucket and search. Reset filters to show all 50 states.';
    $('resultSummary').innerHTML='<strong>'+rows.length+'</strong> of 50 states · '+esc(type.name)+(ui.compare?' · comparison view':'');
    $('compareCount').textContent=ui.selected.size;$('compareBtn').disabled=!ui.selected.size;
    $('compareBtn').classList.toggle('active',ui.compare);$('compareBtn').setAttribute('aria-pressed',String(ui.compare));
    $('compareBtn').firstChild.textContent=ui.compare?'Show all states ':'Compare selected ';
    $('activeFilters').innerHTML=(ui.method?'<button class="filter-chip" id="clearLaborMethod">'+esc(laborMethod(ui.method).name)+' <span>×</span></button>':'')+(ui.applicability!=='all'?'<button class="filter-chip" id="clearApplicability">'+esc(labor.statuses.find(s=>s.id===ui.applicability).name)+' <span>×</span></button>':'')+(ui.compare?'<button class="filter-chip" id="exitCompare">Selected states only <span>×</span></button>':'');
    renderFilters();syncUrl();
  }
  function openLaborState(s) {
    const r=laborRecord(s),type=coverageType();ui.state=s.abbr;ui.detailRule=null;
    $('stateTitle').textContent=s.state+' · '+type.name;
    const links=r.urls.map((url,i)=>'<a class="source-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer"><strong>'+(i===0?'Research source':'Additional source')+' ↗</strong><span>'+esc(url)+'</span></a>').join('');
    $('stateContent').innerHTML='<div class="state-summary">'+statusBadge(r)+'<p>'+esc(r.applicabilityNote)+'</p>'+dateBadge(r)+'<p><strong>Confidence: '+esc(r.confidence)+'</strong> · '+esc(r.sourceName)+'<br>Claude v2 research: September 24, 2026. Imported September 25, 2026.</p></div><div class="state-sections"><section class="state-section"><div class="section-label">Hourly dollar rate</div><p>'+esc(r.hourlyRate)+'</p>'+(!['yes','conditional'].includes(r.applicability)?'<details><summary>State’s factory-warranty rate method, for context only</summary><p>'+esc(r.stateHourlyRate)+'</p></details>':'')+'</section><section class="state-section"><div class="section-label">Paid hours</div><h3>'+esc(r.paidHours)+'</h3><p>'+esc(r.hoursNote)+'</p></section><section class="state-section"><div class="section-label">Quoted statutory evidence</div><blockquote class="statute-quote">'+esc(r.quote)+'</blockquote><p><strong>Pinpoint: '+esc(r.pinpoint)+'</strong></p><p>Primary citation: '+esc(r.primaryCite)+'</p><p>Definitions checked: '+esc(r.definitionCite)+'</p></section><section class="state-section"><div class="section-label">State notes and qualifications</div><p>'+esc(r.notes)+'</p></section><section class="state-section"><div class="section-label">Effective dates and legislative history</div><p>'+esc(r.effectiveNotes)+'</p></section><section class="state-section"><div class="section-label">Sources and provenance</div><p>Research source type: '+esc(r.sourceName)+'. Source classification and confidence are from the supplied v2 research. This import is not a claim that every source was independently rechecked.</p><p>'+esc(r.sourceNote)+'</p><div class="source-links">'+links+'</div><p><a href="research/labor-by-coverage-v2.json" download>Download supplied JSON</a> · <a href="https://github.com/Broker593/Warranty-Reimbursement-Atlas/blob/main/docs/research/labor-by-coverage-patch-v2.md" target="_blank" rel="noopener">Read supplied research patch ↗</a></p></section></div><div class="detail-actions"><button class="quiet" data-detail-select="'+s.abbr+'">'+(ui.selected.has(s.abbr)?'Remove from comparison':'Add to comparison')+'</button><button class="primary" id="shareState">Share this state ↗</button></div>';
    if(!$('stateDialog').open)$('stateDialog').showModal();$('stateDialog').scrollTop=0;syncUrl();
  }
  function openLaborKey() {
    $('keyTitle').textContent='Coverage status and paid-hours definitions';
    $('keyContent').innerHTML='<section class="key-group"><h3>Coverage applicability</h3><div class="rule-cards">'+labor.statuses.map(s=>'<article class="rule-card"><h4>'+s.name+'</h4><p>'+esc(s.description)+'</p></article>').join('')+'</div></section><section class="key-group"><h3>Paid-hours methods</h3><div class="rule-cards">'+labor.methods.map(m=>'<article class="rule-card"><h4>'+esc(m.name)+'</h4><p>'+esc(m.description)+'</p></article>').join('')+'</div></section>';
    if(!$('keyDialog').open)$('keyDialog').showModal();
  }
  function visibleRules() {
    return rules.filter(r => (ui.view === 'all' || (ui.view === 'submissions' ? r.group === 'Rate submissions' : r.group !== 'Rate submissions')) && !(ui.hideCommon && common.has(r.id)));
  }
  function filteredStates() {
    const terms = ui.q.toLowerCase().split(/[,;]+/).map(t=>t.trim()).filter(Boolean);
    return states.filter(s => {
      if (terms.length && !terms.some(t => s.state.toLowerCase().includes(t) || s.abbr.toLowerCase() === t)) return false;
      if (ui.view !== 'labor' && ui.evidence !== 'all' && status(s)!==(ui.evidence==='secondary'?'reproduction':ui.evidence)) return false;
      if (ui.compare && !ui.selected.has(s.abbr)) return false;
      if (ui.view === 'labor' && ui.method && laborRecord(s).paidHoursId!==ui.method) return false;
      if (ui.view === 'labor' && ui.applicability !== 'all' && laborRecord(s).applicability!==ui.applicability) return false;
      if (ui.view !== 'labor' && ui.rules.size) {
        const flags = [...ui.rules].map(id => ruleValue(s,id));
        if (!(ui.match === 'all' ? flags.every(Boolean) : flags.some(Boolean))) return false;
      }
      return true;
    });
  }
  function syncUrl() {
    const p = new URLSearchParams();
    if (ui.q) p.set('q',ui.q);
    p.set('asof',ui.asOf);
    if (ui.view !== 'payments') p.set('view',ui.view);
    if (ui.view === 'labor') {p.set('coverage',ui.coverage);if(ui.applicability!=='all')p.set('applicability',ui.applicability);if(ui.method)p.set('method',ui.method);}
    if (ui.rules.size) p.set('rules',[...ui.rules].join(','));
    if (ui.selected.size) p.set('selected',[...ui.selected].join(','));
    if (ui.match !== 'all') p.set('match',ui.match);
    if (ui.evidence !== 'all') p.set('evidence',ui.evidence);
    p.set('differences',ui.hideCommon?'1':'0');
    if (ui.compare) p.set('compare','1');
    if (ui.state) p.set('state',ui.state);
    if (ui.state && ui.detailRule) p.set('detail_rule',ui.detailRule);
    const next = location.pathname + (p.size ? '?' + p.toString() : '') + location.hash;
    history.replaceState(null,'',next);
  }
  function renderFilters() {
    $('filterChoices').innerHTML = groups.map(g => '<div class="filter-group-title">'+g+'</div>' + rules.filter(r=>r.group===g).map(r => '<label class="filter-choice"><input type="checkbox" data-rule="'+r.id+'" '+(ui.rules.has(r.id)?'checked':'')+'><span>'+esc(r.name)+'</span><small>'+states.filter(s=>ruleValue(s,r.id)).length+'</small></label>').join('')).join('');
    $('ruleFilterCount').textContent = ui.rules.size ? '('+ui.rules.size+')' : '';
    $('match').value = ui.match;
    $('evidence').value = ui.evidence;
    $('hideCommon').checked = ui.hideCommon;
    $('search').value = ui.q;
    $('asOf').value=ui.asOf;
  }
  function render() {
    renderCoverage();
    const isLabor=ui.view==='labor';
    $('laborPanel').hidden=!isLabor;
    ['ruleFilter','sourceFilter','sharedToggle','warrantyLegend','warrantyContext'].forEach(id=>$(id).hidden=isLabor);
    $('laborContext').hidden=!isLabor;
    $('matrix').classList.toggle('labor-matrix',isLabor);
    $('matrixCaption').textContent=isLabor?'Labor reimbursement methods by state and coverage. Required, Conditional, Not reached and Not addressed are distinct researched statuses. Enacted future changes are flagged.':'State reimbursement features. A check identifies a feature, an empty box means not identified under the definition, and a question mark means unclassified.';
    $('keyBtn').textContent=isLabor?'Labor bucket definitions ⓘ':'Rule definitions ⓘ';
    if(isLabor){renderLabor();return;}
    $('emptyMessage').textContent='Remove a rule filter or switch from “all” to “any.”';
    const cols = visibleRules(), rows = filteredStates();
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===ui.view)));
    const usedGroups = groups.filter(g=>cols.some(r=>r.group===g));
    $('matrixHead').innerHTML = '<tr><th class="state-head" scope="col" rowspan="2">State<span>Select to compare · click name for detail</span></th>' + usedGroups.map(g=>'<th scope="colgroup" colspan="'+cols.filter(r=>r.group===g).length+'" class="group-'+groupClass[g]+'">'+g+'</th>').join('') + '</tr><tr>' + cols.map(r=>'<th scope="col" class="rule-head"><button data-key="'+r.id+'" title="'+esc(r.name)+' — open definition">'+esc(r.short)+'<small>'+states.filter(s=>ruleValue(s,r.id)).length+' states · ⓘ</small></button></th>').join('') + '</tr>';
    $('matrixBody').innerHTML = rows.map(s=>'<tr class="'+(ui.selected.has(s.abbr)?'selected':'')+'"><td class="state-cell"><div class="state-inner"><input type="checkbox" class="compare-check" data-select="'+s.abbr+'" aria-label="Select '+esc(s.state)+' for comparison" '+(ui.selected.has(s.abbr)?'checked':'')+'><button class="state-name" data-state="'+s.abbr+'"><span class="state-text">'+esc(s.state)+'</span><span class="abbr">'+s.abbr+'</span><span class="evidence-label '+(s.basis.startsWith('Official')?'official':'')+'" title="'+esc(reviewLabel(s))+'">'+esc(reviewLabel(s))+'</span><span class="original-label">'+(s.original?(['text','pdf','act'].includes(s.original.kind)?'Direct text / act linked':'Code access page linked'):'Original link pending')+'</span></button></div></td>' + cols.map(r=>'<td class="'+(common.has(r.id)?'common-col':'')+'">'+ruleCell(s,r)+'</td>').join('')+'</tr>').join('');
    $('empty').hidden = rows.length > 0;
    $('matrix').hidden = rows.length === 0;
    $('resultSummary').innerHTML = '<strong>'+rows.length+'</strong> of 50 states <span aria-hidden="true">·</span> '+cols.length+' rule columns'+(ui.compare?' · comparison view':'');
    $('compareCount').textContent = ui.selected.size;
    $('compareBtn').disabled = !ui.selected.size;
    $('compareBtn').classList.toggle('active',ui.compare);
    $('compareBtn').setAttribute('aria-pressed',String(ui.compare));
    $('compareBtn').firstChild.textContent = ui.compare ? 'Show all states ' : 'Compare selected ';
    $('activeFilters').innerHTML = [...ui.rules].map(id=>'<button class="filter-chip" data-remove-rule="'+id+'">'+esc(ruleMap.get(id).name)+' <span aria-label="Remove filter">×</span></button>').join('') + (ui.compare ? '<button class="filter-chip" id="exitCompare">Selected states only <span>×</span></button>' : '');
    renderFilters();
    syncUrl();
  }
  function openState(code, ruleId=null) {
    const s = stateMap.get(code);
    if (!s) return;
    if(ui.view==='labor'){openLaborState(s);return;}
    ui.state = code;
    ui.detailRule=ruleId && ruleMap.has(ruleId) ? ruleId : null;
    $('stateTitle').textContent = s.state;
    const sections = [
      ['Parts payment',s.parts,'Parts'],
      ['Hourly labor rate',s.labor,'Hourly rate'],
      ['Paid labor time',effectiveTime(s),'Paid hours'],
      ['Rate submission sample',s.sample,'Rate submissions'],
      ['Important distinctions',s.note,null],
      ['Rate challenge grounds',s.process?.challenge || 'Not yet classified. Consult the source; no finding of absence.',null],
      ['Rate submission approval',s.process?.rateApproval || 'Not yet classified. This is separate from individual warranty-claim approval.',null],
      ['Warranty claim approval',s.process?.claimApproval || 'Not yet classified. Rate-submission deadlines must not be used as claim-payment deadlines.',null]
    ];
    $('stateContent').innerHTML = '<div class="state-summary"><div class="statute">Statute: '+esc(s.statute)+'</div>'+reviewRecord(s)+'<p>Public reimbursement rules. Actual retailer payment amounts are not included.</p></div>'+changeNotice(s)+ruleExplanation(s,ui.detailRule)+'<div class="state-sections">'+sections.map(([label,body,group])=>'<section class="state-section"><div class="section-label">'+label+'</div><p>'+esc(body)+'</p>'+(group?'<div class="rule-tags">'+rules.filter(r=>r.group===group&&ruleValue(s,r.id)).map(r=>'<button class="rule-tag" data-key="'+r.id+'">'+esc(r.short)+'</button>').join('')+'</div>':'')+'</section>').join('')+'<section class="state-section"><div class="section-label">Sources and review record</div><p>Original research basis: '+esc(s.basis)+'</p>'+(s.checks || []).map(c=>'<p class="check-record"><strong>'+esc(c.date)+' · '+esc(c.sourceType)+'</strong><br>'+esc(c.scope)+'<br><a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer">Evidence for this check ↗</a></p>').join('')+'<div class="source-age">Source page date / code version: <strong>'+esc(s.sourceDate)+'</strong><br>Last recorded review: '+esc(s.review.date)+'<br><small>These dates are separate from a law’s effective date. Effective-date notes appear in the state requirements when established.</small></div><div class="source-links">'+sourceLinks(s)+'</div></section></div><div class="detail-actions"><button class="quiet" data-detail-select="'+s.abbr+'">'+(ui.selected.has(s.abbr)?'Remove from comparison':'Add to comparison')+'</button><button class="primary" id="shareState">Share this state ↗</button></div>';
    if (!$('stateDialog').open) $('stateDialog').showModal();
    $('stateDialog').scrollTop=0;
    syncUrl();
  }
  function openKey(id) {
    $('keyTitle').textContent = id && ruleMap.has(id) ? ruleMap.get(id).name : rules.length+' features. Four rule groups.';
    const selectedRules = id && ruleMap.has(id) ? [ruleMap.get(id)] : rules;
    $('keyContent').innerHTML = groups.filter(g=>selectedRules.some(r=>r.group===g)).map(g=>'<section class="key-group"><h3>'+g+'</h3><div class="rule-cards">'+selectedRules.filter(r=>r.group===g).map(r=>'<article class="rule-card"><h4>'+esc(r.name)+'</h4><p>'+esc(r.description)+'</p><p class="example">'+esc(r.example)+'</p><button class="text-button" data-apply-rule="'+r.id+'">Show '+states.filter(s=>ruleValue(s,r.id)).length+' matching states →</button></article>').join('')+'</div></section>').join('');
    if (!$('keyDialog').open) $('keyDialog').showModal();
  }
  function reset() {
    ui.q='';ui.method='';ui.applicability='all';ui.rules.clear();ui.selected.clear();ui.compare=false;ui.evidence='all';ui.match='all';ui.hideCommon=true;
    render();
  }
  function notify(message) {
    clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;
    toastTimer=setTimeout(()=>$('toast').hidden=true,3300);
  }
  async function share() {
    syncUrl();
    try { await navigator.clipboard.writeText(location.href);notify('Link copied. It includes your current state and rule filters.'); }
    catch { window.prompt('Copy this link to share the current view:',location.href); }
  }
  $('asOf').addEventListener('change',e=>{if(!e.target.value || !e.target.validity.valid)return;ui.asOf=e.target.value;render();});
  $('search').addEventListener('input',e=>{ui.q=e.target.value;render();});
  $('match').addEventListener('change',e=>{ui.match=e.target.value;render();});
  $('evidence').addEventListener('change',e=>{ui.evidence=e.target.value;render();});
  $('hideCommon').addEventListener('change',e=>{ui.hideCommon=e.target.checked;render();});
  $('compareBtn').addEventListener('click',()=>{ui.compare=!ui.compare;render();});
  $('clearRules').addEventListener('click',()=>{ui.rules.clear();render();});
  ['resetBtn','emptyReset'].forEach(id=>$(id).addEventListener('click',reset));
  ['aboutBtn','footerAbout'].forEach(id=>$(id).addEventListener('click',()=>$('aboutDialog').showModal()));
  $('keyBtn').addEventListener('click',()=>ui.view==='labor'?openLaborKey():openKey());
  $('coverageType').addEventListener('change',e=>{ui.coverage=e.target.value;ui.method='';ui.applicability='all';render();});
  $('applicabilityFilter').addEventListener('change',e=>{ui.applicability=e.target.value;render();});
  $('shareBtn').addEventListener('click',share);
  document.addEventListener('change',e=>{
    const target=e.target;
    if(target.dataset.rule){target.checked?ui.rules.add(target.dataset.rule):ui.rules.delete(target.dataset.rule);render();}
    if(target.dataset.select){target.checked?ui.selected.add(target.dataset.select):ui.selected.delete(target.dataset.select);if(!ui.selected.size)ui.compare=false;render();}
  });
  document.addEventListener('click',e=>{
    const t=e.target.closest('button');
    if(t){
      if(t.dataset.coverageCount){ui.coverage=t.dataset.coverageCount;ui.applicability=t.dataset.countStatus;ui.q='';ui.method='';ui.compare=false;render();}
      if(t.id==='clearApplicability'){ui.applicability='all';render();}
      if(t.hasAttribute('data-labor-method')){ui.method=ui.method===t.dataset.laborMethod?'':t.dataset.laborMethod;render();}
      if(t.id==='clearLaborMethod'){ui.method='';render();}
      if(t.dataset.view){ui.view=t.dataset.view;render();}
      if(t.dataset.state)openState(t.dataset.state,t.dataset.stateRule);
      if(t.dataset.key)openKey(t.dataset.key);
      if(t.dataset.removeRule){ui.rules.delete(t.dataset.removeRule);render();}
      if(t.id==='exitCompare'){ui.compare=false;render();}
      if(t.dataset.close)$(t.dataset.close).close();
      if(t.dataset.applyRule){
        const r=ruleMap.get(t.dataset.applyRule);ui.rules=new Set([r.id]);ui.q='';ui.compare=false;ui.evidence='all';ui.view=r.group==='Rate submissions'?'submissions':'payments';ui.hideCommon=false;
        $('keyDialog').close();if($('stateDialog').open)$('stateDialog').close();render();
      }
      if(t.dataset.detailSelect){const code=t.dataset.detailSelect;ui.selected.has(code)?ui.selected.delete(code):ui.selected.add(code);if(!ui.selected.size)ui.compare=false;render();openState(code);}
      if(t.id==='shareState')share();
    }
    if(!$('ruleFilter').contains(e.target))$('ruleFilter').open=false;
  });
  document.querySelectorAll('dialog').forEach(d=>{
    d.addEventListener('click',e=>{if(e.target!==d)return;const rect=d.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)d.close();});
  });
  $('stateDialog').addEventListener('close',()=>{ui.state=null;ui.detailRule=null;syncUrl();});
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('search').focus();}});
  renderCoverage();
  render();
  if(ui.state)openState(ui.state,ui.detailRule);

  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();
    const tools=[{
      name:'filter_warranty_rules',title:'Filter the state matrix',description:'Set visible search and rule filters. Updates the same comparison shown on the page.',
      inputSchema:{type:'object',properties:{search:{type:'string'},rule_ids:{type:'array',items:{type:'string',enum:rules.map(r=>r.id)}},match:{type:'string',enum:['all','any']},view:{type:'string',enum:['payments','submissions','all']}},additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input){
        if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Provide an object.');
        if(Object.keys(input).some(k=>!['search','rule_ids','match','view'].includes(k)))throw Error('Unknown filter field.');
        if(input.search!==undefined&&typeof input.search!=='string')throw Error('search must be a string.');
        if(input.rule_ids!==undefined&&(!Array.isArray(input.rule_ids)||input.rule_ids.some(id=>!ruleMap.has(id))))throw Error('Unknown rule ID.');
        if(input.match!==undefined&&!['all','any'].includes(input.match))throw Error('Invalid match.');
        if(input.view!==undefined&&!['payments','submissions','all'].includes(input.view))throw Error('Invalid view.');
        if(input.search!==undefined)ui.q=input.search;if(input.rule_ids!==undefined)ui.rules=new Set(input.rule_ids);if(input.match)ui.match=input.match;if(input.view)ui.view=input.view;else if(ui.view==='labor')ui.view='payments';ui.compare=false;render();
        return {count:filteredStates().length,states:filteredStates().map(s=>s.state)};
      }
    },{
      name:'open_warranty_state',title:'Open state requirements',description:'Open the state detail panel with reimbursement rules and sources.',
      inputSchema:{type:'object',properties:{state:{type:'string',description:'State name or two-letter abbreviation'}},required:['state'],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input){if(!input||typeof input.state!=='string'||Object.keys(input).some(k=>k!=='state'))throw Error('Provide a state name or abbreviation.');const s=states.find(x=>x.state.toLowerCase()===input.state.toLowerCase()||x.abbr===input.state.toUpperCase());if(!s)throw Error('State not found.');if(ui.view==='labor'){ui.view='payments';render();}openState(s.abbr);return{state:s.state,parts:s.parts,labor:s.labor,time:s.time,source:s.url};}
    }];
    tools.forEach(tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}});
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();

