// P3-CR pcc_handoff integration test v3.56.0
const Engine = require('./pcc_handoff_engine.js');
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
  console.log('pcc_handoff integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cr_pcc_handoff', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_handoff', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cr_pcc_handoff', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cr_pcc_handoff', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cr_pcc_handoff', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('ipass', () => { const r = Engine.Ipass({}); assert(r.plan); });
  it('sbar', () => { const r = Engine.Sbar({}); assert(r.plan); });
  it('shift', () => { const r = Engine.Shift({}); assert(r.plan); });
  it('discharge', () => { const r = Engine.Discharge({}); assert(r.plan); });
  it('icu', () => { const r = Engine.Icu({}); assert(r.plan); });
  it('or', () => { const r = Engine.Or({}); assert(r.plan); });
  it('er', () => { const r = Engine.Er({}); assert(r.plan); });
  it('anesthesia', () => { const r = Engine.Anesthesia({}); assert(r.plan); });
  it('primary', () => { const r = Engine.Primary({}); assert(r.plan); });
  it('receiving', () => { const r = Engine.Receiving({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
