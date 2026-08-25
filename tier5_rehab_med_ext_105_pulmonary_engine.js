// filepath: tier5_rehab_med_ext_105_pulmonary_engine.js
// TIER5_REHAB_MED_EXT-105: Pulmonary rehab
'use strict';
const CITATIONS = ['ATS_PulmonaryRehab_2020','GOLD_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assessment(req){
  ensureNumber(req.fev1_pct, 'fev1_pct');
  ensureNumber(req.dlco_pct, 'dlco_pct');
  ensureNumber(req.six_min_walk_m, 'six_min_walk_m');
  ensureNumber(req.mmrc_dyspnea, 'mmrc_dyspnea');
  ensureBool(req.exacerbation_history, 'exacerbation_history');
  ensureBool(req.oxygen_dependence, 'oxygen_dependence');
  ensureBool(req.tabacco_current, 'tabacco_current');
  let plan;
  if(req.mmrc_dyspnea>=3 && req.exacerbation_history) plan='continue_with_supervised_then_reassess';
  else if(req.fev1_pct<50) plan='continue_with_close_then_reassess';
  else if(req.tabacco_current) plan='continue_with_cessation_then_reassess';
  else if(req.six_min_walk_m<350) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exercise_prescription(req){
  ensureNumber(req.hr_target, 'hr_target');
  ensureNumber(req.spo2_target, 'spo2_target');
  ensureBool(req.limitation_cardiac, 'limitation_cardiac');
  ensureBool(req.limitation_pulmonary, 'limitation_pulmonary');
  ensureBool(req.limitation_musculoskeletal, 'limitation_musculoskeletal');
  ensureBool(req.limitation_fatigue, 'limitation_fatigue');
  ensureBool(req.warm_up_done, 'warm_up_done');
  let plan;
  if(req.spo2_target<88) plan='continue_with_oxygen_then_reassess';
  else if(req.limitation_cardiac) plan='continue_with_cardiac_clear_then_reassess';
  else if(req.limitation_musculoskeletal) plan='continue_with_modify_then_reassess';
  else if(req.warm_up_done===false) plan='continue_with_warmup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function education(req){
  ensureBool(req.disease_understanding, 'disease_understanding');
  ensureBool(req.medication_understanding, 'medication_understanding');
  ensureBool(req.inhaler_technique, 'inhaler_technique');
  ensureBool(req.breathing_techniques, 'breathing_techniques');
  ensureBool(req.energy_conservation, 'energy_conservation');
  ensureBool(req.exacerbation_action_plan, 'exacerbation_action_plan');
  let plan;
  if(req.disease_understanding===false) plan='continue_with_education_then_reassess';
  else if(req.inhaler_technique===false) plan='continue_with_teach_then_reassess';
  else if(req.breathing_techniques===false) plan='continue_with_breathing_then_reassess';
  else if(req.exacerbation_action_plan===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function oxygen(req){
  ensureBool(req.rest_oxygen_needed, 'rest_oxygen_needed');
  ensureBool(req.exertional_oxygen_needed, 'exertional_oxygen_needed');
  ensureBool(req.sleep_oxygen_needed, 'sleep_oxygen_needed');
  ensureBool(req.oxygen_prescribed, 'oxygen_prescribed');
  ensureBool(req.oxygen_education, 'oxygen_education');
  ensureBool(req.oxygen_use_reviewed, 'oxygen_use_reviewed');
  let plan;
  if(req.rest_oxygen_needed && req.oxygen_prescribed===false) plan='continue_with_prescribe_then_reassess';
  else if(req.exertional_oxygen_needed && req.oxygen_prescribed===false) plan='continue_with_prescribe_then_reassess';
  else if(req.oxygen_education===false) plan='continue_with_educate_then_reassess';
  else if(req.oxygen_use_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exacerbation(req){
  ensureNumber(req.days_since_exac, 'days_since_exac');
  ensureBool(req.hospitalization, 'hospitalization');
  ensureBool(req.oxygen_required, 'oxygen_required');
  ensureBool(req.steroid_burst, 'steroid_burst');
  ensureBool(req.recovery_status, 'recovery_status');
  ensureBool(req.rehab_tolerated, 'rehab_tolerated');
  let plan;
  if(req.days_since_exac<14) plan='continue_with_hold_then_reassess';
  else if(req.oxygen_required) plan='continue_with_maintain_then_reassess';
  else if(req.recovery_status===false) plan='continue_with_review_then_reassess';
  else if(req.rehab_tolerated===false) plan='continue_with_modify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function psychosocial(req){
  ensureBool(req.depression_screened, 'depression_screened');
  ensureBool(req.anxiety_screened, 'anxiety_screened');
  ensureBool(req.dyspnea_fear, 'dyspnea_fear');
  ensureBool(req.social_isolation, 'social_isolation');
  ensureBool(req.intimacy_discussed, 'intimacy_discussed');
  ensureBool(req.psych_referral, 'psych_referral');
  let plan;
  if(req.depression_screened===false) plan='continue_with_screen_then_reassess';
  else if(req.dyspnea_fear) plan='continue_with_address_then_reassess';
  else if(req.social_isolation) plan='continue_with_support_then_reassess';
  else if(req.psych_referral===false) plan='continue_with_referral_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assessment,exercise_prescription,education,oxygen,exacerbation,psychosocial};}
module.exports={funcs,CITATIONS,ValidationError};
