// P3-BO endocrine_ext unit tests
const Engine = require('./endocrine_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('endocrine_ext engine tests:');
it('T2DM', () => {
  const r = Engine.DiabetesT2({ a1c: 11, egfr: 90, hf: 'no' });
  assertEq(r.plan, 'dual-therapy-and-MDI');
});
it('Hypo', () => {
  const r = Engine.Hypothyroid({ tsh: 12, symptom: 'mild' });
  assertEq(r.plan, 'levothyroxine-and-recheck');
});
it('Hyper', () => {
  const r = Engine.Hyperthyroid({ cause: 'Graves', age: 35 });
  assertEq(r.plan, 'methimazole-and-RAIU');
});
it('AI', () => {
  const r = Engine.AdrenalInsufficient({ cortisol: 2, acth: 'unknown', crisis: 'no' });
  assertEq(r.plan, 'urgent-hydrocortisone-and-eval');
});
it('Cush', () => {
  const r = Engine.Cushings({ test: 'positive', acth: 'high' });
  assertEq(r.plan, 'Cushing-disease-and-MRI-pituitary');
});
it('Pheo', () => {
  const r = Engine.Pheo({ screen: 'positive', symptom: 'mild' });
  assertEq(r.plan, 'alpha-block-and-imaging');
});
it('Ca', () => {
  const r = Engine.Calcium({ ca: 12, pth: 80, vitD: 30 });
  assertEq(r.plan, 'primary-hyperparathyroid-and-eval');
});
it('Pit', () => {
  const r = Engine.Pituitary({ mass: 'micro', hormone: 'prolactinoma' });
  assertEq(r.plan, 'cabergoline');
});
it('Inc', () => {
  const r = Engine.AdrenalIncidental({ size: 5, hounsfield: 5 });
  assertEq(r.plan, 'adrenalectomy-eval');
});
it('GA', () => {
  const r = Engine.GenderAffirming({ age: 25, stage: 'hormone' });
  assertEq(r.plan, 'cross-sex-hormones-and-monitor');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
