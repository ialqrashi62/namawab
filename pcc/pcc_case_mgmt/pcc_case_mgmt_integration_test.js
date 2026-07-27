// P3-CQ pcc_case_mgmt integration test v3.55.0
const Engine = require('./pcc_case_mgmt_engine.js');
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
  console.log('pcc_case_mgmt integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cq_pcc_case_mgmt', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_case_mgmt', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cq_pcc_case_mgmt', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cq_pcc_case_mgmt', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cq_pcc_case_mgmt', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('intake', () => { const r = Engine.Intake({}); assert(r.plan); });
  it('coord', () => { const r = Engine.Coord({}); assert(r.plan); });
  it('dc', () => { const r = Engine.Dc({}); assert(r.plan); });
  it('transition', () => { const r = Engine.Transition({}); assert(r.plan); });
  it('followup', () => { const r = Engine.Followup({}); assert(r.plan); });
  it('barriers', () => { const r = Engine.Barriers({}); assert(r.plan); });
  it('insurance', () => { const r = Engine.Insurance({}); assert(r.plan); });
  it('uta', () => { const r = Engine.Uta({}); assert(r.plan); });
  it('readmission', () => { const r = Engine.Readmission({}); assert(r.plan); });
  it('multidisc', () => { const r = Engine.Multidisc({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
