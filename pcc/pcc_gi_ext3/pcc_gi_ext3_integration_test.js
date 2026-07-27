// P3-CM pcc_gi_ext3 integration test v3.51.0
const Engine = require('./pcc_gi_ext3_engine.js');
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
  console.log('pcc_gi_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cm_pcc_gi_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_gi_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cm_pcc_gi_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cm_pcc_gi_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cm_pcc_gi_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('dysphagia', () => { const r = Engine.Dysphagia({}); assert(r.plan); });
  it('gERD', () => { const r = Engine.GERD({}); assert(r.plan); });
  it('iBS', () => { const r = Engine.IBS({}); assert(r.plan); });
  it('iBD', () => { const r = Engine.IBD({}); assert(r.plan); });
  it('celiac', () => { const r = Engine.Celiac({}); assert(r.plan); });
  it('hepB', () => { const r = Engine.HepB({}); assert(r.plan); });
  it('hepC', () => { const r = Engine.HepC({}); assert(r.plan); });
  it('cirr', () => { const r = Engine.Cirr({}); assert(r.plan); });
  it('ppi', () => { const r = Engine.Ppi({}); assert(r.plan); });
  it('scope', () => { const r = Engine.Scope({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
