// filepath: tier5_pmrehab_ext_102_chronic_engine.js
// TIER5_PMREHAB_EXT-102: Chronic pain & opioid stewardship
'use strict';
const CITATIONS = ['CDC_ChronicPain_2022','AAPM_Chronic_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assess(req){
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['back_pain','neck_pain','arthritis','fibromyalgia','headache','pelvic_pain','joint_pain','neuropathic','widespread','cancer_pain','other','unknown']);
  ensureNumber(req.duration_months, 'duration_months');
  ensureNumber(req.pain_score, 'pain_score');
  ensureBool(req.biomedical, 'biomedical');
  ensureBool(req.psychological, 'psychological');
  ensureBool(req.social, 'social');
  let plan;
  if(req.psychological===false) plan='continue_with_screen_then_reassess';
  else if(req.duration_months>=3) plan='continue_with_multimodal_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nonopioid(req){
  ensureBool(req.nsaid, 'nsaid');
  ensureBool(req.tylenol, 'tylenol');
  ensureBool(req.antidepressant, 'antidepressant');
  ensureBool(req.anticonvulsant, 'anticonvulsant');
  ensureBool(req.topical, 'topical');
  ensureBool(req.effective, 'effective');
  let plan;
  if(req.effective===false) plan='continue_with_escalate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioid(req){
  ensureNumber(req.daily_mme, 'daily_mme');
  ensureBool(req.pmp_checked, 'pmp_checked');
  ensureBool(req.udt_done, 'udt_done');
  ensureBool(req.function_improved, 'function_improved');
  ensureBool(req.dependence, 'dependence');
  ensureBool(req.consent, 'consent');
  ensureBool(req.agreement, 'agreement');
  ensureBool(req.benefit, 'benefit');
  ensureBool(req.behavior, 'behavior');
  let plan;
  if(req.daily_mme>=90 && req.function_improved===false) plan='continue_with_taper_then_reassess';
  else if(req.dependence && req.behavior) plan='continue_with_refer_then_reassess';
  else if(req.pmp_checked===false) plan='continue_with_pmp_then_reassess';
  else if(req.agreement===false) plan='continue_with_agreement_then_reassess';
  else if(req.benefit===false) plan='continue_with_taper_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nonpharm(req){
  ensureBool(req.physical_therapy, 'physical_therapy');
  ensureBool(req.psychological_therapy, 'psychological_therapy');
  ensureBool(req.mindfulness, 'mindfulness');
  ensureBool(req.acupuncture, 'acupuncture');
  ensureBool(req.exercise, 'exercise');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.responded===false) plan='continue_with_continue_then_reassess';
  else if(req.physical_therapy===false) plan='continue_with_pt_then_reassess';
  else if(req.psychological_therapy===false) plan='continue_with_cbt_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function risk(req){
  ensureBool(req.ort_tool, 'ort_tool');
  ensureStr(req.risk, 'risk');
  ensureEnum(req.risk, 'risk', ['low','moderate','high','very_high','unknown']);
  ensureBool(req.overdose_education, 'overdose_education');
  ensureBool(req.naloxone_prescribed, 'naloxone_prescribed');
  ensureBool(req.monitoring, 'monitoring');
  ensureBool(req.benefit_risk_assessed, 'benefit_risk_assessed');
  let plan;
  if(req.risk==='high' && req.naloxone_prescribed===false) plan='continue_with_naloxone_then_reassess';
  else if(req.benefit_risk_assessed===false) plan='continue_with_review_then_reassess';
  else if(req.overdose_education===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function taper(req){
  ensureNumber(req.reduction_pct, 'reduction_pct');
  ensureBool(req.comfortable, 'comfortable');
  ensureBool(req.adjuncts, 'adjuncts');
  ensureBool(req.monitoring, 'monitoring');
  ensureBool(req.complete, 'complete');
  ensureBool(req.function_improved, 'function_improved');
  let plan;
  if(req.comfortable===false) plan='continue_with_slower_then_reassess';
  else if(req.adjuncts===false) plan='continue_with_adjuncts_then_reassess';
  else if(req.function_improved===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assess,nonopioid,opioid,nonpharm,risk,taper};}
module.exports={funcs,CITATIONS,ValidationError};