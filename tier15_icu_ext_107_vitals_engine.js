// filepath: tier15_icu_ext_107_vitals_engine.js
// TIER15_ICU_EXT-107: ICU continuous vitals & early warning scoring
'use strict';

const CITATIONS = ['SSC_2024','NICE_CG50_2024','NEWS2_RCP_2017','MEWS_RCN_2017'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function icu_vitals_score(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureNumber(req.spo2, 'spo2');
  ensureNumber(req.temperature_c, 'temperature_c');
  ensureNumber(req.consciousness_avpu, 'consciousness_avpu');
  ensureBool(req.supplemental_oxygen, 'supplemental_oxygen');
  ensureNumber(req.score_total, 'score_total');
  ensureEnum(req.score_type, 'score_type', ['news2','mews','qsofa','sofa','apache_ii','saps_ii','other']);

  let status;
  if (req.score_type === 'news2' && req.score_total >= 7) status = 'critical_score_resus_review';
  else if (req.score_type === 'news2' && req.score_total >= 5) status = 'urgent_clinical_review';
  else if (req.score_type === 'news2' && req.score_total >= 3) status = 'elevated_nurse_review';
  else if (req.score_type === 'qsofa' && req.score_total >= 2) status = 'high_risk_sepsis_screening';
  else if (req.consciousness_avpu >= 3) status = 'altered_mental_status_urgent';
  else if (req.spo2 < 90) status = 'hypoxemia_immediate';
  else status = 'within_acceptable_range';
  return { status, score: req.score_total };
}

function icu_early_warning(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.delta_score_1h, 'delta_score_1h');
  ensureNumber(req.delta_score_4h, 'delta_score_4h');
  ensureEnum(req.trend, 'trend', ['rising_rapid','rising','stable','falling','falling_rapid','fluctuating','unknown','other']);
  ensureNumber(req.score_current, 'score_current');
  ensureBool(req.treatment_response, 'treatment_response');
  ensureBool(req.activated_rapid_response, 'activated_rapid_response');

  let status;
  if (req.delta_score_1h >= 3) status = 'rapid_deterioration_immediate_response';
  else if (req.delta_score_4h >= 5) status = 'progressive_deterioration_review';
  else if (req.trend === 'rising_rapid') status = 'rising_rapid_treat_now';
  else if (req.trend === 'falling_rapid' && !req.treatment_response) status = 'falling_but_no_treatment_response';
  else if (req.activated_rapid_response) status = 'rrt_activated_in_progress';
  else status = 'stable_monitoring';
  return { status, trend: req.trend };
}

function icu_sepsis_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.sirs_criteria, 'sirs_criteria', ['zero','one','two','three','four_plus','not_calculated','other']);
  ensureEnum(req.qsofa_score, 'qsofa_score', ['zero','one','two','three','unknown','other']);
  ensureBool(req.suspected_infection, 'suspected_infection');
  ensureNumber(req.lactate_mmol_l, 'lactate_mmol_l');
  ensureNumber(req.map_mmhg, 'map_mmhg');
  ensureNumber(req.creatinine_mg_dl, 'creatinine_mg_dl');
  ensureNumber(req.bilirubin_mg_dl, 'bilirubin_mg_dl');
  ensureNumber(req.platelet_count, 'platelet_count');

  let status;
  if (req.lactate_mmol_l >= 4) status = 'lactate_4_plus_septic_shock_likely';
  else if (req.map_mmhg < 65 && req.lactate_mmol_l >= 2) status = 'map_low_plus_lactate_septic_shock_screening';
  else if (req.qsofa_score === 'two' || req.qsofa_score === 'three') status = 'qsofa_high_sepsis_screening_positive';
  else if (req.sirs_criteria === 'two' && req.suspected_infection) status = 'sirs_2_plus_infection_sepsis_screen';
  else if (req.sirs_criteria === 'three' && req.suspected_infection) status = 'sirs_3_plus_infection_high_suspicion';
  else status = 'sepsis_screen_negative';
  return { status, lactate: req.lactate_mmol_l };
}

function icu_ventilator(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.mode, 'mode', ['ac_vc','ac_pc','simv','psv','prvc','hfov','cpap_bipap','other']);
  ensureNumber(req.tidal_volume_ml_per_kg, 'tidal_volume_ml_per_kg');
  ensureNumber(req.peep_cm_h2o, 'peep_cm_h2o');
  ensureNumber(req.fio2_pct, 'fio2_pct');
  ensureNumber(req.plateau_pressure_cm_h2o, 'plateau_pressure_cm_h2o');
  ensureNumber(req.pf_ratio, 'pf_ratio');
  ensureEnum(req.ards_severity, 'ards_severity', ['no_ards','mild_200_300','moderate_100_200','severe_below_100','not_assessed','other']);

  let status;
  if (req.tidal_volume_ml_per_kg > 8) status = 'lung_protective_tidal_volume_under_8';
  else if (req.tidal_volume_ml_per_kg < 4) status = 'tidal_volume_too_low_review';
  else if (req.plateau_pressure_cm_h2o > 30) status = 'plateau_over_30_risk_barotrauma';
  else if (req.ards_severity === 'severe_below_100') status = 'severe_ards_prone_review';
  else if (req.ards_severity === 'moderate_100_200') status = 'moderate_ards_lung_protective';
  else status = 'ventilator_settings_acceptable';
  return { status, mode: req.mode };
}

function icu_delirium_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.cam_icu_score, 'cam_icu_score');
  ensureEnum(req.cam_icu_result, 'cam_icu_result', ['negative','positive','unable_to_assess','not_assessed','other']);
  ensureBool(req.rass_score_current, 'rass_score_current');
  ensureNumber(req.rass_value, 'rass_value');
  ensureEnum(req.delirium_type, 'delirium_type', ['none','hypoactive','hyperactive','mixed','unknown','other']);
  ensureBool(req.recent_sedation_hold, 'recent_sedation_hold');

  let status;
  if (req.cam_icu_result === 'unable_to_assess') status = 'unable_to_assess_recheck_or_sedation_review';
  else if (req.cam_icu_result === 'positive' && req.delirium_type === 'hypoactive') status = 'hypoactive_delirium_high_mortality_risk';
  else if (req.cam_icu_result === 'positive') status = 'delirium_positive_non_pharm_intervention';
  else if (req.rass_value >= 2) status = 'agitated_review_sedation';
  else if (req.rass_value <= -3) status = 'over_sedated_lighten';
  else if (!req.recent_sedation_hold) status = 'sedation_hold_recommended_abcde_bundle';
  else status = 'delirium_screen_negative';
  return { status, cam: req.cam_icu_result };
}

function funcs() { return { icu_vitals_score, icu_early_warning, icu_sepsis_screen, icu_ventilator, icu_delirium_screen }; }
module.exports = { funcs, CITATIONS, ValidationError };