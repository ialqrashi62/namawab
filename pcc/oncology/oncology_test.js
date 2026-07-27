'use strict';
const Engine = require('./oncology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('ONCOLOGY ENGINE TESTS\n========================================');

describe('TNMSolid', () => {
  it('Stage I', () => {
    const r = Engine.TNMSolid({ tStage: 'T1', nStage: 'N0', mStage: 'M0', tumorType: 'breast' });
    assertEq(r.stageGroup, 'I');
  });
  it('Stage IV metastatic', () => {
    const r = Engine.TNMSolid({ tStage: 'T2', nStage: 'N1', mStage: 'M1', tumorType: 'lung' });
    assertEq(r.stageGroup, 'IV');
  });
});

describe('ECOG', () => {
  it('ECOG 0', () => {
    const r = Engine.ECOG({ performanceStatus: 0 });
    assertEq(r.grade, 0);
  });
  it('ECOG 4', () => {
    const r = Engine.ECOG({ performanceStatus: 4 });
    assertEq(r.grade, 4);
  });
});

describe('RECISTResponse', () => {
  it('partial response', () => {
    const r = Engine.RECISTResponse({ baselineSum: 100, currentSum: 60 });
    assertEq(r.response, 'PR');
  });
  it('progression new lesions', () => {
    const r = Engine.RECISTResponse({ baselineSum: 100, currentSum: 80, newLesions: true });
    assertEq(r.response, 'PD');
  });
  it('stable disease', () => {
    const r = Engine.RECISTResponse({ baselineSum: 100, currentSum: 95 });
    assertEq(r.response, 'SD');
  });
});

describe('ChemoToxicityRisk', () => {
  it('low risk young', () => {
    const r = Engine.ChemoToxicityRisk({ age: 50, ecog: 1, albumin: 4, bilirubin: 0.5, creatinine: 0.8 });
    assertEq(r.category, 'low');
  });
  it('high risk elderly high-dose', () => {
    const r = Engine.ChemoToxicityRisk({ age: 80, ecog: 3, albumin: 2.5, bilirubin: 2.0, creatinine: 2.0, regimen: 'high-dose' });
    assertEq(r.category, 'high');
  });
});

describe('NeutropenicFever', () => {
  it('low risk', () => {
    const r = Engine.NeutropenicFever({ temperature: 38.5, anc: 400 });
    assertEq(r.classification, 'low-risk-NF');
  });
  it('high risk with sepsis', () => {
    const r = Engine.NeutropenicFever({ temperature: 39, anc: 100, sepsis: true });
    assertEq(r.classification, 'high-risk-NF');
  });
});

describe('TumorLysisSyndrome', () => {
  it('high risk ALL', () => {
    const r = Engine.TumorLysisSyndrome({ tumorType: 'ALL', bulkyDisease: true, wbc: 150, uricAcid: 9 });
    assertEq(r.category, 'high');
  });
  it('low risk solid tumor', () => {
    const r = Engine.TumorLysisSyndrome({ tumorType: 'carcinoma' });
    assertEq(r.category, 'low');
  });
});

describe('PalliativePrognosis', () => {
  it('poor prognosis', () => {
    const r = Engine.PalliativePrognosis({ ecog: 4, albumin: 2, lymphocyteCount: 0.5 });
    assertEq(r.survivalMedianDays, 14);
  });
  it('moderate', () => {
    const r = Engine.PalliativePrognosis({ ecog: 2, albumin: 3.5 });
    assertEq(r.survivalMedianDays, 60);
  });
});

describe('CancerScreeningIndication', () => {
  it('mammography indicated', () => {
    const r = Engine.CancerScreeningIndication({ age: 50, sex: 'female' });
    assert(r.indications.includes('mammography'));
  });
  it('lung cancer screening', () => {
    const r = Engine.CancerScreeningIndication({ age: 65, sex: 'male', smokingPackYears: 40 });
    assert(r.indications.includes('lung-cancer-screening'));
  });
});

describe('MutationInterpretation', () => {
  it('EGFR actionable', () => {
    const r = Engine.MutationInterpretation({ variant: 'EGFR L858R', classification: 'pathogenic', alleleFrequency: 0.45, actionable: true });
    assertEq(r.therapyActionable, true);
  });
  it('VUS not actionable', () => {
    const r = Engine.MutationInterpretation({ variant: 'KRAS Q61H', classification: 'vus' });
    assertEq(r.therapyActionable, false);
  });
});

describe('HospiceEligibility', () => {
  it('eligible', () => {
    const r = Engine.HospiceEligibility({ prognosis6Mo: true, ecog: 4, weightLoss: 15 });
    assertEq(r.eligible, true);
  });
  it('not eligible', () => {
    const r = Engine.HospiceEligibility({ ecog: 1 });
    assertEq(r.eligible, false);
  });
});

console.log();
console.log('oncology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
