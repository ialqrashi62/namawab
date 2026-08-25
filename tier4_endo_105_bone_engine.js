'use strict';
// TIER4_ENDO-105 Bone & Calcium Metabolism
const CITATIONS = [
  { id: 'NOB-2024', source: 'NOF Bone Health', year: 2024 }
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
function osteoporosisFractureRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const sex = ensureEnum(input, 'sex', ['female', 'male', 'other']);
  const bmd_t_score = ensureNumber(input, 't_score', -10, 10);
  const prior_fracture = input.prior_fracture === true;
  const parental_hip = input.parental_hip_fracture === true;
  const steroid = input.chronic_steroid === true;
  const fragility = (bmd_t_score <= -2.5 || (bmd_t_score <= -1.0 && prior_fracture));
  const therapy = (fragility) ? 'bisphosphonate_or_denosumab_or_teriparatide' :
    (bmd_t_score <= -1.0) ? 'review_lifestyle_ca_vit_d_review_reassess_2y' : 'lifestyle_only';
  return {
    module: 'tier4_endo_105_osteoporosis',
    patient_id: patientId,
    age,
    sex,
    t_score: bmd_t_score,
    prior_fracture,
    parental_hip_fracture: parental_hip,
    chronic_steroid: steroid,
    fragility_fracture_risk: fragility,
    therapy,
    monitoring: 'q1_to_2y_dxa_q6mo_labs',
    citations: CITATIONS
  };
}
function hypercalcemia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ca = ensureNumber(input, 'corrected_calcium', 0, 25);
  const pth = ensureNumber(input, 'pth', 0, 1000);
  const vitamin_d = ensureNumber(input, 'vit_d_25_oh', 0, 200);
  const etiology = ensureEnum(input, 'etiology', ['primary_hyperparathyroidism', 'malignancy', 'vitamin_d_toxicity', 'granulomatous', 'thiazide', 'other', 'unknown']);
  const severity = (ca >= 14) ? 'severe' : (ca >= 12) ? 'moderate' : 'mild';
  const therapy = (severity === 'severe') ? 'iv_bisphosphonate_then_calcitonin_then_treat_cause' :
    (severity === 'moderate') ? 'iv_fluids_then_treat_cause' : 'oral_fluids_treat_cause';
  return {
    module: 'tier4_endo_105_hyperca',
    patient_id: patientId,
    corrected_calcium: ca,
    pth,
    vit_d_25_oh: vitamin_d,
    etiology,
    severity,
    therapy,
    monitoring: 'q4h_ca_recheck_q24h_labs',
    citations: CITATIONS
  };
}
module.exports = {
  osteoporosisFractureRisk,
  hypercalcemia,
  CITATIONS,
  ValidationError
};