// P3-BW repro_ext unit tests
const Engine = require('./repro_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('repro_ext engine tests:');
it('Infert', () => {
  const r = Engine.Infertility({ cause: 'tubal', year: 1 });
  assertEq(r.plan, 'IVF-and-eval');
});
it('ART', () => {
  const r = Engine.ART({ type: 'IUI' });
  assertEq(r.plan, 'IUI-and-eval');
});
it('PCOS', () => {
  const r = Engine.PCOS({ desire: 'pregnancy' });
  assertEq(r.plan, 'clomiphene-and-eval');
});
it('Endo', () => {
  const r = Engine.Endometriosis({ stage: 'III' });
  assertEq(r.plan, 'surgery-and-eval');
});
it('Fib', () => {
  const r = Engine.Fibroids({ size: 6, sx: 'yes' });
  assertEq(r.plan, 'myomectomy-and-eval');
});
it('Contra', () => {
  const r = Engine.Contraception({ type: 'IUD' });
  assertEq(r.plan, 'IUD-and-eval');
});
it('Menop', () => {
  const r = Engine.Menopause({ sx: 'hot-flash' });
  assertEq(r.plan, 'HRT-and-eval');
});
it('STI', () => {
  const r = Engine.STI({ type: 'syphilis' });
  assertEq(r.plan, 'penicillin-and-typed');
});
it('Sex', () => {
  const r = Engine.Sexual({ issue: 'dyspareunia' });
  assertEq(r.plan, 'eval-and-physical-therapy');
});
it('Pre', () => {
  const r = Engine.Preconception({ issue: 'high-risk' });
  assertEq(r.plan, 'MFM-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
