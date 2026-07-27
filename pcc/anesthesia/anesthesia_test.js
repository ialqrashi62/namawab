'use strict';
const Engine = require('./anesthesia_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('ANESTHESIA ENGINE TESTS\n========================================');

describe('Mallampati', () => {
  it('grade 1 easy', () => {
    const r = Engine.Mallampati({ view: 1 });
    assertEq(r.difficultAirway, 'easy');
  });
  it('grade 4 difficult', () => {
    const r = Engine.Mallampati({ view: 4 });
    assertEq(r.difficultAirway, 'predicted-difficult');
  });
});

describe('STOPBANG', () => {
  it('low risk', () => {
    const r = Engine.STOPBANG({});
    assertEq(r.risk, 'low-OSA');
  });
  it('high risk', () => {
    const r = Engine.STOPBANG({ snoring: true, tired: true, observed: true, bp: true, bmi: 40, age: 60, neck: 45, sex: 'male' });
    assertEq(r.risk, 'high-OSA');
  });
});

describe('ASAClassification', () => {
  it('ASA 1 healthy', () => {
    const r = Engine.ASAClassification({ asaClass: 1 });
    assertEq(r.asa, 1);
  });
  it('ASA 4 emergency', () => {
    const r = Engine.ASAClassification({ asaClass: 4, emergency: true });
    assert(r.mortalityPct >= 7.8);
  });
});

describe('PerioperativeCardiacRisk', () => {
  it('low risk young healthy', () => {
    const r = Engine.PerioperativeCardiacRisk({ age: 30, surgeryType: 'low-risk-ophthalmic', functionalCapacityMets: 10 });
    assertEq(r.level, 'low-MINS-risk');
  });
  it('high risk', () => {
    const r = Engine.PerioperativeCardiacRisk({ age: 80, surgeryType: 'high-risk-vascular', ischemicHeartDisease: true, heartFailure: true, diabetes: true, creatinine: 3, functionalCapacityMets: 2 });
    assertEq(r.level, 'high-MINS-risk');
  });
});

describe('DifficultAirway', () => {
  it('easy', () => {
    const r = Engine.DifficultAirway({ mallampati: 1 });
    assertEq(r.level, 'easy-airway-expected');
  });
  it('predicted difficult', () => {
    const r = Engine.DifficultAirway({ mallampati: 4, thyromentalDistance: 4, mouthOpening: 2, bodyHabitus: 'obese', priorDifficult: true });
    assertEq(r.level, 'predicted-difficult-airway');
  });
});

describe('MalignantHyperthermiaRisk', () => {
  it('personal history', () => {
    const r = Engine.MalignantHyperthermiaRisk({ personalHistory: true });
    assertEq(r.recommendation, 'NON-TRIGGERING-anesthesia');
  });
  it('standard', () => {
    const r = Engine.MalignantHyperthermiaRisk({});
    assertEq(r.recommendation, 'standard');
  });
});

describe('PONVRisk', () => {
  it('low risk male non-smoker no history', () => {
    const r = Engine.PONVRisk({ sex: 'male', smokingStatus: 'smoker', historyPonv: false, opoidUse: false, surgeryType: 'low-risk', durationMinutes: 30, volatileAnesthetic: false });
    assertEq(r.risk, 'low');
  });
  it('high risk', () => {
    const r = Engine.PONVRisk({ sex: 'female', smokingStatus: 'non-smoker', historyPonv: true, opoidUse: true, surgeryType: 'laparoscopic', durationMinutes: 120, volatileAnesthetic: true });
    assertEq(r.risk, 'high');
  });
});

describe('CapriniScore', () => {
  it('low risk young healthy', () => {
    const r = Engine.CapriniScore({ age: 30, surgeryDuration: 1 });
    assertEq(r.risk, 'low-risk');
  });
  it('highest risk', () => {
    const r = Engine.CapriniScore({ age: 80, priorVTE: true, familyVteHistory: true, immobilityDays: 5, surgeryDuration: 8, cancer: true, centralVenousAccess: true });
    assertEq(r.risk, 'highest-risk');
  });
});

describe('LaryngoscopyGrade', () => {
  it('grade 1 first pass', () => {
    const r = Engine.LaryngoscopyGrade({ view: 'full-cords', attempts: 1 });
    assertEq(r.grade, 1);
    assertEq(r.intubationSuccess, 'first-pass');
  });
  it('grade 4 no view', () => {
    const r = Engine.LaryngoscopyGrade({ view: 'no-view', attempts: 3 });
    assertEq(r.grade, 4);
  });
});

describe('RegionalAnesthesiaDecision', () => {
  it('suitable', () => {
    const r = Engine.RegionalAnesthesiaDecision({ patientConsent: true, blockType: 'spinal' });
    assertEq(r.suitable, true);
  });
  it('coagulopathy', () => {
    const r = Engine.RegionalAnesthesiaDecision({ patientConsent: true, coagulopathy: true });
    assertEq(r.suitable, false);
  });
});

console.log();
console.log('anesthesia engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
