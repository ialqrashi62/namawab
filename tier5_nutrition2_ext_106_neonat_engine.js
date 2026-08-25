// filepath: tier5_nutrition2_ext_106_neonat_engine.js
// TIER5_NUTRITION2_EXT-106: Neonatal nutrition (TPN, breast milk, fortifier, growth)
'use strict';
const CITATIONS = ['ESPGHAN_Neo_2018','AAP_Neo_2020','ASPEN_Neo_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function neonatal_tpn(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.days_of_life, 'days_of_life');
  ensureNumber(req.kcal_kg_day, 'kcal_kg_day');
  ensureNumber(req.protein_g_kg_day, 'protein_g_kg_day');
  ensureBool(req.enteral_feeding_initiated, 'enteral_feeding_initiated');
  let plan;
  if(req.kcal_kg_day<60 && req.days_of_life>=3) plan='continue_with_increase_calorie_then_reassess';
  else if(req.protein_g_kg_day<2 && req.days_of_life>=2) plan='continue_with_increase_protein_then_reassess';
  else if(req.enteral_feeding_initiated===false && req.days_of_life>=7) plan='continue_with_evaluate_gi_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function breast_milk(req){
  ensureBool(req.mom_present, 'mom_present');
  ensureBool(req.breast_initiated, 'breast_initiated');
  ensureBool(req.latch_adequate, 'latch_adequate');
  ensureNumber(req.feeding_duration_min, 'feeding_duration_min');
  ensureNumber(req.milk_intake_ml, 'milk_intake_ml');
  let plan;
  if(req.mom_present===false) plan='continue_with_donor_milk_then_reassess';
  else if(req.breast_initiated===false) plan='continue_with_lactation_consult_then_reassess';
  else if(req.latch_adequate===false) plan='continue_with_lactation_consult_then_reassess';
  else if(req.milk_intake_ml<req.weight_kg*150) plan='continue_with_supplement_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fortifier(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.feeding_volume_ml_kg_day, 'feeding_volume_ml_kg_day');
  ensureBool(req.fortifier_started, 'fortifier_started');
  ensureBool(req.fortifier_tolerance, 'fortifier_tolerance');
  ensureNumber(req.growth_velocity_g_day, 'growth_velocity_g_day');
  let plan;
  if(req.fortifier_started===false && req.weight_kg<2.5) plan='continue_with_start_fortifier_then_reassess';
  else if(req.fortifier_tolerance===false) plan='continue_with_reduce_fortifier_then_reassess';
  else if(req.growth_velocity_g_day<15) plan='continue_with_increase_calorie_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function growth_assessment(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.length_cm, 'length_cm');
  ensureNumber(req.head_circumference_cm, 'head_circumference_cm');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.postnatal_age_weeks, 'postnatal_age_weeks');
  ensureStr(req.growth_centile, 'growth_centile');
  ensureEnum(req.growth_centile, 'growth_centile', ['less_than_3rd','3rd_to_10th','10th_to_25th','25th_to_50th','50th_to_75th','75th_to_90th','90th_to_97th','above_97th']);
  let plan;
  if(req.growth_centile==='less_than_3rd' || req.growth_centile==='3rd_to_10th') plan='continue_with_nutritional_review_then_reassess';
  else if(req.growth_centile==='above_97th') plan='continue_with_overfeeding_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function nec_nutrition(req){
  ensureBool(req.npo_status, 'npo_status');
  ensureBool(req.tpn_active, 'tpn_active');
  ensureBool(req.feeding_advanced, 'feeding_advanced');
  ensureNumber(req.feeding_volume_ml_kg_day, 'feeding_volume_ml_kg_day');
  ensureBool(req.feeding_tolerance, 'feeding_tolerance');
  ensureNumber(req.bell_stage, 'bell_stage');
  let plan;
  if(req.bell_stage>=2 && req.feeding_advanced) plan='continue_with_reduce_then_reassess';
  else if(req.feeding_tolerance===false) plan='continue_with_reduce_then_reassess';
  else if(req.npo_status && req.feeding_tolerance) plan='continue_with_initiate_trophic_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function discharge_feeding(req){
  ensureBool(req.breast_feeding_continued, 'breast_feeding_continued');
  ensureBool(req.formula_supplementation, 'formula_supplementation');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.maternal_lactation_support, 'maternal_lactation_support');
  ensureBool(req.feeding_plan_documented, 'feeding_plan_documented');
  ensureBool(req.growth_adequate, 'growth_adequate');
  let plan;
  if(req.breast_feeding_continued===false) plan='continue_with_lactation_consult_then_reassess';
  else if(req.formula_supplementation===false && req.growth_adequate===false) plan='continue_with_supplement_then_reassess';
  else if(req.feeding_plan_documented===false) plan='continue_with_documented_plan_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {neonatal_tpn,breast_milk,fortifier,growth_assessment,nec_nutrition,discharge_feeding};}
module.exports={funcs,CITATIONS,ValidationError};
