// filepath: tier5_nutrition2_ext_104_metabolic_engine.js
// TIER5_NUTRITION2_EXT-104: Inherited metabolic disorders
'use strict';
const CITATIONS = ['GMDI_2020','SSIEM_2019','NORD_2021'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pku(req){
  ensureNumber(req.phe_level_mg_dl, 'phe_level_mg_dl');
  ensureNumber(req.age_years, 'age_years');
  ensureBool(req.diet_adherence, 'diet_adherence');
  ensureNumber(req.phe_intake_mg, 'phe_intake_mg');
  ensureBool(req.bh4_responsive, 'bh4_responsive');
  let plan;
  if(req.phe_level_mg_dl>10) plan='continue_with_diet_review_then_reassess';
  else if(req.diet_adherence===false) plan='continue_with_adherence_review_then_reassess';
  else if(req.phe_level_mg_dl<2 && req.age_years>=12) plan='continue_with_diet_review_then_reassess';
  else if(req.bh4_responsive) plan='continue_with_bh4_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function mps(req){
  ensureNumber(req.urine_gag, 'urine_gag');
  ensureNumber(req.age_years, 'age_years');
  ensureBool(req.ert_active, 'ert_active');
  ensureBool(req.symptoms_present, 'symptoms_present');
  ensureBool(req.cardiac_involvement, 'cardiac_involvement');
  let plan;
  if(req.cardiac_involvement) plan='continue_with_cardiology_review_then_reassess';
  else if(req.symptoms_present) plan='continue_with_refer_metabolic_then_reassess';
  else if(req.ert_active===false) plan='continue_with_ert_initiation_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function fatty_acid(req){
  ensureStr(req.disorder, 'disorder');
  ensureEnum(req.disorder, 'disorder', ['mcad','lchad','vlcad','cpt1','cpt2']);
  ensureNumber(req.carnitine_level, 'carnitine_level');
  ensureBool(req.fasting_tolerance, 'fasting_tolerance');
  ensureNumber(req.fasting_hours_max, 'fasting_hours_max');
  ensureBool(req.diet_adherence, 'diet_adherence');
  let plan;
  if(req.fasting_hours_max<4) plan='continue_with_avoid_fasting_then_reassess';
  else if(req.diet_adherence===false) plan='continue_with_education_then_reassess';
  else if(req.carnitine_level<20) plan='continue_with_carnitine_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function urea_cycle(req){
  ensureNumber(req.nh3_level_umol_l, 'nh3_level_umol_l');
  ensureStr(req.disorder, 'disorder');
  ensureEnum(req.disorder, 'disorder', ['otc','cps1','ass','asl','arg']);
  ensureNumber(req.protein_intake_g, 'protein_intake_g');
  ensureBool(req.acute_crisis, 'acute_crisis');
  let plan;
  if(req.nh3_level_umol_l>=200 || req.acute_crisis) plan='continue_with_urgent_dialysis_then_reassess';
  else if(req.protein_intake_g>1.5) plan='continue_with_restrict_protein_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function storage_disease(req){
  ensureStr(req.disease, 'disease');
  ensureEnum(req.disease, 'disease', ['gaucher','pompe','fabry','mps_various','glycogen_storage']);
  ensureNumber(req.ERT_infusion_number, 'ERT_infusion_number');
  ensureBool(req.adverse_reaction, 'adverse_reaction');
  ensureBool(req.tolerance_reviewed, 'tolerance_reviewed');
  ensureBool(req.home_infusion_eligible, 'home_infusion_eligible');
  let plan;
  if(req.adverse_reaction) plan='continue_with_premedication_then_reassess';
  else if(req.home_infusion_eligible) plan='continue_with_home_infusion_then_reassess';
  else plan='continue_with_infusion_center_then_reassess';
  return {plan};
}
function organic_acidemia(req){
  ensureNumber(req.lactate_mmol_l, 'lactate_mmol_l');
  ensureBool(req.acute_disease, 'acute_disease');
  ensureNumber(req.protein_intake_g, 'protein_intake_g');
  ensureBool(req.carnitine_active, 'carnitine_active');
  ensureNumber(req.weight_kg, 'weight_kg');
  let plan;
  if(req.acute_disease) plan='continue_with_refer_metabolic_then_reassess';
  else if(req.lactate_mmol_l>=4) plan='continue_with_review_intake_then_reassess';
  else if(req.protein_intake_g>=req.weight_kg*2) plan='continue_with_review_protein_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {pku,mps,fatty_acid,urea_cycle,storage_disease,organic_acidemia};}
module.exports={funcs,CITATIONS,ValidationError};
