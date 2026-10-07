"""Consistency gate for the Warranty Atlas (added 2026-10-06).

Stops a build when the short labels or summary text shown on the site contradict the
statute-verified research, or when a scheduled law change has taken effect but was not
moved into the current fields. tools/build_exports.py runs this first and exits on any
FAIL, so a contradiction cannot be published. Fix the data; do not bypass the check.

Usage:  python3 tools/check_consistency.py [--date YYYY-MM-DD]
"""
import argparse, datetime as dt, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(HERE, '..', 'docs')

FLOOR_WORDS = ('not less than', 'no less than', 'at least', 'in no event', 'minimum', 'floor', 'may not be less', 'shall not be less', 'not be below', 'no lower than')
RULE_CITE = re.compile(r"Comp\. R\. & Regs|Admin\. Code|\bCCR\b|\bWAC\b|\bNAC\b|\bIAC\b|\bOAC\b|\bCSR\b|\bNCAC\b|\bNYCRR\b|Pa\. Code|RICR|\bCMR\b|COMAR|IDAPA|\bTAC\b|Ill\. Adm\. Code|Code of Vt\. Rules|\bTrans \d")
STALE = re.compile(r'Secondary statutory reproduction|not independently checked|could not be retrieved', re.I)
WORDS = {1: ('1 ', 'one', 'once'), 2: ('2 ', 'two', 'twice')}


def load(rel):
    with open(os.path.join(DOCS, rel), encoding='utf-8') as f:
        return json.load(f)


def load_js(rel, var):
    raw = open(os.path.join(DOCS, rel), encoding='utf-8').read()
    k = raw.index(var) + len(var)
    return json.loads(raw[k:raw.rindex(';')])


