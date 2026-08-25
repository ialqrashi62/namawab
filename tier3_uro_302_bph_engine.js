/**
 * TIER3_URO-302 Prostate / BPH Engine
 * BPH/LUTS assessment (IPSS) + PSA interpretation + Prostate biopsy decision + BPH medical therapy + TURP vs laser
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AUA_BPH: 'AUA BPH Guideline 2021', NCCN_PROS: 'NCCN Prostate Cancer 2024' };

function bphLutsIpssAssessment(input) {
  const { incomplete_emptying, frequency, intermittency, urgency, weak_stream, straining, nocturia_count, quality_of_life_score } = input;
  const total_score = (incomplete_emptying || 0) + (frequency || 0) + (intermittency || 0) + (urgency || 0) + (weak_stream || 0) + (straining || 0) + nocturia_count;
  let severity = 'mild_luts';
  if (total_score >= 20) severity = 'severe_luts';
  else if (total_score >= 8) severity = 'moderate_luts';
  return {
    ipss_total: total_score, severity, quality_of_life_score,
    treatment: severity === 'severe_luts' ? 'combination_medical_therapy_5_alph_r + blocker_or_minimally_invasive_procedure' : severity === 'moderate_luts' ? 'alpha_blocker_first_line_consider_5_alph_r_if_prostate_gt_40g' : 'watchful_waiting_lifestyle_modifications',
    differential: ['BPH', 'prostate_cancer', 'urethral_stricture', 'bladder_neck_dysfunction', 'bladder_cancer', 'UTI_prostatitis', 'overactive_bladder', 'neurogenic_bladder'],
    citation: CITATIONS.AUA_BPH,
  };
}

function psaInterpretation(input) {
  const { psa_value_ng_ml, age_years, prior_psa_values, prostate_volume_g, family_history_prostate_cancer, race, finasteride_use } = input;
  let interpretation = 'within_age_reference_range';
  let psa_density = psa_value_ng_ml / (prostate_volume_g || 1);
  if (age_years < 60 && psa_value_ng_ml >= 2.5) interpretation = 'elevated_for_age';
  else if (age_years >= 60 && age_years < 70 && psa_value_ng_ml >= 4) interpretation = 'elevated_for_age';
  else if (age_years >= 70 && psa_value_ng_ml >= 6.5) interpretation = 'elevated_for_age';
  if (finasteride_use === 'yes') interpretation += '_adjust_for_5_alph_r_use_multiply_by_2';
  let velocity_suspicious = false;
  if (prior_psa_values === 'yes_rising' && psa_value_ng_ml >= 0.4) velocity_suspicious = true;
  return {
    psa_value_ng_ml, psa_density: psa_density.toFixed(2), interpretation, velocity_suspicious,
    biopsy_consideration: 'shared_decision_making_with_patient_consider_MRI_first_then_targeted_biopsy',
    next_step: interpretation.includes('elevated') || velocity_suspicious ? 'refer_to_urology_for_further_workup' : 'continue_annual_psa_monitoring',
    citation: CITATIONS.NCCN_PROS,
  };
}

function prostateBiopsyDecision(input) {
  const { psa_value_ng_ml, psa_density, mri_pi_rads_score, prior_biopsy_result, family_history_prostate_cancer, race_african_american } = input;
  let biopsy_indicated = false;
  if (psa_value_ng_ml >= 4 || psa_density >= 0.15 || mri_pi_rads_score >= 3 || prior_biopsy_result === 'atypical_or_high_grade_pIN') biopsy_indicated = true;
  return {
    biopsy_indicated, psa_value_ng_ml, mri_pi_rads_score,
    biopsy_approach: 'MRI_ultrasound_fusion_biopsy_with_systematic_cores_if_MRI_lesion_targeted',
    prophylactic_abx: 'ciprofloxacin_or_targeted_antibiotic_based_on_rectal_culture',
    complications: ['bleeding_with_hematospermia_or_hematuria_30pct', 'infection_sepsis_1pct', 'urinary_retention_1_to_2pct'],
    follow_up: 'continue_antibiotics_24_to_48h_post_procedure_avoid_heavy_lifting_48h',
    citation: CITATIONS.NCCN_PROS,
  };
}

function bphMedicalTherapy(input) {
  const { prostate_volume_g, luts_severity, sexual_activity_priority, blood_pressure_history, cataract_surgery_planned } = input;
  let first_line = 'alpha_blocker_tamsulosin_or_silodosin_for_relief_of_luts';
  if (prostate_volume_g >= 40) first_line += '_consider_5_alph_r_inhibitor_finasteride_or_dutasteride_for_volume_reduction';
  if (sexual_activity_priority === 'high') first_line = 'PDE5_inhibitor_tadalafil_5mg_daily_if_no_nitrate_use';
  if (cataract_surgery_planned === 'yes') first_line += '_avoid_tamsulosin_due_to_IFIS_risk';
  return {
    first_line, luts_severity, prostate_volume_g,
    combination_indication: prostate_volume_g >= 40 && luts_severity === 'severe' ? 'yes_combo_alpha_blocker_plus_5_alph_r_for_3_to_6_months_then_continue_5_alph_r_only' : 'no_continue_single_therapy',
    tadalafil_considerations: 'PDE5_inhibitor_reduces_luts_in_BPH_with_or_without_erectile_dysfunction',
    monitoring: 'IPSS_Q3M_during_initiation_then_Q6_to_12_months_PRU_Q1_year_on_5_alph_r',
    citation: CITATIONS.AUA_BPH,
  };
}

function turpVsLaser(input) {
  const { prostate_volume_g, anticoagulation_status, comorbidities, sexual_function_priority, surgical_history } = input;
  let recommendation = 'TURP_bipolar_preferred_for_prostate_lt_80g';
  if (prostate_volume_g >= 80) recommendation = 'HoLEP_or_ThuLEP_for_large_prostate';
  if (anticoagulation_status === 'on_anticoag') recommendation = 'laser_holmium_or_thulium_preferred_over_TURP_to_minimize_bleeding';
  if (sexual_function_priority === 'preservation_critical') recommendation = 'prostatic_urethral_lift_UroLift_or_rezum_water_vapor_for_sexual_function_preservation';
  return {
    recommendation, prostate_volume_g, anticoagulation_status,
    alternatives: ['TURP_bipolar_or_monopolar', 'laser_holmium_HoLEP_thulium_ThuLEP_greenlight', 'minimally_invasive_UroLift_rezum_iTIND'],
    complications: ['bleeding_2pct', 'retrograde_ejaculation_50_to_75pct_TURP', 'incontinence_1_to_3pct', 'bladder_neck_contracture_5pct', 'erectile_dysfunction_5_to_10pct'],
    follow_up: 'Q3_months_for_first_year_then_Q6_to_12_months_with_IPSS_QOL_PVR',
    citation: CITATIONS.AUA_BPH,
  };
}

module.exports = { bphLutsIpssAssessment, psaInterpretation, prostateBiopsyDecision, bphMedicalTherapy, turpVsLaser, CITATIONS, ValidationError };