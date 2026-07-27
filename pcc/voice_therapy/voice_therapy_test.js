// P3-AZ: Voice-Therapy unit tests
const Engine = require('./voice_therapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('voice_therapy engine tests:');
it('Eval', () => {
  const r = Engine.VoiceEval({ diagnosis: 'vocal-nodules', severity: 'mild', professional: 'teacher', vhi: 35 });
  assertEq(r.plan, 'vocal-hygiene-and-direct-VT');
});
it('Hygiene', () => {
  const r = Engine.VocalHygiene({ hydration: 'inadequate', phonotrauma: 'moderate', reflux: 'mild', rest: 'partial' });
  assertEq(r.plan, 'hydration-90oz-water-and-voice-rest');
});
it('Disorder', () => {
  const r = Engine.VoiceDisorder({ pitch: 'normal', loudness: 'normal', quality: 'breathy', duration: 7 });
  assertEq(r.diagnosis, 'vocal-fold-paralysis-or-bowing');
});
it('Resonant', () => {
  const r = Engine.SLPResonantVoice({ technique: 'Lee-Silverman', loudness: 'low', dailyPractice: 30 });
  assertEq(r.plan, 'LSVT-LOUD-for-Parkinson');
});
it('Pediatric', () => {
  const r = Engine.PediatricVoice({ age: 6, diagnosis: 'vocal-nodules', parent: 'engaged', therapyType: 'direct' });
  assertEq(r.plan, 'family-centered-VT-and-shouting-chart');
});
it('Singer', () => {
  const r = Engine.VoiceForSinger({ voiceType: 'soprano', complaint: 'fatigue', performance: 'frequent', technique: 'mix' });
  assertEq(r.plan, 'endurance-training-and-vocal-condtioning');
});
it('Trans', () => {
  const r = Engine.TransgenderVoice({ genderIdentity: 'transgender-female', current: 'masculine', goals: 'feminine', pitch: 130 });
  assertEq(r.plan, 'feminine-voice-and-pitch-elevation');
});
it('Laryngectomy', () => {
  const r = Engine.VoiceLaryngectomy({ surgery: 'total-laryngectomy', alaryngeal: 'tracheoesophageal', monthsPost: 3 });
  assertEq(r.plan, 'TEP-voice-prosthesis-and-voice-eval');
});
it('Dosing', () => {
  const r = Engine.VoiceDosing({ minutesPerSession: 45, sessionsPerWeek: 2, weeks: 8 });
  assertEq(r.totalHours, 12);
  assertEq(r.intensity, 'standard-voice-therapy');
});
it('Outcome', () => {
  const r = Engine.VoiceOutcome({ preVHI: 60, postVHI: 20, preCAPE_V: 6, postCAPE_V: 12, weeksElapsed: 8 });
  assertEq(r.vhiPct, 67);
  assertEq(r.result, 'large-clinical-improvement');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
