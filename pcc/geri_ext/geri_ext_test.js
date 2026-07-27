// P3-BS geri_ext unit tests
const Engine = require('./geri_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('geri_ext engine tests:');
it('Frail', () => {
  const r = Engine.Frailty({ score: 5, falls: 'no' });
  assertEq(r.plan, 'PT-and-prehab');
});
it('Poly', () => {
  const r = Engine.Polypharm({ count: 12, beers: 'no' });
  assertEq(r.plan, 'deprescribe-and-review');
});
it('Delir', () => {
  const r = Engine.Delirium({ cam: 'positive', cause: 'unknown' });
  assertEq(r.plan, 'find-cause-and-nonpharm');
});
it('Falls', () => {
  const r = Engine.Falls({ recurrent: 'yes', cause: 'unknown' });
  assertEq(r.plan, 'multifactorial-and-PT');
});
it('Dem', () => {
  const r = Engine.Dementia({ stage: 'mild', caregiver: 'yes' });
  assertEq(r.plan, 'monitor-and-stimulate');
});
it('Nutr', () => {
  const r = Engine.Nutrition({ mna: 6, weight: 'losing' });
  assertEq(r.plan, 'supplements-and-eval');
});
it('PU', () => {
  const r = Engine.PressureUlcer({ stage: 'III', braden: 10 });
  assertEq(r.plan, 'debridement-and-flap');
});
it('Dep', () => {
  const r = Engine.Depression({ phq: 12, suicidal: 'no' });
  assertEq(r.plan, 'SSRI-and-CBT');
});
it('Adv', () => {
  const r = Engine.Advance({ status: 'none', proxy: 'no' });
  assertEq(r.plan, 'goals-of-care-discussion');
});
it('Sarc', () => {
  const r = Engine.Sarcopenia({ speed: 0.7, grip: 25 });
  assertEq(r.plan, 'PT-and-protein');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
