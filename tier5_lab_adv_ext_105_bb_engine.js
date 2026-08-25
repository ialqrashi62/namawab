// filepath: tier5_lab_adv_ext_105_bb_engine.js
// TIER5_LAB_ADV_EXT-105: Blood bank advanced (apheresis, HLA, exchange, neonatal)
'use strict';
const CITATIONS = ['AABB_Standards_2023','ASH_Apheresis_2019','BSHI_HLA_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function therapeutic_apheresis(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['tma','gbs','myasthenia_crisis','sickle_cell_acute_chest','hyperviscosity','wm_igg','ttp','severe_hypertriglyceridemia','aboincompat_pregnancy','desensitization_transplant']);
  ensureBool(req.replacement_fluid_required, 'replacement_fluid_required');
  ensureBool(req.central_access, 'central_access');
  ensureNumber(req.target_volume_ml, 'target_volume_ml');
  let plan;
  if(req.central_access===false) plan='continue_with_access_then_reassess';
  else if(req.target_volume_ml>=4000) plan='continue_with_plasma_exchange_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.indication==='ttp') plan+='_continue_plasma_exchange_daily';
  return {plan};
}
function hla_typing(req){
  ensureStr(req.patient_hla, 'patient_hla');
  ensureStr(req.donor_hla, 'donor_hla');
  ensureNumber(req.mismatch_count, 'mismatch_count');
  ensureBool(req.dsa_positive, 'dsa_positive');
  ensureBool(req.acceptable_mismatch, 'acceptable_mismatch');
  let plan;
  if(req.dsa_positive) plan='continue_with_desensitization_protocol_then_refer';
  else if(req.mismatch_count===0) plan='continue_with_zero_mismatch_then_proceed';
  else if(req.acceptable_mismatch) plan='continue_with_acceptable_mismatch_then_proceed';
  else plan='continue_with_review_then_refer_transplant';
  return {plan};
}
function platelet_crossmatch(req){
  ensureBool(req.platelet_antibody_positive, 'platelet_antibody_positive');
  ensureStr(req.crossmatch_result, 'crossmatch_result');
  ensureEnum(req.crossmatch_result, 'crossmatch_result', ['compatible','incompatible','weak_reaction','negative','positive']);
  ensureBool(req.plt_refractory, 'plt_refractory');
  let plan;
  if(req.crossmatch_result==='incompatible') plan='continue_with_refer_bb_with_alternative';
  else if(req.plt_refractory && req.platelet_antibody_positive) plan='continue_with_refer_bb_with_typed_platelets';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function exchange_transfusion(req){
  ensureBool(req.neonatal, 'neonatal');
  ensureNumber(req.hgb_pre, 'hgb_pre');
  ensureNumber(req.bilirubin_pre, 'bilirubin_pre');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.sickle_cell, 'sickle_cell');
  ensureBool(req.hyperhemolysis, 'hyperhemolysis');
  let plan;
  if(req.neonatal && req.bilirubin_pre>=20) plan='continue_with_double_volume_exchange_then_reassess';
  else if(req.sickle_cell) plan='continue_with_erythrocytapheresis_then_reassess';
  else if(req.hyperhemolysis) plan='continue_with_ivig_then_erythrocytapheresis';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function neonatal_transfusion(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.hgb_pre, 'hgb_pre');
  ensureNumber(req.plt_pre, 'plt_pre');
  ensureBool(req.irradiated_required, 'irradiated_required');
  ensureBool(req.cmv_neg_required, 'cmv_neg_required');
  let plan;
  if(req.gestational_age_weeks<28 && req.hgb_pre<12) plan='continue_with_reduce_donor_exposure_with_irradiated';
  else if(req.plt_pre<25) plan='continue_with_plt_transfusion_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.irradiated_required) plan+='_irradiated';
  if(req.cmv_neg_required) plan+='_cmv_negative';
  return {plan};
}
function hpc_apheresis(req){
  ensureNumber(req.cd34_target, 'cd34_target');
  ensureBool(req.peripheral_access, 'peripheral_access');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.prior_mobilization_failure, 'prior_mobilization_failure');
  ensureBool(req.central_line, 'central_line');
  let plan;
  if(req.central_line===false && req.peripheral_access===false) plan='continue_with_central_access_then_reassess';
  else if(req.prior_mobilization_failure) plan='continue_with_re_mobilization_with_refer';
  else if(req.cd34_target>=2) plan='continue_with_collection_then_reassess';
  else plan='continue_with_re_mobilization_then_reassess';
  return {plan};
}
function funcs(){return {therapeutic_apheresis,hla_typing,platelet_crossmatch,exchange_transfusion,neonatal_transfusion,hpc_apheresis};}
module.exports={funcs,CITATIONS,ValidationError};
