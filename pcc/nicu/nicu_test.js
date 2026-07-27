'use strict';
const assert = require('assert');
const Engine = require('./nicu_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('NIHStrokeScale', () => {
  it('severe 25', () => {
    const r = Engine.NIHStrokeScale({ consciousness: 3, gaze: 2, visual: 3, facial: 3, motorArm: 4, motorLeg: 4, ataxia: 2, sensory: 2, language: 3, dysarthria: 2, extinction: 2 });
    assertEq(r.total, 30);
    assertEq(r.severity, 'severe');
  });
  it('minor 2', () => {
    const r = Engine.NIHStrokeScale({ consciousness: 0, gaze: 0, visual: 0, facial: 1, motorArm: 0, motorLeg: 0, ataxia: 0, sensory: 1, language: 0, dysarthria: 0, extinction: 0 });
    assertEq(r.total, 2);
    assertEq(r.severity, 'minor');
  });
});

describe('tPACandidate', () => {
  it('eligible', () => {
    const r = Engine.tPACandidate({ nihss: 12, age: 65, lastKnownWell: 2, systolicBP: 160, diastolicBP: 90, INR: 1.0, glucose: 110, recentSurgery: false, recentStroke: false, bleeding: false });
    assertEq(r.eligible, true);
  });
  it('high BP excluded', () => {
    const r = Engine.tPACandidate({ nihss: 12, age: 65, lastKnownWell: 2, systolicBP: 220, diastolicBP: 120, INR: 1.0, glucose: 110, recentSurgery: false, recentStroke: false, bleeding: false });
    assertEq(r.eligible, false);
    assert(r.reasons.includes('BP_above_limit'));
  });
  it('outside window', () => {
    const r = Engine.tPACandidate({ nihss: 12, age: 65, lastKnownWell: 5, systolicBP: 160, diastolicBP: 90, INR: 1.0, glucose: 110, recentSurgery: false, recentStroke: false, bleeding: false });
    assert(r.reasons.includes('beyond_4.5h_window'));
  });
});

describe('ThrombectomyCandidate', () => {
  it('definite', () => {
    const r = Engine.ThrombectomyCandidate({ nihss: 18, hasLVOImaging: true, lastKnownWell: 3, preStrokeMRS: 0, age: 70 });
    assertEq(r.candidate, true);
    assertEq(r.category, 'definite');
  });
  it('probable high NIHSS', () => {
    const r = Engine.ThrombectomyCandidate({ nihss: 14, hasLVOImaging: false, lastKnownWell: 2, preStrokeMRS: 1, age: 70 });
    assertEq(r.category, 'probable');
  });
  it('not candidate with high mRS', () => {
    const r = Engine.ThrombectomyCandidate({ nihss: 18, hasLVOImaging: true, lastKnownWell: 3, preStrokeMRS: 4, age: 70 });
    assertEq(r.candidate, false);
  });
});

describe('StatusEpilepticusManagement', () => {
  it('refractory 70 min', () => {
    const r = Engine.StatusEpilepticusManagement({ seizureDurationMin: 70, abortiveDose: 1, etiology: 'unknown' });
    assertEq(r.phase, 'refractory');
  });
  it('initial 10 min', () => {
    const r = Engine.StatusEpilepticusManagement({ seizureDurationMin: 10, abortiveDose: 1, etiology: 'unknown' });
    assertEq(r.phase, 'initial_therapy');
  });
});

describe('BrainHerniationSyndrome', () => {
  it('uncal', () => {
    const r = Engine.BrainHerniationSyndrome({ pupils: 'one_blown', posture: 'decorticate', bradycardia: false, hypertension: false, irregularRespirations: false });
    assertEq(r.syndrome, 'uncal');
  });
  it('central imminent', () => {
    const r = Engine.BrainHerniationSyndrome({ pupils: 'both_blown', posture: 'decerebrate', bradycardia: false, hypertension: false, irregularRespirations: false });
    assertEq(r.mortalityRisk, 'imminent');
  });
  it('cushing triad', () => {
    const r = Engine.BrainHerniationSyndrome({ pupils: 'equal_reactive', posture: 'normal', bradycardia: true, hypertension: true, irregularRespirations: true });
    assertEq(r.syndrome, 'cushing');
  });
});

