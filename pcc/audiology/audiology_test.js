'use strict';

const Engine = require('./audiology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('audiology engine tests', () => {
  it('SNHL severe', () => {
    const r = Engine.PureToneAudiometry({ pta500: 70, pta1000: 70, pta2000: 75, pta4000: 75 });
    assertEq(r.grade, 'severe-SNHL');
  });
  it('asymmetry 30dB', () => {
    const r = Engine.AsymmetricHearingLoss({ rightEar: 20, leftEar: 60 });
    assertEq(r.assessment, 'asymmetric-30dB-differential-needed');
  });
  it('TTS recovery', () => {
    const r = Engine.TinnitusSeverity({ loudness: 8, distress: 7, durationMonths: 3, hearingLoss: false });
    assertEq(r.category, 'moderate-TTS-restore');
  });
  it('ABR retro-cochlear', () => {
    const r = Engine.ABRThreshold({ latencies: { waveV: 6.0 }, interpeak: 'prolonged', cochlearVsRetro: 'retro-cochlear' });
    assertEq(r.interpretation, 'retro-cochlear-mass-rule-out');
  });
  it('OAE fail refer', () => {
    const r = Engine.OtoacousticEmissions({ snrRatio: 2, age: 1 });
    assertEq(r.result, 'refer');
  });
  it('aided WRS good', () => {
    const r = Engine.WordRecognitionScore({ wordScore: 70, presentationLevel: 50 });
    assertEq(r.category, 'good-aided-candidate');
  });
  it('CI candidate excellent', () => {
    const r = Engine.CochlearImplantCandidate({ ptaBilateral: 100, wrs: 30, age: 60, durationDeafness: 5 });
    assertEq(r.candidacy, 'excellent-candidate-CI');
  });
  it('hyperacusis severe', () => {
    const r = Engine.Hyperacusis({ loudnessDiscomfortLevel: 50, noiseAvoidance: 'extreme' });
    assertEq(r.severity, 'severe-hyperacusis');
  });
  it('vestibular central', () => {
    const r = Engine.VestibularAssessment({ caloricAsymmetry: 25, directionNystagmus: 'vertical' });
    assertEq(r.localization, 'central-vestibular');
  });
  it('presbycusis severe', () => {
    const r = Engine.PresbycusisProgression({ age: 80, highFrequencyPTA: 70, speechPTA: 50 });
    assertEq(r.severity, 'severe-presbycusis');
  });
});

console.log(`\naudiology engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
