// filepath: tier5_lab_adv_ext_102_molpath_engine.js
// TIER5_LAB_ADV_EXT-102: Molecular pathology (PCR, NGS, FISH, cytogenetics)
'use strict';
const CITATIONS = ['AMP_Mol_Path_2020','CAP_NGS_2019','ISCN_Cytogenetics_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pcr_result(req){
  ensureStr(req.target, 'target');
  ensureStr(req.result, 'result');
  ensureEnum(req.result, 'result', ['detected','not_detected','indeterminate','invalid','borderline']);
  ensureNumber(req.ct_value, 'ct_value');
  ensureBool(req.repeat_needed, 'repeat_needed');
  ensureBool(req.contamination_suspected, 'contamination_suspected');
  let plan;
  if(req.contamination_suspected) plan='continue_with_repeat_then_reassess';
  else if(req.result==='detected' && req.ct_value<25) plan='high_load_then_refer_clinical';
  else if(req.result==='detected') plan='continue_with_treatment_then_reassess';
  else if(req.result==='indeterminate' || req.result==='invalid') plan='continue_with_repeat_test_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ngs_panel(req){
  ensureStr(req.panel, 'panel');
  ensureEnum(req.panel, 'panel', ['solid_tumor','liquid_biopsy','myeloid','lymphoid','hereditary_cancer','germline','rna_seq','whole_exome','whole_genome']);
  ensureNumber(req.mutations_found, 'mutations_found');
  ensureStr(req.clinical_significance, 'clinical_significance');
  ensureEnum(req.clinical_significance, 'clinical_significance', ['pathogenic','likely_pathogenic','vus','likely_benign','benign']);
  ensureBool(req.tumor_only, 'tumor_only');
  let plan;
  if(req.clinical_significance==='pathogenic' || req.clinical_significance==='likely_pathogenic') plan='continue_with_targeted_review_then_refer_mol_tumor_board';
  else if(req.clinical_significance==='vus') plan='continue_with_review_then_mol_tumor_board';
  else plan='continue_with_routine_reporting';
  if(req.tumor_only) plan+='_consider_germline_follow_up';
  return {plan};
}
function fish(req){
  ensureStr(req.target_probe, 'target_probe');
  ensureEnum(req.target_probe, 'target_probe', ['alk','ros1','her2_erbb2','met','fgfr1','fgfr2','fgfr3','1p19q','myc','bcl2','bcl6','syt','tfe3','fkhr_foxo1']);
  ensureStr(req.result, 'result');
  ensureEnum(req.result, 'result', ['positive','negative','equivocal','failed','pending']);
  ensureNumber(req.cells_count, 'cells_count');
  ensureNumber(req.positive_pct, 'positive_pct');
  let plan;
  if(req.result==='positive' && req.positive_pct>=15) plan='continue_with_targeted_therapy_review';
  else if(req.result==='equivocal') plan='continue_with_repeat_then_reassess';
  else if(req.result==='failed') plan='continue_with_repeat_assay';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cytogenetics(req){
  ensureNumber(req.karyotype_count, 'karyotype_count');
  ensureBool(req.clonal_abnormality, 'clonal_abnormality');
  ensureStr(req.abnormality, 'abnormality');
  ensureBool(req.mosaicism, 'mosaicism');
  ensureBool(req.acquired_rearrangement, 'acquired_rearrangement');
  let plan;
  if(req.clonal_abnormality && req.mosaicism) plan='continue_with_refer_genetic_counsel_with_reassess';
  else if(req.clonal_abnormality && req.acquired_rearrangement) plan='continue_with_refer_hematology';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fish_lymphoma(req){
  ensureStr(req.panel, 'panel');
  ensureEnum(req.panel, 'panel', ['myc','bcl2','bcl6','ccnd1','ccnd2','myc_bcl2','myc_bcl6','malt1','api2_malt1']);
  ensureBool(req.double_hit, 'double_hit');
  ensureBool(req.triple_hit, 'triple_hit');
  ensureBool(req.double_expressor, 'double_expressor');
  ensureBool(req.translocation_partner, 'translocation_partner');
  let plan;
  if(req.triple_hit) plan='high_grade_then_aggressive_treatment';
  else if(req.double_hit) plan='double_hit_then_review_aggressive_protocol';
  else if(req.double_expressor) plan='continue_with_standard_chemo_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ihc_panel(req){
  ensureStr(req.antibody, 'antibody');
  ensureEnum(req.antibody, 'antibody', ['cd20','cd3','cd45','ki67','pdl1_22c3','pdl1_sp142','pdl1_sp263','msh2','msh6','mlh1','pms2','her2','er','pr','cmet','alk_d5f3','ros1_d4d6','pd1']);
  ensureStr(req.intensity, 'intensity');
  ensureEnum(req.intensity, 'intensity', ['negative','weak_1_plus','moderate_2_plus','strong_3_plus','tps_under_1','tps_1_to_49','tps_50_or_more','cps_under_10','cps_10_or_more']);
  let plan;
  if(req.antibody.startsWith('pdl1') && req.intensity==='tps_50_or_more') plan='continue_with_pdl1_high_then_candidate_immunotherapy';
  else if(req.antibody.startsWith('pdl1')) plan='continue_with_reporting_then_reassess';
  else if(req.antibody==='her2' && req.intensity==='strong_3_plus') plan='continue_with_targeted_therapy';
  else plan='continue_with_reporting_then_reassess';
  return {plan};
}
function funcs(){return {pcr_result,ngs_panel,fish,cytogenetics,fish_lymphoma,ihc_panel};}
module.exports={funcs,CITATIONS,ValidationError};
