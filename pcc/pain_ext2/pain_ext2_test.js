// P3-BK pain_ext2 unit tests
const Engine = require('./pain_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pain_ext2 engine tests:');
it('Opi', () => {
  const r = Engine.OpioidRotation({ current: 'morphine', pain: 'severe' });
  assertEq(r.plan, 'rotate-to-hydromorphone');
});
it('Block', () => {
  const r = Engine.NerveBlock({ site: 'knee', duration: 'long' });
  assertEq(r.plan, 'femoral-or-adductor-canal-block');
});
it('Cancer', () => {
  const r = Engine.CancerPain({ type: 'neuropathic', severity: 'severe' });
  assertEq(r.plan, 'gabapentin-and-opioid');
});
it('SCS', () => {
  const r = Engine.SpinalCordStim({ trial: 'success', indication: 'failed-back-syndrome' });
  assertEq(r.plan, 'implant-SCS');
});
it('IT', () => {
  const r = Engine.IntrathecalPump({ drug: 'morphine', dose: 25 });
  assertEq(r.plan, 'reduce-dose-and-consider-ziconotide');
});
it('Mig', () => {
  const r = Engine.MigraineAcute({ severity: 'severe', aura: 'no', pregnancy: 'no' });
  assertEq(r.plan, 'sumatriptan-and-antiemetic');
});
it('CRPS', () => {
  const r = Engine.CRPS({ stage: 'acute', limb: 'upper' });
  assertEq(r.plan, 'PT-and-gabapentin-and-stellate-block');
});
it('Pedi', () => {
  const r = Engine.PediatricPain({ age: 8, severity: 'severe' });
  assertEq(r.plan, 'codeine-or-morphine-with-monitoring');
});
it('Tap', () => {
  const r = Engine.Tapering({ drug: 'benzodiazepine', duration: 60 });
  assertEq(r.plan, 'taper-5-10%-per-week-and-switch-LA');
});
it('Multi', () => {
  const r = Engine.Multimodal({ surgery: 'joint-replacement', opioid: 'yes' });
  assertEq(r.plan, 'multimodal-and-PCA-and-nerve-block');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
