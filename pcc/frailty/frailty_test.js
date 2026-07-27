// P3-BB: Frailty unit tests
const Engine = require('./frailty_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('frailty engine tests:');
it('Index', () => {
  const r = Engine.FrailtyIndex({ unintentionalWeightLoss: 'yes', exhaustion: 'yes', weakness: 'yes', slowness: 'yes', lowActivity: 'no' });
  assertEq(r.classification, 'frail-3-or-more-of-5');
});
it('CFS', () => {
  const r = Engine.ClinicalFrailtyScale({ cfsScore: 6, comorbidities: 4 });
  assertEq(r.classification, 'moderately-frail');
});
it('Fried', () => {
  const r = Engine.FriedFrailty({ weightLoss: 5, exhaustion: 'yes', activity: 'sedentary', walkTime: 8, gripStrength: 15 });
  assertEq(r.count, 5);
  assertEq(r.result, 'frail-by-Fried');
});
it('Sarcopenia', () => {
  const r = Engine.Sarcopenia({ muscleMass: 'low', gripStrength: 14, gaitSpeed: 0.7, age: 75 });
  assertEq(r.diagnosis, 'severe-sarcopenia');
});
it('Nutrition', () => {
  const r = Engine.NutritionInFrail({ albumin: 2.3, bmi: 17, intake: 'poor', weightLossPct: 12 });
  assertEq(r.plan, 'severe-malnutrition-ONS-and-dietitian');
});
it('Trajectory', () => {
  const r = Engine.FrailtyTrajectory({ baselineCfs: 3, currentCfs: 7, monthsElapsed: 12 });
  assertEq(r.result, 'rapid-frailty-progression');
});
it('Surgery', () => {
  const r = Engine.FrailtyAndSurgery({ cfsScore: 8, surgery: 'major-elective', age: 75 });
  assertEq(r.plan, 'avoid-surgery-and-palliative-or-non-operative');
});
it('Polypharm', () => {
  const r = Engine.PolypharmacyInFrail({ medCount: 12, highRiskMeds: ['benzo'], cfs: 5 });
  assertEq(r.plan, 'severe-polypharmacy-deprescribing');
});
it('Cog-frail', () => {
  const r = Engine.CognitiveFrailty({ mmse: 18, cfs: 6, depression: 'moderate', socialIsolation: 'moderate' });
  assertEq(r.plan, 'dementia-and-frailty-comprehensive-care');
});
it('Outcome', () => {
  const r = Engine.FrailtyOutcome({ preCfs: 6, postCfs: 4, scale: 'CFS', weeksElapsed: 26 });
  assertEq(r.delta, 2);
  assertEq(r.result, 'large-frailty-improvement');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
