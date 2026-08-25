// filepath: tier5_prehospital_ext_102_dispatch_engine.js
// TIER5_PREHOSPITAL_EXT-102: Dispatch
'use strict';
const CITATIONS = ['EMD_2020','IAED_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function priority(req){
  ensureStr(req.call_type, 'call_type');
  ensureEnum(req.call_type, 'call_type', ['cardiac_arrest','stroke','trauma','chest_pain','difficulty_breathing','altered_mental','anaphylaxis','obstetric','psychiatric','non_urgent','abdominal','other']);
  ensureBool(req.life_threat, 'life_threat');
  ensureBool(req.unconscious, 'unconscious');
  ensureBool(req.breathing_abnormal, 'breathing_abnormal');
  ensureBool(req.bleeding_severe, 'bleeding_severe');
  ensureBool(req.chest_pain, 'chest_pain');
  let plan;
  if(req.call_type==='cardiac_arrest') plan='continue_with_echo_then_reassess';
  else if(req.life_threat) plan='continue_with_lights_then_reassess';
  else if(req.unconscious) plan='continue_with_priority1_then_reassess';
  else if(req.bleeding_severe) plan='continue_with_priority1_then_reassess';
  else if(req.chest_pain) plan='continue_with_priority2_then_reassess';
  else plan='continue_with_priority3_then_reassess';
  return {plan};
}
function resource(req){
  ensureStr(req.incident_severity, 'incident_severity');
  ensureEnum(req.incident_severity, 'incident_severity', ['low','moderate','high','mci']);
  ensureBool(req.additional_resources, 'additional_resources');
  ensureBool(req.specialty_needed, 'specialty_needed');
  ensureBool(req.airway_advanced, 'airway_advanced');
  ensureBool(req.medical_director, 'medical_director');
  ensureBool(req.police_fire, 'police_fire');
  let plan;
  if(req.incident_severity==='mci') plan='continue_with_mci_plan_then_reassess';
  else if(req.airway_advanced) plan='continue_with_paramedic_then_reassess';
  else if(req.specialty_needed) plan='continue_with_specialty_then_reassess';
  else if(req.additional_resources) plan='continue_with_addition_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prep_instructions(req){
  ensureBool(req.cpr_given, 'cpr_given');
  ensureBool(req.bleeding_controlled, 'bleeding_controlled');
  ensureBool(req.positioning, 'positioning');
  ensureBool(req.responsive, 'responsive');
  ensureBool(req.family_aware, 'family_aware');
  ensureBool(req.unlocked_door, 'unlocked_door');
  let plan;
  if(req.cpr_given===false) plan='continue_with_cpr_then_reassess';
  else if(req.bleeding_controlled===false) plan='continue_with_pressure_then_reassess';
  else if(req.unlocked_door===false) plan='continue_with_unlock_then_reassess';
  else if(req.family_aware===false) plan='continue_with_notify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function location(req){
  ensureBool(req.exact_address, 'exact_address');
  ensureBool(req.apt_door, 'apt_door');
  ensureBool(req.landmark, 'landmark');
  ensureBool(req.access_info, 'access_info');
  ensureBool(req.gps_confirmed, 'gps_confirmed');
  let plan;
  if(req.exact_address===false) plan='continue_with_verify_then_reassess';
  else if(req.gps_confirmed===false) plan='continue_with_gps_then_reassess';
  else if(req.landmark===false) plan='continue_with_obtain_then_reassess';
  else if(req.access_info===false) plan='continue_with_access_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function caller_support(req){
  ensureBool(req.caller_safe, 'caller_safe');
  ensureBool(req.scene_safe, 'scene_safe');
  ensureBool(req.hazards_identified, 'hazards_identified');
  ensureBool(req.stay_on_line, 'stay_on_line');
  ensureBool(req.appropriate_actions, 'appropriate_actions');
  ensureBool(req.caller_education, 'caller_education');
  let plan;
  if(req.caller_safe===false) plan='continue_with_relocate_then_reassess';
  else if(req.scene_safe===false) plan='continue_with_dispatch_police_then_reassess';
  else if(req.stay_on_line===false) plan='continue_with_stay_then_reassess';
  else if(req.caller_education===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function staff_safety(req){
  ensureBool(req.briefed, 'briefed');
  ensureBool(req.ppe_available, 'ppe_available');
  ensureBool(req.bbp_protocol, 'bbp_protocol');
  ensureBool(req.psych_resources, 'psych_resources');
  ensureBool(req.debrief, 'debrief');
  let plan;
  if(req.briefed===false) plan='continue_with_brief_then_reassess';
  else if(req.ppe_available===false) plan='continue_with_ppe_then_reassess';
  else if(req.bbp_protocol===false) plan='continue_with_protocol_then_reassess';
  else if(req.debrief===false) plan='continue_with_debrief_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {priority,resource,prep_instructions,location,caller_support,staff_safety};}
module.exports={funcs,CITATIONS,ValidationError};
