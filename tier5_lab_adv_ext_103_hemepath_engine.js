// filepath: tier5_lab_adv_ext_103_hemepath_engine.js
// TIER5_LAB_ADV_EXT-103: Hematopathology (BM, flow, lymph node, leukemia)
'use strict';
const CITATIONS = ['WHO_Hem_Malig_2022','CAP_Flow_2020','ELN_AML_2022'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function bm_biopsy(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['pancytopenia_workup','suspected_leukemia','lymphoma_staging','myeloma_workup','cytopenia_followup','post_chemotherapy_assessment','stem_cell_transplant_assessment']);
  ensureNumber(req.cellularity_pct, 'cellularity_pct');
  ensureBool(req.dysplastic_changes, 'dysplastic_changes');
  ensureBool(req.blasts_increased, 'blasts_increased');
  let plan;
  if(req.blasts_increased) plan='continue_with_refer_hematology_with_bm_biopsy';
  else if(req.dysplastic_changes) plan='continue_with_refer_hematology_with_review';
  else if(req.cellularity_pct<20 && req.indication==='pancytopenia_workup') plan='continue_with_refer_hematology_with_workup';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function flow_cytometry(req){
  ensureStr(req.panel, 'panel');
  ensureEnum(req.panel, 'panel', ['leukemia_lymphoma','pnp','tcell_subsets','bcell_subsets','nk_subsets','cd34_stem','minimal_residual_disease','paroxysmal_nocturnal_hemoglobinuria']);
  ensureBool(req.aberrant_population, 'aberrant_population');
  ensureNumber(req.aberrant_pct, 'aberrant_pct');
  ensureBool(req.mrd_detected, 'mrd_detected');
  let plan;
  if(req.aberrant_population) plan='continue_with_clinical_correlation_with_refer_hematology';
  else if(req.mrd_detected) plan='continue_with_refer_hematology_with_mrd_assessment';
  else plan='continue_with_reporting_then_reassess';
  return {plan};
}
function lymph_node(req){
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['cervical','axillary','mediastinal','mesenteric','retroperitoneal','pelvic','inguinal','supraclavicular','submental']);
  ensureNumber(req.size_cm, 'size_cm');
  ensureBool(req.recent_growth, 'recent_growth');
  ensureBool(req.b_symptoms, 'b_symptoms');
  ensureBool(req.excisional_biopsy, 'excisional_biopsy');
  let plan;
  if(req.recent_growth && req.b_symptoms) plan='continue_with_excisional_biopsy_then_refer';
  else if(req.excisional_biopsy===false && req.size_cm>=2) plan='continue_with_excisional_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function leukemia_classify(req){
  ensureStr(req.subtype, 'subtype');
  ensureEnum(req.subtype, 'subtype', ['aml','all','cll','cml','mds','mpn','mixed_phenotype_apl','biphenotypic','therapy_related']);
  ensureNumber(req.wbc, 'wbc');
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.plt, 'plt');
  ensureBool(req.blast_count_pct, 'blast_count_pct');
  let plan;
  if(req.subtype==='aml') plan='continue_with_urgent_refer_hematology_with_induction';
  else if(req.subtype==='all') plan='continue_with_urgent_refer_hematology_with_induction';
  else if(req.subtype==='cll') plan='continue_with_refer_hematology_with_rai_staging';
  else if(req.subtype==='cml') plan='continue_with_tki_evaluation_with_refer';
  else plan='continue_with_refer_hematology_with_review';
  return {plan};
}
function lymphoma_classify(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['hodgkin','diffuse_large_bcell','follicular','mantle_cell','marginal_zone','burkitt','lymphoblastic','anaplastic_large','tcell','nk_tcell','peripheral_tcell','primary_effusion']);
  ensureNumber(req.ann_arbor_stage, 'ann_arbor_stage');
  ensureNumber(req.ipi_score, 'ipi_score');
  ensureBool(req.bulky_disease, 'bulky_disease');
  let plan;
  if(req.type==='burkitt') plan='continue_with_urgent_chemo_with_refer';
  else if(req.type==='diffuse_large_bcell') plan='continue_with_choep_with_refer';
  else if(req.type==='hodgkin') plan='continue_with_abvd_with_refer';
  else plan='continue_with_standard_with_refer';
  if(req.ipi_score>=3) plan+='_high_risk_protocol';
  if(req.bulky_disease) plan+='_consider_radiotherapy';
  return {plan};
}
function myeloma_workup(req){
  ensureBool(req.m_spike_present, 'm_spike_present');
  ensureNumber(req.kappa_flc_mg_l, 'kappa_flc_mg_l');
  ensureNumber(req.lambda_flc_mg_l, 'lambda_flc_mg_l');
  ensureNumber(req.kl_ratio, 'kl_ratio');
  ensureNumber(req.bone_marrow_plasma_cells_pct, 'bone_marrow_plasma_cells_pct');
  ensureBool(req.crabor_features, 'crabor_features');
  let plan;
  if(req.crabor_features) plan='continue_with_myeloma_treatment_then_reassess';
  else if(req.bone_marrow_plasma_cells_pct>=10) plan='continue_with_myeloma_evaluation';
  else if(req.kl_ratio>=100) plan='continue_with_refer_hematology_with_workup';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {bm_biopsy,flow_cytometry,lymph_node,leukemia_classify,lymphoma_classify,myeloma_workup};}
module.exports={funcs,CITATIONS,ValidationError};
