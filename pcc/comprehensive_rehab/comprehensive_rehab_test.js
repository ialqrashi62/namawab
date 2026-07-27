// P3-BD: Comprehensive-Rehab unit tests
const Engine = require('./comprehensive_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('comprehensive_rehab engine tests:');
it('CR', () => {
  const r = Engine.ComprehensiveRehab({ dx: 'stroke', weeks: 8, priorFIM: 80, currentFIM: 105, goal: 'home' });
  assertEq(r.plan, 'comprehensive-stroke-rehab-and-discharge');
});
it('FIM', () => {
  const r = Engine.FIMScore({ motor: 60, cognition: 25, age: 60 });
  assertEq(r.total, 85);
  assertEq(r.classification, 'modified-dependence');
});
it('FIM gain', () => {
  const r = Engine.WeissFIMGain({ admissionFIM: 60, dischargeFIM: 100, lengthOfStay: 28, dx: 'stroke' });
  assertEq(r.fcm, 1.4);
  assertEq(r.result, 'moderate-FIM-efficiency-stroke');
});
it('PT intensity', () => {
  const r = Engine.PTIntensity({ sessionsPerDay: 2, minutesPerSession: 30, weeks: 4 });
  assertEq(r.totalHours, 28);
  assertEq(r.intensity, 'standard-PT-2-hours-day');
});
it('OT', () => {
  const r = Engine.OT({ goal: 'ADL', adlScore: 3, weeks: 3 });
  assertEq(r.plan, 'ADL-training-and-adapted-equipment');
});
it('SLP', () => {
  const r = Engine.SLP({ goal: 'dysphagia', diet: 'NPO', cog: 'normal' });
  assertEq(r.plan, 'MBSS-and-dysphagia-therapy');
});
it('Team', () => {
  const r = Engine.RehabTeam({ setting: 'IRF', staff: 'interdisciplinary', family: 'engaged', intensity: '3-hours' });
  assertEq(r.plan, 'standard-IRF-team-and-CMS-rule');
});
it('Discharge', () => {
  const r = Engine.RehabDischarge({ fim: 105, homeSupport: 'family', equipment: 'obtained', homeMods: 'complete' });
  assertEq(r.plan, 'ready-for-discharge-home');
});
it('Outcome', () => {
  const r = Engine.RehabOutcome({ preFIM: 50, postFIM: 90, preBarthel: 30, postBarthel: 60, weeksElapsed: 6 });
  assertEq(r.fimPct, 80);
  assertEq(r.result, 'large-functional-recovery');
});
it('Payment', () => {
  const r = Engine.RehabPayment({ setting: 'IRF', payer: 'Medicare', caseload: 'mix' });
  assertEq(r.plan, 'IRF-PPS-and-60%-rule-and-3-hour');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
