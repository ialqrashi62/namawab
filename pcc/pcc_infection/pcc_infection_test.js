// P3-CD pcc_infection unit tests
const Engine = require('./pcc_infection_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_infection engine tests:');
it('Src', () => {
  const r = Engine.Source({ src: 'pulmonary' });
  assertEq(r.plan, 'pneumonia-bundle');
});
it('Sev', () => {
  const r = Engine.Severity({ qsofa: 3 });
  assertEq(r.plan, 'septic-1hr-bundle');
});
it('Cul', () => {
  const r = Engine.Cultures({ type: 'blood' });
  assertEq(r.plan, 'blood-culture');
});
it('Emp', () => {
  const r = Engine.Empiric({ coverage: 'broad' });
  assertEq(r.plan, 'broad-spectrum-ABx');
});
it('Des', () => {
  const r = Engine.Deescalation({ result: 'positive' });
  assertEq(r.plan, 'narrow-to-specific');
});
it('Dur', () => {
  const r = Engine.Duration({ days: 14 });
  assertEq(r.plan, 'long-course');
});
it('Pro', () => {
  const r = Engine.Prophylaxis({ type: 'surgical' });
  assertEq(r.plan, 'preop-ABx');
});
it('Res', () => {
  const r = Engine.Resistance({ risk: 'high' });
  assertEq(r.plan, 'broad-spectrum');
});
it('Out', () => {
  const r = Engine.Outbreak({ cluster: 'yes' });
  assertEq(r.plan, 'outbreak-investigation');
});
it('Iso', () => {
  const r = Engine.Isolation({ type: 'airborne' });
  assertEq(r.plan, 'airborne-isolation');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
