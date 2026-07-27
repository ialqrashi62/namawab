// P3-AN: Chaplaincy unit tests
const Engine = require('./chaplaincy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  ✓ ' + name); passed++; }
  catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('chaplaincy engine tests:');
it('SpiritualAssessment', () => {
  const r = Engine.SpiritualAssessment({ faithTradition: 'muslim', religiousPractice: 'high', spiritualDistress: false, community: 'engaged' });
  assertEq(r.assessment, 'well-supported-by-faith');
});
it('ReligiousAccommodation', () => {
  const r = Engine.ReligiousAccommodation({ accommodationRequested: 'prayer-space', religionAffected: 'muslim', hospitalCapability: 'available' });
  assertEq(r.pathway, 'prayer-room-available');
});
it('GriefBereavement', () => {
  const r = Engine.GriefBereavementStage({ stage: 'denial', daysSinceLoss: 7, supportAvailable: true });
  assertEq(r.stageClassification, 'normal-acute-grief');
});
it('PrayerRitual', () => {
  const r = Engine.PrayerRitualSupport({ ritualRequested: 'prayer', patientConscious: true, familyPresent: true, timeAvailable: 5 });
  assertEq(r.support, 'prayer-5min-routine');
});
it('Liaison', () => {
  const r = Engine.FaithCommunityLiaison({ liaisonRequested: true, religionAffected: 'muslim', familyContact: 'present' });
  assertEq(r.action, 'contact-family-faith-leader');
});
it('MoralObjection', () => {
  const r = Engine.MedicalMoralObjection({ providerObjection: 'conscience', procedure: 'abortion', patientInformed: true, alternativeProvider: true });
  assertEq(r.pathway, 'transfer-care-to-colleague');
});
it('SpiritualDistressScale', () => {
  const r = Engine.SpiritualDistressScale({ meaninglessness: 4, despair: 4, angerAtGod: 4, isolation: 4 });
  assertEq(r.severity, 'severe-spiritual-distress-existential-crisis');
});
it('BereavementFollowup', () => {
  const r = Engine.BereavementFollowup({ daysSinceLoss: 200, familyEngagement: 'engaged' });
  assertEq(r.pathway, 'memorial-event-invitation');
});
it('CulturalCompetency', () => {
  const r = Engine.CulturalCompetency({ patientCulture: 'saudi', language: 'arabic', interpreterAvailable: true, dietary: 'halal', modesty: 'required' });
  assertEq(r.competency, 'language-concordant');
});
it('SacredSpace', () => {
  const r = Engine.SacredSpaceProvision({ spaceRequested: true, religion: 'muslim', roomType: 'private', available: true });
  assertEq(r.provision, 'private-room-sacred-space-provided');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
