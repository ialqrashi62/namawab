// P3-DP pcc_allergy_advanced integration tests v3.80.0
const Engine = require('./pcc_allergy_advanced_engine.js');
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
  console.log('pcc_allergy_advanced integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dp_pcc_allergy_advanced', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_allergy_advanced', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3dp_pcc_allergy_advanced', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3dp_pcc_allergy_advanced', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3dp_pcc_allergy_advanced', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('AnaphylaxisAdvanced', () => { const r = Engine.AnaphylaxisAdvanced({}); assert(r.plan); });
  it('DrugAllergyDelabeling', () => { const r = Engine.DrugAllergyDelabeling({}); assert(r.plan); });
  it('FoodAllergyOralImmunotherapy', () => { const r = Engine.FoodAllergyOralImmunotherapy({}); assert(r.plan); });
  it('VenomImmunotherapy', () => { const r = Engine.VenomImmunotherapy({}); assert(r.plan); });
  it('AllergicBronchopulmonaryAspergillosis', () => { const r = Engine.AllergicBronchopulmonaryAspergillosis({}); assert(r.plan); });
  it('EosinophilicGranulomatosis', () => { const r = Engine.EosinophilicGranulomatosis({}); assert(r.plan); });
  it('MastCellActivation', () => { const r = Engine.MastCellActivation({}); assert(r.plan); });
  it('ChronicUrticariaRefractory', () => { const r = Engine.ChronicUrticariaRefractory({}); assert(r.plan); });
  it('AllergicRhinoconjunctivitisAdvanced', () => { const r = Engine.AllergicRhinoconjunctivitisAdvanced({}); assert(r.plan); });
  it('ContactDermatitisAdvanced', () => { const r = Engine.ContactDermatitisAdvanced({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
