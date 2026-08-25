/**
 * TIER3_ADM-105 Patient Flow / Throughput Engine
 * Patient flow dashboard + Bottleneck identification + Throughput metrics + Inter-facility transfer + Command center
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHRQ_FLOW: 'AHRQ Patient Flow 2024', IHI_FLOW: 'IHI Hospital Flow 2022' };

function patientFlowDashboard(input) {
  const { ed_arrivals_today, ed_inpatient_boarding_count, ed_los_median_min, available_inpatient_beds, available_icu_beds, hospital_occupancy_pct, discharges_by_noon_pct, admissions_per_hour, operating_room_cases_done, predicted_peak_time } = input;
  let status = 'green_normal_flow';
  if (ed_inpatient_boarding_count >= 5 || hospital_occupancy_pct >= 90) status = 'yellow_overcrowded';
  if (ed_inpatient_boarding_count >= 10 || ed_los_median_min >= 360 || available_icu_beds === 0) status = 'red_crisis_activate_command_center';
  return {
    status,
    dashboard_metrics: ['ed_volume_by_hour_with_peak_prediction', 'boarding_count_real_time', 'hospital_occupancy_pct', 'ICU_census_and_capacity', 'discharges_by_noon_pct', 'OR_schedule_progress', 'predictive_analytics_for_2_to_4h_peak'],
    data_refresh: 'real_time_or_Q15min_from_EMR_and_bed_management_system',
    citation: CITATIONS.AHRQ_FLOW,
  };
}

function bottleneckIdentification(input) {
  const { discharge_processing_time, housekeeping_turnover_time, transport_delay_to_unit, specialist_consult_response_time, imaging_turnaround_time, bed_assignment_delay_min } = input;
  let bottlenecks = [];
  if (discharge_processing_time >= 60) bottlenecks.push('discharge_processing_slow_review_nursing_workflow');
  if (housekeeping_turnover_time >= 90) bottlenecks.push('housekeeping_turnover_extend_or_add_evening_shift_or_prioritize_per_protocol');
  if (transport_delay_to_unit >= 20) bottlenecks.push('patient_transport_team_expansion_or_unit_assignment_team');
  if (specialist_consult_response_time >= 120) bottlenecks.push('specialist_consults_slow_review_consult_team_model_or_protocol');
  if (imaging_turnaround_time >= 60) bottlenecks.push('imaging_turnaround_extend_hours_or_add_capacity');
  if (bed_assignment_delay_min >= 30) bottlenecks.push('bed_assignment_centralized_authority_implementation');
  return {
    bottlenecks,
    improvement: ['lean_methodology_observation_to_identify_waste', 'discharge_planning_start_at_admission_with_predicted_discharge_date', 'standard_work_for_each_unit_step', 'visual_management_board_with_real_time_status'],
    citation: CITATIONS.IHI_FLOW,
  };
}

function throughputMetrics(input) {
  const { ed_los_for_discharged_min, ed_los_for_admitted_min, hospital_los_avg_days, or_turnover_time_min, discharge_before_noon_pct, bed_turnover_per_day, weekend_discharge_rate } = input;
  let summary = {
    ed_los_for_discharged: ed_los_for_discharged_min + '_minutes',
    ed_los_for_admitted: ed_los_for_admitted_min + '_minutes',
    hospital_los_avg: hospital_los_avg_days + '_days',
    or_turnover_time: or_turnover_time_min + '_minutes',
    discharge_before_noon: discharge_before_noon_pct + 'pct',
    bed_turnover: bed_turnover_per_day + '_patients_per_bed_per_day',
    weekend_discharge_rate: weekend_discharge_rate + 'pct'
  };
  let targets_met = {
    ed_los_discharged_less_than_180: ed_los_for_discharged_min < 180,
    ed_los_admitted_less_than_360: ed_los_for_admitted_min < 360,
    discharge_before_noon_above_30pct: discharge_before_noon_pct >= 30,
    or_turnover_below_45: or_turnover_time_min < 45
  };
  return {
    summary, targets_met,
    benchmarking: 'compare_to_MOH_and_international_benchmarks_ARHQ_NHS_targets_for_similar_size_hospital',
    improvement_focus: ['lean_daily_management_system', 'standard_work_for_top_3_bottlenecks_Q_month', 'multidisciplinary_improvement_committee'],
    citation: CITATIONS.IHI_FLOW,
  };
}

function interFacilityTransfer(input) {
  const { transfer_reason, originating_facility_capability, receiving_facility_capability, medical_record_documentation_complete, transport_mode, transfer_coordinator_involved, insurance_preauth_obtained, family_consent_documented } = input;
  let plan = 'inter_facility_transfer_with_sending_and_receiving_physician_to_physician_handoff';
  if (transfer_reason === 'specialty_capability_tertiary_care') plan = 'transfer_to_tertiary_care_center_with_subspecialty_consultation';
  if (transfer_reason === 'capacity_overflow') plan = 'transfer_for_capacity_bypass_with_receiving_hospital_capacity_confirmation';
  let transport = 'EMS_basic_or_advanced_or_critical_care_team_per_patient_acuity';
  return {
    plan, transport,
    documentation: 'transfer_summary_with_reason_condition_during_transport_medications_interventions_response_to_treatment',
    regulatory: 'EMTALA_or_local_equivalent_compliance_medical_screening_and_stabilization_before_transfer',
    citation: CITATIONS.AHRQ_FLOW,
  };
}

function commandCenterProtocol(input) {
  const { crisis_trigger_activated, command_center_open, communications_team, bed_assignment_lead, transport_coordinator, housekeeping_supervisor, social_work_lead, executive_on_call } = input;
  let plan = 'hospital_command_center_HICS_per_Israel_or_HICS_standard_for_hospital_incident_command_system';
  let roles = {
    incident_commander: 'executive_on_call_or_designated_senior_leader',
    operations_chief: 'nursing_administrator_or_designee',
    planning_chief: 'quality_or_data_analytics_lead',
    logistics_chief: 'support_services_supply_housekeeping_transport',
    finance_chief: 'controller_or_designee_for_cost_tracking',
    liaison: 'public_information_officer_for_media_relations'
  };
  return {
    plan, roles,
    activation_criteria: ['mass_casualty_incident_MCI', 'ED_overcrowding_persistent_above_4h', 'ICU_capacity_above_95pct_with_patients_in_ED_or_recovery', 'infrastructure_failure_power_water_IT', 'epidemic_surge_within_72h'],
    documentation: 'HICS_forms_with_objectives_strategy_tactics_assigned_tasks_Q1h_check_ins',
    citation: CITATIONS.IHI_FLOW,
  };
}

module.exports = { patientFlowDashboard, bottleneckIdentification, throughputMetrics, interFacilityTransfer, commandCenterProtocol, CITATIONS, ValidationError };