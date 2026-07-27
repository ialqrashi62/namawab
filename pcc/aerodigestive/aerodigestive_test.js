// P3-AN: Aerodigestive unit tests
const Engine = require('./aerodigestive_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  ✓ ' + name); passed++; }
  catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('aerodigestive engine tests:');
it('DysphagiaSeverity', () => {
  const r = Engine.DysphagiaSeverity({ dietLevel: 'puree', aspirationRisk: 'severe', swallowStudy: 'FEES' });
  assertEq(r.severity, 'severe-dysphagia-NPO');
});
it('AspirationPneumoniaRisk', () => {
  const r = Engine.AspirationPneumoniaRisk({ dysphagia: true, gerd: true, age: 80 });
  assertEq(r.risk, 'very-high-risk-aspiration-precaution');
});
it('AirwayCompromise', () => {
  const r = Engine.AirwayCompromiseAssessment({ stridor: true, tumorSize: 3 });
  assertEq(r.severity, 'severe-airway-emergent-tracheostomy-consideration');
});
it('ENTCancerStaging', () => {
  const r = Engine.ENTCancerStaging({ tumorSite: 'larynx', tStage: 'T4', nStage: 'N2', mStage: 'M0' });
  assertEq(r.stageGroup, 'Stage-IV-advanced-local');
});
it('FeedingTube', () => {
  const r = Engine.FeedingTubeDecision({ dysphagiaSeverity: 'severe', nutritionStatus: 'malnourished', aspirationRisk: 'high', expectedRecovery: 'months' });
  assertEq(r.decision, 'PEG-recommended');
});
it('GERDComplication', () => {
  const r = Engine.GERDComplication({ esophagitis: 'severe', symptoms: 'severe' });
  assertEq(r.complication, 'severe-esophagitis-PPI-and-repeat');
});
it('VoiceTherapy', () => {
  const r = Engine.VoiceTherapyPlan({ diagnosis: 'nodules', severity: 'mild', voiceUse: 'professional' });
  assertEq(r.plan, 'voice-therapy-8-weeks-reassess');
});
it('Manometry', () => {
  const r = Engine.EsophagealManometry({ motilityPattern: 'aperistalsis', lesPressure: 20, peristalsis: 'absent' });
  assertEq(r.diagnosis, 'achalasia-type-II');
});
it('MDT', () => {
  const r = Engine.AerodigestiveClinicMDT({ ent: true, gi: true, pulmonology: true, speech: true, nutrition: true, complex: true });
  assertEq(r.mdt, 'full-aerodigestive-MDT-comprehensive');
});
it('Pediatric', () => {
  const r = Engine.PediatricAerodigestive({ age: 2, primaryIssue: 'aspiration', chronicity: 'chronic' });
  assertEq(r.pathway, 'pediatric-aspiration-MDT-SLP-GI-pulm');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
