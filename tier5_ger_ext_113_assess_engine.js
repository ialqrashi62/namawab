// filepath: tier5_ger_ext_113_assess_engine.js
// TIER5_GER_EXT-113: Comprehensive Geriatric Assessment (CGA)
'use strict';
const CITATIONS = ['AGS_CGA_2021','NICE_OLDER_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cga_intake(req){
  ensureNumber(req.age, 'age');
  ensureBool(req.consent, 'consent');
  ensureStr(req.living_situation, 'living_situation');
  ensureEnum(req.living_situation, 'living_situation', ['independent_alone','with_family','assisted','nursing_home','memory_care','other']);
  ensureNumber(req.falls_last_year, 'falls_last_year');
  ensureNumber(req.adls_help, 'adls_help');
  let plan;
  if(req.age>=75 && req.consent===true) plan='continue_with_full_cga_then_reassess';
  else if(req.falls_last_year>=2 || req.adls_help>=2) plan='continue_with_targeted_then_reassess';
  else plan='continue_with_annual_then_reassess';
  return {plan};
}
function adl_iadl(req){
  ensureNumber(req.adl_score, 'adl_score');
  ensureNumber(req.iadl_score, 'iadl_score');
  ensureBool(req.bathing_help, 'bathing_help');
  ensureBool(req.dressing_help, 'dressing_help');
  ensureBool(req.transfers_help, 'transfers_help');
  ensureBool(req.finances_help, 'finances_help');
  ensureBool(req.transportation_help, 'transportation_help');
  let plan;
  if(req.adl_score<4) plan='continue_with_adl_supports_then_reassess';
  else if(req.iadl_score<5) plan='continue_with_iadl_supports_then_reassess';
  else plan='continue_with_maintain_then_reassess';
  return {plan};
}
function cognitive(req){
  ensureNumber(req.mmse_score, 'mmse_score');
  ensureNumber(req.moca_score, 'moca_score');
  ensureBool(req.informant_history, 'informant_history');
  ensureEnum(req.cdr_stage, 'cdr_stage', ['none','q1','mci','mild','moderate','severe','terminal','unknown']);
  ensureBool(req.safety_concerns, 'safety_concerns');
  ensureBool(req.driving_safe, 'driving_safe');
  let plan;
  if(req.cdr_stage==='moderate' || req.cdr_stage==='severe') plan='continue_with_full_dementia_workup_then_reassess';
  else if(req.moca_score<26 && req.informant_history===true) plan='continue_with_mci_workup_then_reassess';
  else plan='continue_with_reassess_then_reassess';
  return {plan};
}
function mobility(req){
  ensureNumber(req.timed_up_go, 'timed_up_go');
  ensureBool(req.aid_used, 'aid_used');
  ensureEnum(req.aid_type, 'aid_type', ['none','cane','walker','rollator','wheelchair','other']);
  ensureNumber(req.walking_speed, 'walking_speed');
  ensureBool(req.balance_impaired, 'balance_impaired');
  ensureBool(req.foot_problem, 'foot_problem');
  let plan;
  if(req.timed_up_go>=12) plan='continue_with_physio_then_reassess';
  else if(req.balance_impaired===true) plan='continue_with_balance_program_then_reassess';
  else plan='continue_with_maintenance_then_reassess';
  return {plan};
}
function nutrition(req){
  ensureNumber(req.alb, 'alb');
  ensureNumber(req.prealb, 'prealb');
  ensureNumber(req.weight_loss_pct_6mo, 'weight_loss_pct_6mo');
  ensureEnum(req.mna, 'mna', ['malnourished','at_risk','normal','unknown','other']);
  ensureBool(req.dysphagia_screening, 'dysphagia_screening');
  ensureBool(req.dentures_fitting, 'dentures_fitting');
  let plan;
  if(req.mna==='malnourished' || req.weight_loss_pct_6mo>=5) plan='continue_with_nutrition_intervention_then_reassess';
  else if(req.mna==='at_risk') plan='continue_with_or_supplements_then_reassess';
  else plan='continue_with_monitor_then_reassess';
  return {plan};
}
function cga_summary(req){
  ensureNumber(req.domains_impaired, 'domains_impaired');
  ensureBool(req.patient_goals_documented, 'patient_goals_documented');
  ensureBool(req.caregiver_burden, 'caregiver_burden');
  ensureEnum(req.level_of_care, 'level_of_care', ['independent','least_restrictive','assisted','memory_care','nursing','palliative','hospice','other']);
  ensureBool(req.guidelines_followed, 'guidelines_followed');
  ensureBool(req.advance_care_directive, 'advance_care_directive');
  let plan;
  if(req.domains_impaired>=3) plan='continue_with_multidisciplinary_then_reassess';
  else if(req.patient_goals_documented===false) plan='continue_with_goals_of_care_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {cga_intake,adl_iadl,cognitive,mobility,nutrition,cga_summary};}
module.exports = {funcs, CITATIONS, ValidationError};
