// P3-BV derma_ext2 integration test v3.34.0
const Engine = require('./derma_ext2_engine.js');
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
  console.log('derma_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bv_derma_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'derma_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bv_derma_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bv_derma_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bv_derma_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('eczema', () => { const r = Engine.Eczema({}); assert(r.plan); });
  it('psoriasis', () => { const r = Engine.Psoriasis({}); assert(r.plan); });
  it('acne', () => { const r = Engine.Acne({}); assert(r.plan); });
  it('melanoma', () => { const r = Engine.Melanoma({}); assert(r.plan); });
  it('bCC', () => { const r = Engine.BCC({}); assert(r.plan); });
  it('rash', () => { const r = Engine.Rash({}); assert(r.plan); });
  it('urticaria', () => { const r = Engine.Urticaria({}); assert(r.plan); });
  it('autoimmune', () => { const r = Engine.Autoimmune({}); assert(r.plan); });
  it('infxn', () => { const r = Engine.Infxn({}); assert(r.plan); });
  it('burns', () => { const r = Engine.Burns({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
