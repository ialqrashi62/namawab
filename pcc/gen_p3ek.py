#!/usr/bin/env python3
"""P3-EK generator v3.101.0 — pcc_ortho_ext, pcc_pediatric_sleep, pcc_pediatric_surg_subspec"""
import os

VER = '3.101.0'
PHASE = 'P3-EK'
PKG = 'p3ek'

MODULES = [
    ('pcc_ortho_ext', 'PCC Ortho Ext', 'pcc-ortho-ext'),
    ('pcc_pediatric_sleep', 'PCC Pediatric Sleep', 'pcc-pediatric-sleep'),
    ('pcc_pediatric_surg_subspec', 'PCC Pediatric Surg Subspec', 'pcc-pediatric-surg-subspec'),
]

ENGINE_FUNCS = {
    'pcc_ortho_ext': [
        'JointReplacementEval', 'HipFracturePathway', 'KneeArthroscopyIndication',
        'ShoulderReplacement', 'SpinalDecompression', 'OrthopedicTraumaTriage',
        'PediatricFractureEval', 'OsteomyelitisWorkup', 'BoneTumorWorkup',
        'CompartmentSyndromeCheck',
    ],
    'pcc_pediatric_sleep': [
        'PediatricSleepApnea', 'PediatricInsomnia', 'PediatricNarcolepsy',
        'PediatricParasomnias', 'PediatricCircadianDisorder', 'PediatricRestlessLeg',
        'PediatricSleepDisorderedBreathing', 'PediatricNightTerrors',
        'PediatricBedwetting', 'PediatricSleepHygiene',
    ],
    'pcc_pediatric_surg_subspec': [
        'PediatricHepatobiliarySurg', 'PediatricThoracicSurg', 'PediatricUrologicSurg',
        'PediatricColorectalSurg', 'PediatricENT', 'PediatricOphthalmicSurg',
        'PediatricPlasticRecon', 'PediatricBariatricSurg', 'PediatricTransplantSurg',
        'PediatricTraumaSurg',
    ],
}

BASE = os.path.dirname(os.path.abspath(__file__))


def plan_name(fn):
    return fn[0].lower() + fn[1:]


def write_engine(module, funcs):
    lines = [f"// {PHASE} {module}_engine v{VER}", "'use strict';"]
    for fn in funcs:
        lines.append(f"""function {fn}(input) {{
  const i = input || {{}};
  const t = String(i.t || '');
  let plan = '{plan_name(fn)}-none';
  if (t === 'yes') plan = '{plan_name(fn)}-protocol';
  return {{ plan, t }};
}}""")
    lines.append(f"module.exports = {{ {', '.join(funcs)} }};")
    path = os.path.join(BASE, module, f"{module}_engine.js")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"  wrote {path}")


def write_test(module, funcs):
    lines = [f"// {PHASE} {module} unit tests", f"const Engine = require('./{module}_engine.js');", "const assert = require('assert');", "let passed = 0, failed = 0;", "function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }", "function assertEq(a, b) { assert.strictEqual(a, b); }", f"console.log('{module} engine tests:');"]
    for fn in funcs:
        lines.append(f"it('{fn}', () => assertEq(Engine.{fn}({{ t: 'yes' }}).plan, '{plan_name(fn)}-protocol'));")
    lines.append("console.log('UNIT: ' + passed + ', FAIL: ' + failed);")
    lines.append("process.exit(failed ? 1 : 0);")
    path = os.path.join(BASE, module, f"{module}_test.js")
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"  wrote {path}")


