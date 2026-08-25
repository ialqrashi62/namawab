// filepath: tier5_oph_ext_104_cornea_engine.js
// TIER5_OPHTHALMOLOGY_EXT-104: Cornea & external
'use strict';
const CITATIONS = ['AAO_Cornea_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function diagnosis(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['keratoconus','dry_eye','pterygium','pterygium_recurrent','fuchs_dystrophy','keratitis','abrasion','ulcer','foreign_body','other','none']);
  ensureBool(req.clinical, 'clinical');
  ensureBool(req.imaging_done, 'imaging_done');
  ensureBool(req.cultures_done, 'cultures_done');
  let plan;
  if(req.condition==='ulcer' && req.cultures_done===false) plan='continue_with_culture_then_reassess';
  else if(req.clinical===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function keratitis(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['bacterial','viral','fungal','acanthamoeba','non_infectious','contact_lens','none','other']);
  ensureBool(req.contact_user, 'contact_user');
  ensureBool(req.culture_done, 'culture_done');
  ensureBool(req.antibiotics_started, 'antibiotics_started');
  ensureBool(req.followup_scheduled, 'followup_scheduled');
  let plan;
  if(req.type==='acanthamoeba' && req.antibiotics_started===false) plan='continue_with_treat_then_reassess';
  else if(req.contact_user && req.culture_done===false) plan='continue_with_culture_then_reassess';
  else if(req.followup_scheduled===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function keratoconus(req){
  ensureNumber(req.k_max, 'k_max');
  ensureNumber(req.thinnest_pach, 'thinnest_pach');
  ensureBool(req.progression, 'progression');
  ensureBool(req.crosslinking, 'crosslinking');
  ensureBool(req.contact_lens_fitted, 'contact_lens_fitted');
  ensureBool(req.transplant_needed, 'transplant_needed');
  let plan;
  if(req.progression && req.crosslinking===false) plan='continue_with_cxl_then_reassess';
  else if(req.transplant_needed) plan='continue_with_refer_then_reassess';
  else if(req.contact_lens_fitted===false) plan='continue_with_fit_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dry_eye(req){
  ensureNumber(req.schirmer, 'schirmer');
  ensureNumber(req.tbut, 'tbut');
  ensureStr(req.severity, 'severity');
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','none']);
  ensureBool(req.artificial_tears, 'artificial_tears');
  ensureBool(req.anti_inflammatory, 'anti_inflammatory');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.severity==='severe' && req.anti_inflammatory===false) plan='continue_with_treat_then_reassess';
  else if(req.responded===false) plan='continue_with_escalate_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transplant(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['pk','dsaek','dmek','alk','tectonic','none','other']);
  ensureBool(req.successful, 'successful');
  ensureBool(req.rejection, 'rejection');
  ensureBool(req.immunosuppression, 'immunosuppression');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.rejection && req.immunosuppression===false) plan='continue_with_treat_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function refractive(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['lasik','prk','smile','icl','rle','none','other']);
  ensureBool(req.screening_done, 'screening_done');
  ensureBool(req.candidate, 'candidate');
  ensureBool(req.successful, 'successful');
  ensureBool(req.complications, 'complications');
  let plan;
  if(req.candidate===false) plan='continue_with_review_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {diagnosis,keratitis,keratoconus,dry_eye,transplant,refractive};}
module.exports={funcs,CITATIONS,ValidationError};