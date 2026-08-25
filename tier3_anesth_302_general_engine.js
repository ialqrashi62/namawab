/**
 * TIER3_ANESTH-302 General Anesthesia Engine
 * ASA classification + Mallampati airway + MAC calculation + Difficult airway prediction (MOANS) + Anesthesia depth monitoring (BIS)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASA: 'ASA Physical Status 2024', ABA: 'ABA Difficult Airway Algorithm 2023' };

function asaPhysicalStatus(input) {
  const { systemic_disease_severity, functional_status, emergency_surgery, moribund_status, brain_death_organ_donor } = input;
  let classification = 'class_1_normal_healthy_patient';
  if (moribund_status === 'yes') classification = 'class_5_moribund_patient_not_expected_to_survive_without_operation';
  else if (brain_death_organ_donor === 'yes') classification = 'class_6_brain_dead_organ_donor';
  else if (systemic_disease_severity === 'severe_with_constant_threat_to_life') classification = 'class_4_severe_systemic_disease';
  else if (systemic_disease_severity === 'moderate_with_definite_functional_limit') classification = 'class_3_moderate_systemic_disease';
  else if (systemic_disease_severity === 'mild_no_functional_limit') classification = 'class_2_mild_systemic_disease';
  if (emergency_surgery === 'yes') classification = classification + '_E_for_emergency';
  return {
    classification, functional_status,
    mortality_estimate: classification.startsWith('class_5') ? 'high_mortality' : classification.startsWith('class_4') ? 'significant_mortality' : 'low_mortality',
    anesthesia_implication: classification.startsWith('class_4') || classification.startsWith('class_5') ? 'consider_postop_ICU_blood_products_prepared_invasive_monitoring' : 'standard_monitoring_appropriate',
    citation: CITATIONS.ASA,
  };
}

function mallampatiAirway(input) {
  const { uvula_visible, soft_palate_visible, faucial_pillars_visible, only_hard_palate } = input;
  let class_number = 0;
  if (uvula_visible === 'yes' && soft_palate_visible === 'yes' && faucial_pillars_visible === 'yes') class_number = 1;
  else if (uvula_visible === 'yes' && soft_palate_visible === 'yes' && faucial_pillars_visible === 'no') class_number = 2;
  else if (soft_palate_visible === 'yes' && uvula_visible === 'no') class_number = 3;
  else if (only_hard_palate === 'yes') class_number = 4;
  return {
    mallampati_class: class_number,
    difficult_intubation_risk: class_number >= 3 ? 'high_risk_for_difficult_intubation' : 'low_to_moderate_risk',
    preoxygenation_recommendation: class_number >= 3 ? 'preoxygenate_3_minutes_high_flow_NC_and_NRB_simultaneously' : 'standard_3_minute_preoxygenation',
    citation: CITATIONS.ABA,
  };
}

function macCalculation(input) {
  const { age_years, weight_kg, height_cm, sex, agent } = input;
  let mac_value = 0;
  if (agent === 'sevoflurane') mac_value = 2.0;
  else if (agent === 'desflurane') mac_value = 6.0;
  else if (agent === 'isoflurane') mac_value = 1.15;
  else if (agent === 'nitrous_oxide') mac_value = 1.04;
  else if (agent === 'propofol') mac_value = 1.0;
  const adjusted_mac = age_years >= 65 ? mac_value * 0.85 : age_years <= 12 ? mac_value * 1.1 : mac_value;
  return {
    age_years, weight_kg, sex, agent, base_mac: mac_value, age_adjusted_mac: adjusted_mac.toFixed(2),
    target_end_tidal_agent_pct: (adjusted_mac * 100).toFixed(1),
    age_adjustment_note: age_years >= 65 ? 'reduced_mac_due_to_increased_sensitivity_with_age' : age_years <= 12 ? 'slightly_increased_mac_due_to_lower_sensitivity_in_pediatrics' : 'standard_mac_appropriate',
    citation: CITATIONS.ASA,
  };
}

function difficultAirwayMoans(input) {
  const { mask_ventilation_difficult, obstruction_or_obesity, aged_55_or_above, neck_mobility_limited, surgical_history_airway } = input;
  const score = [mask_ventilation_difficult === 'yes', obstruction_or_obesity === 'yes', aged_55_or_above === 'yes', neck_mobility_limited === 'yes', surgical_history_airway === 'yes'].filter(Boolean).length;
  let interpretation = 'low_risk_easy_mask_ventilation';
  if (score >= 3) interpretation = 'high_risk_difficult_mask_ventilation';
  else if (score >= 1) interpretation = 'moderate_risk_prepare_backup_plans';
  return {
    moans_score: score, interpretation,
    preparation: score >= 3 ? ['preoxygenate_extended', 'prepare_video_laryngoscope', 'prepare_fiberoptic_bronchoscope', 'supraglottic_airway_as_backup', 'surgical_airway_kit_ready'] : 'standard_preparation',
    citation: CITATIONS.ABA,
  };
}

function bisAnesthesiaDepth(input) {
  const { bis_value, et_agent_pct, patient_movement, hemodynamics } = input;
  let interpretation = 'unknown_depth';
  if (bis_value >= 95) interpretation = 'awake_fully_conscious';
  else if (bis_value >= 80) interpretation = 'light_sedation';
  else if (bis_value >= 60) interpretation = 'general_anesthesia_optimal_range';
  else if (bis_value >= 40) interpretation = 'deep_hypnosis_burst_suppression_possible';
  else if (bis_value < 20) interpretation = 'overdose_severe_suppression_flatline_EEG';
  else if (bis_value >= 60 && bis_value <= 80) interpretation = 'optimal_surgical_anesthesia';
  return {
    bis_value, interpretation,
    titration: bis_value >= 60 && bis_value <= 80 ? 'maintain_current_agent_concentration' : bis_value > 80 ? 'increase_anesthetic_depth' : 'decrease_anesthetic_depth',
    awareness_risk: bis_value > 60 ? 'increased_risk_of_intraoperative_awareness_with_paralysis' : 'low_awareness_risk',
    citation: CITATIONS.ASA,
  };
}

module.exports = { asaPhysicalStatus, mallampatiAirway, macCalculation, difficultAirwayMoans, bisAnesthesiaDepth, CITATIONS, ValidationError };