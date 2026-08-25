// filepath: tier10_lab_ext_102_chemistry_engine.js
// TIER10_LAB_EXT-102: Clinical chemistry (panels, QC, delta checks, critical values, trends)
'use strict';

const CITATIONS = ['CLSI_EP15_2024','IFCC_GUIDELINES_2024','CAP_CHEMISTRY_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function chem_panel_evaluate(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.panel_type, 'panel_type', ['bmp','cmp','lipid','thyroid','liver','renal','cardiac','anemia','diabetes','electrolyte','uric_acid']);
  ensureNumber(req.analyte_count, 'analyte_count');
  ensureNumber(req.abnormal_count, 'abnormal_count');
  ensureEnum(req.severity_overall, 'severity_overall', ['all_normal','minor','moderate','severe','critical']);

  let interpretation;
  if (req.severity_overall === 'critical') interpretation = 'critical_findings_notify_within_30min';
  else if (req.severity_overall === 'severe') interpretation = 'severe_findings_notify_within_2h';
  else if (req.abnormal_count >= 3 && req.severity_overall === 'moderate') interpretation = 'multiple_abnormalities_pattern_review';
  else if (req.severity_overall === 'minor') interpretation = 'minor_abnormalities_re_check_at_next_visit';
  else interpretation = 'all_within_reference_no_action';
  return { interpretation, panel: req.panel_type, abnormal: req.abnormal_count };
}

function chem_qc_review(req) {
  ensureStr(req.qc_run_id, 'qc_run_id');
  ensureEnum(req.assay, 'assay', ['glucose','bun','creatinine','sodium','potassium','chloride','co2','anion_gap','calcium','magnesium','phosphorus','alt','ast','bilirubin_total','bilirubin_direct','alk_phosphatase','ggt','albumin','total_protein','ldh','uric_acid','triglycerides','cholesterol_total','hdl','ldl_calc','hba1c','tsh','free_t4','free_t3','troponin','bnp','crp','esr','vitamin_d_25oh','vitamin_b12','folate','iron','ferritin','transferrin']);
  ensureNumber(req.qc_level_1, 'qc_level_1');
  ensureNumber(req.qc_level_2, 'qc_level_2');
  ensureNumber(req.qc_level_3, 'qc_level_3');
  ensureNumber(req.mean, 'mean,');
  ensureNumber(req.sd, 'sd');

  const cv = req.mean !== 0 ? Math.abs(req.sd / req.mean) * 100 : 0;
  let qc_status;
  if (cv >= 10) qc_status = 'qc_out_of_control_reject_run';
  else if (cv >= 5) qc_status = 'qc_warning_2_of_3s_rule_review';
  else if (cv >= 3) qc_status = 'qc_within_acceptable_range_1s_warning';
  else qc_status = 'qc_in_control_release_results';

  return { qc_status, assay: req.assay, cv: Math.round(cv * 100) / 100 };
}

function chem_delta_check(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.analyte, 'analyte', ['glucose','creatinine','potassium','sodium','hemoglobin','hct','wbc','platelet','troponin','bilirubin','ast','alt','bun']);
  ensureNumber(req.previous_value, 'previous_value');
  ensureNumber(req.current_value, 'current_value');
  ensureNumber(req.days_between, 'days_between');
  ensureEnum(req.units, 'units', ['mg_dl','mmol_l','meq_l','iu_l','u_l','g_dl','percent','ng_ml','pg_ml']);

  const delta_pct = req.previous_value !== 0 ? Math.abs((req.current_value - req.previous_value) / req.previous_value) * 100 : 0;
  let delta_status;
  if (req.days_between <= 1 && delta_pct >= 50) delta_status = 'large_delta_clinically_significant_call_provider';
  else if (req.days_between <= 7 && delta_pct >= 100) delta_status = 'extreme_delta_investigate';
  else if (delta_pct <= 10) delta_status = 'minimal_change_within_expected';
  else delta_status = 'moderate_change_no_action_required';
  return { delta_status, analyte: req.analyte, delta_pct: Math.round(delta_pct * 100) / 100 };
}

function chem_critical_value(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.analyte, 'analyte', ['glucose','potassium','sodium','hemoglobin','platelet','wbc','ph','pco2','po2','hco3','lactate','troponin']);
  ensureNumber(req.value, 'value');
  ensureEnum(req.direction, 'direction', ['low_critical','high_critical','panic_low','panic_high','routine_low','routine_high']);
  ensureNumber(req.minutes_to_notify, 'minutes_to_notify');
  ensureBool(req.acknowledgment_documented, 'acknowledgment_documented');

  let cv_status;
  if (req.direction.startsWith('panic') && !req.acknowledgment_documented) cv_status = 'panic_value_documentation_blocking';
  else if (req.direction.startsWith('critical') && !req.acknowledgment_documented) cv_status = 'critical_value_documentation_required';
  else if (req.minutes_to_notify > 30 && req.direction.includes('critical')) cv_status = 'notification_exceeds_30min_target';
  else if (req.acknowledgment_documented) cv_status = 'critical_value_communicated_documented';
  else cv_status = 'routine_value';
  return { cv_status, analyte: req.analyte, value: req.value };
}

function chem_trend(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.analyte, 'analyte', ['glucose','creatinine','potassium','hemoglobin','hba1c','tsh','ldl','triglycerides']);
  ensureNumber(req.readings_12mo, 'readings_12mo');
  ensureNumber(req.first_value, 'first_value');
  ensureNumber(req.last_value, 'last_value');
  ensureNumber(req.mean_value, 'mean_value');

  const slope = req.readings_12mo > 0 ? (req.last_value - req.first_value) / req.readings_12mo : 0;
  const change_pct = req.first_value !== 0 ? ((req.last_value - req.first_value) / req.first_value) * 100 : 0;
  let trend_band;
  if (Math.abs(change_pct) >= 30) trend_band = 'significant_clinical_change_review_with_provider';
  else if (Math.abs(change_pct) >= 15) trend_band = 'moderate_change_monitor_closely';
  else if (Math.abs(change_pct) >= 5) trend_band = 'minor_change_continue_monitoring';
  else trend_band = 'stable_no_action';
  return { trend_band, slope_per_period: Math.round(slope * 1000) / 1000, change_pct: Math.round(change_pct * 100) / 100 };
}

function funcs() { return { chem_panel_evaluate, chem_qc_review, chem_delta_check, chem_critical_value, chem_trend }; }
module.exports = { funcs, CITATIONS, ValidationError };