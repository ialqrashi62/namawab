/**
 * pcc/ccu/ccu_test.js
 * 40 unit tests for ccu_engine.js
 */
'use strict';

const assert = require('assert');
const Engine = require('./ccu_engine');

let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); passed++; console.log(`  \u2713 ${name}`); }
  catch (err) { failed++; console.error(`  \u2717 ${name}: ${err.message}`); }
}
function describe(s, fn) { console.log(`\n${s}`); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`${m || 'eq'}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); }

// 1. GRACE
describe('GRACEInHospitalMortality', () => {
  it('low at 108', () => { const r = Engine.GRACEInHospitalMortality(108); assertEq(r.category, 'low'); });
  it('intermediate at 120', () => { const r = Engine.GRACEInHospitalMortality(120); assertEq(r.category, 'intermediate'); });
  it('high at 150', () => { const r = Engine.GRACEInHospitalMortality(150); assertEq(r.category, 'high'); });
  it('throws on negative', () => { assert.throws(() => Engine.GRACEInHospitalMortality(-1)); });
});

// 2. TIMI
describe('TIMI_30day', () => {
  it('0 score = very_low', () => { const r = Engine.TIMI_30day({}); assertEq(r.risk, 'very_low'); assertEq(r.score, 0); });
  it('7 score = very_high + 41%', () => {
    const r = Engine.TIMI_30day({ age65: true, threeRiskFactors: true, priorStenosis: true, aspirinLast7Days: true, twoAnginalEvents24h: true, stDeviation: true, elevatedBiomarker: true });
    assertEq(r.risk, 'very_high'); assertEq(r.mace30dayPct, 41);
  });
  it('2 score = intermediate', () => { const r = Engine.TIMI_30day({ age65: true, threeRiskFactors: true }); assertEq(r.risk, 'intermediate'); assertEq(r.mace30dayPct, 8); });
  it('3-4 high', () => { const r = Engine.TIMI_30day({ age65: true, threeRiskFactors: true, priorStenosis: true }); assertEq(r.risk, 'high'); });
});

// 3. SCAI
describe('SCAI_Shock_Stage', () => {
  it('A on stable', () => { const r = Engine.SCAI_Shock_Stage({ sbpMmHg: 130, lactateMmolL: 1, onVasopressors: false }); assertEq(r.stage, 'A'); });
  it('B on low SBP', () => { const r = Engine.SCAI_Shock_Stage({ sbpMmHg: 95, lactateMmolL: 1, onVasopressors: false }); assertEq(r.stage, 'B'); });
  it('C on hypotension + lactate', () => { const r = Engine.SCAI_Shock_Stage({ sbpMmHg: 80, lactateMmolL: 3, onVasopressors: true }); assertEq(r.stage, 'C'); });
  it('D on pressors + high lactate', () => { const r = Engine.SCAI_Shock_Stage({ sbpMmHg: 80, lactateMmolL: 6, onVasopressors: true }); assertEq(r.stage, 'D'); });
  it('E on cardiac arrest', () => { const r = Engine.SCAI_Shock_Stage({ sbpMmHg: 60, lactateMmolL: 8, onVasopressors: true, cardiacArrest: true }); assertEq(r.stage, 'E'); });
  it('intervention A=monitor', () => { const r = Engine.SCAI_Shock_Stage({ sbpMmHg: 130, lactateMmolL: 1, onVasopressors: false }); assertEq(r.intervention, 'monitor_closely'); });
  it('intervention E=ecpr', () => { const r = Engine.SCAI_Shock_Stage({ sbpMmHg: 60, lactateMmolL: 8, onVasopressors: true, cardiacArrest: true }); assertEq(r.intervention, 'emergent_ecpr_cannulation'); });
});

// 4. DAPT
describe('DAP_30day', () => {
  it('ACS standard 12 months', () => { const r = Engine.DAP_30day({ presentation: 'ACS', stentType: 'DES' }); assertEq(r.months, 12); });
  it('stable CAD 6 months', () => { const r = Engine.DAP_30day({ presentation: 'stable', stentType: 'DES' }); assertEq(r.months, 6); });
  it('high bleeding risk short DAPT', () => { const r = Engine.DAP_30day({ presentation: 'ACS', stentType: 'DES', isHighBleedingRisk: true }); assertEq(r.months, 1); });
  it('high ischemic + ACS = 12', () => { const r = Engine.DAP_30day({ presentation: 'ACS', stentType: 'DES', isHighIschemicRisk: true }); assertEq(r.months, 12); });
});

// 5. BleedingRisk
describe('BleedingRisk', () => {
  it('0 score = very_low', () => { const r = Engine.BleedingRisk({}); assertEq(r.risk, 'very_low'); });
  it('7 score = high + radial_access', () => {
    const r = Engine.BleedingRisk({ age75: true, female: true, hr120: true, sbpLow: true, diabetes: true, priorVascularDisease: true, renalInsufficiency: true });
    assertEq(r.risk, 'high');
    assertEq(r.recommendation, 'consider_short_dapt_radial_access');
  });
  it('3-4 low', () => { const r = Engine.BleedingRisk({ age75: true, female: true, diabetes: true }); assertEq(r.risk, 'low'); });
});

// 6. MCS
describe('MCSIndication', () => {
  it('A = none', () => { assertEq(Engine.MCSIndication('A', false).device, 'none'); });
  it('C = iabp or impella', () => { assertEq(Engine.MCSIndication('C', false).device, 'iabp_or_impella'); });
  it('D = impella or va_ecmo', () => { assertEq(Engine.MCSIndication('D', false).device, 'impella_or_va_ecmo'); });
  it('E = va_ecmo', () => { assertEq(Engine.MCSIndication('E', false).device, 'va_ecmo'); });
  it('D + RV failure = dual lumen RVAD', () => { assertEq(Engine.MCSIndication('D', true).device, 'va_ecmo_or_dual_lumen_rvad'); });
});

// 7. TTM
describe('TTMEligibility', () => {
  it('eligible when all criteria met', () => { const r = Engine.TTMEligibility({ witnessed: true, roscAchieved: true, comatose: true, hoursSinceArrest: 2 }); assertEq(r.eligible, true); });
  it('not eligible after 6h', () => { const r = Engine.TTMEligibility({ witnessed: true, roscAchieved: true, comatose: true, hoursSinceArrest: 7 }); assertEq(r.eligible, false); });
  it('not eligible if not comatose', () => { const r = Engine.TTMEligibility({ witnessed: true, roscAchieved: true, comatose: false, hoursSinceArrest: 2 }); assertEq(r.eligible, false); });
  it('target 32C 24h', () => { const r = Engine.TTMEligibility({ witnessed: true, roscAchieved: true, comatose: true, hoursSinceArrest: 2 }); assertEq(r.targetTempC, 32); assertEq(r.durationHours, 24); });
});

// 8. Arrhythmia
describe('ArrhythmiaRecognition', () => {
  it('asystole at rate 0', () => { assertEq(Engine.ArrhythmiaRecognition({ rate: 0 }).type, 'asystole'); });
  it('sinus rhythm at 75', () => { assertEq(Engine.ArrhythmiaRecognition({ rate: 75, rhythm: 'regular', hasPWave: true, qrsWidthMs: 80 }).type, 'sinus_rhythm'); });
  it('afib no p-wave irregularly', () => { assertEq(Engine.ArrhythmiaRecognition({ rate: 130, rhythm: 'irregularly_irregular', hasPWave: false, qrsWidthMs: 80 }).type, 'afib'); });
  it('VT wide + regular', () => { assertEq(Engine.ArrhythmiaRecognition({ rate: 180, rhythm: 'regular', hasPWave: false, qrsWidthMs: 160 }).type, 'vt_mono'); });
  it('VF if wide + irregularly', () => { assertEq(Engine.ArrhythmiaRecognition({ rate: 250, rhythm: 'irregularly_irregular', hasPWave: false, qrsWidthMs: 160 }).type, 'vt_poly'); });
  it('unstable at high rate', () => { const r = Engine.ArrhythmiaRecognition({ rate: 200, rhythm: 'regular', hasPWave: false, qrsWidthMs: 160 }); assertEq(r.unstable, true); });
});

// 9. IABP
describe('IABPTroubleshooting', () => {
  it('early inflation issue', () => {
    const r = Engine.IABPTroubleshooting({ timingPattern: 'early' });
    assertEq(r.action, 'delay_inflation_to_dicrotic_notch');
  });
  it('late inflation issue', () => {
    const r = Engine.IABPTroubleshooting({ timingPattern: 'late' });
    assertEq(r.action, 'advance_inflation_to_dicrotic_notch');
  });
  it('rapid aug drop', () => {
    const r = Engine.IABPTroubleshooting({ timingPattern: 'good', alarmType: 'rapid_aug_drop' });
    assertEq(r.action, 'check_tubing_fibrin_withdraw');
  });
  it('trigger loss', () => {
    const r = Engine.IABPTroubleshooting({ timingPattern: 'good', alarmType: 'trigger_loss' });
    assertEq(r.action, 'switch_to_pressure_trigger_check_leads');
  });
  it('no issues when good', () => {
    const r = Engine.IABPTroubleshooting({ timingPattern: 'good' });
    assertEq(r.action, 'no_timing_adjustment');
  });
});

// 10. Impella
describe('ImpellaTroubleshooting', () => {
  it('position too far', () => { assertEq(Engine.ImpellaTroubleshooting('position_too_far').severity, 'critical'); });
  it('position too shallow', () => { assertEq(Engine.ImpellaTroubleshooting('position_too_shallow').severity, 'critical'); });
  it('suction event', () => { assertEq(Engine.ImpellaTroubleshooting('suction_event').severity, 'moderate'); });
  it('hemolysis high', () => { assertEq(Engine.ImpellaTroubleshooting('hemolysis').severity, 'high'); });
  it('pump stop critical', () => { assertEq(Engine.ImpellaTroubleshooting('pump_stop').severity, 'critical'); });
  it('low flow moderate', () => { assertEq(Engine.ImpellaTroubleshooting('low_flow_alarm').severity, 'moderate'); });
  it('throws on unknown', () => { assert.throws(() => Engine.ImpellaTroubleshooting('xyz')); });
});

console.log(`\n${'='.repeat(40)}`);
console.log(`CCU engine tests: ${passed} passed, ${failed} failed`);
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);
