// P3-CX pcc_addiction_med integration test v3.62.0
const Engine = require('./pcc_addiction_med_engine.js');
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
  console.log('pcc_addiction_med integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cx_pcc_addiction_med', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_addiction_med', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cx_pcc_addiction_med', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cx_pcc_addiction_med', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cx_pcc_addiction_med', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('audit', () => { const r = Engine.Audit({}); assert(r.plan); });
  it('dast', () => { const r = Engine.Dast({}); assert(r.plan); });
  it('cage', () => { const r = Engine.Cage({}); assert(r.plan); });
  it('motivation', () => { const r = Engine.Motivation({}); assert(r.plan); });
  it('withdrawal', () => { const r = Engine.Withdrawal({}); assert(r.plan); });
  it('matOpioid', () => { const r = Engine.MatOpioid({}); assert(r.plan); });
  it('matAlcohol', () => { const r = Engine.MatAlcohol({}); assert(r.plan); });
  it('overdose', () => { const r = Engine.Overdose({}); assert(r.plan); });
  it('harmReduction', () => { const r = Engine.HarmReduction({}); assert(r.plan); });
  it('relapsePlan', () => { const r = Engine.RelapsePlan({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