def quotes(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == 'quote' and isinstance(v, str):
                yield path + '.quote', v
            else:
                yield from quotes(v, path + '.' + k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from quotes(v, f'{path}[{i}]')


def run(build_date):
    fails, warns = [], []
    F = lambda s, msg: fails.append(f'{s}: {msg}')
    W = lambda s, msg: warns.append(f'{s}: {msg}')

    audit = {a['state']: a for a in load('data/audit-fields.json')}
    procs = {p['state']: p for p in load('data/audit-procedures.json')['states']}
    key = load('data/key-facts.json')['states']
    covr = load('research/labor-by-coverage-v3.json')
    cov = {c['state']: c for c in covr}
    ref = {r['abbr']: r for r in load_js('data.js', 'window.REFERENCE = ')['states']}
    gov = load('data/governance.json')['states']
    js = open(os.path.join(DOCS, 'extras.js'), encoding='utf-8').read()
    blk = js[js.index('const COND_SHORT = {'):]
    blk = blk[:blk.index('\n  };')]
    cond_short = {m.group(1): set(re.findall(r'(\w+):\s*\'', m.group(2))) for m in re.finditer(r'^\s+([A-Z]{2}): \{(.*)\},?$', blk, re.M)}
    if len(cond_short) < 5:
        F('ALL', 'could not read COND_SHORT from extras.js')

    # coverage-data.js must mirror the research file exactly
    if load_js('coverage-data.js', 'window.COVERAGE_V3 = ') != covr:
        F('ALL', 'docs/coverage-data.js differs from docs/research/labor-by-coverage-v3.json')

    states = sorted(audit)
    for name, d in (('audit-procedures', procs), ('key-facts', key), ('coverage', cov), ('data.js', ref), ('governance', gov)):
        if sorted(d) != states:
            F('ALL', f'{name} does not cover the same 50 states as audit-fields')

    for s in states:
        a, k, c, r, p, g = audit[s], key.get(s, {}), cov.get(s, {}), ref.get(s, {}), procs.get(s, {}), gov.get(s, {})
        ld = a.get('law_dates') or {}

        # 1. a scheduled change that has taken effect must be in the current fields
        n = ld.get('next_scheduled_change')
        if n and n.get('effective') and n['effective'] <= build_date:
            F(s, f"scheduled change effective {n['effective']} has taken effect; move it into the current fields and clear next_scheduled_change")
        if any(x.startswith('changes_effective_') for x in p):
            for x in p:
                m = re.match(r'changes_effective_(\d{4})_(\d{2})_(\d{2})$', x)
                if m and '-'.join(m.groups()) <= build_date:
                    F(s, f'audit-procedures block {x} has taken effect; move it into the main fields')

        # 2. paid-hours label vs the verified classification
        ph = ((c.get('coverage') or {}).get('factory_warranty') or {}).get('paid_hours')
        hl = (k.get('hours') or '').lower()
        if hl:
            if ph == 'silent' and any(w in hl for w in ('reasonable', 'adequate', 'actual', 'manual', 'guide')) and 'silent' not in hl:
                F(s, f'paid-hours label "{k["hours"]}" implies a time rule, but the verified classification is silent')
            if ph == 'actual_time' and 'actual' not in hl:
                F(s, f'paid-hours label "{k["hours"]}" does not mention actual time, but the classification is actual_time')

        # 3. labor category vs the verified hourly-rate method
        lt = k.get('labor_type')
        hm = ' '.join([c.get('hourly_rate_method') or '', c.get('notes') or '', str((a.get('manufacturer_response') or {}).get('challenge_standard') or '')]).lower()
        RETAIL = ('retail', 'nonwarranty', 'non-warranty', 'customer-pa', 'customer pa', 'labor sales')
        need = {'posted': ('posted',), 'floor': FLOOR_WORDS, 'reasonable': ('reasonab', 'principal factor', 'prevailing'), 'retail': RETAIL}.get(lt)
        if need and hm and not any(w in hm for w in need):
            F(s, f'labor category "{lt}" is not supported by the verified hourly-rate method')

        # 4. parts category vs the parts rule shown on the state page
        pt, pr = k.get('parts_type'), (r.get('parts') or '').lower()
        need = {'retail': ('retail',), 'floor': FLOOR_WORDS + ('retail',), 'reasonable': ('reasonab', 'fair'), 'agreed': ('agree',)}.get(pt)
        if need and pr and not any(w in pr for w in need):
            F(s, f'parts category "{pt}" is not supported by the parts rule text')

        # 5. rate sample wording vs the verified combine rule
        sm = ((a.get('rate_submission') or {}).get('sample') or {})
        other = (sm.get('other') or '').lower()
        if sm.get('combine') == 'fewer' and re.search(r'dealer.{0,20}choice|dealer may choose (?:either|between)|either set', other):
            F(s, 'sample text says dealer choice, but the verified rule is whichever is fewer')
        if sm.get('combine') in ('dealer_choice', 'choice') and re.search(r'whichever is (fewer|less)|lesser of|fewer of', other):
            F(s, 'sample text says whichever is fewer, but the verified rule is dealer choice')

        # 6. response label day counts must appear in the recorded response or rate-submission data
        mr_txt = json.dumps([a.get('manufacturer_response'), a.get('rate_submission')])
        for nd in re.findall(r'(\d+)\s*days?', k.get('response') or ''):
            if not re.search(r'\b' + nd + r'\b', mr_txt):
                F(s, f'response label mentions {nd} days, which is not in the recorded response data')

        # 7. request-frequency label vs the recorded frequency limit
        fq = ((a.get('rate_submission') or {}).get('frequency_limit') or '').lower()
        m = re.match(r'(\d)\s', k.get('requests') or '')
        if m and fq and int(m.group(1)) in WORDS and not any(w in fq for w in WORDS[int(m.group(1))]):
            F(s, f'request label "{k["requests"]}" does not match the recorded frequency "{fq[:60]}"')

        # 8. a law field that cites an agency rule must be reflected in the governance table
        cited = ' '.join(str((a.get(b) or {}).get('pinpoint') or '') for b in ('claims', 'chargebacks', 'rate_submission', 'manufacturer_response'))
        if RULE_CITE.search(cited) and g.get('law') != 'statute_rules':
            F(s, 'audit fields cite an agency rule, but governance.json says statute only')
        if g.get('law') == 'statute_rules' and not g.get('rule_note'):
            F(s, 'governance.json marks an agency rule but gives no rule_note')

        # 9. no stale source labels on what the site shows
        for fld in ('labor', 'parts', 'note', 'additional', 'basis'):
            if STALE.search(r.get(fld) or ''):
                F(s, f'data.js {fld} still carries a stale-source label')

        # 10. quotes stay verbatim-length (40 words max)
        for src, obj in (('audit-fields', a), ('audit-procedures', p), ('coverage', c)):
            for path, q in quotes(obj):
                if len(q.split()) > 40:
                    W(s, f'{src}{path} quote is {len(q.split())} words (limit 40)')

        # 11. every Conditional service-contract/CPO cell needs a short condition for the matrix (extras.js COND_SHORT), and no stale ones
        for cid, ck in (('manufacturer_contract', 'mfr_service_contract'), ('cpo', 'cpo'), ('independent_contract', 'independent_service_contract')):
            is_cond = ((c.get('coverage') or {}).get(ck) or {}).get('applies') == 'conditional'
            has = cid in cond_short.get(s, {}) or 'all' in cond_short.get(s, {})
            if is_cond and not has:
                F(s, f'{ck} is Conditional but extras.js COND_SHORT has no short condition for it')
            if cid in cond_short.get(s, {}) and not is_cond:
                F(s, f'extras.js COND_SHORT gives a condition for {ck}, which is no longer Conditional')
        if s in cond_short and not any(((c.get('coverage') or {}).get(k) or {}).get('applies') == 'conditional' for k in ('mfr_service_contract', 'cpo', 'independent_service_contract')):
            F(s, 'extras.js COND_SHORT lists this state, but none of its service-contract/CPO cells is Conditional')

        # open research caveats are listed, not blocking
        for src, txt in (('audit-fields notes', a.get('notes')), ('audit-procedures notes', p.get('notes')), ('coverage notes', c.get('notes'))):
            if txt and re.search(r'not (?:been )?(?:checked|verified|read|reviewed)|could not|blocked', txt, re.I):
                W(s, f'{src} mention an unchecked source')
    # 12. no company-specific names in anything the site or repo publishes (flagged states stay labeled "Flagged" only)
    root = os.path.join(DOCS, '..')
    banned = re.compile(r'subaru|\bSOA\b|\bS&(?:amp;)?Q\b|distributor-franchised|Distributors Corp|Servco|regional distributor', re.I)
    scan = [os.path.join(root, f) for f in ('README.md', 'AGENTS.md')] + [os.path.join(HERE, f) for f in os.listdir(HERE) if f.endswith(('.md', '.py')) and f != 'check_consistency.py']
    for dp, _, fs in os.walk(DOCS):
        scan += [os.path.join(dp, f) for f in fs if f.endswith(('.html', '.js', '.json', '.md', '.css', '.txt', '.csv'))]
    for fp in scan:
        if not os.path.exists(fp):
            continue
        for m in banned.finditer(open(fp, encoding='utf-8', errors='ignore').read()):
            F(os.path.relpath(fp, root), f'company-specific reference "{m.group(0)}" must not be published')
    return fails, warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--date', default=dt.date.today().isoformat())
    fails, warns = run(ap.parse_args().date)
    for w in warns:
        print('WARN', w)
    for f in fails:
        print('FAIL', f)
    print(f'Consistency check: {len(fails)} failures, {len(warns)} warnings.')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
