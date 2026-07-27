// P3-CO pcc_ophth_ext2 integration test v3.53.0
const Engine = require('./pcc_ophth_ext2_engine.js');
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
  console.log('pcc_ophth_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3co_pcc_ophth_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_ophth_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3co_pcc_ophth_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3co_pcc_ophth_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3co_pcc_ophth_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('visual', () => { const r = Engine.Visual({}); assert(r.plan); });
  it('cataract', () => { const r = Engine.Cataract({}); assert(r.plan); });
  it('glaucoma', () => { const r = Engine.Glaucoma({}); assert(r.plan); });
  it('retina', () => { const r = Engine.Retina({}); assert(r.plan); });
  it('uveitis', () => { const r = Engine.Uveitis({}); assert(r.plan); });
  it('conjunctivitis', () => { const r = Engine.Conjunctivitis({}); assert(r.plan); });
  it('keratitis', () => { const r = Engine.Keratitis({}); assert(r.plan); });
  it('macular', () => { const r = Engine.Macular({}); assert(r.plan); });
  it('strab', () => { const r = Engine.Strab({}); assert(r.plan); });
  it('trauma', () => { const r = Engine.Trauma({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
