/**
 * TIER3_SUP-101 Clinical Nutrition Engine
 * Nutrition screening + Assessment + Enteral/Parenteral + Therapeutic diets + Education
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASPEN_NUTRITION: 'ASPEN Nutrition Support 2024', ACUTE_NUTRITION: 'ASPEN Critical Care Nutrition 2023' };

function nutritionScreening(input) {
  const { weight_loss_unintentional_kg_3m, bmi, appetite_reduced, eating_difficulty_dysphagia_chewing, disease_severity, age_above_65, dietary_intake_pct, nausea_vomiting, abdominal_distention } = input;
  let score = 0;
  if (weight_loss_unintentional_kg_3m >= 3) score += 2;
  if (bmi < 18.5 || bmi >= 35) score += 1;
  if (appetite_reduced === 'yes') score += 1;
  if (eating_difficulty_dysphagia_chewing === 'yes') score += 1;
  if (disease_severity === 'severe') score += 2;
  if (age_above_65 === 'yes') score += 1;
  let risk = 'low_risk';
  if (score >= 3) risk = 'moderate_malnutrition_risk_refer_to_RD';
  if (score >= 5) risk = 'high_malnutrition_risk_urgent_RD_assessment';
  return {
    score, risk,
    must_or_nrs2002: 'Malnutrition_Universal_Screening_Tool_or_Nutrition_Risk_Screening_2002_per_protocol',
    action: 'screen_within_24h_of_admission_repeat_Q_week_in_hospital_with_continued_stay',
    citation: CITATIONS.ASPEN_NUTRITION,
  };
}

function nutritionAssessment(input) {
  const { weight_kg, height_cm, bmi, weight_change_pct_3m, albumin_g_dl, prealbumin_mg_dl, lymphocyte_count, physical_exam_muscle_wasting, micronutrient_deficiencies, comorbidities, dietary_restrictions, cultural_religious_food_preferences } = input;
  let diagnosis = 'well_nourished';
  if (weight_change_pct_3m >= 10 || bmi < 18.5) diagnosis = 'severe_malnutrition_meeting_ACM_criteria';
  else if (weight_change_pct_3m >= 5 || prealbumin_mg_dl < 15) diagnosis = 'moderate_malnutrition_meeting_ACM_criteria';
  else if (weight_change_pct_3m >= 2) diagnosis = 'mild_malnutrition';
  let calorie_target = '25_to_30_kcal_per_kg_per_day_for_maintenance_or_30_to_35_kcal_per_kg_per_day_for_anabolic';
  let protein_target = '1.2_to_1.5g_per_kg_per_day_for_mild_to_moderate_stress_or_2g_per_kg_per_day_for_severe_stress_burns_wound_healing';
  return {
    diagnosis, calorie_target, protein_target,
    micronutrient_assessment: ['vitamin_D_25_OH_with_replacement_if_below_30', 'B12_folate_if_malabsorption_or_alcohol_use', 'iron_ferritin_TIBC_for_anemia_workup', 'zinc_for_wound_healing_or_diarrhea', 'thiamine_for_alcohol_use_disorder_to_prevent_Wernickes'],
    visceral_proteins: 'albumin_low_in_acute_inflammation_not_marker_of_nutritional_status_prealbumin_with_half_life_2_days_for_recent_nutritional_change',
    citation: CITATIONS.ASPEN_NUTRITION,
  };
}

function enteralParenteralNutrition(input) {
  const { npo_expected_days, gi_function_adequate, aspiration_risk, severe_malnutrition_present, refeeding_syndrome_risk, access_nasogastric_or_postpyloric_or_central_venous } = input;
  let recommendation = 'oral_diet_first_if_adequate_intake_possible_then_supplements_then_enteral';
  if (npo_expected_days >= 5 && gi_function_adequate === 'yes') recommendation = 'early_enteral_nutrition_via_nasogastric_or_postpyloric_within_24_to_48h_of_admission_per_critical_care_guidelines';
  if (npo_expected_days >= 7 && gi_function_adequate !== 'yes') recommendation = 'parenteral_nutrition_with_central_venous_access_if_enteral_not_feasible_after_7_days';
  if (severe_malnutrition_present === 'yes') recommendation = 'start_enteral_or_parenteral_with_cautious_titration_avoid_refeeding_syndrome_with_thiamine_replacement_electrolyte_monitoring_Q4h_initial';
  let formula = 'standard_polymeric_for_most_patients_high_protein_for_critically_ill_or_wound_healing_disease_specific_for_renal_liver_diabetes';
  return {
    recommendation, formula,
    refeeding_prevention: 'low_starts_with_thiamine_replacement_and_electrolyte_repletion_K_phosphate_Mg_increase_by_5_to_10_kcal_per_kg_per_day_until_Q7d_then_full',
    monitoring: 'tolerance_Q4h_gastric_residual_Q4h_for_ngt_feeding_patency_Q4h_skin_integrity_Q_day_labs_Q_week_elbow',
    citation: CITATIONS.ACUTE_NUTRITION,
  };
}

function therapeuticDiets(input) {
  const { condition, renal_failure, heart_failure_or_hypertension, diabetes_present, dysphagia_present, food_allergies, hepatic_failure, cancer_cachexia, cardiac_disease } = input;
  let diet = 'regular_diet_no_restrictions';
  if (renal_failure === 'yes') diet = 'renal_diet_potassium_less_than_2g_phosphate_less_than_1g_protein_0.6_to_0.8g_per_kg_per_day_with_dialysis_adjustments';
  if (heart_failure_or_hypertension === 'yes') diet = 'cardiac_diet_2g_sodium_fluid_restriction_1.5_to_2L_per_day_with_high_potassium_foods_restricted_with_KFT';
  if (diabetes_present === 'yes') diet = 'diabetic_diet_with_carb_counting_45_to_60g_per_meal_2_snacks_15g_each_or_DASH_diet_for_HTN';
  if (dysphagia_present === 'yes') diet = 'dysphagia_diet_per_speech_pathology_texture_modified_with_thickened_liquids_IDDSI_levels';
  if (cancer_cachexia === 'yes') diet = 'high_protein_high_calorie_small_frequent_meals_with_nutritional_supplements';
  return {
    diet,
    allergies_considerations: 'eliminate_documented_food_allergies_or_intolerances_lactose_gluten_etc',
    supplements: ['oral_nutritional_supplements_high_protein_2_to_3_per_day_for_malnourished', 'modular_protein_supplement_for_increased_protein_needs', 'MCT_oil_for_fat_malabsorption', 'renal_specific_low_protein_supplements_for_dialysis_patients'],
    citation: CITATIONS.ASPEN_NUTRITION,
  };
}

function dietaryEducationAndDischarge(input) {
  const { condition_diagnosis, cultural_preferences, health_literacy_level, language, dietary_restrictions, social_determinants, caregiver_support, teach_back_completed } = input;
  let plan = 'individualized_education_with_teach_back_method_by_registered_dietitian';
  let materials = 'language_appropriate_with_pictograms_for_low_health_literacy_culturally_adapted';
  if (condition_diagnosis === 'diabetes') plan = 'carb_counting_baseline_glycemic_target_meal_planning_with_consultation_and_follow_up';
  if (condition_diagnosis === 'CKD') plan = 'renal_diet_education_with_lab_values_to_understand_K_phosphate_protein_restrictions';
  if (condition_diagnosis === 'cardiac') plan = 'DASH_or_Mediterranean_diet_sodium_less_than_2g_fluid_management';
  if (social_determinants === 'food_insecurity') plan = plan + '_with_food_pantry_resources_SNAP_WIC_referral_to_community_resources';
  return {
    plan, materials,
    teach_back_principles: 'ask_patient_to_explain_in_their_own_words_what_they_need_to_do_for_diet_then_re_teach_if_gap',
    follow_up: 'RD_outpatient_follow_up_2_to_4_weeks_post_discharge_for_high_risk_tele_visit_options',
    citation: CITATIONS.ASPEN_NUTRITION,
  };
}

module.exports = { nutritionScreening, nutritionAssessment, enteralParenteralNutrition, therapeuticDiets, dietaryEducationAndDischarge, CITATIONS, ValidationError };