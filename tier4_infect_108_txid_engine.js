'use strict';
// TIER4_INFECT-108 Transplant Infectious Disease
const CITATIONS = [
  { id: 'AST-IDCOP-2024', source: 'AST IDCOP Guidelines', year: 2024 }
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
function prophylaxis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tx_type = ensureEnum(input, 'transplant', ['kidney', 'liver', 'heart', 'lung', 'pancreas', 'small_bowel', 'hsc', 'mixed']);
  const donor = ensureEnum(input, 'donor_serostatus', ['cmv_pos', 'cmv_neg', 'ebv_pos', 'ebv_neg', 'unknown']);
  const week_post = ensureNumber(input, 'weeks_post_transplant', 0, 200);
  const therapy = (tx_type === 'lung' || tx_type === 'small_bowel') ? 'tmp_smx_then_valganciclovir_then_fluconazole_antifungal' :
    (donor === 'cmv_pos' && week_post < 26) ? 'valganciclovir_prophylaxis_6mo_with_pcr_monitoring' :
    'tmp_smx_pjp_prophylaxis_x12mo';
  return {
    module: 'tier4_infect_108_proph',
    patient_id: patientId,
    transplant: tx_type,
    donor_serostatus: donor,
    weeks_post_transplant: week_post,
    therapy,
    monitoring: 'q2wk_cmv_pcr_q1wk_blood_q3mo_review',
    citations: CITATIONS
  };
}
function opportunisticInfection(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const oi = ensureEnum(input, 'oi_type', ['cmv', 'ebv_ptld', 'bk_virus', 'pjp', 'candida', 'aspergillus', 'nocardia', 'other']);
  const immunosuppression = ensureEnum(input, 'immunosuppression', ['low', 'moderate', 'high']);
  const therapy = (oi === 'cmv') ? 'iv_ganciclovir_or_valganciclovir_then_review_viral_load' :
    (oi === 'pjp') ? 'iv_or_oral_tmp_smx_then_review_with_adjunctive_steroids' :
    (oi === 'aspergillus') ? 'iv_voriconazole_or_isavuconazole_then_review_galactomannan' :
    (oi === 'nocardia') ? 'iv_imipenem_or_amikacin_plus_tmp_smx_then_review' :
    'specific_review_by_syndromic_pattern';
  return {
    module: 'tier4_infect_108_oi',
    patient_id: patientId,
    oi_type: oi,
    immunosuppression,
    therapy,
    monitoring: 'q3_to_7d_pcr_q1wk_labs_q2wk_imaging',
    citations: CITATIONS
  };
}
module.exports = {
  prophylaxis,
  opportunisticInfection,
  CITATIONS,
  ValidationError
};