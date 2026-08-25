// filepath: tier5_addiction_med_ext_101_screen_engine.js
// TIER5_ADDICTION_MED_EXT-101: Substance use screening
'use strict';
const CITATIONS = ['ASAM_2020','NIDA_2021','SAMHSA_TIP_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function audit(req){
  ensureNumber(req.audit_score, 'audit_score');
  ensureNumber(req.years_drinking, 'years_drinking');
  ensureNumber(req.drinks_per_day, 'drinks_per_day');
  ensureBool(req.binge_drinking, 'binge_drinking');
  ensureBool(req.dts_history, 'dts_history');
  ensureBool(req.motivation_to_change, 'motivation_to_change');
  let plan;
  if(req.dts_history) plan='continue_with_medical_detox_then_reassess';
  else if(req.audit_score>=20) plan='continue_with_assessment_then_reassess';
  else if(req.audit_score>=8) plan='continue_with_brief_intervention_then_reassess';
  else if(req.motivation_to_change) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dast(req){
  ensureNumber(req.dast_score, 'dast_score');
  ensureStr(req.primary_drug, 'primary_drug');
  ensureEnum(req.primary_drug, 'primary_drug', ['none','alcohol','cannabis','cocaine','methamphetamine','opioids','benzodiazepines','hallucinogens','inhalants','nicotine','polysubstance']);
  ensureBool(req.iv_use, 'iv_use');
  ensureBool(req.overdose_history, 'overdose_history');
  ensureBool(req.treatment_history, 'treatment_history');
  let plan;
  if(req.dast_score>=6) plan='continue_with_assessment_then_reassess';
  else if(req.iv_use || req.overdose_history) plan='continue_with_urgent_assessment_then_reassess';
  else if(req.dast_score>=3) plan='continue_with_brief_intervention_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nida(req){
  ensureBool(req.used_more_than_intended, 'used_more_than_intended');
  ensureBool(req.unable_to_cut_down, 'unable_to_cut_down');
  ensureBool(req.using_despite_problems, 'using_despite_problems');
  ensureBool(req.tolerance, 'tolerance');
  ensureBool(req.withdrawal, 'withdrawal');
  ensureNumber(req.criteria_met, 'criteria_met');
  let plan;
  if(req.criteria_met>=6) plan='continue_with_severe_then_reassess';
  else if(req.criteria_met>=4) plan='continue_with_moderate_then_reassess';
  else if(req.criteria_met>=2) plan='continue_with_mild_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function bi(req){
  ensureNumber(req.stage_of_change, 'stage_of_change');
  ensureBool(req.engage_in_dialogue, 'engage_in_dialogue');
  ensureBool(req.assess_readiness, 'assess_readiness');
  ensureBool(req.negotiate_plan, 'negotiate_plan');
  ensureBool(req.arrange_followup, 'arrange_followup');
  let plan;
  if(req.engage_in_dialogue===false) plan='continue_with_engage_then_reassess';
  else if(req.assess_readiness===false) plan='continue_with_assess_then_reassess';
  else if(req.negotiate_plan===false) plan='continue_with_negotiate_then_reassess';
  else if(req.arrange_followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tobacco(req){
  ensureNumber(req.cigs_per_day, 'cigs_per_day');
  ensureNumber(req.minutes_to_first_cig, 'minutes_to_first_cig');
  ensureNumber(req.years_smoking, 'years_smoking');
  ensureBool(req.motivation_to_quit, 'motivation_to_quit');
  ensureBool(req.previous_attempts, 'previous_attempts');
  ensureBool(req.medical_aid_used, 'medical_aid_used');
  let plan;
  if(req.cigs_per_day>=20 && req.minutes_to_first_cig<30) plan='continue_with_nrt_then_reassess';
  else if(req.motivation_to_quit) plan='continue_with_counseling_then_reassess';
  else if(req.cigs_per_day>=10) plan='continue_with_brief_intervention_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cannabis(req){
  ensureNumber(req.days_used_past_month, 'days_used_past_month');
  ensureBool(req.failed_quit_attempts, 'failed_quit_attempts');
  ensureBool(req.cognitive_effects, 'cognitive_effects');
  ensureBool(req.social_concerns, 'social_concerns');
  ensureBool(req.work_school_concerns, 'work_school_concerns');
  let plan;
  if(req.days_used_past_month>=20) plan='continue_with_treatment_then_reassess';
  else if(req.cognitive_effects) plan='continue_with_assessment_then_reassess';
  else if(req.failed_quit_attempts) plan='continue_with_brief_intervention_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {audit,dast,nida,bi,tobacco,cannabis};}
module.exports={funcs,CITATIONS,ValidationError};
