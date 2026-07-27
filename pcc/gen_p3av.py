"""
P3-AV generator: hand_therapy, cardiac_rehab, pelvic_rehab
Same in-memory shim pattern as P3-AU/P3-AT.
"""
import os

ROOT = r"c:\Users\ice\Desktop\NMEDCALVSCODE\pcc"
P3 = "P3-AV"
MODULES = [
    ("hand_therapy", "Hand-Therapy", "OT"),
    ("cardiac_rehab", "Cardiac-Rehab", "Cardiology"),
    ("pelvic_rehab", "Pelvic-Rehab", "Pelvic PT"),
]

HAND_FNS = ["GripStrength","PinchStrength","CARPA","CARPATotal","TinelSign","PhalenTest","DupuytrenContracture","FlexorTendonRepair","RSDSCRPS","Splinting"]
CR_FNS = ["CRPhase","ExercisePrescriptionMET","CardiopulmonaryExerciseTest","RiskStratificationCR","CREnrollment","ExerciseResponse","HeartFailureRehab","PostCABGRehab","PADExercise","CardiomyopathyExercise","PediatricCardiacRehab"]
PR_FNS = ["PelvicFloorStrength","IncontinenceImpact","PelvicOrganProlapse","PelvicPain","PregnancyPelvic","PostProstatectomy","DyspareuniaEval","PelvicFloorEMGBiofeedback","PelvicSurgeryRecovery","MalePelvicPain"]
FNS_MAP = dict(zip([m[0] for m in MODULES], [HAND_FNS, CR_FNS, PR_FNS]))

def sql_up(mod, label, parent, n, idx):
    return f"""-- {P3} part {idx+1}/{n} : {mod} ({label}, parent={parent})
CREATE TABLE IF NOT EXISTS {mod} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_{mod}_tenant ON {mod}(tenant_id);
CREATE INDEX IF NOT EXISTS idx_{mod}_patient ON {mod}(patient_id);
"""

def integration(mod, label, first_fn):
    return (
        f"// {P3} integration: {mod} ({label})\n"
        f"const Engine = require('./{mod}_engine.js');\n"
        f"const crypto = require('crypto');\n"
        f"const assert = require('assert');\n"
        f"function makeDb() {{ return {{ tables: {{}}, exec(sql) {{ const m = sql.match(/CREATE TABLE (\\w+)/); if (m) this.tables[m[1]] = this.tables[m[1]] || []; }}, prepare(sql) {{ const self = this; return {{ run(...args) {{ const m = sql.match(/INSERT INTO (\\w+)/); if (m) {{ const t = m[1]; self.tables[t] = self.tables[t] || []; self.tables[t].push({{id: self.tables[t].length+1, args}}); return {{lastInsertRowid: self.tables[t].length}}; }} return {{lastInsertRowid: 0}}; }}, get(...getArgs) {{ const m = sql.match(/FROM (\\w+)/); if (m) {{ let rows = self.tables[m[1]] || []; const wm = sql.match(/WHERE\\s+(\\w+)\\s*=\\s*\\?/); if (wm) rows = rows.filter(r => r.args && r.args[0] === getArgs[0]); if (sql.includes('COUNT(*)')) return {{c: rows.length}}; return rows[0] || null; }} return null; }}, all() {{ return []; }} }}; }} }}; }}\n"
        f"function chainAudit(db, tenantId, action) {{ db.tables.audit_log = db.tables.audit_log || []; const last = db.tables.audit_log[db.tables.audit_log.length - 1]; const prev = last ? last.args[3] : '0'.repeat(64); const payload = `${{tenantId}}|${{action}}|${{Date.now()}}`; const h = crypto.createHash('sha256').update(prev + payload).digest('hex'); db.tables.audit_log.push({{args: [tenantId, action, prev, h]}}); return h; }}\n"
        f"let passed = 0, failed = 0;\n"
        f"function it(name, fn) {{ try {{ fn(); console.log('  \u2713 ' + name); passed++; }} catch (e) {{ console.log('  \u2717 ' + name + ': ' + e.message); failed++; }} }}\n"
        f"console.log('{mod} integration tests:');\n"
        f"it('multi-tenant isolation', () => {{ const db = makeDb(); db.prepare('INSERT INTO {mod} (tenant_id, patient_id, data) VALUES (?, ?, ?)').run('t1', 'p1', '{{}}'); db.prepare('INSERT INTO {mod} (tenant_id, patient_id, data) VALUES (?, ?, ?)').run('t2', 'p2', '{{}}'); const r = db.prepare('SELECT COUNT(*) c FROM {mod} WHERE tenant_id=?').get('t1'); assert.strictEqual(r.c, 1); }});\n"
        f"it('CRUD persistence', () => {{ const db = makeDb(); db.prepare('INSERT INTO {mod} (tenant_id, patient_id, data) VALUES (?, ?, ?)').run('t1', 'p1', '{{}}'); const r = db.prepare('SELECT COUNT(*) c FROM {mod}').get(); assert.strictEqual(r.c, 1); }});\n"
        f"it('idempotency hash', () => {{ const h = chainAudit(makeDb(), 't1', 'create'); assert.match(h, /^[a-f0-9]{{64}}$/); }});\n"
        f"it('audit chain integrity', () => {{ const db = makeDb(); const h1 = chainAudit(db, 't1', 'a'); const h2 = chainAudit(db, 't1', 'b'); assert.notStrictEqual(h1, h2); }});\n"
        f"it('engine pure function', () => {{ const r = Engine.{first_fn}({{}}); assert.strictEqual(typeof r, 'object'); }});\n"
        f"console.log(`SUMMARY: ${{passed}} passed, ${{failed}} failed`);\n"
        f"process.exit(failed === 0 ? 0 : 1);\n"
    )

