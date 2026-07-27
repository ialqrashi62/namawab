'use strict';
const assert = require('assert');
const Engine = require('./nephro_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('GFR_CKDEPI_2021', () => {
  it('female 30y Cr 0.8 normal', () => {
    const r = Engine.GFR_CKDEPI_2021({ creatinine: 0.8, age: 30, sex: 'female' });
    assert(r.egfr >= 90);
    assertEq(r.stage, 1);
  });
  it('male 70y Cr 2.0 stage 3a', () => {
    const r = Engine.GFR_CKDEPI_2021({ creatinine: 2.0, age: 70, sex: 'male' });
    assert(r.egfr < 60);
  });
});

describe('AKIKDIGO_Staging', () => {
  it('stage 1 from 0.3 rise', () => {
    const r = Engine.AKIKDIGO_Staging({ baselineCr: 1.0, currentCr: 1.4, urineOutputMlKgHr: 1.0, hoursOfOliguria: 0 });
    assertEq(r.stage, 1);
  });
  it('stage 3 from 3x rise', () => {
    const r = Engine.AKIKDIGO_Staging({ baselineCr: 1.0, currentCr: 4.0, urineOutputMlKgHr: 0.5, hoursOfOliguria: 12 });
    assertEq(r.stage, 3);
  });
  it('stage 3 from oliguria', () => {
    const r = Engine.AKIKDIGO_Staging({ baselineCr: 1.0, currentCr: 1.5, urineOutputMlKgHr: 0.2, hoursOfOliguria: 30 });
    assertEq(r.stage, 3);
  });
});

describe('HyperkalemiaECG_Emergency', () => {
  it('peaked T immediate calcium', () => {
    const r = Engine.HyperkalemiaECG_Emergency({ potassium: 6.5, ecgChanges: 'peaked_t', dialysisAccess: true, onLasix: false });
    assert(r.action.includes('calcium'));
  });
});

describe('RenalReplacementModality', () => {
  it('CRRT for unstable AKI', () => {
    const r = Engine.RenalReplacementModality({ aki: true, hemodynamicStability: false, vascularAccess: 'central_venous', residualUrineOutput: 100, fluidOverload: false, transferToIcuPossible: true });
    assertEq(r.modality, 'CRRT');
  });
});

describe('RRTInitiationTiming', () => {
  it('emergent hyperkalemia', () => {
    const r = Engine.RRTInitiationTiming({ akiStage: 3, refractoryFluidOverload: false, refractoryHyperkalemia: true, severeAcidosis: false, urea: 80, uremicComplications: false });
    assertEq(r.urgency, 'emergent');
  });
});

describe('HeparinInducedThrombocytopenia', () => {
  it('high probability', () => {
    const r = Engine.HeparinInducedThrombocytopenia({ thrombocytopeniaNadir: 15, pltDropPct: 60, timingDays: 7, thrombosis: true, otherCauses: false, skinNecrosis: false });
    assertEq(r.probability, 'high');
  });
});

describe('HyponatremiaCorrection', () => {
  it('safe correction', () => {
    const r = Engine.HyponatremiaCorrection({ weightKg: 70, currentNa: 120, targetNa: 128, durationHours: 48 });
    assertEq(r.safeCorrection, true);
  });
});

describe('HypernatremiaCorrection', () => {
  it('free water deficit 60kg 160->140', () => {
    const r = Engine.HypernatremiaCorrection({ weightKg: 60, currentNa: 160, targetNa: 140 });
    assert(r.freeWaterDeficitL > 1);
  });
});

describe('CKDProgressionMonitoring', () => {
  it('stage 4 nephrology referral', () => {
    const r = Engine.CKDProgressionMonitoring({ egfr: 25, albuminuriaCategory: 'A2', bpControl: true, diabetesControl: true, hba1c: 7 });
    assertEq(r.nephrologyReferral, true);
  });
});

describe('RenalTransplantEvaluation', () => {
  it('strong candidate', () => {
    const r = Engine.RenalTransplantEvaluation({ egfr: 15, age: 50, malignancy: false, activeInfection: false, bmi: 28, psychiatricClearance: true, financialClearance: true, donorAvailable: true });
    assertEq(r.status, 'strong_candidate');
  });
});

console.log('nephro engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
