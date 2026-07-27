// P3-AY: Child-Life unit tests
const Engine = require('./child_life_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('child_life engine tests:');
it('Assessment', () => {
  const r = Engine.ChildLifeAssessment({ age: 6, hospitalStress: 'high', coping: 'limited', family: 'present', priorExperience: 'none' });
  assertEq(r.plan, 'medical-play-and-procedural-preparation');
});
it('Procedural prep', () => {
  const r = Engine.ProceduralPreparation({ age: 7, procedure: 'IV-start', child: 'anxious', parent: 'present', prior: 'none' });
  assertEq(r.plan, 'step-by-step-medical-play-and-doll-demo');
});
it('Medical play', () => {
  const r = Engine.MedicalPlay({ age: 5, materials: 'dolls-stethoscope', setting: 'bedside', goal: 'familiarization' });
  assertEq(r.plan, 'medical-doll-and-stethoscope-exploration');
});
it('Distraction', () => {
  const r = Engine.DistractionToolbox({ age: 8, procedure: 'venipuncture', parent: 'engaged', sensory: 'visual' });
  assertEq(r.toolset, 'book-tablet-and-parent-coaching');
});
it('Pain', () => {
  const r = Engine.PainCoping({ painLevel: 5, anxiety: 'high', age: 8, parent: 'present' });
  assertEq(r.plan, 'parent-coaching-and-comfort-positioning');
});
it('Hospital school', () => {
  const r = Engine.HospitalSchool({ age: 10, grade: 5, admission: 'extended', learning: 'typical' });
  assertEq(r.plan, 'hospital-school-coordination-with-home-school');
});
it('Sibling', () => {
  const r = Engine.SiblingSupport({ sibAge: 12, sibStress: 'high', parents: 'depleted', visitAllowed: false });
  assertEq(r.plan, 'sibling-support-group-and-counseling-referral');
});
it('EOL', () => {
  const r = Engine.EndOfLifeChild({ age: 6, condition: 'terminal', lucidity: 'full', family: 'present', legacy: 'wanted' });
  assertEq(r.plan, 'legacy-building-handprint-molds-and-memory-book');
});
it('Dosing', () => {
  const r = Engine.ChildLifeDosing({ minutesPerSession: 30, sessionsPerWeek: 5, weeks: 4 });
  assertEq(r.totalHours, 10);
  assertEq(r.intensity, 'standard-child-life');
});
it('Discharge', () => {
  const r = Engine.ChildLifeDischarge({ preparationComplete: true, familyTrained: true, community: 'identified', followup: 'set' });
  assertEq(r.ready, 'ready-for-discharge-with-support-plan');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
