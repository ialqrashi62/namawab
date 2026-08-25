'use strict';
// TIER4_PALL-105 Psychosocial / Grief & Bereavement
const CITATIONS = [
  { id: 'NCCN-Palliative-2024', source: 'NCCN Grief and Bereavement', year: 2024 }
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
function griefAssessment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const phase = ensureEnum(input, 'phase', ['anticipatory', 'acute', 'integrated']);
  const symptom_severity = ensureEnum(input, 'symptom_severity', ['mild', 'moderate', 'severe_prolonged_grief_disorder', 'complicated_p_tsd']);
  const social_support = ensureEnum(input, 'social_support', ['strong', 'moderate', 'weak', 'isolated']);
  const therapy = (symptom_severity === 'complicated_p_tsd' || symptom_severity === 'severe_prolonged_grief_disorder') ? 'specialist_bereavement_counseling_then_review_medication_if_p_tsd' :
    (symptom_severity === 'moderate' && social_support === 'weak') ? 'social_work_refer_then_bereavement_counseling' :
    (symptom_severity === 'moderate') ? 'bereavement_counseling_then_review' :
    'supportive_normalize_grief_then_recheck';
  return {
    module: 'tier4_pall_105_grief',
    patient_id: patientId,
    phase,
    symptom_severity,
    social_support,
    therapy,
    monitoring: 'q1wk_severe_then_q2wk_then_q1mo',
    citations: CITATIONS
  };
}
module.exports = {
  griefAssessment,
  CITATIONS,
  ValidationError
};