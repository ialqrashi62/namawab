// filepath: tier5_addiction_med_ext_104_behavioral_engine.js
// TIER5_ADDICTION_MED_EXT-104: Behavioral therapies
'use strict';
const CITATIONS = ['NIDA_Principles_2020','CBT_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cbt(req){
  ensureNumber(req.sessions_attended, 'sessions_attended');
  ensureNumber(req.craving_resistance_score, 'craving_resistance_score');
  ensureBool(req.coping_skills, 'coping_skills');
  ensureBool(req.trigger_identification, 'trigger_identification');
  ensureBool(req.relapse_prevention_plan, 'relapse_prevention_plan');
  ensureBool(req.session_attendance, 'session_attendance');
  let plan;
  if(req.session_attendance===false) plan='continue_with_address_then_reassess';
  else if(req.trigger_identification===false) plan='continue_with_identify_then_reassess';
  else if(req.coping_skills===false) plan='continue_with_teach_then_reassess';
  else if(req.relapse_prevention_plan===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cm(req){
  ensureNumber(req.num_drug_tests, 'num_drug_tests');
  ensureNumber(req.drug_test_negative_pct, 'drug_test_negative_pct');
  ensureBool(req.voucher_earned, 'voucher_earned');
  ensureBool(req.incentive_active, 'incentive_active');
  ensureBool(req.family_involvement, 'family_involvement');
  let plan;
  if(req.incentive_active===false) plan='continue_with_initiate_then_reassess';
  else if(req.drug_test_negative_pct<50) plan='continue_with_review_then_reassess';
  else if(req.family_involvement===false) plan='continue_with_involve_then_reassess';
  else if(req.drug_test_negative_pct>=80) plan='continue_with_observation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function mi(req){
  ensureNumber(req.transtheoretical_stage, 'transtheoretical_stage');
  ensureBool(req.treatment_engaged, 'treatment_engaged');
  ensureBool(req.ambivalence_reduced, 'ambivalence_reduced');
  ensureBool(req.discrepancy_developed, 'discrepancy_developed');
  ensureBool(req.self_efficacy_built, 'self_efficacy_built');
  ensureBool(req.collaborative_relationship, 'collaborative_relationship');
  let plan;
  if(req.collaborative_relationship===false) plan='continue_with_relationship_then_reassess';
  else if(req.transtheoretical_stage<=2) plan='continue_with_engage_then_reassess';
  else if(req.ambivalence_reduced===false) plan='continue_with_address_then_reassess';
  else if(req.discrepancy_developed===false) plan='continue_with_build_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function twelve_step(req){
  ensureBool(req.first_meeting_attended, 'first_meeting_attended');
  ensureBool(req.sponsor_assigned, 'sponsor_assigned');
  ensureBool(req.steps_work_started, 'steps_work_started');
  ensureBool(req.regular_attendance, 'regular_attendance');
  ensureNumber(req.meetings_per_week, 'meetings_per_week');
  ensureBool(req.commitment_evidence, 'commitment_evidence');
  let plan;
  if(req.first_meeting_attended===false) plan='continue_with_introduce_then_reassess';
  else if(req.meetings_per_week<2) plan='continue_with_increase_then_reassess';
  else if(req.sponsor_assigned===false) plan='continue_with_sponsor_then_reassess';
  else if(req.regular_attendance===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function family(req){
  ensureBool(req.identified_supports, 'identified_supports');
  ensureBool(req.family_education, 'family_education');
  ensureBool(req.couples_counseling, 'couples_counseling');
  ensureBool(req.family_therapy_active, 'family_therapy_active');
  ensureBool(req.addressing_enabling, 'addressing_enabling');
  let plan;
  if(req.identified_supports===false) plan='continue_with_identify_then_reassess';
  else if(req.family_education===false) plan='continue_with_education_then_reassess';
  else if(req.addressing_enabling===false) plan='continue_with_address_then_reassess';
  else if(req.family_therapy_active===false) plan='continue_with_initiate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function relapse(req){
  ensureBool(req.relapse_plan_document, 'relapse_plan_document');
  ensureBool(req.warning_signs_identified, 'warning_signs_identified');
  ensureBool(req.coping_strategies, 'coping_strategies');
  ensureBool(req.support_network_active, 'support_network_active');
  ensureBool(req.lapse_response_plan, 'lapse_response_plan');
  let plan;
  if(req.warning_signs_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.coping_strategies===false) plan='continue_with_teach_then_reassess';
  else if(req.lapse_response_plan===false) plan='continue_with_develop_then_reassess';
  else if(req.support_network_active===false) plan='continue_with_network_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {cbt,cm,mi,twelve_step,family,relapse};}
module.exports={funcs,CITATIONS,ValidationError};
