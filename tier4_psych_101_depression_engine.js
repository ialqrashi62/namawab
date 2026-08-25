'use strict';
// TIER4_PSYCH-101 Major Depressive Disorder
const CITATIONS = [
  { id: 'APA-MDD-2024', source: 'APA Practice Guideline MDD', year: 2024 }
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
function phq9Severity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const phq9 = ensureNumber(input, 'phq9_score', 0, 27);
  const suicidal_ideation = input.suicidal_ideation_q9 === true;
  const severity = (phq9 < 5) ? 'minimal' : (phq9 < 10) ? 'mild' : (phq9 < 15) ? 'moderate' : (phq9 < 20) ? 'moderately_severe' : 'severe';
  const therapy = (suicidal_ideation) ? 'urgent_safety_assessment_refer_crisis_or_emergency' :
    (severity === 'severe' || severity === 'moderately_severe') ? 'ssri_or_snri_plus_psychotherapy' :
    (severity === 'moderate') ? 'ssri_or_snri_or_psychotherapy_alone' :
    (severity === 'mild') ? 'psychotherapy_or_watchful_waiting' :
    'no_therapy_q1mo_recheck';
  return {
    module: 'tier4_psych_101_phq9',
    patient_id: patientId,
    phq9,
    suicidal_ideation_q9: suicidal_ideation,
    severity,
    therapy,
    monitoring: 'q2wk_until_response_then_q1mo_q3mo',
    citations: CITATIONS
  };
}
function treatmentResistantDepression(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const prior_trials = ensureNumber(input, 'adequate_prior_trials', 0, 10);
  const adherence = input.adherence_confirmed === true;
  const trd = (prior_trials >= 2 && adherence) ? 'trd' : 'not_trd_optimize_first';
  const therapy = (trd === 'trd') ? 'augment_lithium_or_atypical_or_ketamine_then_review' :
    'optimize_dose_switch_class';
  return {
    module: 'tier4_psych_101_trd',
    patient_id: patientId,
    adequate_prior_trials: prior_trials,
    adherence_confirmed: adherence,
    classification: trd,
    therapy,
    monitoring: 'q1wk_then_q2wk_until_stable',
    citations: CITATIONS
  };
}
module.exports = {
  phq9Severity,
  treatmentResistantDepression,
  CITATIONS,
  ValidationError
};