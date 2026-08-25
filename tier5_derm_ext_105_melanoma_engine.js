// filepath: tier5_derm_ext_105_melanoma_engine.js
// TIER5_DERM_EXT-105: Melanoma & skin cancer
'use strict';
const CITATIONS = ['NCCN_Melanoma_2020','AAD_Melanoma_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function biopsy(req){
  ensureStr(req.method, 'method');
  ensureEnum(req.method, 'method', ['excisional','incisional','punch','shave','saucerization','none','other']);
  ensureBool(req.full_thickness, 'full_thickness');
  ensureBool(req.margin, 'margin');
  ensureBool(req.lesion_oriented, 'lesion_oriented');
  ensureBool(req.sent_to_path, 'sent_to_path');
  let plan;
  if(req.method==='shave' && req.full_thickness===false) plan='continue_with_excision_then_reassess';
  else if(req.margin===false) plan='continue_with_margin_then_reassess';
  else if(req.sent_to_path===false) plan='continue_with_path_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pathology(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['in_situ','lentigo_maligna','thin','intermediate','thick','nodular','acral','desmoplastic','other','unknown']);
  ensureNumber(req.breslow, 'breslow');
  ensureNumber(req.clark, 'clark');
  ensureNumber(req.mitoses, 'mitoses');
  ensureBool(req.ulceration, 'ulceration');
  ensureBool(req.regression, 'regression');
  let plan;
  if(req.breslow>=1 && req.ulceration) plan='continue_with_sln_then_reassess';
  else if(req.breslow>=0.8 && req.ulceration) plan='continue_with_sln_then_reassess';
  else if(req.breslow<0.8 && req.ulceration===false) plan='continue_with_wle_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function staging(req){
  ensureStr(req.t, 't');
  ensureEnum(req.t, 't', ['t0','tis','t1a','t1b','t2a','t2b','t3a','t3b','t4a','t4b','tx']);
  ensureStr(req.n, 'n');
  ensureEnum(req.n, 'n', ['n0','n1a','n1b','n2a','n2b','n2c','n3','nx']);
  ensureStr(req.m, 'm');
  ensureEnum(req.m, 'm', ['m0','m1a','m1b','m1c','m1d','mx']);
  ensureBool(req.sln_done, 'sln_done');
  ensureBool(req.imaging, 'imaging');
  let plan;
  if(req.t==='t1b' && req.sln_done===false) plan='continue_with_sln_then_reassess';
  else if(req.imaging===false && req.t!=='tis') plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function surgery(req){
  ensureNumber(req.wle_margin, 'wle_margin');
  ensureBool(req.sln_done, 'sln_done');
  ensureBool(req.sln_positive, 'sln_positive');
  ensureBool(req.completion, 'completion');
  ensureBool(req.complications, 'complications');
  ensureBool(req.flap, 'flap');
  let plan;
  if(req.sln_positive && req.completion===false) plan='continue_with_completion_then_reassess';
  else if(req.complications) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function systemic(req){
  ensureBool(req.adjuvant, 'adjuvant');
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['nivolumab','pembrolizumab','dabrafenib_trametinib','none','other','unknown']);
  ensureBool(req.braf_tested, 'braf_tested');
  ensureBool(req.adverse, 'adverse');
  ensureBool(req.responded, 'responded');
  let plan;
  if(req.adjuvant && req.braf_tested===false) plan='continue_with_braf_then_reassess';
  else if(req.adverse) plan='continue_with_review_then_reassess';
  else if(req.responded===false) plan='continue_with_switch_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureNumber(req.months, 'months');
  ensureBool(req.recurrence, 'recurrence');
  ensureBool(req.skin_exam, 'skin_exam');
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.lymph_nodes, 'lymph_nodes');
  ensureBool(req.family_screening, 'family_screening');
  let plan;
  if(req.recurrence) plan='continue_with_refer_then_reassess';
  else if(req.skin_exam===false) plan='continue_with_exam_then_reassess';
  else if(req.lymph_nodes===false) plan='continue_with_exam_then_reassess';
  else if(req.imaging===false && req.months>3) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {biopsy,pathology,staging,surgery,systemic,followup};}
module.exports={funcs,CITATIONS,ValidationError};