/**
 * TIER3_ANESTH-304 Pain Management Engine
 * VAS pain scale + WHO analgesic ladder + PCA dosing + Opioid equianalgesic conversion + Multimodal analgesia
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_PAIN: 'WHO Cancer Pain 2024', APS: 'American Pain Society 2024' };

function vasPainScale(input) {
  const { pain_score_0_to_10, pain_location, pain_quality, aggravating_factors, alleviating_factors } = input;
  let severity = 'no_pain';
  if (pain_score_0_to_10 === 0) severity = 'no_pain';
  else if (pain_score_0_to_10 <= 3) severity = 'mild_pain';
  else if (pain_score_0_to_10 <= 6) severity = 'moderate_pain';
  else if (pain_score_0_to_10 <= 9) severity = 'severe_pain';
  else severity = 'worst_possible_pain';
  return {
    vas_score: pain_score_0_to_10, severity, pain_location, pain_quality, aggravating_factors, alleviating_factors,
    next_step: pain_score_0_to_10 >= 4 ? 'initiate_or_escalate_analgesia' : 'continue_current_analgesia',
    re_assessment: pain_score_0_to_10 >= 4 ? 're_assess_in_30_to_60_minutes' : 're_assess_in_2_to_4_hours',
    citation: CITATIONS.WHO_PAIN,
  };
}

function whoAnalgesicLadder(input) {
  const { pain_severity, current_medication, opioid_naive, opioid_tolerant } = input;
  let recommendation = 'step_1_non_opioid';
  if (pain_severity === 'mild' && (current_medication === 'none' || current_medication === 'non_opioid_partial')) recommendation = 'step_1_non_opioid_acetaminophen_or_nsaid';
  else if (pain_severity === 'mild_to_moderate' && opioid_naive === 'yes') recommendation = 'step_2_weak_opioid_codeine_or_tramadol_plus_non_opioid';
  else if (pain_severity === 'moderate_to_sever' && opioid_tolerant === 'yes') recommendation = 'step_3_strong_opioid_morphine_or_oxycodone_plus_non_opioid';
  else if (pain_severity === 'severe') recommendation = 'step_4_strong_opioid_high_dose_consider_neuropathic_adjuvants_or_intervention';
  return {
    recommendation, pain_severity, current_medication, opioid_naive, opioid_tolerant,
    adjuvant_options: ['gabapentin_or_pregabalin_for_neuropathic', 'tca_for_neuropathic_or_migraine', 'tizanidine_for_muscle_spasm', 'lidocaine_5pct_patch_for_localized_neuropathic'],
    citation: CITATIONS.WHO_PAIN,
  };
}

function pcaDosingCalculation(input) {
  const { weight_kg, opioid_history, drug, concentration_mg_ml } = input;
  let demand_dose_mg = 0;
  if (drug === 'morphine') demand_dose_mg = 1;
  else if (drug === 'hydromorphone') demand_dose_mg = 0.2;
  else if (drug === 'fentanyl') demand_dose_mg = 0.02;
  if (opioid_history === 'tolerant') demand_dose_mg *= 1.5;
  return {
    drug, demand_dose_mg, lockout_minutes: 10,
    basal_rate_mg_per_h: opioid_history === 'tolerant' ? demand_dose_mg * 1 : 0,
    four_hour_limit_mg: demand_dose_mg * 12,
    monitoring: ['pain_score_Q1h', 'respiratory_rate_Q1h_first_24h', 'sedation_score_Q4h', 'oxygen_saturation_continuous', 'consider_capnography_for_high_risk'],
    citation: CITATIONS.APS,
  };
}

function opioidEquianalgesicConversion(input) {
  const { current_opioid, current_dose_mg_per_day, target_opioid } = input;
  const equianalgesic_factors = { morphine_oral: 1, morphine_iv: 3, oxycodone_oral: 1.5, hydromorphone_oral: 4, hydromorphone_iv: 20, fentanyl_iv_mcg: 100, fentanyl_patch_mcg_per_h: 0.0125 };
  const current_factor = current_opioid === 'morphine_iv' ? equianalgesic_factors.morphine_iv : current_opioid === 'oxycodone_oral' ? equianalgesic_factors.oxycodone_oral : current_opioid === 'hydromorphone_iv' ? equianalgesic_factors.hydromorphone_iv : 1;
  const target_factor = target_opioid === 'oxycodone_oral' ? equianalgesic_factors.oxycodone_oral : target_opioid === 'hydromorphone_iv' ? equianalgesic_factors.hydromorphone_iv : 1;
  const morphine_equiv_per_day = current_dose_mg_per_day * current_factor;
  const target_dose_per_day = (morphine_equiv_per_day / target_factor) * 0.7;
  return {
    current_opioid, current_dose_mg_per_day, target_opioid,
    morphine_equivalent_mg_per_day: morphine_equiv_per_day,
    target_dose_mg_per_day: target_dose_per_day.toFixed(2),
    safety_reduction: '30_percent_dose_reduction_due_to_incomplete_cross_tolerance',
    citation: CITATIONS.APS,
  };
}

function multimodalAnalgesiaProtocol(input) {
  const { surgery_type, pain_expected_severity, contraindicated_nsaid, contraindicated_opioid } = input;
  let base_protocol = 'acetaminophen_1g_Q6h_scheduled';
  if (!contraindicated_nsaid) base_protocol += '_plus_ibuprofen_400mg_Q6h_or_ketorolac_15mg_iv_Q6h';
  base_protocol += '_plus_gabapentin_300mg_preop_then_Q8h';
  if (!contraindicated_opioid && pain_expected_severity === 'high') base_protocol += '_plus_PCA_morphine_or_hydromorphone';
  base_protocol += '_plus_regional_anesthesia_if_appropriate';
  return {
    surgery_type, protocol: base_protocol, pain_expected_severity,
    contraindications_respected: { nsaid: contraindicated_nsaid, opioid: contraindicated_opioid },
    rationale: 'multimodal_analgesia_reduces_opioid_dose_side_effects_and_improves_pain_control',
    citation: CITATIONS.APS,
  };
}

module.exports = { vasPainScale, whoAnalgesicLadder, pcaDosingCalculation, opioidEquianalgesicConversion, multimodalAnalgesiaProtocol, CITATIONS, ValidationError };