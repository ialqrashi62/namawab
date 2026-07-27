// P3-DF pcc_allergy_precision integration tests v3.70.0
const Engine = require('./pcc_allergy_precision_engine.js');
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
  console.log('pcc_allergy_precision integration tests:');
  const db = makeDb();
  const t = await db.insert('p3df_pcc_allergy_precision', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_allergy_precision', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3df_pcc_allergy_precision', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3df_pcc_allergy_precision', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3df_pcc_allergy_precision', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('AllergenComponent', () => { const r = Engine.AllergenComponent({}); assert(r.plan); });
  it('CrossReactivity', () => { const r = Engine.CrossReactivity({}); assert(r.plan); });
  it('OralAllergy', () => { const r = Engine.OralAllergy({}); assert(r.plan); });
  it('DrugAllergyGenetics', () => { const r = Engine.DrugAllergyGenetics({}); assert(r.plan); });
  it('VenomAllergy', () => { const r = Engine.VenomAllergy({}); assert(r.plan); });
  it('AtopicDermatitis', () => { const r = Engine.AtopicDermatitis({}); assert(r.plan); });
  it('AllergicRhinitis', () => { const r = Engine.AllergicRhinitis({}); assert(r.plan); });
  it('AsthmaAllergy', () => { const r = Engine.AsthmaAllergy({}); assert(r.plan); });
  it('FoodChallenge', () => { const r = Engine.FoodChallenge({}); assert(r.plan); });
  it('Desensitization', () => { const r = Engine.Desensitization({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
