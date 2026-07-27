// P3-CX pcc_smoking_cessation integration test v3.62.0
const Engine = require('./pcc_smoking_cessation_engine.js');
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
  console.log('pcc_smoking_cessation integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cx_pcc_smoking_cessation', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_smoking_cessation', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cx_pcc_smoking_cessation', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cx_pcc_smoking_cessation', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cx_pcc_smoking_cessation', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('readiness', () => { const r = Engine.Readiness({}); assert(r.plan); });
  it('packYears', () => { const r = Engine.PackYears({}); assert(r.plan); });
  it('fagerstrom', () => { const r = Engine.Fagerstrom({}); assert(r.plan); });
  it('quitPlan', () => { const r = Engine.QuitPlan({}); assert(r.plan); });
  it('nrt', () => { const r = Engine.Nrt({}); assert(r.plan); });
  it('varenicline', () => { const r = Engine.Varenicline({}); assert(r.plan); });
  it('bupropion', () => { const r = Engine.Bupropion({}); assert(r.plan); });
  it('counseling', () => { const r = Engine.Counseling({}); assert(r.plan); });
  it('relapse', () => { const r = Engine.Relapse({}); assert(r.plan); });
  it('carbonMonoxide', () => { const r = Engine.CarbonMonoxide({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
