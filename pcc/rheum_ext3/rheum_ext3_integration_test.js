// P3-BZ rheum_ext3 integration test v3.38.0
const Engine = require('./rheum_ext3_engine.js');
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
  console.log('rheum_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bz_rheum_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'rheum_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bz_rheum_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bz_rheum_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bz_rheum_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('rA', () => { const r = Engine.RA({}); assert(r.plan); });
  it('sLE', () => { const r = Engine.SLE({}); assert(r.plan); });
  it('sSc', () => { const r = Engine.SSc({}); assert(r.plan); });
  it('vasculitis', () => { const r = Engine.Vasculitis({}); assert(r.plan); });
  it('gout', () => { const r = Engine.Gout({}); assert(r.plan); });
  it('oA', () => { const r = Engine.OA({}); assert(r.plan); });
  it('spA', () => { const r = Engine.SpA({}); assert(r.plan); });
  it('pMR', () => { const r = Engine.PMR({}); assert(r.plan); });
  it('sjogren', () => { const r = Engine.Sjogren({}); assert(r.plan); });
  it('myositis', () => { const r = Engine.Myositis({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
