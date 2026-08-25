// filepath: tier5_wound_ostomy_ext_106_dfoot_engine.js
// TIER5_WOUND_OSTOMY_EXT-106: Diabetic foot
'use strict';
const CITATIONS = ['IWGDF_2019','ADA_Foot_2020','NICE_DiabeticFoot_2015'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function risk(req){
  ensureBool(req.peripheral_neuropathy, 'peripheral_neuropathy');
  ensureBool(req.peripheral_arterial_disease, 'peripheral_arterial_disease');
  ensureBool(req.foot_deformity, 'foot_deformity');
  ensureNumber(req.hba1c_pct, 'hba1c_pct');
  ensureBool(req.foot_ulcer_history, 'foot_ulcer_history');
  ensureBool(req.amputation_history, 'amputation_history');
  ensureBool(req.annual_screening_documented, 'annual_screening_documented');
  let plan;
  if(req.amputation_history) plan='continue_with_team_consult_then_reassess';
  else if(req.foot_ulcer_history || req.foot_deformity) plan='continue_with_offload_then_reassess';
  else if(req.peripheral_neuropathy && req.peripheral_arterial_disease) plan='continue_with_close_followup_then_reassess';
  else if(req.hba1c_pct>=9) plan='continue_with_diabetes_optimize_then_reassess';
  else plan='continue_with_annual_then_reassess';
  return {plan};
}
function ulcer(req){
  ensureStr(req.wagner_grade, 'wagner_grade');
  ensureEnum(req.wagner_grade, 'wagner_grade', ['grade_0','grade_1','grade_2','grade_3','grade_4','grade_5']);
  ensureBool(req.infection_signs, 'infection_signs');
  ensureBool(req.pvd_signs, 'pvd_signs');
  ensureBool(req.offloading, 'offloading');
  ensureBool(req.debridement_done, 'debridement_done');
  ensureBool(req.glycemic_control, 'glycemic_control');
  let plan;
  if(req.wagner_grade==='grade_4' || req.wagner_grade==='grade_5') plan='continue_with_amputation_eval_then_reassess';
  else if(req.wagner_grade==='grade_3') plan='continue_with_urgent_then_reassess';
  else if(req.infection_signs) plan='continue_with_iv_abx_then_reassess';
  else if(req.offloading===false) plan='continue_with_offload_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vascular(req){
  ensureNumber(req.ankle_brachial_index, 'ankle_brachial_index');
  ensureBool(req.palpable_pulses, 'palpable_pulses');
  ensureBool(req.claudication, 'claudication');
  ensureBool(req.rest_pain, 'rest_pain');
  ensureBool(req.tissue_loss, 'tissue_loss');
  ensureBool(req.duplex_ultrasound, 'duplex_ultrasound');
  let plan;
  if(req.ankle_brachial_index<0.4) plan='continue_with_vascular_consult_then_reassess';
  else if(req.rest_pain || req.tissue_loss) plan='continue_with_vascular_consult_then_reassess';
  else if(req.ankle_brachial_index<0.9) plan='continue_with_imaging_then_reassess';
  else if(req.duplex_ultrasound===false) plan='continue_with_duplex_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function neuropathic(req){
  ensureBool(req.loss_of_protective_sensation, 'loss_of_protective_sensation');
  ensureBool(req.burning_pain, 'burning_pain');
  ensureBool(req.allodynia, 'allodynia');
  ensureBool(req.autonomic_dysfunction, 'autonomic_dysfunction');
  ensureBool(req.gabapentinoid_trial, 'gabapentinoid_trial');
  ensureBool(req.tca_trial, 'tca_trial');
  let plan;
  if(req.loss_of_protective_sensation===false) plan='continue_with_reassess_then_reassess';
  else if(req.gabapentinoid_trial===false) plan='continue_with_trial_then_reassess';
  else if(req.burning_pain && req.tca_trial===false) plan='continue_with_tca_then_reassess';
  else if(req.allodynia) plan='continue_with_specialist_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function offloading(req){
  ensureStr(req.method, 'method');
  ensureEnum(req.method, 'method', ['total_contact_cast','removable_walker','shoe','sandal','custom_shoe','wheelchair','crutches']);
  ensureBool(req.compliance, 'compliance');
  ensureBool(req.wearable, 'wearable');
  ensureBool(req.foot_skin_intact, 'foot_skin_intact');
  ensureNumber(req.hours_per_day_worn, 'hours_per_day_worn');
  let plan;
  if(req.foot_skin_intact===false) plan='continue_with_alternative_then_reassess';
  else if(req.method==='shoe' || req.method==='sandal') plan='continue_with_strict_offload_then_reassess';
  else if(req.hours_per_day_worn<20) plan='continue_with_compliance_then_reassess';
  else if(req.compliance===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function charcot(req){
  ensureBool(req.swelling, 'swelling');
  ensureBool(req.warmth, 'warmth');
  ensureBool(req.erythema, 'erythema');
  ensureBool(req.rocker_bottom, 'rocker_bottom');
  ensureBool(req.neuropathy_present, 'neuropathy_present');
  ensureBool(req.mri_done, 'mri_done');
  ensureBool(req.total_contact_cast, 'total_contact_cast');
  let plan;
  if(req.rocker_bottom) plan='continue_with_surgical_eval_then_reassess';
  else if(req.swelling && req.warmth && req.erythema) plan='continue_with_immobilize_then_reassess';
  else if(req.mri_done===false) plan='continue_with_mri_then_reassess';
  else if(req.total_contact_cast===false) plan='continue_with_cast_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {risk,ulcer,vascular,neuropathic,offloading,charcot};}
module.exports={funcs,CITATIONS,ValidationError};
