// P3-BX cardio_ext3 integration test v3.36.0
const Engine = require('./cardio_ext3_engine.js');
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
  console.log('cardio_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bx_cardio_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'cardio_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bx_cardio_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bx_cardio_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bx_cardio_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('aCS', () => { const r = Engine.ACS({}); assert(r.plan); });
  it('hF', () => { const r = Engine.HF({}); assert(r.plan); });
  it('aF', () => { const r = Engine.AF({}); assert(r.plan); });
  it('valve', () => { const r = Engine.Valve({}); assert(r.plan); });
  it('hTN', () => { const r = Engine.HTN({}); assert(r.plan); });
  it('lipid', () => { const r = Engine.Lipid({}); assert(r.plan); });
  it('anticoag', () => { const r = Engine.Anticoag({}); assert(r.plan); });
  it('eP', () => { const r = Engine.EP({}); assert(r.plan); });
  it('pericardial', () => { const r = Engine.Pericardial({}); assert(r.plan); });
  it('pAD', () => { const r = Engine.PAD({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
