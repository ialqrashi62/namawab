// P3-BL rehab_ext2 unit tests
const Engine = require('./rehab_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('rehab_ext2 engine tests:');
it('Stroke', () => {
  const r = Engine.StrokeRehab({ phase: 'subacute', funcStatus: 'low' });
  assertEq(r.plan, 'intensive-PT-and-OT');
});
it('TBI', () => {
  const r = Engine.TBIRehab({ severity: 'severe', days: 60 });
  assertEq(r.plan, 'PT-OT-ST-and-cognitive');
});
it('SCI', () => {
  const r = Engine.SPInjury({ level: 'T7-L2', complete: 'incomplete' });
  assertEq(r.plan, 'PT-and-ambulation');
});
it('Amputee', () => {
  const r = Engine.Amputee({ level: 'transfemoral', days: 90 });
  assertEq(r.plan, 'prosthetic-fitting-and-gait');
});
it('Card', () => {
  const r = Engine.CardiacRehab({ phase: 'II', mets: 4 });
  assertEq(r.plan, 'ECG-monitored-aerobic');
});
it('Pulm', () => {
  const r = Engine.PulmonaryRehab({ fev1: 25, dyspnea: 'mild' });
  assertEq(r.plan, 'oxygen-and-graded-exercise');
});
it('Burn', () => {
  const r = Engine.BurnRehab({ tbsa: 40, contracture: 'no' });
  assertEq(r.plan, 'positioning-and-splinting-and-early-PT');
});
it('JR', () => {
  const r = Engine.JointRepl({ day: 7, joint: 'knee' });
  assertEq(r.plan, 'PT-and-ROM-and-strength');
});
it('Pain', () => {
  const r = Engine.PainRehab({ chronicity: 'chronic', catastrophizing: 'yes' });
  assertEq(r.plan, 'CBT-and-PT-and-graded-activity');
});
it('Pros', () => {
  const r = Engine.ProstheticUse({ hours: 3, gait: 'abnormal' });
  assertEq(r.plan, 'gait-training-and-socket-fit');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
