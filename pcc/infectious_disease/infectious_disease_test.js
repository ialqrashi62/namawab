'use strict';
const Engine = require('./infectious_disease_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('INFECTIOUS DISEASE ENGINE TESTS\n========================================');

describe('QSOFA', () => {
  it('low risk', () => {
    const r = Engine.QSOFA({ rr: 16, sbp: 130, alteredMental: false });
    assertEq(r.sepsisLikely, false);
  });
  it('high risk', () => {
    const r = Engine.QSOFA({ rr: 28, sbp: 90, alteredMental: true });
    assertEq(r.sepsisLikely, true);
  });
});

describe('SOFAScore', () => {
  it('low SOFA', () => {
    const r = Engine.SOFAScore({ pao2: 200, fio2: 0.5, platelets: 200, bilirubin: 0.5, map: 80, gcs: 15, creatinine: 0.8 });
    assert(r.score < 6);
  });
  it('high SOFA shock', () => {
    const r = Engine.SOFAScore({ pao2: 80, fio2: 1.0, mechanicalVent: true, platelets: 30, bilirubin: 8, map: 50, dopamine: 20, gcs: 8, creatinine: 4 });
    assert(r.score >= 15);
  });
});

describe('HIVStage', () => {
  it('AIDS', () => {
    const r = Engine.HIVStage({ cd4: 150, viralLoad: 50000, opportunisticInfection: true });
    assertEq(r.stage, 'AIDS');
  });
  it('early-HIV', () => {
    const r = Engine.HIVStage({ cd4: 600, viralLoad: 200 });
    assertEq(r.stage, 'early-HIV');
  });
});

describe('SIRS', () => {
  it('SIRS positive', () => {
    const r = Engine.SIRS({ temp: 39, hr: 110, rr: 24, wbc: 14 });
    assertEq(r.sirsPositive, true);
  });
  it('SIRS negative', () => {
    const r = Engine.SIRS({ temp: 37, hr: 80, rr: 16, wbc: 8 });
    assertEq(r.sirsPositive, false);
  });
});

describe('SepsisSepticShock', () => {
  it('septic shock', () => {
    const r = Engine.SepsisSepticShock({ qsofa: 3, sofa: 12, lactate: 6, vasopressor: true });
    assertEq(r.diagnosis, 'septic-shock');
  });
  it('no sepsis', () => {
    const r = Engine.SepsisSepticShock({ qsofa: 0, sofa: 0, lactate: 1 });
    assertEq(r.diagnosis, 'no-sepsis');
  });
});

describe('MalariaSeverity', () => {
  it('severe malaria', () => {
    const r = Engine.MalariaSeverity({ parasitemia: 10, hypoglycemia: true, hemoglobin: 5, creatinine: 4, impairedConsciousness: true });
    assertEq(r.severeMalaria, true);
  });
  it('uncomplicated', () => {
    const r = Engine.MalariaSeverity({ parasitemia: 1 });
    assertEq(r.severeMalaria, false);
  });
});

describe('TBClassification', () => {
  it('MDR-TB', () => {
    const r = Engine.TBClassification({ smear: true, drugResistant: true });
    assertEq(r.classification, 'MDR-TB');
  });
  it('active TB smear positive', () => {
    const r = Engine.TBClassification({ smear: true });
    assertEq(r.classification, 'active-TB');
    assertEq(r.contagious, true);
  });
});

describe('CdiffSeverity', () => {
  it('severe', () => {
    const r = Engine.CdiffSeverity({ wbc: 18000, creatinine: 2.0 });
    assertEq(r.severity, 'severe');
  });
  it('fulminant', () => {
    const r = Engine.CdiffSeverity({ wbc: 25000, creatinine: 3, hypotension: true, megacolon: true });
    assertEq(r.severity, 'fulminant');
  });
});

describe('TravelRisk', () => {
  it('high malaria risk', () => {
    const r = Engine.TravelRisk({ destination: 'ssa', durationDays: 21 });
    assert(r.risks.includes('malaria'));
  });
  it('low risk domestic', () => {
    const r = Engine.TravelRisk({ destination: 'us' });
    assertEq(r.highRisk, false);
  });
});

describe('ImmunizationStatus', () => {
  it('up to date young', () => {
    const r = Engine.ImmunizationStatus({ age: 30, vaccines: ['flu-annual', 'covid-booster', 'tdap'] });
    assertEq(r.catchUpNeeded, false);
  });
  it('missing senior vaccines', () => {
    const r = Engine.ImmunizationStatus({ age: 70, vaccines: ['flu-annual'] });
    assert(r.missing.length > 0);
  });
  it('healthcare booster', () => {
    const r = Engine.ImmunizationStatus({ age: 30, vaccines: ['flu-annual', 'covid-booster', 'tdap'], occupation: 'healthcare' });
    assert(r.specialNeeded.includes('hepatitis-B'));
  });
});

console.log();
console.log('infectious_disease engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
