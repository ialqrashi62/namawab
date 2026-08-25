// filepath: tier5_wound_ostomy_ext_105_lymph_engine.js
// TIER5_WOUND_OSTOMY_EXT-105: Lymphedema
'use strict';
const CITATIONS = ['ISL_2020','NLN_Lymph_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function staging(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['stage_0_latent','stage_1_mild','stage_2_moderate','stage_3_severe','stage_4_irreversible']);
  ensureBool(req.pitting, 'pitting');
  ensureBool(req.skin_thickening, 'skin_thickening');
  ensureBool(req.fibrosis, 'fibrosis');
  ensureBool(req.papillomatosis, 'papillomatosis');
  let plan;
  if(req.stage==='stage_4_irreversible') plan='continue_with_management_then_reassess';
  else if(req.fibrosis) plan='continue_with_cdt_then_reassess';
  else if(req.skin_thickening) plan='continue_with_cdt_then_reassess';
  else if(req.pitting) plan='continue_with_cdt_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cdt(req){
  ensureBool(req.manual_lymphatic_drainage, 'manual_lymphatic_drainage');
  ensureBool(req.compression_therapy, 'compression_therapy');
  ensureBool(req.exercise, 'exercise');
  ensureBool(req.skin_care, 'skin_care');
  ensureBool(req.self_management_education, 'self_management_education');
  ensureBool(req.compliance_documented, 'compliance_documented');
  let plan;
  if(req.manual_lymphatic_drainage===false) plan='continue_with_mld_then_reassess';
  else if(req.compression_therapy===false) plan='continue_with_compression_then_reassess';
  else if(req.exercise===false) plan='continue_with_exercise_then_reassess';
  else if(req.compliance_documented===false) plan='continue_with_compliance_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function compression(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['stage_0_latent','stage_1_mild','stage_2_moderate','stage_3_severe','stage_4_irreversible']);
  ensureNumber(req.compression_class, 'compression_class');
  ensureBool(req.tolerated, 'tolerated');
  ensureBool(req.donned_independently, 'donned_independently');
  ensureBool(req.replace_documented, 'replace_documented');
  ensureBool(req.pain_with_compression, 'pain_with_compression');
  let plan;
  if(req.pain_with_compression) plan='continue_with_reassess_then_reassess';
  else if(req.stage==='stage_3_severe' && req.compression_class<2) plan='continue_with_increase_then_reassess';
  else if(req.tolerated===false) plan='continue_with_lower_class_then_reassess';
  else if(req.donned_independently===false) plan='continue_with_donner_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exercise(req){
  ensureBool(req.breathing_exercises, 'breathing_exercises');
  ensureBool(req.range_of_motion, 'range_of_motion');
  ensureBool(req.lymphatic_specific_exercise, 'lymphatic_specific_exercise');
  ensureBool(req.compression_during_exercise, 'compression_during_exercise');
  ensureBool(req.frequency_adequate, 'frequency_adequate');
  let plan;
  if(req.breathing_exercises===false) plan='continue_with_breathing_then_reassess';
  else if(req.range_of_motion===false) plan='continue_with_rom_then_reassess';
  else if(req.lymphatic_specific_exercise===false) plan='continue_with_specific_then_reassess';
  else if(req.compression_during_exercise===false) plan='continue_with_compression_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function measurements(req){
  ensureNumber(req.circumference_diff_cm, 'circumference_diff_cm');
  ensureNumber(req.volume_diff_ml, 'volume_diff_ml');
  ensureNumber(req.days_between_measurements, 'days_between_measurements');
  ensureBool(req.compression_compliance, 'compression_compliance');
  ensureBool(req.cellulitis_history, 'cellulitis_history');
  let plan;
  if(req.circumference_diff_cm>3) plan='continue_with_optimize_then_reassess';
  else if(req.circumference_diff_cm<1 && req.days_between_measurements>=30) plan='continue_with_maintenance_then_reassess';
  else if(req.circumference_diff_cm>=0 && req.circumference_diff_cm<1) plan='continue_with_maintenance_then_reassess';
  else if(req.compression_compliance===false) plan='continue_with_compliance_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cellulitis(req){
  ensureNumber(req.temp_c, 'temp_c');
  ensureBool(req.erythema, 'erythema');
  ensureBool(req.warmth, 'warmth');
  ensureBool(req.pain_increase, 'pain_increase');
  ensureNumber(req.wbc_count, 'wbc_count');
  ensureBool(req.recent_episodes, 'recent_episodes');
  let plan;
  if(req.temp_c>=38 && req.erythema) plan='continue_with_iv_abx_then_reassess';
  else if(req.erythema && req.recent_episodes) plan='continue_with_prophylaxis_then_reassess';
  else if(req.pain_increase) plan='continue_with_culture_then_reassess';
  else if(req.warmth) plan='continue_with_topical_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {staging,cdt,compression,exercise,measurements,cellulitis};}
module.exports={funcs,CITATIONS,ValidationError};
