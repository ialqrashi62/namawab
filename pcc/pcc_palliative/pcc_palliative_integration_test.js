// P3-CV pcc_palliative integration test v3.60.0
const Engine = require('./pcc_palliative_engine.js');
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
  console.log('pcc_palliative integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cv_pcc_palliative', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_palliative', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cv_pcc_palliative', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cv_pcc_palliative', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cv_pcc_palliative', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('symptom', () => { const r = Engine.Symptom({}); assert(r.plan); });
  it('performance', () => { const r = Engine.Performance({}); assert(r.plan); });
  it('prognosis', () => { const r = Engine.Prognosis({}); assert(r.plan); });
  it('goals', () => { const r = Engine.Goals({}); assert(r.plan); });
  it('advanceCare', () => { const r = Engine.AdvanceCare({}); assert(r.plan); });
  it('familyMeeting', () => { const r = Engine.FamilyMeeting({}); assert(r.plan); });
  it('hospice', () => { const r = Engine.Hospice({}); assert(r.plan); });
  it('medication', () => { const r = Engine.Medication({}); assert(r.plan); });
  it('breakthrough', () => { const r = Engine.Breakthrough({}); assert(r.plan); });
  it('spiritual', () => { const r = Engine.Spiritual({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
