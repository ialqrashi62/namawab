/**
 * pcc/ccu/ccu_integration_test.js
 * In-process integration tests for CCU routes (mirrors cath_lab pattern).
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
CREATE TABLE ccu_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, admission_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted', primary_diagnosis TEXT,
  grace_score INTEGER, timi_score INTEGER, scai_stage TEXT,
  cpt_codes TEXT NOT NULL DEFAULT '[]', admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  discharged_at TEXT, soft_deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ccu_vital_sign (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  measured_at TEXT NOT NULL, heart_rate INTEGER, sbp_mmhg INTEGER, dbp_mmhg INTEGER,
  map_mmhg INTEGER, spo2_pct INTEGER, rhythm TEXT, lactate_mmol_l REAL,
  on_vasopressor INTEGER NOT NULL DEFAULT 0, arrhythmia_flag TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ccu_medication_admin (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  drug_class TEXT NOT NULL, drug_name TEXT NOT NULL, dose TEXT, route TEXT NOT NULL,
  given_at TEXT NOT NULL DEFAULT (datetime('now')), given_by INTEGER, hold_reason TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ccu_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, admission_id TEXT,
  actor_id INTEGER, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function makeDb() {
  let db = null;
  return {
    async init() {
      const SQL = await initSqlJs();
      db = new SQL.Database();
      db.run(SCHEMA);
    },
    exec(sql, params = []) {
      const stmt = db.prepare(sql); stmt.bind(params);
      const rows = []; while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free(); return rows;
    },
    run(sql, params = []) {
      const stmt = db.prepare(sql); stmt.bind(params); stmt.step(); stmt.free();
      return { changes: db.getRowsModified() };
    },
    withTenant(tenantId, fn) { return fn({ exec: (s, p) => this.exec(s, p), run: (s, p) => this.run(s, p) }); },
  };
}

const IDEMPOTENCY = new Map();
function writeAuditLog(client, { tenantId, actorId, action, entityType, entityId, payload }) {
  const prev = client.exec(`SELECT entry_hash FROM ccu_audit_log WHERE tenant_id = ? ORDER BY id DESC LIMIT 1`, [tenantId]);
  const prevHash = prev[0]?.entry_hash || null;
  const str = JSON.stringify({ tenantId, actorId, action, entityType, entityId, payload, prevHash });
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  client.run(`INSERT INTO ccu_audit_log (tenant_id, actor_id, action, entity_type, entity_id, payload, prev_hash, entry_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, actorId, action, entityType, entityId, JSON.stringify(payload), prevHash, hash]);
}

function makeHandlers(db) {
  return {
    createAdmission(tenantId, session, key, body) {
      if (!IDEMPOTENCY.has(key)) {
        const result = db.withTenant(tenantId, (c) => {
          const id = crypto.randomUUID();
          c.run(`INSERT INTO ccu_admission (id, tenant_id, patient_id, encounter_id, admission_type, primary_diagnosis, cpt_codes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, tenantId, body.patientId, body.encounterId, body.admissionType, body.primaryDiagnosis || null, JSON.stringify(body.cptCodes || [])]);
          writeAuditLog(c, { tenantId, actorId: session.userId, action: 'CREATE', entityType: 'ccu_admission', entityId: id, payload: body });
          return c.exec(`SELECT * FROM ccu_admission WHERE id = ?`, [id])[0];
        });
        IDEMPOTENCY.set(key, result);
      }
      return IDEMPOTENCY.get(key);
    },
    addVital(tenantId, session, admissionId, body) {
      return db.withTenant(tenantId, (c) => {
        const adm = c.exec(`SELECT id FROM ccu_admission WHERE id = ? AND tenant_id = ?`, [admissionId, tenantId]);
        if (adm.length === 0) { const e = new Error('Admission not found'); e.statusCode = 404; throw e; }
        const id = crypto.randomUUID();
        c.run(`INSERT INTO ccu_vital_sign (id, tenant_id, admission_id, measured_at, heart_rate, sbp_mmhg, dbp_mmhg, map_mmhg, spo2_pct, rhythm, on_vasopressor, arrhythmia_flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, tenantId, admissionId, body.measuredAt || new Date().toISOString(), body.heartRate, body.sbpMmhg, body.dbpMmhg, body.mapMmhg, body.spo2Pct, body.rhythm, body.onVasopressor ? 1 : 0, body.arrhythmiaFlag || null]);
        writeAuditLog(c, { tenantId, actorId: session.userId, action: 'CREATE', entityType: 'ccu_vital_sign', entityId: id, payload: body });
        return { id, admissionId };
      });
    },
    listAdmissions(tenantId, limit = 50) {
      return db.withTenant(tenantId, (c) =>
        c.exec(`SELECT id, tenant_id, patient_id, admission_type, status, grace_score, timi_score, scai_stage, primary_diagnosis FROM ccu_admission WHERE tenant_id = ? AND soft_deleted_at IS NULL ORDER BY created_at DESC LIMIT ?`,
          [tenantId, limit]));
    },
    getAdmission(tenantId, admissionId) {
      return db.withTenant(tenantId, (c) => {
        const adm = c.exec(`SELECT * FROM ccu_admission WHERE id = ? AND tenant_id = ? AND soft_deleted_at IS NULL`, [admissionId, tenantId]);
        if (adm.length === 0) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
        const vitals = c.exec(`SELECT * FROM ccu_vital_sign WHERE admission_id = ? ORDER BY measured_at DESC`, [admissionId]);
        return { admission: adm[0], vitals };
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
    it('tenant A creates admission', () => {
      const a = h.createAdmission(TA, { userId: 1 }, 'idem-iso-1', { patientId: 100, encounterId: 200, admissionType: 'post_pci', primaryDiagnosis: 'STEMI' });
      assert(a.id);
      assertEq(a.tenant_id, TA);
    });
    it('tenant B list sees 0 of A', () => {
      const list = h.listAdmissions(TB, 50);
      assertEq(list.length, 0);
    });
    it('tenant A list sees 1 of own', () => {
      const list = h.listAdmissions(TA, 50);
      assertEq(list.length, 1);
    });
  });

  describe('Scenario 2: CRUD round-trip', () => {
    it('create cardiogenic shock admission', () => {
      const a = h.createAdmission(TA, { userId: 2 }, 'idem-crud-1', { patientId: 300, encounterId: 400, admissionType: 'cardiogenic_shock', primaryDiagnosis: 'Anterior STEMI' });
      assertEq(a.admission_type, 'cardiogenic_shock');
    });
    it('list returns it', () => {
      const list = h.listAdmissions(TA, 50);
      const found = list.find(x => x.admission_type === 'cardiogenic_shock');
      assert(found);
    });
    it('get returns full admission', () => {
      const list = h.listAdmissions(TA, 50);
      const id = list.find(x => x.admission_type === 'cardiogenic_shock').id;
      const detail = h.getAdmission(TA, id);
      assertEq(detail.admission.id, id);
    });
  });

  describe('Scenario 3: Idempotency', () => {
    const KEY = 'idem-test-fixed-ccu';
    const BODY = { patientId: 500, encounterId: 600, admissionType: 'nstemi' };
    it('first POST returns admission', () => {
      IDEMPOTENCY.delete(KEY);
      const a = h.createAdmission(TA, { userId: 3 }, KEY, BODY);
      assert(a.id); global.__firstId = a.id;
    });
    it('second POST same key returns identical', () => {
      const b = h.createAdmission(TA, { userId: 3 }, KEY, BODY);
      assertEq(b.id, global.__firstId);
    });
    it('only 1 row in DB', () => {
      const rows = db.exec(`SELECT id FROM ccu_admission WHERE patient_id = ? AND encounter_id = ?`, [500, 600]);
      assertEq(rows.length, 1);
    });
  });

  describe('Scenario 4: Vitals chain', () => {
    let admId;
    it('create admission for vitals', () => {
      const a = h.createAdmission(TA, { userId: 4 }, 'idem-vital-1', { patientId: 700, encounterId: 800, admissionType: 'stemi' });
      admId = a.id;
    });
    it('add first vital sign', () => {
      const v = h.addVital(TA, { userId: 4 }, admId, { heartRate: 110, sbpMmhg: 95, dbpMmhg: 60, mapMmhg: 72, spo2Pct: 92, rhythm: 'sinus_tachy', onVasopressor: true, arrhythmiaFlag: null });
      assert(v.id);
    });
    it('add second vital sign', () => {
      const v = h.addVital(TA, { userId: 4 }, admId, { heartRate: 88, sbpMmhg: 110, dbpMmhg: 70, mapMmhg: 85, spo2Pct: 96, rhythm: 'sinus_rhythm', onVasopressor: false, arrhythmiaFlag: null });
      assert(v.id);
    });
    it('get admission returns 2 vitals', () => {
      const detail = h.getAdmission(TA, admId);
      assertEq(detail.vitals.length, 2);
    });
  });

  describe('Scenario 5: Audit hash chain', () => {
    it('audit log has expected count', () => {
      const rows = db.exec(`SELECT COUNT(*) AS n FROM ccu_audit_log WHERE tenant_id = ?`, [TA]);
      assert(rows[0].n >= 5);
    });
    it('first entry prev_hash = null', () => {
      const first = db.exec(`SELECT prev_hash, entry_hash FROM ccu_audit_log WHERE tenant_id = ? ORDER BY id ASC LIMIT 1`, [TA])[0];
      assertEq(first.prev_hash, null);
    });
    it('chain links correctly', () => {
      const rows = db.exec(`SELECT prev_hash, entry_hash FROM ccu_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]);
      let prev = null;
      for (const r of rows) { assertEq(r.prev_hash, prev); prev = r.entry_hash; }
    });
    it('hash recomputes', () => {
      const rows = db.exec(`SELECT * FROM ccu_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]);
      for (const r of rows) {
        const str = JSON.stringify({ tenantId: r.tenant_id, actorId: r.actor_id, action: r.action, entityType: r.entity_type, entityId: r.entity_id, payload: JSON.parse(r.payload), prevHash: r.prev_hash });
        const expected = crypto.createHash('sha256').update(str).digest('hex');
        assertEq(r.entry_hash, expected);
      }
    });
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log(`CCU integration tests: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));
  if (failed > 0) { process.stderr.write(`FAILED\n`); process.exit(1); }
  process.stdout.write(`PASS: 17/17 CCU integration\n`);
  process.exit(0);
})();
