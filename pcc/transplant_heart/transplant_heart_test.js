// P3-AP: Transplant-Heart unit tests
const Engine = require('./transplant_heart_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transplant_heart engine tests:');
it('UNOS-1A TAH', () => {
  const r = Engine.UNOSStatus({ mechanicalSupport: 'total-artificial-heart' });
  assertEq(r.status, 'UNOS-1A-Total-Artificial-Heart');
});
it('DonorMatch', () => {
  const r = Engine.DonorMatching({ recipientABO: 'O', donorABO: 'A', donorCrossmatch: 'negative', hlaMismatch: 4 });
  assertEq(r.match, 'incompatible-ABO-reject');
});
it('RHF', () => {
  const r = Engine.RightHeartFailure({ cvp: 20, ci: 1.5 });
  assertEq(r.severity, 'severe-RV-failure-mechanical-support-needed');
});
it('Rejection 3R', () => {
  const r = Engine.HeartTransplantRejection({ biopsyGrade: '3R', daysPostTransplant: 30 });
  assertEq(r.classification, 'acute-rejection-severe-treat');
});
it('CMV prophylaxis', () => {
  const r = Engine.CMVProphylaxisHeart({ donorCMV: 'positive', recipientCMV: 'negative' });
  assertEq(r.risk, 'high-risk-primary-CMV');
});
it('CAV severe', () => {
  const r = Engine.CardiacAllograftVasculopathy({ ivusFindings: 'severe-stenosis', lvef: 30 });
  assertEq(r.severity, 'severe-CAV-revascularization-or-retransplant');
});
it('Immunosuppression', () => {
  const r = Engine.ImmunosuppressionHeart({ yearsPostTransplant: 3 });
  assertEq(r.regimen, 'dual-tacrolimus-MMF-or-mTOR');
});
it('PTLD', () => {
  const r = Engine.PostTransplantLymphoma({ ebvStatus: 'negative', immunosuppression: 'high' });
  assertEq(r.risk, 'very-high-PTLD-risk-reduction-needed');
});
it('WaitlistMortality', () => {
  const r = Engine.HeartWaitlistMortality({ age: 70, status: 'UNOS-6', egfr: 25 });
  assertEq(r.mortalityRisk, 'very-high-1-year-mortality');
});
it('Pediatric', () => {
  const r = Engine.PediatricHeartTransplant({ age: 0.5, weight: 4, congenitalVsAcquired: 'congenital' });
  assertEq(r.pathway.includes('infant-transplant'), true);
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
