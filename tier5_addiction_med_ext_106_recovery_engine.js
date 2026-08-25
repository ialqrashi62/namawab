// filepath: tier5_addiction_med_ext_106_recovery_engine.js
// TIER5_ADDICTION_MED_EXT-106: Recovery support
'use strict';
const CITATIONS = ['Recovery_2020','SAMHSA_Recovery_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function recovery_plan(req){
  ensureBool(req.person_centered, 'person_centered');
  ensureBool(req.goals_documented, 'goals_documented');
  ensureBool(req.strengths_identified, 'strengths_identified');
  ensureBool(req.barriers_identified, 'barriers_identified');
  ensureBool(req.community_resources, 'community_resources');
  ensureBool(req.family_involvement, 'family_involvement');
  let plan;
  if(req.person_centered===false) plan='continue_with_recenter_then_reassess';
  else if(req.goals_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.strengths_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.barriers_identified===false) plan='continue_with_assess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function peer(req){
  ensureBool(req.peer_connection_made, 'peer_connection_made');
  ensureBool(req.peer_specialist, 'peer_specialist');
  ensureBool(req.peer_groups, 'peer_groups');
  ensureBool(req.peer_availability, 'peer_availability');
  ensureBool(req.relationship_quality, 'relationship_quality');
  let plan;
  if(req.peer_connection_made===false) plan='continue_with_introduce_then_reassess';
  else if(req.peer_availability===false) plan='continue_with_assess_then_reassess';
  else if(req.peer_groups===false) plan='continue_with_groups_then_reassess';
  else if(req.relationship_quality===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function housing_stab(req){
  ensureBool(req.housing_secured, 'housing_secured');
  ensureBool(req.rent_assistance, 'rent_assistance');
  ensureBool(req.utilities_assistance, 'utilities_assistance');
  ensureBool(req.transitional_living, 'transitional_living');
  ensureBool(req.stable_30_days, 'stable_30_days');
  let plan;
  if(req.housing_secured===false) plan='continue_with_secure_then_reassess';
  else if(req.rent_assistance===false) plan='continue_with_assist_then_reassess';
  else if(req.transitional_living===false) plan='continue_with_explore_then_reassess';
  else if(req.stable_30_days===false) plan='continue_with_maintain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function employment(req){
  ensureBool(req.employment_status, 'employment_status');
  ensureBool(req.voc_training, 'voc_training');
  ensureBool(req.workplace_accommodations, 'workplace_accommodations');
  ensureBool(req.fair_chance_employer, 'fair_chance_employer');
  ensureBool(req.income_stable, 'income_stable');
  let plan;
  if(req.employment_status===false) plan='continue_with_voc_assessment_then_reassess';
  else if(req.voc_training===false) plan='continue_with_training_then_reassess';
  else if(req.workplace_accommodations===false) plan='continue_with_request_then_reassess';
  else if(req.income_stable===false) plan='continue_with_assessment_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function family_sup(req){
  ensureBool(req.family_connections, 'family_connections');
  ensureBool(req.family_education, 'family_education');
  ensureBool(req.family_therapy, 'family_therapy');
  ensureBool(req.children_reunification, 'children_reunification');
  ensureBool(req.community_integration, 'community_integration');
  let plan;
  if(req.family_connections===false) plan='continue_with_reconnect_then_reassess';
  else if(req.family_education===false) plan='continue_with_education_then_reassess';
  else if(req.community_integration===false) plan='continue_with_introduce_then_reassess';
  else if(req.children_reunification===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function advocacy(req){
  ensureBool(req.legal_aid, 'legal_aid');
  ensureBool(req.criminal_justice_involvement, 'criminal_justice_involvement');
  ensureBool(req.housing_discrimination, 'housing_discrimination');
  ensureBool(req.employment_discrimination, 'employment_discrimination');
  ensureBool(req.self_advocacy_skills, 'self_advocacy_skills');
  let plan;
  if(req.legal_aid===false) plan='continue_with_aid_then_reassess';
  else if(req.criminal_justice_involvement) plan='continue_with_specialist_then_reassess';
  else if(req.housing_discrimination) plan='continue_with_civil_rights_then_reassess';
  else if(req.employment_discrimination) plan='continue_with_first_step_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {recovery_plan,peer,housing_stab,employment,family_sup,advocacy};}
module.exports={funcs,CITATIONS,ValidationError};
