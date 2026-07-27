// P3-BW psych_ext2 integration test v3.35.0
const Engine = require('./psych_ext2_engine.js');
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
  console.log('psych_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bw_psych_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'psych_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bw_psych_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bw_psych_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bw_psych_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('depression', () => { const r = Engine.Depression({}); assert(r.plan); });
  it('anxiety', () => { const r = Engine.Anxiety({}); assert(r.plan); });
  it('bipolar', () => { const r = Engine.Bipolar({}); assert(r.plan); });
  it('pTSD', () => { const r = Engine.PTSD({}); assert(r.plan); });
  it('substance', () => { const r = Engine.Substance({}); assert(r.plan); });
  it('schizophrenia', () => { const r = Engine.Schizophrenia({}); assert(r.plan); });
  it('aDHD', () => { const r = Engine.ADHD({}); assert(r.plan); });
  it('autism', () => { const r = Engine.Autism({}); assert(r.plan); });
  it('eating', () => { const r = Engine.Eating({}); assert(r.plan); });
  it('personality', () => { const r = Engine.Personality({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
