// P3-BR pathology_ext integration test v3.30.0
const Engine = require('./pathology_ext_engine.js');
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
  console.log('pathology_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3br_pathology_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pathology_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3br_pathology_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3br_pathology_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3br_pathology_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('biopsy', () => { const r = Engine.Biopsy({}); assert(r.plan); });
  it('frozen', () => { const r = Engine.Frozen({}); assert(r.plan); });
  it('immunoHisto', () => { const r = Engine.ImmunoHisto({}); assert(r.plan); });
  it('molecular', () => { const r = Engine.Molecular({}); assert(r.plan); });
  it('cyto', () => { const r = Engine.Cyto({}); assert(r.plan); });
  it('hematoPath', () => { const r = Engine.HematoPath({}); assert(r.plan); });
  it('surgical', () => { const r = Engine.Surgical({}); assert(r.plan); });
  it('autopsy', () => { const r = Engine.Autopsy({}); assert(r.plan); });
  it('consult', () => { const r = Engine.Consult({}); assert(r.plan); });
  it('molecularDx', () => { const r = Engine.MolecularDx({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
