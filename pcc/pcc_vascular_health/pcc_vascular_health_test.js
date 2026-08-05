// pcc_vascular_health_engine tests v3.316.33
const Engine = require('./pcc_vascular_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_vascular_health engine tests v3.316.33:');

it('VHAssessment: chest pain severe -> emergent', () => {
  const r = Engine.VHAssessmentExt({ symptoms: 'chest-pain-severe' });
  assertEq(r.triage, 'emergent-referral');
});

it('VHScore: total 12 -> severe', () => {
  const r = Engine.VHScoreExt({ symptomScore: 8, riskScore: 4 });
  assertEq(r.severity, 'severe');
});

it('VHScore: total 1 -> minimal', () => {
  const r = Engine.VHScoreExt({ symptomScore: 0, riskScore: 1 });
  assertEq(r.severity, 'minimal');
});

it('VHStage: severe -> advanced specialty', () => {
  const r = Engine.VHStageExt({ severity: 'severe' });
  assertEq(r.treatmentIntensity, 'advanced-specialty-care');
});

it('VHPlan: includes 4 sections', () => {
  const r = Engine.VHPlanExt({});
  assert(r.lifestyle.length >= 5);
  assert(r.medications.length >= 3);
  assert(r.monitoring.length >= 3);
  assert(r.referrals.length >= 3);
});

it('VHRisk: ASCVD 15 + DM + smoker -> high', () => {
  const r = Engine.VHRiskExt({ ascvdScore: 15, diabetes: true, smoker: true });
  assert(r.riskCategory === 'high' || r.riskCategory === 'very-high');
});

it('VHRisk: low ASCVD 3 -> low risk', () => {
  const r = Engine.VHRiskExt({ ascvdScore: 3 });
  assertEq(r.riskCategory, 'low');
});

it('VHDose: statin -> high-intensity', () => {
  const r = Engine.VHDoseExt({ drug: 'statin' });
  assert(r.targetDose.includes('high-intensity'));
});

it('VHFrequency: severe unstable -> 1-2 weeks', () => {
  const r = Engine.VHFrequencyExt({ severity: 'severe', stable: false });
  assertEq(r.clinicInterval, '1-2-weeks');
});

it('VHDuration: complex outpatient 45 min', () => {
  const r = Engine.VHDurationExt({ setting: 'outpatient', complexity: 'complex' });
  assertEq(r.visitMinutes, 45);
});

it('VHFollowup: includes labs + imaging', () => {
  const r = Engine.VHFollowupExt({});
  assert(r.labs.length >= 3);
  assert(r.imaging.length >= 2);
});

it('VHOutcome: all positive -> excellent', () => {
  const r = Engine.VHOutcomeExt({ symptomRelief: true, adherence: true, improvement: true });
  assertEq(r.response, 'excellent');
});

it('VHOutcome: no adherence -> suboptimal', () => {
  const r = Engine.VHOutcomeExt({ adherence: false });
  assertEq(r.response, 'suboptimal');
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
