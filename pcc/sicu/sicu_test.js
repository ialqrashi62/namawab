'use strict';
const assert = require('assert');
const Engine = require('./sicu_engine');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ✓ ' + name); } catch (err) { failed++; console.error('  ✗ ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
describe('ApacheScore', () => {
  it('mortality high', () => { const r = Engine.ApacheScore({ age: 80, chronicHealth: 'severe', glasgow: 5, temperature: 41, map: 40, heartRate: 200, respRate: 60, paO2: 50, ph: 7.1, sodium: 110, potassium: 8, creatinine: 4, hematocrit: 15, wbc: 50 }); assertEq(r.mortality, 'high'); });
  it('mortality low', () => { const r = Engine.ApacheScore({ age: 40, chronicHealth: 'none', glasgow: 15, temperature: 37, map: 90, heartRate: 90, respRate: 18, paO2: 100, ph: 7.4, sodium: 140, potassium: 4, creatinine: 1, hematocrit: 35, wbc: 10 }); assertEq(r.mortality, 'low'); });
});

describe('SofaScore', () => {
  it('sepsis organ dysfunction', () => { const r = Engine.SofaScore({ paO2FiO2: 100, platelets: 20, bilirubin: 5, map: 60, glasgow: 5, creatinine: 4, urineOutput: 100 }); assert(r.sepsisOrganDysfunction); });
});

describe('AnastomoticLeakScreening', () => {
  it('high risk with free air', () => { const r = Engine.AnastomoticLeakScreening({ postOpDay: 7, fever: true, tachycardia: true, abdominalPain: 'severe', drainOutput: 'bilious', wbc: 18, freeAir: true }); assertEq(r.risk, 'high'); });
  it('low risk', () => { const r = Engine.AnastomoticLeakScreening({ postOpDay: 2, fever: false, tachycardia: false, abdominalPain: 'mild', drainOutput: 'serous', wbc: 12, freeAir: false }); assertEq(r.risk, 'low'); });
});

describe('PostOpHemorrhage', () => {
  it('major', () => { const r = Engine.PostOpHemorrhage({ drainOutputMlPerHour: 300, heartRate: 130, sbp: 85, hemoglobinTrend: 'rapid_drop', coagsNormal: true }); assertEq(r.severity, 'major'); assertEq(r.action, 'return_to_or'); });
  it('none', () => { const r = Engine.PostOpHemorrhage({ drainOutputMlPerHour: 50, heartRate: 80, sbp: 120, hemoglobinTrend: 'stable', coagsNormal: true }); assertEq(r.severity, 'none'); });
});

describe('AbdominalCompartmentPressure', () => {
  it('severe >25', () => { const r = Engine.AbdominalCompartmentPressure({ bladderPressureMmHg: 30, organDysfunction: true }); assertEq(r.compartmentSyndrome, true); assertEq(r.requiresDecompression, true); });
  it('normal <15', () => { const r = Engine.AbdominalCompartmentPressure({ bladderPressureMmHg: 10, organDysfunction: false }); assertEq(r.compartmentSyndrome, false); });
});

describe('ERASCompliance', () => {
  it('high 4+', () => { const r = Engine.ERASCompliance({ earlyMobilization: true, earlyFeeding: true, opioidSparing: true, regionalAnesthesia: true, foleyRemovalDay: 1 }); assertEq(r.compliance, 'high'); });
  it('low 0-1', () => { const r = Engine.ERASCompliance({ earlyMobilization: false, earlyFeeding: false, opioidSparing: false, regionalAnesthesia: false, foleyRemovalDay: 5 }); assertEq(r.compliance, 'low'); });
});

describe('SurgicalSiteInfection', () => {
  it('deep with purulent + deep', () => { const r = Engine.SurgicalSiteInfection({ postOpDay: 7, erythema: true, purulentDrainage: true, fever: true, deepTissueInvolvement: true }); assertEq(r.severity, 'deep'); assertEq(r.requiresOR, true); });
});

describe('VasopressorDose', () => {
  it('high dose', () => { assertEq(Engine.VasopressorDose({ norepinephrineMcgKgMin: 0.6, vasopressinUnitsPerHour: 0, epinephrineMcgKgMin: 0 }).tier, 'high'); });
  it('none', () => { assertEq(Engine.VasopressorDose({ norepinephrineMcgKgMin: 0, vasopressinUnitsPerHour: 0, epinephrineMcgKgMin: 0 }).tier, 'none'); });
});

describe('WoundCareAssessment', () => {
  it('infected', () => { const r = Engine.WoundCareAssessment({ woundType: 'surgical', exudate: 'purulent', odor: 'foul', surrounding: 'normal', depth: 'shallow', undermining: 0 }); assertEq(r.stage, 'infected'); assertEq(r.requiresDebridement, true); });
});

describe('DeliriumCAMICU', () => {
  it('delirium with 3+', () => { const r = Engine.DeliriumCAMICU({ acuteOnset: true, inattention: true, alteredConsciousness: true, disorganizedThinking: false }); assertEq(r.delirium, true); });
  it('not delirium with 1', () => { const r = Engine.DeliriumCAMICU({ acuteOnset: true, inattention: false, alteredConsciousness: false, disorganizedThinking: false }); assertEq(r.delirium, false); });
});
console.log(
);
console.log('sicu engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);