// P3-AO: Hospice unit tests
const Engine = require('./hospice_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('hospice engine tests:');
it('HospiceEligibility', () => {
  const r = Engine.HospiceEligibility({ prognosis: 3, lifeLimiting: 'cancer' });
  assertEq(r.eligibility, 'eligible-hospice-referral');
});
it('ContinuousHomeCare', () => {
  const r = Engine.ContinuousHomeCare({ symptom: 'pain', crisisType: 'acute', familyCapable: true });
  assertEq(r.pathway, 'continuous-home-care-8-24h-nursing');
});
it('LevinePhase', () => {
  const r = Engine.LevinePhaseModel({ phase: 'dying', days: 1 });
  assertEq(r.phase, 'dying-24h-nursing-and-bereavement-prep');
});
it('Bereavement13Month', () => {
  const r = Engine.BereavementCare13Month({ monthsSinceLoss: 0 });
  assertEq(r.pathway, 'immediate-bereavement-contact');
});
it('SymptomCrisis', () => {
  const r = Engine.SymptomCrisisAssessment({ seizures: true });
  assertEq(r.pathway, 'emergent-crisis-911-or-GIP-transfer');
});
it('LevelsOfCare', () => {
  const r = Engine.LevelsOfCare({ symptoms: 'uncontrolled', caregiverBurden: 'high' });
  assertEq(r.level, 'general-inpatient-hospice-GIP');
});
it('VoluntaryStoppingEating', () => {
  const r = Engine.VoluntaryStoppingEating({ conscious: true, days: 5 });
  assertEq(r.pathway, 'mid-phase-oral-care-and-family-support');
});
it('PrognosticIndicator', () => {
  const r = Engine.PrognosticIndicator({ PPS: 20, albumin: 2.0, delirium: true });
  assertEq(r.prognosis, 'days-1-7');
});
it('MedicationKit', () => {
  const r = Engine.HospiceMedicationKit({ symptoms: ['pain', 'dyspnea'] });
  assertEq(r.kit.includes('morphine-solution'), true);
});
it('FamilyMeetingGoals', () => {
  const r = Engine.FamilyMeetingGoals({ conflict: true, familyPresent: 5 });
  assertEq(r.pathway, 'family-conference-with-ethics-and-social-work');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
