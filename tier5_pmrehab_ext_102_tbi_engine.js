// filepath: tier5_pmrehab_ext_102_tbi_engine.js
// TIER5_PMREHAB_EXT-102: TBI rehab (GCS, PTA, agitation, fatigue, RTP sports)
'use strict';
const CITATIONS = ['ACRM_TBI_2020','CDC_Mild_TBI_2018','AAN_Second_Impact_2013'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function gcs_assess(req){
  ensureNumber(req.eye, 'eye');
  ensureNumber(req.verbal, 'verbal');
  ensureNumber(req.motor, 'motor');
  ensureNumber(req.intubated, 'intubated'); // 0 no 1 yes
  let gcs_total = req.eye + req.verbal + req.motor;
  let severity;
  if(req.intubated===1) severity='intubated_then_use_gcs_with_verbal_1_then_continue';
  else if(gcs_total<=8) severity='severe_tbi_then_neurosurgical_review';
  else if(gcs_total<=12) severity='moderate_tbi_then_observation_then_rehab_referral';
  else severity='mild_tbi_then_discharge_with_concussion_protocol';
  return {gcs_total, severity};
}
function pta_screen(req){
  ensureNumber(req.pta_days, 'pta_days');
  ensureNumber(req.age, 'age');
  ensureNumber(req.gcs_lowest, 'gcs_lowest');
  ensureBool(req.employment_at_injury, 'employment_at_injury');
  ensureBool(req.disorientation_present, 'disorientation_present');
  let plan;
  if(req.pta_days>=7) plan='severe_then_comprehensive_rehab_with_multidisciplinary_team';
  else if(req.pta_days>=1) plan='moderate_then_rehab_with_cognitive_intervention';
  else plan='mild_then_concussion_clinic_with_graded_return';
  if(req.age>=65 && req.gcs_lowest<=8) plan+='_consider_lower_intensity';
  return {plan};
}
function agitation_manage(req){
  ensureNumber(req.abas_score, 'abas_score');
  ensureBool(req.triggers_identified, 'triggers_identified');
  ensureBool(req.medication_tried, 'medication_tried');
  ensureBool(req.environment_modified, 'environment_modified');
  ensureNumber(req.days_post_injury, 'days_post_injury');
  let plan;
  if(req.abas_score>=49) plan='severe_then_refer_psychiatry_with_medication_review';
  else if(req.abas_score>=21) plan='moderate_then_environmental_modifications_with_behavioral_plan';
  else plan='mild_then_continue_with_observation';
  if(!req.triggers_identified) plan+='_identify_triggers';
  if(!req.environment_modified) plan+='_modify_environment';
  return {plan};
}
function fatigue_mgmt(req){
  ensureNumber(req.fss_score, 'fss_score');
  ensureBool(req.sleep_disturbance, 'sleep_disturbance');
  ensureBool(req.medications_contributing, 'medications_contributing');
  ensureBool(req.cognitive_load, 'cognitive_load');
  ensureNumber(req.months_post_injury, 'months_post_injury');
  let plan;
  if(req.fss_score>=36) plan='severe_then_energy_management_with_pacing';
  else if(req.sleep_disturbance) plan='review_sleep_hygiene_then_reassess';
  else if(req.medications_contributing) plan='review_medications_then_reduce_offending_agents';
  else if(req.cognitive_load) plan='cognitive_load_reduction_then_workstation_modifications';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rtp_sport(req){
  ensureNumber(req.days_post_injury, 'days_post_injury');
  ensureBool(req.symptom_free_at_rest, 'symptom_free_at_rest');
  ensureBool(req.cognitive_test_passed, 'cognitive_test_passed');
  ensureBool(req.balance_test_passed, 'balance_test_passed');
  ensureBool(req.graded_protocol_done, 'graded_protocol_done');
  let plan;
  if(req.symptom_free_at_rest===false) plan='continue_rest_then_reassess_daily';
  else if(req.days_post_injury<7) plan='too_early_then_reassess_after_one_week';
  else if(req.cognitive_test_passed===false) plan='continue_with_cognitive_rehab_then_reassess';
  else if(req.balance_test_passed===false) plan='continue_with_balance_training_then_reassess';
  else if(req.graded_protocol_done===false) plan='continue_with_graduated_protocol_then_reassess';
  else plan='full_clearance_then_return_to_play';
  return {plan};
}
function post_concussion(req){
  ensureNumber(req.symptoms_count, 'symptoms_count');
  ensureBool(req.headache_persistent, 'headache_persistent');
  ensureBool(req.cognitive_complaint, 'cognitive_complaint');
  ensureBool(req.emotional_change, 'emotional_change');
  ensureNumber(req.weeks_post_injury, 'weeks_post_injury');
  let plan;
  if(req.weeks_post_injury>12 && req.symptoms_count>=3) plan='post_concussion_syndrome_then_refer_concussion_clinic';
  else if(req.headache_persistent) plan='headache_then_refer_neurology_with_medication_review';
  else if(req.cognitive_complaint) plan='cognitive_then_cognitive_rehab_with_strategy_training';
  else if(req.emotional_change) plan='emotional_then_psychology_referral_with_medication_review';
  else plan='continue_with_observation_then_reassess_in_4_weeks';
  return {plan};
}
function funcs(){return {gcs_assess,pta_screen,agitation_manage,fatigue_mgmt,rtp_sport,post_concussion};}
module.exports={funcs,CITATIONS,ValidationError};
