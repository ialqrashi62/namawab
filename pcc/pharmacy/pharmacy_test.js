'use strict';
const Engine = require('./pharmacy_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PHARMACY ENGINE TESTS\n========================================');

describe('DoseRenal', () => {
  it('egfr 50 → 75%', () => {
    const r = Engine.DoseRenal({ drug: 'vancomycin', baseDoseMg: 1000, egfr: 50, weightKg: 70 });
    assertEq(r.factor, 0.75);
  });
  it('egfr 5 → 25%', () => {
    const r = Engine.DoseRenal({ drug: 'vancomycin', baseDoseMg: 1000, egfr: 5, weightKg: 70 });
    assertEq(r.factor, 0.25);
  });
});

describe('DoseHepatic', () => {
  it('childPugh 12 → 25%', () => {
    const r = Engine.DoseHepatic({ drug: 'warfarin', baseDoseMg: 5, childPugh: 12 });
    assertEq(r.factor, 0.25);
  });
  it('childPugh 5 → 75%', () => {
    const r = Engine.DoseHepatic({ drug: 'warfarin', baseDoseMg: 5, childPugh: 5 });
    assertEq(r.factor, 0.75);
  });
});

describe('Interaction', () => {
  it('major', () => {
    const r = Engine.Interaction({ drugA: 'warfarin', drugB: 'aspirin', knownList: [{ pair: ['warfarin', 'aspirin'], severity: 'major', mechanism: 'bleeding risk', action: 'avoid' }] });
    assertEq(r.severity, 'major');
  });
  it('unknown', () => {
    const r = Engine.Interaction({ drugA: 'xyz', drugB: 'abc' });
    assertEq(r.severity, 'unknown');
  });
});

describe('Allergy', () => {
  it('penicillin direct', () => {
    const r = Engine.Allergy({ patientAllergies: ['penicillin'], drug: 'penicillin' });
    assertEq(r.contraindicated, true);
  });
  it('cross-reactivity cephalosporin', () => {
    const r = Engine.Allergy({ patientAllergies: ['penicillin'], drug: 'cefazolin', classCrossReactivity: [{ cls: 'penicillin', cross: ['cefazolin'] }] });
    assertEq(r.contraindicated, true);
  });
  it('no allergy', () => {
    const r = Engine.Allergy({ patientAllergies: ['sulfa'], drug: 'penicillin' });
    assertEq(r.contraindicated, false);
  });
});

describe('IVPOConversion', () => {
  it('iv 100 → po 200 (50% ba)', () => {
    const r = Engine.IVPOConversion({ drug: 'morphine', ivDoseMg: 100, bioavailability: 0.5 });
    assertEq(r.poDose, 200);
  });
});

describe('AntibioticStewardship', () => {
  it('prolonged without culture', () => {
    const r = Engine.AntibioticStewardship({ currentAntibiotic: 'pip-tazo', daysOnTherapy: 9 });
    assertEq(r.action, 're-evaluate');
  });
  it('narrow on sensitivity', () => {
    const r = Engine.AntibioticStewardship({ currentAntibiotic: 'vancomycin', daysOnTherapy: 5, cultureResult: { sensitiveTo: ['cefazolin'] } });
    assertEq(r.action, 'change antibiotic');
  });
});

describe('TherapeuticMonitoring', () => {
  it('in range', () => {
    const r = Engine.TherapeuticMonitoring({ drug: 'vancomycin', level: 15, targetLow: 10, targetHigh: 20 });
    assertEq(r.inRange, true);
  });
  it('high', () => {
    const r = Engine.TherapeuticMonitoring({ drug: 'vancomycin', level: 25, targetLow: 10, targetHigh: 20 });
    assertEq(r.action, 'decrease dose');
  });
});

describe('VTEProphylaxis', () => {
  it('orthopedic extended', () => {
    const r = Engine.VTEProphylaxis({ age: 65, surgeryType: 'orthopedic' });
    assertEq(r.prophylaxis, 'LMWH (extended 35 days)');
  });
  it('active bleeding', () => {
    const r = Engine.VTEProphylaxis({ age: 50, activeBleeding: true });
    assertEq(r.prophylaxis, 'none');
  });
});

describe('PainManagement', () => {
  it('mild pain', () => {
    const r = Engine.PainManagement({ painScore: 2 });
    assertEq(r.recommendation, 'non-opioid');
  });
  it('severe opioid-naive', () => {
    const r = Engine.PainManagement({ painScore: 9, isOpioidNaive: true });
    assertEq(r.drug, 'oxycodone 5mg');
  });
});

describe('Reconciliation', () => {
  it('continued + new', () => {
    const r = Engine.Reconciliation({
      homeMedications: [{ drug: 'metformin', dose: '500mg bid' }, { drug: 'lisinopril', dose: '10mg qd' }],
      currentMedications: [{ drug: 'metformin', dose: '500mg bid' }, { drug: 'aspirin', dose: '81mg qd' }],
    });
    assertEq(r.totalContinued, 1);
    assertEq(r.totalDiscontinued, 1);
    assertEq(r.totalNew, 1);
  });
});

console.log();
console.log('pharmacy engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
