// filepath: tier5_hh_ext_119_intake_engine.js
// TIER5_HH_EXT-119: Home Health Intake / Eligibility
'use strict';
const CITATIONS = ['CMS_HH_2020','OASIS_E_2023'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function eligibility(req){
  ensureEnum(req.referral, 'referral', ['acute','post_surgical','chronic','post_institutional','community','self','family','other']);
  ensureBool(req.homebound, 'homebound');
  ensureEnum(req.mobility_aid, 'mobility_aid', ['independent','cane','walker','wheelchair','bedbound','other']);
  ensureNumber(req.medicare_enrolled, 'medicare_enrolled');
  ensureBool(req.skill_need, 'skill_need');
  ensureBool(req.consent, 'consent');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.homebound===false) plan='continue_with_outpatient_then_reassess';
  else if(req.skill_need===false) plan='continue_with_non_skilled_then_reassess';
  else plan='continue_with_admit_then_reassess';
  return {plan};
}
function oasis_intake(req){
  ensureNumber(req.m1800_eating, 'm1800_eating');
  ensureNumber(req.m1810_dressing_upper, 'm1810_dressing_upper');
  ensureNumber(req.m1820_dressing_lower, 'm1820_dressing_lower');
  ensureNumber(req.m1830_bathing, 'm1830_bathing');
  ensureNumber(req.m1840_toileting, 'm1840_toileting');
  ensureNumber(req.m1850_transfers, 'm1850_transfers');
  let plan;
  if(req.m1830_bathing>=3) plan='continue_with_adl_intensive_then_reassess';
  else if(req.m1850_transfers>=3) plan='continue_with_mobility_intensive_then_reassess';
  else plan='continue_with_baseline_then_reassess';
  return {plan};
}
function soc(req){
  ensureEnum(req.discipline, 'discipline', ['sn','pt','ot','st','msw','hha','combined','other']);
  ensureBool(req.frequency_set, 'frequency_set');
  ensureNumber(req.visit_count_plan, 'visit_count_plan');
  ensureBool(req.physician_orders, 'physician_orders');
  ensureBool(req.careplan_drafted, 'careplan_drafted');
  ensureBool(req.family_oriented, 'family_oriented');
  let plan;
  if(req.physician_orders===false) plan='continue_with_orders_then_reassess';
  else if(req.careplan_drafted===false) plan='continue_with_careplan_then_reassess';
  else plan='continue_with_visit_start_then_reassess';
  return {plan};
}
function oasis_30day(req){
  ensureNumber(req.m1800_eating, 'm1800_eating');
  ensureNumber(req.m1830_bathing, 'm1830_bathing');
  ensureNumber(req.m1840_toileting, 'm1840_toileting');
  ensureEnum(req.status, 'status', ['improving','stable','worsening','unknown']);
  ensureBool(req.reassessment_due, 'reassessment_due');
  ensureBool(req.discharge_planning_initiated, 'discharge_planning_initiated');
  let plan;
  if(req.status==='worsening') plan='continue_with_reassess_then_reassess';
  else if(req.discharge_planning_initiated===false) plan='continue_with_dp_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function verify_visit(req){
  ensureNumber(req.visits_completed, 'visits_completed');
  ensureBool(req.skill_documented, 'skill_documented');
  ensureBool(req.coordination_documented, 'coordination_documented');
  ensureBool(req.outcome_progress_documented, 'outcome_progress_documented');
  ensureBool(req.physician_notified, 'physician_notified');
  ensureBool(req.discharge_conversation, 'discharge_conversation');
  let plan;
  if(req.skill_documented===false) plan='continue_with_doc_then_reassess';
  else if(req.discharge_conversation===false) plan='continue_with_discuss_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function discharge_planning(req){
  ensureNumber(req.days_in_episode, 'days_in_episode');
  ensureBool(req.goals_met, 'goals_met');
  ensureBool(req.caregiver_capable, 'caregiver_capable');
  ensureEnum(req.next_setting, 'next_setting', ['home_independent','home_with_family','outpatient','snf','inpatient','hospice','deceased','other']);
  ensureBool(req.handoff_to_next, 'handoff_to_next');
  ensureBool(req.summarized, 'summarized');
  let plan;
  if(req.goals_met===true && req.caregiver_capable===true) plan='continue_with_discharge_then_reassess';
  else if(req.handoff_to_next===false) plan='continue_with_handoff_then_reassess';
  else plan='continue_with_reassess_then_reassess';
  return {plan};
}

function funcs(){return {eligibility,oasis_intake,soc,oasis_30day,verify_visit,discharge_planning};}
module.exports = {funcs, CITATIONS, ValidationError};
