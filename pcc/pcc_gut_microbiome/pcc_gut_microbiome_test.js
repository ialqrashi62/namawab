// pcc_gut_microbiome_engine tests v3.316.34 (Phase 2 Batch 1)
const Engine = require('./pcc_gut_microbiome_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_gut_microbiome engine tests v3.316.34:');

it('GMAssessment: stat urgency -> immediate', () => {
  const r = Engine.GMAssessmentExt({ urgency: 'stat' });
  assertEq(r.triage, 'immediate-processing');
});

it('GMAssessment: routine -> standard', () => {
  const r = Engine.GMAssessmentExt({ urgency: 'routine' });
  assertEq(r.triage, 'routine');
});

it('GMAssessment: pediatric age-adjusted', () => {
  const r = Engine.GMAssessmentExt({ age: 10 });
  assertEq(r.ageAdjusted, 'age-adjusted-reference-ranges');
});

it('GMScore: severely high -> critical', () => {
  const r = Engine.GMScoreExt({ value: 200, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'critical');
  assertEq(r.criticalValue, true);
});

it('GMScore: normal range -> none', () => {
  const r = Engine.GMScoreExt({ value: 50, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'none');
});

it('GMStage: stage IV -> advanced care', () => {
  const r = Engine.GMStageExt({ stage: 'IV' });
  assertEq(r.treatmentIntensity, 'advanced-specialty-care');
});

it('GMPlan: 4 sections present', () => {
  const r = Engine.GMPlanExt({});
  assert(r.investigations.length >= 3);
  assert(r.referrals.length >= 2);
  assert(r.monitoring.length >= 3);
  assert(r.selfCare.length >= 2);
});

it('GMRisk: 6 risk factors -> high', () => {
  const r = Engine.GMRiskExt({ riskFactors: 4, abnormalFindings: 2, comorbidities: 2 });
  assertEq(r.riskCategory, 'high');
});

it('GMDose: AKI -> 50% reduction', () => {
  const r = Engine.GMDoseExt({ drug: 'test-drug', weight: 80, egfr: 20 });
  assert(r.adjustment.includes('reduce-dose-50%'));
});

it('GMFrequency: severe unstable -> 1-2 weeks', () => {
  const r = Engine.GMFrequencyExt({ severity: 'severe', stable: false });
  assertEq(r.testInterval, '1-2-weeks');
});

it('GMDuration: complex 90 min', () => {
  const r = Engine.GMDurationExt({ complexity: 'complex' });
  assertEq(r.minutes, 90);
});

it('GMFollowup: 4 sections present', () => {
  const r = Engine.GMFollowupExt({});
  assert(r.labs.length >= 2);
  assert(r.imaging.length >= 1);
  assert(r.referrals.length >= 1);
  assert(r.selfCare.length >= 2);
});

it('GMOutcome: improvement + adherence -> excellent', () => {
  const r = Engine.GMOutcomeExt({ improvement: true, stable: true, adherence: true });
  assertEq(r.response, 'excellent');
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
