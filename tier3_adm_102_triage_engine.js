/**
 * TIER3_ADM-102 Triage / ESI Engine
 * ESI triage level + South African Triage + Fast-track criteria + Wait time monitoring + Diversion policy
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ESI_TRIAGE: 'ESI Version 4 2020', SATS: 'South African Triage Scale 2018' };

function esiTriageLevel(input) {
  const { life_threatening_condition, high_risk_situation, vital_signs_abnormal, pain_severity, expected_resources, time_sensitivity } = input;
  let level = 5;
  if (life_threatening_condition === 'yes' || time_sensitivity === 'immediate') level = 1;
  else if (high_risk_situation === 'yes' || vital_signs_abnormal === 'yes' || pain_severity >= 7) level = 2;
  else if (expected_resources >= 2) level = 3;
  else if (expected_resources === 1) level = 4;
  else level = 5;
  let target_time_to_provider = 'immediate';
  if (level === 2) target_time_to_provider = 'less_than_10_min';
  else if (level === 3) target_time_to_provider = 'less_than_30_min';
  else if (level === 4) target_time_to_provider = 'less_than_60_min';
  else if (level === 5) target_time_to_provider = 'less_than_120_min';
  return {
    level, target_time_to_provider,
    color_code: level === 1 ? 'red_resuscitation' : level === 2 ? 'orange_emergent' : level === 3 ? 'yellow_urgent' : level === 4 ? 'green_less_urgent' : 'blue_non_urgent',
    reassessment: 'every_1_to_2h_for_emergent_or_urgent_Q4h_for_less_urgent',
    citation: CITATIONS.ESI_TRIAGE,
  };
}

function southAfricanTriage(input) {
  const { mobility_walking, hr_bpm, rr_per_min, systolic_bp_mmhg, temperature_c, spo2_percent, avpu_scale, clinical_sign_discriminator, trauma_present } = input;
  let color = 'green_routine';
  if (avpu_scale === 'P_or_U' || spo2_percent < 90 || (hr_bpm >= 130 || hr_bpm <= 50)) color = 'red_immediate';
  else if (clinical_sign_discriminator === 'yes' || temperature_c >= 39 || temperature_c < 35) color = 'orange_very_urgent';
  else if (rr_per_min >= 25 || rr_per_min <= 9 || systolic_bp_mmhg < 90 || trauma_present === 'yes') color = 'yellow_urgent';
  else if (mobility_walking === 'yes') color = 'yellow_urgent';
  else color = 'green_routine';
  return {
    color,
    target_time_to_provider: color === 'red_immediate' ? 'immediate' : color === 'orange_very_urgent' ? 'less_than_10_min' : color === 'yellow_urgent' ? 'less_than_60_min' : 'less_than_240_min',
    sats_format: 'physiological_data_plus_clinical_sign_discriminators',
    citation: CITATIONS.SATS,
  };
}

function fastTrackCriteria(input) {
  const { chief_complaint_laceration, simple_laceration_present, no_other_complaints, able_to_wait, laceration_length_cm, location_face_high_cosmetic, tetanus_status_current } = input;
  let eligible = false;
  if (chief_complaint_laceration === 'yes' && no_other_complaints === 'yes' && laceration_length_cm < 5 && able_to_wait === 'yes') eligible = true;
  let plan = 'fast_track_to_minor_treatment_room_with_LP_or_PA_skilled_procedure_within_30_to_60_min';
  if (location_face_high_cosmetic === 'yes') plan = 'refer_to_emergency_physician_or_plastic_surgery_for_face_laceration_cosmetic_concern';
  if (tetanus_status_current !== 'yes') plan = plan + '_plus_tetanus_prophylaxis_per_protocol';
  return {
    eligible, plan,
    other_fast_track_eligible: ['simple_eye_complaint_conjunctivitis_foreign_body', 'medication_refill', 'simple_fracture_follow_up', 'suture_removal', 'recheck_wound_or_simple_dressing_change'],
    monitoring: 'fast_track_los_target_less_than_90_min_less_than_30pct_of_total_ed_volume_eligible',
    citation: CITATIONS.ESI_TRIAGE,
  };
}

function waitTimeMonitoring(input) {
  const { ed_arrival_to_triage_min, ed_arrival_to_provider_min, boarding_time_hours, lwbs_rate_percent, total_los_for_admitted_patient_hours, current_ed_volume } = input;
  let status = 'within_target';
  if (ed_arrival_to_provider_min > 30 || boarding_time_hours > 4 || lwbs_rate_percent > 3) status = 'overcrowded_consider_overflow_protocol';
  if (ed_arrival_to_provider_min > 60 || boarding_time_hours > 8 || current_ed_volume === 'overflow') status = 'crisis_activate_command_center';
  return {
    status,
    targets: ['door_to_provider_median_less_than_30_min', 'door_to_provider_90pct_less_than_60_min', 'lwbs_less_than_2pct', 'boarding_less_than_4h_for_ICU_admit', 'ed_los_for_admitted_less_than_8h'],
    metrics: 'dashboard_with_realtime_metrics_daily_huddle_to_address_drift',
    citation: CITATIONS.ESI_TRIAGE,
  };
}

function ambulanceDiversionPolicy(input) {
  const { ed_status, hospital_icu_full, all_hospitals_nearby_on_diversion, diversion_requested, ed_director_approval, alternative_hospitals_evaluated, mpd_communicated } = input;
  let diversion = 'no_diversion_needed';
  if (ed_status === 'overcrowded' && diversion_requested === 'yes' && ed_director_approval === 'yes') diversion = 'temporary_diversion_for_specific_categories_trauma_or_stemi_per_community_protocol';
  if (all_hospitals_nearby_on_diversion === 'yes') diversion = 'revert_to_normal_status_to_avoid_community_disaster';
  return {
    diversion,
    mpd_communication: 'Medical_Priority_Dispatch_EMS_diversion_notification_with_clear_categories_accepted_or_not_accepted',
    community_responsibility: 'EM_System_Saudi_MOH_requires_central_dispatch_coordination_to_avoid_community_diversion_bypass',
    documentation: 'diversion_log_with_reason_duration_categories_accepted_Q_month_audit',
    citation: CITATIONS.SATS,
  };
}

module.exports = { esiTriageLevel, southAfricanTriage, fastTrackCriteria, waitTimeMonitoring, ambulanceDiversionPolicy, CITATIONS, ValidationError };