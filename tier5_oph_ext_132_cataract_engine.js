// filepath: tier5_oph_ext_132_cataract_engine.js
// TIER5_OPH_EXT-132: Cataract Surgery
'use strict';
const CITATIONS = ['AAO_PPP_CATARACT_2021','ESCRS_PB'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.eye, 'eye');
  ensureEnum(req.eye, 'eye', ['od','os','ou']);
  ensureNumber(req.bcva, 'bcva');
  ensureEnum(req.glare_severity, 'glare_severity', ['mild','moderate','severe','unknown']);
  ensureBool(req.functional_impact, 'functional_impact');
  ensureBool(req.cataract_significant, 'cataract_significant');
  let plan;
  if(req.bcva<0.5 || req.glare_severity==='severe') plan='continue_with_surgical_eval_then_reassess';
  else if(req.functional_impact===true) plan='continue_with_eval_then_reassess';
  else plan='continue_with_monitor_then_reassess';
  return {plan};
}
function biometry(req){
  ensureNumber(req.al, 'al');
  ensureNumber(req.k1, 'k1');
  ensureNumber(req.k2, 'k2');
  ensureEnum(req.formula, 'formula', ['srk_t','haigis','barrett','holladay','hill','other','unknown']);
  ensureEnum(req.iol_power, 'iol_power', ['monofocal','toric','multifocal','edof','other','unknown']);
  ensureNumber(req.target_refraction, 'target_refraction');
  let plan;
  if(req.al<22 || req.al>26) plan='continue_with_iol_review_then_reassess';
  else if(req.iol_power==='toric' && req.target_refraction===0) plan='continue_with_axis_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function surgery(req){
  ensureEnum(req.technique, 'technique', ['phaco','manual_sics','femto','eccce','iccce','other','unknown']);
  ensureBool(req.dilation_ok, 'dilation_ok');
  ensureBool(req.consent, 'consent');
  ensureBool(req.marking_done, 'marking_done');
  ensureBool(req.dr_safety_check, 'dr_safety_check');
  ensureBool(req.anesthesia_ok, 'anesthesia_ok');
  let plan;
  if(req.dilation_ok===false) plan='continue_with_dilation_then_reassess';
  else if(req.consent===false) plan='continue_with_consent_then_reassess';
  else plan='continue_with_proceed_then_reassess';
  return {plan};
}
function intraop(req){
  ensureEnum(req.complication, 'complication', ['none','pc_rupture','zonular_dialysis','dropped_nucleus','posterior_capsule_opacification','inflammation','other','unknown']);
  ensureBool(req.posterior_capsule_intact, 'posterior_capsule_intact');
  ensureBool(req.iol_implanted, 'iol_implanted');
  ensureBool(req.mm_inflated, 'mm_inflated');
  ensureBool(req.stable_anterior_chamber, 'stable_anterior_chamber');
  ensureBool(req.ioflu_use, 'ioflu_use');
  let plan;
  if(req.complication==='dropped_nucleus' || req.complication==='zonular_dialysis') plan='continue_with_referral_then_reassess';
  else if(req.iol_implanted===false) plan='continue_with_iol_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function post_op(req){
  ensureNumber(req.day_post_op, 'day_post_op');
  ensureBool(req.dressing_clean, 'dressing_clean');
  ensureBool(req.cornea_clear, 'cornea_clear');
  ensureNumber(req.iop, 'iop');
  ensureEnum(req.findings, 'findings', ['normal','mild_inflammation','high_iop','endophthalmitis_suspect','choroidal_detachment','wound_leak','other','unknown']);
  ensureBool(req.drops_continued, 'drops_continued');
  let plan;
  if(req.findings==='endophthalmitis_suspect') plan='continue_with_vitreous_tap_then_reassess';
  else if(req.findings==='high_iop' || req.findings==='choroidal_detachment') plan='continue_with_intense_treatment_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}
function cataract_fu(req){
  ensureNumber(req.weeks_post_op, 'weeks_post_op');
  ensureNumber(req.bcva, 'bcva');
  ensureBool(req.refraction_stable, 'refraction_stable');
  ensureBool(req.glasses_updated, 'glasses_updated');
  ensureEnum(req.outcome, 'outcome', ['success','refractive_surprise','secondary_cataract','glare_dysphotopsia','inflammation','other','unknown']);
  ensureBool(req.yag_capsulotomy, 'yag_capsulotomy');
  let plan;
  if(req.outcome==='secondary_cataract') plan='continue_with_yag_then_reassess';
  else if(req.refraction_stable===false) plan='continue_with_reassess_then_reassess';
  else plan='continue_with_continue_then_reassess';
  return {plan};
}

function funcs(){return {indication,biometry,surgery,intraop,post_op,cataract_fu};}
module.exports = {funcs, CITATIONS, ValidationError};
