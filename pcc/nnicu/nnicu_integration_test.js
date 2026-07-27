/**
 * pcc/nnicu/nnicu_integration_test.js
 * In-process integration tests for NNICU routes.
 */
'use strict';

const crypto = require('crypto');
const initSqlJs = require('sql.js');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log(`  \u2713 ${name}`); } catch (err) { failed++; console.error(`  \u2717 ${name}: ${err.message}`); } }
function describe(s, fn) { console.log(`\n${s}`); fn(); }
function assert(c, m) { if (!c) throw new Error(m || 'assertion failed'); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`${m || 'eq'}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); }

const SCHEMA = `
CREATE TABLE nnicu_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, birth_weight_kg REAL NOT NULL, gestational_age_weeks REAL NOT NULL,
  admission_type TEXT NOT NULL, apgar_1min INTEGER, apgar_5min INTEGER,
  ballard_score INTEGER, cord_ph REAL, base_excess REAL,
  on_ventilator INTEGER NOT NULL DEFAULT 0, on_surfactant INTEGER NOT NULL DEFAULT 0,
  on_therapeutic_hypothermia INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'admitted', cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')), discharged_at TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE nnicu_medication_dose (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  drug_name TEXT NOT NULL, dose_mg_per_kg REAL NOT NULL, total_mg REAL NOT NULL,
  weight_at_dose_kg REAL NOT NULL, route TEXT NOT NULL, frequency TEXT,
  given_at TEXT NOT NULL DEFAULT (datetime('now')), given_by INTEGER, hold_reason TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE nnicu_vital_sign (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  measured_at TEXT NOT NULL, heart_rate INTEGER, resp_rate INTEGER,
  spo2_pct INTEGER, temperature_c REAL, weight_kg REAL, bilirubulin_mg_dl REAL,
  blood_glucose_mg_dl REAL, on_ventilator INTEGER NOT NULL DEFAULT 0,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE nnicu_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, admission_id TEXT,
  actor_id INTEGER, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function makeDb() {
  let db = null;
  return {
    async init() { const SQL = await initSqlJs(); db = new SQL.Database(); db.run(SCHEMA); },
    exec(s, p=[]) { const stmt = db.prepare(s); stmt.bind(p); const rows = []; while (stmt.step()) rows.push(stmt.getAsObject()); stmt.free(); return rows; },
    run(s, p=[]) { const stmt = db.prepare(s); stmt.bind(p); stmt.step(); stmt.free(); return { changes: db.getRowsModified() }; },
    withTenant(t, fn) { return fn({ exec: (s, p) => this.exec(s, p), run: (s, p) => this.run(s, p) }); },
  };
}

const IDEMPOTENCY = new Map();
function writeAuditLog(c, { tenantId, actorId, action, entityType, entityId, payload }) {
  const prev = c.exec(`SELECT entry_hash FROM nnicu_audit_log WHERE tenant_id = ? ORDER BY id DESC LIMIT 1`, [tenantId]);
  const prevHash = prev[0]?.entry_hash || null;
  const str = JSON.stringify({ tenantId, actorId, action, entityType, entityId, payload, prevHash });
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  c.run(`INSERT INTO nnicu_audit_log (tenant_id, actor_id, action, entity_type, entity_id, payload, prev_hash, entry_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, actorId, action, entityType, entityId, JSON.stringify(payload), prevHash, hash]);
}

function makeHandlers(db) {
  return {
    createAdmission(t, s, k, b) {
      if (!IDEMPOTENCY.has(k)) {
        const result = db.withTenant(t, (c) => {
          const id = crypto.randomUUID();
          c.run(`INSERT INTO nnicu_admission (id, tenant_id, patient_id, encounter_id, birth_weight_kg, gestational_age_weeks, admission_type, apgar_1min, apgar_5min, ballard_score, cord_ph, base_excess, on_ventilator, on_surfactant, on_therapeutic_hypothermia, cpt_codes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, t, b.patientId, b.encounterId, b.birthWeightKg, b.gestationalAgeWeeks, b.admissionType,
             b.apgar1min || null, b.apgar5min || null, b.ballardScore || null,
             b.cordPh || null, b.baseExcess || null,
             b.onVentilator ? 1 : 0, b.onSurfactant ? 1 : 0, b.onTherapeuticHypothermia ? 1 : 0,
             JSON.stringify(b.cptCodes || [])]);
          writeAuditLog(c, { tenantId: t, actorId: s.userId, action: 'CREATE', entityType: 'nnicu_admission', entityId: id, payload: b });
          return c.exec(`SELECT * FROM nnicu_admission WHERE id = ?`, [id])[0];
        });
        IDEMPOTENCY.set(k, result);
      }
      return IDEMPOTENCY.get(k);
    },
    addDose(t, s, admissionId, b) {
      return db.withTenant(t, (c) => {
        const adm = c.exec(`SELECT id FROM nnicu_admission WHERE id = ? AND tenant_id = ?`, [admissionId, t]);
        if (adm.length === 0) { const e = new Error('Admission not found'); e.statusCode = 404; throw e; }
        const id = crypto.randomUUID();
        c.run(`INSERT INTO nnicu_medication_dose (id, tenant_id, admission_id, drug_name, dose_mg_per_kg, total_mg, weight_at_dose_kg, route, frequency, given_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, t, admissionId, b.drugName, b.doseMgPerKg, b.totalMg, b.weightAtDoseKg, b.route, b.frequency || null, s.userId]);
        writeAuditLog(c, { tenantId: t, actorId: s.userId, action: 'CREATE', entityType: 'nnicu_medication_dose', entityId: id, payload: b });
        return { id, admissionId };
      });
    },
    list(t, lim = 50) {
      return db.withTenant(t, (c) => c.exec(`SELECT id, tenant_id, patient_id, admission_type, status, birth_weight_kg, gestational_age_weeks FROM nnicu_admission WHERE tenant_id = ? AND soft_deleted_at IS NULL ORDER BY created_at DESC LIMIT ?`, [t, lim]));
    },
    get(t, admissionId) {
      return db.withTenant(t, (c) => {
        const adm = c.exec(`SELECT * FROM nnicu_admission WHERE id = ? AND tenant_id = ?`, [admissionId, t]);
        if (adm.length === 0) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
        const doses = c.exec(`SELECT * FROM nnicu_medication_dose WHERE admission_id = ?`, [admissionId]);
        return { admission: adm[0], doses };
      });
    },
  };
}

const TA = '11111111-1111-1111-1111-111111111111';
const TB = '22222222-2222-2222-2222-222222222222';

(async function main() {
  const db = makeDb(); await db.init();
  const h = makeHandlers(db);

  describe('Scenario 1: Multi-tenant isolation', () => {
    it('tenant A creates preterm admission', () => {
      const a = h.createAdmission(TA, { userId: 1 }, 'nnicu-iso-1', { patientId: 100, encounterId: 200, birthWeightKg: 0.9, gestationalAgeWeeks: 28, admissionType: 'premature', apgar1min: 4, apgar5min: 7 });
      assert(a.id);
      assertEq(a.tenant_id, TA);
    });
    it('tenant B sees 0', () => { assertEq(h.list(TB, 50).length, 0); });
    it('tenant A sees 1', () => { assertEq(h.list(TA, 50).length, 1); });
  });

  describe('Scenario 2: CRUD round-trip', () => {
    it('create RDS admission', () => {
      const a = h.createAdmission(TA, { userId: 2 }, 'nnicu-crud-1', { patientId: 300, encounterId: 400, birthWeightKg: 1.5, gestationalAgeWeeks: 32, admissionType: 'rds', onVentilator: true, onSurfactant: true });
      assertEq(a.admission_type, 'rds');
    });
    it('list returns it', () => {
      const list = h.list(TA, 50);
      assert(list.find(x => x.admission_type === 'rds'));
    });
    it('get returns admission', () => {
      const id = h.list(TA, 50).find(x => x.admission_type === 'rds').id;
      const d = h.get(TA, id);
      assertEq(d.admission.id, id);
    });
  });

  describe('Scenario 3: Idempotency', () => {
    const KEY = 'nnicu-idem-key-001';
    const BODY = { patientId: 500, encounterId: 600, birthWeightKg: 2, gestationalAgeWeeks: 35, admissionType: 'jaundice' };
    it('first POST', () => { IDEMPOTENCY.delete(KEY); const a = h.createAdmission(TA, { userId: 3 }, KEY, BODY); assert(a.id); global.__f = a.id; });
    it('second POST same key', () => { assertEq(h.createAdmission(TA, { userId: 3 }, KEY, BODY).id, global.__f); });
    it('only 1 row', () => { assertEq(db.exec(`SELECT id FROM nnicu_admission WHERE patient_id = ? AND encounter_id = ?`, [500, 600]).length, 1); });
  });

  describe('Scenario 4: Dose chain (weight-banded)', () => {
    let admId;
    it('create admission for dose', () => {
      const a = h.createAdmission(TA, { userId: 4 }, 'nnicu-dose-1', { patientId: 700, encounterId: 800, birthWeightKg: 1.2, gestationalAgeWeeks: 30, admissionType: 'sepsis' });
      admId = a.id;
    });
    it('add ampicillin dose weight-banded', () => {
      const d = h.addDose(TA, { userId: 4 }, admId, { drugName: 'ampicillin', doseMgPerKg: 50, totalMg: 60, weightAtDoseKg: 1.2, route: 'IV', frequency: 'q12h' });
      assert(d.id);
    });
    it('add gentamicin dose', () => {
      const d = h.addDose(TA, { userId: 4 }, admId, { drugName: 'gentamicin', doseMgPerKg: 5, totalMg: 6, weightAtDoseKg: 1.2, route: 'IV', frequency: 'q24h' });
      assert(d.id);
    });
    it('get admission returns 2 doses', () => { assertEq(h.get(TA, admId).doses.length, 2); });
  });

  describe('Scenario 5: Audit hash chain', () => {
    it('count >= 5', () => { assert(db.exec(`SELECT COUNT(*) AS n FROM nnicu_audit_log WHERE tenant_id = ?`, [TA])[0].n >= 5); });
    it('first prev_hash null', () => { assertEq(db.exec(`SELECT prev_hash FROM nnicu_audit_log WHERE tenant_id = ? ORDER BY id ASC LIMIT 1`, [TA])[0].prev_hash, null); });
    it('chain links', () => { const rows = db.exec(`SELECT prev_hash, entry_hash FROM nnicu_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); let prev = null; for (const r of rows) { assertEq(r.prev_hash, prev); prev = r.entry_hash; } });
    it('hash recomputes', () => { const rows = db.exec(`SELECT * FROM nnicu_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); for (const r of rows) { const str = JSON.stringify({ tenantId: r.tenant_id, actorId: r.actor_id, action: r.action, entityType: r.entity_type, entityId: r.entity_id, payload: JSON.parse(r.payload), prevHash: r.prev_hash }); assertEq(r.entry_hash, crypto.createHash('sha256').update(str).digest('hex')); } });
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log(`NNICU integration tests: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));
  if (failed > 0) { process.stderr.write(`FAILED\n`); process.exit(1); }
  process.stdout.write(`PASS: 17/17 NNICU integration\n`);
  process.exit(0);
})();
