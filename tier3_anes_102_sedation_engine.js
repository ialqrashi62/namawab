/**
 * TIER3_ANES-102 Procedural Sedation Engine
 * Moderate sedation + Deep sedation + Pediatric sedation + Capnography + Reversal agents
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASA_SEDATION: 'ASA Procedural Sedation 2024', AAP_PEDS_SEDATION: 'AAP Pediatric Sedation 2024' };

function moderateSedation(input) {
  const { procedure_type, duration_estimate_min, patient_age, fasting_status_npo, asa_class, airway_assessment_mallampati, comorbidities, recent_food_intake, patient_consent, monitoring_available } = input;
  let plan = 'moderate_sedation_with_midazolam_2_to_5mg_IV_titrated_plus_fentanyl_25_to_100mcg_IV_titrated_per_anesthesia_provider';
  if (patient_age >= 65) plan = 'reduce_dose_by_30_to_50pct_for_elderly_with_slower_titration_and_reduced_combination';
  if (asa_class === 'III' || asa_class === 'IV') plan = plan + '_with_anesthesia_provider_directed_sedation_due_to_higher_risk';
  if (airway_assessment_mallampati === 'III_or_IV') plan = 'consider_anesthesia_consult_for_difficult_airway_during_sedation_with_backup_plan';
  return {
    plan,
    monitoring: 'continuous_pulse_ox_capnography_Q5min_BP_Q5min_RR_Q5min_consciousness_level_Q5min_with_dedicated_sedation_provider_NOT_procedure_performer',
    discharge_criteria: 'alert_oriented_baseline_vital_signs_ambulate_without_significant_dizziness_with_companion_for_discharge_pain_nausea_controlled',
    reversal: 'flumazenil_for_benzodiazepine_reversal_0.2mg_IV_Q1min_max_1mg_then_continue_monitoring_for_resedation_60_to_90_min',
    citation: CITATIONS.ASA_SEDATION,
  };
}

function deepSedation(input) {
  const { procedure_type, propofol_use_planned, ketamine_use_planned, airway_management_planned, provider_credentials, reversal_agents_available, monitoring_capnography, fasting_status } = input;
  let plan = 'deep_sedation_with_propofol_50_to_150mcg_per_kg_per_min_with_anesthesia_provider_or_specially_credentialed_provider_per_institutional_policy';
  if (ketamine_use_planned === 'yes') plan = plan + '_ketamine_1_to_2mg_per_kg_IV_with_benzodiazepine_for_emergence_reactions_and_atropine_for_hypersalivation';
  if (airway_management_planned === 'no_intubation') plan = plan + '_with_continuous_capnography_and_bag_valve_mask_at_bedside_for_rescue';
  return {
    plan,
    monitoring: 'continuous_pulse_ox_capnography_BP_Q5min_ECG_continuous_temperature_with_anesthesia_provider_present_throughout',
    propofol_safety: 'avoid_prolonged_high_dose_infusions_above_80mcg_per_kg_per_min_in_critically_ill_to_avoid_propofol_infusion_syndrome_with_lactic_acidosis_rhabdo',
    reversal: ['flumazenil_for_benzodiazepine', 'naloxone_0.04_to_0.4mg_IV_for_opioid_reversal_with_titration_to_respiratory_status_not_full_consciousness_to_avoid_withdrawal_pain'],
    citation: CITATIONS.ASA_SEDATION,
  };
}

function pediatricSedation(input) {
  const { age_years, weight_kg, procedure_type, child_anxiety, parental_anxiety, fasting_status_npo_hours, asa_class, airway, prior_sedation_history, sedation_route } = input;
  let plan = 'pediatric_sedation_with_age_weight_dose_per_protocol_with_parental_presence_for_anxiolysis_in_young_children';
  if (age_years < 3) plan = 'infant_sedation_with_pediatric_anesthesia_provider_due_to_higher_risk_airway_obstruction';
  if (age_years >= 3 && age_years < 10) plan = 'pediatric_sedation_with_midazolam_oral_0.5mg_per_kg_max_15mg_with_nitrous_oxide_30_to_50pct_if_available_for_anxiolysis';
  if (age_years >= 10) plan = 'pediatric_sedation_per_adult_protocol_with_dose_adjustment_per_weight';
  if (fasting_status_npo_hours < 6) plan = 'delay_procedure_for_solids_2_to_3h_for_clear_liquids_per_ASA_pediatric_fasting';
  return {
    plan,
    safety: 'pediatric_specific_considerations_higher_risk_airway_obstruction_for_infants_monitor_with_capnography_strict_Q5min_documented_parental_presence_Q5min',
    medication_safety: 'pediatric_dose_per_actual_weight_with_double_check_by_two_providers_per_institutional_protocol',
    parental_role: 'parental_presence_for_young_children_per_protocol_with_comfort_measures_anxiolysis_held_during_deeper_sedation',
    recovery: 'pediatric_recovery_with_parental_presence_with_discharge_when_meeting_modified_aldrete_score_with_specific_pediatric_discharge_instructions',
    citation: CITATIONS.AAP_PEDS_SEDATION,
  };
}

function capnographyMonitoring(input) {
  const { capnography_available, etco2_baseline_mmhg, etco2_trending, ventilation_status, oxygen_saturation_trend, respiratory_rate, depth_of_sedation } = input;
  let interpretation = 'capnography_normal_with_ETCO2_35_to_45mmhg_and_normal_waveform';
  if (etco2_trending === 'rising_above_50') interpretation = 'hypoventilation_with_risk_of_respiratory_depression_reduce_sedation_and_assess_airway';
  if (etco2_trending === 'falling_below_30') interpretation = 'hyperventilation_or_decreased_pulmonary_perfusion_assess_breathing_and_circulation';
  if (etco2_trending === 'apnea_curve_flat') interpretation = 'APNEA_immediate_airway_assessment_and_assist_ventilation_with_BVM_then_assess_cause';
  if (oxygen_saturation_trend === 'falling_below_90') interpretation = 'desaturation_with_immediate_intervention_airway_assessment_oxygen_supplementation_assist_ventilation';
  return {
    interpretation,
    capnography_advantages: 'detects_respiratory_depression_earlier_than_pulse_ox_alone_recommended_for_all_procedural_sedation_per_ASA_and_JCI',
    thresholds: ['ETCO2_above_50_for_60s_or_above_60_any_duration_assess_for_intervention', 'waveform_change_with_increasing_baseline_represents_rebreathing_or_obstruction', 'apnea_15s_or_more_immediate_intervention'],
    citation: CITATIONS.ASA_SEDATION,
  };
}

function reversalAgentsManagement(input) {
  const { reversal_agent_used, last_dose_amount, indication_for_reversal, time_since_sedative_dose, level_of_consciousness_current, respiratory_status, monitoring_capability, naloxone_for_opioid } = input;
  let plan = 'titrate_reversal_agent_to_respiratory_status_NOT_full_consciousness_to_avoid_withdrawal_and_pain';
  if (reversal_agent_used === 'flumazenil_benzodiazepine') plan = 'flumazenil_0.2mg_IV_Q1min_max_1mg_then_monitor_for_resedation_60_to_90_min_benzodiazepine_long_half_life';
  if (naloxone_for_opioid === 'yes') plan = 'naloxone_0.04_to_0.4mg_IV_titrate_to_respiratory_status_with_avoidance_of_full_consciousness_with_pain_control';
  if (level_of_consciousness_current === 'unresponsive') plan = 'immediate_airway_support_consider_full_reversal_then_reassess';
  return {
    plan,
    resedation_risk: 'monitor_Q15min_for_resedation_for_2h_after_reversal_due_to_differential_half_life',
    contraindications: ['chronic_opioid_use_with_naloxone_withdrawal_pain_and_agitation', 'benzodiazepine_dependence_with_flumazenil_seizure_risk'],
    documentation: 'reversal_documented_with_indication_dose_response_then_continued_monitoring_per_protocol',
    citation: CITATIONS.ASA_SEDATION,
  };
}

module.exports = { moderateSedation, deepSedation, pediatricSedation, capnographyMonitoring, reversalAgentsManagement, CITATIONS, ValidationError };