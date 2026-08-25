'use strict';
// TIER4_INT-104 Thyroid
const CITATIONS = ['ATA_Thyroid_2014','USPSTF_Thyroid'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function hypothyroidEvaluation(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const tsh = ensureNumber(input.tsh, 'tsh');
  const free_t4 = ensureNumber(input.free_t4 || 0, 'free_t4');
  const anti_tpo = !!input.anti_tpo;
  const symptoms = !!input.symptoms;
  let diagnosis = 'normal_thyroid';
  let treatment = 'no_treatment';
  if (tsh > 10 && free_t4 < 0.8) { diagnosis = 'overt_hypothyroidism'; treatment = 'levothyroxine_start_1_6mcg_per_kg'; }
  else if (tsh > 10) { diagnosis = 'subclinical_hypothyroidism_severe'; treatment = 'consider_levothyroxine_if_symptoms_or_anti_tpo'; }
  else if (tsh >= 4.5 && (free_t4 < 0.8 || (anti_tpo && symptoms))) { diagnosis = 'subclinical_hypothyroidism_mild'; treatment = 'recheck_3_months_consider_treatment'; }
  return { tsh, free_t4, anti_tpo, symptoms, diagnosis, treatment, citations: CITATIONS };
}

function hyperthyroidEvaluation(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const tsh = ensureNumber(input.tsh, 'tsh');
  const free_t4 = ensureNumber(input.free_t4, 'free_t4');
  const free_t3 = ensureNumber(input.free_t3 || 0, 'free_t3');
  const graves_risk_factors = !!input.graves_risk_factors;
  let diagnosis = 'normal_thyroid';
  let treatment = 'no_treatment';
  if (tsh < 0.1 && (free_t4 > 1.8 || free_t3 > 4.4)) {
    diagnosis = 'overt_hyperthyroidism';
    treatment = graves_risk_factors ? 'methimazole_propranolol_refer_endocrinology' : 'thyroiditis_vs_graves_workup_refer';
  } else if (tsh < 0.4) {
    diagnosis = 'subclinical_hyperthyroidism';
    treatment = 'recheck_3_months_treat_if_atrial_fibrillation_or_age_65';
  }
  return { tsh, free_t4, free_t3, graves_risk_factors, diagnosis, treatment, citations: CITATIONS };
}

module.exports = { hypothyroidEvaluation, hyperthyroidEvaluation, CITATIONS, ValidationError };