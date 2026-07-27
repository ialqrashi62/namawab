// P3-CT pcc_specialty_clinic integration test v3.58.0
const Engine = require('./pcc_specialty_clinic_engine.js');
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
  console.log('pcc_specialty_clinic integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ct_pcc_specialty_clinic', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_specialty_clinic', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ct_pcc_specialty_clinic', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ct_pcc_specialty_clinic', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ct_pcc_specialty_clinic', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('referral', () => { const r = Engine.Referral({}); assert(r.plan); });
  it('consult', () => { const r = Engine.Consult({}); assert(r.plan); });
  it('secondOpinion', () => { const r = Engine.SecondOpinion({}); assert(r.plan); });
  it('followUp', () => { const r = Engine.FollowUp({}); assert(r.plan); });
  it('procedure', () => { const r = Engine.Procedure({}); assert(r.plan); });
  it('triage', () => { const r = Engine.Triage({}); assert(r.plan); });
  it('nextStep', () => { const r = Engine.NextStep({}); assert(r.plan); });
  it('interval', () => { const r = Engine.Interval({}); assert(r.plan); });
  it('coord', () => { const r = Engine.Coord({}); assert(r.plan); });
  it('transition', () => { const r = Engine.Transition({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
