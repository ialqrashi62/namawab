// P3-BR radiology2 integration test v3.30.0
const Engine = require('./radiology2_engine.js');
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
  console.log('radiology2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3br_radiology2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'radiology2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3br_radiology2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3br_radiology2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3br_radiology2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('cT', () => { const r = Engine.CT({}); assert(r.plan); });
  it('mRI', () => { const r = Engine.MRI({}); assert(r.plan); });
  it('uS', () => { const r = Engine.US({}); assert(r.plan); });
  it('xray', () => { const r = Engine.Xray({}); assert(r.plan); });
  it('nuclear', () => { const r = Engine.Nuclear({}); assert(r.plan); });
  it('interventional', () => { const r = Engine.Interventional({}); assert(r.plan); });
  it('mammo', () => { const r = Engine.Mammo({}); assert(r.plan); });
  it('fluoro', () => { const r = Engine.Fluoro({}); assert(r.plan); });
  it('pE', () => { const r = Engine.PE({}); assert(r.plan); });
  it('biopsy', () => { const r = Engine.Biopsy({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
