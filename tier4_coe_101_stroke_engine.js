/**
 * TIER4_COE-101 Comprehensive Stroke Center Engine
 * Stroke Center certification + Hyperacute stroke + Telestroke + Endovascular + Stroke outcomes
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHA_STROKE_COE: 'AHA Comprehensive Stroke Center 2024', ESO_STROKE: 'ESO Stroke Guidelines 2023' };

function strokeCenterCertification(input) {
  const { certification_level, tpa_capability, thrombectomy_capability, neurosurgery_coverage, neuro_icu_present, door_to_provider_min, door_to_needle_min, door_to_puncture_min, stroke_unit_present, neurology_coverage_24_7, mri_24_7, mri_perfusion_capability, telemedicine_stroke_backup } = input;
  let certification_level_actual = 'primary_stroke_center_PSC';
  if (thrombectomy_capability === 'yes' && neuro_icu_present === 'yes' && neurosurgery_coverage === '24_7' && neurology_coverage_24_7 === 'yes') certification_level_actual = 'comprehensive_stroke_center_CSC';
  else if (tpa_capability === 'yes' && neurology_coverage_24_7 === 'telemedicine') certification_level_actual = 'acute_stroke_ready_ASRH';
  let gaps = [];
  if (door_to_provider_min > 15) gaps.push('door_to_provider_target_below_15_min_for_CSC');
  if (door_to_needle_min > 60) gaps.push('door_to_needle_target_below_60_min_for_tPA_eligible');
  if (door_to_puncture_min > 90) gaps.push('door_to_puncture_target_below_90_min_for_thrombectomy_eligible');
  if (stroke_unit_present !== 'yes') gaps.push('stroke_unit_dedicated_beds_for_admission_standard_of_care');
  return {
    certification_level_actual, gaps,
    certification_requirements: ['TJC_or_DNV_comprehensive_stroke_center_certification_with_Q_year_renewal', 'stroke_program_medical_director_typically_neurologist_with_stroke_fellowship', 'stroke_program_nurse_practitioner_or_coordinator', 'Q_month_multidisciplinary_stroke_committee', 'stroke_registry_participation_Get_With_The_Stroke_Guidelines_or_Diamond_plus_registries', 'Q_quarter_outcomes_review_with_quality_improvement_action_plan'],
    citation: CITATIONS.AHA_STROKE_COE,
  };
}

function hyperacuteStrokeManagement(input) {
  const { onset_time_known, nihss_score, ct_perfusion_done, ct_angiography_done, mri_done, large_vessel_occlusion, last_known_well_hours, iv_tpa_eligible, thrombectomy_eligible, blood_pressure_at_admission, glucose_at_admission, anticoagulant_use } = input;
  let plan = 'tPA_0.9mg_per_kg_IV_with_10pct_bolus_then_90pct_over_60_min_within_4.5h_of_onset';
  if (large_vessel_occlusion === 'yes' && onset_time_known === 'within_24h_and_lkw_with_perfusion_mismatch') plan = plan + '_with_mechanical_thrombectomy_within_24h_with_stroke_interventionalist';
  if (nihss_score >= 6) plan = plan + '_high_nihss_score_suggests_large_vessel_occlusion_with_thrombectomy_consideration';
  if (blood_pressure_at_admission >= 185) plan = plan + '_lower_BP_to_below_185_systolic_with_labetalol_or_nicardipine_before_tPA';
  if (glucose_at_admission >= 50 && glucose_at_admission < 400) plan = plan + '_glucose_in_range_no_treatment_needed_for_tPA';
  if (glucose_at_admission < 50) plan = plan + '_correct_hypoglycemia_then_reassess_stroke_symptoms_before_tPA';
  return {
    plan,
    workflow: 'door_to_provider_less_than_15min_door_to_CT_initiated_less_than_25min_door_to_CT_interpreted_less_than_45min_door_to_needle_less_than_60min_door_to_puncture_less_than_90min_for_thrombectomy',
    monitoring: 'Q15min_BP_Q1h_glucose_Q4h_neuro_checks_ICU_or_stroke_unit_with_tPA_protocol',
    antiplatelet: 'aspirin_24h_after_tPA_or_immediately_for_non_tPA_patients_then_dapt_for_minor_stroke_or_TIA_per_CHANCE_or_POINT',
    citation: CITATIONS.ESO_STROKE,
  };
}

function telestrokeActivation(input) {
  const { telestroke_available, cart_functional, neurologist_on_call, cart_position_ED_or_unit, image_quality_diagnostic, nihss_certified_neurologist, time_to_connect_with_neurologist_min, decision_time_after_consult_min } = input;
  let plan = 'telestroke_consult_with_neurologist_via_secure_video_and_image_share_for_evaluation_and_tPA_decision_when_in_house_neurologist_not_available';
  let quality = 'telestroke_consultation_documented_with_timing_decision_clinical_evaluation_with_NIHSS_video_recording_per_quality';
  let workflow = ['patient_arrival_in_ED_with_stroke_symptoms', 'ED_provider_activates_telestroke_cart', 'cart_rolled_to_patient_bedside', 'neurologist_on_call_responds_within_5_min_for_emergent_consult', 'video_two_way_evaluation_with_NIHSS_and_imaging_review', 'tPA_decision_with_documented_consent_and_dose', 'transfer_decision_for_thrombectomy_eligible_to_CSC'];
  return {
    plan, quality, workflow,
    metrics: 'door_to_needle_for_telestroke_should_match_in_person_target_below_60min_with_audit_Q_quarter',
    backup: 'if_telestroke_fails_transfer_to_nearest_CSC_via_EMS_or_helicopter_per_protocol',
    citation: CITATIONS.AHA_STROKE_COE,
  };
}

function thrombectomyEligibility(input) {
  const { onset_to_door_hours, nihss_score, large_vessel_occlusion_confirmed, perfusion_mismatch, prior_mRS_functional_status, age_years, comorbid_burden, antithrombotic_use_prior, time_to_puncture_estimate_h } = input;
  let eligible = false;
  if (onset_to_door_hours <= 6 && large_vessel_occlusion_confirmed === 'yes' && nihss_score >= 6) eligible = true;
  if (onset_to_door_hours > 6 && onset_to_door_hours <= 24 && perfusion_mismatch === 'yes' && prior_mRS_functional_status <= 1) eligible = true;
  let plan = 'mechanical_thrombectomy_with_stent_retriever_within_90_min_door_to_puncture_target';
  if (age_years >= 80 && prior_mRS_functional_status >= 1) plan = plan + '_with_cautious_eligibility_consideration_perfusion_imaging_essential';
  if (comorbid_burden === 'severe') plan = plan + '_multidisciplinary_review_with_neurointerventionalist_neurology_neurosurgery_family_for_shared_decision';
  return {
    eligible, plan,
    devices: ['stent_retriever_Solitaire_Trevo', 'aspiration_catheter_ADAPT_technique', 'balloon_guide_catheter_for_flow_arrest', 'intracranial_stenting_for_residual_stenosis'],
    post_op: 'angiographic_TICI_2b_to_3_target_reperfusion_Q1h_neuro_check_Q4h_CT_24h_or_with_change_to_rule_out_bleeding',
    citation: CITATIONS.ESO_STROKE,
  };
}

function strokeCenterQualityOutcomes(input) {
  const { dtg_door_to_needle_min, dtp_door_to_puncture_min, mortality_in_hospital_pct, mRS_90d_score_0_to_2_pct, tpa_complication_ich_pct, dysPhagia_screen_passed, af_detected_pct, recurrent_stroke_30d_pct } = input;
  let performance = {
    median_door_to_needle_min: dtg_door_to_needle_min,
    median_door_to_puncture_min: dtp_door_to_puncture_min,
    in_hospital_mortality_pct: mortality_in_hospital_pct,
    mRS_0_to_2_at_90d_pct: mRS_90d_score_0_to_2_pct,
    tpa_ich_rate_pct: tpa_complication_ich_pct,
    dysphagia_screen_compliance_pct: dysPhagia_screen_passed,
    af_detected_pct: af_detected_pct,
    recurrent_stroke_30d_pct: recurrent_stroke_30d_pct
  };
  let targets_met = {
    dtg_below_60: dtg_door_to_needle_min < 60,
    dtp_below_90: dtp_door_to_puncture_min < 90,
    ich_rate_below_6: tpa_complication_ich_pct < 6,
    dysphagia_screen_above_85: dysPhagia_screen_passed >= 85,
    mRS_0_2_above_40: mRS_90d_score_0_to_2_pct >= 40
  };
  return {
    performance, targets_met,
    benchmarking: 'compare_to_AHA_Get_With_The_Stroke_Guidelines_top_decile_with_Q_quarter_audit',
    improvement: 'Q_quarter_performance_review_with_action_plan_for_below_target_metrics_with_stroke_committee_oversight',
    citation: CITATIONS.AHA_STROKE_COE,
  };
}

module.exports = { strokeCenterCertification, hyperacuteStrokeManagement, telestrokeActivation, thrombectomyEligibility, strokeCenterQualityOutcomes, CITATIONS, ValidationError };