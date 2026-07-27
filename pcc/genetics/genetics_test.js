'use strict';
const Engine = require('./genetics_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('GENETICS ENGINE TESTS\n========================================');

describe('ACMGClassification', () => {
  it('pathogenic', () => {
    const r = Engine.ACMGClassification({ variant: 'BRCA1 c.5266dupC', inSilicoPredictions: { deleterious: true }, functionalStudies: 'abnormal', segregationEvidence: 'strong' });
    assertEq(r.classification, 'pathogenic');
  });
  it('VUS', () => {
    const r = Engine.ACMGClassification({ variant: 'c.123A>G' });
    assertEq(r.classification, 'VUS');
  });
});

describe('BRCATestingIndication', () => {
  it('Ashkenazi ancestry', () => {
    const r = Engine.BRCATestingIndication({ ancestry: 'Ashkenazi-Jewish' });
    assertEq(r.indication, true);
  });
  it('no indication', () => {
    const r = Engine.BRCATestingIndication({ age: 50 });
    assertEq(r.indication, false);
  });
});

describe('LynchScreening', () => {
  it('CRC < 50 positive', () => {
    const r = Engine.LynchScreening({ tumor: 'colorectal', age: 40 });
    assertEq(r.positive, true);
  });
  it('MSI-high positive', () => {
    const r = Engine.LynchScreening({ tumor: 'endometrial', age: 60, msiStatus: 'high' });
    assertEq(r.positive, true);
  });
});

describe('CPICPhenotype', () => {
  it('codeine PM avoid', () => {
    const r = Engine.CPICPhenotype({ diplotypes: '*4/*4', activityScore: 0, drug: 'codeine' });
    assertEq(r.phenotype, 'poor-metabolizer');
    assertEq(r.recommendation, 'avoid-tramadol-codeine');
  });
  it('normal metabolizer codeine', () => {
    const r = Engine.CPICPhenotype({ diplotypes: '*1/*1', activityScore: 2.5, drug: 'codeine' });
    assertEq(r.recommendation, 'standard');
  });
});

describe('VariantFrequency', () => {
  it('common variant', () => {
    const r = Engine.VariantFrequency({ alleleCount: 1000, totalAlleles: 10000, gnomadAf: 0.1 });
    assertEq(r.classification, 'common');
    assertEq(r.likelyBenign, true);
  });
  it('rare variant', () => {
    const r = Engine.VariantFrequency({ alleleCount: 1, totalAlleles: 10000, gnomadAf: 0.0001 });
    assertEq(r.classification, 'rare');
  });
});

describe('CarrierScreening', () => {
  it('partner carrier 25%', () => {
    const r = Engine.CarrierScreening({ disease: 'CF', partnerStatus: 'carrier' });
    assertEq(r.risk, 0.25);
  });
  it('no family history', () => {
    const r = Engine.CarrierScreening({ disease: 'CF', partnerStatus: 'negative' });
    assertEq(r.recommendation, 'no-action');
  });
});

describe('PharmacogenomicDose', () => {
  it('CYP2D6 poor codeine avoid', () => {
    const r = Engine.PharmacogenomicDose({ cyp2d6: 'poor', drug: 'codeine' });
    assert(r.recommendations.length > 0);
  });
  it('TPMT poor 6-MP reduce', () => {
    const r = Engine.PharmacogenomicDose({ tpmt: 'poor' });
    assert(r.recommendations.find(x => x.drug === '6-mercaptopurine'));
  });
});

describe('GeneticCounselingReferral', () => {
  it('Ashkenazi carrier', () => {
    const r = Engine.GeneticCounselingReferral({ ethnicity: 'Ashkenazi-Jewish' });
    assert(r.referrals.includes('carrier-screening'));
  });
  it('family history breast', () => {
    const r = Engine.GeneticCounselingReferral({ familyHistory: 'breast-cancer' });
    assert(r.referrals.includes('cancer-genetics'));
  });
});

describe('DownSyndromeScreening', () => {
  it('high risk NT+age', () => {
    const r = Engine.DownSyndromeScreening({ ntMultiplier: 4, age: 40, pappA: 0.3, freeBetaHCG: 2.5 });
    assertEq(r.screeningResult, 'high-risk-aneuploidy');
  });
  it('low risk', () => {
    const r = Engine.DownSyndromeScreening({ ntMultiplier: 1, age: 25, pappA: 1.0, freeBetaHCG: 1.0 });
    assertEq(r.screeningResult, 'low-risk');
  });
});

describe('CysticFibrosisScreening', () => {
  it('two mutations diagnosed', () => {
    const r = Engine.CysticFibrosisScreening({ cftrMutations: 2 });
    assertEq(r.diagnosis, 'CF-diagnosed');
  });
  it('sweat test intermediate', () => {
    const r = Engine.CysticFibrosisScreening({ cftrMutations: 1, sweatChloride: 45 });
    assertEq(r.diagnosis, 'CF-intermediate');
  });
});

console.log();
console.log('genetics engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
