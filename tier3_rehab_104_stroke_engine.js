/**
 * TIER3_REHAB-104 Stroke Rehabilitation Engine
 * Stroke recovery stages + Spasticity management + Aphasia therapy + Dysphagia + Return to community
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHA_STROKE_REHAB: 'AHA/ASA Stroke Rehab 2016', VA_STROKE_REHAB: 'VA/DoD Stroke Rehab 2024' };

function strokeRecoveryStages(input) {
  const { nihss_score, days_post_stroke, functional_independence_measure_score, sitting_balance, standing_balance, comorbidities_limit, prior_mobility_status } = input;
  let stage = 'acute_phase_inpatient_0_to_7_days';
  if (days_post_stroke >= 7 && days_post_stroke <= 30) stage = 'early_subacute_inpatient_rehab_7_to_30_days';
  else if (days_post_stroke > 30 && days_post_stroke <= 180) stage = 'late_subacute_outpatient_or_home_health_30_to_180_days';
  else if (days_post_stroke > 180) stage = 'chronic_phase_community_reintegration_above_180_days';
  let therapy_intensity = 'early_mobilization_within_24_to_48h_with_intensity_2h_per_day_task_specific';
  if (stage === 'early_subacute_inpatient_rehab_7_to_30_days') therapy_intensity = 'intensive_3h_per_day_5_days_per_week_combined_OT_PT_SLP';
  if (stage === 'chronic_phase_community_reintegration_above_180_days') therapy_intensity = 'community_based_group_exercise_psychosocial_support_prevent_secondary_stroke';
  return {
    stage, therapy_intensity,
    goals: ['restore_function_through_task_specific_training', 'prevent_secondary_complications_DVT_falls_contractures', 'address_psychosocial_depression_anxiety', 'discharge_planning_with_caregiver_training'],
    monitoring: 'FIM_score_Q1_to_2_weeks_2_minute_walk_test_Q4_weeks_Barthel_Index_Q4_weeks',
    citation: CITATIONS.AHA_STROKE_REHAB,
  };
}

function spasticityManagement(input) {
  const { modified_ashworth_scale, affected_joint, pain_due_to_spasticity, hygiene_compromised, function_limitation, prior_oral_agents_trial, focal_vs_generalized, botulinum_toxin_candidate, intrathecal_baclofen_considered } = input;
  let first_line = 'stretching_exercise_program_and_oral_baclofen_or_tizanidine_if_generalized';
  if (focal_vs_generalized === 'focal' && botulinum_toxin_candidate === 'yes') first_line = 'botulinum_toxin_type_A_injection_to_affected_muscles_Q3_months_with_targeted_stretching';
  if (modified_ashworth_scale >= 3 && intrathecal_baclofen_considered === 'yes') first_line = 'refer_to_intrathecal_baclofen_pump_evaluation_after_conservative_failure';
  return {
    first_line,
    oral_options: ['baclofen_5_to_10mg_TID_titrate_max_80mg_per_day', 'tizanidine_2_to_4mg_TID_max_36mg_per_day', 'dantrolene_25_to_100mg_TID', 'benzodiazepines_short_term'],
    non_pharmacologic: ['stretching_30_min_per_day_serial_casting', 'splinting_orthotics', 'tENS_for_pain_relief', 'weight_bearing_for_affected_limb'],
    procedural: ['botulinum_toxin_focal_spasticity', 'phenol_neurolysis_motor_points', 'intrathecal_baclofen_pump_for_severe_spasticity', 'selective_dorsal_rhizotomy_for_very_young'],
    monitoring: 'modified_ashworth_scale_Q4_weeks_GAS_goals_Q4_weeks',
    citation: CITATIONS.VA_STROKE_REHAB,
  };
}

function aphasiaTherapy(input) {
  const { aphasia_type, severity_grade, comprehension_function_words_pct, expression_words_per_minute, prior_SLP_response, depression_present, caregiver_support } = input;
  let therapy_plan = 'constraint_induced_language_therapy_for_chronic_aphasia_or_melodic_intonation_therapy_for_non_fluent';
  if (severity_grade === 'severe_global') therapy_plan = 'AAC_alternative_augmentative_communication_with_picture_boards_or_speech_generating_devices_partner_training';
  if (severity_grade === 'mild_to_moderate') therapy_plan = 'semantic_feature_analysis_verb_network_treatment_pronominal_resolution_high_intensity_3_to_5h_per_week';
  let prognosis = caregiver_support === 'strong' ? 'favorable_with_intensive_therapy_home_practice' : 'limited_recovery_intensive_clinical_therapy_only';
  return {
    therapy_plan, prognosis,
    intensity: 'intensive_therapy_2h_per_day_5_days_for_2_to_4_weeks_for_optimal_recovery',
    target_outcomes: ['improved_WAB_AQ_score_by_10_to_20_points_in_3_months', 'return_to_conversational_speech', 'use_AAC_when_needed'],
    psychosocial: 'screen_for_depression_with_AHQ_aphasia_depression_questionnaire_and_treat_as_applicable',
    citation: CITATIONS.AHA_STROKE_REHAB,
  };
}

function postStrokeDysphagia(input) {
  const { gugging_swallowing_screen_pass, fiberoptic_endoscopic_swallow_study_done, aspiration_severity_scale, diet_texture_level, thickened_liquids_required, weight_loss_kg_3m, peg_tube_considered, recovery_potential } = input;
  let plan = 'texture_modified_diet_with_thickened_liquids_per_FEES_compensatory_strategies';
  if (aspiration_severity_scale >= 6 || weight_loss_kg_3m >= 5) plan = 'consider_alternative_feeding_NPO_then_reassess_or_PEG_tube_if_no_recovery_in_4_weeks';
  if (recovery_potential === 'good' && aspiration_severity_scale <= 4) plan = 'continue_intensive_swallow_therapy_NMES_or_sEMG_biofeedback';
  return {
    plan,
    swallow_safety_compensatory: ['chin_tuck_during_swallow', 'head_turn_to_affected_side', 'double_or_effortful_swallow', 'small_bite_size_thickened_liquids_per_FEES'],
    monitoring: 'weekly_weight_Q2_to_4_weeks_FEES_Q4_to_8_weeks_swallow_Penetration_Aspiration_Scale',
    peg_decision: 'PEG_or_NGT_after_2_to_4_weeks_of_NPO_with_continued_therapy_assessment_no_recovery',
    citation: CITATIONS.AHA_STROKE_REHAB,
  };
}

function returnToCommunity(input) {
  const { discharge_disposition, caregiver_available, home_modifications_done, assistive_devices_prescribed, transportation_access, vocational_rehab_needed, social_isolation_risk, depression_screen } = input;
  let plan = 'multidisciplinary_discharge_planning_with_home_assessment_and_caregiver_training';
  if (social_isolation_risk === 'high') plan = 'refer_to_community_stroke_support_groups_outpatient_day_program_or_telehealth_follow_up';
  if (vocational_rehab_needed === 'yes' && prior_mobility_status === 'community_ambulator') plan = 'vocational_rehabilitation_for_return_to_work_with_workplace_accommodations';
  return {
    plan,
    safety_assessment: ['home_safety_evaluation_pre_discharge', 'fall_prevention_education', 'medication_reconciliation_with_polypharmacy_review', 'stroke_risk_factor_optimization_BP_AF_glucose_cholesterol'],
    follow_up: 'stroke_clinic_Q3_months_then_Q6_months_then_Q1_year_with_Q3_months_home_health_PT_OT_SLP',
    community_resources: ['local_stroke_association', 'aphasia_friendly_social_groups', 'transportation_services_for_disabled', 'online_tele_rehab_programs'],
    citation: CITATIONS.VA_STROKE_REHAB,
  };
}

module.exports = { strokeRecoveryStages, spasticityManagement, aphasiaTherapy, postStrokeDysphagia, returnToCommunity, CITATIONS, ValidationError };