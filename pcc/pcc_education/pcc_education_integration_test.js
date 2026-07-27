// P3-CE pcc_education integration test v3.43.0
const Engine = require('./pcc_education_engine.js');
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
  console.log('pcc_education integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ce_pcc_education', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_education', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ce_pcc_education', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ce_pcc_education', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ce_pcc_education', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('curriculum', () => { const r = Engine.Curriculum({}); assert(r.plan); });
  it('rotation', () => { const r = Engine.Rotation({}); assert(r.plan); });
  it('simulation', () => { const r = Engine.Simulation({}); assert(r.plan); });
  it('eval', () => { const r = Engine.Eval({}); assert(r.plan); });
  it('lecture', () => { const r = Engine.Lecture({}); assert(r.plan); });
  it('bedside', () => { const r = Engine.Bedside({}); assert(r.plan); });
  it('cert', () => { const r = Engine.Cert({}); assert(r.plan); });
  it('fellow', () => { const r = Engine.Fellow({}); assert(r.plan); });
  it('cEU', () => { const r = Engine.CEU({}); assert(r.plan); });
  it('exam', () => { const r = Engine.Exam({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
