// P3-BY allergy_ext2 unit tests
const Engine = require('./allergy_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('allergy_ext2 engine tests:');
it('Rhi', () => {
  const r = Engine.Rhinitis({ season: 'yes' });
  assertEq(r.plan, 'antihist-and-IT-eval');
});
it('Ast', () => {
  const r = Engine.Asthma({ control: 'poor' });
  assertEq(r.plan, 'step-up-and-eval');
});
it('Food', () => {
  const r = Engine.Food({ anaphyl: 'yes' });
  assertEq(r.plan, 'epinephrine-and-AIT');
});
it('Drug', () => {
  const r = Engine.Drug({ severe: 'yes' });
  assertEq(r.plan, 'desensitization-and-eval');
});
it('Urt', () => {
  const r = Engine.Urticaria({ chronic: 'yes' });
  assertEq(r.plan, 'omalizumab-and-eval');
});
it('An', () => {
  const r = Engine.Anaphylaxis({ cause: 'food' });
  assertEq(r.plan, 'epinephrine-and-AIT');
});
it('Sting', () => {
  const r = Engine.Sting({ systemic: 'yes' });
  assertEq(r.plan, 'VIT-and-eval');
});
it('Ecz', () => {
  const r = Engine.Eczema({ severity: 'severe' });
  assertEq(r.plan, 'dupilumab-and-eval');
});
it('Cont', () => {
  const r = Engine.Contact({ finding: 'positive' });
  assertEq(r.plan, 'avoid-and-steroid');
});
it('AIT', () => {
  const r = Engine.AIT({ type: 'SLIT' });
  assertEq(r.plan, 'tablet-and-FU');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
