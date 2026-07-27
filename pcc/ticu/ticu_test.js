'use strict';
const assert = require('assert');
const Engine = require('./ticu_engine');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  ✓ ' + name); } catch (err) { failed++; console.error('  ✗ ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error((m || 'eq') + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
describe('ICPMonitorTrend', () => {
  it('critical >25', () => { const r = Engine.ICPMonitorTrend({ currentIcp: 30, baselineIcp: 12, timeMinutes: 60 }); assertEq(r.status, 'critical'); });
  it('rising rapidly', () => { const r = Engine.ICPMonitorTrend({ currentIcp: 22, baselineIcp: 12, timeMinutes: 15 }); assertEq(r.status, 'rising_rapidly'); });
  it('normal', () => { const r = Engine.ICPMonitorTrend({ currentIcp: 12, baselineIcp: 12, timeMinutes: 60 }); assertEq(r.status, 'normal'); });
});

describe('CerebralPerfusionPressure', () => {
  it('optimal 60-70', () => { const r = Engine.CerebralPerfusionPressure({ map: 85, icp: 20 }); assertEq(r.status, 'optimal'); });
  it('critical low', () => { const r = Engine.CerebralPerfusionPressure({ map: 60, icp: 20 }); assertEq(r.status, 'critical_low'); });
});

describe('GCSProgression', () => {
  it('severe intubate', () => { const r = Engine.GCSProgression({ baselineGcs: 10, currentGcs: 7, timeHours: 2 }); assertEq(r.status, 'severe'); assertEq(r.intubate, true); });
  it('improving', () => { const r = Engine.GCSProgression({ baselineGcs: 7, currentGcs: 12, timeHours: 24 }); assertEq(r.status, 'improving'); });
});

describe('CervicalSpineClearance', () => {
  it('NEXUS clear if no tenderness + alert + age 14+', () => { const r = Engine.CervicalSpineClearance({ nuchalTenderness: false, midlineTenderness: false, rangeOfMotion: 'full_painfree', intoxication: false, distractingInjury: false, alteredMentalStatus: false, age: 30 }); assertEq(r.cleared, true); });
  it('not cleared with intoxication', () => { const r = Engine.CervicalSpineClearance({ nuchalTenderness: false, midlineTenderness: false, rangeOfMotion: 'full_painfree', intoxication: true, distractingInjury: false, alteredMentalStatus: false, age: 30 }); assertEq(r.cleared, false); });
});

describe('CompartmentPressure', () => {
  it('fasciotomy when delta<30', () => { const r = Engine.CompartmentPressure({ pressureMmHg: 35, diastolicBP: 60, location: 'leg' }); assertEq(r.status, 'fasciotomy_immediate'); });
  it('normal when delta>40', () => { const r = Engine.CompartmentPressure({ pressureMmHg: 20, diastolicBP: 80, location: 'leg' }); assertEq(r.status, 'normal'); });
});

describe('CrushRhabdomyolysis', () => {
  it('severe with 3+', () => { const r = Engine.CrushRhabdomyolysis({ ckLevel: 8000, urineOutputMlPerHour: 100, potassium: 6.5, calcium: 7, fluidRateMlPerHour: 200 }); assertEq(r.severity, 'severe'); assertEq(r.requiresDialysis, true); });
});

describe('VTEProphylaxis', () => {
  it('within 24h = mechanical only', () => { const r = Engine.VTEProphylaxis({ injuryPattern: 'long_bone', timeSinceInjury: 12, bleedingRisk: 'low', contraindication: false, weightKg: 70 }); assertEq(r.lwmh, false); assertEq(r.mechanicalOnly, true); });
  it('standard LMWH 40mg', () => { const r = Engine.VTEProphylaxis({ injuryPattern: 'long_bone', timeSinceInjury: 48, bleedingRisk: 'low', contraindication: false, weightKg: 70 }); assertEq(r.lwmh, true); });
});

describe('PulmonaryEmbolismRuleOut', () => {
  it('unstable = massive PE', () => { const r = Engine.PulmonaryEmbolismRuleOut({ wellsScore: 4, age: 60, hr: 130, spo2: 85, hemodynamicallyStable: false, recentSurgery: false }); assertEq(r.peLikely, true); assertEq(r.severity, 'massive'); });
  it('low Wells unlikely', () => { const r = Engine.PulmonaryEmbolismRuleOut({ wellsScore: 1, age: 40, hr: 80, spo2: 98, hemodynamicallyStable: true, recentSurgery: false }); assertEq(r.peLikely, 'low'); });
});

describe('RehabilitationEligibility', () => {
  it('awake and walking', () => { const r = Engine.RehabilitationEligibility({ gcs: 14, mobility: 'standing', cognitiveStatus: 'intact', socialSupport: 'present', premorbidFunctional: 'independent' }); assertEq(r.level, 'gait_training'); });
});

describe('MassiveTransfusion', () => {
  it('3+ triggers = MTP', () => { const r = Engine.MassiveTransfusion({ hr: 130, sbp: 80, lactate: 5, baseDeficit: -8, positiveFAST: true, penetratingTrauma: false }); assertEq(r.mtpActivated, true); assertEq(r.ratio, '1:1:1'); });
  it('not MTP if stable', () => { const r = Engine.MassiveTransfusion({ hr: 90, sbp: 110, lactate: 1.5, baseDeficit: -2, positiveFAST: false, penetratingTrauma: false }); assertEq(r.mtpActivated, false); });
});
console.log(
);
console.log('ticu engine tests: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);