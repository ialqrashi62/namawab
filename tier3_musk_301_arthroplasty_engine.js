/**
 * TIER3_MUSK-301 Arthroplasty Engine
 * THA/TKA candidacy + PROMS (HOOS/KOOS) + pre-op optimization + implant selection + DVT prophylaxis + LOS pathways
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAOS_TKA: 'AAOS TKA 2024', AAOS_THA: 'AAOS THA 2024', ERAS: 'ERAS Society 2023' };

function thaIndications(input) {
  const { age, hoos_score, function_limitations, imaging_oa_severity, failed_conservative_treatment } = input;
  return {
    indicated: hoos_score <= 70 && function_limitations && imaging_oa_severity === 'severe' && failed_conservative_treatment,
    approach_options: ['direct_anterior', 'anterolateral', 'posterolateral'],
    implant_options: ['cementless', 'highly_crosslinked_polyethylene', 'ceramic_on_ceramic_for_young_active', 'dual_mobility_for_dislocation_risk'],
    citations: CITATIONS.AAOS_THA,
  };
}

function tkaIndications(input) {
  const { age, koos_score, malalignment_degree, bmi, instability, stiffness, failed_conservative } = input;
  return {
    indicated: koos_score <= 70 && (malalignment_degree >= 5 || instability || stiffness) && failed_conservative,
    robotic_indicated: malalignment_degree >= 10 || previous_trauma_with_deformity ? 'MAKO_robot_assisted' : 'standard_instrumentation',
    implant_options: ['CR_retained', 'PS_stabilized', 'medial_pivot', 'CCK_constrained_for_severe_instability'],
    bmi_target_pre_op: bmi < 35 ? 'eligible_now' : 'recommend_weight_loss_then_reconsider',
    citation: CITATIONS.AAOS_TKA,
  };
}

function hoosKoosScore(input) {
  const { hoos_symptoms, hoos_pain, hoos_adl, hoos_sport, hoos_qol } = input;
  const total = (hoos_symptoms + hoos_pain + hoos_adl + (hoos_sport || 0) + (hoos_qol || 0)) / 5;
  return {
    total_score: Math.round(total),
    interpretation: total >= 80 ? 'minimal_or_no_problems' : total >= 60 ? 'mild_to_moderate' : total >= 40 ? 'moderate_to_severe' : 'severe_disability',
    surgical_threshold: total <= 70,
  };
}

function preOpOptimization(input) {
  const { hba1c, anemia, smoking_status, bmi, dm_control } = input;
  return {
    glycemic_control: hba1c > 8 ? 'delay_elective_arthroplasty_until_hba1c_below_8' : 'acceptable',
    anemia_optimization: anemia ? 'workup_preop_then_TREAT_or_perioperative_iron' : 'no_workup_needed',
    smoking_cessation: smoking_status === 'current' ? 'quit_4_weeks_preop_then_8_weeks_postop' : 'continue_non_smoker',
    bmi_optimization: bmi > 40 ? 'strongly_recommend_medical_or_surgical_weight_management' : 'acceptable',
    citation: CITATIONS.ERAS,
  };
}

function dvtProphylaxis(input) {
  const { surgery_type, vte_history, age, mobility, thrombophilia, anticoag_current } = input;
  let regimen = 'aspirin_81mg_PO_BID_x_28_days';
  if (surgery_type === 'TKA') regimen = 'rivaroxaban_10mg_PO_daily_x_14_days_OR_apixaban_2.5mg_PO_BID_x_14_days';
  if (surgery_type === 'THA' && vte_history) regimen = 'extended_anticoagulation_x_35_days_rivaroxaban_10mg';
  if (thrombophilia) regimen = 'extended_duration_x_35_to_42_days';
  return {
    regimen, duration_days: 35,
    mechanical: ['sequential_compression_devices_during_hospital_stay', 'early_mobilization_within_4h_postop'],
    lab_monitoring: 'Q3M_CBC_and_renal_while_on_DOAC_for_first_month',
    citation: CITATIONS.AAOS_THA,
  };
}

function lengthOfStayPathway(input) {
  const { surgery_type, age, comorbidity, social_support, preop_education_completed } = input;
  return {
    predicted_los: surgery_type === 'TKA' && age < 65 && comorbidity === 'none' && preop_education_completed ? 'outpatient_or_23h_observation' : 'standard_1_to_3_days',
    enhanced_recovery_components: ['preop_multimodal_analgesia', 'intraop_local_infiltration', 'postop_early_mobilization', 'opioid_sparing_protocol', 'preop_chlorhexidine', 'perioperative_vte_prophylaxis'],
    discharge_criteria: ['pain_controlled_with_oral_meds', 'independent_PT_mobility', 'wound_intact_no_drain', 'afebrile', 'tolerating_diet', 'urine_voiding', 'social_disposition'],
  };
}

module.exports = { thaIndications, tkaIndications, hoosKoosScore, preOpOptimization, dvtProphylaxis, lengthOfStayPathway, CITATIONS, ValidationError };