// filepath: tier5_prehospital_ext_105_transport_engine.js
// TIER5_PREHOSPITAL_EXT-105: Patient transport
'use strict';
const CITATIONS = ['EMS_Transport_2020','NEMSIS_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function mode(req){
  ensureStr(req.medical_need, 'medical_need');
  ensureEnum(req.medical_need, 'medical_need', ['basic','advanced','critical','isolation','bariatric','neonatal','trauma','cardiac']);
  ensureBool(req.time_critical, 'time_critical');
  ensureBool(req.ground_available, 'ground_available');
  ensureBool(req.air_available, 'air_available');
  ensureBool(req.distance_appropriate, 'distance_appropriate');
  let plan;
  if(req.medical_need==='critical' && req.air_available) plan='continue_with_air_then_reassess';
  else if(req.time_critical && req.air_available) plan='continue_with_air_then_reassess';
  else if(req.medical_need==='advanced') plan='continue_with_als_then_reassess';
  else if(req.medical_need==='basic') plan='continue_with_bls_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function destination(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['stemi','stroke','trauma','major_burn','hand','ob_delivery','cardiac_arrest','pediatric','none_specific']);
  ensureBool(req.specialty_center, 'specialty_center');
  ensureBool(req.bypass_appropriate, 'bypass_appropriate');
  ensureBool(req.capability_verified, 'capability_verified');
  let plan;
  if(req.condition==='stemi') plan='continue_with_pci_center_then_reassess';
  else if(req.condition==='stroke') plan='continue_with_stroke_center_then_reassess';
  else if(req.condition==='trauma') plan='continue_with_trauma_center_then_reassess';
  else if(req.condition==='major_burn') plan='continue_with_burn_center_then_reassess';
  else if(req.condition==='pediatric') plan='continue_with_pedi_center_then_reassess';
  else if(req.bypass_appropriate && req.capability_verified) plan='continue_with_bypass_then_reassess';
  else plan='continue_with_nearest_then_reassess';
  return {plan};
}
function handover(req){
  ensureBool(req.verbal_report, 'verbal_report');
  ensureBool(req.written_report, 'written_report');
  ensureBool(req.vitals_shared, 'vitals_shared');
  ensureBool(req.history_shared, 'history_shared');
  ensureBool(req.treatment_summary, 'treatment_summary');
  ensureBool(req.questions_answered, 'questions_answered');
  let plan;
  if(req.verbal_report===false) plan='continue_with_report_then_reassess';
  else if(req.vitals_shared===false) plan='continue_with_share_then_reassess';
  else if(req.history_shared===false) plan='continue_with_share_then_reassess';
  else if(req.treatment_summary===false) plan='continue_with_summarize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function documentation(req){
  ensureBool(req.patient_demographics, 'patient_demographics');
  ensureBool(req.chief_complaint, 'chief_complaint');
  ensureBool(req.timeline_documented, 'timeline_documented');
  ensureBool(req.vitals_recorded, 'vitals_recorded');
  ensureBool(req.interventions_recorded, 'interventions_recorded');
  ensureBool(req.signature_obtained, 'signature_obtained');
  let plan;
  if(req.patient_demographics===false) plan='continue_with_demographics_then_reassess';
  else if(req.chief_complaint===false) plan='continue_with_complaint_then_reassess';
  else if(req.timeline_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.vitals_recorded===false) plan='continue_with_recorded_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function safety(req){
  ensureBool(req.patient_restraint, 'patient_restraint');
  ensureBool(req.spinal_motion_restriction, 'spinal_motion_restriction');
  ensureBool(req.cervical_collar, 'cervical_collar');
  ensureBool(req.oxygen_secured, 'oxygen_secured');
  ensureBool(req.iv_secured, 'iv_secured');
  ensureBool(req.crew_belts, 'crew_belts');
  let plan;
  if(req.crew_belts===false) plan='continue_with_fasten_then_reassess';
  else if(req.patient_restraint===false) plan='continue_with_restrain_then_reassess';
  else if(req.oxygen_secured===false) plan='continue_with_secure_then_reassess';
  else if(req.iv_secured===false) plan='continue_with_secure_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function refusals(req){
  ensureBool(req.decision_making_capacity, 'decision_making_capacity');
  ensureBool(req.informed_risk, 'informed_risk');
  ensureBool(req.alternatives_offered, 'alternatives_offered');
  ensureBool(req.witness_present, 'witness_present');
  ensureBool(req.signature_obtained, 'signature_obtained');
  ensureBool(req.family_notified, 'family_notified');
  let plan;
  if(req.decision_making_capacity===false) plan='continue_with_implicit_consent_then_reassess';
  else if(req.informed_risk===false) plan='continue_with_explain_then_reassess';
  else if(req.alternatives_offered===false) plan='continue_with_offer_then_reassess';
  else if(req.signature_obtained===false) plan='continue_with_obtain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {mode,destination,handover,documentation,safety,refusals};}
module.exports={funcs,CITATIONS,ValidationError};
