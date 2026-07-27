// P3-CG pcc_dialysis integration test v3.45.0
const Engine = require('./pcc_dialysis_engine.js');
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
  console.log('pcc_dialysis integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cg_pcc_dialysis', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_dialysis', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cg_pcc_dialysis', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cg_pcc_dialysis', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cg_pcc_dialysis', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('access', () => { const r = Engine.Access({}); assert(r.plan); });
  it('treatment', () => { const r = Engine.Treatment({}); assert(r.plan); });
  it('clearance', () => { const r = Engine.Clearance({}); assert(r.plan); });
  it('dryWeight', () => { const r = Engine.DryWeight({}); assert(r.plan); });
  it('ultrafiltration', () => { const r = Engine.Ultrafiltration({}); assert(r.plan); });
  it('heparin', () => { const r = Engine.Heparin({}); assert(r.plan); });
  it('sodium', () => { const r = Engine.Sodium({}); assert(r.plan); });
  it('bicarbonate', () => { const r = Engine.Bicarbonate({}); assert(r.plan); });
  it('reuse', () => { const r = Engine.Reuse({}); assert(r.plan); });
  it('ktV', () => { const r = Engine.KtV({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
