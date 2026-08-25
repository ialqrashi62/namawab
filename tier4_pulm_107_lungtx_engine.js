'use strict';
// TIER4_PULM-107 Lung Transplantation
const CITATIONS = [
  { id: 'ISHLT-2024', source: 'ISHLT Lung Transplant Consensus', year: 2024 }
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
function lungTxCandidate(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const indication = ensureEnum(input, 'indication', ['copd', 'ipf', 'cf', 'pah', 'scleroderma_ild', 'sarcoidosis_advanced', 'lymphangioleiomyomatosis', 'other']);
  const age = ensureNumber(input, 'age', 0, 100);
  const bmi = ensureNumber(input, 'bmi', 0, 60);
  const ecog = ensureNumber(input, 'ecog', 0, 4);
  const fvc_pct = ensureNumber(input, 'fvc_pct', 0, 200);
  const dlco = ensureNumber(input, 'dlco_pct', 0, 200);
  const eligible = (age < 70 && bmi < 35 && ecog <= 2 && (fvc_pct < 80 || dlco < 40));
  const referral = (eligible) ? 'refer_to_lung_transplant_program' : 'optimize_medical_then_revisit';
  return {
    module: 'tier4_pulm_107_candidate',
    patient_id: patientId,
    indication,
    age,
    bmi,
    ecog,
    fvc_pct,
    dlco_pct: dlco,
    eligible,
    referral,
    monitoring: 'q3mo_pfts_q6mo_imaging_q1y_transplant_eval_review',
    citations: CITATIONS
  };
}
function chronicLungAllograftDysfunction(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const fev1 = ensureNumber(input, 'current_fev1', 0, 100);
  const baseline_fev1 = ensureNumber(input, 'baseline_fev1', 0, 100);
  const phenotype = ensureEnum(input, 'phenotype', ['ras', 'bos', 'mixed', 'restrictive_other']);
  const drop_pct = ((baseline_fev1 - fev1) / baseline_fev1) * 100;
  const clad_present = (drop_pct >= 20);
  const therapy = (phenotype === 'bos') ? 'azithromycin_review_then_consider_fibrinolysis_or_retransplant' :
    (phenotype === 'ras') ? 'consider_anti_reflux_surgery_review_immunosuppression' :
    (phenotype === 'mixed') ? 'multi_modality_review_then_retransplant' :
    'review_for_obstruction_or_restriction_then_treat';
  return {
    module: 'tier4_pulm_107_clad',
    patient_id: patientId,
    current_fev1: fev1,
    baseline_fev1,
    fev1_drop_pct: drop_pct.toFixed(1),
    clad_present,
    phenotype,
    therapy,
    monitoring: 'q1mo_pfts_q3mo_ct_q3_6mo_bronch',
    citations: CITATIONS
  };
}
module.exports = {
  lungTxCandidate,
  chronicLungAllograftDysfunction,
  CITATIONS,
  ValidationError
};