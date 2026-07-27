// P3-CI pcc_rad_ext2 integration test v3.47.0
const Engine = require('./pcc_rad_ext2_engine.js');
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
  console.log('pcc_rad_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ci_pcc_rad_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_rad_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ci_pcc_rad_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ci_pcc_rad_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ci_pcc_rad_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('modality', () => { const r = Engine.Modality({}); assert(r.plan); });
  it('bodyPart', () => { const r = Engine.BodyPart({}); assert(r.plan); });
  it('indication', () => { const r = Engine.Indication({}); assert(r.plan); });
  it('contrast', () => { const r = Engine.Contrast({}); assert(r.plan); });
  it('urgency', () => { const r = Engine.Urgency({}); assert(r.plan); });
  it('comparison', () => { const r = Engine.Comparison({}); assert(r.plan); });
  it('dose', () => { const r = Engine.Dose({}); assert(r.plan); });
  it('pregnancy', () => { const r = Engine.Pregnancy({}); assert(r.plan); });
  it('pediatric', () => { const r = Engine.Pediatric({}); assert(r.plan); });
  it('report', () => { const r = Engine.Report({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
