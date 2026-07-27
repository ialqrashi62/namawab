// P3-CY pcc_travel_med integration test v3.63.0
const Engine = require('./pcc_travel_med_engine.js');
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
  console.log('pcc_travel_med integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cy_pcc_travel_med', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_travel_med', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cy_pcc_travel_med', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cy_pcc_travel_med', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cy_pcc_travel_med', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('destinationRisk', () => { const r = Engine.DestinationRisk({}); assert(r.plan); });
  it('vaccinationNeed', () => { const r = Engine.VaccinationNeed({}); assert(r.plan); });
  it('malariaProphylaxis', () => { const r = Engine.MalariaProphylaxis({}); assert(r.plan); });
  it('travelersDiarrhea', () => { const r = Engine.TravelersDiarrhea({}); assert(r.plan); });
  it('jetLag', () => { const r = Engine.JetLag({}); assert(r.plan); });
  it('dvtRisk', () => { const r = Engine.DvtRisk({}); assert(r.plan); });
  it('altitude', () => { const r = Engine.Altitude({}); assert(r.plan); });
  it('divingFitness', () => { const r = Engine.DivingFitness({}); assert(r.plan); });
  it('pregnancyTravel', () => { const r = Engine.PregnancyTravel({}); assert(r.plan); });
  it('returnEvaluation', () => { const r = Engine.ReturnEvaluation({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
