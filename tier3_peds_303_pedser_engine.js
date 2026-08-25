/**
 * TIER3_PEDS-303 Pediatric ER Engine
 * Pediatric Triage (ESI 4-level) + Gorelick dehydration scale + Pediatric Asthma exacerbation + Croup/Bronchiolitis + Pediatric weight-based dosing
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAP_PALS_2024: 'AAP PALS 2024', GINA_PED: 'GINA Pediatrics 2024' };

function pediatricTriage(input) {
  const { age_months, heart_rate_bpm, respiratory_rate_per_min, spo2_pct, capillary_refill_seconds, mental_status, pain_scale } = input;
  const abnormal_hr = age_months < 3 ? (heart_rate_bpm < 100 || heart_rate_bpm > 200) : age_months < 12 ? (heart_rate_bpm < 80 || heart_rate_bpm > 180) : age_months < 60 ? (heart_rate_bpm < 60 || heart_rate_bpm > 160) : (heart_rate_bpm < 50 || heart_rate_bpm > 130);
  const abnormal_rr = respiratory_rate_per_min > 60 || respiratory_rate_per_min < 18;
  let triage_level = 3;
  if (spo2_pct < 90 || capillary_refill_seconds >= 3 || mental_status === 'unresponsive') triage_level = 1;
  else if (spo2_pct < 92 || abnormal_hr || abnormal_rr) triage_level = 2;
  else if (pain_scale >= 7) triage_level = 2;
  return {
    triage_level, abnormal_hr, abnormal_rr, abnormal_spo2: spo2_pct < 92, cap_refill_3_or_more: capillary_refill_seconds >= 3,
    action: triage_level === 1 ? 'immediate_resuscitation' : triage_level === 2 ? 'see_within_30_minutes' : 'see_within_60_to_120_minutes',
    citation: CITATIONS.AAP_PALS_2024,
  };
}

function pediatricDehydration(input) {
  const { mental_status, eyes, tears, mouth_mucous_membrane, skin_turgor, capillary_refill_seconds, pulse } = input;
  let score = 0;
  let findings = [];
  if (mental_status === 'lethargic_unconscious') { score += 3; findings.push('mental_status_lethargic_unconscious'); }
  else if (mental_status === 'restless_irritable') { score += 2; findings.push('mental_status_restless_irritable'); }
  if (eyes === 'sunken') { score += 2; findings.push('eyes_sunken'); }
  if (tears === 'absent') { score += 1; findings.push('tears_absent'); }
  if (mouth_mucous_membrane === 'dry') { score += 2; findings.push('dry_mucous_membrane'); }
  if (skin_turgor === 'tenting_extremely_slow') { score += 2; findings.push('skin_tenting'); }
  else if (skin_turgor === 'slow_recoil') { score += 1; findings.push('skin_slow_recoil'); }
  if (capillary_refill_seconds >= 3) { score += 2; findings.push('capillary_refill_gt_3s'); }
  if (pulse === 'rapid_thready') { score += 2; findings.push('rapid_thready_pulse'); }
  else if (pulse === 'rapid') { score += 1; findings.push('rapid_pulse'); }
  let dehydration_pct = 0;
  if (score === 0) dehydration_pct = 5;
  else if (score >= 1 && score <= 4) dehydration_pct = 5;
  else if (score >= 5 && score <= 8) dehydration_pct = 10;
  else if (score >= 9) dehydration_pct = 15;
  return {
    dehydration_pct, severity: dehydration_pct >= 15 ? 'severe_isotonic' : dehydration_pct >= 10 ? 'moderate' : 'mild',
    management: dehydration_pct >= 15 ? 'IV_fluid_resuscitation_20mL_per_kg_bolus_then_maintenance_ORS_after_improvement' : dehydration_pct >= 10 ? 'ORS_or_IV_fluids_50mL_per_kg_over_4h' : 'ORS_at_home_with_fluid_replacement_50mL_per_kg_over_4h',
    citation: CITATIONS.AAP_PALS_2024,
  };
}

function pediatricAsthma(input) {
  const { wheezing, work_of_breathing, spo2_pct, speech_in_phrases, peak_flow_pct_predicted, history_of_intubation, mental_status } = input;
  let severity = 'mild';
  if (spo2_pct < 90 || work_of_breathing === 'severe_or_silent_chest' || mental_status === 'lethargic_or_confused') severity = 'severe';
  else if (spo2_pct < 94 || work_of_breathing === 'moderate' || speech_in_phrases === 'cannot_speak_full_sentence') severity = 'moderate';
  return {
    severity, classification: severity,
    immediate_treatment: severity === 'severe' ? ['continuous_albuterol_nebs', 'IV_Mg_sulfate', 'consider_bilevel', 'systemic_steroid_IV'] : severity === 'moderate' ? ['albuterol_nebs_Q1H_x_3', 'systemic_steroid_PO', 'consider_ipratropium'] : ['albuterol_nebs_Q2H', 'oral_steroid_optional', 'no_oxygen_needed'],
    discharge_criteria: ['sustained_improvement_for_60_minutes_after_last_treatment', 'saturations_above_92_percent_off_oxygen', 'no_wheezing_on_auscultation_or_only_minimal', 'tolerating_oral_fluids'],
    citation: CITATIONS.GINA_PED,
  };
}

function croupBronchiolitis(input) {
  const { barking_cough, stridor, hoarseness, age_months, respiratory_rate, fever, history_of_atopy, xray_findings, wheezing, cough, runny_nose } = input;
  let diagnosis = 'unclassified';
  if (age_months >= 6 && age_months <= 36 && barking_cough === 'yes' && stridor === 'yes') diagnosis = 'croup_laryngotracheobronchitis';
  if (age_months < 24 && wheezing === 'yes' && cough === 'yes' && runny_nose === 'yes') diagnosis = 'bronchiolitis_RSV_or_other';
  return {
    diagnosis,
    croup_severity: age_months >= 6 && age_months <= 36 && stridor === 'yes' ? (stridor === 'at_rest' ? 'severe_needs_airway_management' : 'mild_to_moderate') : 'not_applicable',
    treatment: diagnosis === 'croup_laryngotracheobronchitis' ? ['single_dose_dexamethasone_0.6mg_per_kg_PO', 'racemic_epinephrine_neb_if_severe', 'cool_mist_therapy', 'observation_Q4H'] : diagnosis === 'bronchiolitis_RSV_or_other' ? ['supportive_care', 'nasal_suctioning', 'supplemental_O2_if_SpO2_below_90', 'consider_hypertonic_saline_neb'] : 'continue_evaluation',
    citation: CITATIONS.AAP_PALS_2024,
  };
}

function pediatricDrugDose(input) {
  const { drug, weight_kg, age_months } = input;
  let dose_per_kg = 0; let frequency = '';
  if (drug === 'amoxicillin_otitis') dose_per_kg = 30;
  if (drug === 'amoxicillin_pneumonia') dose_per_kg = 45;
  if (drug === 'ibuprofen_fever') dose_per_kg = 10;
  if (drug === 'acetaminophen_fever') dose_per_kg = 15;
  if (drug === 'ondansetron_vomiting') dose_per_kg = 0.15;
  if (frequency === '') frequency = 'Q6_to_8h';
  return {
    drug, weight_kg, dose_per_kg, total_dose_mg: dose_per_kg * weight_kg,
    frequency, max_daily: drug === 'amoxicillin_otitis' ? 1000 : drug === 'ibuprofen_fever' ? 40 : drug === 'acetaminophen_fever' ? 75 : 'not_specified',
    citation: CITATIONS.AAP_PALS_2024,
  };
}

module.exports = { pediatricTriage, pediatricDehydration, pediatricAsthma, croupBronchiolitis, pediatricDrugDose, CITATIONS, ValidationError };