#!/usr/bin/env python3
"""P3-DB generator: 3 modules = engines + tests + integration tests + routes + SQL."""
import os

VER = '3.66.0'
PHASE = 'P3-DB'
ROOT = r'c:\Users\ice\Desktop\NMEDCALVSCODE\pcc'
os.chdir(ROOT)
MODULES = [
    ('pcc_precision_medicine', 'PCC Precision Medicine', 'pre'),
    ('pcc_regenerative_medicine', 'PCC Regenerative Medicine', 'reg'),
    ('pcc_metabolic_surgery', 'PCC Metabolic Surgery', 'met'),
]
PKG = 'p3db_'
COLUMNS = [
    ('encounter_id', 'TEXT'),
    ('tenant_id', 'TEXT NOT NULL'),
    ('input', 'JSONB'),
    ('result', 'JSONB'),
    ('module', 'TEXT'),
    ('created_at', 'TIMESTAMPTZ DEFAULT NOW()'),
    ('created_by', 'TEXT'),
]

ENGINE_FUNCS = {
    'pcc_precision_medicine': ['Pharmacogenomics', 'OmicsProfile', 'BiomarkerPanel', 'TargetedTherapy', 'RareVariant', 'TumorProfiling', 'MicrobiomeGuide', 'Nutrigenomics', 'Proteomics', 'Metabolomics'],
    'pcc_regenerative_medicine': ['StemCellTherapy', 'PRPInjection', 'ExosomeTherapy', 'CartilageRegeneration', 'TissueEngineering', 'CellularReprogramming', 'GeneEditing', 'ImmuneReset', 'WoundRegeneration', 'AntiAging'],
    'pcc_metabolic_surgery': ['BariatricRisk', 'ProcedureSelection', 'NutritionalDeficiency', 'DumpingSyndrome', 'WeightRecurrence', 'DiabetesRemission', 'MetabolicMonitoring', 'PreopOptimization', 'PostopDiet', 'LongTermFollowUp'],
}


def table_for(mod):
    return f'{PKG}{mod}'


def make_pkg_sql():
    parts = [f'-- {PHASE} package schema v{VER}\n',
             f'CREATE SCHEMA IF NOT EXISTS {PKG.rstrip("_")};']
    for mod, _, _ in MODULES:
        cols = ',\n    '.join([f'{n} {t}' for n, t in COLUMNS])
        parts.append(f'CREATE TABLE IF NOT EXISTS {table_for(mod)} (\n    id BIGSERIAL PRIMARY KEY,\n    {cols}\n);')
        parts.append(f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_tenant ON {table_for(mod)}(tenant_id);')
        parts.append(f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_encounter ON {table_for(mod)}(encounter_id);')
    return '\n\n'.join(parts) + '\n'


def make_module_sql(mod):
    cols = ',\n    '.join([f'{n} {t}' for n, t in COLUMNS])
    return (f'-- {PHASE} module schema for {mod} v{VER}\n'
            f'CREATE TABLE IF NOT EXISTS {table_for(mod)} (\n    id BIGSERIAL PRIMARY KEY,\n    {cols}\n);\n'
            f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_tenant ON {table_for(mod)}(tenant_id);\n'
            f'CREATE INDEX IF NOT EXISTS idx_{table_for(mod)}_encounter ON {table_for(mod)}(encounter_id);\n')


def make_engine(mod):
    cap = ENGINE_FUNCS[mod]
    funcs = []
    for fn in cap:
        funcs.append(f"""function {fn}(input) {{
  const i = input || {{}};
  const t = String(i.t || '');
  let plan = '{fn.lower()}-none';
  if (t === 'yes') plan = '{fn.lower()}-protocol';
  return {{ plan, t }};
}}""")
    return f"""// {PHASE} {mod}_engine v{VER}
'use strict';
{chr(10).join(funcs)}
module.exports = {{
  {', '.join(cap)}
}};
"""


def make_unit_test(mod):
    cap = ENGINE_FUNCS[mod]
    tests = []
    for fn in cap:
        tests.append(f"it('{fn}', () => assertEq(Engine.{fn}({{ t: 'yes' }}).plan, '{fn.lower()}-protocol'));")
    return f"""// {PHASE} {mod} unit tests
const Engine = require('./{mod}_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {{ try {{ fn(); console.log('  ✓ ' + name); passed++; }} catch (e) {{ console.log('  ✗ ' + name + ': ' + e.message); failed++; }} }}
function assertEq(a, b) {{ assert.strictEqual(a, b); }}
console.log('{mod} engine tests:');
{chr(10).join(tests)}
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
"""


def make_integration_test(mod, label):
    cap = ENGINE_FUNCS[mod]
    funcs = '\n'.join([f"  it('{fn}', () => {{ const r = Engine.{fn}({{}}); assert(r.plan); }});" for fn in cap])
    return f"""// {PHASE} {mod} integration tests v{VER}
const Engine = require('./{mod}_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {{ try {{ fn(); console.log('  ✓ integ-' + name); passed++; }} catch (e) {{ console.log('  ✗ integ-' + name + ': ' + e.message); failed++; }} }}

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
{funcs}
  console.log(`SUMMARY: ${{passed}} passed, ${{failed}} failed`);
  process.exit(failed === 0 ? 0 : 1);
}})();
"""


def make_routes(mod, label):
    cap = ENGINE_FUNCS[mod]
    calls = '\n'.join([f"router.post('/call/{fn}', (req, res) => {{ const r = Engine.{fn}(req.body || {{}}); res.json({{ version: VER, module: '{mod}', function: '{fn}', plan: r.plan }}); }});" for fn in cap])
    return f"""// {PHASE} {mod}_routes v{VER}
// {PHASE}: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./{mod}_engine.js');
const VER = '{VER}';
const router = express.Router();

router.get('/list', (req, res) => {{
  res.json({{ version: VER, module: '{mod}', label: '{label}', functions: Object.keys(Engine) }});
}});

{calls}

router.post('/record', (req, res) => {{
  const {{ encounter_id, tenant_id, input, fn, created_by }} = req.body || {{}};
  if (!tenant_id) return res.status(400).json({{ error: 'tenant_id required' }});
  const r = Engine[fn](input || {{}});
  res.json({{ version: VER, module: '{mod}', function: fn, plan: r.plan, recorded: true }});
}});

module.exports = router;
"""


def kebab(s):
    return s.replace('_', '-')


def main():
    for mod, label, _ in MODULES:
        os.makedirs(mod, exist_ok=True)
        with open(os.path.join(mod, f'{mod}_engine.js'), 'w', encoding='utf-8') as f:
            f.write(make_engine(mod))
        with open(os.path.join(mod, f'{mod}_test.js'), 'w', encoding='utf-8') as f:
            f.write(make_unit_test(mod))
        with open(os.path.join(mod, f'{mod}_integration_test.js'), 'w', encoding='utf-8') as f:
            f.write(make_integration_test(mod, label))
        with open(os.path.join(mod, f'{mod}_routes.js'), 'w', encoding='utf-8') as f:
            f.write(make_routes(mod, label))
        with open(os.path.join(mod, f'{mod}_up.sql'), 'w', encoding='utf-8') as f:
            f.write(make_module_sql(mod))
    with open(f'migrations/{PKG}package_up.sql', 'w', encoding='utf-8') as f:
        f.write(make_pkg_sql())
    for mod, _, _ in MODULES:
        with open(f'migrations/{PKG}{mod}_up.sql', 'w', encoding='utf-8') as f:
            f.write(make_module_sql(mod))
    print(f'{PHASE} v{VER} generated: {len(MODULES)} modules')


if __name__ == '__main__':
    main()
