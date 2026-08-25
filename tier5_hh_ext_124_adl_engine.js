// filepath: tier5_hh_ext_124_adl_engine.js
// TIER5_HH_EXT-124: ADL / Caregiver Home Aide
'use strict';
const CITATIONS = ['CMS_HH_AIDE_2020','CAREPRO_AIDE_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function adl_plan(req){
  ensureEnum(req.task_type, 'task_type', ['bathing','dressing','toileting','transfers','feeding','ambulation','other']);
  ensureNumber(req.visits_per_week, 'visits_per_week');
  ensureBool(req.careplan_aligned, 'careplan_aligned');
  ensureBool(req.family_informed, 'family_informed');
  ensureBool(req.patient_agreement, 'patient_agreement');
  ensureBool(req.caregiver_trained, 'caregiver_trained');
  let plan;
  if(req.careplan_aligned===false) plan='continue_with_alignment_then_reassess';
  else if(req.family_informed===false) plan='continue_with_info_then_reassess';
  else plan='continue_with_visit_start_then_reassess';
  return {plan};
}
function adl_visit(req){
  ensureEnum(req.task_type, 'task_type', ['bathing','dressing','toileting','transfers','feeding','ambulation','other']);
  ensureNumber(req.duration_min, 'duration_min');
  ensureBool(req.task_completed, 'task_completed');
  ensureBool(req.safety_checked, 'safety_checked');
  ensureBool(req.skin_checked, 'skin_checked');
  ensureBool(req.progress_noted, 'progress_noted');
  ensureBool(req.next_visit_scheduled, 'next_visit_scheduled');
  let plan;
  if(req.task_completed===false) plan='continue_with_complete_then_reassess';
  else if(req.safety_checked===false) plan='continue_with_safety_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function caregiver_burden(req){
  ensureNumber(req.zarit_score, 'zarit_score');
  ensureEnum(req.level, 'level', ['none','mild','moderate','severe','unknown']);
  ensureBool(req.burnout_self_reported, 'burnout_self_reported');
  ensureBool(req.services_offered, 'services_offered');
  ensureBool(req.respite_used, 'respite_used');
  ensureBool(req.counseling_offered, 'counseling_offered');
  let plan;
  if(req.level==='severe') plan='continue_with_intensive_respite_then_reassess';
  else if(req.services_offered===false) plan='continue_with_offer_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function safety_check(req){
  ensureBool(req.fall_risk_screen, 'fall_risk_screen');
  ensureBool(req.medication_lock, 'medication_lock');
  ensureBool(req.environment_safe, 'environment_safe');
  ensureBool(req.fire_safety, 'fire_safety');
  ensureBool(req.emergency_contacts, 'emergency_contacts');
  ensureBool(req.reporting_system, 'reporting_system');
  let plan;
  if(req.fall_risk_screen===false) plan='continue_with_screen_then_reassess';
  else if(req.environment_safe===false) plan='continue_with_env_fix_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function rcf(req){
  ensureEnum(req.referral_to, 'referral_to', ['community_resources','counseling','respite','adult_day','hospice','advanced_care','support_group','transport','meals','other']);
  ensureBool(req.patient_consent, 'patient_consent');
  ensureBool(req.paperwork_done, 'paperwork_done');
  ensureBool(req.family_aware, 'family_aware');
  ensureBool(req.funding_arranged, 'funding_arranged');
  ensureBool(req.coordination_done, 'coordination_done');
  let plan;
  if(req.paperwork_done===false) plan='continue_with_paperwork_then_reassess';
  else if(req.funding_arranged===false) plan='continue_with_funding_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function adl_fu(req){
  ensureNumber(req.weeks_in_aide, 'weeks_in_aide');
  ensureNumber(req.adl_change, 'adl_change');
  ensureBool(req.patient_satisfied, 'patient_satisfied');
  ensureBool(req.family_satisfied, 'family_satisfied');
  ensureBool(req.aide_consistency, 'aide_consistency');
  ensureBool(req.recert_review, 'recert_review');
  let plan;
  if(req.patient_satisfied===false || req.family_satisfied===false) plan='continue_with_concerns_then_reassess';
  else if(req.recert_review===false) plan='continue_with_recert_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {adl_plan,adl_visit,caregiver_burden,safety_check,rcf,adl_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
