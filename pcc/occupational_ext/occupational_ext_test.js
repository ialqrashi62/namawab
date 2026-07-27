// P3-BL occupational_ext unit tests
const Engine = require('./occupational_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('occupational_ext engine tests:');
it('WorkInj', () => {
  const r = Engine.WorkInjury({ type: 'back-injury', severity: 'mild', job: 'manual' });
  assertEq(r.plan, 'PT-and-work-conditioning');
});
it('FCE', () => {
  const r = Engine.FunctionalCapacity({ demand: 'heavy', current: 'light', endurance: 3 });
  assertEq(r.plan, 'work-conditioning-8w');
});
it('RTW', () => {
  const r = Engine.ReturnToWork({ weeks: 4, restrictions: 'temporary', modified: 'yes' });
  assertEq(r.plan, 'modified-duty-and-PT');
});
it('Ergo', () => {
  const r = Engine.Ergonomic({ task: 'lifting', complaint: 'back' });
  assertEq(r.plan, 'lift-training-and-eval-ergo');
});
it('CTD', () => {
  const r = Engine.CumulativeTrauma({ site: 'wrist', chronic: 'yes' });
  assertEq(r.plan, 'CTS-eval-and-nerve-test');
});
it('Hear', () => {
  const r = Engine.HearingLoss({ exposure: 105, threshold: 25 });
  assertEq(r.plan, 'annual-audiogram-and-PPE');
});
it('Vis', () => {
  const r = Engine.VisionScreen({ acuity: 25, job: 'driving' });
  assertEq(r.plan, 'corrected-lenses-and-recheck');
});
it('Resp', () => {
  const r = Engine.RespiratorFit({ fit: 'pass', medical: 'cleared' });
  assertEq(r.plan, 'fit-test-valid-1y');
});
it('Drug', () => {
  const r = Engine.DrugTest({ result: 'positive', chain: 'intact' });
  assertEq(r.plan, 'MRO-review-and-confirm');
});
it('Dis', () => {
  const r = Engine.DisabilityRating({ injury: 'amputation', impairment: 60 });
  assertEq(r.plan, 'permanent-total-disability');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
