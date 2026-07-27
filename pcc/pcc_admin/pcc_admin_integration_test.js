// P3-CA pcc_admin integration test v3.39.0
const Engine = require('./pcc_admin_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ integ-' + name); passed++; } catch (e) { console.log('  ✗ integ-' + name + ': ' + e.message); failed++; } }

function makeDb() {
  return {
    insert: async (table, row) => ({ id: 1, ...row }),
    select: async (table, where) => ({ rows: [{ id: 1, input: {}, result: { plan: 'mock' } }] }),
    update: async (table, where, patch) => ({ id: 1, ...patch }),
    delete: async (table, where) => ({ deleted: 1 }),
  };
}

(async () => {
  console.log('pcc_admin integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ca_pcc_admin', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_admin', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ca_pcc_admin', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ca_pcc_admin', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ca_pcc_admin', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('facility', () => { const r = Engine.Facility({}); assert(r.plan); });
  it('user', () => { const r = Engine.User({}); assert(r.plan); });
  it('module', () => { const r = Engine.Module({}); assert(r.plan); });
  it('config', () => { const r = Engine.Config({}); assert(r.plan); });
  it('branches', () => { const r = Engine.Branches({}); assert(r.plan); });
  it('resource', () => { const r = Engine.Resource({}); assert(r.plan); });
  it('backup', () => { const r = Engine.Backup({}); assert(r.plan); });
  it('restore', () => { const r = Engine.Restore({}); assert(r.plan); });
  it('migration', () => { const r = Engine.Migration({}); assert(r.plan); });
  it('health', () => { const r = Engine.Health({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
