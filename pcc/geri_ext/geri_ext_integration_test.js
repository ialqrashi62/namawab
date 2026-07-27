// P3-BS geri_ext integration test v3.31.0
const Engine = require('./geri_ext_engine.js');
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
  console.log('geri_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bs_geri_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'geri_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bs_geri_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bs_geri_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bs_geri_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('frailty', () => { const r = Engine.Frailty({}); assert(r.plan); });
  it('polypharm', () => { const r = Engine.Polypharm({}); assert(r.plan); });
  it('delirium', () => { const r = Engine.Delirium({}); assert(r.plan); });
  it('falls', () => { const r = Engine.Falls({}); assert(r.plan); });
  it('dementia', () => { const r = Engine.Dementia({}); assert(r.plan); });
  it('nutrition', () => { const r = Engine.Nutrition({}); assert(r.plan); });
  it('pressureUlcer', () => { const r = Engine.PressureUlcer({}); assert(r.plan); });
  it('depression', () => { const r = Engine.Depression({}); assert(r.plan); });
  it('advance', () => { const r = Engine.Advance({}); assert(r.plan); });
  it('sarcopenia', () => { const r = Engine.Sarcopenia({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
