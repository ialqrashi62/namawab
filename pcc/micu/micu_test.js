'use strict';
const assert = require('assert');
const Engine = require('./micu_engine');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ✓ ' + name); } catch (err) { failed++; console.error('  ✗ ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
describe('APACHE_IIScore', () => {
  it('high score', () => { const r = Engine.APACHE_IIScore({ age: 80, chronicHealth: 'severe', glasgow: 5, temperature: 41, map: 40, heartRate: 200, respRate: 60, paO2: 50, ph: 7.1, sodium: 110, potassium: 8, creatinine: 4, hematocrit: 15, wbc: 50 }); assertEq(r.mortality, 'high'); });
  it('low score', () => { const r = Engine.APACHE_IIScore({ age: 40, chronicHealth: 'none', glasgow: 15, temperature: 37, map: 90, heartRate: 90, respRate: 18, paO2: 100, ph: 7.4, sodium: 140, potassium: 4, creatinine: 1, hematocrit: 35, wbc: 10 }); assertEq(r.mortality, 'low'); });
});

describe('SOFAScore', () => {
  it('sepsis organ dysfunction', () => { const r = Engine.SOFAScore({ paO2FiO2: 100, platelets: 20, bilirubin: 5, map: 60, glasgow: 5, creatinine: 4, urineOutput: 100 }); assert(r.sepsisOrganDysfunction); });
});

describe('VentSettingsOptimizer', () => {
  it('hypoxemic recommends PEEP', () => { const r = Engine.VentSettingsOptimizer({ weightKg: 70, mode: 'AC', currentPeep: 5, currentFiO2: 0.4, currentTidalVolume: 420, paO2: 55, paCO2: 45, plateauPressure: 25 }); assert(r.recommendations.includes('increase_PEEP')); });
  it('high plateau recommends tidal reduction', () => { const r = Engine.VentSettingsOptimizer({ weightKg: 70, mode: 'AC', currentPeep: 10, currentFiO2: 0.5, currentTidalVolume: 500, paO2: 80, paCO2: 45, plateauPressure: 35 }); assert(r.recommendations.includes('reduce_tidal_volume')); });
});

describe('SepsisBundleComplete', () => {
  it('all complete', () => { const r = Engine.SepsisBundleComplete({ lactate: true, bloodCultureBeforeAntibiotics: true, antibiotics: true, fluid30mlKg: true, vasopressorIfHypotensive: true, mapTarget65: true }); assertEq(r.allCompleted, true); });
  it('missing lactate', () => { const r = Engine.SepsisBundleComplete({ lactate: false, bloodCultureBeforeAntibiotics: true, antibiotics: true, fluid30mlKg: true, vasopressorIfHypotensive: true, mapTarget65: true }); assertEq(r.allCompleted, false); });
});

describe('SedationLevel', () => {
  it('RASS 0 on vent target met', () => { const r = Engine.SedationLevel({ rass: 0, onVentilator: true }); assertEq(r.interpretation, 'alert_calm'); assertEq(r.targetMet, true); });
  it('RASS +2 on vent not met', () => { const r = Engine.SedationLevel({ rass: 2, onVentilator: true }); assertEq(r.targetMet, false); });
});

describe('CAMICU', () => {
  it('delirium 4 features', () => { const r = Engine.CAMICU({ acuteOnset: true, inattention: true, alteredConsciousness: true, disorganizedThinking: true }); assertEq(r.delirium, true); assertEq(r.severity, 'severe'); });
  it('not delirium 0', () => { const r = Engine.CAMICU({ acuteOnset: false, inattention: false, alteredConsciousness: false, disorganizedThinking: false }); assertEq(r.delirium, false); });
});

describe('CRRTCircuitLife', () => {
  it('citrate extends life', () => { const r = Engine.CRRTCircuitLife({ circuitHours: 50, currentFlow: 2000, currentBfr: 200, replacementFluid: 'prismasate', anticoagulation: 'citrate' }); assert(r.predictedLifeHours >= 72); });
});

describe('ECMOIndicationCheck', () => {
  it('VV-ECMO for refractory hypoxemia', () => { const r = Engine.ECMOIndicationCheck({ paO2FiO2: 60, ph: 7.2, map: 70, lactate: 3, age: 40, comorbidities: 'none', reversibility: true, refractoryVentilation: true }); assertEq(r.indicated, true); assertEq(r.modality, 'VV-ECMO'); });
  it('age precludes', () => { const r = Engine.ECMOIndicationCheck({ paO2FiO2: 50, ph: 7.2, map: 60, lactate: 5, age: 80, comorbidities: 'none', reversibility: true, refractoryVentilation: true }); assertEq(r.indicated, false); assertEq(r.reason, 'age_precludes'); });
});

describe('WithdrawalOfCareTrigger', () => {
  it('patient wishes', () => { const r = Engine.WithdrawalOfCareTrigger({ apacheScore: 20, sofaScore: 10, age: 60, comorbidities: 'none', patientWishes: 'dni_dnr', familyWishes: null }); assertEq(r.consult, true); });
  it('no trigger if stable', () => { const r = Engine.WithdrawalOfCareTrigger({ apacheScore: 10, sofaScore: 5, age: 50, comorbidities: 'none', patientWishes: null, familyWishes: null }); assertEq(r.consult, false); });
});
console.log(
);
console.log('micu engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);