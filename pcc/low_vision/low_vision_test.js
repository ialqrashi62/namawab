// P3-AZ: Low-Vision unit tests
const Engine = require('./low_vision_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('low_vision engine tests:');
it('Assessment', () => {
  const r = Engine.LowVisionAssessment({ acuity: '20/200', visualField: 'constricted', contrast: 'reduced', glare: 'high' });
  assertEq(r.classification, 'legally-blind-or-tunnel-vision');
});
it('Magnification', () => {
  const r = Engine.MagnificationRx({ task: 'near-reading', acuity: '20/100', target: '20/30', workingDistance: 40 });
  assertEq(r.power, 8.3);
});
it('VF', () => {
  const r = Engine.VisualField({ defect: 'hemianopia', laterality: 'right', onset: 'acute' });
  assertEq(r.classification, 'stroke-or-TIA-immediate-neuro');
});
it('Contrast', () => {
  const r = Engine.ContrastSensitivity({ logCS: 0.3, age: 70, lighting: 'photopic' });
  assertEq(r.result, 'severe-contrast-loss');
});
it('AT', () => {
  const r = Engine.AssistiveTech({ task: 'reading', vision: '20/100', techAccess: 'high', dexterity: 'normal' });
  assertEq(r.plan, 'CCTV-and-tablet-with-zoom');
});
it('ADL', () => {
  const r = Engine.ADL({ reading: 'cannot', writing: 'cannot', selfCare: 'independent', mealPrep: 'limited' });
  assertEq(r.plan, 'non-visual-alternatives-and-audio');
});
it('O&M', () => {
  const r = Engine.MobilityOM({ vision: '20/200', field: 'tunnel', familiarEnv: 'yes', travelAlone: 'no' });
  assertEq(r.plan, 'white-cane-and-O-and-M-training');
});
it('Driving', () => {
  const r = Engine.LowVisionDriving({ vision: '20/40', field: 'normal', contrast: 'normal', history: 'no' });
  assertEq(r.status, 'meets-most-state-vision-requirements');
});
it('Pediatric', () => {
  const r = Engine.PedLowVision({ age: 4, condition: 'ROP', vision: '20/200', school: 'mainstream' });
  assertEq(r.plan, 'pre-school-low-vision-services');
});
it('Outcome', () => {
  const r = Engine.LowVisionOutcome({ pre: 50, post: 90, scale: 'visual-function', weeksElapsed: 8 });
  assertEq(r.pctChange, 80);
  assertEq(r.result, 'large-functional-gain');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
