// filepath: tier5_rehab_med_ext_104_cardiac_engine.js
// TIER5_REHAB_MED_EXT-104: Cardiac rehab
'use strict';
const CITATIONS = ['AACVPR_CardiacRehab_2020','AHA_Cardiac_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function risk(req){
  ensureStr(req.event_type, 'event_type');
  ensureEnum(req.event_type, 'event_type', ['mi','stemi','nstemi','cabg','pci','valve_replacement','heart_failure_stable','stable_chest_pain','transplant']);
  ensureNumber(req.days_since_event, 'days_since_event');
  ensureNumber(req.lvef, 'lvef');
  ensureBool(req.symptoms_present, 'symptoms_present');
  ensureBool(req.complications, 'complications');
  ensureBool(req.medications_optimized, 'medications_optimized');
  ensureBool(req.stress_test_done, 'stress_test_done');
  let plan;
  if(req.days_since_event<7) plan='continue_with_inpatient_then_reassess';
  else if(req.lvef<35) plan='continue_with_supervised_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else if(req.symptoms_present) plan='continue_with_review_then_reassess';
  else if(req.stress_test_done===false) plan='continue_with_test_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exercise(req){
  ensureNumber(req.max_hr, 'max_hr');
  ensureNumber(req.rest_hr, 'rest_hr');
  ensureNumber(req.vo2_max, 'vo2_max');
  ensureBool(req.symptoms_with_exercise, 'symptoms_with_exercise');
  ensureBool(req.ekg_changes, 'ekg_changes');
  ensureBool(req.dyspnea_exercise, 'dyspnea_exercise');
  ensureBool(req.warm_up_done, 'warm_up_done');
  let plan;
  if(req.symptoms_with_exercise) plan='continue_with_stop_then_reassess';
  else if(req.ekg_changes) plan='continue_with_stop_then_reassess';
  else if(req.dyspnea_exercise) plan='continue_with_reduce_intensity_then_reassess';
  else if(req.warm_up_done===false) plan='continue_with_warmup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function phases(req){
  ensureStr(req.phase, 'phase');
  ensureEnum(req.phase, 'phase', ['phase_1_inpatient','phase_2_early_outpatient','phase_3_late_outpatient','phase_4_maintenance']);
  ensureBool(req.education_completed, 'education_completed');
  ensureBool(req.diet_education, 'diet_education');
  ensureBool(req.smoking_cessation, 'smoking_cessation');
  ensureBool(req.psychological_support, 'psychological_support');
  ensureBool(req.medication_adherence, 'medication_adherence');
  let plan;
  if(req.education_completed===false) plan='continue_with_education_then_reassess';
  else if(req.diet_education===false) plan='continue_with_diet_then_reassess';
  else if(req.smoking_cessation===false) plan='continue_with_cessation_then_reassess';
  else if(req.medication_adherence===false) plan='continue_with_adherence_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function education(req){
  ensureBool(req.disease_understanding, 'disease_understanding');
  ensureBool(req.medication_understanding, 'medication_understanding');
  ensureBool(req.diet_understanding, 'diet_understanding');
  ensureBool(req.exercise_understanding, 'exercise_understanding');
  ensureBool(req.warning_signs_known, 'warning_signs_known');
  ensureBool(req.lifestyle_changes, 'lifestyle_changes');
  let plan;
  if(req.disease_understanding===false) plan='continue_with_education_then_reassess';
  else if(req.medication_understanding===false) plan='continue_with_education_then_reassess';
  else if(req.warning_signs_known===false) plan='continue_with_educate_then_reassess';
  else if(req.lifestyle_changes===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function secondary_prev(req){
  ensureBool(req.statin_initiated, 'statin_initiated');
  ensureBool(req.antiplatelet_initiated, 'antiplatelet_initiated');
  ensureBool(req.beta_blocker_initiated, 'beta_blocker_initiated');
  ensureBool(req.ace_i_initiated, 'ace_i_initiated');
  ensureBool(req.bp_controlled, 'bp_controlled');
  ensureBool(req.ldl_target, 'ldl_target');
  let plan;
  if(req.statin_initiated===false) plan='continue_with_statin_then_reassess';
  else if(req.antiplatelet_initiated===false) plan='continue_with_antiplatelet_then_reassess';
  else if(req.bp_controlled===false) plan='continue_with_bp_then_reassess';
  else if(req.ldl_target===false) plan='continue_with_intensify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function psychosocial(req){
  ensureBool(req.depression_screened, 'depression_screened');
  ensureBool(req.anxiety_screened, 'anxiety_screened');
  ensureBool(req.social_isolation, 'social_isolation');
  ensureBool(req.spousal_support, 'spousal_support');
  ensureBool(req.work_reintegration, 'work_reintegration');
  ensureBool(req.psych_referral, 'psych_referral');
  let plan;
  if(req.depression_screened===false) plan='continue_with_screen_then_reassess';
  else if(req.social_isolation) plan='continue_with_support_then_reassess';
  else if(req.work_reintegration===false) plan='continue_with_reintegration_then_reassess';
  else if(req.psych_referral===false) plan='continue_with_referral_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {risk,exercise,phases,education,secondary_prev,psychosocial};}
module.exports={funcs,CITATIONS,ValidationError};
