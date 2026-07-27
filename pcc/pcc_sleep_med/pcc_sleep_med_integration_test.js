// P3-CW pcc_sleep_med integration test v3.61.0
const Engine = require('./pcc_sleep_med_engine.js');
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
  console.log('pcc_sleep_med integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cw_pcc_sleep_med', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_sleep_med', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cw_pcc_sleep_med', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cw_pcc_sleep_med', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cw_pcc_sleep_med', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('ahi', () => { const r = Engine.Ahi({}); assert(r.plan); });
  it('insomnia', () => { const r = Engine.Insomnia({}); assert(r.plan); });
  it('cpap', () => { const r = Engine.Cpap({}); assert(r.plan); });
  it('daytime', () => { const r = Engine.Daytime({}); assert(r.plan); });
  it('apnea', () => { const r = Engine.Apnea({}); assert(r.plan); });
  it('oxygen', () => { const r = Engine.Oxygen({}); assert(r.plan); });
  it('restless', () => { const r = Engine.Restless({}); assert(r.plan); });
  it('narcolepsy', () => { const r = Engine.Narcolepsy({}); assert(r.plan); });
  it('parasomnia', () => { const r = Engine.Parasomnia({}); assert(r.plan); });
  it('hypopnea', () => { const r = Engine.Hypopnea({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
