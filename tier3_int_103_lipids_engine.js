/**
 * TIER3_INT-103 Lipid Disorders Engine
 * ASCVD risk + Statin selection + Non-statin therapy + Monitoring + Lifestyle
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACC_AHA_LIPIDS: 'ACC/AHA Lipids 2018', ESC_EAS_LIPIDS: 'ESC/EAS Lipids 2019' };

function ascvdRiskCalculation(input) {
  const { age_years, sex, race, sbp_mmhg, sbp_treated, total_cholesterol_mg_dl, hdl_mg_dl, diabetes, smoker, egfr, statin_use, prior_ascvd_event, prior_revascularization } = input;
  let risk_category = 'low_risk_below_5pct_10y';
  let ascvd_10y = 0;
  if (prior_ascvd_event === 'yes') risk_category = 'SECONDARY_PREVENTION_VERY_HIGH_RISK_recurrent_event_rate_greater_than_20pct_10y';
  if (prior_ascvd_event !== 'yes' && diabetes === 'yes' && age_years >= 40) risk_category = 'diabetes_specific_moderate_to_high_risk_with_age_and_risk_factors';
  if (prior_ascvd_event !== 'yes' && diabetes !== 'yes') {
    ascvd_10y = 5 + ((age_years - 50) * 0.5) + ((sbp_mmhg - 130) * 0.1) + ((total_cholesterol_mg_dl - 200) * 0.05) - ((hdl_mg_dl - 50) * 0.1) + (smoker === 'yes' ? 3 : 0);
    if (ascvd_10y >= 7.5) risk_category = 'intermediate_risk_7.5_to_20pct_10y_statin_recommended';
    else if (ascvd_10y >= 20) risk_category = 'high_risk_greater_than_20pct_10y_high_intensity_statin';
    else if (ascvd_10y < 5) risk_category = 'low_risk_below_5pct_10y_lifestyle_focus';
    else risk_category = 'borderline_5_to_7.5pct_lifestyle_with_risk_enhancers_considered';
  }
  return {
    risk_category, ascvd_10y,
    risk_enhancers: ['family_history_premature_ASCVD_below_55_in_male_65_in_female_first_degree_relative', 'LDL_above_160_persistent', 'CKD_eGFR_less_than_60_or_urine_ACR_above_30', 'metabolic_syndrome', 'chronic_inflammatory_conditions_RA_Lupus_HIV', 'south_Asian_ethnicity', 'triglycerides_persistent_above_175_non_HDL_above_220'],
    citation: CITATIONS.ACC_AHA_LIPIDS,
  };
}

function statinSelectionAndDosing(input) {
  const { risk_category, age_years, race, diabetes, ckd_stage, ldl_baseline, prior_statin_intolerance, drug_interactions, liver_disease } = input;
  let recommendation = 'moderate_intensity_statin_rosuvastatin_5_to_10mg_or_atorvastatin_10_to_20mg';
  if (risk_category === 'high_risk_greater_than_20pct_10y_high_intensity_statin' || risk_category === 'SECONDARY_PREVENTION_VERY_HIGH_RISK_recurrent_event_rate_greater_than_20pct_10y') recommendation = 'high_intensity_statin_atorvastatin_40_to_80mg_or_rosuvastatin_20_to_40mg';
  if (prior_statin_intolerance === 'yes') recommendation = 'low_dose_statin_with_gradual_titration_or_alternate_statins_rosuvastatin_versus_atorvastatin_with_Q2_week_lipid_liver_panel';
  if (race === 'asian') recommendation = 'rosuvastatin_dose_cap_20mg_atorvastatin_dose_40mg_lower_initial_dose_per_Asian_label';
  if (drug_interactions === 'yes' && cyclosporine_or_protease_inhibitor) recommendation = 'avoid_high_intensity_use_pravastatin_or_low_dose_rosuvastatin';
  return {
    recommendation,
    intensity: ['high_intensity_LDL_reduction_above_50pct_atorvastatin_40_to_80_rosuvastatin_20_to_40', 'moderate_intensity_LDL_reduction_30_to_49pct_atorvastatin_10_to_20_rosuvastatin_5_to_10_simvastatin_20_to_40_pravastatin_40_to_80_lovastatin_40_fluvastatin_80', 'low_intensity_LDL_reduction_less_than_30pct_simvastatin_10_pravastatin_10_to_20_lovastatin_20_fluvastatin_20_to_40'],
    monitoring: 'baseline_lipid_liver_panel_then_lipid_Q4_to_12_weeks_then_Q3_to_12_months_liver_only_if_symptoms',
    citation: CITATIONS.ACC_AHA_LIPIDS,
  };
}

function nonStatinLipidTherapy(input) {
  const { ldl_current, ldl_target, statin_max_tolerated, pcsk9_indicated, ezetimibe_trialed, lpa_elevated, triglycerides_persistent_high, fh_heterozygous_present, pregnancy } = input;
  let recommendation = 'ezetimibe_10mg_daily_add_to_statin_if_LDL_not_at_target_30pct_additional_LDL_reduction';
  if (pcsk9_indicated === 'yes' && ldl_current >= 70 && statin_max_tolerated) recommendation = 'PCSK9_inhibitor_alirocumab_or_evolocumab_subcutaneous_Q2_weeks_add_to_statin_plus_ezetimibe_for_secondary_prevention_or_FH';
  if (lpa_elevated === 'yes' && lpa_greater_than_50_mg_dL) recommendation = 'PCSK9_inhibitor_also_lowers_Lpa_consider';
  if (triglycerides_persistent_high === 'above_500') recommendation = 'fenofibrate_or_icosapent_ethyl_2g_BID_per_REDUCE_IT_for_CV_risk_with_high_TG_above_150_on_statin';
  if (fh_heterozygous_present === 'yes') recommendation = 'high_intensity_statin_plus_ezetimibe_plus_PCSK9_inhibitor';
  return {
    recommendation,
    bempedoic_acid: 'bempedoic_acid_180mg_daily_for_statin_intolerant_or_add_on_reduces_LDL_20pct',
    lomitapide: 'lomitapide_for_homozygous_FH_with_specialty_prescriber_hepatic_steatosis_risk',
    inclisiran: 'inclisiran_subcutaneous_Q6_months_after_initial_then_Q6_months_long_acting_PCSK9_silencing',
    citation: CITATIONS.ESC_EAS_LIPIDS,
  };
}

function lipidMonitoringAndToxicity(input) {
  const { ldl_baseline, ldl_current, weeks_on_statin, lft_elevation, muscle_symptoms_present, ck_elevated, statin_intolerance_severity } = input;
  let target_met = ldl_current < ldl_target;
  let plan = 'continue_current_statin_consider_add_on_ezetimibe_if_LDL_not_at_target';
  let toxicity = 'no_significant_toxicity_continue';
  if (lft_elevation === 'above_3x_ULN') toxicity = 'liver_toxicity_hold_statin_reassess_in_2_weeks_then_rechallenge';
  if (muscle_symptoms_present === 'yes' && ck_elevated === 'above_10x_ULN') toxicity = 'myopathy_or_rhabdomyolysis_hold_statin_hydrate_assess_renal_function';
  if (muscle_symptoms_present === 'yes' && ck_elevated === 'normal') toxicity = 'statin_associated_muscle_symptoms_consider_alternate_statin_or_lower_dose_with_Q2_week_rechallenge';
  return {
    target_met, plan, toxicity,
    rhabdomyolysis: 'muscle_pain_weakness_dark_urine_with_CK_above_10x_ULN_hydrate_hold_statin_assess_renal_monitoring_for_ARF',
    new_onset_diabetes_risk: 'statin_increases_new_diabetes_risk_9pct_in_meta_analysis_with_higher_intensity_dose_but_cv_benefit_outweighs_risk_for_moderate_to_high_risk_patients',
    citation: CITATIONS.ACC_AHA_LIPIDS,
  };
}

function lifestyleInterventionLipids(input) {
  const { current_diet, current_exercise_min_per_week, smoking_status, alcohol_use, weight_status, family_history, baseline_lipid } = input;
  let dietary = 'Mediterranean_diet_or_DASH_diet_high_in_fruits_vegetables_whole_grains_legumes_nuts_olive_oil_fish_limit_red_meat_processed_foods_saturated_fat_below_6pct_calories_cholesterol_below_200mg_daily';
  let exercise = 'at_least_150_minutes_moderate_aerobic_or_75_minutes_vigorous_per_week_plus_resistance_2x_per_week';
  let weight = 'weight_loss_5_to_10pct_reduces_LDL_and_TG_and_improves_HDL_and_reduces_CV_risk';
  let smoking = 'smoking_cessation_quitline_pharmacotherapy_varenicline_bupropion_NRT_reduces_CV_risk_within_1_year';
  return {
    dietary, exercise, weight, smoking,
    supplements: ['plant_stanols_or_sterols_2g_per_day_reduces_LDL_8pct', 'omega_3_fatty_acids_prescription_only_for_very_high_TG_above_500', 'soluble_fiber_5_to_10g_per_day'],
    overall_impact: 'lifestyle_combination_diet_exercise_weight_loss_can_reduce_LDL_15_to_20pct_TG_20_to_30pct_complements_pharmacotherapy',
    citation: CITATIONS.ESC_EAS_LIPIDS,
  };
}

module.exports = { ascvdRiskCalculation, statinSelectionAndDosing, nonStatinLipidTherapy, lipidMonitoringAndToxicity, lifestyleInterventionLipids, CITATIONS, ValidationError };