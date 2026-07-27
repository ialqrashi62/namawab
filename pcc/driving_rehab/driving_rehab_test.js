// P3-AW: Driving-Rehab unit tests
const Engine = require('./driving_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('driving_rehab engine tests:');
it('Fitness', () => {
  const r = Engine.FitnessToDrive({ vision: '20/40', cognition: 'normal', motor: 'intact', seizures: 'controlled', license: 'current' });
  assertEq(r.status, 'fit-to-drive-without-restriction');
});
it('Vision', () => {
  const r = Engine.VisionDrive({ visualAcuity: '20/40', visualField: 'normal', contrast: 'normal', glare: 'none' });
  assertEq(r.result, 'meets-vision-requirements');
});
it('Cognitive', () => {
  const r = Engine.CognitiveDrive({ mmse: 24, trailMakingB: 90, clockDraw: 'normal' });
  assertEq(r.result, 'mild-cognitive-impairment-on-road-eval');
});
it('Motor', () => {
  const r = Engine.MotorDrive({ rom: 'full', strength: '5/5', sensation: 'intact', coordination: 'normal' });
  assertEq(r.result, 'motor-fit-to-drive');
});
it('Seizure', () => {
  const r = Engine.SeizureDrive({ seizureFreeMonths: 12, lastEvent: 'generalized', medication: 'compliant', aura: true });
  assertEq(r.result, 'eligible-most-states-6-month-seizure-free');
});
it('Adaptive', () => {
  const r = Engine.AdaptiveEquipment({ handControl: 'left-only', lift: 'standard', spinnerKnob: true, leftGasBrake: false });
  assertEq(r.certification, 'multi-modification-DMV-certified');
});
it('On road', () => {
  const r = Engine.OnRoadAssessment({ roadTest: 'passed', errors: 0, instructor: 'CDRS-certified' });
  assertEq(r.result, 'passed-on-road-driving-assessment');
});
it('Rehab plan', () => {
  const r = Engine.DriverRehabPlan({ deficit: 'stroke', hoursTraining: 14, behindWheel: 6, simulator: 4 });
  assertEq(r.plan, 'post-stroke-driving-simulator-and-behind-wheel');
});
it('Senior', () => {
  const r = Engine.SeniorDriving({ age: 78, reaction: 'normal', crashesLast5y: 0, mva: false });
  assertEq(r.risk, 'acceptable-risk-senior');
});
it('DVM', () => {
  const r = Engine.DVMSubmission({ medicalLetter: true, roadEval: 'passed', adaptiveEval: 'complete', visionReport: true });
  assertEq(r.status, 'complete-submission-DMV-ready');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
