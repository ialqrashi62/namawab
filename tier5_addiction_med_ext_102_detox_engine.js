// filepath: tier5_addiction_med_ext_102_detox_engine.js
// TIER5_ADDICTION_MED_EXT-102: Withdrawal/detox
'use strict';
const CITATIONS = ['ASAM_Detox_2020','CIWA_Arif_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function ciwa(req){
  ensureNumber(req.ciwa_score, 'ciwa_score');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureBool(req.tactile_disturbances, 'tactile_disturbances');
  ensureBool(req.auditory_disturbances, 'auditory_disturbances');
  ensureBool(req.visual_disturbances, 'visual_disturbances');
  ensureBool(req.orientation_clouding, 'orientation_clouding');
  let plan;
  if(req.ciwa_score>=20) plan='continue_with_urgent_benzodiazepine_then_reassess';
  else if(req.ciwa_score>=10) plan='continue_with_symptomatic_then_reassess';
  else if(req.ciwa_score>=8) plan='continue_with_medication_then_reassess';
  else if(req.orientation_clouding) plan='continue_with_detox_med_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cows(req){
  ensureNumber(req.cows_score, 'cows_score');
  ensureNumber(req.pulse_rate, 'pulse_rate');
  ensureNumber(req.diastolic_bp, 'diastolic_bp');
  ensureNumber(req.pupil_size, 'pupil_size');
  ensureNumber(req.bone_joint_aches, 'bone_joint_aches');
  ensureBool(req.yawning, 'yawning');
  ensureBool(req.gi_upset, 'gi_upset');
  let plan;
  if(req.cows_score>=36) plan='continue_with_urgent_review_then_reassess';
  else if(req.cows_score>=25) plan='continue_with_mat_then_reassess';
  else if(req.cows_score>=13) plan='continue_with_symptomatic_then_reassess';
  else if(req.cows_score>=5) plan='continue_with_monitoring_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function benzo(req){
  ensureStr(req.benzo, 'benzo');
  ensureEnum(req.benzo, 'benzo', ['diazepam','chlordiazepoxide','lorazepam','oxazepam','clonazepam','none']);
  ensureNumber(req.daily_dose_equivalent, 'daily_dose_equivalent');
  ensureNumber(req.years_use, 'years_use');
  ensureBool(req.seizure_history, 'seizure_history');
  ensureBool(req.taper_started, 'taper_started');
  ensureBool(req.comorbidities, 'comorbidities');
  let plan;
  if(req.seizure_history && req.taper_started===false) plan='continue_with_start_taper_then_reassess';
  else if(req.daily_dose_equivalent>=40) plan='continue_with_long_taper_then_reassess';
  else if(req.years_use>=10) plan='continue_with_slow_taper_then_reassess';
  else if(req.comorbidities) plan='continue_with_consider_long_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function alc_med(req){
  ensureBool(req.benzos_given, 'benzos_given');
  ensureBool(req.anticonvulsants_given, 'anticonvulsants_given');
  ensureBool(req.thiamine_given, 'thiamine_given');
  ensureBool(req.folate_given, 'folate_given');
  ensureBool(req.monitoring, 'monitoring');
  ensureBool(req.adjunct_meds, 'adjunct_meds');
  let plan;
  if(req.thiamine_given===false) plan='continue_with_thiamine_then_reassess';
  else if(req.benzos_given===false) plan='continue_with_benzos_then_reassess';
  else if(req.monitoring===false) plan='continue_with_monitor_then_reassess';
  else if(req.folate_given===false) plan='continue_with_folate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioid_med(req){
  ensureBool(req.buprenorphine_induction, 'buprenorphine_induction');
  ensureNumber(req.last_use_hours, 'last_use_hours');
  ensureNumber(req.cows_score, 'cows_score');
  ensureBool(req.methadone_evaluated, 'methadone_evaluated');
  ensureBool(req.naloxone_prescribed, 'naloxone_prescribed');
  ensureBool(req.withdrawal_adequate, 'withdrawal_adequate');
  let plan;
  if(req.cows_score<8 && req.buprenorphine_induction) plan='continue_with_wait_then_reassess';
  else if(req.last_use_hours<24 && req.buprenorphine_induction) plan='continue_with_wait_then_reassess';
  else if(req.buprenorphine_induction===false) plan='continue_with_induction_then_reassess';
  else if(req.naloxone_prescribed===false) plan='continue_with_naloxone_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function setting(req){
  ensureStr(req.level, 'level');
  ensureEnum(req.level, 'level', ['level_1_ambulatory','level_2_ambulatory_ip','level_3_managed_ip','level_4_medically_managed_ip']);
  ensureBool(req.medical_support, 'medical_support');
  ensureBool(req.availability_24_7, 'availability_24_7');
  ensureBool(req.behavioral_support, 'behavioral_support');
  ensureBool(req.peer_support, 'peer_support');
  let plan;
  if(req.level==='level_4_medically_managed_ip' && req.medical_support===false) plan='continue_with_medical_then_reassess';
  else if(req.availability_24_7===false) plan='continue_with_24_7_then_reassess';
  else if(req.behavioral_support===false) plan='continue_with_behavioral_then_reassess';
  else if(req.peer_support===false) plan='continue_with_peer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {ciwa,cows,benzo,alc_med,opioid_med,setting};}
module.exports={funcs,CITATIONS,ValidationError};
