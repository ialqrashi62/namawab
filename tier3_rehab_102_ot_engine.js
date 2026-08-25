/**
 * TIER3_REHAB-102 Occupational Therapy Engine
 * ADL assessment + Fine motor rehab + Hand therapy + Wheelchair prescription + Splinting
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AOTA_ADL: 'AOTA Practice Guidelines 2024', ASHT_HAND: 'ASHT Hand Therapy 2022' };

function adlAssessmentAndTraining(input) {
  const { barthel_index_score, lawton_iadl_score, primary_diagnosis, prior_independent_status, caregiver_support_available, cognitive_screen_score, prior_home_modifications } = input;
  let adl_dependency = 'mild_partial_assistance';
  if (barthel_index_score < 40) adl_dependency = 'severe_total_assistance_required';
  else if (barthel_index_score >= 40 && barthel_index_score < 70) adl_dependency = 'moderate_assistance_required';
  else if (barthel_index_score >= 70 && barthel_index_score < 90) adl_dependency = 'minimal_assistance_or_setup';
  let plan = 'ADL_training_with_adaptive_equipment_focused_on_bathing_dressing_toileting_grooming_feeding';
  if (cognitive_screen_score < 24) plan = 'cognitive_remediation_with_task_segmentation_verbal_cuing_and_visual_supports';
  return {
    adl_dependency, plan,
    adaptive_equipment: ['long_handle_sponge_for_bathing', 'dressing_stick_and_sock_aid', 'built_up_utensils_for_arthritis', 'raised_toilet_seat_and_grab_bars', 'reacher_for_low_items'],
    iadl_targets: ['medication_management_with_pill_organizer', 'meal_prep_with_safety_adaptations', 'financial_management_with_autopay', 'transportation_community_mobility_training'],
    monitoring: 'Barthel_Index_Q2_weeks_Lawton_Q4_weeks_COPM_goals_Q2_weeks',
    citation: CITATIONS.AOTA_ADL,
  };
}

function fineMotorRehab(input) {
  const { affected_hand_dominant_or_nondominant, grip_strength_kg, pinch_strength_kg, nine_hole_peg_test_seconds, prior_fine_motor_level, motor_recovery_stage_brunnstrom, hand_spasticity_present, sensory_loss_present } = input;
  let plan = 'task_specific_training_with_graded_activities_picking_up_coins_buttoning_typing';
  if (motor_recovery_stage_brunnstrom >= 4 && hand_spasticity_present === 'yes') plan = 'constraint_induced_movement_therapy_CIMT_6h_per_day_for_2_weeks_with_shaping_tasks';
  if (motor_recovery_stage_brunnstrom <= 3) plan = 'passive_range_of_motion_with_neuromuscular_electrical_stimulation_then_active_assisted';
  let orthosis_recommendation = sensory_loss_present === 'yes' ? 'wrist_hand_finger_orthosis_for_safety_to_prevent_injury_to_numb_hand' : 'no_orthosis_initial_focus_active_function';
  return {
    plan, orthosis_recommendation,
    targets: ['grip_strength_normalize_20pct_Q4_weeks', '9HPT_normalize_for_age_Q8_weeks', 'functional_tasks_independent_ADL_Q12_weeks'],
    modalities: ['constraint_induced_movement_therapy', 'mirror_therapy_for_neglect', 'robot_assisted_hand_therapy', 'NMES_neuromuscular_electrical_stimulation'],
    citation: CITATIONS.ASHT_HAND,
  };
}

function handTherapyProtocols(input) {
  const { hand_diagnosis, post_op_day, tendon_repair_zones, rom_active_degrees, edema_present, scar_adhesion, hand_therapy_protocol_phase } = input;
  let plan = 'edema_control_with_retrograde_massage_compression_garments_elevation';
  if (post_op_day >= 3 && post_op_day <= 7 && hand_therapy_protocol_phase === 'early_motion') plan = 'controlled_passive_and_active_assisted_motion_per_tendon_protocol_early_motion_zone_1_to_4';
  if (post_op_day >= 14 && hand_therapy_protocol_phase === 'strengthening') plan = 'progressive_resistance_with_putty_theraputty_graded_grippers';
  if (scar_adhesion === 'yes') plan = 'scar_management_with_silicone_gel_sheets_desensitization_massage';
  return {
    plan,
    tendon_protocols: ['Kleinert_protocol_flexor_tendon_zone_2', 'modified_Duran_protocol', 'early_active_motion_place_and_hold', 'zone_1_to_5_protocols_distinct'],
    edema_control: ['retrograde_massage', 'elevation_above_heart', 'compression_garment_isotoner_glove', 'coban_wrapping_for_firm_compression'],
    custom_orthosis: 'thermoplastic_custom_orthosis_per_protection_or_mobilization_need',
    monitoring: 'active_ROM_Q_session_total_active_motion_TAM_grip_strength_Q4_weeks',
    citation: CITATIONS.ASHT_HAND,
  };
}

function wheelchairPrescription(input) {
  const { ambulation_potential, postural_support_needed, upper_extremity_function, lifestyle_use_indoor_outdoor_both, transport_in_vehicle, power_vs_manual, custom_seating_cushion_required, pressure_injury_risk } = input;
  let recommendation = 'manual_wheelchair_ultra_lightweight_K0005_for_self_propulsion_if_upper_extremity_function_adequate';
  if (upper_extremity_function === 'poor' || ambulation_potential === 'no') recommendation = 'power_wheelchair_with_custom_seating_cushion_for_pressure_relief_and_postural_support';
  if (pressure_injury_risk === 'high') recommendation = 'power_wheelchair_with_tilt_in_space_and_pressure_relief_cushion_roho_quotient_or_jay_2';
  return {
    recommendation,
    cushion_selection: ['foam_cushion_low_risk', 'gel_or_hybrid_medium_risk', 'roho_air_adjustable_or_jay_2_deep_contour_high_risk'],
    seating_options: ['planar_seating_basic', 'contoured_seating_postural', 'custom_molded_seating_severe_postural_needs'],
    funding: 'medical_necessity_letter_funding_authorization_through_MOH_or_insurance_K0005_with_KX_modifier',
    follow_up: 'wheelchair_seating_clinic_Q6_to_12_months_for_growth_or_postural_change',
    citation: CITATIONS.AOTA_ADL,
  };
}

function splintingIndications(input) {
  const { joint_to_splint, condition_indication, tone_spasticity_or_weakness, goal_protect_position_function, time_since_injury, skin_integrity, prior_splint_response, schedule_wear } = input;
  let splint_type = 'resting_hand_splint_in_intrinsic_plus_position';
  if (goal_protect_position_function === 'protect') splint_type = 'resting_hand_splint_to_prevent_contracture_and_skin_breakdown';
  if (goal_protect_position_function === 'position') splint_type = 'anti_spasticity_positioning_splint_with_wrist_neutral_mcp_30_degrees_IP_extension';
  if (goal_protect_position_function === 'function') splint_type = 'functional_orthosis_thumb_opponens_or_finger_extension_assist';
  return {
    splint_type,
    wear_schedule: schedule_wear + '_hours_per_day_or_night_only_per_prescription',
    fabrication: 'thermoplastic_low_temp_per_custom_molding_with_straps_padded_to_avoid_pressure_injury',
    skin_check: 'check_skin_Q2h_initial_then_Q4h_with_redness_resolving_within_20_min_after_removal_acceptable',
    monitoring: 'ROM_Q2_weeks_skin_integrity_Q_session_function_Q4_weeks',
    citation: CITATIONS.ASHT_HAND,
  };
}

module.exports = { adlAssessmentAndTraining, fineMotorRehab, handTherapyProtocols, wheelchairPrescription, splintingIndications, CITATIONS, ValidationError };