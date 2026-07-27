'use strict';
const assert = require('assert');
const Engine = require('./picu_engine');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ✓ ' + name); } catch (err) { failed++; console.error('  ✗ ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
describe('PediatricApacheScore', () => {
  it('high score 30+', () => {
    const r = Engine.PediatricApacheScore({ age: 0, heartRate: 200, sbp: 25, respRate: 80, paO2: 150, ph: 7.0, sodium: 110, potassium: 8, creatinine: 2, hematocrit: 15, wbc: 50, glasgow: 4 });
    assert(r.score > 30);
    assertEq(r.mortality, 'high');
  });
  it('low score', () => {
    const r = Engine.PediatricApacheScore({ age: 36, heartRate: 100, sbp: 100, respRate: 25, paO2: 300, ph: 7.4, sodium: 140, potassium: 4, creatinine: 0.5, hematocrit: 35, wbc: 10, glasgow: 15 });
    assert(r.score < 10);
  });
});

describe('PediatricGCS', () => {
  it('severe 8', () => { assertEq(Engine.PediatricGCS({ eye: 1, verbal: 2, motor: 3 }).category, 'severe'); });
  it('moderate 12', () => { assertEq(Engine.PediatricGCS({ eye: 2, verbal: 3, motor: 4 }).category, 'moderate'); });
    it('mild 14', () => { assertEq(Engine.PediatricGCS({ eye: 4, verbal: 5, motor: 5 }).category, 'mild'); });
});

describe('PediatricSepsisRecognition', () => {
  it('sepsis 2+ triggers', () => {
    const r = Engine.PediatricSepsisRecognition({ age: 5, temperatureC: 39, heartRate: 180, respRate: 50, wbc: 18, suspectedInfection: true, organDysfunction: false });
    assertEq(r.sepsis, true);
  });
  it('no infection', () => { assertEq(Engine.PediatricSepsisRecognition({ age: 5, temperatureC: 39, heartRate: 180, respRate: 50, wbc: 18, suspectedInfection: false, organDysfunction: false }).sepsis, false); });
});

describe('PediatricAsthmaSeverity', () => {
  it('severe', () => { const r = Engine.PediatricAsthmaSeverity({ age: 5, spo2: 88, speechAbility: 'words_only', retractions: 'severe', wheezing: 'silent', mentalStatus: 'altered' }); assertEq(r.severity, 'severe'); });
  it('mild', () => { const r = Engine.PediatricAsthmaSeverity({ age: 5, spo2: 97, speechAbility: 'full_sentences', retractions: 'none', wheezing: 'mild', mentalStatus: 'alert' }); assertEq(r.severity, 'mild'); });
});

describe('CroupSeverity', () => {
  it('severe requires racemic epi', () => { const r = Engine.CroupSeverity({ stridorAtRest: true, barking: true, hoarseness: true, respiratoryDistress: 'severe', age: 2 }); assertEq(r.severity, 'severe'); assertEq(r.racemicEpi, true); });
  it('mild', () => { const r = Engine.CroupSeverity({ stridorAtRest: false, barking: true, hoarseness: true, respiratoryDistress: 'none', age: 3 }); assertEq(r.severity, 'mild'); });
});

describe('PediatricFluidBolus', () => {
  it('severe 10% loss 20ml/kg', () => {
    const r = Engine.PediatricFluidBolus({ weightKg: 10, percentLoss: 12, severity: 'severe' });
    assertEq(r.bolusMl, 200);
  });
  it('moderate 10ml/kg', () => {
    const r = Engine.PediatricFluidBolus({ weightKg: 10, percentLoss: 5, severity: 'mild' });
    assertEq(r.bolusMl, 100);
  });
});

describe('PediatricSepsisBundle', () => {
  it('10kg = 200ml bolus', () => { assertEq(Engine.PediatricSepsisBundle({ weightKg: 10 }).fluidBolusMl, 200); });
});

describe('PediatricPainScale', () => {
  it('FLACC severe', () => { const r = Engine.PediatricPainScale({ age: 2, flaccScore: 9 }); assertEq(r.pain, 'severe'); });
  it('FACES moderate', () => { const r = Engine.PediatricPainScale({ age: 5, facesScore: 6 }); assertEq(r.pain, 'moderate'); });
  it('numeric severe', () => { const r = Engine.PediatricPainScale({ age: 10, numericScore: 8 }); assertEq(r.pain, 'severe'); });
});

describe('ChildAbuseScreening', () => {
  it('2+ red flags = abuse suspected', () => { const r = Engine.ChildAbuseScreening({ inconsistentHistory: true, delayedPresentation: true, patternedBruising: false, sentinelInjuries: false, age: 2 }); assertEq(r.abuseSuspected, true); });
  it('1 red flag = mandatory report', () => { const r = Engine.ChildAbuseScreening({ inconsistentHistory: true, delayedPresentation: false, patternedBruising: false, sentinelInjuries: false, age: 2 }); assertEq(r.mandatoryReport, true); });
});

describe('PediatricEWS', () => {
  it('low risk', () => { const r = Engine.PediatricEWS({ heartRate: 100, respRate: 20, spo2: 97, systolic: 90, temperature: 37, avpu: 'A' }); assertEq(r.risk, 'low'); });
  it('high risk', () => { const r = Engine.PediatricEWS({ heartRate: 200, respRate: 70, spo2: 85, systolic: 35, temperature: 41, avpu: 'V' }); assertEq(r.risk, 'high'); });
});
console.log(
);
console.log('picu engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);