'use strict';
// TIER4_REPRO-104 Preconception Care
const CITATIONS = ['ACOG_Preconception','USPSTF_Preconception'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function preconceptionScreen(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const rubella_immune = !!input.rubella_immune;
  const varicella_immune = !!input.varicella_immune;
  const hepatitis_b_immune = !!input.hepatitis_b_immune;
  const folic_acid_taken = !!input.folic_acid_taken;
  const chronic_conditions = !!input.chronic_conditions;
  const recommended = [];
  if (!rubella_immune) recommended.push('mmr_vaccine_preconception_avoid_conception_4_weeks');
  if (!varicella_immune) recommended.push('varicella_vaccine_if_non_pregnant');
  if (!hepatitis_b_immune) recommended.push('screen_hepatitis_b');
  if (!folic_acid_taken) recommended.push('folic_acid_400_to_800mcg_start_at_least_1_month_before');
  if (chronic_conditions) recommended.push('optimize_chronic_conditions_diabetes_hypertension_thyroid');
  recommended.push('screen_genetic_carrier_status');
  return { rubella_immune, varicella_immune, hepatitis_b_immune, folic_acid_taken, chronic_conditions, recommended, citations: CITATIONS };
}

function preconceptionCounsel(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const patient_bmi = ensureNumber(input.bmi, 'bmi');
  const smoker = !!input.smoker;
  const alcohol = !!input.alcohol;
  const partner_health = !!input.partner_health;
  const recommendations = ['timing_intercourse_ovulation_window','reduce_stress'];
  if (patient_bmi >= 30) recommendations.push('weight_loss_5_to_10_percent_preconception');
  if (patient_bmi < 18.5) recommendations.push('weight_gain_for_ovulation_regularity');
  if (smoker) recommendations.push('smoking_cessation');
  if (alcohol) recommendations.push('stop_alcohol');
  if (!partner_health) recommendations.push('partner_evaluation_smoking_diet');
  return { patient_bmi, smoker, alcohol, partner_health, recommendations, citations: CITATIONS };
}

module.exports = { preconceptionScreen, preconceptionCounsel, CITATIONS, ValidationError };