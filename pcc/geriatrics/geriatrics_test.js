'use strict';
const Engine = require('./geriatrics_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('GERIATRICS ENGINE TESTS\n========================================');

describe('BeersCriteria', () => {
  it('diphenhydramine flagged', () => {
    const r = Engine.BeersCriteria({ medications: ['diphenhydramine'], age: 70 });
    assert(r.avoidList.length > 0);
  });
});

describe('STOPPCriteria', () => {
  it('NSAID-CKD flagged', () => {
    const r = Engine.STOPPCriteria({ medications: ['nsaid'], diagnoses: ['ckd'] });
    assert(r.inappropriate.includes('NSAID-CKD'));
  });
});

describe('FRAILScale', () => {
  it('frail', () => {
    const r = Engine.FRAILScale({ fatigue: 1, resistance: 1, ambulation: 1, illness: 1, weightLoss: 0 });
    assertEq(r.category, 'frail');
  });
});

describe('MiniCogAssessment', () => {
  it('dementia likely', () => {
    const r = Engine.MiniCogAssessment({ recallScore: 0, drawingScore: 0 });
    assertEq(r.interpretation, 'dementia-likely');
  });
});

describe('TUGTest', () => {
  it('high fall risk slow', () => {
    const r = Engine.TUGTest({ timeSeconds: 35 });
    assertEq(r.risk, 'high-fall-risk');
  });
});

describe('MorseFallScale', () => {
  it('high fall', () => {
    const r = Engine.MorseFallScale({ historyFalling: 25, secondaryDiagnosis: 15, ambulatoryAid: 15, ivHeparin: 0, gait: 20, mentalStatus: 15 });
    assertEq(r.risk, 'high-fall-risk');
  });
});

describe('Polypharmacy', () => {
  it('hyper polypharmacy', () => {
    const r = Engine.Polypharmacy({ medicationCount: 12, age: 80, comorbidityCount: 6, adverseEvents: true, compliance: 'poor', prescribingPhysicians: 4 });
    assertEq(r.classification, 'hyper-polypharmacy');
  });
});

describe('DeliriumCAM', () => {
  it('delirium positive', () => {
    const r = Engine.DeliriumCAM({ acuteOnset: true, inattention: true, disorganizedThinking: true, alteredConsciousness: true });
    assertEq(r.category, 'delirium');
  });
});

describe('SPPB', () => {
  it('severe frailty', () => {
    const r = Engine.SPPB({ balanceScore: 1, gaitSpeedScore: 1, chairStandScore: 1 });
    assertEq(r.category, 'frailty-severe-disability');
  });
});

describe('AdvanceCarePlanning', () => {
  it('urgent discussion', () => {
    const r = Engine.AdvanceCarePlanning({ age: 80, comorbidities: 4, lifeExpectancy: 5 });
    assertEq(r.stage, 'urgent-discussion-needed');
  });
});

console.log();
console.log('geriatrics engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
