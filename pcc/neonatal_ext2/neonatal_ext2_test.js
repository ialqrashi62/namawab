// P3-BI neonatal_ext2 unit tests
const Engine = require('./neonatal_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('neonatal_ext2 engine tests:');
it('Hypothermia', () => {
  const r = Engine.TherapeuticHypothermia({ ga: 38, ageHours: 4, encephalopathy: 'severe' });
  assertEq(r.plan, 'cooling-72h-and-monitor');
});
it('NEO', () => {
  const r = Engine.NEOScore({ sbp: 35, fio2: 0.7, ph: 7.0, lactate: 6 });
  assertEq(r.plan, 'severe-NEOS-and-iNO-and-HFOV');
});
it('Sepsis', () => {
  const r = Engine.SepsisScreen({ wbc: 25, crp: 12, itRatio: 0.25, temp: 38.5 });
  assertEq(r.plan, 'empiric-abx-and-blood-culture');
});
it('Vent', () => {
  const r = Engine.Ventilation({ mode: 'CMV', fio2: 0.7, peep: 5, map: 12 });
  assertEq(r.plan, 'HFOV-and-iNO-eval');
});
it('Feed', () => {
  const r = Engine.Feeding({ dayOfLife: 2, weight: 2000, trophic: 'no' });
  assertEq(r.plan, 'trophic-feeds-10ml/kg');
});
it('BPD', () => {
  const r = Engine.BPD({ ga: 28, pma: 36, oxygenDays: 30 });
  assertEq(r.plan, 'severe-BPD-and-steroid-eval');
});
it('ROP', () => {
  const r = Engine.ROP({ ga: 28, pma: 35, stage: 3 });
  assertEq(r.plan, 'treatment-and-bevacizumab-or-laser');
});
it('IVH', () => {
  const r = Engine.IVH({ ga: 28, cranialUS: 'grade-3' });
  assertEq(r.plan, 'urgent-neuro-and-NE-img');
});
it('NEC', () => {
  const r = Engine.NEC({ stage: 'confirmed', bellStage: 'IIA' });
  assertEq(r.plan, 'NPO-and-7d-abx-and-TPN');
});
it('D/C', () => {
  const r = Engine.DischargeReadiness({ weight: 2100, tempReg: 'yes', feeding: 'full', apnea: 'absent' });
  assertEq(r.plan, 'discharge-ready');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
