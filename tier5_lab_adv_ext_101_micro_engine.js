// filepath: tier5_lab_adv_ext_101_micro_engine.js
// TIER5_LAB_ADV_EXT-101: Microbiology advanced
'use strict';
const CITATIONS = ['IDSA_Blood_Culture_2017','CDC_TB_2021','ASM_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function blood_culture(req){
  ensureStr(req.pathogen, 'pathogen');
  ensureNumber(req.hours_to_positive, 'hours_to_positive');
  ensureNumber(req.bottles_positive, 'bottles_positive');
  ensureBool(req.contamination_suspected, 'contamination_suspected');
  ensureBool(req.endovascular_focus, 'endovascular_focus');
  let plan;
  if(req.contamination_suspected && req.bottles_positive<=1) plan='likely_contaminant_then_re_evaluate_clinical';
  else if(req.hours_to_positive<=12) plan='urgent_then_optimize_antibiotics_with_repeat';
  else if(req.endovascular_focus) plan='urgent_then_refer_id_with_imaging_then_treatment';
  else plan='continue_with_antibiotics_with_repeat_culture';
  return {plan};
}
function tb_workup(req){
  ensureBool(req.afb_smear_positive, 'afb_smear_positive');
  ensureStr(req.naat_result, 'naat_result');
  ensureEnum(req.naat_result, 'naat_result', ['positive_mtb','negative','invalid','inconclusive','pending']);
  ensureBool(req.hiv_positive, 'hiv_positive');
  ensureBool(req.drug_resistance_suspected, 'drug_resistance_suspected');
  ensureNumber(req.contact_score, 'contact_score');
  let plan;
  if(req.naat_result==='positive_mtb') plan='tb_confirmed_then_initiate_rif_4_drug_with_refer_tb_clinic';
  else if(req.naat_result==='inconclusive' || req.naat_result==='invalid') plan='continue_with_repeat_test_then_reassess';
  else if(req.contact_score>=5) plan='latent_tb_screening_then_prophylaxis_consideration';
  else plan='continue_with_observation_then_reassess';
  if(req.hiv_positive) plan+='_hiv_specialist_consult';
  if(req.drug_resistance_suspected) plan+='_drtb_protocol_review';
  return {plan};
}
function fungal(req){
  ensureStr(req.specimen, 'specimen');
  ensureEnum(req.specimen, 'specimen', ['blood','csf','tissue','bal','urine','wound','eye']);
  ensureStr(req.organism, 'organism');
  ensureEnum(req.organism, 'organism', ['candida_albicans','candida_auris','candida_glabrata','aspergillus','cryptococcus','histoplasma','blastomyces','coccidioides','pneumocystis','mucorales']);
  ensureBool(req.invasion_suspected, 'invasion_suspected');
  ensureBool(req.immunocompromised, 'immunocompromised');
  let plan;
  if(req.organism==='candida_auris') plan='urgent_then_isolation_with_contact_precautions';
  else if(req.organism==='aspergillus' && req.invasion_suspected) plan='urgent_then_imaging_with_voriconazole';
  else if(req.organism==='cryptococcus') plan='urgent_then_csf_with_induction_amphotericin_then_flucytosine';
  else if(req.organism==='pneumocystis' && req.immunocompromised) plan='continue_with_tmpsmx_with_review';
  else plan='continue_with_identification_with_treatment';
  return {plan};
}
function viral_load(req){
  ensureStr(req.virus, 'virus');
  ensureEnum(req.virus, 'virus', ['hiv','hbv','hcv','cmv','ebv','bk','sars_cov2','influenza','rsv','parvovirus_b19']);
  ensureNumber(req.viral_load_copies_ml, 'viral_load_copies_ml');
  ensureBool(req.art_adherent, 'art_adherent');
  ensureBool(req.resistance_suspected, 'resistance_suspected');
  ensureNumber(req.copies_log, 'copies_log');
  let plan;
  if(req.virus==='hiv' && req.copies_log>=2.7) plan='viral_failure_then_refer_id_with_resistance_testing';
  else if(req.virus==='hiv' && req.copies_log<1.7) plan='continue_with_art_with_reassess';
  else if(req.virus==='cmv' && req.viral_load_copies_ml>=1000) plan='viremia_then_initiate_treatment_then_reassess';
  else plan='continue_with_monitoring_then_reassess';
  if(!req.art_adherent && req.virus==='hiv') plan+='_adherence_counseling';
  return {plan};
}
function molecular_id(req){
  ensureStr(req.pathogen, 'pathogen');
  ensureEnum(req.pathogen, 'pathogen', ['mrsa','vre','esbl_cre','cpe','kpc','ndm','oxa48','vim','imp']);
  ensureBool(req.bsi_present, 'bsi_present');
  ensureBool(req.mdro_outbreak, 'mdro_outbreak');
  ensureNumber(req.contact_precautions, 'contact_precautions');
  let plan;
  if(req.mdro_outbreak) plan='outbreak_protocol_then_enhanced_isolation';
  else if(req.pathogen==='kpc' || req.pathogen==='ndm') plan='urgent_then_isolation_with_refer_id';
  else if(req.bsi_present) plan='continue_with_contact_with_treatment';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function serology(req){
  ensureStr(req.test, 'test');
  ensureEnum(req.test, 'test', ['hiv_antibody','hbsag','anti_hbs','hcv_ab','hbc_igm','syphilis_rpr','lyme_eia','covid_igg','measles_igg','rubella_igg','varicella_igg']);
  ensureStr(req.result, 'result');
  ensureEnum(req.result, 'result', ['reactive','non_reactive','equivocal','positive','negative','indeterminate','titer_1_4','titer_1_8','titer_1_16']);
  ensureBool(req.confirmatory_needed, 'confirmatory_needed');
  ensureNumber(req.symptom_duration_days, 'symptom_duration_days');
  let plan;
  if(req.confirmatory_needed) plan='confirmatory_test_then_reassess';
  else if(req.result==='reactive' && req.test==='hiv_antibody') plan='continue_with_counseling_then_refer_id';
  else if(req.result==='reactive' && req.test==='hbsag') plan='continue_with_liver_review_then_refer_gi';
  else if(req.result==='reactive' && req.test==='syphilis_rpr') plan='continue_with_treatment_then_reassess';
  else if(req.result==='reactive' && req.test==='lyme_eia') plan='continue_with_western_blot_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {blood_culture,tb_workup,fungal,viral_load,molecular_id,serology};}
module.exports={funcs,CITATIONS,ValidationError};
