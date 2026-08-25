// filepath: tier5_radonc_ext_105_seeds_engine.js
// TIER5_RADIONC_EXT-105: Prostate/breast seeds
'use strict';
const CITATIONS = ['ABS_ProstateSeed_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function evaluation(req){
  ensureNumber(req.psa, 'psa');
  ensureNumber(req.gleason, 'gleason');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['t1c','t2a','t2b','t2c','t3a','t3b','recurrent','other','unknown']);
  ensureNumber(req.prostate_size, 'prostate_size');
  ensureBool(req.candidate, 'candidate');
  ensureBool(req.consent, 'consent');
  let plan;
  if(req.gleason>=8 && req.stage==='t3b') plan='continue_with_ebrt_then_reassess';
  else if(req.candidate===false) plan='continue_with_review_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function planning(req){
  ensureNumber(req.target_volume, 'target_volume');
  ensureNumber(req.seeds_count, 'seeds_count');
  ensureNumber(req.activity, 'activity');
  ensureBool(req.preplan, 'preplan');
  ensureBool(req.intraop, 'intraop');
  ensureBool(req.dose_d90, 'dose_d90');
  ensureBool(req.coverage, 'coverage');
  let plan;
  if(req.dose_d90===false) plan='continue_with_review_then_reassess';
  else if(req.coverage===false) plan='continue_with_revise_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function procedure(req){
  ensureBool(req.implant, 'implant');
  ensureBool(req.trus, 'trus');
  ensureBool(req.template, 'template');
  ensureBool(req.completed, 'completed');
  ensureBool(req.fluoroscopy, 'fluoroscopy');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.completed===false) plan='continue_with_review_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function post_op(req){
  ensureNumber(req.ct_d90, 'ct_d90');
  ensureBool(req.ct_done, 'ct_done');
  ensureBool(req.catheter, 'catheter');
  ensureBool(req.pain, 'pain');
  ensureBool(req.discharged, 'discharged');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.ct_done===false) plan='continue_with_ct_then_reassess';
  else if(req.catheter) plan='continue_with_foley_then_reassess';
  else if(req.followup===false) plan='continue_with_fu_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tox(req){
  ensureBool(req.urinary, 'urinary');
  ensureBool(req.bowel, 'bowel');
  ensureBool(req.potency, 'potency');
  ensureBool(req.managed, 'managed');
  ensureBool(req.duration, 'duration');
  ensureBool(req.severity, 'severity');
  let plan;
  if(req.severity && req.managed===false) plan='continue_with_review_then_reassess';
  else if(req.urinary===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.psa_check, 'psa_check');
  ensureNumber(req.months, 'months');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.recurrence, 'recurrence');
  ensureBool(req.salvage_planned, 'salvage_planned');
  ensureBool(req.qol, 'qol');
  let plan;
  if(req.recurrence && req.salvage_planned===false) plan='continue_with_salvage_then_reassess';
  else if(req.psa_check===false) plan='continue_with_psa_then_reassess';
  else if(req.qol===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {evaluation,planning,procedure,post_op,tox,followup};}
module.exports={funcs,CITATIONS,ValidationError};