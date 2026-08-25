/**
 * TIER3_ONC-102 Tumor Markers Engine
 * Marker interpretation + Screening + Treatment monitoring + Surveillance + False-positive sources
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NCCN_MARKERS: 'NCCN Tumor Markers 2024', ASCO_MARKERS: 'ASCO Tumor Markers Use 2024' };

function tumorMarkerInterpretation(input) {
  const { marker_name, value, reference_range, clinical_context, prior_value, trend, renal_function, hepatic_function, other_conditions } = input;
  let interpretation = 'within_normal_reference_range';
  let significant_change = false;
  let recommendation = 'no_immediate_action_reassess_clinical_context';
  if (value > reference_range) {
    interpretation = 'elevated_above_reference_range';
    if (marker_name === 'PSA' && value >= 4 && clinical_context === 'prostate_cancer_screening') interpretation = 'PSA_elevated_consider_prostate_biopsy_with_shared_decision_making';
    if (marker_name === 'CA_19_9' && value >= 37 && clinical_context === 'pancreatic_cancer_suspicion') interpretation = 'CA_19_9_elevated_supportive_of_pancreatic_cancer_with_imaging';
    if (marker_name === 'CEA' && value >= 5 && clinical_context === 'colon_cancer_surveillance') interpretation = 'CEA_elevated_consider_imaging_for_recurrence';
    if (marker_name === 'AFP' && value >= 400 && clinical_context === 'HCC_surveillance') interpretation = 'AFP_elevated_supportive_of_HCC_with_imaging_LI_RADS';
    if (marker_name === 'CA_125' && value >= 35 && clinical_context === 'ovarian_cancer_postmenopausal') interpretation = 'CA_125_elevated_consider_imaging_and_gynecology_consult';
    if (prior_value !== undefined && value / prior_value >= 1.5) significant_change = true;
    if (significant_change) recommendation = 'recheck_in_2_to_4_weeks_with_imaging_per_clinical_context_if_sustained_or_increasing';
  }
  return {
    interpretation, significant_change, recommendation,
    confounding_factors: ['renal_failure_elevates_AFP_CA_19_9_PSA', 'smoking_elevates_CEA', 'menstruation_pregnancy_elevates_CA_125', 'hepatitis_cirrhosis_elevates_AFP_CEA', 'benign_prostatic_hypertrophy_prostatitis_elevates_PSA'],
    citation: CITATIONS.ASCO_MARKERS,
  };
}

function screeningCancerMarkers(input) {
  const { age_years, sex, family_history, symptoms_present, exposure_history, marker_recommended_for_screening, shared_decision_factors } = input;
  let screening_recommendation = 'shared_decision_making_with_patient_for_or_against_screening';
  if (marker_recommended_for_screening === 'PSA_prostate' && sex === 'male' && age_years >= 50 && age_years <= 70 && family_history === 'no') screening_recommendation = 'shared_decision_with_patient_about_PSA_screening_Q_year_after_risk_benefit_discussion';
  if (marker_recommended_for_screening === 'PSA_prostate' && family_history === 'yes') screening_recommendation = 'shared_decision_with_patient_start_age_40_to_45_with_first_degree_relative';
  if (marker_recommended_for_screening === 'CA_125_ovarian') screening_recommendation = 'NOT_recommended_for_average_risk_women_inconsistent_benefit_recommended_for_high_risk_BRCA_with_imaging_per_NCCN';
  if (marker_recommended_for_screening === 'CEA') screening_recommendation = 'NOT_recommended_for_average_risk_screening_use_for_known_cancer_surveillance';
  return {
    screening_recommendation,
    uspstf_recommendations: ['PSA_prostate_C_USPSTF_individual_decision_age_55_to_69', 'PSA_prostate_above_70_D_recommend_against', 'ovarian_CA_125_with_US_D_recommend_against', 'lung_LDCT_screening_age_50_to_80_with_30_pack_year_smoking'],
    citation: CITATIONS.NCCN_MARKERS,
  };
}

function treatmentResponseMonitoring(input) {
  const { cancer_type, baseline_marker_pre_treatment, current_marker_value, cycles_completed, imaging_response, recurrence_suspected, treatment_changed } = input;
  let response_assessment = 'incomplete_assessment_need_imaging_correlation';
  if (imaging_response === 'CR' && current_marker_value <= baseline_marker_pre_treatment * 0.1) response_assessment = 'complete_response_imaging_and_marker_normalized';
  if (imaging_response === 'PR' && current_marker_value < baseline_marker_pre_treatment) response_assessment = 'partial_response_continue_treatment';
  if (imaging_response === 'SD' && current_marker_value <= baseline_marker_pre_treatment) response_assessment = 'stable_disease_monitor';
  if (imaging_response === 'PD' || current_marker_value >= baseline_marker_pre_treatment * 1.2) response_assessment = 'progressive_disease_change_treatment';
  return {
    response_assessment,
    marker_specific_response: 'CEA_for_colon_marker_should_normalize_post_resection_increase_suggests_recurrence_AFP_for_HCC_response_to_treatment_PSADT_for_prostate_cancer_recurrence',
    recist_criteria: 'complete_response_CR_disappearance_partial_response_PR_above_30pct_reduction_progressive_disease_PD_above_20pct_increase_stable_disease_SD_neither',
    clinical_correlation: 'marker_change_without_imaging_correlation_NOT_actionable_imaging_first_for_response_assessment',
    citation: CITATIONS.NCCN_MARKERS,
  };
}

function surveillanceProtocol(input) {
  const { cancer_type, treatment_curative_intent, years_post_treatment, recurrence_risk, patient_preference_for_intensity, biomarkers_for_surveillance } = input;
  let surveillance_plan = 'evidence_based_surveillance_per_NCCN_guidelines_for_specific_cancer';
  if (cancer_type === 'colon_cancer_stage_III' && years_post_treatment < 3) surveillance_plan = 'CEA_Q3_months_Q_year_Q2_years_Q6_months_3_to_5_years_CT_chest_abdomen_pelvis_Q_year_for_3_years_colonoscopy_1_year_then_Q3_years';
  if (cancer_type === 'breast_cancer' && treatment_curative_intent === 'yes') surveillance_plan = 'mammography_Q_year_annual_breast_MRI_if_high_risk_for_BRCA_pelvic_Pap_if_endometrial_ca_risk';
  if (cancer_type === 'prostate_cancer_post_curative_treatment') surveillance_plan = 'PSA_Q3_months_x_2_years_then_Q6_months_imaging_only_if_symptomatic_or_PSA_rising';
  return {
    surveillance_plan,
    recurrence_screening_imaging: 'CT_imaging_per_protocol_for_high_recurrence_risk_or_symptomatic_or_marker_rising',
    general: 'symptom_triggered_imaging_outside_protocol_follow_up_clinic_Q3_to_6_months_psychological_support',
    citation: CITATIONS.NCCN_MARKERS,
  };
}

function falsePositiveSources(input) {
  const { marker_name, elevated_value, patient_age, comorbidities, smoking_status, pregnancy, other_drugs_use } = input;
  let false_positives = [];
  if (marker_name === 'PSA') false_positives.push('BPH_prostatitis_recent_ejaculation_recent_DRE_recent_cystoscopy_urinary_tract_infection_bike_riding');
  if (marker_name === 'CEA' && smoking_status === 'current') false_positives.push('smoking_related_CEA_elevation_2_to_5_normal_upper_limit');
  if (marker_name === 'AFP' && pregnancy === 'yes') false_positives.push('pregnancy_AFP_elevated_normal_resolves_post_delivery');
  if (marker_name === 'CA_125' && (pregnancy === 'yes' || other_drugs_use === 'tamoxifen')) false_positives.push('pregnancy_endometriosis_PCOS_menstruation_tamoxifen_elevated_CA_125');
  if (marker_name === 'CA_19_9' && patient_age === 'above_70') false_positives.push('benign_biliary_disease_pancreatitis_liver_disease_renal_insufficiency');
  if (marker_name === 'AFP' && (comorbidities === 'hepatitis' || comorbidities === 'cirrhosis')) false_positives.push('hepatitis_cirrhosis_regenerative_nodule_serum_AFP_elevated_without_HCC');
  return {
    false_positives,
    workup_to_rule_out_false_positive: ['repeat_marker_after_avoidance_of_modifiable_factors_2_to_4_weeks', 'imaging_for_anatomic_correlation', 'consider_age_renal_hepatic_function_effects', 'consider_smoking_cessation_recheck'],
    citation: CITATIONS.ASCO_MARKERS,
  };
}

module.exports = { tumorMarkerInterpretation, screeningCancerMarkers, treatmentResponseMonitoring, surveillanceProtocol, falsePositiveSources, CITATIONS, ValidationError };