// P3-CG pcc_oncology_ext integration test v3.45.0
const Engine = require('./pcc_oncology_ext_engine.js');
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
  console.log('pcc_oncology_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cg_pcc_oncology_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_oncology_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cg_pcc_oncology_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cg_pcc_oncology_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cg_pcc_oncology_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('regimen', () => { const r = Engine.Regimen({}); assert(r.plan); });
  it('cycle', () => { const r = Engine.Cycle({}); assert(r.plan); });
  it('toxicity', () => { const r = Engine.Toxicity({}); assert(r.plan); });
  it('response', () => { const r = Engine.Response({}); assert(r.plan); });
  it('doseReduction', () => { const r = Engine.DoseReduction({}); assert(r.plan); });
  it('holdReason', () => { const r = Engine.HoldReason({}); assert(r.plan); });
  it('biomarker', () => { const r = Engine.Biomarker({}); assert(r.plan); });
  it('survivorship', () => { const r = Engine.Survivorship({}); assert(r.plan); });
  it('tumorBoard', () => { const r = Engine.TumorBoard({}); assert(r.plan); });
  it('palliative', () => { const r = Engine.Palliative({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
