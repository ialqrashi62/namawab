// P3-AR: Critical-Care-Ext unit tests
const Engine = require('./critical_care_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('critical_care_ext engine tests:');
it('ARDS severe', () => {
  const r = Engine.ARDSAssessment({ pao2: 60, fio2: 1.0, peep: 14 });
  assertEq(r.severity, 'severe-ARDS-PEEP-15');
});
it('Sepsis 1h', () => {
  const r = Engine.Sepsis1Hour({ lactate: 5, hypotension: true, fluidsReceived: 30, antibioticGiven: false });
  assertEq(r.compliance, 'sepsis-bundle-incomplete');
});
it('Vasopressor', () => {
  const r = Engine.ShockVasopressor({ map: 55, norepinephrineDose: 0 });
  assertEq(r.pathway, 'start-norepinephrine');
});
it('Weaning', () => {
  const r = Engine.WeaningLiberation({ fio2: 0.35, peep: 5, mental: 'alert', pressureSupport: 6, rsbi: 50 });
  assertEq(r.ready, 'ready-for-spontaneous-breathing-trial');
});
it('ICP', () => {
  const r = Engine.ICPManagement({ icp: 30, cerebralPerfusionPressure: 50 });
  assertEq(r.pathway, 'severe-ICP-hyperosmolar-and-consider-decompressive');
});
it('TBI', () => {
  const r = Engine.TBIAssessment({ gcs: 5, pupil: 'unreactive', ct: 'abnormal' });
  assertEq(r.classification, 'severe-TBI-GCS-3-8');
});
it('VentLiberation', () => {
  const r = Engine.VentilatorLiberationBundle({ sbpOk: true, noVasopressors: true, mentalOk: true, suctioningTolerance: 'good', coughStrength: 'strong' });
  assertEq(r.ready, 'fully-ready-for-extubation');
});
it('MOF', () => {
  const r = Engine.MultipleOrganFailure({ respiratoryScore: 4, renalScore: 4, liverScore: 4, cardiacScore: 4, hematologicScore: 4, neurologicScore: 4 });
  assertEq(r.mortality, 'very-high-mortality-80-percent');
});
it('VAP', () => {
  const r = Engine.VentilatorAssociatedPneumonia({ purulentSputum: true, fever: true, leukocytosis: true, newInfiltrate: true, worseningOxygenation: true });
  assertEq(r.diagnosis, 'probable-VAP-start-empiric-antibiotics');
});
it('Delirium', () => {
  const r = Engine.DeliriumCAMICU({ acuteChange: true, inattention: true, alteredConsciousness: true, disorganizedThinking: true });
  assertEq(r.diagnosis, 'delirium-CAM-ICU-positive');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
