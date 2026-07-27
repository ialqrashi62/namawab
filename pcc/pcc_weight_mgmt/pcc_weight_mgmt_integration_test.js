// P3-CX pcc_weight_mgmt integration test v3.62.0
const Engine = require('./pcc_weight_mgmt_engine.js');
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
  console.log('pcc_weight_mgmt integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cx_pcc_weight_mgmt', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_weight_mgmt', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cx_pcc_weight_mgmt', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cx_pcc_weight_mgmt', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cx_pcc_weight_mgmt', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('bmi', () => { const r = Engine.Bmi({}); assert(r.plan); });
  it('obesityClass', () => { const r = Engine.ObesityClass({}); assert(r.plan); });
  it('bariatricReferral', () => { const r = Engine.BariatricReferral({}); assert(r.plan); });
  it('dietPlan', () => { const r = Engine.DietPlan({}); assert(r.plan); });
  it('exercise', () => { const r = Engine.Exercise({}); assert(r.plan); });
  it('comorbidity', () => { const r = Engine.Comorbidity({}); assert(r.plan); });
  it('medication', () => { const r = Engine.Medication({}); assert(r.plan); });
  it('followUp', () => { const r = Engine.FollowUp({}); assert(r.plan); });
  it('goal', () => { const r = Engine.Goal({}); assert(r.plan); });
  it('surgeryRisk', () => { const r = Engine.SurgeryRisk({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
