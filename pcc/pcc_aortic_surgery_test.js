// pcc_aortic_surgery unit tests v3.316.32 (Phase 1C clinical-grade)
const Engine = require('./pcc_aortic_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  PASS ' + name); passed++; } catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_aortic_surgery engine tests v3.316.32:');

// ASAssessmentExt
it('ASAssessmentExt: ascending 60mm -> surgery indicated', () => {
  const r = Engine.ASAssessmentExt({ age: 60, aneurysmSize: 60, aneurysmLocation: 'ascending' });
  assertEq(r.indication, 'surgery-indicated'); assertEq(r.urgency, 'elective');
});
it('ASAssessmentExt: Marfan 45mm -> surgery indicated', () => {
  const r = Engine.ASAssessmentExt({ age: 30, aneurysmSize: 45, aneurysmLocation: 'ascending', connectiveTissue: true });
  assertEq(r.indication, 'surgery-indicated');
});
it('ASAssessmentExt: bicuspid 50mm -> surgery indicated', () => {
  const r = Engine.ASAssessmentExt({ age: 50, aneurysmSize: 50, aneurysmLocation: 'ascending', bicuspidAorticValve: true });
  assertEq(r.indication, 'surgery-indicated');
});
it('ASAssessmentExt: rapid growth -> urgent', () => {
  const r = Engine.ASAssessmentExt({ age: 60, aneurysmSize: 50, aneurysmLocation: 'ascending', growthRate: 6 });
  assertEq(r.urgency, 'urgent');
});
it('ASAssessmentExt: descending 65mm -> indicated', () => {
  const r = Engine.ASAssessmentExt({ age: 70, aneurysmSize: 65, aneurysmLocation: 'descending' });
  assertEq(r.indication, 'surgery-indicated');
});

// ASScoreExt
it('ASScoreExt: low-risk isolated AVR', () => {
  const r = Engine.ASScoreExt({ age: 55, ef: 60 });
  assertEq(r.riskCategory, 'low');
});
it('ASScoreExt: high-risk elderly + comorbidities', () => {
  const r = Engine.ASScoreExt({ age: 80, sex: 'female', ef: 25, diabetes: true, dialysis: true, priorCardiacSurgery: true });
  assert(r.riskCategory === 'high' || r.riskCategory === 'high');
});

// ASStageExt
it('ASStageExt: Type A dissection -> emergent', () => {
  const r = Engine.ASStageExt({ dissection: true, dissectionType: 'A' });
  assertEq(r.classification, 'emergent'); assert(r.procedure.includes('emergent'));
});
it('ASStageExt: Type B uncomplicated -> medical mgmt', () => {
  const r = Engine.ASStageExt({ dissection: true, dissectionType: 'B' });
  assertEq(r.procedure, 'medical-management');
});
it('ASStageExt: Type B complicated -> TEVAR', () => {
  const r = Engine.ASStageExt({ dissection: true, dissectionType: 'B', symptoms: true });
  assert(r.procedure.includes('TEVAR'));
});
it('ASStageExt: ascending -> Bentall', () => {
  const r = Engine.ASStageExt({ aneurysmLocation: 'ascending' });
  assert(r.procedure.includes('Bentall') || r.procedure.includes('ascending'));
});

// ASPlanExt
it('ASPlanExt: includes preop/intraop/postop/rehab', () => {
  const r = Engine.ASPlanExt({ procedure: 'Bentall', age: 60 });
  assert(r.preOp.length >= 7);
  assert(r.intraOp.length >= 5);
  assert(r.postOp.length >= 8);
  assert(r.rehab.length >= 3);
});

// ASRiskExt
it('ASRiskExt: high-risk reoperation', () => {
  const r = Engine.ASRiskExt({ stsScore: 2, reoperation: true, archInvolvement: true });
  assert(r.riskCategory === 'high' || r.riskCategory === 'very-high');
});
it('ASRiskExt: low-risk isolated AVR', () => {
  const r = Engine.ASRiskExt({ stsScore: 1 });
  assertEq(r.riskCategory, 'low');
});

// ASDoseExt
it('ASDoseExt: preop continues BB + holds ACEi', () => {
  const r = Engine.ASDoseExt({ phase: 'preop', onBetaBlocker: true });
  assert(r.recommendations.some(rec => rec.includes('continue-beta-blocker')));
  assert(r.recommendations.some(rec => rec.includes('hold-ACEi')));
});
it('ASDoseExt: intraop TXA dosing', () => {
  const r = Engine.ASDoseExt({ phase: 'intraop', weight: 80 });
  assert(r.recommendations.some(rec => rec.includes('4000mg') && rec.includes('hr')));  // 80*50=4000
});

// ASFrequencyExt
it('ASFrequencyExt: POD1 = ICU', () => {
  const r = Engine.ASFrequencyExt({ daysPostOp: 1 });
  assert(r.clinic.includes('ICU'));
});
it('ASFrequencyExt: 1-year stable = every 6 months', () => {
  const r = Engine.ASFrequencyExt({ daysPostOp: 400 });
  assertEq(r.clinic, 'every-6-months');
});
it('ASFrequencyExt: complications intensify', () => {
  const r = Engine.ASFrequencyExt({ daysPostOp: 100, complications: true });
  assert(r.clinic.includes('intensified'));
});

// ASDurationExt
it('ASDurationExt: emergent procedure = 4 ICU days', () => {
  const r = Engine.ASDurationExt({ procedure: 'emergent-type-A-repair' });
  assertEq(r.icuDays, 4);
});
it('ASDurationExt: TEVAR = 1 ICU day', () => {
  const r = Engine.ASDurationExt({ procedure: 'TEVAR-elective' });
  assertEq(r.icuDays, 1);
});

// ASFollowupExt
it('ASFollowupExt: TEVAR includes endoleak surveillance', () => {
  const r = Engine.ASFollowupExt({ procedure: 'TEVAR-emergent' });
  assert(r.imaging.some(i => i.includes('endoleak')));
});
it('ASFollowupExt: arch requires lifelong imaging', () => {
  const r = Engine.ASFollowupExt({ procedure: 'arch-replacement', archInvolvement: true });
  assert(r.followUp.some(f => f.includes('lifelong')));
});

// ASOutcomeExt
it('ASOutcomeExt: emergent surgery lower survival', () => {
  const r = Engine.ASOutcomeExt({ yearsPostOp: 1, procedure: 'emergent-type-A-repair' });
  assert(r.survival5yrPct < 80);
});
it('ASOutcomeExt: endoleak increases reintervention', () => {
  const r = Engine.ASOutcomeExt({ yearsPostOp: 2, procedure: 'TEVAR', endoleak: true });
  assert(r.reinterventionPct >= 35);
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);