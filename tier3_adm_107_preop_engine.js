/**
 * TIER3_ADM-107 Pre-Operative Assessment Engine
 * Pre-op checklist + Anesthesia clearance + Risk stratification + NPO status + Pre-op labs
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACS_NSQIP: 'ACS NSQIP Surgical Risk 2024', ASA_PREOP: 'ASA Preoperative 2024' };

function preOpChecklist(input) {
  const { consent_signed, site_marked, allergies_confirmed, npo_status, antibiotic_prophylaxis_60min_prior, dvt_prophylaxis_indicated, blood_products_available, imaging_available, implants_available, prior_authorization_done } = input;
  let ready = consent_signed === 'yes' && site_marked === 'yes' && allergies_confirmed === 'yes' && npo_status === 'yes' && antibiotic_prophylaxis_60min_prior === 'yes';
  let missing = [];
  if (consent_signed !== 'yes') missing.push('consent_not_signed');
  if (site_marked !== 'yes' && site_marking_required === 'yes') missing.push('site_not_marked');
  if (allergies_confirmed !== 'yes') missing.push('allergies_not_reviewed');
  if (npo_status !== 'yes') missing.push('NPO_status_not_confirmed');
  if (antibiotic_prophylaxis_60min_prior !== 'yes') missing.push('antibiotic_prophylaxis_not_within_60_min');
  return {
    ready, missing,
    who_checklist: ['sign_in_before_anesthesia_with_patient_identity_procedure_site_consent', 'time_out_in_OR_with_team_introduction_procedure_antibiotic_imaging', 'sign_out_at_end_with_instrument_count_specimen_labeling_equipment_issues'],
    citation: CITATIONS.ACS_NSQIP,
  };
}

function anesthesiaClearance(input) {
  const { asa_class, mallampati_grade, airway_assessment, cardiac_risk, pulmonary_risk, mallampati_score, prior_anesthesia_history, malignant_hyperthermia_history, anticoagulation_status } = input;
  let asa_risk = 'low_risk_asa_1_or_2';
  if (asa_class === 'III' || asa_class === 'IV') asa_risk = 'moderate_to_high_risk_optimize_before_elective_surgery';
  if (asa_class === 'V') asa_risk = 'moribund_patient_emergency_or_salvage_only';
  let airway_plan = 'standard_laryngoscopy';
  if (mallampati_score >= 3 || mallampati_grade === 'III_or_IV') airway_plan = 'difficult_airway_plan_video_laryngoscope_backup_SGA_FONA';
  return {
    asa_risk, airway_plan,
    pre_op_optimization: ['NPO_solids_6h_8h_clear_liquids_2h', 'pre_op_antibiotic_within_60min_of_incision', 'DVT_prophylaxis_per_caprini_score', 'beta_blocker_continuation_perioperative', 'diabetes_management_with_insulin_per_protocol_target_140_to_180_mg_dL', 'smoking_cessation_4_to_6_weeks_before_elective'],
    citation: CITATIONS.ASA_PREOP,
  };
}

function surgicalRiskStratification(input) {
  const { age_years, surgery_type, asa_class, emergency_vs_elective, comorbidities_count, functional_status_mets, serum_albumin, creatinine, prior_surgical_history } = input;
  let risk_category = 'low_risk_mortality_less_than_1pct';
  let mortality_estimate = 0.5;
  if (asa_class === 'III' && comorbidities_count >= 2) { risk_category = 'moderate_risk_mortality_1_to_5pct'; mortality_estimate = 2.5; }
  if (asa_class === 'IV' || emergency_vs_elective === 'emergency') { risk_category = 'high_risk_mortality_greater_than_5pct'; mortality_estimate = 10; }
  if (age_years >= 80 && asa_class >= 'III' && emergency_vs_elective === 'emergency') { risk_category = 'very_high_risk_mortality_greater_than_20pct'; mortality_estimate = 25; }
  let nsqip_calculation = 'ACS_NSQIP_calculator_with_21_factors_provides_procedure_specific_risk_mortality_morbidity_cardiac_pulmonary_renal_thromboembolism';
  return {
    risk_category, mortality_estimate,
    nsqip_calculation,
    components: ['age', 'sex', 'asa_class', 'BMI', 'emergency_status', 'procedure_CPT', 'functional_status', 'comorbidities', 'lab_values_creatinine_albumin_WBC_hematocrit', 'smoking', 'alcohol', 'steroid_use', 'weight_loss'],
    citation: CITATIONS.ACS_NSQIP,
  };
}

function npoGuidelines(input) {
  const { last_solids_hours, last_clear_liquid_hours, last_breast_milk_hours, last_non_human_milk_hours, diabetes_present, gastroparesis_present, urgent_surgery_override } = input;
  let ready = last_solids_hours >= 6 && last_clear_liquid_hours >= 2;
  let exceptions = [];
  if (diabetes_present === 'yes' || gastroparesis_present === 'yes') exceptions.push('extended_NPO_8h_solids_due_to_delayed_gastric_emptying_consider_prokinetic');
  if (urgent_surgery_override === 'yes') exceptions.push('emergency_surgery_proceed_with_risk_of_aspiration_documented');
  if (last_non_human_milk_hours < 6) exceptions.push('non_human_milk_like_cow_milk_6h_NPO');
  if (last_breast_milk_hours < 4) exceptions.push('breast_milk_4h_NPO_per_infants');
  return {
    ready, exceptions,
    asra_guidelines: ['clear_liquids_including_water_black_coffee_clear_juice_pulp_free_2h_NPO', 'breast_milk_4h_NPO', 'non_human_milk_6h_NPO', 'light_meals_toast_clear_liquids_6h_NPO', 'heavy_fatty_meals_8h_NPO', 'chewing_gum_or_candy_30_min_to_2h_discretion'],
    citation: CITATIONS.ASA_PREOP,
  };
}

function preOpLabsTargetedVsRoutine(input) {
  const { surgery_minor_or_major, asa_class, comorbidities, prior_test_results_available, specific_test_needed, age_years } = input;
  let plan = 'selective_labs_based_on_history_physical_and_procedure_risk';
  if (surgery_minor_or_major === 'major_grade_3_or_higher') plan = 'CBC_electrolytes_renal_function_coagulation_UA_EKG_within_30_days_for_high_risk';
  if (surgery_minor_or_major === 'minor_low_risk_cataract') plan = 'no_routine_labs_per_CHOosing_Wisely';
  let ordered = [];
  if (comorbidities === 'diabetes') ordered.push('HbA1c_glucose');
  if (comorbidities === 'cardiac') ordered.push('EKG_echo_stress_test_if_symptomatic');
  if (comorbidities === 'renal') ordered.push('creatinine_eGFR_electrolytes');
  if (comorbidities === 'liver') ordered.push('LFT_coagulation_INR');
  return {
    plan, ordered,
    evidence: 'NIH_NGC_and_ASA_recommend_targeted_not_routine_pre_op_testing_reduces_cost_without_increasing_adverse_events',
    citation: CITATIONS.ACS_NSQIP,
  };
}

module.exports = { preOpChecklist, anesthesiaClearance, surgicalRiskStratification, npoGuidelines, preOpLabsTargetedVsRoutine, CITATIONS, ValidationError };