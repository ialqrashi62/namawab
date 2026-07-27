// P3-AQ: ECMO-Service unit tests
const Engine = require('./ecmo_service_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('ecmo_service engine tests:');
it('Indication cardiac', () => {
  const r = Engine.ECMOIndication({ indication: 'cardiac', age: 50 });
  assertEq(r.pathway, 'VA-ECMO-cardiogenic-shock');
});
it('Indication respiratory', () => {
  const r = Engine.ECMOIndication({ indication: 'respiratory', age: 30 });
  assertEq(r.pathway, 'VV-ECMO-ARDS');
});
it('Contraindication', () => {
  const r = Engine.ECMOContraindication({ age: 50, gcs: 3 });
  assertEq(r.absolute, 'severe-anoxic-brain-injury');
});
it('Recovery', () => {
  const r = Engine.VAECMONativeHeartRecovery({ lvef: 55, pulsatility: 'strong', lactate: 1.0 });
  assertEq(r.recoveryChance, 'excellent-recovery-consider-weaning');
});
it('VV weaning', () => {
  const r = Engine.VVECMOWeaning({ pao2: 90, fio2: 0.4, tidalVolume: 6, secretions: 'manageable', daysOnECMO: 7 });
  assertEq(r.ready, 'ready-to-wean-VV-ECMO');
});
it('Complication', () => {
  const r = Engine.ECMOComplication({ pumpFailure: true });
  assertEq(r.severity, 'catastrophic-pump-failure-emergent-circuit-change');
});
it('Anticoag', () => {
  const r = Engine.AnticoagulationECMO({ aPTT: 90, bleeding: true });
  assertEq(r.pathway, 'hold-anticoagulation-and-transfuse');
});
it('Sedation', () => {
  const r = Engine.ECMOSedation({ paralysisNeeded: true });
  assertEq(r.regimen, 'deep-sedation-plus-paralysis-cisatracurium');
});
it('Weaning trial', () => {
  const r = Engine.ECMOWeaningTrial({ pumpFlow: 3.5, hemodynamicsStable: true, ejectionFraction: 40, lactate: 1.0 });
  assertEq(r.trial, 'eligible-for-trial-off');
});
it('Outcomes', () => {
  const r = Engine.ECMOOutcomes({ indication: 'ecpr' });
  assertEq(r.survival, 'low-20-30-percent-survival');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
