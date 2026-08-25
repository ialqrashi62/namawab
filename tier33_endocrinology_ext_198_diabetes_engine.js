// filepath: tier33_endocrinology_ext_198_diabetes_engine.js
// TIER33_ENDOCRINOLOGY-198: Diabetes
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function dm_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.fpg_mg_dl, 'fpg');
  ensureNumber(req.hba1c_pct, 'hba1c');
  ensureNumber(req.ogtt_2h_mg_dl, 'ogtt');
  ensureEnum(req.dm_type, 'type', ['t1dm','t2dm','gdm','secondary','prediabetes','other']);
  ensureNumber(req.bmi, 'bmi');
  let status;
  if (req.hba1c_pct >= 6.5 || req.fpg_mg_dl >= 126 || req.ogtt_2h_mg_dl >= 200) status = 'diabetes_mellitus_diagnosed';
  else if (req.hba1c_pct >= 5.7 || req.fpg_mg_dl >= 100) status = 'prediabetes_lifestyle_intervention';
  else status = 'no_diabetes_normal';
  return { status, type: req.dm_type };
}

function hba1c_target(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureEnum(req.comorbidities, 'comorb', ['none','mild','multiple','severe','limited_life_expectancy']);
  ensureNumber(req.hba1c_current, 'curr');
  ensureNumber(req.target_hba1c, 'target');
  ensureEnum(req.treatment_intensity, 'intensity', ['maintain','intensify','deintensify']);
  let status;
  if (req.age >= 65 && req.comorbidities === 'multiple' && req.target_hba1c < 7.5) status = 'older_multiple_comorbid_target_relaxed';
  else if (req.hba1c_current - req.target_hba1c > 2) status = 'far_from_target_intensify_significantly';
  else if (req.hba1c_current <= req.target_hba1c) status = 'at_target_maintain';
  else status = 'hba1c_target_review_appropriate';
  return { status, target: req.target_hba1c };
}

function insulin_regimen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.regimen, 'reg', ['basal_only','basal_bolus','premixed','csii_pump','sliding_scale','other']);
  ensureNumber(req.total_daily_dose, 'tdd');
  ensureNumber(req.basal_pct, 'basal_pct');
  ensureNumber(req.fasting_glucose, 'fpg');
  ensureEnum(req.glucose_variability, 'var', ['low','moderate','high','very_high']);
  let status;
  if (req.glucose_variability === 'very_high') status = 'very_high_variability_cgm_review';
  else if (req.basal_pct < 30 || req.basal_pct > 70) status = 'basal_bolus_imbalance_review';
  else if (req.fasting_glucose > 180) status = 'fpg_high_increase_basal';
  else if (req.fasting_glucose < 70) status = 'fpg_low_reduce_basal';
  else status = 'insulin_regimen_appropriate';
  return { status, tdd: req.total_daily_dose };
}

function glucose_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.monitoring_type, 'type', ['cgm','fingerprint_smbg','continuous_smbg','flash','none']);
  ensureNumber(req.time_in_range_pct, 'tir');
  ensureNumber(req.time_below_range_pct, 'tbr');
  ensureNumber(req.time_above_range_pct, 'tar');
  ensureNumber(req.gmi_pct, 'gmi');
  let status;
  if (req.tbr >= 4) status = 'high_hypoglycemia_review';
  else if (req.tir < 50) status = 'low_tir_intensify';
  else if (req.tir >= 70 && req.tar <= 25) status = 'tir_optimal_maintain';
  else status = 'cgm_review_appropriate';
  return { status, tir: req.time_in_range_pct };
}

function dm_complications(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.retinopathy, 'retino', ['none','mild_npd','moderate_npd','severe_npd','pdr','laser_treated','other']);
  ensureEnum(req.nephropathy, 'nephro', ['normal','microalbuminuria','macroalbuminuria','ckd_stage_3','ckd_stage_4','dialysis','other']);
  ensureEnum(req.neuropathy, 'neuro', ['none','peripheral','autonomic','mononeuropathy','polyneuropathy','other']);
  ensureEnum(req.cardiovascular, 'cv', ['none','cad','stroke','pvd','heart_failure','multiple','other']);
  ensureEnum(req.foot_exam, 'foot', ['normal','callus','deformity','ulcer','amputation','other']);
  let status;
  if (req.foot_exam === 'ulcer') status = 'diabetic_foot_ulcer_urgent_wound';
  else if (req.neuropathy === 'autonomic') status = 'autonomic_neuropathy_review';
  else if (req.nephropathy === 'macroalbuminuria') status = 'macroalbuminuria_aggressive_raas';
  else if (req.retinopathy === 'pdr' || req.retinopathy === 'severe_npd') status = 'refer_ophthalmology_urgent';
  else status = 'dm_complications_review_appropriate';
  return { status, ret: req.retinopathy };
}

function funcs() { return { dm_diagnosis, hba1c_target, insulin_regimen, glucose_monitoring, dm_complications }; }
module.exports = { funcs, ValidationError };