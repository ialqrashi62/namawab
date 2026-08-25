/**
 * TIER3_ADM-106 Scheduling / Appointments Engine
 * Appointment booking + Waitlist + Overbooking + Reminders + No-show reduction
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAFP_SCHED: 'AAFP Open Access Scheduling 2023', MGMA_SCHED: 'MGMA Practice Management 2024' };

function appointmentBooking(input) {
  const { appointment_type, urgency, provider_preference, time_preference, duration_estimate_min, language_requirement, accessibility_need, prior_visit_history, virtual_vs_in_person } = input;
  let priority = 'routine_within_2_weeks';
  if (urgency === 'urgent_same_day') priority = 'same_day_or_within_24h_urgent_care';
  else if (urgency === 'semi_urgent') priority = 'within_3_to_5_days';
  let plan = 'open_access_scheduling_with_same_day_capacity_for_urgent_then_bimodal_routine';
  if (virtual_vs_in_person === 'virtual') plan = 'tele_visit_with_video_or_phone_with_synchronous_provider';
  return {
    priority, plan,
    template_suggestion: ['new_patient_30_to_45_min', 'established_patient_follow_up_15_to_20_min', 'complex_or_multi_problem_45_to_60_min', 'procedure_based_30_to_90_min_per_procedure'],
    patient_preferences: 'language_accessibility_provider_continuity_relationship',
    citation: CITATIONS.AAFP_SCHED,
  };
}

function waitlistManagement(input) {
  const { waitlist_days, urgency, clinical_priority_to_bump, patient_willing_to_come_short_notice, alternative_provider_offered, communication_to_patient } = input;
  let plan = 'review_waitlist_Q2_weeks_prioritize_high_clinical_priority_then_first_in_first_out';
  if (clinical_priority_to_bump === 'yes') plan = 'bump_patients_with_documented_lower_priority_to_make_room_for_higher_priority';
  if (patient_willing_to_come_short_notice === 'yes') plan = 'short_notice_cancellation_priority_list_automated_phone_or_sms_dispatch';
  return {
    plan,
    alternatives: ['refer_to_other_providers_in_network_within_organization', 'open_access_same_day_visit_if_patient_flexible', 'tele_health_visit_as_alternative'],
    patient_communication: 'proactive_communication_Q2_weeks_about_expected_wait_then_Q_month_with_options',
    citation: CITATIONS.MGMA_SCHED,
  };
}

function overbookingStrategy(input) {
  const { specialty, no_show_rate_pct, average_los_min, clinic_capacity_pct, provider_acceptance, overbooking_pct } = input;
  let overbook = 'no_overbooking_recommended';
  if (no_show_rate_pct >= 20 && clinic_capacity_pct < 80) overbook = 'overbook_10_to_15pct_with_chaired_double_book_same_provider_acceptable';
  if (no_show_rate_pct >= 30 && specialty === 'low_risk_follow_up') overbook = 'overbook_20_to_30pct_with_triage_pre_visit_questionnaire_to_confirm_visit_still_needed';
  return {
    overbook,
    strategy: ['analyze_no_show_rate_by_provider_and_visit_type', 'overbook_lower_complexity_appointments_with_tele_follow_up', 'double_book_complex_appointments_only_within_provider_acceptance', 'track_overbooking_outcomes_Q_month'],
    mitigation: 'patient_satisfaction_decreases_with_wait_over_30_min_set_realistic_expectations_about_double_booking',
    citation: CITATIONS.AAFP_SCHED,
  };
}

function patientReminderSystem(input) {
  const { reminder_channels, days_before_reminder, two_way_confirmation_required, language_reminder, accessibility_for_visual_impairment, demographics_age_above_65, cell_phone_vs_landline } = input;
  let plan = 'multi_channel_reminders_sms_email_phone_with_two_way_confirmation';
  if (demographics_age_above_65 === 'yes' && cell_phone_vs_landline === 'landline') plan = 'landline_phone_reminder_with_sms_if_available_or_letter_postal';
  let timing = days_before_reminder + '_days_before_with_reminder_24h_before';
  return {
    plan, timing,
    script: 'patient_reminder_with_appointment_date_time_provider_location_what_to_bring_cancel_reschedule_instructions',
    two_way_confirmation: 'confirm_reply_C_or_reschedule_R_for_tracking_no_show_rate_improvement',
    impact: 'no_show_rate_reduction_30_to_50pct_with_multi_channel_reminders',
    citation: CITATIONS.MGMA_SCHED,
  };
}

function noShowReduction(input) {
  const { baseline_no_show_pct, patient_demographics, transportation_barrier, financial_barrier, language_barrier, scheduling_complexity, current_reminder_system } = input;
  let interventions = [];
  if (transportation_barrier === 'yes') interventions.push('address_transportation_with_ride_share_partnership_or_voucher');
  if (financial_barrier === 'yes') interventions.push('financial_counseling_for_payment_options_and_assistance_programs');
  if (language_barrier === 'yes') interventions.push('professional_interpreter_for_visit_and_reminder_in_preferred_language');
  if (scheduling_complexity === 'yes') interventions.push('simplified_booking_with_default_options_for_follow_up_at_check_out');
  interventions.push('open_access_scheduling_to_reduce_lag_between_booking_and_visit');
  interventions.push('multi_channel_reminder_system_with_two_way_confirmation');
  interventions.push('no_show_fee_with_warning_for_repeat_patients_excluded_for_low_income');
  return {
    interventions,
    expected_outcome: 'no_show_rate_reduction_30_to_50pct_with_multi_intervention_approach',
    monitoring: 'track_no_show_pct_Q_month_by_provider_and_visit_type_with_dashboard',
    citation: CITATIONS.AAFP_SCHED,
  };
}

module.exports = { appointmentBooking, waitlistManagement, overbookingStrategy, patientReminderSystem, noShowReduction, CITATIONS, ValidationError };