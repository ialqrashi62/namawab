// filepath: tier5_surg_spec_ext_103_vascular_engine.js
// TIER5_SURG_SPEC_EXT-103: Vascular surgery (AAA, carotid, PAD, bypass, EVAR)
'use strict';
const CITATIONS = ['SVS_AAA_2018','SVS_Carotid_2011','SVS_PAD_2015'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function aaa(req){
  ensureNumber(req.diameter_cm, 'diameter_cm');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.rapid_expansion, 'rapid_expansion');
  ensureBool(req.family_history, 'family_history');
  ensureNumber(req.age, 'age');
  ensureBool(req.fitness_for_open, 'fitness_for_open');
  let plan;
  if(req.diameter_cm>=5.5 || req.symptomatic) plan='continue_with_surgical_repair_or_evar';
  else if(req.rapid_expansion) plan='continue_with_urgent_repair_with_refer';
  else if(req.diameter_cm<4 && req.family_history===false) plan='continue_with_surveillance_imaging';
  else if(req.diameter_cm>=4 && req.diameter_cm<5.5) plan='continue_with_imaging_then_reassess_in_6_months';
  else plan='continue_with_observation_with_imaging';
  if(req.fitness_for_open===false) plan+='_prefer_evar';
  return {plan};
}
function carotid(req){
  ensureNumber(req.stenosis_pct, 'stenosis_pct');
  ensureBool(req.symptomatic, 'symptomatic');
  ensureBool(req.medical_optimized, 'medical_optimized');
  ensureNumber(req.age, 'age');
  ensureBool(req.surgical_high_risk, 'surgical_high_risk');
  let plan;
  if(req.symptomatic && req.stenosis_pct>=50) plan='continue_with_cea_within_2_weeks';
  else if(req.symptomatic && req.stenosis_pct>=70) plan='continue_with_cea_or_stenting_with_refer';
  else if(req.stenosis_pct>=70 && req.symptomatic===false && req.medical_optimized===false) plan='continue_with_medical_then_reassess';
  else if(req.stenosis_pct>=70 && req.medical_optimized) plan='continue_with_cea_then_refer';
  else if(req.stenosis_pct<50) plan='continue_with_medical_management';
  else plan='continue_with_imaging_then_reassess';
  if(req.surgical_high_risk) plan+='_consider_tcas';
  return {plan};
}
function pad(req){
  ensureNumber(req.abi, 'abi');
  ensureStr(req.symptom, 'symptom');
  ensureEnum(req.symptom, 'symptom', ['asymptomatic','claudication','rest_pain','tissue_loss','ulcer_or_gangrene']);
  ensureBool(req.lifestyle_tried, 'lifestyle_tried');
  ensureNumber(req.toe_pressure_mmhg, 'toe_pressure_mmhg');
  ensureBool(req.diabetic, 'diabetic');
  let plan;
  if(req.symptom==='ulcer_or_gangrene' || req.symptom==='tissue_loss') plan='continue_with_revascularization_with_refer';
  else if(req.symptom==='rest_pain') plan='continue_with_revascularization_with_refer';
  else if(req.abi<=0.4) plan='continue_with_refer_with_revascularization';
  else if(req.symptom==='claudication' && req.lifestyle_tried===false) plan='continue_with_exercise_then_reassess';
  else if(req.symptom==='claudication' && req.lifestyle_tried) plan='continue_with_refer_with_revascularization_review';
  else plan='continue_with_observation_with_risk_factor_modification';
  if(req.diabetic) plan+='_glucose_control_with_review';
  return {plan};
}
function bypass(req){
  ensureNumber(req.length_cm, 'length_cm');
  ensureStr(req.conduit, 'conduit');
  ensureEnum(req.conduit, 'conduit', ['autogenous_vein','prosthetic','cryopreserved_vein','cryopreserved_artery']);
  ensureBool(req.adequate_runoff, 'adequate_runoff');
  ensureBool(req.prior_graft, 'prior_graft');
  ensureBool(req.infection_present, 'infection_present');
  let plan;
  if(req.infection_present && req.conduit==='prosthetic') plan='avoid_then_use_autogenous_with_refer';
  else if(req.length_cm>=20 && req.adequate_runoff) plan='continue_with_vein_with_refer';
  else if(req.prior_graft) plan='continue_with_revision_with_refer';
  else plan='continue_with_planned_approach';
  return {plan};
}
function evar(req){
  ensureNumber(req.diameter_cm, 'diameter_cm');
  ensureNumber(req.neck_length_mm, 'neck_length_mm');
  ensureNumber(req.neck_diameter_mm, 'neck_diameter_mm');
  ensureNumber(req.iliac_diameter_mm, 'iliac_diameter_mm');
  ensureBool(req.hypogastric_involved, 'hypogastric_involved');
  ensureNumber(req.age, 'age');
  let plan;
  if(req.neck_length_mm<10 || req.neck_diameter_mm>32) plan='avoid_evar_then_consider_open_repair';
  else if(req.iliac_diameter_mm<7 || req.iliac_diameter_mm>22) plan='avoid_evar_then_consider_open';
  else if(req.hypogastric_involved) plan='continue_with_branched_evar_with_refer';
  else if(req.diameter_cm>=5.5) plan='continue_with_evar_with_planning';
  else plan='continue_with_observation';
  if(req.age>=80) plan+='_consider_surgical_risk';
  return {plan};
}
function amputation(req){
  ensureNumber(req.level, 'level'); // 0 toe 1 transmetatarsal 2 below knee 3 above knee
  ensureBool(req.infection_controlled, 'infection_controlled');
  ensureBool(req.pain_severe, 'pain_severe');
  ensureBool(req.functional_potential, 'functional_potential');
  ensureBool(req.revascularization_failed, 'revascularization_failed');
  ensureBool(req.life_expectancy_acceptable, 'life_expectancy_acceptable');
  let plan;
  if(req.infection_controlled===false) plan='continue_with_debridement_then_amputation';
  else if(req.revascularization_failed===false) plan='continue_with_revascularization_first';
  else if(req.functional_potential) plan='continue_with_bk_amputation_then_rehab';
  else if(req.level>=3) plan='continue_with_ak_amputation_then_rehab';
  else plan='continue_with_distal_amputation_then_wound_care';
  if(req.pain_severe) plan+='_pain_management_with_review';
  return {plan};
}
function funcs(){return {aaa,carotid,pad,bypass,evar,amputation};}
module.exports={funcs,CITATIONS,ValidationError};
