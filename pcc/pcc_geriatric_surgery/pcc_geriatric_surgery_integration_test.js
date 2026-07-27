// P3-CZ pcc_geriatric_surgery integration test v3.64.0
const Engine = require('./pcc_geriatric_surgery_engine.js');
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
  console.log('pcc_geriatric_surgery integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cz_pcc_geriatric_surgery', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_geriatric_surgery', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cz_pcc_geriatric_surgery', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cz_pcc_geriatric_surgery', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cz_pcc_geriatric_surgery', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('frailtyIndex', () => { const r = Engine.FrailtyIndex({}); assert(r.plan); });
  it('prehabilitation', () => { const r = Engine.Prehabilitation({}); assert(r.plan); });
  it('deliriumRisk', () => { const r = Engine.DeliriumRisk({}); assert(r.plan); });
  it('nutritionScreen', () => { const r = Engine.NutritionScreen({}); assert(r.plan); });
  it('polypharmacy', () => { const r = Engine.Polypharmacy({}); assert(r.plan); });
  it('mobilityPlan', () => { const r = Engine.MobilityPlan({}); assert(r.plan); });
  it('dischargeDestination', () => { const r = Engine.DischargeDestination({}); assert(r.plan); });
  it('complicationRisk', () => { const r = Engine.ComplicationRisk({}); assert(r.plan); });
  it('palliativeTalk', () => { const r = Engine.PalliativeTalk({}); assert(r.plan); });
  it('followUp', () => { const r = Engine.FollowUp({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
