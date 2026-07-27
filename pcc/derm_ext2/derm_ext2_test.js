// P3-BO derm_ext2 unit tests
const Engine = require('./derm_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('derm_ext2 engine tests:');
it('Acne', () => {
  const r = Engine.Acne({ severity: 'severe', scar: 'yes' });
  assertEq(r.plan, 'isotretinoin-and-derm');
});
it('Psor', () => {
  const r = Engine.Psoriasis({ bsa: 12, joint: 'no' });
  assertEq(r.plan, 'biologic-and-methotrexate');
});
it('Ecz', () => {
  const r = Engine.Eczema({ severity: 'moderate', infection: 'no' });
  assertEq(r.plan, 'topical-steroid-and-tacrolimus');
});
it('Cancer', () => {
  const r = Engine.SkinCancer({ type: 'melanoma', stage: 'I' });
  assertEq(r.plan, 'wide-excision');
});
it('Drug', () => {
  const r = Engine.DrugRash({ severity: 'mild', drug: 'sulfa' });
  assertEq(r.plan, 'rechallenge-and-monitor');
});
it('Bullo', () => {
  const r = Engine.Bullous({ type: 'bullous-pemphigoid', extent: 'limited' });
  assertEq(r.plan, 'topical-steroid-and-systemic');
});
it('AI', () => {
  const r = Engine.Autoimmune({ type: 'lupus', organ: 'skin' });
  assertEq(r.plan, 'HCQ-and-topical');
});
it('Hair', () => {
  const r = Engine.Hair({ type: 'alopecia-areata', rapidity: 'rapid' });
  assertEq(r.plan, 'systemic-steroid-and-JAK-inhibitor');
});
it('Pedi', () => {
  const r = Engine.PediatricDerm({ age: 1, condition: 'atopic' });
  assertEq(r.plan, 'emollient-and-low-steroid');
});
it('Ulc', () => {
  const r = Engine.Ulcer({ type: 'venous', infection: 'no', arterial: 'no' });
  assertEq(r.plan, 'compression-and-wound-care');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
