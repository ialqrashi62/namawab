// P3-AO: Clinical-Pharmacology unit tests
const Engine = require('./clinical_pharm_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('clinical_pharm engine tests:');
it('QTRisk', () => {
  const r = Engine.QTRiskAssessment({ drugName: 'sotalol', qtcBaseline: 440, age: 70, female: true });
  assertEq(r.risk, 'high-risk-torsades-avoid');
});
it('CYP450', () => {
  const r = Engine.CytochromeP450({ substrate: 'warfarin', inhibitor: 'fluconazole' });
  assertEq(r.affectedEnzymes.length > 0, true);
});
it('SerotoninSyndrome', () => {
  const r = Engine.SerotoninSyndromeRisk({ serotonergicDrugs: 2, maoi: true });
  assertEq(r.risk, 'high-risk-serotonin-syndrome-avoid-combination');
});
it('NMS', () => {
  const r = Engine.NeurolepticMalignantSyndrome({ temperature: 39, rigidity: 'severe', ckLevel: 1500, recentAntipsychotic: true });
  assertEq(r.risk, 'NMS-confirmed-stop-antipsychotic');
});
it('SJS', () => {
  const r = Engine.StevensJohnsonSyndrome({ drug: 'lamotrigine', rashSeverity: 'severe', mucosalInvolvement: true, onset: 7 });
  assertEq(r.risk, 'high-risk-SJS-stop-immediately');
});
it('Antimicrobial', () => {
  const r = Engine.AntimicrobialStewardship({ culture: 'negative', empiric: 'pip-tazo', daysOnEmpiric: 5 });
  assertEq(r.decision, 'de-escalate-or-stop');
});
it('SteroidTaper', () => {
  const r = Engine.SteroidTapering({ currentDose: 60, duration: 20 });
  assertEq(r.taper, 'reduce-5mg-every-week-until-10mg-then-2.5mg-slow');
});
it('HighAlert', () => {
  const r = Engine.HighAlertMedication({ drug: 'heparin', weight: 80 });
  assertEq(r.protocol.includes('bolus-6400'), true);
});
it('Polypharmacy', () => {
  const r = Engine.PolypharmacyAssessment({ medicationCount: 12, age: 80 });
  assertEq(r.risk, 'severe-polypharmacy-deprescribe');
});
it('ADR', () => {
  const r = Engine.AdverseDrugReaction({ seriousness: 'serious' });
  assertEq(r.pathway, 'serious-ADR-report-to-pharmacovigilance-and-stop');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
