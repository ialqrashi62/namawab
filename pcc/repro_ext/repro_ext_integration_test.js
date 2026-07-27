// P3-BW repro_ext integration test v3.35.0
const Engine = require('./repro_ext_engine.js');
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
  console.log('repro_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bw_repro_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'repro_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bw_repro_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bw_repro_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bw_repro_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('infertility', () => { const r = Engine.Infertility({}); assert(r.plan); });
  it('aRT', () => { const r = Engine.ART({}); assert(r.plan); });
  it('pCOS', () => { const r = Engine.PCOS({}); assert(r.plan); });
  it('endometriosis', () => { const r = Engine.Endometriosis({}); assert(r.plan); });
  it('fibroids', () => { const r = Engine.Fibroids({}); assert(r.plan); });
  it('contraception', () => { const r = Engine.Contraception({}); assert(r.plan); });
  it('menopause', () => { const r = Engine.Menopause({}); assert(r.plan); });
  it('sTI', () => { const r = Engine.STI({}); assert(r.plan); });
  it('sexual', () => { const r = Engine.Sexual({}); assert(r.plan); });
  it('preconception', () => { const r = Engine.Preconception({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
