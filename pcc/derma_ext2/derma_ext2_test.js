// P3-BV derma_ext2 unit tests
const Engine = require('./derma_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('derma_ext2 engine tests:');
it('Ecz', () => {
  const r = Engine.Eczema({ severity: 'severe' });
  assertEq(r.plan, 'systemic-steroid-and-eval');
});
it('Pso', () => {
  const r = Engine.Psoriasis({ coverage: 40 });
  assertEq(r.plan, 'biologic-and-eval');
});
it('Acn', () => {
  const r = Engine.Acne({ severity: 'severe' });
  assertEq(r.plan, 'isotretinoin-and-eval');
});
it('Mel', () => {
  const r = Engine.Melanoma({ breslow: 5 });
  assertEq(r.plan, 'wide-excision-and-SLN-bx');
});
it('BCC', () => {
  const r = Engine.BCC({ location: 'high-risk' });
  assertEq(r.plan, 'Mohs-and-eval');
});
it('Rash', () => {
  const r = Engine.Rash({ systemic: 'yes' });
  assertEq(r.plan, 'workup-and-eval');
});
it('Urt', () => {
  const r = Engine.Urticaria({ angioedema: 'yes' });
  assertEq(r.plan, 'antihist-and-steroid');
});
it('Auto', () => {
  const r = Engine.Autoimmune({ type: 'lupus' });
  assertEq(r.plan, 'ANA-and-rheum-eval');
});
it('Infx', () => {
  const r = Engine.Infxn({ type: 'abscess' });
  assertEq(r.plan, 'I&D-and-ABx');
});
it('Burns', () => {
  const r = Engine.Burns({ degree: 'III', tbsa: 15 });
  assertEq(r.plan, 'burn-center-and-graft');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
