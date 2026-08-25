/**
 * TIER3_ADM-108 Quality Improvement Engine
 * Quality metrics + CAPA action plan + Benchmarking + Clinical audit + QI methodology
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { IHI_QI: 'IHI Quality Improvement 2023', CBAHI_NATIONAL: 'CBAHI National Standards 2024' };

function qualityMetricsDashboard(input) {
  const { mortality_observed, mortality_expected, readmission_rate_30d_pct, complications_pct, patient_satisfaction_score, hand_hygiene_compliance_pct, core_measure_compliance_pct, staffing_ratio } = input;
  let summary = {
    mortality_observed_vs_expected_O_E: mortality_observed + '/' + mortality_expected,
    readmission_rate_30d: readmission_rate_30d_pct + 'pct',
    complications: complications_pct + 'pct',
    patient_satisfaction: patient_satisfaction_score,
    hand_hygiene: hand_hygiene_compliance_pct + 'pct',
    core_measure_compliance: core_measure_compliance_pct + 'pct',
    staffing: staffing_ratio
  };
  let interpretation = {};
  if (mortality_observed / mortality_expected > 1.2) interpretation.mortality = 'HIGHER_than_expected_investigate';
  else if (mortality_observed / mortality_expected < 0.8) interpretation.mortality = 'LOWER_than_expected_excellent';
  if (readmission_rate_30d_pct > 15) interpretation.readmission = 'HIGH_review_discharge_processing';
  if (hand_hygiene_compliance_pct < 80) interpretation.hand_hygiene = 'BELOW_target_95pct_action_required';
  return {
    summary, interpretation,
    dashboard: 'CBAHI_required_quality_metrics_with_real_time_dashboard_Q_month_review',
    citation: CITATIONS.CBAHI_NATIONAL,
  };
}

function capaActionPlan(input) {
  const { nonconformance_identified, root_cause_category, capa_type_corrective_or_preventive, owner_assigned, target_completion_date, effectiveness_check_planned } = input;
  let plan = 'C_Corrective_to_eliminate_identified_cause_or_P_preventive_to_prevent_recurrence';
  let capa_elements = ['problem_definition', 'root_cause_analysis_5_whys_or_fishbone', 'action_plan_with_specific_steps_owner_due_date', 'implementation', 'effectiveness_verification', 'closure_with_documented_evidence'];
  let priority = 'high_priority_immediate';
  if (nonconformance_identified === 'patient_safety_risk') priority = 'CRITICAL_immediate_within_24h';
  if (nonconformance_identified === 'process_deviation') priority = 'moderate_within_30d';
  if (nonconformance_identified === 'documentation_or_process') priority = 'low_within_60d';
  return {
    plan, priority, capa_elements,
    effectiveness_check: 'measure_metric_after_action_implementation_with_target_met_evidence',
    documentation: 'CBAHI_or_JCI_standard_CAPA_form_with_signatures_owner_director_quality',
    citation: CITATIONS.IHI_QI,
  };
}

function clinicalBenchmarking(input) {
  const { metric_name, internal_value, external_benchmark_value, benchmark_source, time_period, sample_size_internal } = input;
  let comparison = internal_value / external_benchmark_value;
  let performance = 'at_benchmark';
  if (comparison > 1.1) performance = 'WORSE_than_benchmark_action_plan_to_improve';
  else if (comparison < 0.9) performance = 'BETTER_than_benchmark_share_practice';
  let benchmark_source_options = ['AHRQ_quality_indicators', 'CMS_core_measures', 'NSQIP_mortality_and_morbidity', 'HCAHPS_patient_satisfaction', 'institutional_peer_benchmarking_consortium', 'JCI_or_CBAHI_standards'];
  return {
    performance, comparison: comparison + '_ratio',
    benchmark_source_options,
    improvement_plan: 'if_worse_than_benchmark_set_SMART_goal_with_PDSA_cycle_to_improve',
    citation: CITATIONS.IHI_QI,
  };
}

function clinicalAuditCycle(input) {
  const { audit_topic, sample_size, criteria_defined, data_collection_method, current_compliance_pct, target_compliance_pct, re_audit_planned } = input;
  let phase = 'criteria_definition_or_baseline';
  if (data_collection_method === 'yes') phase = 'data_collection_complete';
  if (current_compliance_pct !== undefined) phase = 'analysis_and_action_planning';
  if (re_audit_planned === 'yes') phase = 're_audit_to_close_the_loop';
  let plan = 'audit_topic_criteria_sample_data_collection_analysis_improvement_re_audit_cycle_Q_year';
  return {
    phase, plan,
    audit_topic_examples: ['pain_assessment_reassessment_within_2h', 'medication_reconciliation_at_admission', 'VTE_prophylaxis_for_eligible_patients', 'hand_hygiene_compliance', 'fall_risk_assessment_completed'],
    criteria: 'measurable_with_evidence_based_source_JCI_CBAHI_CMS_NQF',
    sample_size: 'statistically_valid_sample_size_typically_30_to_100_per_audit_Q_year_or_per_unit',
    citation: CITATIONS.CBAHI_NATIONAL,
  };
}

function qualityImprovementMethodology(input) {
  const { aim_statement, baseline_measure, target_measure, change_ideas, test_cycle_plan, team_assembled } = input;
  let methodology = 'Model_for_Improvement_with_3_questions_plus_PDSA_cycle';
  let aiia = ['what_are_we_trying_to_accomplish_aim', 'how_will_we_know_change_is_an_improvement_measure', 'what_change_can_we_make_that_will_result_in_improvement_change_idea'];
  let pdsa = ['Plan_state_hypothesis_and_test_plan', 'Do_carry_out_test_on_small_scale', 'Study_analyze_results_and_learn', 'Act_adopt_adapt_or_abandon_and_plan_next_cycle'];
  if (team_assembled !== 'yes') return { methodology, requirement: 'multidisciplinary_team_with_aim_measure_change_ideas' };
  return {
    methodology, aiia, pdsa,
    tools: ['process_map_to_understand_current_state', 'fishbone_cause_and_effect', '5_whys_root_cause', 'Pareto_chart_prioritization', 'run_chart_to_show_change_over_time'],
    citation: CITATIONS.IHI_QI,
  };
}

module.exports = { qualityMetricsDashboard, capaActionPlan, clinicalBenchmarking, clinicalAuditCycle, qualityImprovementMethodology, CITATIONS, ValidationError };