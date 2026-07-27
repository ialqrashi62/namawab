'use strict';
const assert = require('assert');
const Engine = require('./obgyn_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('BishopScore', () => {
  it('favorable 10', () => {
    const r = Engine.BishopScore({ dilation: 5, effacement: 80, station: -1, consistency: 'soft', position: 'anterior' });
    assertEq(r.favorable, true);
  });
  it('unfavorable 3', () => {
    const r = Engine.BishopScore({ dilation: 0, effacement: 30, station: -2, consistency: 'firm', position: 'posterior' });
    assertEq(r.favorable, false);
  });
});

describe('GBSProphylaxis', () => {
  it('positive gives abx', () => {
    const r = Engine.GBSProphylaxis({ gbsStatus: 'positive', weeksGestation: 39 });
    assertEq(r.giveAntibiotics, true);
  });
  it('unknown term treated conservatively with abx', () => {
    const r = Engine.GBSProphylaxis({ gbsStatus: 'unknown', weeksGestation: 39 });
    assertEq(r.giveAntibiotics, true);
    assertEq(r.reason, 'await_culture');
  });
  it('prolonged rupture', () => {
    const r = Engine.GBSProphylaxis({ gbsStatus: 'negative', weeksGestation: 39, ruptureDurationHrs: 24 });
    assertEq(r.giveAntibiotics, true);
  });
});

describe('MagnesiumLoading', () => {
  it('severe features', () => {
    const r = Engine.MagnesiumLoading({ systolicBP: 170, proteinuria: 'severe', platelets: 200 });
    assertEq(r.indication, 'severe_preeclampsia_eclampsia');
  });
  it('mild no mag', () => {
    const r = Engine.MagnesiumLoading({ systolicBP: 130, proteinuria: 'none', platelets: 250 });
    assertEq(r.dose, 'none');
  });
});

describe('PostpartumHemorrhageManagement', () => {
  it('stage 4 mtp', () => {
    const r = Engine.PostpartumHemorrhageManagement({ bloodLoss: 3000, stage: 4, platelets: 30, fibrinogen: 0.5 });
    assert(r.actions.includes('activate_mtp'));
  });
});

describe('FetalHeartRateCategory', () => {
  it('category 1 normal', () => {
    const r = Engine.FetalHeartRateCategory({ baseline: 130, variability: 'moderate', accelerations: true, decelerations: 'none' });
    assertEq(r.category, 1);
  });
  it('category 3 bradycardia', () => {
    const r = Engine.FetalHeartRateCategory({ baseline: 80, variability: 'absent', decelerations: 'bradycardia' });
    assertEq(r.category, 3);
  });
});

describe('APGARScore', () => {
  it('reassuring 9', () => {
    const r = Engine.APGARScore({ appearance: 2, pulse: 2, grimace: 2, activity: 2, respiration: 1 });
    assertEq(r.score, 9);
    assertEq(r.status, 'reassuring');
  });
  it('critical 2', () => {
    const r = Engine.APGARScore({ appearance: 0, pulse: 1, grimace: 0, activity: 0, respiration: 1 });
    assertEq(r.status, 'critical');
  });
});

describe('HypertensiveDisorderClassification', () => {
  it('normal', () => {
    const r = Engine.HypertensiveDisorderClassification({ systolicBP: 120, diastolicBP: 80 });
    assertEq(r.type, 'normal');
  });
  it('severe preeclampsia', () => {
    const r = Engine.HypertensiveDisorderClassification({ systolicBP: 175, diastolicBP: 115, gestationalAge: 35, proteinuria: 'severe' });
    assertEq(r.type, 'severe_preeclampsia');
  });
  it('chronic', () => {
    const r = Engine.HypertensiveDisorderClassification({ systolicBP: 150, diastolicBP: 95, gestationalAge: 12 });
    assertEq(r.type, 'chronic_hypertension');
  });
});

describe('MeconiumStainedAmnioticFluid', () => {
  it('thin routine', () => {
    const r = Engine.MeconiumStainedAmnioticFluid({ meconiumGrade: 'thin', apgar1min: 8, apgar5min: 9 });
    assertEq(r.intubation, false);
  });
  it('thick apgar low intubate', () => {
    const r = Engine.MeconiumStainedAmnioticFluid({ meconiumGrade: 'thick', apgar1min: 4, apgar5min: 6 });
    assertEq(r.intubation, true);
  });
});

describe('VBACCandidate', () => {
  it('low transverse eligible', () => {
    const r = Engine.VBACCandidate({ priorCesareanType: 'low_transverse', hospitalVBAC: true, priorVBAC: false });
    assertEq(r.vbacCandidate, true);
  });
  it('classical not candidate', () => {
    const r = Engine.VBACCandidate({ priorCesareanType: 'classical', hospitalVBAC: true });
    assertEq(r.vbacCandidate, false);
  });
});

describe('ShoulderDystociaManagement', () => {
  it('first step mcRoberts', () => {
    const r = Engine.ShoulderDystociaManagement({ minutesSinceDelivery: 1, maneuversAttempted: [], fetalWeight: 4000 });
    assertEq(r.nextStep[0], 'mcRoberts');
  });
  it('time critical 4 min', () => {
    const r = Engine.ShoulderDystociaManagement({ minutesSinceDelivery: 5, maneuversAttempted: ['mcRoberts', 'suprapubic', 'episiotomy'], fetalWeight: 4000 });
    assertEq(r.timeCritical, true);
  });
});

console.log('obgyn engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
