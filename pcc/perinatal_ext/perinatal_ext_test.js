// P3-BE: Perinatal-Ext unit tests
const Engine = require('./perinatal_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('perinatal_ext engine tests:');
it('Prenatal', () => {
  const r = Engine.PrenatalCare({ trimester: 2, ga: 24, visits: 8, highRisk: 'no' });
  assertEq(r.plan, 'standard-prenatal-care');
});
it('High-risk', () => {
  const r = Engine.HighRiskPregnancy({ condition: 'preeclampsia', ga: 32, severity: 'mild', maternalAge: 28 });
  assertEq(r.plan, 'mild-pre-eclampsia-and-monitoring');
});
it('Preeclampsia', () => {
  const r = Engine.Preeclampsia({ bpSystolic: 165, bpDiastolic: 110, proteinuria: 'yes', symptoms: 'yes', ga: 32 });
  assertEq(r.diagnosis, 'severe-preeclampsia-with-severe-features');
});
it('Screen', () => {
  const r = Engine.PrenatalScreen({ ga: 18, screen: 'NIPT', risk: 'high', ultrasound: 'normal' });
  assertEq(r.plan, 'NIPT-and-aneuploidy-screen-and-genetic-counsel');
});
it('FGR', () => {
  const r = Engine.FGR({ estimatedGA: 28, actualGA: 32, abdominalCirc: 25, doppler: 'normal' });
  assertEq(r.classification, 'severe-FGR-or-IUGR');
});
it('Labor', () => {
  const r = Engine.LaborMgmt({ stage: 'active', dilation: 7, effacement: 80, fetalHR: 'reassuring' });
  assertEq(r.plan, 'active-labor-and-progress');
});
it('Monitor', () => {
  const r = Engine.IntrapartumMonitor({ baseline: 140, variability: 'moderate', decels: 'none', category: 'I' });
  assertEq(r.result, 'category-I-and-continue-monitoring');
});
it('PPH', () => {
  const r = Engine.PostpartumHemorrhage({ ebl: 500, uterineTone: 'boggy', placenta: 'intact' });
  assertEq(r.plan, 'uterine-atoniy-and-massage-and-uterotonics');
});
it('Mental', () => {
  const r = Engine.PerinatalMental({ edinburgh: 14, anxiety: 'high', support: 'limited', priorHistory: 'no' });
  assertEq(r.plan, 'PPD-and-therapy-and-social-work');
});
it('Outcome', () => {
  const r = Engine.PerinatalOutcome({ gaBirth: 39, birthWeight: 3200, apgar5: 8, breastfeeding: 'yes', maternalComp: 'none' });
  assertEq(r.result, 'optimal-perinatal-outcome');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
