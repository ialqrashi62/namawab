/**
 * TIER3_MUSK-305 Hand & Microvascular Engine
 * Tendon injury (Tinel/Mallet) + nerve injury (Sunderland) + replantation + zone of injury + compartment syndrome + Dupuytren
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASSH: 'ASSH Hand 2024', AAHS: 'AAHS Hand Society 2024' };

function zoneOfInjury(input) {
  const { finger, anatomy } = input;
  const flexor_zones = { thumb: { I: 'distal_to_IP', II: 'proximal_to_IP_to_TMJ', III: 'TMJ_to_distal_transverse_arch', IV: 'within_thenar', V: 'proximal_to_thenar' }, finger: { I: 'distal_to_FDS', II: 'FDS_to_distal_palm', III: 'palm', IV: 'within_tunnel_to_proximal_palm', V: 'proximal_to_FDS_origin' } };
  const extensor_zones = { thumb: { T1: 'IF', T2: 'IF_MCP', T3: 'MCP', T4: 'MCP_CMC', T5: 'CMC' }, finger: { E1: 'distal_to_PIP', E2: 'PIP', E3: 'PIP_MCP', E4: 'MCP', E5: 'MCP', E6: 'metacarpal', E7: 'wrist', E8: 'distal_forearm' } };
  return { flexor_zones: flexor_zones[finger], extensor_zones: extensor_zones[finger], anatomy, citation: CITATIONS.ASSH };
}

function tendonTietelClassification(input) {
  const { finger_extensor, laceration_location } = input;
  return { zone: laceration_location, repair_technique: 'figure_of_eight_horizontal_mattress_with_4_strand_core_suture_then_6_0_running_epitendinous', post_op_protocol: 'active_motion_protocol_3_to_5_days_post_op', citation: CITATIONS.ASSH };
}

function sunderlandNerveInjury(input) {
  const { nerve, motor_function_loss, sensory_loss, tinel_sign, advancing } = input;
  let grade = 'I_neurapraxia';
  if (motor_function_loss === 'complete' && sensory_loss === 'complete' && tinel_sign === 'positive' && advancing === 'no') grade = 'V_transection';
  else if (motor_function_loss === 'complete' && tinel_sign === 'positive') grade = 'IV_neurotemesis_with_scarring';
  else if (motor_function_loss === 'partial' && tinel_sign === 'positive') grade = 'II_axonotmesis';
  return { grade, surgical_indicated: ['IV_neurotemesis_with_scarring', 'V_transection'].includes(grade), timing: grade === 'V_transection' ? 'urgent_repair_within_72h' : 'wait_then_reassess_Q3M', citation: CITATIONS.ASSH };
}

function replantationDecision(input) {
  const { amputation_level, ischemia_time_warm_hours, ischemia_time_cold_hours, age, comorbidity, digit_vs_limb, clean_vs_crushed } = input;
  const warm_ischemia_too_long = ischemia_time_warm_hours >= 6;
  let indication = 'attempt_replantation';
  if (warm_ischemia_too_long && clean_vs_crushed === 'crushed') indication = 'contraindicated';
  if (comorbidity === 'severe' && age >= 70) indication = 'discuss_with_patient_relative_vs_prosthetic';
  if (digit_vs_limb === 'multiple_digits' && ischemia_time_warm_hours <= 6) indication = 'strong_indications';
  return { indication, ischemia_time_cold_hours, age, comorbidity, recommended_approach: indication === 'attempt_replantation' ? 'revascularization_then_tendon_and_nerve_repair' : 'revision_amputation_with_optimal_stump', citation: CITATIONS.AAHS };
}

function compartmentSyndrome(input) {
  const { pain_out_of_proportion, pain_passive_stretch, tenseness, nerve_deficit, delta_p, compartment_pressure_mmhg } = input;
  const clinical_diagnosis = pain_out_of_proportion && pain_passive_stretch && tenseness;
  const diastolic_delta = delta_p ? delta_p < 30 : false;
  return {
    clinical_diagnosis, diagnostic_compartment_pressure_mmhg: compartment_pressure_mmhg,
    delta_p_mmhg: delta_p, indication_for_fasciotomy: clinical_diagnosis || compartment_pressure_mmhg >= 30 || diastolic_delta,
    procedure: 'urgent_2_incision_fasciotomy_within_6h',
    closure_timing: 'delayed_primary_closure_Q7_to_10_days',
    citation: CITATIONS.ASSH,
  };
}

function dupuytrenContracture(input) {
  const { cord_present, mp_joint_affected, pip_joint_affected, function_limitations, severity } = input;
  let surgery = 'observation_per_hand_therapy';
  if (mp_joint_affected && severity >= 30 && function_limitations) surgery = 'needle_aponeurotomy_if_primary';
  if (pip_joint_affected && severity >= 30) surgery = 'limited_fasciectomy_for_pip_involvement';
  return {
    cord_present, mp_joint_affected, pip_joint_affected, severity,
    surgery_recommended: surgery,
    alternatives: ['collagenase_clostridial_injection_for_primary', 'needle_aponeurotomy_NA'],
    citation: CITATIONS.AAHS,
  };
}

module.exports = { zoneOfInjury, tendonTietelClassification, sunderlandNerveInjury, replantationDecision, compartmentSyndrome, dupuytrenContracture, CITATIONS, ValidationError };