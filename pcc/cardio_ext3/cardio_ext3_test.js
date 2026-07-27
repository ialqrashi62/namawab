// P3-BX cardio_ext3 unit tests
const Engine = require('./cardio_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('cardio_ext3 engine tests:');
it('ACS', () => {
  const r = Engine.ACS({ type: 'STEMI', trop: 5 });
  assertEq(r.plan, 'cath-lab-activation');
});
it('HF', () => {
  const r = Engine.HF({ ef: 25, sx: 'severe' });
  assertEq(r.plan, 'inotrope-and-transplant-eval');
});
it('AF', () => {
  const r = Engine.AF({ rate: 150, onset: 'acute' });
  assertEq(r.plan, 'cardioversion');
});
it('Valve', () => {
  const r = Engine.Valve({ type: 'AS', severity: 'severe' });
  assertEq(r.plan, 'TAVR-or-SAVR');
});
it('HTN', () => {
  const r = Engine.HTN({ bp: 190 });
  assertEq(r.plan, 'urgent-eval-and-treatment');
});
it('Lipid', () => {
  const r = Engine.Lipid({ ldl: 200 });
  assertEq(r.plan, 'high-intensity-statin');
});
it('ACO', () => {
  const r = Engine.Anticoag({ ind: 'AF', cha2ds2: 3 });
  assertEq(r.plan, 'anticoag-and-eval');
});
it('EP', () => {
  const r = Engine.EP({ finding: 'VT' });
  assertEq(r.plan, 'ICD-and-eval');
});
it('Peri', () => {
  const r = Engine.Pericardial({ finding: 'tamponade' });
  assertEq(r.plan, 'pericardiocentesis-and-eval');
});
it('PAD', () => {
  const r = Engine.PAD({ abi: 0.4 });
  assertEq(r.plan, 'revascularize-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
