// P3-AU: Mountain unit tests
const Engine = require('./mountain_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('mountain engine tests:');
it('HACE', () => {
  const r = Engine.AltitudeSickness({ altitudeMeters: 5000, symptoms: 'cerebral' });
  assertEq(r.diagnosis, 'HACE-cerebral-edema-emergent');
});
it('HAPE', () => {
  const r = Engine.AltitudeSickness({ altitudeMeters: 4500, symptoms: 'pulmonary' });
  assertEq(r.diagnosis, 'HAPE-pulmonary-edema-emergent');
});
it('AMS', () => {
  const r = Engine.AltitudeSickness({ altitudeMeters: 3500, symptoms: 'headache-nausea' });
  assertEq(r.diagnosis, 'moderate-AMS-acetazolamide-and-descend');
});
it('Frostbite', () => {
  const r = Engine.FrostbiteRisk({ windChillC: -40 });
  assertEq(r.risk, 'extreme-frostbite-risk-minutes');
});
it('Hypothermia', () => {
  const r = Engine.Hypothermia({ coreTempC: 25, conscious: false });
  assertEq(r.severity, 'severe-hypothermia-cardiac-arrhythmia-risk');
});
it('Avalanche', () => {
  const r = Engine.AvalancheRescue({ burial: 'full', timeBurial: 50, airway: 'compromised' });
  assertEq(r.rescue, 'survival-very-low-ALS-protocol');
});
it('Acclimatization', () => {
  const r = Engine.Acclimatization({ daysAtAltitude: 1, sleepingAltitude: 4000 });
  assertEq(r.status, 'insufficient-acclimatization');
});
it('Snow blindness', () => {
  const r = Engine.SnowBlindness({ uvExposure: 'extreme', glassesUV: 'poor' });
  assertEq(r.injury, 'severe-photokeratitis-imminent');
});
it('Mountain rescue', () => {
  const r = Engine.MountainRescue({ incident: 'HAPE' });
  assertEq(r.plan, 'helicopter-rescue-immediate');
});
it('Meds', () => {
  const r = Engine.MountainMedications({ altitudeMeters: 5000 });
  assertEq(r.medications, 'acetazolamide-dexamethasone-nifedipine');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
