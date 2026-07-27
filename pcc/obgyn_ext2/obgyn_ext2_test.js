// P3-BT obgyn_ext2 unit tests
const Engine = require('./obgyn_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('obgyn_ext2 engine tests:');
it('Preg', () => {
  const r = Engine.Pregnancy({ gest: 20 });
  assertEq(r.plan, 'second-trimester-and-anatomy');
});
it('PreE', () => {
  const r = Engine.PreEclampsia({ severity: 'severe', bp: 170 });
  assertEq(r.plan, 'magnesium-and-delivery');
});
it('GDM', () => {
  const r = Engine.GDM({ gtt: 210 });
  assertEq(r.plan, 'insulin-and-dietician');
});
it('PPROM', () => {
  const r = Engine.PPROM({ gest: 30, infection: 'no' });
  assertEq(r.plan, 'latency-ABx-and-steroids');
});
it('PPH', () => {
  const r = Engine.PPH({ amount: 600, cause: 'atony' });
  assertEq(r.plan, 'uterine-massage-and-uterotonics');
});
it('Ectop', () => {
  const r = Engine.Ectopic({ stable: 'yes', size: 2 });
  assertEq(r.plan, 'methotrexate-and-eval');
});
it('Induct', () => {
  const r = Engine.Induction({ bishop: 7, indication: 'elective' });
  assertEq(r.plan, 'oxytocin-and-AROM');
});
it('GynCa', () => {
  const r = Engine.GynCancer({ type: 'cervical', stage: 'I' });
  assertEq(r.plan, 'surgery-or-rad');
});
it('Infert', () => {
  const r = Engine.Infertility({ cause: 'PCOS', year: 1 });
  assertEq(r.plan, 'clomiphene-and-eval');
});
it('Menop', () => {
  const r = Engine.Menopause({ sx: 'hot-flash' });
  assertEq(r.plan, 'HRT-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
