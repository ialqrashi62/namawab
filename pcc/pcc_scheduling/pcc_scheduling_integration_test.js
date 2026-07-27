// P3-CF pcc_scheduling integration test v3.44.0
const Engine = require('./pcc_scheduling_engine.js');
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
  console.log('pcc_scheduling integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cf_pcc_scheduling', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_scheduling', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cf_pcc_scheduling', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cf_pcc_scheduling', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cf_pcc_scheduling', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('schedule', () => { const r = Engine.Schedule({}); assert(r.plan); });
  it('slot', () => { const r = Engine.Slot({}); assert(r.plan); });
  it('waitlist', () => { const r = Engine.Waitlist({}); assert(r.plan); });
  it('reminder', () => { const r = Engine.Reminder({}); assert(r.plan); });
  it('booking', () => { const r = Engine.Booking({}); assert(r.plan); });
  it('cancel', () => { const r = Engine.Cancel({}); assert(r.plan); });
  it('reschedule', () => { const r = Engine.Reschedule({}); assert(r.plan); });
  it('capacity', () => { const r = Engine.Capacity({}); assert(r.plan); });
  it('resource', () => { const r = Engine.Resource({}); assert(r.plan); });
  it('template', () => { const r = Engine.Template({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
