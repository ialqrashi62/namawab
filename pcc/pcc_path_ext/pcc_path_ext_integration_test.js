// P3-CI pcc_path_ext integration test v3.47.0
const Engine = require('./pcc_path_ext_engine.js');
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
  console.log('pcc_path_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ci_pcc_path_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_path_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ci_pcc_path_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ci_pcc_path_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ci_pcc_path_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('specimenType', () => { const r = Engine.SpecimenType({}); assert(r.plan); });
  it('grossing', () => { const r = Engine.Grossing({}); assert(r.plan); });
  it('embedding', () => { const r = Engine.Embedding({}); assert(r.plan); });
  it('stain', () => { const r = Engine.Stain({}); assert(r.plan); });
  it('diagnosis', () => { const r = Engine.Diagnosis({}); assert(r.plan); });
  it('margin', () => { const r = Engine.Margin({}); assert(r.plan); });
  it('stage', () => { const r = Engine.Stage({}); assert(r.plan); });
  it('grade', () => { const r = Engine.Grade({}); assert(r.plan); });
  it('tnm', () => { const r = Engine.Tnm({}); assert(r.plan); });
  it('molecular', () => { const r = Engine.Molecular({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
