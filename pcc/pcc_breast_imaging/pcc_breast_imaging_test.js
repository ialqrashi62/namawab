// pcc_breast_imaging_engine tests v3.316.34 (Phase 2 Batch 1)
const Engine = require('./pcc_breast_imaging_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_breast_imaging engine tests v3.316.34:');

it('BRAssessment: stat urgency -> immediate', () => {
  const r = Engine.BRAssessmentExt({ urgency: 'stat' });
  assertEq(r.triage, 'immediate-processing');
});

it('BRAssessment: routine -> standard', () => {
  const r = Engine.BRAssessmentExt({ urgency: 'routine' });
  assertEq(r.triage, 'routine');
});

it('BRAssessment: pediatric age-adjusted', () => {
  const r = Engine.BRAssessmentExt({ age: 10 });
  assertEq(r.ageAdjusted, 'age-adjusted-reference-ranges');
});

it('BRScore: severely high -> critical', () => {
  const r = Engine.BRScoreExt({ value: 200, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'critical');
  assertEq(r.criticalValue, true);
});

it('BRScore: normal range -> none', () => {
  const r = Engine.BRScoreExt({ value: 50, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'none');
});

it('BRStage: stage IV -> advanced care', () => {
  const r = Engine.BRStageExt({ stage: 'IV' });
  assertEq(r.treatmentIntensity, 'advanced-specialty-care');
});

it('BRPlan: 4 sections present', () => {
  const r = Engine.BRPlanExt({});
  assert(r.investigations.length >= 3);
  assert(r.referrals.length >= 2);
  assert(r.monitoring.length >= 3);
  assert(r.selfCare.length >= 2);
});

it('BRRisk: 6 risk factors -> high', () => {
  const r = Engine.BRRiskExt({ riskFactors: 4, abnormalFindings: 2, comorbidities: 2 });
  assertEq(r.riskCategory, 'high');
});

it('BRDose: AKI -> 50% reduction', () => {
  const r = Engine.BRDoseExt({ drug: 'test-drug', weight: 80, egfr: 20 });
  assert(r.adjustment.includes('reduce-dose-50%'));
});

it('BRFrequency: severe unstable -> 1-2 weeks', () => {
  const r = Engine.BRFrequencyExt({ severity: 'severe', stable: false });
  assertEq(r.testInterval, '1-2-weeks');
});

it('BRDuration: complex 90 min', () => {
  const r = Engine.BRDurationExt({ complexity: 'complex' });
  assertEq(r.minutes, 90);
});

it('BRFollowup: 4 sections present', () => {
  const r = Engine.BRFollowupExt({});
  assert(r.labs.length >= 2);
  assert(r.imaging.length >= 1);
  assert(r.referrals.length >= 1);
  assert(r.selfCare.length >= 2);
});

it('BROutcome: improvement + adherence -> excellent', () => {
  const r = Engine.BROutcomeExt({ improvement: true, stable: true, adherence: true });
  assertEq(r.response, 'excellent');
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
