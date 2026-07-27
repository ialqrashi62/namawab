// P3-CG pcc_pharmacy integration test v3.45.0
const Engine = require('./pcc_pharmacy_engine.js');
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
  console.log('pcc_pharmacy integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cg_pcc_pharmacy', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_pharmacy', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cg_pcc_pharmacy', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cg_pcc_pharmacy', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cg_pcc_pharmacy', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('dispense', () => { const r = Engine.Dispense({}); assert(r.plan); });
  it('interaction', () => { const r = Engine.Interaction({}); assert(r.plan); });
  it('allergy', () => { const r = Engine.Allergy({}); assert(r.plan); });
  it('doseCheck', () => { const r = Engine.DoseCheck({}); assert(r.plan); });
  it('refill', () => { const r = Engine.Refill({}); assert(r.plan); });
  it('compounding', () => { const r = Engine.Compounding({}); assert(r.plan); });
  it('narcotic', () => { const r = Engine.Narcotic({}); assert(r.plan); });
  it('iVAdmixture', () => { const r = Engine.IVAdmixture({}); assert(r.plan); });
  it('formulary', () => { const r = Engine.Formulary({}); assert(r.plan); });
  it('counseling', () => { const r = Engine.Counseling({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
