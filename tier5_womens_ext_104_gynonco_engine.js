// filepath: tier5_womens_ext_104_gynonco_engine.js
// TIER5_WOMENS_EXT-104: Gynecologic oncology (cervical, ovarian, endometrial, vulvar)
'use strict';
const CITATIONS = ['NCCN_Cervical_2023','NCCN_Ovarian_2023','SGO_Endometrial_2022'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function cervical_screening(req){
  ensureNumber(req.age, 'age');
  ensureStr(req.last_hpv_status, 'last_hpv_status');
  ensureEnum(req.last_hpv_status, 'last_hpv_status', ['negative','hpv_16_18','hpv_other_hr','hpv_unknown','positive_unspecified','inadequate']);
  ensureStr(req.last_cytology, 'last_cytology');
  ensureEnum(req.last_cytology, 'last_cytology', ['nilm','ascus','lsil','hsil','asc_h','agc','unsatisfactory','unknown']);
  ensureBool(req.hpv_vaccinated, 'hpv_vaccinated');
  let plan;
  if(req.age>=30 && req.last_hpv_status==='negative' && req.last_cytology==='nilm') plan='co_testing_normal_then_routine_screening_in_5_years';
  else if(req.last_hpv_status==='hpv_16_18') plan='colposcopy_then_refer_gyne_oncology';
  else if(req.last_cytology==='hsil') plan='colposcopy_then_refer_gyne_oncology';
  else if(req.last_cytology==='agc') plan='colposcopy_with_endometrial_biopsy_then_refer';
  else if(req.last_cytology==='ascus' && req.last_hpv_status==='positive_unspecified') plan='colposcopy_then_reassess';
  else plan='continue_with_screening_then_genetic_counsel_if_high_risk';
  return {plan};
}
function ovarian_mass(req){
  ensureNumber(req.mass_size_cm, 'mass_size_cm');
  ensureNumber(req.ca_125_u_ml, 'ca_125_u_ml');
  ensureBool(req.bilaterality, 'bilaterality');
  ensureNumber(req.solid_components_pct, 'solid_components_pct');
  ensureNumber(req.ascites_present, 'ascites_present'); // 0 absent 1 present
  let risk;
  if(req.mass_size_cm>=10 && req.solid_components_pct>=70) risk='high_risk_malignancy_then_refer_gyne_oncology';
  else if(req.ca_125_u_ml>=200 && req.ascites_present===1) risk='high_risk_then_refer_gyne_oncology';
  else if(req.bilaterality && req.solid_components_pct>50) risk='moderate_risk_then_oophorectomy_with_frozen_section';
  else if(req.mass_size_cm<5 && req.solid_components_pct<30) risk='likely_benign_then_observation_with_serial_us';
  else risk='indeterminate_then_refer_gyne_oncology_with_mri';
  return {risk};
}
function endometrial(req){
  ensureNumber(req.age, 'age');
  ensureBool(req.postmenopausal_bleeding, 'postmenopausal_bleeding');
  ensureBool(req.abnormal_uterine_bleeding, 'abnormal_uterine_bleeding');
  ensureBool(req.thickened_endometrium, 'thickened_endometrium');
  ensureBool(req.lynch_syndrome_suspected, 'lynch_syndrome_suspected');
  ensureNumber(req.bmi, 'bmi');
  let plan;
  if(req.postmenopausal_bleeding) plan='endometrial_biopsy_then_refer_gyne_oncology';
  else if(req.abnormal_uterine_bleeding && req.age>=45) plan='endometrial_biopsy_then_reassess';
  else if(req.thickened_endometrium && req.postmenopausal_bleeding===false) plan='biopsy_with_us_then_reassess';
  else if(req.lynch_syndrome_suspected) plan='surveillance_then_refer_genetic_counsel';
  else plan='continue_with_risk_factor_modification';
  if(req.bmi>=30) plan+='_weight_management_5_to_10_percent';
  return {plan};
}
function vulvar(req){
  ensureNumber(req.lesion_size_cm, 'lesion_size_cm');
  ensureBool(req.ulceration_present, 'ulceration_present');
  ensureNumber(req.location, 'location'); // 1 labial, 2 perineal, 3 clitoris, 4 periurethral
  ensureBool(req.inguinal_lymphadenopathy, 'inguinal_lymphadenopathy');
  ensureBool(req.vin_lichen_present, 'vin_lichen_present');
  let plan;
  if(req.lesion_size_cm>=2 && req.ulceration_present) plan='suspicious_then_punch_biopsy_with_refer_gyne_oncology';
  else if(req.inguinal_lymphadenopathy) plan='lymph_node_biopsy_then_refer_gyne_oncology';
  else if(req.vin_lichen_present) plan='topical_then_close_follow_up_with_photography';
  else plan='continue_with_close_observation_then_consider_biopsy_if_persistent';
  return {plan};
}
function gestational_trophoblastic(req){
  ensureNumber(req.beta_hcg, 'beta_hcg');
  ensureBool(req.molar_pregnancy_suspected, 'molar_pregnancy_suspected');
  ensureNumber(req.uterine_size_weeks, 'uterine_size_weeks');
  ensureBool(req.theca_lutein_cysts, 'theca_lutein_cysts');
  ensureBool(req.metastasis_present, 'metastasis_present');
  let risk;
  if(req.molar_pregnancy_suspected && req.metastasis_present) risk='high_risk_gtn_then_chemotherapy_protocol';
  else if(req.molar_pregnancy_suspected) risk='gtn_then_suction_d_then_followup_hcg';
  else if(req.beta_hcg>100000 && req.uterine_size_weeks>=req.gestational_age_weeks_pretopost_normal) risk='consider_molar_then_d_then_surveillance';
  else risk='continue_with_surveillance_then_reassess';
  return {risk};
}
function cancer_followup(req){
  ensureStr(req.cancer_type, 'cancer_type');
  ensureEnum(req.cancer_type, 'cancer_type', ['cervical','ovarian','endometrial','vulvar','vaginal','fallopian_tube']);
  ensureNumber(req.months_post_treatment, 'months_post_treatment');
  ensureBool(req.symptom_recurrence, 'symptom_recurrence');
  ensureBool(req.imaging_recent, 'imaging_recent');
  ensureBool(req.tumor_marker_elevated, 'tumor_marker_elevated');
  let plan;
  if(req.symptom_recurrence || req.tumor_marker_elevated) plan='suspicious_recurrence_then_imaging_and_biopsy';
  else if(req.months_post_treatment<24) plan='continue_with_close_surveillance_then_imaging_per_protocol';
  else plan='continue_with_routine_surveillance_then_reassess_in_3_months';
  return {plan};
}
function funcs(){return {cervical_screening,ovarian_mass,endometrial,vulvar,gestational_trophoblastic,cancer_followup};}
module.exports={funcs,CITATIONS,ValidationError};
