'use strict';
const Engine = require('./lab_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('LAB ENGINE TESTS\n========================================');

describe('CriticalValue', () => {
  it('K 7.0 critical', () => {
    const r = Engine.CriticalValue({ analyte: 'potassium', value: 7.0 });
    assertEq(r.critical, true);
    assertEq(r.direction, 'high');
  });
  it('glucose 80 normal', () => {
    const r = Engine.CriticalValue({ analyte: 'glucose', value: 80 });
    assertEq(r.critical, false);
  });
});

describe('HemolysisCheck', () => {
  it('likely 3 markers', () => {
    const r = Engine.HemolysisCheck({ potassium: 6, ldh: 300, haptoglobin: 20, hgb: 8, reticPct: 3 });
    assertEq(r.classification, 'hemolysis likely');
  });
  it('no hemolysis', () => {
    const r = Engine.HemolysisCheck({ potassium: 4, ldh: 200, haptoglobin: 80, hgb: 13, reticPct: 1 });
    assertEq(r.classification, 'no hemolysis');
  });
});

describe('CoagProfile', () => {
  it('factor deficiency mix corrects', () => {
    const r = Engine.CoagProfile({ pt: 16, ptt: 50, inr: 1.4, mixingStudy: 'corrects' });
    assertEq(r.interpretation, 'factor deficiency');
  });
  it('inhibitor no-correction', () => {
    const r = Engine.CoagProfile({ pt: 16, ptt: 50, inr: 1.4, mixingStudy: 'no-correction' });
    assertEq(r.interpretation, 'inhibitor present');
  });
});

describe('ABGAnalysis', () => {
  it('metabolic acidosis', () => {
    const r = Engine.ABGAnalysis({ ph: 7.20, pco2: 35, hco3: 15, pao2: 80, fio2: 0.21 });
    assertEq(r.primary, 'metabolic acidosis');
  });
  it('ARDS severe', () => {
    const r = Engine.ABGAnalysis({ ph: 7.30, pco2: 40, hco3: 22, pao2: 60, fio2: 1.0 });
    assertEq(r.oxygenation, 'severe hypoxemia (ARDS)');
  });
});

describe('TumorMarkerTrend', () => {
  it('rising significantly', () => {
    const r = Engine.TumorMarkerTrend({ marker: 'CEA', priorValue: 5, currentValue: 12, intervalDays: 90 });
    assertEq(r.trend, 'rising significantly');
  });
  it('stable', () => {
    const r = Engine.TumorMarkerTrend({ marker: 'CEA', priorValue: 10, currentValue: 10.5, intervalDays: 60 });
    assertEq(r.trend, 'stable');
  });
});

describe('MicrobeSusceptibility', () => {
  it('S first-line', () => {
    const r = Engine.MicrobeSusceptibility({ organism: 'E.coli', sensitivities: { cefazolin: 'S', cipro: 'R' }, antibiotic: 'cefazolin' });
    assertEq(r.susceptible, true);
  });
  it('R avoid', () => {
    const r = Engine.MicrobeSusceptibility({ organism: 'E.coli', sensitivities: { cipro: 'R' }, antibiotic: 'cipro' });
    assertEq(r.recommendation, 'avoid');
  });
});

describe('BMPAbnormalities', () => {
  it('multi-abnormal', () => {
    const r = Engine.BMPAbnormalities({ na: 130, k: 5.5, cl: 100, hco3: 18, bun: 25, cr: 1.5, glucose: 80, ca: 9 });
    assert(r.count >= 4);
  });
  it('all normal', () => {
    const r = Engine.BMPAbnormalities({ na: 140, k: 4, cl: 102, hco3: 24, bun: 12, cr: 0.9, glucose: 90, ca: 9.5 });
    assertEq(r.count, 0);
  });
});

describe('LiverProfile', () => {
  it('hepatocellular severe', () => {
    const r = Engine.LiverProfile({ ast: 800, alt: 1200, alp: 100, ggt: 60, tbili: 1, albumin: 2.5, pt: 16 });
    assertEq(r.pattern, 'hepatocellular');
    assertEq(r.severity, 'severe (synthetic dysfunction)');
  });
  it('normal', () => {
    const r = Engine.LiverProfile({ ast: 30, alt: 25, alp: 80, ggt: 30, tbili: 0.5, albumin: 4, pt: 12 });
    assertEq(r.pattern, 'normal');
  });
});

describe('LipidProfile', () => {
  it('high-intensity statin', () => {
    const r = Engine.LipidProfile({ ldl: 200, hdl: 30, tg: 100, totalChol: 280 });
    assertEq(r.plan, 'statin (high-intensity)');
  });
  it('lifestyle only', () => {
    const r = Engine.LipidProfile({ ldl: 80, hdl: 60, tg: 100, totalChol: 170 });
    assertEq(r.plan, 'continue lifestyle');
  });
});

describe('SampleRejection', () => {
  it('reject hemolyzed', () => {
    const r = Engine.SampleRejection({ hemolysisIndex: 200, lipemiaIndex: 0, icterusIndex: 0, clottingPresent: false, volumeMl: 5, requiredMl: 3 });
    assertEq(r.reject, true);
  });
  it('pass clean sample', () => {
    const r = Engine.SampleRejection({ hemolysisIndex: 10, lipemiaIndex: 10, icterusIndex: 5, clottingPresent: false, volumeMl: 5, requiredMl: 3 });
    assertEq(r.canReport, true);
  });
});

console.log();
console.log('lab engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
