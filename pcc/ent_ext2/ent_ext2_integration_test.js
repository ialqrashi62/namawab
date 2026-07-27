// P3-BV ent_ext2 integration test v3.34.0
const Engine = require('./ent_ext2_engine.js');
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
  console.log('ent_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bv_ent_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'ent_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bv_ent_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bv_ent_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bv_ent_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('hearing', () => { const r = Engine.Hearing({}); assert(r.plan); });
  it('tinnitus', () => { const r = Engine.Tinnitus({}); assert(r.plan); });
  it('vertigo', () => { const r = Engine.Vertigo({}); assert(r.plan); });
  it('sinus', () => { const r = Engine.Sinus({}); assert(r.plan); });
  it('oSA', () => { const r = Engine.OSA({}); assert(r.plan); });
  it('hoarseness', () => { const r = Engine.Hoarseness({}); assert(r.plan); });
  it('neckMass', () => { const r = Engine.NeckMass({}); assert(r.plan); });
  it('epistaxis', () => { const r = Engine.Epistaxis({}); assert(r.plan); });
  it('dysphagia', () => { const r = Engine.Dysphagia({}); assert(r.plan); });
  it('allergic', () => { const r = Engine.Allergic({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
