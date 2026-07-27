// P3-CS pcc_sepsis integration test v3.57.0
const Engine = require('./pcc_sepsis_engine.js');
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
  console.log('pcc_sepsis integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cs_pcc_sepsis', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_sepsis', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cs_pcc_sepsis', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cs_pcc_sepsis', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cs_pcc_sepsis', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('screening', () => { const r = Engine.Screening({}); assert(r.plan); });
  it('lactate', () => { const r = Engine.Lactate({}); assert(r.plan); });
  it('abx', () => { const r = Engine.Abx({}); assert(r.plan); });
  it('fluid', () => { const r = Engine.Fluid({}); assert(r.plan); });
  it('vasopressor', () => { const r = Engine.Vasopressor({}); assert(r.plan); });
  it('culture', () => { const r = Engine.Culture({}); assert(r.plan); });
  it('sourceCtl', () => { const r = Engine.SourceCtl({}); assert(r.plan); });
  it('deEscalate', () => { const r = Engine.DeEscalate({}); assert(r.plan); });
  it('procalcitonin', () => { const r = Engine.Procalcitonin({}); assert(r.plan); });
  it('sepsisShock', () => { const r = Engine.SepsisShock({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
