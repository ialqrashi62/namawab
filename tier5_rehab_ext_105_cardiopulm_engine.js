// filepath: tier5_rehab_ext_105_cardiopulm_engine.js
// TIER5_REHAB_EXT-105: Cardiopulmonary rehab (risk stratification, METs, RPE, phase 2, pul)
'use strict';

const CITATIONS = [
  'AACVPR_Cardiac_Rehab_2020',
  'ACSM_Exercise_Testing_2018',
  'ESC_Cardiac_Rehab_2021',
  'ATS_Pulmonary_Rehab_Statement_2021',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function cpr_stratification(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.lvef, 'lvef');
  ensureStr(req.event_phase, 'event_phase');
  ensureEnum(req.event_phase, 'event_phase', ['post_mi','cabs','cath_revascularization','valve','hf_dm']);
  ensureBool(req.anomalous_st_depression_at_rest, 'anomalous_st_depression_at_rest');
  ensureBool(req.lvw_dilatation, 'lvw_dilatation');
  ensureBool(req.symptomatic_with_adl, 'symptomatic_with_adl');

  let stratum;
  if (req.lvef < 35 || req.anomalous_st_depression_at_rest || req.symptomatic_with_adl) stratum = 'A_high_risk_supervised_only';
  else if (req.lvef < 45 || req.lvw_dilatation) stratum = 'B_moderate_risk_minimal_supervision';
  else stratum = 'C_low_risk_community_tele';

  return { stratum, lvef: req.lvef, age: req.age, recommendations: stratum === 'A_high_risk_supervised_only' ? ['cardio_present','continuous_monitoring','bpm_and_bp_each_session'] : stratum === 'B_moderate_risk_minimal_supervision' ? ['clipboard_and_telemetry_as_needed'] : ['community_tele_rehab'], citations: CITATIONS };
}

function exercise_capacity(req) {
  ensureNumber(req.workload_max_watts, 'workload_max_watts');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.vo2_max_ml_kg_min, 'vo2_max_ml_kg_min');
  if (req.weight_kg <= 0) throw new ValidationError('weight_kg>0', 'weight_kg');
  if (req.vo2_max_ml_kg_min <= 0) throw new ValidationError('vo2>0', 'vo2_max_ml_kg_min');
  const mets = req.vo2_max_ml_kg_min / 3.5;
  const watts_to_mets = req.workload_max_watts / (req.weight_kg * 3.5);
  let level;
  if (mets >= 10) level = 'high_function_capacity';
  else if (mets >= 7) level = 'moderate_capacity';
  else if (mets >= 5) level = 'low_capacity';
  else level = 'very_low_capacity';
  return { vo2_max: req.vo2_max_ml_kg_min, mets: Math.round(mets * 10) / 10, watts_to_mets: Math.round(watts_to_mets * 100) / 100, level, citations: CITATIONS };
}

function rpe_target(req) {
  ensureNumber(req.baseline_hr, 'baseline_hr');
  ensureNumber(req.max_hr, 'max_hr');
  ensureNumber(req.hr_reserve, 'hr_reserve');
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['walking','stationary_bike','treadmill','rowing']);
  const hr_reserve_pct = req.hr_reserve * 100;
  let target_band;
  if (hr_reserve_pct < 30) target_band = 'light_warmup';
  else if (hr_reserve_pct <= 50) target_band = 'phase1_foundation';
  else if (hr_reserve_pct <= 70) target_band = 'phase2_aerobic';
  else if (hr_reserve_pct <= 85) target_band = 'phase2_clinical_restore';
  else target_band = 'high_endurance';

  return { hr_reserve_pct: Math.round(hr_reserve_pct * 10) / 10, target_band, rpe_score: hr_reserve_pct / 10, citations: CITATIONS };
}

function phase2_protocol(req) {
  ensureNumber(req.weeks_post_event, 'weeks_post_event');
  ensureNumber(req.max_mets, 'max_mets');
  ensureBool(req.ischemia_documented, 'ischemia_documented');
  ensureStr(req.program_type, 'program_type');
  ensureEnum(req.program_type, 'program_type', ['cardiac','pulmonary']);

  let weeks;
  let sessions_per_week;
  let duration_min;
  if (req.program_type === 'cardiac') {
    weeks = 12;
    sessions_per_week = 3;
    duration_min = 30;
  } else {
    weeks = 8;
    sessions_per_week = 2;
    duration_min = 60;
  }
  const intensity = req.max_mets >= 5 ? 'moderate_50_to_70_hrr' : 'light_to_moderate_30_to_50_hrr';
  return {
    program_type: req.program_type,
    weeks,
    sessions_per_week,
    duration_min,
    intensity,
    special_notes: req.ischemia_documented ? 'with_anti_anginal_titration_stress_test_before_phase3' : 'standard_protocol',
    citations: CITATIONS,
  };
}

function pulmonary_rehab(req) {
  ensureNumber(req.fev1_predicted_pct, 'fev1_predicted_pct');
  ensureNumber(req.dlco_predicted_pct, 'dlco_predicted_pct');
  ensureNumber(req.six_min_walk_m, 'six_min_walk_m');
  ensureNumber(req.mmrc_grade, 'mmrc_grade'); // 0..4
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['copd','ild','pulmonary_fibrosis','cf','asthma','post_covid','lung_ca_pre_surg']);

  let stratum;
  if (req.mmrc_grade >= 3 || req.fev1_predicted_pct < 50) stratum = 'high_severity';
  else if (req.mmrc_grade === 2 || req.fev1_predicted_pct < 70) stratum = 'moderate_severity';
  else stratum = 'mild_severity';
  return {
    stratum,
    expected_walk_gain_m: stratum === 'high_severity' ? 60 : stratum === 'moderate_severity' ? 50 : 30,
    weeks: 8,
    sessions_per_week: 3,
    duration_min: 45,
    notes: 'combine_upper_and_lower_limb_training_breathing_techniques_education',
    citations: CITATIONS,
  };
}

function funcs() {
  return { cpr_stratification, exercise_capacity, rpe_target, phase2_protocol, pulmonary_rehab };
}

module.exports = { funcs, CITATIONS, ValidationError };
