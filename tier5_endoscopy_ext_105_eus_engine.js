// filepath: tier5_endoscopy_ext_105_eus_engine.js
// TIER5_ENDOSCOPY_EXT-105: Endoscopic ultrasound (EUS)
'use strict';
const CITATIONS = ['ASGE_EUS_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indications(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['mass_staging','subepithelial_lesion','bile_duct_eval','cystic_lesion','chronic_pancreatitis','fna','therapeutic_drainage','eus_biopsy','fistula','other']);
  ensureBool(req.cross_section_done, 'cross_section_done');
  ensureBool(req.alternative, 'alternative');
  let plan;
  if(req.indication==='fna') plan='continue_with_fna_then_reassess';
  else if(req.cross_section_done===false) plan='continue_with_ct_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function staging(req){
  ensureStr(req.t_stage, 't_stage');
  ensureEnum(req.t_stage, 't_stage', ['t0','t1a','t1b','t1c','t2','t3','t4a','t4b','tx']);
  ensureStr(req.n_stage, 'n_stage');
  ensureEnum(req.n_stage, 'n_stage', ['n0','n1','n2','n3','nx']);
  ensureStr(req.m_stage, 'm_stage');
  ensureEnum(req.m_stage, 'm_stage', ['m0','m1a','m1b','m1c','mx']);
  ensureBool(req.fna_performed, 'fna_performed');
  ensureBool(req.compared_ct, 'compared_ct');
  let plan;
  if(req.t_stage==='t4b' && req.fna_performed===false) plan='continue_with_fna_then_reassess';
  else if(req.compared_ct===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fna(req){
  ensureNumber(req.passes, 'passes');
  ensureBool(req.adequate, 'adequate');
  ensureBool(req.cytologist_present, 'cytologist_present');
  ensureBool(req.rosm, 'rosm');
  ensureBool(req.rapid_onsite, 'rapid_onsite');
  let plan;
  if(req.adequate===false && req.passes>=7) plan='continue_with_repeat_then_reassess';
  else if(req.cytologist_present===false && req.rapid_onsite===false) plan='continue_with_rapid_then_reassess';
  else if(req.adequate===false) plan='continue_with_more_passes_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cyst(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['ipmn','mcn','serous','pseudocyst','solid_cystic','unclassified','none']);
  ensureBool(req.worrisome, 'worrisome');
  ensureBool(req.high_risk, 'high_risk');
  ensureBool(req.fluid_cea, 'fluid_cea');
  ensureBool(req.fna_done, 'fna_done');
  let plan;
  if(req.high_risk) plan='continue_with_surgery_then_reassess';
  else if(req.worrisome && req.fna_done===false) plan='continue_with_fna_then_reassess';
  else if(req.fluid_cea===false) plan='continue_with_cea_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function therapy(req){
  ensureBool(req.drainage, 'drainage');
  ensureBool(req.pseudocyst_drainage, 'pseudocyst_drainage');
  ensureBool(req.celiac_plexus, 'celiac_plexus');
  ensureBool(req.stent_placement, 'stent_placement');
  ensureBool(req.success, 'success');
  let plan;
  if(req.success===false) plan='continue_with_alternative_then_reassess';
  else if(req.stent_placement && req.success) plan='continue_with_observation_then_reassess';
  else if(req.drainage && req.success) plan='continue_with_observation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.pancreatitis, 'pancreatitis');
  ensureBool(req.aspiration, 'aspiration');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.perforation) plan='continue_with_surgery_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_treat_then_reassess';
  else if(req.pancreatitis) plan='continue_with_treat_then_reassess';
  else if(req.aspiration) plan='continue_with_aspiration_protocol_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indications,staging,fna,cyst,therapy,complications};}
module.exports={funcs,CITATIONS,ValidationError};