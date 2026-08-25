// filepath: tier5_pall_care_ext2_101_ad_engine.js
// TIER5_PALL_CARE_EXT2-101: Advanced Directives
'use strict';
const CITATIONS = ['AHA_AD_2020','Ethics_AD_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function ad_review(req){
  ensureBool(req.ad_present, 'ad_present');
  ensureBool(req.durable_poa, 'durable_poa');
  ensureBool(req.living_will, 'living_will');
  ensureBool(req.healthcare_proxy, 'healthcare_proxy');
  ensureBool(req.dnr_present, 'dnr_present');
  ensureBool(req.dni_present, 'dni_present');
  ensureBool(req.patient_capacity, 'patient_capacity');
  let plan;
  if(req.ad_present===false) plan='continue_with_explore_then_reassess';
  else if(req.healthcare_proxy===false) plan='continue_with_appoint_then_reassess';
  else if(req.patient_capacity===false) plan='continue_with_surrogate_then_reassess';
  else if(req.durable_poa===false) plan='continue_with_dpoa_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function goals_care(req){
  ensureBool(req.values_document, 'values_document');
  ensureBool(req.goals_document, 'goals_document');
  ensureBool(req.treatment_burden_acceptable, 'treatment_burden_acceptable');
  ensureBool(req.prognosis_understand, 'prognosis_understand');
  ensureBool(req.family_aligned, 'family_aligned');
  ensureBool(req.shared_decision, 'shared_decision');
  let plan;
  if(req.values_document===false) plan='continue_with_assess_then_reassess';
  else if(req.prognosis_understand===false) plan='continue_with_discuss_then_reassess';
  else if(req.family_aligned===false) plan='continue_with_meeting_then_reassess';
  else if(req.shared_decision===false) plan='continue_with_collaborate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function code_status(req){
  ensureStr(req.code_status, 'code_status');
  ensureEnum(req.code_status, 'code_status', ['full_code','dnr','dni','dndr','dndi','limited','presumed_wishes']);
  ensureBool(req.patient_consented, 'patient_consented');
  ensureBool(req.surrogate_consented, 'surrogate_consented');
  ensureBool(req.documented_in_chart, 'documented_in_chart');
  ensureBool(req.medical_appropriateness, 'medical_appropriateness');
  let plan;
  if(req.code_status===undefined) plan='continue_with_determine_then_reassess';
  else if(req.patient_consented===false && req.surrogate_consented===false) plan='continue_with_discuss_then_reassess';
  else if(req.documented_in_chart===false) plan='continue_with_documented_then_reassess';
  else if(req.medical_appropriateness===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function capacity(req){
  ensureNumber(req.mmse_score, 'mmse_score');
  ensureBool(req.understands, 'understands');
  ensureBool(req.appreciates, 'appreciates');
  ensureBool(req.reasons, 'reasons');
  ensureBool(req.expresses_choice, 'expresses_choice');
  ensureBool(req.consistent_choice, 'consistent_choice');
  ensureBool(req.dementia_evidence, 'dementia_evidence');
  let plan;
  if(req.dementia_evidence && req.understands===false) plan='continue_with_lacks_capacity_then_reassess';
  else if(req.understands===false) plan='continue_with_re_explain_then_reassess';
  else if(req.appreciates===false) plan='continue_with_assess_then_reassess';
  else if(req.reasons===false) plan='continue_with_evaluate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function surrogate(req){
  ensureStr(req.surrogate_type, 'surrogate_type');
  ensureEnum(req.surrogate_type, 'surrogate_type', ['spouse','adult_child','parent','sibling','friend','court_appointed','ethics_committee','legal_guardian','none_documented']);
  ensureBool(req.surrogate_willing, 'surrogate_willing');
  ensureBool(req.surrogate_present, 'surrogate_present');
  ensureBool(req.backup_surrogate, 'backup_surrogate');
  ensureBool(req.surrogate_understands, 'surrogate_understands');
  let plan;
  if(req.surrogate_type==='none_documented') plan='continue_with_appoint_then_reassess';
  else if(req.surrogate_willing===false) plan='continue_with_alternate_then_reassess';
  else if(req.surrogate_present===false) plan='continue_with_located_then_reassess';
  else if(req.backup_surrogate===false) plan='continue_with_backup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ad_storage(req){
  ensureBool(req.electronic_storage, 'electronic_storage');
  ensureBool(req.surrogate_has_copy, 'surrogate_has_copy');
  ensureBool(req.provider_has_copy, 'provider_has_copy');
  ensureBool(req.behind_directive_register, 'behind_directive_register');
  ensureBool(req.easy_retrievable, 'easy_retrievable');
  let plan;
  if(req.electronic_storage===false) plan='continue_with_digitize_then_reassess';
  else if(req.surrogate_has_copy===false) plan='continue_with_copy_then_reassess';
  else if(req.behind_directive_register===false) plan='continue_with_register_then_reassess';
  else if(req.easy_retrievable===false) plan='continue_with_organize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {ad_review,goals_care,code_status,capacity,surrogate,ad_storage};}
module.exports={funcs,CITATIONS,ValidationError};
