// filepath: tier5_lab_adv_ext_106_anapath_engine.js
// TIER5_LAB_ADV_EXT-106: Anatomic pathology (biopsy gross, frozen, IHC, molecular)
'use strict';
const CITATIONS = ['CAP_Anatomic_2020','RCPath_Grossing_2018','AJCC_Staging_8th'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function biopsy_gross(req){
  ensureStr(req.specimen_type, 'specimen_type');
  ensureEnum(req.specimen_type, 'specimen_type', ['core_needle','excisional','incisional','endoscopic','brushings','cnb','shave','punch','cone','loop']);
  ensureNumber(req.size_cm, 'size_cm');
  ensureNumber(req.tissue_fragments_count, 'tissue_fragments_count');
  ensureBool(req.inked, 'inked');
  ensureBool(req.cassettes_count, 'cassettes_count');
  let plan;
  if(req.tissue_fragments_count>=1 && req.cassettes_count>=1) plan='continue_with_sectioning_then_processing';
  else plan='continue_with_review_then_reassess';
  return {plan};
}
function frozen_section(req){
  ensureStr(req.site, 'site');
  ensureEnum(req.site, 'site', ['breast','thyroid','lymph_node','liver','pancreas','brain','lung','skin','margin_assessment','parathyroid']);
  ensureBool(req.malignancy_suspected, 'malignancy_suspected');
  ensureBool(req.margin_evaluation, 'margin_evaluation');
  ensureNumber(req.cryostat_quality, 'cryostat_quality');
  ensureBool(req.representative_tissue, 'representative_tissue');
  let plan;
  if(!req.representative_tissue) plan='continue_with_re_submit_then_reassess';
  else if(req.margin_evaluation) plan='continue_with_immediate_then_report';
  else plan='continue_with_immediate_then_report';
  return {plan};
}
function tumor_grading(req){
  ensureStr(req.tumor_type, 'tumor_type');
  ensureEnum(req.tumor_type, 'tumor_type', ['breast_idc','breast_ilc','prostate_adenocarcinoma','colon_adenocarcinoma','lung_nsclc','lung_sclc','renal_clear_cell','hepatocellular','pancreatic_ductal','bladder','thyroid_papillary','thyroid_follicular','endometrial','cervical_scc','ovarian_serous','glioma_low','glioma_high','sarcoma_general','lymphoma_diffuse_large_bcell']);
  ensureStr(req.grade, 'grade');
  ensureEnum(req.grade, 'grade', ['grade_1','grade_2','grade_3','grade_4','gx','low_grade','intermediate_grade','high_grade','gleason_6','gleason_7','gleason_8','gleason_9','gleason_10','fuhrman_1','fuhrman_2','fuhrman_3','fuhrman_4','nottingham_1','nottingham_2','nottingham_3','isup_low','isup_intermediate','isup_high']);
  let plan;
  if(req.grade==='grade_3' || req.grade==='grade_4' || req.grade==='high_grade') plan='continue_with_high_grade_then_refer_oncology';
  else if(req.grade==='grade_2' || req.grade==='intermediate_grade') plan='continue_with_intermediate_then_refer';
  else plan='continue_with_low_grade_then_observation';
  return {plan};
}
function staging(req){
  ensureStr(req.tumor, 'tumor');
  ensureStr(req.t_stage, 't_stage');
  ensureStr(req.n_stage, 'n_stage');
  ensureStr(req.m_stage, 'm_stage');
  ensureBool(req.margins_clear, 'margins_clear');
  ensureBool(req.lvi, 'lvi');
  let plan;
  if(req.margins_clear===false) plan='continue_with_re_excision_then_reassess';
  else if(req.lvi) plan='continue_with_adjuvant_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cytology(req){
  ensureStr(req.specimen, 'specimen');
  ensureEnum(req.specimen, 'specimen', ['thyroid_fna','lymph_node_fna','salivary_fna','breast_fna','pancreas_fna','liver_fna','lung_fna','effusion_pleural','effusion_peritoneal','urine','cervical_pap','csf']);
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['non_diagnostic','benign','atypia_of_undetermined_significance','follicular_neoplasm','suspicious_for_malignancy','malignant','negative_for_malignancy','positive_for_malignancy','unsatisfactory']);
  ensureBool(req.cell_block_prepared, 'cell_block_prepared');
  ensureBool(req.ancillary_testing_done, 'ancillary_testing_done');
  let plan;
  if(req.diagnosis==='malignant' || req.diagnosis==='positive_for_malignancy') plan='continue_with_refer_oncology_with_imaging';
  else if(req.diagnosis==='non_diagnostic' || req.diagnosis==='unsatisfactory') plan='continue_with_repeat_then_reassess';
  else if(req.diagnosis==='atypia_of_undetermined_significance') plan='continue_with_molecular_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function special_stain(req){
  ensureStr(req.stain, 'stain');
  ensureEnum(req.stain, 'stain', ['gram','gms','afb','pas','dpas','trichrome','congo_red','elastin','iron_prussian','reticulin','toluidine_blue','oil_red_o','mucicarmine']);
  ensureStr(req.result, 'result');
  ensureEnum(req.result, 'result', ['positive','negative','equivocal','failed','pending']);
  ensureBool(req.organism_identified, 'organism_identified');
  ensureBool(req.substance_identified, 'substance_identified');
  let plan;
  if(req.organism_identified) plan='continue_with_correlation_then_refer_id';
  else if(req.substance_identified) plan='continue_with_correlation_then_refer_specialty';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {biopsy_gross,frozen_section,tumor_grading,staging,cytology,special_stain};}
module.exports={funcs,CITATIONS,ValidationError};
