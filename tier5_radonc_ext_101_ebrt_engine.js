// filepath: tier5_radonc_ext_101_ebrt_engine.js
// TIER5_RADIONC_EXT-101: EBRT
'use strict';
const CITATIONS = ['ASTRO_EBRT_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function intent(req){
  ensureStr(req.intent, 'intent');
  ensureEnum(req.intent, 'intent', ['curative','palliative','adjuvant','neoadjuvant','definitive','salvage','prophylactic']);
  ensureStr(req.site, 'site');
  ensureEnum(req.site, 'site', ['breast','lung','prostate','rectum','head_neck','brain','cervix','endometrium','esophagus','pancreas','liver','sarcoma','lymphoma','skin','other']);
  ensureBool(req.consented, 'consented');
  ensureBool(req.mdt, 'mdt');
  let plan;
  if(req.intent==='palliative') plan='continue_with_palliative_plan_then_reassess';
  else if(req.mdt===false) plan='continue_with_review_then_reassess';
  else if(req.consented===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function planning(req){
  ensureBool(req.ct_sim, 'ct_sim');
  ensureStr(req.technique, 'technique');
  ensureEnum(req.technique, 'technique', ['3d_conformal','imrt','vmat','tomo','proton','stereotactic','cyberknife','gk','srs','sbrt','srt','electron','none','other']);
  ensureBool(req.contoured, 'contoured');
  ensureBool(req.plan_approved, 'plan_approved');
  ensureBool(req.qa, 'qa');
  ensureBool(req.ivd, 'ivd');
  let plan;
  if(req.ct_sim===false) plan='continue_with_sim_then_reassess';
  else if(req.contoured===false) plan='continue_with_contour_then_reassess';
  else if(req.plan_approved===false) plan='continue_with_review_then_reassess';
  else if(req.qa===false) plan='continue_with_qa_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dose(req){
  ensureNumber(req.total_dose, 'total_dose');
  ensureNumber(req.fractions, 'fractions');
  ensureNumber(req.dose_per_fx, 'dose_per_fx');
  ensureNumber(req.eqd2, 'eqd2');
  ensureBool(req.oars_safe, 'oars_safe');
  ensureBool(req.constraints_met, 'constraints_met');
  let plan;
  if(req.oars_safe===false) plan='continue_with_renormalize_then_reassess';
  else if(req.constraints_met===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function image_guided(req){
  ensureBool(req.daily_imaging, 'daily_imaging');
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['kv','mv','cbct','mri','surface','fiducial','none','other']);
  ensureBool(req.match_done, 'match_done');
  ensureBool(req.couch_shift, 'couch_shift');
  ensureBool(req.tolerance_met, 'tolerance_met');
  let plan;
  if(req.daily_imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.match_done===false) plan='continue_with_match_then_reassess';
  else if(req.tolerance_met===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function treatment(req){
  ensureNumber(req.session, 'session');
  ensureBool(req.delivered, 'delivered');
  ensureBool(req.weight, 'weight');
  ensureBool(req.tolerated, 'tolerated');
  ensureBool(req.toxicity, 'toxicity');
  ensureBool(req.fractions_completed, 'fractions_completed');
  let plan;
  if(req.toxicity) plan='continue_with_review_then_reassess';
  else if(req.tolerated===false) plan='continue_with_support_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureNumber(req.weeks, 'weeks');
  ensureBool(req.acute_tox, 'acute_tox');
  ensureBool(req.late_tox, 'late_tox');
  ensureBool(req.recurrence, 'recurrence');
  ensureBool(req.qol, 'qol');
  ensureBool(req.surveillance, 'surveillance');
  let plan;
  if(req.late_tox) plan='continue_with_review_then_reassess';
  else if(req.recurrence) plan='continue_with_refer_then_reassess';
  else if(req.surveillance===false) plan='continue_with_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {intent,planning,dose,image_guided,treatment,followup};}
module.exports={funcs,CITATIONS,ValidationError};