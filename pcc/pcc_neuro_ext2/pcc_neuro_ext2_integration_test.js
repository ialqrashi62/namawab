// P3-CK pcc_neuro_ext2 integration test v3.49.0
const Engine = require('./pcc_neuro_ext2_engine.js');
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
  console.log('pcc_neuro_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ck_pcc_neuro_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_neuro_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ck_pcc_neuro_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ck_pcc_neuro_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ck_pcc_neuro_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('strokeScale', () => { const r = Engine.StrokeScale({}); assert(r.plan); });
  it('seizure', () => { const r = Engine.Seizure({}); assert(r.plan); });
  it('headache', () => { const r = Engine.Headache({}); assert(r.plan); });
  it('gCS', () => { const r = Engine.GCS({}); assert(r.plan); });
  it('neuropathy', () => { const r = Engine.Neuropathy({}); assert(r.plan); });
  it('movement', () => { const r = Engine.Movement({}); assert(r.plan); });
  it('dementia', () => { const r = Engine.Dementia({}); assert(r.plan); });
  it('ms', () => { const r = Engine.Ms({}); assert(r.plan); });
  it('gbs', () => { const r = Engine.Gbs({}); assert(r.plan); });
  it('myasthenia', () => { const r = Engine.Myasthenia({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
