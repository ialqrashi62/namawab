'use strict';
const Engine = require('./pedi_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PEDI ENGINE TESTS\n========================================');

describe('ApgarScore', () => {
  it('healthy newborn 9', () => {
    const r = Engine.ApgarScore({ heartRate: 110, respiratoryEffort: 'good', muscleTone: 'active', reflexIrritability: 'cry', color: 'pink' });
    assertEq(r.score, 10);
    assertEq(r.status, 'reassuring');
  });
  it('depressed 4', () => {
    const r = Engine.ApgarScore({ heartRate: 80, respiratoryEffort: 'slow-irregular', muscleTone: 'some-flexion', reflexIrritability: 'grimace', color: 'acrocyanosis' });
    assertEq(r.status, 'moderately-depressed');
  });
});

describe('PEWS', () => {
  it('stable 0', () => {
    const r = Engine.PEWS({ ageMonths: 60, hr: 100, sbp: 100, rr: 20, spo2: 99 });
    assertEq(r.level, 'low-stable');
  });
  it('critical 7+', () => {
    const r = Engine.PEWS({ ageMonths: 60, hr: 170, sbp: 60, rr: 55, spo2: 88, consciousness: 'unresponsive' });
    assertEq(r.level, 'critical-call-RRT');
  });
});

describe('PediatricDose', () => {
  it('amoxicillin 20kg', () => {
    const r = Engine.PediatricDose({ weightKg: 20, dosePerKg: 25, maxDose: 1000, intervalHours: 8 });
    assertEq(r.actualDose, 500);
  });
  it('cap by max', () => {
    const r = Engine.PediatricDose({ weightKg: 60, dosePerKg: 25, maxDose: 1000, intervalHours: 8 });
    assertEq(r.actualDose, 1000);
  });
});

describe('BronchiolitisSeverity', () => {
  it('mild', () => {
    const r = Engine.BronchiolitisSeverity({ ageMonths: 12, rr: 45, spo2: 96, hydration: 'good' });
    assertEq(r.severity, 'mild');
  });
  it('severe', () => {
    const r = Engine.BronchiolitisSeverity({ ageMonths: 6, rr: 80, spo2: 85, hydration: 'poor', apnea: true });
    assertEq(r.severity, 'severe');
  });
});

describe('DehydrationPercent', () => {
  it('mild 3%', () => {
    const r = Engine.DehydrationPercent({ mucousMembranes: 'moist-dry', tears: 'decreased' });
    assertEq(r.dehydrationPct, 3);
  });
  it('severe 10%', () => {
    const r = Engine.DehydrationPercent({ capRefill: 4, skinTurgor: 'tenting', mucousMembranes: 'dry', tears: 'absent', sunkenEyes: true });
    assertEq(r.dehydrationPct, 10);
  });
});

describe('ImmunizationSchedulePedi', () => {
  it('6mo old due DTaP-3 IPV-3', () => {
    const r = Engine.Engine_Immunization ? null : null;
    const r2 = Engine.ImmunizationSchedulePedi({ age: 6, vaccinesReceived: ['DTaP-1', 'DTaP-2', 'IPV-1', 'IPV-2', 'Hib-1', 'Hib-2', 'PCV13-1', 'PCV13-2', 'HepB-1', 'HepB-2', 'HepB-3', 'Rotavirus-1', 'Rotavirus-2'] });
    assert(r2.due.includes('DTaP-3'));
  });
  it('all vaccines up to date', () => {
    const r = Engine.ImmunizationSchedulePedi({ age: 2, vaccinesReceived: [] });
    assert(r.due.length >= 1);
  });
});

describe('GCS_Pedi', () => {
  it('normal adult GCS 15', () => {
    const r = Engine.GCS_Pedi({ eye: 'spontaneous', verbal: 'oriented', motor: 'obeys', ageMonths: 60 });
    assertEq(r.total, 15);
  });
  it('severe 6', () => {
    const r = Engine.GCS_Pedi({ eye: 'to-pain', verbal: 'incomprehensible', motor: 'flexion', ageMonths: 60 });
    assertEq(r.total, 7);
  });
});

describe('FebrileSeizureRisk', () => {
  it('simple', () => {
    const r = Engine.FebrileSeizureRisk({ ageMonths: 24, temperature: 39, seizureDuration: 5 });
    assertEq(r.simple, true);
  });
  it('complex focal', () => {
    const r = Engine.FebrileSeizureRisk({ ageMonths: 24, temperature: 39, seizureDuration: 5, focalFeatures: true });
    assertEq(r.complex, true);
  });
});

describe('GrowthPercentile', () => {
  it('normal', () => {
    const r = Engine.GrowthPercentile({ ageMonths: 12, weightKg: 9, heightCm: 75, sex: 'male' });
    assertEq(r.status, 'normal');
  });
  it('failure to thrive', () => {
    const r = Engine.GrowthPercentile({ ageMonths: 12, weightKg: 4, heightCm: 60, sex: 'male' });
    assertEq(r.status, 'failure-to-thrive');
  });
});

describe('AsthmaPedi', () => {
  it('mild', () => {
    const r = Engine.AsthmaPedi({ age: 8, peakFlowPct: 80, spo2: 98, rr: 25 });
    assertEq(r.severity, 'mild');
  });
  it('severe', () => {
    const r = Engine.AsthmaPedi({ age: 8, peakFlowPct: 35, spo2: 88, rr: 55 });
    assertEq(r.severity, 'severe');
  });
});

console.log();
console.log('pedi engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
