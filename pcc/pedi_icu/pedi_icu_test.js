'use strict';
const Engine = require('./pedi_icu_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PEDI-ICU ENGINE TESTS\n========================================');

describe('PELOD2', () => {
  it('low score', () => {
    const r = Engine.PELOD2({ ageMonths: 24, glasgowScore: 15, pupillaryReactions: 'normal', pao2: 200, fio2: 0.4, paco2: 40, lactate: 1, platelets: 200, crp: 5 });
    assertEq(r.severity, 'low');
  });
  it('high score', () => {
    const r = Engine.PELOD2({ ageMonths: 24, glasgowScore: 3, pupillaryReactions: 'fixed', pao2: 50, fio2: 1.0, paco2: 80, lactate: 8, platelets: 15, crp: 200, inotropicSupport: 'any' });
    assertEq(r.severity, 'high');
  });
});

describe('PARDSDiagnosis', () => {
  it('severe PARDS', () => {
    const r = Engine.PARDSDiagnosis({ ageMonths: 6, onsetTiming: 1, imagingFindings: 'bilateral-infiltrates', oxygenation: { osi: 15 } });
    assertEq(r.severity, 'severe');
  });
  it('mild PARDS', () => {
    const r = Engine.PARDSDiagnosis({ ageMonths: 24, oxygenation: { osi: 6 } });
    assertEq(r.severity, 'mild');
  });
});

describe('PedsVentSettings', () => {
  it('severe PARDS', () => {
    const r = Engine.PedsVentSettings({ ageMonths: 6, weightKg: 7, pardsSeverity: 'severe' });
    assertEq(r.peep, 10);
    assertEq(r.fio2, 0.6);
  });
  it('mild PARDS', () => {
    const r = Engine.PedsVentSettings({ ageMonths: 24, weightKg: 12, pardsSeverity: 'mild' });
    assertEq(r.peep, 6);
  });
});

describe('SedationLevel', () => {
  it('agitated', () => {
    const r = Engine.SedationLevel({ rassScore: 2 });
    assertEq(r.interpretation, 'agitated');
  });
  it('alert calm', () => {
    const r = Engine.SedationLevel({ rassScore: 0 });
    assertEq(r.interpretation, 'alert-calm');
  });
});

describe('DeliriumPedi', () => {
  it('definite', () => {
    const r = Engine.DeliriumPedi({ ageMonths: 60, acuteChange: true, inattention: true, alteredConsciousness: true, disorganizedThinking: true });
    assertEq(r.delirium, 'definite-delirium');
  });
  it('CAPD infant', () => {
    const r = Engine.DeliriumPedi({ ageMonths: 3, acuteChange: true, inattention: true, alteredConsciousness: true, disorganizedThinking: true });
    assertEq(r.classification, 'CAPD-cornell');
  });
});

describe('VasoactiveScore', () => {
  it('moderate', () => {
    const r = Engine.VasoactiveScore({ dopamine: 5, dobutamine: 0, epinephrine: 0, norepinephrine: 0, vasopressin: 0, milrinone: 0, weightKg: 10 });
    assertEq(r.indexedScore, 0.5);
  });
  it('severe', () => {
    const r = Engine.VasoactiveScore({ dopamine: 0, dobutamine: 0, epinephrine: 0, norepinephrine: 0, vasopressin: 0.1, milrinone: 0, weightKg: 10 });
    assert(r.category === 'severe-vasoactive-need');
  });
});

describe('FluidResuscitationPedi', () => {
  it('hypovolemic', () => {
    const r = Engine.FluidResuscitationPedi({ weightKg: 10, ageMonths: 24, shockType: 'hypovolemic' });
    assert(r.recommendation.includes('crystalloid-bolus'));
  });
});

describe('PediatricStatusEpilepticus', () => {
  it('initial therapy', () => {
    const r = Engine.PediatricStatusEpilepticus({ ageMonths: 12, seizureDuration: 10 });
    assertEq(r.phase, 'initial-therapy');
  });
  it('refractory', () => {
    const r = Engine.PediatricStatusEpilepticus({ ageMonths: 12, seizureDuration: 60, refractorySeizures: true });
    assertEq(r.phase, 'refractory-SE');
  });
});

describe('WithdrawalAssessment', () => {
  it('severe', () => {
    const r = Engine.WithdrawalAssessment({ ageMonths: 24, opioidDays: 10, currentWAT1Score: 13 });
    assertEq(r.severity, 'severe');
  });
  it('no withdrawal', () => {
    const r = Engine.WithdrawalAssessment({ ageMonths: 24, opioidDays: 3, currentWAT1Score: 2 });
    assertEq(r.severity, 'no-withdrawal');
  });
});

describe('PediatricTBI', () => {
  it('severe TBI', () => {
    const r = Engine.PediatricTBI({ ageMonths: 60, gcs: 6, sbp: 75 });
    assertEq(r.severity, 'severe-TBI');
    assertEq(r.hypotension, true);
  });
  it('mild TBI', () => {
    const r = Engine.PediatricTBI({ ageMonths: 120, gcs: 14, sbp: 110 });
    assertEq(r.severity, 'mild-TBI');
  });
});

console.log();
console.log('pedi_icu engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
