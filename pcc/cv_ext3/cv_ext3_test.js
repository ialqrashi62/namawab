// P3-BY cv_ext3 unit tests
const Engine = require('./cv_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('cv_ext3 engine tests:');
it('Str', () => {
  const r = Engine.Stroke({ type: 'ischemic', nihss: 8 });
  assertEq(r.plan, 'tPA-and-thrombectomy-eval');
});
it('TIA', () => {
  const r = Engine.TIA({ abc2: 7 });
  assertEq(r.plan, 'urgent-eval-and-MRI');
});
it('SAH', () => {
  const r = Engine.SAH({ hunt: 5 });
  assertEq(r.plan, 'coil-and-ICU');
});
it('An', () => {
  const r = Engine.Aneurysm({ size: 8 });
  assertEq(r.plan, 'coil-or-clip');
});
it('AVM', () => {
  const r = Engine.AVM({ spetzler: 5 });
  assertEq(r.plan, 'multidisciplinary-eval');
});
it('Car', () => {
  const r = Engine.Carotid({ stenosis: 80, sx: 'yes' });
  assertEq(r.plan, 'CEA-and-eval');
});
it('ICP', () => {
  const r = Engine.ICP({ icp: 35 });
  assertEq(r.plan, 'decompressive-craniectomy');
});
it('Sz', () => {
  const r = Engine.Seizure({ type: 'status' });
  assertEq(r.plan, 'lorazepam-and-ICU');
});
it('MS', () => {
  const r = Engine.MS({ relapse: 'yes' });
  assertEq(r.plan, 'steroids-and-DMT');
});
it('Park', () => {
  const r = Engine.Park({ stage: 'advanced' });
  assertEq(r.plan, 'DBS-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
