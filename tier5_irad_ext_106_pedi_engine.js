// filepath: tier5_irad_ext_106_pedi_engine.js
// TIER5_INTERVENTIONAL_RAD_EXT-106: Pediatric IR
'use strict';
const CITATIONS = ['SIR_PedsIR_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function angio(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.age_months, 'age_months');
  ensureStr(req.access, 'access');
  ensureEnum(req.access, 'access', ['femoral','umbilical','transhepatic','transplenic','jugular','other']);
  ensureBool(req.dose_reduced, 'dose_reduced');
  ensureBool(req.contrast_volume, 'contrast_volume');
  ensureBool(req.successful, 'successful');
  let plan;
  if(req.dose_reduced===false) plan='continue_with_reduce_then_reassess';
  else if(req.contrast_volume===false) plan='continue_with_limit_then_reassess';
  else if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function biopsy(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['core','fna','stereotactic','none','other']);
  ensureStr(req.target, 'target');
  ensureEnum(req.target, 'target', ['liver','lung','kidney','soft_tissue','bone','lymph','other']);
  ensureBool(req.coag_checked, 'coag_checked');
  ensureBool(req.sedation_planned, 'sedation_planned');
  ensureBool(req.successful, 'successful');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.coag_checked===false) plan='continue_with_correct_then_reassess';
  else if(req.sedation_planned===false) plan='continue_with_sedation_then_reassess';
  else if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function drainage(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['abscess','pseudocyst','biliary','pleural','peritoneal','other']);
  ensureBool(req.safe_access, 'safe_access');
  ensureBool(req.successful, 'successful');
  ensureBool(req.catheter_removed, 'catheter_removed');
  ensureBool(req.family_educated, 'family_educated');
  let plan;
  if(req.safe_access===false) plan='continue_with_alternative_then_reassess';
  else if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else if(req.family_educated===false) plan='continue_with_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function gastrostomy(req){
  ensureBool(req.consent, 'consent');
  ensureBool(req.fast, 'fast');
  ensureBool(req.prophylactic_abx, 'prophylactic_abx');
  ensureBool(req.successful, 'successful');
  ensureBool(req.fixed, 'fixed');
  ensureBool(req.tube_working, 'tube_working');
  let plan;
  if(req.fast===false) plan='continue_with_reschedule_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.tube_working===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sedation(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['none','moderate','deep','general','topical','other']);
  ensureBool(req.fasting, 'fasting');
  ensureBool(req.airway, 'airway');
  ensureBool(req.monitoring, 'monitoring');
  ensureBool(req.recovery, 'recovery');
  ensureBool(req.discharge, 'discharge');
  let plan;
  if(req.fasting===false && req.type==='deep') plan='continue_with_reschedule_then_reassess';
  else if(req.airway===false) plan='continue_with_protect_then_reassess';
  else if(req.recovery===false) plan='continue_with_extend_then_reassess';
  else if(req.discharge===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.infection, 'infection');
  ensureBool(req.allergy, 'allergy');
  ensureBool(req.contrast_extrav, 'contrast_extrav');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.contrast_extrav) plan='continue_with_care_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_manage_then_reassess';
  else if(req.allergy) plan='continue_with_steroid_then_reassess';
  else if(req.infection) plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {angio,biopsy,drainage,gastrostomy,sedation,complications};}
module.exports={funcs,CITATIONS,ValidationError};