// P3-AO: Pharmacy-Clinical unit tests
const Engine = require('./pharmacy_clinical_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pharmacy_clinical engine tests:');
it('RenalAdjustment', () => {
  const r = Engine.DoseRenalAdjustment({ baselineDose: 100, creatinineClearance: 15, drugName: 'vancomycin' });
  assertEq(r.adjustment, 0.25);
});
it('TDM vanco', () => {
  const r = Engine.TherapeuticDrugMonitoring({ drug: 'vancomycin', troughLevel: 18 });
  assertEq(r.interpretation, 'therapeutic-AUC-targeted');
});
it('DrugInteraction', () => {
  const r = Engine.DrugInteractionCheck({ interactions: ['warfarin-aspirin'], severity: 'major' });
  assertEq(r.alertLevel, 'major-avoid-or-monitor-closely');
});
it('VancomycinAUC', () => {
  const r = Engine.VancomycinAUC({ trough: 20, dose: 1000, interval: 12, weight: 70 });
  assertEq(r.interpretation, 'therapeutic-AUC-goal');
});
it('Aminoglycoside', () => {
  const r = Engine.AminoglycosideExtendedInterval({ dose: 5, weight: 70, creatinine: 1.0 });
  assertEq(r.interval, 24);
});
it('Phenytoin', () => {
  const r = Engine.PhenytoinCorrection({ totalLevel: 10, albumin: 2.0 });
  assertEq(r.interpretation, 'subtherapeutic-corrected');
});
it('WarfarinINR', () => {
  const r = Engine.WarfarinINRManagement({ inr: 6.0, currentDose: 5 });
  assertEq(r.adjustment, 'hold-and-vitamin-K-consider');
});
it('InsulinDrip', () => {
  const r = Engine.InsulinDrip({ currentRate: 2, glucose: 60, previousGlucose: 150 });
  assertEq(r.newRate, 0);
});
it('VancomycinLoad', () => {
  const r = Engine.VancomycinLoading({ weight: 80, creatinine: 1.0, severity: 'sepsis' });
  assertEq(r.loadDose, 2400);
});
it('MedReconciliation', () => {
  const r = Engine.MedicationReconciliation({ discrepancies: 0, allergies: 1 });
  assertEq(r.severity, 'critical-allergy-flag-must-resolve');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
