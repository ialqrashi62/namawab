// P3-AW: Vestibular-Rehab unit tests
const Engine = require('./vestibular_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('vestibular_rehab engine tests:');
it('Dix-Hallpike', () => {
  const r = Engine.DixHallpike({ nystagmus: 'upbeating-torsional', latency: 5, duration: 30, fatigability: 'fatigable' });
  assertEq(r.diagnosis, 'posterior-BPPV-right');
});
it('Head impulse', () => {
  const r = Engine.HeadImpulse({ side: 'right', gain: 0.6, correctiveSaccade: 'overt' });
  assertEq(r.result, 'abnormal-HIT-right-vestibular-loss');
});
it('Romberg', () => {
  const r = Engine.RombergTest({ eyesOpen: 'stable', eyesClosed: 'falls', duration: 30 });
  assertEq(r.result, 'positive-Romberg-vestibular-proprioceptive-loss');
});
it('DVA', () => {
  const r = Engine.DynamicVisualAcuity({ staticVA: '20/20', dynamicVA: '20/200', axis: 'yaw' });
  assertEq(r.classification, 'severe-DVA-loss-oscillopsia');
});
it('Gaze stability', () => {
  const r = Engine.GazeStability({ velocity: 80, duration: 30, symptoms: 'severe' });
  assertEq(r.result, 'severe-oscillopsia-gaze-stability-VRT');
});
it('Vestibular migraine', () => {
  const r = Engine.VestibularMigraine({ vertigoDuration: 4, headache: 'migrainous', photophobia: true, aura: false });
  assertEq(r.diagnosis, 'vestibular-migraine-likely');
});
it('Meniere', () => {
  const r = Engine.MeniereAttack({ episodes: 3, hearingLoss: 'low-frequency', tinnitus: true, fullness: true });
  assertEq(r.classification, 'definite-Meniere-by-AAO-HNS');
});
it('Balance', () => {
  const r = Engine.BalanceAssessment({ bergScore: 30, tugTime: 18, falls: 0 });
  assertEq(r.result, 'moderate-balance-impairment-balance-PT');
});
it('VOR', () => {
  const r = Engine.VORAdaptation({ gain: 0.5, phaseLead: 10, suppress: 0.3 });
  assertEq(r.result, 'reduced-VOR-gain-VRT-needed');
});
it('PPPD', () => {
  const r = Engine.PPPD({ duration: 8, motionTrigger: true, visualDep: 'high', neuroWorkup: 'normal' });
  assertEq(r.diagnosis, 'PPPD-by-Barany-Society-criteria');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
