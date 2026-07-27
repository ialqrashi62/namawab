'use strict';

const Engine = require('./bmt_engine');

let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; }
}
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('bmt engine tests', () => {
  it('HCT-CI very high', () => {
    const r = Engine.HCTComorbidityIndex({ age: 65, karnofsky: 70, cardiac: true, pulmonary: true, hepatic: 'severe', renal: true, infection: true });
    assertEq(r.category, 'very-high-NRM-risk');
  });
  it('GVHD grade IV', () => {
    const r = Engine.AcuteGVHDGrade({ skinStage: 4, liverStage: 0, gutStage: 0 });
    assertEq(r.grade, 'grade-IV-life-threatening');
  });
  it('engraftment syndrome', () => {
    const r = Engine.EngraftmentAssessment({ dayPostTransplant: 12, anc: 0.6, plateletCount: 25 });
    assertEq(r.engraftmentSyndrome, 'engraftment-syndrome-risk');
  });
  it('VOD very severe', () => {
    const r = Engine.VenoOcclusiveDiseaseEBMT({ bilirubin: 8, weightGain: 10, hepatomegaly: true, renalFailure: true, pulmonary: true });
    assertEq(r.severity, 'very-severe-VOD-with-OD');
  });
  it('RIC for high comorbidity', () => {
    const r = Engine.ConditioningIntensity({ regimen: 'BU-FU', age: 65, comorbidityIndex: 4 });
    assertEq(r.recommendation, 'consider-RIC-due-to-comorbidities');
  });
  it('post-HSCT relapse', () => {
    const r = Engine.PostTransplantCytopenias({ dayPostTransplant: 200, anc: 0.2, platelet: 15, viralInfection: false });
    assertEq(r.differential, 'relapse-or-secondary-graft-failure');
  });
  it('HSCT relapse high', () => {
    const r = Engine.HSCTRelapseRisk({ disease: 'AML', diseaseStatusAtTransplant: 'relapse-2', karnofsky: 60, tCellDepletion: true });
    assertEq(r.risk, 'very-high-relapse-risk');
  });
  it('VZV long-term prophylaxis', () => {
    const r = Engine.VZVReactivationRisk({ serostatus: 'positive', gvhd: true });
    assertEq(r.recommendation, 'long-term-acyclovir-12mo-or-longer');
  });
  it('SOS prophylaxis high-risk', () => {
    const r = Engine.SOSProphylaxisIndication({ age: 0.5, gemtuzumab: true });
    assertEq(r.indication, 'defibrotide-prophylaxis-high-risk');
  });
  it('DLI contraindicated', () => {
    const r = Engine.DLIEligibility({ daysPostTransplant: 100, gvhd: true });
    assertEq(r.eligibility, 'contraindicated-active-GVHD');
  });
});

console.log(`\nbmt engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
