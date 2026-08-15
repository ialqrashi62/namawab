/**
 * Robotic CV Surgery — Unit Tests
 */

'use strict';

const engine = require('./tier3_card_304_robotic_engine');

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { failed++; console.error(`  ✗ FAIL: ${msg}`); } }
function suite(name, fn) { console.log(`\n--- ${name} ---`); try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); } }

suite('STS Risk Score', () => {
  const low = { age: 60, ef_pct: 60, creatinine: 1.0, dialysis: false, emergency: false, prior_cardiac_surgery: false, female: false, diabetes: false, hypertension: false, copd: false };
  assert(engine.stsScore(low).risk === 'low', 'Low STS risk');
  const high = { age: 80, ef_pct: 25, creatinine: 3.0, dialysis: true, emergency: true, prior_cardiac_surgery: true, female: true, diabetes: true, hypertension: true, copd: true };
  assert(['high','very_high'].includes(engine.stsScore(high).risk), 'Very high STS risk');
});

suite('EuroSCORE II', () => {
  const low = { age: 60, gender: 'male', nyha: 1, ef_pct: 60, recent_mi: false, pulmonary_htn: false, creatinine: 1.0, dialysis: false, diabetes: false, critical_state: false };
  assert(engine.euroscoreII(low).risk === 'low', 'Low EuroSCORE II');
  const high = { age: 85, gender: 'female', nyha: 4, ef_pct: 25, recent_mi: true, pulmonary_htn: true, creatinine: 3.0, dialysis: true, diabetes: true, critical_state: true };
  assert(['high','very_high'].includes(engine.euroscoreII(high).risk), 'Very high EuroSCORE II');
});

suite('TAVI Eligibility', () => {
  const eligible = { age: 80, sts_score: 5, annulus_size_mm: 24, ef_pct: 50, frailty: 'robust', life_expectancy_years: 5 };
  assert(engine.taviEligibility(eligible).eligible === true, 'TAVI eligible');
  const ineligible = { age: 50, sts_score: 1, annulus_size_mm: 24, ef_pct: 60, frailty: 'robust', life_expectancy_years: 30 };
  assert(engine.taviEligibility(ineligible).eligible === false, 'TAVI ineligible');
});

suite('MitraClip Eligibility', () => {
  const eligible = { mr_grade: 4, ef_pct: 45, nyha: 3, sts_score: 10, symptoms_on_gdmt: true };
  assert(engine.mitraclipEligibility(eligible).eligible === true, 'MitraClip eligible');
  const ineligible = { mr_grade: 2, ef_pct: 65, nyha: 1, sts_score: 5, symptoms_on_gdmt: false };
  assert(engine.mitraclipEligibility(ineligible).eligible === false, 'MitraClip ineligible');
});

suite('WATCHMAN Eligibility', () => {
  const eligible = { cha2ds2vasc: 4, has_bled: 4, contraindication_to_anticoag: true, laa_ostium_mm: 22 };
  assert(engine.watchmanEligibility(eligible).eligible === true, 'WATCHMAN eligible');
  const ineligible = { cha2ds2vasc: 1, has_bled: 1, contraindication_to_anticoag: false, laa_ostium_mm: 22 };
  assert(engine.watchmanEligibility(ineligible).eligible === false, 'WATCHMAN ineligible');
});

suite('Robotic Surgery Eligibility', () => {
  const eligible = { age: 60, ef_pct: 50, prior_cardiac_surgery: false, obesity_bmi: 25, pulmonary_function: 'normal' };
  assert(engine.roboticSurgeryEligibility(eligible).eligible === true, 'Robotic eligible');
  const ineligible = { age: 85, ef_pct: 25, prior_cardiac_surgery: true, obesity_bmi: 45, pulmonary_function: 'severe_impairment' };
  assert(engine.roboticSurgeryEligibility(ineligible).eligible === false, 'Robotic ineligible');
});

suite('Pre-Op Checklist', () => {
  const full = { echo_within_30_days: true, coronary_anatomy_known: true, pulmonary_function_tests: true, renal_function_clearance: true, frailty_assessment: true, coagulation_profile: true, blood_typing_crossmatch: true, pdpl_consent: true, anesthesia_consult: true, perfusionist_consult: true };
  assert(engine.preOpChecklist(full).ready === true, 'Pre-op complete');
  assert(engine.preOpChecklist(full).completed === 10, '10 items checked');
  const partial = { ...full, pdpl_consent: false };
  assert(engine.preOpChecklist(partial).ready === false, 'Pre-op incomplete');
});

suite('Conversion to Open Risk', () => {
  const low = engine.conversionToOpenRisk({ obesity_bmi: 25, prior_cardiac_surgery: false, anatomy_complexity: 'low' });
  assert(low.risk === 'low', 'Low conversion risk');
  const high = engine.conversionToOpenRisk({ obesity_bmi: 45, prior_cardiac_surgery: true, anatomy_complexity: 'high' });
  assert(high.risk === 'high', 'High conversion risk');
});

suite('Post-Op Complication Risk', () => {
  const low = engine.postOpComplicationRisk({ sts_score: 2, age: 60, ef_pct: 60, bypass_time_min: 60, cross_clamp_min: 30 });
  assert(low.level === 'low', 'Low complication risk');
  const high = engine.postOpComplicationRisk({ sts_score: 12, age: 80, ef_pct: 25, bypass_time_min: 240, cross_clamp_min: 180 });
  assert(high.level === 'high', 'High complication risk');
});

suite('Discharge Readiness', () => {
  const ready = engine.dischargeReadiness({ afebrile_24h: true, ambulating: true, pain_controlled: true, no_inotropes: true, eating: true, echo_improved: true });
  assert(ready.ready === true, 'Discharge ready');
  const partial = engine.dischargeReadiness({ afebrile_24h: true, ambulating: false, pain_controlled: true, no_inotropes: true, eating: false, echo_improved: true });
  assert(partial.ready === false, 'Discharge not ready');
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
