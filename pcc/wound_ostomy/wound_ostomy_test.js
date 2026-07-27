// P3-BA: Wound-Ostomy unit tests
const Engine = require('./wound_ostomy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('wound_ostomy engine tests:');
it('Wound', () => {
  const r = Engine.WoundAssessment({ woundType: 'pressure-injury', stage: 4, size: [5, 4, 2], exudate: 'heavy', tissue: 'slough', infection: 'none' });
  assertEq(r.classification, 'stage-4-or-unstageable-pressure-injury');
});
it('PI stage', () => {
  const r = Engine.PressureInjuryStage({ stage: 3, location: 'sacrum', mobility: 'limited' });
  assertEq(r.plan, 'advanced-dressing-and-debridement-eval');
});
it('Dressing', () => {
  const r = Engine.WoundDressing({ exudate: 'heavy', depth: 'superficial', infection: 'none', tissue: 'granulating' });
  assertEq(r.dressing, 'foam-or-Aquacel-extra-absorbent');
});
it('NPWT', () => {
  const r = Engine.NPWT({ woundSize: [5, 3, 1.5], exudate: 'heavy', infection: 'none', weeks: 2 });
  assertEq(r.plan, 'NPWT-125mmHg-continuous-and-change-every-2-to-3-days');
});
it('Stoma site', () => {
  const r = Engine.OstomySite({ stomaType: 'ileostomy', location: 'RLQ', output: 'liquid', peristomal: 'intact' });
  assertEq(r.plan, 'high-output-ileostomy-electrolyte-eval');
});
it('Complication', () => {
  const r = Engine.StomaComplication({ stomaColor: 'dusky', retraction: false, prolapse: 'none', hernia: 'none' });
  assertEq(r.diagnosis, 'stomal-ischemia-emergent-surgical-eval');
});
it('Infection', () => {
  const r = Engine.WoundInfection({ size: [3, 2, 0.5], erythema: 'spreading', drainage: 'purulent', systemic: 'none', weeks: 1 });
  assertEq(r.diagnosis, 'cellulitis-and-wound-infection-oral-ABX');
});
it('Continence', () => {
  const r = Engine.Continence({ type: 'fecal', frequency: 'daily', severity: 'severe', skin: 'broken-down' });
  assertEq(r.plan, 'IAD-severe-and-bowel-program');
});
it('Outcome', () => {
  const r = Engine.WoundOutcome({ week0: 20, week4: 8, scale: 'PWAT', weeksElapsed: 4 });
  assertEq(r.pctChange, 60);
  assertEq(r.result, 'large-wound-improvement');
});
it('Dosing', () => {
  const r = Engine.WoundDosing({ visitsPerWeek = 3, weeks = 4 } = {});
  assertEq(r.intensity, 'standard-WOCN-care');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
