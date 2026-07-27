'use strict';

const Engine = require('./tropical_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('tropical engine tests', () => {
  it('malaria severe', () => {
    const r = Engine.MalariaSeverityWHO({ parasiteDensity: 250000, species: 'P-falciparum' });
    assertEq(r.severity, 'severe-malaria');
  });
  it('dengue severe', () => {
    const r = Engine.DengueSeverityWHO({ plasmaLeakage: true, bleeding: true, hematocritRising: true });
    assertEq(r.category, 'severe-dengue-with-warning-signs');
  });
  it('chikungunya chronic', () => {
    const r = Engine.ChikungunyaSeverity({ jointPainDurationDays: 120, chronicArthritis: true });
    assertEq(r.category, 'chronic-chikungunya-arthritis');
  });
  it('VL kala-azar', () => {
    const r = Engine.LeishmaniasisType({ splenomegaly: true, fever: true, weightLoss: true, pancytopenia: true, leishmanDonovaniTest: 'positive' });
    assertEq(r.classification, 'visceral-leishmaniasis-kala-azar');
  });
  it('schisto Symmers', () => {
    const r = Engine.SchistosomiasisComplication({ species: 'S-mansoni', periportalFibrosis: 'severe' });
    assertEq(r.complication, 'Symmers-pipe-stem-fibrosis');
  });
  it('typhoid severe', () => {
    const r = Engine.TyphoidSeverity({ perforation: true });
    assertEq(r.severity, 'severe-typhoid-with-complication');
  });
  it('rabies RIG', () => {
    const r = Engine.RabiesPEP({ exposure: 'category-III', animal: 'dog' });
    assertEq(r.pepRecommendation, 'RIG-full-vaccine-series-5-doses');
  });
  it('dysentery', () => {
    const r = Engine.TravelerDiarrhea({ bloodInStool: true, fever: true });
    assertEq(r.category, 'dysentery-invasive');
  });
  it('CL systemic', () => {
    const r = Engine.CutaneousLeishmaniasis({ lesionSizeMM: 30, immunocompromised: true });
    assertEq(r.treatment, 'systemic-treatment');
  });
  it('EVD very high', () => {
    const r = Engine.HemorrhagicFeverScreening({ fever: true, bleeding: true, exposure: 'body-fluid' });
    assertEq(r.risk, 'very-high-EVD-confirm-PCR');
  });
});

console.log(`\ntropical engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
