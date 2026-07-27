// P3-BA: Telerehab unit tests
const Engine = require('./telerehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('telerehab engine tests:');
it('Eligibility', () => {
  const r = Engine.TelerehabEligibility({ techAccess: 'high', broadband: 'yes', cognitive: 'normal', safety: 'home' });
  assertEq(r.eligibility, 'fully-eligible-telerehab');
});
it('Modality', () => {
  const r = Engine.TelerehabModality({ goal: 'PT', condition: 'TKA-post', techAccess: 'high' });
  assertEq(r.modality, 'synchronous-video-PT-and-app-exercise');
});
it('Safety', () => {
  const r = Engine.TelerehabSafety({ location: 'home', supervision: 'none', emergency: 'phone-911', cognition: 'normal' });
  assertEq(r.safety, 'home-safety-with-911-protocol');
});
it('Exercise', () => {
  const r = Engine.TelerehabExercise({ type: 'aerobic', intensity: 'moderate', duration: 30, equipment: 'none' });
  assertEq(r.plan, 'moderate-aerobic-30-min-walking');
});
it('Eval', () => {
  const r = Engine.TelerehabEval({ firstVisit: 'yes', rom: 'normal', balance: 'normal', equipment: 'tablet' });
  assertEq(r.plan, 'video-eval-and-real-time-correction');
});
it('Adherence', () => {
  const r = Engine.TelerehabAdherence({ appLoginsPerWeek: 5, exerciseCompletion: 0.8, videoVisitAttended: 0.9 });
  assertEq(r.adherence, 'high-adherence-engaged');
});
it('Billing', () => {
  const r = Engine.TelerehabBilling({ modality: 'synchronous-video', minutes: 30, payer: 'CMS' });
  assertEq(r.plan, 'CPT-97110-or-97161-synchronous-telerehab-eligible');
});
it('Tech', () => {
  const r = Engine.TelerehabTechSupport({ device: 'tablet', familiarity: 'low', caregiver: 'present' });
  assertEq(r.plan, 'caregiver-tech-tutor-and-15-min-setup');
});
it('Progress', () => {
  const r = Engine.TelerehabProgress({ preScore: 50, postScore: 70, scale: 'DASH', weeksElapsed: 8 });
  assertEq(r.pctChange, 40);
  assertEq(r.result, 'moderate-telerehab-improvement');
});
it('Dosing', () => {
  const r = Engine.TelerehabDosing({ sessionsPerWeek: 2, minutesPerSession: 30, weeks: 8 });
  assertEq(r.totalHours, 8);
  assertEq(r.intensity, 'standard-telerehab');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
