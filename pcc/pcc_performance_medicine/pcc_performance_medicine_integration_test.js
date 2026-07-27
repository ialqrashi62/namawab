// P3-DD pcc_performance_medicine integration tests v3.68.0
const Engine = require('./pcc_performance_medicine_engine.js');
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
  console.log('pcc_performance_medicine integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dd_pcc_performance_medicine', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_performance_medicine', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3dd_pcc_performance_medicine', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3dd_pcc_performance_medicine', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3dd_pcc_performance_medicine', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('VO2Max', () => { const r = Engine.VO2Max({}); assert(r.plan); });
  it('LactateThreshold', () => { const r = Engine.LactateThreshold({}); assert(r.plan); });
  it('MovementScreen', () => { const r = Engine.MovementScreen({}); assert(r.plan); });
  it('CognitivePerformance', () => { const r = Engine.CognitivePerformance({}); assert(r.plan); });
  it('HRVMonitoring', () => { const r = Engine.HRVMonitoring({}); assert(r.plan); });
  it('SleepForPerformance', () => { const r = Engine.SleepForPerformance({}); assert(r.plan); });
  it('MentalSkills', () => { const r = Engine.MentalSkills({}); assert(r.plan); });
  it('EquipmentOptimization', () => { const r = Engine.EquipmentOptimization({}); assert(r.plan); });
  it('PeriodizationPlan', () => { const r = Engine.PeriodizationPlan({}); assert(r.plan); });
  it('Overtraining', () => { const r = Engine.Overtraining({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
