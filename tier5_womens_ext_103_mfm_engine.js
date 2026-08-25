// filepath: tier5_womens_ext_103_mfm_engine.js
// TIER5_WOMENS_EXT-103: Maternal fetal medicine (preeclampsia, GDM, PTL, multiples, cervical)
'use strict';
const CITATIONS = ['ACOG_Preeclampsia_2020','ADA_GDM_2023','SMFM_PTL_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function preeclampsia(req){
  ensureNumber(req.systolic_bp, 'systolic_bp');
  ensureNumber(req.diastolic_bp, 'diastolic_bp');
  ensureNumber(req.proteinuria_g_24h, 'proteinuria_g_24h');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.severe_features, 'severe_features');
  ensureBool(req.hellp_suspected, 'hellp_suspected');
  let plan;
  if(req.hellp_suspected) plan='severe_then_magnesium_sulfate_then_plan_delivery';
  else if(req.severe_features && req.gestational_age_weeks>=34) plan='severe_then_magnesium_then_plan_delivery_at_34_weeks';
  else if(req.systolic_bp>=160 || req.diastolic_bp>=110) plan='severe_then_magnesium_sulfate_then_consider_delivery_vs_expectant';
  else if(req.systolic_bp>=140 && req.proteinuria_g_24h>0.3) plan='preeclampsia_then_continue_with_close_monitoring_and_antihypertensives';
  else plan='continue_with_observation';
  if(req.gestational_age_weeks<37) plan+='_consider_steroids_for_lungs';
  return {plan};
}
function gdm(req){
  ensureNumber(req.ga_weeks_diagnosis, 'ga_weeks_diagnosis');
  ensureNumber(req.fasting_glucose_mg_dl, 'fasting_glucose_mg_dl');
  ensureNumber(req.one_hour_glucose_mg_dl, 'one_hour_glucose_mg_dl');
  ensureNumber(req.three_hour_glucose_fasting_mg_dl, 'three_hour_glucose_fasting_mg_dl');
  ensureBool(req.fetal_macrosomia_present, 'fetal_macrosomia_present');
  ensureNumber(req.hba1c_pct, 'hba1c_pct');
  let plan;
  if(req.three_hour_glucose_fasting_mg_dl>=95) plan='gdm_confirmed_then_medical_nutrition_therapy_with_glucose_monitoring';
  else if(req.fasting_glucose_mg_dl>=126) plan='overt_diabetes_then_refer_endocrine_with_insulin_protocol';
  else if(req.fetal_macrosomia_present) plan='consider_insulin_therapy_with_fetal_growth_ultrasound';
  else plan='continue_with_observation_and_repeat_testing';
  if(req.hba1c_pct>=6.5) plan='overt_diabetes_then_refer_endocrine_and_ophthalmology';
  return {plan};
}
function preterm_labor(req){
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.cervical_length_mm, 'cervical_length_mm');
  ensureBool(req.regular_contractions, 'regular_contractions');
  ensureBool(req.ffn_positive, 'ffn_positive');
  ensureBool(req.cerclage_present, 'cerclage_present');
  ensureBool(req.prior_preterm, 'prior_preterm');
  let plan;
  if(req.gestational_age_weeks>=34) plan='late_ptl_then_prepare_for_delivery';
  else if(req.cervical_length_mm<25 && req.ffn_positive) plan='high_risk_then_consider_antenatal_steroids_and_tocolysis';
  else if(req.cervical_length_mm<25 && req.cerclage_present===false) plan='consider_cerclage_with_progesterone';
  else if(req.prior_preterm) plan='continue_with_progesterone_then_reassess';
  else plan='continue_with_observation_and_reassess_cervix';
  if(req.regular_contractions && req.gestational_age_weeks<34) plan='tocolysis_then_consider_magnesium_for_neuroprotection';
  return {plan};
}
function multiples(req){
  ensureNumber(req.count, 'count');
  ensureNumber(req.chorionicity, 'chorionicity'); // 1 mono-mono, 2 mono-di, 3 di-di
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.ttts_present, 'ttts_present');
  ensureBool(req.siugr_present, 'siugr_present');
  let plan;
  if(req.count===1) plan='singleton_then_standard_care';
  else if(req.count>=3) plan='higher_order_then_refer_mfm_with_intensive_surveillance';
  else if(req.ttts_present) plan='consider_laser_ablation_with_serial_amniocenteses';
  else if(req.siugr_present) plan='serial_growth_scans_then_refer_mfm';
  else if(req.chorionicity===1) plan='mono_mono_then_continuous_monitoring_with_inpatient_at_24_to_28_weeks';
  else if(req.chorionicity===2) plan='mono_di_then_every_2_weeks_growth_then_refer_mfm';
  else plan='di_di_then_every_4_weeks_growth_then_continue';
  return {plan};
}
function cervical_insufficiency(req){
  ensureNumber(req.prior_loss_trimester, 'prior_loss_trimester');
  ensureNumber(req.current_cl_mm, 'current_cl_mm');
  ensureBool(req.cerclage_history, 'cerclage_history');
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  let plan;
  if(req.gestational_age_weeks>=24) plan='beyond_window_for_cerclage_then_continue_with_progesterone';
  else if(req.prior_loss_trimester===2 && req.current_cl_mm<25) plan='history_indicated_cerclage_then_offer_tvt';
  else if(req.current_cl_mm<10) plan='physical_exam_indicated_cerclage_then_offer_rescue_cerclage';
  else plan='continue_with_progesterone_and_serial_cl_measurements';
  return {plan};
}
function fetal_growth(req){
  ensureNumber(req.efw_grams, 'efw_grams');
  ensureNumber(req.ga_weeks, 'ga_weeks');
  ensureNumber(req.ua_doppler, 'ua_doppler');
  ensureNumber(req.mca_doppler, 'mca_doppler');
  ensureBool(req.fetal_movement_adequate, 'fetal_movement_adequate');
  ensureBool(req.oligohydramnios, 'oligohydramnios');
  let plan;
  if(req.efw_grams<500 && req.ga_weeks>=24) plan='fgr_then_refer_mfm_then_consider_delivery';
  else if(req.ua_doppler>=3) plan='abnormal_ua_doppler_then_consider_delivery';
  else if(req.oligohydramnios) plan='oligohydramnios_then_consider_amnioinfusion_or_delivery';
  else plan='continue_with_surveillance_then_reassess_in_2_weeks';
  return {plan};
}
function funcs(){return {preeclampsia,gdm,preterm_labor,multiples,cervical_insufficiency,fetal_growth};}
module.exports={funcs,CITATIONS,ValidationError};
