// filepath: tier5_oph_ext_135_cornea_engine.js
// TIER5_OPH_EXT-135: Cornea / External Disease
'use strict';
const CITATIONS = ['AAO_PPP_CORNEA_2021','CL_PB'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function workup(req){
  ensureStr(req.eye, 'eye');
  ensureEnum(req.eye, 'eye', ['od','os','ou']);
  ensureEnum(req.symptom, 'symptom', ['red_eye','pain','blur','photophobia','foreign_body_sensation','discharge','tearing','other']);
  ensureNumber(req.bcva, 'bcva');
  ensureBool(req.fluorescein_staining, 'fluorescein_staining');
  ensureEnum(req.diagnosis, 'diagnosis', ['dry_eye','blepharitis','conjunctivitis','keratitis','keratoconus','abrasion','recurrent_erosion','pseudophakic','other','unknown']);
  let plan;
  if(req.diagnosis==='keratitis') plan='continue_with_culture_then_reassess';
  else if(req.diagnosis==='keratoconus') plan='continue_with_cxl_eval_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function dry_eye(req){
  ensureEnum(req.severity, 'severity', ['mild','moderate','severe','unknown']);
  ensureBool(req.schirmer, 'schirmer');
  ensureBool(req.tbuth, 'tbuth');
  ensureEnum(req.treatment, 'treatment', ['drops','ointment','punctal_plug','cyclosporine','steroid','omega','none','other']);
  ensureBool(req.environment_addressed, 'environment_addressed');
  ensureBool(req.omega_recommend, 'omega_recommend');
  let plan;
  if(req.severity==='severe' && req.treatment==='none') plan='continue_with_drops_then_reassess';
  else if(req.treatment==='cyclosporine' || req.treatment==='steroid') plan='continue_with_continue_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function infectious(req){
  ensureEnum(req.type, 'type', ['bacterial','viral','fungal','acanthamoeba','atypical','unknown','other']);
  ensureBool(req.culture_done, 'culture_done');
  ensureBool(req.fluorescein_done, 'fluorescein_done');
  ensureEnum(req.antibiotic, 'antibiotic', ['moxifloxacin','gatifloxacin','tobramycin','fortified','antifungal','antiviral','cyclosporine','none','other','unknown']);
  ensureBool(req.contact_lens_paused, 'contact_lens_paused');
  ensureBool(req.recheck_planned, 'recheck_planned');
  let plan;
  if(req.type==='acanthamoeba' || req.type==='fungal') plan='continue_with_referral_then_reassess';
  else if(req.contact_lens_paused===false) plan='continue_with_pause_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function keratoconus(req){
  ensureNumber(req.corneal_thinnest, 'corneal_thinnest');
  ensureNumber(req.k_max, 'k_max');
  ensureEnum(req.stage, 'stage', ['mild','moderate','severe','forme_fruste','advanced','unknown']);
  ensureBool(req.bilateral, 'bilateral');
  ensureEnum(req.cxl_indicated, 'cxl_indicated', ['yes','no','defer','unknown','other']);
  ensureBool(req.contact_lens_fit, 'contact_lens_fit');
  let plan;
  if(req.stage==='severe' && req.cxl_indicated==='yes') plan='continue_with_cxl_then_reassess';
  else if(req.stage==='mild' && req.cxl_indicated==='no') plan='continue_with_monitor_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function transplant(req){
  ensureEnum(req.transplant_type, 'transplant_type', ['dsek','dmek','pkr','pk','dsaek','other','unknown']);
  ensureBool(req.eye_bank_tissue, 'eye_bank_tissue');
  ensureBool(req.recipient_cleared, 'recipient_cleared');
  ensureBool(req.consent, 'consent');
  ensureBool(req.topical_prophylaxis, 'topical_prophylaxis');
  ensureBool(req.graft_position_verified, 'graft_position_verified');
  let plan;
  if(req.consent===false) plan='continue_with_consent_then_reassess';
  else if(req.topical_prophylaxis===false) plan='continue_with_prophylaxis_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function cornea_fu(req){
  ensureNumber(req.weeks_since_dx, 'weeks_since_dx');
  ensureBool(req.symptoms_improved, 'symptoms_improved');
  ensureBool(req.med_adherent, 'med_adherent');
  ensureBool(req.exam_consistent, 'exam_consistent');
  ensureEnum(req.status, 'status', ['resolved','ongoing','flare','unknown']);
  ensureBool(req.specialty_referred, 'specialty_referred');
  let plan;
  if(req.status==='flare') plan='continue_with_aggressive_then_reassess';
  else if(req.med_adherent===false) plan='continue_with_adherence_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {workup,dry_eye,infectious,keratoconus,transplant,cornea_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
