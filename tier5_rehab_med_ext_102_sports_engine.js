// filepath: tier5_rehab_med_ext_102_sports_engine.js
// TIER5_REHAB_MED_EXT-102: Sports rehab
'use strict';
const CITATIONS = ['ACSM_2020','NCAA_Sports_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function injury(req){
  ensureStr(req.injury_type, 'injury_type');
  ensureEnum(req.injury_type, 'injury_type', ['sprain','strain','tendonitis','fracture','dislocation','meniscus','acl','tear','contusion','concussion','overuse','muscle_tear']);
  ensureNumber(req.days_since_injury, 'days_since_injury');
  ensureBool(req.swelling, 'swelling');
  ensureBool(req.pain_with_activity, 'pain_with_activity');
  ensureBool(req.range_of_motion, 'range_of_motion');
  ensureBool(req.strength_testing, 'strength_testing');
  let plan;
  if(req.swelling) plan='continue_with_rice_then_reassess';
  else if(req.days_since_injury<5) plan='continue_with_protect_then_reassess';
  else if(req.range_of_motion===false) plan='continue_with_rom_then_reassess';
  else if(req.strength_testing===false) plan='continue_with_strength_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pre_participation(req){
  ensureBool(req.cardiac_clearance, 'cardiac_clearance');
  ensureBool(req.musculoskeletal_clearance, 'musculoskeletal_clearance');
  ensureBool(req.neurologic_clearance, 'neurologic_clearance');
  ensureBool(req.vision_check, 'vision_check');
  ensureBool(req.concussion_history, 'concussion_history');
  ensureBool(req.echo_cleared, 'echo_cleared');
  let plan;
  if(req.cardiac_clearance===false) plan='continue_with_clear_then_reassess';
  else if(req.musculoskeletal_clearance===false) plan='continue_with_clear_then_reassess';
  else if(req.neurologic_clearance===false) plan='continue_with_clear_then_reassess';
  else if(req.echo_cleared===false) plan='continue_with_echo_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function concussion(req){
  ensureNumber(req.sc_at_score, 'sc_at_score');
  ensureBool(req.symptoms_present, 'symptoms_present');
  ensureBool(req.balance_impaired, 'balance_impaired');
  ensureBool(req.cognitive_screening, 'cognitive_screening');
  ensureBool(req.graduated_return, 'graduated_return');
  ensureBool(req.contact_allowed, 'contact_allowed');
  let plan;
  if(req.symptoms_present && req.contact_allowed) plan='continue_with_hold_contact_then_reassess';
  else if(req.balance_impaired) plan='continue_with_balance_then_reassess';
  else if(req.graduated_return===false) plan='continue_with_protocol_then_reassess';
  else if(req.cognitive_screening===false) plan='continue_with_screen_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rtp(req){
  ensureNumber(req.days_injured, 'days_injured');
  ensureBool(req.pain_free, 'pain_free');
  ensureBool(req.full_range_motion, 'full_range_motion');
  ensureBool(req.strength_restored, 'strength_restored');
  ensureBool(req.function_test_passed, 'function_test_passed');
  ensureBool(req.psychological_ready, 'psychological_ready');
  let plan;
  if(req.pain_free===false) plan='continue_with_hold_then_reassess';
  else if(req.full_range_motion===false) plan='continue_with_rom_then_reassess';
  else if(req.strength_restored===false) plan='continue_with_strength_then_reassess';
  else if(req.function_test_passed===false) plan='continue_with_test_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function training_load(req){
  ensureNumber(req.acute_load, 'acute_load');
  ensureNumber(req.chronic_load, 'chronic_load');
  ensureBool(req.monitoring_data, 'monitoring_data');
  ensureBool(req.rest_active, 'rest_active');
  ensureBool(req.nutrition_adequate, 'nutrition_adequate');
  ensureBool(req.sleep_adequate, 'sleep_adequate');
  let plan;
  if(req.acute_load/req.chronic_load>1.5) plan='continue_with_reduce_then_reassess';
  else if(req.rest_active===false) plan='continue_with_rest_then_reassess';
  else if(req.nutrition_adequate===false) plan='continue_with_nutrition_then_reassess';
  else if(req.sleep_adequate===false) plan='continue_with_sleep_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prevention(req){
  ensureBool(req.warm_up_adequate, 'warm_up_adequate');
  ensureBool(req.cool_down, 'cool_down');
  ensureBool(req.strength_program, 'strength_program');
  ensureBool(req.flexibility_program, 'flexibility_program');
  ensureBool(req.balance_program, 'balance_program');
  ensureBool(req.equipment_check, 'equipment_check');
  let plan;
  if(req.warm_up_adequate===false) plan='continue_with_warmup_then_reassess';
  else if(req.strength_program===false) plan='continue_with_strength_then_reassess';
  else if(req.flexibility_program===false) plan='continue_with_flex_then_reassess';
  else if(req.equipment_check===false) plan='continue_with_equipment_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {injury,pre_participation,concussion,rtp,training_load,prevention};}
module.exports={funcs,CITATIONS,ValidationError};
