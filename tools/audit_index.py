"""Audit climate score (shown on the "Map: U.S. Audit Climate" tab): how restrictive each state's
law is toward a manufacturer's or distributor's warranty audits, chargebacks and retail-rate validation.

Method (schema 2, 2026-09-29):
  1. Level: each of 14 statutory limits gets a level from 0 to 3 (0 = not in statute, 3 = strongest form).
     Levels are facts read from docs/data/audit-fields.json and docs/data/audit-procedures.json.
     A procedures field may carry "score_level" (0-3) and "score_level_reason" to record a partial limit;
     only set one with a written reason.
  2. Weight: each limit has a weight; the 14 weights add up to 100. Weights are a judgment call and live
     only in FACTORS below, so they can be changed without re-doing any research.
  3. Points = weight x level / 3. The state's score is the sum of points (0-100), rounded to a whole number.
  4. Two sub-scores that add up to the score: "Chargeback limits" (75 of the 100 points) and "Process and oversight" (25).
     Weights are whole numbers, and graded limits use multiples of 3, so every score and sub-score is a whole number.

Research summary, not legal advice and not an assessment of any company's audit program. Run directly, or via
tools/build_exports.py, to write docs/data/audit-index.json (the site and the Excel export both read that file).

Usage:  python3 tools/audit_index.py
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'docs', 'data')

SUBSCORES = [
    ('limits', 'Chargeback limits', 'How far back, how much and on what grounds a chargeback can be made, and when it can be collected.'),
    ('process', 'Process and oversight', 'Steps the manufacturer must take before and after an audit, limits on rate validation, and consequences for improper audits.'),
]
BUCKETS = [
    ('reach', 'How far back and how much can be charged back', 'limits'),
    ('grounds', 'What counts as a valid chargeback', 'limits'),
    ('collect', 'When a chargeback can be collected', 'limits'),
    ('steps', 'Audit process steps', 'process'),
    ('oversight', 'Rate validation and consequences', 'process'),
]
YES = ['Not in statute', '', '', 'Applies']
# (id, label, bucket, weight, level descriptions for 0..3). Weights add up to 100.
FACTORS = [
    ('lookback', 'Short audit and chargeback lookback', 'reach', 21, ['No limit in statute, or over 12 months', '12 months', '9 months', '6 months or less']),
    ('extrap', 'Limits on extrapolating audit results', 'reach', 15, ['Not addressed', '', 'Restricted (e.g., only from a valid random sample)', 'Prohibited']),
    ('nofraud', 'No fraud carve-out from the time limit', 'reach', 4, ['Fraud is excepted, or not stated', '', '', 'The time limit applies even to suspected fraud']),
    ('clerical', 'No chargebacks for clerical or paperwork errors', 'grounds', 12, YES),
    ('docs', 'Limits on documentation requirements', 'grounds', 8, YES),
    ('stay', 'Chargeback held while the dealer appeals', 'collect', 15, YES),
    ('notice', 'Advance written notice of audit', 'steps', 3, YES),
    ('selection', 'Must tell the dealer why it was selected', 'steps', 3, YES),
    ('written', 'Written reasons required before a chargeback', 'steps', 3, YES),
    ('response', 'Dealer response or cure period', 'steps', 3, ['None in statute', 'Under 30 days', '30 to 59 days', '60 days or more']),
    ('appeal', 'Internal appeal required', 'steps', 3, YES),
    ('frequency', 'Cap on how often audits can occur', 'steps', 3, ['No cap in statute', '', 'Cap allows more than one audit a year (e.g., one per 9 months)', 'At most one audit per 12 months']),
    ('rate', 'Rate validation limited to the dealer\'s submission', 'oversight', 3, ['Not limited in statute', '', '', 'Only the dealer\'s own ROs or a single accuracy objection']),
    ('conseq', 'Specific consequence for improper audits', 'oversight', 4, ['None specific in statute', '', '', 'Void chargeback, violation finding, fines, interest or audit-cost reimbursement']),
]
TIERS = [(50, 'Very high'), (40, 'High'), (30, 'Elevated'), (20, 'Moderate'), (0, 'Low')]
TIER_RANGES = {'Very high': '50+', 'High': '40–49', 'Elevated': '30–39', 'Moderate': '20–29', 'Low': 'under 20'}
assert sum(f[3] for f in FACTORS) == 100, 'weights must add up to 100'
assert all(f[3] % 3 == 0 for f in FACTORS if any(f[4][1:3])), 'graded limits need weights divisible by 3 so points stay whole numbers'


def _load(name):
    with open(os.path.join(DATA, name), encoding='utf-8') as f:
        return json.load(f)


def _override(field, default):
    lv = (field or {}).get('score_level')
    return int(lv) if lv in (0, 1, 2, 3) else default


def levels(a, p):
    """Level 0-3 for each limit, from the research files."""
    m = (a.get('chargebacks') or {}).get('lookback_months')
    extrap = (p.get('extrapolation') or {}).get('rule')
    req = lambda k: 3 if (p.get(k) or {}).get('required') is True else 0
    cls = p.get('classification') or {}
    days = (p.get('dealer_response_period') or {}).get('days')
    freq = p.get('audit_frequency_limit') or {}
    L = {
        'lookback': 0 if m is None else 3 if m <= 6 else 2 if m <= 9 else 1 if m <= 12 else 0,
        'extrap': 3 if extrap == 'prohibited' else 2 if extrap == 'restricted' else 0,
        'nofraud': 3 if (p.get('fraud_exception') or {}).get('exists') is False else 0,
        'clerical': req('clerical_error_protection'),
        'docs': req('documentation_limits'),
        'stay': req('chargeback_stayed_pending_appeal'),
        'notice': req('advance_notice'),
        'selection': req('selection_basis_disclosed'),
        'written': req('written_reasons_before_chargeback'),
        'response': 0 if not days else 3 if days >= 60 else 2 if days >= 30 else 1,
        'appeal': req('internal_appeal'),
        'frequency': _override(freq, 3) if freq.get('limit') else 0,
        'rate': 3 if cls.get('rate_validation_limited') else 0,
        'conseq': 3 if cls.get('audit_consequence') else 0,
    }
    src = {'clerical': 'clerical_error_protection', 'docs': 'documentation_limits', 'stay': 'chargeback_stayed_pending_appeal', 'notice': 'advance_notice',
           'selection': 'selection_basis_disclosed', 'written': 'written_reasons_before_chargeback', 'appeal': 'internal_appeal'}
    for fid, key in src.items():  # recorded partial limits
        if L[fid]:
            L[fid] = _override(p.get(key), L[fid])
    return L


def tier(score):
    return next(name for floor, name in TIERS if score >= floor)


def compute(audit=None, procs=None):
    audit = audit or _load('audit-fields.json')
    procs = procs or _load('audit-procedures.json')
    P = {p['state']: p for p in procs['states']}
    bucket_sub = {b[0]: b[2] for b in BUCKETS}
    sub_max = {s[0]: sum(f[3] for f in FACTORS if bucket_sub[f[2]] == s[0]) for s in SUBSCORES}
    states = {}
    for a in audit:
        s = a['state']
        if s not in P:
            raise SystemExit(f'audit-procedures.json is missing {s}')
        L = levels(a, P[s])
        pts = {fid: w * L[fid] // 3 for fid, _, _, w, _ in FACTORS}
        exact = sum(pts.values())
        score = int(exact + 0.5)
        subs = {sid: int(sum(pts[f[0]] for f in FACTORS if bucket_sub[f[2]] == sid) + 0.5) for sid, _, _ in SUBSCORES}
        states[s] = {'score': score, 'exact': round(exact, 2), 'tier': tier(score), 'levels': L, 'points': pts, 'subscores': subs}
    ranked = sorted(states, key=lambda s: (-states[s]['exact'], s))
    for i, s in enumerate(ranked, 1):
        states[s]['rank'] = i
    return {
        'schema': 2,
        'name': 'Audit climate score',
        'description': 'How restrictive state law is toward a manufacturer\'s or distributor\'s warranty audits, chargebacks and retail-rate validation. Each of 14 statutory limits gets a level from 0 to 3; points = weight x level / 3; weights add up to 100, so scores run 0-100. Higher = more restrictive. Statute text, plus state agency rules where they set a limit (all 50 states\' rules checked 2026-10-06); not legal advice and not an assessment of any company\'s audit program.',
        'formula': 'Points = weight × level ÷ 3. Score = sum of points (0–100).',
        'weights_note': 'Weights are a judgment call about how much each limit constrains audits and chargebacks, and are a draft pending S&Q and Legal review. Levels are read from the statute text and, where a state agency rule sets the limit, from that rule. The score measures how strict the law is, not how likely an audit dispute is.',
        'checked': procs.get('checked'),
        'max': 100,
        'subscores': [{'id': i, 'label': l, 'about': t, 'max_points': sub_max[i], 'share': f'{sub_max[i]}%'} for i, l, t in SUBSCORES],
        'buckets': [{'id': i, 'label': l, 'subscore': s, 'weight': sum(f[3] for f in FACTORS if f[2] == i)} for i, l, s in BUCKETS],
        'factors': [{'id': i, 'label': l, 'bucket': b, 'weight': w, 'max': w, 'levels': lv} for i, l, b, w, lv in FACTORS],
        'tiers': [{'name': n, 'min': f, 'range': TIER_RANGES[n]} for f, n in TIERS],
        'states': states,
    }


def write(index=None):
    index = index or compute()
    with open(os.path.join(DATA, 'audit-index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=1)
    return index


if __name__ == '__main__':
    idx = write()
    top = sorted(idx['states'].items(), key=lambda kv: kv[1]['rank'])
    print('Audit climate scores written for', len(top), 'states. Highest:', ', '.join(f"{s} {v['score']}" for s, v in top[:5]))
