// filepath: tier5_prehospital_ext_101_ems_engine.js
// TIER5_PREHOSPITAL_EXT-101: EMS assessment
'use strict';
const CITATIONS = ['EMS_2020','NHTSA_EMS_2018','NEMSIS_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function primary_survey(req){
  ensureBool(req.airway_patent, 'airway_patent');
  ensureBool(req.breathing_adequate, 'breathing_adequate');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.oxygen_sat, 'oxygen_sat');
  ensureBool(req.responsiveness, 'responsiveness');
  ensureBool(req.cervical_spine, 'cervical_spine');
  let plan;
  if(req.airway_patent===false) plan='continue_with_manage_airway_then_reassess';
  else if(req.breathing_adequate===false) plan='continue_with_oxygen_then_reassess';
  else if(req.heart_rate<60 || req.heart_rate>120) plan='continue_with_cardiac_then_reassess';
  else if(req.oxygen_sat<94) plan='continue_with_oxygen_then_reassess';
  else if(req.responsiveness===false) plan='continue_with_gcs_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function gcs(req){
  ensureNumber(req.eye_score, 'eye_score');
  ensureNumber(req.verbal_score, 'verbal_score');
  ensureNumber(req.motor_score, 'motor_score');
  ensureBool(req.trauma_history, 'trauma_history');
  ensureBool(req.intoxication_suspected, 'intoxication_suspected');
  ensureBool(req.baseline_known, 'baseline_known');
  let plan;
  if(req.eye_score+req.verbal_score+req.motor_score<=8) plan='continue_with_intubation_then_reassess';
  else if(req.eye_score+req.verbal_score+req.motor_score<=12) plan='continue_with_trauma_center_then_reassess';
  else if(req.intoxication_suspected) plan='continue_with_reassess_then_reassess';
  else if(req.baseline_known===false) plan='continue_with_obtain_history_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vitals(req){
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.diastolic_bp, 'diastolic_bp');
  ensureNumber(req.respiratory_rate, 'respiratory_rate');
  ensureNumber(req.oxygen_sat, 'oxygen_sat');
  ensureNumber(req.temperature, 'temperature');
  ensureBool(req.vitals_stable, 'vitals_stable');
  let plan;
  if(req.systolic_bp<90) plan='continue_with_shock_then_reassess';
  else if(req.heart_rate<50 || req.heart_rate>130) plan='continue_with_arrhythmia_then_reassess';
  else if(req.oxygen_sat<90) plan='continue_with_oxygen_then_reassess';
  else if(req.respiratory_rate<10 || req.respiratory_rate>30) plan='continue_with_assess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pain_ems(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.pain_addressed, 'pain_addressed');
  ensureBool(req.medication_given, 'medication_given');
  ensureBool(req.non_pharm_used, 'non_pharm_used');
  ensureBool(req.allergies_checked, 'allergies_checked');
  let plan;
  if(req.pain_score>=7 && req.medication_given===false) plan='continue_with_pain_med_then_reassess';
  else if(req.allergies_checked===false) plan='continue_with_check_then_reassess';
  else if(req.pain_score>=4 && req.non_pharm_used===false) plan='continue_with_nonpharm_then_reassess';
  else if(req.pain_score>=4) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function medication(req){
  ensureBool(req.allergies_known, 'allergies_known');
  ensureBool(req.medication_list, 'medication_list');
  ensureBool(req.last_dose_timing, 'last_dose_timing');
  ensureBool(req.weight_known, 'weight_known');
  ensureBool(req.dosage_calculated, 'dosage_calculated');
  ensureBool(req.given, 'given');
  let plan;
  if(req.allergies_known===false) plan='continue_with_determine_then_reassess';
  else if(req.weight_known===false) plan='continue_with_estimate_then_reassess';
  else if(req.dosage_calculated===false) plan='continue_with_calculate_then_reassess';
  else if(req.last_dose_timing===false) plan='continue_with_obtain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function family_contact(req){
  ensureBool(req.family_present, 'family_present');
  ensureBool(req.family_notified, 'family_notified');
  ensureBool(req.medical_history_obtained, 'medical_history_obtained');
  ensureBool(req.demographics_captured, 'demographics_captured');
  ensureBool(req.insurance_info, 'insurance_info');
  let plan;
  if(req.family_present===false) plan='continue_with_locate_then_reassess';
  else if(req.medical_history_obtained===false) plan='continue_with_obtain_then_reassess';
  else if(req.demographics_captured===false) plan='continue_with_capture_then_reassess';
  else if(req.insurance_info===false) plan='continue_with_obtain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {primary_survey,gcs,vitals,pain_ems,medication,family_contact};}
module.exports={funcs,CITATIONS,ValidationError};
