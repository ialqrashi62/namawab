// filepath: tier5_pall_care_ext_101_pain_engine.js
// TIER5_PALL_CARE_EXT-101: Cancer pain management (WHO ladder, opioid rotation)
'use strict';
const CITATIONS = ['NCCN_Cancer_Pain_2023','WHO_Cancer_Pain_2018','CDC_Opioid_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pain_assessment(req){
  ensureNumber(req.pain_score_0_10, 'pain_score_0_10');
  ensureStr(req.pain_type, 'pain_type');
  ensureEnum(req.pain_type, 'pain_type', ['nociceptive_somatic','nociceptive_visceral','neuropathic','mixed','breakthrough']);
  ensureStr(req.location, 'location');
  ensureNumber(req.days_present, 'days_present');
  ensureNumber(req.current_opioid_mme, 'current_opioid_mme');
  let plan;
  if(req.pain_score_0_10>=7) plan='continue_with_opioid_titration_then_reassess';
  else if(req.pain_type==='neuropathic') plan='continue_with_gabapentinoid_then_reassess';
  else if(req.pain_type==='breakthrough') plan='continue_with_rescue_dose_then_reassess';
  else if(req.pain_score_0_10>=4) plan='continue_with_weak_opioid_then_reassess';
  else plan='continue_with_non_opioid_then_reassess';
  return {plan};
}
function opioid_rotation(req){
  ensureStr(req.current_opioid, 'current_opioid');
  ensureEnum(req.current_opioid, 'current_opioid', ['morphine','oxycodone','hydromorphone','fentanyl','methadone','buprenorphine','codeine','tramadol']);
  ensureStr(req.new_opioid, 'new_opioid');
  ensureEnum(req.new_opioid, 'new_opioid', ['morphine','oxycodone','hydromorphone','fentanyl','methadone','buprenorphine','codeine','tramadol']);
  ensureNumber(req.current_dose_mg, 'current_dose_mg');
  ensureNumber(req.rotation_reason, 'rotation_reason'); // 1 inefficacy 2 side effects 3 route change 4 convenience
  ensureNumber(req.egfr, 'egfr');
  let plan;
  if(req.rotation_reason===1) plan='continue_with_new_opioid_then_reassess';
  else if(req.rotation_reason===2) plan='continue_with_new_opioid_then_reassess';
  else if(req.rotation_reason===3) plan='continue_with_equianalgesic_then_reassess';
  else if(req.rotation_reason===4) plan='continue_with_new_opioid_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.new_opioid==='methadone' && req.egfr<60) plan+='_consider_monitoring';
  return {plan};
}
function breakthrough(req){
  ensureNumber(req.regular_opioid_mme, 'regular_opioid_mme');
  ensureNumber(req.breakthrough_doses_per_day, 'breakthrough_doses_per_day');
  ensureNumber(req.pain_score_breakthrough, 'pain_score_breakthrough');
  ensureNumber(req.hours_between_doses, 'hours_between_doses');
  ensureBool(req.documented_activity_trigger, 'documented_activity_trigger');
  let plan;
  if(req.breakthrough_doses_per_day>=3) plan='continue_with_increase_regular_then_reassess';
  else if(req.pain_score_breakthrough>=7) plan='continue_with_rescue_then_reassess';
  else if(req.hours_between_doses<2) plan='continue_with_review_then_reassess';
  else if(req.documented_activity_trigger===false) plan='continue_with_documented_trigger_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioid_side_effects(req){
  ensureBool(req.constipation, 'constipation');
  ensureBool(req.nausea, 'nausea');
  ensureBool(req.sedation, 'sedation');
  ensureBool(req.respiratory_depression, 'respiratory_depression');
  ensureBool(req.delirium, 'delirium');
  ensureNumber(req.days_on_opioid, 'days_on_opioid');
  let plan;
  if(req.respiratory_depression) plan='continue_with_hold_opioid_then_reassess';
  else if(req.delirium) plan='continue_with_rotation_then_reassess';
  else if(req.constipation) plan='continue_with_laxative_then_reassess';
  else if(req.nausea) plan='continue_with_antiemetic_then_reassess';
  else if(req.sedation) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function non_opioid_analgesics(req){
  ensureBool(req.acetaminophen_active, 'acetaminophen_active');
  ensureBool(req.nsaid_active, 'nsaid_active');
  ensureBool(req.gabapentinoid_active, 'gabapentinoid_active');
  ensureBool(req.snri_active, 'snri_active');
  ensureBool(req.bisphosphonate_active, 'bisphosphonate_active');
  ensureBool(req.corticosteroid_active, 'corticosteroid_active');
  let plan;
  if(req.acetaminophen_active===false) plan='continue_with_acetaminophen_then_reassess';
  else if(req.nsaid_active===false) plan='continue_with_nsaid_then_reassess';
  else if(req.gabapentinoid_active===false && req.pain_type==='neuropathic') plan='continue_with_gabapentinoid_then_reassess';
  else if(req.bisphosphonate_active===false && req.bone_metastases) plan='continue_with_bisphosphonate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioid_risk(req){
  ensureNumber(req.daily_mme, 'daily_mme');
  ensureBool(req.substance_use_history, 'substance_use_history');
  ensureBool(req.family_substance_use, 'family_substance_use');
  ensureBool(req.mental_health_history, 'mental_health_history');
  ensureNumber(req.urine_drug_screen_done, 'urine_drug_screen_done'); // 0 no 1 yes
  ensureBool(req.pdmp_checked, 'pdmp_checked');
  let plan;
  if(req.daily_mme>=100) plan='continue_with_refer_pain_specialist_then_reassess';
  else if(req.substance_use_history && !req.urine_drug_screen_done) plan='continue_with_urine_drug_screen_then_reassess';
  else if(!req.pdmp_checked) plan='continue_with_pdmp_check_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pain_assessment,opioid_rotation,breakthrough,opioid_side_effects,non_opioid_analgesics,opioid_risk};}
module.exports={funcs,CITATIONS,ValidationError};
