// filepath: tier5_pmrehab_ext_104_ot_engine.js
// TIER5_PMREHAB_EXT-104: Occupational therapy
'use strict';
const CITATIONS = ['AOTA_Guidelines_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function assess(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['post_stroke','post_surgical','hand_injury','arthritis','developmental','neurologic','cognitive','other']);
  ensureNumber(req.fim_score, 'fim_score');
  ensureBool(req.cognitive, 'cognitive');
  ensureBool(req.motor, 'motor');
  ensureBool(req.sensory, 'sensory');
  let plan;
  if(req.cognitive===false) plan='continue_with_review_then_reassess';
  else if(req.motor===false) plan='continue_with_motor_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function adl(req){
  ensureBool(req.dressing, 'dressing');
  ensureBool(req.bathing, 'bathing');
  ensureBool(req.eating, 'eating');
  ensureBool(req.toileting, 'toileting');
  ensureBool(req.transfer, 'transfer');
  ensureBool(req.independence_improved, 'independence_improved');
  let plan;
  if(req.independence_improved===false) plan='continue_with_continue_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function splint(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['resting','functional','wrist','ankle','elbow','thumb','custom','none','other']);
  ensureBool(req.fabricated, 'fabricated');
  ensureBool(req.fitting, 'fitting');
  ensureBool(req.worn, 'worn');
  ensureBool(req.skin_intact, 'skin_intact');
  let plan;
  if(req.skin_intact===false) plan='continue_with_review_then_reassess';
  else if(req.fitting===false) plan='continue_with_fit_then_reassess';
  else if(req.worn===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function wheelchair(req){
  ensureBool(req.evaluated, 'evaluated');
  ensureBool(req.sized, 'sized');
  ensureBool(req.posture, 'posture');
  ensureBool(req.pressure_relief, 'pressure_relief');
  ensureBool(req.training, 'training');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.evaluated===false) plan='continue_with_evaluate_then_reassess';
  else if(req.training===false) plan='continue_with_train_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function home_mod(req){
  ensureBool(req.assessed, 'assessed');
  ensureBool(req.recommended, 'recommended');
  ensureBool(req.installed, 'installed');
  ensureBool(req.accessible, 'accessible');
  ensureBool(req.caregiver_educated, 'caregiver_educated');
  let plan;
  if(req.assessed===false) plan='continue_with_assess_then_reassess';
  else if(req.installed===false) plan='continue_with_install_then_reassess';
  else if(req.caregiver_educated===false) plan='continue_with_educate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function progress(req){
  ensureNumber(req.sessions, 'sessions');
  ensureBool(req.independence, 'independence');
  ensureBool(req.function_improved, 'function_improved');
  ensureBool(req.satisfaction, 'satisfaction');
  ensureBool(req.discharge_planning, 'discharge_planning');
  let plan;
  if(req.function_improved===false) plan='continue_with_extend_then_reassess';
  else if(req.discharge_planning===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {assess,adl,splint,wheelchair,home_mod,progress};}
module.exports={funcs,CITATIONS,ValidationError};