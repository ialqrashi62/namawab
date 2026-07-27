// P3-BH cv_ext2 unit tests
const Engine = require('./cv_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('cv_ext2 engine tests:');
it('ACS', () => {
  const r = Engine.ACS({ troponin: 2, stElevation: 'no', grace: 150 });
  assertEq(r.plan, 'NSTEMI-and-early-invasive');
});
it('HF', () => {
  const r = Engine.HeartFailure({ ef: 25, nyha: 3, ntProBNP: 2000 });
  assertEq(r.plan, 'GDMT-and-device-eval-and-transplant');
});
it('Arrhythmia', () => {
  const r = Engine.Arrhythmia({ type: 'VF', hr: 0, stability: 'unstable' });
  assertEq(r.plan, 'defibrillation-and-ACLS');
});
it('Valve', () => {
  const r = Engine.ValveDisease({ lesion: 'AS', severity: 'severe', symptom: 'yes' });
  assertEq(r.plan, 'valve-replacement-and-eval');
});
it('HTN', () => {
  const r = Engine.Hypertension({ sbp: 145, diabetes: 'yes', cvd: 'no' });
  assertEq(r.plan, 'target-130-and-ACE-and-CCB');
});
it('AC', () => {
  const r = Engine.Anticoagulation({ indication: 'AF', cha2ds2: 3, crcl: 60, bleeding: 'no' });
  assertEq(r.plan, 'DOAC-and-monitor');
});
it('Lipid', () => {
  const r = Engine.LipidMgmt({ ldl: 200, risk: 'low', statin: 'none' });
  assertEq(r.plan, 'high-intensity-statin-and-PCSK9');
});
it('PAD', () => {
  const r = Engine.PAD({ abi: 0.7, symptom: 'claudication', restPain: 'no' });
  assertEq(r.plan, 'supervised-exercise-and-statin');
});
it('CMP', () => {
  const r = Engine.Cardiomyopathy({ ef: 20, cause: 'ischemic', family: 'no' });
  assertEq(r.plan, 'revascularization-eval-and-GDMT');
});
it('Pericardial', () => {
  const r = Engine.Pericardial({ effusion: 'large', tamponade: 'no', constriction: 'no' });
  assertEq(r.plan, 'pericardiocentesis-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
