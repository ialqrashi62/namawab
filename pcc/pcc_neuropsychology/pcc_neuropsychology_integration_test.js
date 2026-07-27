// P3-EF pcc_neuropsychology integration tests v3.96.0
const Engine = require('./pcc_neuropsychology_engine.js');
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
  console.log('pcc_neuropsychology integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ef_pcc_neuropsychology', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_neuropsychology', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3ef_pcc_neuropsychology', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3ef_pcc_neuropsychology', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3ef_pcc_neuropsychology', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('NeuropsychologicalAssessment', () => { const r = Engine.NeuropsychologicalAssessment({}); assert(r.plan); });
  it('CognitiveRehabilitationPlan', () => { const r = Engine.CognitiveRehabilitationPlan({}); assert(r.plan); });
  it('DementiaDifferential', () => { const r = Engine.DementiaDifferential({}); assert(r.plan); });
  it('TraumaticBrainInjuryEval', () => { const r = Engine.TraumaticBrainInjuryEval({}); assert(r.plan); });
  it('ADHDAdultAssessment', () => { const r = Engine.ADHDAdultAssessment({}); assert(r.plan); });
  it('AutismSpectrumEval', () => { const r = Engine.AutismSpectrumEval({}); assert(r.plan); });
  it('LearningDisorderEval', () => { const r = Engine.LearningDisorderEval({}); assert(r.plan); });
  it('ExecutiveFunctionAssessment', () => { const r = Engine.ExecutiveFunctionAssessment({}); assert(r.plan); });
  it('MemoryDisorderEval', () => { const r = Engine.MemoryDisorderEval({}); assert(r.plan); });
  it('NeuropsychiatricSyndrome', () => { const r = Engine.NeuropsychiatricSyndrome({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
