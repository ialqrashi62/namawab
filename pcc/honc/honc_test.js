'use strict';
const assert = require('assert');
const Engine = require('./honc_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('TumorLysisSyndrome', () => {
  it('high risk', () => {
    const r = Engine.TumorLysisSyndrome({ uricAcid: 9, potassium: 6.5, phosphorus: 7, calcium: 6.5 });
    assertEq(r.risk, 'high');
    assertEq(r.rasburicaseIndicated, true);
  });
  it('low risk', () => {
    const r = Engine.TumorLysisSyndrome({ uricAcid: 4, potassium: 4, phosphorus: 3, calcium: 9 });
    assertEq(r.risk, 'low');
  });
  it('intermediate', () => {
    const r = Engine.TumorLysisSyndrome({ uricAcid: 6, potassium: 5, phosphorus: 5, calcium: 8 });
    assertEq(r.risk === 'low' || r.risk === 'intermediate', true);
  });
});

describe('FebrileNeutropenia', () => {
  it('low risk MASCC >= 21', () => {
    const r = Engine.FebrileNeutropenia({ burdenIllness: 'none', hypotension: false, copd: false, solidTumor: true, age: 50, dehydration: false });
    assert(r.score >= 21);
    assertEq(r.lowRisk, true);
  });
  it('high risk hypotension', () => {
    const r = Engine.FebrileNeutropenia({ burdenIllness: 'severe', hypotension: true, copd: true, solidTumor: false, age: 70, dehydration: true });
    assertEq(r.lowRisk, false);
  });
});

describe('DICScore', () => {
  it('overt DIC', () => {
    const r = Engine.DICScore({ platelets: 30, ptRatio: 1.8, fibrinogen: 0.8, dDimer: 10 });
    assertEq(r.overtDIC, true);
  });
  it('not overt', () => {
    const r = Engine.DICScore({ platelets: 150, ptRatio: 1.1, fibrinogen: 3, dDimer: 2 });
    assertEq(r.overtDIC, false);
  });
});

describe('SepsisSourceIdentification', () => {
  it('line + mucositis', () => {
    const r = Engine.SepsisSourceIdentification({ centralLine: true, mucositis: true, diarrhea: false, pulmonaryInfiltrate: false, softTissue: false });
    assert(r.source.includes('line_related'));
    assertEq(r.antiPseudomonal, true);
  });
  it('pulmonary triggers antifungal', () => {
    const r = Engine.SepsisSourceIdentification({ centralLine: false, mucositis: false, diarrhea: false, pulmonaryInfiltrate: true, softTissue: false });
    assertEq(r.antiFungal, true);
  });
});

describe('CARTOXCRS', () => {
  it('grade 1 fever only', () => {
    const r = Engine.CARTOXCRS({ temperature: 38.5, neuroSymptoms: 'none', hypotension: false, hypoxia: false });
    assertEq(r.grade, 1);
  });
  it('grade 4 critical', () => {
    const r = Engine.CARTOXCRS({ temperature: 39, neuroSymptoms: 'critical', hypotension: true, hypoxia: true });
    assertEq(r.grade, 4);
    assertEq(r.intervention, 'icu');
  });
  it('grade 3 with steroids', () => {
    const r = Engine.CARTOXCRS({ temperature: 39, neuroSymptoms: 'severe', hypotension: false, hypoxia: false });
    assertEq(r.grade, 3);
    assertEq(r.intervention, 'steroids');
  });
});

describe('NeutropenicFeverEmpiric', () => {
  it('within 1 hour', () => {
    const r = Engine.NeutropenicFeverEmpiric({ anc: 100, temperature: 38.3, stableHemodynamics: true, penicillinAllergy: false, egfr: 80 });
    assertEq(r.within1Hour, true);
    assertEq(r.regimen, 'cefepime');
  });
  it('unstable adds vancomycin', () => {
    const r = Engine.NeutropenicFeverEmpiric({ anc: 100, temperature: 38.5, stableHemodynamics: false, penicillinAllergy: false, egfr: 60 });
    assert(r.regimen.includes('vancomycin'));
  });
  it('penicillin allergy uses meropenem', () => {
    const r = Engine.NeutropenicFeverEmpiric({ anc: 100, temperature: 38.3, stableHemodynamics: true, penicillinAllergy: true, egfr: 80 });
    assertEq(r.regimen, 'meropenem');
  });
  it('renal adjustment', () => {
    const r = Engine.NeutropenicFeverEmpiric({ anc: 100, temperature: 38.3, stableHemodynamics: true, penicillinAllergy: false, egfr: 20 });
    assertEq(r.renalAdjustment, true);
  });
});

describe('HypercalcemiaMalignancy', () => {
  it('severe corrected', () => {
    const r = Engine.HypercalcemiaMalignancy({ totalCalcium: 12, albumin: 3, symptoms: 'mild' });
    assert(r.correctedCalcium >= 12.8);
    assertEq(r.severity === 'moderate' || r.severity === 'severe', true);
  });
  it('severe symptoms forces severe', () => {
    const r = Engine.HypercalcemiaMalignancy({ totalCalcium: 11, albumin: 4, symptoms: 'severe' });
    assertEq(r.severity, 'severe');
    assertEq(r.treatment, 'calcitonin');
  });
});

describe('HyperviscositySyndrome', () => {
  it('high risk IgM >= 5', () => {
    const r = Engine.HyperviscositySyndrome({ igm: 6, hematocrit: 40, symptoms: 'none' });
    assertEq(r.risk, 'high');
    assertEq(r.plasmapheresisIndicated, true);
  });
  it('low risk', () => {
    const r = Engine.HyperviscositySyndrome({ igm: 2, hematocrit: 40, symptoms: 'none' });
    assertEq(r.risk, 'low');
    assertEq(r.plasmapheresisIndicated, false);
  });
});

describe('ImmuneEffectorCellAssociated', () => {
  it('grade 1 mild', () => {
    const r = Engine.ImmuneEffectorCellAssociated({ vasopressor: false, hypoxia: false, fluidResus: false, organToxicity: [] });
    assertEq(r.grade, 1);
    assertEq(r.management, 'supportive');
  });
  it('grade 4 multi-organ', () => {
    const r = Engine.ImmuneEffectorCellAssociated({ vasopressor: true, hypoxia: true, fluidResus: true, organToxicity: ['renal', 'liver'] });
    assertEq(r.grade, 4);
    assertEq(r.management, 'icu');
  });
});

describe('EngraftmentSyndrome', () => {
  it('high probability day 7 + fever + rash', () => {
    const r = Engine.EngraftmentSyndrome({ daysPostTransplant: 7, temperature: 38.5, weightGainKg: 2, rash: true, hypoxia: false });
    assertEq(r.probability, 'high');
    assertEq(r.treatment, 'steroid');
    assertEq(r.methylpredDose, 1);
  });
  it('low probability day 30', () => {
    const r = Engine.EngraftmentSyndrome({ daysPostTransplant: 30, temperature: 37, weightGainKg: 0, rash: false, hypoxia: false });
    assertEq(r.probability, 'low');
  });
});

console.log('honc engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
