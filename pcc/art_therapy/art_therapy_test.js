// P3-AX: Art-Therapy unit tests
const Engine = require('./art_therapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('art_therapy engine tests:');
it('Assessment', () => {
  const r = Engine.ArtTherapyAssessment({ age: 35, diagnosis: 'trauma', goals: 'emotional-expression', medium: 'open', engagement: 'high' });
  assertEq(r.plan, 'open-studio-and-self-directed-art');
});
it('Medium', () => {
  const r = Engine.ArtMedium({ goal: 'affect-regulation', sensory: 'tactile', mobility: 'full' });
  assertEq(r.medium, 'clay-and-sculpture');
});
it('Trauma', () => {
  const r = Engine.ArtTrauma({ trauma: 'PTSD', safety: 'established', disclosure: 'voluntary', dissociation: 'mild' });
  assertEq(r.plan, 'expressive-art-with-controlled-disclosure');
});
it('Group', () => {
  const r = Engine.ArtGroup({ groupSize: 8, population: 'inpatient-psych', focus: 'connection', durationWeeks: 8 });
  assertEq(r.plan, 'themed-art-task-and-group-share');
});
it('Pediatric', () => {
  const r = Engine.ArtPediatric({ age: 4, indication: 'medical-procedural', developmental: 'typical', family: 'present' });
  assertEq(r.plan, 'parent-child-joint-art-task');
});
it('Geriatric', () => {
  const r = Engine.ArtGeriatric({ age: 75, cognition: 'mild-impairment', mobility: 'walker', engagement: 'willing' });
  assertEq(r.plan, 'reminiscence-art-and-life-review');
});
it('Dosing', () => {
  const r = Engine.ArtDosing({ sessionsPerWeek: 4, minutesPerSession: 45, weeks: 12 });
  assertEq(r.totalHours, 36);
  assertEq(r.intensity, 'intensive-art-therapy');
});
it('Inpatient', () => {
  const r = Engine.ArtInpatient({ setting: 'burn', acuity: 'acute', phase: 'inpatient' });
  assertEq(r.plan, 'pain-procedural-art-and-distraction');
});
it('Outcome', () => {
  const r = Engine.ArtOutcome({ preScore: 70, postScore: 40, scale: 'POMS-depression', weeksElapsed: 10 });
  assertEq(r.pctChange, 43);
  assertEq(r.result, 'large-clinical-improvement');
});
it('Digital', () => {
  const r = Engine.ArtDigital({ techAccess: 'high', goal: 'self-expression', motor: 'intact', preference: 'digital' });
  assertEq(r.plan, 'digital-drawing-and-procreate-app');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
