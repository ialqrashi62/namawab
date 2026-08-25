// filepath: tier5_public_health_ext_106_promo_engine.js
// TIER5_PUBLIC_HEALTH_EXT-106: Health promotion
'use strict';
const CITATIONS = ['PublicHealth_2020','WHO_Promotion_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assessment(req){
  ensureNumber(req.age, 'age');
  ensureStr(req.community, 'community');
  ensureEnum(req.community, 'community', ['urban','suburban','rural','underserved','transient','displaced','general']);
  ensureBool(req.social_determinants_screened, 'social_determinants_screened');
  ensureBool(req.health_literacy, 'health_literacy');
  ensureBool(req.cultural_factors, 'cultural_factors');
  let plan;
  if(req.social_determinants_screened===false) plan='continue_with_screen_then_reassess';
  else if(req.community==='underserved') plan='continue_with_connect_then_reassess';
  else if(req.health_literacy===false) plan='continue_with_educate_then_reassess';
  else if(req.cultural_factors) plan='continue_with_consider_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function education(req){
  ensureBool(req.topic_identified, 'topic_identified');
  ensureBool(req.materials_appropriate, 'materials_appropriate');
  ensureBool(req.delivered, 'delivered');
  ensureBool(req.understanding_confirmed, 'understanding_confirmed');
  ensureBool(req.follow_up_planned, 'follow_up_planned');
  let plan;
  if(req.topic_identified===false) plan='continue_with_assess_then_reassess';
  else if(req.materials_appropriate===false) plan='continue_with_tailor_then_reassess';
  else if(req.understanding_confirmed===false) plan='continue_with_confirm_then_reassess';
  else if(req.follow_up_planned===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function lifestyle(req){
  ensureNumber(req.exercise_min_week, 'exercise_min_week');
  ensureBool(req.diet_quality, 'diet_quality');
  ensureBool(req.smoking_status, 'smoking_status');
  ensureBool(req.alcohol_use, 'alcohol_use');
  ensureBool(req.sleep_hours, 'sleep_hours');
  ensureBool(req.stress_management, 'stress_management');
  let plan;
  if(req.exercise_min_week<150) plan='continue_with_counsel_then_reassess';
  else if(req.diet_quality===false) plan='continue_with_dietitian_then_reassess';
  else if(req.smoking_status) plan='continue_with_cessation_then_reassess';
  else if(req.stress_management===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function community_resources(req){
  ensureBool(req.resources_identified, 'resources_identified');
  ensureBool(req.contact_provided, 'contact_provided');
  ensureBool(req.warm_handoff, 'warm_handoff');
  ensureBool(req.followup_assistance, 'followup_assistance');
  ensureBool(req.barriers_addressed, 'barriers_addressed');
  let plan;
  if(req.resources_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.contact_provided===false) plan='continue_with_provide_then_reassess';
  else if(req.warm_handoff===false) plan='continue_with_warm_then_reassess';
  else if(req.barriers_addressed===false) plan='continue_with_address_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function literacy(req){
  ensureBool(req.assessed, 'assessed');
  ensureBool(req.verbal_teach_back, 'verbal_teach_back');
  ensureBool(req.written_appropriate, 'written_appropriate');
  ensureBool(req.visual_aids, 'visual_aids');
  ensureBool(req.interpreter_used, 'interpreter_used');
  let plan;
  if(req.assessed===false) plan='continue_with_assess_then_reassess';
  else if(req.verbal_teach_back===false) plan='continue_with_teach_back_then_reassess';
  else if(req.written_appropriate===false) plan='continue_with_appropriate_then_reassess';
  else if(req.interpreter_used===false) plan='continue_with_interpreter_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function campaign(req){
  ensureNumber(req.target_audience, 'target_audience');
  ensureBool(req.objective_set, 'objective_set');
  ensureBool(req.message_tested, 'message_tested');
  ensureBool(req.channels_appropriate, 'channels_appropriate');
  ensureBool(req.outcome_measured, 'outcome_measured');
  let plan;
  if(req.objective_set===false) plan='continue_with_set_then_reassess';
  else if(req.message_tested===false) plan='continue_with_test_then_reassess';
  else if(req.channels_appropriate===false) plan='continue_with_select_then_reassess';
  else if(req.outcome_measured===false) plan='continue_with_measure_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assessment,education,lifestyle,community_resources,literacy,campaign};}
module.exports={funcs,CITATIONS,ValidationError};
