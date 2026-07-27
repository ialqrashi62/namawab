'use strict';
const Engine = require('./urology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('UROLOGY ENGINE TESTS\n========================================');

describe('IPSSScore', () => {
  it('severe', () => {
    const r = Engine.IPSSScore({ incompleteEmptying: 5, frequency: 5, intermittency: 4, urgency: 5, weakStream: 4, straining: 3, nocturia: 5 });
    assertEq(r.severity, 'severe');
  });
  it('mild', () => {
    const r = Engine.IPSSScore({ incompleteEmptying: 1, frequency: 1, intermittency: 0, urgency: 0, weakStream: 0, straining: 0, nocturia: 1 });
    assertEq(r.severity, 'mild');
  });
});

describe('AUASSeverity', () => {
  it('severe', () => {
    const r = Engine.AUASSeverity({ score: 25 });
    assertEq(r.severity, 'severe');
  });
});

describe('StoneSizeRisk', () => {
  it('urgent infected', () => {
    const r = Engine.StoneSizeRisk({ stoneSizeMm: 6, location: 'ureteral', hydronephrosis: true, infection: true });
    assert(r.intervention.includes('urgent'));
  });
  it('conservative small', () => {
    const r = Engine.StoneSizeRisk({ stoneSizeMm: 3 });
    assertEq(r.intervention, 'conservative-stone-pass');
  });
});

describe('ProstateCancerRisk', () => {
  it('high risk', () => {
    const r = Engine.ProstateCancerRisk({ psa: 15, age: 75, familyHistory: true, dre: 'abnormal', mpMriPiRads: 'PI-RADS-5' });
    assertEq(r.category, 'high-risk-need-biopsy');
  });
  it('low risk', () => {
    const r = Engine.ProstateCancerRisk({});
    assertEq(r.category, 'low-risk-monitor');
  });
});

describe('RenalMassStaging', () => {
  it('stage I small', () => {
    const r = Engine.RenalMassStaging({ tumorSizeCm: 3, histology: 'clear-cell', vascularInvasion: false, metastasis: false });
    assertEq(r.tnm, 'T1a');
    assertEq(r.stage, 'stage-I');
  });
  it('stage IV with mets', () => {
    const r = Engine.RenalMassStaging({ tumorSizeCm: 8, histology: 'clear-cell', vascularInvasion: true, metastasis: true });
    assertEq(r.tnm, 'T4');
    assertEq(r.stage, 'stage-IV');
  });
});

describe('HematuriaWorkup', () => {
  it('gross smoker urgent', () => {
    const r = Engine.HematuriaWorkup({ gross: true, age: 60, smoking: true });
    assert(r.recommendation.includes('cystoscopy'));
  });
  it('microscopic low risk', () => {
    const r = Engine.HematuriaWorkup({ microscopic: true, rbcsHpf: 5, age: 30 });
    assertEq(r.recommendation, 'monitor-repeat-UA');
  });
});

describe('EDAssessment', () => {
  it('severe ED', () => {
    const r = Engine.EDAssessment({ iiefScore: 5, age: 60, diabetes: true });
    assertEq(r.severity, 'severe-ED');
  });
  it('mild ED', () => {
    const r = Engine.EDAssessment({ iiefScore: 20, age: 50 });
    assertEq(r.severity, 'mild-ED');
  });
});

describe('IncontinenceSeverity', () => {
  it('severe', () => {
    const r = Engine.IncontinenceSeverity({ padsPerDay: 8, postProstatectomy: true });
    assertEq(r.severity, 'severe');
  });
  it('mild', () => {
    const r = Engine.IncontinenceSeverity({ padsPerDay: 1 });
    assertEq(r.severity, 'mild');
  });
});

describe('TesticularMassWorkup', () => {
  it('suspicious solid', () => {
    const r = Engine.TesticularMassWorkup({ age: 25, tumorMarkers: {}, ultrasoundFindings: 'solid' });
    assertEq(r.classification, 'malignancy-suspect');
  });
});

describe('CatheterAssociatedUTI', () => {
  it('asymptomatic no treatment', () => {
    const r = Engine.CatheterAssociatedUTI({ leukocytosis: false, fever: false, pregnant: false });
    assertEq(r.diagnosis, 'asymptomatic-bacteriuria-no-treatment');
  });
  it('pregnant', () => {
    const r = Engine.CatheterAssociatedUTI({ pregnant: true });
    assertEq(r.diagnosis, 'pregnant-UTI-treat');
  });
});

console.log();
console.log('urology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
