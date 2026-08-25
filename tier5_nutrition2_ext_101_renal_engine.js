// filepath: tier5_nutrition2_ext_101_renal_engine.js
// TIER5_NUTRITION2_EXT-101: Renal nutrition
'use strict';
const CITATIONS = ['NKF_KDOQI_2020','RDA_Dialysis_2020','ASPEN_Renal_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function ckd_nutrition(req){
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.serum_k_mmol_l, 'serum_k_mmol_l');
  ensureNumber(req.serum_phos_mg_dl, 'serum_phos_mg_dl');
  ensureBool(req.diabetic, 'diabetic');
  ensureNumber(req.proteinuria_g_24h, 'proteinuria_g_24h');
  let plan;
  if(req.egfr<15 && req.serum_k_mmol_l>=5.5) plan='continue_with_urgent_dietary_then_reassess';
  else if(req.egfr<30) plan='continue_with_low_protein_then_low_k_then_reassess';
  else if(req.proteinuria_g_24h>=3) plan='continue_with_low_protein_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.diabetic) plan+='_diabetic_kidney_diet';
  return {plan};
}
function dialysis_nutrition(req){
  ensureStr(req.dialysis_modality, 'dialysis_modality');
  ensureEnum(req.dialysis_modality, 'dialysis_modality', ['hemodialysis','peritoneal_dialysis','hemodiafiltration','nocturnal_hd','home_hd']);
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  ensureNumber(req.kt_v, 'kt_v');
  ensureBool(req.anuric, 'anuric');
  let plan;
  if(req.albumin_g_dl<3.0) plan='continue_with_high_protein_then_reassess';
  else if(req.dialysis_modality==='peritoneal_dialysis') plan='continue_with_high_protein_then_k_control';
  else plan='continue_with_protein_then_reassess';
  if(req.anuric) plan+='_strict_fluid_restriction';
  if(req.kt_v<1.2) plan+='_consider_increase_dialysis_dose';
  return {plan};
}
function electrolyte_balance(req){
  ensureNumber(req.serum_k_mmol_l, 'serum_k_mmol_l');
  ensureNumber(req.serum_na_mmol_l, 'serum_na_mmol_l');
  ensureNumber(req.serum_ca_mg_dl, 'serum_ca_mg_dl');
  ensureNumber(req.serum_phos_mg_dl, 'serum_phos_mg_dl');
  ensureNumber(req.serum_mg_mg_dl, 'serum_mg_mg_dl');
  ensureBool(req.dialysis_required, 'dialysis_required');
  let plan;
  if(req.serum_k_mmol_l>=6.0) plan='continue_with_urgent_dietary_then_reassess_with_ekg';
  else if(req.serum_phos_mg_dl>=6.5) plan='continue_with_phosphate_binder_then_reassess';
  else if(req.serum_na_mmol_l<=130) plan='continue_with_fluid_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fluid_mgmt(req){
  ensureNumber(req.weight_change_kg_24h, 'weight_change_kg_24h');
  ensureNumber(req.urine_output_ml_24h, 'urine_output_ml_24h');
  ensureNumber(req.fluid_intake_ml_24h, 'fluid_intake_ml_24h');
  ensureBool(req.edema_present, 'edema_present');
  ensureNumber(req.sodium_intake_mg, 'sodium_intake_mg');
  let plan;
  if(req.weight_change_kg_24h>=2) plan='continue_with_strict_fluid_review_then_reassess';
  else if(req.urine_output_ml_24h<400) plan='continue_with_oliguria_workup_then_reassess';
  else if(req.fluid_intake_ml_24h>1500 && req.urine_output_ml_24h<1000) plan='continue_with_fluid_restriction_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.edema_present) plan+='_diuretic_review';
  return {plan};
}
function renal_diet_education(req){
  ensureNumber(req.reading_level, 'reading_level');
  ensureBool(req.diet_sheet_provided, 'diet_sheet_provided');
  ensureBool(req.phosphate_education, 'phosphate_education');
  ensureBool(req.potassium_education, 'potassium_education');
  ensureBool(req.sodium_education, 'sodium_education');
  ensureBool(req.protein_education, 'protein_education');
  let plan;
  if(!req.diet_sheet_provided) plan='continue_with_provide_diet_sheet_then_teach_back';
  else if(req.phosphate_education===false) plan='continue_with_phosphate_education_then_reassess';
  else if(req.potassium_education===false) plan='continue_with_k_education_then_reassess';
  else if(req.sodium_education===false) plan='continue_with_na_education_then_reassess';
  else if(req.protein_education===false) plan='continue_with_protein_education_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function transplant_nutrition(req){
  ensureNumber(req.time_post_transplant_months, 'time_post_transplant_months');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.diabetic_post_transplant, 'diabetic_post_transplant');
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  ensureBool(req.infection_active, 'infection_active');
  let plan;
  if(req.time_post_transplant_months<3) plan='continue_with_high_protein_then_reassess';
  else if(req.diabetic_post_transplant) plan='continue_with_diabetic_diet_then_reassess';
  else if(req.bmi>=35) plan='continue_with_weight_management_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.infection_active) plan+='_increase_protein_for_wound_healing';
  return {plan};
}
function funcs(){return {ckd_nutrition,dialysis_nutrition,electrolyte_balance,fluid_mgmt,renal_diet_education,transplant_nutrition};}
module.exports={funcs,CITATIONS,ValidationError};
