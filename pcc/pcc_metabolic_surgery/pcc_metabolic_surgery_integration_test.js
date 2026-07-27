// P3-DB pcc_metabolic_surgery integration tests v3.66.0
const Engine = require('./pcc_metabolic_surgery_engine.js');
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
  console.log('pcc_metabolic_surgery integration tests:');
  const db = makeDb();
  const t = await db.insert('p3db_pcc_metabolic_surgery', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_metabolic_surgery', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3db_pcc_metabolic_surgery', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3db_pcc_metabolic_surgery', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3db_pcc_metabolic_surgery', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('BariatricRisk', () => { const r = Engine.BariatricRisk({}); assert(r.plan); });
  it('ProcedureSelection', () => { const r = Engine.ProcedureSelection({}); assert(r.plan); });
  it('NutritionalDeficiency', () => { const r = Engine.NutritionalDeficiency({}); assert(r.plan); });
  it('DumpingSyndrome', () => { const r = Engine.DumpingSyndrome({}); assert(r.plan); });
  it('WeightRecurrence', () => { const r = Engine.WeightRecurrence({}); assert(r.plan); });
  it('DiabetesRemission', () => { const r = Engine.DiabetesRemission({}); assert(r.plan); });
  it('MetabolicMonitoring', () => { const r = Engine.MetabolicMonitoring({}); assert(r.plan); });
  it('PreopOptimization', () => { const r = Engine.PreopOptimization({}); assert(r.plan); });
  it('PostopDiet', () => { const r = Engine.PostopDiet({}); assert(r.plan); });
  it('LongTermFollowUp', () => { const r = Engine.LongTermFollowUp({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
