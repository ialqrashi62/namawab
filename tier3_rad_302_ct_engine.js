/**
 * TIER3_RAD-302 CT (Computed Tomography) Engine
 * CT dose calculation + Contrast nephropathy screening + CT stroke protocol + Trauma CT triage + Pulmonary embolism CT
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACR_RAD: 'ACR Appropriateness Criteria 2024', RSNA: 'RSNA Safety 2024' };

function ctDoseCalculation(input) {
  const { scan_type, kvp, ma, pitch_factor, scan_length_cm, body_habitus, multiple_phases } = input;
  let dlp_per_phase = 0;
  if (scan_type === 'head_routine') dlp_per_phase = 850;
  else if (scan_type === 'chest_routine') dlp_per_phase = 350;
  else if (scan_type === 'abdomen_pelvis_routine') dlp_per_phase = 600;
  else if (scan_type === 'cta_chest') dlp_per_phase = 450;
  else if (scan_type === 'cta_head') dlp_per_phase = 1000;
  else if (scan_type === 'coronary_cta') dlp_per_phase = 700;
  const phases = multiple_phases === 'yes' ? 3 : 1;
  const total_dlp = dlp_per_phase * phases;
  const effective_dose_msv = total_dlp * 0.014;
  return {
    scan_type, total_dlp_mgy_cm: total_dlp, effective_dose_msv: effective_dose_msv.toFixed(2),
    comparison_to_chest_xray: (effective_dose_msv / 0.1).toFixed(1) + 'x_chest_xray',
    dose_optimization: ['use_appropriate_kVp_low_dose_protocols_when_possible', 'avoid_unnecessary_multiphase_studies', 'use_iterative_reconstruction', 'limit_scan_length_to_area_of_interest'],
    citation: CITATIONS.ACR_RAD,
  };
}

function contrastNephropathyScreening(input) {
  const { age_years, baseline_creatinine_mg_dl, egfr_ml_min_1_73m2, diabetes_mellitus, dehydration, nsaids_use, metformin_use, heart_failure } = input;
  const risk_factors = [];
  if (egfr_ml_min_1_73m2 && egfr_ml_min_1_73m2 < 60) risk_factors.push('reduced_eGFR');
  if (egfr_ml_min_1_73m2 && egfr_ml_min_1_73m2 < 30) risk_factors.push('severe_renal_impairment');
  if (diabetes_mellitus === 'yes') risk_factors.push('diabetes_mellitus');
  if (age_years >= 75) risk_factors.push('age_75_or_above');
  if (heart_failure === 'yes') risk_factors.push('heart_failure');
  if (dehydration === 'yes') risk_factors.push('dehydration');
  if (nsaids_use === 'yes') risk_factors.push('NSAIDs_use');
  const total_risk_factors = risk_factors.length;
  return {
    total_risk_factors, risk_factors,
    high_risk: total_risk_factors >= 3 ? 'yes' : 'no',
    metformin_caution: metformin_use === 'yes' && egfr_ml_min_1_73m2 < 30 ? 'discontinue_metformin_48h_before_and_after_contrast' : 'continue_metformin_monitor',
    pre_hydration: egfr_ml_min_1_73m2 < 30 || egfr_ml_min_1_73m2 < 45 ? 'IV_normal_saline_1mL_per_kg_per_h_12h_before_and_after' : 'oral_hydration',
    alternative: total_risk_factors >= 4 ? 'consider_non_contrast_study_or_alternative_imaging' : 'contrast_acceptable_with_precautions',
    citation: CITATIONS.RSNA,
  };
}

function acuteStrokeCt(input) {
  const { time_from_onset_hours, suspected_large_vessel_occlusion, nihss_score, ct_findings, hemorrhage_present } = input;
  if (hemorrhage_present === 'yes') return { stroke_type: 'hemorrhagic', treatment: 'reverse_anticoagulation_blood_pressure_control_neurosurgery_consultation' };
  let management = 'iv_thrombolysis_alteplase_or_tenecteplase';
  if (time_from_onset_hours <= 4.5 && suspected_large_vessel_occlusion === 'yes') management = 'iv_thrombolysis_plus_mechanical_thrombectomy';
  else if (time_from_onset_hours > 4.5 && time_from_onset_hours <= 24 && suspected_large_vessel_occlusion === 'yes') management = 'mechanical_thrombectomy_alone';
  else if (time_from_onset_hours > 4.5 && time_from_onset_hours <= 9 && nihss_score >= 6) management = 'consider_extended_window_thrombolysis_per_imaging_selection';
  else management = 'supportive_care_secondary_prevention';
  return {
    stroke_type: 'ischemic',
    time_from_onset_hours, suspected_lvo: suspected_large_vessel_occlusion === 'yes', nihss_score, ct_findings,
    management, additional_imaging: 'CTA_head_and_neck_for_LVO_evaluation_CTP_or_MRI_for_unknown_onset',
    citation: CITATIONS.ACR_RAD,
  };
}

function traumaCt(input) {
  const { mechanism, gcs_score, hemodynamically_unstable, suspected_injuries } = input;
  let ct_protocol = 'selective_imaging_based_on_findings';
  if (mechanism === 'high_energy_MVC_or_fall' || gcs_score < 13) ct_protocol = 'pan_scan_head_neck_chest_abdomen_pelvis_with_iv_contrast';
  if (hemodynamically_unstable === 'yes') ct_protocol = 'focused_assessment_with_sonography_for_trauma_FAST_then_OT_or_CT_if_stable';
  return {
    mechanism, gcs_score, hemodynamically_unstable, suspected_injuries,
    ct_protocol,
    c_spine_imaging: gcs_score < 13 || mechanism === 'high_energy' ? 'CT_cspine' : 'NEXUS_or_CCR_criteria_to_clear_clinically',
    additional: 'consider_CTA_for_active_extravasation_or_vascular_injury',
    citation: CITATIONS.RSNA,
  };
}

function ctPulmonaryEmbolism(input) {
  const { wells_score, d_dimer_ng_ml, pre_test_clinical_probability, ctpa_findings, right_ventricle_dilation, rv_lv_ratio } = input;
  let interpretation = 'low_probability_no_PE';
  if (ctpa_findings === 'filling_defect_in_pulmonary_artery') interpretation = 'PE_confirmed';
  if (pre_test_clinical_probability === 'high' && ctpa_findings === 'no_filling_defect') interpretation = 'consider_additional_imaging_V_Q_scan_or_repeat_CTPA';
  return {
    interpretation, wells_score, d_dimer_ng_ml,
    rv_lv_ratio: rv_lv_ratio || null,
    intermediate_high_risk_pe: right_ventricle_dilation === 'yes' || (rv_lv_ratio && rv_lv_ratio >= 0.9),
    treatment_indication: interpretation === 'PE_confirmed' ? 'anticoagulation_immediate' : 'no_PE_no_anticoagulation',
    citation: CITATIONS.ACR_RAD,
  };
}

module.exports = { ctDoseCalculation, contrastNephropathyScreening, acuteStrokeCt, traumaCt, ctPulmonaryEmbolism, CITATIONS, ValidationError };