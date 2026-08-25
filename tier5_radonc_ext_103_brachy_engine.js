// filepath: tier5_radonc_ext_103_brachy_engine.js
// TIER5_RADIONC_EXT-103: Brachytherapy
'use strict';
const CITATIONS = ['ABS_Brachy_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.site, 'site');
  ensureEnum(req.site, 'site', ['prostate','breast','cervix','endometrium','vaginal','head_neck','sarcoma','skin','lung','esophagus','bile_duct','brain','eye','other']);
  ensureStr(req.technique, 'technique');
  ensureEnum(req.technique, 'technique', ['hdr','pdr','ldr','perman_seed','electronic','none','other']);
  ensureBool(req.candidate, 'candidate');
  ensureBool(req.imaging_done, 'imaging_done');
  ensureBool(req.dose_prescribed, 'dose_prescribed');
  let plan;
  if(req.candidate===false) plan='continue_with_review_then_reassess';
  else if(req.dose_prescribed===false) plan='continue_with_dose_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function planning(req){
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.contoured, 'contoured');
  ensureBool(req.dose_calc, 'dose_calc');
  ensureBool(req.plan_approved, 'plan_approved');
  ensureBool(req.qa_done, 'qa_done');
  ensureBool(req.plan_optimized, 'plan_optimized');
  let plan;
  if(req.plan_approved===false) plan='continue_with_review_then_reassess';
  else if(req.qa_done===false) plan='continue_with_qa_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function delivery(req){
  ensureBool(req.applicators, 'applicators');
  ensureBool(req.positioning, 'positioning');
  ensureBool(req.imaging_verification, 'imaging_verification');
  ensureBool(req.treatment_delivered, 'treatment_delivered');
  ensureBool(req.dose_correct, 'dose_correct');
  ensureBool(req.safety, 'safety');
  let plan;
  if(req.dose_correct===false) plan='continue_with_review_then_reassess';
  else if(req.imaging_verification===false) plan='continue_with_imaging_then_reassess';
  else if(req.safety===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function prostate(req){
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['hdr','ldr_seed','hdr_mono','pdr','none','other']);
  ensureNumber(req.seeds_count, 'seeds_count');
  ensureBool(req.dose_delivered, 'dose_delivered');
  ensureBool(req.psa_followup, 'psa_followup');
  ensureBool(req.urinary, 'urinary');
  ensureBool(req.bowel, 'bowel');
  let plan;
  if(req.dose_delivered===false) plan='continue_with_review_then_reassess';
  else if(req.urinary===false) plan='continue_with_review_then_reassess';
  else if(req.bowel===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cervix(req){
  ensureStr(req.modality, 'modality');
  ensureEnum(req.modality, 'modality', ['ic','ic_vaginal','ring','ovoid','tandem_ring','tandem_ovoid','cylinder','none','other']);
  ensureBool(req.applicator_placed, 'applicator_placed');
  ensureBool(req.treatment_delivered, 'treatment_delivered');
  ensureBool(req.organ_at_risk, 'organ_at_risk');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.applicator_placed===false) plan='continue_with_placement_then_reassess';
  else if(req.treatment_delivered===false) plan='continue_with_treat_then_reassess';
  else if(req.organ_at_risk===false) plan='continue_with_oar_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.stenosis, 'stenosis');
  ensureBool(req.fistula, 'fistula');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.tissue_breakdown, 'tissue_breakdown');
  ensureBool(req.managed, 'managed');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.fistula && req.managed===false) plan='continue_with_surgery_then_reassess';
  else if(req.stenosis) plan='continue_with_dilation_then_reassess';
  else if(req.tissue_breakdown) plan='continue_with_care_then_reassess';
  else if(req.followup===false) plan='continue_with_fu_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indication,planning,delivery,prostate,cervix,complications};}
module.exports={funcs,CITATIONS,ValidationError};