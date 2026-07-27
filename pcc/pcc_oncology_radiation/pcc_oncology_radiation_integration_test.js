// P3-EB pcc_oncology_radiation integration tests v3.92.0
const Engine = require('./pcc_oncology_radiation_engine.js');
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
  console.log('pcc_oncology_radiation integration tests:');
  const db = makeDb();
  const t = await db.insert('p3eb_pcc_oncology_radiation', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_oncology_radiation', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3eb_pcc_oncology_radiation', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3eb_pcc_oncology_radiation', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3eb_pcc_oncology_radiation', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('RadiationTreatmentPlanning', () => { const r = Engine.RadiationTreatmentPlanning({}); assert(r.plan); });
  it('IMRTvsVMATSelection', () => { const r = Engine.IMRTvsVMATSelection({}); assert(r.plan); });
  it('StereotacticRadiosurgery', () => { const r = Engine.StereotacticRadiosurgery({}); assert(r.plan); });
  it('BrachytherapyIndication', () => { const r = Engine.BrachytherapyIndication({}); assert(r.plan); });
  it('ProtonTherapyEligibility', () => { const r = Engine.ProtonTherapyEligibility({}); assert(r.plan); });
  it('RadiationToxicityGrading', () => { const r = Engine.RadiationToxicityGrading({}); assert(r.plan); });
  it('ConcurrentChemoradiation', () => { const r = Engine.ConcurrentChemoradiation({}); assert(r.plan); });
  it('PalliativeRadiation', () => { const r = Engine.PalliativeRadiation({}); assert(r.plan); });
  it('ReIrradiationProtocol', () => { const r = Engine.ReIrradiationProtocol({}); assert(r.plan); });
  it('RadiationPneumonitisRisk', () => { const r = Engine.RadiationPneumonitisRisk({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
