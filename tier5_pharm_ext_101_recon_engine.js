// filepath: tier5_pharm_ext_101_recon_engine.js
// TIER5_PHARMACOLOGY_EXT-101: Medication reconciliation
'use strict';
const CITATIONS = ['JCAHO_Recon_2018','ASHP_Recon_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function intake(req){
  ensureNumber(req.med_count, 'med_count');
  ensureBool(req.completed, 'completed');
  ensureBool(req.otc_captured, 'otc_captured');
  ensureBool(req.herbal_captured, 'herbal_captured');
  ensureBool(req.verified, 'verified');
  let plan;
  if(req.completed===false) plan='continue_with_complete_then_reassess';
  else if(req.otc_captured===false) plan='continue_with_otc_then_reassess';
  else if(req.herbal_captured===false) plan='continue_with_herbal_then_reassess';
  else if(req.verified===false) plan='continue_with_verify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function discrepancies(req){
  ensureNumber(req.discrepancy_count, 'discrepancy_count');
  ensureBool(req.intentional, 'intentional');
  ensureBool(req.unintentional, 'unintentional');
  ensureBool(req.duplicate, 'duplicate');
  ensureBool(req.interaction, 'interaction');
  ensureBool(req.resolved, 'resolved');
  let plan;
  if(req.unintentional && req.resolved===false) plan='continue_with_resolve_then_reassess';
  else if(req.interaction) plan='continue_with_review_then_reassess';
  else if(req.duplicate) plan='continue_with_dedupe_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transmission(req){
  ensureStr(req.method, 'method');
  ensureEnum(req.method, 'method', ['verbal','phone','fax','email','electronic','portal','paper']);
  ensureBool(req.read_back, 'read_back');
  ensureBool(req.complete, 'complete');
  ensureBool(req.timed_acknowledged, 'timed_acknowledged');
  let plan;
  if(req.read_back===false && req.method==='verbal') plan='continue_with_readback_then_reassess';
  else if(req.complete===false) plan='continue_with_complete_then_reassess';
  else if(req.timed_acknowledged===false) plan='continue_with_acknowledge_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transitions(req){
  ensureStr(req.transition, 'transition');
  ensureEnum(req.transition, 'transition', ['admission','transfer','discharge','clinic','home','none']);
  ensureBool(req.list_updated, 'list_updated');
  ensureBool(req.patient_education, 'patient_education');
  ensureBool(req.community_provider, 'community_provider');
  let plan;
  if(req.list_updated===false) plan='continue_with_update_then_reassess';
  else if(req.transition==='discharge' && req.community_provider===false) plan='continue_with_provider_then_reassess';
  else if(req.patient_education===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function high_risk(req){
  ensureBool(req.anticoag, 'anticoag');
  ensureBool(req.antiplatelet, 'antiplatelet');
  ensureBool(req.insulin, 'insulin');
  ensureBool(req.opioid, 'opioid');
  ensureBool(req.immunosuppressant, 'immunosuppressant');
  ensureBool(req.chemo, 'chemo');
  ensureBool(req.bridging, 'bridging');
  let plan;
  if(req.anticoag && req.bridging===false) plan='continue_with_bridge_plan_then_reassess';
  else if(req.chemo) plan='continue_with_oncology_review_then_reassess';
  else if(req.immunosuppressant) plan='continue_with_levels_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.scheduled, 'scheduled');
  ensureBool(req.pharmacist_called, 'pharmacist_called');
  ensureBool(req.adherence_check, 'adherence_check');
  ensureBool(req.adverse_check, 'adverse_check');
  ensureBool(req.lab_review, 'lab_review');
  let plan;
  if(req.scheduled===false) plan='continue_with_schedule_then_reassess';
  else if(req.pharmacist_called===false) plan='continue_with_call_then_reassess';
  else if(req.adherence_check===false) plan='continue_with_adherence_then_reassess';
  else if(req.adverse_check===false) plan='continue_with_adverse_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {intake,discrepancies,transmission,transitions,high_risk,followup};}
module.exports={funcs,CITATIONS,ValidationError};