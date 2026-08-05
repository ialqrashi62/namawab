// pcc_interventional_radiology_engine tests v3.316.34 (Phase 2 Batch 1)
const Engine = require('./pcc_interventional_radiology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_interventional_radiology engine tests v3.316.34:');

it('IRAssessment: stat urgency -> immediate', () => {
  const r = Engine.IRAssessmentExt({ urgency: 'stat' });
  assertEq(r.triage, 'immediate-processing');
});

it('IRAssessment: routine -> standard', () => {
  const r = Engine.IRAssessmentExt({ urgency: 'routine' });
  assertEq(r.triage, 'routine');
});

it('IRAssessment: pediatric age-adjusted', () => {
  const r = Engine.IRAssessmentExt({ age: 10 });
  assertEq(r.ageAdjusted, 'age-adjusted-reference-ranges');
});

it('IRScore: severely high -> critical', () => {
  const r = Engine.IRScoreExt({ value: 200, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'critical');
  assertEq(r.criticalValue, true);
});

it('IRScore: normal range -> none', () => {
  const r = Engine.IRScoreExt({ value: 50, refLow: 0, refHigh: 100 });
  assertEq(r.severity, 'none');
});

it('IRStage: stage IV -> advanced care', () => {
  const r = Engine.IRStageExt({ stage: 'IV' });
  assertEq(r.treatmentIntensity, 'advanced-specialty-care');
});

it('IRPlan: 4 sections present', () => {
  const r = Engine.IRPlanExt({});
  assert(r.investigations.length >= 3);
  assert(r.referrals.length >= 2);
  assert(r.monitoring.length >= 3);
  assert(r.selfCare.length >= 2);
});

it('IRRisk: 6 risk factors -> high', () => {
  const r = Engine.IRRiskExt({ riskFactors: 4, abnormalFindings: 2, comorbidities: 2 });
  assertEq(r.riskCategory, 'high');
});

it('IRDose: AKI -> 50% reduction', () => {
  const r = Engine.IRDoseExt({ drug: 'test-drug', weight: 80, egfr: 20 });
  assert(r.adjustment.includes('reduce-dose-50%'));
});

it('IRFrequency: severe unstable -> 1-2 weeks', () => {
  const r = Engine.IRFrequencyExt({ severity: 'severe', stable: false });
  assertEq(r.testInterval, '1-2-weeks');
});

it('IRDuration: complex 90 min', () => {
  const r = Engine.IRDurationExt({ complexity: 'complex' });
  assertEq(r.minutes, 90);
});

it('IRFollowup: 4 sections present', () => {
  const r = Engine.IRFollowupExt({});
  assert(r.labs.length >= 2);
  assert(r.imaging.length >= 1);
  assert(r.referrals.length >= 1);
  assert(r.selfCare.length >= 2);
});

it('IROutcome: improvement + adherence -> excellent', () => {
  const r = Engine.IROutcomeExt({ improvement: true, stable: true, adherence: true });
  assertEq(r.response, 'excellent');
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
