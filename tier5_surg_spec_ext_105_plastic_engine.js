// filepath: tier5_surg_spec_ext_105_plastic_engine.js
// TIER5_SURG_SPEC_EXT-105: Plastic / reconstructive (flap, microvascular, burns, cleft)
'use strict';
const CITATIONS = ['ASPS_Flaps_2020','ASPS_Microsurgery_2019','WHO_Burn_Reconstruction_2018'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function flap_selection(req){
  ensureStr(req.defect_site, 'defect_site');
  ensureEnum(req.defect_site, 'defect_site', ['head_neck','breast','chest_wall','abdomen','upper_extremity','lower_extremity','perineum','back']);
  ensureNumber(req.defect_size_cm2, 'defect_size_cm2');
  ensureBool(req.pedicle_flap_required, 'pedicle_flap_required');
  ensureBool(req.microvascular_anastomosis_required, 'microvascular_anastomosis_required');
  ensureBool(req.smoker, 'smoker');
  let plan;
  if(req.defect_size_cm2>=100 && req.microvascular_anastomosis_required) plan='free_flap_then_refer_microsurgery';
  else if(req.pedicle_flap_required) plan='pedicle_flap_then_refer_reconstruction';
  else if(req.defect_site==='breast') plan='diep_or_tram_then_refer_microsurgery';
  else if(req.defect_site==='head_neck') plan='anterolateral_thigh_then_refer_microsurgery';
  else plan='local_flap_then_refer';
  if(req.smoker) plan+='_smoking_cessation_required';
  return {plan};
}
function microvascular_free_flap(req){
  ensureBool(req.arterial_anastomosis_ok, 'arterial_anastomosis_ok');
  ensureBool(req.venous_anastomosis_ok, 'venous_anastomosis_ok');
  ensureNumber(req.flap_temperature_c, 'flap_temperature_c');
  ensureNumber(req.doppler_signal, 'doppler_signal');
  ensureBool(req.capillary_refill_2s, 'capillary_refill_2s');
  ensureBool(req.smoker, 'smoker');
  let plan;
  if(!req.arterial_anastomosis_ok) plan='urgent_then_re_operative_exploration';
  else if(!req.venous_anastomosis_ok) plan='urgent_then_venous_congestion_with_re_operative';
  else if(req.flap_temperature_c<32) plan='continue_with_monitoring_then_re_operative';
  else if(req.capillary_refill_2s===false) plan='continue_with_monitoring_then_re_operative';
  else plan='continue_with_postop_protocol_with_monitoring';
  if(req.smoker) plan+='_smoking_cessation_review';
  return {plan};
}
function breast_reconstruction(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['immediate_dti','immediate_tissue_expander','delayed_implant','delayed_autologous','revision','symmetrization']);
  ensureBool(req.radiation_planned, 'radiation_planned');
  ensureBool(req.smoker, 'smoker');
  ensureNumber(req.bmi, 'bmi');
  ensureBool(req.diabetic, 'diabetic');
  let plan;
  if(req.radiation_planned && req.type==='immediate_dti') plan='avoid_dti_then_consider_delayed_reconstruction';
  else if(req.type==='immediate_tissue_expander') plan='continue_with_tissue_expander_then_post_mastectomy_radiation';
  else if(req.type==='delayed_autologous' && req.bmi<22) plan='continue_with_autologous_then_refer_microsurgery';
  else plan='continue_with_planned_approach';
  if(req.smoker) plan+='_smoking_cessation';
  if(req.diabetic && req.bmi>=35) plan+='_consider_delayed_approach';
  return {plan};
}
function cleft_repair(req){
  ensureStr(req.cleft_type, 'cleft_type');
  ensureEnum(req.cleft_type, 'cleft_type', ['unilateral_lip','bilateral_lip','alveolus','hard_palate','soft_palate','complete']);
  ensureNumber(req.age_months, 'age_months');
  ensureNumber(req.weight_kg, 'weight_kg');
  ensureBool(req.associated_anomalies, 'associated_anomalies');
  let plan;
  if(req.cleft_type.includes('lip') && req.age_months>=3 && req.weight_kg>=5) plan='continue_with_cheiloplasty_then_assess_for_palate_repair';
  else if(req.cleft_type.includes('palate') && req.age_months>=12) plan='continue_with_palatoplasty_then_speech_evaluation';
  else if(req.associated_anomalies) plan='continue_with_genetic_workup_then_refer_cleft_team';
  else plan='continue_with_nasoalveolar_molding_then_surgical_planning';
  return {plan};
}
function burn_reconstruction(req){
  ensureNumber(req.burn_age_months, 'burn_age_months');
  ensureBool(req.scar_contracture, 'scar_contracture');
  ensureBool(req.joint_involvement, 'joint_involvement');
  ensureBool(req.pressure_garment_worn, 'pressure_garment_worn');
  ensureNumber(req.rom_limited_pct, 'rom_limited_pct');
  ensureBool(req.z_plasty_needed, 'z_plasty_needed');
  let plan;
  if(req.scar_contracture && req.joint_involvement) plan='refer_plastic_surgery_for_release';
  else if(req.rom_limited_pct>=50) plan='continue_with_intensive_therapy_with_referral';
  else if(req.z_plasty_needed) plan='refer_for_z_plasty_with_pressure_garment_continuation';
  else plan='continue_with_pressure_garment_then_reassess';
  return {plan};
}
function hand_trauma(req){
  ensureStr(req.structure, 'structure');
  ensureEnum(req.structure, 'structure', ['nerve','tendon','vessel','bone','composite','amputation']);
  ensureNumber(req.hours_since_injury, 'hours_since_injury');
  ensureBool(req.contaminated, 'contaminated');
  ensureBool(req.microsurgery_candidate, 'microsurgery_candidate');
  ensureBool(req.smoker, 'smoker');
  let plan;
  if(req.structure==='amputation' && req.microsurgery_candidate) plan='replantation_then_microsurgery';
  else if(req.structure==='nerve' && req.hours_since_injury<=24) plan='urgent_then_nerve_repair_within_24_hours';
  else if(req.structure==='tendon' && req.contaminated) plan='urgent_then_tendon_repair_with_debridement';
  else if(req.structure==='vessel') plan='urgent_then_microvascular_repair';
  else plan='continue_with_reconstruction_planning';
  if(req.smoker) plan+='_smoking_cessation';
  return {plan};
}
function funcs(){return {flap_selection,microvascular_free_flap,breast_reconstruction,cleft_repair,burn_reconstruction,hand_trauma};}
module.exports={funcs,CITATIONS,ValidationError};
