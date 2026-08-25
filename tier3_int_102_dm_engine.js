/**
 * TIER3_INT-102 Diabetes Mellitus General Engine
 * Diagnosis + A1c target + Non-insulin therapy + Basal-bolus insulin + Hypoglycemia
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ADA_DM: 'ADA Standards of Care Diabetes 2025', AACE_DM: 'AACE Diabetes Algorithm 2024' };

function diabetesDiagnosisAndClassification(input) {
  const { fasting_glucose_mg_dl, ogtt_2h_glucose_mg_dl, hba1c_pct, random_glucose_with_symptoms, age_at_diagnosis, bmi, antibody_positive, c_peptide_level, family_history, presentation_typical_dka_or_asymptomatic } = input;
  let criteria_met = (fasting_glucose_mg_dl >= 126) || (ogtt_2h_glucose_mg_dl >= 200) || (hba1c_pct >= 6.5) || (random_glucose_with_symptoms >= 200);
  let classification = 'type_2_diabetes';
  if (age_at_diagnosis < 30 && antibody_positive === 'yes' && c_peptide_level === 'low') classification = 'type_1_diabetes';
  if (bmi >= 30 && presentation_typical_dka_or_asymptomatic === 'yes' && age_at_diagnosis >= 18) classification = 'latent_autoimmune_diabetes_of_adult_LADA_or_type_2_depending_on_antibodies';
  if (first_trimester_diagnosis_pregnancy) classification = 'overt_diabetes_in_pregnancy_or_GDM_screen_with_75g_OGTT';
  return {
    classification, criteria_met,
    diagnosis_criteria: ['fasting_glucose_greater_than_or_equal_to_126_mg_per_dL_two_occasions', 'OGTT_2h_greater_than_or_equal_to_200_mg_per_dL', 'HbA1c_greater_than_or_equal_to_6.5pct', 'random_glucose_greater_than_or_equal_to_200_with_classic_symptoms_polyuria_polydipsia_unexplained_weight_loss'],
    classification_workup: ['islet_autoantibodies_GAD65_IA2_ZnT8_for_type_1_LADA', 'c_peptide_for_insulin_reserve', 'lipid_panel_BP_UA_for_cv_risk', 'fundus_exam_for_retinopathy', 'foot_exam_for_neuropathy'],
    citation: CITATIONS.ADA_DM,
  };
}

function a1cTargetIndividualization(input) {
  const { age_years, comorbidities_severe, comorbidities_moderate, life_expectancy_years, hypoglycemia_risk, patient_preference, treatment_burden_tolerance, cv_disease_present, ckd_present } = input;
  let target = 'less_than_7pct_for_most_adults';
  if (age_years >= 75 || comorbidities_severe === 'yes') target = 'less_than_8pct_or_8_to_9pct_for_frail_elderly';
  if (comorbidities_moderate === 'yes' && age_years < 75) target = 'less_than_7.5pct';
  if (life_expectancy_years < 10 && treatment_burden_tolerance === 'low') target = 'less_than_8.5pct_avoid_intensive_targets';
  if (cv_disease_present === 'yes' && hypoglycemia_risk === 'low') target = 'less_than_7pct_with_evidence_for_cardiovascular_benefit_with_SGLT2_or_GLP1';
  return {
    target,
    individualized_targets: ['less_than_6.5pct_short_DM_young_no_CVD_no_hypoglycemia_strict', 'less_than_7pct_standard', 'less_than_7.5pct_moderate_comorbidities', 'less_than_8pct_severe_comorbidities', 'less_than_8.5pct_or_8_to_9pct_frail_elderly_short_life_expectancy'],
    citation: CITATIONS.ADA_DM,
  };
}

function nonInsulinTherapy(input) {
  const { hba1c_pct, bmi, cv_disease, hf_present, ckd_present, baseline_egfr, weight_loss_priority, hypoglycemia_risk } = input;
  let first_line = 'metformin_500_to_1000mg_BID_or_extended_release_with_titration_to_target';
  let add_on_options = ['GLP1_RA_semaglutide_or_liraglutide_for_weight_loss_and_cv_benefit', 'SGLT2_inhibitor_empagliflozin_dapagliflozin_for_HF_or_CKD', 'DPP4_inhibitor_sitagliptin_for_renal_or_elderly_safe', 'sulfonylurea_gliclazide_or_glimepiride_cheap_but_hypoglycemia_risk'];
  if (cv_disease === 'yes' || hf_present === 'yes' || ckd_present === 'yes') first_line = 'metformin_plus_SGLT2i_or_GLP1_RA_with_proven_cv_or_renal_benefit_first';
  if (bmi >= 30 && weight_loss_priority === 'high') first_line = 'GLP1_RA_semaglutide_or_tirzepatide_for_weight_loss_combined_with_metformin';
  if (hba1c_pct >= 9 && symptomatic) first_line = 'combination_dual_or_triple_therapy_at_diagnosis_consider_basal_insulin_or_GLP1_RA_combination';
  return {
    first_line, add_on_options,
    contraindications: ['metformin_eGFR_less_than_30_avoid_or_reduce_dose_less_than_45', 'SGLT2i_DKA_risk_in_type_1_or_latent_autoimmune', 'GLP1_RA_medullary_thyroid_ca_history_or_MEN2', 'sulfonylurea_renal_failure_hypoglycemia_risk'],
    citation: CITATIONS.AACE_DM,
  };
}

function basalBolusInsulin(input) {
  const { current_hba1c, weight_kg, tdd_total_daily_dose_calculated, basal_dose, meal_bolus_split, hypoglycemia_risk, glucose_pattern, dawn_phenomenon } = input;
  let tdd = weight_kg * 0.5;
  if (current_hba1c >= 9) tdd = weight_kg * 0.6;
  if (hypoglycemia_risk === 'high') tdd = weight_kg * 0.3;
  let basal = tdd * 0.5;
  let bolus_per_meal = (tdd * 0.5) / 3;
  let plan = 'basal_glargine_or_detemir_or_degludec_at_evening_plus_rapid_acting_lispro_aspart_glulisine_at_meals_carb_counting_for_bolus_dose';
  if (dawn_phenomenon === 'yes') plan = plan + '_split_basal_to_evening_and_morning_or_increase_evening_basal';
  return {
    tdd, basal, bolus_per_meal, plan,
    titration: 'basal_titrate_Q3d_by_2_to_3_units_until_fasting_glucose_80_to_130_meal_bolus_titrate_by_10_to_20pct_per_meal_based_on_post_prandial',
    monitoring: 'fasting_glucose_Q_day_pre_meal_glucose_Q_meal_pre_bed_glucose_Q_bed_Q3_months_HbA1c_annual_complication_screening',
    citation: CITATIONS.ADA_DM,
  };
}

function hypoglycemiaManagement(input) {
  const { glucose_mg_dl, conscious_status, oral_intake_safe, seizure_present, glucagon_available, hypoglycemia_unawareness, frequency_per_week, cause_identified } = input;
  let severity = 'mild_self_treatable';
  if (glucose_mg_dl < 54) severity = 'clinically_significant_hypoglycemia';
  if (conscious_status === 'unconscious' || seizure_present === 'yes') severity = 'severe_needs_assistance';
  let treatment = '15g_fast_carbs_glucose_tablets_or_juice_recheck_in_15min_then_repeat_until_glucose_above_70_then_add_protein_snack';
  if (severity === 'severe_needs_assistance') treatment = 'glucagon_1mg_IM_or_subcutaneous_or_IV_dextrose_25g_50mL_D50_then_recheck_in_15min';
  let prevention = 'review_insulin_doses_for_overlap_or_excess_review_meals_and_carbs_avoid_exercise_with_active_insulin_use_CGM_if_recurrent';
  if (cause_identified === 'insulin_dose_error') prevention = 'reconcile_insulin_with_carbs_counting_and_review_dose_calculation_with_diabetes_educator';
  return {
    severity, treatment, prevention,
    glargine_advantage: 'glargine_or_degludec_lower_hypoglycemia_risk_than_NPH_for_basal_reduction_in_overnight_and_severe_hypoglycemia',
    citation: CITATIONS.ADA_DM,
  };
}

module.exports = { diabetesDiagnosisAndClassification, a1cTargetIndividualization, nonInsulinTherapy, basalBolusInsulin, hypoglycemiaManagement, CITATIONS, ValidationError };