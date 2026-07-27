'use strict';
const Engine = require('./cardio_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('CARDIO EXT ENGINE TESTS\n========================================');

describe('HFrEFvsHFpEF', () => {
  it('HFrEF', () => {
    const r = Engine.HFrEFvsHFpEF({ lvef: 30, ntProBNP: 1000, lavi: 30, lvmIndex: 100, diastolicFunction: 'grade-1' });
    assertEq(r.classification, 'HFrEF-LVEF-less-than-40');
  });
  it('HFpEF', () => {
    const r = Engine.HFrEFvsHFpEF({ lvef: 60, ntProBNP: 700, lavi: 36, lvmIndex: 100, diastolicFunction: 'grade-2-or-3' });
    assertEq(r.classification, 'HFpEF');
  });
});

describe('HeartFailureStage', () => {
  it('stage D', () => {
    const r = Engine.HeartFailureStage({ lvef: 25, symptoms: true, hospitalizationPastYear: 3, onOptimalTherapy: true });
    assertEq(r.stage, 'Stage-D-advanced');
  });
});

describe('LVADIndication', () => {
  it('bridge to transplant', () => {
    const r = Engine.LVADIndication({ lvef: 15, inotropicDependence: true, candidateForTransplant: true, INTERMACSProfile: '2-progressive-decline' });
    assertEq(r.indication, 'bridge-to-transplant');
  });
});

describe('PCIScore', () => {
  it('very high MACE', () => {
    const r = Engine.PCIScore({ age: 80, dm: true, priorCABG: true, lvef: 20, multivesselDisease: true, leftMain: true });
    assertEq(r.risk, 'very-high-MACE');
  });
});

describe('StructuralHeartTAVR', () => {
  it('prohibitive risk TAVR', () => {
    const r = Engine.StructuralHeartTAVR({ age: 85, surgicalRisk: 'prohibitive', annulusArea: 500 });
    assertEq(r.category, 'prohibitive-risk-TAVR-preferred');
  });
});

describe('SuddenCardiacDeathRisk', () => {
  it('primary prevention ICD', () => {
    const r = Engine.SuddenCardiacDeathRisk({ lvef: 30, nyha: 2 });
    assertEq(r.indication, 'primary-prevention-ICD');
  });
});

describe('LipidManagement', () => {
  it('very high LDL', () => {
    const r = Engine.LipidManagement({ ldl: 180, priorMI: true, age: 55 });
    assertEq(r.risk, 'very-high-ASCVD');
  });
});

describe('AF CHA2DS2VASc', () => {
  it('anticoagulation recommended', () => {
    const r = Engine.AtrialFibrillationStrokeCHA2DS2VASc({ age: 75, sex: 'male', hypertension: true, diabetes: true });
    assert(r.score >= 4);
  });
});

describe('HASBLED', () => {
  it('high bleeding', () => {
    const r = Engine.HASBLED({ hypertension: true, abnormalRenal: true, abnormalLiver: true, stroke: true, elderly: true });
    assertEq(r.risk, 'high-bleeding-risk-monitor');
  });
});

describe('MR VHD', () => {
  it('severe LV dysfunction', () => {
    const r = Engine.ValvularHeartMitralRegurgitation({ etiology: 'primary-degenerative', severity: 'severe', lvef: 50, lvesd: 45, symptoms: true });
    assertEq(r.category, 'severe-MR-LV-dysfunction-surgery');
  });
});

console.log();
console.log('cardio_ext engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
