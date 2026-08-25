// filepath: tier5_rehab_med_ext_101_amputee_engine.js
// TIER5_REHAB_MED_EXT-101: Amputee rehab
'use strict';
const CITATIONS = ['AAP_Amputee_2020','VA_Amputee_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function preprosth(req){
  ensureStr(req.level, 'level');
  ensureEnum(req.level, 'level', ['trans_tibial','trans_femoral','knee_disartic','hip_disartic','partial_foot','trans_metatarsal','trans_humeral','trans_radial','shoulder_disartic','partial_hand','forequarter']);
  ensureNumber(req.days_post_op, 'days_post_op');
  ensureBool(req.residual_limb_healed, 'residual_limb_healed');
  ensureBool(req.wound_intact, 'wound_intact');
  ensureBool(req.residual_limb_shape, 'residual_limb_shape');
  ensureBool(req.skin_condition, 'skin_condition');
  let plan;
  if(req.days_post_op<14) plan='continue_with_wound_care_then_reassess';
  else if(req.residual_limb_healed===false) plan='continue_with_wound_then_reassess';
  else if(req.wound_intact===false) plan='continue_with_wound_then_reassess';
  else if(req.skin_condition===false) plan='continue_with_skin_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prosthetic(req){
  ensureStr(req.level, 'level');
  ensureEnum(req.level, 'level', ['trans_tibial','trans_femoral','knee_disartic','hip_disartic','partial_foot','trans_metatarsal','trans_humeral','trans_radial','shoulder_disartic','partial_hand','forequarter']);
  ensureNumber(req.days_of_use, 'days_of_use');
  ensureNumber(req.hours_per_day, 'hours_per_day');
  ensureBool(req.fit_acceptable, 'fit_acceptable');
  ensureBool(req.comfortable, 'comfortable');
  ensureBool(req.gait_quality, 'gait_quality');
  ensureNumber(req.mobility_level, 'mobility_level');
  let plan;
  if(req.hours_per_day<4) plan='continue_with_optimize_then_reassess';
  else if(req.fit_acceptable===false) plan='continue_with_refit_then_reassess';
  else if(req.comfortable===false) plan='continue_with_review_then_reassess';
  else if(req.gait_quality===false) plan='continue_with_gait_training_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function gait(req){
  ensureBool(req.weight_bearing_appropriate, 'weight_bearing_appropriate');
  ensureBool(req.stance_phase_symmetric, 'stance_phase_symmetric');
  ensureBool(req.swing_phase_controlled, 'swing_phase_controlled');
  ensureBool(req.trunk_lean, 'trunk_lean');
  ensureBool(req.step_length_symmetric, 'step_length_symmetric');
  ensureBool(req.cadence_appropriate, 'cadence_appropriate');
  let plan;
  if(req.weight_bearing_appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.trunk_lean) plan='continue_with_cadence_then_reassess';
  else if(req.stance_phase_symmetric===false) plan='continue_with_train_then_reassess';
  else if(req.swing_phase_controlled===false) plan='continue_with_control_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function phantom_pain(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureNumber(req.frequency_per_day, 'frequency_per_day');
  ensureBool(req.mirror_therapy, 'mirror_therapy');
  ensureBool(req.gabapentin, 'gabapentin');
  ensureBool(req.tens, 'tens');
  ensureBool(req.desensitization, 'desensitization');
  let plan;
  if(req.pain_score>=7) plan='continue_with_optimize_then_reassess';
  else if(req.gabapentin===false) plan='continue_with_trial_then_reassess';
  else if(req.mirror_therapy===false) plan='continue_with_therapy_then_reassess';
  else if(req.tens===false) plan='continue_with_tens_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function residual_skin(req){
  ensureBool(req.breakdown, 'breakdown');
  ensureBool(req.dermatitis, 'dermatitis');
  ensureBool(req.blister, 'blister');
  ensureBool(req.suspension_appropriate, 'suspension_appropriate');
  ensureBool(req.cleansing_routine, 'cleansing_routine');
  ensureBool(req.breakdown_history, 'breakdown_history');
  let plan;
  if(req.breakdown) plan='continue_with_off_then_reassess';
  else if(req.dermatitis) plan='continue_with_treatment_then_reassess';
  else if(req.suspension_appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.cleansing_routine===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function home_safety(req){
  ensureBool(req.ramp_present, 'ramp_present');
  ensureBool(req.bathroom_modifications, 'bathroom_modifications');
  ensureBool(req.doorways_widened, 'doorways_widened');
  ensureBool(req.fall_prevention, 'fall_prevention');
  ensureBool(req.transfer_training, 'transfer_training');
  ensureBool(req.caregiver_education, 'caregiver_education');
  let plan;
  if(req.ramp_present===false) plan='continue_with_install_then_reassess';
  else if(req.bathroom_modifications===false) plan='continue_with_modify_then_reassess';
  else if(req.fall_prevention===false) plan='continue_with_assess_then_reassess';
  else if(req.caregiver_education===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {preprosth,prosthetic,gait,phantom_pain,residual_skin,home_safety};}
module.exports={funcs,CITATIONS,ValidationError};
