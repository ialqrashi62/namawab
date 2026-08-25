// filepath: tier5_hh_ext_120_snf_engine.js
// TIER5_HH_EXT-120: SNF-to-Home / Post-Acute Transition
'use strict';
const CITATIONS = ['CMS_SNF_2020','CARE_TRANSITIONS_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function transition(req){
  ensureEnum(req.discharge_setting, 'discharge_setting', ['snf_to_home','hospital_to_home','rehab_to_home','other']);
  ensureBool(req.rehab_completed, 'rehab_completed');
  ensureNumber(req.fall_risk_score, 'fall_risk_score');
  ensureBool(req.homebound_status, 'homebound_status');
  ensureBool(req.family_informed, 'family_informed');
  ensureBool(req.family_capable, 'family_capable');
  let plan;
  if(req.family_capable===false) plan='continue_with_supports_then_reassess';
  else if(req.homebound_status===false) plan='continue_with_outpatient_then_reassess';
  else plan='continue_with_home_care_then_reassess';
  return {plan};
}
function med_rec(req){
  ensureNumber(req.meds_total, 'meds_total');
  ensureNumber(req.meds_new, 'meds_new');
  ensureNumber(req.meds_dc, 'meds_dc');
  ensureBool(req.reconciled_list, 'reconciled_list');
  ensureBool(req.education_provided, 'education_provided');
  ensureBool(req.understanding_verified, 'understanding_verified');
  let plan;
  if(req.reconciled_list===false) plan='continue_with_reconcile_then_reassess';
  else if(req.understanding_verified===false) plan='continue_with_reteach_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function visit_summary(req){
  ensureEnum(req.discipline, 'discipline', ['sn','pt','ot','st','msw','hha','other']);
  ensureBool(req.skill_provided, 'skill_provided');
  ensureBool(req.goals_addressed, 'goals_addressed');
  ensureBool(req.safety_checked, 'safety_checked');
  ensureBool(req.next_visit_planned, 'next_visit_planned');
  ensureBool(req.caregiver_engaged, 'caregiver_engaged');
  let plan;
  if(req.skill_provided===false) plan='continue_with_skill_then_reassess';
  else if(req.safety_checked===false) plan='continue_with_check_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function readmit_risk(req){
  ensureNumber(req.score, 'score');
  ensureEnum(req.risk_level, 'risk_level', ['low','moderate','high','very_high']);
  ensureBool(req.education_booster, 'education_booster');
  ensureBool(req.family_engaged, 'family_engaged');
  ensureBool(req.early_signs_reviewed, 'early_signs_reviewed');
  ensureBool(req.followup_appointment, 'followup_appointment');
  let plan;
  if(req.risk_level==='very_high') plan='continue_with_intensive_then_reassess';
  else if(req.followup_appointment===false) plan='continue_with_scheduling_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function rehab_skilled(req){
  ensureNumber(req.sessions, 'sessions');
  ensureBool(req.functional_progress, 'functional_progress');
  ensureBool(req.pain_managed, 'pain_managed');
  ensureBool(req.home_program, 'home_program');
  ensureBool(req.caregiver_trained, 'caregiver_trained');
  ensureBool(req.discharge_planned, 'discharge_planned');
  let plan;
  if(req.functional_progress===false) plan='continue_with_reconsider_then_reassess';
  else if(req.home_program===false) plan='continue_with_home_program_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function episode_close(req){
  ensureBool(req.goals_met, 'goals_met');
  ensureBool(req.outcomes_documented, 'outcomes_documented');
  ensureBool(req.discharge_summary_signed, 'discharge_summary_signed');
  ensureEnum(req.after_care_plan, 'after_care_plan', ['self_manage','community_services','outpatient','home_care_extension','palliative_care','hospice','other']);
  ensureBool(req.physician_notified, 'physician_notified');
  ensureBool(req.satisfaction_survey, 'satisfaction_survey');
  let plan;
  if(req.goals_met===true && req.discharge_summary_signed===true) plan='continue_with_close_then_reassess';
  else if(req.physician_notified===false) plan='continue_with_notify_then_reassess';
  else plan='continue_with_reassess_then_reassess';
  return {plan};
}

function funcs(){return {transition,med_rec,visit_summary,readmit_risk,rehab_skilled,episode_close};}
module.exports = {funcs, CITATIONS, ValidationError};
