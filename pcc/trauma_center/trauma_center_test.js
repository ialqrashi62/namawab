// P3-AQ: Trauma-Center unit tests
const Engine = require('./trauma_center_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('trauma_center engine tests:');
it('Activation-1', () => {
  const r = Engine.TraumaActivationLevel({ gcs: 6, sbp: 100 });
  assertEq(r.activation, 'trauma-1-highest-activation');
});
it('ISS', () => {
  const r = Engine.ISS({ ais1: 4, ais2: 3, ais3: 1, ais4: 0, ais5: 0, ais6: 0 });
  assertEq(r.severity, 'critical-25-or-greater');
});
it('Hemorrhage', () => {
  const r = Engine.HemorrhageClass({ bloodLoss: 2500, weight: 70 });
  assertEq(r.class, 'class-IV-severe');
});
it('Penetrating', () => {
  const r = Engine.PenetratingInjury({ site: 'abdomen', hardSigns: true });
  assertEq(r.pathway, 'immediate-OR-exploration');
});
it('Blunt', () => {
  const r = Engine.BluntTrauma({ mechanism: 'pedestrian-struck' });
  assertEq(r.pathway, 'pan-scan-and-trauma-team');
});
it('FAST', () => {
  const r = Engine.FocusedAssessment({ pericardial: 'yes' });
  assertEq(r.finding, 'pericardial-effusion-emergent-pericardiocentesis-or-OR');
});
it('Airway', () => {
  const r = Engine.TraumaAirway({ gcs: 6 });
  assertEq(r.decision, 'definitive-airway-intubate-immediately');
});
it('C-spine', () => {
  const r = Engine.CervicalSpineClearance({ gcs: 15, mechanism: 'low-risk', imaging: 'normal' });
  assertEq(r.pathway, 'cleared-clinically-no-imaging-needed-NEXUS');
});
it('Reversal', () => {
  const r = Engine.TraumaReversalAnticoagulation({ anticoagulant: 'warfarin', inr: 3, intracranial: true });
  assertEq(r.pathway, '4F-PCC-and-vitamin-K-emergent');
});
it('Pediatric', () => {
  const r = Engine.PediatricTrauma({ age: 0.5 });
  assertEq(r.pathway, 'infant-trauma-PICU');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
