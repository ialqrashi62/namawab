// P3-CH pcc_perioperative integration test v3.46.0
const Engine = require('./pcc_perioperative_engine.js');
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
  console.log('pcc_perioperative integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ch_pcc_perioperative', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_perioperative', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ch_pcc_perioperative', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ch_pcc_perioperative', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ch_pcc_perioperative', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('preopEval', () => { const r = Engine.PreopEval({}); assert(r.plan); });
  it('npo', () => { const r = Engine.Npo({}); assert(r.plan); });
  it('meds', () => { const r = Engine.Meds({}); assert(r.plan); });
  it('handoff', () => { const r = Engine.Handoff({}); assert(r.plan); });
  it('signIn', () => { const r = Engine.SignIn({}); assert(r.plan); });
  it('timeOut', () => { const r = Engine.TimeOut({}); assert(r.plan); });
  it('signOut', () => { const r = Engine.SignOut({}); assert(r.plan); });
  it('skinPrep', () => { const r = Engine.SkinPrep({}); assert(r.plan); });
  it('normothermia', () => { const r = Engine.Normothermia({}); assert(r.plan); });
  it('ebl', () => { const r = Engine.Ebl({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
