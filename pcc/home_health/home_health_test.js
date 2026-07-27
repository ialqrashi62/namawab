// P3-BC: Home-Health unit tests
const Engine = require('./home_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('home_health engine tests:');
it('Eligibility', () => {
  const r = Engine.HomeHealthEligibility({ age: 75, postAcute: 'yes', homebound: 'homebound', skilledNeed: 'skilled-nursing' });
  assertEq(r.eligibility, 'eligible-Medicare-HH-30-day-cert');
});
it('OASIS', () => {
  const r = Engine.OASISAssessment({ functional: 20, mobility: 'bedbound', cognition: 'normal', wounds: 'none', pain: 4 });
  assertEq(r.risk, 'high-risk-functional-decline');
});
it('PT', () => {
  const r = Engine.HomePT({ phase: 'HHA-PT', sessionsPerWeek: 3, weeks: 4, goal: 'community-mobility' });
  assertEq(r.plan, 'community-mobility-and-ambulation-2-to-3x-week');
});
it('Nursing', () => {
  const r = Engine.HomeHealthNursing({ dx: 'CHF', visitsPerWeek: 3, weeks: 4, medTeach: 'yes' });
  assertEq(r.plan, 'CHF-HHNPV-and-daily-weights-and-diuretic');
});
it('Med rec', () => {
  const r = Engine.MedicationReconciliation({ medCount: 12, duplications: 2, otcHerbs: 4, caregiver: 'present' });
  assertEq(r.plan, 'extensive-reconciliation-and-pharmacy-referral');
});
it('Discharge', () => {
  const r = Engine.HomeHealthDischarge({ goalsMet: 'yes', familyTrained: 'yes', communityResources: 'set', followup: 'scheduled' });
  assertEq(r.plan, 'ready-for-discharge-comprehensive-plan');
});
it('Outcome', () => {
  const r = Engine.HomeHealthOutcome({ preOASIS: 50, postOASIS: 80, scale: 'M1860-ambulation', weeksElapsed: 6 });
  assertEq(r.pctChange, 60);
  assertEq(r.result, 'large-functional-improvement');
});
it('Wound', () => {
  const r = Engine.HomeHealthWound({ woundType: 'surgical', visitsPerWeek: 3, weeks: 4 });
  assertEq(r.plan, 'surgical-wound-HHNPV-and-sterile-technique');
});
it('Cardiac', () => {
  const r = Engine.HomeHealthCardiac({ dx: 'CHF', ejectionFraction: 20, medsCompliant: 'no' });
  assertEq(r.plan, 'high-risk-CHF-and-HH-and-CRT');
});
it('Pedi', () => {
  const r = Engine.HomeHealthPedi({ age: 2, dx: 'prematurity', caregivers: 'present', technology: 'apnea-monitor' });
  assertEq(r.plan, 'apnea-monitor-and-HH-monitoring');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
