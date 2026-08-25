// filepath: tier5_surg_spec_ext_101_cardiothoracic_engine.js
// TIER5_SURG_SPEC_EXT-101: Cardiothoracic surgery (CABG, valve, aortic, lung, transplant)
'use strict';
const CITATIONS = ['ACC_CABG_2021','AHA_Valve_2020','ESTS_Lung_2019'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cabg(req){
  ensureNumber(req.syntax_score, 'syntax_score');
  ensureNumber(req.ef_pct, 'ef_pct');
  ensureBool(req.diabetic, 'diabetic');
  ensureBool(req.lad_disease, 'lad_disease');
  ensureBool(req.syntax_high, 'syntax_high');
  ensureNumber(req.sts_score, 'sts_score');
  let plan;
  if(req.lad_disease && req.diabetic) plan='cabg_then_lima_to_lad_with_grafts';
  else if(req.syntax_high && req.ef_pct<40) plan='continue_with_cabg_then_evaluate_for_lvad';
  else if(req.sts_score>=8) plan='continue_with_high_risk_surgical_evaluation_then_review_medical_management';
  else if(req.syntax_score<=22) plan='consider_pci_with_refer_cardiologist';
  else plan='continue_with_cabg_with_standard_protocol';
  return {plan};
}
function valve(req){
  ensureStr(req.valve, 'valve');
  ensureEnum(req.valve, 'valve', ['aortic','mitral','tricuspid','pulmonic','multiple']);
  ensureStr(req.etiology, 'etiology');
  ensureEnum(req.etiology, 'etiology', ['stenosis','regurgitation','mixed','prosthetic_failure','endocarditis']);
  ensureNumber(req.ef_pct, 'ef_pct');
  ensureNumber(req.age, 'age');
  ensureNumber(req.sts_score, 'sts_score');
  let plan;
  if(req.age>=70 && req.sts_score>=4 && req.valve==='aortic') plan='consider_tavr_then_refer_heart_team';
  else if(req.age<60 && req.valve==='aortic') plan='continue_with_surgical_aortic_valve_replacement';
  else if(req.valve==='mitral' && req.etiology==='regurgitation' && req.ef_pct>=60) plan='continue_with_mitral_repair_with_refer';
  else if(req.etiology==='endocarditis') plan='urgent_then_surgical_evaluation_with_antibiotics';
  else plan='continue_with_multidisciplinary_review';
  return {plan};
}
function aortic_pathology(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['ascending_aneurysm','arch_aneurysm','descending_aneurysm','type_a_dissection','type_b_dissection','intramural_hematoma','penetrating_ulcer']);
  ensureNumber(req.diameter_cm, 'diameter_cm');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.rapid_expansion, 'rapid_expansion');
  ensureNumber(req.sts_score, 'sts_score');
  let plan;
  if(req.type==='type_a_dissection') plan='urgent_then_open_surgical_repair';
  else if(req.type==='type_b_dissection' && req.symptomatic) plan='continue_with_tevar_with_medical_management';
  else if(req.diameter_cm>=5.5) plan='continue_with_surgical_repair';
  else if(req.rapid_expansion) plan='continue_with_imaging_then_refer';
  else if(req.type==='intramural_hematoma' && req.symptomatic) plan='continue_with_imaging_then_medical_management';
  else plan='continue_with_surveillance_with_imaging';
  return {plan};
}
function lung_resection(req){
  ensureNumber(req.fev1_pct_predicted, 'fev1_pct_predicted');
  ensureNumber(req.dlco_pct, 'dlco_pct');
  ensureNumber(req.ppo_fev1, 'ppo_fev1');
  ensureNumber(req.ppo_dlco, 'ppo_dlco');
  ensureStr(req.procedure, 'procedure');
  ensureEnum(req.procedure, 'procedure', ['lobectomy','segmentectomy','pneumonectomy','wedge_resection','sleeve_resection']);
  let plan;
  if(req.ppo_fev1<40 || req.ppo_dlco<40) plan='continue_with_high_risk_with_evaluation_for_limiting_resection';
  else if(req.procedure==='pneumonectomy' && req.ppo_fev1<45) plan='continue_with_consider_sleeve_with_review';
  else if(req.fev1_pct_predicted>=80 && req.dlco_pct>=80) plan='continue_with_lobectomy_with_standard_protocol';
  else plan='continue_with_standard_workup';
  return {plan};
}
function transplant_heart_lung(req){
  ensureNumber(req.age, 'age');
  ensureBool(req.lvad_bridge, 'lvad_bridge');
  ensureNumber(req.ef_pct, 'ef_pct');
  ensureBool(req.renal_function_acceptable, 'renal_function_acceptable');
  ensureBool(req.substance_use, 'substance_use');
  ensureBool(req.social_support, 'social_support');
  let plan;
  if(req.substance_use) plan='continue_with_substance_use_review_then_reassess';
  else if(req.ef_pct<=25 && req.lvad_bridge===false) plan='continue_with_lvad_then_evaluate_transplant';
  else if(req.renal_function_acceptable && req.social_support) plan='continue_with_transplant_evaluation';
  else plan='continue_with_optimization_then_reassess';
  return {plan};
}
function postop_care(req){
  ensureNumber(req.cardiac_index, 'cardiac_index');
  ensureNumber(req.cvp, 'cvp');
  ensureNumber(req.lactate_mmol_l, 'lactate_mmol_l');
  ensureNumber(req.urine_output_ml_per_hr, 'urine_output_ml_per_hr');
  ensureBool(req.vasoactive_required, 'vasoactive_required');
  ensureBool(req.bleeding_significant, 'bleeding_significant');
  let plan;
  if(req.cardiac_index<2.0) plan='continue_with_inotropes_then_reassess';
  else if(req.lactate_mmol_l>=4 && req.urine_output_ml_per_hr<0.5) plan='continue_with_resuscitation_with_review';
  else if(req.bleeding_significant) plan='continue_with_reexploration_review_with_transfusion';
  else if(req.cvp>=18) plan='continue_with_diuresis_with_review';
  else plan='continue_with_standard_postop_protocol';
  return {plan};
}
function funcs(){return {cabg,valve,aortic_pathology,lung_resection,transplant_heart_lung,postop_care};}
module.exports={funcs,CITATIONS,ValidationError};
