/**
 * TIER3_DERM-305 Mohs / Cutaneous Surgery Engine
 * Mohs surgery indications + Mohs stages + Wound reconstruction options + Local anesthesia dosing + Surgical complication management
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACMS: 'American College of Mohs Surgery 2024', AAD_SURG: 'AAD Surgery 2024' };

function mohsSurgeryIndications(input) {
  const { tumor_type, location_high_risk, recurrent, immunosuppression, perineural_invasion, histologic_subtype } = input;
  let mohs_indicated = false;
  if (location_high_risk === 'yes' || recurrent === 'yes' || histologic_subtype === 'infiltrative_morpheaform_micronodular' || immunosuppression === 'yes' || perineural_invasion === 'yes') mohs_indicated = true;
  return {
    mohs_indicated, tumor_type, location_high_risk, recurrent,
    reasons_list: ['high_risk_anatomic_location_H_zone_or_M_site', 'recurrent_tumor', 'aggressive_histology', 'perineural_invasion', 'immunosuppression'],
    alternative_for_non_mohs: 'standard_wide_local_excision_with_predefined_margins_or_electrodessication_and_curettage_for_low_risk_primary_BCC_or_SCC',
    citation: CITATIONS.ACMS,
  };
}

function mohsStagesPlanning(input) {
  const { lesion_size_cm, depth_estimated, anticipated_stages } = input;
  let total_repair_size = 'expected_2_to_3_stages_for_typical_skin_cancer';
  if (lesion_size_cm >= 3) total_repair_size = 'expect_larger_defect_and_more_extensive_reconstruction';
  return {
    lesion_size_cm, anticipated_stages: anticipated_stages || 2,
    pre_procedure: ['informed_consent_with_risks_benefits', 'photographs_for_medical_record', 'mark_surgical_landmarks_with_patient_upright'],
    intra_procedure: ['local_anesthesia_lidocaine_with_epinephrine', 'tangential_excision_of_visible_tumor_layer_1', 'map_tissue_and_process_for_frozen_sections', 'analyze_margins_and_return_to_positive_area_until_clear', 'final_repair_with_optimal_reconstruction'],
    expected_repair_size: total_repair_size,
    citation: CITATIONS.ACMS,
  };
}

function woundReconstructionOptions(input) {
  const { defect_size_cm, defect_location, depth, surrounding_skin_quality, patient_factors } = input;
  let reconstruction = 'primary_closure';
  if (defect_size_cm >= 1 && depth === 'subcutaneous') {
    if (defect_location === 'face_or_ear' || defect_location === 'high_cosmetic_area') reconstruction = 'local_flap_advancement_rotation_or_transposition';
    else reconstruction = 'linear_closure_or_second_intention_healing';
  }
  if (defect_size_cm >= 3 || depth === 'deep_with_exposed_bone_tendon') reconstruction = 'skin_graft_or_complex_flap';
  return {
    reconstruction, defect_size_cm, defect_location, depth,
    healing_options: { primary_closure: 'elliptical_excision_with_side_to_side_closure', secondary_intention: 'allow_granulation_works_well_for_concave_areas', skin_graft: 'split_or_full_thickness_from_donor_site', local_flap: 'advancement_rotation_transposition_based_on_defect_shape', regional_flap: 'for_larger_defects_or_specialized_locations' },
    patient_factors, citation: CITATIONS.AAD_SURG,
  };
}

function localAnesthesiaDosing(input) {
  const { weight_kg, lidocaine_with_epinephrine, maximum_dose_mg_per_kg } = input;
  let max_dose = 7; // lidocaine_with_epinephrine
  let max_total = max_dose * weight_kg;
  return {
    weight_kg, max_total_mg: max_total, max_volume_ml_1pct: (max_total / 10).toFixed(2), max_volume_ml_2pct: (max_total / 20).toFixed(2),
    note: 'plain_lidocaine_max_4.5mg_per_kg_lidocaine_with_epinephrine_max_7mg_per_kg',
    safety: 'consider_benzodiazepine_premedication_for_anxious_patients',
    monitoring: 'observe_for_signs_of_toxicity_tinnitus_metallic_taste_perioral_numbness_seizure_cardiac_arrest',
    citation: CITATIONS.AAD_SURG,
  };
}

function surgicalComplicationManagement(input) {
  const { hematoma, infection, dehiscence, flap_necrosis, nerve_damage, post_op_days } = input;
  let action = 'standard_postop_care_Q1_day_Q1_week_Q2_weeks';
  if (hematoma === 'expanding' || flap_necrosis === 'yes' || nerve_damage === 'motor_or_major_sensory') action = 'urgent_surgeon_consultation_for_evaluation_and_potential_intervention';
  else if (infection === 'yes' || dehiscence === 'significant') action = 'open_wound_culture_then_antibiotics_wound_care_specialty_consultation';
  return {
    action, complications: { hematoma, infection, dehiscence, flap_necrosis, nerve_damage }, post_op_days,
    prevention: ['metic_hemostasis', 'gentle_tissue_handling', 'appropriate_wound_closure_without_tension', 'sterile_technique', 'post_op_wound_care_instructions'],
    citation: CITATIONS.AAD_SURG,
  };
}

module.exports = { mohsSurgeryIndications, mohsStagesPlanning, woundReconstructionOptions, localAnesthesiaDosing, surgicalComplicationManagement, CITATIONS, ValidationError };