// P3-CC pcc_clinical_dx unit tests
const Engine = require('./pcc_clinical_dx_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_clinical_dx engine tests:');
it('Diff', () => {
  const r = Engine.Differential({ sys: 'cardio' });
  assertEq(r.plan, 'dx-cardio');
});
it('WU', () => {
  const r = Engine.Workup({ finding: 'acute' });
  assertEq(r.plan, 'urgent-workup');
});
it('Img', () => {
  const r = Engine.Imaging({ type: 'MRI' });
  assertEq(r.plan, 'order-mri');
});
it('Lab', () => {
  const r = Engine.Lab({ type: 'BMP' });
  assertEq(r.plan, 'order-bmp');
});
it('Con', () => {
  const r = Engine.Consult({ spec: 'cardio' });
  assertEq(r.plan, 'consult-cardio');
});
it('Spec', () => {
  const r = Engine.Spec({ type: 'biopsy' });
  assertEq(r.plan, 'send-biopsy');
});
it('FU', () => {
  const r = Engine.FollowUp({ result: 'positive' });
  assertEq(r.plan, 'treat-and-fu');
});
it('Disp', () => {
  const r = Engine.Disposition({ ac: 1 });
  assertEq(r.plan, 'admit-ICU');
});
it('Path', () => {
  const r = Engine.Pathway({ type: 'sepsis' });
  assertEq(r.plan, 'sepsis-pathway');
});
it('Alr', () => {
  const r = Engine.Alert({ level: 'critical' });
  assertEq(r.plan, 'critical-alert');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
