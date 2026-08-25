// filepath: tier5_pmrehab_ext_101_acute_engine.js
// TIER5_PMREHAB_EXT-101: Acute pain
'use strict';
const CITATIONS = ['ASA_AcutePain_2018','APS_AcutePain_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assess(req){
  ensureNumber(req.pain_score, 'pain_score');
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['nociceptive','visceral','neuropathic','mixed','unknown']);
  ensureStr(req.location, 'location');
  ensureNumber(req.duration_hours, 'duration_hours');
  ensureBool(req.vital_signs, 'vital_signs');
  ensureBool(req.function, 'function');
  let plan;
  if(req.vital_signs===false) plan='continue_with_review_then_reassess';
  else if(req.pain_score>=7) plan='continue_with_strong_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nonopioid(req){
  ensureBool(req.acetaminophen, 'acetaminophen');
  ensureBool(req.nsaid, 'nsaid');
  ensureBool(req.iv_acetaminophen, 'iv_acetaminophen');
  ensureBool(req.gabapentin, 'gabapentin');
  ensureBool(req.contraindicated, 'contraindicated');
  ensureBool(req.effective, 'effective');
  let plan;
  if(req.contraindicated) plan='continue_with_alternative_then_reassess';
  else if(req.effective===false) plan='continue_with_escalate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function opioid(req){
  ensureBool(req.indicated, 'indicated');
  ensureNumber(req.daily_mme, 'daily_mme');
  ensureBool(req.short_acting, 'short_acting');
  ensureBool(req.nausea_meds, 'nausea_meds');
  ensureBool(req.bowel_regimen, 'bowel_regimen');
  ensureBool(req.pain_improved, 'pain_improved');
  ensureBool(req.function_improved, 'function_improved');
  ensureBool(req.respiratory_depression, 'respiratory_depression');
  ensureBool(req.sedation, 'sedation');
  let plan;
  if(req.respiratory_depression) plan='continue_with_emergent_then_reassess';
  else if(req.daily_mme>=50 && req.function_improved===false) plan='continue_with_reassess_then_reassess';
  else if(req.bowel_regimen===false) plan='continue_with_bowel_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function regional(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['epidural','peripheral_nerve','spinal','fascial_plane','none','other']);
  ensureBool(req.catheter, 'catheter');
  ensureBool(req.sensory_block, 'sensory_block');
  ensureBool(req.motor_block, 'motor_block');
  ensureBool(req.complications, 'complications');
  ensureBool(req.monitoring, 'monitoring');
  let plan;
  if(req.complications) plan='continue_with_review_then_reassess';
  else if(req.monitoring===false) plan='continue_with_monitor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pca(req){
  ensureBool(req.load, 'load');
  ensureBool(req.basal, 'basal');
  ensureBool(req.bolus, 'bolus');
  ensureNumber(req.max_dose, 'max_dose');
  ensureBool(req.responded, 'responded');
  ensureBool(req.adverse, 'adverse');
  let plan;
  if(req.adverse) plan='continue_with_review_then_reassess';
  else if(req.responded===false) plan='continue_with_titrate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transition(req){
  ensureBool(req.po_intolerance, 'po_intolerance');
  ensureBool(req.converted, 'converted');
  ensureBool(req.equianalgesic, 'equianalgesic');
  ensureBool(req.breakthrough, 'breakthrough');
  ensureBool(req.tolerating, 'tolerating');
  let plan;
  if(req.equianalgesic===false) plan='continue_with_calc_then_reassess';
  else if(req.tolerating===false) plan='continue_with_iv_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assess,nonopioid,opioid,regional,pca,transition};}
module.exports={funcs,CITATIONS,ValidationError};