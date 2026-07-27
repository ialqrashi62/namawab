// P3-BD: Transplant-Extended unit tests
const Engine = require('./transplant_extended_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transplant_extended engine tests:');
it('Eval', () => {
  const r = Engine.TransplantEval({ organ: 'kidney', age: 50, comorbidities: 'none', compliance: 'good', psychosocial: 'stable' });
  assertEq(r.eligibility, 'eligible-kidney-transplant');
});
it('Donor', () => {
  const r = Engine.LivingDonor({ age: 35, bmi: 25, gfr: 100, comorbidities: 'none', motivation: 'high' });
  assertEq(r.eligibility, 'eligible-living-donor');
});
it('Mismatch', () => {
  const r = Engine.MMFMismatch({ donorAge: 50, recipientAge: 80, donorGFR: 100, recipientWeight: 80, donorWeight: 70 });
  assertEq(r.mismatch, 'high-mismatch-eval-risk');
});
it('Waitlist', () => {
  const r = Engine.Waitlist({ status: 'active', meld: 25, status1A: 'no', timeWaited: 12 });
  assertEq(r.management, 'MELD-20-29-and-3-monthly-eval');
});
it('Post', () => {
  const r = Engine.PostTransplant({ weeksPost: 8, tacLevel: 8, infection: 'none', rejection: 'none', funcStatus: 'stable' });
  assertEq(r.plan, 'maintenance-and-3-monthly-eval');
});
it('Immuno', () => {
  const r = Engine.TransplantImmuno({ regimen: 'tac-MMF-steroid', timeSince: 18, infectionHistory: 'none', rejectionHistory: 'none' });
  assertEq(r.plan, 'consider-steroid-withdrawal');
});
it('Infect', () => {
  const r = Engine.TransplantInfect({ pathogen: 'CMV', weeksPost: 8, viralLoad: 5000, prophylaxis: 'valganciclovir' });
  assertEq(r.plan, 'CMV-treatment-and-IV-ganciclovir');
});
it('Rejection', () => {
  const r = Engine.TransplantRejection({ type: 'cellular', grade: 'IA', weeksPost: 8, responsive: 'unknown' });
  assertEq(r.plan, 'steroid-pulse-and-recheck');
});
it('Surgery', () => {
  const r = Engine.TransplantSurgery({ organ: 'kidney', donorType: 'living', ischemia: 8, recipient: 'first' });
  assertEq(r.plan, 'living-donor-kidney-transplant-and-LDN');
});
it('Outcome', () => {
  const r = Engine.TransplantOutcome({ preGFR: 12, postGFR: 60, scale: 'GFR', weeksElapsed: 12 });
  assertEq(r.pctChange, 400);
  assertEq(r.result, 'large-transplant-success');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
