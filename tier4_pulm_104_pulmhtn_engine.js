'use strict';
// TIER4_PULM-104 Pulmonary Hypertension
const CITATIONS = [
  { id: 'ESC-ERS-PAH-2024', source: 'ESC/ERS Pulmonary Hypertension', year: 2024 }
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
function pahRiskStrat(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const who = ensureNumber(input, 'who_functional_class', 1, 4);
  const six_min_walk = ensureNumber(input, 'six_min_walk_meters', 0, 800);
  const ntprobnp = ensureNumber(input, 'ntprobnp', 0, 50000);
  const rap = ensureNumber(input, 'right_atrial_pressure', 0, 30);
  const cardiac_index = ensureNumber(input, 'cardiac_index', 0, 10);
  const risk_score = ((who >= 3 ? 1 : 0) + (six_min_walk < 440 ? 1 : 0) + (ntprobnp >= 1400 ? 1 : 0) + (rap >= 14 ? 1 : 0) + (cardiac_index < 2 ? 1 : 0));
  const risk = (risk_score <= 1) ? 'low' : (risk_score <= 3) ? 'intermediate' : 'high';
  const therapy = (risk === 'high') ? 'parenteral_prostacyclin_then_combination_then_lung_transplant_referral' :
    (risk === 'intermediate') ? 'oral_pah_combination_then_review' :
    'monotherapy_pde5_or_era_then_review';
  return {
    module: 'tier4_pulm_104_risk',
    patient_id: patientId,
    who_functional_class: who,
    six_min_walk_meters: six_min_walk,
    ntprobnp,
    right_atrial_pressure: rap,
    cardiac_index,
    risk_score,
    risk,
    therapy,
    monitoring: 'q3mo_clinical_q3mo_imaging_q1y_rhc',
    citations: CITATIONS
  };
}
function chronicThromboEmbolic(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const chronic_pe = input.chronic_pe_history === true;
  const surgery_eligible = input.operable === true;
  const therapy = (chronic_pe && surgery_eligible) ? 'pulmonary_thromboendarterectomy_evaluation' :
    (chronic_pe && !surgery_eligible) ? 'riociguat_or_balloon_pulmonary_angioplasty' :
    'no_cteph_review_other_cause';
  return {
    module: 'tier4_pulm_104_cteph',
    patient_id: patientId,
    chronic_pe_history: chronic_pe,
    operable: surgery_eligible,
    therapy,
    monitoring: 'q3mo_imaging_q3mo_clinical_q6mo_functional',
    citations: CITATIONS
  };
}
module.exports = {
  pahRiskStrat,
  chronicThromboEmbolic,
  CITATIONS,
  ValidationError
};