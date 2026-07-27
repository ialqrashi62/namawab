// P3-AS: Lab-Specialty unit tests
const Engine = require('./lab_specialty_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('lab_specialty engine tests:');
it('Tumor marker', () => {
  const r = Engine.TumorMarkerInterpretation({ cea: 6 });
  assertEq(r.interpretation, 'markedly-elevated-suspicious-malignancy');
});
it('Culture', () => {
  const r = Engine.CultureSensitivity({ organism: 'mrsa', sensitivities: { vanco: 'S', dapto: 'S' } });
  assertEq(r.pathway, 'MRSA-vanco-susceptible-treat');
});
it('Critical value K', () => {
  const r = Engine.CriticalValue({ value: 7, test: 'potassium' });
  assertEq(r.critical, 'critical-call-immediately');
});
it('Coagulation DIC', () => {
  const r = Engine.CoagulationInterpretation({ fibrinogen: 80, dDimer: 2 });
  assertEq(r.interpretation, 'DIC-cryo-and-FFP');
});
it('Hepatic acute', () => {
  const r = Engine.HepaticFunctionPanel({ alt: 1500, ast: 800 });
  assertEq(r.pattern, 'acute-hepatocellular-injury');
});
it('Renal AKI', () => {
  const r = Engine.RenalFunctionTrend({ cr1: 1, cr3: 2.5, hours: 24 });
  assertEq(r.trend, 'AKI-stage-1-2-or-3-rapid-rise');
});
it('Cardiac biomarker', () => {
  const r = Engine.CardiacBiomarker({ troponin: 0.6, delta: 0.2 });
  assertEq(r.interpretation, 'acute-MI-elevated-and-rising');
});
it('CBC severe', () => {
  const r = Engine.CBCInterpretation({ hemoglobin: 6 });
  assertEq(r.interpretation, 'severe-anemia-transfuse');
});
it('Gram stain', () => {
  const r = Engine.MicrobiologyGramStain({ gramStain: 'gram-positive', morphology: 'cocci-in-clusters' });
  assertEq(r.interpretation, 'staph-aureus-suspected-MRSA-cover-pending-culture');
});
it('Blood culture', () => {
  const r = Engine.BloodCultureInterpretation({ bottle1: 'positive', bottle2: 'positive' });
  assertEq(r.interpretation, 'true-bacteremia-treat-fully');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
