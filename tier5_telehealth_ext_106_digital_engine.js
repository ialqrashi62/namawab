// filepath: tier5_telehealth_ext_106_digital_engine.js
// TIER5_TELEHEALTH_EXT-106: Digital health IT
'use strict';
const CITATIONS = ['Digital_Health_2020','HealthIT_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function platform(req){
  ensureBool(req.ehr_connected, 'ehr_connected');
  ensureBool(req.sso_working, 'sso_working');
  ensureBool(req.uptime_acceptable, 'uptime_acceptable');
  ensureBool(req.audit_log, 'audit_log');
  ensureBool(req.encryption_enabled, 'encryption_enabled');
  let plan;
  if(req.ehr_connected===false) plan='continue_with_integration_then_reassess';
  else if(req.audit_log===false) plan='continue_with_audit_then_reassess';
  else if(req.encryption_enabled===false) plan='continue_with_encrypt_then_reassess';
  else if(req.uptime_acceptable===false) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function compliance(req){
  ensureBool(req.hipaa_compliant, 'hipaa_compliant');
  ensureBool(req.gdpr_compliant, 'gdpr_compliant');
  ensureBool(req.hitrust_aligned, 'hitrust_aligned');
  ensureBool(req.business_associate_agreements, 'business_associate_agreements');
  ensureBool(req.breach_notification, 'breach_notification');
  let plan;
  if(req.hipaa_compliant===false) plan='continue_with_review_then_reassess';
  else if(req.business_associate_agreements===false) plan='continue_with_obtain_then_reassess';
  else if(req.breach_notification===false) plan='continue_with_develop_then_reassess';
  else if(req.hitrust_aligned===false) plan='continue_with_align_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function interoperability(req){
  ensureBool(req.fhir_compliant, 'fhir_compliant');
  ensureBool(req.hl7_supported, 'hl7_supported');
  ensureBool(req.api_documented, 'api_documented');
  ensureBool(req.standards_adopted, 'standards_adopted');
  ensureBool(req.consent_management, 'consent_management');
  let plan;
  if(req.fhir_compliant===false) plan='continue_with_migrate_then_reassess';
  else if(req.standards_adopted===false) plan='continue_with_adopt_then_reassess';
  else if(req.consent_management===false) plan='continue_with_implement_then_reassess';
  else if(req.api_documented===false) plan='continue_with_documented_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function data_governance(req){
  ensureBool(req.master_data, 'master_data');
  ensureBool(req.data_quality, 'data_quality');
  ensureBool(req.data_lineage, 'data_lineage');
  ensureBool(req.metadata_managed, 'metadata_managed');
  ensureBool(req.data_catalog, 'data_catalog');
  let plan;
  if(req.master_data===false) plan='continue_with_define_then_reassess';
  else if(req.data_quality===false) plan='continue_with_improve_then_reassess';
  else if(req.data_lineage===false) plan='continue_with_track_then_reassess';
  else if(req.data_catalog===false) plan='continue_with_create_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function change(req){
  ensureBool(req.stakeholder_engaged, 'stakeholder_engaged');
  ensureBool(req.change_request_approved, 'change_request_approved');
  ensureBool(req.testing_completed, 'testing_completed');
  ensureBool(req.training_completed, 'training_completed');
  ensureBool(req.rollback_plan, 'rollback_plan');
  let plan;
  if(req.change_request_approved===false) plan='continue_with_approve_then_reassess';
  else if(req.testing_completed===false) plan='continue_with_test_then_reassess';
  else if(req.training_completed===false) plan='continue_with_train_then_reassess';
  else if(req.rollback_plan===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function adoption(req){
  ensureNumber(req.user_count, 'user_count');
  ensureNumber(req.eligible_count, 'eligible_count');
  ensureBool(req.training_reached, 'training_reached');
  ensureBool(req.satisfaction_high, 'satisfaction_high');
  ensureBool(req.barriers_addressed, 'barriers_addressed');
  let plan;
  if(req.user_count<req.eligible_count) plan='continue_with_outreach_then_reassess';
  else if(req.training_reached===false) plan='continue_with_train_then_reassess';
  else if(req.satisfaction_high===false) plan='continue_with_address_then_reassess';
  else if(req.barriers_addressed===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {platform,compliance,interoperability,data_governance,change,adoption};}
module.exports={funcs,CITATIONS,ValidationError};
