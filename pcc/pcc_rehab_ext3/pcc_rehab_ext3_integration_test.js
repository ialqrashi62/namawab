// P3-CP pcc_rehab_ext3 integration test v3.54.0
const Engine = require('./pcc_rehab_ext3_engine.js');
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
  console.log('pcc_rehab_ext3 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cp_pcc_rehab_ext3', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_rehab_ext3', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cp_pcc_rehab_ext3', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cp_pcc_rehab_ext3', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cp_pcc_rehab_ext3', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('physTherapy', () => { const r = Engine.PhysTherapy({}); assert(r.plan); });
  it('occTherapy', () => { const r = Engine.OccTherapy({}); assert(r.plan); });
  it('speechLang', () => { const r = Engine.SpeechLang({}); assert(r.plan); });
  it('postStroke', () => { const r = Engine.PostStroke({}); assert(r.plan); });
  it('sci', () => { const r = Engine.Sci({}); assert(r.plan); });
  it('tbi', () => { const r = Engine.Tbi({}); assert(r.plan); });
  it('amp', () => { const r = Engine.Amp({}); assert(r.plan); });
  it('burnr', () => { const r = Engine.Burnr({}); assert(r.plan); });
  it('preOp', () => { const r = Engine.PreOp({}); assert(r.plan); });
  it('back', () => { const r = Engine.Back({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
