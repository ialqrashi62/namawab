'use strict';

const Engine = require('./derm_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; }
}
function describe(suite, fn) { console.log(suite); fn(); }
function assertEq(a, b, msg) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${msg ? ' — ' + msg : ''}`); }
function assertTrue(c, m) { if (!c) throw new Error('assertTrue: ' + (m || 'failed')); }

describe('derm_ext engine tests', () => {
  it('psoriasis severe', () => {
    const r = Engine.PsoriasisPASISeverity({ psaScore: 5, bodySurfaceArea: 30 });
    assertEq(r.category, 'severe');
  });
  it('eczema severe', () => {
    const r = Engine.EczemaSCORADSeverity({ extent: 100, intensity: 18, symptoms: 18 });
    assertTrue(r.total > 50);
  });
  it('melanoma stage IV', () => {
    const r = Engine.MelanomaStaging({ breslowThickness: 2, ulceration: true, metastasis: true });
    assertEq(r.stage.startsWith('stage-IV'), true);
  });
  it('acne severe nodulocystic', () => {
    const r = Engine.AcneGlobalSeverity({ comedones: 20, papules: 15, pustules: 10, nodules: 8 });
    assertEq(r.category, 'severe-nodulocystic');
  });
  it('TEN severe', () => {
    const r = Engine.StevensJohnsonSpectrum({ bsaDetachment: 50, mucosalInvolvement: true, drugExposure: 'allopurinol' });
    assertEq(r.category, 'TEN-toxic-epidermal-necrolysis');
  });
  it('HS Hurley III', () => {
    const r = Engine.HidradenitisSuppurativaHurley({ abscesses: 5, sinusTracts: 3, scarring: true });
    assertEq(r.stage, 'Hurley-III-severe');
  });
  it('vitiligo extensive', () => {
    const r = Engine.VitiligoExtent({ bodySurfaceArea: 60, active: true });
    assertEq(r.category, 'extensive');
  });
  it('BCC very high risk', () => {
    const r = Engine.BasalCellCarcinomaRisk({ location: 'nose', size: 25, recurrent: true, histologicSubtype: 'morpheaform', perineuralInvasion: true });
    assertEq(r.risk, 'very-high-risk');
  });
  it('atopic severe', () => {
    const r = Engine.AtopicDermatitisEASI({ erythema: 3, induration: 3, excoriation: 3, lichenification: 3, bodyAreaFactor: 2.0 });
    assertEq(r.category, 'severe');
  });
  it('DFU critical', () => {
    const r = Engine.DiabeticFootUlcerRisk({ wagnerGrade: 4, infection: true, ischemia: true });
    assertEq(r.risk, 'critical-limb-threatening');
  });
});

console.log(`\nderm_ext engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
