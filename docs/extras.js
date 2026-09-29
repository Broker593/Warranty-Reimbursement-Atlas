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

  const TABS = [['map', 'Map: U.S. Audit Climate'], ['states', 'State-by-State Matrix'], ['summary', 'State Rules Dashboard'], ['cases', 'Cases & Laws'], ['news', 'News'], ['downloads', 'Downloads'], ['updates', 'Update log']];
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
  let PROC = {}, DIST = {states: []}, CASES = {items: []}, IDX = null;
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
  // Nine calendar months, inclusive; clamp month-end rather than overflowing February.
  function nineMonthsAgo(day) {
    const [y, m, d] = day.split('-').map(Number);
    const first = new Date(Date.UTC(y, m - 10, 1));
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    first.setUTCDate(Math.min(d, last));
    return first.toISOString().slice(0, 10);
  }
  function validLawDate(day) {
    return /^\d{4}-\d{2}-\d{2}$/.test(day || '') && !Number.isNaN(Date.parse(day)) && new Date(day).toISOString().slice(0, 10) === day;
  }
  function lawChanges() {
    const events = new Map();
    const add = e => { if (validLawDate(e.effective)) events.set(e.state + ':' + e.effective, e); };
    AUDIT.forEach(r => {
      const d = r.law_dates || {};
      add({state: r.state, effective: d.last_amendment_effective, act: d.last_amending_act,
        summary: 'Recorded amendment to ' + (d.section || 'the warranty reimbursement statute') + '.',
        detail: d.history_source, source: r.official_url});
      const n = d.next_scheduled_change;
      if (n) add({state: r.state, effective: n.effective, act: n.act, summary: n.summary, detail: d.history_source, source: r.official_url});
    });
    // The latest enacted log entry wins; pending proposals never enter this list.
    ((WEEKLY || {}).entries || []).slice().sort((a, b) => a.check_date.localeCompare(b.check_date)).forEach(entry => {
      (entry.items || []).filter(i => ['enacted_recent', 'enacted_upcoming'].includes(i.category)).forEach(i => {
        if (!AUDIT.some(r => r.state === i.state)) return;
        add({state: i.state, effective: i.effective, act: i.bill, summary: i.summary_short || i.summary,
          detail: i.summary, source: i.source_url});
      });
    });
    return [...events.values()].sort((a, b) => b.effective.localeCompare(a.effective) || a.state.localeCompare(b.state));
  }
  function nextChange(r) { return lawChanges().filter(e => e.state === r.state && e.effective > TODAY).pop() || null; }
  function recentChange(r) { return lawChanges().find(e => e.state === r.state && e.effective >= nineMonthsAgo(TODAY) && e.effective <= TODAY) || null; }
  function recentLawsPanel() {
    const events = lawChanges().filter(e => e.effective >= nineMonthsAgo(TODAY) && e.effective <= TODAY);
    const count = new Set(events.map(e => e.state)).size;
    return '<section class="xl-recent" id="xs-changes" tabindex="-1" aria-labelledby="xl-heading"><header><p class="xd-eyebrow">Rolling nine-month window</p><h2 id="xl-heading">Recent law changes <span>' + count + ' states</span></h2><p><strong>Effective ' + fmtDate(nineMonthsAgo(TODAY)) + ' – ' + fmtDate(TODAY) + '</strong></p><p>Uses effective dates, not enactment dates. These are changes tracked in the Atlas, not an exhaustive legislative history. Last recorded law-change check: ' + fmtDate(maxVerified()) + '. Upcoming changes are listed separately above.</p></header><div class="xl-grid">' +
      (events.length ? events.map(e => {
        const r = AUDIT.find(r => r.state === e.state);
        return '<article class="xl-card"><p class="xl-date">Effective ' + fmtDate(e.effective) + '</p><h3><a href="#state/' + e.state + '">' + esc(r.name) + '</a></h3><p class="xl-act">' + esc(e.act || '') + '</p><p>' + esc(e.summary || '') + '</p>' + (e.detail ? '<details><summary>Scope and source notes</summary><p>' + esc(e.detail) + '</p></details>' : '') + '<p class="xl-links">' + link(e.source, 'Original source') + ' · <a href="#state/' + e.state + '">State overview →</a></p></article>';
      }).join('') : '<p>No tracked changes took effect in this window.</p>') + '</div></section>';
  }
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

  /* ---------- page intros: what's here, and how to use it ---------- */
  function intro(o) {
    const li = a => '<ul>' + a.map(x => '<li>' + x + '</li>').join('') + '</ul>';
    return '<div class="xhead xi' + (o.cls ? ' ' + o.cls : '') + '"><div>' + (o.eyebrow ? '<p class="xd-eyebrow">' + esc(o.eyebrow) + '</p>' : '') + '<h1 class="ks-h1">' + esc(o.title) + '</h1><p class="xi-lead">' + o.lead + '</p>' +
      '<div class="xi-cols"><div><p class="xi-h">What\'s here</p>' + li(o.here) + '</div><div><p class="xi-h">Use it to</p>' + li(o.use) + '</div></div>' + (o.note ? '<p class="xi-note">' + o.note + '</p>' : '') + '</div>' +
      (o.stamp ? '<aside class="xstamp">' + o.stamp + '</aside>' : '') + '</div>';
  }

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
    bindPrivacy(dlg);
    bindCompare();
    window.addEventListener('hashchange', route);
  }
  /* ---------- site analytics (Google Analytics 4, loaded in index.html) ---------- */
  const OPT_KEY = 'atlas-analytics-off';
  function analyticsOff() { try { return localStorage.getItem(OPT_KEY) === '1'; } catch (e) { return false; } }
  let lastView = '';
  function track(path) {
    if (path === lastView) return; lastView = path;
    if (typeof window.gtag !== 'function' || analyticsOff()) return;
    const base = location.origin + location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
    window.gtag('event', 'page_view', {page_location: base + path, page_title: document.title});
  }
  function bindPrivacy(dlg) {
    const opt = $('gaOptOut'), st = $('gaOptState'), link = $('privacyLink');
    const paint = () => { if (!opt) return; const off = analyticsOff(); opt.textContent = off ? 'Count my visits again' : 'Don\'t count my visits on this browser'; opt.setAttribute('aria-pressed', off ? 'true' : 'false'); if (st) st.textContent = off ? 'Your visits on this browser are not counted.' : 'Your visits on this browser are counted.'; };
    if (opt) opt.addEventListener('click', () => {
      const off = !analyticsOff();
      try { off ? localStorage.setItem(OPT_KEY, '1') : localStorage.removeItem(OPT_KEY); } catch (e) {}
      if (window.ATLAS_GA_ID) window['ga-disable-' + window.ATLAS_GA_ID] = off;
      paint();
    });
    if (link && dlg) link.addEventListener('click', () => { if (!dlg.open) dlg.showModal(); const h = $('privacyTitle'); if (h) { h.scrollIntoView({block: 'start'}); h.focus({preventScroll: true}); } });
    paint();
  }
  function hashParam(k) { const m = new RegExp('[?&]' + k + '=([^&]+)').exec(location.hash); return m ? decodeURIComponent(m[1]) : ''; }
  function parseHash() {
    const h = (location.hash || '').replace(/^#/, '');
    const m = /^state\/([A-Za-z]{2})$/.exec(h);
    if (m) return {tab: 'states', state: m[1].toUpperCase()};
    const cp = /^compare(?:\/([A-Za-z,]*))?$/.exec(h);
    if (cp) return {tab: 'states', state: '', compare: (cp[1] || '').split(',').filter(Boolean)};
    const sm = /^summary\/([a-z][a-z-]*)$/.exec(h);
    if (sm) return {tab: 'summary', state: '', section: sm[1]};
    const cm = /^cases\/([a-z0-9-]+)$/.exec(h);
    if (cm) return {tab: 'cases', state: '', section: cm[1]};
    const base = h.split(/[?&]/)[0];
    if (base === 'audit') { const s = hashParam('state').toUpperCase(); return {tab: 'states', state: s, redirect: s ? '#state/' + s : '#states'}; }
    if (LEGACY[base]) return {tab: LEGACY[base], state: '', redirect: '#' + LEGACY[base]};
    return {tab: TABS.some(t => t[0] === base) ? base : 'map', state: ''};
  }
  function route() {
    const r = parseHash();
    if (r.redirect && history.replaceState) history.replaceState(null, '', location.pathname + location.search + r.redirect);
    const tab = r.tab;
    document.querySelectorAll('#xnav a').forEach(a => a.setAttribute('aria-current', a.dataset.tab === tab ? 'page' : 'false'));
    TABS.forEach(([id]) => { const p = $('x-' + id); if (p) p.hidden = id !== tab; });
    ensureData().then(() => { render(tab, r.state, r.section, r.compare); cmpUI(); }).catch(() => {});
  }
  function ensureData() {
    if (loaded) return Promise.resolve();
    if (loading) return loading;
    const get = p => fetch(p + '?v=' + Date.now().toString(36).slice(0, 6)).then(r => { if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); });
    loading = Promise.all([get('data/audit-fields.json'), get('data/weekly-checks.json'), get('data/news.json'), get('data/key-facts.json'),
      get('data/audit-procedures.json'), get('data/distributors.json'), get('data/cases.json'), get('data/audit-index.json')]).then(([a, w, n, k, pr, di, ca, ix]) => {
      AUDIT = a.slice().sort((x, y) => x.name.localeCompare(y.name)); WEEKLY = w; NEWS = n; KEY = k || {states: {}}; loaded = true;
      (pr.states || []).forEach(x => { PROC[x.state] = x; }); DIST = di || {states: []}; CASES = ca || {items: []}; IDX = ix;
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
  function render(tab, state, section, compare) {
    if (tab === 'states' && compare) { renderCompare(compare); track('compare'); return; }
    if (tab === 'states') { const one = state && byAbbr[state]; one ? renderState(state) : renderHome(); track(one ? 'state/' + state : 'states'); return; }
    document.title = (TABS.find(t => t[0] === tab) || ['', ''])[1] + ' · Warranty Atlas';
    track(tab);
    if (!rendered[tab]) { rendered[tab] = true; ({updates: renderWeekly, news: renderNews, downloads: renderDownloads, summary: renderSummary, map: renderMap, cases: renderCases})[tab](); }
    if (tab === 'summary') { bindJumpBar(); scrollToSection(section); }
    else if (tab === 'cases' && section) focusCase(section);
    else window.scrollTo(0, 0);
  }

  /* ---------- States: home table ---------- */
  let homeBuilt = false, stateOpen = false, homeScroll = 0;
  function renderHome() {
    buildHome();
    document.title = 'State-by-State Matrix · Warranty Atlas';
    $('ks-home').hidden = false; $('ks-state').hidden = true; $('ks-compare').hidden = true;
    if (stateOpen) { stateOpen = false; window.scrollTo(0, homeScroll); }
  }
  function buildHome() {
    const p = $('x-states');
    if (!homeBuilt) {
      homeBuilt = true;
      p.innerHTML = '<div id="ks-home">' + intro({eyebrow: 'Warranty reimbursement by state', title: 'State-by-State Matrix', lead: 'One row per state with the rules that decide what a dealer is paid for warranty labor and parts.',
        here: ['How the labor rate is set, how often dealers can ask for an increase, and how fast the manufacturer must respond', 'Which labor-time guide sets paid hours, parts markup, and whether service contracts and CPO are covered', 'Flags for recent and upcoming law changes, distributor-franchised states, and each state\'s audit climate score'],
        use: ['Check a state\'s rules before reviewing a dealer\'s rate request, a warranty claim or a chargeback', 'Click any state for its key facts, audit procedures and the statute text behind them', 'Tick 2 to 6 states, then press <strong>Compare</strong> to see them side by side'],
        stamp: 'Last verified <strong>' + fmtDate(maxVerified()) + '</strong><br>Checked for law changes every Monday'}) +
        '<div class="xtools"><label class="search"><span aria-hidden="true">⌕</span><input id="ksSearch" type="search" placeholder="Search a state…" aria-label="Search states"></label>' +
        '<label>Show<select id="ksFilter"><option value="">All 50 states</option><option value="sc">Service contracts or CPO covered</option><option value="guide">Uses a non-OEM guide, multiplier or actual time</option><option value="request">Has a rate-request frequency rule</option><option value="recent">Law changed in last 9 months</option><option value="change">Law change coming up</option><option value="dist">Distributor-franchised states</option><option value="high">Audit climate High or Very high</option></select></label>' +
        '<a class="quiet ks-csv" href="#downloads">Excel workbook →</a></div>' +
        '<p class="xcount" id="ksCount" aria-live="polite"></p>' +
        '<p class="ks-defs"><strong>What the answers mean:</strong> ' + [['labor', 'Labor rate'], ['requests', 'Rate increase requests'], ['response', 'Manufacturer response'], ['hours', 'Paid hours'], ['parts', 'Parts markup'], ['mfrsc', 'Service contracts & CPO'], ['auditindex', 'Audit procedures']].map(x => '<a href="#summary/' + x[0] + '">' + x[1] + '</a>').join(' · ') + ' · <a href="#summary">All counts</a></p>' +
        '<div class="table-scroll xtable-scroll ks-scroll" tabindex="0" role="region" aria-label="State rules table"><table class="xtable ks-table"><thead><tr>' +
        ['State <small class="ks-cmphint">Tick boxes to compare</small>', 'Labor rate', 'Rate increase requests', 'Manufacturer response', 'Paid hours (labor-time guide)', 'Parts markup', 'Service contracts & CPO'].map(h => '<th scope="col">' + h + '</th>').join('') +
        '</tr></thead><tbody id="ksBody"></tbody></table></div>' +
        '<p class="xfoot"><strong>Service contracts &amp; CPO:</strong> Yes = the state\'s warranty rate and time rules apply; Conditional = only if the stated condition is met (usually who issues or pays). "Factory warranty only" means the statute is silent on or does not cover those contracts. Summaries are short on purpose; the state page has the statute quotes and conditions.</p></div>' +
        '<div id="ks-state" hidden></div><div id="ks-compare" hidden></div>';
      ['ksSearch', 'ksFilter'].forEach(id => $(id).addEventListener('input', drawHome));
      $('ksBody').addEventListener('click', e => { if (e.target.closest('a,label,input')) return; const tr = e.target.closest('tr[data-state]'); if (tr) location.hash = '#state/' + tr.dataset.state; });
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
      if (f === 'recent' && !recentChange(r)) return false;
      if (f === 'change' && !nextChange(r)) return false;
      if (f === 'dist' && !distOf(r.state)) return false;
      if (f === 'high' && !['High', 'Very high'].includes((idxOf(r.state) || {}).tier)) return false;
      return true;
    });
  }
  function drawHome() {
    const rows = homeRows();
    $('ksCount').textContent = rows.length === 50 ? 'All 50 states' : rows.length + ' of 50 states';
    $('ksBody').innerHTML = rows.map(r => {
      const k = kf(r.state), h = hoursShort(r.state), n = nextChange(r), rc = recentChange(r);
      const d = distOf(r.state), v = idxOf(r.state);
      return '<tr data-state="' + r.state + '"><th scope="row"><label class="ks-cmp" title="Add to compare"><input type="checkbox" data-cmp="' + r.state + '"' + (CMP.includes(r.state) ? ' checked' : '') + (!CMP.includes(r.state) && CMP.length >= MAXC ? ' disabled' : '') + '><span class="sr-only">Compare ' + esc(r.name) + '</span></label><a class="ks-state" href="#state/' + r.state + '">' + esc(r.name) + ' <span class="abbr">' + r.state + '</span></a>' +
        (rc ? '<span class="ks-change xl-badge">Changed ' + fmtDate(rc.effective) + ' · last 9 months</span>' : '') +
        (n ? '<span class="ks-change">Upcoming ' + fmtDate(n.effective) + '</span>' : '') +
        (d ? '<span class="ks-dist" title="' + esc(distName(d)) + '">Distributor' + (d.coverage === 'partial' ? ' (north)' : '') + '</span>' : '') +
        (v ? '<small class="ks-idx">Audit climate <strong>' + v.score + '</strong> · ' + esc(v.tier) + '</small>' : '') + '</th>' +
        '<td>' + esc(k.labor || '—') + '</td>' +
        '<td>' + esc(k.requests || '—') + '<small>' + esc(sampleShort(r)) + '</small></td>' +
        '<td>' + esc(responseShort(r)) + '</td>' +
        '<td>' + esc(h.label) + (h.note ? '<small>' + esc(h.note) + '</small>' : '') + '</td>' +
        '<td>' + esc(k.parts || '—') + '</td>' +
        '<td>' + scShort(r.state) + '</td></tr>';
    }).join('') || '<tr><td colspan="7" class="xempty">No states match. Clear the search or filter.</td></tr>';
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
      '<div class="ks-actions"><button type="button" class="xbtn-save xcmp-btn" data-cmp-toggle="' + abbr + '">+ Add to compare</button><a class="xbtn-open" href="downloads/state-pdfs/' + abbr + '.pdf" target="_blank" rel="noopener">One-page PDF ↗</a>' + (safeUrl(r.official_url) ? '<a class="xbtn-save" href="' + esc(safeUrl(r.official_url)) + '" target="_blank" rel="noopener noreferrer">Official statute ↗</a>' : '') + '</div></header>' +
      (n ? '<p class="xnextbox"><strong>Law change coming · effective ' + fmtDate(n.effective) + ':</strong> ' + esc(n.act || '') + (n.summary ? ' — ' + esc(n.summary) : '') + '</p>' : '') +
      (rc ? '<p class="xnote"><strong>Changed in last 9 months · effective ' + fmtDate(rc.effective) + ':</strong> ' + esc(rc.act || '') + (rc.summary ? ' — ' + esc(rc.summary) : '') + ' ' + link(rc.source, 'Original source') + '</p>' : '') +
      distBox(abbr) +
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
      '</div>' + auditSection(abbr) +
      '<details class="ks-sources"><summary>Sources, confidence and research notes</summary><div class="kf-detail">' +
      kv([['Citations', (r.cites || []).join(' · ')], ['Source quality', r.source_quality], ['Confidence', r.confidence], ['Coverage research cite', f.primaryCite], ['Definitions', f.definitionCite], ['Effective-date notes', f.effectiveNotes], ['Audit-field notes', r.notes], ['Coverage research notes', f.notes], ['Law history source', ld.history_source], ['Last amending act', ld.last_amending_act]]) +
      '<p class="xpin">' + [link(r.official_url, 'Official text')].concat((f.urls || []).filter(u => u !== safeUrl(r.official_url)).slice(0, 4).map(u => link(u, 'Coverage source'))).filter(Boolean).join(' · ') + '</p></div></details>' +
      '<nav class="ks-pager" aria-label="Previous and next state">' + (prev ? '<a href="#state/' + prev.state + '">← ' + esc(prev.name) + '</a>' : '<span></span>') + '<a href="#states">All states</a>' + (next ? '<a href="#state/' + next.state + '">' + esc(next.name) + ' →</a>' : '<span></span>') + '</nav>' +
      '<p class="xfoot">Internal use only. Research summary, not legal advice. Verify against the cited statute before acting, and take disputes to Legal.</p>';

    const box = $('ks-state');
    box.innerHTML = html; box.hidden = false; $('ks-home').hidden = true; $('ks-compare').hidden = true;
    $('ksJump').addEventListener('change', e => { location.hash = '#state/' + e.target.value; });
    $('ksExpand').addEventListener('click', e => {
      const open = e.currentTarget.getAttribute('aria-pressed') !== 'true';
      box.querySelectorAll('details').forEach(d => { d.open = open; });
      e.currentTarget.setAttribute('aria-pressed', String(open)); e.currentTarget.textContent = open ? 'Collapse all details' : 'Expand all details';
    });
    window.scrollTo(0, 0);
  }

  /* ---------- Compare states side by side ---------- */
  const MAXC = 6;
  let CMP = [];
  function cmpToggle(ab, on) {
    ab = String(ab || '').toUpperCase(); if (!byAbbr[ab]) return;
    const has = CMP.includes(ab), want = on == null ? !has : on;
    if (want && !has) { if (CMP.length >= MAXC) { cmpUI(); return; } CMP.push(ab); }
    if (!want && has) CMP = CMP.filter(x => x !== ab);
    cmpUI();
  }
  function cmpUI() {
    document.querySelectorAll('input[data-cmp]').forEach(i => { const on = CMP.includes(i.dataset.cmp); i.checked = on; i.disabled = !on && CMP.length >= MAXC; });
    document.querySelectorAll('[data-cmp-toggle]').forEach(b => { const on = CMP.includes(b.dataset.cmpToggle); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '✓ In compare list' : '+ Add to compare'; b.disabled = !on && CMP.length >= MAXC; });
    const bar = $('xcmpbar'); if (!bar) return;
    const onCompare = /^#compare/.test(location.hash);
    bar.hidden = !CMP.length || onCompare;
    document.body.classList.toggle('has-cmpbar', !bar.hidden);
    if (bar.hidden) return;
    bar.innerHTML = '<div class="xcmp-in"><span class="xcmp-k">Compare <span>' + CMP.length + ' of ' + MAXC + ' max</span></span><span class="xcmp-list">' +
      CMP.map(ab => '<button type="button" class="xcmp-chip" data-cmp-remove="' + ab + '" aria-label="Remove ' + esc(byAbbr[ab].name) + ' from compare">' + ab + ' <span aria-hidden="true">×</span></button>').join('') + '</span>' +
      (CMP.length >= 2 ? '<a class="xbtn-open xcmp-go" href="#compare/' + CMP.join(',') + '">Compare ' + CMP.length + ' states →</a>' : '<span class="xcmp-hint">Pick at least one more state</span>') +
      '<button type="button" class="xcmp-clear" data-cmp-clear>Clear</button></div>';
  }
  function bindCompare() {
    const bar = document.createElement('div'); bar.id = 'xcmpbar'; bar.className = 'xcmpbar'; bar.hidden = true; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'States to compare');
    document.body.appendChild(bar);
    document.addEventListener('change', e => { const i = e.target.closest && e.target.closest('input[data-cmp]'); if (i) cmpToggle(i.dataset.cmp, i.checked); });
    document.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('[data-cmp-toggle],[data-cmp-remove],[data-cmp-clear]'); if (!t) return;
      if (t.dataset.cmpToggle) cmpToggle(t.dataset.cmpToggle);
      else if (t.dataset.cmpRemove) cmpToggle(t.dataset.cmpRemove, false);
      else { CMP = []; cmpUI(); }
    });
  }
  const cmpCell = v => typeof v === 'object' && v ? v : {h: esc(v == null || v === '' ? '—' : v), t: String(v == null || v === '' ? '—' : v)};
  function cmpRows() {
    const val = (ab, fn) => cmpCell(fn(ab, byAbbr[ab]));
    return [
      ['Overview', [
        ['Audit climate score', (ab) => { const v = idxOf(ab); return v ? {h: tierBadge(v.tier, v.score) + '<br><span class="xpin">Rank ' + v.rank + ' of 50</span>', t: v.score + v.tier} : '—'; }],
        ['Chargeback limits (sub-score)', ab => { const v = idxOf(ab); return v && v.subscores ? v.subscores.limits + ' / 100' : '—'; }],
        ['Process and oversight (sub-score)', ab => { const v = idxOf(ab); return v && v.subscores ? v.subscores.process + ' / 100' : '—'; }],
        ['Distributor-franchised', (ab) => { const d = distOf(ab); return d ? 'Yes' + (d.coverage === 'partial' ? ', northern counties only' : '') + ' (' + distName(d).replace(/\.$/, '') + ')' : 'No'; }],
        ['Law last amended', (ab, r) => amended(r)],
        ['Upcoming law change', (ab, r) => { const n = nextChange(r); return n ? fmtDate(n.effective) + ': ' + (n.act || '') : 'None tracked'; }],
        ['Changed in last 9 months', (ab, r) => { const c = recentChange(r); return c ? fmtDate(c.effective) + ': ' + (c.act || '') : 'No'; }]
      ]],
      ['Labor and parts', [
        ['Labor rate', ab => kf(ab).labor || '—'],
        ['Rate increase requests', (ab, r) => (kf(ab).requests || '—') + ' · ' + sampleLong(r)],
        ['Manufacturer response', (ab, r) => responseShort(r)],
        ['Paid hours (labor-time guide)', ab => { const h = hoursShort(ab); return h.label + (h.note ? ' · ' + h.note : ''); }],
        ['Labor-time multiplier', ab => multiplierText(ab)],
        ['Parts markup', ab => kf(ab).parts || '—'],
        ['Service contracts & CPO', ab => scPlain(ab)]
      ]],
      ['Claims and chargebacks', [
        ['Claim decision deadline', (ab, r) => days(r.claims.decision_deadline_days) + (r.claims.deemed_approved_if_late === true ? '; late = deemed approved' : '')],
        ['Payment deadline', (ab, r) => r.claims.payment_deadline_days != null ? days(r.claims.payment_deadline_days) + (r.claims.payment_deadline_trigger ? ' ' + r.claims.payment_deadline_trigger : '') : 'Not set in statute'],
        ['Audit and chargeback lookback', (ab, r) => r.chargebacks.lookback_months != null ? r.chargebacks.lookback_months + ' months' : 'No limit in statute'],
        ['Fraud extension', (ab, r) => r.chargebacks.fraud_extension ? trim(r.chargebacks.fraud_extension, 160) : 'Not stated']
      ]],
      ['Audit procedures', PROC_ROWS.map(([k, label, kind]) => [label, ab => procAnswer(ab, k, kind).ans])]
    ].map(([g, rows]) => [g, rows.map(([label, fn]) => [label, fn, val])]);
  }
  function renderCompare(list) {
    buildHome();
    if (!stateOpen && !$('ks-home').hidden) homeScroll = window.scrollY;
    stateOpen = true;
    list = [...new Set((list || []).map(x => String(x).toUpperCase()).filter(x => byAbbr[x]))].slice(0, MAXC);
    CMP = list.slice();
    document.title = 'Compare ' + (list.join(', ') || 'states') + ' · Warranty Atlas';
    const box = $('ks-compare'), link = ab => '#compare/' + list.filter(x => x !== ab).join(',');
    const add = '<label class="xc-add">Add a state<select id="xcAdd"' + (list.length >= MAXC ? ' disabled' : '') + '><option value="">Choose…</option>' + AUDIT.filter(r => !list.includes(r.state)).map(r => '<option value="' + r.state + '">' + esc(r.name) + '</option>').join('') + '</select></label>';
    let body = '';
    if (list.length < 2) body = '<p class="xnote">Pick at least two states to compare. Use <strong>Add a state</strong> above, or tick states on the <a href="#states">State-by-State Matrix</a> or the <a href="#map">map</a>.</p>';
    else {
      const groups = cmpRows();
      body = '<div class="table-scroll xc-scroll" tabindex="0" role="region" aria-label="State comparison table"><table class="xtable xc-table"><thead><tr><th scope="col" class="xc-corner">Rule</th>' +
        list.map(ab => { const r = byAbbr[ab]; return '<th scope="col"><a href="#state/' + ab + '">' + esc(r.name) + '</a> <span class="abbr">' + ab + '</span><a class="xc-x" href="' + link(ab) + '" aria-label="Remove ' + esc(r.name) + '">Remove ×</a></th>'; }).join('') + '</tr></thead>' +
        groups.map(([g, rows]) => '<tbody><tr class="xc-group"><th scope="rowgroup" colspan="' + (list.length + 1) + '">' + esc(g) + '</th></tr>' + rows.map(([label, fn, val]) => {
          const cells = list.map(ab => val(ab, fn)), diff = new Set(cells.map(c => c.t)).size > 1;
          return '<tr class="' + (diff ? 'xc-diff' : 'xc-same') + '"><th scope="row">' + esc(label) + (diff ? ' <span class="xc-dmark">Differs</span>' : '') + '</th>' + cells.map(c => '<td>' + c.h + '</td>').join('') + '</tr>';
        }).join('') + '</tbody>').join('') +
        '<tbody><tr class="xc-group"><th scope="rowgroup" colspan="' + (list.length + 1) + '">Sources</th></tr><tr><th scope="row">Links</th>' + list.map(ab => { const r = byAbbr[ab]; return '<td><a href="#state/' + ab + '">State page →</a><br><a href="downloads/state-pdfs/' + ab + '.pdf" target="_blank" rel="noopener">One-page PDF ↗</a>' + (safeUrl(r.official_url) ? '<br><a href="' + esc(safeUrl(r.official_url)) + '" target="_blank" rel="noopener noreferrer">Official statute ↗</a>' : '') + '</td>'; }).join('') + '</tr></tbody></table></div>';
    }
    box.innerHTML = '<nav class="ks-crumbs" aria-label="Compare navigation"><a href="#states" class="ks-back">← State-by-State Matrix</a></nav>' +
      '<header class="xc-head"><div><span class="eyebrow">COMPARE STATES</span><h1 class="ks-h1">' + (list.length ? list.map(ab => esc(byAbbr[ab].name)).join(' · ') : 'Compare states') + '</h1>' +
      '<p class="xpin">Side by side, up to ' + MAXC + ' states. Rows marked <strong>Differs</strong> are where the states give different answers. Open a state for the statute quotes behind each answer.</p></div></header>' +
      '<div class="xtools xc-tools">' + add + (list.length >= 2 ? '<label class="toggle-label"><input type="checkbox" id="xcOnlyDiff"> Only show rows that differ</label><button type="button" class="quiet xc-copy" id="xcCopy">Copy link to this comparison</button>' : '') + '<span id="xcMsg" class="xpin" role="status"></span></div>' + body +
      '<p class="xfoot">Internal use only. Research summary, not legal advice. Verify against the cited statute before acting.</p>';
    box.hidden = false; $('ks-home').hidden = true; $('ks-state').hidden = true;
    $('xcAdd').addEventListener('change', e => { if (e.target.value) location.hash = '#compare/' + list.concat(e.target.value).join(','); });
    const od = $('xcOnlyDiff'); if (od) od.addEventListener('change', () => box.querySelector('.xc-table').classList.toggle('only-diff', od.checked));
    const cp = $('xcCopy'); if (cp) cp.addEventListener('click', () => {
      const url = location.href; let ok = false;
      try { navigator.clipboard.writeText(url).then(() => { $('xcMsg').textContent = 'Link copied.'; }, () => { $('xcMsg').textContent = url; }); ok = true; } catch (e) {}
      if (!ok) $('xcMsg').textContent = url;
    });
    cmpUI();
    window.scrollTo(0, 0);
  }

  /* ---------- shared: at-a-glance tiles and compact rows ---------- */
  function glance(tiles) {
    return '<div class="xg">' + tiles.map(t => '<div class="xg-tile"><p class="xg-k">' + esc(t.k) + '</p><p class="xg-v">' + t.v + '</p>' + (t.s ? '<p class="xg-s">' + t.s + '</p>' : '') + '</div>').join('') + '</div>';
  }
  function row(o) {
    return '<article class="xr' + (o.cls ? ' ' + o.cls : '') + '"' + (o.id ? ' id="' + esc(o.id) + '" tabindex="-1"' : '') + '>' +
      (o.flag ? '<p class="xr-flag">' + esc(o.flag) + '</p>' : '') +
      '<div class="xr-top">' + (o.tag ? '<span class="xr-tag' + (o.outline ? ' xr-outline' : '') + '">' + esc(o.tag) + '</span>' : '') + (o.meta ? '<span class="xr-meta">' + o.meta + '</span>' : '') + '</div>' +
      '<h4 class="xr-title">' + o.title + '</h4>' + (o.why ? '<p class="xr-why">' + o.why + '</p>' : '') +
      (o.more ? '<details class="xr-more"><summary>' + (o.moreLabel || 'Details') + '</summary><div class="xr-body">' + o.more + '</div></details>' : '') + '</article>';
  }
  const stLink = x => byAbbr[x] ? '<a class="xchip" href="#state/' + esc(x) + '">' + esc(x) + '</a>' : '<span class="xchip">' + esc(x) + '</span>';
  const extLink = (u, t) => safeUrl(u) ? '<a href="' + esc(safeUrl(u)) + '" target="_blank" rel="noopener noreferrer">' + esc(t) + ' ↗</a>' : esc(t);
  const para = (label, t) => t ? '<p><strong>' + label + ':</strong> ' + esc(t) + '</p>' : '';
  function lead(t, n) {
    const f = String(t || '').split(/(?<=[.;])\s+(?=[A-Z])/)[0].replace(/;$/, '.');
    if (f.length <= n) return f;
    const cut = f.slice(0, n), sp = cut.lastIndexOf(' ');
    return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[,;:]$/, '') + '…';
  }
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));

  /* ---------- Update log ---------- */
  const CAT = {enacted_upcoming: 'Takes effect soon', enacted_recent: 'Took effect recently', pending: 'Pending bill', dead_or_stalled: 'Dead or stalled', no_change: 'No change'};
  const CAT_ORDER = ['enacted_upcoming', 'enacted_recent', 'pending', 'dead_or_stalled', 'no_change'];
  function renderWeekly() {
    const E = (WEEKLY.entries || []).slice().sort((a, b) => a.check_date < b.check_date ? 1 : -1);
    const L = E[0] || {}, LI = L.items || [];
    const by = c => LI.filter(x => x.category === c);
    const soon = by('enacted_upcoming'), pend = by('pending'), recent = by('enacted_recent');
    const soonDates = [...new Set(soon.map(x => x.effective))].sort();
    const soonText = soonDates.map(d => fmtDate(d) + ': ' + soon.filter(x => x.effective === d).map(x => x.state).join(', ')).join('<br>');
    const lawRow = it => row({tag: CAT[it.category] || it.category, outline: it.category !== 'enacted_upcoming' && it.category !== 'enacted_recent',
      meta: stLink(it.state) + ' <span>' + esc((byAbbr[it.state] || {}).name || it.state) + '</span>' + (it.effective ? ' · <span>Effective ' + fmtDate(it.effective) + '</span>' : ''),
      title: esc(it.summary_short || it.summary || it.bill), why: it.atlas_impact ? '<strong>Site impact:</strong> ' + esc(it.atlas_impact) : '',
      more: para('Bill', it.bill) + para('Status', it.status) + (it.summary && it.summary !== it.summary_short ? para('Summary', it.summary) : '') +
        '<p class="xpin">' + [link(it.source_url, 'Official source'), byAbbr[it.state] ? '<a href="#state/' + esc(it.state) + '">State page →</a>' : ''].filter(Boolean).join(' · ') + '</p>'});
    const week = (e, open) => { const items = (e.items || []).slice().sort((a, b) => CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category) || String(a.state).localeCompare(b.state));
      return '<details class="xw"' + (open ? ' open' : '') + '><summary class="xw-sum"><span class="xw-date">' + fmtDate(e.check_date) + '</span><span class="xr-tag' + (e.type === 'baseline' ? ' xr-outline' : '') + '">' + (e.type === 'baseline' ? 'Baseline' : 'Weekly check') + '</span><span class="xw-head">' + esc(e.headline) + '</span></summary><div class="xw-body">' +
        (e.summary ? '<p class="xw-summary">' + esc(e.summary) + '</p>' : '') +
        (items.length ? '<h4 class="xw-h">Laws tracked (' + items.length + ')</h4><div class="xr-list">' + items.map(lawRow).join('') + '</div>' : '<p class="xnote">No enacted, effective or pending changes found this week.</p>') +
        (e.site_changes && e.site_changes.length ? '<details class="xw-sub"><summary>Site updates (' + e.site_changes.length + ')</summary><ul>' + e.site_changes.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>' : '') +
        (e.gaps && e.gaps.length ? '<details class="xw-sub"><summary>Gaps and limits (' + e.gaps.length + ')</summary><ul>' + e.gaps.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>' : '') +
        (e.method ? '<details class="xw-sub"><summary>How this check was run</summary><p>' + esc(e.method) + '</p></details>' : '') + '</div></details>'; };
    $('x-updates').innerHTML = intro({title: 'Update log', lead: 'What the Monday law check found, and what changed on this site.',
      here: ['Each week\'s results: laws enacted, taking effect or pending, with official sources', 'Site updates and corrections, plus gaps and how each check was run'],
      use: ['Confirm the site is current before relying on it', 'See what changed since you last looked'],
      note: 'Every Monday at 7 AM ET, Claude checks all 50 legislatures and updates the site when enacted law changes. Pending bills are tracked here but never loaded as law.',
      stamp: 'Last check <strong>' + fmtDate(L.check_date) + '</strong><br>' + plural(E.length, 'check') + ' logged'}) +
      glance([
        {k: 'Last check', v: fmtDate(L.check_date), s: esc(L.headline || '')},
        {k: 'Taking effect soon', v: String(soon.length), s: soonText || 'None'},
        {k: 'Pending bills watched', v: String(pend.length), s: pend.length ? esc(pend.map(x => x.state).join(', ')) + ' · never loaded as law' : 'None'},
        {k: 'Site updates', v: String((L.site_changes || []).length), s: 'In the ' + fmtDate(L.check_date) + ' check'}
      ].concat(recent.length ? [{k: 'Took effect recently', v: String(recent.length), s: esc(recent.map(x => x.state).join(', '))}] : [])) +
      '<h3 class="xr-gh">Weekly checks <span>' + E.length + '</span></h3>' + E.map((e, i) => week(e, i === 0)).join('');
  }

  /* ---------- News ---------- */
  function renderNews() {
    const W = (NEWS.weeks || []).slice().sort((a, b) => a.week_of < b.week_of ? 1 : -1);
    const lim = NEWS.limits || {law: 5, commentary: 3};
    const item = n => row({tag: n.kind === 'commentary' ? 'Commentary' : 'Law or ruling', outline: n.kind === 'commentary',
      meta: '<span>' + fmtDate(n.date) + '</span> · <span>' + esc(n.publisher || '') + '</span> · <span>' + esc(n.perspective || 'neutral') + '</span>' + ((n.states || []).length ? ' ' + n.states.map(stLink).join(' ') : ''),
      title: extLink(n.url, n.title), why: '<strong>Why it matters:</strong> ' + esc(lead(n.why_it_matters, 260)),
      more: para('What it says', n.topic) + para('Why it matters', n.why_it_matters) + para('Source type', n.source_type) + '<p class="xpin">' + extLink(n.url, 'Read the source') + '</p>'});
    const src = NEWS.sources || [], groups = [...new Set(src.map(x => x.group))];
    const count = it => { const l = it.filter(n => n.kind !== 'commentary').length, c = it.length - l; return plural(l, 'law or ruling', 'laws or rulings') + ' · ' + c + ' commentary'; };
    $('x-news').innerHTML = intro({title: 'News and industry commentary', lead: 'What changed this week, and what the industry is saying about it.',
      here: ['<strong>Law or ruling</strong> (up to ' + lim.law + ' a week): new laws, bills and board or court decisions on warranty reimbursement, audits and chargebacks', '<strong>Commentary</strong> (up to ' + lim.commentary + ' a week): warranty cost trends and what dealers, vendors and manufacturers are saying', 'One line per item on why it matters; open Details for the full summary'],
      use: ['Catch new laws and rulings before they reach an audit', 'Understand the arguments dealers and rate vendors are making, and the cost pressures behind them'],
      note: 'Commentary is context, not law. Much dealer-side coverage comes from dealer law firms and retail-rate vendors.'}) +
      W.map((w, i) => { const it = (w.items || []).slice().sort((a, b) => (a.kind === 'commentary') - (b.kind === 'commentary') || (a.date < b.date ? 1 : -1));
        return '<details class="xw"' + (i === 0 ? ' open' : '') + '><summary class="xw-sum"><span class="xw-date">Week of ' + fmtDate(w.week_of) + '</span><span class="xw-count">' + count(it) + '</span></summary><div class="xw-body">' +
          (it.length ? '<div class="xr-list">' + it.map(item).join('') + '</div>' : '<p class="xnote">Nothing met the bar this week.</p>') + '</div></details>'; }).join('') +
      (src.length ? '<details class="xs-more xnews-sources"><summary>Sources we check each week (' + src.length + ')</summary>' + groups.map(g => '<h4 class="xs-sub">' + esc(g) + '</h4><ul>' + src.filter(x => x.group === g).map(x => '<li>' + link(x.url, x.name) + ' <span class="xpin">(' + esc(x.type) + ')</span><br><span class="xpin">' + esc(x.note || '') + '</span></li>').join('') + '</ul>').join('') + '</details>' : '');
  }

  /* ---------- Downloads ---------- */
  function renderDownloads() {
    const abs = p => new URL(p, location.href).href;
    const openA = (href, label) => '<a class="xbtn-open" href="' + href + '" target="_blank" rel="noopener">' + label + ' ↗</a>';
    const saveA = (href, label) => '<a class="xbtn-save" href="' + href + '" download>' + (label || 'Save a copy') + ' ↓</a>';
    const card = (title, desc, btns) => '<div class="xdl-card"><strong>' + title + '</strong><span>' + desc + '</span><div class="xdl-btns">' + btns + '</div></div>';
    const office = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(abs('downloads/warranty-atlas.xlsx'));
    $('x-downloads').innerHTML = intro({title: 'Downloads for workpapers', lead: 'Everything on the site as files you can attach, filter or print. Rebuilt every Monday.',
      here: ['Excel workbook with every state\'s rules, audit procedures, audit climate scores, law dates, statute quotes, the update log and news', 'A one-page PDF per state, or all 50 in one PDF', 'One research data file (JSON) for analysts'],
      use: ['Attach a state\'s rules and statute quotes to audit workpapers', 'Filter and compare states in Excel'],
      note: '<strong>Open</strong> views a file in a new browser tab; <strong>Save a copy</strong> sends it to your Downloads folder.'}) +
      '<div class="xdl">' +
      card('Excel workbook', 'Summary, coverage (200 cells), audit fields, audit procedures, audit climate scores, rate-sample rules, law dates, statute quotes, weekly log and news.', openA(office, 'Open in browser') + saveA('downloads/warranty-atlas.xlsx', 'Save .xlsx')) +
      card('All states · PDF', '50 one-page state summaries in one file.', openA('downloads/warranty-atlas-all-states.pdf', 'Open') + saveA('downloads/warranty-atlas-all-states.pdf')) +
      card('Research data · JSON', 'For analysts: every state\'s claim, chargeback, rate-submission, manufacturer-response and penalty rules with statute quotes, in one machine-readable file. Everything else is in the Excel workbook.', openA('data/audit-fields.json', 'Open') + saveA('data/audit-fields.json')) +
      '</div><p class="xfoot">The Excel "Open in browser" button uses Microsoft\'s free online viewer. The workbook is public research data; no SOA data is included.</p>' +
      '<h3 class="xsub">One-page PDF by state</h3><p class="xfoot">Click a state to open its PDF in a new tab. Use the viewer\'s download or print button to keep a copy.</p><div class="xstates">' + AUDIT.map(r => '<a href="downloads/state-pdfs/' + r.state + '.pdf" target="_blank" rel="noopener" title="Open ' + esc(r.name) + ' PDF">' + r.state + '</a>').join('') + '</div>';
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
      {id: 'chargeback', title: 'Audit and chargeback lookback', q: 'How far back can the manufacturer audit and charge back paid claims?', key: r => r.chargebacks.lookback_months == null ? 'none' : String(r.chargebacks.lookback_months), groups: [6, 9, 12].map(n => [String(n), n + ' months', 'Paid claims can be audited and charged back for ' + n + ' months. Fraud is usually excepted.']).concat([['none', 'Not set in statute', 'The statute sets no lookback limit.']])},
      {sec: 'Audit procedures', id: 'auditindex', title: 'Audit climate score', q: 'How restrictive is state law toward audits, chargebacks and rate validation?', key: r => (idxOf(r.state) || {}).tier, tip: r => { const v = idxOf(r.state); return v ? 'Index ' + v.score + ' of 100' : ''; }, groups: TIER_ORDER.map(t => [t, t + ' (' + ((IDX.tiers.find(x => x.name === t) || {}).range || '') + ')', {'Very high': 'The most statutory limits on audits and chargebacks: typically short lookbacks, chargebacks held during appeals and several procedural protections.', 'High': 'Many statutory limits, usually including a hold on chargebacks during appeals or a short lookback.', 'Elevated': 'Several limits, typically clerical-error and documentation protections plus one or two procedural rules.', 'Moderate': 'A few limits, usually a 12-month lookback with clerical-error or documentation protections.', 'Low': 'Few or no statutory limits beyond a lookback window.'}[t]])},
      {id: 'selection', title: 'Selection basis disclosed', q: 'Must the dealer be told why it was selected for audit?', key: r => procAnswer(r.state, 'selection_basis_disclosed', 'req').on ? 'yes' : 'no', tip: r => procAnswer(r.state, 'selection_basis_disclosed', 'req').detail, groups: [
        ['yes', 'Yes', 'The dealer must be told the basis for selecting it (in some states only for certain audits, or at a meeting before chargebacks).'],
        ['no', 'Not in statute', 'The statute doesn\'t require disclosing why the dealer was selected.']]},
      {id: 'notice', title: 'Advance audit notice', q: 'Is written notice required before an audit?', key: r => procAnswer(r.state, 'advance_notice', 'req').on ? 'yes' : 'no', tip: r => procAnswer(r.state, 'advance_notice', 'req').detail, groups: [
        ['yes', 'Yes', 'Written notice is required before the audit begins.'],
        ['no', 'Not in statute', 'The statute doesn\'t require advance notice of an audit.']]},
      {id: 'frequency', title: 'Audit frequency cap', q: 'Does the statute limit how often a dealer can be audited?', key: r => procAnswer(r.state, 'audit_frequency_limit', 'limit').on ? 'yes' : 'no', tip: r => procAnswer(r.state, 'audit_frequency_limit', 'limit').ans, groups: [
        ['yes', 'Yes', 'The statute caps how often audits can occur (for example, once per calendar year).'],
        ['no', 'Not in statute', 'No statutory cap on audit frequency.']]},
      {id: 'written', title: 'Written reasons before a chargeback', q: 'Must the dealer get written grounds for each chargeback?', key: r => procAnswer(r.state, 'written_reasons_before_chargeback', 'req').on ? 'yes' : 'no', groups: [
        ['yes', 'Yes', 'The dealer must get written notice of the specific grounds before a chargeback.'],
        ['no', 'Not in statute', 'No statutory requirement for written grounds before a chargeback.']]},
      {id: 'cure', title: 'Dealer response or cure period', q: 'Does the dealer get time to respond before a chargeback?', key: r => procAnswer(r.state, 'dealer_response_period', 'days').on ? 'yes' : 'no', tip: r => procAnswer(r.state, 'dealer_response_period', 'days').ans, groups: [
        ['yes', 'Yes', 'The statute gives the dealer a set period to respond, rebut or cure before the chargeback. Hover a state code for the period.'],
        ['no', 'Not in statute', 'No statutory response period before a chargeback.']]},
      {id: 'hold', title: 'Chargeback held during appeal', q: 'Is the chargeback held while the dealer appeals?', key: r => procAnswer(r.state, 'chargeback_stayed_pending_appeal', 'req').on ? 'yes' : 'no', groups: [
        ['yes', 'Yes', 'The chargeback can\'t be collected until the dealer\'s appeal, protest or hearing is resolved.'],
        ['no', 'Not in statute', 'The statute doesn\'t hold chargebacks during an appeal.']]},
      {id: 'extrap', title: 'Extrapolating audit results', q: 'Can sample results be projected across other claims?', key: r => (procOf(r.state).extrapolation || {}).rule || 'silent', groups: [
        ['prohibited', 'Prohibited', 'Results from a sample can\'t be projected to other claims.'],
        ['restricted', 'Restricted', 'Projection is allowed only in limited ways (for example, only from a valid random sample, or not across audit periods without consent).'],
        ['silent', 'Not addressed', 'The statute doesn\'t address extrapolation.']]},
      {id: 'clerical', title: 'Clerical-error protection', q: 'Are chargebacks barred for clerical or paperwork errors alone?', key: r => procAnswer(r.state, 'clerical_error_protection', 'req').on ? 'yes' : 'no', groups: [
        ['yes', 'Yes', 'Claims can\'t be denied or charged back solely for clerical, administrative or technical errors when the work was done properly.'],
        ['no', 'Not in statute', 'No statutory clerical-error protection.']]},
      {id: 'ratevalid', title: 'Validating a rate submission', q: 'How far can the manufacturer go to check a retail-rate submission?', key: r => { const p = procOf(r.state), c = p.classification || {}; return c.rate_validation_limited ? 'limited' : (p.rate_submission_audit || {}).allowed === true ? 'broader' : 'none'; }, tip: r => trim((procOf(r.state).rate_submission_audit || {}).limits, 160), groups: [
        ['limited', 'Limited to the submission', 'Only the dealer\'s own submitted ROs can be checked, or the manufacturer gets a single accuracy objection. No request for more ROs or outside data.'],
        ['broader', 'Allowed, with conditions', 'The manufacturer may request additional ROs or information, run periodic reviews, or compare with other dealers, within the statute\'s limits.'],
        ['none', 'No procedure in statute', 'The statute sets no rate-validation procedure.']]}
    ].map(d => {
      const gs = d.groups.map(([k, label, def]) => ({k, label, def, states: []}));
      AUDIT.forEach(r => { const k = d.key(r); const g = gs.find(x => x.k === k); if (g) g.states.push(r); else gs.push({k, label: String(k), def: '', states: [r]}); });
      return Object.assign(d, {gs});
    });
  }
  function renderSummary() {
    const D = dims();
    const sectionInfo = {
      labor: ['Labor rates', 'How rates are set, requested and approved.'],
      hours: ['Paid hours', 'Time guides and multipliers used to calculate labor payment.'],
      parts: ['Parts', 'How warranty parts prices and markups are set.'],
      mfrsc: ['Service contracts & CPO', 'Which coverage types the warranty rules reach.'],
      decision: ['Claims & chargebacks', 'Deadlines for filing, decisions, payment and recovery.'],
      auditindex: ['Audit procedures', 'Statutory limits on audits, chargebacks and rate validation.']
    };
    const sections = [];
    D.forEach(d => {
      if (d.sec) sections.push({id: d.id, title: d.sec, label: sectionInfo[d.id][0], description: sectionInfo[d.id][1], number: String(sections.length + 1).padStart(2, '0'), topics: []});
      sections[sections.length - 1].topics.push(d);
    });
    const menu = '<nav class="xd-jump" aria-label="Summary sections"><span class="xd-jump-label">Jump to a section</span><ul><li><a href="#summary/changes">Law changes</a></li>' + sections.map(g => '<li><a href="#summary/group-' + g.id + '"><span aria-hidden="true">' + g.number + '</span>' + esc(g.label) + '</a></li>').join('') + '<li><a class="xd-jump-definitions" href="#summary/definitions" title="Plain-English definitions and the states behind each count">Definitions ↓</a></li></ul></nav>';
    const bars = d => '<ul class="xd-bars">' + d.gs.map(g => '<li><a href="#summary/' + d.id + '" aria-label="' + esc(g.label + ': ' + g.states.length + ' states. View definitions and states.') + '" title="' + esc(g.label + ': ' + (g.states.map(s => s.state).join(', ') || 'none')) + '"><span class="xd-lab">' + esc(g.label) + '</span><span class="xd-track" aria-hidden="true"><span class="xd-fill" style="width:' + (g.states.length * 2) + '%"></span></span><span class="xd-n">' + g.states.length + '</span></a></li>').join('') + '</ul>';
    const tile = d => '<article class="xd-tile"><h3>' + esc(d.title) + '</h3><p class="xd-q">' + esc(d.q) + '</p><p class="xd-scale">States · out of 50</p>' + bars(d) + '<a class="xd-more" href="#summary/' + d.id + '">Definitions & states ↓</a></article>';
    const tiles = sections.map(g => '<section class="xd-section" id="xs-group-' + g.id + '" tabindex="-1" aria-labelledby="xd-heading-' + g.id + '"><header class="xd-section-head"><span class="xd-section-number" aria-hidden="true">' + g.number + '</span><div><h2 id="xd-heading-' + g.id + '">' + esc(g.title) + '</h2><p>' + esc(g.description) + '</p></div><span class="xd-section-meta">' + g.topics.length + (g.topics.length === 1 ? ' question' : ' questions') + '</span></header><div class="xd-grid">' + g.topics.map(tile).join('') + '</div></section>').join('');
    const detailCard = d => '<section class="xs-card" id="xs-' + d.id + '" tabindex="-1" aria-labelledby="xs-heading-' + d.id + '"><header class="xs-card-head"><h4 id="xs-heading-' + d.id + '">' + esc(d.title) + '</h4><p class="xs-note">' + esc(d.q) + (d.id === 'mfrsc' || d.id === 'cpo' ? ' ' + esc(PROGRAM_SCOPE) : '') + '</p></header><div class="xs-rows">' +
      d.gs.map(g => '<div class="xs-row"><div class="xs-label"><strong>' + esc(g.label) + '</strong><span class="xs-count">' + g.states.length + (g.states.length === 1 ? ' state' : ' states') + '</span></div><div><p class="xs-def">' + esc(g.def) + '</p><div class="xs-chips">' + chips(g.states, d.tip) + '</div></div></div>').join('') +
      '</div><p class="xs-top"><a href="#summary">↑ Back to the dashboard</a></p></section>';
    const detail = sections.map(g => '<section class="xd-detail-group" aria-labelledby="xd-detail-' + g.id + '"><header class="xd-detail-head"><h3 id="xd-detail-' + g.id + '"><span aria-hidden="true">' + g.number + '</span>' + esc(g.title) + '</h3><a href="#summary/group-' + g.id + '">Back to these counts ↑</a></header>' + g.topics.map(detailCard).join('') + '</section>').join('');
    const changes = AUDIT.filter(r => nextChange(r));
    const R = (window.REFERENCE || {}).rules || [], groups = [...new Set(R.map(x => x.group))];
    const original = groups.map(gname => '<h3 class="xs-sub">' + esc(gname) + '</h3><div class="xs-rows">' + R.filter(x => x.group === gname).map(x => { const st = AUDIT.filter(r => ((REF[r.state] || {}).flags || {})[x.id] === true); return '<div class="xs-row"><div class="xs-label"><strong>' + esc(x.name) + '</strong><span class="xs-count">' + st.length + ' states</span></div><div><p class="xs-def">' + esc(trim(x.description, 220)) + '</p><div class="xs-chips">' + chips(st) + '</div></div></div>'; }).join('') + '</div>').join('');
    $('x-summary').innerHTML = intro({cls: 'xd-intro', eyebrow: 'Rule counts across all 50 states', title: 'State Rules Dashboard', lead: 'Rule counts by state: how many states give each answer, what each answer means, and which states they are. Based on the law in effect today (' + fmtDate(TODAY) + ').',
      here: ['Bar counts for every question: labor rates, paid hours, parts, service contracts and CPO, claims and chargebacks, audit procedures', 'A plain-English definition of every answer, with the states that give it', 'Recent (last nine months) and upcoming law changes'],
      use: ['See the national picture in seconds, for example how many states cover manufacturer-backed service contracts', 'Find every state that follows a given rule, then open any state for detail'],
      stamp: (changes.length ? '<strong>Law changes coming up</strong><br>' + changes.map(r => '<a href="#state/' + r.state + '"><strong>' + r.state + '</strong></a> ' + fmtDate(nextChange(r).effective)).join('<br>') : 'No scheduled law changes')}) +
      menu + recentLawsPanel() + '<div class="xd">' + tiles + '</div>' +
      '<section class="xd-definitions" aria-labelledby="xd-definitions-heading"><header class="xd-definitions-head" id="xs-definitions" tabindex="-1"><p class="xd-eyebrow">Behind the counts</p><h2 id="xd-definitions-heading">Definitions and states</h2><p>What each answer means, with links to every state in that group.</p></header>' + detail + '</section>' +
      '<details class="xs-more"><summary>Original September 21 classification (20 rule features)</summary><p class="xs-note">The first-pass research classification. Where it differs from the state pages or the groups above, those are newer and control.</p>' + original + '</details>';
  }
  let jumpBound = false;
  function bindJumpBar() {
    if (jumpBound) return; jumpBound = true;
    let ticking = false;
    const update = () => {
      ticking = false;
      const bar = document.querySelector('#x-summary .xd-jump'); if (!bar || $('x-summary').hidden) return;
      const links = [...bar.querySelectorAll('a[href^="#summary/"]')], h = bar.offsetHeight + 12;
      bar.classList.toggle('stuck', bar.getBoundingClientRect().top <= 1);
      let cur = null;
      links.forEach(a => { const t = $('xs-' + a.getAttribute('href').split('/')[1]); if (t && t.getBoundingClientRect().top <= h + 4) cur = a; });
      links.forEach(a => a.setAttribute('aria-current', a === cur ? 'true' : 'false'));
      const ul = bar.querySelector('ul');
      if (cur && ul && ul.scrollWidth > ul.clientWidth) { const r = cur.getBoundingClientRect(), u = ul.getBoundingClientRect(); if (r.left < u.left || r.right > u.right) ul.scrollLeft += r.left - u.left - 12; }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive: true});
    window.addEventListener('resize', update);
    setTimeout(update, 50);
  }
  function scrollToSection(sec) {
    const t = sec ? $('xs-' + sec) : null;
    if (t) { const bar = document.querySelector('#x-summary .xd-jump'), off = bar ? bar.offsetHeight + 10 : 0; window.scrollTo(0, Math.max(0, t.getBoundingClientRect().top + window.scrollY - off)); t.focus({preventScroll: true}); } else window.scrollTo(0, 0);
  }

  /* ---------- Audit procedures, index, distributor layer ---------- */
  const TIER_FILL = {'Low': '#86b6ef', 'Moderate': '#3987e5', 'Elevated': '#256abf', 'High': '#184f95', 'Very high': '#0d366b'};
  const TIER_INK = {'Low': '#0b1b30', 'Moderate': '#0b1b30', 'Elevated': '#ffffff', 'High': '#ffffff', 'Very high': '#ffffff'};
  const TIER_ORDER = ['Very high', 'High', 'Elevated', 'Moderate', 'Low'];
  const PROC_ROWS = [
    ['advance_notice', 'Advance written notice of audit', 'req'],
    ['selection_basis_disclosed', 'Must tell the dealer why it was selected', 'req'],
    ['audit_frequency_limit', 'Cap on how often audits can occur', 'limit'],
    ['written_reasons_before_chargeback', 'Written reasons before a chargeback', 'req'],
    ['dealer_response_period', 'Dealer response or cure period', 'days'],
    ['internal_appeal', 'Internal appeal required', 'req'],
    ['chargeback_stayed_pending_appeal', 'Chargeback held while the dealer appeals', 'req'],
    ['extrapolation', 'Extrapolating audit results', 'rule'],
    ['clerical_error_protection', 'No chargebacks for clerical or paperwork errors', 'req'],
    ['documentation_limits', 'Limits on documentation requirements', 'req'],
    ['fraud_exception', 'Fraud carve-out from time limits', 'exists'],
    ['rate_submission_audit', 'Validating a retail rate submission', 'rate'],
    ['penalties_for_audit_violations', 'Consequences for improper audits', 'pen']
  ];
  function procOf(abbr) { return PROC[abbr] || {}; }
  function idxOf(abbr) { return (IDX && IDX.states && IDX.states[abbr]) || null; }
  function distOf(abbr) { return (DIST.states || []).find(x => x.state === abbr) || null; }
  function distName(d) { return d ? ((DIST.distributors || {})[d.distributor] || {}).name || d.distributor : ''; }
  function procAnswer(abbr, key, kind) {
    const p = procOf(abbr), v = p[key] || {}, cls = p.classification || {};
    let ans = 'Not in statute', on = false;
    if (kind === 'req') { if (v.required === true) { ans = 'Yes'; on = true; } else if (v.required === false) ans = 'No'; }
    else if (kind === 'limit') { if (v.limit) { ans = v.limit; on = true; } }
    else if (kind === 'days') { if (v.days) { ans = v.days + (abbr === 'KY' ? ' business days' : ' days'); on = true; } }
    else if (kind === 'rule') { ans = {prohibited: 'Prohibited', restricted: 'Restricted', silent: 'Not addressed'}[v.rule] || 'Not addressed'; on = v.rule === 'prohibited' || v.rule === 'restricted'; }
    else if (kind === 'exists') { ans = v.exists === true ? 'Yes' : v.exists === false ? 'No fraud carve-out' : 'Not stated'; on = v.exists === false; }
    else if (kind === 'rate') { ans = cls.rate_validation_limited ? 'Limited to the dealer\'s submission' : v.allowed === true ? 'Allowed, with conditions' : 'No validation procedure in statute'; on = !!cls.rate_validation_limited; }
    else if (kind === 'pen') { ans = cls.audit_consequence ? 'Yes' : (v.detail ? 'Protest or appeal rights only' : 'None specific'); on = !!cls.audit_consequence; }
    const detail = kind === 'rate' ? v.limits : v.detail;
    return {ans, on, detail: detail || '', quote: v.quote, pinpoint: v.pinpoint};
  }
  function tierBadge(t, score) { return '<span class="ki-badge" style="background:' + TIER_FILL[t] + ';color:' + TIER_INK[t] + '">' + (score != null ? score + ' · ' : '') + esc(t) + '</span>'; }
  const fmtPts = x => { x = Math.round(x * 10) / 10; return Number.isInteger(x) ? String(x) : x.toFixed(1); };
  const dots = lv => '<span class="ki-dots" aria-label="level ' + lv + ' of 3">' + '●'.repeat(lv) + '○'.repeat(3 - lv) + '</span>';
  function subLine(v) {
    if (!v || !v.subscores || !IDX.subscores) return '';
    return '<p class="ki-subs">' + IDX.subscores.map(x => '<span><span class="ki-subl">' + esc(x.label) + '</span> <strong>' + v.subscores[x.id] + '</strong><span class="ki-of">/100</span></span>').join('') + '</p>';
  }
  function factorList(abbr, compact) {
    const v = idxOf(abbr); if (!v || !IDX) return '';
    const lv = v.levels || {};
    return '<ul class="ki-factors' + (compact ? ' ki-compact' : '') + '">' + IDX.factors.filter(f => !compact || v.points[f.id] > 0).map(f => {
      const pts = v.points[f.id], L = lv[f.id] || 0;
      return '<li class="' + (pts > 0 ? 'on' : 'off') + '">' + dots(L) + '<span class="ki-flab">' + esc(f.label) + (L && f.levels && f.levels[L] && f.levels[L] !== 'Applies' && !compact ? '<small>' + esc(f.levels[L]) + '</small>' : '') + '</span><span class="ki-pts">' + fmtPts(pts) + ' / ' + fmtPts(f.weight || f.max) + '</span></li>';
    }).join('') + '</ul>';
  }
  function indexMethod() {
    if (!IDX) return '';
    const tiers = IDX.tiers.slice().sort((x, y) => x.min - y.min), B = IDX.buckets || [], SUB = IDX.subscores || [];
    const cell = t => t ? esc(t) : '<span class="ks-muted" aria-label="not used">—</span>';
    return '<details class="ki-method"><summary>How the score works</summary><div class="km-how">' +
      '<p class="km-how-lead">Each of ' + IDX.factors.length + ' limits in state law gets a <strong>level from 0 to 3</strong> (0 = not in the statute, 3 = strongest form). Each limit also has a <strong>weight</strong>; the weights add up to 100.</p>' +
      '<p class="km-formula"><strong>Points = weight × level ÷ 3.</strong> A state\'s score is the sum of its points, from 0 to 100. <strong>Higher = more restrictive.</strong></p>' +
      '<div class="km-tiers" role="list" aria-label="Score tiers">' + tiers.map(t => '<span role="listitem" class="km-tier" style="background:' + TIER_FILL[t.name] + ';color:' + TIER_INK[t.name] + '"><strong>' + esc(t.name) + '</strong> ' + esc(t.range) + '</span>').join('') + '</div>' +
      '<div class="table-scroll km-fscroll"><table class="km-ftable km-ftable2"><thead><tr><th scope="col">Limit in state law</th><th scope="col">Weight</th><th scope="col">Level 3 (full weight)</th><th scope="col">Level 2 (⅔)</th><th scope="col">Level 1 (⅓)</th><th scope="col">Level 0 (none)</th></tr></thead>' +
      SUB.map(sb => '<tbody><tr class="km-fsub"><th scope="rowgroup" colspan="6">Sub-score: ' + esc(sb.label) + ' · ' + fmtPts(sb.max_points) + ' of 100 points<span>' + esc(sb.about) + '</span></th></tr>' +
        B.filter(b => b.subscore === sb.id).map(b => '<tr class="km-fgroup"><th scope="rowgroup" colspan="6">' + esc(b.label) + ' · ' + fmtPts(b.weight) + ' points</th></tr>' +
          IDX.factors.filter(f => f.bucket === b.id).map(f => '<tr><th scope="row">' + esc(f.label) + '</th><td class="km-pts"><span>' + fmtPts(f.weight) + '</span></td>' + [3, 2, 1, 0].map(i => '<td>' + cell(f.levels[i]) + '</td>').join('') + '</tr>').join('')).join('') + '</tbody>').join('') +
      '</table></div><p class="xpin">' + esc(IDX.weights_note || '') + ' A dash means that level isn\'t used for that limit yet. Statute text only; not legal advice and not an assessment of any company\'s audit program.</p></div></details>';
  }
  function distBox(abbr) {
    const d = distOf(abbr); if (!d) return '';
    const provs = (d.provisions || []).slice(0, 4);
    return '<section class="kd-box" aria-label="Distributor-franchised state"><p class="kd-flag">DISTRIBUTOR-FRANCHISED STATE' + (d.coverage === 'partial' ? ' · NORTHERN COUNTIES ONLY' : '') + '</p>' +
      '<p><strong>' + esc(distName(d)) + '</strong> (' + esc(((DIST.distributors || {})[d.distributor] || {}).hq || '') + ') franchises Subaru dealers ' + (d.coverage === 'partial' ? 'in the 11 northern New Jersey counties' : 'in this state') + ', not the manufacturer\'s U.S. company. ' + esc(d.area_note || '') + ' ' + esc(((DIST.distributors || {})[d.distributor] || {}).entity_note || '') + '</p>' +
      '<p>' + esc(d.plain_english) + '</p><p class="kd-impact">' + esc(DIST.impact || '') + '</p>' +
      '<details class="kf-more"><summary>Statute text on distributors</summary><div class="kf-detail">' + (d.duties_quote ? quoteBlock({quote: d.duties_quote, pinpoint: d.duties_pinpoint}) : '') +
      provs.map(o => '<p>' + esc(o.summary) + '</p>' + (o.quote ? quoteBlock(o) : '')).join('') + '<p class="xpin">Confidence: ' + esc(d.confidence) + (safeUrl(d.official_url) ? ' · ' + link(d.official_url, 'Official text') : '') + '</p></div></details></section>';
  }
  function auditSection(abbr) {
    const v = idxOf(abbr), cases = CASES ? CASES.items.filter(c => (c.states || []).includes(abbr)) : [];
    const rows = PROC_ROWS.map(([k, label, kind]) => {
      const a = procAnswer(abbr, k, kind);
      const det = (a.detail ? '<p>' + esc(a.detail) + '</p>' : '') + (a.quote ? quoteBlock({quote: a.quote, pinpoint: a.pinpoint}) : (a.pinpoint ? '<p class="xpin">' + esc(a.pinpoint) + '</p>' : ''));
      return '<tr><th scope="row">' + esc(label) + '</th><td><span class="kp-ans' + (a.on ? ' on' : '') + '">' + esc(a.ans) + '</span>' + (det ? '<details class="kf-more"><summary>Details</summary><div class="kf-detail">' + det + '</div></details>' : '') + '</td></tr>';
    }).join('');
    const p = procOf(abbr);
    return '<div class="ks-sectionhead" id="kf-audit"><h2>Audit procedures</h2><a class="ks-maplink" href="#map">See all states on the audit climate map →</a></div>' +
      (v ? '<div class="ki-card"><div class="ki-score"><span class="ki-num">' + v.score + '</span><span class="ki-of">/ ' + IDX.max + '</span></div><div class="ki-text"><p class="ki-title">Audit climate score ' + tierBadge(v.tier) + '</p><p class="xs-note">How restrictive state law is toward warranty audits, chargebacks and rate validation here (higher = more restrictive). Rank ' + v.rank + ' of 50 (1 = most restrictive). Statute text only.</p>' + subLine(v) + factorList(abbr, false) + indexMethod() + '</div></div>' : '') +
      '<div class="table-scroll"><table class="xtable kp-table"><tbody>' + rows + '</tbody></table></div>' +
      '<p class="xpin">Confidence: ' + esc(p.confidence || '') + (p.notes ? '. ' + esc(trim(p.notes, 400)) : '') + '</p>' +
      (cases.length ? '<div class="ks-sectionhead"><h2>Cases and laws for this state</h2><a class="ks-maplink" href="#cases">All cases →</a></div><ul class="kc-mini">' + cases.map(c => '<li><a href="#cases/' + esc(c.id) + '">' + esc(c.title) + '</a><span class="xpin"> · ' + esc(c.forum) + ' · ' + esc(c.date) + '</span></li>').join('') + '</ul>' : '');
  }

  /* ---------- Map: U.S. Audit Climate ---------- */
  let MAPGEO = null;
  const CALLOUTS = [['VT', 92], ['NH', 116], ['MA', 140], ['RI', 164], ['CT', 188], ['NJ', 214], ['DE', 240], ['MD', 266]];
  function renderMap() {
    const box = $('x-map');
    box.innerHTML = intro({eyebrow: 'Audit climate score', title: 'Map: U.S. Audit Climate', lead: 'How restrictive each state\'s law is toward manufacturer warranty audits, chargebacks and retail-rate validation. <strong>Darker = more restrictive.</strong>',
      here: ['An audit climate score (0–100) built from 14 limits in state law, such as short lookback windows, chargebacks held during appeals and clerical-error protections', 'Hover a state for its score; click it for exactly how it was scored', 'Distributor-franchised states outlined, and every state ranked below the map'],
      use: ['Compare states quickly when planning audits and chargeback reviews', 'Know where to expect more procedural steps and a higher bar before a chargeback sticks', 'Open any state\'s full rules from its popup, or see every state side by side in the <a href="#states">State-by-State Matrix</a>'],
      note: 'Built from statute text only (' + fmtDate(IDX.checked) + '). Not legal advice and not an assessment of any company\'s audit program.'}) +
      '<div class="km-wrap"><div class="km-mapcol"><div class="km-mapbox"><div class="km-map" id="kmMap"><div class="xloading">Loading map…</div></div>' +
      '<label class="km-toggle"><input type="checkbox" id="kmDist" checked><span class="km-sw km-sw-dist" aria-hidden="true"></span><span>Outline distributor-franchised states<small>NJ: northern counties only</small></span></label></div>' +
      '<div class="km-legend" aria-label="Legend">' + TIER_ORDER.slice().reverse().map(t => '<span class="km-key"><span class="km-sw" style="background:' + TIER_FILL[t] + '"></span>' + esc(t) + ' <small>' + esc((IDX.tiers.find(x => x.name === t) || {}).range || '') + '</small></span>').join('') +
      '</div></div>' +
      '<aside class="km-panel" id="kmPanel" aria-live="polite"><p class="km-hint">Click a state to see how it was scored.</p></aside></div>' +
      '<div class="km-tip" id="kmTip" hidden></div>' +
      '<div class="ks-sectionhead"><h2>All states, ranked</h2><div class="km-sort"><button type="button" class="quiet" data-sort="score" aria-pressed="true">Most limits first</button><button type="button" class="quiet" data-sort="name" aria-pressed="false">A–Z</button></div></div>' +
      '<div class="table-scroll xtable-scroll"><table class="xtable km-table"><thead><tr><th scope="col">Rank</th><th scope="col">State</th><th scope="col">Score</th><th scope="col">Chargeback limits</th><th scope="col">Process and oversight</th><th scope="col">Limits that earned points</th></tr></thead><tbody id="kmBody"></tbody></table></div>' +
      indexMethod();
    drawRank('score');
    box.querySelectorAll('[data-sort]').forEach(b => b.addEventListener('click', () => { box.querySelectorAll('[data-sort]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); drawRank(b.dataset.sort); }));
    $('kmDist').addEventListener('change', e => { const g = $('kmDistG'); if (g) g.style.display = e.target.checked ? '' : 'none'; });
    const get = MAPGEO ? Promise.resolve(MAPGEO) : fetch('data/us-states-map.json').then(r => { if (!r.ok) throw new Error('map ' + r.status); return r.json(); });
    get.then(g => { MAPGEO = g; drawMap(); }).catch(err => { $('kmMap').innerHTML = '<p class="xerror">Could not load the map (' + esc(err.message) + '). The ranked table below has the same scores.</p>'; });
  }
  function drawRank(by) {
    const rows = AUDIT.slice().sort(by === 'name' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => (idxOf(a.state).rank - idxOf(b.state).rank));
    $('kmBody').innerHTML = rows.map(r => {
      const v = idxOf(r.state), d = distOf(r.state);
      const earned = IDX.factors.filter(f => v.points[f.id] > 0).map(f => f.label);
      return '<tr><td>' + v.rank + '</td><th scope="row"><a class="ks-state" href="#state/' + r.state + '">' + esc(r.name) + ' <span class="abbr">' + r.state + '</span></a>' + (d ? '<span class="ks-dist">Distributor' + (d.coverage === 'partial' ? ' (north)' : '') + '</span>' : '') + '</th><td>' + tierBadge(v.tier, v.score) + '</td><td class="km-sub">' + (v.subscores ? v.subscores.limits : '') + '</td><td class="km-sub">' + (v.subscores ? v.subscores.process : '') + '</td><td>' + (earned.length ? esc(earned.join(' · ')) : '<span class="ks-muted">None</span>') + '</td></tr>';
    }).join('');
  }
  function drawMap() {
    const G = MAPGEO, S = G.states, callout = new Set(CALLOUTS.map(c => c[0]));
    let paths = '', labels = '', lines = '', dist = '';
    Object.keys(S).forEach(ab => {
      const v = idxOf(ab), r = byAbbr[ab]; if (!v || !r) return;
      paths += '<path class="km-st" d="' + S[ab].d + '" fill="' + TIER_FILL[v.tier] + '" data-st="' + ab + '" tabindex="0" role="button" aria-label="' + esc(r.name + ': audit climate score ' + v.score + ', ' + v.tier) + '"></path>';
      if (distOf(ab)) dist += '<path class="km-dline' + (distOf(ab).coverage === 'partial' ? ' km-dpart' : '') + '" d="' + S[ab].d + '"></path>';
      if (!callout.has(ab)) {
        let x = S[ab].cx, y = S[ab].cy;
        if (ab === 'HI') { x += 34; y -= 26; }
        if (ab === 'FL') { x += 18; }
        if (ab === 'LA') { x -= 12; }
        if (ab === 'MI') { x += 14; y += 26; }
        const ink = ab === 'HI' ? '#0b1b30' : TIER_INK[v.tier];
        labels += '<text class="km-lab" x="' + x + '" y="' + (y - 2) + '" fill="' + ink + '">' + ab + '</text><text class="km-num" x="' + x + '" y="' + (y + 11) + '" fill="' + ink + '">' + v.score + '</text>';
      }
    });
    CALLOUTS.forEach(([ab, y]) => {
      const v = idxOf(ab), s = S[ab]; if (!v || !s) return;
      lines += '<line class="km-lead" x1="' + s.cx + '" y1="' + s.cy + '" x2="982" y2="' + y + '"></line>';
      labels += '<g class="km-call" data-st="' + ab + '"><rect x="982" y="' + (y - 10) + '" width="66" height="20" rx="4" fill="' + TIER_FILL[v.tier] + '"></rect><text class="km-clab" x="1015" y="' + (y + 4) + '" fill="' + TIER_INK[v.tier] + '">' + ab + ' ' + v.score + '</text></g>';
    });
    $('kmMap').innerHTML = '<svg viewBox="0 0 1056 610" class="km-svg" role="group" aria-label="U.S. map of the audit climate score by state">' +
      '<g class="km-states">' + paths + '</g><g id="kmDistG" class="km-dist" aria-hidden="true">' + dist + '</g>' +
      '<g class="km-hl" aria-hidden="true"><path id="kmSelO" class="km-sel-o" d=""></path><path id="kmSelI" class="km-sel-i" d=""></path><path id="kmHovO" class="km-hov-o" d=""></path><path id="kmHovI" class="km-hov-i" d=""></path></g>' +
      '<g aria-hidden="true">' + lines + labels + '</g></svg>';
    const svg = $('kmMap').querySelector('svg'), tip = $('kmTip');
    const show = (ab, ev) => {
      const v = idxOf(ab), r = byAbbr[ab]; if (!v) return;
      tip.innerHTML = '<strong>' + esc(r.name) + '</strong> ' + tierBadge(v.tier, v.score) + (distOf(ab) ? '<span class="km-tipd">Distributor-franchised' + (distOf(ab).coverage === 'partial' ? ' (northern counties)' : '') + '</span>' : '') + factorList(ab, true) + '<span class="km-tiphint">Click for full breakdown</span>';
      tip.hidden = false;
      const wrap = $('x-map').getBoundingClientRect();
      let x, y;
      if (ev && ev.clientX != null) { x = ev.clientX - wrap.left + 16; y = ev.clientY - wrap.top + 16; }
      else { const b = ev.target.getBoundingClientRect(); x = b.right - wrap.left + 8; y = b.top - wrap.top; }
      const w = tip.offsetWidth; if (x + w > wrap.width) x = Math.max(8, x - w - 32);
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    };
    /* Outlines are drawn on a layer above every state, so neighbours can't paint over them. */
    const outline = (o, i, ab) => { const d = ab && S[ab] ? S[ab].d : ''; $(o).setAttribute('d', d); $(i).setAttribute('d', d); };
    let hovered = '';
    const hover = ab => { if (ab === hovered) return; hovered = ab || ''; outline('kmHovO', 'kmHovI', hovered); };
    const hide = () => { tip.hidden = true; hover(''); };
    const pick = ab => {
      svg.querySelectorAll('.km-st.sel').forEach(p => p.classList.remove('sel'));
      const el = svg.querySelector('.km-st[data-st="' + ab + '"]'); if (el) el.classList.add('sel');
      outline('kmSelO', 'kmSelI', ab);
      const v = idxOf(ab), r = byAbbr[ab], d = distOf(ab);
      $('kmPanel').innerHTML = '<p class="xd-eyebrow">Selected state</p><h2>' + esc(r.name) + ' <span class="abbr">' + ab + '</span></h2><div class="ki-score"><span class="ki-num">' + v.score + '</span><span class="ki-of">/ ' + IDX.max + '</span></div>' + tierBadge(v.tier) + '<p class="xs-note">Rank ' + v.rank + ' of 50 (1 = most restrictive).</p>' + subLine(v) +
        (d ? '<p class="km-pd"><strong>Distributor-franchised' + (d.coverage === 'partial' ? ' (northern counties only)' : '') + ':</strong> ' + esc(distName(d).replace(/\.$/, '')) + '. The rules apply to the franchisor that holds the dealer\'s franchise.</p>' : '') +
        factorList(ab, false) + '<p class="km-acts"><a class="xbtn-open" href="#state/' + ab + '">Open ' + esc(r.name) + ' →</a><button type="button" class="xbtn-save xcmp-btn" data-cmp-toggle="' + ab + '">+ Add to compare</button></p>';
      cmpUI();
      if (window.innerWidth < 900) $('kmPanel').scrollIntoView({behavior: 'smooth', block: 'nearest'});
    };
    svg.addEventListener('mousemove', e => { const t = e.target.closest('[data-st]'); if (t) { hover(t.dataset.st); show(t.dataset.st, e); } else hide(); });
    svg.addEventListener('mouseleave', hide);
    svg.addEventListener('click', e => { const t = e.target.closest('[data-st]'); if (t) { hide(); pick(t.dataset.st); } });
    svg.addEventListener('focusin', e => { const t = e.target.closest('[data-st]'); if (t) { hover(t.dataset.st); show(t.dataset.st, e); } });
    svg.addEventListener('focusout', hide);
    svg.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.st) { e.preventDefault(); hide(); pick(e.target.dataset.st); } });
  }

  /* ---------- Cases and laws ---------- */
  const TOPIC_LABEL = {'rate submission — labor': 'Rate submission · labor', 'rate submission — parts': 'Rate submission · parts', 'rate validation/audit': 'Rate validation', 'warranty audit/chargeback': 'Audit and chargeback', 'cost recovery/surcharge': 'Cost recovery / surcharge', 'constitutional/preemption': 'Constitutional challenge', 'legislation': 'Legislation'};
  const TOPIC_ORDER = ['rate submission — labor', 'rate submission — parts', 'rate validation/audit', 'warranty audit/chargeback', 'legislation', 'cost recovery/surcharge', 'constitutional/preemption'];
  function verLabel(v) { v = String(v || ''); return /primary/.test(v) ? 'Primary source read' : /secondary/.test(v) ? 'Secondary sources only' : 'Partially verified'; }
  let kcTopic = '';
  function renderCases() {
    const I = CASES.items, sts = [...new Set(I.flatMap(c => c.states || []))].sort();
    const topics = [...new Set(I.map(c => c.topic))].sort((a, b) => (TOPIC_ORDER.indexOf(a) + 99) % 99 - (TOPIC_ORDER.indexOf(b) + 99) % 99);
    const forumShort = f => String(f || '').split(' (')[0];
    const caseRow = c => row({id: 'case-' + c.id, flag: c.featured ? 'Start here: ' + c.featured : '', tag: /primary/.test(String(c.verification)) ? '' : verLabel(c.verification), outline: true,
      meta: (c.states || []).map(stLink).join(' ') + ' <span>' + esc([fmtDate(c.date), forumShort(c.forum), c.manufacturer].filter(Boolean).join(' · ')) + '</span>',
      title: extLink(c.primary_url, c.title), why: '<strong>Why it matters:</strong> ' + esc(lead(c.why_it_matters, 260)),
      more: para('Why it matters', c.why_it_matters) + para('What happened', c.summary) + (c.quote ? '<blockquote class="statute-quote">' + esc(c.quote) + '</blockquote>' : '') +
        para('Forum', c.forum) + para('Docket or citation', c.docket) + para('Verification', verLabel(c.verification)) + para('Research notes', c.notes) +
        '<p class="xpin">' + [safeUrl(c.primary_url) ? extLink(c.primary_url, 'Primary source') : ''].concat((c.secondary_urls || []).slice(0, 3).map((u, i) => link(u, 'Source ' + (i + 2)))).filter(Boolean).join(' · ') + '</p>'});
    $('x-cases').innerHTML = intro({eyebrow: 'Key decisions and legislation', title: 'Cases & Laws', lead: 'Leading decisions and statutes on rate submissions, rate validation, audits, chargebacks and cost recovery.',
      here: ['Board decisions, court cases and statutes grouped by topic, with one line on why each matters', 'Open Details for the full summary, key quote and sources, and how each item was verified', 'Filters by topic and state'],
      use: ['Learn what boards and courts accept as evidence, for example Putnam Ford v. Ford on proving a rate request inaccurate', 'Point Legal to the right precedent when a rate or audit dispute comes up'],
      note: 'Research notes, not legal advice.', stamp: I.length + ' items<br>Checked <strong>' + fmtDate(CASES.checked) + '</strong>'}) +
      '<div class="xtools kc-tools"><div class="xpills" role="group" aria-label="Filter by topic"><button type="button" class="xpill" data-topic="">All topics<span>' + I.length + '</span></button>' +
      topics.map(t => '<button type="button" class="xpill" data-topic="' + esc(t) + '">' + esc(TOPIC_LABEL[t] || t) + '<span>' + I.filter(c => c.topic === t).length + '</span></button>').join('') + '</div>' +
      '<label>State<select id="kcState"><option value="">All states</option>' + sts.map(s => '<option value="' + s + '">' + esc((byAbbr[s] || {}).name || s) + '</option>').join('') + '</select></label></div>' +
      '<p class="xcount" id="kcCount" aria-live="polite"></p><div id="kcList"></div>' +
      (CASES.not_found && CASES.not_found.length ? '<details class="xs-more"><summary>What we looked for and could not verify (' + CASES.not_found.length + ')</summary><ul>' + CASES.not_found.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>' : '');
    const draw = () => {
      const s = $('kcState').value;
      document.querySelectorAll('#x-cases .xpill').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.topic === kcTopic)));
      const L = I.filter(c => (!kcTopic || c.topic === kcTopic) && (!s || (c.states || []).includes(s)));
      $('kcCount').textContent = 'Showing ' + L.length + ' of ' + I.length + ' items';
      $('kcList').innerHTML = topics.filter(t => L.some(c => c.topic === t)).map(t => {
        const G = L.filter(c => c.topic === t).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.date < b.date ? 1 : -1));
        return '<section class="xr-group"><h3 class="xr-gh">' + esc(TOPIC_LABEL[t] || t) + ' <span>' + G.length + '</span></h3><div class="xr-list">' + G.map(caseRow).join('') + '</div></section>';
      }).join('') || '<p class="xempty">No items match. Clear a filter.</p>';
    };
    document.querySelectorAll('#x-cases .xpill').forEach(b => b.addEventListener('click', () => { kcTopic = b.dataset.topic; draw(); }));
    $('kcState').addEventListener('input', draw);
    renderCases.draw = draw;
    draw();
  }
  function focusCase(id) {
    let el = $('case-' + id);
    if (!el && renderCases.draw) { kcTopic = ''; const s = $('kcState'); if (s) s.value = ''; renderCases.draw(); el = $('case-' + id); }
    if (!el) return;
    const d = el.querySelector('details'); if (d) d.open = true;
    window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 12)); el.focus({preventScroll: true});
    el.classList.add('kc-hl'); setTimeout(() => el.classList.remove('kc-hl'), 2200);
  }

  function init() { buildShell(); route(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
