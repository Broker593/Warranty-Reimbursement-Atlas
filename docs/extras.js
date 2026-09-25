/* Warranty Atlas extras: Audit fields, Weekly checks, News, Downloads,
   and law-date enrichment of the state drawer. Data lives in docs/data/*.json.
   Independent of app.js; it only reads #stateTitle / #stateContent when the drawer opens. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = u => /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim().split(/\s+/)[0] : '';
  const link = (u, label) => { const s = safeUrl(u); return s ? '<a href="' + esc(s) + '" target="_blank" rel="noopener noreferrer">' + esc(label || 'Source') + ' ↗</a>' : ''; };
  const fmtDate = d => { if (!d) return ''; const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d); if (!m) return esc(d); const dt = new Date(+m[1], +m[2] - 1, +m[3]); return dt.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}); };
  const TABS = [
    ['atlas', 'Rules atlas'], ['audit', 'Audit fields'],
    ['weekly', 'Weekly checks'], ['news', 'News'], ['downloads', 'Downloads']
  ];
  const EXCL = {
    MAINT: 'Routine maintenance', TIRES: 'Tires', ALIGN: 'Alignments', INSPECT: 'State inspections',
    RECON: 'New-vehicle prep / used reconditioning', ACCESS: 'Accessory installation', BODY: 'Collision / body / glass',
    GOODWILL: 'Goodwill / policy', DISCOUNT: 'Discounted / promotional / menu-priced', FLEET: 'Fleet',
    GOVT: 'Government', INTERNAL: 'Internal / dealer-owned', SVC_CONTRACT: 'Service-contract / third-party paid',
    WARRANTY: 'Warranty / recall', INSURANCE: 'Insurance-paid', NO_CHARGE: 'No-charge', ENGINE_TRANS: 'Engine / transmission assembly',
    DETAIL: 'Detailing / washing', OTHER: 'Other statutory exclusion (read the text)'
  };
  let AUDIT = [], WEEKLY = null, NEWS = null, loaded = false;
  const byAbbr = {}, byName = {};

  function yesNo(v, yes, no) { return v === true ? yes : v === false ? no : 'Silent'; }
  function days(v) { return v == null ? '—' : v + ' days'; }
  function sampleText(r) {
    const c = r.calc || {}, s = (r.rate_submission || {}).sample || {};
    if (c.mode === 'calendar_month') return 'Prior calendar month';
    if (c.mode === 'none') return 'No labor sample';
    if (c.mode === 'ro_only') return (c.ro_count || 100) + ' ROs';
    const bits = (c.ro_count ? c.ro_count + ' ROs' : '') + (c.days ? ' / ' + c.days + ' days' : '');
    const how = {fewer: 'fewer', greater_rate: 'higher rate', dealer_choice: 'dealer picks'}[c.mode] || '';
    return bits + (how ? ' · ' + how : '') + (c.max_age_days ? ' · ≤' + c.max_age_days + 'd old' : '');
  }
  function amended(r) {
    const d = r.law_dates || {};
    if (!d.last_amended_year) return 'Unknown';
    return d.last_amended_year + (d.last_amendment_effective ? ' (eff. ' + fmtDate(d.last_amendment_effective) + ')' : '');
  }
  function nextChange(r) { const n = (r.law_dates || {}).next_scheduled_change; return n && n.effective ? n : null; }

  /* ---------- shell ---------- */
  function buildShell() {
    const dateBar = document.querySelector('.date-bar');
    if (!dateBar || $('xnav')) return;
    const nav = document.createElement('nav');
    nav.id = 'xnav'; nav.className = 'xnav'; nav.setAttribute('aria-label', 'Atlas sections');
    nav.innerHTML = TABS.map(([id, label]) => '<a href="#' + id + '" data-tab="' + id + '">' + esc(label) + '</a>').join('');
    dateBar.parentNode.insertBefore(nav, dateBar);
    const host = document.createElement('div');
    host.id = 'xpanels';
    host.innerHTML = TABS.slice(1).map(([id, label]) => '<section id="x-' + id + '" class="xpanel" hidden aria-label="' + esc(label) + '"><div class="xloading">Loading…</div></section>').join('');
    const ws = document.querySelector('.workspace');
    ws.parentNode.insertBefore(host, ws);
    const dlg = document.createElement('dialog');
    dlg.id = 'auditDialog'; dlg.className = 'state-dialog'; dlg.setAttribute('aria-labelledby', 'auditTitle');
    dlg.innerHTML = '<div class="dialog-top"><div><span class="eyebrow">AUDIT FIELDS</span><h2 id="auditTitle"></h2></div><button class="close-button" id="auditClose" aria-label="Close audit fields">×</button></div><div id="auditContent"></div>';
    document.body.appendChild(dlg);
    $('auditClose').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    window.addEventListener('hashchange', route);
  }
  function currentTab() { const h = (location.hash || '').replace(/^#/, '').split(/[?&]/)[0]; return TABS.some(t => t[0] === h) ? h : 'atlas'; }
  function hashParam(k) { const m = new RegExp('[?&]' + k + '=([^&]+)').exec(location.hash); return m ? decodeURIComponent(m[1]) : ''; }
  function route() {
    const tab = currentTab();
    document.querySelectorAll('#xnav a').forEach(a => { const on = a.dataset.tab === tab; a.setAttribute('aria-current', on ? 'page' : 'false'); });
    const atlasOnly = ['.workspace', '#coverage', '.date-bar', '#warrantyContext', '#laborContext'];
    atlasOnly.forEach(sel => document.querySelectorAll(sel).forEach(el => {
      if (tab === 'atlas') { if (el.dataset.xhid) { el.hidden = el.dataset.xhid === 'was-hidden'; delete el.dataset.xhid; } }
      else if (!el.dataset.xhid) { el.dataset.xhid = el.hidden ? 'was-hidden' : 'shown'; el.hidden = true; }
    }));
    TABS.slice(1).forEach(([id]) => { $('x-' + id).hidden = id !== tab; });
    if (tab !== 'atlas') ensureData().then(() => render(tab));
  }
  function ensureData() {
    if (loaded) return Promise.resolve();
    const get = p => fetch(p + '?v=' + Date.now().toString(36).slice(0, 6)).then(r => { if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); });
    return Promise.all([get('data/audit-fields.json'), get('data/weekly-checks.json'), get('data/news.json')]).then(([a, w, n]) => {
      AUDIT = a; WEEKLY = w; NEWS = n; loaded = true;
      AUDIT.forEach(r => { byAbbr[r.state] = r; byName[r.name.toLowerCase()] = r; });
    }).catch(err => {
      TABS.slice(1).forEach(([id]) => { $('x-' + id).innerHTML = '<p class="xerror">Could not load research data (' + esc(err.message) + '). Reload the page to try again.</p>'; });
      throw err;
    });
  }
  const rendered = {};
  function render(tab) {
    if (tab === 'audit') renderAudit();
    else if (!rendered[tab]) { rendered[tab] = true; ({weekly: renderWeekly, news: renderNews, downloads: renderDownloads})[tab](); }
  }

  /* ---------- Audit fields ---------- */
  let auditBuilt = false;
  function renderAudit() {
    const p = $('x-audit');
    if (!auditBuilt) {
      auditBuilt = true;
      p.innerHTML = '<div class="xhead"><div><h2>Audit fields · 50 states</h2><p>Claim deadlines, chargeback windows, rate-submission rules, manufacturer response and challenge rules, and penalties, taken from statute text. <strong>Blank or “Silent” means the statute says nothing</strong>; contracts or regulations may still apply.</p></div><div class="xstamp">Audit fields verified <strong>Sep 25, 2026</strong><br>Coverage cells verified <strong>Sep 24–25, 2026</strong></div></div>' +
        '<div class="xtools"><label class="search"><span aria-hidden="true">⌕</span><input id="auditSearch" type="search" placeholder="Search a state…" aria-label="Search states"></label>' +
        '<label>Late claims<select id="auditDeemed"><option value="">Any</option><option value="yes">Deemed approved</option><option value="none">No deemed-approval rule</option></select></label>' +
        '<label>Rate sample<select id="auditSample"><option value="">Any</option><option value="fewer">Fewer of ROs/days</option><option value="dealer_choice">Dealer picks</option><option value="greater_rate">Higher rate</option><option value="calendar_month">Prior month</option><option value="ro_only">RO count only</option><option value="none">No labor sample</option></select></label>' +
        '<label class="toggle-label"><input type="checkbox" id="auditUpcoming"> Scheduled change only</label>' +
        '<button class="quiet" id="auditCsv">Download table (CSV) ↓</button></div>' +
        '<p class="xcount" id="auditCount" aria-live="polite"></p>' +
        '<div class="table-scroll xtable-scroll" tabindex="0" role="region" aria-label="Audit fields table"><table class="xtable" id="auditTable"><thead><tr>' +
        ['State', 'Claim decision', 'Payment', 'Chargeback window', 'Rate resubmission', 'Rate sample', 'Mfr response to rate', 'Law last amended', 'Last verified'].map(h => '<th scope="col">' + h + '</th>').join('') +
        '</tr></thead><tbody id="auditBody"></tbody></table></div><p class="xfoot">Click a state for statute quotes, pinpoint cites, challenge standards, penalties and notes. Deadlines count from receipt unless the detail says otherwise.</p>';
      ['auditSearch', 'auditDeemed', 'auditSample', 'auditUpcoming'].forEach(id => $(id).addEventListener('input', drawAudit));
      $('auditCsv').addEventListener('click', auditCsv);
      $('auditBody').addEventListener('click', e => { const b = e.target.closest('[data-audit]'); if (b) openAudit(b.dataset.audit); });
    }
    drawAudit();
    const s = hashParam('state'); if (s && byAbbr[s]) openAudit(s);
  }
  function auditRows() {
    const q = ($('auditSearch').value || '').trim().toLowerCase(), dm = $('auditDeemed').value, sm = $('auditSample').value, up = $('auditUpcoming').checked;
    return AUDIT.filter(r => {
      if (q && !(r.name.toLowerCase().includes(q) || r.state.toLowerCase() === q)) return false;
      const d = r.claims.deemed_approved_if_late;
      if (dm === 'yes' && d !== true) return false;
      if (dm === 'none' && d === true) return false;
      if (sm && r.calc.mode !== sm) return false;
      if (up && !nextChange(r)) return false;
      return true;
    });
  }
  function drawAudit() {
    const rows = auditRows();
    $('auditCount').textContent = rows.length + ' of 50 states shown';
    $('auditBody').innerHTML = rows.map(r => {
      const c = r.claims, cb = r.chargebacks, rs = r.rate_submission, mr = r.manufacturer_response, n = nextChange(r);
      return '<tr><th scope="row"><button class="state-name" data-audit="' + r.state + '"><span class="state-text">' + esc(r.name) + '</span><span class="abbr">' + r.state + '</span></button>' + (r.confidence && r.confidence !== 'high' ? '<span class="xflag">Confidence: ' + esc(r.confidence) + '</span>' : '') + '</th>' +
        '<td>' + days(c.decision_deadline_days) + '<small>' + esc((c.deemed_approved_if_late === true ? 'Late = deemed approved' : 'No deemed-approval rule')) + '</small></td>' +
        '<td>' + days(c.payment_deadline_days) + (c.payment_deadline_trigger ? '<small>' + esc(c.payment_deadline_trigger) + '</small>' : '') + '</td>' +
        '<td>' + (cb.lookback_months != null ? cb.lookback_months + ' months' : 'Silent') + (cb.fraud_extension ? '<small>Fraud: ' + esc(trim(cb.fraud_extension, 60)) + '</small>' : '') + '</td>' +
        '<td>' + esc(rs.frequency_limit ? trim(rs.frequency_limit, 70) : 'Silent') + '</td>' +
        '<td>' + esc(sampleText(r)) + '</td>' +
        '<td>' + days(mr.response_deadline_days) + '<small>' + esc((mr.deemed_approved_if_no_response === true ? 'No response = approved' : 'No deemed-approval rule')) + '</small></td>' +
        '<td>' + esc(amended(r)) + (n ? '<small class="xnext">Change eff. ' + fmtDate(n.effective) + '</small>' : '') + '</td>' +
        '<td>' + fmtDate(r.verified.audit_fields) + (r.verified.last_change_check ? '<small>Checked for changes ' + fmtDate(r.verified.last_change_check) + '</small>' : '') + '</td></tr>';
    }).join('') || '<tr><td colspan="9" class="xempty">No states match. Clear a filter.</td></tr>';
  }
  function trim(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
  function quoteBlock(b) {
    if (!b) return '';
    let h = b.quote ? '<blockquote class="statute-quote">' + esc(b.quote) + '</blockquote><p class="xpin">' + esc(b.pinpoint || '') + '</p>' : '';
    (b.more_quotes || []).forEach(m => { if (m && m.quote) h += '<blockquote class="statute-quote">' + esc(m.quote) + '</blockquote><p class="xpin">' + esc(m.pinpoint || '') + '</p>'; });
    return h;
  }
  function kv(pairs) { return '<dl class="xkv">' + pairs.filter(p => p[1] != null && p[1] !== '').map(p => '<dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd>').join('') + '</dl>'; }
  function openAudit(abbr) {
    const r = byAbbr[abbr]; if (!r) return;
    const c = r.claims, cb = r.chargebacks, rs = r.rate_submission, mr = r.manufacturer_response, pe = r.penalties, ld = r.law_dates || {}, n = nextChange(r);
    $('auditTitle').textContent = r.name + ' · ' + r.state;
    $('auditContent').innerHTML =
      '<div class="state-summary"><div class="statute">' + esc((r.cites || []).join(' · ')) + '</div>' +
      '<p><strong>Law last amended:</strong> ' + esc(amended(r)) + (ld.last_amending_act ? ' — ' + esc(ld.last_amending_act) : '') + (ld.originally_enacted_year ? '. Originally enacted ' + esc(ld.originally_enacted_year) + '.' : '') + '</p>' +
      (n ? '<p class="xnextbox"><strong>Scheduled change · effective ' + fmtDate(n.effective) + ':</strong> ' + esc(n.act || '') + ' — ' + esc(n.summary || '') + '</p>' : '') +
      '<p><strong>Last verified:</strong> audit fields ' + fmtDate(r.verified.audit_fields) + '; coverage cells ' + fmtDate(r.verified.coverage) + (r.verified.last_change_check ? '. Last weekly check for law changes: ' + fmtDate(r.verified.last_change_check) : '') + '. Source: ' + esc(r.source_quality) + '. Confidence: ' + esc(r.confidence) + '.</p>' +
      '<div class="xbtns"><a class="quiet" href="downloads/state-pdfs/' + r.state + '.pdf" target="_blank" rel="noopener">Open one-page PDF ↗</a>' + link(r.official_url, 'Official text') + '</div></div>' +
      '<div class="state-sections">' +
      sec('Claims', kv([['Decision deadline', days(c.decision_deadline_days)], ['Late claims', c.deemed_approved_if_late === true ? 'Deemed approved' : 'No deemed-approval rule in statute'], ['Payment deadline', c.payment_deadline_days != null ? days(c.payment_deadline_days) + (c.payment_deadline_trigger ? ' (' + c.payment_deadline_trigger + ')' : '') : '—'], ['Dealer filing deadline', c.dealer_filing_deadline || 'Silent'], ['Resubmission', c.resubmission_rights], ['Denial requirements', c.denial_requirements]]) + quoteBlock(c)) +
      sec('Audits and chargebacks', kv([['Lookback window', cb.lookback_months != null ? cb.lookback_months + ' months' : 'Silent'], ['Fraud', cb.fraud_extension], ['Limits', cb.limits]]) + quoteBlock(cb)) +
      sec('Retail rate submission', kv([['Frequency', rs.frequency_limit || 'Silent'], ['Sample', sampleText(r)], ['Sample detail', (rs.sample || {}).other], ['Formula', rs.formula], ['Who selects ROs', rs.who_selects], ['Excluded from sample', (rs.exclusions || []).map(x => EXCL[x] || x).join('; ') || 'None listed'], ['Statute wording', rs.exclusions_text], ['New rate effective', rs.new_rate_effective], ['Note', r.calc.note]]) + quoteBlock(rs)) +
      sec('Manufacturer response and challenge', kv([['Response deadline', days(mr.response_deadline_days)], ['No response', mr.deemed_approved_if_no_response === true ? 'Rate deemed approved' : 'No deemed-approval rule in statute'], ['Challenge standard', mr.challenge_standard], ['Challenge method', mr.challenge_method], ['Dispute forum', mr.dispute_forum]]) + quoteBlock(mr)) +
      sec('Penalties and remedies', kv([['Private remedies', pe.private_remedies], ['Administrative sanctions', pe.admin_sanctions], ['Citations', pe.cite]])) +
      sec('Notes', '<p>' + esc(r.notes) + '</p><p class="xpin">Law history source: ' + esc(ld.history_source || '') + '</p>') +
      '</div>';
    const d = $('auditDialog'); if (!d.open) d.showModal(); d.scrollTop = 0;
  }
  function sec(label, body) { return '<section class="state-section"><div class="section-label">' + esc(label) + '</div>' + body + '</section>'; }
  function csvCell(v) { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function download(name, text, type) { const b = new Blob([text], {type: type || 'text/csv'}); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function auditCsv() {
    const H = ['State', 'Name', 'Claim decision days', 'Late claim deemed approved', 'Payment days', 'Payment trigger', 'Dealer filing deadline', 'Chargeback months', 'Fraud extension', 'Rate frequency', 'Sample rule', 'Excluded from sample', 'Mfr response days', 'No response deemed approved', 'Challenge standard', 'Dispute forum', 'Private remedies', 'Admin sanctions', 'Law last amended', 'Amending act', 'Next scheduled change', 'Last verified', 'Primary cite', 'Official URL', 'Confidence'];
    const L = [H.join(',')];
    auditRows().forEach(r => {
      const c = r.claims, cb = r.chargebacks, rs = r.rate_submission, mr = r.manufacturer_response, n = nextChange(r);
      L.push([r.state, r.name, c.decision_deadline_days, yesNo(c.deemed_approved_if_late, 'Yes', 'No'), c.payment_deadline_days, c.payment_deadline_trigger, c.dealer_filing_deadline, cb.lookback_months, cb.fraud_extension, rs.frequency_limit, sampleText(r), (rs.exclusions || []).join('; '), mr.response_deadline_days, yesNo(mr.deemed_approved_if_no_response, 'Yes', 'No'), mr.challenge_standard, mr.dispute_forum, r.penalties.private_remedies, r.penalties.admin_sanctions, amended(r), (r.law_dates || {}).last_amending_act, n ? n.effective + ' ' + (n.act || '') : '', r.verified.audit_fields, (r.cites || [])[0], r.official_url, r.confidence].map(csvCell).join(','));
    });
    download('warranty-atlas-audit-fields.csv', L.join('\n'));
  }

  /* ---------- Weekly checks ---------- */
  const CAT = {enacted_upcoming: 'Enacted · takes effect soon', enacted_recent: 'Took effect recently', pending: 'Pending bill', dead_or_stalled: 'Dead or stalled', no_change: 'No change'};
  function renderWeekly() {
    const E = (WEEKLY.entries || []).slice().sort((a, b) => a.check_date < b.check_date ? 1 : -1);
    $('x-weekly').innerHTML = '<div class="xhead"><div><h2>Weekly checks</h2><p>Every Monday at 7 AM ET, Claude checks all 50 legislatures for enacted, effective and pending changes to warranty-reimbursement law, updates the Atlas when enacted law changes, and logs the result here. Pending bills are tracked but never loaded as law.</p></div><div class="xstamp">Last check <strong>' + fmtDate(E[0] && E[0].check_date) + '</strong><br>' + E.length + ' check' + (E.length === 1 ? '' : 's') + ' logged</div></div>' +
      E.map(e => '<article class="xweek"><header><time datetime="' + esc(e.check_date) + '">' + fmtDate(e.check_date) + '</time><span class="xbadge ' + (e.type === 'baseline' ? 'alt' : '') + '">' + esc((e.type || 'weekly').toUpperCase()) + '</span></header><h3>' + esc(e.headline) + '</h3><p>' + esc(e.summary) + '</p>' +
        (e.items && e.items.length ? '<ul class="xitems">' + e.items.map(it => '<li><div class="xitem-top"><span class="xbadge ' + (it.category === 'pending' ? 'muted' : it.category === 'enacted_upcoming' ? '' : 'alt') + '">' + esc(CAT[it.category] || it.category) + '</span><strong>' + esc(it.state) + ' · ' + esc(it.bill) + '</strong>' + (it.effective ? '<span class="xpin">Effective ' + fmtDate(it.effective) + '</span>' : '') + '</div><p>' + esc(it.summary_short || it.summary) + '</p>' + (it.atlas_impact ? '<p class="xnote"><strong>Atlas impact:</strong> ' + esc(it.atlas_impact) + '</p>' : '') + '<p class="xpin">' + esc(it.status || '') + ' ' + link(it.source_url, 'Official source') + '</p>' + (it.summary && it.summary !== it.summary_short ? '<details><summary>Full summary</summary><p>' + esc(it.summary) + '</p></details>' : '') + '</li>').join('') + '</ul>' : '<p class="xnote">No enacted, effective or pending changes found this week.</p>') +
        (e.site_changes && e.site_changes.length ? '<details open><summary>Site updates this week</summary><ul>' + e.site_changes.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul></details>' : '') +
        (e.gaps && e.gaps.length ? '<details><summary>Gaps and limits</summary><ul>' + e.gaps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul></details>' : '') +
        (e.method ? '<details><summary>How this check was run</summary><p>' + esc(e.method) + '</p></details>' : '') + '</article>').join('');
  }

  /* ---------- News ---------- */
  function renderNews() {
    const W = (NEWS.weeks || []).slice().sort((a, b) => a.week_of < b.week_of ? 1 : -1);
    $('x-news').innerHTML = '<div class="xhead"><div><h2>News · 3–5 items a week</h2><p>Only items directly about state warranty-reimbursement law: retail-rate and labor-time laws, service-contract and CPO reimbursement, claims and chargebacks, and board or court rulings. Each item is labeled by source type and perspective. Much of this coverage comes from dealer-side law firms and retail-rate vendors.</p></div></div>' +
      W.map(w => '<section class="xnewsweek"><h3>Week of ' + fmtDate(w.week_of) + '</h3>' + (w.items || []).map(n => '<article class="xnews"><div class="xitem-top"><time>' + fmtDate(n.date) + '</time><span class="xbadge muted">' + esc(n.source_type || '') + '</span><span class="xbadge ' + (n.perspective === 'dealer-side' ? 'alt' : n.perspective === 'manufacturer-side' ? '' : 'muted') + '">' + esc((n.perspective || 'neutral').toUpperCase()) + '</span>' + (n.states || []).map(s => '<span class="xchip">' + esc(s) + '</span>').join('') + '</div><h4>' + (safeUrl(n.url) ? '<a href="' + esc(safeUrl(n.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(n.title) + ' ↗</a>' : esc(n.title)) + '</h4><p class="xpin">' + esc(n.publisher) + '</p><p>' + esc(n.topic) + '</p><p class="xnote"><strong>Why it matters:</strong> ' + esc(n.why_it_matters) + '</p></article>').join('') + (w.items && w.items.length ? '' : '<p class="xnote">Nothing met the bar this week.</p>') + '</section>').join('');
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
      card('Audit fields · JSON', 'Full research records with quotes.', openA('data/audit-fields.json', 'Open') + saveA('data/audit-fields.json')) +
      card('Coverage · JSON', '200 coverage records (v3).', openA('research/labor-by-coverage-v3.json', 'Open') + saveA('research/labor-by-coverage-v3.json')) +
      '</div><p class="xfoot">The Excel "Open in browser" button uses Microsoft\'s free online viewer. The workbook is public research data; no SOA data is included.</p>' +
      '<h3 class="xsub">One-page PDF by state</h3><p class="xfoot">Click a state to open its PDF in a new tab. Use the viewer\'s download or print button to keep a copy.</p><div class="xstates">' + AUDIT.map(r => '<a href="downloads/state-pdfs/' + r.state + '.pdf" target="_blank" rel="noopener" title="Open ' + esc(r.name) + ' PDF">' + r.state + '</a>').join('') + '</div>';
  }

  /* ---------- State drawer enrichment ---------- */
  function enrichDrawer() {
    const content = $('stateContent'), title = $('stateTitle'); if (!content || !title) return;
    const obs = new MutationObserver(() => {
      if (content.querySelector('.xdrawer')) return;
      const name = (title.textContent || '').split(' · ')[0].trim().toLowerCase();
      const go = () => { const r = byName[name]; if (!r) return; const n = nextChange(r); const box = document.createElement('div'); box.className = 'xdrawer';
        box.innerHTML = '<div><span class="section-label">Law last amended</span><strong>' + esc(amended(r)) + '</strong>' + ((r.law_dates || {}).last_amending_act ? '<small>' + esc(trim(r.law_dates.last_amending_act, 90)) + '</small>' : '') + '</div>' +
          '<div><span class="section-label">Next scheduled change</span><strong>' + (n ? fmtDate(n.effective) : 'None found') + '</strong>' + (n ? '<small>' + esc(trim(n.summary || n.act, 90)) + '</small>' : '') + '</div>' +
          '<div><span class="section-label">Last verified</span><strong>' + fmtDate(r.verified.audit_fields) + '</strong><small>Coverage cells ' + fmtDate(r.verified.coverage) + (r.verified.last_change_check ? ' · Checked for changes ' + fmtDate(r.verified.last_change_check) : '') + '</small></div>' +
          '<div class="xbtns"><a class="quiet" href="#audit?state=' + r.state + '" data-xclose>Audit fields →</a><a class="quiet" href="downloads/state-pdfs/' + r.state + '.pdf" target="_blank" rel="noopener">Open one-page PDF ↗</a></div>';
        const anchor = content.querySelector('.state-summary'); if (anchor) anchor.after(box); else content.prepend(box);
        box.querySelectorAll('[data-xclose]').forEach(a => a.addEventListener('click', () => { const d = $('stateDialog'); if (d.open) d.close(); }));
      };
      if (loaded) go(); else ensureData().then(go).catch(() => {});
    });
    obs.observe(content, {childList: true});
  }

  function init() { buildShell(); enrichDrawer(); route(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
