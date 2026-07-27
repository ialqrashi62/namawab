'use strict';

const Engine = require('./nuclear_med_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('nuclear_med engine tests', () => {
  it('dose high', () => {
    const r = Engine.RadiationDoseLimit({ effectiveDoseMsv: 18, organDoseMsv: 200, pregnancy: false });
    assertEq(r.riskCategory, 'high-dose-monitoring-needed');
  });
  it('thyrotox very severe', () => {
    const r = Engine.ThyrotoxicosisRadioiodine({ ft4: 80, age: 60, atrialFibrillation: true, heartFailure: true, thyroidStorm: false });
    assertEq(r.severity, 'very-severe-thyrotoxicosis');
  });
  it('RAI definitive', () => {
    const r = Engine.RadioiodineAblationDose({ diagnosis: 'Graves', firstTime: true, goiterSize: 60 });
    assertEq(r.regimen, 'high-dose-RAI-15-30mCi');
  });
  it('DTPA very low', () => {
    const r = Engine.RenogramDTPA({ leftKidney: 8, rightKidney: 8 });
    assertEq(r.function, 'very-low-function-bilateral');
  });
  it('BNP OVERT', () => {
    const r = Engine.MIBGScintigraphy({ indication: 'pheochromocytoma', avidityPattern: 'extensive' });
    assertEq(r.interpretation, 'pheochromocytoma-OVERT-avid');
  });
  it('V/Q high prob', () => {
    const r = Engine.LungPerfusionV_QScan({ perfusionDefectPercent: 60, ventilationMatch: 'mismatched' });
    assertEq(r.probability, 'high-probability-PE');
  });
  it('bone mets extensive', () => {
    const r = Engine.BoneScanMetastatic({ lesionCount: 12, superscanPresent: false });
    assertEq(r.stage, 'extensive-metastatic-disease');
  });
  it('PET SUV high', () => {
    const r = Engine.PETCTSUVMax({ suvMax: 12, lesionSite: 'lung' });
    assertEq(r.malignancyRisk, 'high-suspicious-for-malignancy');
  });
  it('HIDA obstructed', () => {
    const r = Engine.HIDACholescintigraphy({ gbFilling: 'absent', bileDuctVisualization: 'present' });
    assertEq(r.diagnosis, 'acute-cystic-duct-obstruction');
  });
  it('contamination mild', () => {
    const r = Engine.RadiopharmaceuticalContamination({ skinCount: 200, bodyBackground: 100, cleanCount: 50 });
    assertEq(r.contaminationLevel, 'mild-contamination');
  });
});

console.log(`\nnuclear_med engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
