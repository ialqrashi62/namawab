/**
 * TIER3_SUP-107 Hospital Security Engine
 * Security incident + Access control + Visitor management + Active threat + Bomb threat + Infant abduction
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { IAHSS_SECURITY: 'IAHSS Healthcare Security 2024', HHS_HEALTHCARE_SECURITY: 'HHS Active Shooter 2024' };

function securityIncidentResponse(input) {
  const { incident_type, severity, location_unit, time_of_incident, persons_involved, weapons_involved, immediate_danger, security_dispatched, law_enforcement_needed } = input;
  let response = 'security_response_immediate_assess_scene_safety_contain_patient_or_visitor_call_for_help_if_uncontrolled';
  if (incident_type === 'active_shooter' || weapons_involved === 'yes') response = 'HHS_active_shooter_protocol_run_hide_fight_evacuate_or_lockdown_aggressive_attack_call_911_security_immediate';
  if (incident_type === 'patient_visitor_assault') response = 'immediate_security_call_911_if_weapon_or_severe_injury_deescalate_if_safe_separate_parties_documented_in_charts';
  if (incident_type === 'infant_abduction') response = 'code_pink_infant_abduction_lockdown_immediate_security_dispatch_perimeter_control_with_24h_response';
  return {
    response,
    hhs_run_hide_fight: 'RUN_escape_if_safe_HIDE_lockdown_out_of_sight_silence_phones_FIGHT_last_resort_with_improvised_weapons',
    documentation: 'incident_report_with_objective_findings_quotes_witness_statements_timeline_photos_evidence_chain_of_custody_for_criminal_investigation',
    debrief: 'critical_incident_stress_debrief_within_72h_for_involved_staff_voluntary_with_mental_health_support_follow_up',
    citation: CITATIONS.IAHSS_SECURITY,
  };
}

function accessControlManagement(input) {
  const { areas_lockdown_required, badge_access_required, visitor_id_required, infant_security_tag_used, elopement_risk_patient_identified, baby_loud_tags_active, restricted_area_access, video_surveillance_active } = input;
  let plan = 'badge_access_with_door_hardware_per_unit_visitor_ID_at_entrance_with_sign_in_log_and_photo_identification';
  if (infant_security_tag_used === 'yes') plan = 'infant_abduction_prevention_with_electronic_tag_at_birth_active_throughout_stay_alarmed_at_exit_attempt';
  if (elopement_risk_patient_identified === 'yes') plan = 'elopement_risk_assessment_with_1_to_1_sitter_video_monitoring_alarmed_door_identification_band_for_elopement_risk';
  let restricted = ['pharmacy_drug_storage', 'medical_gas_storage', 'server_room', 'cash_handling', 'research_lab_areas', 'OR_complex'];
  return {
    plan, restricted,
    layered: ['perimeter_security_sign_in_lobby', 'unit_specific_badge_access', 'patient_room_appropriate_supervision_per_clinical_status', 'medication_storage_double_lock'],
    elopement: 'elopement_team_response_code_silver_to_facilitate_safe_return_within_30_min_with_law_enforcement_involvement_if_not_found',
    citation: CITATIONS.IAHSS_SECURITY,
  };
}

function visitorManagement(input) {
  const { visitor_purpose, visitor_id_obtained, number_of_visitors_per_patient_limit, visiting_hours, infection_control_screening, unit_specific_restrictions, security_check, family_caregiver_designation } = input;
  let plan = 'standard_visitor_sign_in_with_photo_ID_log_with_destination_unit_and_patient_name';
  if (infection_control_screening === 'yes') plan = plan + '_with_health_screening_recent_exposure_symptoms_temp_check_before_entry_per_protocol';
  if (unit_specific_restrictions === 'yes') plan = plan + '_ICU_or_neonatal_with_strict_visiting_hours_2_visitors_max_per_visit_screening_for_illness';
  let caregiver_rights = ['family_caregiver_designation_for_24h_access_per_CMS_caregiver_rights_law', 'designated_caregiver_allowed_24h_access_with_screening_or_PPE', 'infection_control_with_screening_passes_for_24h_caregiver'];
  return {
    plan, caregiver_rights,
    special: ['pediatric_parent_24h_rooming_in_permitted', 'postpartum_24h_support_person_permitted', 'end_of_life_open_visiting_for_imminent_death_or_post_mortem_viewing', 'behavioral_health_restricted_visiting_per_provider_discretion'],
    citation: CITATIONS.IAHSS_SECURITY,
  };
}

function activeThreatCodeProtocol(input) {
  const { threat_type_active_shooter_or_other, lockdown_needed, law_enforcement_response_time, communication_with_staff, lockdown_locations_preidentified, incident_command_activated } = input;
  let plan = 'CODE_SILVER_active_shooter_or_active_threat_immediate_lockdown_within_affected_area';
  let hhs_run_hide_fight = ['RUN_escape_if_safe_with_all_patients_possible', 'HIDE_lockdown_out_of_sight_silence_phones_avoid_windows', 'FIGHT_as_last_resort_only'];
  if (law_enforcement_response_time === 'within_5_min') plan = plan + '_HHS_run_hide_fight_protocol_with_law_enforcement_immediate';
  let comm = 'overhead_announcement_CODE_SILVER_threat_location_no_personalities_for_ongoing_risk_minimize_staff_comms_during_event';
  return {
    plan, hhs_run_hide_fight, comm,
    handoff_to_LE: 'when_law_enforcement_arrives_follow_their_commands_remain_in_place_until_cleared_keep_hands_visible_no_objects',
    debrief: 'post_event_debrief_within_24_to_48h_then_comprehensive_after_action_review_within_30_days_CISM_for_staff',
    citation: CITATIONS.HHS_HEALTHCARE_SECURITY,
  };
}

function infantAbductionPrevention(input) {
  const { mother_baby_unit_identified, infant_security_tag_active, abductor_typically_suspect_profile_alert, code_pink_drill_Q, monitoring_active, exits_alarmed, staff_training_completed } = input;
  let plan = 'comprehensive_infant_abduction_prevention_program_with_IAHSS_standards';
  let components = ['electronic_infant_security_tag_active_at_birth_throughout_stay', 'unique_identification_band_on_mother_and_infant_with_database_matching', 'staff_identification_with_photo_id_uniform_in_OB_unit', 'exits_alarmed_with_silent_duress_alarm_for_tag_exit_attempt', 'video_surveillance_with_recording_30_to_90_days', 'CODE_PINK_drill_Q_with_team_response_review'];
  if (abductor_typically_suspect_profile_alert === 'yes') components.push('suspect_profile_recognition_training_with_staff_for_typical_female_age_15_to_45_visiting_or_female_partner_visiting_only', 'OB_unit_limited_access_for_only_designated_visitors_per_protocol');
  return {
    plan, components,
    incident: 'CODE_PINK_infant_abduction_lockdown_immediate_perimeter_security_dispatch_law_enforcement_within_24h_for_infant_recovery',
    family_support: 'family_centered_care_with_comprehensive_support_for_parents_within_24h_post_event_with_psychological_support',
    citation: CITATIONS.IAHSS_SECURITY,
  };
}

module.exports = { securityIncidentResponse, accessControlManagement, visitorManagement, activeThreatCodeProtocol, infantAbductionPrevention, CITATIONS, ValidationError };