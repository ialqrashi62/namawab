'use strict';
// TIER4_PULM-102 COPD
const CITATIONS = [
  { id: 'GOLD-2024', source: 'Global Initiative for Chronic Obstructive Lung Disease', year: 2024 }
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
function goldClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const fev1 = ensureNumber(input, 'fev1_pct', 0, 200);
  const mmrc = ensureNumber(input, 'mmrc_dyspnea', 0, 4);
  const cat = ensureNumber(input, 'cat_score', 0, 40);
  const exacerbations = ensureNumber(input, 'exacerbations_12mo', 0, 100);
  const hosp = input.hospitalized_12mo === true;
  const grade = (fev1 < 30) ? 'gold_4' : (fev1 < 50) ? 'gold_3' : (fev1 < 80) ? 'gold_2' : 'gold_1';
  const abe = (exacerbations >= 2 || hosp) ? 'e' : 'a';
  const symptoms = (mmrc >= 2 || cat >= 10) ? 'high' : 'low';
  const group = `${grade}_${abe}_${symptoms}`;
  const therapy = (group === 'gold_3_e_high' || group === 'gold_4_e_high') ? 'laba_lama_consider_ics_q3mo_review' :
    (group.endsWith('_high')) ? 'laba_lama_combination' :
    (group.endsWith('_e_low')) ? 'laba_or_lama_monotherapy' :
    'short_acting_bronchodilator_then_review';
  return {
    module: 'tier4_pulm_102_gold',
    patient_id: patientId,
    fev1_pct: fev1,
    mmrc,
    cat_score: cat,
    exacerbations_12mo: exacerbations,
    hospitalized_12mo: hosp,
    grade,
    risk_group: abe,
    symptom_group: symptoms,
    classification: group,
    therapy,
    monitoring: 'q3mo_cat_q6mo_pfts_q1y_ct_copd_review',
    citations: CITATIONS
  };
}
function copdExacerbation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe']);
  const copd_related = input.copd_related === true;
  const therapy = (severity === 'severe' && copd_related) ? 'iv_steroids_then_iv_antibiotics_then_bronchodilators_then_review' :
    (severity === 'moderate' && copd_related) ? 'oral_steroids_then_antibiotics_then_bronchodilators' :
    (severity === 'mild' && copd_related) ? 'short_acting_bronchodilators_then_review' :
    'review_other_cause';
  return {
    module: 'tier4_pulm_102_exac',
    patient_id: patientId,
    severity,
    copd_related,
    therapy,
    monitoring: 'q24h_review_then_q1mo_followup',
    citations: CITATIONS
  };
}
module.exports = {
  goldClassification,
  copdExacerbation,
  CITATIONS,
  ValidationError
};