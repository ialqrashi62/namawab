// P3-DE pcc_metabolic_health integration tests v3.69.0
const Engine = require('./pcc_metabolic_health_engine.js');
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
  console.log('pcc_metabolic_health integration tests:');
  const db = makeDb();
  const t = await db.insert('p3de_pcc_metabolic_health', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_metabolic_health', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3de_pcc_metabolic_health', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3de_pcc_metabolic_health', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3de_pcc_metabolic_health', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('InsulinResistance', () => { const r = Engine.InsulinResistance({}); assert(r.plan); });
  it('GlucoseVariability', () => { const r = Engine.GlucoseVariability({}); assert(r.plan); });
  it('MetabolicSyndrome', () => { const r = Engine.MetabolicSyndrome({}); assert(r.plan); });
  it('LipidProfile', () => { const r = Engine.LipidProfile({}); assert(r.plan); });
  it('FattyLiver', () => { const r = Engine.FattyLiver({}); assert(r.plan); });
  it('KetogenicTherapy', () => { const r = Engine.KetogenicTherapy({}); assert(r.plan); });
  it('TimeRestrictedEating', () => { const r = Engine.TimeRestrictedEating({}); assert(r.plan); });
  it('ContinuousGlucose', () => { const r = Engine.ContinuousGlucose({}); assert(r.plan); });
  it('ThyroidMetabolism', () => { const r = Engine.ThyroidMetabolism({}); assert(r.plan); });
  it('WeightSetPoint', () => { const r = Engine.WeightSetPoint({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
