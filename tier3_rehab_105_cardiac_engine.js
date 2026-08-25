/**
 * TIER3_REHAB-105 Cardiac / Pulmonary Rehabilitation Engine
 * Cardiac rehab phases + Post-MI exercise prescription + Heart failure rehab + Pulmonary rehab + Exercise prescription
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AACVPR_CARDIAC: 'AACVPR Cardiac Rehab 2020', ATS_PULM: 'ATS Pulmonary Rehab 2021' };

function cardiacRehabPhases(input) {
  const { event_type, days_post_event, cardiac_function_ef_percent, exercise_tolerance_mets, arrhythmias_present, supervised_phase_indicated, current_phase } = input;
  let phase = current_phase;
  let plan = 'continue_current_phase_with_progressive_exercise_education_risk_factor_modification';
  if (event_type === 'post_mi_or_revasc' && days_post_event < 14) { phase = 'phase_I_inpatient_early_mobilization'; plan = 'early_progressive_mobilization_brief_walk_QID_education_discharge_planning'; }
  else if (days_post_event >= 14 && days_post_event <= 84) { phase = 'phase_II_outpatient_supervised_EKG_monitored_36_sessions'; plan = 'supervised_exercise_3x_per_week_with_EKG_telemetry_education_lipid_BP_smoking'; }
  else if (days_post_event > 84 && days_post_event <= 365) { phase = 'phase_III_supervised_community_or_home'; plan = 'ongoing_supervised_or_home_based_exercise_maintain_risk_factor_targets'; }
  else if (days_post_event > 365) { phase = 'phase_IV_maintenance_independent'; plan = 'independent_exercise_maintenance_program_annual_cardiology_follow_up'; }
  return {
    phase, plan,
    core_components: ['patient_assessment_initial_and_serial', 'nutritional_counseling_mediterranean_or_DASH', 'lipid_BP_glucose_smoking_weight_management', 'psychological_support_screen_for_depression_anxiety', 'physical_activity_counseling_individualized_exercise_prescription'],
    outcomes: 'reduce_mortality_20_to_30pct_reduce_rehospitalization_25pct_improve_quality_of_life_and_return_to_work',
    monitoring: 'BP_HR_pre_post_exercise_RPE_scale_6_to_20_target_11_to_14_ECG_monitoring_in_phase_II',
    citation: CITATIONS.AACVPR_CARDIAC,
  };
}

function postMiExercisePrescription(input) {
  const { age_years, baseline_max_mets, ejection_fraction_percent, hr_rest, hr_max_220_minus_age_or_documented, beta_blocker_use, ischemic_threshold_hr, baseline_dyspnea, comorbidities_limit } = input;
  let hr_reserve = hr_max_220_minus_age_or_documented - hr_rest;
  let target_hr = hr_rest + 0.6 * hr_reserve;
  if (beta_blocker_use === 'yes') target_hr = hr_rest + 0.4 * hr_reserve;
  let modality = 'treadmill_walking_or_bike_30_min_5x_per_week_plus_resistance_2x_per_week';
  let intensity = 'moderate_RPE_11_to_14_target_hr_' + Math.round(target_hr);
  let contraindication = [];
  if (ejection_fraction_percent < 35) contraindication.push('avoid_high_intensity_continue_under_supervision_phase_II');
  if (ischemic_threshold_hr < target_hr) contraindication.push('keep_hr_below_ischemic_threshold_' + ischemic_threshold_hr + '_bpm');
  return {
    intensity, modality, target_hr: Math.round(target_hr), contraindication,
    warm_up_cool_down: '5_min_warm_up_then_30_min_exercise_then_5_to_10_min_cool_down_with_low_intensity',
    resistance_training: 'start_light_weights_upper_and_lower_body_2x_per_week_resistance_in_phase_III',
    citation: CITATIONS.AACVPR_CARDIAC,
  };
}

function heartFailureRehabilitation(input) {
  const { lv_ef_percent, nyha_class, icd_present, beta_blocker_optimized, peak_vo2_ml_per_kg_per_min, frailty_score_present, six_min_walk_distance_meters } = input;
  let enrollment = 'eligible_for_cardiac_rehab_phase_II_to_IV';
  if (nyha_class === 'III_or_IV') enrollment = 'refer_for_supervised_cardiac_rehab_with_cautious_progression_low_intensity_intervals';
  if (peak_vo2_ml_per_kg_per_min < 14) enrollment = 'consider_advanced_therapy_evaluation_LVAD_or_transplant_if_no_recovery';
  return {
    enrollment,
    exercise_modality: 'cycling_or_walking_with_intervals_2_to_5_min_at_50_to_70pct_vo2_reserve_alternating_with_low_intensity',
    resistance: 'light_resistance_after_4_weeks_aerobic_adaptation_avoid_valsalva',
    contraindications: ['unstable_arrhythmias', 'decompensated_HF_hospitalized_within_3d', 'severe_valvular_disease_uncompensated', 'recent_PE_or_DVT_unstable'],
    monitoring: 'RPE_dyspnea_scale_Borg_6_to_20_target_11_to_14_SpO2_above_88_during_exercise',
    citation: CITATIONS.AACVPR_CARDIAC,
  };
}

function pulmonaryRehabilitation(input) {
  const { copd_gold_stage, mrc_dyspnea_grade, baseline_6mwd_meters, prior_exacerbation_3m, oxygen_use_at_rest, anxiety_depression_present, lung_volume_reduction_candidate, pulmonary_rehab_setting } = input;
  let plan = 'outpatient_pulmonary_rehab_8_to_12_weeks_3x_per_week_supervised_education_exercise';
  let exercise_components = ['endurance_treadmill_or_bike_30_min_target_Borg_dyspnea_3_to_5', 'resistance_upper_and_lower_body_2x_per_week', 'breathing_techniques_pursed_lip_diaphragmatic', 'energy_conservation_ADL_training', 'oxygen_titration_during_exercise_to_keep_SpO2_above_88'];
  if (copd_gold_stage === 'stage_4_severe' || mrc_dyspnea_grade >= 4) plan = 'consider_supervised_outpatient_or_home_based_pulmonary_rehab_plus_supplemental_O2';
  if (anxiety_depression_present === 'yes') exercise_components.push('psychosocial_support_cognitive_behavioral_components');
  return {
    plan, exercise_components,
    outcomes: 'reduce_dyspnea_improve_6MWD_30_to_50m_reduce_hospitalization_reduce_anxiety_depression',
    supplemental_o2: 'maintain_SpO2_above_88pct_during_exercise_titrate_with_O2_tank_or_concentrator',
    monitoring: '6MWD_Q4_weeks_Borg_dyspnea_Q_session_CAT_Q4_weeks_QOL_st_Q12_weeks',
    citation: CITATIONS.ATS_PULM,
  };
}

function exercisePrescriptionCardiopulmonary(input) {
  const { modality_choice, intensity_level_percent_hrr, frequency_per_week, duration_minutes, comorbidities_limit_exercise, isometric_vs_isotonic, balance_training_needed, age_above_75 } = input;
  let prescription = {
    modality: modality_choice,
    intensity: intensity_level_percent_hrr + '_percent_HRR_or_RPE_11_to_14',
    frequency: frequency_per_week,
    duration: duration_minutes + '_minutes_per_session'
  };
  if (age_above_75 === 'yes') {
    prescription.balancing = 'include_balance_training_3x_per_week_to_reduce_fall_risk';
    prescription.resistance = 'low_resistance_higher_repetitions_2_to_3_sets_of_10_to_15_reps';
  }
  if (comorbidities_limit_exercise === 'yes') prescription.modification = 'interval_training_2_to_5_min_high_2_min_low_more_tolerable';
  return {
    prescription,
    progression: 'increase_duration_then_intensity_then_frequency_per_FITT_principles_Q4_to_6_weeks',
    safety_check: 'pre_exercise_BP_less_than_180_over_100_then_OK_stop_if_BP_above_200_over_110_or_HR_irregular_or_dyspnea_severe',
    citation: CITATIONS.AACVPR_CARDIAC,
  };
}

module.exports = { cardiacRehabPhases, postMiExercisePrescription, heartFailureRehabilitation, pulmonaryRehabilitation, exercisePrescriptionCardiopulmonary, CITATIONS, ValidationError };