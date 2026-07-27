// P3-BC: Med-Psych unit tests
const Engine = require('./med_psych_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('med_psych engine tests:');
it('PHQ-9', () => {
  const r = Engine.DepressionScreen({ phq9: 12, duration: 6, risk: 'moderate' });
  assertEq(r.classification, 'moderate-depression');
});
it('GAD-7', () => {
  const r = Engine.AnxietyScreen({ gad7: 12, duration: 6, panic: 'no' });
  assertEq(r.classification, 'moderate-anxiety');
});
it('Suicide', () => {
  const r = Engine.SuicideScreen({ cssrs: 'high', plan: 'yes', access: 'means', priorAttempt: 'no' });
  assertEq(r.risk, 'imminent-high-risk-and-1-to-1-and-911');
});
it('Delirium', () => {
  const r = Engine.DeliriumScreen({ cam: 'positive', onset: 'acute', awareness: 'fluctuating', age: 75 });
  assertEq(r.classification, 'delirium-by-CAM-and-eval');
});
it('Substance', () => {
  const r = Engine.SubstanceUse({ audit: 22, dast: 0, substance: 'alcohol' });
  assertEq(r.classification, 'alcohol-dependence');
});
it('Med', () => {
  const r = Engine.PsychMed({ med: 'SSRI', indication: 'depression', age: 20, renalHepatic: 'normal' });
  assertEq(r.plan, 'SSRI-with-black-box-and-monitor-suicide');
});
it('Consult', () => {
  const r = Engine.MedPsychConsult({ reason: 'capacity', capacity: 'impaired', decision: 'complex', adherence: 'partial' });
  assertEq(r.plan, 'capacity-eval-and-surrogate');
});
it('SMI', () => {
  const r = Engine.SeriousMentalIllness({ dx: 'schizophrenia', medsCompliant: 'no', housing: 'unstable', social: 'isolated' });
  assertEq(r.plan, 'ACT-team-and-CMOT');
});
it('Pedi', () => {
  const r = Engine.MedPsychPed({ age: 8, dx: 'ADHD', school: 'struggling', parent: 'engaged' });
  assertEq(r.plan, 'stimulant-and-parent-training-and-school-504');
});
it('Outcome', () => {
  const r = Engine.PsychOutcome({ prePhq9: 18, postPhq9: 8, preFunction: 30, postFunction: 50, weeksElapsed: 8 });
  assertEq(r.phq9Pct, 56);
  assertEq(r.result, 'large-depression-recovery-and-functional-gain');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
