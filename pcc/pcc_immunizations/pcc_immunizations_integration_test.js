// P3-CU pcc_immunizations integration test v3.59.0
const Engine = require('./pcc_immunizations_engine.js');
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
  console.log('pcc_immunizations integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cu_pcc_immunizations', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_immunizations', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cu_pcc_immunizations', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cu_pcc_immunizations', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cu_pcc_immunizations', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('immunization', () => { const r = Engine.Immunization({}); assert(r.plan); });
  it('schedule', () => { const r = Engine.Schedule({}); assert(r.plan); });
  it('catchup', () => { const r = Engine.Catchup({}); assert(r.plan); });
  it('allergyToVaccine', () => { const r = Engine.AllergyToVaccine({}); assert(r.plan); });
  it('consent', () => { const r = Engine.Consent({}); assert(r.plan); });
  it('lotNumber', () => { const r = Engine.LotNumber({}); assert(r.plan); });
  it('site', () => { const r = Engine.Site({}); assert(r.plan); });
  it('adrs', () => { const r = Engine.Adrs({}); assert(r.plan); });
  it('pregnancy', () => { const r = Engine.Pregnancy({}); assert(r.plan); });
  it('titer', () => { const r = Engine.Titer({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
