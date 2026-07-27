'use strict';
const Engine = require('./sleep_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('SLEEP ENGINE TESTS\n========================================');

describe('STOPBANG', () => {
  it('high risk', () => {
    const r = Engine.STOPBANG({ snoring: true, tired: true, observedApnea: true, highBP: true, bmi: 38, age: 55, neckCircumference: 42, male: true });
    assertEq(r.risk, 'high-risk-OSA');
  });
  it('low risk', () => {
    const r = Engine.STOPBANG({});
    assertEq(r.risk, 'low-risk-OSA');
  });
});

describe('EpworthSleepiness', () => {
  it('severe', () => {
    const r = Engine.EpworthSleepiness({ sittingReading: 3, watchingTV: 3, sittingInactive: 3, passengerInCar: 3, lyingDownAfternoon: 3, sittingTalking: 2, sittingAfterLunch: 2, carInTraffic: 2 });
    assertEq(r.category, 'severe-daytime-sleepiness');
  });
});

describe('AHISeverity', () => {
  it('severe OSA', () => {
    const r = Engine.AHISeverity({ apneaEvents: 200, hypopneaEvents: 100, totalSleepTimeMinutes: 420 });
    assertEq(r.severity, 'severe-OSA');
  });
  it('mild', () => {
    const r = Engine.AHISeverity({ apneaEvents: 30, hypopneaEvents: 20, totalSleepTimeMinutes: 480 });
    assertEq(r.severity, 'mild-OSA');
  });
});

describe('BerlinQuestionnaire', () => {
  it('high risk', () => {
    const r = Engine.BerlinQuestionnaire({ snoringFrequency: 4, snoringLoudness: 3, observedApnea: true, daytimeSleepiness: 4, drivingDrowsiness: true, hypertension: true, bmiCategory: 4, neckCategory: 5 });
    assertEq(r.highRisk, true);
  });
});

describe('InsomniaSeverity', () => {
  it('severe insomnia', () => {
    const r = Engine.InsomniaSeverity({ difficultyFallingAsleep: 4, difficultyStayingAsleep: 4, earlyMorningWaking: 4, sleepSatisfaction: 4, interferenceDaily: 4, noticeability: 4, distress: 4 });
    assertEq(r.severity, 'severe-insomnia');
  });
});

describe('RestlessLegsSeverity', () => {
  it('very severe RLS', () => {
    const r = Engine.RestlessLegsSeverity({ urgeToMove: 4, reliefWithMovement: 4, worseAtRest: 4, worseAtNight: 4, frequency: 4, sleepDisturbance: 4 });
    assertEq(r.severity, 'very-severe-RLS');
  });
});

describe('CPAPTitration', () => {
  it('excellent response', () => {
    const r = Engine.CPAPTitration({ ahiBefore: 40, pressureCmH2O: 10, leak: 5, maskType: 'nasal', complianceHoursPerNight: 6, residualEvents: 3 });
    assertEq(r.effectiveness, 'excellent-response');
  });
});

describe('NarcolepsyAssessment', () => {
  it('type 1', () => {
    const r = Engine.NarcolepsyAssessment({ excessiveDaytimeSleepiness: 3, cataplexy: true, sleepParalysis: 0, hypnagogicHallucinations: 0, sleepOnsetREM: 'yes', msltMeanLatency: 5 });
    assertEq(r.category, 'narcolepsy-type-1');
  });
});

describe('CircadianRhythm', () => {
  it('delayed sleep phase', () => {
    const r = Engine.CircadianRhythm({ sleepPhase: 'delayed', difficultyWaking: true });
    assertEq(r.type, 'delayed-sleep-phase');
  });
});

describe('PediatricSleep', () => {
  it('insufficient', () => {
    const r = Engine.PediatricSleep({ age: 8, totalSleepHours: 7, bedtime: '22:00', waketime: '06:00' });
    assert(r.recommendation.includes('sleep'));
  });
});

console.log();
console.log('sleep engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
