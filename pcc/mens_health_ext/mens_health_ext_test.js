// P3-BG mens_health_ext unit tests
const Engine = require('./mens_health_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('mens_health_ext engine tests:');
it('Well-man', () => {
  const r = Engine.WellMan({ age: 55, screening: 'current' });
  assertEq(r.plan, 'colon-screen-and-AAA-and-PSA-discussion');
});
it('Testosterone', () => {
  const r = Engine.Testosterone({ total: 150, free: 30, symptoms: 'severe' });
  assertEq(r.plan, 'testosterone-replacement-therapy');
});
it('ED', () => {
  const r = Engine.ErectileDysfunction({ cause: 'cardiovascular', severity: 'mild', cvRisk: 'high' });
  assertEq(r.plan, 'cardiology-eval-first');
});
it('Prostate', () => {
  const r = Engine.ProstateScreen({ age: 60, psa: 5, family: 'no' });
  assertEq(r.plan, 'urology-referral-and-biopsy');
});
it('BPH', () => {
  const r = Engine.BPH({ ipss: 22, prostate: 'large' });
  assertEq(r.plan, 'alpha-blocker-and-5ARI-and-urology');
});
it('Hypo', () => {
  const r = Engine.Hypogonadism({ lh: 12, fsh: 5, total: 150 });
  assertEq(r.plan, 'primary-hypogonadism-and-eval');
});
it('Infertility', () => {
  const r = Engine.InfertilityMale({ count: 10, motility: 20, morphology: 3 });
  assertEq(r.plan, 'oligospermia-and-ART');
});
it('STI', () => {
  const r = Engine.STI({ pathogen: 'HIV', symptoms: 'present', partner: 'unknown' });
  assertEq(r.plan, 'urgent-ID-referral-and-PEP-eval');
});
it('Hair', () => {
  const r = Engine.HairLoss({ pattern: 'androgenetic', age: 30, family: 'yes' });
  assertEq(r.plan, 'finasteride-and-minoxidil');
});
it('Mental', () => {
  const r = Engine.MentalHealthMale({ phq9: 22, gad7: 10, suicidal: 'no' });
  assertEq(r.plan, 'severe-depression-and-medication-and-therapy');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
