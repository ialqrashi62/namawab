// P3-AZ: Prosthetics-Orthotics unit tests
const Engine = require('./prosthetics_orthotics_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('prosthetics_orthotics engine tests:');
it('Prosthetic', () => {
  const r = Engine.ProstheticPrescription({ level: 'trans-tibial', side: 'right', activity: 'K3', comorbidities: 'none' });
  assertEq(r.prescription, 'trans-tibial-prosthesis-ptb-suspension-K3-feet');
});
it('Socket', () => {
  const r = Engine.SocketFit({ suspension: 'suction', liner: 'silicone', stumpVolume: 'stable', pressure: 'even' });
  assertEq(r.result, 'suction-with-silicone-liner-excellent-fit');
});
it('Orthotic', () => {
  const r = Engine.OrthoticPrescription({ condition: 'drop-foot', side: 'right', activity: 'community-ambulator', skin: 'intact' });
  assertEq(r.prescription, 'ankle-FO-or-AFO-with-articulating-joint');
});
it('Scoliosis', () => {
  const r = Engine.OrthoticScoliosis({ cobbAngle: 30, age: 12, growth: 'Risser-2', curvePattern: 'thoracic' });
  assertEq(r.plan, 'TLSO-full-time-18-to-23-hours');
});
it('Gait', () => {
  const r = Engine.ProstheticGait({ deviation: 'circumduction', prostheticSide: 'right', weeksPost: 6 });
  assertEq(r.result, 'prosthesis-too-long-or-knee-stiff');
});
it('Training', () => {
  const r = Engine.ProstheticTraining({ phase: 'gait-training', weeksPost: 6, level: 'trans-tibial', comorbidity: 'none' });
  assertEq(r.plan, 'TT-gait-training-parallel-bars-to-community');
});
it('Complications', () => {
  const r = Engine.OrthoticComplications({ skinBreakdown: true, pistoning: false, volumeChange: false, pain: 'none' });
  assertEq(r.result, 'skin-care-and-pad-and-revisit');
});
it('K-level', () => {
  const r = Engine.ActivityKLevel({ community: true, household: false, age: 30, comorbidity: 'none' });
  assertEq(r.level, 'K3-varied-community-and-recreational');
});
it('Pedi', () => {
  const r = Engine.PediatricProsthetic({ age: 4, level: 'trans-radial', side: 'right', etiology: 'congenital' });
  assertEq(r.plan, 'body-powered-pediatric-prosthesis');
});
it('Followup', () => {
  const r = Engine.DeviceFollowup({ monthsFit: 2, skin: 'intact', funcStatus: 'improved', volume: 'stable' });
  assertEq(r.plan, 'regular-followup-every-2-to-4-weeks');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
