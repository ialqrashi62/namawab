// P3-BK sports_med_ext unit tests
const Engine = require('./sports_med_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('sports_med_ext engine tests:');
it('Conc', () => {
  const r = Engine.Concussion({ symptoms: 'mild', loss: 'no', scat5: 40 });
  assertEq(r.plan, 'graded-return-and-24h-rest');
});
it('ACL', () => {
  const r = Engine.ACL({ tear: 'complete', instability: 'severe', activity: 'competitive' });
  assertEq(r.plan, 'ACL-reconstruction-and-PT');
});
it('RC', () => {
  const r = Engine.RotatorCuff({ tear: 'full-thickness', active: 'overhead' });
  assertEq(r.plan, 'surgical-repair');
});
it('Tend', () => {
  const r = Engine.Tendinopathy({ chronic: 'yes', site: 'achilles' });
  assertEq(r.plan, 'eccentric-loading-and-heavy-slow-resistance');
});
it('Stress', () => {
  const r = Engine.StressFracture({ site: 'femoral-neck', risk: 'high' });
  assertEq(r.plan, 'MRI-and-ortho-urgent');
});
it('OT', () => {
  const r = Engine.Overtraining({ fatigue: 'severe', performance: 'declining', hormones: 'normal' });
  assertEq(r.plan, 'complete-rest-2w-and-eval');
});
it('Dope', () => {
  const r = Engine.DopingScreen({ substance: 'EPO', consent: 'no' });
  assertEq(r.plan, 'sample-and-send-WADA');
});
it('SCD', () => {
  const r = Engine.SuddenCardiac({ family: 'yes', echo: 'normal', symptom: 'syncope' });
  assertEq(r.plan, 'urgent-cardiology-and-MRI');
});
it('PPE', () => {
  const r = Engine.Preparticipation({ cardiovascular: 'cleared', musculo: 'cleared' });
  assertEq(r.plan, 'cleared');
});
it('Recov', () => {
  const r = Engine.RecoveryProtocol({ phase: 'subacute', injury: 'muscle-strain' });
  assertEq(r.plan, 'gentle-stretch-and-isometric');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
