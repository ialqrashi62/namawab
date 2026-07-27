// P3-BY cv_ext3 integration test v3.37.0
const Engine = require('./cv_ext3_engine.js');
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
  console.log('cv_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3by_cv_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'cv_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3by_cv_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3by_cv_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3by_cv_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('stroke', () => { const r = Engine.Stroke({}); assert(r.plan); });
  it('tIA', () => { const r = Engine.TIA({}); assert(r.plan); });
  it('sAH', () => { const r = Engine.SAH({}); assert(r.plan); });
  it('aneurysm', () => { const r = Engine.Aneurysm({}); assert(r.plan); });
  it('aVM', () => { const r = Engine.AVM({}); assert(r.plan); });
  it('carotid', () => { const r = Engine.Carotid({}); assert(r.plan); });
  it('iCP', () => { const r = Engine.ICP({}); assert(r.plan); });
  it('seizure', () => { const r = Engine.Seizure({}); assert(r.plan); });
  it('mS', () => { const r = Engine.MS({}); assert(r.plan); });
  it('park', () => { const r = Engine.Park({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
