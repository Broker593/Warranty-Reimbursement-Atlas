/* Warranty Atlas front end: States (home) and state overview pages, Summary dashboard
   (answer counts, definitions and states for every column), News, Downloads and Update log (weekly checks).
   Data: docs/data/*.json plus window.REFERENCE (data.js) and window.LABOR_COVERAGE (coverage.js).
   The original matrix UI (app.js) was retired on September 25, 2026; it remains in git history. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const safeUrl = u => /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim().split(/\s+/)[0] : '';
  const link = (u, label) => { const s = safeUrl(u); return s ? '<a href="' + esc(s) + '" target="_blank" rel="noopener noreferrer">' + esc(label || 'Source') + ' ↗</a>' : ''; };
  const fmtDate = d => { if (!d) return ''; const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d); if (!m) return esc(d); const dt = new Date(+m[1], +m[2] - 1, +m[3]); return dt.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}); };
  const trim = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; };
  const TODAY = (() => { try { return new Date().toLocaleDateString('en-CA', {timeZone: 'America/New_York'}); } catch (e) { return new Date().toISOString().slice(0, 10); } })();

  const TABS = [['states', 'States'], ['summary', 'Summary'], ['news', 'News'], ['downloads', 'Downloads'], ['updates', 'Update log']];
  const QUIET = ['updates'];
  const LEGACY = {atlas: 'states', audit: 'states', calculator: 'states', weekly: 'updates', research: 'summary'};
  const EXCL = {
    MAINT: 'Routine maintenance', TIRES: 'Tires', ALIGN: 'Alignments', INSPECT: 'State inspections',
    RECON: 'New-vehicle prep / used reconditioning', ACCESS: 'Accessory installation', BODY: 'Collision / body / glass',
    GOODWILL: 'Goodwill / policy', DISCOUNT: 'Discounted / promotional / menu-priced', FLEET: 'Fleet',
    GOVT: 'Government', INTERNAL: 'Internal / dealer-owned', SVC_CONTRACT: 'Service-contract / third-party paid',
    WARRANTY: 'Warranty / recall', INSURANCE: 'Insurance-paid', NO_CHARGE: 'No-charge', ENGINE_TRANS: 'Engine / transmission assembly',
    DETAIL: 'Detailing / washing', OTHER: 'Other statutory exclusion (read the text)'
  };
  const COVS = [['manufacturer_contract', 'Manufacturer-backed service contract', 'Mfr service contract'], ['cpo', 'CPO warranty', 'CPO'], ['independent_contract', 'Independent service contract', 'Independent SC']];
  const STATUS_SHORT = {yes: 'Yes', conditional: 'Conditional', no: 'Not covered', silent: 'Silent'};
  const STATUS_LONG = {
    yes: 'Yes. The state\'s warranty rate and time rules reach this coverage (research label: Required).',
    conditional: 'Conditional. Covered only if the stated condition is met, usually who issues or pays for the contract.',
    no: 'Not covered. Outside the statute by an express exclusion or a manufacturer-only limit (research label: Not reached).',
    silent: 'Silent. The statute does not address this coverage (research label: Not addressed). Contracts or other law may still apply.'
  };
  const HOURS = {factory: 'Factory (OEM) time', independent_guide: 'Dealer\'s customer-pay or independent guide', multiplier: 'OEM time × multiplier', actual_time: 'Actual technician time', negotiated_other: 'OEM time (rate adjusted)', silent: 'Not set in statute', 'n/a': '—'};
  const PROGRAM_SCOPE = 'Service-contract and CPO rules apply only to contracts the manufacturer, distributor or a qualifying affiliate actually issues or pays for. Branding such as "factory-backed" does not decide it. Check the obligor named in the contract.';

  let AUDIT = [], WEEKLY = null, NEWS = null, KEY = {states: {}}, loaded = false, loading = null;
  const byAbbr = {}, byName = {}, REF = {};

  /* ---------- helpers ---------- */
  function days(v) { return v == null ? '—' : v + ' days'; }
  function sampleShort(r) {
    const c = r.calc || {};
    const w = (c.ro_count || 100) + ' ROs or ' + (c.days || 90) + ' days';
    return ({calendar_month: 'All ROs from the prior month', none: 'No labor sample in statute', ro_only: (c.ro_count || 100) + ' sequential ROs',
      fewer: w + ', whichever is fewer', dealer_choice: w + ', dealer picks', greater_rate: w + ', whichever gives the higher rate'})[c.mode] || 'See details';
  }
  function sampleLong(r) { const c = r.calc || {}; return sampleShort(r) + (c.max_age_days ? '; ROs no older than ' + c.max_age_days + ' days' : ''); }
  function amended(r) {
    const d = r.law_dates || {};
    if (!d.last_amended_year) return 'Unknown';
    return d.last_amended_year + (d.last_amendment_effective ? ' (eff. ' + fmtDate(d.last_amendment_effective) + ')' : '');
  }
  function nextChange(r) { const n = (r.law_dates || {}).next_scheduled_change; return n && n.effective && n.effective > TODAY ? n : null; }
  function recentChange(r) { const n = (r.law_dates || {}).next_scheduled_change; return n && n.effective && n.effective <= TODAY ? n : null; }
  function kf(abbr) { return (KEY.states || {})[abbr] || {}; }
  function cov(abbr, id) { try { return window.LABOR_COVERAGE.record({abbr}, id, TODAY); } catch (e) { return null; } }
  function responseShort(r) {
    const o = kf(r.state).response; if (o) return o;
    const m = r.manufacturer_response || {}, d = m.response_deadline_days, a = m.deemed_approved_if_no_response;
    if (d != null) return d + ' days' + (a === true ? '; no response = approved' : '');
    if (a === true) return 'No deadline; deemed approved';
    return 'Not set in statute';
  }
  function hoursShort(abbr) {
    const f = cov(abbr, 'factory'); if (!f) return {label: '—', note: ''};
    let note = kf(abbr).hours || '';
    if (abbr === 'RI' && f.upcoming) note = 'Actual technician time from Oct 1, 2026';
    return {label: f.notEstablished ? 'Not established' : (HOURS[f.paidHoursId] || f.paidHours), note, id: f.paidHoursId};
  }
  function multiplierText(abbr) { return kf(abbr).multiplier || 'None in statute'; }
  function scList(abbr) { return COVS.map(([id, long, short]) => { const c = cov(abbr, id); return {id, long, short, c, status: c ? c.applicability : 'silent'}; }); }
  function scShort(abbr) {
    const on = scList(abbr).filter(x => x.status === 'yes' || x.status === 'conditional');
    if (!on.length) return '<span class="ks-muted">Factory warranty only</span>';
    return on.map(x => '<span class="ks-sc"><span class="ks-sc-name">' + esc(x.short) + ':</span> <strong>' + esc(STATUS_SHORT[x.status]) + '</strong>' + (x.c && x.c.notEstablished ? ' <span class="ks-muted">(no rate rule)</span>' : '') + '</span>').join('');
  }
  function scPlain(abbr) { return scList(abbr).map(x => x.short + ': ' + STATUS_SHORT[x.status] + (x.c && x.c.notEstablished ? ' (no rate rule)' : '')).join('; '); }
  function quoteBlock(b) {
    if (!b) return '';
    let h = b.quote ? '<blockquote class="statute-quote">' + esc(b.quote) + '</blockquote><p class="xpin">' + esc(b.pinpoint || '') + '</p>' : '';
    (b.more_quotes || []).forEach(m => { if (m && m.quote) h += '<blockquote class="statute-quote">' + esc(m.quote) + '</blockquote><p class="xpin">' + esc(m.pinpoint || '') + '</p>'; });
    return h;
  }
  function firstSentence(t, n) { const m = String(t || '').split(/(?<=[.;])\s+(?=[A-Z])/)[0]; return trim(m, n || 200); }
  function adds(full, short) { return full && full.length <= 200 && full.length > (short || '').length + 35 ? esc(full) : ''; }
  function kv(pairs) { const p = pairs.filter(x => x[1] != null && x[1] !== ''); return p.length ? '<dl class="xkv">' + p.map(x => '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>').join('') + '</dl>' : ''; }

  /* ---------- shell and routing ---------- */
  function buildShell() {
    const main = $('main') || document.querySelector('main');
    if (!main || $('xnav')) return;
    main.innerHTML = '<nav id="xnav" class="xnav" aria-label="Atlas sections">' + TABS.map(([id, label]) => '<a href="#' + id + '" data-tab="' + id + '"' + (QUIET.includes(id) ? ' class="xnav-quiet"' : '') + '>' + esc(label) + '</a>').join('') + '</nav>' +
      '<div id="xpanels">' + TABS.map(([id, label]) => '<section id="x-' + id + '" class="xpanel" hidden aria-label="' + esc(label) + '"><div class="xloading">Loading…</div></section>').join('') + '</div>';
    const about = $('aboutBtn'), dlg = $('aboutDialog');
    if (about && dlg) {
      about.textContent = 'About';
      about.addEventListener('click', () => { if (!dlg.open) dlg.showModal(); });
      dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    }
    document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => { const d = $(b.dataset.close); if (d && d.open) d.close(); }));
    window.addEventListener('hashchange', route);
  }
  function hashParam(k) { const m = new RegExp('[?&]' + k + '=([^&]+)').exec(location.hash); return m ? decodeURIComponent(m[1]) : ''; }
  function parseHash() {
    const h = (location.hash || '').replace(/^#/, '');
    const m = /^state\/([A-Za-z]{2})$/.exec(h);
    if (m) return {tab: 'states', state: m[1].toUpperCase()};
    const sm = /^summary\/([a-z]+)$/.exec(h);
    if (sm) return {tab: 'summary', state: '', section: sm[1]};
    const base = h.split(/[?&]/)[0];
    if (base === 'audit') { const s = hashParam('state').toUpperCase(); return {tab: 'states', state: s, redirect: s ? '#state/' + s : '#states'}; }
    if (LEGACY[base]) return {tab: LEGACY[base], state: '', redirect: '#' + LEGACY[base]};
    return {tab: TABS.some(t => t[0] === base) ? base : 'states', state: ''};
  }
  function route() {
    const r = parseHash();
    if (r.redirect && history.replaceState) history.replaceState(null, '', location.pathname + location.search + r.redirect);
    const tab = r.tab;
    document.querySelectorAll('#xnav a').forEach(a => a.setAttribute('aria-current', a.dataset.tab === tab ? 'page' : 'false'));
    TABS.forEach(([id]) => { const p = $('x-' + id); if (p) p.hidden = id !== tab; });
    ensureData().then(() => render(tab, r.state, r.section)).catch(() => {});
  }
  function ensureData() {
    if (loaded) return Promise.resolve();
    if (loading) return loading;
    const get = p => fetch(p + '?v=' + Date.now().toString(36).slice(0, 6)).then(r => { if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); });
    loading = Promise.all([get('data/audit-fields.json'), get('data/weekly-checks.json'), get('data/news.json'), get('data/key-facts.json')]).then(([a, w, n, k]) => {
      AUDIT = a.slice().sort((x, y) => x.name.localeCompare(y.name)); WEEKLY = w; NEWS = n; KEY = k || {states: {}}; loaded = true;
      AUDIT.forEach(r => { byAbbr[r.state] = r; byName[r.name.toLowerCase()] = r; });
      ((window.REFERENCE || {}).states || []).forEach(s => { REF[s.abbr] = s; });
    }).catch(err => {
      loading = null;
      TABS.forEach(([id]) => { const p = $('x-' + id); if (p) p.innerHTML = '<p class="xerror">Could not load research data (' + esc(err.message) + '). Reload the page to try again.</p>'; });
      throw err;
    });
    return loading;
  }
  const rendered = {};
  function render(tab, state, section) {
    if (tab === 'states') return state && byAbbr[state] ? renderState(state) : renderHome();
    document.title = (TABS.find(t => t[0] === tab) || ['', ''])[1] + ' · Warranty Atlas';
    if (!rendered[tab]) { rendered[tab] = true; ({updates: renderWeekly, news: renderNews, downloads: renderDownloads, summary: renderSummary})[tab](); }
    if (tab === 'summary') scrollToSection(section);
  }

  /* ---------- States: home table ---------- */
  let homeBuilt = false, stateOpen = false, homeScroll = 0;
  function renderHome() {
    buildHome();
    document.title = 'Warranty Atlas · State warranty reimbursement rules';
    $('ks-home').hidden = false; $('ks-state').hidden = true;
    if (stateOpen) { stateOpen = false; window.scrollTo(0, homeScroll); }
  }
  function buildHome() {
    const p = $('x-states');
    if (!homeBuilt) {
      homeBuilt = true;
      p.innerHTML = '<div id="ks-home"><div class="xhead"><div><h1 class="ks-h1">Warranty reimbursement rules by state</h1><p>How each state sets the warranty labor rate, how often dealers can ask for an increase, which labor-time guide applies, parts markup, and whether service contracts and CPO are covered. <strong>Click a state</strong> for its key facts and the statute text behind them.</p></div><div class="xstamp">Last verified <strong>' + fmtDate(maxVerified()) + '</strong><br>Checked for law changes every Monday</div></div>' +
        '<div class="xtools"><label class="search"><span aria-hidden="true">⌕</span><input id="ksSearch" type="search" placeholder="Search a state…" aria-label="Search states"></label>' +
        '<label>Show<select id="ksFilter"><option value="">All 50 states</option><option value="sc">Service contracts or CPO covered</option><option value="guide">Uses a non-OEM guide, multiplier or actual time</option><option value="request">Has a rate-request frequency rule</option><option value="change">Law change coming up</option></select></label>' +
        '<button type="button" class="quiet ks-csv" id="ksCsv">Download table (CSV) ↓</button></div>' +
        '<p class="xcount" id="ksCount" aria-live="polite"></p>' +
        '<p class="ks-defs"><strong>What the answers mean:</strong> ' + [['labor', 'Labor rate'], ['requests', 'Rate increase requests'], ['response', 'Manufacturer response'], ['hours', 'Paid hours'], ['parts', 'Parts markup'], ['mfrsc', 'Service contracts & CPO']].map(x => '<a href="#summary/' + x[0] + '">' + x[1] + '</a>').join(' · ') + ' · <a href="#summary">All counts</a></p>' +
        '<div class="table-scroll xtable-scroll ks-scroll" tabindex="0" role="region" aria-label="State rules table"><table class="xtable ks-table"><thead><tr>' +
        ['State', 'Labor rate', 'Rate increase requests', 'Manufacturer response', 'Paid hours (labor-time guide)', 'Parts markup', 'Service contracts & CPO'].map(h => '<th scope="col">' + h + '</th>').join('') +
        '</tr></thead><tbody id="ksBody"></tbody></table></div>' +
        '<p class="xfoot"><strong>Service contracts &amp; CPO:</strong> Yes = the state\'s warranty rate and time rules apply; Conditional = only if the stated condition is met (usually who issues or pays). "Factory warranty only" means the statute is silent on or does not cover those contracts. Summaries are short on purpose; the state page has the statute quotes and conditions.</p></div>' +
        '<div id="ks-state" hidden></div>';
      ['ksSearch', 'ksFilter'].forEach(id => $(id).addEventListener('input', drawHome));
      $('ksCsv').addEventListener('click', () => homeCsv(homeRows()));
      $('ksBody').addEventListener('click', e => { if (e.target.closest('a')) return; const tr = e.target.closest('tr[data-state]'); if (tr) location.hash = '#state/' + tr.dataset.state; });
      drawHome();
    }
  }
  function maxVerified() { return AUDIT.reduce((m, r) => { const v = (r.verified || {}).last_change_check || (r.verified || {}).audit_fields || ''; return v > m ? v : m; }, ''); }
  function homeRows() {
    const q = ($('ksSearch').value || '').trim().toLowerCase(), f = $('ksFilter').value;
    return AUDIT.filter(r => {
      if (q && !(r.name.toLowerCase().includes(q) || r.state.toLowerCase() === q)) return false;
      if (f === 'sc' && !scList(r.state).some(x => x.status === 'yes' || x.status === 'conditional')) return false;
      if (f === 'guide' && !['independent_guide', 'multiplier', 'actual_time', 'negotiated_other'].includes(hoursShort(r.state).id)) return false;
      if (f === 'request' && !r.rate_submission.frequency_limit) return false;
      if (f === 'change' && !nextChange(r)) return false;
      return true;
    });
  }
  function drawHome() {
    const rows = homeRows();
    $('ksCount').textContent = rows.length === 50 ? 'All 50 states' : rows.length + ' of 50 states';
    $('ksBody').innerHTML = rows.map(r => {
      const k = kf(r.state), h = hoursShort(r.state), n = nextChange(r);
      return '<tr data-state="' + r.state + '"><th scope="row"><a class="ks-state" href="#state/' + r.state + '">' + esc(r.name) + ' <span class="abbr">' + r.state + '</span></a>' +
        (n ? '<span class="ks-change">Change ' + fmtDate(n.effective) + '</span>' : '') + '</th>' +
        '<td>' + esc(k.labor || '—') + '</td>' +
        '<td>' + esc(k.requests || '—') + '<small>' + esc(sampleShort(r)) + '</small></td>' +
        '<td>' + esc(responseShort(r)) + '</td>' +
        '<td>' + esc(h.label) + (h.note ? '<small>' + esc(h.note) + '</small>' : '') + '</td>' +
        '<td>' + esc(k.parts || '—') + '</td>' +
        '<td>' + scShort(r.state) + '</td></tr>';
    }).join('') || '<tr><td colspan="7" class="xempty">No states match. Clear the search or filter.</td></tr>';
  }
  function csvCell(v) { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function download(name, text) { const b = new Blob(['﻿' + text], {type: 'text/csv'}); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function homeCsv(rows) {
    const H = ['State', 'Name', 'Labor rate', 'Rate increase requests', 'Rate sample', 'Manufacturer response', 'Paid hours', 'Paid hours note', 'Labor-time multiplier', 'Parts markup', 'Mfr service contract', 'CPO', 'Independent service contract', 'Claim decision days', 'Late claims deemed approved', 'Claim payment days', 'Chargeback lookback months', 'Law last amended', 'Next scheduled change', 'Last verified', 'Primary cite', 'Official URL'];
    const L = [H.join(',')];
    rows.forEach(r => {
      const k = kf(r.state), h = hoursShort(r.state), sc = scList(r.state), n = nextChange(r), c = r.claims;
      L.push([r.state, r.name, k.labor, k.requests, sampleLong(r), responseShort(r), h.label, h.note, multiplierText(r.state), k.parts,
        ...sc.map(x => STATUS_SHORT[x.status] + (x.c && x.c.notEstablished ? ' (no rate rule)' : '')),
        c.decision_deadline_days, c.deemed_approved_if_late === true ? 'Yes' : 'No rule', c.payment_deadline_days, r.chargebacks.lookback_months,
        amended(r), n ? n.effective + ' ' + (n.act || '') : '', (r.verified || {}).audit_fields, (r.cites || [])[0], r.official_url].map(csvCell).join(','));
    });
    download('warranty-atlas-states-' + TODAY + '.csv', L.join('\r\n'));
  }

  /* ---------- States: overview page ---------- */
  function fact(label, answer, sub, details, id) {
    return '<div class="kf-row"' + (id ? ' id="kf-' + id + '"' : '') + '><div class="kf-label">' + esc(label) + '</div><div class="kf-body"><div class="kf-answer">' + answer + '</div>' +
      (sub ? '<div class="kf-sub">' + sub + '</div>' : '') +
      (details ? '<details class="kf-more"><summary>Full details</summary><div class="kf-detail">' + details + '</div></details>' : '') + '</div></div>';
  }
  function renderState(abbr) {
    buildHome();
    if (!stateOpen && !$('x-states').hidden && !$('ks-home').hidden) homeScroll = window.scrollY;
    stateOpen = true;
    const r = byAbbr[abbr], s = REF[abbr] || {}, k = kf(abbr), f = cov(abbr, 'factory') || {};
    const c = r.claims, cb = r.chargebacks, rs = r.rate_submission, mr = r.manufacturer_response, pe = r.penalties, ld = r.law_dates || {};
    const n = nextChange(r), rc = recentChange(r), h = hoursShort(abbr), sc = scList(abbr);
    const i = AUDIT.indexOf(r), prev = AUDIT[i - 1], next = AUDIT[i + 1];
    document.title = r.name + ' · Warranty Atlas';

    const laborDetail = kv([['Rule', s.labor], ['How the rate is set (v3 research)', f.stateHourlyRate !== s.labor ? f.stateHourlyRate : ''], ['Formula', rs.formula]]) + quoteBlock(rs);
    const reqDetail = kv([['Frequency', rs.frequency_limit || 'No frequency limit stated'], ['Sample', sampleLong(r)], ['Sample detail', (rs.sample || {}).other], ['Who selects the ROs', rs.who_selects],
      ['Excluded from the sample', (rs.exclusions || []).map(x => EXCL[x] || x).join('; ')], ['Statute wording on exclusions', rs.exclusions_text], ['New rate takes effect', rs.new_rate_effective], ['Note', (r.calc || {}).note]]);
    const mrDetail = kv([['Response deadline', days(mr.response_deadline_days)], ['If no response', mr.deemed_approved_if_no_response === true ? 'Rate deemed approved' : 'No deemed-approval rule in statute'], ['Challenge standard', mr.challenge_standard], ['How to challenge', mr.challenge_method], ['Disputes go to', mr.dispute_forum]]) + quoteBlock(mr);
    const hoursDetail = kv([['Classification', f.paidHours], ['What it means', f.hoursNote], ['Rule (original research)', s.time], ['Date note', f.dateNote]]) + (f.quote ? '<p class="xpin"><strong>Scope quote (factory warranty):</strong></p>' + quoteBlock({quote: f.quote, pinpoint: f.pinpoint}) : '');
    const multDetail = abbr === 'IL' || abbr === 'NJ' || abbr === 'WI' ? kv([['Rule', multiplierText(abbr)], ['Paid-hours note', f.hoursNote]]) : '<p>No labor-time multiplier was found in the reviewed statute. Paid hours follow the rule above.</p>';
    const partsDetail = kv([['Rule', s.parts], ['Rate sample (parts and labor)', s.sample], ['Statute', s.statute], ['Note', s.note], ['Also', s.additional], ['Source of this summary', s.basis], ['Source date', s.sourceDate]]) +
      '<p class="xpin">' + [link(s.url, 'Summary source'), link((s.original || {}).url, 'Original text')].filter(Boolean).join(' · ') + '</p>';
    const scDetail = '<p class="xnote">' + esc(PROGRAM_SCOPE) + '</p>' + sc.map(x => {
      const cc = x.c || {};
      return '<div class="kf-cov"><h4>' + esc(x.long) + ': ' + esc(STATUS_SHORT[x.status]) + '</h4><p>' + esc(cc.applicabilityNote || STATUS_LONG[x.status]) + '</p>' +
        kv([['Hourly rate', (x.status === 'yes' || x.status === 'conditional') ? (cc.notEstablished ? cc.hourlyRate : 'Same method as factory warranty') : ''], ['Paid hours', (x.status === 'yes' || x.status === 'conditional') ? (cc.paidHours + (cc.hoursNote ? ' — ' + cc.hoursNote : '')) : ''], ['Date note', cc.dateNote]]) +
        quoteBlock({quote: cc.quote, pinpoint: cc.pinpoint}) + '</div>';
    }).join('');
    const scAnswer = sc.map(x => '<span class="kf-sc"><span>' + esc(x.long) + '</span> <strong>' + esc(STATUS_SHORT[x.status]) + '</strong>' + (x.c && x.c.notEstablished ? ' <span class="ks-muted">(claim timing only; no rate rule)</span>' : '') + '</span>').join('');

    const claimsDetail = kv([['Dealer filing deadline', c.dealer_filing_deadline || 'Not set in statute'], ['Payment', c.payment_deadline_days != null ? days(c.payment_deadline_days) + (c.payment_deadline_trigger ? ' ' + c.payment_deadline_trigger : '') : 'Not set in statute'], ['Resubmission', c.resubmission_rights], ['Denial requirements', c.denial_requirements]]) + quoteBlock(c);
    const cbDetail = kv([['Lookback window', cb.lookback_months != null ? cb.lookback_months + ' months' : 'Not set in statute'], ['Fraud', cb.fraud_extension], ['Limits', cb.limits]]) + quoteBlock(cb);
    const penDetail = kv([['Private remedies', pe.private_remedies], ['Administrative sanctions', pe.admin_sanctions], ['Citations', pe.cite]]);

    const html = '<nav class="ks-crumbs" aria-label="State navigation"><a href="#states" class="ks-back">← All states</a><label class="ks-jump">Go to state <select id="ksJump">' + AUDIT.map(x => '<option value="' + x.state + '"' + (x.state === abbr ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') + '</select></label></nav>' +
      '<header class="ks-head"><div><span class="eyebrow">STATE OVERVIEW</span><h1 class="ks-h1">' + esc(r.name) + ' <span class="abbr">' + abbr + '</span></h1>' +
      '<p class="ks-cites">' + esc((r.cites || []).join(' · ')) + '</p>' +
      '<p class="ks-dates"><span>Law last amended <strong>' + esc(amended(r)) + '</strong></span><span>Last verified <strong>' + fmtDate((r.verified || {}).audit_fields) + '</strong></span>' + ((r.verified || {}).last_change_check ? '<span>Checked for law changes <strong>' + fmtDate(r.verified.last_change_check) + '</strong></span>' : '') + '</p></div>' +
      '<div class="ks-actions"><a class="xbtn-open" href="downloads/state-pdfs/' + abbr + '.pdf" target="_blank" rel="noopener">One-page PDF ↗</a>' + (safeUrl(r.official_url) ? '<a class="xbtn-save" href="' + esc(safeUrl(r.official_url)) + '" target="_blank" rel="noopener noreferrer">Official statute ↗</a>' : '') + '</div></header>' +
      (n ? '<p class="xnextbox"><strong>Law change coming · effective ' + fmtDate(n.effective) + ':</strong> ' + esc(n.act || '') + (n.summary ? ' — ' + esc(n.summary) : '') + '</p>' : '') +
      (rc ? '<p class="xnote"><strong>Recent change · effective ' + fmtDate(rc.effective) + ':</strong> ' + esc(rc.act || '') + (rc.summary ? ' — ' + esc(rc.summary) : '') + '</p>' : '') +
      '<div class="ks-sectionhead"><h2>Key facts</h2><button type="button" class="quiet ks-expand" id="ksExpand" aria-pressed="false">Expand all details</button></div>' +
      '<div class="kf">' +
      fact('Labor rate', esc(k.labor || '—'), adds(s.labor, k.labor), laborDetail, 'labor') +
      fact('Rate increase requests', esc(k.requests || '—'), esc(sampleLong(r)) + (rs.new_rate_effective ? '<br>New rate takes effect: ' + esc(trim(rs.new_rate_effective, 160)) : ''), reqDetail, 'requests') +
      fact('Manufacturer response', esc(responseShort(r)), mr.challenge_standard ? esc(trim(mr.challenge_standard, 200)) : '', mrDetail, 'response') +
      fact('Paid hours (labor-time guide)', esc(h.label), esc(h.note || (f.hoursNote && f.hoursNote.length <= 200 ? f.hoursNote : '')), hoursDetail, 'hours') +
      fact('Labor-time multiplier', esc(multiplierText(abbr)), '', multDetail, 'multiplier') +
      fact('Parts markup', esc(k.parts || '—'), adds(s.parts, k.parts), partsDetail, 'parts') +
      fact('Service contracts & CPO', scAnswer, '', scDetail, 'sc') +
      '</div>' +
      '<div class="ks-sectionhead"><h2>Claims, audits and penalties</h2></div><div class="kf">' +
      fact('Claim decision', esc(days(c.decision_deadline_days)) + (c.deemed_approved_if_late === true ? '; late = deemed approved' : ''), c.payment_deadline_days != null ? 'Payment ' + esc(days(c.payment_deadline_days) + (c.payment_deadline_trigger ? ' ' + c.payment_deadline_trigger : '')) : '', claimsDetail, 'claims') +
      fact('Audits and chargebacks', cb.lookback_months != null ? esc(cb.lookback_months + '-month lookback') : 'No lookback limit in statute', cb.fraud_extension ? esc(trim(cb.fraud_extension, 180)) : '', cbDetail, 'chargebacks') +
      fact('Penalties and remedies', '<span class="kf-plain">' + esc(firstSentence(pe.private_remedies) || 'See details') + '</span>', pe.admin_sanctions ? '<strong>Licensing / administrative:</strong> ' + esc(firstSentence(pe.admin_sanctions, 180)) : '', penDetail, 'penalties') +
      '</div>' +
      '<details class="ks-sources"><summary>Sources, confidence and research notes</summary><div class="kf-detail">' +
      kv([['Citations', (r.cites || []).join(' · ')], ['Source quality', r.source_quality], ['Confidence', r.confidence], ['Coverage research cite', f.primaryCite], ['Definitions', f.definitionCite], ['Effective-date notes', f.effectiveNotes], ['Audit-field notes', r.notes], ['Coverage research notes', f.notes], ['Law history source', ld.history_source], ['Last amending act', ld.last_amending_act]]) +
      '<p class="xpin">' + [link(r.official_url, 'Official text')].concat((f.urls || []).filter(u => u !== safeUrl(r.official_url)).slice(0, 4).map(u => link(u, 'Coverage source'))).filter(Boolean).join(' · ') + '</p></div></details>' +
      '<nav class="ks-pager" aria-label="Previous and next state">' + (prev ? '<a href="#state/' + prev.state + '">← ' + esc(prev.name) + '</a>' : '<span></span>') + '<a href="#states">All states</a>' + (next ? '<a href="#state/' + next.state + '">' + esc(next.name) + ' →</a>' : '<span></span>') + '</nav>' +
      '<p class="xfoot">Internal use only. Research summary, not legal advice. Verify against the cited statute before acting, and take disputes to Legal.</p>';

    const box = $('ks-state');
    box.innerHTML = html; box.hidden = false; $('ks-home').hidden = true;
    $('ksJump').addEventListener('change', e => { location.hash = '#state/' + e.target.value; });
    $('ksExpand').addEventListener('click', e => {
      const open = e.currentTarget.getAttribute('aria-pressed') !== 'true';
      box.querySelectorAll('details').forEach(d => { d.open = open; });
      e.currentTarget.setAttribute('aria-pressed', String(open)); e.currentTarget.textContent = open ? 'Collapse all details' : 'Expand all details';
    });
    window.scrollTo(0, 0);
  }

  /* ---------- Weekly checks ---------- */
  const CAT = {enacted_upcoming: 'Enacted · takes effect soon', enacted_recent: 'Took effect recently', pending: 'Pending bill', dead_or_stalled: 'Dead or stalled', no_change: 'No change'};
  function renderWeekly() {
    const E = (WEEKLY.entries || []).slice().sort((a, b) => a.check_date < b.check_date ? 1 : -1);
    $('x-updates').innerHTML = '<div class="xhead"><div><h2>Update log</h2><p>Every Monday at 7 AM ET, Claude checks all 50 legislatures for enacted, effective and pending changes to warranty-reimbursement law, updates the Atlas when enacted law changes, and logs the result here with any site changes. Pending bills are tracked but never loaded as law.</p></div><div class="xstamp">Last check <strong>' + fmtDate(E[0] && E[0].check_date) + '</strong><br>' + E.length + ' check' + (E.length === 1 ? '' : 's') + ' logged</div></div>' +
      E.map(e => '<article class="xweek"><header><time datetime="' + esc(e.check_date) + '">' + fmtDate(e.check_date) + '</time><span class="xbadge ' + (e.type === 'baseline' ? 'alt' : '') + '">' + esc((e.type || 'weekly').toUpperCase()) + '</span></header><h3>' + esc(e.headline) + '</h3><p>' + esc(e.summary) + '</p>' +
        (e.items && e.items.length ? '<ul class="xitems">' + e.items.map(it => '<li><div class="xitem-top"><span class="xbadge ' + (it.category === 'pending' ? 'muted' : it.category === 'enacted_upcoming' ? '' : 'alt') + '">' + esc(CAT[it.category] || it.category) + '</span><strong>' + esc(it.state) + ' · ' + esc(it.bill) + '</strong>' + (it.effective ? '<span class="xpin">Effective ' + fmtDate(it.effective) + '</span>' : '') + (byAbbr[it.state] ? '<a class="xpin" href="#state/' + esc(it.state) + '">State overview →</a>' : '') + '</div><p>' + esc(it.summary_short || it.summary) + '</p>' + (it.atlas_impact ? '<p class="xnote"><strong>Atlas impact:</strong> ' + esc(it.atlas_impact) + '</p>' : '') + '<p class="xpin">' + esc(it.status || '') + ' ' + link(it.source_url, 'Official source') + '</p>' + (it.summary && it.summary !== it.summary_short ? '<details><summary>Full summary</summary><p>' + esc(it.summary) + '</p></details>' : '') + '</li>').join('') + '</ul>' : '<p class="xnote">No enacted, effective or pending changes found this week.</p>') +
        (e.site_changes && e.site_changes.length ? '<details open><summary>Site updates this week</summary><ul>' + e.site_changes.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>' : '') +
        (e.gaps && e.gaps.length ? '<details><summary>Gaps and limits</summary><ul>' + e.gaps.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>' : '') +
        (e.method ? '<details><summary>How this check was run</summary><p>' + esc(e.method) + '</p></details>' : '') + '</article>').join('');
  }

  /* ---------- News ---------- */
  function renderNews() {
    const W = (NEWS.weeks || []).slice().sort((a, b) => a.week_of < b.week_of ? 1 : -1);
    $('x-news').innerHTML = '<div class="xhead"><div><h2>News · 3–5 items a week</h2><p>Only items directly about state warranty-reimbursement law: retail-rate and labor-time laws, service-contract and CPO reimbursement, claims and chargebacks, and board or court rulings. Each item is labeled by source type and perspective. Much of this coverage comes from dealer-side law firms and retail-rate vendors.</p></div></div>' +
      W.map(w => '<section class="xnewsweek"><h3>Week of ' + fmtDate(w.week_of) + '</h3>' + (w.items || []).map(n => '<article class="xnews"><div class="xitem-top"><time>' + fmtDate(n.date) + '</time><span class="xbadge muted">' + esc(n.source_type || '') + '</span><span class="xbadge ' + (n.perspective === 'dealer-side' ? 'alt' : n.perspective === 'manufacturer-side' ? '' : 'muted') + '">' + esc((n.perspective || 'neutral').toUpperCase()) + '</span>' + (n.states || []).map(x => byAbbr[x] ? '<a class="xchip" href="#state/' + esc(x) + '">' + esc(x) + '</a>' : '<span class="xchip">' + esc(x) + '</span>').join('') + '</div><h4>' + (safeUrl(n.url) ? '<a href="' + esc(safeUrl(n.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(n.title) + ' ↗</a>' : esc(n.title)) + '</h4><p class="xpin">' + esc(n.publisher) + '</p><p>' + esc(n.topic) + '</p><p class="xnote"><strong>Why it matters:</strong> ' + esc(n.why_it_matters) + '</p></article>').join('') + (w.items && w.items.length ? '' : '<p class="xnote">Nothing met the bar this week.</p>') + '</section>').join('');
  }

  /* ---------- Downloads ---------- */
  function renderDownloads() {
    const abs = p => new URL(p, location.href).href;
    const openA = (href, label) => '<a class="xbtn-open" href="' + href + '" target="_blank" rel="noopener">' + label + ' ↗</a>';
    const saveA = (href, label) => '<a class="xbtn-save" href="' + href + '" download>' + (label || 'Save a copy') + ' ↓</a>';
    const card = (title, desc, btns) => '<div class="xdl-card"><strong>' + title + '</strong><span>' + desc + '</span><div class="xdl-btns">' + btns + '</div></div>';
    const office = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(abs('downloads/warranty-atlas.xlsx'));
    $('x-downloads').innerHTML = '<div class="xhead"><div><h2>Downloads for workpapers</h2><p><strong>Open</strong> views the file in a new browser tab, where you can read, print or save it. <strong>Save a copy</strong> sends it straight to your Downloads folder. Files are rebuilt with every weekly check and show the date they were built.</p></div></div>' +
      '<div class="xdl">' +
      card('Excel workbook', 'Summary, coverage (200 cells), audit fields, rate-sample rules, law dates, statute quotes, weekly log and news.', openA(office, 'Open in browser') + saveA('downloads/warranty-atlas.xlsx', 'Save .xlsx')) +
      card('All states · PDF', '50 one-page state summaries in one file.', openA('downloads/warranty-atlas-all-states.pdf', 'Open') + saveA('downloads/warranty-atlas-all-states.pdf')) +
      card('State PDFs · ZIP', '50 separate one-page PDFs in one ZIP file.', saveA('downloads/state-pdfs.zip', 'Save .zip')) +
      card('States table · CSV', 'The States table: key facts plus claim, chargeback and law-date fields for all 50 states.', '<button type="button" class="xbtn-save" id="dlCsv">Save .csv ↓</button>') +
      card('Audit fields · JSON', 'Full research records with quotes.', openA('data/audit-fields.json', 'Open') + saveA('data/audit-fields.json')) +
      card('Coverage · JSON', '200 coverage records (v3).', openA('research/labor-by-coverage-v3.json', 'Open') + saveA('research/labor-by-coverage-v3.json')) +
      '</div><p class="xfoot">The Excel "Open in browser" button uses Microsoft\'s free online viewer. The workbook is public research data; no SOA data is included.</p>' +
      '<h3 class="xsub">One-page PDF by state</h3><p class="xfoot">Click a state to open its PDF in a new tab. Use the viewer\'s download or print button to keep a copy.</p><div class="xstates">' + AUDIT.map(r => '<a href="downloads/state-pdfs/' + r.state + '.pdf" target="_blank" rel="noopener" title="Open ' + esc(r.name) + ' PDF">' + r.state + '</a>').join('') + '</div>';
    $('dlCsv').addEventListener('click', () => homeCsv(AUDIT));
  }

  /* ---------- Summary dashboard: answer counts, definitions and states for every column ---------- */
  function chips(list, tip) { return list.length ? list.map(r => '<a class="xs-chip" href="#state/' + r.state + '" title="' + esc(r.name + (tip && tip(r) ? ' — ' + tip(r) : '')) + '">' + r.state + '</a>').join('') : '<span class="ks-muted">None</span>'; }
  function freqGroup(l) {
    l = l || '';
    if (/procedure|^No labor-rate request process|^No request frequency/.test(l)) return 'none';
    if (/9 months/.test(l)) return 'other';
    if (/^1 |^Not within 12 months/.test(l)) return 'once';
    if (/^2 |semiannual/i.test(l)) return 'twice';
    if (/^No frequency limit/.test(l)) return 'nolimit';
    return 'other';
  }
  const daysKey = v => v == null ? 'none' : String(v);
  const daysGroups = (vals, def, noneDef) => vals.map(v => [String(v), v + ' days', def.replace('{n}', v)]).concat([['none', 'Not set in statute', noneDef]]);
  /* Each dimension: [key, label, plain-English definition] groups + how to classify a state. Tiles and detail lists both render from this. */
  function dims() {
    const riUp = (cov('RI', 'factory') || {}).upcoming;
    const scGroups = [
      ['yes', 'Yes', 'The state\'s warranty rate and time rules apply to this coverage.'],
      ['conditional', 'Conditional', 'The rules apply only if a condition is met, usually that the manufacturer or its affiliate issues or pays for the contract.'],
      ['no', 'Not covered', 'Outside the statute\'s reach: expressly excluded, or the rules cover only work the manufacturer itself issues or pays for.'],
      ['silent', 'Silent', 'The statute doesn\'t address this coverage. Contracts or other law may still apply.']
    ];
    return [
      {sec: 'Labor rate and rate increase requests', id: 'labor', title: 'Labor rate', q: 'How is the warranty hourly labor rate set?', key: r => kf(r.state).labor_type, tip: r => kf(r.state).labor, groups: [
        ['retail', 'Dealer\'s retail rate', 'Warranty labor is paid at the dealer\'s own retail (customer-pay) rate, usually calculated from a sample of customer-pay repair orders. In some states the dealer must request or elect it.'],
        ['floor', 'At least the retail rate', 'The dealer\'s retail rate is a minimum; warranty labor can\'t be paid below it. Tennessee also caps it at the posted rate.'],
        ['posted', 'Posted retail rate', 'Warranty labor is paid at the retail rate the dealer posts where service customers can see it. If it isn\'t posted, the rule doesn\'t apply.'],
        ['reasonable', 'Reasonable pay, retail is a factor', 'The statute requires reasonable compensation. The dealer\'s retail rate (in Nebraska, local market rates) is a key factor, not an automatic entitlement.'],
        ['other', 'Other method', 'Florida: agreed rate first, then a statutory method. Texas and Wisconsin: statutory formulas. Wyoming: a submission process, with retail as a ceiling.']]},
      {id: 'requests', title: 'Rate increase requests: how often', q: 'How often can a dealer ask for a new labor rate?', key: r => freqGroup(kf(r.state).requests), tip: r => kf(r.state).requests, groups: [
        ['once', 'Once a year', 'One request per 12 months or per calendar year. Some states count labor and parts separately.'],
        ['twice', 'Twice a year', 'Up to two requests per calendar year (Florida: not more than semiannually).'],
        ['other', 'Other interval', 'Delaware: once every 9 months.'],
        ['nolimit', 'No limit stated', 'A request process exists, but the statute doesn\'t limit how often.'],
        ['none', 'No labor-rate request process', 'The statute has no labor-rate request process. Some have one for parts markup only.']]},
      {id: 'sample', title: 'Rate increase requests: repair-order sample', q: 'Which customer-pay repair orders (ROs) set the retail rate?', key: r => sampleShort(r), tip: r => sampleLong(r), groups: [
        ['100 ROs or 90 days, whichever is fewer', '100 ROs or 90 days (fewer)', 'The dealer submits 100 consecutive qualifying customer-pay ROs or all qualifying ROs from 90 consecutive days, whichever is fewer. Most states also cap how old the ROs can be.'],
        ['100 ROs or 60 days, whichever is fewer', '100 ROs or 60 days (fewer)', 'Same method with a 60-day window.'],
        ['100 ROs or 90 days, dealer picks', '100 ROs or 90 days (dealer picks)', 'The dealer chooses which of the two samples to submit.'],
        ['100 ROs or 90 days, whichever gives the higher rate', 'Higher of two samples', 'Texas: both samples are calculated and the higher rate is used.'],
        ['All ROs from the prior month', 'Prior month\'s ROs', 'All qualifying customer-pay ROs from the month before the request.'],
        ['100 sequential ROs', '100 ROs only', 'Illinois: 100 consecutive qualifying ROs, with no day window.'],
        ['No labor sample in statute', 'No sample in statute', 'The statute doesn\'t say how to calculate the labor rate from ROs.']]},
      {id: 'response', title: 'Manufacturer response deadline', q: 'How long does the manufacturer have to respond to a rate request?', key: r => daysKey(r.manufacturer_response.response_deadline_days), tip: r => responseShort(r), groups: daysGroups([30, 45, 60], 'The manufacturer has {n} days after the dealer\'s submission to approve, contest or ask for more information.', 'The statute sets no response deadline. Some of these states have no request process at all.')},
      {id: 'silence', title: 'If the manufacturer doesn\'t respond', q: 'What happens if the manufacturer misses the deadline?', key: r => String(r.manufacturer_response.deemed_approved_if_no_response), tip: r => responseShort(r), groups: [
        ['true', 'Rate takes effect', 'The dealer\'s rate is treated as approved or takes effect automatically. For Michigan this is an inference from the statute\'s wording.'],
        ['false', 'Not automatic', 'Texas: the manufacturer must give a written decision; silence does not approve the rate.'],
        ['null', 'Not stated', 'The statute doesn\'t say what happens if the manufacturer doesn\'t respond.']]},
      {sec: 'Paid hours', id: 'hours', title: 'Paid hours (labor-time guide)', q: 'Which labor-time standard sets the hours paid?', key: r => hoursShort(r.state).id, tip: r => hoursShort(r.state).note, groups: [
        ['factory', HOURS.factory, 'The manufacturer\'s own time allowances (OEM labor-time guide). Most states require them to be reasonable and adequate.'],
        ['independent_guide', HOURS.independent_guide, 'The dealer\'s customer-pay guide or an independent (third-party) guide is used instead of, or as a floor over, OEM time.'],
        ['multiplier', HOURS.multiplier, 'OEM time multiplied by a factor. See Labor-time multiplier.'],
        ['actual_time', HOURS.actual_time, 'The technician\'s documented actual time.' + (riUp ? ' Rhode Island moves here on Oct 1, 2026.' : '')],
        ['negotiated_other', HOURS.negotiated_other, 'Wisconsin: OEM hours are paid, and the retail time difference is built into the hourly rate.'],
        ['silent', HOURS.silent, 'The statute sets no general standard for how many hours are paid.']]},
      {id: 'multiplier', title: 'Labor-time multiplier', q: 'Does the statute multiply OEM time?', key: r => { const m = kf(r.state).multiplier || ''; return /^Yes/.test(m) ? 'yes' : /^No separate/.test(m) ? 'rate' : 'none'; }, groups: [
        ['yes', 'Yes', 'Illinois: 1.5 × OEM time only when no guide is agreed or the guide omits the repair. New Jersey: dealer may elect a customer-billed ÷ OEM hours ratio.'],
        ['rate', 'Built into the rate', 'Wisconsin: no separate multiplier; the time difference is in the hourly rate. Don\'t apply it twice.'],
        ['none', 'None in statute', 'No labor-time multiplier in the reviewed statute.']]},
      {sec: 'Parts', id: 'parts', title: 'Parts markup', q: 'How is the warranty parts price set?', key: r => kf(r.state).parts_type, tip: r => kf(r.state).parts, groups: [
        ['retail', 'Dealer\'s retail markup', 'Parts are paid at dealer cost plus the dealer\'s own retail markup, usually the average markup on customer-pay parts in a sample of ROs. In some states the dealer must request or elect it.'],
        ['floor', 'At least retail', 'The dealer\'s retail parts price or markup is a minimum; the statute sets no specific calculation.'],
        ['agreed', 'Agreed markup first', 'An agreed markup controls. Without one, the dealer\'s retail markup or a statutory method applies.'],
        ['reasonable', 'Reasonable, retail is a benchmark', 'The statute requires reasonable compensation, with the dealer\'s retail markup as a benchmark or primary factor.']]},
      {sec: 'Service contracts and CPO', id: 'mfrsc', title: 'Manufacturer-backed service contract', q: 'Do the rate and time rules reach manufacturer-backed service contracts?', key: r => (cov(r.state, 'manufacturer_contract') || {}).applicability, groups: scGroups},
      {id: 'cpo', title: 'CPO warranty', q: 'Do the rate and time rules reach CPO warranty repairs?', key: r => (cov(r.state, 'cpo') || {}).applicability, groups: scGroups},
      {id: 'indsc', title: 'Independent service contract', q: 'Do the rules reach third-party service contracts?', key: r => (cov(r.state, 'independent_contract') || {}).applicability, groups: scGroups},
      {sec: 'Claims and chargebacks', id: 'decision', title: 'Claim decision deadline', q: 'How long does the manufacturer have to approve or deny a claim?', key: r => daysKey(r.claims.decision_deadline_days), groups: daysGroups([30, 45, 60], 'The manufacturer must approve or deny a warranty claim within {n} days of receiving it.', 'The statute sets no decision deadline.')},
      {id: 'late', title: 'Late claim decisions', q: 'Is a claim approved if the manufacturer decides late?', key: r => r.claims.deemed_approved_if_late === true ? 'yes' : 'no', groups: [
        ['yes', 'Deemed approved', 'A claim not denied in time is treated as approved.'],
        ['no', 'No deemed-approval rule', 'The statute doesn\'t say a late claim is approved.']]},
      {id: 'payment', title: 'Claim payment deadline', q: 'How fast must an approved claim be paid?', key: r => daysKey(r.claims.payment_deadline_days), groups: daysGroups([30, 45, 60], 'Approved claims must be paid within {n} days (usually counted from approval).', 'The statute sets no payment deadline.')},
      {id: 'filing', title: 'Dealer filing deadline', q: 'Does the statute limit how long a dealer has to file a claim?', key: r => r.claims.dealer_filing_deadline ? 'yes' : 'no', groups: [
        ['yes', 'Yes', 'The statute sets a deadline for dealers to submit claims. See the state page for the period.'],
        ['no', 'Not set in statute', 'No statutory filing deadline; the manufacturer\'s policy may set one.']]},
      {id: 'chargeback', title: 'Audit and chargeback lookback', q: 'How far back can the manufacturer audit and charge back paid claims?', key: r => r.chargebacks.lookback_months == null ? 'none' : String(r.chargebacks.lookback_months), groups: [6, 9, 12].map(n => [String(n), n + ' months', 'Paid claims can be audited and charged back for ' + n + ' months. Fraud is usually excepted.']).concat([['none', 'Not set in statute', 'The statute sets no lookback limit.']])}
    ].map(d => {
      const gs = d.groups.map(([k, label, def]) => ({k, label, def, states: []}));
      AUDIT.forEach(r => { const k = d.key(r); const g = gs.find(x => x.k === k); if (g) g.states.push(r); else gs.push({k, label: String(k), def: '', states: [r]}); });
      return Object.assign(d, {gs});
    });
  }
  function renderSummary() {
    const D = dims();
    const bars = d => '<ul class="xd-bars">' + d.gs.map(g => '<li><a href="#summary/' + d.id + '" title="' + esc(g.label + ': ' + (g.states.map(s => s.state).join(', ') || 'none')) + '"><span class="xd-lab">' + esc(g.label) + '</span><span class="xd-track" aria-hidden="true"><span class="xd-fill" style="width:' + (g.states.length * 2) + '%"></span></span><span class="xd-n">' + g.states.length + '</span></a></li>').join('') + '</ul>';
    let tiles = '', lastSec = '';
    D.forEach(d => {
      if (d.sec && d.sec !== lastSec) { tiles += (lastSec ? '</div>' : '') + '<h3 class="xd-sec">' + esc(d.sec) + '</h3><div class="xd-grid">'; lastSec = d.sec; }
      tiles += '<section class="xd-tile"><h4>' + esc(d.title) + '</h4><p class="xd-q">' + esc(d.q) + '</p>' + bars(d) + '<a class="xd-more" href="#summary/' + d.id + '">What each answer means, and which states ↓</a></section>';
    });
    tiles += '</div>';
    const detail = D.map(d => '<section class="xs-card" id="xs-' + d.id + '"><h2>' + esc(d.title) + '</h2><p class="xs-note">' + esc(d.q) + (d.id === 'mfrsc' || d.id === 'cpo' ? ' ' + esc(PROGRAM_SCOPE) : '') + '</p><div class="xs-rows">' +
      d.gs.map(g => '<div class="xs-row"><div class="xs-label"><strong>' + esc(g.label) + '</strong><span class="xs-count">' + g.states.length + (g.states.length === 1 ? ' state' : ' states') + '</span></div><div><p class="xs-def">' + esc(g.def) + '</p><div class="xs-chips">' + chips(g.states, d.tip) + '</div></div></div>').join('') +
      '</div><p class="xs-top"><a href="#summary">↑ Back to the dashboard</a></p></section>').join('');
    const changes = AUDIT.filter(r => nextChange(r));
    const R = (window.REFERENCE || {}).rules || [], groups = [...new Set(R.map(x => x.group))];
    const original = groups.map(gname => '<h3 class="xs-sub">' + esc(gname) + '</h3><div class="xs-rows">' + R.filter(x => x.group === gname).map(x => { const st = AUDIT.filter(r => ((REF[r.state] || {}).flags || {})[x.id] === true); return '<div class="xs-row"><div class="xs-label"><strong>' + esc(x.name) + '</strong><span class="xs-count">' + st.length + ' states</span></div><div><p class="xs-def">' + esc(trim(x.description, 220)) + '</p><div class="xs-chips">' + chips(st) + '</div></div></div>'; }).join('') + '</div>').join('');
    $('x-summary').innerHTML = '<div class="xhead"><div><h2>Summary dashboard</h2><p>How the 50 states answer each question on the States table, based on the law in effect today (' + fmtDate(TODAY) + '). Each bar counts the states giving that answer. <strong>Click a tile</strong> for a plain-English definition of every answer and the states behind it; click a state code to open that state.</p></div><div class="xstamp">' + (changes.length ? 'Law changes coming up<br>' + changes.map(r => '<a href="#state/' + r.state + '"><strong>' + r.state + '</strong></a> ' + fmtDate(nextChange(r).effective)).join('<br>') : 'No scheduled law changes') + '</div></div>' +
      '<div class="xd">' + tiles + '</div>' +
      '<h2 class="xd-h">Definitions and states</h2>' + detail +
      '<details class="xs-more"><summary>Original September 21 classification (20 rule features)</summary><p class="xs-note">The first-pass research classification. Where it differs from the state pages or the groups above, those are newer and control.</p>' + original + '</details>';
  }
  function scrollToSection(sec) {
    const t = sec ? $('xs-' + sec) : null;
    if (t) t.scrollIntoView({block: 'start'}); else window.scrollTo(0, 0);
  }

  function init() { buildShell(); route(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
