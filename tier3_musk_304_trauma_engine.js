/**
 * TIER3_MUSK-304 Orthopaedic Trauma Engine
 * Geriatric hip fracture + Gustilo open fracture + polytrauma triage + compartment syndrome + damage control ortho
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAOS_TRAUMA: 'AAOS Trauma 2024', OTA: 'OTA 2024', BOAST: 'BOAST Guidelines' };

function geriatricHipFracture(input) {
  const { age, fracture_type, preoperative_time_hours, mobility, asa_class, frailty } = input;
  const surgery_indicated = age >= 65;
  const surgical_urgency = preoperative_time_hours >= 24 ? 'urgent_within_24h_to_reduce_mortality' : 'standard_pathway';
  return {
    surgery_indicated, surgical_urgency,
    procedure: fracture_type === 'displaced_intracapsular_femoral_neck' ? 'hemiarthroplasty_or_total_hip' : 'intramedullary_nail_or_DHS_or_cannulated_screws',
    optimization: ['med_clearance', 'blood_pressure_stabilization', 'vitamin_d_loaded_pre_operative', 'pain_pre_operative_block_FICB'],
    time_to_surgery_target_hours: 24,
    citation: CITATIONS.BOAST,
  };
}

function openFractureClass(input) {
  const { skin_wound_cm, contamination, soft_tissue_loss, vascular_injury, bone_loss } = input;
  let gustilo = 'I';
  if (skin_wound_cm > 10 || vascular_injury) gustilo = 'IIIC';
  else if (skin_wound_cm >= 1 && contamination === 'significant' && soft_tissue_loss) gustilo = 'IIIB';
  else if (skin_wound_cm >= 1 || contamination) gustilo = 'IIIA';
  else if (skin_wound_cm < 1) gustilo = 'I';
  return {
    gustilo_grade: gustilo,
    antibiotic_protocol: gustilo === 'I' || gustilo === 'IIIA' ? 'cefazolin_2g_IV_Q8h_x_24h' : 'cefazolin_2g_IV_Q8h_plus_gentamicin_x_72h',
    irrigation_solution: '3L_NSS_with_pulsatile_lavage_for_type_II',
    surgical_timing: gustilo === 'IIIC' ? 'urgent_to_salvage_within_6_to_24h' : 'within_24h',
    fixation: gustilo === 'IIIC' ? 'external_fixation_initial_then_definitive' : 'definitive_internal_fixation',
    citation: CITATIONS.OTA,
  };
}

function polytraumaTriage(input) {
  const { age, injury_severity_score, hemodynamic_status, head_injury_severity, lactate, coagulopathy, hypothermia } = input;
  let triage = 'standard_workup_then_surgery';
  if (hemodynamic_status === 'unstable' || lactate >= 4 || coagulopathy === 'present' || hypothermia) triage = 'damage_control_ortho';
  if (head_injury_severity === 'severe_GCS_8_or_less' && hemodynamic_status === 'unstable') triage = 'simultaneous_neurosurgery_and_ortho_trauma';
  return {
    iss, hemodynamic_status, lactate, coagulopathy,
    triage_plan: triage,
    definitive_surgery: triage === 'damage_control_ortho' ? 'within_5_to_10_days_after_physiologic_normalization' : 'as_soon_as_safe',
    citation: CITATIONS.OTA,
  };
}

function compartmentSyndrome(input) {
  const { pain_out_of_proportion, pain_passive_stretch, tenseness, nerve_deficit, delta_p_mmhg, pressure_mmhg } = input;
  const clinical = pain_out_of_proportion && pain_passive_stretch && tenseness;
  return {
    clinical_diagnosis: clinical, pressure_mmhg, delta_p_mmhg,
    indication_for_fasciotomy: clinical || pressure_mmhg >= 30 || delta_p_mmhg < 30,
    procedure: 'urgent_2_incision_fasciotomy_within_6h_essential_for_viability',
    contraindications: ['resolved_compartment_syndrome_Q24h_then_no_fasciotomy'],
    citation: CITATIONS.AAOS_TRAUMA,
  };
}

function damageControlOrtho(input) {
  const { injury_pattern, hemodynamic, lactate, immunocompromised } = input;
  return {
    damage_control_indicated: hemodynamic === 'borderline_or_unstable' || lactate >= 4,
    external_fixation_first: ['tibia_pilon_fracture', 'pelvic_ring_disruption', 'femoral_shaft_with_severe_soft_tissue_loss'].includes(injury_pattern),
    conversion_to_definitive: 'Q5_to_14_days_once_physiologic_parameters_normalize',
    citation: CITATIONS.OTA,
  };
}

module.exports = { geriatricHipFracture, openFractureClass, polytraumaTriage, compartmentSyndrome, damageControlOrtho, CITATIONS, ValidationError };