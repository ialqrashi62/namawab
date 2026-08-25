// filepath: tier5_pmrehab_ext_104_amputee_engine.js
// TIER5_PMREHAB_EXT-104: Amputee (prosthetic prescription, gait, residual limb, return)
'use strict';
const CITATIONS = ['ACP_Amputee_2017','AAOP_Prosthetics_2018','ISPO_Gait_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function prosthetic_prescription(req){
  ensureStr(req.level, 'level');
  ensureEnum(req.level, 'level', ['trans_tibial','trans_femoral','trans_humeral','trans_radial','partial_foot','partial_hand','hip_disarticulation','knee_disarticulation']);
  ensureNumber(req.k_level, 'k_level');
  ensureBool(req.dominant_side, 'dominant_side');
  ensureBool(req.comorbidities_significant, 'comorbidities_significant');
  ensureNumber(req.age, 'age');
  let plan;
  if(req.k_level<=1) plan='low_function_then_consider_basic_prosthesis_with_k1_components';
  else if(req.k_level===2) plan='limited_community_then_k2_components_with_rehab';
  else if(req.k_level===3) plan='community_ambulator_then_k3_components';
  else if(req.k_level===4) plan='high_function_then_k4_components_with_running_considerations';
  else plan='continue_with_assessment';
  if(req.comorbidities_significant) plan+='_consider_lower_function_components';
  return {plan};
}
function gait_deviation(req){
  ensureBool(req.trunk_lateral_shift, 'trunk_lateral_shift');
  ensureBool(req.circumduction, 'circumduction');
  ensureBool(req.vaulting, 'vaulting');
  ensureBool(req.lateral_trunk_bend, 'lateral_trunk_bend');
  ensureNumber(req.walking_speed_m_per_s, 'walking_speed_m_per_s');
  let plan;
  if(req.trunk_lateral_shift) plan='sound_side_initiated_then_review_socket_fit';
  else if(req.circumduction) plan='reduce_swing_clearance_then_check_pylon_length';
  else if(req.vaulting) plan='reduce_clearance_then_check_suspension';
  else if(req.lateral_trunk_bend) plan='abductor_weakness_then_review_socket';
  else plan='continue_with_observation_then_reassess';
  if(req.walking_speed_m_per_s<0.4) plan+='_consider_lower_components';
  return {plan};
}
function residual_limb(req){
  ensureBool(req.wound_present, 'wound_present');
  ensureNumber(req.skin_breakdown_stage, 'skin_breakdown_stage');
  ensureBool(req.bone_spur_present, 'bone_spur_present');
  ensureBool(req.volume_fluctuation, 'volume_fluctuation');
  ensureBool(req.shrink_wearing_appropriate, 'shrink_wearing_appropriate');
  let plan;
  if(req.wound_present && req.skin_breakdown_stage>=2) plan='wound_care_then_offload_then_resume_prosthesis_after_healing';
  else if(req.bone_spur_present) plan='refer_surgery_for_residual_limb_revision';
  else if(req.volume_fluctuation) plan='volume_management_with_shrinker_then_reassess';
  else if(req.shrink_wearing_appropriate===false) plan='continue_shrinker_wear_then_reassess_in_2_weeks';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prosthetic_training(req){
  ensureNumber(req.weeks_post_fitting, 'weeks_post_fitting');
  ensureNumber(req.balance_score, 'balance_score');
  ensureBool(req.parallel_bar_done, 'parallel_bar_done');
  ensureBool(req.single_limb_balance_30s, 'single_limb_balance_30s');
  ensureBool(req.community_ambulation_achieved, 'community_ambulation_achieved');
  let plan;
  if(req.weeks_post_fitting<2) plan='early_then_continue_with_parallel_bars';
  else if(req.single_limb_balance_30s===false) plan='continue_balance_training_then_reassess';
  else if(req.community_ambulation_achieved===false) plan='continue_community_walk_then_reassess';
  else plan='continue_with_advanced_progression_then_return_to_recreation';
  return {plan};
}
function return_to_work(req){
  ensureBool(req.heavy_lifting_required, 'heavy_lifting_required');
  ensureNumber(req.hours_per_day_required, 'hours_per_day_required');
  ensureBool(req.prosthesis_well_fitted, 'prosthesis_well_fitted');
  ensureBool(req.phantom_pain_severe, 'phantom_pain_severe');
  ensureBool(req.employer_accommodations, 'employer_accommodations');
  let plan;
  if(req.phantom_pain_severe) plan='refer_pain_clinic_then_reassess';
  else if(req.heavy_lifting_required && req.prosthesis_well_fitted===false) plan='reassess_fit_then_review_work_duties';
  else if(req.employer_accommodations===false) plan='vocational_rehab_then_negotiate_return';
  else plan='continue_with_work_then_progress_to_full_duties';
  return {plan};
}
function phantom_pain(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.mirror_therapy_done, 'mirror_therapy_done');
  ensureBool(req.gabapentinoids_tried, 'gabapentinoids_tried');
  ensureBool(req.tens_tried, 'tens_tried');
  ensureNumber(req.weeks_since_amputation, 'weeks_since_amputation');
  let plan;
  if(req.pain_score>=7 && req.gabapentinoids_tried===false) plan='initiate_gabapentin_then_reassess';
  else if(req.pain_score>=7) plan='refer_pain_clinic_then_consider_peripheral_nerve_block';
  else if(req.mirror_therapy_done===false) plan='initiate_mirror_therapy_then_reassess';
  else if(req.tens_tried===false) plan='initiate_tens_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {prosthetic_prescription,gait_deviation,residual_limb,prosthetic_training,return_to_work,phantom_pain};}
module.exports={funcs,CITATIONS,ValidationError};
