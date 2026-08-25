// filepath: tier5_womens_ext_101_reproendo_engine.js
// TIER5_WOMENS_EXT-101: Reproductive endocrinology (PCOS, amenorrhea, infertility)
'use strict';
const CITATIONS = ['ASRM_PCOS_2018','ASRM_Infertility_2019','Endocrine_Society_Amenorrhea_2017'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function pcos(req){
  ensureBool(req.oligomenorrhea, 'oligomenorrhea');
  ensureBool(req.hyperandrogenism_clinical, 'hyperandrogenism_clinical');
  ensureBool(req.pcos_on_us, 'pcos_on_us');
  ensureNumber(req.amh_ng_ml, 'amh_ng_ml');
  ensureNumber(req.bmi, 'bmi');
  let plan;
  if(req.oligomenorrhea && (req.hyperandrogenism_clinical || req.pcos_on_us)) plan='rotterdam_criteria_met_then_lifestyle_first_line_with_letrozole_for_fertility';
  else if(req.amh_ng_ml>10) plan='consider_ovarian_reserve_review_then_re_check_amh_in_3_months';
  else plan='continue_with_observation_and_reassess_in_6_months';
  if(req.bmi>=30) plan+='_weight_loss_5_to_10_percent_then_reassess';
  return {plan};
}
function amenorrhea(req){
  ensureStr(req.cause, 'cause');
  ensureEnum(req.cause, 'cause', ['primary_amenorrhea','secondary_pregnancy','secondary_hypothalamic','secondary_pituitary','secondary_ovarian_failure','secondary_outflow','secondary_unknown']);
  ensureBool(req.pregnancy_test_done, 'pregnancy_test_done');
  ensureNumber(req.fsh_miu_ml, 'fsh_miu_ml');
  ensureNumber(req.prolactin_ng_ml, 'prolactin_ng_ml');
  ensureBool(req.hypothalamic_suppression_suspected, 'hypothalamic_suppression_suspected');
  let plan;
  if(req.cause==='secondary_pregnancy') plan='pregnancy_confirmed_then_initiate_prenatal_care';
  else if(req.cause==='secondary_hypothalamic') plan='evaluate_energy_availability_then_refer_psychology_nutrition';
  else if(req.fsh_miu_ml>25) plan='primary_ovarian_insufficiency_then_refer_reproductive_endocrinology_and_consider_hrt';
  else if(req.prolactin_ng_ml>25) plan='review_prolactinemia_then_mri_pituitary_then_cabergoline_consideration';
  else if(req.cause==='primary_amenorrhea') plan='karyotype_review_then_refer_reproductive_endocrinology';
  else plan='continue_with_workup_then_reassess_in_3_months';
  if(!req.pregnancy_test_done) plan='pregnancy_test_required_first';
  return {plan};
}
function infertility(req){
  ensureNumber(req.cycle_day, 'cycle_day');
  ensureBool(req.ovulatory_documented, 'ovulatory_documented');
  ensureNumber(req.sperm_concentration_m_per_ml, 'sperm_concentration_m_per_ml');
  ensureNumber(req.sperm_motility_pct, 'sperm_motility_pct');
  ensureNumber(req.tubal_patency_confirmed, 'tubal_patency_confirmed'); // 0 not tested 1 patent 2 not patent
  ensureNumber(req.female_age, 'female_age');
  let plan;
  if(req.female_age>=35 && req.ovulatory_documented===false) plan='urgent_referral_then_ovulation_induction_with_letrozole';
  else if(req.sperm_concentration_m_per_ml<15) plan='refer_male_infertility_then_consider_icsi';
  else if(req.tubal_patency_confirmed===2) plan='consider_laparoscopy_or_ivf';
  else plan='continue_with_timed_intercourse_or_iui_for_3_to_6_cycles';
  return {plan};
}
function ovarian_reserve(req){
  ensureNumber(req.age, 'age');
  ensureNumber(req.amh_ng_ml, 'amh_ng_ml');
  ensureNumber(req.afc_count, 'afc_count');
  ensureNumber(req.day_3_fsh_miu_ml, 'day_3_fsh_miu_ml');
  ensureNumber(req.day_3_estradiol_pg_ml, 'day_3_estradiol_pg_ml');
  let reserve;
  if(req.amh_ng_ml<1 && req.afc_count<5) reserve='diminished_ovarian_reserve_then_consider_fertility_preservation_or_donor_eggs';
  else if(req.amh_ng_ml>3.5 && req.afc_count>15) reserve='high_ovarian_reserve_then_watch_for_ohss';
  else reserve='normal_ovarian_reserve_then_continue_planning';
  if(req.day_3_fsh_miu_ml>10) reserve+='_consider_poor_response_likelihood';
  if(req.age>=38) reserve+='_age_factor_then_refer_quickly';
  return {reserve};
}
function recurrent_loss(req){
  ensureNumber(req.losses_count, 'losses_count');
  ensureNumber(req.live_births_count, 'live_births_count');
  ensureBool(req.karyotype_done, 'karyotype_done');
  ensureBool(req.uterine_anatomy_imaged, 'uterine_anatomy_imaged');
  ensureBool(req.apls_workup_done, 'apls_workup_done');
  ensureBool(req.anti_phospholipid_positive, 'anti_phospholipid_positive');
  let plan;
  if(req.losses_count>=3) plan='rpl_workup_then_reproductive_endocrinology_review';
  else if(req.losses_count>=2 && req.apls_workup_done===false) plan='aps_and_thrombophilia_workup_with_anticoagulation_review';
  else if(req.uterine_anatomy_imaged===false) plan='sonohysterogram_or_mri_then_correct_anomalies';
  else if(req.karyotype_done===false) plan='parental_karyotype_then_refer_genetic_counsel';
  else plan='continue_with_preconception_counseling';
  if(req.anti_phospholipid_positive) plan='low_dose_aspirin_plus_lmwh_then_refer_mfm';
  return {plan};
}
function endocrine_misc(req){
  ensureStr(req.diagnosis, 'diagnosis');
  ensureEnum(req.diagnosis, 'diagnosis', ['hirsutism','galactorrhea','premenstrual_dysphoric_disorder','sexual_dysfunction','hyperprolactinemia','thyroid_in_pregnancy']);
  ensureBool(req.workup_completed, 'workup_completed');
  ensureBool(req.partner_evaluation_done, 'partner_evaluation_done');
  ensureNumber(req.cycle_day, 'cycle_day');
  let plan;
  if(req.diagnosis==='hirsutism') plan='spironolactone_or_combined_ocp_then_reassess_in_3_months';
  else if(req.diagnosis==='galactorrhea') plan='prolactin_then_mri_pituitary_consider';
  else if(req.diagnosis==='premenstrual_dysphoric_disorder') plan='ssri_or_combined_ocp_then_reassess';
  else if(req.diagnosis==='hyperprolactinemia') plan='cabergoline_then_reassess';
  else if(req.diagnosis==='thyroid_in_pregnancy') plan='levothyroxine_then_target_tsh_below_2_5';
  else plan='continue_with_workup_then_refer_endocrinology';
  return {plan};
}
function funcs(){return {pcos,amenorrhea,infertility,ovarian_reserve,recurrent_loss,endocrine_misc};}
module.exports={funcs,CITATIONS,ValidationError};
