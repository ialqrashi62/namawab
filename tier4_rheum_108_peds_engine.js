'use strict';
// TIER4_RHEUM-108 Pediatric Rheumatology
const CITATIONS = [
  { id: 'PRINTO-2024', source: 'Pediatric Rheumatology International', year: 2024 }
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
function kawasakiDisease(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age_years', 0, 18);
  const fever_days = ensureNumber(input, 'fever_days', 0, 30);
  const features = (input.bilateral_conjunctivitis === true ? 1 : 0) + (input.oral_changes === true ? 1 : 0) +
    (input.cervical_lymph === true ? 1 : 0) + (input.rash === true ? 1 : 0) + (input.extremity_changes === true ? 1 : 0);
  const classic = (fever_days >= 5 && features >= 4) ? 'classic_kawasaki' :
    (fever_days >= 5 && features >= 2) ? 'incomplete_kawasaki' : 'not_kawasaki';
  const therapy = (classic !== 'not_kawasaki') ? 'ivig_2g_kg_then_high_dose_aspirin_then_review_echo' : 'review_other_viral_illness';
  const echo_timing = (classic !== 'not_kawasaki') ? 'baseline_echo_then_q1_to_2wk_q6wk_q1y' : 'no_echo_needed';
  return {
    module: 'tier4_rheum_108_kd',
    patient_id: patientId,
    age_years: age,
    fever_days,
    classic_features: features,
    classification: classic,
    therapy,
    echo_timing,
    citations: CITATIONS
  };
}
function jia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subtype = ensureEnum(input, 'subtype', ['oligoarticular', 'polyarticular_rf_pos', 'polyarticular_rf_neg', 'systemic', 'psoriatic', 'enthesitis_related', 'undifferentiated']);
  const joint_count = ensureNumber(input, 'active_joints', 0, 100);
  const uveitis_screen = input.uveitis_screen_due === true;
  const therapy = (subtype === 'systemic') ? 'anakinra_then_review_mas_risk' :
    (joint_count >= 5) ? 'methotrexate_then_tnf_inhibitor' :
    'intraarticular_steroid_then_nsaid_or_mtx';
  const uveitis = (subtype === 'oligoarticular' || subtype === 'polyarticular_rf_pos') ? 'q3mo_ophthalmology_screen' : 'q6mo_ophthalmology_screen';
  return {
    module: 'tier4_rheum_108_jia',
    patient_id: patientId,
    subtype,
    active_joints: joint_count,
    therapy,
    uveitis_screening: uveitis,
    monitoring: 'q3mo_clinical_q6mo_labs_q1y_imaging',
    citations: CITATIONS
  };
}
module.exports = {
  kawasakiDisease,
  jia,
  CITATIONS,
  ValidationError
};