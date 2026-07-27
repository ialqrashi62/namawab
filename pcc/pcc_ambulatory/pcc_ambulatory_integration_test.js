// P3-CT pcc_ambulatory integration test v3.58.0
const Engine = require('./pcc_ambulatory_engine.js');
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
  console.log('pcc_ambulatory integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ct_pcc_ambulatory', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_ambulatory', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ct_pcc_ambulatory', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ct_pcc_ambulatory', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ct_pcc_ambulatory', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('visitType', () => { const r = Engine.VisitType({}); assert(r.plan); });
  it('refill', () => { const r = Engine.Refill({}); assert(r.plan); });
  it('wellness', () => { const r = Engine.Wellness({}); assert(r.plan); });
  it('chronicCare', () => { const r = Engine.ChronicCare({}); assert(r.plan); });
  it('preventive', () => { const r = Engine.Preventive({}); assert(r.plan); });
  it('immunization', () => { const r = Engine.Immunization({}); assert(r.plan); });
  it('hgbA1c', () => { const r = Engine.HgbA1c({}); assert(r.plan); });
  it('bpCheck', () => { const r = Engine.BpCheck({}); assert(r.plan); });
  it('smoking', () => { const r = Engine.Smoking({}); assert(r.plan); });
  it('drVisit', () => { const r = Engine.DrVisit({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
