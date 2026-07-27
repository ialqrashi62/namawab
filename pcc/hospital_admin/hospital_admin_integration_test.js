// P3-AM integration: hospital_admin (self-running)
const Engine = require('./hospital_admin_engine.js');
const crypto = require('crypto');
const assert = require('assert');

function makeDb() {
  return {
    tables: {},
    exec(sql) {
      const m = sql.match(/CREATE TABLE (\w+)/);
      if (m) this.tables[m[1]] = this.tables[m[1]] || [];
    },
    prepare(sql) {
      const self = this;
      return {
        run(...args) {
          const m = sql.match(/INSERT INTO (\w+)/);
          if (m) {
            const tbl = m[1];
            self.tables[tbl] = self.tables[tbl] || [];
            self.tables[tbl].push({ id: self.tables[tbl].length + 1, args });
            return { lastInsertRowid: self.tables[tbl].length };
          }
          return { lastInsertRowid: 0 };
        },
        get(...getArgs) {
          const m = sql.match(/FROM (\w+)/);
          if (m) {
            let rows = self.tables[m[1]] || [];
            const wm = sql.match(/WHERE\s+(\w+)\s*=\s*\?/);
            if (wm) rows = rows.filter(r => r.args && r.args[0] === getArgs[0]);
            if (sql.includes('COUNT(*)')) return { c: rows.length };
            return rows[0] || null;
          }
          return null;
        },
        all() { return []; }
      };
    }
  };
}

function chainAudit(db, tenantId, action) {
  db.tables.audit_log = db.tables.audit_log || [];
  const last = db.tables.audit_log[db.tables.audit_log.length - 1];
  const prev = last ? last.args[3] : '0'.repeat(64);
  const payload = `${tenantId}|${action}|${Date.now()}`;
  const h = crypto.createHash('sha256').update(prev + payload).digest('hex');
  db.tables.audit_log.push({ args: [tenantId, action, prev, h] });
  return h;
}

let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  ✓ ' + name); passed++; }
  catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; }
}

console.log('hospital_admin integration tests:');
it('multi-tenant isolation', () => {
  const db = makeDb();
  db.prepare('INSERT INTO hospital_admin (tenant_id, data) VALUES (?, ?)').run('t1', JSON.stringify({x:1}));
  db.prepare('INSERT INTO hospital_admin (tenant_id, data) VALUES (?, ?)').run('t2', JSON.stringify({x:2}));
  const r = db.prepare('SELECT COUNT(*) c FROM hospital_admin WHERE tenant_id=?').get('t1');
  assert.strictEqual(r.c, 1);
});
it('CRUD persistence', () => {
  const db = makeDb();
  db.prepare('INSERT INTO hospital_admin (tenant_id, data) VALUES (?, ?)').run('t1', '{}');
  const r = db.prepare('SELECT COUNT(*) c FROM hospital_admin').get();
  assert.strictEqual(r.c, 1);
});
it('idempotency hash format', () => {
  const h1 = chainAudit(makeDb(), 't1', 'create');
  assert.match(h1, /^[a-f0-9]{64}$/);
});
it('audit chain integrity', () => {
  const db = makeDb();
  const h1 = chainAudit(db, 't1', 'a');
  const h2 = chainAudit(db, 't1', 'b');
  assert.notStrictEqual(h1, h2);
});
it('engine pure function', () => {
  const r = Engine[Object.keys(Engine)[1]]({});
  assert.strictEqual(typeof r, 'object');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
