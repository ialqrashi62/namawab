// filepath: tier5_labauto_ext_103_hema_engine.js
// TIER5_LAB_AUTOMATION_EXT-103: Hematology automation
'use strict';
const CITATIONS = ['ICSH_Hematology_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cbc(req){
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.wbc, 'wbc');
  ensureNumber(req.plt, 'plt');
  ensureBool(req.analyzed, 'analyzed');
  ensureBool(req.flagged, 'flagged');
  ensureBool(req.reviewed, 'reviewed');
  let plan;
  if(req.flagged && req.reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function smear(req){
  ensureBool(req.smear_reviewed, 'smear_reviewed');
  ensureBool(req.differential_done, 'differential_done');
  ensureBool(req.abnormal_cells, 'abnormal_cells');
  ensureBool(req.pathologist_review, 'pathologist_review');
  ensureBool(req.released, 'released');
  let plan;
  if(req.abnormal_cells && req.pathologist_review===false) plan='continue_with_path_review_then_reassess';
  else if(req.differential_done===false) plan='continue_with_differential_then_reassess';
  else if(req.released===false) plan='continue_with_release_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function coag(req){
  ensureNumber(req.pt, 'pt');
  ensureNumber(req.inr, 'inr');
  ensureNumber(req.ptt, 'ptt');
  ensureNumber(req.fibrinogen, 'fibrinogen');
  ensureBool(req.dvt_workup, 'dvt_workup');
  ensureBool(req.anticoag_monitored, 'anticoag_monitored');
  let plan;
  if(req.inr>5) plan='continue_with_urgent_then_reassess';
  else if(req.anticoag_monitored===false) plan='continue_with_monitor_then_reassess';
  else if(req.dvt_workup===false) plan='continue_with_workup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function esr(req){
  ensureNumber(req.esr_value, 'esr_value');
  ensureStr(req.unit, 'unit');
  ensureEnum(req.unit, 'unit', ['mm_hr','mm_2hr','other']);
  ensureBool(req.crp_correlated, 'crp_correlated');
  ensureBool(req.clinical_relevant, 'clinical_relevant');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.crp_correlated===false) plan='continue_with_crp_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function blood_bank(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['type_screen','crossmatch','ab_id','ab_screen','ab_elution','none']);
  ensureBool(req.ab_id_complete, 'ab_id_complete');
  ensureBool(req.two_technologists, 'two_technologists');
  ensureBool(req.computer_crossmatch, 'computer_crossmatch');
  ensureBool(req.unit_released, 'unit_released');
  let plan;
  if(req.type==='crossmatch' && req.two_technologists===false) plan='continue_with_two_tech_then_reassess';
  else if(req.ab_id_complete===false) plan='continue_with_complete_then_reassess';
  else if(req.unit_released===false) plan='continue_with_release_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function hema_quality(req){
  ensureBool(req.calibrated, 'calibrated');
  ensureBool(req.qc_passed, 'qc_passed');
  ensureBool(req.three_levels, 'three_levels');
  ensureBool(req.proficiency, 'proficiency');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.calibrated===false) plan='continue_with_calibrate_then_reassess';
  else if(req.qc_passed===false) plan='continue_with_qc_then_reassess';
  else if(req.three_levels===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {cbc,smear,coag,esr,blood_bank,hema_quality};}
module.exports={funcs,CITATIONS,ValidationError};