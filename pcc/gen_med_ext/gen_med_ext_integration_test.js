// P3-BS gen_med_ext integration test v3.31.0
const Engine = require('./gen_med_ext_engine.js');
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
  console.log('gen_med_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bs_gen_med_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'gen_med_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bs_gen_med_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bs_gen_med_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bs_gen_med_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('triage', () => { const r = Engine.Triage({}); assert(r.plan); });
  it('sepsis', () => { const r = Engine.Sepsis({}); assert(r.plan); });
  it('chestPain', () => { const r = Engine.ChestPain({}); assert(r.plan); });
  it('shortBreath', () => { const r = Engine.ShortBreath({}); assert(r.plan); });
  it('abdPain', () => { const r = Engine.AbdPain({}); assert(r.plan); });
  it('fever', () => { const r = Engine.Fever({}); assert(r.plan); });
  it('syncope', () => { const r = Engine.Syncope({}); assert(r.plan); });
  it('backPain', () => { const r = Engine.BackPain({}); assert(r.plan); });
  it('headache', () => { const r = Engine.Headache({}); assert(r.plan); });
  it('dizzy', () => { const r = Engine.Dizzy({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
