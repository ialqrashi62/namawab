// filepath: tier5_radonc_ext_102_srs_engine.js
// TIER5_RADIONC_EXT-102: SRS/SBRT
'use strict';
const CITATIONS = ['ASTRO_SRS_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indication(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['brain_met','primary_brain','lung_stage1','lung_oligo','liver_met','bone_met','spine','prostate','pancreas','renal','other']);
  ensureNumber(req.lesion_size_cm, 'lesion_size_cm');
  ensureNumber(req.lesion_count, 'lesion_count');
  ensureBool(req.systemic, 'systemic');
  ensureBool(req.mdt_review, 'mdt_review');
  let plan;
  if(req.lesion_size_cm>5 && req.type==='brain_met') plan='continue_with_wbrt_then_reassess';
  else if(req.mdt_review===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function planning(req){
  ensureBool(req.mri_done, 'mri_done');
  ensureBool(req.ct_sim, 'ct_sim');
  ensureStr(req.immobilization, 'immobilization');
  ensureEnum(req.immobilization, 'immobilization', ['frame','mask','vac_lock','body_fix','none','other']);
  ensureBool(req.contoured, 'contoured');
  ensureBool(req.qa_done, 'qa_done');
  ensureBool(req.ivd, 'ivd');
  let plan;
  if(req.contoured===false) plan='continue_with_contour_then_reassess';
  else if(req.mri_done===false && req.type==='brain_met') plan='continue_with_mri_then_reassess';
  else if(req.qa_done===false) plan='continue_with_qa_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dose(req){
  ensureNumber(req.prescription_dose, 'prescription_dose');
  ensureNumber(req.fractions, 'fractions');
  ensureStr(req.iso, 'iso');
  ensureEnum(req.iso, 'iso', ['idlc','idld','isocenter','gpr','none','other']);
  ensureBool(req.gradients, 'gradients');
  ensureBool(req.oar_constraints, 'oar_constraints');
  ensureBool(req.deliverable, 'deliverable');
  let plan;
  if(req.deliverable===false) plan='continue_with_revise_then_reassess';
  else if(req.oar_constraints===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function delivery(req){
  ensureBool(req.imaging_guided, 'imaging_guided');
  ensureBool(req.intrafraction, 'intrafraction');
  ensureBool(req['6d_couch'], '6d_couch');
  ensureBool(req.completed, 'completed');
  ensureBool(req.gating, 'gating');
  ensureBool(req.tracking, 'tracking');
  let plan;
  if(req.imaging_guided===false) plan='continue_with_imaging_then_reassess';
  else if(req.completed===false) plan='continue_with_complete_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function brain_met(req){
  ensureNumber(req.count, 'count');
  ensureNumber(req.largest_size, 'largest_size');
  ensureBool(req.gramal, 'gramal');
  ensureBool(req.ecog, 'ecog');
  ensureBool(req.extra_cranial, 'extra_cranial');
  ensureBool(req.laser_interstitial, 'laser_interstitial');
  let plan;
  if(req.ecog===false) plan='continue_with_assess_then_reassess';
  else if(req.extra_cranial && req.gramal===false) plan='continue_with_gramal_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureBool(req.radiation_necrosis, 'radiation_necrosis');
  ensureBool(req.imaging_followup, 'imaging_followup');
  ensureBool(req.recurrence, 'recurrence');
  ensureBool(req.symptoms, 'symptoms');
  ensureBool(req.steroid, 'steroid');
  ensureBool(req.cognitive, 'cognitive');
  let plan;
  if(req.radiation_necrosis) plan='continue_with_review_then_reassess';
  else if(req.recurrence) plan='continue_with_reinduction_then_reassess';
  else if(req.imaging_followup===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indication,planning,dose,delivery,brain_met,followup};}
module.exports={funcs,CITATIONS,ValidationError};