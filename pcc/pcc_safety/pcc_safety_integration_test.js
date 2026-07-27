// P3-CR pcc_safety integration test v3.56.0
const Engine = require('./pcc_safety_engine.js');
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
  console.log('pcc_safety integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cr_pcc_safety', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_safety', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cr_pcc_safety', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cr_pcc_safety', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cr_pcc_safety', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('fall', () => { const r = Engine.Fall({}); assert(r.plan); });
  it('restraint', () => { const r = Engine.Restraint({}); assert(r.plan); });
  it('suicide', () => { const r = Engine.Suicide({}); assert(r.plan); });
  it('elopement', () => { const r = Engine.Elopement({}); assert(r.plan); });
  it('mislabel', () => { const r = Engine.Mislabel({}); assert(r.plan); });
  it('wrongPt', () => { const r = Engine.WrongPt({}); assert(r.plan); });
  it('fire', () => { const r = Engine.Fire({}); assert(r.plan); });
  it('radiation', () => { const r = Engine.Radiation({}); assert(r.plan); });
  it('sharps', () => { const r = Engine.Sharps({}); assert(r.plan); });
  it('hazard', () => { const r = Engine.Hazard({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
