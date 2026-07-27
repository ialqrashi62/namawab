// P3-BQ neph_ext2 unit tests
const Engine = require('./neph_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('neph_ext2 engine tests:');
it('CKD', () => {
  const r = Engine.CKD({ gfr: 12, albuminuria: 'A3', cause: 'DM' });
  assertEq(r.plan, 'dialysis-eval-and-prep');
});
it('AKI', () => {
  const r = Engine.AKI({ stage: 'III', cause: 'obstructive' });
  assertEq(r.plan, 'urgent-decompression');
});
it('GN', () => {
  const r = Engine.GN({ type: 'minimal-change', nephrotic: 'yes', cr: 1 });
  assertEq(r.plan, 'steroid-trial');
});
it('HTN', () => {
  const r = Engine.HTNEmerg({ bp: 220, organ: 'MI' });
  assertEq(r.plan, 'IV-nicardipine-and-ICU');
});
it('Dialysis', () => {
  const r = Engine.DialysisInit({ gfr: 5, symptom: 'yes' });
  assertEq(r.plan, 'dialysis-initiate');
});
it('Lytes', () => {
  const r = Engine.Electrolytes({ k: 7, na: 140, ca: 9 });
  assertEq(r.plan, 'emergent-insulin-and-calcium');
});
it('Rhabdo', () => {
  const r = Engine.Rhabdo({ ck: 3000, urine: 'tea-colored', k: 5 });
  assertEq(r.plan, 'aggressive-fluid-and-monitor');
});
it('Check', () => {
  const r = Engine.NephroCheck({ gfr: 25, trend: 'declining' });
  assertEq(r.plan, 'nephrology-urgently');
});
it('Pedi', () => {
  const r = Engine.PediatricNeph({ condition: 'Nephrotic', age: 6 });
  assertEq(r.plan, 'steroid-trial-and-peds-neph');
});
it('Tpx', () => {
  const r = Engine.TransplantKidney({ months: 24, gfr: 60, rejection: 'no' });
  assertEq(r.plan, 'maintenance-and-every-3mo');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
