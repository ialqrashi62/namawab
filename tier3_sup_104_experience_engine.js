/**
 * TIER3_SUP-104 Patient Experience Engine
 * HCAHPS + Complaint management + Leader rounding + Communication + Metrics
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { HCAHPS: 'HCAHPS Survey 2024', AHRQ_PX: 'AHRQ Patient Experience 2024' };

function hcahpsDomainTargeting(input) {
  const { nurse_communication_score, doctor_communication_score, responsiveness_score, pain_management_score, communication_about_medicines_score, discharge_information_score, cleanliness_score, quietness_score, overall_rating_9_or_10_pct, willingness_to_recommend_pct } = input;
  let domain_gaps = [];
  if (nurse_communication_score < 80) domain_gaps.push('nurse_communication_nurse_lead_rounding_and_always_boards');
  if (doctor_communication_score < 80) domain_gaps.push('doctor_communication_sitting_down_with_patient_and_family_meetings');
  if (responsiveness_score < 70) domain_gaps.push('responsiveness_call_light_response_within_5_min_5_min_rounding');
  if (pain_management_score < 75) domain_gaps.push('pain_management_multimodal_analgesia_pain_rounding_protocols');
  if (communication_about_medicines_score < 70) domain_gaps.push('communication_about_medicines_explain_new_medication_side_effects');
  if (discharge_information_score < 80) domain_gaps.push('discharge_information_discharge_planning_start_at_admission_teach_back');
  if (cleanliness_score < 75) domain_gaps.push('cleanliness_daily_cleaning_rounds_and_quiet_environment');
  if (quietness_score < 60) domain_gaps.push('quietness_quiet_hours_22_to_6_with_dimmed_lights_and_alarm_reduction');
  return {
    domain_gaps,
    target_metrics: 'achieve_top_box_scores_above_75pct_in_all_domains_continuously_review_with_dashboard_Q_month',
    patient_perspective: 'understand_patient_family_experience_with_patient_and_family_advisory_council_input',
    citation: CITATIONS.HCAHPS,
  };
}

function complaintManagement(input) {
  const { complaint_category, severity, complainant, time_since_complaint_hours, root_cause_preliminary, family_meeting_needed, risk_management_involved, regulatory_reporting_required } = input;
  let response = 'immediate_acknowledgment_within_1h_then_investigation_within_24h_resolution_within_7_days';
  if (severity === 'patient_safety_adverse_event') response = 'urgent_response_within_1h_with_clinical_leadership_and_risk_management_and_quality_investigation';
  if (regulatory_reporting_required === 'yes') response = 'report_to_risk_management_legal_quality_and_executive_team_immediately_per_protocol';
  let investigation = 'review_medical_record_timeline_interview_staff_consult_quality_team_for_system_issues';
  let closure = 'follow_up_with_complainant_within_30_days_with_actions_taken_to_prevent_recurrence_documented';
  return {
    response, investigation, closure,
    framework: 'service_recovery_with_empathy_acknowledgment_apology_tangible_action_follow_up_to_demonstrate_care',
    legal_risk: 'risk_management_review_for_significant_complaints_legal_consultation_if_sue_or_pursue_legal_action_indicated',
    citation: CITATIONS.AHRQ_PX,
  };
}

function leaderRoundingOnPatients(input) {
  const { rounding_frequency, unit_coverage_pct, executive_team_participation, script_used, follow_up_action_completion_pct, patient_feedback_quality, nurse_participation } = input;
  let plan = 'daily_leader_rounding_by_unit_charge_nurse_or_unit_manager_per_patient_with_weekly_executive_rounding_for_high_risk_or_long_stay';
  let scripts = 'how_is_your_stay_today_who_is_your_team_member_taking_care_of_you_is_your_call_light_being_answered_is_there_anything_we_can_do_better_who_should_we_recognize';
  let impact = 'leader_rounding_associated_with_higher_HCAHPS_scores_and_patient_satisfaction_and_identification_of_issues_early_for_resolution';
  return {
    plan, scripts, impact,
    tracking: 'log_rounding_contacts_Q_week_action_items_Q_month_follow_up_Q_quarter_capture_recognition_and_constructive_feedback',
    cultural: 'non_punitive_environment_where_patient_feedback_is_a_gift_and_leaders_take_action',
    citation: CITATIONS.AHRQ_PX,
  };
}

function patientCommunicationBestPractices(input) {
  const { teach_back_used, plain_language_used, sit_down_position, white_board_used, family_engaged, hourly_rounding, bedside_handoff_done, language_access, health_literacy_assessment } = input;
  let plan = 'use_AIDET_framework_Acknowledge_Introduce_Duration_Explanation_Thank_you_with_all_patient_interactions';
  let checklist = ['sit_down_during_patient_encounter_increases_perceived_time_and_engagement', 'use_plain_language_avoid_medical_jargon_check_with_teach_back_method', 'use_white_board_to_communicate_daily_plan_provider_names_tests_today', 'family_engagement_within_24h_of_admission_with_care_conference', 'hourly_rounding_for_pain_positioning_personal_needs_to_reduce_call_light_use', 'bedside_handoff_at_shift_change_with_patient_involvement_to_safety'];
  return {
    plan, checklist,
    teach_back: 'ask_patient_to_explain_in_their_own_words_what_they_need_to_do_or_understand_then_re_teach_if_gap',
    language_access: 'professional_interpreter_for_non_english_speaking_patients_or_deaf_with_interpreter_services_available_Q_visit',
    citation: CITATIONS.HCAHPS,
  };
}

function experienceMetricsDashboard(input) {
  const { hcahps_top_box_pct, friends_and_family_test_pct, complaint_rate_per_1000_visits, online_review_average, social_media_sentiment, employee_engagement_score, nurse_patient_ratio, staff_turnover_pct } = input;
  let dashboard = {
    hcahps_top_box: hcahps_top_box_pct + 'pct',
    friends_family: friends_and_family_test_pct + 'pct',
    complaint_rate: complaint_rate_per_1000_visits + '_per_1000_visits',
    online_review_average: online_review_average + '_out_of_5',
    employee_engagement: employee_engagement_score,
    nurse_to_patient: nurse_patient_ratio,
    staff_turnover: staff_turnover_pct + 'pct'
  };
  let targets_met = {
    hcahps_top_box_above_75: hcahps_top_box_pct >= 75,
    friends_family_above_80: friends_and_family_test_pct >= 80,
    complaint_rate_below_2: complaint_rate_per_1000_visits < 2,
    online_review_above_4: online_review_average >= 4
  };
  return {
    dashboard, targets_met,
    benchmarking: 'compare_to_Press_Ganey_/_PRC_/_Gallup_top_25pct_for_similar_size_and_specialty',
    improvement_priorities: 'address_lowest_domain_Q_quarter_using_QI_methodology_share_practice_with_high_performing_units',
    citation: CITATIONS.AHRQ_PX,
  };
}

module.exports = { hcahpsDomainTargeting, complaintManagement, leaderRoundingOnPatients, patientCommunicationBestPractices, experienceMetricsDashboard, CITATIONS, ValidationError };