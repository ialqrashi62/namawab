/**
 * TIER3_REHAB-101 Physical Therapy Engine
 * Gait assessment + Strength training + Balance + Pain management + Functional mobility
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { APTA_GAIT: 'APTA Gait 2022', APTA_BALANCE: 'APTA Balance 2023' };

function gaitAssessmentAndTraining(input) {
  const { gait_speed_m_per_sec, six_minute_walk_distance_meters, observational_gait_analysis_deviations, assistive_device_current, falls_in_3m, weight_bearing_status, prior_pt_response } = input;
  let gait_speed_category = 'normal_above_1.0_m_per_sec';
  if (gait_speed_m_per_sec >= 0.8 && gait_speed_m_per_sec < 1.0) gait_speed_category = 'limited_community_less_than_1.0';
  else if (gait_speed_m_per_sec >= 0.4 && gait_speed_m_per_sec < 0.8) gait_speed_category = 'limited_household';
  else if (gait_speed_m_per_sec < 0.4) gait_speed_category = 'severe_impairment_non_ambulatory';
  let plan = 'task_specific_gait_training_2x_per_day_with_progressive_distance_and_speed';
  if (falls_in_3m >= 2 || observational_gait_analysis_deviations === 'significant') plan = 'balance_training_plus_gait_trainer_with_appropriate_assistive_device';
  return {
    gait_speed_category, plan,
    deviations_address: ['antalgic_gait_pain_management_first', 'step_length_asymmetry_task_specific_practice', 'knee_extensor_deficit_strengthening_quad_set_sit_to_stand', 'postural_instability_balance_challenges'],
    assistive_device: ['none_if_safe', 'single_point_cane_for_mild_instability', 'quad_cane_or_front_wheeled_walker_for_moderate', 'platform_walker_for_severe'],
    frequency: '3_to_5x_per_week_initial_then_2_to_3x_per_week_progress_to_home_program',
    citation: CITATIONS.APTA_GAIT,
  };
}

function strengthTrainingPrescription(input) {
  const { muscle_groups_affected, manual_muscle_test_grade, prior_training_response, comorbidities_cardiac_limit, age_above_75, deconditioning_present, target_goals_function } = input;
  let intensity_percent_1rm = 60;
  if (manual_muscle_test_grade <= 3) intensity_percent_1rm = 30;
  if (comorbidities_cardiac_limit === 'yes') intensity_percent_1rm = 40;
  let sets_reps = '3_sets_of_10_reps_per_session';
  if (deconditioning_present === 'yes') sets_reps = '2_sets_of_12_to_15_reps_progressive';
  let modality = 'progressive_resistance_with_resistance_bands_free_weights_or_weight_machines';
  return {
    intensity_percent_1rm, sets_reps, modality,
    progression: 'increase_load_5_to_10pct_when_2_sets_of_15_reps_comfortable_Q2_to_4_weeks',
    safety: ['stop_if_unusual_pain_dizziness_SOB', 'proper_breathing_no_Valsalva_during_lifting', 'posture_correction_with_each_repetition'],
    citation: CITATIONS.APTA_BALANCE,
  };
}

function balanceTrainingProgram(input) {
  const { berg_balance_score, timed_up_and_go_seconds, mini_best_test_score, fall_risk_category, vestibular_dysfunction_present, neuropathy_present, prior_balance_training_response } = input;
  let balance_category = 'low_risk';
  if (berg_balance_score < 45 || timed_up_and_go_seconds >= 12) balance_category = 'moderate_to_high_risk';
  if (timed_up_and_go_seconds >= 30) balance_category = 'very_high_fall_risk';
  let plan = 'static_balance_progressing_to_dynamic_with_dual_task_2x_per_day_Q_session';
  if (vestibular_dysfunction_present === 'yes') plan = 'vestibular_rehabilitation_with_habituation_gaze_stabilization_balance_exercises';
  if (neuropathy_present === 'yes') plan = 'somatosensory_training_with_textured_surfaces_balance_pad_proprioceptive_training';
  return {
    balance_category, plan,
    specific_exercises: ['tandem_stance_30_sec_progression', 'single_leg_stand_10_sec_progression', 'tai_chi_for_fall_reduction', 'dual_task_cognitive_during_walking_to_reduce_real_world_falls'],
    home_program: '30_min_per_day_5_days_per_week_supervised_then_independent',
    monitoring: 'BBS_Q4_weeks_TUG_Q4_weeks_mini_BEST_Q4_weeks_fall_log_Q_month',
    citation: CITATIONS.APTA_BALANCE,
  };
}

function chronicPainPhysicalTherapy(input) {
  const { pain_duration_months, oswestry_disability_index, central_sensitization_present, fear_avoidance_beliefs, opioid_use, prior_interventions, depression_present, imaging_finding_significance } = input;
  let plan = 'graded_exercise_with_pain_neuroscience_education_desensitization';
  if (central_sensitization_present === 'yes') plan = 'graded_motor_imagery_then_mirror_therapy_then_graded_exposure_to_feared_movement';
  if (fear_avoidance_beliefs === 'high') plan = 'cognitive_behavioral_therapy_PT_combined_with_gradual_activity_pacing';
  let modalities = ['TENS_transcutaneous_electrical_nerve_stimulation', 'manual_therapy_short_term_only', 'graded_exercise_aerobic_strengthen_flexibility', 'aquatic_therapy_for_low_impact_start'];
  return {
    plan, modalities,
    pacing_principles: 'time_contingent_not_pain_contingent_activity_increase_10pct_per_week',
    red_flags_screen: 'serious_pathology_screening_cancer_infection_fracture_cauda_equina_refer_immediately',
    avoid: 'prolonged_bed_rest_passive_modalities_only_or_unlimited_opioid_prescription',
    citation: CITATIONS.APTA_GAIT,
  };
}

function functionalMobilityTraining(input) {
  const { supine_to_sit, sit_to_stand, transfers_bed_to_chair, ambulation_community_distance, stairs_negotiation, goal_discharge_setting } = input;
  let level = 'modified_independent_with_assistive_device';
  if (supine_to_sit === 'max_assist' || sit_to_stand === 'max_assist') level = 'maximum_assistance_required_2_person';
  if (transfers_bed_to_chair === 'setup_only' && sit_to_stand === 'supervision') level = 'supervision_or_minimal_assistance';
  let plan = 'task_specific_training_supine_to_sit_then_sit_to_stand_then_transfer_then_ambulation_then_stairs';
  if (goal_discharge_setting === 'home') plan = 'home_simulation_practice_with_home_assessment_pre_discharge';
  if (goal_discharge_setting === 'community') plan = 'community_mobility_training_curb_cuts_terrain_uneven_surfaces_transportation_practice';
  return {
    level, plan,
    progression: ['supine_to_sit_then_sit_lying_tolerance_30_min', 'sit_to_stand_5_reps_with_progressive_decrease_in_assist', 'transfer_bed_to_chair_unilateral_then_bilateral', 'ambulation_50ft_then_150ft_then_community_distance_300ft_plus', 'stairs_negotiation_4_steps_then_12_steps_then_community_stairs'],
    discharge_criteria: ['safe_independent_transfers', 'safe_ambulation_on_level_surface_community_distance', 'stairs_negotiation_or_safe_house_plan', 'caregiver_training_completed_for_ongoing_assist'],
    citation: CITATIONS.APTA_GAIT,
  };
}

module.exports = { gaitAssessmentAndTraining, strengthTrainingPrescription, balanceTrainingProgram, chronicPainPhysicalTherapy, functionalMobilityTraining, CITATIONS, ValidationError };