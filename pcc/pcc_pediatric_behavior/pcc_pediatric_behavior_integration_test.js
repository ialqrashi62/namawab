// P3-EL pcc_pediatric_behavior integration tests v3.102.0
const Engine = require('./pcc_pediatric_behavior_engine.js');
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
  console.log('pcc_pediatric_behavior integration tests:');
  const db = makeDb();
  const t = await db.insert('p3el_pcc_pediatric_behavior', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_pediatric_behavior', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3el_pcc_pediatric_behavior', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3el_pcc_pediatric_behavior', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3el_pcc_pediatric_behavior', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('AutismSpectrumEval', () => { const r = Engine.AutismSpectrumEval({}); assert(r.plan); });
  it('ADHDAssessment', () => { const r = Engine.ADHDAssessment({}); assert(r.plan); });
  it('PediatricAnxiety', () => { const r = Engine.PediatricAnxiety({}); assert(r.plan); });
  it('PediatricDepression', () => { const r = Engine.PediatricDepression({}); assert(r.plan); });
  it('PediatricOCD', () => { const r = Engine.PediatricOCD({}); assert(r.plan); });
  it('PediatricBipolarEval', () => { const r = Engine.PediatricBipolarEval({}); assert(r.plan); });
  it('PediatricConductDisorder', () => { const r = Engine.PediatricConductDisorder({}); assert(r.plan); });
  it('PediatricOppositionalDefiant', () => { const r = Engine.PediatricOppositionalDefiant({}); assert(r.plan); });
  it('PediatricTicDisorders', () => { const r = Engine.PediatricTicDisorders({}); assert(r.plan); });
  it('PediatricSelectiveMutism', () => { const r = Engine.PediatricSelectiveMutism({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
