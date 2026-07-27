'use strict';
const Engine = require('./cardiology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('CARDIOLOGY ENGINE TESTS\n========================================');

describe('TIMIScore', () => {
  it('low risk young', () => {
    const r = Engine.TIMIScore({ age: 35, riskFactors: 0 });
    assertEq(r.risk, 'low');
  });
  it('high risk elderly with st-dev', () => {
    const r = Engine.TIMIScore({ age: 70, riskFactors: 3, priorCoronary: true, aspirin: true, severeAngina: true, stDeviation: true, cardiacMarkers: true });
    assertEq(r.risk, 'high');
  });
});

describe('HEARTScore', () => {
  it('very low chest pain', () => {
    const r = Engine.HEARTScore({ history: 'slightly-suspicious', age: 30, troponin: 0 });
    assertEq(r.risk, 'very-low');
  });
  it('high risk all', () => {
    const r = Engine.HEARTScore({ history: 'highly-suspicious', ecg: 'significant', age: 80, riskFactors: 4, troponin: 5 });
    assertEq(r.risk, 'high');
  });
});

describe('CHA2DS2VASc', () => {
  it('score 0 male no anticoag', () => {
    const r = Engine.CHA2DS2VASc({ sex: 'male', age: 40 });
    assertEq(r.score, 0);
    assertEq(r.plan, 'no anticoagulation');
  });
  it('score 1 female no anticoag', () => {
    const r = Engine.CHA2DS2VASc({ sex: 'female', age: 50 });
    assertEq(r.plan, 'no anticoagulation');
  });
  it('score 3 anticoag indicated', () => {
    const r = Engine.CHA2DS2VASc({ sex: 'male', age: 70, htn: true, diabetes: true });
    assertEq(r.hasStrokeRisk, true);
  });
});

describe('HASBLED', () => {
  it('low bleed risk', () => {
    const r = Engine.HASBLED({});
    assertEq(r.risk, 'low-bleed-risk');
  });
  it('high bleed risk', () => {
    const r = Engine.HASBLED({ htn: true, renalDisease: true, liverDisease: true, age: 70 });
    assertEq(r.risk, 'high-bleed-risk');
  });
});

describe('GraceScore', () => {
  it('low risk young stable', () => {
    const r = Engine.GraceScore({ age: 50, hr: 80, sbp: 130, killip: 1, creatinine: 1.0 });
    assertEq(r.risk, 'low');
  });
  it('high risk cardiogenic shock', () => {
    const r = Engine.GraceScore({ age: 75, hr: 110, sbp: 80, killip: 3, creatinine: 2.5, cardiacArrest: true, biomarkers: true });
    assertEq(r.risk, 'high');
  });
});

describe('WellsDVT', () => {
  it('low probability', () => {
    const r = Engine.WellsDVT({ alternativeDx: true });
    assertEq(r.probability, 'low');
  });
  it('high probability', () => {
    const r = Engine.WellsDVT({ activeCancer: true, localizedTenderness: true, swellingCalf: 4, pittingEdema: true });
    assertEq(r.probability, 'high');
  });
});

describe('PERCRule', () => {
  it('PERC negative low risk', () => {
    const r = Engine.PERCRule({ age: 30, hr: 80, sao2: 98 });
    assertEq(r.percNegative, true);
  });
  it('PERC positive high risk', () => {
    const r = Engine.PERCRule({ age: 65, hr: 110, sao2: 92, hemoptysis: true, unilateralLegSwelling: true });
    assertEq(r.risk, 'high');
  });
});

describe('KillipClass', () => {
  it('class 1 no signs', () => {
    const r = Engine.KillipClass({ hr: 80, sbp: 130 });
    assertEq(r.class, 1);
  });
  it('class 4 shock', () => {
    const r = Engine.KillipClass({ hr: 130, sbp: 75, shock: true });
    assertEq(r.class, 4);
  });
});

describe('FraminghamRisk', () => {
  it('male low', () => {
    const r = Engine.FraminghamRisk({ age: 35, totalChol: 180, hdl: 50, sbp: 120, smoker: false, diabetes: false, sex: 'male' });
    assert(r.risk10yrPct < 10);
  });
  it('female moderate', () => {
    const r = Engine.FraminghamRisk({ age: 55, totalChol: 240, hdl: 40, sbp: 145, treatedBp: true, smoker: true, diabetes: false, sex: 'female' });
    assert(r.risk10yrPct > 5);
  });
});

describe('NYHAClass', () => {
  it('class 1 no symptoms', () => {
    const r = Engine.NYHAClass({ symptoms: 'none', mets: 7 });
    assertEq(r.class, 1);
  });
  it('class 2 more than ordinary', () => {
    const r = Engine.NYHAClass({ symptoms: 'more-than-ordinary', mets: 5 });
    assertEq(r.class, 2);
  });
  it('class 4 at rest', () => {
    const r = Engine.NYHAClass({ symptoms: 'at-rest' });
    assertEq(r.class, 4);
  });
});

console.log();
console.log('cardiology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
