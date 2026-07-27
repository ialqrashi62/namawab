// P3-AY: Hippotherapy unit tests
const Engine = require('./hippotherapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('hippotherapy engine tests:');
it('Eval', () => {
  const r = Engine.HippotherapyEval({ age: 8, indication: 'cerebral-palsy', gmfc: 3, contraindications: 'none', weight: 25 });
  assertEq(r.eligibility, 'eligible-pediatric-hippotherapy');
});
it('Horse', () => {
  const r = Engine.HorseSelection({ riderLevel: 'beginner', indication: 'balance', horse: 'matching-needed' });
  assertEq(r.pairing, 'gentle-therapy-horse-smooth-gait');
});
it('Gait', () => {
  const r = Engine.GaitOnHorse({ cadence: 60, symmetry: 'symmetric', pelvicMotion: '3D', duration: 30 });
  assertEq(r.result, 'optimal-walk-cadence-therapeutic');
});
it('Pedi', () => {
  const r = Engine.PediatricHippotherapy({ age: 6, diagnosis: 'CP-spastic-diplegia', tone: 'spastic', goals: 'balance' });
  assertEq(r.plan, 'spastic-diplegia-balance-and-gait-hippotherapy');
});
it('Adult', () => {
  const r = Engine.AdultHippotherapy({ age: 35, indication: 'stroke', hemiparesis: 'left', balance: 'Berg-30', goals: 'gait' });
  assertEq(r.plan, 'post-stroke-left-hemi-gait-and-balance-hippotherapy');
});
it('Contra', () => {
  const r = Engine.HippotherapyContra({ scoliosis: 'mild', hip: 'normal', fracture: 'none', seizure: 'controlled', allergy: 'none' });
  assertEq(r.safe, 'precaution-ortho-clearance');
});
it('Session', () => {
  const r = Engine.SessionStructure({ phases: 'standard', minutes: 45, staffing: '1-leader-2-side-walkers' });
  assertEq(r.structure, 'mount-5-warm-up-10-hippotherapy-25-cool-down-5');
});
it('Progress', () => {
  const r = Engine.ProgressMeasure({ baselineBerg: 30, currentBerg: 45, weeksElapsed: 12, baselineGMFM: 50, currentGMFM: 60 });
  assertEq(r.bergDelta, 15);
  assertEq(r.result, 'large-improvement-hippotherapy-effective');
});
it('Safety', () => {
  const r = Engine.SafetyProtocol({ helmet: true, vest: true, stirrups: 'safety', weather: 'clear' });
  assertEq(r.safety, 'all-safety-checked-proceed');
});
it('Discharge', () => {
  const r = Engine.HippotherapyDischarge({ goalsMet: true, transitionPlan: 'transition-to-riding-or-home', familyIndependence: 'high' });
  assertEq(r.ready, 'ready-for-discharge-or-transition-to-recreational-riding');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
