'use strict';
// TIER4_NEURO-108 Neuromuscular: ALS, GBS, Myasthenia, Myopathy
const CITATIONS = [
  { id: 'AAN-NM-2024', source: 'AAN Neuromuscular Section', year: 2024 }
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
function gbsManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const nadir_days = ensureNumber(input, 'nadir_days', 0, 60);
  const respiratory_fvc = ensureNumber(input, 'fvc_pct', 0, 150);
  const upper_limb = ensureNumber(input, 'upper_limb_strength', 0, 5);
  const bulbar = input.bulbar_symptoms === true;
  const autonomic = input.autonomic_instability === true;
  const intubation = respiratory_fvc < 20 || bulbar && respiratory_fvc < 30;
  const therapy = nadir_days <= 14 ? 'ivig_0_4g_kg_5d_or_plasmapheresis_5x' : 'consider_late_ivig_review_recovery';
  return {
    module: 'tier4_neuro_108_gbs',
    patient_id: patientId,
    nadir_days,
    respiratory_fvc,
    upper_limb_strength: upper_limb,
    bulbar,
    autonomic,
    intubation_indicated: intubation,
    therapy,
    monitoring: 'fvc_q4h_until_improvement',
    citations: CITATIONS
  };
}
function myastheniaCrisis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const fg_score = ensureNumber(input, 'myasthenia_fg_score', 0, 3);
  const respiratory_fvc = ensureNumber(input, 'fvc_pct', 0, 150);
  const nif = ensureNumber(input, 'nif_cm_h2o', -100, 100);
  const vo2 = ensureNumber(input, 'vo2_max', 0, 500);
  const intubation = (fg_score >= 2 && (respiratory_fvc < 20 || nif < 20 || vo2 < 15)) ? 'consider_elective_intubation' : 'monitor';
  const therapy = {
    ivig: '0_4g_kg_5d_or_plasmapheresis_5x',
    steroids: 'prednisone_1mg_kg_for_severity',
    anticholinesterase: 'pyridostigmine_titrate',
    immunosuppression: 'azathioprine_mycophenolate_steroid_sparing',
    complement_inhibitor: 'ravulizumab_or_efgartigimod_or_ecomdisomeran'
  };
  return {
    module: 'tier4_neuro_108_mg',
    patient_id: patientId,
    fg_score,
    respiratory_fvc,
    nif,
    vo2,
    intubation,
    therapy,
    monitoring: 'fvc_nif_q4h',
    citations: CITATIONS
  };
}
function alsManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const als_frs = ensureNumber(input, 'alsfrs_r_score', 0, 48);
  const fvc = ensureNumber(input, 'fvc_pct', 0, 150);
  const weight = ensureNumber(input, 'weight_kg', 0, 200);
  const bulbar = input.bulbar_onset === true;
  const therapy = {
    riluzole: '50mg_bid_life_prolonging_3_to_6_months',
    edaravone: 'consider_AMX0035_mild_als',
    amx0035: 'consider_for_alsfrs_drop_then_reassess',
    multidisciplinary: 'pulmonology_pt_ot_slp_social_work_nutrition',
    nutrition: 'peg_if_weight_loss_or_bulbar',
    ventilation: 'consider_niv_when_fvc_below_50'
  };
  return {
    module: 'tier4_neuro_108_als',
    patient_id: patientId,
    alsfrs_r: als_frs,
    fvc,
    weight,
    bulbar,
    therapy,
    monitoring: 'alsfrs_q3mo_fvc_q3mo',
    citations: CITATIONS
  };
}
function myopathyWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ck = ensureNumber(input, 'ck_level', 0, 50000);
  const emg_pattern = ensureEnum(input, 'emg_pattern', ['myopathic', 'neurogenic', 'mixed', 'normal']);
  const family_history = input.family_history === true;
  const muscle_biopsy = input.biopsy_planned === true;
  const genetic_test = input.genetic_test_planned === true;
  const target = (ck > 1500 && family_history) ? 'muscular_dystrophy_panel' : 'inflammatory_myopathy_or_viral_workup';
  return {
    module: 'tier4_neuro_108_myopathy',
    patient_id: patientId,
    ck,
    emg_pattern,
    family_history,
    muscle_biopsy,
    genetic_test,
    target,
    monitoring: 'ck_q3mo_q6mo_if_diagnosed',
    citations: CITATIONS
  };
}
module.exports = {
  gbsManagement,
  myastheniaCrisis,
  alsManagement,
  myopathyWorkup,
  CITATIONS,
  ValidationError
};
