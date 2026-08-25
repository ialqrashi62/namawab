// filepath: tier5_labauto_ext_105_mol_engine.js
// TIER5_LAB_AUTOMATION_EXT-105: Molecular diagnostics
'use strict';
const CITATIONS = ['AMP_MolDx_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pcr(req){
  ensureStr(req.target, 'target');
  ensureEnum(req.target, 'target', ['covid','influenza','rsv','hiv','hcv','hbv','tb','mrsa','vre','c_diff','bcr_abl','other']);
  ensureBool(req.internal_control, 'internal_control');
  ensureBool(req.amplification, 'amplification');
  ensureBool(req.valid_run, 'valid_run');
  ensureBool(req.reported, 'reported');
  let plan;
  if(req.internal_control===false) plan='continue_with_repeat_then_reassess';
  else if(req.valid_run===false) plan='continue_with_repeat_then_reassess';
  else if(req.reported===false) plan='continue_with_report_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ngs(req){
  ensureStr(req.platform, 'platform');
  ensureEnum(req.platform, 'platform', ['illumina','ion_torrent','pacbio','nanopore','other']);
  ensureNumber(req.depth, 'depth');
  ensureNumber(req.coverage, 'coverage');
  ensureBool(req.qc_passed, 'qc_passed');
  ensureBool(req.aligned, 'aligned');
  ensureBool(req.variants_called, 'variants_called');
  let plan;
  if(req.depth<30) plan='continue_with_more_then_reassess';
  else if(req.qc_passed===false) plan='continue_with_review_then_reassess';
  else if(req.variants_called===false) plan='continue_with_calling_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fish(req){
  ensureStr(req.target, 'target');
  ensureEnum(req.target, 'target', ['her2','alk','myc','bcl2','bcl6','alk_break','ros1','met','fgfr','other']);
  ensureNumber(req.signal_count, 'signal_count');
  ensureNumber(req.cells_counted, 'cells_counted');
  ensureBool(req.interpreted, 'interpreted');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.cells_counted<200) plan='continue_with_more_then_reassess';
  else if(req.interpreted===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cytogenetics(req){
  ensureNumber(req.band_resolution, 'band_resolution');
  ensureNumber(req.metaphases_count, 'metaphases_count');
  ensureBool(req.karyotyped, 'karyotyped');
  ensureBool(req.abnormalities, 'abnormalities');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.band_resolution<400) plan='continue_with_more_then_reassess';
  else if(req.metaphases_count<20) plan='continue_with_more_then_reassess';
  else if(req.karyotyped===false) plan='continue_with_karyotype_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function reporting_mol(req){
  ensureBool(req.interp, 'interp');
  ensureBool(req.interpretive, 'interpretive');
  ensureBool(req.clinically_significant, 'clinically_significant');
  ensureBool(req.actionable, 'actionable');
  ensureBool(req.tat, 'tat');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.clinically_significant && req.documented===false) plan='continue_with_documentation_then_reassess';
  else if(req.actionable===false) plan='continue_with_review_then_reassess';
  else if(req.tat===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function qc_mol(req){
  ensureBool(req.no_template, 'no_template');
  ensureBool(req.positive_control, 'positive_control');
  ensureBool(req.negative_control, 'negative_control');
  ensureBool(req.amplicon_size, 'amplicon_size');
  ensureBool(req.contamination_assay, 'contamination_assay');
  let plan;
  if(req.no_template===false) plan='continue_with_ntc_then_reassess';
  else if(req.contamination_assay===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pcr,ngs,fish,cytogenetics,reporting_mol,qc_mol};}
module.exports={funcs,CITATIONS,ValidationError};