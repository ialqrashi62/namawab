// P3-BW psych_ext2 unit tests
const Engine = require('./psych_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('psych_ext2 engine tests:');
it('Dep', () => {
  const r = Engine.Depression({ phq: 12, suicidal: 'no' });
  assertEq(r.plan, 'SSRI-and-CBT');
});
it('Anx', () => {
  const r = Engine.Anxiety({ gad: 12 });
  assertEq(r.plan, 'SSRI-and-eval');
});
it('Bip', () => {
  const r = Engine.Bipolar({ phase: 'manic' });
  assertEq(r.plan, 'lithium-and-hospitalize');
});
it('PTSD', () => {
  const r = Engine.PTSD({ score: 70 });
  assertEq(r.plan, 'trauma-CBT-and-EMDR');
});
it('Sub', () => {
  const r = Engine.Substance({ substance: 'opioid', withdrawal: 'no' });
  assertEq(r.plan, 'buprenorphine-and-eval');
});
it('Schz', () => {
  const r = Engine.Schizophrenia({ positive: 'severe' });
  assertEq(r.plan, 'antipsychotic-and-hospitalize');
});
it('ADHD', () => {
  const r = Engine.ADHD({ age: 10 });
  assertEq(r.plan, 'stimulant-and-eval');
});
it('Aut', () => {
  const r = Engine.Autism({ age: 2 });
  assertEq(r.plan, 'early-intervention-and-eval');
});
it('Eat', () => {
  const r = Engine.Eating({ bmi: 14 });
  assertEq(r.plan, 'inpatient-and-FE');
});
it('Pers', () => {
  const r = Engine.Personality({ type: 'borderline' });
  assertEq(r.plan, 'DBT-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
