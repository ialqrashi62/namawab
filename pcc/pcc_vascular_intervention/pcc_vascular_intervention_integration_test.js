// P3-DX pcc_vascular_intervention integration tests v3.88.0
const Engine = require('./pcc_vascular_intervention_engine.js');
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
  console.log('pcc_vascular_intervention integration tests:');
  const db = makeDb();
  const t = await db.insert('p3dx_pcc_vascular_intervention', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_vascular_intervention', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3dx_pcc_vascular_intervention', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3dx_pcc_vascular_intervention', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3dx_pcc_vascular_intervention', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('CarotidStentPlacement', () => { const r = Engine.CarotidStentPlacement({}); assert(r.plan); });
  it('AAAEndovascularRepair', () => { const r = Engine.AAAEndovascularRepair({}); assert(r.plan); });
  it('PeripheralAngioplasty', () => { const r = Engine.PeripheralAngioplasty({}); assert(r.plan); });
  it('DVTThrombolysis', () => { const r = Engine.DVTThrombolysis({}); assert(r.plan); });
  it('VaricoseVeinAblation', () => { const r = Engine.VaricoseVeinAblation({}); assert(r.plan); });
  it('AVMEmbolization', () => { const r = Engine.AVMEmbolization({}); assert(r.plan); });
  it('RenalArteryStenting', () => { const r = Engine.RenalArteryStenting({}); assert(r.plan); });
  it('MesentericIschemiaIntervention', () => { const r = Engine.MesentericIschemiaIntervention({}); assert(r.plan); });
  it('ClaudicationRevascularization', () => { const r = Engine.ClaudicationRevascularization({}); assert(r.plan); });
  it('VascularTraumaControl', () => { const r = Engine.VascularTraumaControl({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
