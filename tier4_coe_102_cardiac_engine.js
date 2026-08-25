/**
 * TIER4_COE-102 Cardiac Center of Excellence Engine
 * Cardiac COE certification + Cardiac surgery + TAVR + ECMO + LVAD
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACC_COE: 'ACC Cardiac COE 2024', STS_CARD: 'STS Cardiac Surgery 2024' };

function cardiacCOECertification(input) {
  const { cardiac_surgery_volume_annual, cabg_volume_annual, valve_volume_annual, tavr_volume_annual, structural_volume, cv_surgery_team_size, cardiac_anesthesia_team, perfusion_team, icu_dedicated_cardiac, cvicu_bed_count, stemi_program_24_7, ecmo_program, lvad_program, heart_transplant_program, multidisciplinary_hf_team, quality_program_sts_database } = input;
  let certification_level = 'cardiac_center_basic';
  if (cardiac_surgery_volume_annual >= 300 && stemi_program_24_7 === 'yes' && ecmo_program === 'yes' && quality_program_sts_database === 'yes') certification_level = 'comprehensive_cardiac_center';
  if (heart_transplant_program === 'yes' && lvad_program === 'yes') certification_level = 'advanced_cardiac_center_with_transplant';
  let gaps = [];
  if (cardiac_surgery_volume_annual < 200) gaps.push('cardiac_surgery_volume_below_threshold_for_excellence_with_low_volume_outcomes_risk');
  if (stemi_program_24_7 !== 'yes') gaps.push('STEMI_program_24_7_required_for_COE_with_interventional_cardiology_on_call');
  if (quality_program_sts_database !== 'yes') gaps.push('STS_database_participation_required_for_outcome_benchmarking_and_COE_certification');
  return {
    certification_level, gaps,
    team_requirements: ['cardiac_surgeons_with_minimum_annual_volume_per_surgeon_75_to_100_cases', 'cardiac_anesthesiologists_with_TEE_expertise', 'perfusionists_certified_per_ABCP', 'cardiac_critical_care_intensivists', 'advanced_practice_providers_with_cardiac_specialty', 'heart_failure_cardiologists_with_advanced_training', 'interventional_cardiology_team_for_cath_and_structural'],
    program_quality: ['STS_database_participation_with_Q_quarter_outcomes_review', 'annual_volume_per_surgeon_with_outcome_correlation', 'multidisciplinary_morbidity_mortality_conference', 'patient_satisfaction_with_Q_year_HCAHPS_review'],
    citation: CITATIONS.ACC_COE,
  };
}

function stemiProgramActivation(input) {
  const { first_medical_contact_to_balloon_min, door_to_balloon_min, presentation_direct_to_pci_or_fibrinolysis, kentucky_cardiac_arrest_center_or_hub, pre_hospital_ecg_transmission, aspiration_thrombectomy_used, radial_access_chosen, antiplatelet_strategy, heparin_use, bivalirudin_use, prasugrel_or_ticagrelor_load, time_of_presentation } = input;
  let performance = 'STEMI_activation_optimal_with_target_door_to_balloon_below_90min';
  if (door_to_balloon_min > 90) performance = 'DELAY_door_to_balloon_above_target_investigate_root_cause_with_EMS_handoff_ED_processing_cath_team_activation';
  if (first_medical_contact_to_balloon_min > 120) performance = 'FMC_to_device_above_target_for_direct_admission_patients_review_EMS_transport_protocols';
  let plan = 'primary_PCI_with_radial_access_with_aspiration_thrombectomy_then_drug_eluting_stent_then_dual_antiplatelet';
  if (presentation_direct_to_pci_or_fibrinolysis === 'fibrinolysis_then_rescue') plan = 'fibrinolytic_therapy_with_tenecteplase_then_rescue_PCI_for_failed_reperfusion_then_standard_dual_antiplatelet';
  return {
    performance, plan,
    quality: 'heart_attack_team_page_with_5_min_response_cath_lab_activation_with_30_min_door_to_cath_lab_entry',
    metrics: 'mortality_at_30d_target_below_5pct_for_above_45_min_door_to_balloon_threshold_AMI_performance_risk_stratified',
    citation: CITATIONS.STS_CARD,
  };
}

function tavrProgramOptimization(input) {
  const { tavr_volume_annual, valve_type_balloon_vs_self_expanding, access_route, conscious_sedation_use, cto_or_bypass_concurrent, frailty_assessment, ckd_present, age_years, life_expectancy_years, surgical_risk_score_sts_prom } = input;
  let plan = 'TAVR_team_with_heart_valve_clinic_multidisciplinary_with_interventional_cardiology_and_cardiac_surgery';
  let access = 'transfemoral_default_with_alternative_access_subclavian_carotid_direct_aortic_for_peripheral_disease';
  if (frailty_assessment === 'frail') plan = plan + '_consider_surgical_AVR_for_younger_or_less_frail_with_lower_lifetime_bioprosthetic_durability_risk';
  if (age_years >= 80 && life_expectancy_years < 5 && surgical_risk_score_sts_prom >= 8) plan = plan + '_TAVR_preferred_over_surgical_AVR_due_to_lower_invasive_burden';
  return {
    plan, access,
    workup: ['CT_angiography_for_annular_sizing_access_planning', 'echo_for_severity_LV_function_other_valves_PAP', 'frailty_assessment_with_EF_index_30sec_chair_stand_CFS', 'CABG_or_PCI_concurrent_or_staged', 'STS_PROM_for_risk_stratification'],
    outcomes: 'mortality_30d_below_2pct_stroke_30d_below_1.5pct_pacemaker_below_15pct_for_self_expanding_above_with_long_term_durability_above_95pct_at_5_years',
    citation: CITATIONS.ACC_COE,
  };
}

function ecmoProgramManagement(input) {
  const { ecmo_modality_VA_or_VV_or_VA_VV, indication, cannulation_approach, ecmo_team_24_7, ecmo_specialist_nurse_to_bed_ratio, target_pump_flow, sweep_gas_flow, anticoagulation_target, complications, transplant_bridge } = input;
  let plan = 'ECMO_initiation_with_multidisciplinary_team_cardiothoracic_surgery_perfusion_intensivist_critical_care';
  let criteria = 'ecmo_initiation_for_cardiogenic_shock_or_refractory_cardiac_arrest_or_post_cardiotomy_or_bridge_to_transplant_or_LVAD_per_extracorporeal_life_support_organization_ELSO_guidelines';
  let monitoring = 'pump_flow_target_above_4L_per_min_for_70kg_patient_with_arterial_oxygenation_SvO2_above_70_pulsatile_flow_present_MAP_above_65';
  let weaning = 'wean_evaluation_with_daily_trials_of_reduced_flow_with_echo_assessment_of_recovery_with_clear_decannulation_when_meeting_criteria';
  return {
    plan, criteria, monitoring, weaning,
    complications: ['bleeding_with_anticoagulation_management', 'thrombosis_with_pump_failure', 'limb_ischemia_with_cannulation', 'infection_with_cannula_or_line_sepsis', 'hemolysis_with_pump_malfunction'],
    citation: CITATIONS.ACC_COE,
  };
}

function lvadProgramManagement(input) {
  const { lvad_type_hvad_or_lvad, indication_bridge_to_transplant_or_destination_therapy, implant_year, baseline_lvef, INTERMACS_profile, comorbid_status, right_ventricular_function, pulmonary_hypertension, bleeding_thrombosis_complications, driveline_infection } = input;
  let plan = 'destination_therapy_LVAD_for_END_STAGE_HF_with_INTERMACS_2_to_4_with_durable_mechanical_support';
  let criteria = 'advanced_HF_with_LVEF_below_25pct_with_optimal_GDMT_for_3_months_with_hospitalization_for_decompensation_or_inotrope_dependency_or_arrhythmic_events';
  let post_op = 'anticoagulation_with_warfarin_and_aspirin_with_target_INR_2_to_3_with_driveline_care_dressing_changes_Q_week_with_psychological_support_and_caregiver_training';
  let complications = ['driveline_infection_with_MRSA_or_Pseudomonas_with_suppression_antibiotics_or_exchange', 'pump_thrombosis_with_hemolysis_with_warfarin_intensification_or_pump_exchange', 'right_HF_with_severe_TR_with_RVAD_consideration', 'GI_bleeding_with_AVA_formation_with_angiodysplasia_diagnosis_with_occlusion_of_inflow_cannula'];
  return {
    plan, criteria, post_op, complications,
    monitoring: 'durable_device_follow_up_Q_month_first_year_then_Q3_months_with_echo_Q_year_battery_check_dressing_review',
    long_term_outcomes: 'survival_above_80pct_at_1_year_for_destination_therapy_with_QOL_improvement_per_INTERMACS_dataset',
    citation: CITATIONS.STS_CARD,
  };
}

module.exports = { cardiacCOECertification, stemiProgramActivation, tavrProgramOptimization, ecmoProgramManagement, lvadProgramManagement, CITATIONS, ValidationError };