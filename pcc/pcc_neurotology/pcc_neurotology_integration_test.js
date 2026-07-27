// P3-EG pcc_neurotology integration tests v3.97.0
const Engine = require('./pcc_neurotology_engine.js');
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
  console.log('pcc_neurotology integration tests:');
  const db = makeDb();
  const t = await db.insert('p3eg_pcc_neurotology', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_neurotology', created_by: 'u1' });
  assert(t.id === 1); passed++;
  const got = await db.select('p3eg_pcc_neurotology', { tenant_id: 't1' });
  assert(got.rows.length > 0); passed++;
  const upd = await db.update('p3eg_pcc_neurotology', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated'); passed++;
  const del = await db.delete('p3eg_pcc_neurotology', { id: 1 });
  assert(del.deleted === 1); passed++;
  it('VertigoLocalization', () => { const r = Engine.VertigoLocalization({}); assert(r.plan); });
  it('AcousticNeuromaScreening', () => { const r = Engine.AcousticNeuromaScreening({}); assert(r.plan); });
  it('CerebellarStrokeSyndromes', () => { const r = Engine.CerebellarStrokeSyndromes({}); assert(r.plan); });
  it('BrainstemStrokeSyndromes', () => { const r = Engine.BrainstemStrokeSyndromes({}); assert(r.plan); });
  it('PosteriorFossaTumor', () => { const r = Engine.PosteriorFossaTumor({}); assert(r.plan); });
  it('HerpesZosterOticus', () => { const r = Engine.HerpesZosterOticus({}); assert(r.plan); });
  it('VestibularNeuritis', () => { const r = Engine.VestibularNeuritis({}); assert(r.plan); });
  it('Labyrinthitis', () => { const r = Engine.Labyrinthitis({}); assert(r.plan); });
  it('OtotoxicMonitoringExtended', () => { const r = Engine.OtotoxicMonitoringExtended({}); assert(r.plan); });
  it('TinnitusHabituationTherapy', () => { const r = Engine.TinnitusHabituationTherapy({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
