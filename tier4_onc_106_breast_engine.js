'use strict';
// TIER4_ONC-106 Breast Cancer
const CITATIONS = [
  { id: 'NCCN-Breast-2024', source: 'NCCN Breast Cancer Guidelines', year: 2024 }
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
function breastCancerSubtype(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const er = ensureEnum(input, 'er', ['positive', 'negative']);
  const pr = ensureEnum(input, 'pr', ['positive', 'negative']);
  const her2 = ensureEnum(input, 'her2', ['positive', 'negative', 'low', 'pending']);
  const ki67 = ensureNumber(input, 'ki67_pct', 0, 100);
  const subtype = (her2 === 'positive') ? 'her2_positive' :
    (er === 'positive' || pr === 'positive') ? 'hr_positive_her2_negative' :
    'triple_negative';
  const therapy = (subtype === 'her2_positive') ? 'tcbhp_or_tchp_neoadjuvant_then_trastuzumab_emtansine_if_residual' :
    (subtype === 'hr_positive_her2_negative') ? 'endocrine_therapy_cdk46_inhibitor_high_risk' :
    'chemo_then_pembrolizumab_if_pd_l1_plus';
  return {
    module: 'tier4_onc_106_subtype',
    patient_id: patientId,
    er,
    pr,
    her2,
    ki67_pct: ki67,
    subtype,
    therapy,
    monitoring: 'q3mo_imaging_q3mo_tumor_markers_q1y_bone_density_ai',
    citations: CITATIONS
  };
}
function geneticRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const brca = ensureEnum(input, 'brca_status', ['brca1_pathogenic', 'brca2_pathogenic', 'brca1_vus', 'brca2_vus', 'negative', 'not_tested']);
  const family = input.first_degree_relative === true;
  const age_dx = ensureNumber(input, 'age_at_diagnosis', 0, 100);
  const high_risk = (brca === 'brca1_pathogenic' || brca === 'brca2_pathogenic') || (family && age_dx < 50);
  const plan = (high_risk && brca === 'brca1_pathogenic') ? 'rrm_oophorectomy_review' :
    (high_risk) ? 'rrm_with_reconstruction_review_oophorectomy_brca2' :
    'standard_surveillance_mammo_mri';
  return {
    module: 'tier4_onc_106_genetic',
    patient_id: patientId,
    brca_status: brca,
    first_degree_relative: family,
    age_at_diagnosis: age_dx,
    high_risk,
    plan,
    monitoring: 'q6mo_breast_mri_q1y_mammo_q1y_pelvis_imaging_brca',
    citations: CITATIONS
  };
}
module.exports = {
  breastCancerSubtype,
  geneticRisk,
  CITATIONS,
  ValidationError
};