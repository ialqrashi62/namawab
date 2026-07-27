// P3-BA: Chronic-Pain-Rehab unit tests
const Engine = require('./chronic_pain_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('chronic_pain_rehab engine tests:');
it('Biopsychosocial', () => {
  const r = Engine.PainBiopsychosocial({ painDuration: 6, bpsDomains: { emotional: 'high', social: 'moderate', functional: 'low' } });
  assertEq(r.plan, 'interdisciplinary-pain-rehab-and-CBT');
});
it('Opioid', () => {
  const r = Engine.OpioidStewardship({ morphineEquivalent: 100, duration: 12, indication: 'chronic-non-cancer', risk: 'moderate' });
  assertEq(r.plan, 'high-dose-Opioid-taper-recommend');
});
it('Medication', () => {
  const r = Engine.PainMedication({ medClass: 'NSAID', giRisk: 'high', renal: 'normal', duration: 30 });
  assertEq(r.plan, 'NSAID-with-PPI-or-avoid');
});
it('FRP', () => {
  const r = Engine.FunctionalRestoration({ oswestry: 50, pcm: 'cannot', returnToWork: 'no', weeksIn: 4 });
  assertEq(r.plan, 'intensive-FRP-3-to-4-weeks-full-day');
});
it('Education', () => {
  const r = Engine.PainEducation({ healthLiteracy: 'high', motivation: 'high', fear: 'low' });
  assertEq(r.plan, 'comprehensive-pain-neuroscience-and-self-management');
});
it('Interventional', () => {
  const r = Engine.PainInterventional({ indication: 'radiculopathy', severity: 7, conservativeWeeks: 6 });
  assertEq(r.plan, 'epidural-steroid-injection-eval');
});
it('Pedi', () => {
  const r = Engine.PainPedi({ age: 8, condition: 'CRPS', parent: 'engaged', school: 'impacted' });
  assertEq(r.plan, 'CRPS-intense-PT-and-graded-exposure');
});
it('Sleep', () => {
  const r = Engine.PainAndSleep({ insomnia: 'severe', painPeak: 'evening', sleepHygiene: 'poor' });
  assertEq(r.plan, 'CBT-I-and-sleep-restriction-and-stim-control');
});
it('Dosing', () => {
  const r = Engine.PainDosing({ minutesPerSession: 60, sessionsPerWeek: 5, weeks: 4 });
  assertEq(r.totalHours, 20);
  assertEq(r.intensity, 'standard-pain-rehab');
});
it('Outcome', () => {
  const r = Engine.PainOutcome({ preNRS: 8, postNRS: 4, prePEG: 7, postPEG: 3, weeksElapsed: 12 });
  assertEq(r.nrsPct, 50);
  assertEq(r.result, 'large-pain-reduction-and-functional-gain');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
