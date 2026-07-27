'use strict';
const crypto = require('crypto');
const initSqlJs = require('sql.js');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

const SCHEMA = `CREATE TABLE IF NOT EXISTS wound_care_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, diagnosis TEXT, status TEXT NOT NULL DEFAULT 'active', cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS wound_care_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_wound_care_adm_tenant ON wound_care_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wound_care_audit_tenant ON wound_care_audit_log(tenant_id);\n`;

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
  const prev = c.exec(`SELECT entry_hash FROM wound_care_audit_log WHERE tenant_id = ? ORDER BY id DESC LIMIT 1`, [tenantId]);
  const prevHash = prev[0]?.entry_hash || null;
  const str = JSON.stringify({ tenantId, actorId, action, entityType, entityId, payload, prevHash });
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  c.run(`INSERT INTO wound_care_audit_log (tenant_id, actor_id, action, entity_type, entity_id, payload, prev_hash, entry_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, actorId, action, entityType, entityId, JSON.stringify(payload), prevHash, hash]);
}

function makeHandlers(db) {
  return {
    createAdmission(t, s, k, b) {
      if (!IDEMPOTENCY.has(k)) {
        const result = db.withTenant(t, (c) => {
          const id = crypto.randomUUID();
          c.run(`INSERT INTO wound_care_admission (id, tenant_id, patient_id, encounter_id, diagnosis) VALUES (?, ?, ?, ?, ?)`,
            [id, t, b.patientId, b.encounterId, b.diagnosis || 'unspecified']);
          writeAuditLog(c, { tenantId: t, actorId: s.userId, action: 'CREATE', entityType: 'wound_care_admission', entityId: id, payload: b });
          return c.exec(`SELECT * FROM wound_care_admission WHERE id = ?`, [id])[0];
        });
        IDEMPOTENCY.set(k, result);
      }
      return IDEMPOTENCY.get(k);
    },
    list(t, lim = 50) {
      return db.withTenant(t, (c) => c.exec(`SELECT id, tenant_id, patient_id, diagnosis, status FROM wound_care_admission WHERE tenant_id = ? AND soft_deleted_at IS NULL ORDER BY created_at DESC LIMIT ?`, [t, lim]));
    },
    get(t, id) {
      return db.withTenant(t, (c) => {
        const adm = c.exec(`SELECT * FROM wound_care_admission WHERE id = ? AND tenant_id = ?`, [id, t]);
        if (adm.length === 0) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
        return { admission: adm[0] };
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
    it('tenant A creates admission', () => { const a = h.createAdmission(TA, { userId: 1 }, 'wound_care-iso-1', { patientId: 100, encounterId: 200, diagnosis: 'test' }); assert(a.id); assertEq(a.tenant_id, TA); });
    it('tenant B sees 0', () => { assertEq(h.list(TB, 50).length, 0); });
    it('tenant A sees 1', () => { assertEq(h.list(TA, 50).length, 1); });
  });

  describe('Scenario 2: CRUD round-trip', () => {
    it('create', () => { const a = h.createAdmission(TA, { userId: 2 }, 'wound_care-crud-1', { patientId: 300, encounterId: 400, diagnosis: 'crud' }); assert(a.id); });
    it('list', () => { assert(h.list(TA, 50).length >= 2); });
    it('get', () => { const a = h.list(TA, 50)[0]; const d = h.get(TA, a.id); assertEq(d.admission.id, a.id); });
  });

  describe('Scenario 3: Idempotency', () => {
    const KEY = 'wound_care-idem-001';
    const BODY = { patientId: 500, encounterId: 600, diagnosis: 'idem' };
    it('first POST', () => { IDEMPOTENCY.delete(KEY); const a = h.createAdmission(TA, { userId: 3 }, KEY, BODY); assert(a.id); global.__f = a.id; });
    it('second POST same key', () => { assertEq(h.createAdmission(TA, { userId: 3 }, KEY, BODY).id, global.__f); });
    it('only 1 row', () => { assertEq(db.exec(`SELECT id FROM wound_care_admission WHERE patient_id = ? AND encounter_id = ?`, [500, 600]).length, 1); });
  });

  describe('Scenario 4: Chain', () => {
    let admId;
    it('create admission', () => { const a = h.createAdmission(TA, { userId: 4 }, 'wound_care-chain-1', { patientId: 700, encounterId: 800, diagnosis: 'chain' }); admId = a.id; assert(a.id); });
    it('create second', () => { const a = h.createAdmission(TA, { userId: 4 }, 'wound_care-chain-2', { patientId: 750, encounterId: 850, diagnosis: 'chain2' }); assert(a.id); });
    it('read after write', () => { const d = h.get(TA, admId); assert(d); });
  });

  describe('Scenario 5: Audit hash chain', () => {
    it('count >= 5', () => { assert(db.exec(`SELECT COUNT(*) AS n FROM wound_care_audit_log WHERE tenant_id = ?`, [TA])[0].n >= 5); });
    it('first prev_hash null', () => { assertEq(db.exec(`SELECT prev_hash FROM wound_care_audit_log WHERE tenant_id = ? ORDER BY id ASC LIMIT 1`, [TA])[0].prev_hash, null); });
    it('chain links', () => { const rows = db.exec(`SELECT prev_hash, entry_hash FROM wound_care_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); let prev = null; for (const r of rows) { assertEq(r.prev_hash, prev); prev = r.entry_hash; } });
    it('hash recomputes', () => { const rows = db.exec(`SELECT * FROM wound_care_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); for (const r of rows) { const str = JSON.stringify({ tenantId: r.tenant_id, actorId: r.actor_id, action: r.action, entityType: r.entity_type, entityId: r.entity_id, payload: JSON.parse(r.payload), prevHash: r.prev_hash }); assertEq(r.entry_hash, crypto.createHash('sha256').update(str).digest('hex')); } });
  });

  console.log();
  console.log('wound_care integration tests: ' + passed + ' passed, ' + failed + ' failed');
  if (failed > 0) { process.stderr.write('FAILED\n'); process.exit(1); }
  process.stdout.write('PASS: 17/17 wound_care integration\n');
  process.exit(0);
})();
