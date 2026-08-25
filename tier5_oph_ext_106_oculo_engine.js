// filepath: tier5_oph_ext_106_oculo_engine.js
// TIER5_OPHTHALMOLOGY_EXT-106: Oculoplastics & neuro-ophthalmology
'use strict';
const CITATIONS = ['AAO_Oculo_2018','NANOS_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function eyelid(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['ptosis','entropion','ectropion','chalazion','hordeolum','lid_laceration','blepharitis','masses','other','none']);
  ensureBool(req.visual_axis, 'visual_axis');
  ensureBool(req.surgery_planned, 'surgery_planned');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.visual_axis && req.surgery_planned===false) plan='continue_with_refer_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function orbit(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['proptosis','thyroid_eye','mass','fracture','inflammation','none','other']);
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.urgent, 'urgent');
  ensureBool(req.consulted, 'consulted');
  ensureBool(req.compressive, 'compressive');
  let plan;
  if(req.compressive) plan='continue_with_urgent_then_reassess';
  else if(req.imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.consulted===false) plan='continue_with_consult_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function lacrimal(req){
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['nasolacrimal_obstruction','dacryocystitis','canaliculitis','dry_eye','epiphora','none','other']);
  ensureBool(req.acute_infection, 'acute_infection');
  ensureBool(req.probing_planned, 'probing_planned');
  ensureBool(req.dcr_planned, 'dcr_planned');
  ensureBool(req.resolved, 'resolved');
  let plan;
  if(req.acute_infection && req.dcr_planned===false) plan='continue_with_treat_then_reassess';
  else if(req.resolved===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pupil(req){
  ensureStr(req.defect, 'defect');
  ensureEnum(req.defect, 'defect', ['rapd','adies','argyll_robertson','horners','aniscoria','iii_palsy','none','other']);
  ensureBool(req.mri_planned, 'mri_planned');
  ensureBool(req.mra_planned, 'mra_planned');
  ensureBool(req.documented, 'documented');
  ensureBool(req.referred, 'referred');
  let plan;
  if(req.defect==='iii_palsy' && req.mra_planned===false) plan='continue_with_mra_then_reassess';
  else if(req.referred===false) plan='continue_with_refer_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function optic_neuritis(req){
  ensureBool(req.painful, 'painful');
  ensureNumber(req.va, 'va');
  ensureBool(req.color_vision, 'color_vision');
  ensureBool(req.mri_done, 'mri_done');
  ensureBool(req.steroid_given, 'steroid_given');
  ensureBool(req.followup, 'followup');
  let plan;
  if(req.steroid_given===false) plan='continue_with_steroids_then_reassess';
  else if(req.mri_done===false) plan='continue_with_mri_then_reassess';
  else if(req.followup===false) plan='continue_with_followup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function papilledema(req){
  ensureNumber(req.opening_pressure, 'opening_pressure');
  ensureBool(req.lp_done, 'lp_done');
  ensureBool(req.imaging_done, 'imaging_done');
  ensureBool(req.mrv_done, 'mrv_done');
  ensureBool(req.referred, 'referred');
  let plan;
  if(req.lp_done===false) plan='continue_with_lp_then_reassess';
  else if(req.imaging_done===false) plan='continue_with_mri_then_reassess';
  else if(req.referred===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {eyelid,orbit,lacrimal,pupil,optic_neuritis,papilledema};}
module.exports={funcs,CITATIONS,ValidationError};