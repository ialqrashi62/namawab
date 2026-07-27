'use strict';
const assert = require('assert');
const Engine = require('./derma_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ' + '✓' + ' ' + name); } catch (err) { failed++; console.error('  ' + '✗' + ' ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }

describe('StevensJohnsonTENSeverity', () => {
  it('SJS < 10%', () => {
    const r = Engine.StevensJohnsonTENSeverity({ bodySurfaceAreaPct: 5, mucosalInvolvement: 'present', skinDetachment: 'partial' });
    assertEq(r.category, 'SJS');
  });
  it('SJS_TEN_overlap 10-30%', () => {
    const r = Engine.StevensJohnsonTENSeverity({ bodySurfaceAreaPct: 20, mucosalInvolvement: 'present', skinDetachment: 'partial' });
    assertEq(r.category, 'SJS_TEN_overlap');
  });
  it('TEN > 30%', () => {
    const r = Engine.StevensJohnsonTENSeverity({ bodySurfaceAreaPct: 50, mucosalInvolvement: 'present', skinDetachment: 'epidermal' });
    assertEq(r.category, 'TEN_severe');
  });
});

describe('DRESSyndrome', () => {
  it('definite', () => {
    const r = Engine.DRESSyndrome({ fever: 39, lymphadenopathy: true, eosinophilsPct: 2.0, atypicalLymphocytes: true, organInvolvement: 'multi', drugDays: 30 });
    assertEq(r.probability, 'definite');
  });
  it('possible low score', () => {
    const r = Engine.DRESSyndrome({ fever: 37, lymphadenopathy: false, eosinophilsPct: 0.5, atypicalLymphocytes: false, organInvolvement: 'none', drugDays: 7 });
    assertEq(r.probability, 'possible');
  });
});

describe('PsoriasisSeverity', () => {
  it('mild PASI 1', () => {
    const r = Engine.PsoriasisSeverity({ bsaInvolved: 2, erythema: 1, induration: 1, desquamation: 1 });
    assertEq(r.severity, 'mild');
  });
  it('severe PASI 18', () => {
    const r = Engine.PsoriasisSeverity({ bsaInvolved: 30, erythema: 2, induration: 2, desquamation: 2 });
    assertEq(r.severity, 'severe');
    assertEq(r.treatment, 'biologic_systemic');
  });
});

describe('UrticariaSeverity', () => {
  it('acute mild', () => {
    const r = Engine.UrticariaSeverity({ durationWeeks: 1, angioedemaPresent: false, dailySymptoms: false, scoreUAS7: 7 });
    assertEq(r.severity, 'acute');
    assertEq(r.impact, 'mild');
  });
  it('chronic spontaneous', () => {
    const r = Engine.UrticariaSeverity({ durationWeeks: 12, angioedemaPresent: true, dailySymptoms: true, scoreUAS7: 30 });
    assertEq(r.severity, 'chronic_spontaneous');
    assertEq(r.treatment, 'omalizumab');
  });
});

describe('CellulitisSeverity', () => {
  it('uncomplicated', () => {
    const r = Engine.CellulitisSeverity({ demarcation: 'present', systemicSigns: false, leukocytosis: false, diabetes: false, immunocompromised: false, recentSurgery: false });
    assertEq(r.severity, 'uncomplicated');
    assertEq(r.ivAntibiotics, false);
  });
  it('severe with diabetes', () => {
    const r = Engine.CellulitisSeverity({ demarcation: 'present', systemicSigns: true, leukocytosis: true, diabetes: true, immunocompromised: false, recentSurgery: false });
    assertEq(r.severity, 'severe');
  });
});

describe('PressureUlcerStaging', () => {
  it('stage 4 fascia', () => {
    const r = Engine.PressureUlcerStaging({ visibleDepth: 'full_thickness', exposedStructures: 'fascia_muscle_tendon', slough: false, eschar: false, blanching: 'non_blanching', color: 'red' });
    assertEq(r.stage, 4);
    assertEq(r.requiresSurgery, true);
  });
  it('unstageable eschar', () => {
    const r = Engine.PressureUlcerStaging({ visibleDepth: 'unknown', exposedStructures: 'none', slough: false, eschar: true, blanching: 'non_blanching', color: 'stable' });
    assertEq(r.stage, 'unstageable');
  });
});

describe('AcneSeverity', () => {
  it('mild', () => {
    const r = Engine.AcneSeverity({ inflammatoryLesions: 5, comedones: 10, nodules: 0, scarring: false });
    assertEq(r.severity, 'mild');
  });
  it('severe with scarring', () => {
    const r = Engine.AcneSeverity({ inflammatoryLesions: 30, comedones: 50, nodules: 8, scarring: true });
    assertEq(r.severity, 'severe');
    assertEq(r.isotretinoin, true);
  });
});

describe('BurnClassification', () => {
  it('minor 5%', () => {
    const r = Engine.BurnClassification({ burnType: 'thermal', tbsa: 5, depth: 'partial_thickness', circumferential: false, inhalationInjury: false });
    assertEq(r.severity, 'minor');
    assertEq(r.fluidResuscitation, false);
  });
  it('major with inhalation', () => {
    const r = Engine.BurnClassification({ burnType: 'thermal', tbsa: 35, depth: 'full_thickness', circumferential: true, inhalationInjury: true });
    assertEq(r.severity, 'major');
    assertEq(r.escharotomy, true);
  });
});

describe('AutoimmuneBlistering', () => {
  it('pemphigus vulgaris', () => {
    const r = Engine.AutoimmuneBlistering({ age: 40, mucosalInvolvement: true, nikolskySign: true, biopsyFindings: 'intraepidermal', antibodyPositive: true });
    assertEq(r.likelyDiagnosis, 'pemphigus_vulgaris');
  });
  it('bullous pemphigoid elderly', () => {
    const r = Engine.AutoimmuneBlistering({ age: 80, mucosalInvolvement: false, nikolskySign: false, biopsyFindings: 'subepidermal', antibodyPositive: true });
    assertEq(r.likelyDiagnosis, 'bullous_pemphigoid');
  });
});

describe('DrugReactionProbability', () => {
  it('definite Naranjo 9', () => {
    const r = Engine.DrugReactionProbability({ previousReports: true, appearedAfterDrug: true, improvedOnStop: true, recurredOnRechallenge: true, alternativeCauses: false, placebo: false, drugLevel: 'therapeutic' });
    assertEq(r.score, 6);
    assertEq(r.probability, 'probable');
  });
  it('doubtful', () => {
    const r = Engine.DrugReactionProbability({ previousReports: false, appearedAfterDrug: false, improvedOnStop: false, recurredOnRechallenge: false, alternativeCauses: true, placebo: false, drugLevel: 'therapeutic' });
    assertEq(r.probability, 'doubtful');
  });
});

console.log('derma engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
if (failed > 0) process.exit(1);
