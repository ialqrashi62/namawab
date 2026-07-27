'use strict';
const Engine = require('./bariatric_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('BARIATRIC ENGINE TESTS\n========================================');

describe('BMICategory', () => {
  it('class III obesity', () => {
    const r = Engine.BMICategory({ weightKg: 130, heightCm: 170 });
    assert(r.bmi >= 40);
    assertEq(r.category, 'obesity-class-III');
  });
});

describe('BariatricEligibility', () => {
  it('BMI 45 eligible', () => {
    const r = Engine.BariatricEligibility({ bmi: 45, age: 40, priorAttempt: true, psychiatricClearance: true, medicalClearance: true });
    assertEq(r.eligible, true);
  });
  it('no psychiatric clearance not eligible', () => {
    const r = Engine.BariatricEligibility({ bmi: 45, age: 40, priorAttempt: true, psychiatricClearance: false, medicalClearance: true });
    assertEq(r.eligible, false);
  });
});

describe('ProcedureChoice', () => {
  it('DM bypass', () => {
    const r = Engine.ProcedureChoice({ bmi: 40, t2dm: true });
    assert(r.recommendation.includes('bypass'));
  });
});

describe('WeightLossProgress', () => {
  it('on track', () => {
    const r = Engine.WeightLossProgress({ startWeightKg: 130, currentWeightKg: 110, weeksPostOp: 12, expectedPercent: 15 });
    assertEq(r.status, 'on-track');
  });
});

describe('ComorbidityResolution', () => {
  it('T2DM resolved', () => {
    const r = Engine.ComorbidityResolution({ t2dmStatus: 'remission', hypertensionStatus: 'improved', hyperlipidemiaStatus: 'improved', sleepApneaStatus: 'resolved', percentExcessWeightLoss: 60, monthsPostOp: 12 });
    assert(r.resolved.includes('T2DM'));
  });
});

describe('NutritionalDeficiency', () => {
  it('severe deficiency bypass', () => {
    const r = Engine.NutritionalDeficiency({ monthsPostOp: 18, procedure: 'roux-en-y-bypass', supplementation: false, vitaminB12: 100, iron: 20, vitaminD: 15, calcium: 8, proteinIntake: 40, paresthesiaSymptoms: true });
    assertEq(r.severity, 'severe-deficiency');
  });
});

describe('DumpingSyndrome', () => {
  it('severe dumping', () => {
    const r = Engine.DumpingSyndrome({ procedure: 'roux-en-y-bypass', rapidEating: true, highSugar: true, palpitations: true, diarrhea: true, sweating: true, dizziness: true });
    assertEq(r.category, 'severe-dumping');
  });
});

describe('PostOpComplications', () => {
  it('urgent leak evaluation', () => {
    const r = Engine.PostOpComplications({ procedure: 'sleeve-gastrectomy', daysPostOp: 3, tachycardia: true, fever: true });
    assertEq(r.alert, 'urgent-leak-evaluation');
  });
});

describe('SurgicalRisk', () => {
  it('high risk', () => {
    const r = Engine.SurgicalRisk({ age: 65, bmi: 55, asa: 3, priorSurgery: true, comorbidities: 4, diabetes: true, smoking: true, functionalCapacity: 'poor' });
    assertEq(r.category, 'high-risk');
  });
});

describe('PediatricObesity', () => {
  it('95th percentile intervention', () => {
    const r = Engine.PediatricObesity({ age: 12, bmi: 28, bmiPercentile: 97, tannerStage: 3, familyHistory: true });
    assertEq(r.category, 'obese-95th-percentile');
  });
});

console.log();
console.log('bariatric engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
