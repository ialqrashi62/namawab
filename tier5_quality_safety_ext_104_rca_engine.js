// filepath: tier5_quality_safety_ext_104_rca_engine.js
// TIER5_QUALITY_SAFETY_EXT-104: Root cause analysis
'use strict';
const CITATIONS = ['RCA_2020','TJC_RCA_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function team(req){
  ensureBool(req.leader_identified, 'leader_identified');
  ensureBool(req.facilitator_engaged, 'facilitator_engaged');
  ensureBool(req.team_interdisciplinary, 'team_interdisciplinary');
  ensureBool(req.frontline_included, 'frontline_included');
  ensureBool(req.leadership_aware, 'leadership_aware');
  let plan;
  if(req.leader_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.facilitator_engaged===false) plan='continue_with_engage_then_reassess';
  else if(req.frontline_included===false) plan='continue_with_include_then_reassess';
  else if(req.leadership_aware===false) plan='continue_with_inform_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function data(req){
  ensureBool(req.timeline_built, 'timeline_built');
  ensureBool(req.records_reviewed, 'records_reviewed');
  ensureBool(req.interviews_conducted, 'interviews_conducted');
  ensureBool(req.observations_made, 'observations_made');
  ensureBool(req.policies_reviewed, 'policies_reviewed');
  let plan;
  if(req.timeline_built===false) plan='continue_with_build_then_reassess';
  else if(req.records_reviewed===false) plan='continue_with_review_then_reassess';
  else if(req.interviews_conducted===false) plan='continue_with_interview_then_reassess';
  else if(req.policies_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fishbone(req){
  ensureBool(req.people_factors, 'people_factors');
  ensureBool(req.process_factors, 'process_factors');
  ensureBool(req.equipment_factors, 'equipment_factors');
  ensureBool(req.environment_factors, 'environment_factors');
  ensureBool(req.management_factors, 'management_factors');
  let plan;
  if(req.people_factors===false) plan='continue_with_review_then_reassess';
  else if(req.process_factors===false) plan='continue_with_review_then_reassess';
  else if(req.management_factors===false) plan='continue_with_review_then_reassess';
  else if(req.environment_factors===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function five_why(req){
  ensureBool(req.first_why_asked, 'first_why_asked');
  ensureBool(req.second_why_asked, 'second_why_asked');
  ensureBool(req.third_why_asked, 'third_why_asked');
  ensureBool(req.fourth_why_asked, 'fourth_why_asked');
  ensureBool(req.fifth_why_asked, 'fifth_why_asked');
  ensureBool(req.root_identified, 'root_identified');
  let plan;
  if(req.first_why_asked===false) plan='continue_with_ask_then_reassess';
  else if(req.third_why_asked===false) plan='continue_with_ask_then_reassess';
  else if(req.fifth_why_asked===false) plan='continue_with_ask_then_reassess';
  else if(req.root_identified===false) plan='continue_with_dig_deeper_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function changes(req){
  ensureBool(req.actions_strong, 'actions_strong');
  ensureBool(req.strong_setting, 'strong_setting');
  ensureBool(req.intermediate, 'intermediate');
  ensureBool(req.weak_action, 'weak_action');
  ensureBool(req.mechanism_clarified, 'mechanism_clarified');
  let plan;
  if(req.actions_strong===false && req.strong_setting===false) plan='continue_with_strong_then_reassess';
  else if(req.intermediate===false) plan='continue_with_intermediate_then_reassess';
  else if(req.weak_action) plan='continue_with_reassess_then_reassess';
  else if(req.mechanism_clarified===false) plan='continue_with_clarify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function summary(req){
  ensureBool(req.summary_clear, 'summary_clear');
  ensureBool(req.findings_documented, 'findings_documented');
  ensureBool(req.recommendations_documented, 'recommendations_documented');
  ensureBool(req.planning_followup, 'planning_followup');
  ensureBool(req.stakeholder_review, 'stakeholder_review');
  let plan;
  if(req.summary_clear===false) plan='continue_with_documented_then_reassess';
  else if(req.findings_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.recommendations_documented===false) plan='continue_with_recommend_then_reassess';
  else if(req.planning_followup===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {team,data,fishbone,five_why,changes,summary};}
module.exports={funcs,CITATIONS,ValidationError};
