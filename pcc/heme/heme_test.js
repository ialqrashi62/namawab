'use strict';
const Engine = require('./heme_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('HEME ENGINE TESTS\n========================================');

describe('CoagulopathyPanel', () => {
  it('normal panel', () => {
    const r = Engine.CoagulopathyPanel({ pt: 12, ptt: 30, plt: 200, fibrinogen: 350, dDimer: 200 });
    assertEq(r.interpretation, 'normal');
  });
  it('DIC-like', () => {
    const r = Engine.CoagulopathyPanel({ pt: 18, ptt: 45, plt: 50, fibrinogen: 100, dDimer: 800 });
    assertEq(r.interpretation, 'DIC-like');
  });
});

describe('AnemiaWorkup', () => {
  it('iron deficiency microcytic', () => {
    const r = Engine.AnemiaWorkup({ hgb: 9, mcv: 70, reticPct: 1, ferritin: 15, tibc: 400, transferrinSat: 12 });
    assertEq(r.classification, 'iron deficiency anemia');
  });
  it('anemia of chronic disease', () => {
    const r = Engine.AnemiaWorkup({ hgb: 10, mcv: 88, reticPct: 1.5, ferritin: 150, tibc: 200, transferrinSat: 25 });
    assertEq(r.classification, 'anemia of chronic disease');
  });
});

describe('SickleCellCrisis', () => {
  it('acute chest', () => {
    const r = Engine.SickleCellCrisis({ hgb: 8, reticPct: 4, haptoglobin: 10, totalBilirubin: 2, hasChestPain: true, hasFever: true });
    assertEq(r.classification, 'acute chest syndrome');
  });
  it('vaso-occlusive without hemolysis', () => {
    const r = Engine.SickleCellCrisis({ hgb: 9, reticPct: 4, haptoglobin: 50, totalBilirubin: 1, hasChestPain: false, hasFever: false });
    assertEq(r.classification, 'vaso-occlusive crisis');
  });
});

describe('HemophiliaSeverity', () => {
  it('severe hemophilia A', () => {
    const r = Engine.HemophiliaSeverity({ factorVIII: 0.5, ageMonths: 60 });
    assertEq(r.severity, 'severe');
  });
  it('mild hemophilia', () => {
    const r = Engine.HemophiliaSeverity({ factorVIII: 30, ageMonths: 120 });
    assertEq(r.severity, 'mild');
  });
});

describe('ITPScore', () => {
  it('severe ITP', () => {
    const r = Engine.ITPScore({ plt: 10, bleeding: true });
    assertEq(r.severity, 'severe');
  });
  it('drug-induced', () => {
    const r = Engine.ITPScore({ plt: 50, drugInduced: true });
    assertEq(r.likelyImmune, false);
  });
});

describe('DICAgain', () => {
  it('overt DIC with infection', () => {
    const r = Engine.DICAgain({ pt: 20, ptt: 45, plt: 30, fibrinogen: 80, dDimer: 1500, infection: true });
    assertEq(r.interpretation, 'overt DIC');
  });
  it('DIC unlikely', () => {
    const r = Engine.DICAgain({ pt: 12, ptt: 30, plt: 200, fibrinogen: 350, dDimer: 200 });
    assertEq(r.interpretation, 'DIC unlikely');
  });
});

describe('HIT4T', () => {
  it('high probability', () => {
    const r = Engine.HIT4T({ pltDropPct: 60, timingDays: 7, thrombosis: true, otherCauses: false });
    assertEq(r.probability, 'high');
  });
  it('low probability', () => {
    const r = Engine.HIT4T({ pltDropPct: 20, timingDays: 3, thrombosis: false, otherCauses: true });
    assertEq(r.probability, 'low');
  });
});

describe('ThalassemiaClassification', () => {
  it('beta-thalassemia trait', () => {
    const r = Engine.ThalassemiaClassification({ mcv: 70, mch: 22, hgbA2: 5.0, hgbF: 1, ferritin: 100 });
    assertEq(r.diagnosis, 'beta-thalassemia trait');
  });
});

describe('TransfusionThreshold', () => {
  it('active bleeding forces', () => {
    const r = Engine.TransfusionThreshold({ hgb: 9, age: 50, activeBleeding: true });
    assertEq(r.transfuse, true);
  });
  it('restrictive 7.0', () => {
    const r = Engine.TransfusionThreshold({ hgb: 7.5, age: 50 });
    assertEq(r.transfuse, false);
  });
});

describe('BleedingScore', () => {
  it('grade 4 CNS', () => {
    const r = Engine.BleedingScore({ plt: 20, hasCNS: true, fibrinogen: 100, weightKg: 70 });
    assertEq(r.grade, 4);
  });
  it('monitor grade 0', () => {
    const r = Engine.BleedingScore({ plt: 200, hasMucosal: false, hasCNS: false, fibrinogen: 300, weightKg: 70 });
    assertEq(r.action, 'monitor');
  });
});

console.log();
console.log('heme engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
