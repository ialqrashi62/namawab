'use strict';
// TIER4_PSYCH-108 Child & Adolescent Psychiatry
const CITATIONS = [
  { id: 'AACAP-2024', source: 'AACAP Practice Parameters', year: 2024 }
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
function adhd(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age_years', 0, 18);
  const symptom_count = ensureNumber(input, 'symptom_count', 0, 18);
  const subtype = ensureEnum(input, 'subtype', ['inattentive', 'hyperactive', 'combined']);
  const prior_trial = input.prior_medication_trial === true;
  const therapy = (age >= 6 && symptom_count >= 6) ? 'stimulant_methylphenidate_or_amphetamines_then_review' :
    (age < 6) ? 'behavioral_intervention_first_then_medication' :
    (prior_trial) ? 'consider_non_stimulant_atomoxetine_or_guanfacine' : 'stimulant_first_line';
  return {
    module: 'tier4_psych_108_adhd',
    patient_id: patientId,
    age_years: age,
    symptom_count,
    subtype,
    therapy,
    monitoring: 'q2wk_titration_q1mo_then_q3mo',
    citations: CITATIONS
  };
}
function autism(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age_years', 0, 18);
  const ados = ensureEnum(input, 'ados_score', ['below_threshold', 'mild', 'moderate', 'severe', 'not_done']);
  const comorbidities = ensureEnum(input, 'comorbidity', ['none', 'adhd', 'anxiety', 'sleep', 'aggression', 'mixed']);
  const therapy = (ados === 'below_threshold' || ados === 'not_done') ? 'review_assessment_then_behavioral' :
    (comorbidities === 'aggression' || comorbidities === 'mixed') ? 'aba_then_consider_risperidone_or_aripiprazole' :
    'aba_or_ndbi_then_parent_training';
  return {
    module: 'tier4_psych_108_asd',
    patient_id: patientId,
    age_years: age,
    ados_score: ados,
    comorbidity: comorbidities,
    therapy,
    monitoring: 'q1mo_progress_q3mo_multidisciplinary_review',
    citations: CITATIONS
  };
}
module.exports = {
  adhd,
  autism,
  CITATIONS,
  ValidationError
};