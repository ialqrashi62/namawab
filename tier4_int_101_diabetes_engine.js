'use strict';
// TIER4_INT-101 Diabetes
const CITATIONS = ['ADA_Standards_2024','USPSTF_Diabetes'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function diabetesScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const bmi = ensureNumber(input.bmi, 'bmi');
  const fasting_glucose = input.fasting_glucose ? ensureNumber(input.fasting_glucose, 'fasting_glucose') : null;
  const hba1c = input.hba1c ? ensureNumber(input.hba1c, 'hba1c') : null;
  const risk_factors = [];
  if (age >= 35) risk_factors.push('age_over_35');
  if (bmi >= 25) risk_factors.push('overweight_obese');
  let screening_indicated = (age >= 35 && bmi >= 25) || bmi >= 30;
  let diagnosis = 'not_diagnosed';
  if (hba1c !== null) {
    if (hba1c >= 6.5) diagnosis = 'diabetes_mellitus';
    else if (hba1c >= 5.7) diagnosis = 'prediabetes';
  }
  if (fasting_glucose !== null && diagnosis === 'not_diagnosed') {
    if (fasting_glucose >= 126) diagnosis = 'diabetes_mellitus';
    else if (fasting_glucose >= 100) diagnosis = 'prediabetes';
  }
  return { age, bmi, fasting_glucose, hba1c, screening_indicated, diagnosis, risk_factors, citations: CITATIONS };
}

function diabetesManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const hba1c = ensureNumber(input.hba1c, 'hba1c');
  const egfr = ensureNumber(input.egfr || 60, 'egfr');
  const heart_failure = !!input.heart_failure;
  const ascvd = !!input.ascvd;
  const ckd = !!input.ckd;
  let first_line = 'metformin_500mg_bid_with_meals_titrate_weekly';
  let add_ons = [];
  if (hba1c >= 9) {
    first_line = 'consider_dual_therapy_metformin_plus_glp1_or_basal_insulin';
  }
  if (heart_failure || ckd || ascvd) {
    add_ons.push('sglt2_inhibitor_empagliflozin_or_dapagliflozin_for_cardiorenal_protection');
    add_ons.push('glp1_agonist_if_atherosclerotic_or_obesity');
  }
  if (egfr < 30 && !add_ons.includes('sglt2_inhibitor')) add_ons.push('insulin_therapy_required_avoid_metformin_if_egfr_less_than_30');
  return { hba1c, egfr, heart_failure, ascvd, ckd, first_line, add_ons, citations: CITATIONS };
}

module.exports = { diabetesScreening, diabetesManagement, CITATIONS, ValidationError };