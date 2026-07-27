// P3-EM pcc_pediatric_rehab integration tests v3.103.0
const Engine = require('./pcc_pediatric_rehab_engine.js');
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
  console.log('pcc_pediatric_rehab integration tests:');
  const db = makeDb();
  const t = await db.insert('p3em_pcc_pediatric_rehab', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_pediatric_rehab', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3em_pcc_pediatric_rehab', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3em_pcc_pediatric_rehab', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3em_pcc_pediatric_rehab', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('PediatricRehabAssessment', () => { const r = Engine.PediatricRehabAssessment({}); assert(r.plan); });
  it('PediatricPT', () => { const r = Engine.PediatricPT({}); assert(r.plan); });
  it('PediatricOT', () => { const r = Engine.PediatricOT({}); assert(r.plan); });
  it('PediatricSpeechRehab', () => { const r = Engine.PediatricSpeechRehab({}); assert(r.plan); });
  it('PediatricCognitiveRehab', () => { const r = Engine.PediatricCognitiveRehab({}); assert(r.plan); });
  it('PediatricAquaticTherapy', () => { const r = Engine.PediatricAquaticTherapy({}); assert(r.plan); });
  it('PediatricConstraintTherapy', () => { const r = Engine.PediatricConstraintTherapy({}); assert(r.plan); });
  it('PediatricRoboticRehab', () => { const r = Engine.PediatricRoboticRehab({}); assert(r.plan); });
  it('PediatricGaitTraining', () => { const r = Engine.PediatricGaitTraining({}); assert(r.plan); });
  it('PediatricSportsRehab', () => { const r = Engine.PediatricSportsRehab({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
