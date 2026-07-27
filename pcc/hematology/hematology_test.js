'use strict';
const Engine = require('./hematology_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('HEMATOLOGY ENGINE TESTS\n========================================');

describe('CLLRaiStaging', () => {
  it('stage 0', () => {
    const r = Engine.CLLRaiStaging({ lymphocytosis: true });
    assertEq(r.raiStage, 0);
  });
  it('stage 4 thrombocytopenia', () => {
    const r = Engine.CLLRaiStaging({ lymphocytosis: true, thrombocytopenia: true });
    assertEq(r.raiStage, 4);
  });
});

describe('AMLELNRisk', () => {
  it('adverse FLT3', () => {
    const r = Engine.AMLELNRisk({ amlType: 'de-novo', cytogenetics: 'adverse', molecularMutations: ['FLT3-ITD'], age: 65 });
    assertEq(r.category, 'adverse-consider-transplant');
  });
  it('favorable NPM1', () => {
    const r = Engine.AMLELNRisk({ amlType: 'de-novo', cytogenetics: 'intermediate', molecularMutations: ['NPM1'], age: 50 });
    assertEq(r.category, 'favorable-eligible-standard-chemo');
  });
});

describe('DICScore', () => {
  it('overt DIC', () => {
    const r = Engine.DICScore({ plateletCount: 30, ptProlongation: 7, fibrinogen: 80, dDimer: 6, underlyingCause: 'sepsis' });
    assertEq(r.category, 'overt-DIC');
  });
});

describe('ITPDiagnosis', () => {
  it('severe ITP', () => {
    const r = Engine.ITPDiagnosis({ plateletCount: 15000, bleedingSymptoms: true, otherCausesExcluded: true });
    assertEq(r.diagnosis, 'ITP-definite');
  });
});

describe('TTPScore', () => {
  it('high probability TTP', () => {
    const r = Engine.TTPScore({ microangiopathicHemolyticAnemia: true, thrombocytopenia: true, neurologicalSymptoms: true, renalInvolvement: false, fever: true });
    assertEq(r.category, 'high-probability-TTP');
  });
});

describe('AnemiaWorkup', () => {
  it('iron deficiency', () => {
    const r = Engine.AnemiaWorkup({ hemoglobin: 9, mcv: 70, ferritin: 20 });
    assertEq(r.cause, 'iron-deficiency-anemia');
  });
});

describe('IronDeficiency', () => {
  it('absolute', () => {
    const r = Engine.IronDeficiency({ ferritin: 20, tsat: 15, hemoglobin: 9 });
    assertEq(r.category, 'absolute-iron-deficiency');
  });
});

describe('SickleCellCrisis', () => {
  it('acute chest', () => {
    const r = Engine.SickleCellCrisis({ hemoglobin: 7, retic: 15, pain: true, temperature: 38.5, oxygenSaturation: 88 });
    assertEq(r.crisis, 'acute-chest-syndrome');
  });
});

describe('Coagulopathy', () => {
  it('warfarin overanticoagulation', () => {
    const r = Engine.Coagulopathy({ inr: 5, onWarfarin: true, bleeding: true });
    assert(r.cause.includes('warfarin'));
  });
});

describe('TransfusionThreshold', () => {
  it('active bleeding transfuse', () => {
    const r = Engine.TransfusionThreshold({ hemoglobin: 10, activeBleeding: true });
    assertEq(r.trigger, 'transfuse-now-liberally');
  });
});

console.log();
console.log('hematology engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
