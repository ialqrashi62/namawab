// P3-BI rad_ext unit tests
const Engine = require('./rad_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('rad_ext engine tests:');
it('CT', () => {
  const r = Engine.CTHead({ presentation: 'stroke-alert', gcs: 12 });
  assertEq(r.plan, 'CTA-and-CTP-and-tPA');
});
it('MRI', () => {
  const r = Engine.MRIProtocol({ organ: 'brain', question: 'stroke' });
  assertEq(r.plan, 'DWI-and-MRA-and-perfusion');
});
it('US', () => {
  const r = Engine.Ultrasound({ organ: 'gallbladder', question: 'stones' });
  assertEq(r.plan, 'RUQ-US-and-cholecystitis-eval');
});
it('Reaction', () => {
  const r = Engine.ContrastReaction({ severity: 'severe', symptom: 'anaphylaxis' });
  assertEq(r.plan, 'epinephrine-and-emergency');
});
it('Dose', () => {
  const r = Engine.RadiationDose({ modality: 'CT', age: 10, study: 'chest' });
  assertEq(r.plan, 'low-dose-CT-and-pediatric-protocol');
});
it('Biopsy', () => {
  const r = Engine.Biopsy({ target: 'pancreas', risk: 'high', imaging: 'CT' });
  assertEq(r.plan, 'EUS-FNA-and-cytology');
});
it('Pedi', () => {
  const r = Engine.PediatricDose({ weight: 8, modality: 'CT' });
  assertEq(r.plan, 'weight-based-CT-dose');
});
it('IV', () => {
  const r = Engine.IVContrastRenal({ gfr: 20, study: 'CT' });
  assertEq(r.plan, 'low-dose-and-nephrology-consult');
});
it('Quality', () => {
  const r = Engine.ImageQuality({ motion: 'severe', bmi: 25, organ: 'lung' });
  assertEq(r.plan, 'repeat-and-sedation');
});
it('Crit', () => {
  const r = Engine.CriticalFinding({ finding: 'PE-massive', time: 0 });
  assertEq(r.plan, 'immediate-call-and-thrombolysis');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
