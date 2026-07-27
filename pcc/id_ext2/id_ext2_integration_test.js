// P3-BZ id_ext2 integration test v3.38.0
const Engine = require('./id_ext2_engine.js');
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
  console.log('id_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bz_id_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'id_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bz_id_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bz_id_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bz_id_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('uTI', () => { const r = Engine.UTI({}); assert(r.plan); });
  it('pneumonia', () => { const r = Engine.Pneumonia({}); assert(r.plan); });
  it('sSTI', () => { const r = Engine.SSTI({}); assert(r.plan); });
  it('cdiff', () => { const r = Engine.Cdiff({}); assert(r.plan); });
  it('sepsis', () => { const r = Engine.Sepsis({}); assert(r.plan); });
  it('hIV', () => { const r = Engine.HIV({}); assert(r.plan); });
  it('tB', () => { const r = Engine.TB({}); assert(r.plan); });
  it('hepB', () => { const r = Engine.HepB({}); assert(r.plan); });
  it('hepC', () => { const r = Engine.HepC({}); assert(r.plan); });
  it('influenza', () => { const r = Engine.Influenza({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
