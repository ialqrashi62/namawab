// filepath: tier5_wound_ostomy_ext_103_pressure_engine.js
// TIER5_WOUND_OSTOMY_EXT-103: Pressure ulcer
'use strict';
const CITATIONS = ['NPUAP_EPUAP_PPPIA_2019','AHRQ_Pressure_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function risk(req){
  ensureNumber(req.braden_score, 'braden_score');
  ensureBool(req.repositioning_q2h, 'repositioning_q2h');
  ensureBool(req.pressure_redistributing_surface, 'pressure_redistributing_surface');
  ensureBool(req.skin_inspection_documented, 'skin_inspection_documented');
  ensureBool(req.nutrition_optimized, 'nutrition_optimized');
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  let plan;
  if(req.braden_score<9) plan='continue_with_maximum_prevention_then_reassess';
  else if(req.braden_score<12) plan='continue_with_high_prevention_then_reassess';
  else if(req.braden_score<14) plan='continue_with_moderate_prevention_then_reassess';
  else if(req.albumin_g_dl<2.5) plan='continue_with_nutrition_then_reassess';
  else plan='continue_with_standard_prevention_then_reassess';
  return {plan};
}
function stage(req){
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['sacrum','coccyx','heel','trochanter','ischium','elbow','scapula','occiput','ear','malleolus','knee']);
  ensureNumber(req.depth_cm, 'depth_cm');
  ensureBool(req.bone_visible, 'bone_visible');
  ensureBool(req.tendon_visible, 'tendon_visible');
  ensureBool(req.slough_present, 'slough_present');
  ensureBool(req.non_blanchable_erythema, 'non_blanchable_erythema');
  let plan;
  if(req.bone_visible || req.tendon_visible) plan='continue_with_stage4_then_reassess';
  else if(req.depth_cm>1) plan='continue_with_stage3_then_reassess';
  else if(req.depth_cm>0.5) plan='continue_with_stage2_then_reassess';
  else if(req.non_blanchable_erythema) plan='continue_with_stage1_then_reassess';
  else plan='continue_with_unstageable_then_reassess';
  return {plan};
}
function prevention(req){
  ensureBool(req.turning_protocol, 'turning_protocol');
  ensureBool(req.pressure_relieving_mattress, 'pressure_relieving_mattress');
  ensureBool(req.heel_offloading, 'heel_offloading');
  ensureBool(req.skin_moisture_managed, 'skin_moisture_managed');
  ensureBool(req.nutrition_supplemented, 'nutrition_supplemented');
  ensureBool(req.education_Provided, 'education_Provided');
  let plan;
  if(req.turning_protocol===false) plan='continue_with_protocol_then_reassess';
  else if(req.pressure_relieving_mattress===false) plan='continue_with_surface_then_reassess';
  else if(req.heel_offloading===false) plan='continue_with_heel_device_then_reassess';
  else if(req.nutrition_supplemented===false) plan='continue_with_supplements_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function treatment(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['stage_1','stage_2','stage_3','stage_4','unstageable','deep_tissue_injury']);
  ensureBool(req.debridement_needed, 'debridement_needed');
  ensureBool(req.infection_signs, 'infection_signs');
  ensureBool(req.pressure_offloading, 'pressure_offloading');
  ensureBool(req.dressing_optimized, 'dressing_optimized');
  ensureBool(req.nutrition_optimized, 'nutrition_optimized');
  let plan;
  if(req.stage==='stage_4' && req.debridement_needed) plan='continue_with_surgical_then_reassess';
  else if(req.infection_signs) plan='continue_with_antibiotics_then_reassess';
  else if(req.pressure_offloading===false) plan='continue_with_offload_then_reassess';
  else if(req.dressing_optimized===false) plan='continue_with_dressing_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function positioning(req){
  ensureStr(req.current_position, 'current_position');
  ensureEnum(req.current_position, 'current_position', ['supine','lateral','prone','sitting','fowlers','trendelenburg']);
  ensureNumber(req.hours_in_position, 'hours_in_position');
  ensureBool(req.pressure_points_relieved, 'pressure_points_relieved');
  ensureBool(req.skin_inspected, 'skin_inspected');
  ensureBool(req.position_change_documented, 'position_change_documented');
  let plan;
  if(req.hours_in_position>=2) plan='continue_with_reposition_then_reassess';
  else if(req.pressure_points_relieved===false) plan='continue_with_relieve_then_reassess';
  else if(req.skin_inspected===false) plan='continue_with_inspect_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function documentation(req){
  ensureBool(req.stage_documented, 'stage_documented');
  ensureBool(req.measurements_documented, 'measurements_documented');
  ensureBool(req.photography_obtained, 'photography_obtained');
  ensureBool(req.dressing_type_documented, 'dressing_type_documented');
  ensureBool(req.pain_assessed, 'pain_assessed');
  ensureBool(req.nutrition_status, 'nutrition_status');
  let plan;
  if(req.stage_documented===false) plan='continue_with_stage_doc_then_reassess';
  else if(req.measurements_documented===false) plan='continue_with_measure_doc_then_reassess';
  else if(req.pain_assessed===false) plan='continue_with_pain_doc_then_reassess';
  else if(req.photography_obtained===false) plan='continue_with_photo_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {risk,stage,prevention,treatment,positioning,documentation};}
module.exports={funcs,CITATIONS,ValidationError};