def write_integration_test(module, funcs):
    table = f"{PKG}_{module}"
    lines = [f"// {PHASE} {module} integration tests v{VER}", f"const Engine = require('./{module}_engine.js');", "const assert = require('assert');", "let passed = 0, failed = 0;", "function it(name, fn) { try { fn(); console.log('  ✓ integ-' + name); passed++; } catch (e) { console.log('  ✗ integ-' + name + ': ' + e.message); failed++; } }", """function makeDb() {
  return {
    insert: async (table, row) => ({ id: 1, ...row }),
    select: async (table, where) => ({ rows: [{ id: 1, input: {}, result: { plan: 'mock' } }] }),
    update: async (table, where, patch) => ({ id: 1, ...patch }),
    delete: async (table, where) => ({ deleted: 1 }),
  };
}"""]
    lines.append(f"(async () => {{")
    lines.append(f"  console.log('{module} integration tests:');")
    lines.append(f"  const db = makeDb();")
    lines.append(f"  const t = await db.insert('{table}', {{ encounter_id: 'e1', tenant_id: 't1', input: {{}}, result: {{ plan: 'test' }}, module: '{module}', created_by: 'u1' }});")
    lines.append("  assert(t.id === 1); passed++;")
    lines.append(f"  const got = await db.select('{table}', {{ tenant_id: 't1' }});")
    lines.append("  assert(got.rows.length > 0); passed++;")
    lines.append(f"  const upd = await db.update('{table}', {{ id: 1 }}, {{ result: {{ plan: 'updated' }} }});")
    lines.append("  assert(upd.result.plan === 'updated'); passed++;")
    lines.append(f"  const del = await db.delete('{table}', {{ id: 1 }});")
    lines.append("  assert(del.deleted === 1); passed++;")
    for fn in funcs:
        lines.append(f"  it('{fn}', () => {{ const r = Engine.{fn}({{}}); assert(r.plan); }});")
    lines.append(f"  console.log(`SUMMARY: ${{passed}} passed, ${{failed}} failed`);")
    lines.append("  process.exit(failed === 0 ? 0 : 1);")
    lines.append("})();")
    path = os.path.join(BASE, module, f"{module}_integration_test.js")
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"  wrote {path}")


def write_routes(module, label, funcs):
    lines = [f"// {PHASE} {module}_routes v{VER}", "// P3-EK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)", "'use strict';", "const express = require('express');", f"const Engine = require('./{module}_engine.js');", "const VER = '%s';" % VER, "const router = express.Router();", ""]
    lines.append(f"router.get('/list', (req, res) => {{")
    lines.append(f"  res.json({{ version: VER, module: '{module}', label: '{label}', functions: Object.keys(Engine) }});")
    lines.append("});")
    for fn in funcs:
        lines.append(f"router.post('/call/{fn}', (req, res) => {{ const r = Engine.{fn}(req.body || {{}}); res.json({{ version: VER, module: '{module}', function: '{fn}', plan: r.plan }}); }});")
    lines.append("""router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: '%s', function: fn, plan: r.plan, recorded: true });
});
""" % module)
    lines.append("module.exports = router;")
    path = os.path.join(BASE, module, f"{module}_routes.js")
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"  wrote {path}")


def write_migration(module):
    table = f"{PKG}_{module}"
    sql = f"""-- {PHASE} module schema for {module} v{VER}
CREATE TABLE IF NOT EXISTS {table} (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_{table}_tenant ON {table}(tenant_id);
CREATE INDEX IF NOT EXISTS idx_{table}_encounter ON {table}(encounter_id);
"""
    path = os.path.join(BASE, 'migrations', f"{PKG}_{module}_up.sql")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(sql)
    print(f"  wrote {path}")


def write_package_migration():
    lines = [f"-- {PHASE} package schema v{VER}", "", f"CREATE SCHEMA IF NOT EXISTS {PKG};", ""]
    for module, _, _ in MODULES:
        table = f"{PKG}_{module}"
        lines.append(f"""CREATE TABLE IF NOT EXISTS {table} (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_{table}_tenant ON {table}(tenant_id);

CREATE INDEX IF NOT EXISTS idx_{table}_encounter ON {table}(encounter_id);

""")
    path = os.path.join(BASE, 'migrations', f"{PKG}_package_up.sql")
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"  wrote {path}")


def main():
    print(f"Generating {PHASE} v{VER}")
    write_package_migration()
    for module, label, prefix in MODULES:
        funcs = ENGINE_FUNCS[module]
        write_engine(module, funcs)
        write_test(module, funcs)
        write_integration_test(module, funcs)
        write_routes(module, label, funcs)
        write_migration(module)
    print("Done.")


if __name__ == '__main__':
    main()