// filepath: tier5_pmrehab_ext_106_lymph_engine.js
// TIER5_PMREHAB_EXT-106: Lymphedema & chronic wound
'use strict';
const CITATIONS = ['ISL_Lymphedema_2020','Wound_Society_2022','NCCN_Lymphedema_2023'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function lymphedema_stage(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['stage_0_subclinical','stage_1_reversible','stage_2_spontaneous_irreversible','stage_3_elephantiasis','stage_4_fibrosis']);
  ensureBool(req.pitting_present, 'pitting_present');
  ensureBool(req.skin_thickening_present, 'skin_thickening_present');
  ensureNumber(req.limb_circumference_diff_cm, 'limb_circumference_diff_cm');
  ensureBool(req.skin_breakdown, 'skin_breakdown');
  let plan;
  if(req.stage==='stage_3_elephantiasis' || req.stage==='stage_4_fibrosis') plan='advanced_then_full_decongestive_therapy_then_maintenance';
  else if(req.stage==='stage_2_spontaneous_irreversible') plan='cdt_phase_1_then_phase_2';
  else if(req.stage==='stage_1_reversible') plan='cdt_then_compression_garment';
  else plan='continue_with_observation_then_reassess';
  if(req.skin_breakdown) plan+='_with_wound_care';
  return {plan};
}
function cdt_protocol(req){
  ensureNumber(req.sessions_per_week, 'sessions_per_week');
  ensureNumber(req.weeks_in_phase, 'weeks_in_phase');
  ensureBool(req.compression_garment_worn, 'compression_garment_worn');
  ensureBool(req.skin_care_done, 'skin_care_done');
  ensureNumber(req.volume_reduction_pct, 'volume_reduction_pct');
  let plan;
  if(req.volume_reduction_pct>=50) plan='responded_well_then_continue_phase_1_then_phase_2';
  else if(req.volume_reduction_pct>=20) plan='modest_response_then_intensify_then_reassess';
  else if(req.volume_reduction_pct<20) plan='minimal_response_then_refer_specialist_with_review';
  else plan='continue_with_protocol';
  if(req.compression_garment_worn===false) plan+='_initiate_garment';
  return {plan};
}
function chronic_wound(req){
  ensureStr(req.wound_type, 'wound_type');
  ensureEnum(req.wound_type, 'wound_type', ['venous_ulcer','arterial_ulcer','diabetic_neuropathic','pressure_injury_stage_2','pressure_injury_stage_3','pressure_injury_stage_4','surgical_wound_dehisced','traumatic_wound']);
  ensureNumber(req.wound_size_cm2, 'wound_size_cm2');
  ensureNumber(req.weeks_present, 'weeks_present');
  ensureBool(req.infection_signs, 'infection_signs');
  ensureNumber(req.doppler_abi, 'doppler_abi');
  let plan;
  if(req.wound_type==='arterial_ulcer' && req.doppler_abi<0.5) plan='severe_pvd_then_refer_vascular_surgery';
  else if(req.infection_signs) plan='infection_then_culture_with_antibiotics';
  else if(req.weeks_present>=12) plan='non_healing_then_refer_wound_clinic_with_biopsy';
  else if(req.wound_type==='venous_ulcer') plan='compression_with_venous_disease_workup';
  else if(req.wound_type==='diabetic_neuropathic') plan='offload_with_glycemic_control_then_reassess';
  else plan='continue_with_standard_wound_care';
  return {plan};
}
function compression_garment(req){
  ensureStr(req.body_part, 'body_part');
  ensureEnum(req.body_part, 'body_part', ['arm','leg','hand','foot','trunk','face','genitalia']);
  ensureNumber(req.compression_class, 'compression_class'); // 1 mild 2 moderate 3 strong 4 extra
  ensureBool(req.garment_replaced_recently, 'garment_replaced_recently');
  ensureBool(req.properly_fit, 'properly_fit');
  ensureBool(req.complications_present, 'complications_present');
  let plan;
  if(req.complications_present) plan='continue_with_garment_with_clinical_review';
  else if(req.garment_replaced_recently===false) plan='replace_garment_every_6_months_then_reassess';
  else if(req.properly_fit===false) plan='refit_with_measurements_then_reassess';
  else plan='continue_with_garment_then_reassess_in_6_months';
  return {plan};
}
function self_care(req){
  ensureBool(req.skin_inspection_done, 'skin_inspection_done');
  ensureBool(req.exercise_done, 'exercise_done');
  ensureBool(req.garment_worn_regularly, 'garment_worn_regularly');
  ensureBool(req.weight_maintained, 'weight_maintained');
  ensureBool(req.symptom_recognition, 'symptom_recognition');
  let plan;
  if(req.symptom_recognition===false) plan='education_with_teach_back_then_reassess';
  else if(req.skin_inspection_done===false) plan='initiate_daily_skin_inspection';
  else if(req.exercise_done===false) plan='initiate_home_exercise_program';
  else if(req.garment_worn_regularly===false) plan='continue_garment_with_reminders_then_reassess';
  else plan='continue_with_maintenance_program';
  return {plan};
}
function function_outcome(req){
  ensureNumber(req.dash_score, 'dash_score'); // upper
  ensureNumber(req.lemans_score, 'lemans_score'); // lower
  ensureBool(req.work_returned, 'work_returned');
  ensureBool(req.community_engaged, 'community_engaged');
  ensureBool(req.leisure_resumed, 'leisure_resumed');
  let plan;
  if(req.dash_score>=40 || req.lemans_score>=40) plan='significant_disability_then_refer_vocational_rehab';
  else if(req.work_returned===false) plan='vocational_rehab_then_workplace_modifications';
  else if(req.community_engaged===false) plan='community_reintegration_program';
  else if(req.leisure_resumed===false) plan='leisure_activities_recommendations';
  else plan='continue_with_maintenance_then_reassess_in_6_months';
  return {plan};
}
function funcs(){return {lymphedema_stage,cdt_protocol,chronic_wound,compression_garment,self_care,function_outcome};}
module.exports={funcs,CITATIONS,ValidationError};
