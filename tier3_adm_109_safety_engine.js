/**
 * TIER3_ADM-109 Patient Safety / Adverse Events Engine
 * Adverse event reporting + RCA + FMEA + Daily safety brief + Safety culture survey
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { TJC_SENTINEL: 'TJC Sentinel Events 2024', NPSF_SAFETY: 'NPSF Safety Culture 2024', VA_NCPS: 'VA NCPS RCA 2020' };

function adverseEventReporting(input) {
  const { event_type, severity_level, sentinel_event, near_miss, harm_severity_safety_classification, event_date, location_unit, reporter_role, root_cause_analysis_initiated } = input;
  let reporting = 'standard_event_reporting_with_RCA_for_severe_or_sentinel';
  if (severity_level === 'sentinel_event' || sentinel_event === 'yes') reporting = 'SENTINEL_EVENT_RCA_within_45_days_TJC_review_within_45_days_of_event_with_action_plan_sustain';
  if (near_miss === 'yes') reporting = 'near_miss_reporting_with_aggregate_analysis_Q_quarter_themed_review';
  let harm_class = harm_severity_safety_classification;
  return {
    reporting, harm_class,
    categories: ['near_miss_did_not_reach_patient', 'no_harm_reached_patient_no_consequence', 'mild_harm_minimal_intervention', 'moderate_harm_required_intervention_or_prolonged_stay', 'severe_harm_permanent_or_life_threatening', 'sentinel_death_or_severe_permanent_harm'],
    timeframe: 'report_within_24h_to_quality_department_root_cause_for_severe_or_sentinel_within_45_days',
    citation: CITATIONS.TJC_SENTINEL,
  };
}

function rootCauseAnalysis(input) {
  const { sentinel_event, contributing_factors, root_cause_method, team_assembled, fishbone_categories, five_whys_completed, action_plan_with_owner_due_date, strength_of_action_weak_strong } = input;
  let methodology = root_cause_method === 'fishbone_and_5_whys' ? 'combined_5_whys_for_immediate_cause_plus_fishbone_for_systemic_causes' : 'select_appropriate_method_based_on_event';
  let team_required = 'multidisciplinary_team_with_frontline_staff_leadership_quality_patient_safety_officer';
  let strong_actions = ['forcing_functions_or_constraints_that_make_error_impossible', 'automation_or_computerization_that_reduces_reliance_on_memory', 'simplification_or_standardization', 'redundancy_or_backup_systems', 'tangible_architectural_or_engineering_changes'];
  let weak_actions = ['training_or_education', 'policy_or_procedure_review', 'warning_labels_or_signs', 'double_checks_or_checklists_only'];
  return {
    methodology, team_required, strong_actions, weak_actions,
    action_plan_principles: 'prefer_strong_actions_over_weak_actions_sustainability_measurement_with_run_chart',
    citation: CITATIONS.VA_NCPS,
  };
}

function failureModeEffectsAnalysis(input) {
  const { process_to_analyze, steps_count, failure_modes_identified, severity_score_avg, occurrence_score_avg, detection_score_avg, rpn_risk_priority_number_threshold } = input;
  let rpn = severity_score_avg * occurrence_score_avg * detection_score_avg;
  let high_risk = rpn >= rpn_risk_priority_number_threshold;
  let plan = high_risk ? 'prioritize_action_to_reduce_RPN_through_severity_or_occurrence_or_detection_reduction' : 'monitor_and_re_evaluate_Q_year';
  return {
    rpn, high_risk,
    steps: ['assemble_team_with_process_expertise', 'map_process_with_detailed_steps', 'identify_failure_modes_per_step_with_severity_occurrence_detection_scores', 'calculate_RPN_prioritize_top_5_to_10_failure_modes', 'develop_action_plan_for_top_failure_modes', 'implement_actions_and_re_calculate_RPN'],
    citation: CITATIONS.NPSF_SAFETY,
  };
}

function dailySafetyBrief(input) {
  const { brief_attendees_count, safety_events_24h, environmental_safety_rounds, equipment_functional, falls_count, medication_errors, sentinel_event_count, patient_safety_issue_identified, action_items_from_brief } = input;
  let plan = 'daily_15_minute_huddle_with_unit_leadership_review_24h_safety_events_and_look_ahead_risks';
  let briefing_agenda = ['previous_24h_safety_events_review', 'look_ahead_to_high_risk_procedures_or_patients', 'equipment_availability_review', 'staffing_concerns_for_safety', 'good_catch_near_miss_recognition', 'specific_topic_focus_Q_day'];
  return {
    plan, briefing_agenda,
    minutes_documented: 'name_topic_decisions_action_items_owner_due_date',
    frequency: 'every_shift_or_daily_Q_day_with_unit_leadership',
    citation: CITATIONS.NPSF_SAFETY,
  };
}

function safetyCultureSurvey(input) {
  const { survey_tool_used, response_rate_pct, overall_safety_grade, communication_openness_score, teamwork_score, staffing_score, supervisor_expectations_score, learning_culture_score, follow_up_actions_after_survey } = input;
  let summary = {
    response_rate: response_rate_pct + 'pct',
    overall_safety_grade: overall_safety_grade,
    communication_openness: communication_openness_score,
    teamwork: teamwork_score,
    staffing: staffing_score,
    supervisor_expectations: supervisor_expectations_score,
    learning_culture: learning_culture_score
  };
  let strengths = [];
  let weaknesses = [];
  if (communication_openness_score >= 75) strengths.push('communication_openness'); else weaknesses.push('communication_openness');
  if (staffing_score >= 75) strengths.push('staffing'); else weaknesses.push('staffing');
  let plan = 'share_results_with_unit_teams_identify_strengths_celebrate_and_weaknesses_action_plan_with_annual_resurvey';
  return {
    summary, strengths, weaknesses, plan,
    validated_tools: ['AHRQ_Hospital_Survey_on_Patient_Safety_Culture_HSOPS', 'Safety_Attitudes_Questionnaire_SAQ', 'MaPSaF_Maturity_Progression_Safety_Framework'],
    citation: CITATIONS.NPSF_SAFETY,
  };
}

module.exports = { adverseEventReporting, rootCauseAnalysis, failureModeEffectsAnalysis, dailySafetyBrief, safetyCultureSurvey, CITATIONS, ValidationError };