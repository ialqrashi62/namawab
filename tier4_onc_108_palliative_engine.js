'use strict';
// TIER4_ONC-108 Palliative & Supportive Oncology
const CITATIONS = [
  { id: 'NCCN-Palliative-2024', source: 'NCCN Palliative Care', year: 2024 }
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
function cancerPain(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const nrs = ensureNumber(input, 'pain_score_0_10', 0, 10);
  const etiology = ensureEnum(input, 'etiology', ['nociceptive_somatic', 'nociceptive_visceral', 'neuropathic', 'mixed', 'incident', 'unknown']);
  const prior_opioid = input.prior_opioid === true;
  const therapy = (nrs >= 7) ? 'strong_opioid_morphine_or_oxycodone_with_laxative' :
    (nrs >= 4) ? 'weak_opioid_tramadol_or_codeine_then_review' :
    (etiology === 'neuropathic') ? 'gabapentin_or_duloxetine_then_review' :
    'paracetamol_or_nsaid_step1';
  return {
    module: 'tier4_onc_108_pain',
    patient_id: patientId,
    pain_score_0_10: nrs,
    etiology,
    prior_opioid,
    therapy,
    monitoring: 'q24h_review_pain_then_q1wk_until_stable',
    citations: CITATIONS
  };
}
function cachexia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const weight_loss_pct_6mo = ensureNumber(input, 'weight_loss_pct_6mo', 0, 100);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const appetite = ensureEnum(input, 'appetite', ['normal', 'reduced', 'severe_loss']);
  const inflammation = ensureEnum(input, 'inflammation', ['low', 'moderate', 'high']);
  const severe = (weight_loss_pct_6mo >= 10 || bmi < 20) || (appetite === 'severe_loss' && inflammation === 'high');
  const therapy = (severe) ? 'nutritional_counseling_high_protein_omega3_then_consider_megestrol_or_mirtazapine' :
    'nutritional_counseling_supplements_q1mo_review';
  return {
    module: 'tier4_onc_108_cachexia',
    patient_id: patientId,
    weight_loss_pct_6mo,
    bmi,
    appetite,
    inflammation,
    severe,
    therapy,
    monitoring: 'q1mo_weights_q3mo_labs',
    citations: CITATIONS
  };
}
function hospiceEligibility(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ecog = ensureNumber(input, 'ecog_performance_status', 0, 4);
  const prognosis = ensureEnum(input, 'prognosis', ['lt_6mo', 'lt_3mo', 'lt_1mo', 'uncertain', 'greater_than_6mo']);
  const goals = ensureEnum(input, 'goals_of_care', ['curative', 'life_prolonging', 'palliative_comfort', 'hospice', 'unknown']);
  const eligible = (prognosis !== 'greater_than_6mo' && goals === 'hospice') || (ecog >= 3 && prognosis === 'lt_3mo');
  const plan = (eligible) ? 'refer_hospice_discuss_goals_family_meeting' :
    (goals === 'palliative_comfort') ? 'palliative_care_refer_continue_disease_treatment' :
    'continue_curative_or_life_prolonging';
  return {
    module: 'tier4_onc_108_hospice',
    patient_id: patientId,
    ecog_performance_status: ecog,
    prognosis,
    goals_of_care: goals,
    eligible,
    plan,
    citations: CITATIONS
  };
}
module.exports = {
  cancerPain,
  cachexia,
  hospiceEligibility,
  CITATIONS,
  ValidationError
};