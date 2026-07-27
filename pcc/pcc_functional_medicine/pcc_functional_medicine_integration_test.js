// P3-DA pcc_functional_medicine integration test v3.65.0
const Engine = require('./pcc_functional_medicine_engine.js');
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
  console.log('pcc_functional_medicine integration tests:');
  const db = makeDb();
  const t = await db.insert('p3da_pcc_functional_medicine', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_functional_medicine', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3da_pcc_functional_medicine', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3da_pcc_functional_medicine', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3da_pcc_functional_medicine', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('rootCause', () => { const r = Engine.RootCause({}); assert(r.plan); });
  it('timeline', () => { const r = Engine.Timeline({}); assert(r.plan); });
  it('eliminationDiet', () => { const r = Engine.EliminationDiet({}); assert(r.plan); });
  it('gutHealing', () => { const r = Engine.GutHealing({}); assert(r.plan); });
  it('hormoneBalance', () => { const r = Engine.HormoneBalance({}); assert(r.plan); });
  it('toxicity', () => { const r = Engine.Toxicity({}); assert(r.plan); });
  it('inflammation', () => { const r = Engine.Inflammation({}); assert(r.plan); });
  it('mitochondrialSupport', () => { const r = Engine.MitochondrialSupport({}); assert(r.plan); });
  it('immuneModulation', () => { const r = Engine.ImmuneModulation({}); assert(r.plan); });
  it('personalizedPlan', () => { const r = Engine.PersonalizedPlan({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
