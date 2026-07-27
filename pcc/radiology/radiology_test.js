'use strict';
const Engine = require('./radiology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('RADIOLOGY ENGINE TESTS\n========================================');

describe('BIRADS', () => {
  it('BI-RADS 1 negative', () => {
    const r = Engine.BIRADS({});
    assertEq(r.birads, 1);
  });
  it('BI-RADS 4 spiculated mass', () => {
    const r = Engine.BIRADS({ mass: 'spiculated' });
    assertEq(r.birads, 4);
  });
  it('BI-RADS 5 skin changes', () => {
    const r = Engine.BIRADS({ skinChanges: 'peau-orange' });
    assertEq(r.birads, 5);
  });
});

describe('LungRADS', () => {
  it('Lung-RADS 1 small benign', () => {
    const r = Engine.LungRADS({ sizeMm: 3 });
    assertEq(r.lungRADS, 1);
  });
  it('Lung-RADS 4A large solid upper', () => {
    const r = Engine.LungRADS({ sizeMm: 18, solid: true, upperLobe: true, spiculation: true });
    assertEq(r.lungRADS, 4);
  });
  it('Lung-RADS 5 massive nodule', () => {
    const r = Engine.LungRADS({ sizeMm: 35 });
    assertEq(r.lungRADS, 5);
  });
});

describe('TIRADS', () => {
  it('TR3 mixed composition', () => {
    const r = Engine.TIRADS({ composition: 'mixed' });
    assertEq(r.acrTI, 'TR3');
  });
  it('TR5 all features', () => {
    const r = Engine.TIRADS({ composition: 'solid', echogenicity: 'marked-hypoechoic', shape: 'taller-than-wide', margin: 'irregular', echogenicFoci: 'microcalcifications' });
    assertEq(r.acrTI, 'TR5');
  });
});

describe('FleischnerPulmonaryNodule', () => {
  it('small nodule no follow-up', () => {
    const r = Engine.FleischnerPulmonaryNodule({ sizeMm: 4 });
    assertEq(r.risk, 'low');
  });
  it('large solid high risk', () => {
    const r = Engine.FleischnerPulmonaryNodule({ sizeMm: 35, solid: true });
    assertEq(r.risk, 'high');
  });
});

describe('PIRADS', () => {
  it('PI-RADS 2 no biopsy', () => {
    const r = Engine.PIRADS({ peripheralZoneScore: 1 });
    assertEq(r.pirads, 2);
  });
  it('PI-RADS 4 biopsy', () => {
    const r = Engine.PIRADS({ peripheralZoneScore: 4 });
    assertEq(r.pirads, 4);
  });
});

describe('CADRADS', () => {
  it('CAD-RADS 0 no disease', () => {
    const r = Engine.CADRADS({});
    assertEq(r.cadRADS, 0);
  });
  it('CAD-RADS 4 severe stenosis', () => {
    const r = Engine.CADRADS({ stenosis: 80 });
    assertEq(r.cadRADS, 4);
  });
});

describe('LIRADSCategories', () => {
  it('LI-RADS 1 no routine', () => {
    const r = Engine.LIRADSCategories({ massSizeMm: 5 });
    assertEq(r.lirads, 2);
  });
  it('LI-RADS 5 tumor in vein', () => {
    const r = Engine.LIRADSCategories({ tumorInVein: true });
    assertEq(r.lirads, 5);
  });
});

describe('MammographyRecall', () => {
  it('acceptable recall', () => {
    const r = Engine.MammographyRecall({ birads0: 80, birads3: 800, birads4: 100, birads5: 20 });
    assert(r.recallRate < 0.1);
  });
});

describe('TraumaFAST', () => {
  it('positive FAST', () => {
    const r = Engine.TraumaFAST({ freeFluidRUQ: true });
    assertEq(r.positive, true);
    assertEq(r.injury, 'intra-abdominal hemorrhage');
  });
  it('pericardial tamponade', () => {
    const r = Engine.TraumaFAST({ freeFluidPericardial: true });
    assertEq(r.pericardialEffusion, true);
  });
});

describe('ContrastNephropathyRisk', () => {
  it('low risk', () => {
    const r = Engine.ContrastNephropathyRisk({ egfr: 80 });
    assertEq(r.category, 'low');
  });
  it('very high risk', () => {
    const r = Engine.ContrastNephropathyRisk({ egfr: 20, age: 80, diabetes: true, heartFailure: true, contrastVolume: 150, dehydration: true });
    assertEq(r.category, 'very-high');
  });
});

console.log();
console.log('radiology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
