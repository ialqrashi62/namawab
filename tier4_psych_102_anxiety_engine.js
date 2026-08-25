'use strict';
// TIER4_PSYCH-102 Anxiety Disorders
const CITATIONS = [
  { id: 'APA-Anxiety-2024', source: 'APA Anxiety Guidelines', year: 2024 }
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
function gad(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const gad7 = ensureNumber(input, 'gad7_score', 0, 21);
  const severity = (gad7 < 5) ? 'minimal' : (gad7 < 10) ? 'mild' : (gad7 < 15) ? 'moderate' : 'severe';
  const therapy = (severity === 'severe') ? 'ssri_or_snri_plus_cbt' :
    (severity === 'moderate') ? 'ssri_or_snri_or_cbt' :
    (severity === 'mild') ? 'cbt_or_watchful_waiting' : 'no_therapy_q1mo_recheck';
  return {
    module: 'tier4_psych_102_gad',
    patient_id: patientId,
    gad7,
    severity,
    therapy,
    monitoring: 'q2wk_until_response_then_q1mo',
    citations: CITATIONS
  };
}
function panic(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const frequency = ensureNumber(input, 'panic_attacks_per_month', 0, 200);
  const agoraphobia = input.agoraphobia === true;
  const therapy = (frequency >= 4 || agoraphobia) ? 'ssri_high_dose_plus_cbt_with_exposure' :
    'cbt_with_exposure_then_review';
  return {
    module: 'tier4_psych_102_panic',
    patient_id: patientId,
    panic_attacks_per_month: frequency,
    agoraphobia,
    therapy,
    monitoring: 'q1wk_x4wk_then_q2wk_then_q1mo',
    citations: CITATIONS
  };
}
module.exports = {
  gad,
  panic,
  CITATIONS,
  ValidationError
};