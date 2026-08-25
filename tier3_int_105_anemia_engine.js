/**
 * TIER3_INT-105 Anemia Workup Engine
 * Anemia classification + Iron deficiency + B12/Folate + Hemolytic workup + Transfusion thresholds
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASH_ANEMIA: 'ASH Anemia Guidelines 2023' };

function anemiaClassification(input) {
  const { hemoglobin_g_dl, mcv_fL, mch_pg, mchc_g_dl, rdw_pct, reticulocyte_count, age_years, sex } = input;
  let classification = 'normal_for_age_and_sex';
  if (hemoglobin_g_dl < 12) classification = 'anemia_present_investigate';
  let morphology = 'normocytic_normochromic';
  if (mcv_fL < 80) morphology = 'microcytic_hypochromic';
  else if (mcv_fL > 100) morphology = 'macrocytic';
  let reticulocyte_response = 'inadequate_low_reticulocyte_count_hypoproliferative';
  if (reticulocyte_count > 2) reticulocyte_response = 'adequate_high_reticulocyte_count_hyperproliferative_or_hemolysis';
  let differential = ['microcytic_iron_deficiency_thalassemia_anemia_of_chronic_disease_lead_poisoning_sideroblastic', 'normocytic_anemia_of_chronic_disease_renal_failure_aplastic_early_iron_B12_folate', 'macrocytic_B12_folate_deficiency_alcohol_liver_thyroid_drugs', 'hemolytic_autoimmune_hereditary_spherocytosis_G6PD_mechanical_MAHA_paroxysmal_nocturnal_hemoglobinuria'];
  return {
    classification, morphology, reticulocyte_response, differential,
    initial_workup: ['CBC_with_indices', 'reticulocyte_count', 'peripheral_blood_smear_for_morphology', 'iron_studies_ferritin_TIBC_iron_saturation', 'B12_folate', 'renal_function_TSH_for_anemia_of_chronic_disease_or_hypothyroidism', 'LDH_indirect_bilirubin_haptoglobin_for_hemolysis_workup'],
    citation: CITATIONS.ASH_ANEMIA,
  };
}

function ironDeficiencyManagement(input) {
  const { ferritin_ng_ml, iron_saturation_pct, hemoglobin_g_dl, symptom_severity, oral_intolerance, iv_access, malabsorption, pregnancy, bariatric_surgery_history } = input;
  let first_line = 'oral_iron_sulfate_325mg_TID_or_alternate_day_dosing_to_reduce_GI_side_effects_with_vitamin_C_for_absorption';
  if (oral_intolerance === 'yes' || malabsorption === 'yes' || iv_access === 'available') first_line = 'IV_iron_ferric_carboxymaltose_or_iron_isomaltoside_1000mg_single_infusion_per_need';
  if (pregnancy === 'yes') first_line = 'oral_iron_with_Q4_week_CBC_then_IV_iron_if_no_response_or_severe_anemia_with_2nd_or_3rd_trimester';
  if (bariatric_surgery_history === 'yes') first_line = 'IV_iron_required_due_to_malabsorption';
  let target_ferritin = 'ferritin_above_30_ng_per_mL_or_above_100_for_CKD_or_inflammatory_states';
  return {
    first_line, target_ferritin,
    workup_for_cause: ['GI_evaluation_upper_endoscopy_colonoscopy_for_menorrhagia_or_GI_bleeding_above_50_or_anemia_persistent_after_replacement', 'celiac_serology_tTG_IgA_for_malabsorption', 'hemoccult_or_FIT_for_occult_GI_bleeding', 'gynecology_evaluation_for_menorrhagia_with_imaging_and_treatment'],
    duration: 'continue_oral_3_to_6_months_after_Hgb_normalized_to_replenish_stores',
    citation: CITATIONS.ASH_ANEMIA,
  };
}

function b12FolateDeficiency(input) {
  const { b12_pg_ml, folate_ng_ml, methylmalonic_acid_elevated, homocysteine_elevated, intrinsic_factor_antibody_positive, parietal_cell_antibody_positive, neurologic_symptoms, macrocytic_anemia, gastrectomy_history, metformin_use, PPI_use } = input;
  let diagnosis = 'b12_deficiency_with_elevated_MMA_confirmed';
  let first_line = 'IM_b12_cyanocobalamin_1000mcg_daily_for_7_days_then_weekly_for_4_weeks_then_monthly_maintenance';
  if (neurologic_symptoms === 'yes') first_line = 'IM_b12_intensive_daily_for_2_weeks_then_weekly_then_monthly_with_neurology_follow_up';
  if (parietal_cell_antibody_positive === 'yes' || intrinsic_factor_antibody_positive === 'yes') first_line = 'IM_b12_lifelong_pernicious_anemia';
  let folate_plan = 'oral_folic_acid_1_to_5mg_daily_for_1_to_4_months_then_dietary_focus';
  return {
    diagnosis, first_line, folate_plan,
    dietary: 'b12_animal_products_meat_fish_eggs_dairy_folate_leafy_greens_legumes_citrus',
    metformin_ppi: 'long_term_metformin_or_PPI_use_lowers_b12_consider_supplementation_or_monitoring',
    neurologic_recovery: 'neurologic_symptoms_may_take_6_to_12_months_to_resolve_some_residual_deficits_may_persist_if_delayed_treatment',
    citation: CITATIONS.ASH_ANEMIA,
  };
}

function hemolyticAnemiaWorkup(input) {
  const { haptoglobin_low, indirect_bilirubin_high, ldh_high, retic_count_high, peripheral_smear_schistocytes_or_spherocytes, coombs_test_positive, family_history_hereditary_spherocytosis, g6pd_deficiency_suspected, hemoglobinuria_present, cold_agglutinin_positive } = input;
  let type = 'hemolytic_anemia_unclassified';
  if (coombs_test_positive === 'yes_warm') type = 'warm_autoimmune_hemolytic_anemia';
  if (cold_agglutinin_positive === 'yes') type = 'cold_agglutinin_disease_or_infection_related_Mycoplasma_EBV';
  if (peripheral_smear_schistocytes_or_spherocytes === 'yes' && coombs_test_positive !== 'yes_warm') type = 'microangiopathic_hemolytic_anemia_TTP_HUS_DIC_mechanical_valve';
  if (family_history_hereditary_spherocytosis === 'yes') type = 'hereditary_spherocytosis';
  if (g6pd_deficiency_suspected === 'yes') type = 'G6PD_deficiency_with_oxidative_stress_hemolysis_fava_beans_drugs_infections';
  return {
    type,
    workup: ['coombs_direct_antiglobulin_test', 'peripheral_smear_review_for_spherocytes_schistocytes_bite_cells_elliptocytes', 'LDH_indirect_bilirubin_haptoglobin_urine_hemosiderin', 'flow_cytometry_for_PNH_clone_CD55_CD59', 'G6PD_assay_during_steady_state', 'osmotic_fragility_or_EMA_binding_for_hereditary_spherocytosis', 'cold_agglutinins_titers', 'bone_marrow_for_unclear_cases'],
    citation: CITATIONS.ASH_ANEMIA,
  };
}

function transfusionThresholds(input) {
  const { hemoglobin_g_dl, acute_or_chronic, symptoms_present, active_bleeding, cardiac_disease, sepsis_present, rest_or_asymptomatic, prior_transfusion_reaction } = input;
  let threshold = 'restrictive_threshold_7_g_per_dL_for_hemodynamically_stable';
  if (cardiac_disease === 'yes' || symptoms_present === 'yes') threshold = 'threshold_8_g_per_dL_or_symptom_triggered';
  if (active_bleeding === 'yes') threshold = 'transfuse_based_on_bleeding_rate_and_hemodynamics_not_single_Hgb_value_massive_transfusion_protocol_for_severe_bleeding';
  if (rest_or_asymptomatic === 'yes') threshold = 'no_transfusion_evaluate_cause_and_optimize_iron_B12_erythropoietin_as_appropriate';
  if (prior_transfusion_reaction === 'yes') threshold = 'washed_packed_RBCs_or_phenotyped_RBCs_for_recurrent_reactions_leukoreduced_irradiated_for_immunocompromised';
  return {
    threshold,
    one_unit_policy: 'transfuse_one_unit_then_reassess_repeat_Hgb_to_avoid_over_transfusion',
    component_choice: 'packed_RBCs_for_volume_replacement_platelets_for_thrombocytopenia_or_active_bleeding_FFP_for_coagulopathy_cryoprecipitate_for_fibrinogen_less_than_100_to_150',
    alternatives: 'IV_iron_for_iron_deficiency_anemia_erythropoietin_for_CKD_related_anemia_with_target_Hgb_10_to_11.5',
    citation: CITATIONS.ASH_ANEMIA,
  };
}

module.exports = { anemiaClassification, ironDeficiencyManagement, b12FolateDeficiency, hemolyticAnemiaWorkup, transfusionThresholds, CITATIONS, ValidationError };