/**
 * pcc/bicu/bicu_test.js
 * 50 unit tests for bicu_engine.js
 */
'use strict';

const assert = require('assert');
const Engine = require('./bicu_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log(`  \u2713 ${name}`); } catch (err) { failed++; console.error(`  \u2717 ${name}: ${err.message}`); } }
function describe(s, fn) { console.log(`\n${s}`); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`${m || 'eq'}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); }

// 1. Parkland
describe('ParklandFormula', () => {
  it('70kg 30% burn = 8400mL total', () => {
    const r = Engine.ParklandFormula({ weightKg: 70, tbsaPct: 30, hoursSinceBurn: 8 });
    assertEq(r.total24hMl, 8400); assertEq(r.first8hMl, 4200); assertEq(r.next16hMl, 4200);
  });
  it('20kg 40% pediatric', () => {
    const r = Engine.ParklandFormula({ weightKg: 20, tbsaPct: 40, hoursSinceBurn: 4 });
    assertEq(r.total24hMl, 3200);
  });
  it('crystalloid = lactated ringers', () => { assertEq(Engine.ParklandFormula({ weightKg: 70, tbsaPct: 20, hoursSinceBurn: 8 }).crystalloid, 'lactated_ringers'); });
  it('throws invalid weight', () => { assert.throws(() => Engine.ParklandFormula({ weightKg: 0, tbsaPct: 20, hoursSinceBurn: 8 })); });
  it('throws invalid TBSA', () => { assert.throws(() => Engine.ParklandFormula({ weightKg: 70, tbsaPct: 110, hoursSinceBurn: 8 })); });
});

// 2. TBSA
describe('TBSACalculation', () => {
  it('9 regions add to 100%', () => {
    const r = Engine.TBSACalculation({ head: 9, chest: 9, abdomen: 9, back: 18, armL: 9, armR: 9, legL: 18, legR: 18, perineum: 1 });
    assertEq(r.tbsaPct, 100);
  });
  it('30% major', () => { const r = Engine.TBSACalculation({ chest: 30 }); assertEq(r.severity, 'major'); });
  it('20% moderate', () => { const r = Engine.TBSACalculation({ chest: 20 }); assertEq(r.severity, 'moderate'); });
  it('10% moderate', () => { const r = Engine.TBSACalculation({ chest: 10 }); assertEq(r.severity, 'moderate'); });
  it('5% minor', () => { const r = Engine.TBSACalculation({ chest: 5 }); assertEq(r.severity, 'minor'); });
  it('requires transfer at 30%', () => { const r = Engine.TBSACalculation({ chest: 30 }); assertEq(r.requiresTransfer, true); });
  it('throws > 100', () => { assert.throws(() => Engine.TBSACalculation({ head: 50, chest: 60 })); });
});

// 3. Inhalation
describe('InhalationInjurySeverity', () => {
  it('none when no signs', () => { const r = Engine.InhalationInjurySeverity({}); assertEq(r.severity, 'none'); assertEq(r.intubate, false); });
  it('mild soot', () => { const r = Engine.InhalationInjurySeverity({ sootInAirway: true }); assertEq(r.severity, 'mild'); });
  it('moderate stridor', () => { const r = Engine.InhalationInjurySeverity({ stridor: true }); assertEq(r.severity, 'moderate'); assertEq(r.intubate, true); });
  it('severe bronchoscopy 3', () => { const r = Engine.InhalationInjurySeverity({ bronchoscopyGrade: 3 }); assertEq(r.severity, 'severe'); assertEq(r.intubate, true); });
  it('CO > 25 intubate', () => { const r = Engine.InhalationInjurySeverity({ coLevel: 30 }); assertEq(r.intubate, true); });
});

// 4. Escharotomy
describe('EscharotomyIndication', () => {
  it('not circumferential', () => { assertEq(Engine.EscharotomyIndication({ circumferential: false }).indicated, false); });
  it('chest with compartment syndrome', () => { const r = Engine.EscharotomyIndication({ circumferential: true, location: 'chest', compartmentSyndrome: true }); assertEq(r.indicated, true); assertEq(r.urgency, 'emergent'); });
  it('extremity no pulse', () => { const r = Engine.EscharotomyIndication({ circumferential: true, location: 'extremity', distalPulses: false }); assertEq(r.indicated, true); });
  it('extremity pulses OK', () => { const r = Engine.EscharotomyIndication({ circumferential: true, location: 'extremity', distalPulses: true, delayedCapillaryRefill: false }); assertEq(r.indicated, false); });
  it('chest technique', () => { const r = Engine.EscharotomyIndication({ circumferential: true, location: 'chest', compartmentSyndrome: true }); assertEq(r.technique, 'mid_axillary_lines_anteriorly'); });
});

// 5. Burn sepsis
describe('BurnSepsisDiagnosis', () => {
  it('no infection = no sepsis', () => { assertEq(Engine.BurnSepsisDiagnosis({ temperatureC: 39, hr: 130, hasDocumentedInfection: false }).sepsis, false); });
  it('infection + 3 triggers = sepsis', () => {
    const r = Engine.BurnSepsisDiagnosis({ temperatureC: 39.5, hr: 130, rr: 28, wbc: 14, hasDocumentedInfection: true });
    assertEq(r.sepsis, true);
  });
  it('infection + 0 triggers = no sepsis', () => {
    const r = Engine.BurnSepsisDiagnosis({ temperatureC: 37, hr: 80, rr: 16, wbc: 8, hasDocumentedInfection: true });
    assertEq(r.sepsis, false);
  });
});

// 6. Fluid adjustment
describe('FluidResuscitationAdjustment', () => {
  it('UOP low = increase', () => { const r = Engine.FluidResuscitationAdjustment({ currentRateMlPerHour: 500, currentUopMlPerHour: 20, weightKg: 70, isPediatric: false }); assertEq(r.action, 'increase_rate_20pct'); assertEq(r.newRate, 600); });
  it('UOP high = decrease', () => { const r = Engine.FluidResuscitationAdjustment({ currentRateMlPerHour: 500, currentUopMlPerHour: 70, weightKg: 70, isPediatric: false }); assertEq(r.action, 'decrease_rate_20pct'); assertEq(r.newRate, 400); });
  it('UOP target = maintain', () => { const r = Engine.FluidResuscitationAdjustment({ currentRateMlPerHour: 500, currentUopMlPerHour: 40, weightKg: 70, isPediatric: false }); assertEq(r.action, 'maintain_rate'); });
  it('pediatric UOP target', () => { const r = Engine.FluidResuscitationAdjustment({ currentRateMlPerHour: 100, currentUopMlPerHour: 0.6, weightKg: 1, isPediatric: true }); assertEq(r.action, 'maintain_rate'); });
});

// 7. Nutrition
describe('NutritionalNeeds', () => {
  it('adult Curreri', () => { const r = Engine.NutritionalNeeds({ weightKg: 70, tbsaPct: 30, ageYears: 30 }); assertEq(r.formula, 'curreri_junior'); });
  it('adult 70kg 30% = 2950 kcal', () => { const r = Engine.NutritionalNeeds({ weightKg: 70, tbsaPct: 30, ageYears: 30 }); assertEq(r.kcalPerDay, 2950); });
  it('pediatric Galveston', () => { const r = Engine.NutritionalNeeds({ weightKg: 20, tbsaPct: 30, ageYears: 5 }); assertEq(r.formula, 'galveston_simplified'); });
});

// 8. Scar
describe('ScarAssessment', () => {
  it('0-5 normal', () => { const r = Engine.ScarAssessment({ pigmentation: 1, vascularity: 1, pliability: 1, height: 0 }); assertEq(r.category, 'normal'); });
  it('6-8 mild', () => { const r = Engine.ScarAssessment({ pigmentation: 2, vascularity: 2, pliability: 2, height: 1 }); assertEq(r.category, 'mild'); });
  it('9-11 moderate', () => { const r = Engine.ScarAssessment({ pigmentation: 3, vascularity: 2, pliability: 2, height: 2 }); assertEq(r.category, 'moderate'); });
  it('12-15 severe', () => { const r = Engine.ScarAssessment({ pigmentation: 3, vascularity: 3, pliability: 3, height: 3 }); assertEq(r.category, 'severe'); });
  it('mild gets treatment', () => { const r = Engine.ScarAssessment({ pigmentation: 2, vascularity: 2, pliability: 2, height: 1 }); assertEq(r.treatments[0], 'silicone_gel'); });
});

// 9. Burn mortality
describe('BurnMortalityScore', () => {
  it('40y 20% = 60 moderate', () => { const r = Engine.BurnMortalityScore({ ageYears: 40, tbsaPct: 20 }); assertEq(r.score, 60); assertEq(r.mortalityRisk, 'moderate'); });
  it('adds 17 for inhalation', () => { const r = Engine.BurnMortalityScore({ ageYears: 40, tbsaPct: 20, inhalationInjury: true }); assertEq(r.score, 77); });
  it('150 = very high', () => { const r = Engine.BurnMortalityScore({ ageYears: 80, tbsaPct: 70, inhalationInjury: true }); assertEq(r.mortalityRisk, 'very_high'); });
});

// 10. Baux classic
describe('BauxScore', () => {
  it('50y 20% = 70 moderate', () => { const r = Engine.BauxScore({ ageYears: 50, tbsaPct: 20 }); assertEq(r.score, 70); assertEq(r.mortalityRisk, 'moderate'); });
  it('80y 50% = 130 very high', () => { const r = Engine.BauxScore({ ageYears: 80, tbsaPct: 50 }); assertEq(r.mortalityRisk, 'very_high'); });
  it('30y 10% = 40 low', () => { const r = Engine.BauxScore({ ageYears: 30, tbsaPct: 10 }); assertEq(r.score, 40); assertEq(r.mortalityRisk, 'low'); });
});

console.log(`\n${'='.repeat(40)}`);
console.log(`BICU engine tests: ${passed} passed, ${failed} failed`);
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);
