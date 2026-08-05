// pcc_pediatric_hematology_engine tests v3.316.34 (Phase 2 Batch 1)
const Engine = require('./pcc_pediatric_hematology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_hematology engine tests v3.316.34:');

it('PHEAssessment: stat urgency -> immediate', () => {
  const r = Engine.PHEAssessmentExt({ urgency: 'stat' });
  assertEq(r.triage, 'immediate-processing');
});

it('PHEAssessment: routine -> standard', () => {
  const r = Engine.PHEAssessmentExt({ urgency: 'routine' });
  assertEq(r.triage, 'routine');
});

it('PHEAssessment: pediatric age-adjusted', () => {
  const r = Engine.PHEAssessmentExt({ age: 10 });
  assertEq(r.ageAdjusted, 'age-adjusted-reference-ranges');
});

it('PHEScore: severely high -> critical', () => {
  const r = Engine.PHEScoreExt({ value: 200, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'critical');
  assertEq(r.criticalValue, true);
});

it('PHEScore: normal range -> none', () => {
  const r = Engine.PHEScoreExt({ value: 50, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'none');
});

it('PHEStage: stage IV -> advanced care', () => {
  const r = Engine.PHEStageExt({ stage: 'IV' });
  assertEq(r.treatmentIntensity, 'advanced-specialty-care');
});

it('PHEPlan: 4 sections present', () => {
  const r = Engine.PHEPlanExt({});
  assert(r.investigations.length >= 3);
  assert(r.referrals.length >= 2);
  assert(r.monitoring.length >= 3);
  assert(r.selfCare.length >= 2);
});

it('PHERisk: 6 risk factors -> high', () => {
  const r = Engine.PHERiskExt({ riskFactors: 4, abnormalFindings: 2, comorbidities: 2 });
  assertEq(r.riskCategory, 'high');
});

it('PHEDose: AKI -> 50% reduction', () => {
  const r = Engine.PHEDoseExt({ drug: 'test-drug', weight: 80, egfr: 20 });
  assert(r.adjustment.includes('reduce-dose-50%'));
});

it('PHEFrequency: severe unstable -> 1-2 weeks', () => {
  const r = Engine.PHEFrequencyExt({ severity: 'severe', stable: false });
  assertEq(r.testInterval, '1-2-weeks');
});

it('PHEDuration: complex 90 min', () => {
  const r = Engine.PHEDurationExt({ complexity: 'complex' });
  assertEq(r.minutes, 90);
});

it('PHEFollowup: 4 sections present', () => {
  const r = Engine.PHEFollowupExt({});
  assert(r.labs.length >= 2);
  assert(r.imaging.length >= 1);
  assert(r.referrals.length >= 1);
  assert(r.selfCare.length >= 2);
});

it('PHEOutcome: improvement + adherence -> excellent', () => {
  const r = Engine.PHEOutcomeExt({ improvement: true, stable: true, adherence: true });
  assertEq(r.response, 'excellent');
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
