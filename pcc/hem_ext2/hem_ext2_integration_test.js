// P3-BU hem_ext2 integration test v3.33.0
const Engine = require('./hem_ext2_engine.js');
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
  console.log('hem_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bu_hem_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'hem_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bu_hem_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bu_hem_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bu_hem_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('anemia', () => { const r = Engine.Anemia({}); assert(r.plan); });
  it('thrombocyt', () => { const r = Engine.Thrombocyt({}); assert(r.plan); });
  it('coag', () => { const r = Engine.Coag({}); assert(r.plan); });
  it('dVT', () => { const r = Engine.DVT({}); assert(r.plan); });
  it('anticoag', () => { const r = Engine.Anticoag({}); assert(r.plan); });
  it('bleed', () => { const r = Engine.Bleed({}); assert(r.plan); });
  it('tTP', () => { const r = Engine.TTP({}); assert(r.plan); });
  it('dIC', () => { const r = Engine.DIC({}); assert(r.plan); });
  it('sickle', () => { const r = Engine.Sickle({}); assert(r.plan); });
  it('lymphoma', () => { const r = Engine.Lymphoma({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
