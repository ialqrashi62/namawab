// P3-AV: Hand-Therapy unit tests
const Engine = require('./hand_therapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('hand_therapy engine tests:');
it('Grip', () => {
  const r = Engine.GripStrength({ grip: 40, age: 40 });
  assertEq(r.classification, 'normal-grip');
});
it('Pinch', () => {
  const r = Engine.PinchStrength({ tipPinch: 7, lateralPinch: 9, threeJawPinch: 9 });
  assertEq(r.classification, 'mild-pinch-weakness');
});
it('CARPA', () => {
  const r = Engine.CARPA({ thumbIPFlexion: 30, thumbIPExtension: 15, thumbPalmarAbduction: 20, thumbRadialAbduction: 10, thumbOpposition: 5 });
  assertEq(r.assessment, 'mild-loss-of-thumb-ROM');
});
it('CARPA total', () => {
  const r = Engine.CARPATotal({ shoulderFlexion: 180, shoulderExtension: 60, shoulderAbduction: 180, shoulderExternal: 90, shoulderInternal: 70, elbowFlexion: 150, elbowExtension: 0, forearmPronation: 80, forearmSupination: 80, wristFlexion: 80, wristExtension: 70, wristRadial: 20, wristUlnar: 30, fingerFlexion: 90, fingerExtension: 0, fingerAbduction: 30, thumbTotal: 100 });
  assertEq(r.upperExtremity > 500, true);
});
it('Tinel', () => {
  const r = Engine.TinelSign({ nerve: 'median', location: 'wrist', symptoms: 'positive' });
  assertEq(r.interpretation, 'positive-Tinel-carpal-tunnel-syndrome');
});
it('Phalen', () => {
  const r = Engine.PhalenTest({ duration: 30, symptoms: 'positive' });
  assertEq(r.result, 'Phalen-positive-carpal-tunnel');
});
it('Dupuytren', () => {
  const r = Engine.DupuytrenContracture({ palmNodule: true, pretendinousCord: true, mcpContracture: 35, pipContracture: 35 });
  assertEq(r.stage, 'severe-Dupuytren-candidate-for-surgery');
});
it('Flexor tendon', () => {
  const r = Engine.FlexorTendonRepair({ zone: 2, weeksPost: 2 });
  assertEq(r.status, 'early-protected-motion');
});
it('CRPS', () => {
  const r = Engine.RSDSCRPS({ pain: 8, swelling: true, temperatureChange: true, weeksPost: 6 });
  assertEq(r.diagnosis, 'CRPS-stage-1-warm-edematous');
});
it('Splinting', () => {
  const r = Engine.Splinting({ condition: 'CTS', splintType: 'wrist-cock-up', durationWeeks: 6, dayOrNight: 'night' });
  assertEq(r.recommendation, 'night-wrist-cock-up-6-weeks-CTS');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
