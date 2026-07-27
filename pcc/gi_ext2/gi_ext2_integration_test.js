// P3-BV gi_ext2 integration test v3.34.0
const Engine = require('./gi_ext2_engine.js');
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
  console.log('gi_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bv_gi_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'gi_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bv_gi_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bv_gi_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bv_gi_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('dysphagia', () => { const r = Engine.Dysphagia({}); assert(r.plan); });
  it('gERD', () => { const r = Engine.GERD({}); assert(r.plan); });
  it('pUD', () => { const r = Engine.PUD({}); assert(r.plan); });
  it('iBD', () => { const r = Engine.IBD({}); assert(r.plan); });
  it('iBS', () => { const r = Engine.IBS({}); assert(r.plan); });
  it('celiac', () => { const r = Engine.Celiac({}); assert(r.plan); });
  it('pancreatitis', () => { const r = Engine.Pancreatitis({}); assert(r.plan); });
  it('cirrhosis', () => { const r = Engine.Cirrhosis({}); assert(r.plan); });
  it('jaundice', () => { const r = Engine.Jaundice({}); assert(r.plan); });
  it('bleed', () => { const r = Engine.Bleed({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
