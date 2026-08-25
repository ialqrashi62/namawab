'use strict';
// TIER4_PEDS-105 Pediatric Endocrinology
// T1DM, DKA, growth, puberty, thyroid, adrenal
const CITATIONS = [
  { id: 'ISPAD-2024', source: 'International Society Pediatric Diabetes', year: 2024 },
  { id: 'ESPE-2023', source: 'European Society Pediatric Endocrinology', year: 2023 }
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
function pediatricDkaManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ph = ensureNumber(input, 'ph', 6.5, 7.6);
  const hco3 = ensureNumber(input, 'hco3', 0, 40);
  const glucose = ensureNumber(input, 'glucose_mg_dl', 0, 1500);
  const anion_gap = ensureNumber(input, 'anion_gap', 0, 50);
  const osmo = ensureNumber(input, 'osmolality', 200, 500);
  const mental_status = ensureEnum(input, 'mental_status', ['alert', 'obtunded', 'stupor', 'coma']);
  const severity = (ph < 7.1 || hco3 < 5 || mental_status === 'stupor' || mental_status === 'coma') ? 'severe' : (ph < 7.2 ? 'moderate' : 'mild');
  const therapy = {
    fluids: 'isotonic_saline_10_to_20_ml_kg_first_1h',
    insulin: '0.05_to_0.1_u_kg_h_after_initial_fluid_bolus',
    dextrose: 'add_d5_when_glucose_below_300_to_250',
    potassium: 'replace_40_mEq_per_L_fluid_above_3.5',
    monitor: 'neuro_status_hourly_glucose_q1h_k_q2h',
    cerebral_edema: 'mannitol_hypertonic_saline_if_change_in_mental_status'
  };
  return {
    module: 'tier4_peds_105_dka',
    patient_id: patientId,
    severity,
    ph,
    hco3,
    glucose,
    mental_status,
    therapy,
    target_glucose: '150_to_250',
    target_correction: 'slow_recovery_resolve_anion_gap_over_24_to_48h',
    citations: CITATIONS
  };
}
function pediatricGrowthEvaluation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 18);
  const sex = ensureEnum(input, 'sex', ['m', 'f']);
  const height_z = ensureNumber(input, 'height_z', -5, 5);
  const weight_z = ensureNumber(input, 'weight_z', -5, 5);
  const bone_age = ensureNumber(input, 'bone_age_years', 0, 18);
  const mid_parental = ensureNumber(input, 'mid_parental_height_z', -5, 5);
  const chronic_illness = input.chronic_illness === true;
  let evaluation = 'idiopathic_short_stature';
  if (height_z < -3) evaluation = 'pathological_short_stature_workup';
  else if (height_z < mid_parental - 1.5) evaluation = 'familial_short_stature_or_constitutional';
  if (chronic_illness) evaluation = 'chronic_illness_related';
  const workup = {
    labs: 'tsh_t4_igf1_gh_stim_cbc_cmp_celiac_screen',
    imaging: 'bone_age_left_hand_xr',
    referral: 'pediatric_endocrinology'
  };
  return {
    module: 'tier4_peds_105_growth',
    patient_id: patientId,
    age_years,
    sex,
    height_z,
    weight_z,
    bone_age_years: bone_age,
    mid_parental_z: mid_parental,
    evaluation,
    workup,
    citations: CITATIONS
  };
}
module.exports = {
  pediatricDkaManagement,
  pediatricGrowthEvaluation,
  CITATIONS,
  ValidationError
};
