'use strict';
const Engine = require('./oncology_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('ONCOLOGY EXT ENGINE TESTS\n========================================');

describe('RECIST11', () => {
  it('partial response', () => {
    const r = Engine.RECIST11({ targetLesionsSum: 30, nadirSum: 50, newLesions: false, nonTargetProgression: false });
    assertEq(r.response, 'PR-partial-response');
  });
  it('progressive', () => {
    const r = Engine.RECIST11({ targetLesionsSum: 60, nadirSum: 50, newLesions: false });
    assertEq(r.response, 'PD-progressive-disease');
  });
});

describe('ECOGPerformance', () => {
  it('ecog 0 fully active', () => {
    const r = Engine.ECOGPerformance({ activity: 'fully-active' });
    assertEq(r.ecog, 0);
  });
});

describe('KhoranaScore', () => {
  it('high VTE', () => {
    const r = Engine.KhoranaScore({ cancerType: 'pancreas', hemoglobin: 9, leukocytes: 12, platelets: 380, bmi: 36, gemcitabine: true, platinum: true });
    assert(r.score >= 3);
  });
});

describe('TumorMarkerTrend', () => {
  it('CA-125 rising', () => {
    const r = Engine.TumorMarkerTrend({ ca125Baseline: 20, ca125Current: 100 });
    assert(r.trends[0].trend === 'rising');
  });
});

describe('NeutropenicFever', () => {
  it('high-risk ICU', () => {
    const r = Engine.NeutropenicFever({ temperatureNeutropenia: 39, anc: 80, hypotension: true, respiratory: true, mentalStatus: false });
    assertEq(r.category, 'high-risk-ICU');
  });
});

describe('FebrileNeutropeniaProphylaxis', () => {
  it('indicated', () => {
    const r = Engine.FebrileNeutropeniaProphylaxis({ chemoRegimen: 'high-risk-FN', priorFebrileNeutropenia: false });
    assertEq(r.indication, true);
  });
});

describe('TumorLysisRisk', () => {
  it('Burkitt high-risk', () => {
    const r = Engine.TumorLysisRisk({ cancerType: 'Burkitt', wbc: 60000, bulkyDisease: true });
    assertEq(r.category, 'high-risk-TLS');
  });
});

describe('ChemoDoseAdjustment', () => {
  it('reduce neutropenia', () => {
    const r = Engine.ChemoDoseAdjustment({ currentDose: 100, anc: 1700, platelets: 150000 });
    assert(r.adjustment !== 'no-change');
  });
});

describe('PalliativePrognosis', () => {
  it('weeks-to-days hospice', () => {
    const r = Engine.PalliativePrognosis({ ppScore: 80, hospitalAdmissionsLastMonth: 2 });
    assert(r.careLevel.includes('hospice'));
  });
});

describe('ImmunotherapyToxicity', () => {
  it('severe pneumonitis', () => {
    const r = Engine.ImmunotherapyToxicity({ irAE: 'pneumonitis', organSystem: 'pneumonitis', grade: 3 });
    assertEq(r.classification, 'severe-G3-G4');
  });
});

console.log();
console.log('oncology_ext engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
