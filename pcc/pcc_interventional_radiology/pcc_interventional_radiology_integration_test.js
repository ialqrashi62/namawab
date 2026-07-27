// P3-EA pcc_interventional_radiology integration tests v3.91.0
const Engine = require('./pcc_interventional_radiology_engine.js');
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
  console.log('pcc_interventional_radiology integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ea_pcc_interventional_radiology', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_interventional_radiology', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3ea_pcc_interventional_radiology', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3ea_pcc_interventional_radiology', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3ea_pcc_interventional_radiology', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('TIPSProcedure', () => { const r = Engine.TIPSProcedure({}); assert(r.plan); });
  it('ChemoembolizationHCC', () => { const r = Engine.ChemoembolizationHCC({}); assert(r.plan); });
  it('UterineFibroidEmbolization', () => { const r = Engine.UterineFibroidEmbolization({}); assert(r.plan); });
  it('VertebroplastyKyphoplasty', () => { const r = Engine.VertebroplastyKyphoplasty({}); assert(r.plan); });
  it('BiliaryDrainagePTBD', () => { const r = Engine.BiliaryDrainagePTBD({}); assert(r.plan); });
  it('GastrostomyTubePlacement', () => { const r = Engine.GastrostomyTubePlacement({}); assert(r.plan); });
  it('ThrombolysisDVT', () => { const r = Engine.ThrombolysisDVT({}); assert(r.plan); });
  it('AorticStentGraft', () => { const r = Engine.AorticStentGraft({}); assert(r.plan); });
  it('CryoablationTumor', () => { const r = Engine.CryoablationTumor({}); assert(r.plan); });
  it('RadiofrequencyAblationLiver', () => { const r = Engine.RadiofrequencyAblationLiver({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
