/**
 * TIER3_ER-301 Adult Trauma Engine
 * ATLS primary/secondary survey + Glasgow Coma Scale + Trauma team activation criteria + Hemorrhagic shock classification + Damage control resuscitation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ATLS: 'ATLS 10th Edition 2018', EAST: 'EAST Practice Guidelines 2024' };

function glasgowComaScale(input) {
  const { eye_response, verbal_response, motor_response } = input;
  const total = eye_response + verbal_response + motor_response;
  let severity = 'mild_brain_injury';
  if (total < 9) severity = 'severe_brain_injury_intubate_consider_ICP_monitoring';
  else if (total < 13) severity = 'moderate_brain_injury';
  return {
    gcs_total: total, eye_response, verbal_response, motor_response, severity,
    intubation_indicated: total <= 8 ? 'yes_airway_protection_needed' : 'consider_clinical_judgment',
    next_step: severity === 'severe_brain_injury_intubate_consider_ICP_monitoring' ? 'intubation_neuro_CT_head_neurosurgery_consultation' : 'continue_observation_reassess_Q1h',
    citation: CITATIONS.ATLS,
  };
}

function traumaTeamActivation(input) {
  const { mechanism, vital_signs_abnormal, anatomical_injury, gcs_score, airway_status, hemodynamics_unstable } = input;
  const mechanism_high_risk = ['high_speed_motor_vehicle_collision', 'pedestrian_vs_vehicle', 'fall_gt_20_feet', 'gunshot_wound', 'stabbing_with_hemodynamic_instability', 'explosion_burns_gt_30_percent'].includes(mechanism);
  const activation = (mechanism_high_risk || vital_signs_abnormal === 'yes' || anatomical_injury === 'yes' || gcs_score < 9 || airway_status === 'unprotected' || hemodynamics_unstable === 'yes') ? 'full_trauma_team_activATION' : 'standard_trauma_response';
  return {
    activation_level: activation,
    team_composition: activation === 'full_trauma_team_activATION' ? ['trauma_surgeon', 'emergency_physician', 'anesthesiologist', 'nurses_x2', 'respiratory_therapist', 'social_worker'] : ['trauma_surgeon_consultation', 'emergency_physician', 'nurse'],
    immediate_actions: activation === 'full_trauma_team_activATION' ? ['ABCs_primary_survey', 'simultaneous_resuscitation', 'FAST_or_DPL', 'prepare_for_OT'] : 'standard_primary_survey',
    citation: CITATIONS.ATLS,
  };
}

function hemorrhagicShockClassification(input) {
  const { blood_loss_pct, heart_rate_bpm, systolic_bp_mmhg, pulse_pressure_mmhg, mental_status, urine_output_ml_h } = input;
  let classification = 'class_IV_severe_shock';
  if (blood_loss_pct < 15) classification = 'class_I_minimal_blood_loss';
  else if (blood_loss_pct < 30) classification = 'class_II_mild_shock';
  else if (blood_loss_pct < 40) classification = 'class_III_moderate_shock';
  return {
    classification, blood_loss_pct_estimate: blood_loss_pct,
    fluid_resuscitation: classification === 'class_I_minimal_blood_loss' ? 'observation_crystalloid_prn' : classification === 'class_II_mild_shock' ? 'crystalloid_1L_then_reassess' : classification === 'class_III_moderate_shock' ? 'initiate_MTP_massive_transfusion_protocol' : 'MTP_immediately_OT_or_IR',
    blood_product_ratio: classification === 'class_III_moderate_shock' || classification === 'class_IV_severe_shock' ? '1_PRBC_to_1_FFP_to_1_platelets' : 'consider',
    mental_status, urine_output_ml_h, heart_rate_bpm, systolic_bp_mmhg, citation: CITATIONS.ATLS,
  };
}

function primarySecondarySurvey(input) {
  const { airway_status, breathing_status, circulation_status, disability, exposure_findings, secondary_survey_findings } = input;
  let critical_actions = [];
  if (airway_status !== 'patent_with_cervical_spine_control') critical_actions.push('establish_define_airway_intubation_or_surgical_airway_with_cervical_spine_protection');
  if (breathing_status === 'compromised') critical_actions.push('tension_pneumothorax_decompression_chest_tube_for_pneumothorax_or_hemothorax');
  if (circulation_status === 'unstable') critical_actions.push('control_external_hemorrhage_pressure_then_tourniquet_then_hemostatic_dressing_then_IV_access_x2_fluid_resuscitation_then_blood_products');
  if (disability === 'severe') critical_actions.push('intubate_for_GCS_less_than_or_equal_to_8');
  critical_actions.push('expose_full_examination_then_warm_blankets_prevent_hypothermia');
  critical_actions.push('secondary_survey_head_to_toe_AMPLE_history_allergies_medications_past_medical_pregnancy_last_meal_events');
  return {
    primary_survey_summary: { airway: airway_status, breathing: breathing_status, circulation: circulation_status, disability, exposure: exposure_findings },
    critical_actions, secondary_survey: secondary_survey_findings,
    next_phase: critical_actions.length > 0 ? 'definitive_care_imaging_labs_intervention' : 'definitive_care_imaging_OT_or_discharge',
    citation: CITATIONS.ATLS,
  };
}

function damageControlResuscitation(input) {
  const { injury_type, hemodynamics, coagulopathy_signs, temperature_celsius, ph_level } = input;
  const damage_control_indicated = (hemodynamics === 'unstable' || coagulopathy_signs === 'yes' || (temperature_celsius && temperature_celsius < 35) || (ph_level && ph_level < 7.2)) && injury_type === 'severe_trauma';
  return {
    damage_control_indicated,
    components: damage_control_indicated ? ['hemostatic_resuscitation_1_to_1_to_1_ratio_PRBC_FFP_platelets', 'permissive_hypotension_SBP_80_to_90_in_penetrating_trauma_until_hemostasis', 'damage_control_surgery_abbreviated_laparotomy_then_ICU_then_relook', 'TXA_within_3h_of_injury', 'prevent_hypothermia_warm_fluids_warm_environment', 'prevent_acidosis_early_hemorrhage_control'] : ['proceed_with_definitive_repair'],
    citation: CITATIONS.EAST,
  };
}

module.exports = { glasgowComaScale, traumaTeamActivation, hemorrhagicShockClassification, primarySecondarySurvey, damageControlResuscitation, CITATIONS, ValidationError };