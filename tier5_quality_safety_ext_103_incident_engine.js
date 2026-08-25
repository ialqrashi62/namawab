// filepath: tier5_quality_safety_ext_103_incident_engine.js
// TIER5_QUALITY_SAFETY_EXT-103: Incident reporting
'use strict';
const CITATIONS = ['Incident_2020','IncidentReporting_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function report(req){
  ensureStr(req.incident_type, 'incident_type');
  ensureEnum(req.incident_type, 'incident_type', ['medication','fall','surgical','diagnostic','treatment','equipment','pressure_injury','dvt','aspiration','hospital_acquired_infection','suicide','restraint','security','behavior','other','blood_product','procedure','transfusion']);
  ensureBool(req.patient_involved, 'patient_involved');
  ensureBool(req.harm_level, 'harm_level');
  ensureBool(req.witness_obtained, 'witness_obtained');
  ensureBool(req.facts_documented, 'facts_documented');
  let plan;
  if(req.facts_documented===false) plan='continue_with_documented_then_reassess';
  else if(req.witness_obtained===false) plan='continue_with_obtain_then_reassess';
  else if(req.harm_level===false) plan='continue_with_assess_then_reassess';
  else if(req.patient_involved===false) plan='continue_with_identify_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function severity(req){
  ensureStr(req.harm_level, 'harm_level');
  ensureEnum(req.harm_level, 'harm_level', ['none','mild','moderate','severe','life_threatening','death']);
  ensureNumber(req.days_harm, 'days_harm');
  ensureBool(req.intervention_needed, 'intervention_needed');
  ensureBool(req.prolonged_stay, 'prolonged_stay');
  ensureBool(req.disability_related, 'disability_related');
  let plan;
  if(req.harm_level==='death') plan='continue_with_sentinel_review_then_reassess';
  else if(req.harm_level==='life_threatening') plan='continue_with_serious_review_then_reassess';
  else if(req.prolonged_stay && req.intervention_needed===false) plan='continue_with_assess_then_reassess';
  else if(req.disability_related) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function blameless(req){
  ensureBool(req.facts_focused, 'facts_focused');
  ensureBool(req.individual_blame_avoided, 'individual_blame_avoided');
  ensureBool(req.system_focus, 'system_focus');
  ensureBool(req.reporter_protected, 'reporter_protected');
  ensureBool(req.psychological_safety, 'psychological_safety');
  let plan;
  if(req.facts_focused===false) plan='continue_with_focus_then_reassess';
  else if(req.individual_blame_avoided===false) plan='continue_with_blame_free_then_reassess';
  else if(req.system_focus===false) plan='continue_with_system_then_reassess';
  else if(req.psychological_safety===false) plan='continue_with_safety_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function categories(req){
  ensureBool(req.medication_categorized, 'medication_categorized');
  ensureBool(req.fall_categorized, 'fall_categorized');
  ensureBool(req.surgical_categorized, 'surgical_categorized');
  ensureBool(req.behavior_categorized, 'behavior_categorized');
  ensureBool(req.trending, 'trending');
  let plan;
  if(req.medication_categorized===false) plan='continue_with_categorize_then_reassess';
  else if(req.fall_categorized===false) plan='continue_with_categorize_then_reassess';
  else if(req.trending===false) plan='continue_with_trending_then_reassess';
  else if(req.surgical_categorized===false) plan='continue_with_categorize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function disclosure(req){
  ensureBool(req.early_disclosure, 'early_disclosure');
  ensureBool(req.honest_presented, 'honest_presented');
  ensureBool(req.apology_given, 'apology_given');
  ensureBool(req.timeline_presented, 'timeline_presented');
  ensureBool(req.family_supported, 'family_supported');
  let plan;
  if(req.early_disclosure===false) plan='continue_with_disclose_then_reassess';
  else if(req.honest_presented===false) plan='continue_with_honest_then_reassess';
  else if(req.apology_given===false) plan='continue_with_apologize_then_reassess';
  else if(req.family_supported===false) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function analysis(req){
  ensureBool(req.trend_analysis, 'trend_analysis');
  ensureBool(req.root_cause_initiated, 'root_cause_initiated');
  ensureBool(req.indicators_tracked, 'indicators_tracked');
  ensureBool(req.benchmarking, 'benchmarking');
  ensureBool(req.shared_learning, 'shared_learning');
  let plan;
  if(req.trend_analysis===false) plan='continue_with_analyze_then_reassess';
  else if(req.root_cause_initiated===false) plan='continue_with_initiate_then_reassess';
  else if(req.indicators_tracked===false) plan='continue_with_track_then_reassess';
  else if(req.shared_learning===false) plan='continue_with_share_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {report,severity,blameless,categories,disclosure,analysis};}
module.exports={funcs,CITATIONS,ValidationError};
