/**
 * Robotic CV Surgery — Engine
 * Pure functions for cardiac surgery risk scoring.
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

const CITATIONS = {
  STS_2024: 'STS 2024 Cardiac Surgery',
  ESC_2023: 'ESC 2023 Valve Disease',
  AHA_2024: 'AHA/ACC 2024 Valve Management',
};

/**
 * STS Risk Score
 */
function stsScore(input) {
  const { age, ef_pct, creatinine, dialysis, emergency, prior_cardiac_surgery, female, diabetes, hypertension, copd } = input;
  let score = 0;
  score += age * 0.1;
  if (ef_pct < 30) score += 4;
  if (creatinine > 2.0) score += 3;
  if (dialysis) score += 5;
  if (emergency) score += 4;
  if (prior_cardiac_surgery) score += 3;
  if (female) score += 0.5;
  if (diabetes) score += 1;
  if (hypertension) score += 0.5;
  if (copd) score += 1.5;
  const risk = score < 4 ? 'low' : (score < 8 ? 'moderate' : (score < 12 ? 'high' : 'very_high'));
  return { score: Math.round(score * 10) / 10, risk, recommendation: score > 8 ? 'Consider TAVI or transcatheter' : 'Robotic/open acceptable', citation: CITATIONS.STS_2024 };
}

/**
 * EuroSCORE II
 */
function euroscoreII(input) {
  const { age, gender, nyha, ef_pct, recent_mi, pulmonary_htn, creatinine, dialysis, diabetes, critical_state } = input;
  let score = 0;
  score += (age - 60) * 0.05;
  if (gender === 'female') score += 0.5;
  if (nyha >= 3) score += 0.5;
  if (ef_pct < 30) score += 1;
  if (recent_mi) score += 0.5;
  if (pulmonary_htn) score += 1;
  if (creatinine > 2.0) score += 0.5;
  if (dialysis) score += 1.5;
  if (diabetes) score += 0.3;
  if (critical_state) score += 2;
  const risk = score < 4 ? 'low' : (score < 8 ? 'moderate' : (score < 15 ? 'high' : 'very_high'));
  return { score: Math.round(score * 10) / 10, risk, citation: CITATIONS.ESC_2023 };
}

/**
 * TAVI Eligibility
 */
function taviEligibility(input) {
  const { age, sts_score, annulus_size_mm, ef_pct, frailty, life_expectancy_years } = input;
  const eligible = age >= 65 && (sts_score >= 4 || age >= 80) && annulus_size_mm >= 18 && annulus_size_mm <= 30 && ef_pct >= 20 && life_expectancy_years >= 1;
  let device = 'Sapien 3';
  if (annulus_size_mm >= 26) device = 'Evolut';
  return { eligible, device, recommendation: eligible ? 'Proceed with Heart Team' : 'Open surgery or medical management', citation: CITATIONS.AHA_2024 };
}

/**
 * MitraClip Eligibility
 */
function mitraclipEligibility(input) {
  const { mr_grade, ef_pct, nyha, sts_score, symptoms_on_gdmt } = input;
  const eligible = mr_grade >= 3 && ef_pct >= 30 && ef_pct <= 60 && sts_score >= 8 && nyha >= 2 && symptoms_on_gdmt;
  return { eligible, recommendation: eligible ? 'COAPT criteria met' : 'Re-evaluate in 3-6 months', citation: CITATIONS.AHA_2024 };
}

/**
 * WATCHMAN Eligibility
 */
function watchmanEligibility(input) {
  const { cha2ds2vasc, has_bled, contraindication_to_anticoag, laa_ostium_mm } = input;
  const eligible = cha2ds2vasc >= 2 && has_bled >= 3 && contraindication_to_anticoag && laa_ostium_mm >= 17 && laa_ostium_mm <= 31;
  return { eligible, device: 'WATCHMAN FLX', citation: CITATIONS.AHA_2024 };
}

/**
 * Robotic Surgery Eligibility
 */
function roboticSurgeryEligibility(input) {
  const { age, ef_pct, prior_cardiac_surgery, obesity_bmi, pulmonary_function } = input;
  const eligible = age < 80 && ef_pct >= 30 && !prior_cardiac_surgery && obesity_bmi < 40 && pulmonary_function !== 'severe_impairment';
  return { eligible, recommendation: eligible ? 'Robotic suitable' : 'Consider open or catheter-based', citation: CITATIONS.STS_2024 };
}

/**
 * Pre-Op Checklist
 */
function preOpChecklist(input) {
  const items = {
    echo_within_30_days: input.echo_within_30_days || false,
    coronary_anatomy_known: input.coronary_anatomy_known || false,
    pulmonary_function_tests: input.pulmonary_function_tests || false,
    renal_function_clearance: input.renal_function_clearance || false,
    frailty_assessment: input.frailty_assessment || false,
    coagulation_profile: input.coagulation_profile || false,
    blood_typing_crossmatch: input.blood_typing_crossmatch || false,
    pdpl_consent: input.pdpl_consent || false,
    anesthesia_consult: input.anesthesia_consult || false,
    perfusionist_consult: input.perfusionist_consult || false,
  };
  const completed = Object.values(items).filter(Boolean).length;
  const ready = completed === 10;
  return { items, completed, ready, recommendation: ready ? 'Proceed to surgery' : `Missing ${10 - completed} items`, citation: CITATIONS.STS_2024 };
}

/**
 * Conversion to Open Risk
 */
function conversionToOpenRisk(input) {
  const { obesity_bmi, prior_cardiac_surgery, anatomy_complexity } = input;
  let risk = 'low';
  if (obesity_bmi > 35 || prior_cardiac_surgery) risk = 'moderate';
  if (anatomy_complexity === 'high' || obesity_bmi > 40) risk = 'high';
  return { risk, recommendation: risk === 'high' ? 'Have sternotomy set ready' : 'Standard prep', citation: CITATIONS.STS_2024 };
}

/**
 * Post-Op Complication Risk
 */
function postOpComplicationRisk(input) {
  const { sts_score, age, ef_pct, bypass_time_min, cross_clamp_min } = input;
  let risk = 0;
  risk += sts_score * 2;
  if (age > 75) risk += 5;
  if (ef_pct < 30) risk += 5;
  if (bypass_time_min > 180) risk += 5;
  if (cross_clamp_min > 120) risk += 5;
  const level = risk < 10 ? 'low' : (risk < 20 ? 'moderate' : 'high');
  return { risk: Math.round(risk * 10) / 10, level, citation: CITATIONS.STS_2024 };
}

/**
 * Discharge Readiness
 */
function dischargeReadiness(input) {
  const { afebrile_24h, ambulating, pain_controlled, no_inotropes, eating, echo_improved } = input;
  const items = { afebrile_24h, ambulating, pain_controlled, no_inotropes, eating, echo_improved };
  const completed = Object.values(items).filter(Boolean).length;
  return { items, completed, ready: completed === 6, citation: CITATIONS.STS_2024 };
}

module.exports = {
  stsScore,
  euroscoreII,
  taviEligibility,
  mitraclipEligibility,
  watchmanEligibility,
  roboticSurgeryEligibility,
  preOpChecklist,
  conversionToOpenRisk,
  postOpComplicationRisk,
  dischargeReadiness,
  CITATIONS,
  ValidationError,
};
