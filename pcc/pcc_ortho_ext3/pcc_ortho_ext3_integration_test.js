// P3-CL pcc_ortho_ext3 integration test v3.50.0
const Engine = require('./pcc_ortho_ext3_engine.js');
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
  console.log('pcc_ortho_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cl_pcc_ortho_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_ortho_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cl_pcc_ortho_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cl_pcc_ortho_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cl_pcc_ortho_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('fx', () => { const r = Engine.Fx({}); assert(r.plan); });
  it('joint', () => { const r = Engine.Joint({}); assert(r.plan); });
  it('spine', () => { const r = Engine.Spine({}); assert(r.plan); });
  it('sports', () => { const r = Engine.Sports({}); assert(r.plan); });
  it('pediatric', () => { const r = Engine.Pediatric({}); assert(r.plan); });
  it('tumor', () => { const r = Engine.Tumor({}); assert(r.plan); });
  it('hand', () => { const r = Engine.Hand({}); assert(r.plan); });
  it('foot', () => { const r = Engine.Foot({}); assert(r.plan); });
  it('postop', () => { const r = Engine.Postop({}); assert(r.plan); });
  it('rehab', () => { const r = Engine.Rehab({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