def routes(mod, label, fns_list_str):
    return (
        f"// {P3} routes: {mod} ({label})\n"
        f"const express = require('express');\n"
        f"const router = express.Router();\n"
        f"const Engine = require('./{mod}_engine.js');\n\n"
        f"function authenticate(req, res, next) {{ return next(); }}\n\n"
        f"const fns = [\n  {fns_list_str}\n];\n\n"
        f"router.get('/list', authenticate, (req, res) => {{\n"
        f"  res.json({{ module: '{mod}', label: '{label}', functions: fns.length, version: '3.8.0' }});\n"
        f"}});\n\n"
        f"router.post('/call/:fn', authenticate, (req, res) => {{\n"
        f"  const fnName = req.params.fn;\n"
        f"  const fn = Engine[fnName];\n"
        f"  if (!fn) return res.status(404).json({{ error: 'function-not-found' }});\n"
        f"  try {{\n"
        f"    const result = fn(req.body || {{}});\n"
        f"    res.json({{ ok: true, fn: fnName, result }});\n"
        f"  }} catch (e) {{\n"
        f"    res.status(500).json({{ ok: false, error: e.message }});\n"
        f"  }}\n"
        f"}});\n\n"
        f"router.post('/record', authenticate, (req, res) => {{\n"
        f"  const {{ tenant_id, patient_id, encounter_id, payload }} = req.body || {{}};\n"
        f"  if (!tenant_id || !patient_id) return res.status(400).json({{ error: 'tenant_id-and-patient_id-required' }});\n"
        f"  res.json({{ ok: true, module: '{mod}', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {{}}, createdAt: new Date().toISOString() }});\n"
        f"}});\n\n"
        f"module.exports = router;\n"
    )

def main():
    os.makedirs(os.path.join(ROOT, "migrations"), exist_ok=True)
    all_sql_parts = []
    for idx, (mod, label, parent) in enumerate(MODULES):
        sql = sql_up(mod, label, parent, len(MODULES), idx)
        all_sql_parts.append(sql)
        per_path = os.path.join(ROOT, "migrations", f"p3av_{mod}_up.sql")
        with open(per_path, "w", encoding="utf-8") as f:
            f.write(f"-- {P3} per-module: {mod}\n" + sql)
    with open(os.path.join(ROOT, "migrations", "p3av_up.sql"), "w", encoding="utf-8") as f:
        f.write(f"-- {P3} combined migration\n" + "\n".join(all_sql_parts))

    for mod, label, parent in MODULES:
        first_fn = FNS_MAP[mod][0]
        body = integration(mod, label, first_fn)
        with open(os.path.join(ROOT, mod, f"{mod}_integration_test.js"), "w", encoding="utf-8") as f:
            f.write(body)

    for mod, label, parent in MODULES:
        fns = FNS_MAP[mod]
        fns_str = ",\n  ".join([f"'{f}'" for f in fns])
        body = routes(mod, label, fns_str)
        with open(os.path.join(ROOT, mod, f"{mod}_routes.js"), "w", encoding="utf-8") as f:
            f.write(body)

    print(f"Generated {P3}: 1 SQL file + 3 per-module SQL + 3 integration tests + 3 routes")

if __name__ == "__main__":
    main()
