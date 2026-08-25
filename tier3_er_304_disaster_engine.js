/**
 * TIER3_ER-304 Mass Casualty / Disaster Medicine Engine
 * START triage + Mass casualty incident classification + Hospital surge capacity + Decontamination protocol + Disaster communication
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_EMSI: 'WHO Emergency Medical Services 2024', NDLS: 'NDLSF 2024' };

function startTriage(input) {
  const { respirations_per_min, spo2_pct, perfusion_status, mental_status, age_years } = input;
  let triage_category = 'DECEASED_expectant';
  if (mental_status === 'unresponsive_or_posturing') triage_category = 'IMMEDIATE_red';
  else if (perfusion_status === 'absent_or_gt_2_sec' || respirations_per_min > 30 || spo2_pct < 90) triage_category = 'IMMEDIATE_red';
  else if (mental_status === 'altered_but_follows_commands') triage_category = 'DELAYED_yellow';
  else if (respirations_per_min <= 30 && spo2_pct >= 90 && perfusion_status === 'lt_2_sec') triage_category = 'MINOR_green';
  else if (respirations_per_min === 0 && mental_status === 'unresponsive') triage_category = 'DECEASED_black';
  return {
    triage_category, respirations_per_min, spo2_pct, perfusion_status, mental_status,
    immediate_action: triage_category === 'IMMEDIATE_red' ? 'immediate_medical_intervention_transport_first' : triage_category === 'DELAYED_yellow' ? 'rapid_assessment_then_transport' : triage_category === 'MINOR_green' ? 'routine_transport_walking_wounded' : 'expectant_or_palliative_care',
    citation: CITATIONS.WHO_EMSI,
  };
}

function mciIncidentClassification(input) {
  const { patient_count_estimated, capacity_to_handle, additional_resources_arrival_minutes, scene_safety_status } = input;
  let classification = 'mci_level_1_routine';
  if (patient_count_estimated >= 100) classification = 'mci_level_3_catastrophic_massive_resources_needed';
  else if (patient_count_estimated >= 25 && patient_count_estimated < 100) classification = 'mci_level_2_multiple_casualties_emergency_response';
  else if (patient_count_estimated >= 5 && patient_count_estimated < 25) classification = 'mci_level_1_multiple_patients_significant_response';
  const hospital_overload = patient_count_estimated > capacity_to_handle;
  return {
    mci_classification: classification, patient_count_estimated, capacity_to_handle,
    hospital_overload: hospital_overload ? 'yes' : 'no',
    response: ['activate_hospital_incident_command_system_HICS', 'notify_staff_recall_off_duty', 'clear_non_urgent_ED_patients', 'prepare_triage_area', 'notify_other_hospitals', 'coordinate_with_EMS'],
    citation: CITATIONS.NDLS,
  };
}

function hospitalSurgeCapacity(input) {
  const { current_occupied_pct, available_staff, available_supplies, ventilators_available, icu_beds_available, surge_plan_activated } = input;
  let surge_level = 'no_surge_needed';
  if (current_occupied_pct >= 90) surge_level = 'contingency_surge_activate_surge_plan';
  if (current_occupied_pct >= 100 || ventilators_available === '0' || icu_beds_available === '0') surge_level = 'crisis_surge_activate_external_partners';
  return {
    surge_level, current_occupied_pct,
    actions: surge_level === 'no_surge_needed' ? 'continue_routine_operations' : surge_level === 'contingency_surge_activate_surge_plan' ? ['convert_units_for_additional_beds', 'accelerate_discharge_planning', 'postpone_elective_procedures', 'recall_off_duty_staff'] : ['activate_emergency_operations_center', 'mutual_aid_with_other_hospitals', 'federal_resources_requested', 'alternate_care_site_activated'],
    citation: CITATIONS.NDLS,
  };
}

function decontaminationProtocol(input) {
  const { contamination_type, agent_chemical_bio_radiological, casualty_count, ambulatory_status, decon_water_available } = input;
  let level_of_ppe = 'B_for_chemical_with_unknown_substance';
  let decon_strategy = 'wet_decontamination_with_water_and_gentle_brushing';
  if (agent_chemical_bio_radiological === 'biological') { level_of_ppe = 'B_or_C'; decon_strategy = 'soap_and_water_wash_clothing_removal'; }
  else if (agent_chemical_bio_radiological === 'radiological') { level_of_ppe = 'B_for_dust_powder_removal'; decon_strategy = 'remove_clothing_brush_off_powder_wash_with_water'; }
  else if (agent_chemical_bio_radiological === 'chemical') { level_of_ppe = 'A_fully_encapsulating'; decon_strategy = 'large_volume_water_decontamination_with_gentle_brushing_dilution_5_to_10_minutes'; }
  return {
    level_of_ppe, decon_strategy, contamination_type,
    ambulatory: ambulatory_status === 'ambulatory' ? 'ambulatory_decontamination_line_self_help' : 'non_ambulatory_decontamination_line_assist_decon_team',
    setup: decon_water_available === 'yes' ? 'establish_3_zone_decon_with_shower_lines' : 'consider_alternatives_use_fire_hose_and_bucket_system',
    citation: CITATIONS.WHO_EMSI,
  };
}

function disasterCommunicationPlan(input) {
  const { primary_communication_status, backup_communication_available, public_information_officer, family_information_center, incident_command_post } = input;
  let communication_status = 'operational';
  if (primary_communication_status === 'down') communication_status = 'activate_backup_implementation';
  return {
    communication_status,
    plan: ['primary_system_with_redundancy_2_way_radios_backup', 'designate_incident_command_post_location', 'activate_public_information_officer', 'establish_family_information_center_away_from_treatment_area', 'media_briefing_Q60_to_90_min', 'coordinate_with_emergency_operations_center'],
    backup_communication_available, public_information_officer, family_information_center, incident_command_post,
    citation: CITATIONS.WHO_EMSI,
  };
}

module.exports = { startTriage, mciIncidentClassification, hospitalSurgeCapacity, decontaminationProtocol, disasterCommunicationPlan, CITATIONS, ValidationError };