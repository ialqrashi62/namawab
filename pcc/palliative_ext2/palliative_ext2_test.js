// P3-BG palliative_ext2 unit tests
const Engine = require('./palliative_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('palliative_ext2 engine tests:');
it('Symptom', () => {
  const r = Engine.SymptomBurden({ pain: 8, dyspnea: 8, fatigue: 8, nausea: 8 });
  assertEq(r.plan, 'severe-symptom-burden-and-escalate-palliative-care');
});
it('Prognosis', () => {
  const r = Engine.PrognosisEst({ ecog: 3, albumin: 2, delirium: 'yes' });
  assertEq(r.plan, 'end-of-life-and-hospice-eligible');
});
it('AD', () => {
  const r = Engine.AdvanceDirective({ codeStatus: 'full-code', proxy: 'no', wishes: 'documented' });
  assertEq(r.plan, 'AD-discussion-and-complete-form');
});
it('Hospice', () => {
  const r = Engine.HospiceEval({ lifeLimit: '<6mo', functionalDecline: 'yes', caregiver: 'yes' });
  assertEq(r.plan, 'hospice-eligible-and-refer');
});
it('Pain', () => {
  const r = Engine.PainRefractory({ opDose: 250, adjuvants: 'no', sideEffects: 'mild' });
  assertEq(r.plan, 'add-adjuvants-and-rotate-opioid');
});
it('Dyspnea', () => {
  const r = Engine.DyspneaMgmt({ oxygen: 'no', anxiety: 'mild', cause: 'CHF' });
  assertEq(r.plan, 'diuresis-and-morphine');
});
it('Delirium', () => {
  const r = Engine.DeliriumTerminal({ reversible: 'no', agitation: 'severe', family: 'present' });
  assertEq(r.plan, 'haloperidol-and-family-support');
});
it('Nutrition', () => {
  const r = Engine.NutritionHydration({ intake: 'minimal', prognosis: 'days', wishes: 'oral' });
  assertEq(r.plan, 'comfort-feeds-and-ice-chips');
});
it('Grief', () => {
  const r = Engine.GriefBereavement({ stage: 'complicated', duration: 8, support: 'present' });
  assertEq(r.plan, 'bereavement-counseling-and-refer');
});
it('Caregiver', () => {
  const r = Engine.CaregiverBurnout({ hours: 20, stress: 'severe', respite: 'no' });
  assertEq(r.plan, 'respite-care-and-emergency-relief');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
