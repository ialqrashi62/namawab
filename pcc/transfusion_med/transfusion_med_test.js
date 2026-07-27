// P3-AP: Transfusion-Medicine unit tests
const Engine = require('./transfusion_med_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transfusion_med engine tests:');
it('BloodType O-A', () => {
  const r = Engine.BloodTypeCompatibility({ recipientABO: 'O', donorABO: 'A' });
  assertEq(r.compatible, false);
});
it('Massive Transfusion', () => {
  const r = Engine.MassiveTransfusionProtocol({ sbp: 80, shockIndex: 1.5, lactate: 5, mechanism: 'penetrating' });
  assertEq(r.activate, 'activate-MTP-immediately');
});
it('Platelet refractoriness', () => {
  const r = Engine.PlateletRefractoriness({ preCount: 10, postCount: 25, weight: 70 });
  assertEq(r.refractoriness, 'adequate-response');
});
it('TRALI', () => {
  const r = Engine.TransfusionReaction({ temperature: 37, dyspnea: true, hypotension: true });
  assertEq(r.type, 'anaphylaxis-or-TRALI-stop-and-support');
});
it('RhIg', () => {
  const r = Engine.RhIgProphylaxis({ motherRh: 'negative', babyRh: 'positive', postpartum: true });
  assertEq(r.dose, '300mcg-RhoGAM-postpartum');
});
it('ComponentRatio', () => {
  const r = Engine.ComponentTherapyRatio({ prbcUnits: 10, ffpUnits: 6, plateletUnits: 6 });
  assertEq(r.interpretation, 'balanced-ratio-good');
});
it('Transfusion threshold', () => {
  const r = Engine.TransfusionThreshold({ hemoglobin: 6, activeBleed: true });
  assertEq(r.threshold, 'transfuse-immediately-bleeding');
});
it('Platelet threshold', () => {
  const r = Engine.PlateletThreshold({ plateletCount: 80, neurosurgery: true });
  assertEq(r.threshold, 'transfuse-neurosurgery-100');
});
it('FFP', () => {
  const r = Engine.FFPTransfusion({ inr: 4.0, bleeding: true });
  assertEq(r.threshold, 'transfuse-FFP-bleeding-INR-1.5');
});
it('Cryo', () => {
  const r = Engine.CryoprecipitateDosing({ fibrinogen: 0.8, bleeding: true });
  assertEq(r.threshold, 'transfuse-cryo-10-units-emergent');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
