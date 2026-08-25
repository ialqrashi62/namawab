// filepath: tier5_infusion_ext_105_home_engine.js
// TIER5_INFUSION_EXT-105: Home infusion (eligibility, IVIG, VAD, chemo home, monitoring)
'use strict';
const CITATIONS = ['NHIA_Standards_2020','ASHP_Home_2017','INS_Home_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function eligibility(req){
  ensureStr(req.therapy, 'therapy');
  ensureEnum(req.therapy, 'therapy', ['iv_antibiotic','ivig','tpn','chemo','biologic','enzyme','pain','hydration','inotropic']);
  ensureBool(req.stable_clinical, 'stable_clinical');
  ensureBool(req.home_environment_safe, 'home_environment_safe');
  ensureBool(req.caregiver_available, 'caregiver_available');
  ensureBool(req.phone_access, 'phone_access');
  ensureBool(req.insurance_covered, 'insurance_covered');
  let plan;
  if(req.stable_clinical===false) plan='continue_with_inpatient_first_then_reassess';
  else if(req.home_environment_safe===false) plan='continue_with_home_assessment_then_reassess';
  else if(req.caregiver_available===false) plan='continue_with_caregiver_assessment_then_reassess';
  else if(req.insurance_covered===false) plan='continue_with_appeal_then_reassess';
  else plan='continue_with_home_then_reassess';
  return {plan};
}
function ivig(req){
  ensureNumber(req.dose_g_kg, 'dose_g_kg');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.total_igg_g_l, 'total_igg_g_l');
  ensureNumber(req.days_since_last, 'days_since_last');
  ensureBool(req.premed_given, 'premed_given');
  ensureBool(req.fluid_overload_risk, 'fluid_overload_risk');
  let plan;
  if(req.days_since_last<21 && req.premed_given===false) plan='continue_with_premed_then_reassess';
  else if(req.total_igg_g_l<4 && req.days_since_last>=28) plan='continue_with_increase_then_reassess';
  else if(req.fluid_overload_risk) plan='continue_with_split_dose_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vad(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['picc','midline','port','tunneled_central','implanted_pump']);
  ensureBool(req.working, 'working');
  ensureBool(req.dressing_intact, 'dressing_intact');
  ensureNumber(req.days_since_change, 'days_since_change');
  ensureBool(req.signs_of_infection, 'signs_of_infection');
  ensureBool(req.patient_caregiver_education, 'patient_caregiver_education');
  let plan;
  if(req.signs_of_infection) plan='continue_with_refer_then_reassess';
  else if(req.working===false) plan='continue_with_refer_then_reassess';
  else if(req.dressing_intact===false) plan='continue_with_dressing_change_then_reassess';
  else if(req.patient_caregiver_education===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function home_chemo(req){
  ensureBool(req.cycle_phase, 'cycle_phase');
  ensureBool(req.home_safety_assessed, 'home_safety_assessed');
  ensureBool(req.emesis_controlled, 'emesis_controlled');
  ensureBool(req.pump_approved, 'pump_approved');
  ensureBool(req.spill_kit_at_home, 'spill_kit_at_home');
  ensureBool(req.emergency_contact_documented, 'emergency_contact_documented');
  let plan;
  if(req.home_safety_assessed===false) plan='continue_with_safety_assessment_then_reassess';
  else if(req.emesis_controlled===false) plan='continue_with_emesis_control_then_reassess';
  else if(req.pump_approved===false) plan='continue_with_pump_review_then_reassess';
  else if(req.spill_kit_at_home===false) plan='continue_with_spill_kit_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function monitoring(req){
  ensureNumber(req.visits_per_week, 'visits_per_week');
  ensureBool(req.telemonitoring_active, 'telemonitoring_active');
  ensureBool(req.lab_monitoring, 'lab_monitoring');
  ensureBool(req.adverse_event_plan, 'adverse_event_plan');
  ensureBool(req.family_education_done, 'family_education_done');
  ensureBool(req.emergency_contact_24_7, 'emergency_contact_24_7');
  let plan;
  if(req.emergency_contact_24_7===false) plan='continue_with_24_7_setup_then_reassess';
  else if(req.adverse_event_plan===false) plan='continue_with_plan_then_reassess';
  else if(req.lab_monitoring===false) plan='continue_with_lab_setup_then_reassess';
  else if(req.visits_per_week<2) plan='continue_with_increase_visits_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureStr(req.complication, 'complication');
  ensureEnum(req.complication, 'complication', ['phlebitis','infiltration','occlusion','catheter_infection','thrombosis','air_embolism','pneumothorax','dislodgement','pump_failure','medication_error','adverse_drug_reaction']);
  ensureBool(req.responded, 'responded');
  ensureBool(req.sent_to_hospital, 'sent_to_hospital');
  ensureBool(req.root_cause_done, 'root_cause_done');
  ensureNumber(req.days_to_resolution, 'days_to_resolution');
  let plan;
  if(req.complication==='pneumothorax' || req.complication==='air_embolism') plan='continue_with_immediate_911_then_reassess';
  else if(req.sent_to_hospital===false && req.complication==='catheter_infection') plan='continue_with_refer_then_reassess';
  else if(req.root_cause_done===false) plan='continue_with_root_cause_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {eligibility,ivig,vad,home_chemo,monitoring,complications};}
module.exports={funcs,CITATIONS,ValidationError};
