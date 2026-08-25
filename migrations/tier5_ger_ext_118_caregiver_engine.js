// filepath: tier5_ger_ext_118_caregiver_engine.js
// TIER5_GER_EXT-118: Caregiver Support / Advance Directives
'use strict';
const CITATIONS = ['NASEM_FAMILY_2016','AARP_CAREGIVING_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function caregiver_intake(req){
  ensureStr(req.relationship, 'relationship');
  ensureEnum(req.relationship, 'relationship', ['spouse','adult_child','sibling','friend','neighbor','paid','other','unknown']);
  ensureNumber(req.hours_per_week, 'hours_per_week');
  ensureBool(req.consent, 'consent');
  ensureBool(req.relationship_quality, 'relationship_quality');
  ensureBool(req.support_network, 'support_network');
  let plan;
  if(req.hours_per_week>=80 && req.support_network===false) plan='continue_with_high_burden_pathway_then_reassess';
  else if(req.relationship_quality===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_baseline_then_reassess';
  return {plan};
}
function burden(req){
  ensureNumber(req.zarit_score, 'zarit_score');
  ensureEnum(req.burden_level, 'burden_level', ['none','mild','moderate','severe','unknown']);
  ensureBool(req.work_impact, 'work_impact');
  ensureBool(req.sleep_impact, 'sleep_impact');
  ensureBool(req.health_impact, 'health_impact');
  ensureBool(req.assistance_arranged, 'assistance_arranged');
  let plan;
  if(req.burden_level==='severe') plan='continue_with_respite_then_reassess';
  else if(req.burden_level==='moderate' && req.assistance_arranged===false) plan='continue_with_help_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function training(req){
  ensureBool(req.initial_competency, 'initial_competency');
  ensureBool(req.hands_on_education, 'hands_on_education');
  ensureBool(req.med_management_trained, 'med_management_trained');
  ensureBool(req.emergency_knowledge, 'emergency_knowledge');
  ensureBool(req.safety_knowledge, 'safety_knowledge');
  ensureBool(req.family_meeting, 'family_meeting');
  let plan;
  if(req.initial_competency===false) plan='continue_with_baseline_training_then_reassess';
  else if(req.family_meeting===false) plan='continue_with_meeting_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function advance_directive(req){
  ensureBool(req.patient_capacity, 'patient_capacity');
  ensureBool(req.documented_wishes, 'documented_wishes');
  ensureBool(req.surrogate_designated, 'surrogate_designated');
  ensureEnum(req.code_status, 'code_status', ['full','dnr','dnar','limited','comfort_only','other','unknown']);
  ensureBool(req.reviewed_annually, 'reviewed_annually');
  ensureBool(req.living_will, 'living_will');
  let plan;
  if(req.surrogate_designated===false) plan='continue_with_designate_surrogate_then_reassess';
  else if(req.reviewed_annually===false) plan='continue_with_annual_review_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function hospice(req){
  ensureBool(req.eligible, 'eligible');
  ensureNumber(req.survival_estimate, 'survival_estimate');
  ensureBool(req.goals_discussed, 'goals_discussed');
  ensureBool(req.symptom_management, 'symptom_management');
  ensureBool(req.family_informed, 'family_informed');
  ensureBool(req.bereavement_plan, 'bereavement_plan');
  let plan;
  if(req.eligible===true && req.goals_discussed===false) plan='continue_with_discuss_goals_then_reassess';
  else if(req.bereavement_plan===false) plan='continue_with_bereavement_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function caregiver_fu(req){
  ensureNumber(req.weeks_in_care, 'weeks_in_care');
  ensureBool(req.burden_improving, 'burden_improving');
  ensureBool(req.symptom_management, 'symptom_management');
  ensureBool(req.support_services_used, 'support_services_used');
  ensureBool(req.self_care, 'self_care');
  ensureBool(req.respite_used, 'respite_used');
  let plan;
  if(req.burden_improving===false) plan='continue_with_address_burden_then_reassess';
  else if(req.self_care===false) plan='continue_with_promote_self_care_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {caregiver_intake,burden,training,advance_directive,hospice,caregiver_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
