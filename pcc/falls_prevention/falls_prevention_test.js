// P3-BB: Falls-Prevention unit tests
const Engine = require('./falls_prevention_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('falls_prevention engine tests:');
it('Risk', () => {
  const r = Engine.FallsRiskAssessment({ age: 80, historyOfFalls: 'yes', gait: 'abnormal', balance: 'Berg-40', medications: 'polypharmacy-5+' });
  assertEq(r.risk, 'high-risk-multifactorial');
});
it('TUG', () => {
  const r = Engine.TimedUpAndGo({ tugSeconds: 10, assistiveDevice: 'cane', footwear: 'shoes' });
  assertEq(r.result, 'normal-mobility-low-fall-risk');
});
it('Berg', () => {
  const r = Engine.BergBalance({ bergScore: 35 });
  assertEq(r.result, 'moderate-balance-impairment-fall-risk');
});
it('Med', () => {
  const r = Engine.MedicationFallRisk({ meds: ['benzo', 'opioid', 'anticholinergic'], dose: 'standard' });
  assertEq(r.risk, 'high-fall-risk-benzo-or-z-drug');
});
it('Home', () => {
  const r = Engine.HomeSafety({ lighting: 'inadequate', rugs: 'yes', grabBars: 'no', stairs: 'no', pets: 'no' });
  assertEq(r.plan, 'comprehensive-home-safety-and-OT-eval');
});
it('Footwear', () => {
  const r = Engine.Footwear({ type: 'slippers', fit: 'loose', sole: 'slick' });
  assertEq(r.plan, 'replace-with-closed-toe-and-non-slip-sole');
});
it('Vision', () => {
  const r = Engine.VisionAndFalls({ acuity: '20/40', depthPerception: 'normal', cataract: 'none', glasses: 'bifocal' });
  assertEq(r.plan, 'consider-monofocal-or-no-glasses-outdoors');
});
it('Exercise', () => {
  const r = Engine.ExerciseForFalls({ currentActivity: 'sedentary', strength: 'fair', balance: 'fair', weeks: 12 });
  assertEq(r.plan, 'Otago-Exercise-Program-and-balance-training');
});
it('Bone', () => {
  const r = Engine.BoneHealth({ age: 75, sex: 'female', tScore: -2.5, fragilityFx: 'none' });
  assertEq(r.diagnosis, 'osteoporosis-by-DXA');
});
it('Outcome', () => {
  const r = Engine.FallsOutcome({ preFallsRate: 4, postFallsRate: 1, scale: 'falls-per-year', weeksElapsed: 26 });
  assertEq(r.pctChange, 75);
  assertEq(r.result, 'large-fall-reduction');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
