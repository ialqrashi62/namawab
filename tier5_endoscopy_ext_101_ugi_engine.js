// filepath: tier5_endoscopy_ext_101_ugi_engine.js
// TIER5_ENDOSCOPY_EXT-101: Upper GI endoscopy
'use strict';
const CITATIONS = ['ASGE_UGI_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['gi_bleed','dysphagia','persistent_vomiting','weight_loss','anemia_workup','peptic_ulcer_followup','reflux_workup','mass_suspicion','therapeutic','foreign_body','surveillance','screening','other']);
  ensureBool(req.appropriate, 'appropriate');
  ensureBool(req.consent_obtained, 'consent_obtained');
  ensureBool(req.npo_confirmed, 'npo_confirmed');
  let plan;
  if(req.appropriate===false) plan='continue_with_review_then_reassess';
  else if(req.npo_confirmed===false) plan='continue_with_npo_then_reassess';
  else if(req.consent_obtained===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function findings(req){
  ensureStr(req.findings, 'findings');
  ensureEnum(req.findings, 'findings', ['normal','esophagitis','gastritis','ulcer','mass','varices','stricture','hiatal_hernia','polyps','diverticula','angiodysplasia','other']);
  ensureBool(req.biopsies_taken, 'biopsies_taken');
  ensureBool(req.therapeutic_performed, 'therapeutic_performed');
  let plan;
  if(req.findings==='mass') plan='continue_with_pathology_then_reassess';
  else if(req.findings==='varices') plan='continue_with_band_then_reassess';
  else if(req.therapeutic_performed===false && req.findings!=='normal') plan='continue_with_consider_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sedation(req){
  ensureStr(req.sedation_type, 'sedation_type');
  ensureEnum(req.sedation_type, 'sedation_type', ['none','topical_only','moderate','deep','general','monitored_anesthesia_care']);
  ensureBool(req.airway_assessed, 'airway_assessed');
  ensureBool(req.mallampati_documented, 'mallampati_documented');
  ensureBool(req.reversal_needed, 'reversal_needed');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.complications) plan='continue_with_rescue_then_reassess';
  else if(req.airway_assessed===false) plan='continue_with_assess_then_reassess';
  else if(req.mallampati_documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.cardiopulmonary, 'cardiopulmonary');
  ensureBool(req.aspiration, 'aspiration');
  ensureBool(req.managed, 'managed');
  ensureBool(req.surgical_consult, 'surgical_consult');
  let plan;
  if(req.perforation) plan='continue_with_surgical_then_reassess';
  else if(req.aspiration) plan='continue_with_oxygen_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_clip_then_reassess';
  else if(req.cardiopulmonary) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function post(req){
  ensureBool(req.recovery_complete, 'recovery_complete');
  ensureBool(req.diet_tolerated, 'diet_tolerated');
  ensureBool(req.discharge_criteria_met, 'discharge_criteria_met');
  ensureBool(req.informed_driver, 'informed_driver');
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.discharge_criteria_met===false) plan='continue_with_extend_then_reassess';
  else if(req.informed_driver===false) plan='continue_with_driver_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pathology(req){
  ensureBool(req.samples_collected, 'samples_collected');
  ensureBool(req.pathology_sent, 'pathology_sent');
  ensureBool(req.followup_planned, 'followup_planned');
  ensureBool(req.results_reviewed, 'results_reviewed');
  let plan;
  if(req.pathology_sent===false) plan='continue_with_send_then_reassess';
  else if(req.results_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indication,findings,sedation,complications,post,pathology};}
module.exports={funcs,CITATIONS,ValidationError};