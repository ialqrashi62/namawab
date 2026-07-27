// P3-AP: Transplant-Liver unit tests
const Engine = require('./transplant_liver_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transplant_liver engine tests:');
it('MELD high', () => {
  const r = Engine.MELDScore({ bilirubin: 10, inr: 3.0, creatinine: 2.0 });
  assertEq(r.meld >= 25, true);
});
it('ChildPugh C', () => {
  const r = Engine.ChildPughScore({ bilirubin: 5, albumin: 2.5, inr: 2.0, ascites: 'refractory', encephalopathy: 'grade-3-4' });
  assertEq(r.class, 'C');
});
it('Allocation', () => {
  const r = Engine.AllocationMELD({ meld: 38, bloodType: 'O' });
  assertEq(r.priority, 'top-1-percent-priority');
});
it('HCC', () => {
  const r = Engine.HCCBridgeTherapy({ tumorSize: 4, withinMilan: true });
  assertEq(r.pathway, 'large-tumor-TACE-or-ablation');
});
it('ALF', () => {
  const r = Engine.AcuteLiverFailure({ encephalopathy: 'grade-3-4', inr: 2.0, daysSince: 5 });
  assertEq(r.classification, 'fulminant-ACLF-KCH-criteria-met');
});
it('Sepsis in cirrhosis', () => {
  const r = Engine.SepsisInCirrhosis({ sofaScore: 12, map: 60 });
  assertEq(r.severity, 'septic-shock-icu');
});
it('PortalHTN', () => {
  const r = Engine.PortalHypertension({ hvg: 14, varices: 'high-risk' });
  assertEq(r.severity, 'clinically-significant-portal-hypertension');
});
it('HRS', () => {
  const r = Engine.HepatorenalSyndrome({ cirrhosis: true, creatinine: 2.0, noResponse: true, diureticWithdrawal: true });
  assertEq(r.type, 'HRS-AKI-terlipressin-or-norepinephrine');
});
it('Rejection', () => {
  const r = Engine.PostTransplantRejectionLiver({ daysPost: 30, biopsy: 'acute-rejection-moderate' });
  assertEq(r.classification, 'acute-rejection-thymoglobulin');
});
it('LiveDonor', () => {
  const r = Engine.LiveDonorLiver({ age: 35, remnantLiver: 70, donorLiverFat: 5, donorBMI: 25 });
  assertEq(r.suitability, 'ideal-donor');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
