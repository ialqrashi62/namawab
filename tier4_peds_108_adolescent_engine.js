'use strict';
// TIER4_PEDS-108 Adolescent Medicine
// Eating disorders, reproductive health, substance use
const CITATIONS = [
  { id: 'SAHM-2024', source: 'Society Adolescent Health Medicine', year: 2024 }
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
function eatingDisorderAssessment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 25);
  const weight_kg = ensureNumber(input, 'weight_kg', 0, 200);
  const height_cm = ensureNumber(input, 'height_cm', 0, 250);
  const bmi = weight_kg / Math.pow(height_cm / 100, 2);
  const bmi_percentile = ensureNumber(input, 'bmi_percentile', 0, 100);
  const eating_attitude = ensureEnum(input, 'eating_attitude', ['normal', 'restricting', 'binge_purge', 'purging_only', 'binge_only']);
  const electrolyte = {
    k: ensureNumber(input, 'potassium', 0, 10),
    na: ensureNumber(input, 'sodium', 0, 200),
    cl: ensureNumber(input, 'chloride', 0, 200),
    hco3: ensureNumber(input, 'bicarbonate', 0, 50)
  };
  const hr = ensureNumber(input, 'heart_rate', 0, 200);
  const orthostatic = input.orthostatic_change === true;
  const medical_instability = hr < 50 || (bmi_percentile < 5 && eating_attitude !== 'normal') || orthostatic;
  const diagnosis = medical_instability ? 'anorexia_nervosa_severe_medical_instability' : 'eating_disorder_partial';
  const therapy = {
    refeeding: medical_instability ? 'inpatient_supervised_refeeding_5_to_10kcal_kg' : 'outpatient_structured_meal_plan',
    psychotherapy: 'family_based_treatment_fbt_15_to_20_sessions',
    mri_prolactin: 'baseline_then_q6mo',
    menses_resume: 'monitor_at_3_months_post_weight_gain',
    electrolyte_replete: 'oral_or_iv_potassium_magnesium_phosphate'
  };
  return {
    module: 'tier4_peds_108_eating',
    patient_id: patientId,
    age_years,
    bmi,
    bmi_percentile,
    diagnosis,
    medical_instability,
    therapy,
    monitoring: { hr_daily: true, lytes_q48h: true, weight_3x_weekly: true },
    citations: CITATIONS
  };
}
function adolescentConfidentiality(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 25);
  const topic = ensureEnum(input, 'topic', ['contraception', 'sti', 'mental_health', 'substance_use', 'pregnancy']);
  const capacity = input.capacity_assessed === true;
  const consent = age_years >= 18 ? 'adult_consent' : 'mature_minor_with_assessment';
  const confidentiality = age_years >= 14 ? 'protected_unless_safety_risk' : 'parent_involve_standard';
  return {
    module: 'tier4_peds_108_confidentiality',
    patient_id: patientId,
    age_years,
    topic,
    consent,
    capacity_assessed: capacity,
    confidentiality,
    ksa14_age_of_majority: '18_years',
    citations: CITATIONS
  };
}
module.exports = {
  eatingDisorderAssessment,
  adolescentConfidentiality,
  CITATIONS,
  ValidationError
};
