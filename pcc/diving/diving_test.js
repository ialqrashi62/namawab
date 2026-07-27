// P3-AU: Diving unit tests
const Engine = require('./diving_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('diving engine tests:');
it('DCS', () => {
  const r = Engine.DCSAssessment({ ascent: 'rapid', symptoms: 'neurologic' });
  assertEq(r.severity, 'DCS-Type-II-severe-neurologic-emergent-hyperbaric');
});
it('AGE', () => {
  const r = Engine.ArterialGasEmbolism({ ascent: 'rapid', timeToSymptoms: 5 });
  assertEq(r.diagnosis, 'AGE-immediate-hyperbaric-treatment');
});
it('Narcosis', () => {
  const r = Engine.NitrogenNarcosis({ depth: 70 });
  assertEq(r.severity, 'severe-narcosis-300-feet-rapture-of-the-deep');
});
it('O2 toxicity', () => {
  const r = Engine.OxygenToxicity({ ppo2: 1.7, symptoms: 'seizure' });
  assertEq(r.risk, 'CNS-O2-toxicity-seizure-emergent-ascend');
});
it('Dive computer', () => {
  const r = Engine.DiveComputerProfile({ depth: 30, time: 30 });
  assertEq(r.profile, 'deco-stop-required-USN-Table');
});
it('Fitness', () => {
  const r = Engine.DiveMedicalFitness({ condition: 'pneumothorax-history' });
  assertEq(r.fitness, 'disqualifying-condition');
});
it('Barotrauma', () => {
  const r = Engine.Barotrauma({ descent: 'rapid', equalization: false });
  assertEq(r.injury, 'middle-ear-barotrauma');
});
it('Gas mix', () => {
  const r = Engine.GasMixture({ oxygen: 36, depth: 25 });
  assertEq(r.mixture, 'enriched-nitrogen-nitrox');
});
it('Surface support', () => {
  const r = Engine.SurfaceSupport({ emergency: true, responseTime: 90 });
  assertEq(r.support, 'no-emergency-response-unsafe');
});
it('Long-term', () => {
  const r = Engine.DivingInjuryLongTerm({ exposures: 200, decompressionSickness: true });
  assertEq(r.outcome, 'DCI-with-residual-impairment');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
