'use strict';
// TIER4_PSYCH-105 Trauma & PTSD
const CITATIONS = [
  { id: 'VA-DoD-PTSD-2024', source: 'VA/DoD PTSD Clinical Practice Guideline', year: 2024 }
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
function ptsdSeverity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const pcl5 = ensureNumber(input, 'pcl5_score', 0, 80);
  const trauma_type = ensureEnum(input, 'trauma', ['combat', 'sexual_assault', 'physical_assault', 'motor_vehicle', 'disaster', 'medical', 'other', 'unknown']);
  const severity = (pcl5 < 33) ? 'below_threshold' : (pcl5 <= 49) ? 'mild_to_moderate' : 'severe';
  const therapy = (severity === 'severe') ? 'trauma_focused_cbt_or_emdr_then_ssri_snri' :
    (severity === 'mild_to_moderate') ? 'trauma_focused_cbt_or_emdr' :
    'watchful_waiting';
  return {
    module: 'tier4_psych_105_ptsd',
    patient_id: patientId,
    pcl5,
    trauma_type,
    severity,
    therapy,
    monitoring: 'q1wk_initial_then_q2wk_then_q1mo',
    citations: CITATIONS
  };
}
function complexTrauma(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const abuse_count = ensureNumber(input, 'distinct_trauma_count', 0, 100);
  const dissociative = input.dissociative_symptoms === true;
  const emotional_dysreg = input.emotional_dysregulation === true;
  const therapy = (dissociative && emotional_dysreg) ? 'phase_oriented_dbt_then_tf_cbt_then_emdr' :
    (abuse_count >= 5) ? 'phase_oriented_then_tf_cbt' :
    'tf_cbt_or_emdr_then_review';
  return {
    module: 'tier4_psych_105_complex',
    patient_id: patientId,
    distinct_trauma_count: abuse_count,
    dissociative_symptoms: dissociative,
    emotional_dysregulation: emotional_dysreg,
    therapy,
    monitoring: 'q1wk_then_q2wk_then_q1mo_until_phase_complete',
    citations: CITATIONS
  };
}
module.exports = {
  ptsdSeverity,
  complexTrauma,
  CITATIONS,
  ValidationError
};