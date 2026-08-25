// filepath: tier5_telehealth_ext_101_triage_engine.js
// TIER5_TELEHEALTH_EXT-101: Tele-triage
'use strict';
const CITATIONS = ['Telehealth_2020','ATA_Telehealth_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function triage(req){
  ensureStr(req.chief_complaint, 'chief_complaint');
  ensureBool(req.life_threat, 'life_threat');
  ensureBool(req.can_self_care, 'can_self_care');
  ensureBool(req.requires_visit, 'requires_visit');
  ensureBool(req.requires_er, 'requires_er');
  ensureBool(req.requires_911, 'requires_911');
  let plan;
  if(req.requires_911) plan='continue_with_911_then_reassess';
  else if(req.requires_er) plan='continue_with_er_then_reassess';
  else if(req.requires_visit) plan='continue_with_inperson_then_reassess';
  else if(req.can_self_care) plan='continue_with_tele_then_reassess';
  else if(req.life_threat) plan='continue_with_911_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function safety_check(req){
  ensureBool(req.demeanor, 'demeanor');
  ensureBool(req.responsive, 'responsive');
  ensureBool(req.environment_safe, 'environment_safe');
  ensureBool(req.support_present, 'support_present');
  ensureBool(req.address_verified, 'address_verified');
  let plan;
  if(req.responsive===false) plan='continue_with_911_then_reassess';
  else if(req.environment_safe===false) plan='continue_with_911_welfare_check_then_reassess';
  else if(req.address_verified===false) plan='continue_with_verify_then_reassess';
  else if(req.support_present===false) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function symptom(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.fever, 'fever');
  ensureBool(req.dyspnea, 'dyspnea');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.neurologic_deficit, 'neurologic_deficit');
  ensureBool(req.chest_pain, 'chest_pain');
  let plan;
  if(req.chest_pain && req.dyspnea) plan='continue_with_urgent_then_reassess';
  else if(req.neurologic_deficit) plan='continue_with_urgent_then_reassess';
  else if(req.bleeding) plan='continue_with_assess_then_reassess';
  else if(req.fever) plan='continue_with_assess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function documentation(req){
  ensureBool(req.history_obtained, 'history_obtained');
  ensureBool(req.exam_documented, 'exam_documented');
  ensureBool(req.assessment_documented, 'assessment_documented');
  ensureBool(req.plan_documented, 'plan_documented');
  ensureBool(req.consent_obtained, 'consent_obtained');
  let plan;
  if(req.history_obtained===false) plan='continue_with_obtain_then_reassess';
  else if(req.exam_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.assessment_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.plan_documented===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function disposition(req){
  ensureStr(req.disposition, 'disposition');
  ensureEnum(req.disposition, 'disposition', ['911','er','urgent_care','in_person_visit','tele_followup','self_care','prescription','lab_imaging','specialist_referral','observation']);
  ensureBool(req.patient_understands, 'patient_understands');
  ensureBool(req.safety_plan, 'safety_plan');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  ensureBool(req.education_provided, 'education_provided');
  let plan;
  if(req.patient_understands===false) plan='continue_with_teach_back_then_reassess';
  else if(req.safety_plan===false) plan='continue_with_develop_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_schedule_then_reassess';
  else if(req.education_provided===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function escalation(req){
  ensureBool(req.deterioration, 'deterioration');
  ensureBool(req.uncertainty, 'uncertainty');
  ensureBool(req.supervisor_consulted, 'supervisor_consulted');
  ensureBool(req.complex_case, 'complex_case');
  ensureBool(req.referral_made, 'referral_made');
  let plan;
  if(req.deterioration) plan='continue_with_911_then_reassess';
  else if(req.uncertainty) plan='continue_with_consult_then_reassess';
  else if(req.complex_case) plan='continue_with_refer_then_reassess';
  else if(req.supervisor_consulted===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {triage,safety_check,symptom,documentation,disposition,escalation};}
module.exports={funcs,CITATIONS,ValidationError};
