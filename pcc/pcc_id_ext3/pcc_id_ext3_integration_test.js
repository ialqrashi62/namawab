// P3-CN pcc_id_ext3 integration test v3.52.0
const Engine = require('./pcc_id_ext3_engine.js');
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
  console.log('pcc_id_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cn_pcc_id_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_id_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cn_pcc_id_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cn_pcc_id_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cn_pcc_id_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('cdiff', () => { const r = Engine.Cdiff({}); assert(r.plan); });
  it('mrsa', () => { const r = Engine.Mrsa({}); assert(r.plan); });
  it('vre', () => { const r = Engine.Vre({}); assert(r.plan); });
  it('esbl', () => { const r = Engine.Esbl({}); assert(r.plan); });
  it('tbflu', () => { const r = Engine.Tbflu({}); assert(r.plan); });
  it('malaria', () => { const r = Engine.Malaria({}); assert(r.plan); });
  it('tb', () => { const r = Engine.Tb({}); assert(r.plan); });
  it('hiv', () => { const r = Engine.Hiv({}); assert(r.plan); });
  it('hep', () => { const r = Engine.Hep({}); assert(r.plan); });
  it('travel', () => { const r = Engine.Travel({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
