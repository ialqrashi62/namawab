/**
 * TIER3_ADM-103 Bed Management Engine
 * Bed assignment + Capacity management + Internal transfer + Isolation allocation + Housekeeping workflow
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHRQ_BED: 'AHRQ Bed Management 2023', CDC_ISO: 'CDC Isolation Precautions 2023' };

function bedAssignment(input) {
  const { acuity_level, gender, isolation_required, telemetry_required, age_appropriate_unit, geographic_proximity_to_nurse_station, roommate_appropriate } = input;
  let priority = 'assign_to_appropriate_unit_immediately_if_available';
  if (acuity_level === 'critical' && telemetry_required === 'yes') priority = 'ICU_or_step_down_with_telemetry_monitoring';
  if (age_appropriate_unit === 'pediatric' || age_appropriate_unit === 'geriatric') priority = age_appropriate_unit + '_unit_for_age_specific_needs';
  if (isolation_required === 'yes') priority = 'isolation_room_with_required_precautions_per_CDC';
  return {
    priority,
    matching: ['acuity_match_to_unit', 'specialty_unit_for_diagnosis', 'gender_compatible_room_or_semi_private', 'age_appropriate_unit', 'infection_status_compatible_roommates'],
    if_no_bed_available: 'hold_in_ED_or_post_op_recovery_unit_with_overflow_protocol_activate_command_center',
    citation: CITATIONS.AHRQ_BED,
  };
}

function bedCapacityManagement(input) {
  const { current_occupancy_pct, ed_boarding_count, icu_occupancy_pct, scheduled_discharges_today, predicted_admits_today } = input;
  let status = 'normal_capacity';
  if (current_occupancy_pct >= 85) status = 'high_occupancy_discharge_priority';
  if (current_occupancy_pct >= 95 || icu_occupancy_pct >= 90) status = 'full_activate_surge_plan';
  if (predicted_admits_today - scheduled_discharges_today > 5) status = 'impending_overflow';
  return {
    status,
    actions: ['discharge_planning_first_thing_AM_round_with_estimated_discharge_time', 'housekeeping_priority_to_prep_discharged_rooms_within_2h', 'consider_hospital_in_the_home_for_eligible_patients', 'regional_communication_with_partner_hospitals_for_transfer_if_full'],
    surge_plan: ['cancel_elective_admissions_if_safety_threshold', 'open_contingency_unit_with_staff_pool', 'ED_admission_hold_team_for_handoff', 'tele_monitoring_for_low_acuity_inpatients'],
    citation: CITATIONS.AHRQ_BED,
  };
}

function patientTransferInternal(input) {
  const { transfer_from_unit, transfer_to_unit, level_of_care_change, medication_changes, equipment_changes, handoff_sbar_done, primary_team_changed, family_notified } = input;
  let safety_checklist = ['reason_for_transfer_documented', 'receiving_team_accepts_patient_with_full_handoff', 'medications_reconciled_at_transfer', 'all_equipment_needed_available_at_receiving_unit', 'SBAR_communication_with_receiving_nurse_and_physician', 'transport_monitor_documented', 'family_aware_of_room_change'];
  let plan = 'transfer_with_nurse_handoff_using_IPASS_or_SBAR_at_bedside_with_patient_introduction';
  if (level_of_care_change === 'upgrade_to_ICU') plan = plan + '_with_full_resuscitation_status_verified';
  if (level_of_care_change === 'downgrade_to_ward') plan = plan + '_with_continued_monitoring_documented_in_ward_care_plan';
  return {
    safety_checklist, plan,
    documentation: 'transfer_note_with_reason_time_sender_receiver_team_at_receiving_unit',
    handoff_quality: 'IPASS_Illness_severity_Patient_summary_Action_list_Situational_awareness_Synthesis_by_receiver',
    citation: CITATIONS.AHRQ_BED,
  };
}

function isolationRoomAllocation(input) {
  const { isolation_type, organism_suspected, airborne_precautions_required, contact_precautions_required, droplet_precautions_required, immunocompromised_patient_placement, roommate_status, room_type } = input;
  let placement = 'standard_precautions_room';
  if (airborne_precautions_required === 'yes') placement = 'AIIR_airborne_infection_isolation_room_with_negative_pressure_6_to_12_ACH';
  else if (droplet_precautions_required === 'yes') placement = 'single_room_preferred_or_cohort_with_same_organism';
  else if (contact_precautions_required === 'yes') placement = 'single_room_preferred_or_cohort_with_same_organism';
  if (immunocompromised_patient_placement === 'yes') placement = 'protective_environment_positive_pressure_HEPA_filtered';
  return {
    placement,
    ppe_required: 'N95_for_airborne_gown_gloves_for_contact_surgical_mask_for_droplet',
    cohorting: 'cohort_with_same_organism_only_per_infection_control_approval',
    transport: 'patient_transport_in_clean_gown_mask_per_precautions_destination_notified',
    citation: CITATIONS.CDC_ISO,
  };
}

function housekeepingWorkflow(input) {
  const { room_discharge_status, isolation_discharge_cleaning, cleaning_checklist, terminal_cleaning_required, c_difficile_or_norovirus_or_mrsa, uv_disinfection_used, cleaning_audit_done, time_to_clean_min } = input;
  let workflow = 'standard_discharge_cleaning_within_2h';
  if (isolation_discharge_cleaning === 'yes') workflow = 'enhanced_terminal_cleaning_with_UV_disinfection_for_C_difficile_or_norovirus';
  let time_target = time_to_clean_min <= 60 ? 'within_target' : 'over_target_review_cleaning_protocol';
  return {
    workflow, time_target,
    cleaning_checklist: ['high_touch_surfaces_with_appropriate_disinfectant', 'bed_bathroom_floors_walls', 'remove_all_single_use_items', 'replace_curtains_per_protocol', 'UV_C_disinfection_for_high_risk_rooms', 'ATP_swab_testing_for_cleanliness_audit'],
    audit: 'random_audit_Q_month_with_ATP_testing_for_cleanliness_validation',
    citation: CITATIONS.CDC_ISO,
  };
}

module.exports = { bedAssignment, bedCapacityManagement, patientTransferInternal, isolationRoomAllocation, housekeepingWorkflow, CITATIONS, ValidationError };