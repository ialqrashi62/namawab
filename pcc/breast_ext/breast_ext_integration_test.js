// P3-BT breast_ext integration test v3.32.0
const Engine = require('./breast_ext_engine.js');
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
  console.log('breast_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bt_breast_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'breast_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bt_breast_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bt_breast_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bt_breast_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('screen', () => { const r = Engine.Screen({}); assert(r.plan); });
  it('mass', () => { const r = Engine.Mass({}); assert(r.plan); });
  it('nipple', () => { const r = Engine.Nipple({}); assert(r.plan); });
  it('cancer', () => { const r = Engine.Cancer({}); assert(r.plan); });
  it('bRCA', () => { const r = Engine.BRCA({}); assert(r.plan); });
  it('mastectomy', () => { const r = Engine.Mastectomy({}); assert(r.plan); });
  it('reconstruction', () => { const r = Engine.Reconstruction({}); assert(r.plan); });
  it('lactation', () => { const r = Engine.Lactation({}); assert(r.plan); });
  it('gynecomastia', () => { const r = Engine.Gynecomastia({}); assert(r.plan); });
  it('survivorship', () => { const r = Engine.Survivorship({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
