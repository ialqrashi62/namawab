// filepath: tier5_nutrition2_ext_105_gi_engine.js
// TIER5_NUTRITION2_EXT-105: GI nutrition (IBD, IBS, celiac, SIBO, liver, pancreas)
'use strict';
const CITATIONS = ['ECCO_IBD_2020','ACG_IBS_2020','AASLD_Liver_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function ibd(req){
  ensureStr(req.disease, 'disease');
  ensureEnum(req.disease, 'disease', ['crohns','ulcerative_colitis','indeterminate_colitis','pouchitis']);
  ensureStr(req.activity, 'activity');
  ensureEnum(req.activity, 'activity', ['remission','mild','moderate','severe','fulminant']);
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  ensureNumber(req.weight_loss_pct, 'weight_loss_pct');
  ensureBool(req.stenosis_present, 'stenosis_present');
  let plan;
  if(req.activity==='severe' || req.activity==='fulminant') plan='continue_with_inpatient_then_reassess';
  else if(req.albumin_g_dl<2.5 && req.weight_loss_pct>=10) plan='continue_with_high_protein_then_reassess';
  else if(req.stenosis_present) plan='continue_with_low_fiber_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function ibs(req){
  ensureStr(req.subtype, 'subtype');
  ensureEnum(req.subtype, 'subtype', ['ibs_c','ibs_d','ibs_m','ibs_u']);
  ensureBool(req.fodmap_tried, 'fodmap_tried');
  ensureBool(req.fiber_intake_adequate, 'fiber_intake_adequate');
  ensureBool(req.fluid_intake_adequate, 'fluid_intake_adequate');
  ensureBool(req.stress_management, 'stress_management');
  let plan;
  if(req.fodmap_tried===false) plan='continue_with_low_fodmap_then_reassess';
  else if(req.subtype==='ibs_c' && req.fiber_intake_adequate===false) plan='continue_with_fiber_increase_then_reassess';
  else if(req.fluid_intake_adequate===false) plan='continue_with_fluid_review_then_reassess';
  else if(req.stress_management===false) plan='continue_with_stress_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function celiac(req){
  ensureBool(req.diagnosis_confirmed, 'diagnosis_confirmed');
  ensureBool(req.gfd_adherence, 'gfd_adherence');
  ensureNumber(req.tissue_transglutaminase, 'tissue_transglutaminase');
  ensureNumber(req.vitamin_d_25oh, 'vitamin_d_25oh');
  ensureNumber(req.iron, 'iron');
  ensureBool(req.bone_density_assessed, 'bone_density_assessed');
  let plan;
  if(req.gfd_adherence===false) plan='continue_with_education_then_reassess';
  else if(req.tissue_transglutaminase>10) plan='continue_with_refer_gi_then_reassess';
  else if(req.vitamin_d_25oh<20) plan='continue_with_supplement_then_reassess';
  else if(req.iron<30) plan='continue_with_iron_review_then_reassess';
  else if(req.bone_density_assessed===false) plan='continue_with_dexa_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sibo(req){
  ensureBool(req.diagnosis_confirmed, 'diagnosis_confirmed');
  ensureNumber(req.hydrogen_baseline_ppm, 'hydrogen_baseline_ppm');
  ensureNumber(req.methane_baseline_ppm, 'methane_baseline_ppm');
  ensureBool(req.elemental_diet_tried, 'elemental_diet_tried');
  ensureBool(req.antibiotic_tried, 'antibiotic_tried');
  ensureBool(req.prokinetic_tried, 'prokinetic_tried');
  let plan;
  if(req.diagnosis_confirmed===false) plan='continue_with_lactulose_breath_then_reassess';
  else if(req.antibiotic_tried===false) plan='continue_with_antibiotic_then_reassess';
  else if(req.elemental_diet_tried===false) plan='continue_with_elemental_diet_then_reassess';
  else if(req.prokinetic_tried===false) plan='continue_with_prokinetic_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function liver(req){
  ensureStr(req.stage, 'stage');
  ensureEnum(req.stage, 'stage', ['child_a','child_b','child_c','acute_failure','cirrhosis_compensated']);
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  ensureBool(req.ascites_present, 'ascites_present');
  ensureNumber(req.protein_intake_g, 'protein_intake_g');
  ensureBool(req.fluid_restriction_needed, 'fluid_restriction_needed');
  let plan;
  if(req.stage==='child_c' && req.ascites_present) plan='continue_with_fluid_restrict_then_reassess';
  else if(req.stage==='acute_failure') plan='continue_with_refer_transplant_then_reassess';
  else if(req.protein_intake_g<1.2) plan='continue_with_protein_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function pancreas(req){
  ensureStr(req.disease, 'disease');
  ensureEnum(req.disease, 'disease', ['acute_pancreatitis_mild','acute_pancreatitis_severe','chronic_pancreatitis','pancreatic_cancer','post_whipple','cystic_fibrosis']);
  ensureBool(req.pancreatic_enzyme_replacement, 'pancreatic_enzyme_replacement');
  ensureNumber(req.fat_intake_g, 'fat_intake_g');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureNumber(req.albumin_g_dl, 'albumin_g_dl');
  let plan;
  if(req.disease==='acute_pancreatitis_severe') plan='continue_with_npo_then_enteral_then_reassess';
  else if(req.pancreatic_enzyme_replacement===false && req.disease==='chronic_pancreatitis') plan='continue_with_pert_then_reassess';
  else if(req.fat_intake_g>=80) plan='continue_with_low_fat_then_reassess';
  else if(req.albumin_g_dl<3) plan='continue_with_protein_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {ibd,ibs,celiac,sibo,liver,pancreas};}
module.exports={funcs,CITATIONS,ValidationError};
