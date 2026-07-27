// P3-BB: Geriatric-Assessment unit tests
const Engine = require('./geriatric_assessment_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('geriatric_assessment engine tests:');
it('CGA', () => {
  const r = Engine.ComprehensiveGeriatric({ domains: { cognitive: 'mild-impairment', mobility: 'normal', nutrition: 'normal', mood: 'normal', function: 'normal', social: 'normal', meds: 'normal', continence: 'normal' } });
  assertEq(r.issues, 1);
  assertEq(r.classification, 'one-or-two-domain-issues');
});
it('MiniCog', () => {
  const r = Engine.MiniCog({ wordRecall: 1, clockDraw: 'normal' });
  assertEq(r.result, 'positive-screen-for-dementia');
});
it('MoCA', () => {
  const r = Engine.MoCA({ score: 22, education: 12 });
  assertEq(r.adjusted, 23);
  assertEq(r.result, 'mild-cognitive-impairment-MCI');
});
it('ADL', () => {
  const r = Engine.ADL_IADL({ adl: 6, iadl: 8 });
  assertEq(r.result, 'fully-independent-no-deficits');
});
it('GDS', () => {
  const r = Engine.GeriatricDepression({ gadScore: 11 });
  assertEq(r.result, 'severe-depression');
});
it('MNA', () => {
  const r = Engine.NutritionMNA({ mnaScore: 18, bmi: 22, weightLoss: 0 });
  assertEq(r.result, 'at-risk-of-malnutrition');
});
it('Polypharm', () => {
  const r = Engine.PolypharmacyGeri({ medCount: 12, beersCriteria: 4, age: 85 });
  assertEq(r.plan, 'severe-polypharmacy-deprescribing-by-pharmacist');
});
it('Cont', () => {
  const r = Engine.ContinenceGeri({ type: 'urge', frequency: 'daily', severity: 'moderate', cognition: 'normal' });
  assertEq(r.plan, 'bladder-training-and-anticholinergic-eval');
});
it('Pain', () => {
  const r = Engine.GeriatricPain({ painScore: 6, painType: 'nociceptive', meds: ['NSAID'], cognition: 'impaired' });
  assertEq(r.plan, 'PAINAD-and-non-pharm-and-scheduled-analgesia');
});
it('Goals', () => {
  const r = Engine.GoalsOfCare({ codeStatus: 'full', prognosis: '1-year', goals: 'comfort' });
  assertEq(r.plan, 'transition-to-hospice-or-comfort-care');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
