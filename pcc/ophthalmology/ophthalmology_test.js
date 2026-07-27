'use strict';
const Engine = require('./ophthalmology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('OPHTHALMOLOGY ENGINE TESTS\n========================================');

describe('VisualAcuity', () => {
  it('20/20 normal', () => {
    const r = Engine.VisualAcuity({ snellenNumerator: 20, snellenDenominator: 20 });
    assertEq(r.logMar, 0);
    assertEq(r.category, 'normal-20-20-or-better');
  });
  it('20/200 severe', () => {
    const r = Engine.VisualAcuity({ snellenNumerator: 20, snellenDenominator: 200 });
    assertEq(r.category, 'severe-loss');
  });
});

describe('IOPAssessment', () => {
  it('ocular hypertension', () => {
    const r = Engine.IOPAssessment({ iop: 28 });
    assertEq(r.category, 'ocular-hypertension');
  });
  it('normal 15', () => {
    const r = Engine.IOPAssessment({ iop: 15 });
    assertEq(r.category, 'normal-iop');
  });
});

describe('GlaucomaRiskAssessment', () => {
  it('high risk', () => {
    const r = Engine.GlaucomaRiskAssessment({ age: 70, iop: 25, opticDiscCupping: 0.7, visualFieldDefect: true, familyHistory: true });
    assertEq(r.category, 'high-risk-glaucoma');
  });
  it('low risk', () => {
    const r = Engine.GlaucomaRiskAssessment({});
    assertEq(r.category, 'low-risk');
  });
});

describe('DiabeticRetinopathy', () => {
  it('proliferative', () => {
    const r = Engine.DiabeticRetinopathy({ neovascularization: true });
    assertEq(r.stage, 'proliferative');
  });
  it('mild', () => {
    const r = Engine.DiabeticRetinopathy({ microaneurysms: true });
    assertEq(r.stage, 'mild-non-proliferative');
  });
});

describe('AMDAREDS', () => {
  it('wet AMD', () => {
    const r = Engine.AMDAREDS({ choroidalNeovascularization: true });
    assertEq(r.category, 'wet-AMD');
  });
  it('no AMD', () => {
    const r = Engine.AMDAREDS({});
    assertEq(r.category, 'no-AMD');
  });
});

describe('RedEyeTriage', () => {
  it('acute angle closure urgent', () => {
    const r = Engine.RedEyeTriage({ pain: true, halos: true, historyGlaucoma: true });
    assertEq(r.urgent, true);
    assertEq(r.diagnosis, 'acute-angle-closure-glaucoma');
  });
  it('viral conjunctivitis', () => {
    const r = Engine.RedEyeTriage({ discharge: 'watery' });
    assertEq(r.diagnosis, 'viral-conjunctivitis');
  });
});

describe('CataractGrading', () => {
  it('cataract surgery indicated', () => {
    const r = Engine.CataractGrading({ nuclearOpacity: 'severe', corticalOpacity: 'moderate', visualAcuity: 0.4, glare: 'significant' });
    assertEq(r.recommendation, 'cataract-surgery');
  });
});

describe('RetinalDetachmentRisk', () => {
  it('emergency symptoms', () => {
    const r = Engine.RetinalDetachmentRisk({ symptoms: 'flashes-floaters-curtain' });
    assertEq(r.category, 'high-risk-emergency');
  });
  it('low risk', () => {
    const r = Engine.RetinalDetachmentRisk({});
    assertEq(r.category, 'low-risk');
  });
});

describe('StrabismusAssessment', () => {
  it('congenital esotropia', () => {
    const r = Engine.StrabismusAssessment({ ageMonths: 4, eyeDeviation: 'constant' });
    assertEq(r.classification, 'congenital-esotropia');
  });
});

describe('DryEyeSeverity', () => {
  it('severe', () => {
    const r = Engine.DryEyeSeverity({ schirmer: 3, osmolarity: 350 });
    assertEq(r.severity, 'severe-DED');
  });
});

console.log();
console.log('ophthalmology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
