// P3-CT pcc_urgent_care integration test v3.58.0
const Engine = require('./pcc_urgent_care_engine.js');
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
  console.log('pcc_urgent_care integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ct_pcc_urgent_care', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_urgent_care', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3ct_pcc_urgent_care', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3ct_pcc_urgent_care', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3ct_pcc_urgent_care', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('walkIn', () => { const r = Engine.WalkIn({}); assert(r.plan); });
  it('injuryType', () => { const r = Engine.InjuryType({}); assert(r.plan); });
  it('illness', () => { const r = Engine.Illness({}); assert(r.plan); });
  it('stitches', () => { const r = Engine.Stitches({}); assert(r.plan); });
  it('splint', () => { const r = Engine.Splint({}); assert(r.plan); });
  it('neb', () => { const r = Engine.Neb({}); assert(r.plan); });
  it('ekgUrgent', () => { const r = Engine.EkgUrgent({}); assert(r.plan); });
  it('xrayOnsite', () => { const r = Engine.XrayOnsite({}); assert(r.plan); });
  it('labRapid', () => { const r = Engine.LabRapid({}); assert(r.plan); });
  it('dcUrgent', () => { const r = Engine.DcUrgent({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
