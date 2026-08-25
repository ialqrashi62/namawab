// filepath: tier5_lab_adv_ext_104_chemistry_engine.js
// TIER5_LAB_ADV_EXT-104: Clinical chemistry (tox screen, TDM, urine, fluids)
'use strict';
const CITATIONS = ['TDM_Guidelines_2019','CAP_Chemistry_2020','AACC_TDM_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function tox_screen(req){
  ensureStr(req.substance, 'substance');
  ensureEnum(req.substance, 'substance', ['acetaminophen','salicylate','methanol','ethylene_glycol','iron','lithium','digoxin','theophylline','valproic_acid','phenytoin','opioid','benzodiazepine','cocaine','amphetamine','methamphetamine','thc','alcohol']);
  ensureNumber(req.level, 'level');
  ensureNumber(req.time_post_ingestion_hours, 'time_post_ingestion_hours');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.symptomatic, 'symptomatic');
  let plan;
  if(req.substance==='acetaminophen' && req.level>=150) plan='continue_with_nac_then_reassess';
  else if(req.substance==='salicylate' && req.level>=30) plan='continue_with_na_bicarb_then_reassess';
  else if(req.substance==='methanol' && req.level>=20) plan='continue_with_ethanol_or_fomepizole_then_dialysis';
  else if(req.substance==='iron' && req.level>=500) plan='continue_with_iv_desferrioxamine';
  else if(req.substance==='digoxin' && req.level>=2) plan='continue_with_digoxin_fab_then_reassess';
  else if(req.substance==='lithium' && req.level>=1.5) plan='continue_with_dialysis_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.symptomatic) plan+='_urgent_refer_poison_control';
  return {plan};
}
function tdm(req){
  ensureStr(req.drug, 'drug');
  ensureEnum(req.drug, 'drug', ['vancomycin','gentamicin','tobramycin','amikacin','phenytoin','valproic_acid','carbamazepine','phenobarbital','theophylline','digoxin','cyclosporine','tacrolimus','sirolimus','methotrexate','busulfan']);
  ensureNumber(req.trough_ng_ml, 'trough_ng_ml');
  ensureNumber(req.peak_ng_ml, 'peak_ng_ml');
  ensureBool(req.renal_impairment, 'renal_impairment');
  ensureNumber(req.days_on_drug, 'days_on_drug');
  let plan;
  if(req.drug==='vancomycin' && req.trough_ng_ml<10) plan='continue_with_dose_increase_then_reassess';
  else if(req.drug==='vancomycin' && req.trough_ng_ml>20) plan='continue_with_dose_reduction_then_reassess';
  else if(req.drug==='gentamicin' && req.trough_ng_ml>=2) plan='continue_with_dose_reduction_then_reassess';
  else if(req.drug==='tacrolimus' && req.trough_ng_ml<5) plan='continue_with_dose_increase_then_reassess';
  else if(req.drug==='tacrolimus' && req.trough_ng_ml>15) plan='continue_with_dose_reduction_then_reassess';
  else plan='continue_with_observation_then_reassess';
  if(req.renal_impairment) plan+='_consider_extended_interval';
  return {plan};
}
function urinalysis(req){
  ensureStr(req.specimen_type, 'specimen_type');
  ensureEnum(req.specimen_type, 'specimen_type', ['clean_catch','catheterized','suprapubic','bag','ileal_conduit']);
  ensureStr(req.findings, 'findings');
  ensureEnum(req.findings, 'findings', ['normal','proteinuria','hematuria','glycosuria','ketonuria','nitrite_positive','leukocyte_esterase_positive','bacteriuria','crystals','casts','ph_high','ph_low']);
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.contamination_suspected, 'contamination_suspected');
  let plan;
  if(req.findings==='bacteriuria' && req.symptomatic) plan='continue_with_treatment_then_reassess';
  else if(req.findings==='bacteriuria' && req.symptomatic===false) plan='continue_with_observation_then_reassess';
  else if(req.findings==='proteinuria') plan='continue_with_quantification_then_reassess';
  else if(req.findings==='hematuria') plan='continue_with_imaging_then_urine_cytology';
  else plan='continue_with_observation_then_reassess';
  if(req.contamination_suspected) plan+='_repeat_with_clean_catch';
  return {plan};
}
function body_fluid(req){
  ensureStr(req.fluid_type, 'fluid_type');
  ensureEnum(req.fluid_type, 'fluid_type', ['pleural','peritoneal','pericardial','csf','synovial','drainage','ascites','amniotic']);
  ensureNumber(req.cell_count, 'cell_count');
  ensureNumber(req.protein_g_dl, 'protein_g_dl');
  ensureNumber(req.glucose_mg_dl, 'glucose_mg_dl');
  ensureNumber(req.serum_glucose_mg_dl, 'serum_glucose_mg_dl');
  ensureStr(req.gradient, 'gradient');
  ensureEnum(req.gradient, 'gradient', ['transudate','exudate_light_ambiguous','exudate_by_lights','exudate_by_protein','exudate_by_glucose','inconclusive']);
  let plan;
  if(req.fluid_type==='pleural' && req.gradient==='exudate_by_lights') plan='continue_with_imaging_then_refer_pulm';
  else if(req.fluid_type==='peritoneal') plan='continue_with_saag_then_refer';
  else if(req.fluid_type==='csf') plan='continue_with_culture_then_reassess';
  else if(req.fluid_type==='synovial') plan='continue_with_crystal_analysis_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function hormone_assay(req){
  ensureStr(req.hormone, 'hormone');
  ensureEnum(req.hormone, 'hormone', ['tsh','free_t4','cortisol_am','cortisol_pm','acth','lh','fsh','estradiol','testosterone_total','testosterone_free','prolactin','igf1','dheas','shbg','renin','aldosterone','pth','vitamin_d_25oh']);
  ensureNumber(req.value, 'value');
  ensureNumber(req.reference_low, 'reference_low');
  ensureNumber(req.reference_high, 'reference_high');
  ensureStr(req.gender, 'gender');
  ensureEnum(req.gender, 'gender', ['male','female','other']);
  let plan;
  if(req.value<req.reference_low) plan='continue_with_workup_then_reassess';
  else if(req.value>req.reference_high) plan='continue_with_workup_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function tumor_marker(req){
  ensureStr(req.marker, 'marker');
  ensureEnum(req.marker, 'marker', ['cea','ca_19_9','ca_125','ca_15_3','psa','afp','hcg','ldh','chromogranin_a','calcitonin','thyroglobulin','beta_2_microglobulin']);
  ensureNumber(req.value, 'value');
  ensureNumber(req.baseline_value, 'baseline_value');
  ensureBool(req.trending, 'trending');
  ensureBool(req.imaging_concordant, 'imaging_concordant');
  let plan;
  if(req.trending && req.imaging_concordant) plan='continue_with_refer_oncology_with_imaging';
  else if(req.trending && req.imaging_concordant===false) plan='continue_with_imaging_then_reassess';
  else if(req.value>baseline_value*2) plan='continue_with_repeat_then_refer';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {tox_screen,tdm,urinalysis,body_fluid,hormone_assay,tumor_marker};}
module.exports={funcs,CITATIONS,ValidationError};
