// P3-BD: Sleep-Medicine-Ext unit tests
const Engine = require('./sleep_medicine_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('sleep_medicine_ext engine tests:');
it('PSG', () => {
  const r = Engine.Polysomnography({ ahi: 35, sleepEfficiency: 80, arousalIndex: 15, sleepStage: 'reduced-REM' });
  assertEq(r.diagnosis, 'severe-OSA');
});
it('OSA tx', () => {
  const r = Engine.OSATreatment({ ahi: 35, bmi: 38, position: 'supine', priorCPAP: 'naive', anatomy: 'normal' });
  assertEq(r.plan, 'CPAP-or-bariatric-and-sleep-surgery');
});
it('CPAP', () => {
  const r = Engine.CPAPAdherence({ hoursPerNight: 5, daysUsed: 25, residualAHI: 3 });
  assertEq(r.adherence, 'excellent-CPAP-adherence-CMS-compliant');
});
it('CBT-I', () => {
  const r = Engine.InsomniaCBTI({ sleepLatency: 60, wakeAfterSleep: 60, totalSleep: 5, sleepAid: 'none' });
  assertEq(r.plan, 'CBT-I-with-stimulus-control-and-restriction');
});
it('Circadian', () => {
  const r = Engine.CircadianDisorder({ shiftWork: 'yes', jetLag: 'no', delayedPhase: 'no', advancedPhase: 'no' });
  assertEq(r.diagnosis, 'shift-work-disorder');
});
it('Pedi', () => {
  const r = Engine.PediatricSleep({ age: 4, parasomnia: 'night-terrors', apnea: 'no', bedtimeResistance: 'no' });
  assertEq(r.plan, 'reassure-and-sleep-hygiene');
});
it('Narcolepsy', () => {
  const r = Engine.Narcolepsy({ cataplexy: 'yes', eds: 'severe', sleepOnset: 'rapid', hallucinations: 'no' });
  assertEq(r.diagnosis, 'narcolepsy-type-1');
});
it('RLS', () => {
  const r = Engine.RestlessLegs({ urge: 'yes', worseAtRest: 'yes', reliefWithMovement: 'yes', ferritin: 25 });
  assertEq(r.diagnosis, 'RLS-by-URGE');
});
it('Med', () => {
  const r = Engine.SleepAndMed({ med: 'SSRI', insomnia: 'severe', sedating: 'no' });
  assertEq(r.plan, 'low-dose-mirtazapine-or-trazodone');
});
it('Outcome', () => {
  const r = Engine.SleepOutcome({ preISI: 22, postISI: 10, preESS: 18, postESS: 8, weeksElapsed: 8 });
  assertEq(r.isiPct, 55);
  assertEq(r.result, 'large-sleep-and-daytime-improvement');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
