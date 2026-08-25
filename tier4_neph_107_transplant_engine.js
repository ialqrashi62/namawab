'use strict';
// TIER4_NEPH-107 Kidney Transplantation
const CITATIONS = [
  { id: 'KDIGO-TX-2024', source: 'KDIGO Transplant Guideline', year: 2024 }
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
function transplantEvaluation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const egfr = ensureNumber(input, 'egfr', 0, 200);
  const age = ensureNumber(input, 'age', 0, 100);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const cv_risk = ensureEnum(input, 'cv_risk', ['low', 'intermediate', 'high']);
  const malignancy = input.active_malignancy === true;
  const eligible = (egfr < 20 && age < 75 && bmi < 40 && cv_risk !== 'high' && !malignancy);
  return {
    module: 'tier4_neph_107_eligibility',
    patient_id: patientId,
    egfr,
    age,
    bmi,
    cv_risk,
    active_malignancy: malignancy,
    eligible_for_listing: eligible,
    workup: eligible ? 'cardiology_infectious_disease_psych_immunology_workup' : 'address_contraindications_then_reassess',
    monitoring: 'q3mo_review_pre_listing',
    citations: CITATIONS
  };
}
function rejectionRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const donor_type = ensureEnum(input, 'donor_type', ['living_related', 'living_unrelated', 'ddbt', 'dcd', 'high_kdpi']);
  const pra = ensureNumber(input, 'pra_pct', 0, 100);
  const dsa = input.dsa_positive === true;
  const hla_mm = ensureNumber(input, 'hla_mismatch', 0, 6);
  const imm_adequate = input.tacrolimus_level_adequate === true;
  const risk = (dsa || pra >= 50 || !imm_adequate) ? 'high_risk_rejection' :
    (hla_mm >= 4 || donor_type === 'high_kdpi') ? 'moderate_risk' : 'low_risk';
  return {
    module: 'tier4_neph_107_rejection',
    patient_id: patientId,
    donor_type,
    pra_pct: pra,
    dsa_positive: dsa,
    hla_mismatch: hla_mm,
    tacrolimus_adequate: imm_adequate,
    risk,
    therapy: (risk === 'high_risk_rejection') ? 'protocol_biopsy_consider_r_anti_thymocyte_then_review_imm' :
      (risk === 'moderate_risk') ? 'surveillance_biopsy_or_donor_derived_dna_then_review' :
      'standard_immunosuppression_review',
    monitoring: 'q1_to_3mo_labs_q6mo_protocol_biopsy_per_protocol',
    citations: CITATIONS
  };
}
module.exports = {
  transplantEvaluation,
  rejectionRisk,
  CITATIONS,
  ValidationError
};