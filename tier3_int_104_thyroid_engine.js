/**
 * TIER3_INT-104 Thyroid Function Engine
 * TFT interpretation + Hypothyroidism + Hyperthyroidism + Thyroid nodule + Pregnancy
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ATA_HYPO: 'ATA Hypothyroidism 2014', ATA_HYPER: 'ATA Hyperthyroidism 2016', ATA_NOD: 'ATA Nodules 2015' };

function thyroidFunctionInterpretation(input) {
  const { tsh_miu_l, free_t4_ng_dl, free_t3_pg_ml, age_years, trimester_pregnancy, sick_euthyroid_suspected, central_hypothyroidism_suspected } = input;
  let interpretation = 'euthyroid_within_normal_reference_range';
  if (tsh_miu_l > 4.5 && free_t4_ng_dl < 0.8) interpretation = 'primary_hypothyroidism_overt';
  else if (tsh_miu_l > 4.5 && free_t4_ng_dl >= 0.8 && free_t4_ng_dl <= 1.8) interpretation = 'primary_hypothyroidism_subclinical_mild_TSH_elevation';
  else if (tsh_miu_l < 0.1 && free_t4_ng_dl > 1.8 && free_t3_pg_ml > 4.0) interpretation = 'primary_hyperthyroidism_overt';
  else if (tsh_miu_l < 0.1 && free_t4_ng_dl >= 0.8 && free_t4_ng_dl <= 1.8) interpretation = 'subclinical_hyperthyroidism_or_T3_toxicosis_if_free_t3_elevated';
  else if (tsh_miu_l < 0.1 && free_t4_ng_dl < 0.8) interpretation = 'central_hypothyroidism_with_low_TSH_and_low_free_T4';
  if (sick_euthyroid_suspected === 'yes') interpretation = 'sick_euthyroid_syndrome_with_low_TSH_or_low_T3_in_acute_illness_reassess_after_recovery';
  if (trimester_pregnancy) interpretation = 'use_pregnancy_specific_TSH_reference_range_first_trimester_0.1_to_2.5_second_0.2_to_3.0_third_0.3_to_3.5';
  return {
    interpretation,
    next_steps: ['recheck_TSH_and_free_T4_in_4_to_8_weeks_for_subclinical_pattern', 'consider_TPO_antibodies_for_subclinical_hypothyroidism_to_assess_progression_risk', 'review_for_drug_effects_amiodarone_lithium_dopamine_agonists_glucocorticoids', 'consider_pituitary_panel_for_central_hypothyroidism'],
    citation: CITATIONS.ATA_HYPO,
  };
}

function hypothyroidismManagement(input) {
  const { age_years, cardiac_disease, tsh_initial, free_t4_low, thyroidectomy_history, pregnant, levothyroxine_dose, weight_kg, etiology } = input;
  let initial_dose = 'levothyroxine_1.6_mcg_per_kg_per_day_full_replacement_for_young_healthy';
  if (age_years >= 60 || cardiac_disease === 'yes') initial_dose = 'levothyroxine_25_to_50_mcg_daily_start_low_titrate_Q4_to_6_weeks';
  if (pregnant === 'yes') initial_dose = 'levothyroxine_increase_30_to_50pct_above_pre_pregnancy_dose_with_Q4_week_TSH_monitoring';
  if (etiology === 'central_hypothyroidism') initial_dose = 'levothyroxine_dose_based_on_free_T4_target_upper_half_normal_range_not_TSH_due_to_pituitary_dysfunction';
  let target_tsh = '0.5_to_2.5_mIU_per_L_for_most_adults_age_specific_target_for_age_above_70_4_to_6_mIU_per_L';
  return {
    initial_dose, target_tsh,
    titration: 'adjust_Q4_to_6_weeks_by_12.5_to_25_mcg_until_TSH_at_target_then_Q6_to_12_months',
    pregnancy_monitoring: 'TSH_Q4_weeks_first_half_then_Q28_to_32_weeks_target_TSH_below_2.5_first_trimester',
    'etiology_review': ['primary_autoimmune_thyroiditis_Hashimoto_most_common', 'iatrogenic_thyroidectomy_radioactive_iodine', 'central_hypothyroidism_pituitary_or_hypothalamic', 'drug_induced_amiodarone_lithium_immune_checkpoint_inhibitors_tyrosine_kinase_inhibitors_interferon'],
    citation: CITATIONS.ATA_HYPO,
  };
}

function hyperthyroidismManagement(input) {
  const { etiology, age_years, cardiac_disease, tsh_suppressed, free_t4_or_t3_high, graves_features_present, thyroid_nodule_present, pregnancy, thyroid_storm_suspected } = input;
  let first_line = 'methimazole_5_to_30mg_daily_titrate_to_maintenance_5_to_10mg_for_Graves_or_toxic_multinodular_goiter';
  if (etiology === 'graves' && age_years >= 60 && cardiac_disease === 'yes') first_line = 'methimazole_with_atenolol_for_rate_control_plus_consideration_of_radioactive_iodine_RAI_after_stabilization';
  if (pregnancy === 'yes') first_line = 'propylthiouracil_PTU_first_trimester_then_switch_to_methimazole_second_third_trimester';
  if (thyroid_nodule_present === 'yes' && toxic_nodule_suspected) first_line = 'methimazole_then_RAI_or_surgery_for_toxic_adenoma';
  if (thyroid_storm_suspected === 'yes') first_line = 'ICU_admission_IV_propranolol_IV_PTU_or_methimazole_iodine_solution_after_PTU_corticosteroids_aggressive_cooling';
  return {
    first_line,
    treatment_options: ['antithyroid_drugs_methimazole_PTU_12_to_18_months_for_Graves_remission_attempt', 'radioactive_iodine_RAI_curative_for_Graves_or_toxic_nodule', 'thyroidectomy_for_large_goiter_suspicious_nodule_pregnancy_RAI_failure', 'beta_blocker_propranolol_or_atenolol_for_symptomatic_rate_control'],
    monitoring: 'free_T4_Q4_weeks_during_titration_then_Q3_to_6_months_white_blood_cell_count_with_methimazole_PTU_for_agranulocytosis_rare_liver_toxicity',
    citation: CITATIONS.ATA_HYPER,
  };
}

function thyroidNoduleWorkup(input) {
  const { nodule_size_cm, tsh_level, ultrasound_features, prior_history_radiation, family_history_tc, suspicious_ultrasound_tirads_category, cytology_result_bethesda, prior_nodule_followup, compressive_symptoms } = input;
  let workup = 'TSH_then_ultrasound_then_TIRADS_staging';
  if (tsh_level === 'low_suppressed') workup = workup + '_radionuclide_scan_hot_nodule_low_cancer_risk_cold_nodule_higher_risk_further_workup';
  if (nodule_size_cm >= 1 && suspicious_ultrasound_tirads_category === '4_or_5') workup = workup + '_fine_needle_aspiration_FNA_with_cytology';
  if (cytology_result_bethesda === 'IV_follicular_neoplasm_or_suspicious') workup = workup + '_consider_molecular_testing_or_diagnostic_lobectomy';
  if (cytology_result_bethesda === 'VI_malignant') workup = workup + '_refer_to_surgery_for_total_or_subtotal_thyroidectomy';
  if (compressive_symptoms === 'yes') workup = workup + '_surgical_consultation_for_substernal_or_compressive_goiter';
  return {
    workup,
    tirads_categories: ['TR1_benign_no_FNA', 'TR2_not_suspicious_no_FNA', 'TR3_mildly_suspicious_FNA_if_above_2.5cm', 'TR4_moderately_suspicious_FNA_if_above_1.5cm', 'TR5_highly_suspicious_FNA_if_above_1cm_or_consider_for_smaller'],
    followup: 'benign_FNA_Q2_to_3_year_ultrasound_suspicious_subcentimeter_ultrasound_Q6_to_12_months_for_2_years_then_Q_year',
    citation: CITATIONS.ATA_NOD,
  };
}

function thyroidInPregnancy(input) {
  const { trimester, tsh_level, tpo_antibody_positive, prior_thyroid_disease, levothyroxine_use, hypothyroidism_diagnosed_pregnancy, gestational_age_weeks, anti_emetic_drug_use } = input;
  let plan = 'screen_high_risk_only_or_consider_universal_TSH_in_first_trimester';
  if (prior_thyroid_disease === 'yes') plan = 'TSH_Q4_weeks_first_half_Q28_to_32_weeks_then_Q36_weeks_or_with_symptoms';
  if (hypothyroidism_diagnosed_pregnancy === 'yes') plan = 'initiate_levothyroxine_immediately_target_TSH_below_2.5_first_trimester_then_Q4_weeks';
  if (tpo_antibody_positive === 'yes' && tsh_normal) plan = 'monitor_TSH_Q4_weeks_first_trimester_consider_levothyroxine_low_dose_if_TSH_rising';
  let pregnancy_targets = 'TSH_first_trimester_0.1_to_2.5_mIU_per_L_second_0.2_to_3.0_third_0.3_to_3.5';
  return {
    plan, pregnancy_targets,
    postpartum_thyroiditis: 'screen_at_6_weeks_postpartum_for_postpartum_thyroiditis_in_TPO_positive_or_prior_history_follow_Q_year_for_1_to_2_years',
    iodine_requirements: 'iodine_150mcg_daily_pregnancy_220mcg_daily_lactation_via_prenatal_vitamins_or_dietary_sources',
    citation: CITATIONS.ATA_HYPO,
  };
}

module.exports = { thyroidFunctionInterpretation, hypothyroidismManagement, hyperthyroidismManagement, thyroidNoduleWorkup, thyroidInPregnancy, CITATIONS, ValidationError };