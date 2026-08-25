/**
 * TIER3_SUP-106 Patient Transport Engine
 * Transport dispatch + Levels of care + Critical monitoring + Equipment + Hand-off
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHRQ_TRANSPORT: 'AHRQ Patient Transport 2024', AHA_PATIENT_TRANS: 'Patient Transport Standards 2023' };

function transportLevelDetermination(input) {
  const { patient_acuity, monitoring_required, equipment_in_use, isolation_required, iv_medications, vasopressors, airway_status, mobility_assistance_needed, time_estimate_min } = input;
  let transport_team = 'ambulatory_self_or_wheelchair_per_unit_staff';
  if (patient_acuity === 'critical' || vasopressors === 'yes') transport_team = 'RN_with_monitor_and_emergency_equipment_critical_care_transport_team';
  if (monitoring_required === 'yes' || iv_medications === 'yes') transport_team = 'RN_monitor_per_unit_standard_with_iv_pole';
  if (mobility_assistance_needed === 'yes') transport_team = 'transport_team_with_wheelchair_assistance_and_proper_equipment';
  return {
    transport_team,
    equipment_required: ['portable_monitor_with_ECG_SpO2_BP_per_unit_protocol', 'defibrillator_for_critical_or_arrhythmia_risk', 'oxygen_tank_or_concentrator', 'suction_portable', 'IV_pole_pumps_battery_operated', 'emergency_medications_with_emergency_kit', 'personal_protective_equipment_PPE_per_isolation_status'],
    risk_stratification: 'high_risk_transport_within_ICU_patients_with_vasopressors_or_intubation_arrhythmia_increases_risk_of_adverse_event',
    citation: CITATIONS.AHRQ_TRANSPORT,
  };
}

function transportHandoffCommunication(input) {
  const { sender_unit, receiver_unit, sender_nurse, receiver_nurse, hand_off_format_used, critical_information_communicated, iv_pump_status, monitoring_status, isolation_status, family_notified, equipment_status } = input;
  let plan = 'use_IPASS_handoff_with_introduction_patient_summary_action_list_situational_awareness_synthesis_by_receiver';
  let elements = ['patient_identity_MRN_two_identifiers', 'primary_diagnosis_active_problem_list', 'isolation_status_with_required_PPE', 'allergy_summary', 'code_status_advance_directive', 'current_medications_infusions_rates', 'recent_vital_signs_any_trending_concerns', 'lines_and_tubes_with_location_and_purpose', 'pending_tests_or_results_with_action_plan', 'equipment_requirements'];
  return {
    plan, elements,
    documentation: 'transport_handoff_documented_in_EMR_with_sender_and_receiver_signatures_and_time_stamp',
    verification: 'receiver_read_back_critical_information_with_sender_confirmation_specifically_code_status_and_allergies',
    citation: CITATIONS.AHRQ_TRANSPORT,
  };
}

function transportEquipment(input) {
  const { transport_destination, equipment_required, transport_mode_wheelchair_stretcher_ambulance, escort_required, monitoring_required, oxygen_required, transport_duration_estimate_min } = input;
  let equipment_checklist = ['wheelchair_or_stretcher_functional_with_brakes_working', 'transport_monitor_battery_above_50pct_with_alarms_active', 'oxygen_tank_above_500_psi_with_flow_meter_set', 'IV_pump_battery_operated_with_adequate_charge', 'suction_portable_functional_with_catheter', 'emergency_kit_with_medications_and_ambu_bag', 'ppe_isolation_precautions_mask_gown_glove_per_protocol'];
  let transport_team = 'unit_nurse_with_appropriate_team_member_for_destination';
  if (transport_destination === 'OR' || transport_destination === 'ICU') transport_team = 'sending_unit_nurse_to_OR_receiving_ICU_nurse_handoff';
  return {
    equipment_checklist, transport_team,
    pre_transport: ['confirm_destination_equipment_receiver_and_time', 'review_pending_tests_for_results_review', 'place_patient_on_appropriate_surface', 'secure_all_lines_tubes_drains', 'provide_cover_blanket_for_warmth', 'confirm_family_notification'],
    documentation: 'transport_time_out_destination_arrival_time_and_condition_at_receiving_unit',
    citation: CITATIONS.AHRQ_TRANSPORT,
  };
}

function intrahospitalTransportCritical(input) {
  const { critical_care_indication, ventilator_required, vasopressor_infusions, monitoring_required, transport_time_min, transport_team_composition, destination_unit_pre_notified, emergency_during_transport } = input;
  let plan = 'critical_care_transport_team_with_full_monitoring_per_AHRQ_guidelines';
  if (ventilator_required === 'yes') plan = plan + '_with_transport_ventilator_with_pre_set_parameters_full_resuscitation_kit_with_ametamine_lidocaine';
  if (vasopressor_infusions === 'yes') plan = plan + '_ensure_pump_battery_and_extra_bag_with_concentration_for_emergency';
  if (transport_time_min > 30) plan = plan + '_consider_extended_trip_supplies_extra_oxygen_and_medications';
  return {
    plan,
    pre_transport: ['review_test_results_and_clinical_status', 'confirm_destination_unit_aware_and_ready', 'set_monitoring_with_alarms_active_appropriate_per_patient', 'secure_all_infusions_with_battery_check', 'suction_oral_and_endotracheal_per_protocol', 'resuscitation_equipment_verified', 'code_status_review_with_receiver_for_clarification'],
    emergency_during_transport: ['call_for_help_via_care_team_or_emergency_responder', 'address_immediate_life_threat_ABC_airway_breathing_circulation', 'return_to_originating_unit_or_nearest_ICU_if_unstable', 'activate_code_blue_for_cardiac_or_respiratory_arrest'],
    citation: CITATIONS.AHRQ_TRANSPORT,
  };
}

function transportDelayEscalation(input) {
  const { delay_reason, delay_min, patient_acuity, status_during_wait, communication_with_team, escalation_documented, transport_team_reassigned, alternative_route_planned } = input;
  let plan = 'document_delay_with_reason_and_Q15min_update_to_receiving_team';
  let escalation = 'if_delay_exceeds_30_min_notify_receiving_unit_with_estimated_arrival_then_Q15min';
  if (patient_acuity === 'critical') escalation = escalation + '_with_senior_leadership_notification_for_critical_delay_exceeds_60_min';
  if (alternative_route_planned === 'yes') escalation = escalation + '_transport_lead_to_reassign_team_or_use_alternative_route';
  return {
    plan, escalation,
    root_cause: 'capture_root_cause_for_QI_analysis_equipment_failure_staffing_availability_unit_volume_destination_readiness',
    improvement: 'Q_month_transport_delay_audit_with_PDCA_to_reduce_mean_delay_aim_under_15_min_for_non_critical',
    citation: CITATIONS.AHRQ_TRANSPORT,
  };
}

module.exports = { transportLevelDetermination, transportHandoffCommunication, transportEquipment, intrahospitalTransportCritical, transportDelayEscalation, CITATIONS, ValidationError };