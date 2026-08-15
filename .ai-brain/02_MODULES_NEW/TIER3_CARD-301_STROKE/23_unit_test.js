/**
 * Stroke Center — Unit Tests
 * 25 test cases covering all pure functions.
 */

'use strict';

const engine = require('./tier3_card_301_stroke_engine');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ FAIL: ${msg}`); }
}

function suite(name, fn) {
  console.log(`\n--- ${name} ---`);
  try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); }
}

suite('NIHSS', () => {
  const minor = { consciousness: 0, gaze: 0, visual_fields: 0, facial_palsy: 0, motor_arm_left: 0, motor_arm_right: 0, motor_leg_left: 0, motor_leg_right: 0, limb_ataxia: 0, sensory: 0, language: 0, dysarthria: 0, extinction: 0 };
  assert(engine.nihssScore(minor).score === 0, 'NIHSS minor = 0');
  assert(engine.nihssScore(minor).severity === 'minor', 'NIHSS severity = minor');

  const mod = { ...minor, motor_arm_left: 1, motor_arm_right: 1, language: 1 };
  let r = engine.nihssScore(mod);
  assert(r.score === 3, 'NIHSS moderate = 3');

  const severe = { ...minor, motor_arm_left: 4, motor_arm_right: 4, motor_leg_left: 4, motor_leg_right: 4, consciousness: 3, language: 3 };
  r = engine.nihssScore(severe);
  assert(r.score === 26, 'NIHSS severe = 26');
  assert(r.severity === 'severe', 'Severity = severe');

  try { engine.nihssScore({ ...minor, consciousness: 5 }); assert(false, 'Should throw on out-of-range'); }
  catch (e) { assert(e.code === 'OUT_OF_RANGE', 'Out-of-range throws'); }
});

suite('ASPECTS', () => {
  const ok = { caudate: 1, lentiform: 1, internal_capsule: 1, insular_ribbon: 1, mca_m1: 1, mca_m2: 1, mca_m3: 1, mca_m4: 1, mca_m5: 1, mca_m6: 1 };
  assert(engine.aspectsScore(ok).score === 10, 'ASPECTS all normal = 10');
  assert(engine.aspectsScore(ok).prognosis === 'favorable', 'Prognosis favorable');

  const bad = { caudate: 0, lentiform: 0, internal_capsule: 0, insular_ribbon: 0, mca_m1: 0, mca_m2: 0, mca_m3: 0, mca_m4: 0, mca_m5: 0, mca_m6: 0 };
  assert(engine.aspectsScore(bad).score === 0, 'ASPECTS all affected = 0');
  assert(engine.aspectsScore(bad).prognosis === 'poor_eligible_excluded', 'Prognosis poor_eligible_excluded');
});

suite('mRS', () => {
  assert(engine.mrsScore({ score: 0 }).favorable_outcome === true, 'mRS 0 favorable');
  assert(engine.mrsScore({ score: 2 }).favorable_outcome === true, 'mRS 2 favorable');
  assert(engine.mrsScore({ score: 3 }).favorable_outcome === false, 'mRS 3 not favorable');
  assert(engine.mrsScore({ score: 6 }).description === 'Dead', 'mRS 6 death');
  try { engine.mrsScore({ score: 7 }); assert(false, 'Should throw on invalid'); }
  catch (e) { assert(e.code === 'INVALID', 'mRS invalid throws'); }
});

suite('ICH Score', () => {
  const low = { gcs: 15, age: 50, ich_volume: 10, ivh: false, infratentorial: false };
  assert(engine.ichScore(low).score === 0, 'ICH score 0');
  const high = { gcs: 3, age: 85, ich_volume: 50, ivh: true, infratentorial: true };
  assert(engine.ichScore(high).score === 6, 'ICH score 6');
  assert(engine.ichScore(high).mortality_30d === 1.0, 'ICH high mortality 100%');
});

suite('Hunt-Hess', () => {
  assert(engine.huntHess({ grade: 1 }).surgical_urgency === 'elective', 'Hunt-Hess 1 elective');
  assert(engine.huntHess({ grade: 5 }).surgical_urgency === 'urgent', 'Hunt-Hess 5 urgent');
  try { engine.huntHess({ grade: 6 }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'INVALID', 'Hunt-Hess invalid'); }
});

suite('ABCD2', () => {
  const low = { age: 50, bp: '120/80', clinical_features: 'none', duration: '<10min', diabetes: false };
  assert(engine.abcd2Score(low).score === 0, 'ABCD2 low = 0');
  const high = { age: 65, bp: '160/90', clinical_features: 'unilateral_weakness', duration: '>=60min', diabetes: true };
  assert(engine.abcd2Score(high).score === 7, 'ABCD2 high = 7');
  assert(engine.abcd2Score(high).risk === 'high', 'ABCD2 risk high');
});

suite('CHA2DS2-VASc', () => {
  const low = { age: 45, sex: 'male', chf: false, htn: false, stroke_prior: false, tia_prior: false, thromboembolism: false, vascular: false, diabetes: false };
  assert(engine.cha2ds2vascScore(low).score === 0, 'CHA2DS2-VASc male low = 0');
  assert(engine.cha2ds2vascScore(low).anticoag_recommendation === 'no', 'CHA2DS2-VASc no anticoag');

  const high = { age: 80, sex: 'female', chf: true, htn: true, stroke_prior: true, tia_prior: false, thromboembolism: false, vascular: true, diabetes: true };
  assert(engine.cha2ds2vascScore(high).score === 9, 'CHA2DS2-VASc max = 9');
  assert(engine.cha2ds2vascScore(high).anticoag_recommendation === 'recommended', 'Anticoag recommended');
});

suite('HAS-BLED', () => {
  assert(engine.hasBledScore({ htn: false, renal: false, liver: false, stroke_prior: false, bleeding_prior: false, labile_inr: false, elderly: false, drugs: false, alcohol: false }).score === 0, 'HAS-BLED min = 0');
  const high = { htn: true, renal: true, liver: true, stroke_prior: true, bleeding_prior: true, labile_inr: true, elderly: true, drugs: true, alcohol: true };
  assert(engine.hasBledScore(high).score === 9, 'HAS-BLED max = 9');
  assert(engine.hasBledScore(high).high_bleed_risk === true, 'HAS-BLED high risk');
});

suite('Tenecteplase Dosing', () => {
  const r = engine.tenecteplaseDose({ weight_kg: 80, age: 60 });
  assert(r.dose_mg === 20, 'Tenecteplase 80kg = 20mg');
  assert(r.single_iv_bolus === true, 'Tenecteplase IV bolus');

  const max = engine.tenecteplaseDose({ weight_kg: 200, age: 60 });
  assert(max.dose_mg === 25, 'Tenecteplase max 25mg');

  try { engine.tenecteplaseDose({ weight_kg: 20, age: 60 }); assert(false, 'Should throw'); }
  catch (e) { assert(e.code === 'INVALID_WEIGHT', 'Invalid weight throws'); }
});

suite('Thrombolysis Eligibility', () => {
  const eligible = { age: 65, tlkw_minutes: 120, nihss: 8, ct_hemorrhage: false, inr: 1.0, platelets: 250000, recent_surgery: false, recent_stroke: false, active_bleeding: false, bp_systolic: 160, bp_diastolic: 90 };
  assert(engine.thrombolysisEligibility(eligible).eligible === true, 'Eligible patient');

  const excluded = { age: 65, tlkw_minutes: 360, nihss: 8, ct_hemorrhage: false, inr: 1.0, platelets: 250000, recent_surgery: false, recent_stroke: false, active_bleeding: false, bp_systolic: 160, bp_diastolic: 90 };
  assert(engine.thrombolysisEligibility(excluded).eligible === false, 'Out-of-window excluded');
  assert(engine.thrombolysisEligibility(excluded).agent === 'none', 'Agent = none');
});

suite('Door-to-Needle Compliance', () => {
  assert(engine.doorToNeedleCompliance({ minutes: 45 }).compliant === true, 'DNT 45 compliant');
  assert(engine.doorToNeedleCompliance({ minutes: 75 }).compliant === false, 'DNT 75 non-compliant');
});

suite('Secondary Prevention Bundle', () => {
  const full = { antiplatelet: true, statin: true, anticoagulation: true, bp_control: true, lifestyle: true };
  assert(engine.secondaryPreventionBundle(full).complete === true, 'Full bundle complete');
  assert(engine.secondaryPreventionBundle(full).completeness_pct === 100, 'Full bundle 100%');

  const partial = { antiplatelet: true, statin: true, anticoagulation: false, bp_control: false, lifestyle: false };
  assert(engine.secondaryPreventionBundle(partial).complete === false, 'Partial bundle incomplete');
  assert(engine.secondaryPreventionBundle(partial).completeness_pct === 40, 'Partial bundle 40%');
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
