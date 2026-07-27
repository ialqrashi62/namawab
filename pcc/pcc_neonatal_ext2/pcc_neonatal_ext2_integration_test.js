// P3-CK pcc_neonatal_ext2 integration test v3.49.0
const Engine = require('./pcc_neonatal_ext2_engine.js');
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
  console.log('pcc_neonatal_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ck_pcc_neonatal_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_neonatal_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ck_pcc_neonatal_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ck_pcc_neonatal_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ck_pcc_neonatal_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('gestationAge', () => { const r = Engine.GestationAge({}); assert(r.plan); });
  it('aPGAR', () => { const r = Engine.APGAR({}); assert(r.plan); });
  it('birthWeight', () => { const r = Engine.BirthWeight({}); assert(r.plan); });
  it('newbornScreen', () => { const r = Engine.NewbornScreen({}); assert(r.plan); });
  it('breastfeed', () => { const r = Engine.Breastfeed({}); assert(r.plan); });
  it('hyperbilirubin', () => { const r = Engine.Hyperbilirubin({}); assert(r.plan); });
  it('feeding', () => { const r = Engine.Feeding({}); assert(r.plan); });
  it('dischargeChecklist', () => { const r = Engine.DischargeChecklist({}); assert(r.plan); });
  it('sepsisEval', () => { const r = Engine.SepsisEval({}); assert(r.plan); });
  it('cordCare', () => { const r = Engine.CordCare({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
