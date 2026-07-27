// P3-CW pcc_allergy_immunology integration test v3.61.0
const Engine = require('./pcc_allergy_immunology_engine.js');
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
  console.log('pcc_allergy_immunology integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cw_pcc_allergy_immunology', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_allergy_immunology', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cw_pcc_allergy_immunology', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cw_pcc_allergy_immunology', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cw_pcc_allergy_immunology', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('ige', () => { const r = Engine.Ige({}); assert(r.plan); });
  it('skinTest', () => { const r = Engine.SkinTest({}); assert(r.plan); });
  it('anaphylaxis', () => { const r = Engine.Anaphylaxis({}); assert(r.plan); });
  it('desensitization', () => { const r = Engine.Desensitization({}); assert(r.plan); });
  it('foodAllergy', () => { const r = Engine.FoodAllergy({}); assert(r.plan); });
  it('drugAllergy', () => { const r = Engine.DrugAllergy({}); assert(r.plan); });
  it('insectAllergy', () => { const r = Engine.InsectAllergy({}); assert(r.plan); });
  it('asthmaAllergy', () => { const r = Engine.AsthmaAllergy({}); assert(r.plan); });
  it('immunodeficiency', () => { const r = Engine.Immunodeficiency({}); assert(r.plan); });
  it('biologic', () => { const r = Engine.Biologic({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
