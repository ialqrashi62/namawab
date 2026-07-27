// P3-BP uro_ext unit tests
const Engine = require('./uro_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('uro_ext engine tests:');
it('BPH', () => {
  const r = Engine.BPH({ ipss: 25, psa: 2, prostate: 50 });
  assertEq(r.plan, '5ARI-and-alpha-blocker-and-urology');
});
it('PCa', () => {
  const r = Engine.ProstateCancer({ psa: 12, gleason: 9, stage: 'localized' });
  assertEq(r.plan, 'radical-prostatectomy-or-RT');
});
it('Stone', () => {
  const r = Engine.KidneyStone({ size: 12, location: 'ureter', symptom: 'mild' });
  assertEq(r.plan, 'PCNL-or-ureteroscopy');
});
it('UTI', () => {
  const r = Engine.UTI({ type: 'pyelonephritis', organism: 'Ecoli', resistance: 'no' });
  assertEq(r.plan, 'oral-cipro-or-cefpodoxime');
});
it('Hem', () => {
  const r = Engine.Hematuria({ type: 'gross', risk: 'high', age: 60 });
  assertEq(r.plan, 'urgent-Cysto-and-CT-urogram');
});
it('ED', () => {
  const r = Engine.ED({ cause: 'cardiovascular', severity: 'mild', cv: 'high' });
  assertEq(r.plan, 'cardiology-eval-first');
});
it('Incont', () => {
  const r = Engine.Incontinence({ type: 'urge', severity: 'severe' });
  assertEq(r.plan, 'anticholinergic-and-PFT');
});
it('Testis', () => {
  const r = Engine.Testicular({ finding: 'mass', age: 30 });
  assertEq(r.plan, 'urgent-urology-and-ultrasound');
});
it('Penile', () => {
  const r = Engine.Penile({ condition: 'Peyronie' });
  assertEq(r.plan, 'observation-and-vitamin-E');
});
it('BladCa', () => {
  const r = Engine.BladderCancer({ stage: 'CIS', grade: 'high' });
  assertEq(r.plan, 'BCG-and-FU');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
