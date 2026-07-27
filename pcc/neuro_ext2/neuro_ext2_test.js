// P3-BH neuro_ext2 unit tests
const Engine = require('./neuro_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('neuro_ext2 engine tests:');
it('Stroke', () => {
  const r = Engine.StrokeTriage({ nihss: 8, onset: 2 });
  assertEq(r.plan, 'tPA-eligible-and-CT-and-treat');
});
it('Migraine', () => {
  const r = Engine.Migraine({ frequency: 6, severity: 'severe', aura: 'no' });
  assertEq(r.plan, 'preventive-therapy-and-avoid-OCP');
});
it('Seizure', () => {
  const r = Engine.Seizure({ type: 'focal', frequency: 0, aed: 'none' });
  assertEq(r.plan, 'start-focal-AED');
});
it('Parkinsons', () => {
  const r = Engine.Parkinsons({ hy: 1, tremor: 'mild', age: 75 });
  assertEq(r.plan, 'levodopa-low-dose');
});
it('MS', () => {
  const r = Engine.MSRelapse({ newLesions: 4, edss: 2, dmt: 'none' });
  assertEq(r.plan, 'start-high-efficacy-DMT');
});
it('Dementia', () => {
  const r = Engine.DementiaEval({ mmse: 18, moca: 18, onset: 'gradual', duration: 24 });
  assertEq(r.plan, 'Alzheimer-workup-and-MRI');
});
it('GBS', () => {
  const r = Engine.GBS({ progression: 'slow', respiratory: 'intact', ncs: 'axonal' });
  assertEq(r.plan, 'plasma-exchange-and-ICU');
});
it('MG', () => {
  const r = Engine.Myasthenia({ crisis: 'no', achr: 'positive', resp: 'stable' });
  assertEq(r.plan, 'pyridostigmine-and-steroid');
});
it('Neuropathy', () => {
  const r = Engine.Neuropathy({ type: 'diabetic', diabetes: 'yes', aed: 'none' });
  assertEq(r.plan, 'glycemic-control-and-gabapentin');
});
it('Tumor', () => {
  const r = Engine.BrainTumor({ location: 'cortex', size: 4, malignant: 'high-grade' });
  assertEq(r.plan, 'resection-and-radiation-and-chemo');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
