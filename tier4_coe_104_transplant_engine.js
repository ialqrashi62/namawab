/**
 * TIER4_COE-104 Transplant Center of Excellence Engine
 * Transplant COE certification + Donor selection + Organ preservation + Immunosuppression + Outcomes
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { SRTR_TRANSPLANT: 'SRTR Transplant Outcomes 2024', OPTN_TRANSPLANT: 'OPTN/UNOS Transplant Policy 2024' };

function transplantCOECertification(input) {
  const { transplant_volume_annual, organ_types_kidney_liver_heart_lung, multidisciplinary_team, transplant_coordinator_nurse_present, transplant_pharmacist_present, infectious_disease_specialist_present, pathology_lab, tissue_typing_lab, UNOS_member_status, CMS_certified_center, transplant_surgery_24_7_on_call, immunosuppression_protocols_standardized, qm_program_with_risk_adjustment, post_transplant_follow_up_program } = input;
  let certification = 'transplant_program_basic';
  if (UNOS_member_status === 'yes' && CMS_certified_center === 'yes' && transplant_pharmacist_present === 'yes' && transplant_coordinator_nurse_present === 'yes' && qm_program_with_risk_adjustment === 'yes') certification = 'comprehensive_transplant_center';
  if (organ_types_kidney_liver_heart_lung === 'multi_organ' && transplant_volume_annual >= 100) certification = 'high_volume_multi_organ_transplant_center';
  return {
    certification,
    team_requirements: ['transplant_surgeons_with_minimum_volume_per_surgeon_15_to_25_cases_per_year', 'transplant_hepatologists_or_nephrologists_for_organ_specific_management', 'transplant_pharmacist_with_specialty_immunosuppression_expertise', 'transplant_coordinator_nurse_for_each_organ_program', 'infectious_disease_specialist_for_immunosuppression_infections', 'dedicated_transplant_ICU_and_floor_beds', 'tissue_typing_lab_24_7_for_urgent_recipients'],
    qm_requirements: ['SRTR_outcomes_review_Q_quarter_with_action_plan', 'graft_and_patient_survival_above_expected_threshold', 'waitlist_management_audit_Q_quarter', 'donor_management_quality_review', 'medication_adherence_monitoring_Q_quarter'],
    citation: CITATIONS.SRTR_TRANSPLANT,
  };
}

function donorSelectionAndManagement(input) {
  const { donor_type_DBD_or_DCD_or_Living, age_years, cause_of_death_for_deceased, cold_ischemia_time_hours, donor_serology_known, donor_function_evaluation, biopsy_for_liver_or_kidney, donation_after_circulatory_death, expanded_criteria_donor, hbv_hcv_antibody_status, cardiac_ejection_fraction_for_heart, donor_creatinine_for_kidney } = input;
  let donor_acceptable = 'standard_criteria_donor_for_immediate_use';
  if (age_years >= 60) donor_acceptable = 'extended_criteria_donor_for_acceptable_recipient_with_informed_consent';
  if (donor_type_DBD_or_DCD_or_Living === 'DCD') donor_acceptable = 'DCD_donor_with_normothermic_machine_perfusion_for_liver_or_kidney_to_improve_outcomes';
  if (donor_type_DBD_or_DCD_or_Living === 'Living') donor_acceptable = 'living_donor_with_complete_medical_psychological_evaluation_with_2_independent_advocates_and_independent_oversight_per_UNOS_policy';
  if (hbv_hcv_antibody_status === 'positive') donor_acceptable = donor_acceptable + '_with_HBV_or_HCV_positive_recipient_consideration_with_treatment';
  return {
    donor_acceptable,
    evaluation: ['complete_donor_history_cause_of_death_hospital_course', 'serology_HBV_HCV_HIV_RPR_CMV_EBV', 'organ_function_assessment_with_creatinine_LFTs_ejection_fraction_PFTs', 'biopsy_for_liver_or_kidney_with_glomerulosclerosis_or_steatosis_assessment', 'anatomic_evaluation_with_imaging_for_size_match_anomalies', 'allocation_per_UNOS_or_other_organ_specific_system'],
    preservation: ['cold_storage_4C_with_UW_or_HTK_solution', 'normothermic_machine_perfusion_to_reduce_ischemia_reperfusion_injury', 'transport_logistics_with_cold_ischemia_time_under_12h_for_liver_under_24h_for_kidney'],
    citation: CITATIONS.OPTN_TRANSPLANT,
  };
}

function immunosuppressionProtocol(input) {
  const { organ_type, induction_immunosuppression_used, maintenance_immunosuppression_3_drugs, mTOR_or_MMF_or_Tacrolimus_combination, steroid_withdrawal_or_maintenance, bk_virus_screening_kidney, ebv_screening_ptld_risk, target_drug_levels, adherence_monitoring } = input;
  let protocol = 'triple_therapy_with_Tacrolimus_MMF_corticosteroid_as_first_line_for_most_organs';
  if (organ_type === 'kidney') protocol = protocol + '_with_induction_basiLiximab_or_rATG_per_recipient_immunologic_risk_then_maintenance_triple_therapy';
  if (organ_type === 'liver') protocol = protocol + '_with_induction_basiliximab_or_steroid_only_for_low_risk_with_donor_specific_antibody_assessment';
  if (organ_type === 'heart') protocol = protocol + '_with_induction_rATG_or_basiliximab_then_maintenance_Tac_MMF_steroid';
  if (organ_type === 'lung') protocol = protocol + '_with_induction_basiliximab_then_maintenance_Tac_MMF_steroid_with_frequent_rejection_monitoring';
  let monitoring = 'target_trough_levels_per_organ_with_Q1_to_2_week_initial_then_Q1_to_3_month_with_drug_interaction_review_and_adherence_monitoring';
  return {
    protocol, monitoring,
    bk_virus: 'Q_month_BK_virus_PCR_for_first_6_months_then_Q3_months_year_1_then_Q_year_for_kidney_with_reduction_immunosuppression_if_viremia',
    ebv_ptld: 'Q3_month_EBV_PCR_first_year_with_PTLD_risk_assessment_and_reduction_immunosuppression_with_rituximab_for_PTLD',
    rejection_surveillance: 'protocol_biopsies_per_organ_with_immunosuppression_adjustment_for_subclinical_or_clinical_rejection_per_Banff_or_ISHLT_or_other_organ_grading',
    citation: CITATIONS.OPTN_TRANSPLANT,
  };
}

function transplantOutcomesAndQuality(input) {
  const { one_year_patient_survival_pct, one_year_graft_survival_pct, three_year_patient_survival_pct, three_year_graft_survival_pct, rejection_rate_1_year_pct, infection_rate_first_year_pct, malignancy_rate_post_transplant_pct, adherence_persistence_pct, qol_score_post_transplant } = input;
  let performance = {
    one_year_patient_survival_pct: one_year_patient_survival_pct,
    one_year_graft_survival_pct: one_year_graft_survival_pct,
    three_year_patient_survival_pct: three_year_patient_survival_pct,
    three_year_graft_survival_pct: three_year_graft_survival_pct,
    rejection_1y_pct: rejection_rate_1_year_pct,
    infection_1y_pct: infection_rate_first_year_pct,
    malignancy_pct: malignancy_rate_post_transplant_pct,
    adherence_pct: adherence_persistence_pct,
    qol_score: qol_score_post_transplant
  };
  let targets_met = {
    one_year_patient_survival_above_90: one_year_patient_survival_pct >= 90,
    one_year_graft_survival_above_85: one_year_graft_survival_pct >= 85,
    rejection_rate_below_15: rejection_rate_1_year_pct < 15,
    infection_rate_below_40: infection_rate_first_year_pct < 40,
    adherence_persistence_above_85: adherence_persistence_pct >= 85
  };
  return {
    performance, targets_met,
    benchmarking: 'compare_to_SRTR_expected_outcomes_per_organ_with_Q_quarter_SRTR_report_review',
    improvement: 'Q_quarter_review_with_Q_quarter_P_and_T_quarter_M_and_M_conferences_for_below_expected_outcomes_with_action_plan',
    citation: CITATIONS.SRTR_TRANSPLANT,
  };
}

function postTransplantFollowUp(input) {
  const { transplant_age_months, current_immunosuppression, current_organ_function, comorbidity_evolution, malignancy_screening_Q_year, cardiovascular_risk_factors, vaccine_completion, social_reintegration } = input;
  let plan = 'standardized_post_transplant_follow_up_per_organ_with_Q1_to_3_month_first_year_then_Q3_months_year_2_to_5_then_Q6_months_beyond';
  let monitoring = ['organ_function_with_creatinine_LFTs_echo_PFTs_per_organ', 'immunosuppression_drug_levels_Q_visit', 'infection_screening_CMV_EBV_BK_PJP_per_organ_protocol', 'malignancy_screening_skin_lymphoma_colon_per_risk', 'cardiovascular_risk_management_statin_anti_HTN_diabetes', 'vaccination_completion_per_immunocompromised_protocol_inactivated_only'];
  let psychosocial = 'psychosocial_assessment_with_Q_year_QOL_measurement_with_intervention_for_depression_anxiety_adherence_issues';
  return {
    plan, monitoring, psychosocial,
    transitions: ['pediatric_to_adult_transition_program_age_18_to_25_with_collaborative_care', 'transition_to_PCP_with_organ_specific_guidance_after_year_5_with_transplant_liaison'],
    long_term: 'chronic_allograft_dysfunction_prevention_with_optimal_immunosuppression_lifestyle_modification_cardiovascular_risk_reduction',
    citation: CITATIONS.OPTN_TRANSPLANT,
  };
}

module.exports = { transplantCOECertification, donorSelectionAndManagement, immunosuppressionProtocol, transplantOutcomesAndQuality, postTransplantFollowUp, CITATIONS, ValidationError };