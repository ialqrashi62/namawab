'use strict';
const Engine = require('./pulmonology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('PULMONOLOGY ENGINE TESTS\n========================================');

describe('CURB65', () => {
  it('score 0 outpatient', () => {
    const r = Engine.CURB65({});
    assertEq(r.plan, 'outpatient');
  });
  it('score 3 ICU', () => {
    const r = Engine.CURB65({ confusion: true, uremia: true, rr: 32, age: 70 });
    assertEq(r.plan, 'ICU admission');
  });
});

describe('PSIScore', () => {
  it('young low risk', () => {
    const r = Engine.PSIScore({ age: 30, sex: 'male' });
    assertEq(r.risk, 'low');
  });
  it('elderly with multiple risk factors', () => {
    const r = Engine.PSIScore({ age: 80, sex: 'male', neoplastic: true, chf: true, rr: 32, sbp: 80, ph: 7.30, bun: 35, na: 125 });
    assert(r.score > 130);
  });
});

describe('BODEIndex', () => {
  it('mild copd', () => {
    const r = Engine.BODEIndex({ fev1Pct: 85, distanceM: 400, mmrc: 0, exacerbations: 0 });
    assertEq(r.score, 0);
  });
  it('severe copd', () => {
    const r = Engine.BODEIndex({ fev1Pct: 30, distanceM: 100, mmrc: 3, exacerbations: 3 });
    assert(r.score > 7);
  });
});

describe('GOLDStage', () => {
  it('GOLD A1', () => {
    const r = Engine.GOLDStage({ fev1Pct: 85, symptoms: 'low', exacerbations: 0 });
    assertEq(r.goldGroup, 'A1');
  });
  it('GOLD D3', () => {
    const r = Engine.GOLDStage({ fev1Pct: 40, symptoms: 'high', exacerbations: 3 });
    assertEq(r.goldGroup, 'D3');
  });
});

describe('LightCriteria', () => {
  it('exudate', () => {
    const r = Engine.LightCriteria({ pleuralProtein: 5, pleuralLdh: 400, serumProtein: 6, serumLdhUpper: 200, serumLdh: 180, pleuralLdhUpper: 200 });
    assertEq(r.exudate, true);
  });
  it('transudate', () => {
    const r = Engine.LightCriteria({ pleuralProtein: 1, pleuralLdh: 50, serumProtein: 6, serumLdhUpper: 200, serumLdh: 180, pleuralLdhUpper: 200 });
    assertEq(r.exudate, false);
  });
});

describe('AsthmaSeverity', () => {
  it('mild', () => {
    const r = Engine.AsthmaSeverity({ pefPct: 80, rr: 18, hr: 90, sao2: 98 });
    assertEq(r.severity, 'mild');
  });
  it('life-threatening', () => {
    const r = Engine.AsthmaSeverity({ pefPct: 20, rr: 35, hr: 140, sao2: 88, mentalStatus: 'altered' });
    assertEq(r.severity, 'life-threatening');
  });
});

describe('PaO2FiO2Ratio', () => {
  it('severe ARDS', () => {
    const r = Engine.PaO2FiO2Ratio({ pao2: 60, fio2: 1.0, peep: 12 });
    assertEq(r.ards, 'severe');
  });
  it('mild ARDS', () => {
    const r = Engine.PaO2FiO2Ratio({ pao2: 240, fio2: 1.0, peep: 5 });
    assertEq(r.ards, 'mild');
  });
});

describe('PneumoniaSeverity', () => {
  it('low risk', () => {
    const r = Engine.PneumoniaSeverity({ age: 30 });
    assertEq(r.severity, 'low');
  });
  it('high risk', () => {
    const r = Engine.PneumoniaSeverity({ age: 80, comorbidities: 2, vitals: { rr: 32, sbp: 80 }, labs: { urea: 12, crp: 200 }, imaging: { multilobar: true } });
    assertEq(r.severity, 'high');
  });
});

describe('OSAStopBang', () => {
  it('low risk', () => {
    const r = Engine.OSAStopBang({});
    assertEq(r.risk, 'low');
  });
  it('high risk', () => {
    const r = Engine.OSAStopBang({ snoring: true, tired: true, observed: true, bp: true, bmi: 40, age: 60, neck: 45, sex: 'male' });
    assertEq(r.risk, 'high');
  });
});

describe('PEWellDVT', () => {
  it('low probability', () => {
    const r = Engine.PEWellDVT({});
    assertEq(r.probability, 'very-low');
  });
  it('high probability', () => {
    const r = Engine.PEWellDVT({ clinicalSigns: true, peLikely: true, hr: 110, immobility: true, previousDvt: true, hemoptysis: true, malignancy: true });
    assertEq(r.probability, 'high');
  });
});

console.log();
console.log('pulmonology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
