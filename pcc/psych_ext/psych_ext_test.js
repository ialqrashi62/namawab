// P3-BK psych_ext unit tests
const Engine = require('./psych_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('psych_ext engine tests:');
it('Dep', () => {
  const r = Engine.Depression({ phq9: 18, prior: 'no', suicidal: 'no' });
  assertEq(r.plan, 'moderate-severe-and-SSRI-and-therapy');
});
it('Anx', () => {
  const r = Engine.Anxiety({ gad7: 18, panic: 'no' });
  assertEq(r.plan, 'severe-and-SSRI-and-CBT');
});
it('Bipolar', () => {
  const r = Engine.Bipolar({ phase: 'manic', lithium: 'no' });
  assertEq(r.plan, 'start-mood-stabilizer-and-antipsychotic');
});
it('PTSD', () => {
  const r = Engine.PTSD({ duration: 6, caps: 65 });
  assertEq(r.plan, 'severe-and-trauma-focused-CBT-and-SSRI');
});
it('OCD', () => {
  const r = Engine.OCD({ ybocs: 35, insight: 'good' });
  assertEq(r.plan, 'severe-and-SSRI-high-dose-and-ERP');
});
it('Eat', () => {
  const r = Engine.Eating({ bmi: 14, restriction: 'yes', binge: 'no' });
  assertEq(r.plan, 'inpatient-medical-stabilization');
});
it('Sub', () => {
  const r = Engine.Substance({ substance: 'opioid', withdrawal: 'no', motivation: 'low' });
  assertEq(r.plan, 'buprenorphine-or-methadone');
});
it('SI', () => {
  const r = Engine.Suicide({ plan: 'yes', means: 'yes', intent: 'yes' });
  assertEq(r.plan, '1:1-observation-and-inpatient');
});
it('ADHD', () => {
  const r = Engine.ADHD({ asrs: 7, age: 30, cvRisk: 'low' });
  assertEq(r.plan, 'stimulant-and-CBT');
});
it('Psy', () => {
  const r = Engine.Psychosis({ duration: 12, insight: 'poor', functioning: 'preserved' });
  assertEq(r.plan, 'LAI-antipsychotic-and-CBT');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
