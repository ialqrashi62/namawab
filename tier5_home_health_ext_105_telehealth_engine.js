// filepath: tier5_home_health_ext_105_telehealth_engine.js
// TIER5_HOME_HEALTH_EXT-105: Telehealth & RPM (chronic disease, vitals, alert triage)
'use strict';

const CITATIONS = [
  'FCC_RPM_2020',
  'CMS_RPM_Billing_2023',
  'CommonWell_RPM_Standards_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function chronic_rpm(req) {
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['hypertension','heart_failure','copd','diabetes','obesity','asthma']);
  ensureNumber(req.readings_per_day, 'readings_per_day');
  ensureNumber(req.days_with_data_per_month, 'days_with_data_per_month');
  ensureNumber(req.systolic_threshold_upper, 'systolic_threshold_upper');
  ensureNumber(req.spO2_threshold_lower, 'spO2_threshold_lower');

  if (req.days_with_data_per_month < 16) return { status: 'inadmissible_data_below_16_days_for_99457_or_99458', recommendation: 'consider_education_to_increase_adherence_then_rescreen_at_45_days' };
  if (req.readings_per_day >= 5) return { status: 'too_many_readings_per_day_evaluate_sub_setting_and_consolidation_for_patient' };
  return { status: 'appropriate_for_chronic_care_management_or_RPM' };
}

function alert_triage(req) {
  ensureStr(req.alert_type, 'alert_type');
  ensureEnum(req.alert_type, 'alert_type', ['hypertensive_urgency','hypotension','arrhythmia','oxygen_saturation_drop','blood_glucose_low','blood_glucose_high','weight_change','missed_dose_or_no_data','device_failure']);
  ensureNumber(req.number_of_consecutive_alerts, 'number_of_consecutive_alerts');
  ensureNumber(req.hours_since_last_alert, 'hours_since_last_alert');
  ensureBool(req.symptom_present, 'symptom_present');

  let priority;
  if (['hypertensive_urgency','arrhythmia','blood_glucose_low'].includes(req.alert_type) && req.symptom_present) priority = 'P0_immediate_callback_within_15_min';
  else if (req.symptom_present) priority = 'P1_callback_within_2h';
  else if (req.number_of_consecutive_alerts >= 3) priority = 'P1_callback_within_4h';
  else if (req.number_of_consecutive_alerts >= 1) priority = 'P2_routine_callback_within_24h';
  else priority = 'P3_watch';

  return { priority, alert_type: req.alert_type };
}

function chronic_disease_tele(req) {
  ensureStr(req.condition, 'condition');
  ensureEnum(req.condition, 'condition', ['hypertension','heart_failure','copd','diabetes','mixed']);
  ensureNumber(req.follow_up_weeks, 'follow_up_weeks');
  ensureNumber(req.patient_visit_adherence_pct, 'patient_visit_adherence_pct');
  ensureNumber(req.num_medication_issues, 'num_medication_issues');
  ensureNumber(req.sensor_or_app_use_today, 'sensor_or_app_use_today');

  let triage;
  if (req.follow_up_weeks < 4) triage = 'early_follow_up_with_assignments';
  else if (req.patient_visit_adherence_pct >= 80 && req.num_medication_issues <= 1 && req.sensor_or_app_use_today >= 1) triage = 'continue_with_positive_reinforcement';
  else if (req.patient_visit_adherence_pct < 70 || req.num_medication_issues >= 3) triage = 'case_manager_referral_for_one_to_one_adherence_coaching';

  return { triage };
}

function video_visit_check(req) {
  ensureBool(req.device_present_with_microphone, 'device_present_with_microphone');
  ensureBool(req.camera_permission, 'camera_permission');
  ensureBool(req.battery_charged_or_connected, 'battery_charged_or_connected');
  ensureBool(req.bandwidth_sufficient, 'bandwidth_sufficient');
  ensureStr(req.attempt_status, 'attempt_status');
  ensureEnum(req.attempt_status, 'attempt_status', ['connected_first_attempt','connected_after_second_attempt','second_attempt_failed','connection_failed_replace_phone_or_inperson']);

  return { action: req.attempt_status === 'connection_failed_replace_phone_or_inperson' ? 'in_person_fallback_visit' : 'continue_with_tele_visit_or_reschedule_when_technical_ready' };
}

function digital_inclusion(req) {
  ensureNumber(req.digital_literacy_score, 'digital_literacy_score');
  ensureStr(req.device_used, 'device_used');
  ensureEnum(req.device_used, 'device_used', ['phone_with_smart_capability','tablet_with_screen','smart_speaker','no_device_with_capability']);
  ensureStr(req.connectivity_type, 'connectivity_type');
  ensureEnum(req.connectivity_type, 'connectivity_type', ['home_wifi','home_cellular','public_or_work_wifi','cellular_data_in_home','no_connectivity']);
  ensureStr(req.primary_concern, 'primary_concern');
  ensureEnum(req.primary_concern, 'primary_concern', ['access_only','literacy','trust_in_provider_or_app','overlap_or_language_barrier','cost']);

  let plan;
  if (req.digital_literacy_score < 5) plan = 'in_person_with_caregiver_then_offer_literacy_bridge_or_digital_buddy';
  else if (req.primary_concern === 'trust_in_provider_or_app') plan = 'explore_in_person_then_personalized_video_explain_then_provider_team_assurance';
  else if (req.primary_concern === 'cost') plan = 'consider_subsidized_wifi_or_wireless_tariff_options_or_in_person_during_9_to_12';
  else if (req.primary_concern === 'literacy') plan = 'multi_modal_care_with_audio_video_then_caregiver_present_or_paper';
  else plan = 'continue_with_tele_visit';

  return { plan };
}

function funcs() { return { chronic_rpm, alert_triage, chronic_disease_tele, video_visit_check, digital_inclusion }; }
module.exports = { funcs, CITATIONS, ValidationError };
