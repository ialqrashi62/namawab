// filepath: tier5_quality_safety_ext_106_sentinel_engine.js
// TIER5_QUALITY_SAFETY_EXT-106: Sentinel events
'use strict';
const CITATIONS = ['Sentinel_2020','TJC_Sentinel_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function detection(req){
  ensureStr(req.event_type, 'event_type');
  ensureEnum(req.event_type, 'event_type', ['unexpected_death','severe_permanent_harm','severe_temporary_harm','suicide','medication_error','wrong_site_surgery','retained_foreign','transfusion_reaction','fall_with_harm','pressure_injury_stage3plus','abduction','discharge_to_wrong_family','unintended_retention','other','restraint_complications','suicide_attempt','self_harm','neonatal_lethal','maternal_severe']);
  ensureBool(req.documented, 'documented');
  ensureBool(req.reported_within, 'reported_within');
  ensureBool(req.patient_notification, 'patient_notification');
  ensureBool(req.preservation_done, 'preservation_done');
  let plan;
  if(req.reported_within===false) plan='continue_with_report_immediately_then_reassess';
  else if(req.preservation_done===false) plan='continue_with_preserve_then_reassess';
  else if(req.patient_notification===false) plan='continue_with_notify_then_reassess';
  else if(req.documented===false) plan='continue_with_documented_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function review(req){
  ensureBool(req.sentinel_team_formed, 'sentinel_team_formed');
  ensureBool(req.leadership_engaged, 'leadership_engaged');
  ensureBool(req.timeline_constructed, 'timeline_constructed');
  ensureBool(req.facts_established, 'facts_established');
  ensureBool(req.analysis_method, 'analysis_method');
  let plan;
  if(req.sentinel_team_formed===false) plan='continue_with_form_then_reassess';
  else if(req.timeline_constructed===false) plan='continue_with_construct_then_reassess';
  else if(req.facts_established===false) plan='continue_with_establish_then_reassess';
  else if(req.analysis_method===false) plan='continue_with_select_method_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function rca(req){
  ensureBool(req.root_cause_identified, 'root_cause_identified');
  ensureBool(req.contributing_factors, 'contributing_factors');
  ensureBool(req.lagging_indicators, 'lagging_indicators');
  ensureBool(req.actions_identified, 'actions_identified');
  ensureBool(req.culture_assessed, 'culture_assessed');
  let plan;
  if(req.root_cause_identified===false) plan='continue_with_identify_then_reassess';
  else if(req.contributing_factors===false) plan='continue_with_analyze_then_reassess';
  else if(req.actions_identified===false) plan='continue_with_develop_then_reassess';
  else if(req.culture_assessed===false) plan='continue_with_assess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function action_plan(req){
  ensureBool(req.actions_strong, 'actions_strong');
  ensureBool(req.action_strong_setting, 'action_strong_setting');
  ensureBool(req.responsible_person, 'responsible_person');
  ensureBool(req.timelines_clear, 'timelines_clear');
  ensureBool(req.sustainability_plan, 'sustainability_plan');
  let plan;
  if(req.actions_strong===false) plan='continue_with_strengthen_then_reassess';
  else if(req.action_strong_setting===false) plan='continue_with_force_functions_then_reassess';
  else if(req.responsible_person===false) plan='continue_with_assign_then_reassess';
  else if(req.sustainability_plan===false) plan='continue_with_sustain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.actions_implemented, 'actions_implemented');
  ensureBool(req.effectiveness_measured, 'effectiveness_measured');
  ensureBool(req.strategies_reinforced, 'strategies_reinforced');
  ensureBool(req.shared_learning, 'shared_learning');
  ensureBool(req.culture_improved, 'culture_improved');
  let plan;
  if(req.actions_implemented===false) plan='continue_with_implement_then_reassess';
  else if(req.effectiveness_measured===false) plan='continue_with_measure_then_reassess';
  else if(req.shared_learning===false) plan='continue_with_share_then_reassess';
  else if(req.culture_improved===false) plan='continue_with_culture_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reporting(req){
  ensureBool(req.tjc_reported, 'tjc_reported');
  ensureBool(req.state_reported, 'state_reported');
  ensureBool(req.cms_reported, 'cms_reported');
  ensureBool(req.fda_reported, 'fda_reported');
  ensureBool(req.shared_database, 'shared_database');
  let plan;
  if(req.tjc_reported===false) plan='continue_with_tjc_then_reassess';
  else if(req.state_reported===false) plan='continue_with_state_then_reassess';
  else if(req.cms_reported===false) plan='continue_with_cms_then_reassess';
  else if(req.fda_reported===false) plan='continue_with_fda_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {detection,review,rca,action_plan,followup,reporting};}
module.exports={funcs,CITATIONS,ValidationError};
