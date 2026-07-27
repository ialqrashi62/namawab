'use strict';
const assert = require('assert');
const Engine = require('./gi_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('ChildPughScore', () => {
  it('class A', () => {
    const r = Engine.ChildPughScore({ bilirubin: 1.5, albumin: 4, inr: 1.3, ascites: 'none', encephalopathy: 'none' });
    assertEq(r.class, 'A');
  });
  it('class C', () => {
    const r = Engine.ChildPughScore({ bilirubin: 4, albumin: 2.5, inr: 2.5, ascites: 'severe', encephalopathy: 'grade_3_4' });
    assertEq(r.class, 'C');
  });
});

describe('MELDNaScore', () => {
  it('high MELD 25', () => {
    const r = Engine.MELDNaScore({ bilirubin: 3, inr: 2, creatinine: 1.5, sodium: 130, onDialysis: false });
    assert(r.meld > 15);
    assertEq(r.transplantPriority, true);
  });
});

describe('BavenoVIIHepaticVenousPressure', () => {
  it('rule out CSPH', () => {
    const r = Engine.BavenoVIIHepaticVenousPressure({ liverStiffness: 15, platelets: 200, age: 50 });
    assertEq(r.ruleOutCSPH, true);
  });
  it('rule in CSPH', () => {
    const r = Engine.BavenoVIIHepaticVenousPressure({ liverStiffness: 30, platelets: 80, age: 65 });
    assertEq(r.ruleInCSPH, true);
  });
});

describe('UGIBEndoscopyTiming', () => {
  it('unstable emergent', () => {
    const r = Engine.UGIBEndoscopyTiming({ hemodynamicStable: false, hematemesis: false, melena: true, syncope: false, shock: false, anticoagulant: false, anticoagReversed: false });
    assertEq(r.timing, 'emergent_within_12h');
  });
  it('stable melena urgent', () => {
    const r = Engine.UGIBEndoscopyTiming({ hemodynamicStable: true, hematemesis: false, melena: true, syncope: false, shock: false, anticoagulant: false, anticoagReversed: false });
    assertEq(r.timing, 'urgent_within_24h');
  });
});

describe('RomeIVIBSClassification', () => {
  it('IBS-D', () => {
    const r = Engine.RomeIVIBSClassification({ abdominalPain: true, defecationRelation: true, stoolFrequencyChange: 'loose', stoolFormChange: 'loose', durationMonths: 8, redFlags: false });
    assertEq(r.diagnosis, 'IBS_D');
  });
  it('red flag not IBS', () => {
    const r = Engine.RomeIVIBSClassification({ abdominalPain: true, defecationRelation: true, durationMonths: 12, redFlags: true });
    assertEq(r.diagnosis, 'not_IBS_workup_organic');
  });
});

describe('HEPATITISBStage', () => {
  it('immune active', () => {
    const r = Engine.HEPATITISBStage({ hbeAg: true, alt: 100, hbvDna: 50000, liverBiopsy: 'minimal_inflammation', fibrosisScore: 0 });
    assertEq(r.phase, 'immune_active_HBeAg_positive');
  });
  it('inactive carrier', () => {
    const r = Engine.HEPATITISBStage({ hbeAg: false, alt: 30, hbvDna: 1000, liverBiopsy: 'minimal', fibrosisScore: 0 });
    assertEq(r.phase, 'inactive_carrier');
  });
});

describe('NAFLDFibrosisScore', () => {
  it('advanced', () => {
    const r = Engine.NAFLDFibrosisScore({ age: 60, bmi: 35, ifg: 1, ast: 80, alt: 60, platelets: 100, albumin: 3 });
    assertEq(r.fibrosis, 'F3_F4_advanced');
  });
  it('indolent', () => {
    const r = Engine.NAFLDFibrosisScore({ age: 35, bmi: 25, ifg: 0, ast: 25, alt: 30, platelets: 250, albumin: 4.2 });
    assertEq(r.fibrosis, 'F0_F1_indolent');
  });
});

describe('IBDActivityUC', () => {
  it('severe', () => {
    const r = Engine.IBDActivityUC({ stoolFrequency: '4plus', rectalBleeding: 'gross', endoscopy: 3, physicianGlobal: 2 });
    assertEq(r.activity, 'severe');
  });
  it('remission', () => {
    const r = Engine.IBDActivityUC({ stoolFrequency: 'normal', rectalBleeding: 'none', endoscopy: 0, physicianGlobal: 0 });
    assertEq(r.activity, 'remission');
  });
});

describe('PancreatitisSeverityBalthazar', () => {
  it('severe necrosis 50%', () => {
    const r = Engine.PancreatitisSeverityBalthazar({ ctGrade: 'E_severe', necrosisPct: 60 });
    assertEq(r.severity, 'severe');
  });
  it('mild no necrosis', () => {
    const r = Engine.PancreatitisSeverityBalthazar({ ctGrade: 'A_normal', necrosisPct: 0 });
    assertEq(r.severity, 'mild');
  });
});

describe('CeliacDiseaseSerology', () => {
  it('confirmed', () => {
    const r = Engine.CeliacDiseaseSerology({ tTGIgA: 50, totalIgA: 2, geneticTest: 'HLA_DQ2_DQ8_positive', biopsyFindings: 'Marsh_3' });
    assertEq(r.result, 'celiac_confirmed');
  });
  it('IgA deficient', () => {
    const r = Engine.CeliacDiseaseSerology({ tTGIgA: 0, totalIgA: 0.05, geneticTest: 'unknown', biopsyFindings: 'pending' });
    assertEq(r.result, 'IgA_deficient_test_IgG');
  });
});

console.log('gi engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
