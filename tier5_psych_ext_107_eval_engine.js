// filepath: tier5_psych_ext_107_eval_engine.js
// TIER5_PSYCH_EXT-107: Psychiatric Evaluation
'use strict';
const CITATIONS = ['DSM5_TR_2022', 'APA_PRACTICE_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function intake(req){
  ensureEnum(req.referral_source, 'referral_source', ['pcp','self','er','court','school','family','insurance','other']);
  ensureBool(req.consent, 'consent');
  ensureStr(req.chief_complaint, 'chief_complaint');
  ensureNumber(req.symptom_duration_weeks, 'symptom_duration_weeks');
  ensureNumber(req.previous_episodes, 'previous_episodes');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.symptom_duration_weeks<2) plan='continue_with_observation_then_reassess';
  else plan='continue_with_full_eval_then_reassess';
  return {plan};
}
function history(req){
  ensureBool(req.medical_history, 'medical_history');
  ensureBool(req.family_history, 'family_history');
  ensureBool(req.social_history, 'social_history');
  ensureBool(req.substance_history, 'substance_history');
  ensureBool(req.developmental_history, 'developmental_history');
  ensureBool(req.trauma_history, 'trauma_history');
  let plan;
  if(req.substance_history===false && req.developmental_history===false) plan='continue_with_supplemental_then_reassess';
  else plan='continue_with_examination_then_reassess';
  return {plan};
}
function mse(req){
  ensureStr(req.appearance, 'appearance');
  ensureEnum(req.appearance, 'appearance', ['well_groomed','disheveled','unkempt','age_appropriate','inappropriate','other']);
  ensureEnum(req.mood, 'mood', ['euthymic','depressed','elevated','irritable','anxious','flat','labile','other']);
  ensureEnum(req.affect, 'affect', ['full','restricted','blunted','flat','labile','appropriate','inappropriate','other']);
  ensureBool(req.thought_process, 'thought_process');
  ensureBool(req.thought_content, 'thought_content');
  ensureEnum(req.orientation, 'orientation', ['alert','oriented_x3','oriented_x2','oriented_x1','disoriented','clouded','other']);
  let plan;
  if(req.orientation==='disoriented' || req.orientation==='clouded') plan='continue_with_organic_workup_then_reassess';
  else if(req.thought_content===false) plan='continue_with_safety_review_then_reassess';
  else plan='continue_with_testing_then_reassess';
  return {plan};
}
function risk(req){
  ensureBool(req.suicidal_ideation, 'suicidal_ideation');
  ensureBool(req.homicidal_ideation, 'homicidal_ideation');
  ensureNumber(req.plan_intent, 'plan_intent');
  ensureNumber(req.lethality, 'lethality');
  ensureEnum(req.protective_factors, 'protective_factors', ['present','partial','absent','unknown']);
  ensureBool(req.means_restricted, 'means_restricted');
  let plan;
  if(req.suicidal_ideation===true && req.plan_intent>=4) plan='continue_with_inpatient_then_reassess';
  else if(req.homicidal_ideation===true && req.lethality>=4) plan='continue_with_inpatient_then_reassess';
  else if(req.protective_factors==='absent') plan='continue_with_safety_plan_then_reassess';
  else plan='continue_with_outpatient_plan_then_reassess';
  return {plan};
}
function diagnosis(req){
  ensureStr(req.dsm_category, 'dsm_category');
  ensureEnum(req.dsm_category, 'dsm_category', ['neurodevelopmental','schizophrenia','bipolar','depressive','anxiety','ocd','ptsd','stress','dissociative','somatic','feeding','substance','personality','gender','impulse_control','sleep','sexual','paraphilic','cognitive','other']);
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','extreme','unspecified','other']);
  ensureBool(req.duration_met, 'duration_met');
  ensureBool(req.impairment_met, 'impairment_met');
  let plan;
  if(req.duration_met===false) plan='continue_with_monitor_then_reassess';
  else if(req.impairment_met===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_treatment_plan_then_reassess';
  return {plan};
}
function treatment_plan(req){
  ensureEnum(req.modality, 'modality', ['medication','therapy','combined','observation','referral','inpatient','other']);
  ensureBool(req.patient_agreement, 'patient_agreement');
  ensureNumber(req.followup_weeks, 'followup_weeks');
  ensureBool(req.safety_plan, 'safety_plan');
  ensureBool(req.support_system, 'support_system');
  let plan;
  if(req.patient_agreement===false) plan='continue_with_assess_then_reassess';
  else if(req.followup_weeks>8) plan='continue_with_tighter_followup_then_reassess';
  else plan='continue_with_proceed_then_reassess';
  return {plan};
}

function funcs(){return {intake,history,mse,risk,diagnosis,treatment_plan};}
module.exports = {funcs, CITATIONS, ValidationError};
