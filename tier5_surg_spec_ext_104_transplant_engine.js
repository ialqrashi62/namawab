// filepath: tier5_surg_spec_ext_104_transplant_engine.js
// TIER5_SURG_SPEC_EXT-104: Transplant surgery (kidney, liver, heart, lung, pancreas, donor)
'use strict';
const CITATIONS = ['OPTN_Recipient_2023','AST_Kidney_2020','AASLD_Liver_Transplant_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function recipient_eval(req){
  ensureStr(req.organ, 'organ');
  ensureEnum(req.organ, 'organ', ['kidney','liver','heart','lung','pancreas','kidney_pancreas']);
  ensureNumber(req.age, 'age');
  ensureBool(req.comorbidities_significant, 'comorbidities_significant');
  ensureBool(req.substance_use, 'substance_use');
  ensureBool(req.social_support, 'social_support');
  ensureBool(req.transplant_history, 'transplant_history');
  let plan;
  if(req.substance_use) plan='continue_with_substance_review_then_reassess';
  else if(req.comorbidities_significant) plan='continue_with_comorbidity_optimization_then_reassess';
  else if(req.social_support===false) plan='continue_with_social_work_review_then_reassess';
  else plan='continue_with_evaluation_then_listing';
  if(req.transplant_history) plan+='_consider_re_transplant_review';
  return {plan};
}
function donor_eval(req){
  ensureBool(req.brain_death_confirmed, 'brain_death_confirmed');
  ensureNumber(req.age_donor, 'age_donor');
  ensureBool(req.organ_function_acceptable, 'organ_function_acceptable');
  ensureBool(req.infection_screening_done, 'infection_screening_done');
  ensureBool(req.malignancy_history, 'malignancy_history');
  ensureNumber(req.cold_ischemia_hours, 'cold_ischemia_hours');
  let plan;
  if(!req.brain_death_confirmed) plan='continue_with_brain_death_evaluation';
  else if(req.malignancy_history) plan='avoid_donor_then_refer_alternative';
  else if(!req.infection_screening_done) plan='continue_with_infection_workup';
  else if(req.cold_ischemia_hours>=24) plan='continue_with_assess_ischemia_then_reassess';
  else if(req.organ_function_acceptable) plan='continue_with_donor_procurement_planning';
  else plan='continue_with_reassess_organ_function';
  return {plan};
}
function immunosuppression(req){
  ensureStr(req.induction, 'induction');
  ensureEnum(req.induction, 'induction', ['basiliximab','antithymocyte_globulin','alemtuzumab','none']);
  ensureBool(req.maintenance_tacrolimus, 'maintenance_tacrolimus');
  ensureBool(req.maintenance_mmf, 'maintenance_mmf');
  ensureBool(req.steroid_maintenance, 'steroid_maintenance');
  ensureNumber(req.tacrolimus_trough, 'tacrolimus_trough');
  ensureBool(req.rejection_episode, 'rejection_episode');
  let plan;
  if(req.rejection_episode) plan='continue_with_pulse_steroids_with_optimization';
  else if(req.tacrolimus_trough<5 || req.tacrolimus_trough>15) plan='continue_with_adjust_trough_level';
  else plan='continue_with_maintenance_protocol';
  return {plan};
}
function rejection(req){
  ensureBool(req.acellular, 'acellular');
  ensureBool(req.cellular_acute, 'cellular_acute');
  ensureBool(req.cellular_chronic, 'cellular_chronic');
  ensureBool(req.humoral, 'humoral');
  ensureNumber(req.creatinine_mg_dl, 'creatinine_mg_dl');
  ensureBool(req.dsa_positive, 'dsa_positive');
  let plan;
  if(req.humoral) plan='continue_with_plasmapheresis_with_ivig';
  else if(req.cellular_chronic) plan='continue_with_optimization_with_reassess';
  else if(req.cellular_acute) plan='continue_with_pulse_steroids_with_optimization';
  else if(req.creatinine_mg_dl>=3.0) plan='continue_with_imaging_then_biopsy';
  else plan='continue_with_observation_with_monitoring';
  if(req.dsa_positive) plan+='_consider_antibody_review';
  return {plan};
}
function infection(req){
  ensureNumber(req.days_post_transplant, 'days_post_transplant');
  ensureStr(req.infection_site, 'infection_site');
  ensureEnum(req.infection_site, 'infection_site', ['uti','pneumonia','cmv','bk_virus','ebv','surgical_site','bloodstream','gi']);
  ensureBool(req.fever, 'fever');
  ensureBool(req.severe, 'severe');
  ensureBool(req.hospitalization_required, 'hospitalization_required');
  let plan;
  if(req.severe || req.hospitalization_required) plan='continue_with_iv_antibiotics_with_admission';
  else if(req.days_post_transplant<30) plan='continue_with_iv_antibiotics_with_refer';
  else if(req.days_post_transplant>=30 && req.days_post_transplant<=180) plan='continue_with_cmv_bk_then_appropriate_antiviral';
  else plan='continue_with_po_antibiotics_with_reassess';
  if(req.infection_site==='cmv') plan+='_continue_with_ganciclovir';
  return {plan};
}
function long_term_followup(req){
  ensureNumber(req.months_post_transplant, 'months_post_transplant');
  ensureBool(req.ptld_suspicion, 'ptld_suspicion');
  ensureBool(req.skin_cancer_screening, 'skin_cancer_screening');
  ensureNumber(req.bp, 'bp');
  ensureNumber(req.hba1c, 'hba1c');
  ensureBool(req.compliance, 'compliance');
  let plan;
  if(req.ptld_suspicion) plan='continue_with_imaging_then_biopsy_with_refer';
  else if(req.compliance===false) plan='continue_with_counseling_with_reassess';
  else if(req.hba1c>=7.5) plan='continue_with_diabetes_review_with_refer';
  else if(req.bp>=140) plan='continue_with_antihypertensive_with_review';
  else plan='continue_with_annual_review_with_routine';
  return {plan};
}
function funcs(){return {recipient_eval,donor_eval,immunosuppression,rejection,infection,long_term_followup};}
module.exports={funcs,CITATIONS,ValidationError};
