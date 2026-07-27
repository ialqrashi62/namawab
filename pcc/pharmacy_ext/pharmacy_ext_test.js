// P3-BJ pharmacy_ext unit tests
const Engine = require('./pharmacy_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pharmacy_ext engine tests:');
it('Renal', () => {
  const r = Engine.RenalDosing({ gfr: 25, drug: 'vancomycin' });
  assertEq(r.plan, 'reduce-dose-to-25-50%');
});
it('Hepatic', () => {
  const r = Engine.HepaticDosing({ childPugh: 'B', drug: 'warfarin' });
  assertEq(r.plan, 'reduce-dose-25%');
});
it('AC-Reversal', () => {
  const r = Engine.AnticoagReversal({ drug: 'warfarin', bleed: 'major' });
  assertEq(r.plan, 'vitamin-K-and-4F-PCC');
});
it('AKI', () => {
  const r = Engine.AKIvancomycin({ trough: 26, scr: 2.2, baseline: 1 });
  assertEq(r.plan, 'AKI-and-hold-vanco-and-switch');
});
it('Amino', () => {
  const r = Engine.Aminoglycoside({ drug: 'gentamicin', peak: 4, trough: 1 });
  assertEq(r.plan, 'increase-dose');
});
it('PK', () => {
  const r = Engine.PharmacokineticConsult({ drug: 'digoxin', indication: 'arrhythmia' });
  assertEq(r.plan, 'level-and-renal');
});
it('IVPO', () => {
  const r = Engine.IVtoPO({ drug: 'linezolid', tolerance: 'tolerating', gi: 'intact' });
  assertEq(r.plan, 'switch-to-PO');
});
it('Sub', () => {
  const r = Engine.TherapeuticSubstitution({ original: 'omeprazole', indication: 'general' });
  assertEq(r.plan, 'substitute-pantoprazole');
});
it('Poly', () => {
  const r = Engine.Polypharmacy({ meds: 12, interactions: 0 });
  assertEq(r.plan, 'moderate-polypharmacy-and-review');
});
it('Allergy', () => {
  const r = Engine.AllergyReconcile({ reaction: 'anaphylaxis', severity: 'severe' });
  assertEq(r.plan, 'strict-avoidance-and-alert');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
