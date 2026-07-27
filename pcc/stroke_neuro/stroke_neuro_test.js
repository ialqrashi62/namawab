'use strict';
const Engine = require('./stroke_neuro_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('STROKE/NEURO ENGINE TESTS\n========================================');

describe('NIHSS', () => {
  it('no stroke 0', () => {
    const r = Engine.NIHSS({ consciousness: 0, month: 0, gaze: 'normal', visual: 'none', facial: 'none', motorArmL: 0, motorArmR: 0, motorLegL: 0, motorLegR: 0 });
    assertEq(r.severity, 'no-stroke');
  });
  it('minor stroke 3', () => {
    const r = Engine.NIHSS({ consciousness: 0, month: 0, gaze: 'normal', visual: 'none', facial: 'partial', motorArmL: 0, motorArmR: 0, motorLegL: 0, motorLegR: 0 });
    assertEq(r.severity, 'minor');
  });
  it('moderate 10', () => {
    const r = Engine.NIHSS({ consciousness: 1, month: 0, gaze: 'partial', visual: 'partial', facial: 'partial', motorArmL: 1, motorArmR: 1, motorLegL: 0, motorLegR: 0, language: 'mild' });
    assert(r.score >= 5);
  });
  it('severe 25', () => {
    const r = Engine.NIHSS({ consciousness: 3, gaze: 'total', visual: 'total', facial: 'both', motorArmL: 4, motorArmR: 4, motorLegL: 4, motorLegR: 4, language: 'global' });
    assert(r.score >= 21);
  });
});

describe('mRS', () => {
  it('no symptoms', () => {
    const r = Engine.mRS({ score: 0 });
    assertEq(r.mRS, 0);
  });
  it('dead', () => {
    const r = Engine.mRS({ score: 6 });
    assertEq(r.mortality, true);
  });
});

describe('ASPECTS', () => {
  it('normal 10', () => {
    const r = Engine.ASPECTS({});
    assertEq(r.aspects, 10);
    assertEq(r.interpretation, 'small-infarct-thrombectomy-beneficial');
  });
  it('large infarct 3', () => {
    const r = Engine.ASPECTS({ location: ['caudate', 'lentiform', 'insula', 'mca_m1', 'mca_m2', 'mca_m3', 'mca_m4'] });
    assertEq(r.aspects, 3);
    assertEq(r.interpretation, 'large-infarct-avoid-thrombectomy');
  });
});

describe('ABCD2TIA', () => {
  it('high risk', () => {
    const r = Engine.ABCD2TIA({ age: 70, sbp: 160, clinicalFeatures: 'unilateral-weakness', diabetes: true, duration: 120 });
    assertEq(r.risk, 'high-stroke-risk');
  });
  it('low risk', () => {
    const r = Engine.ABCD2TIA({ age: 50, sbp: 120, clinicalFeatures: 'other', diabetes: false, duration: 5 });
    assertEq(r.risk, 'low-risk');
  });
});

describe('HuntHess', () => {
  it('grade 1 mild', () => {
    const r = Engine.HuntHess({ grade: 1 });
    assertEq(r.severity, 'mild');
  });
  it('grade 5 severe', () => {
    const r = Engine.HuntHess({ grade: 5 });
    assertEq(r.severity, 'severe');
    assertEq(r.mortalityPct, 50);
  });
});

describe('GCS_Total', () => {
  it('normal 15', () => {
    const r = Engine.GCS_Total({ eye: 4, verbal: 5, motor: 6 });
    assertEq(r.total, 15);
  });
  it('severe 7', () => {
    const r = Engine.GCS_Total({ eye: 2, verbal: 2, motor: 3 });
    assertEq(r.total, 7);
    assertEq(r.intubateIf, true);
  });
});

describe('ICHScore', () => {
  it('high risk', () => {
    const r = Engine.ICHScore({ gcs: 6, age: 85, infratentorial: true, ivhVolumeMl: 5, ichVolumeMl: 40 });
    assertEq(r.score, 5);
    assertEq(r.mortalityPct, 100);
  });
  it('low risk', () => {
    const r = Engine.ICHScore({ gcs: 15, age: 60, ichVolumeMl: 10 });
    assertEq(r.score, 0);
  });
});

describe('ThrombolysisEligibility', () => {
  it('eligible', () => {
    const r = Engine.ThrombolysisEligibility({ age: 65, symptomOnsetHours: 2, nihss: 10, inr: 1.0, platelets: 200000, sbp: 160, glucose: 100, ctExcludesHemorrhage: true });
    assertEq(r.eligible, true);
  });
  it('out of window', () => {
    const r = Engine.ThrombolysisEligibility({ age: 65, symptomOnsetHours: 6, nihss: 10, ctExcludesHemorrhage: true });
    assert(r.exclusions.includes('out-of-window'));
  });
});

describe('StatusEpilepticus', () => {
  it('established SE', () => {
    const r = Engine.StatusEpilepticus({ seizureType: 'convulsive', duration: 10 });
    assertEq(r.classification, 'established-SE');
  });
  it('NCSE', () => {
    const r = Engine.StatusEpilepticus({ seizureType: 'non-convulsive', duration: 20 });
    assertEq(r.classification, 'NCSE');
  });
});

describe('SubarachnoidHemorrhage', () => {
  it('fisher 4 high risk vasospasm', () => {
    const r = Engine.SubarachnoidHemorrhage({ fisherGrade: 4, huntHessGrade: 3 });
    assertEq(r.vasospasmRisk, 'high');
  });
});

console.log();
console.log('stroke_neuro engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
