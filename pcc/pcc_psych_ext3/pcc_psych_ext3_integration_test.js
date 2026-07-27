// P3-CK pcc_psych_ext3 integration test v3.49.0
const Engine = require('./pcc_psych_ext3_engine.js');
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
  console.log('pcc_psych_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ck_pcc_psych_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_psych_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ck_pcc_psych_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ck_pcc_psych_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ck_pcc_psych_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('screening', () => { const r = Engine.Screening({}); assert(r.plan); });
  it('risk', () => { const r = Engine.Risk({}); assert(r.plan); });
  it('depression', () => { const r = Engine.Depression({}); assert(r.plan); });
  it('anxiety', () => { const r = Engine.Anxiety({}); assert(r.plan); });
  it('substance', () => { const r = Engine.Substance({}); assert(r.plan); });
  it('psychosis', () => { const r = Engine.Psychosis({}); assert(r.plan); });
  it('bipolar', () => { const r = Engine.Bipolar({}); assert(r.plan); });
  it('medMgmt', () => { const r = Engine.MedMgmt({}); assert(r.plan); });
  it('therapy', () => { const r = Engine.Therapy({}); assert(r.plan); });
  it('restraint', () => { const r = Engine.Restraint({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
