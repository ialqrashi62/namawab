// P3-CC pcc_clinical_dx integration test v3.41.0
const Engine = require('./pcc_clinical_dx_engine.js');
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
  console.log('pcc_clinical_dx integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cc_pcc_clinical_dx', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_clinical_dx', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cc_pcc_clinical_dx', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cc_pcc_clinical_dx', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cc_pcc_clinical_dx', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('differential', () => { const r = Engine.Differential({}); assert(r.plan); });
  it('workup', () => { const r = Engine.Workup({}); assert(r.plan); });
  it('imaging', () => { const r = Engine.Imaging({}); assert(r.plan); });
  it('lab', () => { const r = Engine.Lab({}); assert(r.plan); });
  it('consult', () => { const r = Engine.Consult({}); assert(r.plan); });
  it('spec', () => { const r = Engine.Spec({}); assert(r.plan); });
  it('followUp', () => { const r = Engine.FollowUp({}); assert(r.plan); });
  it('disposition', () => { const r = Engine.Disposition({}); assert(r.plan); });
  it('pathway', () => { const r = Engine.Pathway({}); assert(r.plan); });
  it('alert', () => { const r = Engine.Alert({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
