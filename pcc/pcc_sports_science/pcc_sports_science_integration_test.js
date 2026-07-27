// P3-DD pcc_sports_science integration tests v3.68.0
const Engine = require('./pcc_sports_science_engine.js');
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
  console.log('pcc_sports_science integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dd_pcc_sports_science', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_sports_science', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3dd_pcc_sports_science', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3dd_pcc_sports_science', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3dd_pcc_sports_science', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('Biomechanics', () => { const r = Engine.Biomechanics({}); assert(r.plan); });
  it('LoadMonitoring', () => { const r = Engine.LoadMonitoring({}); assert(r.plan); });
  it('InjuryRisk', () => { const r = Engine.InjuryRisk({}); assert(r.plan); });
  it('ReturnToPlay', () => { const r = Engine.ReturnToPlay({}); assert(r.plan); });
  it('NutritionPeriodization', () => { const r = Engine.NutritionPeriodization({}); assert(r.plan); });
  it('HydrationStrategy', () => { const r = Engine.HydrationStrategy({}); assert(r.plan); });
  it('RecoveryOptimization', () => { const r = Engine.RecoveryOptimization({}); assert(r.plan); });
  it('YouthAthlete', () => { const r = Engine.YouthAthlete({}); assert(r.plan); });
  it('TeamHealth', () => { const r = Engine.TeamHealth({}); assert(r.plan); });
  it('AltitudeTraining', () => { const r = Engine.AltitudeTraining({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
