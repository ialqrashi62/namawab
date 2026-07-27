// P3-AR: Stroke-Ext unit tests
const Engine = require('./stroke_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('stroke_ext engine tests:');
it('NIHSS severe', () => {
  const r = Engine.NIHSS({ levelOfConsciousness: 3, locQuestions: 2, locCommands: 2, gaze: 2, visualFields: 1, facialPalsy: 2, motorArm: 4, motorLeg: 4, limbAtaxia: 1, sensory: 1, language: 2, dysarthria: 1, extinction: 1 });
  assertEq(r.severity, 'severe-stroke');
});
it('tPA eligible', () => {
  const r = Engine.tPAMeta({ nihss: 12, timeOnset: 2, age: 60 });
  assertEq(r.eligible, 'eligible-for-tPA');
});
it('Thrombectomy', () => {
  const r = Engine.Thrombectomy({ largeVesselOcclusion: true, timeOnset: 4, nihss: 18 });
  assertEq(r.eligible, 'eligible-for-thrombectomy');
});
it('Hemorrhagic', () => {
  const r = Engine.HemorrhagicStroke({ location: 'basal-ganglia', volume: 40, gcs: 7 });
  assertEq(r.pathway, 'large-hematoma-consider-surgical-evacuation');
});
it('AF', () => {
  const r = Engine.AtrialFibrillationStroke({ chadsvasc: 5, hasbled: 2, strokeType: 'ischemic' });
  assertEq(r.decision, 'start-OAC-after-hemorrhage-excluded');
});
it('Dysphagia', () => {
  const r = Engine.DysphagiaStroke({ waterSwallowTest: 'fail' });
  assertEq(r.pathway, 'failed-swallow-screen-NPO-and-SLP');
});
it('SecondaryPrev', () => {
  const r = Engine.SecStrokePrev({ strokeType: 'ischemic', daysPost: 30, antiplatelet: 'none' });
  assertEq(r.pathway, 'initiate-aspirin-or-clopidogrel');
});
it('Recovery', () => {
  const r = Engine.StrokeRecovery({ daysPostStroke: 30, nihssInitial: 12, nihssCurrent: 6 });
  assertEq(r.pathway, 'subacute-rehab-intensive');
});
it('Carotid', () => {
  const r = Engine.CarotidStenosis({ stenosis: 80, symptomatic: true });
  assertEq(r.decision, 'CEA-recommended');
});
it('TIA', () => {
  const r = Engine.TIAManagement({ abcde2: 6 });
  assertEq(r.pathway, 'high-7-day-stroke-risk-urgent-imaging-and-treatment');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
