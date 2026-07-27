'use strict';

const Engine = require('./cardio_surg_engine');

let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; }
}
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }
function assertTrue(c, m) { if (!c) throw new Error('assertTrue: ' + (m || 'failed')); }

describe('cardio_surg engine tests', () => {
  it('CABG high risk', () => {
    const r = Engine.CABGEuroSCOREII({ age: 80, sex: 'female', creatinine: 250, ef: 25, previousMI: true, pulmonaryDisease: true, urgency: 'emergency', criticalPreop: true, diabetes: true });
    assertEq(r.risk, 'high-risk');
  });
  it('AS AVR indicated', () => {
    const r = Engine.AorticStenosisValveIndication({ meanGradient: 50, aorticValveArea: 0.8, ef: 55, symptomatic: true });
    assertEq(r.indication, 'Class-I-AVR-indicated');
  });
  it('ECMO ready to wean', () => {
    const r = Engine.ECMOWeaningReadiness({ ef: 40, lactate: 1.5, mapOnSupport: 70, centralVenousPressure: 10, dobutamineDose: 3, norepinephrineDose: 0.05, mechanicalVentilationDays: 3 });
    assertEq(r.readiness, 'ready-to-wean');
  });
  it('VIS very high', () => {
    const r = Engine.VasoactiveInotropicScore({ dopamineDose: 10, dobutamineDose: 10, milrinoneDose: 0.5, epinephrineDose: 0.1, norepinephrineDose: 0.1, vasopressinDose: 0.04 });
    assertEq(r.category, 'very-high-mortality-risk');
  });
  it('ppoFEV1 high risk', () => {
    const r = Engine.PredictedPostOpFEV1({ preoperativeFEV1: 30, segmentsRemaining: 10, segmentsResected: 9 });
    assertEq(r.risk, 'high-risk-functional-inoperable');
  });
  it('Type A dissection', () => {
    const r = Engine.AorticDissectionStanford({ type: 'A' });
    assertEq(r.management, 'emergent-surgical-repair-OR-TEVAR-hybrid');
  });
  it('CHA2DS2-VASc high', () => {
    const r = Engine.PostCABGAFStrokeRisk({ chf: true, hypertension: true, age: 78, diabetes: true, stroke: true, sex: 'female' });
    assertEq(r.category, 'high-stroke-risk-anticoagulation');
  });
  it('mitral Type II repairable', () => {
    const r = Engine.MitralValveCarpentier({ leafletMotion: 'prolapse', leaflet: 'posterior', chordalRupture: true });
    assertEq(r.carpentierType, 'Type-II-prolapse');
  });
  it('esophagectomy high', () => {
    const r = Engine.EsophagectomyRisk({ asaClass: 4, fev1: 50, age: 75, weightLoss: 15, neoadjuvantChemoradiation: true });
    assertEq(r.risk, 'very-high-risk');
  });
  it('mediastinitis class III', () => {
    const r = Engine.MediastinitisElGamel({ timing: 'late', depth: 'deep', microbiology: 'mrsa' });
    assertEq(r.classType, 'Class-III-deep-late');
  });
});

console.log(`\ncardio_surg engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
