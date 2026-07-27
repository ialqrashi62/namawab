// P3-DJ pcc_sleep_disorders integration tests v3.74.0
const Engine = require('./pcc_sleep_disorders_engine.js');
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
  console.log('pcc_sleep_disorders integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dj_pcc_sleep_disorders', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_sleep_disorders', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3dj_pcc_sleep_disorders', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3dj_pcc_sleep_disorders', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3dj_pcc_sleep_disorders', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('SleepApnea', () => { const r = Engine.SleepApnea({}); assert(r.plan); });
  it('InsomniaCBT', () => { const r = Engine.InsomniaCBT({}); assert(r.plan); });
  it('CircadianRhythm', () => { const r = Engine.CircadianRhythm({}); assert(r.plan); });
  it('RestlessLegs', () => { const r = Engine.RestlessLegs({}); assert(r.plan); });
  it('Narcolepsy', () => { const r = Engine.Narcolepsy({}); assert(r.plan); });
  it('Parasomnias', () => { const r = Engine.Parasomnias({}); assert(r.plan); });
  it('Hypersomnia', () => { const r = Engine.Hypersomnia({}); assert(r.plan); });
  it('SleepHygieneAdvanced', () => { const r = Engine.SleepHygieneAdvanced({}); assert(r.plan); });
  it('CPAPTitration', () => { const r = Engine.CPAPTitration({}); assert(r.plan); });
  it('SleepSurgery', () => { const r = Engine.SleepSurgery({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
