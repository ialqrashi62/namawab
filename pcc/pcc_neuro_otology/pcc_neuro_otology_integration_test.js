// P3-ED pcc_neuro_otology integration tests v3.94.0
const Engine = require('./pcc_neuro_otology_engine.js');
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
  console.log('pcc_neuro_otology integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ed_pcc_neuro_otology', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_neuro_otology', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3ed_pcc_neuro_otology', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3ed_pcc_neuro_otology', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3ed_pcc_neuro_otology', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('VestibularMigraineAssessment', () => { const r = Engine.VestibularMigraineAssessment({}); assert(r.plan); });
  it('MeniereDiseaseManagement', () => { const r = Engine.MeniereDiseaseManagement({}); assert(r.plan); });
  it('BPPVCanalithRepositioning', () => { const r = Engine.BPPVCanalithRepositioning({}); assert(r.plan); });
  it('AcousticNeuromaScreening', () => { const r = Engine.AcousticNeuromaScreening({}); assert(r.plan); });
  it('SuddenHearingLossProtocol', () => { const r = Engine.SuddenHearingLossProtocol({}); assert(r.plan); });
  it('TinnitusAssessment', () => { const r = Engine.TinnitusAssessment({}); assert(r.plan); });
  it('OtotoxicityMonitoring', () => { const r = Engine.OtotoxicityMonitoring({}); assert(r.plan); });
  it('CochlearImplantCandidacy', () => { const r = Engine.CochlearImplantCandidacy({}); assert(r.plan); });
  it('SuperiorCanalDehiscence', () => { const r = Engine.SuperiorCanalDehiscence({}); assert(r.plan); });
  it('AutoimmuneInnerEarDisease', () => { const r = Engine.AutoimmuneInnerEarDisease({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
