// filepath: tier5_public_health_ext_104_screen_engine.js
// TIER5_PUBLIC_HEALTH_EXT-104: Population screening
'use strict';
const CITATIONS = ['USPSTF_2020','Screen_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function criteria(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['breast_cancer','cervical_cancer','colorectal_cancer','lung_cancer','prostate_cancer','depression','diabetes','hypertension','tb','hiv','hepatitis_c','osteoporosis','aaa','aaa_abdominal_aortic_aneurysm','alcohol_use','tobacco_use','obesity','lipid_disorders','vision_hearing','falls_risk','none']);
  ensureNumber(req.age, 'age');
  ensureBool(req.recommendation_supported, 'recommendation_supported');
  ensureBool(req.eligible, 'eligible');
  ensureBool(req.counseled, 'counseled');
  let plan;
  if(req.recommendation_supported===false) plan='continue_with_review_then_reassess';
  else if(req.eligible===false) plan='continue_with_screen_then_reassess';
  else if(req.counseled===false) plan='continue_with_counsel_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function adherence(req){
  ensureBool(req.uptake_uptodate, 'uptake_uptodate');
  ensureBool(req.barriers_identified, 'barriers_identified');
  ensureBool(req.reminder_sent, 'reminder_sent');
  ensureBool(req.followup_done, 'followup_done');
  ensureBool(req.facilitators, 'facilitators');
  let plan;
  if(req.uptake_uptodate===false) plan='continue_with_identify_then_reassess';
  else if(req.barriers_identified===false) plan='continue_with_address_then_reassess';
  else if(req.reminder_sent===false) plan='continue_with_remind_then_reassess';
  else if(req.followup_done===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followUp(req){
  ensureBool(req.abnormal_result, 'abnormal_result');
  ensureBool(req.diagnostic_followup, 'diagnostic_followup');
  ensureBool(req.treatment_initiated, 'treatment_initiated');
  ensureBool(req.counseling_done, 'counseling_done');
  ensureBool(req.surveillance_continued, 'surveillance_continued');
  let plan;
  if(req.abnormal_result && req.diagnostic_followup===false) plan='continue_with_followup_then_reassess';
  else if(req.treatment_initiated===false) plan='continue_with_initiate_then_reassess';
  else if(req.counseling_done===false) plan='continue_with_counsel_then_reassess';
  else if(req.surveillance_continued===false) plan='continue_with_continue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function registry(req){
  ensureNumber(req.cohort_size, 'cohort_size');
  ensureBool(req.demographics_complete, 'demographics_complete');
  ensureBool(req.risk_factors_documented, 'risk_factors_documented');
  ensureBool(req.outcomes_tracked, 'outcomes_tracked');
  ensureBool(req.privacy_maintained, 'privacy_maintained');
  let plan;
  if(req.demographics_complete===false) plan='continue_with_complete_then_reassess';
  else if(req.risk_factors_documented===false) plan='continue_with_document_then_reassess';
  else if(req.outcomes_tracked===false) plan='continue_with_track_then_reassess';
  else if(req.privacy_maintained===false) plan='continue_with_assess_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function program(req){
  ensureNumber(req.population_covered, 'population_covered');
  ensureNumber(req.eligible_count, 'eligible_count');
  ensureBool(req.outreach_active, 'outreach_active');
  ensureBool(req.quality_metrics, 'quality_metrics');
  ensureBool(req.reporting_active, 'reporting_active');
  let plan;
  if(req.population_covered<req.eligible_count) plan='continue_with_outreach_then_reassess';
  else if(req.outreach_active===false) plan='continue_with_increase_then_reassess';
  else if(req.quality_metrics===false) plan='continue_with_define_then_reassess';
  else if(req.reporting_active===false) plan='continue_with_report_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function specialPop(req){
  ensureStr(req.population, 'population');
  ensureEnum(req.population, 'population', ['lgbtq','disabled','migrant','incarcerated','homeless','veteran','immigrant','indigenous','minority','none']);
  ensureBool(req.culturally_appropriate, 'culturally_appropriate');
  ensureBool(req.accessible, 'accessible');
  ensureBool(req.outreach, 'outreach');
  ensureBool(req.partnership, 'partnership');
  ensureBool(req.adapted_materials, 'adapted_materials');
  let plan;
  if(req.culturally_appropriate===false) plan='continue_with_adapt_then_reassess';
  else if(req.accessible===false) plan='continue_with_address_then_reassess';
  else if(req.outreach===false) plan='continue_with_outreach_then_reassess';
  else if(req.partnership===false) plan='continue_with_partner_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {criteria,adherence,followUp,registry,program,specialPop};}
module.exports={funcs,CITATIONS,ValidationError};
