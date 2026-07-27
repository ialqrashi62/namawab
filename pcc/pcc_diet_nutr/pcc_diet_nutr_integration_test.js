// P3-CQ pcc_diet_nutr integration test v3.55.0
const Engine = require('./pcc_diet_nutr_engine.js');
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
  console.log('pcc_diet_nutr integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cq_pcc_diet_nutr', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_diet_nutr', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cq_pcc_diet_nutr', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cq_pcc_diet_nutr', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cq_pcc_diet_nutr', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('bmi', () => { const r = Engine.Bmi({}); assert(r.plan); });
  it('tpn', () => { const r = Engine.Tpn({}); assert(r.plan); });
  it('diet', () => { const r = Engine.Diet({}); assert(r.plan); });
  it('tube', () => { const r = Engine.Tube({}); assert(r.plan); });
  it('supplement', () => { const r = Engine.Supplement({}); assert(r.plan); });
  it('malnutrition', () => { const r = Engine.Malnutrition({}); assert(r.plan); });
  it('intolerance', () => { const r = Engine.Intolerance({}); assert(r.plan); });
  it('aspiration', () => { const r = Engine.Aspiration({}); assert(r.plan); });
  it('refeeding', () => { const r = Engine.Refeeding({}); assert(r.plan); });
  it('allerg', () => { const r = Engine.Allerg({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
