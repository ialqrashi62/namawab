// P3-AY: Aquatic-Therapy unit tests
const Engine = require('./aquatic_therapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('aquatic_therapy engine tests:');
it('Assessment', () => {
  const r = Engine.AquaticAssessment({ age: 40, indication: 'low-back-pain', waterComfort: 'high', incontinence: 'none', wounds: 'none' });
  assertEq(r.eligibility, 'ideal-aquatic-PT-indicated');
});
it('Pool', () => {
  const r = Engine.PoolSelection({ temp: 33, depth: 'chest-depth', modality: 'therapeutic-pool', therapyType: 'aquatic-PT' });
  assertEq(r.pool, 'warm-therapeutic-pool-32-to-34-C');
});
it('Exercise', () => {
  const r = Engine.AquaticExercise({ goal: 'ROM', joint: 'shoulder', resistance: 'water', minutes: 30 });
  assertEq(r.plan, 'shoulder-ROM-AAROM-in-water-30-min');
});
it('Joint', () => {
  const r = Engine.BadelogicJoint({ joint: 'knee', weeksPost: 8, load: 'partial-weight', surgery: 'TKA' });
  assertEq(r.plan, 'aquatic-PT-TKA-partial-weight-bear-6-to-12-weeks');
});
it('Rheum', () => {
  const r = Engine.RheumatologyAquatic({ diagnosis: 'fibromyalgia', diseaseActivity: 'low', pain: 7, stiffness: 'morning' });
  assertEq(r.plan, 'warm-aquatic-low-intensity-fibromyalgia');
});
it('Neuro', () => {
  const r = Engine.NeuroAquatic({ diagnosis: 'stroke', side: 'right', berg: 30, weeksPost: 12 });
  assertEq(r.plan, 'post-stroke-hemi-balance-aquatic');
});
it('Safety', () => {
  const r = Engine.AquaticSafety({ depth: 'waist-depth', staff: 'CPR-certified', emergency: 'ready', poolFloor: 'non-slip' });
  assertEq(r.safety, 'standard-depth-with-trained-staff');
});
it('Halliwick', () => {
  const r = Engine.Hallwick({ age: 8, ability: 'learning', population: 'pediatric-disability' });
  assertEq(r.stage, 'Hallwick-4-to-7-disengagement-and-control');
});
it('Cardiac', () => {
  const r = Engine.AquaticCardiac({ cardiacStatus: 'post-MI', weeksPost: 8, intensity: 'low', ejectionFraction: 45 });
  assertEq(r.plan, 'low-intensity-aquatic-CR-supervised');
});
it('Dosing', () => {
  const r = Engine.AquaticDosing({ sessionsPerWeek: 3, minutesPerSession: 45, weeks: 12 });
  assertEq(r.totalHours, 27);
  assertEq(r.intensity, 'standard-aquatic-PT');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
