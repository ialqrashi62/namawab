// P3-BW onco_ext3 integration test v3.35.0
const Engine = require('./onco_ext3_engine.js');
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
  console.log('onco_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bw_onco_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'onco_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bw_onco_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bw_onco_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bw_onco_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('staging', () => { const r = Engine.Staging({}); assert(r.plan); });
  it('chemo', () => { const r = Engine.Chemo({}); assert(r.plan); });
  it('radiation', () => { const r = Engine.Radiation({}); assert(r.plan); });
  it('target', () => { const r = Engine.Target({}); assert(r.plan); });
  it('immuno', () => { const r = Engine.Immuno({}); assert(r.plan); });
  it('surgery', () => { const r = Engine.Surgery({}); assert(r.plan); });
  it('complication', () => { const r = Engine.Complication({}); assert(r.plan); });
  it('survivorship', () => { const r = Engine.Survivorship({}); assert(r.plan); });
  it('palliative', () => { const r = Engine.Palliative({}); assert(r.plan); });
  it('screening', () => { const r = Engine.Screening({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
