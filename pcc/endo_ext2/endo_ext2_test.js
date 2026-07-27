// P3-BX endo_ext2 unit tests
const Engine = require('./endo_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('endo_ext2 engine tests:');
it('Diab', () => {
  const r = Engine.Diabetes({ a1c: 11, type: 'T2' });
  assertEq(r.plan, 'basal-bolus-and-eval');
});
it('Thy', () => {
  const r = Engine.Thyroid({ tsh: 12 });
  assertEq(r.plan, 'levothyroxine-and-eval');
});
it('Adr', () => {
  const r = Engine.Adrenal({ cortisol: 60 });
  assertEq(r.plan, 'Cushing-workup');
});
it('Pit', () => {
  const r = Engine.Pituitary({ finding: 'macro' });
  assertEq(r.plan, 'hormone-panel-and-MRI');
});
it('Ca', () => {
  const r = Engine.Calcium({ ca: 12, pth: 50 });
  assertEq(r.plan, 'PTH-and-workup');
});
it('Bone', () => {
  const r = Engine.Bone({ tscore: -3 });
  assertEq(r.plan, 'bisphosphonate-and-eval');
});
it('AdM', () => {
  const r = Engine.AdrenalMass({ size: 5, functional: 'no' });
  assertEq(r.plan, 'workup-and-typed');
});
it('Ob', () => {
  const r = Engine.Obesity({ bmi: 42 });
  assertEq(r.plan, 'bariatric-eval');
});
it('Lip', () => {
  const r = Engine.Lipid({ ldl: 200 });
  assertEq(r.plan, 'high-intensity-statin');
});
it('RE', () => {
  const r = Engine.ReproEndo({ issue: 'amenorrhea' });
  assertEq(r.plan, 'FSH-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
