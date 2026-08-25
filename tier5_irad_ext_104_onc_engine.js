// filepath: tier5_irad_ext_104_onc_engine.js
// TIER5_INTERVENTIONAL_RAD_EXT-104: Oncologic IR
'use strict';
const CITATIONS = ['SIR_OncIR_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function ablation(req){
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['rfa','mwa','cryo','ire','laser','hifu','none','other']);
  ensureStr(req.target, 'target');
  ensureEnum(req.target, 'target', ['liver','lung','kidney','bone','soft_tissue','thyroid','breast','prostate','other']);
  ensureBool(req.successful, 'successful');
  ensureBool(req.tumor_localized, 'tumor_localized');
  ensureBool(req.adequate_margins, 'adequate_margins');
  let plan;
  if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else if(req.adequate_margins===false) plan='continue_with_review_then_reassess';
  else if(req.tumor_localized===false) plan='continue_with_localization_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tace(req){
  ensureStr(req.chemo, 'chemo');
  ensureEnum(req.chemo, 'chemo', ['doxorubicin','irinotecan','cisplatin','oxaliplatin','drug_eluting','none','other']);
  ensureBool(req.lobar, 'lobar');
  ensureBool(req.flow_reduced, 'flow_reduced');
  ensureBool(req.recovery, 'recovery');
  ensureBool(req.toxicity, 'toxicity');
  let plan;
  if(req.toxicity) plan='continue_with_review_then_reassess';
  else if(req.flow_reduced===false) plan='continue_with_review_then_reassess';
  else if(req.recovery===false) plan='continue_with_admit_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function y90(req){
  ensureNumber(req.dose_gbq, 'dose_gbq');
  ensureStr(req.lobe, 'lobe');
  ensureEnum(req.lobe, 'lobe', ['right','left','segment','lobar']);
  ensureBool(req.mapping_done, 'mapping_done');
  ensureBool(req.workup_complete, 'workup_complete');
  ensureBool(req.delivered, 'delivered');
  let plan;
  if(req.workup_complete===false) plan='continue_with_workup_then_reassess';
  else if(req.mapping_done===false) plan='continue_with_mapping_then_reassess';
  else if(req.delivered===false) plan='continue_with_deliver_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cryo(req){
  ensureStr(req.target, 'target');
  ensureEnum(req.target, 'target', ['kidney','lung','liver','bone','prostate','breast','skin','other']);
  ensureBool(req.probes_used, 'probes_used');
  ensureNumber(req.freeze_minutes, 'freeze_minutes');
  ensureNumber(req.thaw_minutes, 'thaw_minutes');
  ensureBool(req.successful, 'successful');
  ensureBool(req.iceball_coverage, 'iceball_coverage');
  let plan;
  if(req.successful===false) plan='continue_with_repeat_then_reassess';
  else if(req.iceball_coverage===false) plan='continue_with_more_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function irev(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['nanoknife','irreversible_electroporation','reversible','none','other']);
  ensureBool(req.successful, 'successful');
  ensureBool(req.cardiac_synced, 'cardiac_synced');
  ensureBool(req.complications, 'complications');
  ensureBool(req.followup_imaging, 'followup_imaging');
  let plan;
  if(req.successful===false) plan='continue_with_review_then_reassess';
  else if(req.cardiac_synced===false && req.type!=='nanoknife') plan='continue_with_sync_then_reassess';
  else if(req.followup_imaging===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.post_abl_syndrome, 'post_abl_syndrome');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.infection, 'infection');
  ensureBool(req.bowel_injury, 'bowel_injury');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.bowel_injury && req.managed===false) plan='continue_with_surgery_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_angiography_then_reassess';
  else if(req.post_abl_syndrome) plan='continue_with_steroid_then_reassess';
  else if(req.infection) plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {ablation,tace,y90,cryo,irev,complications};}
module.exports={funcs,CITATIONS,ValidationError};