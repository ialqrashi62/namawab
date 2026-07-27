// P3-BI lab_ext unit tests
const Engine = require('./lab_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('lab_ext engine tests:');
it('Cx', () => {
  const r = Engine.BloodCulture({ sets: 1, timing: 'simultaneous', source: 'peripheral' });
  assertEq(r.plan, 'obtain-2-sets-and-1-from-each-side');
});
it('ABG', () => {
  const r = Engine.ABG({ ph: 7.1, pco2: 60, hco3: 24 });
  assertEq(r.plan, 'respiratory-acidosis-and-vent');
});
it('Trop', () => {
  const r = Engine.Troponin({ value: 6, delta: 2, baseline: 0.02 });
  assertEq(r.plan, 'acute-MI-and-cath-eval');
});
it('BNP', () => {
  const r = Engine.BNP({ value: 700, age: 65, renal: 'normal' });
  assertEq(r.plan, 'high-BNP-and-HF-likely');
});
it('Coags', () => {
  const r = Engine.Coags({ inr: 6, ptT: 12, aptt: 30, plt: 200 });
  assertEq(r.plan, 'hold-warfarin-and-vitamin-K');
});
it('LFT', () => {
  const r = Engine.LFT({ ast: 1500, alt: 1500, bili: 1, alp: 80 });
  assertEq(r.plan, 'acute-hepatitis-and-eval');
});
it('Renal', () => {
  const r = Engine.Renal({ cr: 5, gfr: 12, k: 4, trend: 'rising' });
  assertEq(r.plan, 'dialysis-eval-and-urgent');
});
it('CBC', () => {
  const r = Engine.CBC({ hgb: 6, wbc: 7, plt: 200, neut: 5 });
  assertEq(r.plan, 'transfuse-pRBC-and-eval');
});
it('A1c', () => {
  const r = Engine.HbA1c({ a1c: 11, duration: 5 });
  assertEq(r.plan, 'poor-control-and-intensify');
});
it('Micro', () => {
  const r = Engine.MicroSensitivity({ organism: 'MSSA', sensitivity: 'sensitive', site: 'blood' });
  assertEq(r.plan, 'nafcillin-or-oxacillin');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
