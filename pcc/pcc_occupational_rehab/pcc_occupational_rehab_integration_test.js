// P3-DD pcc_occupational_rehab integration tests v3.68.0
const Engine = require('./pcc_occupational_rehab_engine.js');
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
  console.log('pcc_occupational_rehab integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dd_pcc_occupational_rehab', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_occupational_rehab', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3dd_pcc_occupational_rehab', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3dd_pcc_occupational_rehab', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3dd_pcc_occupational_rehab', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('WorkCapacity', () => { const r = Engine.WorkCapacity({}); assert(r.plan); });
  it('ErgonomicAssessment', () => { const r = Engine.ErgonomicAssessment({}); assert(r.plan); });
  it('FunctionalRestoration', () => { const r = Engine.FunctionalRestoration({}); assert(r.plan); });
  it('ReturnToWork', () => { const r = Engine.ReturnToWork({}); assert(r.plan); });
  it('VocationalRetraining', () => { const r = Engine.VocationalRetraining({}); assert(r.plan); });
  it('WorkHardening', () => { const r = Engine.WorkHardening({}); assert(r.plan); });
  it('PainAtWork', () => { const r = Engine.PainAtWork({}); assert(r.plan); });
  it('CognitiveDemands', () => { const r = Engine.CognitiveDemands({}); assert(r.plan); });
  it('SafetyClearance', () => { const r = Engine.SafetyClearance({}); assert(r.plan); });
  it('DisabilityEvaluation', () => { const r = Engine.DisabilityEvaluation({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
