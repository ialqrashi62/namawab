'use strict';
const Engine = require('./ent_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('ENT ENGINE TESTS\n========================================');

describe('CentorScore', () => {
  it('high risk young', () => {
    const r = Engine.CentorScore({ tonsillarExudate: true, tenderAnteriorCervicalLymphadenopathy: true, fever: true, absenceOfCough: true, age: 20 });
    assertEq(r.score, 4);
  });
  it('low risk older', () => {
    const r = Engine.CentorScore({ tonsillarExudate: false, age: 30 });
    assertEq(r.score, 0);
  });
});

describe('HearingLossGrading', () => {
  it('normal', () => {
    const r = Engine.HearingLossGrading({ ptaDbLaterality: 15 });
    assertEq(r.grade, 'normal-hearing');
  });
  it('severe 80dB', () => {
    const r = Engine.HearingLossGrading({ ptaDbLaterality: 80 });
    assertEq(r.grade, 'severe-hearing-loss');
  });
});

describe('TinnitusImpact', () => {
  it('catastrophic', () => {
    const r = Engine.TinnitusImpact({ tfiScore: 70, durationMonths: 6 });
    assertEq(r.category, 'catastrophic');
  });
  it('pulsatile urgent', () => {
    const r = Engine.TinnitusImpact({ tfiScore: 30, pulsatile: true });
    assertEq(r.urgentReferral, true);
  });
});

describe('VertigoDiagnosis', () => {
  it('central stroke', () => {
    const r = Engine.VertigoDiagnosis({ hINTS: 'central', spontaneousNystagmus: true, headImpulse: 'normal', skewDeviation: true });
    assertEq(r.diagnosis, 'central-vertigo-stroke');
    assertEq(r.severity, 'emergency');
  });
  it('BPPV', () => {
    const r = Engine.VertigoDiagnosis({ hINTS: 'peripheral', headImpulse: 'abnormal', positional: 'yes' });
    assertEq(r.diagnosis, 'BPPV');
  });
});

describe('EpistaxisSeverity', () => {
  it('severe', () => {
    const r = Engine.EpistaxisSeverity({ hbDrop: 3, vitalSigns: 'shock' });
    assertEq(r.severity, 'severe');
  });
  it('mild', () => {
    const r = Engine.EpistaxisSeverity({ estimatedBloodLossMl: 100 });
    assertEq(r.severity, 'mild');
  });
});

describe('LaryngomalaciaSeverity', () => {
  it('severe cyanosis', () => {
    const r = Engine.LaryngomalaciaSeverity({ cyanosis: true, failureToThrive: true });
    assertEq(r.severity, 'severe');
  });
});

describe('TracheostomyDecannulation', () => {
  it('appropriate', () => {
    const r = Engine.TracheostomyDecannulation({ age: 36, weightKg: 14, swallowingSafe: true, aspirationRisk: 'low', vocalCordFunction: 'normal', daysSinceTracheostomy: 30 });
    assertEq(r.decision, 'decannulation-appropriate');
  });
});

describe('SinusitisComplications', () => {
  it('orbital cellulitis', () => {
    const r = Engine.SinusitisComplications({ proptosis: true, fever: true });
    assert(r.complications.includes('orbital-cellulitis-erysipelas'));
  });
  it('uncomplicated', () => {
    const r = Engine.SinusitisComplications({});
    assertEq(r.severity, 'uncomplicated');
  });
});

describe('SuddenHearingLoss', () => {
  it('severe SSNHL urgent', () => {
    const r = Engine.SuddenHearingLoss({ onset: 'sudden', hearingLossDb: 80 });
    assertEq(r.urgentTreatment, true);
  });
});

describe('HeadNeckCancerStaging', () => {
  it('T1N0M0 stage I', () => {
    const r = Engine.HeadNeckCancerStaging({ tumorSite: 'oropharynx', sizeCm: 1.5, nodalStatus: 'N0', metastasis: 'M0', hpv: 'positive' });
    assertEq(r.stageGroup, 'I');
  });
  it('T4N2M1 stage IVC', () => {
    const r = Engine.HeadNeckCancerStaging({ tumorSite: 'hypopharynx', sizeCm: 7, nodalStatus: 'N2', metastasis: 'M1' });
    assertEq(r.stageGroup, 'IVC');
  });
});

console.log();
console.log('ent engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
