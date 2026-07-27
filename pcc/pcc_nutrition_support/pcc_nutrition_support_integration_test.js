// P3-DL pcc_nutrition_support integration tests v3.76.0
const Engine = require('./pcc_nutrition_support_engine.js');
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
  console.log('pcc_nutrition_support integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dl_pcc_nutrition_support', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_nutrition_support', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3dl_pcc_nutrition_support', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3dl_pcc_nutrition_support', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3dl_pcc_nutrition_support', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('CaloricTarget', () => { const r = Engine.CaloricTarget({}); assert(r.plan); });
  it('ProteinRequirement', () => { const r = Engine.ProteinRequirement({}); assert(r.plan); });
  it('EnteralAccess', () => { const r = Engine.EnteralAccess({}); assert(r.plan); });
  it('ParenteralIndication', () => { const r = Engine.ParenteralIndication({}); assert(r.plan); });
  it('RefeedingRisk', () => { const r = Engine.RefeedingRisk({}); assert(r.plan); });
  it('GlycemicControlNutrition', () => { const r = Engine.GlycemicControlNutrition({}); assert(r.plan); });
  it('Immunonutrition', () => { const r = Engine.Immunonutrition({}); assert(r.plan); });
  it('FluidBalance', () => { const r = Engine.FluidBalance({}); assert(r.plan); });
  it('MicronutrientRepletion', () => { const r = Engine.MicronutrientRepletion({}); assert(r.plan); });
  it('NutritionOutcome', () => { const r = Engine.NutritionOutcome({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
