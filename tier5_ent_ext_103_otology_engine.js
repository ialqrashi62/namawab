// filepath: tier5_ent_ext_103_otology_engine.js
// TIER5_ENT_EXT-103: Otology & hearing
'use strict';
const CITATIONS = ['AAO_Hearing_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function hearing_aid(req){
  ensureNumber(req.pta_od, 'pta_od');
  ensureNumber(req.pta_os, 'pta_os');
  ensureStr(req.ear, 'ear');
  ensureEnum(req.ear, 'ear', ['od','os','both','unknown']);
  ensureBool(req.candidate, 'candidate');
  ensureBool(req.fitted, 'fitted');
  ensureBool(req.benefit, 'benefit');
  let plan;
  if(req.candidate===false) plan='continue_with_review_then_reassess';
  else if(req.fitted===false) plan='continue_with_fit_then_reassess';
  else if(req.benefit===false) plan='continue_with_recheck_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function otitis_media(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['acute','serous','chronic','suppurative','none','other']);
  ensureBool(req.bilateral, 'bilateral');
  ensureBool(req.tubes_needed, 'tubes_needed');
  ensureBool(req.antibiotics, 'antibiotics');
  ensureBool(req.fluid_persistent, 'fluid_persistent');
  let plan;
  if(req.type==='acute' && req.antibiotics===false) plan='continue_with_antibiotics_then_reassess';
  else if(req.fluid_persistent && req.tubes_needed===false) plan='continue_with_tubes_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function otitis_ext(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['bacterial','fungal','swimmers','malignant','none','other']);
  ensureBool(req.immunocompromised, 'immunocompromised');
  ensureBool(req.culture, 'culture');
  ensureBool(req.drops_started, 'drops_started');
  ensureBool(req.imaging, 'imaging');
  let plan;
  if(req.type==='malignant' && req.imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.culture===false) plan='continue_with_culture_then_reassess';
  else if(req.drops_started===false) plan='continue_with_drops_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cholesteatoma(req){
  ensureBool(req.suspected, 'suspected');
  ensureBool(req.otoscopy_done, 'otoscopy_done');
  ensureBool(req.ears_present, 'ears_present');
  ensureBool(req.ct_done, 'ct_done');
  ensureBool(req.surgery_planned, 'surgery_planned');
  ensureBool(req.fu_scheduled, 'fu_scheduled');
  let plan;
  if(req.suspected && req.ct_done===false) plan='continue_with_ct_then_reassess';
  else if(req.surgery_planned===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tinnitus(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['subjective','objective','pulsatile','musical','none','other']);
  ensureBool(req.workup, 'workup');
  ensureBool(req.cause_found, 'cause_found');
  ensureBool(req.therapy_offered, 'therapy_offered');
  ensureBool(req.distressing, 'distressing');
  let plan;
  if(req.type==='pulsatile' && req.workup===false) plan='continue_with_workup_then_reassess';
  else if(req.distressing && req.therapy_offered===false) plan='continue_with_therapy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cochlear(req){
  ensureBool(req.candidate, 'candidate');
  ensureBool(req.workup, 'workup');
  ensureBool(req.imaging_done, 'imaging_done');
  ensureBool(req.surgery_done, 'surgery_done');
  ensureBool(req.activated, 'activated');
  ensureBool(req.rehab, 'rehab');
  let plan;
  if(req.candidate && req.workup===false) plan='continue_with_workup_then_reassess';
  else if(req.surgery_done && req.activated===false) plan='continue_with_activate_then_reassess';
  else if(req.activated && req.rehab===false) plan='continue_with_rehab_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {hearing_aid,otitis_media,otitis_ext,cholesteatoma,tinnitus,cochlear};}
module.exports={funcs,CITATIONS,ValidationError};