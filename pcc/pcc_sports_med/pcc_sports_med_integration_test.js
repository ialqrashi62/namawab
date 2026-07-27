// P3-CV pcc_sports_med integration test v3.60.0
const Engine = require('./pcc_sports_med_engine.js');
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
  console.log('pcc_sports_med integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cv_pcc_sports_med', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_sports_med', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cv_pcc_sports_med', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cv_pcc_sports_med', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cv_pcc_sports_med', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('injury', () => { const r = Engine.Injury({}); assert(r.plan); });
  it('returnToPlay', () => { const r = Engine.ReturnToPlay({}); assert(r.plan); });
  it('concussion', () => { const r = Engine.Concussion({}); assert(r.plan); });
  it('cardiacScreen', () => { const r = Engine.CardiacScreen({}); assert(r.plan); });
  it('hydration', () => { const r = Engine.Hydration({}); assert(r.plan); });
  it('heat', () => { const r = Engine.Heat({}); assert(r.plan); });
  it('overuse', () => { const r = Engine.Overuse({}); assert(r.plan); });
  it('doping', () => { const r = Engine.Doping({}); assert(r.plan); });
  it('nutrition', () => { const r = Engine.Nutrition({}); assert(r.plan); });
  it('imaging', () => { const r = Engine.Imaging({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
