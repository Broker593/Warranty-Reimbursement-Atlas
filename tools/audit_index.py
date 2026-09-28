"""Audit climate score (shown on the "Map: U.S. Audit Climate" tab): how restrictive each state's
law is toward a manufacturer's or distributor's warranty audits, chargebacks and retail-rate validation.

Built only from docs/data/audit-fields.json and docs/data/audit-procedures.json. Higher = more
statutory limits. It is a research summary, not legal advice and not an assessment of any
company's audit program. Run directly, or via tools/build_exports.py, to write
docs/data/audit-index.json (the site and the Excel export both read that file).

Usage:  python3 tools/audit_index.py
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'docs', 'data')

# (id, label, max points, how points are earned). Weights sum to 100.
FACTORS = [
    ('lookback', 'Short audit and chargeback lookback', 15, '15 points if paid claims can be audited or charged back for 6 months or less, 10 for 9 months, 5 for 12 months, 0 if the statute sets no limit.'),
    ('stay', 'Chargeback held while the dealer appeals', 15, 'The chargeback cannot be collected until the dealer\'s appeal, protest or hearing is resolved.'),
    ('extrap', 'Limits on extrapolating audit results', 10, '10 points if projecting sample results across claims is prohibited, 5 if restricted (e.g., only from a valid random sample).'),
    ('clerical', 'No chargebacks for clerical or paperwork errors', 10, 'Claims cannot be denied or charged back solely for clerical, administrative or technical errors when the work was done properly.'),
    ('docs', 'Limits on documentation requirements', 5, 'Documentation demands are limited (e.g., only reasonable written requirements in effect when the claim was paid).'),
    ('written', 'Written reasons required before a chargeback', 5, 'The dealer must get written notice of the specific grounds for each chargeback.'),
    ('response', 'Dealer response or cure period', 5, 'The dealer gets a set period to respond, rebut or cure before the chargeback.'),
    ('appeal', 'Internal appeal required', 5, 'The manufacturer or distributor must offer an internal appeal or review.'),
    ('selection', 'Must tell the dealer why it was selected', 5, 'The dealer must be told the basis for selecting it for audit (in some states only for certain audits).'),
    ('notice', 'Advance written notice of audit', 5, 'Written notice is required before an audit begins.'),
    ('frequency', 'Cap on how often audits can occur', 5, 'The statute limits how often a dealer can be audited.'),
    ('nofraud', 'No fraud carve-out from the time limit', 5, 'The lookback limit applies even to suspected fraud.'),
    ('rate', 'Rate validation limited to the dealer\'s submission', 5, 'A retail-rate submission can be checked only against the dealer\'s own submitted ROs or by a single accuracy objection; no request for more ROs or outside data.'),
    ('conseq', 'Specific consequence for improper audits', 5, 'The statute attaches a specific consequence to improper audits or chargebacks (void chargeback, violation finding, fines, interest or audit-cost reimbursement).'),
]
TIERS = [(50, 'Very high'), (40, 'High'), (30, 'Elevated'), (20, 'Moderate'), (0, 'Low')]
TIER_RANGES = {'Very high': '50+', 'High': '40–49', 'Elevated': '30–39', 'Moderate': '20–29', 'Low': 'under 20'}


def _load(name):
    with open(os.path.join(DATA, name), encoding='utf-8') as f:
        return json.load(f)


def points(a, p):
    m = (a.get('chargebacks') or {}).get('lookback_months')
    extrap = (p.get('extrapolation') or {}).get('rule')
    req = lambda k: (p.get(k) or {}).get('required') is True
    cls = p.get('classification') or {}
    return {
        'lookback': 0 if m is None else 15 if m <= 6 else 10 if m <= 9 else 5 if m <= 12 else 0,
        'stay': 15 if req('chargeback_stayed_pending_appeal') else 0,
        'extrap': 10 if extrap == 'prohibited' else 5 if extrap == 'restricted' else 0,
        'clerical': 10 if req('clerical_error_protection') else 0,
        'docs': 5 if req('documentation_limits') else 0,
        'written': 5 if req('written_reasons_before_chargeback') else 0,
        'response': 5 if (p.get('dealer_response_period') or {}).get('days') else 0,
        'appeal': 5 if req('internal_appeal') else 0,
        'selection': 5 if req('selection_basis_disclosed') else 0,
        'notice': 5 if req('advance_notice') else 0,
        'frequency': 5 if (p.get('audit_frequency_limit') or {}).get('limit') else 0,
        'nofraud': 5 if (p.get('fraud_exception') or {}).get('exists') is False else 0,
        'rate': 5 if cls.get('rate_validation_limited') else 0,
        'conseq': 5 if cls.get('audit_consequence') else 0,
    }


def tier(score):
    return next(name for floor, name in TIERS if score >= floor)


def compute(audit=None, procs=None):
    audit = audit or _load('audit-fields.json')
    procs = procs or _load('audit-procedures.json')
    P = {p['state']: p for p in procs['states']}
    states = {}
    for a in audit:
        s = a['state']
        if s not in P:
            raise SystemExit(f'audit-procedures.json is missing {s}')
        pts = points(a, P[s])
        total = sum(pts.values())
        states[s] = {'score': total, 'tier': tier(total), 'points': pts}
    ranked = sorted(states, key=lambda s: (-states[s]['score'], s))
    for i, s in enumerate(ranked, 1):
        states[s]['rank'] = i
    return {
        'schema': 1,
        'name': 'Audit climate score',
        'description': 'How restrictive state law is toward a manufacturer\'s or distributor\'s warranty audits, chargebacks and retail-rate validation, from 14 statutory limits. Higher = more restrictive. Statute text only; not legal advice and not an assessment of any company\'s audit program.',
        'checked': procs.get('checked'),
        'max': sum(f[2] for f in FACTORS),
        'factors': [{'id': i, 'label': l, 'max': m, 'how': h} for i, l, m, h in FACTORS],
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
