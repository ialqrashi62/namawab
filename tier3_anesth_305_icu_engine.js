/**
 * TIER3_ANESTH-305 Critical Care Sedation Engine
 * RASS sedation assessment + CAM-ICU delirium + SAT/SBT weaning protocol + Propofol/Fentanyl titration + ICP management
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { SCCM: 'SCCM Pain Agitation Delirium 2024', BTF: 'Brain Trauma Foundation 2016' };

function rassSedationScale(input) {
  const { eye_contact_duration, body_movement, eye_opening_to_voice, voice_volume_response, physical_stimulation_response } = input;
  let score = 0;
  if (physical_stimulation_response === 'no_response') score = -5;
  else if (voice_volume_response === 'no_response' && physical_stimulation_response === 'any_movement') score = -4;
  else if (voice_volume_response === 'eyes_open_no_eye_contact') score = -3;
  else if (voice_volume_response === 'briefly_eye_contact') score = -2;
  else if (voice_volume_response === 'eye_contact_sustained') score = -1;
  else if (eye_contact_duration === 'spontaneous_normal_movement') score = 0;
  else if (body_movement === 'anxious_but_calm') score = 1;
  else if (body_movement === 'frequent_nonpurposeful') score = 2;
  else if (body_movement === 'pulls_or_removes_tubes') score = 3;
  else if (body_movement === 'combative_violent') score = 4;
  return {
    rass_score: score,
    target_range: score >= -2 && score <= 1 ? 'within_target_light_sedation_optimal' : 'outside_target',
    titration: score >= 1 ? 'increase_sedation_consider_bolus_and_infusion_increase' : score <= -3 ? 'decrease_sedation_consider_bolus_reduction_or_holding' : 'maintain_current',
    citation: CITATIONS.SCCM,
  };
}

function camIcuDelirium(input) {
  const { acute_change_fluctuating, inattention, altered_consciousness, disorganized_thinking } = input;
  const feature1 = acute_change_fluctuating === 'yes';
  const feature2 = inattention === 'yes';
  const feature3 = altered_consciousness === 'yes';
  const feature4 = disorganized_thinking === 'yes';
  const cam_positive = feature1 && feature2 && (feature3 || feature4);
  return {
    cam_result: cam_positive ? 'positive_delirium' : 'negative_no_delirium',
    subtype: feature3 && !feature4 ? 'hypoactive_delirium' : !feature3 && feature4 ? 'hyperactive_delirium' : 'mixed_or_neither',
    features: { acute_change_fluctuating: feature1, inattention: feature2, altered_consciousness: feature3, disorganized_thinking: feature4 },
    management: cam_positive ? ['identify_and_treat_underlying_cause', 'review_medications_anticholinergic_benzodiazepine_opioid', 'non_pharmacologic_interventions_reorientation_sleep_wake_cycle_early_mobility', 'consider_typical_antipsychotic_or_dexmedetomidine'] : 'continue_monitoring_with_daily_CAM_ICU',
    citation: CITATIONS.SCCM,
  };
}

function satSbtWeaning(input) {
  const { sat_passed, sbt_passed, etiology_resolved, vasopressor_requirement, spo2_pct, fio2_pct, peep_cm_h2o, mental_status_appropriate } = input;
  const sat_criteria = sat_passed === 'yes' && etiology_resolved === 'yes' && vasopressor_requirement === 'low_or_none' && spo2_pct >= 90 && fio2_pct <= 50 && peep_cm_h2o <= 8;
  const sbt_criteria = sbt_passed === 'yes' && mental_status_appropriate === 'yes' && spo2_pct >= 90;
  let decision = 'continue_full_support';
  if (sat_criteria && sbt_criteria) decision = 'ready_for_extubation';
  else if (sat_criteria && !sbt_criteria) decision = 'continue_sbt_preparation';
  else if (!sat_criteria) decision = 'continue_full_support_address_barriers';
  return {
    sat_criteria_met: sat_criteria, sbt_criteria_met: sbt_criteria, decision,
    sat_failure_reasons: sat_criteria ? 'none' : ['agitation_or_anxiety', 'respiratory_distress', 'spo2_below_90', 'vasopressor_requirement_too_high', 'mental_status_inappropriate'],
    sbt_failure_reasons: sbt_criteria ? 'none' : ['tachypnea_or_respiratory_distress', 'spo2_below_90', 'hemodynamic_instability', 'altered_mental_status'],
    citation: CITATIONS.SCCM,
  };
}

function propofolFentanylTitration(input) {
  const { rass_score, current_dose_mcg_kg_min, weight_kg, drug } = input;
  let new_dose = current_dose_mcg_kg_min;
  let action = 'maintain_current';
  if (rass_score > 1) { new_dose = current_dose_mcg_kg_min * 1.25; action = 'increase_dose_by_25_percent'; }
  else if (rass_score < -3) { new_dose = current_dose_mcg_kg_min * 0.75; action = 'decrease_dose_by_25_percent'; }
  else if (rass_score >= -2 && rass_score <= 0) { action = 'maintain_target_optimal'; }
  return {
    drug, rass_score, current_dose_mcg_kg_min, new_dose_mcg_kg_min: new_dose.toFixed(1),
    weight_kg, total_dose_mcg_min: (new_dose * weight_kg).toFixed(0),
    action, monitoring: 'titrate_Q15min_until_rass_within_target_then_Q1h',
    citation: CITATIONS.SCCM,
  };
}

function icpManagement(input) {
  const { icp_mmhg, cpp_mmhg, gcs_score, brain_herniation_signs } = input;
  let intervention = 'maintain_normal_parameters';
  if (icp_mmhg >= 22) intervention = 'urgent_intervention_to_lower_icp';
  else if (cpp_mmhg < 60) intervention = 'increase_map_to_achieve_cpp_60_to_70';
  else if (brain_herniation_signs === 'yes') intervention = 'hyperventilation_osmotic_therapy_emergent_CT_then_consider_decompressive_craniectomy';
  return {
    icp_mmhg, cpp_mmhg, gcs_score, brain_herniation_signs,
    intervention,
    tier1_interventions: ['elevate_head_of_bed_30_degrees', 'maintain_cerebral_perfusion_pressure_60_to_70', 'osmotic_therapy_mannitol_or_hypertonic_saline', 'sedation_analgesia', 'normothermia', 'normocapnia_paco_2_35_to_40'],
    tier2_interventions: ['neuromuscular_blockade', 'hyperventilation_short_term_only_to_paco_2_30_to_35', 'barbiturate_coma_if_refractory', 'decompressive_craniectomy_for_refractory'],
    citation: CITATIONS.BTF,
  };
}

module.exports = { rassSedationScale, camIcuDelirium, satSbtWeaning, propofolFentanylTitration, icpManagement, CITATIONS, ValidationError };