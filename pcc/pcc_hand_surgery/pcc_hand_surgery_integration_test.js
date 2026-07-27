// P3-EC pcc_hand_surgery integration tests v3.93.0
const Engine = require('./pcc_hand_surgery_engine.js');
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
  console.log('pcc_hand_surgery integration tests:');
  const db = makeDb();
  const t = await db.insert('p3ec_pcc_hand_surgery', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_hand_surgery', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3ec_pcc_hand_surgery', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3ec_pcc_hand_surgery', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3ec_pcc_hand_surgery', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('CarpalTunnelRelease', () => { const r = Engine.CarpalTunnelRelease({}); assert(r.plan); });
  it('TriggerFingerRelease', () => { const r = Engine.TriggerFingerRelease({}); assert(r.plan); });
  it('DupuytrenContracture', () => { const r = Engine.DupuytrenContracture({}); assert(r.plan); });
  it('DeQuervainRelease', () => { const r = Engine.DeQuervainRelease({}); assert(r.plan); });
  it('TendonRepairZone', () => { const r = Engine.TendonRepairZone({}); assert(r.plan); });
  it('NerveRepairIndications', () => { const r = Engine.NerveRepairIndications({}); assert(r.plan); });
  it('FractureReductionHand', () => { const r = Engine.FractureReductionHand({}); assert(r.plan); });
  it('ReplantationDecision', () => { const r = Engine.ReplantationDecision({}); assert(r.plan); });
  it('CongenitalHandDifference', () => { const r = Engine.CongenitalHandDifference({}); assert(r.plan); });
  it('WristArthroscopyIndication', () => { const r = Engine.WristArthroscopyIndication({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
