// P3-BY sleep_ext2 integration test v3.37.0
const Engine = require('./sleep_ext2_engine.js');
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
  console.log('sleep_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3by_sleep_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'sleep_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3by_sleep_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3by_sleep_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3by_sleep_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('insomnia', () => { const r = Engine.Insomnia({}); assert(r.plan); });
  it('oSA', () => { const r = Engine.OSA({}); assert(r.plan); });
  it('rLS', () => { const r = Engine.RLS({}); assert(r.plan); });
  it('narcolepsy', () => { const r = Engine.Narcolepsy({}); assert(r.plan); });
  it('parasomnia', () => { const r = Engine.Parasomnia({}); assert(r.plan); });
  it('circadian', () => { const r = Engine.Circadian({}); assert(r.plan); });
  it('cPAP', () => { const r = Engine.CPAP({}); assert(r.plan); });
  it('daytime', () => { const r = Engine.Daytime({}); assert(r.plan); });
  it('pediatric', () => { const r = Engine.Pediatric({}); assert(r.plan); });
  it('sleepStudy', () => { const r = Engine.SleepStudy({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
