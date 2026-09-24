(() => {
  'use strict';
  const { states, rules } = window.REFERENCE;
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
    view: ['payments','submissions','all'].includes(initial.get('view')) ? initial.get('view') : 'payments',
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
    $('coverage').innerHTML='<strong>Sources</strong><span>'+text+' direct text / act links</span><span>'+portals+' access pages</span><span>'+(50-text-portals)+' link pending</span><span class="coverage-pending">'+official+' existing official reviews · '+partial+' partial official checks · '+(50-official-partial)+' reproduction-based</span>';
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
  function visibleRules() {
    return rules.filter(r => (ui.view === 'all' || (ui.view === 'submissions' ? r.group === 'Rate submissions' : r.group !== 'Rate submissions')) && !(ui.hideCommon && common.has(r.id)));
  }
  function filteredStates() {
    const terms = ui.q.toLowerCase().split(/[,;]+/).map(t=>t.trim()).filter(Boolean);
    return states.filter(s => {
      if (terms.length && !terms.some(t => s.state.toLowerCase().includes(t) || s.abbr.toLowerCase() === t)) return false;
      if (ui.evidence !== 'all' && status(s)!==(ui.evidence==='secondary'?'reproduction':ui.evidence)) return false;
      if (ui.compare && !ui.selected.has(s.abbr)) return false;
      if (ui.rules.size) {
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
    $('stateContent').innerHTML = '<div class="state-summary"><div class="statute">Statute: '+esc(s.statute)+'</div>'+reviewRecord(s)+'<p>Public reimbursement rules. Actual approved SOA retailer rates are not available in this reference.</p></div>'+changeNotice(s)+ruleExplanation(s,ui.detailRule)+'<div class="state-sections">'+sections.map(([label,body,group])=>'<section class="state-section"><div class="section-label">'+label+'</div><p>'+esc(body)+'</p>'+(group?'<div class="rule-tags">'+rules.filter(r=>r.group===group&&ruleValue(s,r.id)).map(r=>'<button class="rule-tag" data-key="'+r.id+'">'+esc(r.short)+'</button>').join('')+'</div>':'')+'</section>').join('')+'<section class="state-section"><div class="section-label">Sources and review record</div><p>Original research basis: '+esc(s.basis)+'</p>'+(s.checks || []).map(c=>'<p class="check-record"><strong>'+esc(c.date)+' · '+esc(c.sourceType)+'</strong><br>'+esc(c.scope)+'<br><a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer">Evidence for this check ↗</a></p>').join('')+'<div class="source-age">Source page date / code version: <strong>'+esc(s.sourceDate)+'</strong><br>Last recorded review: '+esc(s.review.date)+'<br><small>These dates are separate from a law’s effective date. Effective-date notes appear in the state requirements when established.</small></div><div class="source-links">'+sourceLinks(s)+'</div></section></div><div class="detail-actions"><button class="quiet" data-detail-select="'+s.abbr+'">'+(ui.selected.has(s.abbr)?'Remove from comparison':'Add to comparison')+'</button><button class="primary" id="shareState">Share this state ↗</button></div>';
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
    ui.q='';ui.rules.clear();ui.selected.clear();ui.compare=false;ui.evidence='all';ui.match='all';ui.hideCommon=true;
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
  $('keyBtn').addEventListener('click',()=>openKey());
  $('shareBtn').addEventListener('click',share);
  document.addEventListener('change',e=>{
    const target=e.target;
    if(target.dataset.rule){target.checked?ui.rules.add(target.dataset.rule):ui.rules.delete(target.dataset.rule);render();}
    if(target.dataset.select){target.checked?ui.selected.add(target.dataset.select):ui.selected.delete(target.dataset.select);if(!ui.selected.size)ui.compare=false;render();}
  });
  document.addEventListener('click',e=>{
    const t=e.target.closest('button');
    if(t){
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
        if(input.search!==undefined)ui.q=input.search;if(input.rule_ids!==undefined)ui.rules=new Set(input.rule_ids);if(input.match)ui.match=input.match;if(input.view)ui.view=input.view;ui.compare=false;render();
        return {count:filteredStates().length,states:filteredStates().map(s=>s.state)};
      }
    },{
      name:'open_warranty_state',title:'Open state requirements',description:'Open the state detail panel with reimbursement rules and sources.',
      inputSchema:{type:'object',properties:{state:{type:'string',description:'State name or two-letter abbreviation'}},required:['state'],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input){if(!input||typeof input.state!=='string'||Object.keys(input).some(k=>k!=='state'))throw Error('Provide a state name or abbreviation.');const s=states.find(x=>x.state.toLowerCase()===input.state.toLowerCase()||x.abbr===input.state.toUpperCase());if(!s)throw Error('State not found.');openState(s.abbr);return{state:s.state,parts:s.parts,labor:s.labor,time:s.time,source:s.url};}
    }];
    tools.forEach(tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}});
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();

