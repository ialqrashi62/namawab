/**
 * TIER4_COE-103 Oncology Center of Excellence Engine
 * Oncology COE certification + Multidisciplinary care + Clinical trials + NCCN guidelines + Survivorship
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { COC_ONC: 'Commission on Cancer 2024', ASCO_COE: 'ASCO Certified Program 2024' };

function oncologyCOECertification(input) {
  const { annual_analytic_cases, cancer_types_treated, multidisciplinary_tumor_board, clinical_trials_open, accreditation_status_coc_asco, cancer_liaison_physician_present, nurse_navigator_present, registry_data_participation_NCDB, psychosocial_services, palliative_care_integration, survivorship_program, qoL_data_collection, genetic_counseling } = input;
  let certification = 'oncology_program_basic';
  if (annual_analytic_cases >= 200 && multidisciplinary_tumor_board === 'weekly' && clinical_trials_open === 'multiple_cancer_types') certification = 'oncology_center_with_multidisciplinary_care';
  if (accreditation_status_coc_asco === 'yes' && cancer_liaison_physician_present === 'yes' && nurse_navigator_present === 'yes' && registry_data_participation_NCDB === 'yes') certification = 'comprehensive_community_cancer_program_or_academic_comprehensive_cancer_center';
  let gaps = [];
  if (multidisciplinary_tumor_board !== 'weekly') gaps.push('tumor_board_at_least_weekly_or_per_cancer_type_per_standard');
  if (cancer_liaison_physician_present !== 'yes') gaps.push('cancer_liaison_physician_required_for_COC_accreditation');
  if (nurse_navigator_present !== 'yes') gaps.push('nurse_navigator_required_for_continuity_of_care_and_COC_accreditation');
  return {
    certification, gaps,
    co_standards: ['cancer_committee_quarterly_meetings_with_physician_leadership', 'annual_analytic_case_volume_above_100_required_for_3_year_accreditation', 'NCDB_data_submission_Q_year_for_quality_benchmarking', 'comprehensive_patient_centered_standards_24_per_year_evaluated', 'public_reporting_of_quality_indicators_4_to_6_per_year'],
    qoL_programs: ['NCCN_distress_thermometer_screening_Q_visit', 'genetic_counseling_for_hereditary_cancer_syndromes', 'survivorship_care_plan_for_all_curative_patients', 'psychosocial_distress_management_protocol'],
    citation: CITATIONS.COC_ONC,
  };
}

function multidisciplinaryTumorBoard(input) {
  const { cancer_type, case_complexity, attendees_present, presentation_format, treatment_recommendations, time_to_recommendation_days, molecular_profiling_review, genomic_review, clinical_trials_matched } = input;
  let plan = 'weekly_multidisciplinary_tumor_board_with_medical_oncology_radiation_oncology_surgical_oncology_pathology_radiology_nurse_navigator_social_work_genetic_counseling';
  let elements = ['case_presentation_with_history_imaging_pathology', 'molecular_profiling_review_with_actionable_alterations', 'treatment_recommendations_per_NCCN_or_other_guidelines', 'clinical_trial_enrollment_options', 'supportive_care_psychosocial_needs', 'genetic_counseling_consultation_for_hereditary_risk'];
  let documentation = 'tumor_board_documented_with_attendees_cases_presented_recommendations_with_QI_audit_of_adherence_to_recommendations';
  return {
    plan, elements, documentation,
    impact: 'tumor_board_recommendations_followed_above_85pct_target_with_evidence_of_improved_outcomes_psychological_clarity_for_patient',
    metrics: 'case_review_time_target_within_2_weeks_of_initial_consultation_or_treatment_decision_for_complex_cancers',
    citation: CITATIONS.COC_ONC,
  };
}

function clinicalTrialsIntegration(input) {
  const { trial_open_per_cancer_type, trial_sponsor_industry_or_NIH, enrollment_target_per_trial, screen_failure_rate_pct, phase_distribution, biomarker_required, consent_process, IRB_oversight } = input;
  let plan = 'comprehensive_clinical_trial_program_with_NIH_or_industry_collaboration_for_all_major_cancer_types';
  let trial_categories = ['phase_1_first_in_human_dose_finding', 'phase_2_efficacy_safety_in_target_population', 'phase_3_randomized_versus_standard_of_care', 'registries_observational_long_term_outcomes', 'tissue_banking_correlative_studies'];
  let consent = 'IRB_approved_consent_process_with_clear_language_understandable_per_8th_grade_level_with_interpreter_for_non_english_with_quick_consent_for_emergency_settings_per_21_CFR_50';
  let outcomes = 'accrual_target_10pct_of_analytic_cases_per_year_per_academic_oncology_or_5pct_per_community_cancer_program';
  return {
    plan, trial_categories, consent, outcomes,
    coordination: 'clinical_research_coordinator_with_dedicated_team_for_each_cancer_type_with_Q_week_screening_log_review',
    disparities: 'address_disparities_with_intentional_recruitment_of_underserved_populations_with_language_access_and_transportation_resources',
    citation: CITATIONS.ASCO_COE,
  };
}

function genomicAndMolecularTargetedTherapy(input) {
  const { cancer_type, next_gen_sequencing_done, actionable_mutations_identified, biomarker_target_therapy_matched, immunotherapy_biomarker_PDL1_or_TMB_MSI, second_opinion_molecular_tumor_board, tissue_or_liquid_biopsy } = input;
  let plan = 'comprehensive_molecular_profiling_with_NGS_panel_for_solid_tumors_and_hematologic_malignancies_with_actionable_alterations';
  if (cancer_type === 'lung' || cancer_type === 'colon' || cancer_type === 'breast') plan = plan + '_with_NCCN_recommended_panel_for_targeted_therapy_options';
  let biomarkers = ['EGFR_ALK_ROS1_KRAS_MET_for_lung', 'BRAF_KRAS_NRAS_MSI_for_colon', 'ER_PR_HER2_BRCA_for_breast', 'BRCA_HRD_for_ovarian_breast_prostate', 'MSI_TMB_for_immunotherapy_eligibility', 'NTRK_for_any_tumor_for_larotrectinib_entrectinib'];
  return {
    plan, biomarkers,
    results_review: 'molecular_tumor_board_with_genetic_pathologist_oncologist_genetic_counselor_for_actionable_alteration_review_with_Q_week_tumor_board_specific_to_molecular_review',
    patient_education: 'patient_education_with_genetic_counselor_for_inherited_cancer_syndromes_with_implications_for_family_testing',
    turnaround: 'target_turnaround_2_to_4_weeks_for_comprehensive_panel_to_avoid_treatment_delay_with_rapid_panel_for_urgent_indications',
    citation: CITATIONS.ASCO_COE,
  };
}

function cancerSurvivorshipCOE(input) {
  const { survivorship_care_plan_rate_pct, distress_screen_rate_pct, follow_up_visit_compliance, lifestyle_program_referral, cardiovascular_risk_monitoring, second_malignancy_screening, psychosocial_follow_up, return_to_work_support } = input;
  let performance = {
    survivorship_care_plan_pct: survivorship_care_plan_rate_pct + 'pct_of_curative_patients_with_documented_plan',
    distress_screen_pct: distress_screen_rate_pct + 'pct_with_referral',
    follow_up_visit_pct: follow_up_visit_compliance + 'pct_attended_follow_up_Q_year_3_year',
    cv_monitoring_pct: cardiovascular_risk_monitoring + 'pct_with_anthracycline_or_breast_patients',
    second_malignancy_screen_pct: second_malignancy_screening + 'pct_completed_recommended_screenings'
  };
  let targets_met = {
    survivorship_plan_above_90: survivorship_care_plan_rate_pct >= 90,
    distress_screen_above_85: distress_screen_rate_pct >= 85,
    follow_up_above_80: follow_up_visit_compliance >= 80,
    cv_monitoring_above_85: cardiovascular_risk_monitoring >= 85
  };
  return {
    performance, targets_met,
    programs: ['survivorship_clinic_with_dedicated_nurse_practitioner', 'cardio_oncology_program_for_anthracycline_breast_patients', 'lifestyle_program_referral_dietitian_exercise_psychology', 'second_malignancy_screening_per_NCCN', 'psychosocial_support_groups_with_peer_navigation'],
    improvement: 'Q_quarter_review_with_action_plan_for_below_target_metrics_share_with_cancer_committee_for_accountability',
    citation: CITATIONS.COC_ONC,
  };
}

module.exports = { oncologyCOECertification, multidisciplinaryTumorBoard, clinicalTrialsIntegration, genomicAndMolecularTargetedTherapy, cancerSurvivorshipCOE, CITATIONS, ValidationError };