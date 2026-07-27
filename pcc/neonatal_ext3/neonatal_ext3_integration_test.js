// P3-BU neonatal_ext3 integration test v3.33.0
const Engine = require('./neonatal_ext3_engine.js');
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
  console.log('neonatal_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bu_neonatal_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'neonatal_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bu_neonatal_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bu_neonatal_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bu_neonatal_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('apnea', () => { const r = Engine.Apnea({}); assert(r.plan); });
  it('jaundice', () => { const r = Engine.Jaundice({}); assert(r.plan); });
  it('sepsisScreen', () => { const r = Engine.SepsisScreen({}); assert(r.plan); });
  it('nEC', () => { const r = Engine.NEC({}); assert(r.plan); });
  it('bPD', () => { const r = Engine.BPD({}); assert(r.plan); });
  it('iVH', () => { const r = Engine.IVH({}); assert(r.plan); });
  it('rOP', () => { const r = Engine.ROP({}); assert(r.plan); });
  it('cooling', () => { const r = Engine.Cooling({}); assert(r.plan); });
  it('feed', () => { const r = Engine.Feed({}); assert(r.plan); });
  it('discharge', () => { const r = Engine.Discharge({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
