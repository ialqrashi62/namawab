// P3-AR: Cardiology-Ext2 unit tests
const Engine = require('./cardiology_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('cardiology_ext2 engine tests:');
it('HEART high', () => {
  const r = Engine.HEARTScore({ history: 2, ecg: 2, age: 2, riskFactors: 2, troponin: 2 });
  assertEq(r.category, 'high-risk-72-percent-MACE');
});
it('TIMI', () => {
  const r = Engine.TIMIScore({ age: 70, stChanges: true, riskFactors: 3, knownCAD: true });
  assertEq(r.category.startsWith('high-risk'), true);
});
it('ACS', () => {
  const r = Engine.ACSSyndrome({ chestPain: true, stElevation: true, troponin: 0.5 });
  assertEq(r.diagnosis, 'STEMI-emergent-PCI');
});
it('Shock', () => {
  const r = Engine.CardiogenicShock({ sbp: 80, ci: 1.5, pcwp: 22 });
  assertEq(r.stage, 'stage-D-critical-cardiogenic-shock');
});
it('PH', () => {
  const r = Engine.PulmonaryHypertension({ pap: 35, pcwp: 12, pvr: 5 });
  assertEq(r.classification, 'pulmonary-arterial-hypertension-group-1');
});
it('HF', () => {
  const r = Engine.HeartFailureClassification({ lvef: 30 });
  assertEq(r.category, 'HFrEF');
});
it('Arrhythmia', () => {
  const r = Engine.ArrhythmiaRisk({ qtc: 510 });
  assertEq(r.risk, 'high-torsades-avoid-QT-prolonging');
});
it('Valve', () => {
  const r = Engine.ValveAssessment({ valve: 'aortic', severity: 'severe', symptoms: 'syncope' });
  assertEq(r.pathway, 'severe-symptomatic-surgical-referral');
});
it('STEMI', () => {
  const r = Engine.ECG_STEMI({ stElevationMm: 3, location: 'anterior' });
  assertEq(r.stemi, 'STEMI-anterior');
});
it('Lipid', () => {
  const r = Engine.LipidManagement({ priorMI: true, ldl: 90 });
  assertEq(r.pathway, 'high-intensity-statin-and-PCSK9i-consider');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
