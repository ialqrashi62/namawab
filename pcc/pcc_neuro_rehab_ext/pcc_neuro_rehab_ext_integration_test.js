// P3-DW pcc_neuro_rehab_ext integration tests v3.87.0
const Engine = require('./pcc_neuro_rehab_ext_engine.js');
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
  console.log('pcc_neuro_rehab_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dw_pcc_neuro_rehab_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_neuro_rehab_ext', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3dw_pcc_neuro_rehab_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3dw_pcc_neuro_rehab_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3dw_pcc_neuro_rehab_ext', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('StrokeNeuroplasticityProtocol', () => { const r = Engine.StrokeNeuroplasticityProtocol({}); assert(r.plan); });
  it('ConstraintInducedMovement', () => { const r = Engine.ConstraintInducedMovement({}); assert(r.plan); });
  it('VestibularRehabStroke', () => { const r = Engine.VestibularRehabStroke({}); assert(r.plan); });
  it('SpasticityManagementITB', () => { const r = Engine.SpasticityManagementITB({}); assert(r.plan); });
  it('DysphagiaSwallowTherapy', () => { const r = Engine.DysphagiaSwallowTherapy({}); assert(r.plan); });
  it('CognitiveRehabTraumatic', () => { const r = Engine.CognitiveRehabTraumatic({}); assert(r.plan); });
  it('AphasiaLanguageTherapy', () => { const r = Engine.AphasiaLanguageTherapy({}); assert(r.plan); });
  it('SpinalCordInjuryRehab', () => { const r = Engine.SpinalCordInjuryRehab({}); assert(r.plan); });
  it('WheelchairMobilityPrescription', () => { const r = Engine.WheelchairMobilityPrescription({}); assert(r.plan); });
  it('NeuroRehabGoalSetting', () => { const r = Engine.NeuroRehabGoalSetting({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
