// P3-BS trauma_ext unit tests
const Engine = require('./trauma_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('trauma_ext engine tests:');
it('Triage', () => {
  const r = Engine.Triage({ acuity: 2, airway: 'patent' });
  assertEq(r.plan, 'trauma-bay-and-team');
});
it('Primary', () => {
  const r = Engine.Primary({ gcs: 15, airway: 'patent' });
  assertEq(r.plan, 'primary-survey-and-eval');
});
it('Secondary', () => {
  const r = Engine.Secondary({ stable: 'no' });
  assertEq(r.plan, 'pan-scan-and-OR');
});
it('FAST', () => {
  const r = Engine.FAST({ positive: 'yes' });
  assertEq(r.plan, 'CT-angio-and-OR');
});
it('Head', () => {
  const r = Engine.Head({ gcs: 7, pupils: 'equal' });
  assertEq(r.plan, 'intubate-and-CT-ICP-monitor');
});
it('Chest', () => {
  const r = Engine.Chest({ finding: 'tension-ptx' });
  assertEq(r.plan, 'needle-decomp-and-chest-tube');
});
it('Abd', () => {
  const r = Engine.Abdomen({ fast: 'positive', stable: 'yes' });
  assertEq(r.plan, 'CT-abd-and-eval');
});
it('Pelvis', () => {
  const r = Engine.Pelvis({ stable: 'no' });
  assertEq(r.plan, 'binder-and-IR');
});
it('Spine', () => {
  const r = Engine.Spine({ neuro: 'intact' });
  assertEq(r.plan, 'CT-spine-and-clear');
});
it('MTP', () => {
  const r = Engine.MTP({ active: 'yes' });
  assertEq(r.plan, '1:1:1-and-MTP');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
