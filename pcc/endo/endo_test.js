'use strict';
const assert = require('assert');
const Engine = require('./endo_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('ThyroidStorm', () => {
  it('storm', () => {
    const r = Engine.ThyroidStorm({ temperature: 40, hr: 150, atrialFibrillation: true, cns: 'agitation', gi: 'moderate' });
    assertEq(r.diagnosis, 'thyroid_storm');
  });
  it('unlikely', () => {
    const r = Engine.ThyroidStorm({ temperature: 37, hr: 80, atrialFibrillation: false, cns: null, gi: null });
    assertEq(r.diagnosis, 'unlikely');
  });
});

describe('MyxedemaComa', () => {
  it('coma diagnosis', () => {
    const r = Engine.MyxedemaComa({ gcs: 8, temperature: 33, bradycardia: true, hypothermia: true, sodiumLow: true, cortisolLow: false, tsh: 50, t4: 0.5 });
    assertEq(r.diagnosis, 'myxedema_coma');
  });
  it('uncomplicated', () => {
    const r = Engine.MyxedemaComa({ gcs: 15, temperature: 36, bradycardia: false, hypothermia: false, sodiumLow: false, cortisolLow: false, tsh: 5, t4: 1.0 });
    assertEq(r.diagnosis, 'uncomplicated');
  });
});

describe('DKAInitialFluidResuscitation', () => {
  it('70kg patient', () => {
    const r = Engine.DKAInitialFluidResuscitation({ weightKg: 70, sodium: 130, glucose: 500, hourOfDay: 0 });
    assertEq(r.totalFirstHourMl, 700);
    assertEq(r.useHalfNormal, true);
  });
});

describe('HHSInitialManagement', () => {
  it('severe HHS', () => {
    const r = Engine.HHSInitialManagement({ glucose: 700, osmolality: 350, sodium: 130, consciousness: 'lethargic', weightKg: 80 });
    assertEq(r.severity, 'severe');
    assertEq(r.fluidRate, 1200);
  });
});

describe('AdrenalInsufficiencyDiagnosis', () => {
  it('crisis', () => {
    const r = Engine.AdrenalInsufficiencyDiagnosis({ baselineCortisol: 2, postStimCortisol: 5, acthLevel: 200 });
    assertEq(r.diagnosis, 'adrenal_crisis');
  });
  it('secondary AI', () => {
    const r = Engine.AdrenalInsufficiencyDiagnosis({ baselineCortisol: 5, postStimCortisol: 15, acthLevel: 2 });
    assertEq(r.diagnosis, 'adrenal_insufficiency');
    assertEq(r.subtype, 'secondary');
  });
});

describe('HypoglycemiaSeverity', () => {
  it('severe', () => {
    const r = Engine.HypoglycemiaSeverity({ glucose: 25, symptoms: 'seizure', resolutionAfterGlucose: true });
    assertEq(r.severity, 'severe');
    assertEq(r.glucagonIndicated, true);
  });
});

describe('HypercalcemiaMalignancyDiagnosis', () => {
  it('PTH independent', () => {
    const r = Engine.HypercalcemiaMalignancyDiagnosis({ totalCalcium: 13, albumin: 3.5, pth: 10, vitaminD: 25, phosphorus: 2.5 });
    assertEq(r.diagnosis, 'PTH_independent');
  });
});

describe('SIADHDiagnosis', () => {
  it('SIADH', () => {
    const r = Engine.SIADHDiagnosis({ sodium: 120, osmolality: 250, urineOsmolality: 400, volume: 'euvolemic', thyroid: 'normal', adrenal: 'normal' });
    assertEq(r.diagnosis, 'SIADH');
  });
});

describe('PheochromocytomaScreening', () => {
  it('high probability', () => {
    const r = Engine.PheochromocytomaScreening({ plasmaMetanephrines: 5, urinaryMetanephrines: 800, familyHistory: false, imaging: 'pending', symptomsScore: 12 });
    assertEq(r.probability, 'high');
  });
});

describe('DiabetesInitialRegimen', () => {
  it('A1C 7.5 first line metformin', () => {
    const r = Engine.DiabetesInitialRegimen({ a1c: 7.5, age: 50, egfr: 80, bmi: 30, htn: true, hf: false, ascvd: false });
    assert(r.firstLine.includes('metformin'));
  });
  it('A1C 10 insulin', () => {
    const r = Engine.DiabetesInitialRegimen({ a1c: 10, age: 50, egfr: 80, bmi: 30, htn: false, hf: false, ascvd: false });
    assert(r.firstLine.includes('insulin'));
  });
});

console.log('endo engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
