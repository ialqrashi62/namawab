// filepath: tier5_wh_ext_130_preventive_engine.js
// TIER5_WH_EXT-130: Women's Preventive Health
'use strict';
const CITATIONS = ['USPSTF_WOMEN_2023','ACOG_WELLNESS'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function well_woman(req){
  ensureNumber(req.age, 'age');
  ensureBool(req.bp_done, 'bp_done');
  ensureEnum(req.cervical_screening, 'cervical_screening', ['not_due','hpv','cytology','co_test','hpv_known','unknown','other']);
  ensureBool(req.breast_screen_done, 'breast_screen_done');
  ensureBool(req.bone_health_review, 'bone_health_review');
  ensureBool(req.lifestyle_counseled, 'lifestyle_counseled');
  let plan;
  if(req.cervical_screening==='not_due') plan='continue_with_recheck_at_due_then_reassess';
  else if(req.lifestyle_counseled===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function breast_cancer_screen(req){
  ensureNumber(req.age, 'age');
  ensureEnum(req.family_history, 'family_history', ['none','first_degree','second_degree','brca','high_risk_genetic','unknown','other']);
  ensureEnum(req.mammo_due, 'mammo_due', ['not_due','overdue','just_due','recent','unknown','other']);
  ensureBool(req.breast_aware_education, 'breast_aware_education');
  ensureBool(req.genetic_referral, 'genetic_referral');
  ensureBool(req.mri_consider, 'mri_consider');
  let plan;
  if(req.family_history==='brca' || req.family_history==='high_risk_genetic') plan='continue_with_genetic_then_reassess';
  else if(req.mammo_due==='overdue') plan='continue_with_schedule_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function cervical_screen(req){
  ensureNumber(req.age, 'age');
  ensureBool(req.hpv_done, 'hpv_done');
  ensureBool(req.cytology_done, 'cytology_done');
  ensureEnum(req.result, 'result', ['normal','lsil','hsil','ascus','agc','invasive','hr_hpv_pos','hr_hpv_neg','unknown','other']);
  ensureBool(req.colpo_referred, 'colpo_referred');
  ensureBool(req.followup_planned, 'followup_planned');
  let plan;
  if(req.result==='hsil' || req.result==='agc' || req.result==='hr_hpv_pos') plan='continue_with_colpo_then_reassess';
  else if(req.followup_planned===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function bone_density(req){
  ensureNumber(req.age, 'age');
  ensureEnum(req.risk_category, 'risk_category', ['low','moderate','high','unknown','other']);
  ensureEnum(req.dexa_due, 'dexa_due', ['not_due','overdue','just_due','recent','unknown','other']);
  ensureBool(req.vitamin_d_advised, 'vitamin_d_advised');
  ensureBool(req.exercise_advised, 'exercise_advised');
  ensureBool(req.treatment_considered, 'treatment_considered');
  let plan;
  if(req.risk_category==='high') plan='continue_with_treatment_then_reassess';
  else if(req.dexa_due==='overdue') plan='continue_with_schedule_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function cv_screen(req){
  ensureNumber(req.age, 'age');
  ensureNumber(req.bp, 'bp');
  ensureNumber(req.lipids_ldl, 'lipids_ldl');
  ensureNumber(req.lipids_hdl, 'lipids_hdl');
  ensureBool(req.diabetes_screen, 'diabetes_screen');
  ensureBool(req.lifestyle_counseled, 'lifestyle_counseled');
  let plan;
  if(req.lipids_ldl>=190) plan='continue_with_statin_then_reassess';
  else if(req.lifestyle_counseled===false) plan='continue_with_counseling_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function preventive_fu(req){
  ensureNumber(req.months_since_visit, 'months_since_visit');
  ensureBool(req.cancer_screening_current, 'cancer_screening_current');
  ensureBool(req.vaccines_current, 'vaccines_current');
  ensureBool(req.lifestyle_addressed, 'lifestyle_addressed');
  ensureBool(req.mental_health_addressed, 'mental_health_addressed');
  ensureBool(req.next_visit_scheduled, 'next_visit_scheduled');
  let plan;
  if(req.cancer_screening_current===false) plan='continue_with_schedule_then_reassess';
  else if(req.vaccines_current===false) plan='continue_with_vaccines_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {well_woman,breast_cancer_screen,cervical_screen,bone_density,cv_screen,preventive_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
