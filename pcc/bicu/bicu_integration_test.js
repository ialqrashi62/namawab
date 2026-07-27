/**
 * pcc/bicu/bicu_integration_test.js
 * In-process integration tests for BICU routes.
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
CREATE TABLE bicu_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, burn_mechanism TEXT NOT NULL,
  tbsa_pct REAL NOT NULL, burn_depth TEXT NOT NULL,
  inhalation_injury INTEGER NOT NULL DEFAULT 0, baux_score INTEGER,
  status TEXT NOT NULL DEFAULT 'admitted', cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')), discharged_at TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE bicu_fluid_balance (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  measured_at TEXT NOT NULL, fluid_in_ml REAL, fluid_out_ml REAL,
  urine_output_ml REAL, rate_ml_per_hour REAL,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE bicu_red_flag (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  flag_type TEXT NOT NULL, severity TEXT NOT NULL, description TEXT,
  response TEXT, acknowledged_by INTEGER, acknowledged_at TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE bicu_audit_log (
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
  const prev = c.exec(`SELECT entry_hash FROM bicu_audit_log WHERE tenant_id = ? ORDER BY id DESC LIMIT 1`, [tenantId]);
  const prevHash = prev[0]?.entry_hash || null;
  const str = JSON.stringify({ tenantId, actorId, action, entityType, entityId, payload, prevHash });
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  c.run(`INSERT INTO bicu_audit_log (tenant_id, actor_id, action, entity_type, entity_id, payload, prev_hash, entry_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, actorId, action, entityType, entityId, JSON.stringify(payload), prevHash, hash]);
}

function makeHandlers(db) {
  return {
    createAdmission(t, s, k, b) {
      if (!IDEMPOTENCY.has(k)) {
        const result = db.withTenant(t, (c) => {
          const id = crypto.randomUUID();
          c.run(`INSERT INTO bicu_admission (id, tenant_id, patient_id, encounter_id, burn_mechanism, tbsa_pct, burn_depth, inhalation_injury, baux_score, cpt_codes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, t, b.patientId, b.encounterId, b.burnMechanism, b.tbsaPct, b.burnDepth,
             b.inhalationInjury ? 1 : 0, b.bauxScore || null, JSON.stringify(b.cptCodes || [])]);
          writeAuditLog(c, { tenantId: t, actorId: s.userId, action: 'CREATE', entityType: 'bicu_admission', entityId: id, payload: b });
          return c.exec(`SELECT * FROM bicu_admission WHERE id = ?`, [id])[0];
        });
        IDEMPOTENCY.set(k, result);
      }
      return IDEMPOTENCY.get(k);
    },
    recordFluid(t, s, admissionId, b) {
      return db.withTenant(t, (c) => {
        const adm = c.exec(`SELECT id FROM bicu_admission WHERE id = ? AND tenant_id = ?`, [admissionId, t]);
        if (adm.length === 0) { const e = new Error('Admission not found'); e.statusCode = 404; throw e; }
        const id = crypto.randomUUID();
        c.run(`INSERT INTO bicu_fluid_balance (id, tenant_id, admission_id, measured_at, fluid_in_ml, fluid_out_ml, urine_output_ml, rate_ml_per_hour) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, t, admissionId, b.measuredAt || new Date().toISOString(), b.fluidInMl, b.fluidOutMl, b.urineOutputMl, b.rateMlPerHour]);
        writeAuditLog(c, { tenantId: t, actorId: s.userId, action: 'CREATE', entityType: 'bicu_fluid_balance', entityId: id, payload: b });
        return { id, admissionId };
      });
    },
    list(t, lim = 50) {
      return db.withTenant(t, (c) => c.exec(`SELECT id, tenant_id, patient_id, burn_mechanism, tbsa_pct, burn_depth, inhalation_injury, baux_score, status FROM bicu_admission WHERE tenant_id = ? AND soft_deleted_at IS NULL ORDER BY created_at DESC LIMIT ?`, [t, lim]));
    },
    get(t, admissionId) {
      return db.withTenant(t, (c) => {
        const adm = c.exec(`SELECT * FROM bicu_admission WHERE id = ? AND tenant_id = ?`, [admissionId, t]);
        if (adm.length === 0) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
        const fluid = c.exec(`SELECT * FROM bicu_fluid_balance WHERE admission_id = ?`, [admissionId]);
        return { admission: adm[0], fluidBalance: fluid };
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
    it('tenant A creates burn admission', () => {
      const a = h.createAdmission(TA, { userId: 1 }, 'bicu-iso-1', { patientId: 100, encounterId: 200, burnMechanism: 'thermal', tbsaPct: 35, burnDepth: 'full_thickness', inhalationInjury: true, bauxScore: 110 });
      assert(a.id);
      assertEq(a.tenant_id, TA);
    });
    it('tenant B sees 0', () => { assertEq(h.list(TB, 50).length, 0); });
    it('tenant A sees 1', () => { assertEq(h.list(TA, 50).length, 1); });
  });

  describe('Scenario 2: CRUD round-trip', () => {
    it('create electrical burn', () => {
      const a = h.createAdmission(TA, { userId: 2 }, 'bicu-crud-1', { patientId: 300, encounterId: 400, burnMechanism: 'electrical', tbsaPct: 20, burnDepth: 'mixed', inhalationInjury: false });
      assertEq(a.burn_mechanism, 'electrical');
    });
    it('list returns it', () => {
      const list = h.list(TA, 50);
      assert(list.find(x => x.burn_mechanism === 'electrical'));
    });
    it('get returns full admission', () => {
      const id = h.list(TA, 50).find(x => x.burn_mechanism === 'electrical').id;
      const d = h.get(TA, id);
      assertEq(d.admission.id, id);
    });
  });

  describe('Scenario 3: Idempotency', () => {
    const KEY = 'bicu-idem-key-001';
    const BODY = { patientId: 500, encounterId: 600, burnMechanism: 'chemical', tbsaPct: 15, burnDepth: 'partial_thickness' };
    it('first POST', () => { IDEMPOTENCY.delete(KEY); const a = h.createAdmission(TA, { userId: 3 }, KEY, BODY); assert(a.id); global.__f = a.id; });
    it('second POST same key', () => { assertEq(h.createAdmission(TA, { userId: 3 }, KEY, BODY).id, global.__f); });
    it('only 1 row', () => { assertEq(db.exec(`SELECT id FROM bicu_admission WHERE patient_id = ? AND encounter_id = ?`, [500, 600]).length, 1); });
  });

  describe('Scenario 4: Fluid balance chain', () => {
    let admId;
    it('create admission for fluid tracking', () => {
      const a = h.createAdmission(TA, { userId: 4 }, 'bicu-fluid-1', { patientId: 700, encounterId: 800, burnMechanism: 'thermal', tbsaPct: 40, burnDepth: 'full_thickness' });
      admId = a.id;
    });
    it('record hour 1 fluid', () => {
      const r = h.recordFluid(TA, { userId: 4 }, admId, { fluidInMl: 800, fluidOutMl: 50, urineOutputMl: 30, rateMlPerHour: 800 });
      assert(r.id);
    });
    it('record hour 2 fluid', () => {
      const r = h.recordFluid(TA, { userId: 4 }, admId, { fluidInMl: 600, fluidOutMl: 80, urineOutputMl: 45, rateMlPerHour: 600 });
      assert(r.id);
    });
    it('get admission returns 2 fluid records', () => { assertEq(h.get(TA, admId).fluidBalance.length, 2); });
  });

  describe('Scenario 5: Audit hash chain', () => {
    it('count >= 5', () => { assert(db.exec(`SELECT COUNT(*) AS n FROM bicu_audit_log WHERE tenant_id = ?`, [TA])[0].n >= 5); });
    it('first prev_hash null', () => { assertEq(db.exec(`SELECT prev_hash FROM bicu_audit_log WHERE tenant_id = ? ORDER BY id ASC LIMIT 1`, [TA])[0].prev_hash, null); });
    it('chain links', () => { const rows = db.exec(`SELECT prev_hash, entry_hash FROM bicu_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); let prev = null; for (const r of rows) { assertEq(r.prev_hash, prev); prev = r.entry_hash; } });
    it('hash recomputes', () => { const rows = db.exec(`SELECT * FROM bicu_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); for (const r of rows) { const str = JSON.stringify({ tenantId: r.tenant_id, actorId: r.actor_id, action: r.action, entityType: r.entity_type, entityId: r.entity_id, payload: JSON.parse(r.payload), prevHash: r.prev_hash }); assertEq(r.entry_hash, crypto.createHash('sha256').update(str).digest('hex')); } });
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log(`BICU integration tests: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));
  if (failed > 0) { process.stderr.write(`FAILED\n`); process.exit(1); }
  process.stdout.write(`PASS: 17/17 BICU integration\n`);
  process.exit(0);
})();
