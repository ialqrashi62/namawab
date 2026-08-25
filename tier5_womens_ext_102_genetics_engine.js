// filepath: tier5_womens_ext_102_genetics_engine.js
// TIER5_WOMENS_EXT-102: Prenatal genetics (NIPT, amnio, CVS, carrier screening, aneuploidy)
'use strict';
const CITATIONS = ['ACOG_Prenatal_Genetics_2020','ACMG_NIPT_2016','SMFM_Amniocentesis_2014'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function nipt(req){
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureStr(req.result, 'result');
  ensureEnum(req.result, 'result', ['low_risk','high_risk_trisomy_21','high_risk_trisomy_18','high_risk_trisomy_13','high_risk_sex_chromosome','no_result']);
  ensureNumber(req.ff_pct, 'ff_pct');
  ensureBool(req.first_trimester, 'first_trimester');
  let plan;
  if(req.result==='low_risk') plan='continue_routine_prenatal_care';
  else if(req.result==='no_result' && req.ff_pct<4) plan='repeat_nipt_in_2_weeks_or_consider_diagnostic_testing';
  else if(req.result.startsWith('high_risk')) plan='genetic_counseling_then_offer_cvs_or_amniocentesis';
  else plan='continue_with_workup';
  if(req.gestational_age_weeks<10) plan='defer_nipt_until_after_10_weeks';
  return {plan};
}
function amnio(req){
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureNumber(req.amniotic_fluid_volume_ml, 'amniotic_fluid_volume_ml');
  ensureBool(req.multiple_gestation, 'multiple_gestation');
  ensureBool(req.blood_group_isoimmunization, 'blood_group_isoimmunization');
  ensureBool(req.hiv_positive, 'hiv_positive');
  ensureNumber(req.maternal_bmi, 'maternal_bmi');
  let risk;
  if(req.gestational_age_weeks<15) risk='too_early_then_defer_until_15_weeks';
  else if(req.maternal_bmi>=35) risk='higher_failure_rate_then_consider_early_amniocentesis_with_genetic_counsel';
  else if(req.blood_group_isoimmunization) risk='risk_of_amnio_then_consider_alternative';
  else if(req.hiv_positive) risk='risk_of_hiv_transmission_then_consider_alternative';
  else if(req.multiple_gestation) risk='continue_with_amnio_for_each_fetus_separately';
  else risk='standard_amnio_risk_then_continue_with_procedure';
  return {risk};
}
function cvs(req){
  ensureNumber(req.gestational_age_weeks, 'gestational_age_weeks');
  ensureBool(req.multiple_gestation, 'multiple_gestation');
  ensureBool(req.active_bleeding, 'active_bleeding');
  ensureNumber(req.beta_hcg, 'beta_hcg');
  let plan;
  if(req.gestational_age_weeks<10) plan='too_early_then_defer_until_10_to_13_weeks';
  else if(req.gestational_age_weeks>13) plan='consider_amniocentesis_instead';
  else if(req.active_bleeding) plan='defer_cvs_then_evaluate_bleeding';
  else plan='continue_with_cvs_then_genetic_counsel';
  return {plan};
}
function carrier_screening(req){
  ensureStr(req.ethnicity, 'ethnicity');
  ensureEnum(req.ethnicity, 'ethnicity', ['cystic_fibrosis','sickle_cell','thalassemia_alpha','thalassemia_beta','tay_sachs','fragile_x','spinal_muscular_atrophy','duchenne','pku','general_population']);
  ensureBool(req.partner_screened, 'partner_screened');
  ensureBool(req.family_history_present, 'family_history_present');
  ensureBool(req.expanded_panel_done, 'expanded_panel_done');
  let plan;
  if(req.partner_screened===false) plan='screen_partner_first_then_genetic_counsel';
  else if(req.expanded_panel_done===false) plan='consider_expanded_panel_then_reassess';
  else if(req.family_history_present) plan='targeted_testing_then_genetic_counsel';
  else plan='standard_counseling_then_continue_with_preconception_review';
  return {plan};
}
function aneuploidy_workup(req){
  ensureNumber(req.nt_mm, 'nt_mm'); // nuchal translucency
  ensureBool(req.first_trimester_screening_done, 'first_trimester_screening_done');
  ensureBool(req.second_trimester_screening_done, 'second_trimester_screening_done');
  ensureNumber(req.beta_hcg_mom, 'beta_hcg_mom');
  ensureNumber(req.papp_a_mom, 'papp_a_mom');
  ensureBool(req.cf_dna_done, 'cf_dna_done');
  let risk;
  if(req.nt_mm>=3.5) risk='high_nt_then_offer_cvs_or_amniocentesis';
  else if(req.cf_dna_done && (req.beta_hcg_mom>2 || req.papp_a_mom<0.5)) risk='screen_positive_then_offer_diagnostic_testing';
  else if(req.first_trimester_screening_done===false && req.second_trimester_screening_done===false) risk='screen_first_then_reassess';
  else risk='continue_with_standard_follow_up';
  return {risk};
}
function preconception_genetic(req){
  ensureBool(req.family_history_thorough, 'family_history_thorough');
  ensureBool(req.consanguinity, 'consanguinity');
  ensureBool(req.known_carrier_status, 'known_carrier_status');
  ensureStr(req.disease_focus, 'disease_focus');
  ensureEnum(req.disease_focus, 'disease_focus', ['cf','sma','fragile_x','alpha_thal','beta_thal','sickle_cell','tay_sachs','universal_panel']);
  ensureBool(req.pre_pregnancy_counseling_done, 'pre_pregnancy_counseling_done');
  let plan;
  if(req.consanguinity) plan='expanded_carrier_screen_then_genetic_counsel';
  else if(req.disease_focus==='universal_panel') plan='expanded_panel_then_reassess';
  else if(req.known_carrier_status===false) plan='screen_then_genetic_counsel';
  else plan='continue_with_targeted_screening';
  if(!req.pre_pregnancy_counseling_done) plan='offer_preconception_genetic_counsel';
  return {plan};
}
function funcs(){return {nipt,amnio,cvs,carrier_screening,aneuploidy_workup,preconception_genetic};}
module.exports={funcs,CITATIONS,ValidationError};
