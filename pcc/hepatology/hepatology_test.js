'use strict';
const Engine = require('./hepatology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('HEPATOLOGY ENGINE TESTS\n========================================');

describe('MELDNa', () => {
  it('high MELD', () => {
    const r = Engine.MELDNa({ bilirubin: 8, inr: 3, creatinine: 3, sodium: 128 });
    assert(r.meldNa >= 30);
  });
  it('low MELD', () => {
    const r = Engine.MELDNa({ bilirubin: 1, inr: 1, creatinine: 1, sodium: 140 });
    assert(r.meldNa < 15);
  });
});

describe('ChildPugh', () => {
  it('class C', () => {
    const r = Engine.ChildPugh({ bilirubin: 5, albumin: 2, inr: 3, ascites: 'severe', hepaticEncephalopathy: 'grade-3-4' });
    assertEq(r.class, 'C-decompensated');
  });
  it('class A', () => {
    const r = Engine.ChildPugh({ bilirubin: 1, albumin: 4, inr: 1, ascites: 'none', hepaticEncephalopathy: 'none' });
    assertEq(r.class, 'A-compensated');
  });
});

describe('MaddreyDF', () => {
  it('severe AH', () => {
    const r = Engine.MaddreyDF({ bilirubin: 15, inr: 4, age: 50, encephalopathy: false, infection: false });
    assertEq(r.category, 'severe-alcoholic-hepatitis');
  });
});

describe('LilleScore', () => {
  it('responder', () => {
    const r = Engine.LilleScore({ bilirubinDay0: 10, bilirubinDay7: 3, age: 50, albumin: 3.5, creatinine: 1, encephalopathy: false });
    assertEq(r.response, 'responder-continue-steroids');
  });
});

describe('BavenoVI', () => {
  it('spare', () => {
    const r = Engine.BavenoVI({ plateletCount: 200, liverStiffnessKpa: 12 });
    assertEq(r.category, 'no-endoscopy-needed-spare');
  });
});

describe('AscitesAssessment', () => {
  it('SBP', () => {
    const r = Engine.AscitesAssessment({ saag: 1.5, pmnCount: 350 });
    assertEq(r.classification, 'spontaneous-bacterial-peritonitis');
  });
});

describe('HepaticEncephalopathy', () => {
  it('grade 3-4 ICU', () => {
    const r = Engine.HepaticEncephalopathy({ westHavenGrade: 4, asterixis: true });
    assertEq(r.severity, 'overt-grade-3-4');
  });
});

describe('LiverLesion', () => {
  it('definite HCC', () => {
    const r = Engine.LiverLesion({ lesionSizeCm: 3, characteristic: 'arterial-enhancement-washout', cirrhosis: true });
    assertEq(r.risk, 'definite-HCC');
  });
});

describe('HEPBManagement', () => {
  it('treatment indicated', () => {
    const r = Engine.HEPBManagement({ hbsag: 'positive', hbeag: 'positive', alt: 80, hbvdna: 100000, fibrosisStage: 'F1', treatmentNaive: true });
    assertEq(r.indication, true);
  });
});

describe('HEPCManagement', () => {
  it('active treatment', () => {
    const r = Engine.HEPCManagement({ antiHCV: 'positive', hcvRna: 1000000, genotype: '1a', fibrosisStage: 'F2', priorTreatment: false });
    assertEq(r.active, true);
  });
});

console.log();
console.log('hepatology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
