// P3-BZ neph_ext3 unit tests
const Engine = require('./neph_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('neph_ext3 engine tests:');
it('CKD', () => {
  const r = Engine.CKD({ gfr: 12, protein: 'high' });
  assertEq(r.plan, 'dialysis-eval-and-prep');
});
it('AKI', () => {
  const r = Engine.AKI({ stage: 'III', cause: 'obstructive' });
  assertEq(r.plan, 'urgent-decompression');
});
it('GN', () => {
  const r = Engine.GN({ type: 'RPGN' });
  assertEq(r.plan, 'urgent-biopsy-and-pulse');
});
it('Dial', () => {
  const r = Engine.Dialysis({ gfr: 5, symptom: 'no' });
  assertEq(r.plan, 'dialysis-initiate');
});
it('Rhabdo', () => {
  const r = Engine.Rhabdo({ ck: 6000 });
  assertEq(r.plan, 'aggressive-fluid-and-RRT-eval');
});
it('Lyte', () => {
  const r = Engine.Electrolyte({ k: 7, na: 140 });
  assertEq(r.plan, 'emergent-insulin-and-calcium');
});
it('HTN', () => {
  const r = Engine.HTN({ bp: 220, organ: 'MI' });
  assertEq(r.plan, 'IV-nicardipine-and-ICU');
});
it('Stone', () => {
  const r = Engine.Stone({ size: 12 });
  assertEq(r.plan, 'ureteroscopy-and-eval');
});
it('Txp', () => {
  const r = Engine.Txp({ months: 6, gfr: 25 });
  assertEq(r.plan, 'biopsy-and-eval');
});
it('PKD', () => {
  const r = Engine.PKD({ cyst: 'complex' });
  assertEq(r.plan, 'imaging-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
