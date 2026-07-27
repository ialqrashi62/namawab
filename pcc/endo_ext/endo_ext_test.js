'use strict';
const Engine = require('./endo_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('ENDO EXT ENGINE TESTS\n========================================');

describe('ThyroidNoduleTI_RADS', () => {
  it('TR5 highly suspicious', () => {
    const r = Engine.ThyroidNoduleTI_RADS({ composition: 'solid', echogenicity: 'hypoechoic', shape: 'taller-than-wide', margin: 'irregular', echogenicFoci: 'microcalcifications', sizeCm: 0.8 });
    assertEq(r.category, 'TR5-highly-suspicious');
  });
});

describe('AdrenalIncidentaloma', () => {
  it('benign adenoma', () => {
    const r = Engine.AdrenalIncidentaloma({ sizeCm: 2, hounsfieldUnits: 5, hormonalActive: false });
    assertEq(r.interpretation, 'benign-adenoma');
  });
});

describe('PituitaryAdenoma', () => {
  it('macroadenoma mass effect', () => {
    const r = Engine.PituitaryAdenoma({ macroMicro: 'macroadenoma', hormone: 'non-functional', visualDefect: true });
    assertEq(r.management, 'urgent-transsphenoidal-surgery');
  });
  it('prolactinoma', () => {
    const r = Engine.PituitaryAdenoma({ macroMicro: 'microadenoma', hormone: 'unclassified', prolactinLevel: 250 });
    assert(r.management.includes('cabergoline'));
  });
});

describe('Pheochromocytoma', () => {
  it('confirmed', () => {
    const r = Engine.Pheochromocytoma({ plasmaMetanephrine: 4, paroxysmalEpisodes: true, adrenalMass: true });
    assertEq(r.diagnosis, 'pheochromocytoma-biochemically-confirmed');
  });
});

describe('CushingSyndromeWorkup', () => {
  it('Cushing disease pituitary', () => {
    const r = Engine.CushingSyndromeWorkup({ lateNightSalivaryCortisol: 0.2, dexSuppressionTest: 2.5, acthLevel: 50, mriPituitary: 'mass-6mm' });
    assertEq(r.source, 'Cushing-disease-pituitary');
  });
});

describe('PrimaryHyperaldosteronism', () => {
  it('ARR positive Conn', () => {
    const r = Engine.PrimaryHyperaldosteronism({ aldosterone: 30, renin: 0.5, arr: 60, unilateralAdenoma: true });
    assertEq(r.subtype, 'aldosteronoma-Conn');
  });
});

describe('PCOSRotterdam', () => {
  it('PCOS confirmed', () => {
    const r = Engine.PCOSRotterdam({ oligoAnovulation: true, hyperandrogenism: true, polycysticOvariesOnUS: true, otherCausesExcluded: true });
    assertEq(r.diagnosis, 'PCOS-Rotterdam-criteria-met');
  });
});

describe('CalciumDisorder', () => {
  it('primary hyperparathyroidism', () => {
    const r = Engine.CalciumDisorder({ calcium: 11.2, pth: 80, vitaminD: 30 });
    assertEq(r.diagnosis, 'primary-hyperparathyroidism');
  });
});

describe('DiabetesInsulinRegimen', () => {
  it('T1DM', () => {
    const r = Engine.DiabetesInsulinRegimen({ type1: true, age: 30, weightKg: 70, hba1c: 7.5, hypoglycemiaEpisodes: 1 });
    assert(r.regimen.includes('basal-bolus'));
  });
});

describe('ObesityMedicine', () => {
  it('class III', () => {
    const r = Engine.ObesityMedicine({ bmi: 45, comorbidities: ['dm'] });
    assert(r.treatment.includes('sleeve-gastrectomy'));
  });
});

console.log();
console.log('endo_ext engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
