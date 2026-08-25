// filepath: tier5_pall_care_ext2_105_family_engine.js
// TIER5_PALL_CARE_EXT2-105: Family support
'use strict';
const CITATIONS = ['Family_Centered_2020','Palliative_Family_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function family_meeting(req){
  ensureNumber(req.attendees, 'attendees');
  ensureBool(req.goals_set, 'goals_set');
  ensureBool(req.understanding_confirmed, 'understanding_confirmed');
  ensureBool(req.questions_addressed, 'questions_addressed');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  ensureBool(req.cultural_sensitivity, 'cultural_sensitivity');
  let plan;
  if(req.understanding_confirmed===false) plan='continue_with_answer_then_reassess';
  else if(req.questions_addressed===false) plan='continue_with_address_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_schedule_then_reassess';
  else if(req.cultural_sensitivity===false) plan='continue_with_consider_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function caregiver_burden(req){
  ensureNumber(req.burden_score, 'burden_score');
  ensureBool(req.depression, 'depression');
  ensureBool(req.sleep_disorder, 'sleep_disorder');
  ensureBool(req.health_decline, 'health_decline');
  ensureBool(req.respite_needed, 'respite_needed');
  ensureBool(req.financial_burden, 'financial_burden');
  let plan;
  if(req.burden_score>=40) plan='continue_with_intensive_then_reassess';
  else if(req.respite_needed) plan='continue_with_respite_then_reassess';
  else if(req.health_decline) plan='continue_with_address_then_reassess';
  else if(req.financial_burden) plan='continue_with_resources_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function anticipatory(req){
  ensureBool(req.family_aware_trajectory, 'family_aware_trajectory');
  ensureBool(req.prepared_for_decline, 'prepared_for_decline');
  ensureBool(req.prepared_for_death, 'prepared_for_death');
  ensureBool(req.funeral_discussed, 'funeral_discussed');
  ensureBool(req.wishes_documented, 'wishes_documented');
  let plan;
  if(req.family_aware_trajectory===false) plan='continue_with_educate_then_reassess';
  else if(req.prepared_for_decline===false) plan='continue_with_prepare_then_reassess';
  else if(req.prepared_for_death===false) plan='continue_with_death_then_reassess';
  else if(req.wishes_documented===false) plan='continue_with_documented_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function conflict(req){
  ensureBool(req.conflict_identified, 'conflict_identified');
  ensureBool(req.family_meeting_held, 'family_meeting_held');
  ensureBool(req.ethics_consulted, 'ethics_consulted');
  ensureBool(req.chaplain_consulted, 'chaplain_consulted');
  ensureBool(req.mediation_offered, 'mediation_offered');
  ensureBool(req.resolution_reached, 'resolution_reached');
  let plan;
  if(req.conflict_identified===false) plan='continue_with_assess_then_reassess';
  else if(req.family_meeting_held===false) plan='continue_with_meeting_then_reassess';
  else if(req.ethics_consulted===false) plan='continue_with_consult_then_reassess';
  else if(req.resolution_reached===false) plan='continue_with_continue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function support_resources(req){
  ensureBool(req.spiritual_care_offered, 'spiritual_care_offered');
  ensureBool(req.social_work_referral, 'social_work_referral');
  ensureBool(req.support_group_info, 'support_group_info');
  ensureBool(req.counseling_offered, 'counseling_offered');
  ensureBool(req.financial_resources, 'financial_resources');
  let plan;
  if(req.spiritual_care_offered===false) plan='continue_with_offer_then_reassess';
  else if(req.social_work_referral===false) plan='continue_with_refer_then_reassess';
  else if(req.counseling_offered===false) plan='continue_with_offer_then_reassess';
  else if(req.financial_resources===false) plan='continue_with_offer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function child_support(req){
  ensureNumber(req.child_age, 'child_age');
  ensureBool(req.appropriate_explanation, 'appropriate_explanation');
  ensureBool(req.visits_allowed, 'visits_allowed');
  ensureBool(req.support_person, 'support_person');
  ensureBool(req.child_life, 'child_life');
  ensureBool(req.books_offered, 'books_offered');
  let plan;
  if(req.appropriate_explanation===false) plan='continue_with_explain_then_reassess';
  else if(req.visits_allowed===false) plan='continue_with_assess_then_reassess';
  else if(req.support_person===false) plan='continue_with_identify_then_reassess';
  else if(req.child_life===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {family_meeting,caregiver_burden,anticipatory,conflict,support_resources,child_support};}
module.exports={funcs,CITATIONS,ValidationError};
