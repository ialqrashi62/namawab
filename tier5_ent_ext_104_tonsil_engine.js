// filepath: tier5_ent_ext_104_tonsil_engine.js
// TIER5_ENT_EXT-104: Adenotonsillar disease
'use strict';
const CITATIONS = ['AAP_Tonsil_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function strep(req){
  ensureStr(req.criteria, 'criteria');
  ensureEnum(req.criteria, 'criteria', ['centor_1','centor_2','centor_3','centor_4','centor_0','unknown']);
  ensureBool(req.strep_test, 'strep_test');
  ensureBool(req.antibiotics, 'antibiotics');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.criteria==='centor_3' || req.criteria==='centor_4') plan='continue_with_test_then_reassess';
  else if(req.strep_test && req.antibiotics===false) plan='continue_with_antibiotics_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tonsil_hypertrophy(req){
  ensureNumber(req.events_per_year, 'events_per_year');
  ensureNumber(req.ahi, 'ahi');
  ensureBool(req.sleep_apnea, 'sleep_apnea');
  ensureBool(req.weight_issue, 'weight_issue');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.ahi>=5 && req.surgery_planned===false) plan='continue_with_refer_then_reassess';
  else if(req.events_per_year>=7 && req.surgery_planned===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function adenoid(req){
  ensureNumber(req.age_months, 'age_months');
  ensureBool(req.nasal_obstruction, 'nasal_obstruction');
  ensureBool(req.serous_otitis, 'serous_otitis');
  ensureBool(req.sleep_apnea, 'sleep_apnea');
  ensureBool(req.surgery_planned, 'surgery_planned');
  let plan;
  if(req.serous_otitis && req.surgery_planned===false) plan='continue_with_review_then_reassess';
  else if(req.nasal_obstruction && req.surgery_planned===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function quinsy(req){
  ensureBool(req.suspected, 'suspected');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.iv_antibiotics, 'iv_antibiotics');
  ensureBool(req.drainage, 'drainage');
  ensureBool(req.airway_compromised, 'airway_compromised');
  let plan;
  if(req.airway_compromised) plan='continue_with_emergent_then_reassess';
  else if(req.drainage===false) plan='continue_with_drainage_then_reassess';
  else if(req.iv_antibiotics===false) plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sleep_apnea(req){
  ensureNumber(req.ahi, 'ahi');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.cpap_attempted, 'cpap_attempted');
  ensureBool(req.surgery_planned, 'surgery_planned');
  ensureBool(req.weight_loss, 'weight_loss');
  ensureBool(req.position_therapy, 'position_therapy');
  let plan;
  if(req.ahi>=30 && req.cpap_attempted===false) plan='continue_with_cpap_then_reassess';
  else if(req.cpap_attempted && req.surgery_planned===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function postop(req){
  ensureNumber(req.postop_days, 'postop_days');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.controlled, 'controlled');
  ensureBool(req.diet, 'diet');
  ensureBool(req.hydration, 'hydration');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.bleeding && req.controlled===false) plan='continue_with_cautery_then_reassess';
  else if(req.hydration===false) plan='continue_with_fluids_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {strep,tonsil_hypertrophy,adenoid,quinsy,sleep_apnea,postop};}
module.exports={funcs,CITATIONS,ValidationError};