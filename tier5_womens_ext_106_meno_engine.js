// filepath: tier5_womens_ext_106_meno_engine.js
// TIER5_WOMENS_EXT-106: Menopause & HRT
'use strict';
const CITATIONS = ['NAMS_2022_HRT','Endocrine_Society_Menopause_2015','IMS_Recommendations_2016'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function vasomotor(req){
  ensureNumber(req.hot_flash_frequency_per_day, 'hot_flash_frequency_per_day');
  ensureBool(req.night_sweats, 'night_sweats');
  ensureNumber(req.years_since_menopause, 'years_since_menopause');
  ensureBool(req.contraindications_present, 'contraindications_present');
  ensureBool(req.lifestyle_tried, 'lifestyle_tried');
  let plan;
  if(req.contraindications_present) plan='non_hormonal_options_then_sszri_or_gabapentin';
  else if(req.hot_flash_frequency_per_day>=7 && req.lifestyle_tried===false) plan='lifestyle_then_reassess_in_3_months';
  else if(req.years_since_menopause<10 && req.contraindications_present===false) plan='mht_consideration_then_shared_decision';
  else if(req.lifestyle_tried) plan='non_hormonal_options_or_paroxetine_low_dose';
  else plan='continue_with_lifestyle_then_reassess';
  return {plan};
}
function hrt_candidate(req){
  ensureNumber(req.age, 'age');
  ensureNumber(req.years_since_menopause, 'years_since_menopause');
  ensureBool(req.breast_cancer_history, 'breast_cancer_history');
  ensureBool(req.vte_history, 'vte_history');
  ensureBool(req.stroke_history, 'stroke_history');
  ensureBool(req.liver_disease, 'liver_disease');
  ensureBool(req.unexplained_bleeding, 'unexplained_bleeding');
  let decision;
  if(req.breast_cancer_history || req.vte_history || req.stroke_history || req.liver_disease || req.unexplained_bleeding) decision='contraindicated_then_avoid_systemic_mht';
  else if(req.years_since_menopause>10 || req.age>=60) decision='caution_then_lowest_dose_transdermal_with_shared_decision';
  else if(req.years_since_menopause<=10 && req.age<60) decision='candidate_then_offer_systemic_mht_per_symptoms';
  else decision='continue_with_individualized_assessment';
  return {decision};
}
function bone_health(req){
  ensureNumber(req.age, 'age');
  ensureNumber(req.t_score, 't_score');
  ensureBool(req.fracture_history, 'fracture_history');
  ensureBool(req.on_aromatase_inhibitor, 'on_aromatase_inhibitor');
  ensureNumber(req.fra_score, 'fra_score');
  ensureBool(req.glucocorticoid_use, 'glucocorticoid_use');
  let plan;
  if(req.t_score<=-2.5 && req.fracture_history) plan='osteoporosis_then_initiate_bisphosphonate_with_reassessment';
  else if(req.t_score<=-2.5) plan='severe_then_bisphosphonate_with_reassessment';
  else if(req.fra_score>=20) plan='high_risk_then_consider_treatment_with_bone_density_followup';
  else if(req.glucocorticoid_use) plan='consider_bone_protection_with_calcium_vit_d';
  else plan='continue_with_lifestyle_with_reassessment_in_2_years';
  return {plan};
}
function vaginal_atrophy(req){
  ensureNumber(req.severity, 'severity'); // 0 mild 1 moderate 2 severe
  ensureBool(req.estrogen_dependent_cancer_history, 'estrogen_dependent_cancer_history');
  ensureBool(req.estro_topical_tried, 'estro_topical_tried');
  ensureBool(req.dyspareunia_present, 'dyspareunia_present');
  let plan;
  if(req.severity===2) plan='topical_estrogen_then_reassess_in_3_months';
  else if(req.estro_topical_tried===false) plan='try_topical_estrogen_then_reassess';
  else if(req.estrogen_dependent_cancer_history) plan='non_hormonal_lubricants_then_reassess';
  else if(req.dyspareunia_present) plan='topical_estrogen_with_lubricants_then_pt_referral';
  else plan='continue_with_observation_with_lubricants';
  return {plan};
}
function mood_sleep(req){
  ensureBool(req.depression_present, 'depression_present');
  ensureBool(req.sleep_disturbance, 'sleep_disturbance');
  ensureBool(req.anxiety_present, 'anxiety_present');
  ensureBool(req.cbt_tried, 'cbt_tried');
  ensureBool(req.mht_tried, 'mht_tried');
  let plan;
  if(req.depression_present && req.anxiety_present) plan='ssri_or_snri_then_consider_mht';
  else if(req.sleep_disturbance && req.mht_tried===false) plan='mht_with_progesterone_then_reassess';
  else if(req.cbt_tried===false) plan='cbt_for_insomnia_then_reassess';
  else plan='continue_with_observation_then_psychology_referral';
  return {plan};
}
function libido(req){
  ensureBool(req.testosterone_low, 'testosterone_low');
  ensureNumber(req.partner_relationship_status, 'partner_relationship_status'); // 0 single 1 partnered
  ensureBool(req.medication_contributing, 'medication_contributing');
  ensureBool(req.psychological_factors, 'psychological_factors');
  ensureBool(req.vaginal_atrophy_treated, 'vaginal_atrophy_treated');
  let plan;
  if(req.medication_contributing) plan='review_medications_then_consider_switch';
  else if(req.psychological_factors) plan='psychology_referral_then_relationship_counseling';
  else if(req.vaginal_atrophy_treated===false) plan='treat_vaginal_atrophy_then_reassess';
  else plan='continue_with_lifestyle_then_reassess';
  return {plan};
}
function funcs(){return {vasomotor,hrt_candidate,bone_health,vaginal_atrophy,mood_sleep,libido};}
module.exports={funcs,CITATIONS,ValidationError};
