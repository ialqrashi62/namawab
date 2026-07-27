// P3-AV: Cardiac-Rehab unit tests
const Engine = require('./cardiac_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('cardiac_rehab engine tests:');
it('CR Phase', () => {
  const r = Engine.CRPhase({ phase: 2, daysPostMI: 30 });
  assertEq(r.phase1, 'phase-2-early-outpatient-supervised-exercise');
});
it('Exercise Rx', () => {
  const r = Engine.ExercisePrescriptionMET({ age: 60, maxHR: 160, restHR: 70, fit: 'moderate' });
  assertEq(r.targetHR, 133);
});
it('CPET', () => {
  const r = Engine.CardiopulmonaryExerciseTest({ vo2max: 10, predictedVo2: 30 });
  assertEq(r.classification, 'severely-decreased');
});
it('Risk strat', () => {
  const r = Engine.RiskStratificationCR({ ejectionFraction: 25 });
  assertEq(r.risk, 'high-risk-CR-supervised');
});
it('Enrollment', () => {
  const r = Engine.CREnrollment({ indication: 'post-MI' });
  assertEq(r.eligibility, 'CR-class-I-indicated');
});
it('Exercise response', () => {
  const r = Engine.ExerciseResponse({ heartRateDuring: 200, heartRateRest: 70, rpe: 18 });
  assertEq(r.response, 'high-intensity-stop-or-reduce');
});
it('HF', () => {
  const r = Engine.HeartFailureRehab({ ejectionFraction: 30, nyha: 2, fitzgerald: 'robust' });
  assertEq(r.plan, 'CR-supervised-EF-recovery-track');
});
it('Post-CABG', () => {
  const r = Engine.PostCABGRehab({ weeksPost: 2 });
  assertEq(r.status, 'early-recovery-sternal-precautions-6-to-8-weeks');
});
it('PAD', () => {
  const r = Engine.PADExercise({ abi: 0.6, supervised: true });
  assertEq(r.plan, 'supervised-PAD-CR-walk-rest-walk-protocol');
});
it('Pediatric', () => {
  const r = Engine.PediatricCardiacRehab({ age: 4, surgery: 'single-ventricle' });
  assertEq(r.plan, 'pediatric-CR-with-Fontan-protocol');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
