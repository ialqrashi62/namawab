'use strict';
const assert = require('assert');
const Engine = require('./ed_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('ESITriage', () => {
  it('level 1 unstable', () => {
    const r = Engine.ESITriage({ vitalSignsStable: false });
    assertEq(r.level, 1);
  });
  it('level 5 no resources', () => {
    const r = Engine.ESITriage({ vitalSignsStable: true, expectedResources: 0 });
    assertEq(r.level, 5);
  });
  it('elderly bumped up', () => {
    const r = Engine.ESITriage({ vitalSignsStable: true, expectedResources: 1, age: 85 });
    assertEq(r.level, 3);
  });
});

describe('HEARTScore', () => {
  it('low risk 2', () => {
    const r = Engine.HEARTScore({ history: 'slightly_suspicious', ecg: 'normal', age: 40, riskFactors: 0, troponin: 0 });
    assertEq(r.risk, 'low');
  });
  it('high risk 8', () => {
    const r = Engine.HEARTScore({ history: 'highly_suspicious', ecg: 'st_elevation', age: 70, riskFactors: 3, troponin: 4 });
    assertEq(r.risk, 'high');
  });
});

describe('WellsPE', () => {
  it('low', () => {
    const r = Engine.WellsPE({});
    assertEq(r.probability, 'low');
  });
  it('high', () => {
    const r = Engine.WellsPE({ clinicalSignsDVT: true, peMostLikely: true, hrAbove100: true, immobility: true });
    assertEq(r.probability, 'high');
  });
});

describe('PERCRule', () => {
  it('can rule out', () => {
    const r = Engine.PERCRule({});
    assertEq(r.canRuleOut, true);
  });
  it('cannot rule out', () => {
    const r = Engine.PERCRule({ age50: true, hr100: true });
    assertEq(r.canRuleOut, false);
  });
});

describe('ABCD2Score', () => {
  it('low risk', () => {
    const r = Engine.ABCD2Score({ age: 30, bp: { systolic: 110, diastolic: 70 }, clinicalFeatures: 'none', duration: 5, diabetes: false });
    assertEq(r.risk, 'low');
  });
  it('high risk 7', () => {
    const r = Engine.ABCD2Score({ age: 70, bp: { systolic: 180, diastolic: 100 }, clinicalFeatures: 'unilateral_weakness', duration: 120, diabetes: true });
    assertEq(r.risk, 'high');
    assertEq(r.admission, true);
  });
});

describe('GlasgowBlatchfordScore', () => {
  it('zero low', () => {
    const r = Engine.GlasgowBlatchfordScore({ bun: 5, hb: 15, systolicBP: 130, hr: 80 });
    assertEq(r.risk, 'low');
    assertEq(r.interventionLikely, false);
  });
  it('high 10', () => {
    const r = Engine.GlasgowBlatchfordScore({ bun: 30, hb: 8, systolicBP: 85, hr: 120, melena: true, syncope: true });
    assertEq(r.interventionLikely, true);
  });
});

describe('CURB65', () => {
  it('low 0', () => {
    const r = Engine.CURB65({});
    assertEq(r.mortality, 'low');
  });
  it('high 4', () => {
    const r = Engine.CURB65({ confusion: true, uremiaBUN19: true, respiratoryRate30: true, bpLow: true, age65: true });
    assertEq(r.mortality, 'high');
  });
});

describe('PECARNPediatric', () => {
  it('under 2 low', () => {
    const r = Engine.PECARNPediatric({ ageUnder2: true, alteredMentalStatus: false, signsOfBasalSkullFracture: false });
    assertEq(r.risk, 'low');
  });
  it('over 2 high', () => {
    const r = Engine.PECARNPediatric({ ageUnder2: false, alteredMentalStatus: true });
    assertEq(r.risk, 'high');
    assertEq(r.ctRecommended, true);
  });
});

describe('ATLSPrimarySurvey', () => {
  it('unstable airway', () => {
    const r = Engine.ATLSPrimarySurvey({ airway: false, breathing: 'normal', circulation: 'stable', disability: 'alert', exposure: 'examined' });
    assertEq(r.unstable, true);
  });
  it('stable', () => {
    const r = Engine.ATLSPrimarySurvey({ airway: true, breathing: 'normal', circulation: 'stable', disability: 'alert', exposure: 'examined' });
    assertEq(r.unstable, false);
  });
});

describe('DispositionDecision', () => {
  it('icu critical', () => {
    const r = Engine.DispositionDecision({ severity: 'critical' });
    assertEq(r.disposition, 'icu');
  });
  it('admit elderly high', () => {
    const r = Engine.DispositionDecision({ severity: 'high', age: 85 });
    assertEq(r.disposition, 'admit');
  });
  it('discharge low', () => {
    const r = Engine.DispositionDecision({ severity: 'low', insurance: true, socialSupport: true });
    assertEq(r.disposition, 'discharge');
  });
});

console.log('ed engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
