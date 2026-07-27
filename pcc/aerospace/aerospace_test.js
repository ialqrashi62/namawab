// P3-AT: Aerospace unit tests
const Engine = require('./aerospace_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('aerospace engine tests:');
it('Cabin', () => {
  const r = Engine.CabinAltitude({ flightLevel: 41000 });
  assertEq(r.altitude, 'high-cabin-altitude-supplemental-O2');
});
it('G-LOC', () => {
  const r = Engine.GForceTolerance({ gForce: 9, direction: 'positive' });
  assertEq(r.effect, 'extreme-G-LOC-risk');
});
it('Disorient', () => {
  const r = Engine.SpatialDisorientation({ type: 'graveyard-spiral', weatherCondition: 'IMC' });
  assertEq(r.risk, 'classic-fatal-spiral');
});
it('Hypoxia', () => {
  const r = Engine.HypoxiaTraining({ altitudeSimulated: 40000 });
  assertEq(r.classification, 'rapid-hypoxia-TUC-15-30s');
});
it('Dehydration', () => {
  const r = Engine.CirculationDecrease({ alcoholUnits: 5 });
  assertEq(r.risk, 'severe-dehydration-and-GLOC');
});
it('Clearance', () => {
  const r = Engine.AviationMedicalClearance({ pilotClass: 1, condition: 'stable' });
  assertEq(r.status, 'Class-1-cleared');
});
it('Evac', () => {
  const r = Engine.AeromedicalEvacuation({ evacLevel: 'urgent', patient: 'critical' });
  assertEq(r.plan, 'aeromed-Critical-Care-Team-IMMEDIATE');
});
it('Survival', () => {
  const r = Engine.AviationSurvival({ environment: 'arctic' });
  assertEq(r.survival, 'arctic-survival-shelter-and-fire');
});
it('AirSickness', () => {
  const r = Engine.AirSickness({ symptom: 'vomiting', severity: 'moderate' });
  assertEq(r.management, 'meclizine-or-scopolamine');
});
it('Fatigue', () => {
  const r = Engine.AviationStressFactors({ sleepHours: 3 });
  assertEq(r.fatigue, 'severe-fatigue-ground-the-pilot');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
