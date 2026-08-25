// filepath: tier5_radonc_ext_104_tox_engine.js
// TIER5_RADIONC_EXT-104: Toxicity management
'use strict';
const CITATIONS = ['CTCAE_v5','ASTRO_Tox_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function grade(req){
  ensureStr(req.ctcae, 'ctcae');
  ensureStr(req.organ, 'organ');
  ensureEnum(req.organ, 'organ', ['skin','mucositis','esophagitis','proctitis','cystitis','pneumonitis','cardiac','cns','bone_marrow','liver','kidney','gi','other']);
  ensureNumber(req.grade_num, 'grade_num');
  ensureBool(req.intervention, 'intervention');
  ensureBool(req.treatment_held, 'treatment_held');
  ensureBool(req.symptoms, 'symptoms');
  let plan;
  if(req.grade_num>=3 && req.treatment_held===false) plan='continue_with_hold_then_reassess';
  else if(req.grade_num>=3) plan='continue_with_treat_then_reassess';
  else if(req.intervention===false && req.grade_num>=2) plan='continue_with_treat_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function skin(req){
  ensureStr(req.grade, 'grade');
  ensureEnum(req.grade, 'grade', ['0','1','2','3','4']);
  ensureBool(req.desquamation, 'desquamation');
  ensureBool(req.wound_care, 'wound_care');
  ensureBool(req.dressing, 'dressing');
  ensureBool(req.pain_control, 'pain_control');
  let plan;
  if(req.grade==='3' || req.grade==='4') plan='continue_with_hold_then_reassess';
  else if(req.wound_care===false) plan='continue_with_care_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function mucositis(req){
  ensureBool(req.grade_3, 'grade_3');
  ensureBool(req.tube_feeding, 'tube_feeding');
  ensureBool(req.iv_fluids, 'iv_fluids');
  ensureBool(req.nystatin, 'nystatin');
  ensureBool(req.pain_control, 'pain_control');
  ensureBool(req.dose_modified, 'dose_modified');
  let plan;
  if(req.grade_3 && req.dose_modified===false) plan='continue_with_modify_then_reassess';
  else if(req.tube_feeding===false && req.grade_3) plan='continue_with_tube_then_reassess';
  else if(req.pain_control===false) plan='continue_with_pain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pneumonitis(req){
  ensureBool(req.symptoms, 'symptoms');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.oxygen, 'oxygen');
  ensureBool(req.steroid, 'steroid');
  ensureBool(req.treatment_held, 'treatment_held');
  ensureBool(req.antibiotics, 'antibiotics');
  let plan;
  if(req.oxygen && req.treatment_held===false) plan='continue_with_hold_then_reassess';
  else if(req.steroid===false) plan='continue_with_steroid_then_reassess';
  else if(req.antibiotics===false) plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function late(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['fibrosis','necrosis','stricture','cystitis','proctitis','lymphedema','xerosomia','xerostomia','second_malignancy','cognitive','other','unknown']);
  ensureNumber(req.months_since, 'months_since');
  ensureBool(req.progressive, 'progressive');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.symptom_management, 'symptom_management');
  let plan;
  if(req.type==='necrosis') plan='continue_with_review_then_reassess';
  else if(req.progressive) plan='continue_with_review_then_reassess';
  else if(req.imaging===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.tolerable, 'tolerable');
  ensureBool(req.qol, 'qol');
  ensureBool(req.function, 'function');
  ensureBool(req.medications, 'medications');
  ensureBool(req.psychosocial, 'psychosocial');
  ensureBool(req.survivorship, 'survivorship');
  let plan;
  if(req.qol===false) plan='continue_with_review_then_reassess';
  else if(req.function===false) plan='continue_with_rehab_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {grade,skin,mucositis,pneumonitis,late,followup};}
module.exports={funcs,CITATIONS,ValidationError};