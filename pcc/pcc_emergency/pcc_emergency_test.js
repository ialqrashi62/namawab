// P3-CD pcc_emergency unit tests
const Engine = require('./pcc_emergency_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_emergency engine tests:');
it('Tri', () => {
  const r = Engine.Triage({ level: 1 });
  assertEq(r.plan, 'resus-bay');
});
it('Res', () => {
  const r = Engine.Resus({ algo: 'ACLS' });
  assertEq(r.plan, 'ACLS-protocol');
});
it('Trauma', () => {
  const r = Engine.Trauma({ mech: 'penetrating' });
  assertEq(r.plan, 'trauma-bay-OR');
});
it('Sep', () => {
  const r = Engine.Sepsis({ sirs: 3, qsofa: 2 });
  assertEq(r.plan, 'sepsis-bundle');
});
it('Stroke', () => {
  const r = Engine.Stroke({ nihss: 8, onset: 3 });
  assertEq(r.plan, 'tPA-and-eval');
});
it('MI', () => {
  const r = Engine.MI({ type: 'STEMI' });
  assertEq(r.plan, 'cath-lab-activation');
});
it('Ana', () => {
  const r = Engine.Anaphylaxis({ severity: 'severe' });
  assertEq(r.plan, 'epinephrine-and-ICU');
});
it('Tox', () => {
  const r = Engine.Toxicology({ type: 'opioid' });
  assertEq(r.plan, 'narcan-and-eval');
});
it('Burn', () => {
  const r = Engine.Burn({ tbsa: 35 });
  assertEq(r.plan, 'burn-center-and-fluid');
});
it('Disp', () => {
  const r = Engine.Disposition({ ac: 1 });
  assertEq(r.plan, 'admit-ICU');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
