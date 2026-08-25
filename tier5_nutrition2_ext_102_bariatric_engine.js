// filepath: tier5_nutrition2_ext_102_bariatric_engine.js
// TIER5_NUTRITION2_EXT-102: Bariatric nutrition
'use strict';
const CITATIONS = ['ASMBS_2016','ADA_Bariatric_2020','AACE_Obesity_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function preop_eval(req){
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.comorbidity_significant, 'comorbidity_significant');
  ensureBool(req.psych_eval_done, 'psych_eval_done');
  ensureBool(req.diet_eval_done, 'diet_eval_done');
  ensureBool(req.smoker, 'smoker');
  ensureNumber(req.weight_loss_attempts, 'weight_loss_attempts');
  let plan;
  if(req.bmi<35 && req.comorbidity_significant===false) plan='not_candidate_then_reassess';
  else if(req.psych_eval_done===false) plan='continue_with_psych_eval_then_reassess';
  else if(req.diet_eval_done===false) plan='continue_with_diet_eval_then_reassess';
  else if(req.smoker) plan='continue_with_cessation_then_reassess';
  else plan='continue_with_proceed_to_surgery';
  return {plan};
}
function postop_early(req){
  ensureNumber(req.days_post_op, 'days_post_op');
  ensureNumber(req.tolerance_solids, 'tolerance_solids'); // 1 poor 2 moderate 3 good
  ensureNumber(req.intake_kcal, 'intake_kcal');
  ensureNumber(req.intake_protein_g, 'intake_protein_g');
  ensureBool(req.vomiting_present, 'vomiting_present');
  ensureBool(req.dehydration_signs, 'dehydration_signs');
  let plan;
  if(req.dehydration_signs) plan='continue_with_urgent_fluid_then_reassess';
  else if(req.intake_kcal<400) plan='continue_with_progressive_diet_then_reassess';
  else if(req.intake_protein_g<60) plan='continue_with_high_protein_then_reassess';
  else if(req.vomiting_present) plan='continue_with_antiemetic_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function vitamin_deficiency(req){
  ensureStr(req.deficiency, 'deficiency');
  ensureEnum(req.deficiency, 'deficiency', ['b12','iron','vitamin_d','thiamine','folate','calcium','vitamin_a','vitamin_e','vitamin_k','zinc','copper','protein']);
  ensureBool(req.supplement_started, 'supplement_started');
  ensureNumber(req.days_post_op, 'days_post_op');
  ensureBool(req.neurologic_symptoms, 'neurologic_symptoms');
  let plan;
  if(req.deficiency==='thiamine' && req.neurologic_symptoms) plan='continue_with_urgent_iv_thiamine_then_reassess';
  else if(req.supplement_started===false) plan='continue_with_supplement_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function dumping_syndrome(req){
  ensureNumber(req.days_post_op, 'days_post_op');
  ensureBool(req.early_dumping, 'early_dumping');
  ensureBool(req.late_dumping, 'late_dumping');
  ensureBool(req.diet_modified, 'diet_modified');
  ensureBool(req.sugar_restricted, 'sugar_restricted');
  ensureBool(req.fluid_separated, 'fluid_separated');
  let plan;
  if(req.early_dumping && req.diet_modified===false) plan='continue_with_small_frequent_then_reassess';
  else if(req.late_dumping) plan='continue_with_reactive_then_reassess';
  else if(req.sugar_restricted===false) plan='continue_with_sugar_restrict_then_reassess';
  else if(req.fluid_separated===false) plan='continue_with_fluid_separation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function weight_loss_tracking(req){
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.weight_loss_pct, 'weight_loss_pct');
  ensureNumber(req.months_post_op, 'months_post_op');
  ensureBool(req.excessive_loss, 'excessive_loss');
  ensureBool(req.insufficient_loss, 'insufficient_loss');
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  let plan;
  if(req.excessive_loss) plan='continue_with_supplementation_then_reassess';
  else if(req.insufficient_loss) plan='continue_with_evaluate_cause_then_reassess';
  else if(req.albumin_g_dl<3.0) plan='continue_with_protein_increase_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function long_term(req){
  ensureNumber(req.months_post_op, 'months_post_op');
  ensureBool(req.weight_maintained, 'weight_maintained');
  ensureBool(req.bone_density_assessed, 'bone_density_assessed');
  ensureBool(req.annual_labs_done, 'annual_labs_done');
  ensureNumber(req.b12_levels_pg_ml, 'b12_levels_pg_ml');
  ensureBool(req.exercise_done, 'exercise_done');
  let plan;
  if(req.bone_density_assessed===false) plan='continue_with_dexa_then_reassess';
  else if(req.annual_labs_done===false) plan='continue_with_annual_labs_then_reassess';
  else if(req.b12_levels_pg_ml<200) plan='continue_with_b12_supplement_then_reassess';
  else if(req.exercise_done===false) plan='continue_with_exercise_program_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {preop_eval,postop_early,vitamin_deficiency,dumping_syndrome,weight_loss_tracking,long_term};}
module.exports={funcs,CITATIONS,ValidationError};
