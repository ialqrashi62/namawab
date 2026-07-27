/**
 * pcc/nnicu/nnicu_test.js
 * 50 unit tests for nnicu_engine.js
 */
'use strict';

const assert = require('assert');
const Engine = require('./nnicu_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log(`  \u2713 ${name}`); } catch (err) { failed++; console.error(`  \u2717 ${name}: ${err.message}`); } }
function describe(s, fn) { console.log(`\n${s}`); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`${m || 'eq'}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); }

describe('ApgarScore', () => {
  it('all 2s = 10 reassuring', () => {
    const r = Engine.ApgarScore({ appearance: 2, pulse: 2, grimace: 2, activity: 2, respiration: 2 });
    assertEq(r.total, 10); assertEq(r.category, 'reassuring');
  });
  it('all 1s = 5 moderate', () => {
    const r = Engine.ApgarScore({ appearance: 1, pulse: 1, grimace: 1, activity: 1, respiration: 1 });
    assertEq(r.total, 5); assertEq(r.category, 'moderately_depressed');
  });
  it('all 0s = 0 severe', () => {
    const r = Engine.ApgarScore({ appearance: 0, pulse: 0, grimace: 0, activity: 0, respiration: 0 });
    assertEq(r.total, 0); assertEq(r.category, 'severely_depressed');
  });
  it('throws on invalid', () => { assert.throws(() => Engine.ApgarScore({ appearance: 3, pulse: 2, grimace: 2, activity: 2, respiration: 2 })); });
  it('throws on missing', () => { assert.throws(() => Engine.ApgarScore({ appearance: 1 })); });
});

describe('BallardScore', () => {
  it('20w GA at score 0', () => { assertEq(Engine.BallardScore(0).weeks, 20); });
  it('30w GA at score 20', () => { assertEq(Engine.BallardScore(20).weeks, 30); });
  it('40w term at score 40', () => { const r = Engine.BallardScore(40); assertEq(r.maturity, 'term'); });
  it('post-term at score 45', () => { assertEq(Engine.BallardScore(45).maturity, 'post_term'); });
  it('preterm at score 25', () => { assertEq(Engine.BallardScore(25).maturity, 'preterm'); });
  it('throws invalid', () => { assert.throws(() => Engine.BallardScore(-1)); });
  it('throws > 50', () => { assert.throws(() => Engine.BallardScore(51)); });
});

describe('NeonatalVentSettings', () => {
  it('preterm 28w 1kg RDS', () => {
    const r = Engine.NeonatalVentSettings({ weightKg: 1, gestationalAgeWeeks: 28, indication: 'rds' });
    assertEq(r.pip, 18); assertEq(r.fio2, 0.30);
  });
  it('term 39w 3kg routine', () => {
    const r = Engine.NeonatalVentSettings({ weightKg: 3, gestationalAgeWeeks: 39, indication: 'routine' });
    assertEq(r.pip, 22); assertEq(r.fio2, 0.21);
  });
  it('PEEP 5', () => {
    const r = Engine.NeonatalVentSettings({ weightKg: 2, gestationalAgeWeeks: 35 });
    assertEq(r.peep, 5);
  });
  it('rate 50 preterm', () => {
    const r = Engine.NeonatalVentSettings({ weightKg: 1, gestationalAgeWeeks: 30 });
    assertEq(r.rate, 50);
  });
  it('throws invalid weight', () => { assert.throws(() => Engine.NeonatalVentSettings({ weightKg: 0, gestationalAgeWeeks: 30 })); });
});

describe('SurfactantDosing', () => {
  it('Curosurf first dose 200 mg/kg', () => {
    const r = Engine.SurfactantDosing({ drug: 'curosurf', weightKg: 1.5, isFirstDose: true });
    assertEq(r.totalMg, 300); assertEq(r.drug, 'poractant_alfa');
  });
  it('Curosurf repeat 100 mg/kg', () => {
    const r = Engine.SurfactantDosing({ drug: 'poractant_alfa', weightKg: 1.5, isFirstDose: false });
    assertEq(r.totalMg, 150);
  });
  it('Survanta 100 mg/kg', () => {
    const r = Engine.SurfactantDosing({ drug: 'beractant', weightKg: 2, isFirstDose: true });
    assertEq(r.totalMg, 200);
  });
  it('Curosurf volume 80mg/mL', () => {
    const r = Engine.SurfactantDosing({ drug: 'curosurf', weightKg: 1, isFirstDose: true });
    assertEq(r.volumeMl, 2.5);
  });
  it('throws invalid', () => { assert.throws(() => Engine.SurfactantDosing({ drug: 'curosurf', weightKg: 0, isFirstDose: true })); });
});

describe('TherapeuticHypothermiaEligibility', () => {
  it('eligible full term + HIE + within 6h', () => {
    const r = Engine.TherapeuticHypothermiaEligibility({ gestationalAgeWeeks: 39, cordPh: 6.9, baseExcess: -18, encephalopathyGrade: 'moderate', hoursAfterBirth: 2 });
    assertEq(r.eligible, true); assertEq(r.targetTempC, 33.5);
  });
  it('not eligible preterm 34w', () => {
    const r = Engine.TherapeuticHypothermiaEligibility({ gestationalAgeWeeks: 34, cordPh: 6.9, baseExcess: -18, encephalopathyGrade: 'moderate', hoursAfterBirth: 2 });
    assertEq(r.eligible, false);
  });
  it('not eligible after 6h', () => {
    const r = Engine.TherapeuticHypothermiaEligibility({ gestationalAgeWeeks: 39, cordPh: 6.9, baseExcess: -18, encephalopathyGrade: 'severe', hoursAfterBirth: 7 });
    assertEq(r.eligible, false);
  });
  it('not eligible mild HIE', () => {
    const r = Engine.TherapeuticHypothermiaEligibility({ gestationalAgeWeeks: 39, cordPh: 6.9, baseExcess: -18, encephalopathyGrade: 'mild', hoursAfterBirth: 2 });
    assertEq(r.eligible, false);
  });
  it('duration 72h', () => {
    const r = Engine.TherapeuticHypothermiaEligibility({ gestationalAgeWeeks: 39, cordPh: 6.9, baseExcess: -18, encephalopathyGrade: 'moderate', hoursAfterBirth: 2 });
    assertEq(r.durationHours, 72);
  });
});

describe('IVHGrade', () => {
  it('no IVH = 0', () => assertEq(Engine.IVHGrade({}).grade, 0));
  it('GMH only = 1', () => assertEq(Engine.IVHGrade({ germinalMatrix: true }).grade, 1));
  it('IVH no dilation = 2', () => assertEq(Engine.IVHGrade({ ivh: true }).grade, 2));
  it('IVH with dilation = 3', () => assertEq(Engine.IVHGrade({ ivh: true, ventricularDilation: true }).grade, 3));
  it('parenchymal = 4', () => { const r = Engine.IVHGrade({ parenchymal: true }); assertEq(r.grade, 4); assertEq(r.requiresVPShunt, true); });
  it('grade 3 requires neurosurgery', () => { assertEq(Engine.IVHGrade({ ivh: true, ventricularDilation: true }).requiresNeurosurgery, true); });
});

describe('NECStage', () => {
  it('suspected = I', () => assertEq(Engine.NECStage({}).stage, 'I'));
  it('confirmed no systemic = IIA', () => assertEq(Engine.NECStage({ confirmedOnXRay: true }).stage, 'IIA'));
  it('confirmed with systemic = IIB', () => assertEq(Engine.NECStage({ confirmedOnXRay: true, systemicSigns: true }).stage, 'IIB'));
  it('pneumoperitoneum no surgery = IIIA', () => assertEq(Engine.NECStage({ pneumoperitoneum: true, requiresSurgery: false }).stage, 'IIIA'));
  it('pneumoperitoneum + surgery = IIIB', () => { const r = Engine.NECStage({ pneumoperitoneum: true, requiresSurgery: true }); assertEq(r.stage, 'IIIB'); assertEq(r.surgery, true); });
});

describe('PhototherapyThreshold', () => {
  it('low bili = none', () => { assertEq(Engine.PhototherapyThreshold({ ageHours: 48, totalSerumBilirubin: 5, gestationalAgeWeeks: 39 }).level, 'none'); });
  it('at threshold = phototherapy', () => { assertEq(Engine.PhototherapyThreshold({ ageHours: 48, totalSerumBilirubin: 9, gestationalAgeWeeks: 39 }).level, 'phototherapy'); });
  it('high = exchange transfusion', () => { assertEq(Engine.PhototherapyThreshold({ ageHours: 48, totalSerumBilirubin: 18, gestationalAgeWeeks: 39 }).level, 'exchange_transfusion'); });
  it('preterm lower threshold', () => { const r = Engine.PhototherapyThreshold({ ageHours: 48, totalSerumBilirubin: 7, gestationalAgeWeeks: 35 }); assertEq(r.level, 'phototherapy'); });
  it('risk factors lower', () => { const r = Engine.PhototherapyThreshold({ ageHours: 48, totalSerumBilirubin: 8, gestationalAgeWeeks: 39, hasRiskFactors: true }); assertEq(r.level, 'phototherapy'); });
});

describe('ROPStage', () => {
  it('stage 0 routine', () => { assertEq(Engine.ROPStage({ stage: 0 }).treatment, 'routine_screening'); });
  it('stage 1 continue', () => { assertEq(Engine.ROPStage({ stage: 1 }).treatment, 'continue_screening'); });
  it('stage 2 closer', () => { assertEq(Engine.ROPStage({ stage: 2 }).treatment, 'closer_followup'); });
  it('stage 3 with plus = laser', () => { const r = Engine.ROPStage({ stage: 3, plusDisease: true }); assertEq(r.treatment, 'laser_or_anti_VEGF'); assertEq(r.requiresAntiVEGF, true); });
  it('stage 4 surgical', () => { assertEq(Engine.ROPStage({ stage: 4 }).treatment, 'surgical_consult_vitreoretinal'); });
  it('stage 5 surgery', () => { assertEq(Engine.ROPStage({ stage: 5 }).treatment, 'surgical_vitreoretinal'); });
  it('throws invalid', () => { assert.throws(() => Engine.ROPStage({ stage: 6 })); });
});

describe('NeonatalSepsisScore', () => {
  it('low risk normal newborn', () => { const r = Engine.NeonatalSepsisScore({ gestationalAgeWeeks: 39, ageAtOnsetHours: 12, maternalGbs: 'negative', romHours: 6, maternalTempC: 37, clinicalSigns: [] }); assertEq(r.risk, 'low'); });
  it('intermediate GBS positive', () => { const r = Engine.NeonatalSepsisScore({ gestationalAgeWeeks: 39, ageAtOnsetHours: 12, maternalGbs: 'positive', romHours: 24, maternalTempC: 37, clinicalSigns: [] }); assertEq(r.risk, 'intermediate'); });
  it('high GBS+ROM+fever+signs', () => { const r = Engine.NeonatalSepsisScore({ gestationalAgeWeeks: 39, ageAtOnsetHours: 12, maternalGbs: 'positive', romHours: 24, maternalTempC: 38.5, clinicalSigns: ['lethargy', 'apnea'] }); assertEq(r.risk, 'high'); });
  it('preterm adds risk', () => { const r = Engine.NeonatalSepsisScore({ gestationalAgeWeeks: 30, ageAtOnsetHours: 12, maternalGbs: 'positive', romHours: 6, maternalTempC: 37, clinicalSigns: [] }); assertEq(r.risk, 'intermediate'); });
  it('early vs late onset', () => { const r1 = Engine.NeonatalSepsisScore({ gestationalAgeWeeks: 39, ageAtOnsetHours: 50, maternalGbs: 'negative', romHours: 6, maternalTempC: 37, clinicalSigns: [] }); assertEq(r1.earlyOnset, true); });
});

console.log(`\n${'='.repeat(40)}`);
console.log(`NNICU engine tests: ${passed} passed, ${failed} failed`);
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);
