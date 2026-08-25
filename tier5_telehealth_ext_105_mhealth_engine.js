// filepath: tier5_telehealth_ext_105_mhealth_engine.js
// TIER5_TELEHEALTH_EXT-105: mHealth apps
'use strict';
const CITATIONS = ['mHealth_2020','Digital_Health_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function app_selection(req){
  ensureStr(req.app_category, 'app_category');
  ensureEnum(req.app_category, 'app_category', ['diabetes','hypertension','asthma','copd','mental_health','meditation','pregnancy','postpartum','heart_failure','weight','fitness','sleep','smoking_cessation','epilepsy','pain','none']);
  ensureBool(req.fda_approved, 'fda_approved');
  ensureBool(req.evidence_based, 'evidence_based');
  ensureBool(req.privacy_compliant, 'privacy_compliant');
  ensureBool(req.hipaa_compliant, 'hipaa_compliant');
  let plan;
  if(req.fda_approved===false && req.evidence_based===false) plan='continue_with_review_then_reassess';
  else if(req.privacy_compliant===false) plan='continue_with_review_then_reassess';
  else if(req.hipaa_compliant===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prescription(req){
  ensureBool(req.recommendation, 'recommendation');
  ensureBool(req.download_instructions, 'download_instructions');
  ensureBool(req.password_shared, 'password_shared');
  ensureBool(req.demo_provided, 'demo_provided');
  ensureBool(req.family_educated, 'family_educated');
  let plan;
  if(req.recommendation===false) plan='continue_with_recommend_then_reassess';
  else if(req.download_instructions===false) plan='continue_with_instruct_then_reassess';
  else if(req.demo_provided===false) plan='continue_with_demo_then_reassess';
  else if(req.family_educated===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function data_integration(req){
  ensureBool(req.api_available, 'api_available');
  ensureBool(req.ehr_integration, 'ehr_integration');
  ensureBool(req.data_reviewed, 'data_reviewed');
  ensureBool(req.alerts_to_clinician, 'alerts_to_clinician');
  ensureBool(req.workflow_integration, 'workflow_integration');
  let plan;
  if(req.api_available===false) plan='continue_with_review_then_reassess';
  else if(req.ehr_integration===false) plan='continue_with_integration_then_reassess';
  else if(req.data_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.workflow_integration===false) plan='continue_with_integrate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function engagement(req){
  ensureNumber(req.days_active, 'days_active');
  ensureBool(req.engagement_adequate, 'engagement_adequate');
  ensureBool(req.notifications_helpful, 'notifications_helpful');
  ensureBool(req.goals_achieved, 'goals_achieved');
  ensureBool(req.reinforcement, 'reinforcement');
  let plan;
  if(req.engagement_adequate===false) plan='continue_with_reinforce_then_reassess';
  else if(req.notifications_helpful===false) plan='continue_with_adjust_then_reassess';
  else if(req.goals_achieved===false) plan='continue_with_reassess_then_reassess';
  else if(req.reinforcement===false) plan='continue_with_reinforce_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function privacy(req){
  ensureBool(req.consent_for_data, 'consent_for_data');
  ensureBool(req.data_encrypted, 'data_encrypted');
  ensureBool(req.third_party_shared, 'third_party_shared');
  ensureBool(req.patient_rights_informed, 'patient_rights_informed');
  ensureBool(req.privacy_policy_reviewed, 'privacy_policy_reviewed');
  let plan;
  if(req.consent_for_data===false) plan='continue_with_consent_then_reassess';
  else if(req.data_encrypted===false) plan='continue_with_require_then_reassess';
  else if(req.third_party_shared) plan='continue_with_review_then_reassess';
  else if(req.privacy_policy_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function review(req){
  ensureBool(req.outcome_reviewed, 'outcome_reviewed');
  ensureBool(req.clinical_impact, 'clinical_impact');
  ensureBool(req.cost_impact, 'cost_impact');
  ensureBool(req.user_satisfaction, 'user_satisfaction');
  ensureBool(req.modifications_needed, 'modifications_needed');
  let plan;
  if(req.outcome_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.clinical_impact===false) plan='continue_with_reassess_then_reassess';
  else if(req.user_satisfaction===false) plan='continue_with_modify_then_reassess';
  else if(req.modifications_needed) plan='continue_with_modify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {app_selection,prescription,data_integration,engagement,privacy,review};}
module.exports={funcs,CITATIONS,ValidationError};
