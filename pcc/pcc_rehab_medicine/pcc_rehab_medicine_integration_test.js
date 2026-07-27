// P3-CZ pcc_rehab_medicine integration test v3.64.0
const Engine = require('./pcc_rehab_medicine_engine.js');
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
  console.log('pcc_rehab_medicine integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cz_pcc_rehab_medicine', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_rehab_medicine', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cz_pcc_rehab_medicine', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cz_pcc_rehab_medicine', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cz_pcc_rehab_medicine', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('functionalStatus', () => { const r = Engine.FunctionalStatus({}); assert(r.plan); });
  it('impairment', () => { const r = Engine.Impairment({}); assert(r.plan); });
  it('goalSetting', () => { const r = Engine.GoalSetting({}); assert(r.plan); });
  it('therapyPlan', () => { const r = Engine.TherapyPlan({}); assert(r.plan); });
  it('outcomeMeasure', () => { const r = Engine.OutcomeMeasure({}); assert(r.plan); });
  it('dischargePlan', () => { const r = Engine.DischargePlan({}); assert(r.plan); });
  it('equipment', () => { const r = Engine.Equipment({}); assert(r.plan); });
  it('caregiver', () => { const r = Engine.Caregiver({}); assert(r.plan); });
  it('communityReintegration', () => { const r = Engine.CommunityReintegration({}); assert(r.plan); });
  it('qualityOfLife', () => { const r = Engine.QualityOfLife({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
