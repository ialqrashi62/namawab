// P3-AW: Lymphedema unit tests
const Engine = require('./lymphedema_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('lymphedema engine tests:');
it('Stage', () => {
  const r = Engine.LymphedemaStage({ tissueTexture: 'non-pitting', skinFold: 2, fibrotic: false, historyDuration: 60 });
  assertEq(r.stage, 'stage-3-chronic-lipedema');
});
it('Volume', () => {
  const r = Engine.LimbVolume({ limbCircumferences: [10, 20, 30, 40, 50, 60, 70] });
  assertEq(typeof r.volumeMl, 'number');
});
it('Excess', () => {
  const r = Engine.LymphedemaExcess({ affectedVol: 3000, unaffectedVol: 2000 });
  assertEq(r.excessPct, 50);
  assertEq(r.classification, 'very-severe-lymphedema-over-40-percent');
});
it('Compression class', () => {
  const r = Engine.CompressionClass({ stage: 3, activity: 'maintenance', arterial: 'intact' });
  assertEq(r.cls, 'class-3-high-compression-or-class-3-flat-knit');
});
it('MLD', () => {
  const r = Engine.MLDTechnique({ quadrant: 'upper-extremity-proximal', fibrosis: false, intact: true });
  assertEq(r.technique, 'proximal-clearing-first-then-distal');
});
it('Exercise', () => {
  const r = Engine.ExerciseLymphedema({ compression: true, intensity: 'low', mode: 'aerobic' });
  assertEq(r.plan, 'low-impact-aerobic-with-compression-30-min-5x-week');
});
it('Skin care', () => {
  const r = Engine.SkinCare({ skinCondition: 'intact', cellulitisEpisodes: 0, fungalRisk: false });
  assertEq(r.care, 'pH-neutral-cleanser-and-emollient-daily');
});
it('Risk', () => {
  const r = Engine.LymphedemaRisk({ axillaryDissection: true, radiation: true, bmi: 30, sentinel: false });
  assertEq(r.risk, 'very-high-risk-BCRL');
});
it('PCT', () => {
  const r = Engine.PneumaticCompression({ homeUse: true, pressure: 50, hoursPerDay: 2 });
  assertEq(r.plan, 'home-pneumatic-compression-daily');
});
it('Pediatric', () => {
  const r = Engine.PediatricLymphedema({ age: 1, primary: true, milroy: true, lateOnset: false });
  assertEq(r.plan, 'Milroy-disease-pediatric-lymphatic-team-and-genetic-counseling');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
