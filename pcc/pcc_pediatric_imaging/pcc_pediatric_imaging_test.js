// pcc_pediatric_imaging_engine tests v3.316.34 (Phase 2 Batch 1)
const Engine = require('./pcc_pediatric_imaging_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_imaging engine tests v3.316.34:');

it('PIMAssessment: stat urgency -> immediate', () => {
  const r = Engine.PIMAssessmentExt({ urgency: 'stat' });
  assertEq(r.triage, 'immediate-processing');
});

it('PIMAssessment: routine -> standard', () => {
  const r = Engine.PIMAssessmentExt({ urgency: 'routine' });
  assertEq(r.triage, 'routine');
});

it('PIMAssessment: pediatric age-adjusted', () => {
  const r = Engine.PIMAssessmentExt({ age: 10 });
  assertEq(r.ageAdjusted, 'age-adjusted-reference-ranges');
});

it('PIMScore: severely high -> critical', () => {
  const r = Engine.PIMScoreExt({ value: 200, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'critical');
  assertEq(r.criticalValue, true);
});

it('PIMScore: normal range -> none', () => {
  const r = Engine.PIMScoreExt({ value: 50, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'none');
});

it('PIMStage: stage IV -> advanced care', () => {
  const r = Engine.PIMStageExt({ stage: 'IV' });
  assertEq(r.treatmentIntensity, 'advanced-specialty-care');
});

it('PIMPlan: 4 sections present', () => {
  const r = Engine.PIMPlanExt({});
  assert(r.investigations.length >= 3);
  assert(r.referrals.length >= 2);
  assert(r.monitoring.length >= 3);
  assert(r.selfCare.length >= 2);
});

it('PIMRisk: 6 risk factors -> high', () => {
  const r = Engine.PIMRiskExt({ riskFactors: 4, abnormalFindings: 2, comorbidities: 2 });
  assertEq(r.riskCategory, 'high');
});

it('PIMDose: AKI -> 50% reduction', () => {
  const r = Engine.PIMDoseExt({ drug: 'test-drug', weight: 80, egfr: 20 });
  assert(r.adjustment.includes('reduce-dose-50%'));
});

it('PIMFrequency: severe unstable -> 1-2 weeks', () => {
  const r = Engine.PIMFrequencyExt({ severity: 'severe', stable: false });
  assertEq(r.testInterval, '1-2-weeks');
});

it('PIMDuration: complex 90 min', () => {
  const r = Engine.PIMDurationExt({ complexity: 'complex' });
  assertEq(r.minutes, 90);
});

it('PIMFollowup: 4 sections present', () => {
  const r = Engine.PIMFollowupExt({});
  assert(r.labs.length >= 2);
  assert(r.imaging.length >= 1);
  assert(r.referrals.length >= 1);
  assert(r.selfCare.length >= 2);
});

it('PIMOutcome: improvement + adherence -> excellent', () => {
  const r = Engine.PIMOutcomeExt({ improvement: true, stable: true, adherence: true });
  assertEq(r.response, 'excellent');
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
