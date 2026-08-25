// filepath: tier5_imaging_ext_106_mammo_engine.js
// TIER5_IMAGING_EXT-106: Mammography (BI-RADS, screening, DBT, US adjunct, MRI adjunct, biopsy)
'use strict';

const CITATIONS = [
  'BI_RADS_5th_Edition_ACR_2013',
  'ACR_Appropriateness_Mammo_2023',
  'NCCN_Breast_Screening_2024',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function birads(req) {
  ensureNumber(req.birads_category, 'birads_category');
  ensureStr(req.density, 'density');
  ensureEnum(req.density, 'density', ['almost_entirely_fat','scattered_fibroglandular','heterogeneously_dense','extremely_dense']);
  ensureBool(req.mass_seen, 'mass_seen');
  ensureBool(req.calcifications_suspicious, 'calcifications_suspicious');
  ensureBool(req.asymmetry_present, 'asymmetry_present');

  let impression;
  if (req.birads_category === 0) impression = 'incomplete_then_continue_with_additional_imaging';
  else if (req.birads_category === 1 || req.birads_category === 2) impression = 'continue_with_routine_screening';
  else if (req.birads_category === 3) impression = 'continue_with_short_interval_follow_up';
  else if (req.birads_category === 4 || req.birads_category === 5) impression = 'continue_with_tissue_diagnosis';
  else if (req.birads_category === 6) impression = 'continue_with_known_cancer_treatment';
  else impression = 'continue_with_review';
  return { impression };
}

function screening(req) {
  ensureNumber(req.age, 'age');
  ensureStr(req.family_history, 'family_history');
  ensureEnum(req.family_history, 'family_history', ['none','first_degree_relative','second_degree_relative','brca_known_carrier','previous_chest_radiation']);
  ensureNumber(req.prior_screening_count, 'prior_screening_count');
  ensureBool(req.breastfed_at_least_6_months, 'breastfed_at_least_6_months');
  ensureBool(req.dense_breast_documented, 'dense_breast_documented');

  let advice;
  if (req.family_history === 'brca_known_carrier') advice = 'continue_with_annual_mri_alongside_mammography';
  else if (req.family_history === 'first_degree_relative' && req.age >= 40) advice = 'continue_with_annual_mammography_then_consider_us_adjunct';
  else if (req.age >= 50) advice = 'continue_with_biennial_mammography';
  else if (req.age >= 40 && req.dense_breast_documented) advice = 'continue_with_annual_screening_with_us_or_mri';
  else advice = 'continue_with_standard_screening';
  return { advice };
}

function dbt(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.dense_breast, 'dense_breast');
  ensureBool(req.prior_recall, 'prior_recall');
  ensureBool(req.mass_suspicious_for_malignancy, 'mass_suspicious_for_malignancy');
  ensureNumber(req.dose_in_mgy, 'dose_in_mgy');

  let impression;
  if (req.prior_recall === false && req.dose_in_mgy > 3) impression = 'continue_with_review_then_consider_lower_dose';
  else if (req.mass_suspicious_for_malignancy && req.dense_breast) impression = 'continue_with_dbt_then_us_adjunct';
  else if (req.dense_breast) impression = 'continue_with_dbt_improved_detection';
  else impression = 'continue_with_standard_protocol';
  return { impression };
}

function us_adjunct(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.dense_breast, 'dense_breast');
  ensureStr(req.mammo_finding, 'mammo_finding');
  ensureEnum(req.mammo_finding, 'mammo_finding', ['mass','asymmetry','calcifications','negative_with_palpable_lump','negative_with_high_risk','routine']);
  ensureBool(req.mass_visible_on_us, 'mass_visible_on_us');

  let impression;
  if (req.mammo_finding === 'mass' && req.mass_visible_on_us === false) impression = 'continue_with_mri_review';
  else if (req.mammo_finding === 'negative_with_palpable_lump') impression = 'continue_with_us_then_consider_biopsy';
  else if (req.mammo_finding === 'mass' && req.mass_visible_on_us) impression = 'continue_with_targeted_us_then_biopsy_review';
  else if (req.dense_breast && req.mammo_finding === 'routine') impression = 'continue_with_us_screening';
  else impression = 'continue_with_imaging_review';
  return { impression };
}

function mri_adjunct(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.brca_carrier, 'brca_carrier');
  ensureBool(req.ipsilateral_malignancy_known, 'ipsilateral_malignancy_known');
  ensureBool(req.bilateral_cancer_history, 'bilateral_cancer_history');
  ensureBool(req.chemotherapy_response_evaluation, 'chemotherapy_response_evaluation');
  ensureBool(req.renal_function_egfr_acceptable, 'renal_function_egfr_acceptable');

  let impression;
  if (req.brca_carrier || req.bilateral_cancer_history) impression = 'continue_with_screening_mri';
  else if (req.ipsilateral_malignancy_known) impression = 'continue_with_preoperative_mri_review';
  else if (req.chemotherapy_response_evaluation) impression = 'continue_with_response_mri';
  else if (req.renal_function_egfr_acceptable === false) impression = 'consider_alternative_then_continue_review';
  else impression = 'continue_with_imaging_review';
  return { impression };
}

function mammo_biopsy(req) {
  ensureStr(req.method, 'method');
  ensureEnum(req.method, 'method', ['stereotactic','ultrasound_guided','mri_guided','tomosynthesis_guided','freehand_palpable']);
  ensureBool(req.clip_placed, 'clip_placed');
  ensureNumber(req.samples_count, 'samples_count');
  ensureBool(req.adequate_tissue_on_sample, 'adequate_tissue_on_sample');

  let impression;
  if (req.samples_count < 4) impression = 'continue_with_more_samples_then_pathology_review';
  else if (req.adequate_tissue_on_sample === false) impression = 'continue_with_review_then_consider_repeat';
  else if (!req.clip_placed) impression = 'continue_with_imaging_review_then_place_clip';
  else impression = 'continue_with_pathology_review';
  return { impression };
}

function funcs() { return { birads, screening, dbt, us_adjunct, mri_adjunct, mammo_biopsy }; }
module.exports = { funcs, CITATIONS, ValidationError };
