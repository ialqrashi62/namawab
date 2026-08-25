/**
 * TIER3_RHEUM-301 Rheumatoid Arthritis Engine
 * RA classification (EULAR/ACR 2010) + Disease activity (DAS28) + Treat-to-target strategy + Biologics in RA + Extra-articular RA
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { EULAR_ACR_RA: 'EULAR/ACR RA 2010', EULAR_T2T: 'EULAR Treat-to-Target 2024' };

function raClassificationEularAcr(input) {
  const { joint_involvement_count, serology_rf_and_anti_ccp, symptom_duration_weeks, acute_phase_reactants_esr_or_cr } = input;
  let total_score = 0;
  if (joint_involvement_count === '1_large_joint') total_score += 0;
  else if (joint_involvement_count === '2_to_10_large_joints') total_score += 1;
  else if (joint_involvement_count === '1_to_3_small_joints') total_score += 2;
  else if (joint_involvement_count === '4_to_10_small_joints') total_score += 3;
  else if (joint_involvement_count === 'greater_than_10_small_and_large') total_score += 5;
  if (serology_rf_and_anti_ccp === 'negative') total_score += 0;
  else if (serology_rf_and_anti_ccp === 'low_positive') total_score += 2;
  else if (serology_rf_and_anti_ccp === 'high_positive') total_score += 3;
  if (symptom_duration_weeks < 6) total_score += 0;
  else total_score += 1;
  if (acute_phase_reactants_esr_or_cr === 'normal') total_score += 0;
  else total_score += 1;
  return {
    total_score, classification: total_score >= 6 ? 'RA_classified_per_2010_criteria' : 'RA_not_classified_score_below_6',
    next_step: total_score >= 6 ? 'initiate_DMARD_treatment_methotrexate_first_line' : 'continue_observation_for_differential_diagnosis',
    exclusion_check: ['exclude_other_diseases_SLE_Sjogren_scleroderma_psoriatic_arthritis_gout'],
    citation: CITATIONS.EULAR_ACR_RA,
  };
}

function das28DiseaseActivity(input) {
  const { tender_joint_count_28, swollen_joint_count_28, esr_mm_h, patient_global_assessment_0_to_100 } = input;
  const das28_esr = (0.56 * Math.sqrt(tender_joint_count_28)) + (0.28 * Math.sqrt(swollen_joint_count_28)) + (0.7 * Math.log(esr_mm_h)) + (0.014 * patient_global_assessment_0_to_100);
  let activity = 'remission';
  if (das28_esr > 5.1) activity = 'high_disease_activity';
  else if (das28_esr >= 3.2) activity = 'moderate_disease_activity';
  else if (das28_esr >= 2.6) activity = 'low_disease_activity';
  return {
    das28_esr: das28_esr.toFixed(2), activity,
    target: 'remission_or_low_disease_activity_per_treat_to_target',
    next_step: activity === 'remission' || activity === 'low_disease_activity' ? 'maintain_current_therapy_Q3_months' : activity === 'moderate_disease_activity' ? 'tighten_dmard_therapy_consider_combination_therapy' : 'change_to_different_dmard_combination_or_biologic_addon',
    citation: CITATIONS.EULAR_T2T,
  };
}

function treatToTargetStrategy(input) {
  const { current_das28, treatment_naive, current_dmards, prior_biologics_failure_count, persistent_disease_activity } = input;
  let strategy = 'continue_DMARD_optimization_target_DAS28_less_than_3.2_or_remission_Q3_months';
  if (treatment_naive === 'yes' && persistent_disease_activity === 'yes') strategy = 'initiate_methotrexate_15_to_25mg_weekly_plus_folic_acid_and_reassess_Q3_months';
  if (current_dmards === 'methotrexate_only' && persistent_disease_activity === 'yes') strategy = 'add_targeted_synthetic_or_biologic_DMARD_or_combine_methotrexate_with_another_csDMARD';
  if (prior_biologics_failure_count >= 2) strategy = 'consider_JAK_inhibitor_or_different_class_of_biologic';
  return {
    strategy, current_das28,
    targets_per_EULAR: 'remission_or_low_disease_activity_within_6_months_of_treatment_initiation',
    monitoring: 'DAS28_Q1_to_3_months_with_active_treatment_adjustment',
    citation: CITATIONS.EULAR_T2T,
  };
}

function biologicsInRa(input) {
  const { das28_score, prior_failure_count, tb_risk_factors, hbv_status, pregnancy_planning, comorbidity_infection_history } = input;
  let first_choice_biologic = 'TNFi_inhibitor_adalimumab_etanercept_or_infliximab';
  if (prior_failure_count >= 1) first_choice_biologic = 'consider_non_TNFi_class_abatacept_rituximab_or_tofacitinib_JAK';
  if (hbv_status === 'chronic_hbv') first_choice_biologic = 'entecavir_or_tenofovir_prophylaxis_then_any_biologic';
  if (comorbidity_infection_history === 'recurrent_infections') first_choice_biologic = 'avoid_RTX_and_JAK_prefer_abatacept';
  return {
    first_choice_biologic, das28_score, prior_failure_count,
    pre_screening: ['hepatitis_B_C_serology', 'latent_TB_test_QFT_or_TST', 'CBC_CMP_pregnancy_test', 'baseline_chest_imaging'],
    vaccines_required: ['pneumococcal_PCV13_followed_by_PPSV23', 'influenza_annually', 'shingles_recombinant_shingrix', 'HPV_for_eligible', 'avoid_live_vaccines_during_biologic_therapy'],
    citation: CITATIONS.EULAR_T2T,
  };
}

function extraArticularRa(input) {
  const { rheumatoid_nodules, interstitial_lung_disease_on_CT, pericardial_effusion, scleritis_or_episcleritis, vasculitis_skin, felty_syndrome_triad } = input;
  let severe_ea_present = false;
  if (interstitial_lung_disease_on_CT === 'yes' || pericardial_effusion === 'yes' || scleritis_or_episcleritis === 'yes' || vasculitis_skin === 'yes') severe_ea_present = true;
  return {
    extra_articular_present: severe_ea_present || rheumatoid_nodules === 'yes' || felty_syndrome_triad === 'yes',
    rheumatoid_nodules: rheumatoid_nodules === 'yes',
    interstitial_lung_disease: interstitial_lung_disease_on_CT === 'yes',
    management: severe_ea_present ? ['urgent_rheumatology_consultation', 'consider_rituximab_for_RA_ILD', 'regular_PFTs_and_HRCT_for_RA_ILD', 'consider_nintedanib_or_pirfenidone_for_progressive_fibrosing_ILD', 'methotrexate_avoid_if_severe_pre_existing_ILD'] : 'continue_standard_DMARD_with_monitoring',
    felty_syndrome: felty_syndrome_triad === 'yes' ? 'triad_of_RA_splenomegaly_neutropenia_consider_methotrexate_or_rituximab' : 'no',
    citation: CITATIONS.EULAR_T2T,
  };
}

module.exports = { raClassificationEularAcr, das28DiseaseActivity, treatToTargetStrategy, biologicsInRa, extraArticularRa, CITATIONS, ValidationError };