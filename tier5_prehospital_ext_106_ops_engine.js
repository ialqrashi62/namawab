// filepath: tier5_prehospital_ext_106_ops_engine.js
// TIER5_PREHOSPITAL_EXT-106: EMS operations
'use strict';
const CITATIONS = ['EMS_Ops_2020','EMS_QA_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function readiness(req){
  ensureBool(req.vehicle_check_done, 'vehicle_check_done');
  ensureBool(req.equipment_checked, 'equipment_checked');
  ensureBool(req.medications_checked, 'medications_checked');
  ensureBool(req.fuel_adequate, 'fuel_adequate');
  ensureBool(req.crew_present, 'crew_present');
  ensureBool(req.uniforms_ppe, 'uniforms_ppe');
  let plan;
  if(req.vehicle_check_done===false) plan='continue_with_check_then_reassess';
  else if(req.equipment_checked===false) plan='continue_with_check_then_reassess';
  else if(req.medications_checked===false) plan='continue_with_check_then_reassess';
  else if(req.crew_present===false) plan='continue_with_call_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function response_time(req){
  ensureNumber(req.call_received_time, 'call_received_time');
  ensureNumber(req.dispatched_time, 'dispatched_time');
  ensureNumber(req.scene_time, 'scene_time');
  ensureNumber(req.transport_time, 'transport_time');
  ensureNumber(req.total_time, 'total_time');
  ensureBool(req.meets_standard, 'meets_standard');
  let plan;
  if(req.total_time>req.scene_time+req.transport_time) plan='continue_with_review_then_reassess';
  else if(req.dispatched_time-req.call_received_time>2) plan='continue_with_reduce_then_reassess';
  else if(req.meets_standard===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function coverage(req){
  ensureBool(req.primary_unit_available, 'primary_unit_available');
  ensureBool(req.backup_available, 'backup_available');
  ensureBool(req.unit_closest, 'unit_closest');
  ensureBool(req.specialty_unit, 'specialty_unit');
  ensureBool(req.air_unit_available, 'air_unit_available');
  let plan;
  if(req.primary_unit_available===false) plan='continue_with_dispatch_then_reassess';
  else if(req.backup_available===false) plan='continue_with_alert_then_reassess';
  else if(req.unit_closest===false) plan='continue_with_reassign_then_reassess';
  else if(req.specialty_unit) plan='continue_with_call_specialty_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function quality(req){
  ensureBool(req.calls_audited, 'calls_audited');
  ensureBool(req.performance_evaluated, 'performance_evaluated');
  ensureBool(req.protocol_compliance, 'protocol_compliance');
  ensureBool(req.documentation_quality, 'documentation_quality');
  ensureBool(req.feedback_provided, 'feedback_provided');
  let plan;
  if(req.calls_audited===false) plan='continue_with_audit_then_reassess';
  else if(req.protocol_compliance===false) plan='continue_with_reinforce_then_reassess';
  else if(req.documentation_quality===false) plan='continue_with_train_then_reassess';
  else if(req.feedback_provided===false) plan='continue_with_provide_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function education(req){
  ensureBool(req.ceu_completed, 'ceu_completed');
  ensureBool(req.cert_current, 'cert_current');
  ensureBool(req.sim_training, 'sim_training');
  ensureBool(req.protocol_review, 'protocol_review');
  ensureBool(req.equipment_training, 'equipment_training');
  let plan;
  if(req.ceu_completed===false) plan='continue_with_complete_then_reassess';
  else if(req.cert_current===false) plan='continue_with_renew_then_reassess';
  else if(req.sim_training===false) plan='continue_with_sim_then_reassess';
  else if(req.protocol_review===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function health(req){
  ensureBool(req.physical_fitness, 'physical_fitness');
  ensureBool(req.bbp_exposure, 'bbp_exposure');
  ensureBool(req.mental_health_checkin, 'mental_health_checkin');
  ensureBool(req.fatigue_management, 'fatigue_management');
  ensureBool(req.injury_prevention, 'injury_prevention');
  let plan;
  if(req.bbp_exposure) plan='continue_with_protocol_then_reassess';
  else if(req.mental_health_checkin===false) plan='continue_with_checkin_then_reassess';
  else if(req.fatigue_management===false) plan='continue_with_manage_then_reassess';
  else if(req.injury_prevention===false) plan='continue_with_prevent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {readiness,response_time,coverage,quality,education,health};}
module.exports={funcs,CITATIONS,ValidationError};
