'use strict';
const Engine = require('./palliative_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PALLIATIVE ENGINE TESTS\n========================================');

describe('ESAS', () => {
  it('mild burden', () => {
    const r = Engine.ESAS({ pain: 3, tiredness: 3, drowsiness: 2, nausea: 2, appetite: 2, dyspnea: 3, depression: 2, anxiety: 3, wellbeing: 3 });
    assertEq(r.classification, 'mild-burden');
  });
  it('severe pain + dyspnea', () => {
    const r = Engine.ESAS({ pain: 9, dyspnea: 8, tiredness: 7, drowsiness: 6, nausea: 5, appetite: 6, depression: 7, anxiety: 8, wellbeing: 8 });
    assert(r.severeSymptoms.length > 0);
  });
});

describe('Karnofsky', () => {
  it('normal 90', () => {
    const r = Engine.Karnofsky({ score: 90 });
    assertEq(r.grade, 'normal-activity');
  });
  it('moribund 10', () => {
    const r = Engine.Karnofsky({ score: 10 });
    assertEq(r.grade, 'moribund');
  });
});

describe('PalliativePerformanceScale', () => {
  it('all 50%', () => {
    const r = Engine.PalliativePerformanceScale({ ambulation: 50, activity: 50, selfCare: 50, intake: 50, consciousnessLevel: 50 });
    assertEq(r.pps, 50);
  });
});

describe('OpioidRotation', () => {
  it('morphine to oxycodone', () => {
    const r = Engine.OpioidRotation({ currentOpioid: 'morphine-PO', currentDose: 100, targetOpioid: 'oxycodone-PO', painControl: 'inadequate' });
    assert(r.targetDose > 0);
  });
});

describe('SymptomAssessmentDelirium', () => {
  it('all 4 features', () => {
    const r = Engine.SymptomAssessmentDelirium({ acuteOnset: true, inattention: true, disorganizedThinking: true, alteredConsciousness: true, rASS: 1 });
    assertEq(r.classification, 'delirium-NOS');
    assertEq(r.psychomotor, 'hyperactive');
  });
  it('no delirium', () => {
    const r = Engine.SymptomAssessmentDelirium({ acuteOnset: false, inattention: false, disorganizedThinking: false, alteredConsciousness: false, rASS: 0 });
    assertEq(r.classification, 'no-delirium');
  });
});

describe('PrognosticIndicatorPPI', () => {
  it('high risk', () => {
    const r = Engine.PrognosticIndicatorPPI({ pps: 20, delrium: true, edema: true, dyspneaAtRest: true, weightLoss: 12, dysphagia: true });
    assertEq(r.medianSurvivalDays, 2);
    assertEq(r.poor, true);
  });
  it('moderate', () => {
    const r = Engine.PrognosticIndicatorPPI({ pps: 60, delrium: false });
    assertEq(r.medianSurvivalDays, 60);
  });
});

describe('LiverpoolCarePathway', () => {
  it('all 5 provided', () => {
    const r = Engine.LiverpoolCarePathway({ comfortCare: true, hydration: true, medications: ['morphine'], familyMeetings: 2, lastDaysOfLife: true });
    assertEq(r.careProvided, 5);
    assertEq(r.recommendation, 'continue-LCP');
  });
});

describe('OpioidSideEffects', () => {
  it('respiratory depression', () => {
    const r = Engine.OpioidSideEffects({ opioid: 'morphine', respiratoryDepression: true });
    assertEq(r.urgent, true);
  });
  it('constipation only', () => {
    const r = Engine.OpioidSideEffects({ opioid: 'morphine', constipation: true });
    assert(r.issues.includes('constipation-laxative-needed'));
  });
});

describe('SpiritualAssessment', () => {
  it('severe distress', () => {
    const r = Engine.SpiritualAssessment({ distressLevel: 9, hopeLevel: 2, socialSupport: 'limited', endOfLifeDiscussion: 'pending', advanceDirectives: 'absent' });
    assertEq(r.classification, 'severe-spiritual-distress');
  });
  it('mild', () => {
    const r = Engine.SpiritualAssessment({});
    assertEq(r.classification, 'mild-spiritual-distress');
  });
});

describe('HospiceEligibility6Mo', () => {
  it('eligible', () => {
    const r = Engine.HospiceEligibility6Mo({ progressiveDisease: true, ecog: 4, hospiceDecline: true, weightLoss: 15, recentHospitalizations: 3 });
    assertEq(r.eligible, true);
  });
  it('not eligible', () => {
    const r = Engine.HospiceEligibility6Mo({ ecog: 1 });
    assertEq(r.eligible, false);
  });
});

console.log();
console.log('palliative engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
