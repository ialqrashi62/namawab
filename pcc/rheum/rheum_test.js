'use strict';
const assert = require('assert');
const Engine = require('./rheum_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('DAS28Score', () => {
  it('remission', () => {
    const r = Engine.DAS28Score({ tenderJoints: 0, swollenJoints: 0, esr: 5, patientGlobal: 5 });
    assertEq(r.activity, 'remission');
  });
  it('high activity', () => {
    const r = Engine.DAS28Score({ tenderJoints: 20, swollenJoints: 15, esr: 60, patientGlobal: 80 });
    assertEq(r.activity, 'high');
  });
});

describe('SLEDAIScore', () => {
  it('severe flare', () => {
    const r = Engine.SLEDAIScore({ seizures: true, psychosis: true, organicBrain: true, visual: true, cranialNerve: false, lupusHeadache: true, cva: true, vasculitis: true, arthritis: true, myositis: true, rash: true, alopecia: true, mucosal: true, pleurisy: true, pericarditis: true, lowComplement: true, increasedDNA: true, fever: true, thrombocytopenia: true, leukopenia: true });
    assertEq(r.activity, 'severe_flare');
  });
  it('inactive', () => {
    const r = Engine.SLEDAIScore({});
    assertEq(r.activity, 'inactive');
  });
});

describe('GoutAttackManagement', () => {
  it('kidney disease first line colchicine', () => {
    const r = Engine.GoutAttackManagement({ attackDuration: 2, kidneyDisease: true, age: 50, pepticUlcer: false, anticoagulant: false });
    assertEq(r.firstLine, 'colchicine');
  });
  it('no contraindication NSAIDs', () => {
    const r = Engine.GoutAttackManagement({ attackDuration: 1, kidneyDisease: false, age: 40, pepticUlcer: false, anticoagulant: false });
    assertEq(r.firstLine, 'NSAIDs');
  });
});

describe('AntiPhospholipidSyndrome', () => {
  it('definite', () => {
    const r = Engine.AntiPhospholipidSyndrome({ lupusAnticoagulant: true, anticardiolipin: 100, antibeta2GPI: 30, thrombosis: true, pregnancyMorbidity: false });
    assertEq(r.diagnosis, 'definite_APS');
  });
  it('aPL positive no clinical', () => {
    const r = Engine.AntiPhospholipidSyndrome({ lupusAnticoagulant: true, thrombosis: false, pregnancyMorbidity: false });
    assertEq(r.diagnosis, 'aPL_positive_no_clinical');
  });
});

describe('GiantCellArteritisSuspected', () => {
  it('likely GCA', () => {
    const r = Engine.GiantCellArteritisSuspected({ age: 70, newHeadache: true, temporalArteryAbnormality: true, esrElevated: 80, biopsyFindings: 'pending' });
    assertEq(r.diagnosis, 'GCA_likely');
  });
  it('unlikely', () => {
    const r = Engine.GiantCellArteritisSuspected({ age: 30, newHeadache: false, temporalArteryAbnormality: false, esrElevated: 10, biopsyFindings: 'normal' });
    assertEq(r.diagnosis, 'GCA_unlikely');
  });
});

describe('SpondylarthritisScreening', () => {
  it('axial Spa', () => {
    const r = Engine.SpondylarthritisScreening({ age: 30, backPainDuration: 24, inflammatoryBackPain: true, hlaB27: true, sacroiliitisOnMri: false, responseToNSAIDs: true, familyHistory: false });
    assertEq(r.diagnosis, 'axial_spondyloarthritis');
  });
});

describe('SystemicSclerosisClassification', () => {
  it('definite SSc', () => {
    const r = Engine.SystemicSclerosisClassification({ skinThickening: 'proximal_to_MCP', sclerodactyly: true, digitalPittingScars: true, telangiectasia: true, raynauds: true, raynaudsWithNailfoldChanges: true, pulmonaryHypertension: false, antiCentromere: true });
    assertEq(r.diagnosis, 'definite_systemic_sclerosis');
  });
});

describe('VasculitisClassification', () => {
  it('GPA c-ANCA', () => {
    const r = Engine.VasculitisClassification({ vesselSize: 'small', ancaPattern: 'c-ANCA', biopsyFindings: 'granulomatous' });
    assertEq(r.type, 'granulomatosis_polyangiitis');
  });
});

describe('FibromyalgiaSeverity', () => {
  it('severe', () => {
    const r = Engine.FibromyalgiaSeverity({ painSites: 8, symptomSeverity: 3, fatigue: 3, wakingUnrefreshed: 3, cognitiveSymptoms: 2, somaticSymptoms: 2 });
    assertEq(r.diagnosis, 'fibromyalgia_likely');
    assertEq(r.severity, 'severe');
  });
});

describe('InflammatoryBackPainRecognition', () => {
  it('likely', () => {
    const r = Engine.InflammatoryBackPainRecognition({ ageAtOnset: 25, insidiousOnset: true, improvementWithExercise: true, worseningWithRest: true, nightPain: true, alternatingButtockPain: false, responseToNSAIDs: true });
    assertEq(r.diagnosis, 'inflammatory_back_pain_likely');
  });
});

console.log('rheum engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
