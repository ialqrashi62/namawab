'use strict';
const Engine = require('./allergy_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('ALLERGY ENGINE TESTS\n========================================');

describe('AsthmaControlTest', () => {
  it('well controlled', () => {
    const r = Engine.AsthmaControlTest({ daytimeSymptoms: 0, nighttimeSymptoms: 0, rescueInhaler: 0, interference: 0, selfRating: 5, control: 5 });
    assertEq(r.category, 'well-controlled');
  });
  it('poorly controlled', () => {
    const r = Engine.AsthmaControlTest({ daytimeSymptoms: 5, nighttimeSymptoms: 5, rescueInhaler: 5, interference: 5, selfRating: 1, control: 1 });
    assertEq(r.category, 'poorly-controlled');
  });
});

describe('GINAClassification', () => {
  it('uncontrolled', () => {
    const r = Engine.GINAClassification({ controllerMedication: 'medium-dose-ICS-LABA', reliever: 'SABA', daySymptomsPerWeek: 5, nightSymptomsPerMonth: 5, activityLimitation: true, exacerbations: 3 });
    assertEq(r.controlLevel, 'uncontrolled');
  });
});

describe('AnaphylaxisSeverity', () => {
  it('severe grade IV', () => {
    const r = Engine.AnaphylaxisSeverity({ symptomsOnset: 'rapid', cardiovascular: true, respiratory: true, skin: true, gastrointestinal: false, priorAnaphylaxis: false });
    assertEq(r.category, 'severe-grade-IV');
  });
  it('epinephrine needed', () => {
    const r = Engine.AnaphylaxisSeverity({ symptomsOnset: 'rapid', cardiovascular: true });
    assert(r.treatment.includes('epinephrine'));
  });
});

describe('AllergicRhinitisSeverity', () => {
  it('severe persistent', () => {
    const r = Engine.AllergicRhinitisSeverity({ symptoms: 4, impactOnSleep: 4, impactOnDaily: 4 });
    assertEq(r.category, 'severe-persistent');
  });
});

describe('UrticariaActivity', () => {
  it('severe chronic', () => {
    const r = Engine.UrticariaActivity({ numberOfHives: 8, itchScore: 5, swelling: true, duration: 'chronic', angioedema: true });
    assertEq(r.severity, 'severe');
  });
});

describe('FoodAllergySeverity', () => {
  it('severe peanut anaphylaxis', () => {
    const r = Engine.FoodAllergySeverity({ reactionType: 'anaphylaxis', peanut: true, epinephrineGiven: true, biphasicReaction: false, hospitalAdmission: true });
    assertEq(r.category, 'severe-persistent');
  });
});

describe('AllergenImmunotherapy', () => {
  it('contraindicated beta-blocker', () => {
    const r = Engine.AllergenImmunotherapy({ allergenType: 'grass', age: 30, severity: 5, asthma: 'controlled', onBetaBlocker: true });
    assertEq(r.eligible, false);
  });
});

describe('DrugAllergy', () => {
  it('SJS strict avoidance', () => {
    const r = Engine.DrugAllergy({ reactionType: 'SJS-TEN', timeOfOnset: 'delayed', organInvolvement: true });
    assertEq(r.action, 'strict-avoidance-and-bracelet');
  });
});

describe('EosinophilCountAssessment', () => {
  it('hypereosinophilia', () => {
    const r = Engine.EosinophilCountAssessment({ eosCount: 2000 });
    assertEq(r.category, 'hypereosinophilia');
  });
});

describe('AtopicDermatitisSeverity', () => {
  it('severe', () => {
    const r = Engine.AtopicDermatitisSeverity({ extent: 10, intensityScore: 10, itchScore: 10, sleepLoss: 5 });
    assertEq(r.severity, 'severe');
  });
});

console.log();
console.log('allergy engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
