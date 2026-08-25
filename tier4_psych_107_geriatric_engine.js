'use strict';
// TIER4_PSYCH-107 Geriatric Psychiatry
const CITATIONS = [
  { id: 'IPA-2024', source: 'International Psychogeriatric Association', year: 2024 }
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
function delirium(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cam = ensureEnum(input, 'cam_status', ['negative', 'positive']);
  const subtype = ensureEnum(input, 'subtype', ['hyperactive', 'hypoactive', 'mixed']);
  const cause = ensureEnum(input, 'etiology', ['infection', 'metabolic', 'medication', 'withdrawal', 'pain', 'post_op', 'unknown', 'other']);
  const therapy = (cam !== 'positive') ? 'no_therapy_continue_screening' :
    'identify_treat_cause_nonpharm_first_then_low_dose_haldol_or_quetiapine';
  return {
    module: 'tier4_psych_107_delirium',
    patient_id: patientId,
    cam_status: cam,
    subtype: (cam === 'positive' ? subtype : 'na'),
    etiology: cause,
    therapy,
    monitoring: 'q2h_cam_until_resolve',
    citations: CITATIONS
  };
}
function dementiaBehavioral(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const symptoms = ensureEnum(input, 'symptom', ['agitation', 'aggression', 'psychosis', 'depression', 'apathy', 'sleep_disturbance']);
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe']);
  const therapy = (severity === 'severe') ? 'nonpharm_first_then_quetiapine_or_risperidone_low_dose' :
    (severity === 'moderate') ? 'nonpharm_interventions_then_review' :
    'nonpharm_routine_reassurance';
  return {
    module: 'tier4_psych_107_bpsd',
    patient_id: patientId,
    symptom: symptoms,
    severity,
    therapy,
    monitoring: 'q1wk_review_q1mo_assessment',
    citations: CITATIONS
  };
}
module.exports = {
  delirium,
  dementiaBehavioral,
  CITATIONS,
  ValidationError
};