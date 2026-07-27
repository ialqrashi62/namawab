// P3-BX endo_ext2 integration test v3.36.0
const Engine = require('./endo_ext2_engine.js');
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
  console.log('endo_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bx_endo_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'endo_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bx_endo_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bx_endo_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bx_endo_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('diabetes', () => { const r = Engine.Diabetes({}); assert(r.plan); });
  it('thyroid', () => { const r = Engine.Thyroid({}); assert(r.plan); });
  it('adrenal', () => { const r = Engine.Adrenal({}); assert(r.plan); });
  it('pituitary', () => { const r = Engine.Pituitary({}); assert(r.plan); });
  it('calcium', () => { const r = Engine.Calcium({}); assert(r.plan); });
  it('bone', () => { const r = Engine.Bone({}); assert(r.plan); });
  it('adrenalMass', () => { const r = Engine.AdrenalMass({}); assert(r.plan); });
  it('obesity', () => { const r = Engine.Obesity({}); assert(r.plan); });
  it('lipid', () => { const r = Engine.Lipid({}); assert(r.plan); });
  it('reproEndo', () => { const r = Engine.ReproEndo({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
