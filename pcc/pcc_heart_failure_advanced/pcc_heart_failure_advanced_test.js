// P3-DI pcc_heart_failure_advanced unit tests v3.316.32 (Phase 1A clinical-grade)
const Engine = require('./pcc_heart_failure_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  PASS ' + name); passed++; } catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
function assertClose(a, b, tol) { assert.ok(Math.abs(a - b) <= tol, `Expected ${a} close to ${b} within ${tol}, got ${a}`); }

console.log('pcc_heart_failure_advanced engine tests v3.316.32:');

// NYHAStaging
it('NYHAStaging: stage D NYHA IV + refractory', () => {
  const r = Engine.NYHAStaging({ nyha: 4, lvef: 20, refractory: true });
  assertEq(r.stage, 'D'); assertEq(r.nyhaClass, 'IV');
});
it('NYHAStaging: stage C NYHA III', () => {
  const r = Engine.NYHAStaging({ nyha: 3, lvef: 30, symptomatic: true });
  assertEq(r.stage, 'C'); assertEq(r.nyhaClass, 'III');
});
it('NYHAStaging: stage B structural-only', () => {
  const r = Engine.NYHAStaging({ lvef: 35, structuralDisease: true, symptomatic: false });
  assertEq(r.stage, 'B');
});
it('NYHAStaging: stage A risk-only', () => {
  const r = Engine.NYHAStaging({ riskFactors: 2 });
  assertEq(r.stage, 'A');
});

// BNPTrend
it('BNPTrend: critical threshold', () => {
  const r = Engine.BNPTrend({ baseline: 1000, current: 3500 });
  assertEq(r.risk, 'critical'); assertClose(r.admissionRisk30d, 0.45, 0.001);
});
it('BNPTrend: improving', () => {
  const r = Engine.BNPTrend({ baseline: 1000, current: 500 });
  assertEq(r.risk, 'improving');
});
it('BNPTrend: invalid', () => {
  assertEq(Engine.BNPTrend({}).plan, 'invalid-input');
});

// EjectionFraction
it('EjectionFraction: HFpEF', () => {
  const r = Engine.EjectionFraction({ current: 55 });
  assertEq(r.category, 'hfpef');
});
it('EjectionFraction: HFrEF-severe', () => {
  const r = Engine.EjectionFraction({ current: 25 });
  assertEq(r.category, 'HFrEF-severe');
});
it('EjectionFraction: improving trajectory', () => {
  const r = Engine.EjectionFraction({ baseline: 35, current: 40, intervalDays: 730 });
  assertEq(r.trajectory, 'improving');
});
it('EjectionFraction: invalid', () => {
  assertEq(Engine.EjectionFraction({}).plan, 'invalid-input');
});

// FluidStatus
it('FluidStatus: severe congestion', () => {
  const r = Engine.FluidStatus({ weight: 90, weightBaseline: 85, edema: 'severe', jvp: 'elevated', orthopnea: true, dyspnea: true, lungSounds: 'crackles' });
  assert(r.congestionScore >= 7); assertEq(r.status, 'severe');
});
it('FluidStatus: euvolemic', () => {
  const r = Engine.FluidStatus({ weight: 80, weightBaseline: 80, edema: 'none', jvp: 'normal' });
  assertEq(r.status, 'euvolemic');
});

// CardiacDevice
it('CardiacDevice: ICD primary prevention', () => {
  const r = Engine.CardiacDevice({ lvef: 30, nyha: 2, onMaxGdmt: true });
  assertEq(r.icdIndication, 'primary-prevention-eligible');
});
it('CardiacDevice: ICD secondary prevention', () => {
  const r = Engine.CardiacDevice({ lvef: 40, vfHistory: true });
  assertEq(r.icdIndication, 'secondary-prevention-eligible');
});
it('CardiacDevice: CRT class IA', () => {
  const r = Engine.CardiacDevice({ lvef: 25, nyha: 2, qrsDuration: 160, lbbb: true });
  assertEq(r.crtIndication, 'class-IA');
});
it('CardiacDevice: LVAD destination', () => {
  const r = Engine.CardiacDevice({ lvef: 20, nyha: 4 });
  assertEq(r.lvadIndication, 'destination-or-bridge-to-transplant');
});

// HeartTransplantEval
it('HeartTransplantEval: listed (NYHA IV)', () => {
  const r = Engine.HeartTransplantEval({ nyha: 4, lvef: 20, socialSupport: true, egfr: 60 });
  assertEq(r.status, 'listed'); assertEq(r.listingPriority, 'high');
});
it('HeartTransplantEval: declined (active malignancy)', () => {
  const r = Engine.HeartTransplantEval({ nyha: 4, activeMalignancy: true });
  assertEq(r.status, 'declined');
});
it('HeartTransplantEval: declined (severe PAH)', () => {
  const r = Engine.HeartTransplantEval({ nyha: 4, papSystolic: 65, cardiacIndex: 1.8, socialSupport: true });
  assertEq(r.status, 'declined');
});

// PalliativeHF
it('PalliativeHF: tier 1 NYHA IV', () => {
  const r = Engine.PalliativeHF({ nyha: 4 });
  assertEq(r.tier, 1);
});
it('PalliativeHF: tier 4 stable', () => {
  const r = Engine.PalliativeHF({ nyha: 2 });
  assertEq(r.tier, 4);
});

// AcuteDecompensation
it('AcuteDecompensation: critical (hypotensive + hypoxic)', () => {
  const r = Engine.AcuteDecompensation({ systolicBp: 85, spo2: 88, respiratoryRate: 32 });
  assertEq(r.acuity, 'critical');
});
it('AcuteDecompensation: home 80mg -> IV 200mg', () => {
  const r = Engine.AcuteDecompensation({ homeFurosemideDose: 80 });
  assertEq(r.initialIvDose, 200);
});
it('AcuteDecompensation: AKI -> continuous', () => {
  const r = Engine.AcuteDecompensation({ egfr: 25 });
  assertEq(r.infusionStrategy, 'continuous-infusion-preferred');
});

// DiureticStrategy
it('DiureticStrategy: ADVOR acetazolamide', () => {
  const r = Engine.DiureticStrategy({ egfr: 50, congestionScore: 5, currentDose: 40 });
  assert(r.furosemideDose >= 80);
});
it('DiureticStrategy: AKI -> torsemide', () => {
  const r = Engine.DiureticStrategy({ egfr: 25, congestionScore: 4, currentDose: 100 });
  assertEq(r.addThiazide, 'metolazone-or-torsemide-switch');
});
it('DiureticStrategy: K replacement aggressive', () => {
  const r = Engine.DiureticStrategy({ egfr: 50, congestionScore: 2, currentDose: 40, serumK: 3.2 });
  assertEq(r.potassiumReplacement, 'aggressive-IV-KCl');
});

// SelfManagement
it('SelfManagement: excellent adherence', () => {
  const r = Engine.SelfManagement({ dailyWeight: true, sodiumRestriction: true, fluidRestriction: true, medicationAdherence: 'perfect', symptomRecognition: true, exerciseMinutes: 200, smokingStatus: 'never', alcoholDrinks: 0 });
  assertEq(r.tier, 'excellent');
});
it('SelfManagement: poor adherence -> case mgmt', () => {
  const r = Engine.SelfManagement({ medicationAdherence: 'poor', smokingStatus: 'current' });
  assertEq(r.tier, 'poor');
  assertEq(r.educationFocus, 'case-management-referral');
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);