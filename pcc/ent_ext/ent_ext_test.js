// P3-BL ent_ext unit tests
const Engine = require('./ent_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('ent_ext engine tests:');
it('HL', () => {
  const r = Engine.HearingLoss({ type: 'sensorineural', severity: 'severe' });
  assertEq(r.plan, 'cochlear-implant-eval');
});
it('Vert', () => {
  const r = Engine.Vertigo({ type: 'BPPV', nystagmus: 'yes' });
  assertEq(r.plan, 'Epley-maneuver');
});
it('Tin', () => {
  const r = Engine.Tinnitus({ duration: 8, unilateral: 'no' });
  assertEq(r.plan, 'CBT-and-sound-therapy');
});
it('Sinus', () => {
  const r = Engine.Sinusitis({ chronic: 'no', polyps: 'no' });
  assertEq(r.plan, 'saline-and-INCS-and-abx');
});
it('OSA', () => {
  const r = Engine.OSA({ ahi: 35, bmi: 28 });
  assertEq(r.plan, 'CPAP-and-weight-loss');
});
it('Hoarse', () => {
  const r = Engine.Hoarseness({ duration: 5, smoker: 'yes' });
  assertEq(r.plan, 'urgent-laryngoscopy');
});
it('Epi', () => {
  const r = Engine.Epistaxis({ severity: 'severe', posterior: 'yes' });
  assertEq(r.plan, 'posterior-pack-and-IR');
});
it('Dys', () => {
  const r = Engine.Dysphagia({ phase: 'oropharyngeal', chronic: 'no' });
  assertEq(r.plan, 'SLP-eval-and-modified-diet');
});
it('Thy', () => {
  const r = Engine.Thyroid({ tsh: 1, nodule: 'yes' });
  assertEq(r.plan, 'thyroid-ultrasound-and-FNA');
});
it('Otit', () => {
  const r = Engine.Otitis({ type: 'OME', age: 5, recurrent: 'yes' });
  assertEq(r.plan, 'tympanostomy-tubes');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
