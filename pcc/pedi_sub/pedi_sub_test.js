'use strict';
const Engine = require('./pedi_sub_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PEDI SUB ENGINE TESTS\n========================================');

describe('PediatricGCS', () => {
  it('severe head injury', () => {
    const r = Engine.PediatricGCS({ eyeOpening: 1, verbalResponse: 1, motorResponse: 2, age: 5 });
    assertEq(r.severity, 'severe-head-injury');
  });
});

describe('PediatricBacterialMeningitis', () => {
  it('bacterial', () => {
    const r = Engine.PediatricBacterialMeningitis({ age: 5, fever: true, neckStiffness: true, alteredMentalStatus: true, csfWbc: 5000, csfProtein: 200, csfGlucose: 30 });
    assertEq(r.diagnosis, 'bacterial-meningitis');
  });
});

describe('PediatricAsthmaSeverity', () => {
  it('severe exacerbation', () => {
    const r = Engine.PediatricAsthmaSeverity({ respiratoryRate: 80, oxygenSaturation: 88, accessoryMuscle: true, wheeze: 'silent', abilityToSpeak: 'unable' });
    assertEq(r.classification, 'severe-exacerbation');
  });
});

describe('PediatricDehydration', () => {
  it('severe', () => {
    const r = Engine.PediatricDehydration({ weightLoss: 12, skinTurgor: 'decreased', mucousMembranes: 'dry', mentalStatus: 'lethargic' });
    assertEq(r.severity, 'severe-dehydration-bolus');
  });
});

describe('PediatricAcuteNephriticSyndrome', () => {
  it('PSGN definite', () => {
    const r = Engine.PediatricAcuteNephriticSyndrome({ age: 8, hypertension: true, edema: true, hematuria: true, c3Low: true, recentPharyngitis: true });
    assertEq(r.diagnosis, 'PSGN-definite');
  });
});

describe('PediatricUTI', () => {
  it('febrile UTI', () => {
    const r = Engine.PediatricUTI({ age: 1, fever: true, pyuria: true, nitrites: true, leukocyteEsterase: true });
    assertEq(r.diagnosis, 'febrile-UTI-pyelonephritis');
  });
});

describe('PediatricCardiacFailure', () => {
  it('class IV', () => {
    const r = Engine.PediatricCardiacFailure({ age: 2, tachypnea: true, tachycardia: true, hepatomegaly: true, edema: true, cardiomegaly: true, congestionOnCXR: true });
    assertEq(r.classification, 'Ross-Score-Class-IV-severe-heart-failure');
  });
});

describe('PediatricDiabetesType1', () => {
  it('T1DM definite', () => {
    const r = Engine.PediatricDiabetesType1({ age: 8, polyuria: true, polydipsia: true, weightLoss: true, glucose: 350, hba1c: 11 });
    assertEq(r.diagnosis, 'T1DM-definite');
  });
});

describe('PediatricFebrileSeizure', () => {
  it('simple febrile seizure', () => {
    const r = Engine.PediatricFebrileSeizure({ age: 24, fever: true, seizureDuration: 5, seizureType: 'generalized' });
    assertEq(r.classification, 'simple-febrile-seizure');
  });
});

describe('KawasakiDisease', () => {
  it('classical', () => {
    const r = Engine.KawasakiDisease({ feverDays: 6, conjunctivitis: true, mucosalChanges: true, extremityChanges: true, cervicalLymphadenopathy: true });
    assertEq(r.diagnosis, 'Kawasaki-disease-classical');
  });
});

console.log();
console.log('pedi_sub engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
