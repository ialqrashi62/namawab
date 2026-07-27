// P3-BS gen_med_ext unit tests
const Engine = require('./gen_med_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('gen_med_ext engine tests:');
it('Triage', () => {
  const r = Engine.Triage({ acuity: 2 });
  assertEq(r.plan, 'acute-bay-and-eval');
});
it('Sepsis', () => {
  const r = Engine.Sepsis({ qsofa: 2, lactate: 1.5 });
  assertEq(r.plan, 'bundle-1hr-and-ABx');
});
it('CP', () => {
  const r = Engine.ChestPain({ acs: 'no', trop: 0.5 });
  assertEq(r.plan, 'serial-trop-and-eval');
});
it('SOB', () => {
  const r = Engine.ShortBreath({ spO2: 85, cause: 'unknown' });
  assertEq(r.plan, 'O2-and-eval');
});
it('AP', () => {
  const r = Engine.AbdPain({ surgical: 'no' });
  assertEq(r.plan, 'CT-and-eval');
});
it('Fever', () => {
  const r = Engine.Fever({ source: 'pneumonia', sepsis: 'no' });
  assertEq(r.plan, 'CXR-and-ABx');
});
it('Syncope', () => {
  const r = Engine.Syncope({ cause: 'cardiac' });
  assertEq(r.plan, 'echo-and-telemetry');
});
it('Back', () => {
  const r = Engine.BackPain({ redFlag: 'yes' });
  assertEq(r.plan, 'MRI-and-spine-consult');
});
it('HA', () => {
  const r = Engine.Headache({ redFlag: 'no' });
  assertEq(r.plan, 'NSAID-and-FU');
});
it('Dizzy', () => {
  const r = Engine.Dizzy({ cause: 'BPPV' });
  assertEq(r.plan, 'Epley-and-FU');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
