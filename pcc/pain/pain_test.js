'use strict';
const Engine = require('./pain_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PAIN MEDICINE ENGINE TESTS\n========================================');

describe('WHOLadder', () => {
  it('severe pain step 3', () => {
    const r = Engine.WHOLadder({ painScore: 8, currentStep: 'step-2-weak-opioid' });
    assert(r.recommendedStep.includes('step-3'));
  });
  it('cancer pain bypass', () => {
    const r = Engine.WHOLadder({ painScore: 6, currentStep: 'step-1-non-opioid', cancerPain: true });
    assert(r.recommendedStep.includes('bypass-step-2'));
  });
});

describe('OpioidRiskTool', () => {
  it('high risk', () => {
    const r = Engine.OpioidRiskTool({ familyHistory: true, personalHistory: true, illegalDrugs: true, alcohol: true });
    assertEq(r.category, 'high-risk');
  });
});

describe('VisualAnalogScale', () => {
  it('severe pain 8', () => {
    const r = Engine.VisualAnalogScale({ vasScore: 8 });
    assertEq(r.category, 'severe-pain');
  });
});

describe('NeuropathicPainDN4', () => {
  it('neuropathic positive', () => {
    const r = Engine.NeuropathicPainDN4({ burning: true, painfulCold: true, electricShocks: true, tingling: true, pins: true, numbness: true, itching: false, hypoesthesia: false, pricking: false, allodynia: false });
    assertEq(r.neuropathic, true);
  });
});

describe('CDC_MME', () => {
  it('high dose morphine', () => {
    const r = Engine.CDC_MME({ opioid: 'morphine', doseMg: 100, dosesPerDay: 3 });
    assertEq(r.category, 'high-dose-90-plus');
    assertEq(r.mme, 300);
  });
  it('fentanyl patch caution', () => {
    const r = Engine.CDC_MME({ opioid: 'fentanyl', doseMg: 50, dosesPerDay: 1 });
    assert(r.mme >= 50);
  });
});

describe('PostOpPainManagement', () => {
  it('major abdominal PCA', () => {
    const r = Engine.PostOpPainManagement({ surgeryType: 'abdominal', expectedPainDuration: 10, multimodal: true, opioidNaive: true, comorbidities: 0 });
    assert(r.regimen.includes('PCA'));
  });
});

describe('CancerPainAssessment', () => {
  it('breakthrough regimen', () => {
    const r = Engine.CancerPainAssessment({ painScore: 6, breakthrough: true, neuropathicComponent: false, opioidTolerance: true });
    assert(r.regimen.includes('rescue-dose'));
  });
});

describe('FailedBackSurgerySyndrome', () => {
  it('SCS candidate', () => {
    const r = Engine.FailedBackSurgerySyndrome({ previousSurgeries: 3, durationSinceLastSurgery: 24, depression: false, spinalCordStimulatorCandidate: true });
    assert(r.treatment.includes('spinal-cord-stimulator'));
  });
});

describe('MigraineSeverity', () => {
  it('chronic migraine CGRP', () => {
    const r = Engine.MigraineSeverity({ headacheDaysPerMonth: 18, severityScore: 8, disability: 'severe' });
    assertEq(r.category, 'chronic-migraine');
    assert(r.treatment.includes('CGRP'));
  });
});

describe('FibromyalgiaAssessment', () => {
  it('severe fibromyalgia', () => {
    const r = Engine.FibromyalgiaAssessment({ widespreadPainIndex: 12, symptomSeverity: 10, duration: '>3-months' });
    assertEq(r.category, 'fibromyalgia-severe');
  });
});

console.log();
console.log('pain engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
