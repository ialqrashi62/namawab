// P3-BO allergy_ext unit tests
const Engine = require('./allergy_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('allergy_ext engine tests:');
it('Ana', () => {
  const r = Engine.Anaphylaxis({ trigger: 'food', severity: 'severe' });
  assertEq(r.plan, 'epinephrine-and-observation-6h');
});
it('Food', () => {
  const r = Engine.FoodAllergy({ food: 'peanut', reaction: 'severe' });
  assertEq(r.plan, 'OIT-and-auto-injector');
});
it('Drug', () => {
  const r = Engine.DrugAllergy({ drug: 'sulfa', reaction: 'SJS', severity: 'severe' });
  assertEq(r.plan, 'strict-avoidance-and-derm');
});
it('Urt', () => {
  const r = Engine.Urticaria({ acute: 'no', chronic: 'yes' });
  assertEq(r.plan, 'H1-and-H2-and-eval-cause');
});
it('Angio', () => {
  const r = Engine.Angioedema({ cause: 'ACE-inhibitor', airway: 'patent' });
  assertEq(r.plan, 'stop-ACE-and-icatibant');
});
it('Rhinitis', () => {
  const r = Engine.AllergicRhinitis({ severity: 'severe', allergen: 'unknown' });
  assertEq(r.plan, 'INCS-and-antihistamine-and-IT');
});
it('Asthma', () => {
  const r = Engine.Asthma({ control: 'poor', severity: 'severe' });
  assertEq(r.plan, 'step-5-and-biologic-eval');
});
it('Atopic', () => {
  const r = Engine.Atopic({ severity: 'mild', trigger: 'unknown' });
  assertEq(r.plan, 'low-potency-steroid-and-emollient');
});
it('Venom', () => {
  const r = Engine.Venom({ reaction: 'large-local', sting: 'bee' });
  assertEq(r.plan, 'antihistamine-and-ice');
});
it('PID', () => {
  const r = Engine.PrimaryImmuno({ ig: 'low', infections: 'recurrent' });
  assertEq(r.plan, 'IVIG-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
