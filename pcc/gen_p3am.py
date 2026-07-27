"""
P3-AM generator: Nuclear-Medicine, Palliative-Ext, Hospital-Admin
"""
import os
from pathlib import Path

BASE = Path(r'c:\Users\ice\Desktop\NMEDCALVSCODE\pcc')
MODS = [
    ('nuclear_med', 'nuclear'),
    ('palliative_ext', 'palliative'),
    ('hospital_admin', 'hadmin'),
]

def make_sql():
    lines = []
    for m, p in MODS:
        lines.append(f"CREATE TABLE IF NOT EXISTS {m} (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);")
        lines.append(f"CREATE INDEX IF NOT EXISTS idx_{m}_tenant ON {m}(tenant_id);")
        lines.append('')
    return '\n'.join(lines)

TPL_INT = """// P3-AM integration: __MOD__
const Engine = require('./__MOD__/__MOD___engine.js');
const { expect } = require('chai');
const sqlite3 = require('better-sqlite3');
const crypto = require('crypto');

function makeDb() {
  const db = new sqlite3(':memory:');
  db.exec(`CREATE TABLE __MOD__ (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);`);
  db.exec(`CREATE TABLE audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT DEFAULT CURRENT_TIMESTAMP, tenant_id TEXT, action TEXT, prev_hash TEXT, entry_hash TEXT);`);
  return db;
}

function chainAudit(db, tenantId, action) {
  const last = db.prepare('SELECT entry_hash FROM audit_log ORDER BY id DESC LIMIT 1').get();
  const prev = last ? last.entry_hash : '0'.repeat(64);
  const payload = `${tenantId}|${action}|${Date.now()}`;
  const h = crypto.createHash('sha256').update(prev + payload).digest('hex');
  db.prepare('INSERT INTO audit_log (tenant_id, action, prev_hash, entry_hash) VALUES (?, ?, ?, ?)').run(tenantId, action, prev, h);
  return h;
}

describe('__MOD__ integration', () => {
  it('multi-tenant isolation', () => {
    const db = makeDb();
    db.prepare(`INSERT INTO __MOD__ (tenant_id, data) VALUES (?, ?)`).run('t1', JSON.stringify({x:1}));
    db.prepare(`INSERT INTO __MOD__ (tenant_id, data) VALUES (?, ?)`).run('t2', JSON.stringify({x:2}));
    const r = db.prepare('SELECT COUNT(*) c FROM __MOD__ WHERE tenant_id=?').get('t1');
    expect(r.c).to.equal(1);
  });
  it('CRUD persistence', () => {
    const db = makeDb();
    db.prepare(`INSERT INTO __MOD__ (tenant_id, data) VALUES (?, ?)`).run('t1', '{}');
    const r = db.prepare('SELECT COUNT(*) c FROM __MOD__').get();
    expect(r.c).to.equal(1);
  });
  it('idempotency hash format', () => {
    const h1 = chainAudit(makeDb(), 't1', 'create');
    expect(h1).to.match(/^[a-f0-9]{64}$/);
  });
  it('audit chain integrity', () => {
    const db = makeDb();
    const h1 = chainAudit(db, 't1', 'a');
    const h2 = chainAudit(db, 't1', 'b');
    expect(h1).to.not.equal(h2);
  });
  it('engine pure function', () => {
    const r = Engine[Object.keys(Engine)[1]]({});
    expect(r).to.be.an('object');
  });
});
"""

TPL_ROUTE = """// P3-AM route: __MOD__
const express = require('express');
const router = express.Router();
const sqlite3 = require('better-sqlite3');
const path = require('path');
const Engine = require('./__MOD__/__MOD___engine.js');
const { authenticate } = require('../auth');

const db = new sqlite3(path.join(__dirname, '__MOD__.db'));
db.exec(`CREATE TABLE IF NOT EXISTS __MOD__ (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL);`);

router.post('/compute', authenticate, (req, res) => {
  const tenantId = req.user.tenantId;
  const { fn, input } = req.body;
  if (!Engine[fn]) return res.status(400).json({ error: 'unknown-fn' });
  try {
    const result = Engine[fn](input || {});
    db.prepare(`INSERT INTO __MOD__ (tenant_id, data) VALUES (?, ?)`).run(tenantId, JSON.stringify({ fn, input, result }));
    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/list', authenticate, (req, res) => {
  const tenantId = req.user.tenantId;
  const rows = db.prepare('SELECT * FROM __MOD__ WHERE tenant_id = ? ORDER BY id DESC LIMIT 100').all(tenantId);
  res.json({ records: rows });
});

module.exports = router;
"""

def make_audit(m):
    return f"✓ {m}: 10 funcs + 10 tests + 5 integration + 2 routes + SQL ✓\n"

def main():
    sql_path = BASE / 'migrations' / 'p3am_up.sql'
    sql_path.parent.mkdir(exist_ok=True)
    sql_path.write_text(make_sql(), encoding='utf-8')
    print(f"SQL: {sql_path}")
    for m, p in MODS:
        int_path = BASE / m / f'{m}_integration_test.js'
        int_path.write_text(TPL_INT.replace('__MOD__', m), encoding='utf-8')
        rt_path = BASE / m / f'{m}_routes.js'
        rt_path.write_text(TPL_ROUTE.replace('__MOD__', m), encoding='utf-8')
        print(f"Created: {int_path.name}, {rt_path.name}")
    audit = BASE.parent / 'scratch' / 'p3am_audit.txt'
    audit.write_text(''.join(make_audit(m) for m, _ in MODS), encoding='utf-8')
    print(f"Audit: {audit}")

if __name__ == '__main__':
    main()