describe('BrainDeathExam', () => {
  it('can declare', () => {
    const r = Engine.BrainDeathExam({ comaKnownCause: true, neuroImagingExplainsComa: true, noSedatives: true, noMetabolicDerangement: true, hypothermia: false, normotension: true, apneaTestPositive: true, allBrainstemReflexesAbsent: true });
    assertEq(r.canDeclare, true);
  });
  it('cannot declare with sedatives', () => {
    const r = Engine.BrainDeathExam({ comaKnownCause: true, neuroImagingExplainsComa: true, noSedatives: false, noMetabolicDerangement: true, hypothermia: false, normotension: true, apneaTestPositive: true, allBrainstemReflexesAbsent: true });
    assertEq(r.canDeclare, false);
    assert(r.missingCriteria.includes('sedative_present'));
  });
});

describe('DCIProphylaxis', () => {
  it('inadequate nimodipine missing', () => {
    const r = Engine.DCIProphylaxis({ daysAfterSAH: 6, nimodipineOrdered: false, systolicBP: 170, symptomaticDCI: false, nicardipineDrip: false });
    assertEq(r.prophylaxisAdequate, false);
    assert(r.suggestedActions.some(a => a.includes('nimodipine')));
  });
  it('adequate with nimodipine', () => {
    const r = Engine.DCIProphylaxis({ daysAfterSAH: 6, nimodipineOrdered: true, systolicBP: 150, symptomaticDCI: false, nicardipineDrip: false });
    assertEq(r.prophylaxisAdequate, true);
  });
});

describe('LumbarPunctureSafety', () => {
  it('safe', () => {
    const r = Engine.LumbarPunctureSafety({ plateletCount: 200, INR: 1.0, antiplateletDrug: false, anticoagulant: false, papilledema: false, focalNeuroDeficit: false, immunocompromised: false, recentSeizure: false });
    assertEq(r.safe, true);
  });
  it('unsafe thrombocytopenia', () => {
    const r = Engine.LumbarPunctureSafety({ plateletCount: 30, INR: 1.0, antiplateletDrug: false, anticoagulant: false, papilledema: false, focalNeuroDeficit: false, immunocompromised: false, recentSeizure: false });
    assertEq(r.safe, false);
    assert(r.contraindication.includes('thrombocytopenia_severe'));
  });
  it('needs imaging first with papilledema', () => {
    const r = Engine.LumbarPunctureSafety({ plateletCount: 200, INR: 1.0, antiplateletDrug: false, anticoagulant: false, papilledema: true, focalNeuroDeficit: false, immunocompromised: false, recentSeizure: false });
    assertEq(r.needsImagingFirst, true);
  });
});

describe('TargetedTemperatureManagement', () => {
  it('indicated shockable', () => {
    const r = Engine.TargetedTemperatureManagement({ arrestRhythm: 'shockable', downtime: 25, rosC: true, initialRhythm: 'VF', hoursSinceROSC: 1 });
    assertEq(r.ttMIndicated, true);
    assertEq(r.targetTempC, 33);
  });
  it('no ROSC', () => {
    const r = Engine.TargetedTemperatureManagement({ arrestRhythm: 'shockable', downtime: 60, rosC: false, initialRhythm: 'VF', hoursSinceROSC: 0 });
    assertEq(r.ttMIndicated, false);
  });
});

describe('NeuroPrognosticationPostArrest', () => {
  it('poor outcome high confidence', () => {
    const r = Engine.NeuroPrognosticationPostArrest({ pupillaryReflexAt72h: 'absent', cornealReflexAt72h: 'absent', nseAt48h: 100, s100bAt48h: 1.0, burstSuppression: true, myoclonusEarly: true });
    assertEq(r.poorOutcome, true);
    assertEq(r.confidence, 'high');
  });
  it('not poor with preserved reflexes', () => {
    const r = Engine.NeuroPrognosticationPostArrest({ pupillaryReflexAt72h: 'present', cornealReflexAt72h: 'present', nseAt48h: 20, s100bAt48h: 0.1, burstSuppression: false, myoclonusEarly: false });
    assertEq(r.poorOutcome, false);
  });
});

console.log('nicu engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
