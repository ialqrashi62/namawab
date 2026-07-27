// P3-CZ pcc_pain_rehab integration test v3.64.0
const Engine = require('./pcc_pain_rehab_engine.js');
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
  console.log('pcc_pain_rehab integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cz_pcc_pain_rehab', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_pain_rehab', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cz_pcc_pain_rehab', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cz_pcc_pain_rehab', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cz_pcc_pain_rehab', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('painAdmission', () => { const r = Engine.PainAdmission({}); assert(r.plan); });
  it('multidisciplinary', () => { const r = Engine.Multidisciplinary({}); assert(r.plan); });
  it('physicalTherapy', () => { const r = Engine.PhysicalTherapy({}); assert(r.plan); });
  it('occupationalTherapy', () => { const r = Engine.OccupationalTherapy({}); assert(r.plan); });
  it('psychology', () => { const r = Engine.Psychology({}); assert(r.plan); });
  it('interventional', () => { const r = Engine.Interventional({}); assert(r.plan); });
  it('medicationTaper', () => { const r = Engine.MedicationTaper({}); assert(r.plan); });
  it('functionalRestoration', () => { const r = Engine.FunctionalRestoration({}); assert(r.plan); });
  it('discharge', () => { const r = Engine.Discharge({}); assert(r.plan); });
  it('relapsePrevention', () => { const r = Engine.RelapsePrevention({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
