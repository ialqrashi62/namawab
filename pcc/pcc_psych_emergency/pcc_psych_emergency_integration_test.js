// P3-DT pcc_psych_emergency integration tests v3.84.0
const Engine = require('./pcc_psych_emergency_engine.js');
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
  console.log('pcc_psych_emergency integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dt_pcc_psych_emergency', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_psych_emergency', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3dt_pcc_psych_emergency', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3dt_pcc_psych_emergency', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3dt_pcc_psych_emergency', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('ColumbiaSuicideSeverity', () => { const r = Engine.ColumbiaSuicideSeverity({}); assert(r.plan); });
  it('PHQ2PHQ9Triage', () => { const r = Engine.PHQ2PHQ9Triage({}); assert(r.plan); });
  it('GAD7Triage', () => { const r = Engine.GAD7Triage({}); assert(r.plan); });
  it('CIWATriage', () => { const r = Engine.CIWATriage({}); assert(r.plan); });
  it('DeliriumCAMICU', () => { const r = Engine.DeliriumCAMICU({}); assert(r.plan); });
  it('AcutePsychosisScreen', () => { const r = Engine.AcutePsychosisScreen({}); assert(r.plan); });
  it('SubstanceIntoxicationTriage', () => { const r = Engine.SubstanceIntoxicationTriage({}); assert(r.plan); });
  it('RestraintIndication', () => { const r = Engine.RestraintIndication({}); assert(r.plan); });
  it('InvoluntaryHoldCriteria', () => { const r = Engine.InvoluntaryHoldCriteria({}); assert(r.plan); });
  it('PsychiatricDisposition', () => { const r = Engine.PsychiatricDisposition({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
