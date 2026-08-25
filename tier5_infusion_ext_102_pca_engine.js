// filepath: tier5_infusion_ext_102_pca_engine.js
// TIER5_INFUSION_EXT-102: PCA / epidural analgesia
'use strict';
const CITATIONS = ['ASA_Acute_Pain_2019','ASRA_Regional_2018','AANA_PCA_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pca_assess(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureNumber(req.demands_count, 'demands_count');
  ensureNumber(req.delivered_count, 'delivered_count');
  ensureNumber(req.bolus_dose_mg, 'bolus_dose_mg');
  ensureNumber(req.lockout_min, 'lockout_min');
  ensureBool(req.respiratory_depression, 'respiratory_depression');
  ensureNumber(req.sedation_score, 'sedation_score');
  let plan;
  if(req.respiratory_depression) plan='continue_with_hold_pca_then_reassess';
  else if(req.sedation_score>=3) plan='continue_with_hold_pca_then_reassess';
  else if(req.pain_score>=7 && req.demands_count>10) plan='continue_with_increase_bolus_then_reassess';
  else if(req.pain_score>=4) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function epidural(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureNumber(req.level_block, 'level_block');
  ensureBool(req.motor_block, 'motor_block');
  ensureBool(req.hypotension, 'hypotension');
  ensureNumber(req.bp_systolic, 'bp_systolic');
  ensureNumber(req.local_anesthetic_pct, 'local_anesthetic_pct');
  ensureBool(req.anticoagulation_active, 'anticoagulation_active');
  let plan;
  if(req.bp_systolic<90) plan='continue_with_reduce_then_reassess';
  else if(req.motor_block) plan='continue_with_reduce_concentration_then_reassess';
  else if(req.anticoagulation_active) plan='continue_with_review_removal_then_reassess';
  else if(req.pain_score>=7) plan='continue_with_increase_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nerve_catheter(req){
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['femoral','interscalene','axillary','popliteal','sciatic','lumbar_plexus']);
  ensureNumber(req.days_since_placement, 'days_since_placement');
  ensureBool(req.pump_flow_adequate, 'pump_flow_adequate');
  ensureBool(req.infection_signs, 'infection_signs');
  ensureNumber(req.bolus_volume_ml_per_hr, 'bolus_volume_ml_per_hr');
  ensureBool(req.patient_ambulating, 'patient_ambulating');
  let plan;
  if(req.infection_signs) plan='continue_with_remove_then_reassess';
  else if(req.days_since_placement>=7) plan='continue_with_review_removal_then_reassess';
  else if(req.pump_flow_adequate===false) plan='continue_with_check_pump_then_reassess';
  else if(req.patient_ambulating===false) plan='continue_with_rehab_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioid_rotation_pca(req){
  ensureNumber(req.current_opioid_mme, 'current_opioid_mme');
  ensureBool(req.opioid_tolerance, 'opioid_tolerance');
  ensureNumber(req.pain_score_avg, 'pain_score_avg');
  ensureNumber(req.basal_rate_mg_per_hr, 'basal_rate_mg_per_hr');
  ensureNumber(req.demands_per_hour, 'demands_per_hour');
  ensureBool(req.rotation_appropriate, 'rotation_appropriate');
  let plan;
  if(req.opioid_tolerance===false && req.current_opioid_mme>=30) plan='continue_with_review_then_reassess';
  else if(req.pain_score_avg>=7 && req.demands_per_hour>=3) plan='continue_with_increase_basal_then_reassess';
  else if(req.rotation_appropriate) plan='continue_with_consider_rotation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioid_to_non_opioid(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.iv_acetaminophen_active, 'iv_acetaminophen_active');
  ensureBool(req.oral_analgesic_active, 'oral_analgesic_active');
  ensureBool(req.pca_use_decreasing, 'pca_use_decreasing');
  ensureNumber(req.days_post_op, 'days_post_op');
  ensureBool(req.gi_functioning, 'gi_functioning');
  let plan;
  if(req.gi_functioning && req.oral_analgesic_active===false) plan='continue_with_oral_then_reassess';
  else if(req.iv_acetaminophen_active===false) plan='continue_with_iv_acetaminophen_then_reassess';
  else if(req.pca_use_decreasing) plan='continue_with_wean_pca_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pca_safety(req){
  ensureBool(req.dual_pca_running, 'dual_pca_running');
  ensureBool(req.family_activating_pca, 'family_activating_pca');
  ensureBool(req.programming_verified, 'programming_verified');
  ensureBool(req.pump_locked, 'pump_locked');
  ensureBool(req.sedation_monitored, 'sedation_monitored');
  ensureBool(req.oxygen_supplement, 'oxygen_supplement');
  let plan;
  if(req.dual_pca_running) plan='continue_with_urgent_stop_then_reassess';
  else if(req.family_activating_pca) plan='continue_with_education_then_reassess';
  else if(req.programming_verified===false) plan='continue_with_verify_then_reassess';
  else if(req.pump_locked===false) plan='continue_with_lock_then_reassess';
  else if(req.sedation_monitored===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pca_assess,epidural,nerve_catheter,opioid_rotation_pca,opioid_to_non_opioid,pca_safety};}
module.exports={funcs,CITATIONS,ValidationError};
