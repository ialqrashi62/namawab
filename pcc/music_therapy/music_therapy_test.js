// P3-AX: Music-Therapy unit tests
const Engine = require('./music_therapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('music_therapy engine tests:');
it('Assessment', () => {
  const r = Engine.MusicTherapyAssessment({ age: 30, diagnosis: 'depression', musicalBackground: 'guitar-5y', engagement: 'high', goals: 'emotional-expression' });
  assertEq(r.plan, 'active-music-making-improvisation-and-songwriting');
});
it('RAS', () => {
  const r = Engine.RhythmicEntrainment({ activity: 'gait-training', bpm: 110, motorPattern: 'normal', cognitiveLoad: 'low' });
  assertEq(r.prescription, 'RAS-gait-cadence-110-bpm');
});
it('NMT', () => {
  const r = Engine.NeuroMusicTherapy({ deficit: 'Parkinson', technique: 'RAS', severity: 'moderate' });
  assertEq(r.protocol, 'RAS-Rhythmic-Auditory-Stimulation-gait');
});
it('Pain', () => {
  const r = Engine.MusicPain({ painScore: 5, anxiety: 'moderate', procedure: 'wound-care', musicPref: 'patient-preferred' });
  assertEq(r.plan, 'patient-preferred-music-listening-30-min');
});
it('Pediatric', () => {
  const r = Engine.PediatricMusic({ age: 1, indication: 'procedural-anxiety', developmental: 'typical', parentAvailable: true });
  assertEq(r.plan, 'infant-directed-singing-and-lullaby');
});
it('Palliative', () => {
  const r = Engine.MusicPalliative({ goals: 'legacy', lucidity: 'full', family: 'engaged', symptoms: 'pain-anxiety' });
  assertEq(r.plan, 'songwriting-legacy-project-or-life-review-song');
});
it('Inpatient', () => {
  const r = Engine.MusicInpatient({ setting: 'ICU', indication: 'delirium', depth: 'agitated' });
  assertEq(r.plan, 'preferred-music-30-to-60-min-and-orienting-cues');
});
it('Psychiatric', () => {
  const r = Engine.MusicPsychiatric({ diagnosis: 'schizophrenia', symptoms: 'auditory-hallucinations', engagement: 'moderate' });
  assertEq(r.plan, 'active-music-making-and-songwriting-to-replace-voice');
});
it('Dosing', () => {
  const r = Engine.MusicDosing({ activeMinutes: 30, receptiveMinutes: 30, sessionsPerWeek: 5, duration: 8 });
  assertEq(r.totalWeeklyMin, 300);
  assertEq(r.intensity, 'intensive-music-therapy');
});
it('Outcome', () => {
  const r = Engine.MusicOutcome({ preScore: 80, postScore: 30, scale: 'pain-VAS', weeksElapsed: 6 });
  assertEq(r.pctChange, 63);
  assertEq(r.result, 'large-effect-music-therapy');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
