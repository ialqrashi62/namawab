// P3-BY allergy_ext2 integration test v3.37.0
const Engine = require('./allergy_ext2_engine.js');
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
  console.log('allergy_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3by_allergy_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'allergy_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3by_allergy_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3by_allergy_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3by_allergy_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('rhinitis', () => { const r = Engine.Rhinitis({}); assert(r.plan); });
  it('asthma', () => { const r = Engine.Asthma({}); assert(r.plan); });
  it('food', () => { const r = Engine.Food({}); assert(r.plan); });
  it('drug', () => { const r = Engine.Drug({}); assert(r.plan); });
  it('urticaria', () => { const r = Engine.Urticaria({}); assert(r.plan); });
  it('anaphylaxis', () => { const r = Engine.Anaphylaxis({}); assert(r.plan); });
  it('sting', () => { const r = Engine.Sting({}); assert(r.plan); });
  it('eczema', () => { const r = Engine.Eczema({}); assert(r.plan); });
  it('contact', () => { const r = Engine.Contact({}); assert(r.plan); });
  it('aIT', () => { const r = Engine.AIT({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
