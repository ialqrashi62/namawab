/**
 * TIER3_RAD-304 Ultrasound Engine
 * FAST scan trauma + Obstetric ultrasound (EDD) + Echocardiography basic + Vascular Doppler + Abdominal ultrasound
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACR_US: 'ACR Ultrasound 2024', AIUM: 'AIUM Guidelines 2024' };

function fastScanTrauma(input) {
  const { free_fluid_morison_pouch, free_fluid_splenorenal, free_fluid_pelvis, free_fluid_pericardial, free_fluid_right_chest, free_fluid_left_chest, hemodynamically_unstable } = input;
  const positive_views = [free_fluid_morison_pouch, free_fluid_splenorenal, free_fluid_pelvis, free_fluid_pericardial, free_fluid_right_chest, free_fluid_left_chest].filter(v => v === 'yes').length;
  let interpretation = 'negative_FAST';
  if (positive_views >= 1) interpretation = 'positive_FAST_free_fluid_present';
  if (free_fluid_pericardial === 'yes') interpretation = 'positive_FAST_with_pericardial_effusion_possible_tamponade';
  return {
    interpretation, positive_views,
    management: interpretation === 'negative_FAST' ? (hemodynamically_unstable === 'yes' ? 'negative_FAST_but_unstable_consider_CT_or_DPL' : 'continue_observation') : 'positive_FAST_consult_trauma_surgery_immediate',
    next_step: (hemodynamically_unstable === 'yes' && positive_views >= 1) ? 'emergent_laparotomy' : (hemodynamically_unstable === 'no' && positive_views >= 1) ? 'CT_for_characterization' : 'continue_observation',
    citation: CITATIONS.ACR_US,
  };
}

function obstetricUltrasoundEdd(input) {
  const { lmp_date, ultrasound_crl_mm, ultrasound_bpd_mm, ultrasound_hc_mm, ultrasound_fl_mm, ultrasound_ga_weeks, first_trimester_crl_available } = input;
  let edd_method = 'lmp_based';
  let edd_date = null;
  if (first_trimester_crl_available === 'yes' && ultrasound_crl_mm) {
    edd_method = 'first_trimester_crl_preferred';
    const ga_days_from_crl = ultrasound_crl_mm * 1.08 + 42; // simplified Hadlock CRL formula
    const ga_weeks_from_crl = ga_days_from_crl / 7;
    edd_date = `calculated_from_crl_${ga_weeks_from_crl.toFixed(1)}_weeks_gestation`;
  }
  return {
    lmp_date, ultrasound_crl_mm, ultrasound_bpd_mm, ultrasound_hc_mm, ultrasound_fl_mm, ultrasound_ga_weeks,
    edd_method, edd_date,
    second_trimester_confirmation: ultrasound_bpd_mm && ultrasound_hc_mm && ultrasound_fl_mm ? 'use_combined_bpd_hc_fl_to_confirm_edd' : 'use_bpd_only_if_other_measurements_not_obtainable',
    citation: CITATIONS.AIUM,
  };
}

function basicEchocardiography(input) {
  const { lvef_pct, wall_motion_abnormality, valve_abnormality, pericardial_effusion, pulmonary_artery_pressure, aortic_root_diameter, lv_end_diastolic_dimension } = input;
  return {
    lvef_pct: lvef_pct || null, lvef_category: lvef_pct ? (lvef_pct >= 55 ? 'normal' : lvef_pct >= 40 ? 'mildly_reduced' : lvef_pct >= 30 ? 'moderately_reduced' : 'severely_reduced') : 'unknown',
    wall_motion_abnormality, valve_abnormality, pericardial_effusion,
    pulmonary_artery_pressure: pulmonary_artery_pressure || null, pulmonary_hypertension: pulmonary_artery_pressure && pulmonary_artery_pressure >= 35 ? 'yes' : 'no',
    aortic_root_diameter: aortic_root_diameter || null, aortic_dilation: aortic_root_diameter && aortic_root_diameter >= 45 ? 'yes' : 'no',
    recommendation: 'comprehensive_echo_by_cardiologist_if_any_abnormality_detected',
    citation: CITATIONS.ACR_US,
  };
}

function vascularDoppler(input) {
  const { vessel, ipsilateral_to_contralateral_ratio, peak_systolic_velocity_cm_s, waveform, plaque_present, stenosis_pct_estimate } = input;
  let stenosis_grade = 'none_minimal';
  if (peak_systolic_velocity_cm_s >= 400 && ipsilateral_to_contralateral_ratio >= 4) stenosis_grade = 'severe_70_to_99_percent';
  else if (peak_systolic_velocity_cm_s >= 270 && ipsilateral_to_contralateral_ratio >= 3.5) stenosis_grade = 'moderate_to_severe_50_to_69_percent';
  else if (peak_systolic_velocity_cm_s >= 200) stenosis_grade = 'mild_to_moderate_30_to_49_percent';
  return {
    vessel, ipsilateral_to_contralateral_ratio, peak_systolic_velocity_cm_s, waveform, plaque_present, stenosis_grade,
    next_step: stenosis_grade === 'severe_70_to_99_percent' ? 'CT_angiography_or_MRA_confirmatory_then_endovascular_or_surgical_consultation' : 'continue_medical_therapy_follow_up_duplex_Q6_to_12M',
    citation: CITATIONS.ACR_US,
  };
}

function abdominalUltrasound(input) {
  const { liver_findings, gallbladder_findings, bile_duct_diameter_mm, pancreas_visible, spleen_size_cm, kidneys_findings, ascites_present, free_fluid_amount } = input;
  let impression = 'normal_abdominal_us';
  if (liver_findings === 'focal_lesion') impression = 'focal_liver_lesion_needs_characterization_MRI_or_CT_with_contrast';
  else if (gallbladder_findings === 'gallstones_with_wall_thickening') impression = 'acute_cholecystitis_surgical_consultation';
  else if (bile_duct_diameter_mm && bile_duct_diameter_mm >= 10) impression = 'biliary_dilation_further_workup_ERCP_or_MRCP';
  else if (ascites_present === 'yes') impression = 'ascites_evaluate_cause_liver_function_diagnostic_paracentesis';
  return {
    impression, liver_findings, gallbladder_findings, bile_duct_diameter_mm, pancreas_visible, spleen_size_cm, kidneys_findings, ascites_present,
    next_step: impression !== 'normal_abdominal_us' ? 'correlate_clinically_and_obtain_additional_workup' : 'continue_routine_monitoring',
    citation: CITATIONS.AIUM,
  };
}

module.exports = { fastScanTrauma, obstetricUltrasoundEdd, basicEchocardiography, vascularDoppler, abdominalUltrasound, CITATIONS, ValidationError };