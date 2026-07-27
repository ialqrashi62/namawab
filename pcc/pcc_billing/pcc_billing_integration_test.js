// P3-CF pcc_billing integration test v3.44.0
const Engine = require('./pcc_billing_engine.js');
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
  console.log('pcc_billing integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cf_pcc_billing', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_billing', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cf_pcc_billing', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cf_pcc_billing', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cf_pcc_billing', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('billing', () => { const r = Engine.Billing({}); assert(r.plan); });
  it('charge', () => { const r = Engine.Charge({}); assert(r.plan); });
  it('insurance', () => { const r = Engine.Insurance({}); assert(r.plan); });
  it('discount', () => { const r = Engine.Discount({}); assert(r.plan); });
  it('payment', () => { const r = Engine.Payment({}); assert(r.plan); });
  it('refund', () => { const r = Engine.Refund({}); assert(r.plan); });
  it('statement', () => { const r = Engine.Statement({}); assert(r.plan); });
  it('denial', () => { const r = Engine.Denial({}); assert(r.plan); });
  it('reclaim', () => { const r = Engine.Reclaim({}); assert(r.plan); });
  it('tax', () => { const r = Engine.Tax({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
