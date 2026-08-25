// filepath: tier5_irad_ext_102_neuro_engine.js
// TIER5_INTERVENTIONAL_RAD_EXT-102: Neurointerventional
'use strict';
const CITATIONS = ['SVIN_NeuroIR_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function stroke(req){
  ensureNumber(req.nihss, 'nihss');
  ensureNumber(req.time_onset, 'time_onset');
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['cta','mri','angiography','none','unknown']);
  ensureBool(req.lvo, 'lvo');
  ensureBool(req.tpa_given, 'tpa_given');
  ensureBool(req.thrombectomy, 'thrombectomy');
  let plan;
  if(req.lvo && req.thrombectomy===false) plan='continue_with_thrombectomy_then_reassess';
  else if(req.time_onset<=4.5 && req.tpa_given===false && req.lvo===false) plan='continue_with_tpa_then_reassess';
  else if(req.thrombectomy) plan='continue_with_observation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function aneurysm(req){
  ensureNumber(req.size, 'size');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['aca','mca','ica','pca','basilar','vertebral','posterior','anterior','other']);
  ensureBool(req.ruptured, 'ruptured');
  ensureBool(req.coiling, 'coiling');
  ensureBool(req.flow_diverter, 'flow_diverter');
  let plan;
  if(req.ruptured) plan='continue_with_emergent_then_reassess';
  else if(req.size>=7 && req.coiling===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function avm(req){
  ensureStr(req.spetzler, 'spetzler');
  ensureEnum(req.spetzler, 'spetzler', ['i','ii','iii','iv','v','unknown']);
  ensureBool(req.hemorrhage, 'hemorrhage');
  ensureBool(req.seizure, 'seizure');
  ensureBool(req.embolization, 'embolization');
  ensureBool(req.radiosurgery, 'radiosurgery');
  let plan;
  if(req.hemorrhage) plan='continue_with_emergent_then_reassess';
  else if(req.spetzler==='iv' || req.spetzler==='v') plan='continue_with_md_then_reassess';
  else if(req.embolization===false && req.spetzler!=='i') plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function carotid(req){
  ensureNumber(req.stenosis_pct, 'stenosis_pct');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.medical_optimized, 'medical_optimized');
  ensureBool(req.stent, 'stent');
  ensureBool(req.embolic_protection, 'embolic_protection');
  let plan;
  if(req.symptomatic && req.stenosis_pct>=70 && req.stent===false) plan='continue_with_cas_then_reassess';
  else if(req.stent && req.embolic_protection===false) plan='continue_with_protection_then_reassess';
  else if(req.medical_optimized===false) plan='continue_with_optimize_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vertebral(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['vertebroplasty','kyphoplasty','biopsy','facet','nerve_block','discography','other']);
  ensureBool(req.targeted, 'targeted');
  ensureBool(req.safe, 'safe');
  ensureBool(req.cement_leak, 'cement_leak');
  ensureBool(req.success, 'success');
  let plan;
  if(req.cement_leak) plan='continue_with_monitor_then_reassess';
  else if(req.success===false) plan='continue_with_repeat_then_reassess';
  else if(req.targeted===false) plan='continue_with_target_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.embolization_event, 'embolization_event');
  ensureBool(req.iatrogenic, 'iatrogenic');
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.stroke, 'stroke');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.stroke) plan='continue_with_emergent_then_reassess';
  else if(req.perforation && req.managed===false) plan='continue_with_manage_then_reassess';
  else if(req.iatrogenic && req.managed===false) plan='continue_with_manage_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {stroke,aneurysm,avm,carotid,vertebral,complications};}
module.exports={funcs,CITATIONS,ValidationError};