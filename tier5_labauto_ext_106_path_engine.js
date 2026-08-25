// filepath: tier5_labauto_ext_106_path_engine.js
// TIER5_LAB_AUTOMATION_EXT-106: Anatomical pathology
'use strict';
const CITATIONS = ['CAP_AnatPath_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function gross(req){
  ensureStr(req.specimen, 'specimen');
  ensureEnum(req.specimen, 'specimen', ['biopsy','resection','cytology','fluid','bone_marrow','tissue_block','other']);
  ensureNumber(req.dimensions, 'dimensions');
  ensureBool(req.photographed, 'photographed');
  ensureBool(req.sectioned, 'sectioned');
  ensureNumber(req.cassettes_count, 'cassettes_count');
  let plan;
  if(req.sectioned===false) plan='continue_with_section_then_reassess';
  else if(req.photographed===false) plan='continue_with_photo_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function processing(req){
  ensureBool(req.fixed, 'fixed');
  ensureBool(req.processed, 'processed');
  ensureBool(req.embedded, 'embedded');
  ensureBool(req.sectioned, 'sectioned');
  ensureBool(req.stained, 'stained');
  ensureBool(req.coverslipped, 'coverslipped');
  let plan;
  if(req.fixed===false) plan='continue_with_fix_then_reassess';
  else if(req.stained===false) plan='continue_with_stain_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function diagnosis(req){
  ensureBool(req.microscopy_done, 'microscopy_done');
  ensureStr(req.diagnosis_category, 'diagnosis_category');
  ensureEnum(req.diagnosis_category, 'diagnosis_category', ['benign','malignant','atypical','suspicious','inconclusive','normal','other']);
  ensureBool(req.special_stains, 'special_stains');
  ensureBool(req.ihc_done, 'ihc_done');
  ensureBool(req.report_signed, 'report_signed');
  let plan;
  if(req.diagnosis_category==='malignant' && req.report_signed===false) plan='continue_with_sign_then_reassess';
  else if(req.special_stains===false && req.diagnosis_category==='inconclusive') plan='continue_with_stains_then_reassess';
  else if(req.ihc_done===false) plan='continue_with_ihc_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function frozen(req){
  ensureBool(req.requested, 'requested');
  ensureBool(req.performed, 'performed');
  ensureBool(req.margin_assessed, 'margin_assessed');
  ensureBool(req.diagnosed, 'diagnosed');
  ensureBool(req.communicated, 'communicated');
  ensureBool(req.concordance, 'concordance');
  let plan;
  if(req.requested && req.communicated===false) plan='continue_with_communicate_then_reassess';
  else if(req.performed===false) plan='continue_with_perform_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ihc(req){
  ensureStr(req.stain, 'stain');
  ensureEnum(req.stain, 'stain', ['er','pr','her2','ki67','pdl1','cd20','cd3','s100','ck7','ck20','other','none']);
  ensureBool(req.positive, 'positive');
  ensureBool(req.negative_control, 'negative_control');
  ensureBool(req.positive_control, 'positive_control');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.negative_control===false) plan='continue_with_nc_then_reassess';
  else if(req.positive_control===false) plan='continue_with_pc_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function quality(req){
  ensureNumber(req.tat_days, 'tat_days');
  ensureBool(req.within_tat, 'within_tat');
  ensureBool(req.proficiency, 'proficiency');
  ensureBool(req.qc_reviewed, 'qc_reviewed');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.within_tat===false) plan='continue_with_escalate_then_reassess';
  else if(req.qc_reviewed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {gross,processing,diagnosis,frozen,ihc,quality};}
module.exports={funcs,CITATIONS,ValidationError};