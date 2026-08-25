// filepath: tier5_infusion_ext_103_chemo_engine.js
// TIER5_INFUSION_EXT-103: Chemotherapy infusion
'use strict';
const CITATIONS = ['ONS_Chemo_2019','ASCO_IV_Access_2019','NIOSH_Chemo_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function chemo_pre(req){
  ensureNumber(req.anc_count, 'anc_count');
  ensureNumber(req.plt_count, 'plt_count');
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.creatinine_mg_dl, 'creatinine_mg_dl');
  ensureNumber(req.alt_u_l, 'alt_u_l');
  ensureNumber(req.bilirubin_mg_dl, 'bilirubin_mg_dl');
  let plan;
  if(req.anc_count<1.5) plan='continue_with_hold_then_reassess';
  else if(req.plt_count<100) plan='continue_with_hold_then_reassess';
  else if(req.hgb<8) plan='continue_with_transfusion_consideration_then_reassess';
  else if(req.creatinine_mg_dl>=2) plan='continue_with_renal_dose_then_reassess';
  else if(req.alt_u_l>=3 || req.bilirubin_mg_dl>=2) plan='continue_with_hepatic_dose_then_reassess';
  else plan='continue_with_proceed_then_reassess';
  return {plan};
}
function chemo_vesicant(req){
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['doxorubicin','daunorubicin','epirubicin','idarubicin','mitomycin_c','vinblastine','vincristine','vinorelbine','paclitaxel','docetaxel','cisplatin','carboplatin','oxaliplatin']);
  ensureBool(req.central_access_present, 'central_access_present');
  ensureStr(req.assessment, 'assessment');
  ensureEnum(req.assessment, 'assessment', ['no_extravasation','possible_extravasation','definite_extravasation','suspected_infiltration']);
  ensureNumber(req.volume_extrava_ml, 'volume_extrava_ml');
  ensureBool(req.ice_pack_applied, 'ice_pack_applied');
  let plan;
  if(req.assessment==='definite_extravasation' && req.drug==='doxorubicin') plan='continue_with_dexrazoxane_then_reassess';
  else if(req.assessment==='definite_extravasation') plan='continue_with_warm_cold_then_reassess';
  else if(req.assessment==='possible_extravasation') plan='continue_with_stop_then_reassess';
  else if(!req.central_access_present) plan='continue_with_central_access_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function chemo_emesis(req){
  ensureStr(req.emetic_risk, 'emetic_risk');
  ensureEnum(req.emetic_risk, 'emetic_risk', ['low','minimal','moderate','high']);
  ensureBool(req.antiemetic_pre_med_given, 'antiemetic_pre_med_given');
  ensureBool(req.antiemetic_post_med, 'antiemetic_post_med');
  ensureBool(req.breakthrough_antiemetic_available, 'breakthrough_antiemetic_available');
  ensureNumber(req.delayed_onset_days, 'delayed_onset_days');
  ensureBool(req.dexamethasone_given, 'dexamethasone_given');
  let plan;
  if(req.emetic_risk==='high' && req.antiemetic_pre_med_given===false) plan='continue_with_5ht3_with_nki_then_reassess';
  else if(req.emetic_risk==='moderate' && req.antiemetic_pre_med_given===false) plan='continue_with_5ht3_then_reassess';
  else if(req.delayed_onset_days>=2 && req.dexamethasone_given===false) plan='continue_with_dexamethasone_then_reassess';
  else if(req.breakthrough_antiemetic_available===false) plan='continue_with_breakthrough_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function hypersensitivity(req){
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['paclitaxel','docetaxel','carboplatin','cisplatin','oxaliplatin','rituximab','cetuximab','trastuzumab']);
  ensureNumber(req.cycle_number, 'cycle_number');
  ensureBool(req.premed_taken, 'premed_taken');
  ensureBool(req.reaction_previous_cycle, 'reaction_previous_cycle');
  ensureBool(req.symptoms_occurred, 'symptoms_occurred');
  ensureStr(req.symptom_type, 'symptom_type');
  ensureEnum(req.symptom_type, 'symptom_type', ['flushing','urticaria','dyspnea','hypotension','back_pain','chest_pain','anaphylaxis','none']);
  let plan;
  if(req.symptom_type==='anaphylaxis') plan='continue_with_stop_then_reassess';
  else if(req.symptom_type==='hypotension' || req.symptom_type==='dyspnea') plan='continue_with_slow_then_reassess';
  else if(req.reaction_previous_cycle && req.premed_taken===false) plan='continue_with_premed_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function chemo_disposal(req){
  ensureNumber(req.bag_volume_ml, 'bag_volume_ml');
  ensureNumber(req.bag_count, 'bag_count');
  ensureBool(req.hazardous_waste_container_available, 'hazardous_waste_container_available');
  ensureBool(req.ppe_worn, 'ppe_worn');
  ensureBool(req.disposal_documented, 'disposal_documented');
  ensureBool(req.spill_kit_available, 'spill_kit_available');
  let plan;
  if(!req.hazardous_waste_container_available) plan='continue_with_obtain_container_then_reassess';
  else if(!req.ppe_worn) plan='continue_with_ppe_then_reassess';
  else if(!req.disposal_documented) plan='continue_with_document_then_reassess';
  else if(!req.spill_kit_available) plan='continue_with_obtain_kit_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function chemo_cycle_day(req){
  ensureNumber(req.cycle_day, 'cycle_day');
  ensureNumber(req.cycle_total_days, 'cycle_total_days');
  ensureBool(req.compliance_issues, 'compliance_issues');
  ensureBool(req.supports_in_place, 'supports_in_place');
  ensureBool(req.monitoring_done, 'monitoring_done');
  ensureBool(req.toxicity_review, 'toxicity_review');
  let plan;
  if(req.compliance_issues) plan='continue_with_support_then_reassess';
  else if(!req.monitoring_done) plan='continue_with_monitoring_then_reassess';
  else if(!req.toxicity_review) plan='continue_with_review_then_reassess';
  else if(!req.supports_in_place) plan='continue_with_support_setup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {chemo_pre,chemo_vesicant,chemo_emesis,hypersensitivity,chemo_disposal,chemo_cycle_day};}
module.exports={funcs,CITATIONS,ValidationError};
