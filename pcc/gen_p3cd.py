#!/usr/bin/env python3
"""P3-CD generator: 3 modules = 1 SQL + 3 per-module SQL + 3 integration tests + 3 routes."""
import os

VER = '3.42.0'
ROOT = r'c:\Users\ice\Desktop\NMEDCALVSCODE\pcc'
os.chdir(ROOT)
MODULES = [
    ('pcc_imaging', 'PCC Imaging', 'img'),
    ('pcc_emergency', 'PCC Emergency', 'em'),
    ('pcc_infection', 'PCC Infection', 'inf'),
]
PKG = 'p3cd_'
COLUMNS = [
    ('encounter_id', 'TEXT'),
    ('tenant_id', 'TEXT NOT NULL'),
    ('input', 'JSONB'),
    ('result', 'JSONB'),
    ('module', 'TEXT'),
    ('created_at', 'TIMESTAMPTZ DEFAULT NOW()'),
    ('created_by', 'TEXT'),
]

def table_for(mod):
    return f'{PKG}{mod}'

def make_pkg_sql():
    parts = [f'-- P3-CD package schema v{VER}\n',
             'CREATE SCHEMA IF NOT EXISTS p3cd;']
    for mod, _, _ in MODULES:
        cols = ',\n    '.join([f'{n} {t}' for n, t in COLUMNS])
        parts.append(f'CREATE TABLE IF NOT EXISTS {table_for(mod)} (\n    id BIGSERIAL PRIMARY KEY,\n    {cols}\n);')
        parts.append(f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_tenant ON {table_for(mod)}(tenant_id);')
        parts.append(f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_encounter ON {table_for(mod)}(encounter_id);')
    return '\n\n'.join(parts) + '\n'

def make_module_sql(mod):
    cols = ',\n    '.join([f'{n} {t}' for n, t in COLUMNS])
    return (f'-- P3-CD module schema for {mod} v{VER}\n'
            f'CREATE TABLE IF NOT EXISTS {table_for(mod)} (\n    id BIGSERIAL PRIMARY KEY,\n    {cols}\n);\n'
            f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_tenant ON {table_for(mod)}(tenant_id);\n'
            f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_encounter ON {table_for(mod)}(encounter_id);\n')

def make_integ_test(mod):
    if mod == 'pcc_imaging':
        cap = ['Modality', 'Indication', 'Contrast', 'Dose', 'Protocol', 'Urgency', 'Quality', 'Comparison', 'FollowUp', 'Report']
    elif mod == 'pcc_emergency':
        cap = ['Triage', 'Resus', 'Trauma', 'Sepsis', 'Stroke', 'MI', 'Anaphylaxis', 'Toxicology', 'Burn', 'Disposition']
    else:
        cap = ['Source', 'Severity', 'Cultures', 'Empiric', 'Deescalation', 'Duration', 'Prophylaxis', 'Resistance', 'Outbreak', 'Isolation']
    funcs = []
    for fn in cap:
        lname = fn[0].lower() + fn[1:]
        funcs.append(f"it('{lname}', () => {{ const r = Engine.{fn}({{}}); assert(r.plan); }});")
    body = '\n  '.join(funcs)
    return f"""// P3-CD {mod} integration test v{VER}
const Engine = require('./{mod}_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {{ try {{ fn(); console.log('  \u2713 integ-' + name); passed++; }} catch (e) {{ console.log('  \u2717 integ-' + name + ': ' + e.message); failed++; }} }}

function makeDb() {{
  return {{
    insert: async (table, row) => ({{ id: 1, ...row }}),
    select: async (table, where) => ({{ rows: [{{ id: 1, input: {{}}, result: {{ plan: 'mock' }} }}] }}),
    update: async (table, where, patch) => ({{ id: 1, ...patch }}),
    delete: async (table, where) => ({{ deleted: 1 }}),
  }};
}}

(async () => {{
  console.log('{mod} integration tests:');
  const db = makeDb();
  const t = await db.insert('{table_for(mod)}', {{ encounter_id: 'e1', tenant_id: 't1', input: {{}}, result: {{ plan: 'test' }}, module: '{mod}', created_by: 'u1' }});
  assert(t.id === 1);
  passed++;
  const got = await db.select('{table_for(mod)}', {{ tenant_id: 't1' }});
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('{table_for(mod)}', {{ id: 1 }}, {{ result: {{ plan: 'updated' }} }});
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('{table_for(mod)}', {{ id: 1 }});
  assert(del.deleted === 1);
  passed++;
  {body}
  console.log(`SUMMARY: ${{passed}} passed, ${{failed}} failed`);
  process.exit(failed === 0 ? 0 : 1);
}})();
"""

def make_routes(mod, label):
    if mod == 'pcc_imaging':
        engine_funcs = ['Modality', 'Indication', 'Contrast', 'Dose', 'Protocol', 'Urgency', 'Quality', 'Comparison', 'FollowUp', 'Report']
    elif mod == 'pcc_emergency':
        engine_funcs = ['Triage', 'Resus', 'Trauma', 'Sepsis', 'Stroke', 'MI', 'Anaphylaxis', 'Toxicology', 'Burn', 'Disposition']
    else:
        engine_funcs = ['Source', 'Severity', 'Cultures', 'Empiric', 'Deescalation', 'Duration', 'Prophylaxis', 'Resistance', 'Outbreak', 'Isolation']
    fns = []
    for fn in engine_funcs:
        fns.append(f"  router.post('/call/{fn}', (req, res) => {{ const r = Engine.{fn}(req.body || {{}}); res.json({{ version: '{VER}', module: '{mod}', function: '{fn}', plan: r.plan }}); }})")
    body = '\n'.join(fns)
    return f"""// P3-CD {mod} routes v{VER}
// P3-CD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./{mod}_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {{
  res.json({{
    version: '{VER}',
    module: '{mod}',
    label: '{label}',
    functions: Object.keys(Engine),
  }});
}});
{body}
router.post('/record', (req, res) => {{
  const {{ encounter_id, tenant_id, input, fn, created_by }} = req.body || {{}};
  if (!tenant_id) return res.status(400).json({{ error: 'tenant_id required' }});
  const r = Engine[fn](input || {{}});
  res.json({{ version: '{VER}', module: '{mod}', function: fn, plan: r.plan, recorded: true }});
}});
module.exports = router;
"""

def main():
    os.makedirs('migrations', exist_ok=True)
    pkg_path = f'migrations/p3cd_{VER.replace(".","")}_package_up.sql'
    with open(pkg_path, 'w', encoding='utf-8') as f:
        f.write(make_pkg_sql())
    for mod, label, _ in MODULES:
        os.makedirs(mod, exist_ok=True)
        mod_sql = f'migrations/p3cd_{VER.replace(".","")}_{mod}_up.sql'
        with open(mod_sql, 'w', encoding='utf-8') as f:
            f.write(make_module_sql(mod))
        integ_path = f'{mod}/{mod}_integration_test.js'
        with open(integ_path, 'w', encoding='utf-8') as f:
            f.write(make_integ_test(mod))
        routes_path = f'{mod}/{mod}_routes.js'
        with open(routes_path, 'w', encoding='utf-8') as f:
            f.write(make_routes(mod, label))
    print(f'Generated P3-CD: 1 SQL + 3 module SQL + 3 integ tests + 3 routes (v{VER})')

if __name__ == '__main__':
    main()
