// filepath: tier5_telehealth_ext_103_econsult_engine.js
// TIER5_TELEHEALTH_EXT-103: E-consult
'use strict';
const CITATIONS = ['Econsult_2020','Specialist_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function request(req){
  ensureStr(req.consult_type, 'consult_type');
  ensureEnum(req.consult_type, 'consult_type', ['cardiology','endocrinology','nephrology','rheumatology','infectious_disease','hematology','oncology','dermatology','psychiatry','neurology','gastroenterology','pulmonology','urology','ent','orthopedics','allergy_immunology','obstetrics','gynecology','pediatrics','surgery','plastic_surgery','neurosurgery','cardiothoracic','vascular','ophthalmology','pain','palliative','addiction','sleep','general']);
  ensureBool(req.question_focused, 'question_focused');
  ensureBool(req.workup_done, 'workup_done');
  ensureBool(req.relevant_attachments, 'relevant_attachments');
  ensureBool(req.medical_record_shared, 'medical_record_shared');
  ensureBool(req.consent_obtained, 'consent_obtained');
  let plan;
  if(req.question_focused===false) plan='continue_with_refine_then_reassess';
  else if(req.workup_done===false) plan='continue_with_investigate_then_reassess';
  else if(req.medical_record_shared===false) plan='continue_with_share_then_reassess';
  else if(req.consent_obtained===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function review(req){
  ensureNumber(req.days_since_request, 'days_since_request');
  ensureBool(req.specialist_reviewed, 'specialist_reviewed');
  ensureBool(req.zone_reviewed, 'zone_reviewed');
  ensureBool(req.recommendations_provided, 'recommendations_provided');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.specialist_reviewed===false) plan='continue_with_pursue_then_reassess';
  else if(req.recommendations_provided===false) plan='continue_with_pursue_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_schedule_then_reassess';
  else if(req.days_since_request>5) plan='continue_with_pursue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function quality(req){
  ensureBool(req.recommendations_evidence_based, 'recommendations_evidence_based');
  ensureBool(req.actionable, 'actionable');
  ensureBool(req.timely_response, 'timely_response');
  ensureBool(req.clarity_of_response, 'clarity_of_response');
  ensureBool(req.impact_on_care, 'impact_on_care');
  let plan;
  if(req.recommendations_evidence_based===false) plan='continue_with_review_then_reassess';
  else if(req.actionable===false) plan='continue_with_clarify_then_reassess';
  else if(req.timely_response===false) plan='continue_with_refer_then_reassess';
  else if(req.impact_on_care===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function closure(req){
  ensureBool(req.question_answered, 'question_answered');
  ensureBool(req.recommendations_documented, 'recommendations_documented');
  ensureBool(req.patient_notified, 'patient_notified');
  ensureBool(req.pcp_reviewed, 'pcp_reviewed');
  ensureBool(req.action_plan, 'action_plan');
  let plan;
  if(req.question_answered===false) plan='continue_with_followup_then_reassess';
  else if(req.recommendations_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.patient_notified===false) plan='continue_with_notify_then_reassess';
  else if(req.action_plan===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function specialist(req){
  ensureBool(req.workload_managed, 'workload_managed');
  ensureBool(req.dashboard_active, 'dashboard_active');
  ensureBool(req.response_time, 'response_time');
  ensureBool(req.profitability, 'profitability');
  ensureBool(req.continuing_education, 'continuing_education');
  let plan;
  if(req.workload_managed===false) plan='continue_with_redistribute_then_reassess';
  else if(req.dashboard_active===false) plan='continue_with_activate_then_reassess';
  else if(req.response_time===false) plan='continue_with_address_then_reassess';
  else if(req.continuing_education===false) plan='continue_with_continue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function scaling(req){
  ensureNumber(req.volume_per_month, 'volume_per_month');
  ensureBool(req.wait_time_acceptable, 'wait_time_acceptable');
  ensureBool(req.equity_addressed, 'equity_addressed');
  ensureBool(req.multi_state_license, 'multi_state_license');
  ensureBool(req.cost_effective, 'cost_effective');
  let plan;
  if(req.wait_time_acceptable===false) plan='continue_with_add_specialists_then_reassess';
  else if(req.equity_addressed===false) plan='continue_with_address_then_reassess';
  else if(req.multi_state_license===false) plan='continue_with_obtain_then_reassess';
  else if(req.cost_effective===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {request,review,quality,closure,specialist,scaling};}
module.exports={funcs,CITATIONS,ValidationError};
