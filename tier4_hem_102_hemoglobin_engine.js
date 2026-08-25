'use strict';
// TIER4_HEM-102 Hemoglobinopathies
const CITATIONS = [
  { id: 'ASH-SickleCell-2024', source: 'ASH Sickle Cell Disease', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function sickleCellPain(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const nrs = ensureNumber(input, 'pain_nrs_0_10', 0, 10);
  const prior_sud = input.prior_sud === true;
  const therapy = (nrs >= 7 && prior_sud) ? 'iv_opioid_then_iv_fluids_then_pca_then_review' :
    (nrs >= 7) ? 'iv_opioid_then_iv_fluids_then_review' :
    (nrs >= 4) ? 'oral_or_iv_opioid_then_fluids_then_review' :
    'oral_nsaid_or_paracetamol_then_review';
  return {
    module: 'tier4_hem_102_sc',
    patient_id: patientId,
    pain_nrs_0_10: nrs,
    prior_sud,
    therapy,
    monitoring: 'q1h_until_below_4_then_q4h',
    citations: CITATIONS
  };
}
function thalassemia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const dx = ensureEnum(input, 'dx', ['alpha_thal_minor', 'alpha_thal_major', 'beta_thal_minor', 'beta_thal_intermedia', 'beta_thal_major', 'hb_e', 'hb_s_beta', 'other', 'unclear']);
  const ferritin = ensureNumber(input, 'ferritin_ng_ml', 0, 100000);
  const pre_tx_hgb = ensureNumber(input, 'pre_tx_hgb_g_dl', 0, 20);
  const therapy = (dx === 'beta_thal_major' && pre_tx_hgb < 9) ? 'regular_packed_rbc_transfusion_then_chelation_review' :
    (dx === 'beta_thal_intermedia' && ferritin > 1000) ? 'transfusion_indication_then_chelation_review' :
    (dx === 'beta_thal_minor' || dx === 'alpha_thal_minor') ? 'genetic_counseling_then_observation_q1y' :
    (dx === 'alpha_thal_major') ? 'transfusion_then_review_then_transplant_if_needed' :
    'observe_then_review';
  return {
    module: 'tier4_hem_102_thal',
    patient_id: patientId,
    diagnosis: dx,
    ferritin,
    pre_tx_hgb_g_dl: pre_tx_hgb,
    therapy,
    monitoring: (dx === 'beta_thal_major') ? 'q2wk_pre_tx_labs_q3mo_ferritin' : 'q1mo_review_q3mo_ferritin',
    citations: CITATIONS
  };
}
module.exports = {
  sickleCellPain,
  thalassemia,
  CITATIONS,
  ValidationError
};