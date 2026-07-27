'use strict';
const Engine = require('./maternal_fetal_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('MATERNAL FETAL ENGINE TESTS\n========================================');

describe('PretermBirthRisk', () => {
  it('high risk short cervix', () => {
    const r = Engine.PretermBirthRisk({ priorPreterm: true, cervicalLength: 18, gestationalAge: 28 });
    assertEq(r.category, 'high-risk-preterm-immediate-intervention');
  });
});

describe('PreeclampsiaSeverity', () => {
  it('severe features', () => {
    const r = Engine.PreeclampsiaSeverity({ systolic: 170, diastolic: 110, proteinuria: 6, gestationalAge: 36 });
    assertEq(r.category, 'preeclampsia-with-severe-features');
  });
  it('no preeclampsia', () => {
    const r = Engine.PreeclampsiaSeverity({ systolic: 110, diastolic: 70, gestationalAge: 32 });
    assertEq(r.category, 'no-preeclampsia');
  });
});

describe('HELLP', () => {
  it('complete HELLP', () => {
    const r = Engine.HELLP({ platelets: 50000, ast: 100, alt: 90, ldh: 800, schistocytes: true });
    assertEq(r.category, 'HELLP-syndrome-complete');
  });
});

describe('GestationalDiabetes', () => {
  it('GCT 200 implies GDM', () => {
    const r = Engine.GestationalDiabetes({ oneHourGCT: 200 });
    assertEq(r.screening, 'GDM-implied-by-GCT-200');
  });
  it('OGTT GDM 2+', () => {
    const r = Engine.GestationalDiabetes({ oneHourGCT: 150, threeHourOGTT_F: 100, threeHourOGTT_1: 200, threeHourOGTT_2: 160, threeHourOGTT_3: 130 });
    assertEq(r.ogtt, 'GDM-carpenter-coustan-criteria-met');
  });
});

describe('FetalGrowthRestriction', () => {
  it('severe FGR', () => {
    const r = Engine.FetalGrowthRestriction({ estimatedFetalWeight: 2, gestationalAge: 35 });
    assertEq(r.category, 'severe-FGR-3rd-percentile');
  });
});

describe('PreeclampsiaFirstTrimester', () => {
  it('high risk aspirin', () => {
    const r = Engine.PreeclampsiaFirstTrimester({ meanArterialPressure: 100, priorPreeclampsia: true, bmi: 35, chronicHypertension: true });
    assertEq(r.category, 'high-risk-consider-aspirin-150mg');
  });
});

describe('TwinGestation', () => {
  it('mono-mono very high risk', () => {
    const r = Engine.TwinGestationManagement({ chorionicity: 'monochorionic-monoamniotic', gestationalAge: 16 });
    assert(r.assessment.includes('MM'));
  });
});

describe('PPHRisk', () => {
  it('very high PPH', () => {
    const r = Engine.PPHRisk({ placentaAccreta: true, priorPPH: true, coagulationDisorder: true, uterineAtonyRisk: true });
    assertEq(r.category, 'very-high-PPH');
  });
});

describe('FetalHeartRate', () => {
  it('Category 3', () => {
    const r = Engine.FetalHeartRate({ baseline: 110, variability: 'absent', decelerations: 'late-decelerations', duration: 90 });
    assert(r.category.startsWith('Category-3'));
  });
  it('Category 1 normal', () => {
    const r = Engine.FetalHeartRate({ baseline: 140, variability: 'moderate', accelerations: 3 });
    assert(r.category === 'Category-1-normal');
  });
});

describe('Aspirin', () => {
  it('indication prior preeclampsia', () => {
    const r = Engine.PreeclampsiaAspirin({ priorPreeclampsia: true, gestationalAgeStarted: 14 });
    assertEq(r.indication, true);
  });
});

console.log();
console.log('maternal_fetal engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
