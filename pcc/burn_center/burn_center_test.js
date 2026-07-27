// P3-AQ: Burn-Center unit tests
const Engine = require('./burn_center_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('burn_center engine tests:');
it('TBSA', () => {
  const r = Engine.BurnTBSA({ chest: 30, arms: 20 });
  assertEq(r.classification, 'major-burn');
});
it('Depth', () => {
  const r = Engine.BurnDepth({ appearance: 'white-or-leathery', blanching: false, blisters: false });
  assertEq(r.depth, 'third-degree-full-thickness');
});
it('Parkland', () => {
  const r = Engine.ParklandFormula({ weight: 80, tbsa: 30 });
  assertEq(r.total24hrMl, 9600);
});
it('Inhalation', () => {
  const r = Engine.InhalationInjury({ stridor: true, carboxyhemoglobin: 10 });
  assertEq(r.severity, 'severe-inhalation-injury-intubate-immediately');
});
it('BurnShock', () => {
  const r = Engine.BurnShock({ sbp: 80, hr: 130, weight: 70 });
  assertEq(r.shock, 'severe-burn-shock-massive-fluid');
});
it('Sepsis', () => {
  const r = Engine.BurnSepsis({ temperature: 39, hr: 120, rr: 25, mental: 'altered' });
  assertEq(r.pathway, 'burn-sepsis-confirmed-ABAtx');
});
it('Nutrition', () => {
  const r = Engine.BurnNutrition({ weight: 70, tbsa: 30 });
  assertEq(r.totalCalories > 0, true);
});
it('Electrical', () => {
  const r = Engine.ElectricalBurn({ voltage: 5000 });
  assertEq(r.severity, 'high-voltage-electrical-burn-extensive-tissue-damage');
});
it('Chemical', () => {
  const r = Engine.ChemicalBurn({ agent: 'hydrofluoric-acid', concentration: 'high' });
  assertEq(r.severity, 'HF-burn-calcium-gluconate-and-burn-center');
});
it('Rehab', () => {
  const r = Engine.BurnRehab({ daysPostBurn: 5, handInjury: true, contracture: true });
  assertEq(r.pathway, 'OT-PT-intensive-and-splinting');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
