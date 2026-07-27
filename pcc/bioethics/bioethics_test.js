// P3-AN: Bioethics unit tests
const Engine = require('./bioethics_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  ✓ ' + name); passed++; }
  catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('bioethics engine tests:');
it('CapacityAssessment full', () => {
  const r = Engine.CapacityAssessment({ understanding: 5, appreciation: 5, reasoning: 5, expressingChoice: 5 });
  assertEq(r.capacity, 'full-capacity');
});
it('DNR comfort', () => {
  const r = Engine.DNRStatusReview({ codeStatus: 'comfort-care', polstForm: true });
  assertEq(r.classification, 'comfort-care-hospice');
});
it('WithdrawalOfCare', () => {
  const r = Engine.WithdrawalOfCare({ lifeSustainingTherapy: 'vasopressors', familyAgreement: true, ethicsConsult: true, daysSinceDiscussion: 7 });
  assertEq(r.pathway, 'withdrawal-vasopressors-comfort');
});
it('Surrogate spouse', () => {
  const r = Engine.SurrogateDecisionMaker({ hierarchyPreference: 'spouse', patientLacksCapacity: true, surrogateAvailable: true, conflictOfInterest: false });
  assertEq(r.valid, true);
});
it('InformedConsent valid', () => {
  const r = Engine.InformedConsentValidity({ patientUnderstood: true, voluntaryDecision: true, informationDisclosed: true, capacityConfirmed: true, languageBarrier: false });
  assertEq(r.valid, true);
});
it('EthicsConsult emergent', () => {
  const r = Engine.EthicsConsultation({ urgency: 'emergent', dilemma: 'end-of-life', multidisciplinary: true });
  assertEq(r.responseTime, 'immediate-1h');
});
it('AdvanceDirective complete', () => {
  const r = Engine.AdvanceDirectiveReview({ livingWill: true, healthcareProxy: true, polst: true, datedWithin5Years: true });
  assertEq(r.completeness, 'complete-triple-document');
});
it('MedicalFutility', () => {
  const r = Engine.MedicalFutilityAssessment({ quantitativeFutility: true, physicianConsensus: 2 });
  assertEq(r.pathway, 'quantitative-futile-multidisciplinary-discussion');
});
it('MCS', () => {
  const r = Engine.MinimallyConsciousState({ consciousnessLevel: 'conscious', responseConsistency: 'consistent', communicationAbility: 'verbal', motorFunction: 'purposeful' });
  assertEq(r.diagnosis, 'conscious-communicative');
});
it('Pediatric best interest', () => {
  const r = Engine.PediatricBestInterest({ childAge: 5, parentalDecision: 'consent', matureMinorDoctrine: false, harm: 'minimal' });
  assertEq(r.framework, 'parental-consent-with-best-interest');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
