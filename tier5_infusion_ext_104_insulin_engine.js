// filepath: tier5_infusion_ext_104_insulin_engine.js
// TIER5_INFUSION_EXT-104: Insulin pump / diabetes device
'use strict';
const CITATIONS = ['AACE_Pump_2020','ADA_Insulin_Pump_2023','Endocrine_Pump_2021'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pump_candidate(req){
  ensureNumber(req.a1c_pct, 'a1c_pct');
  ensureNumber(req.bg_variability_pct, 'bg_variability_pct');
  ensureBool(req.mdi_failure, 'mdi_failure');
  ensureBool(req.education_completed, 'education_completed');
  ensureBool(req.cgm_use, 'cgm_use');
  ensureBool(req.insurance_covered, 'insurance_covered');
  let plan;
  if(req.mdi_failure===false) plan='continue_with_optimize_mdi_then_reassess';
  else if(req.education_completed===false) plan='continue_with_education_then_reassess';
  else if(req.insurance_covered===false) plan='continue_with_appeal_then_reassess';
  else plan='continue_with_pump_then_reassess';
  return {plan};
}
function basal_rate(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.total_daily_dose, 'total_daily_dose');
  ensureNumber(req.basal_pct, 'basal_pct');
  ensureNumber(req.bg_fasting, 'bg_fasting');
  ensureNumber(req.bg_pre_dinner, 'bg_pre_dinner');
  ensureBool(req.hypoglycemia_overnight, 'hypoglycemia_overnight');
  let plan;
  if(req.basal_pct<30) plan='continue_with_reduce_bolus_then_reassess';
  else if(req.basal_pct>60) plan='continue_with_reduce_basal_then_reassess';
  else if(req.hypoglycemia_overnight) plan='continue_with_reduce_basal_then_reassess';
  else if(req.bg_fasting>180) plan='continue_with_increase_basal_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function carb_ratio(req){
  ensureNumber(req.bg_pre_meal, 'bg_pre_meal');
  ensureNumber(req.bg_post_meal, 'bg_post_meal');
  ensureNumber(req.carbs_consumed_g, 'carbs_consumed_g');
  ensureNumber(req.bolus_dose_units, 'bolus_dose_units');
  ensureNumber(req.carbohydrate_ratio, 'carbohydrate_ratio');
  ensureNumber(req.correction_factor, 'correction_factor');
  let plan;
  if(req.bg_post_meal - req.bg_pre_meal > 50) plan='continue_with_tighten_ratio_then_reassess';
  else if(req.bg_post_meal - req.bg_pre_meal < -30) plan='continue_with_relax_ratio_then_reassess';
  else if(req.correction_factor<30) plan='continue_with_review_cf_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cgm_review(req){
  ensureNumber(req.tir_pct, 'tir_pct');
  ensureNumber(req.tbr_pct, 'tbr_pct');
  ensureNumber(req.tar_pct, 'tar_pct');
  ensureNumber(req.gmi_pct, 'gmi_pct');
  ensureNumber(req.cv_pct, 'cv_pct');
  ensureBool(req.sensor_active_recently, 'sensor_active_recently');
  let plan;
  if(req.tir_pct<70) plan='continue_with_review_then_reassess';
  else if(req.tbr_pct>4) plan='continue_with_reduce_aggressive_then_reassess';
  else if(req.gmi_pct>=7.5) plan='continue_with_optimize_then_reassess';
  else if(req.cv_pct>=36) plan='continue_with_review_variability_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function hybrid_closed_loop(req){
  ensureBool(req.pump_hcl_compatible, 'pump_hcl_compatible');
  ensureBool(req.cgm_hcl_compatible, 'cgm_hcl_compatible');
  ensureBool(req.algorithm_activated, 'algorithm_activated');
  ensureNumber(req.tir_with_hcl_pct, 'tir_with_hcl_pct');
  ensureNumber(req.tir_baseline_pct, 'tir_baseline_pct');
  ensureBool(req.hypoglycemia_reduced, 'hypoglycemia_reduced');
  let plan;
  if(req.algorithm_activated===false) plan='continue_with_activate_then_reassess';
  else if(req.tir_with_hcl_pct-req.tir_baseline_pct<5) plan='continue_with_review_then_reassess';
  else if(!req.hypoglycemia_reduced) plan='continue_with_aggressive_settings_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pump_failure(req){
  ensureStr(req.failure_type, 'failure_type');
  ensureEnum(req.failure_type, 'failure_type', ['occlusion','no_delivery','battery','screen','button','software_glitch','site_failure','unknown']);
  ensureBool(req.ketones_checked, 'ketones_checked');
  ensureNumber(req.bg_value, 'bg_value');
  ensureBool(req.manual_injection_backup, 'manual_injection_backup');
  ensureBool(req.replacement_available, 'replacement_available');
  let plan;
  if(req.ketones_checked===false && req.bg_value>=250) plan='continue_with_check_ketones_then_reassess';
  else if(req.failure_type==='occlusion') plan='continue_with_change_site_then_reassess';
  else if(req.replacement_available===false) plan='continue_with_obtain_replacement_then_reassess';
  else plan='continue_with_replace_pump_then_reassess';
  return {plan};
}
function funcs(){return {pump_candidate,basal_rate,carb_ratio,cgm_review,hybrid_closed_loop,pump_failure};}
module.exports={funcs,CITATIONS,ValidationError};
