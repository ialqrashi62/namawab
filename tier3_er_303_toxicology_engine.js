/**
 * TIER3_ER-303 Toxicology / Poisoning Engine
 * Acetaminophen toxicity + Salicylate toxicity + Opioid overdose reversal + TCA overdose + Toxicology screening
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { GOLD: 'Goldfrank Toxicology 2024', AHA_TOX: 'AHA Toxicology 2024' };

function acetaminophenToxicity(input) {
  const { serum_acetaminophen_mcg_ml, hours_since_ingestion, ingested_dose_g, chronic_use, liver_function_abnormalities } = input;
  let interpretation = 'subtoxic_no_treatment';
  if (hours_since_ingestion >= 4) {
    if (serum_acetaminophen_mcg_ml >= 150 && hours_since_ingestion <= 8) interpretation = 'probable_hepatotoxicity';
    else if (serum_acetaminophen_mcg_ml >= 50 && hours_since_ingestion <= 24) interpretation = 'possible_hepatotoxicity_use_rumack_nomogram';
    else if (chronic_use === 'yes' && liver_function_abnormalities === 'yes') interpretation = 'chronic_toxicity_present';
  }
  const use_nac = interpretation === 'probable_hepatotoxicity' || interpretation === 'possible_hepatotoxicity_use_rumack_nomogram' || interpretation === 'chronic_toxicity_present';
  return {
    serum_acetaminophen_mcg_ml, hours_since_ingestion, interpretation,
    rumack_nomogram_zone: hours_since_ingestion >= 4 && serum_acetaminophen_mcg_ml >= 150 ? 'above_treatment_line' : 'below_treatment_line',
    nac_indications: use_nac ? 'yes_n_acetylcysteine_IV_loading_150mg_per_kg_over_60min_then_50mg_per_kg_over_4h_then_100mg_per_kg_over_16h' : 'no_nac_not_needed',
    liver_transplant_evaluation: ingested_dose >= 30 || interpretation === 'probable_hepatotoxicity' ? 'yes_if_progresses' : 'no',
    citation: CITATIONS.GOLD,
  };
}

function salicylateToxicity(input) {
  const { serum_salicylate_mg_dl, hours_since_ingestion, symptoms, metabolic_state } = input;
  let interpretation = 'mild';
  if (serum_salicylate_mg_dl >= 100 && hours_since_ingestion <= 6) interpretation = 'severe_acute';
  else if (serum_salicylate_mg_dl >= 90 && hours_since_ingestion >= 6) interpretation = 'severe_salicylate_poisoning';
  else if (serum_salicylate_mg_dl >= 50) interpretation = 'moderate';
  return {
    serum_salicylate_mg_dl, hours_since_ingestion, interpretation, symptoms, metabolic_state,
    treatment: ['activated_charcoal_within_1_to_2h_of_ingestion', 'urinary_alkalinization_with_3_ampules_of_sodium_bicarbonate_in_1L_D5W_at_250_mL_per_h', 'hemodialysis_if_severe_or_renal_failure_or_cerebral_or_pulmonary_edema', 'correct_hypokalemia_first_for_alkalinization'],
    citation: CITATIONS.GOLD,
  };
}

function opioidOverdose(input) {
  const { respiratory_depression, pinpoint_pupils, mental_status, opioid_type, chronic_opioid_use } = input;
  const opioid_toxidrome_present = respiratory_depression === 'yes' && pinpoint_pupils === 'yes';
  let naloxone_dose = 0;
  if (opioid_toxidrome_present) {
    naloxone_dose = chronic_opioid_use === 'yes' ? 0.1 : 0.4;
    if (opioid_type === 'fentanyl_derivative') naloxone_dose = 1;
  }
  return {
    opioid_toxidrome_present,
    naloxone_dose_mg: naloxone_dose, naloxone_route: 'IV_or_IM_or_IN',
    redosing_interval: naloxone_dose < 0.4 ? 'Q1_to_2h_due_to_short_duration' : 'Q5_to_10min_until_adequate_respiration',
    support_care: 'bag_mask_ventilation_if_apneic_intubation_if_no_response_to_high_dose_naloxone',
    discharge_criteria: chronic_opioid_use === 'yes' ? 'observation_4_to_6h_after_last_naloxone_dose' : 'observation_2h_after_last_naloxone_dose',
    citation: CITATIONS.AHA_TOX,
  };
}

function tcaOverdose(input) {
  const { qrs_duration_ms, blood_pressure, seizures, mental_status, heart_rate_bpm } = input;
  let interpretation = 'asymptomatic_or_minimal_symptoms';
  let sodium_bicarb_indic = false;
  if (qrs_duration_ms >= 100) { interpretation = 'cardiotoxicity_present'; sodium_bicarb_indic = true; }
  if (qrs_duration_ms >= 160) interpretation = 'high_risk_for_arrhythmias';
  if (blood_pressure === 'hypotension' && qrs_duration_ms >= 100) { interpretation = 'severe_cardiotoxicity'; sodium_bicarb_indic = true; }
  if (seizures === 'yes') interpretation = 'severe_neurotoxicity_and_cardiotoxicity';
  return {
    qrs_duration_ms, heart_rate_bpm, interpretation,
    sodium_bicarbonate_indications: sodium_bicarb_indic ? 'yes_1_to_2mEq_per_kg_IV_bolus_then_titration_to_pH_7.45_to_7.55' : 'no',
    seizure_treatment: seizures === 'yes' ? 'benzodiazepines_first_line_then_phenobarbital_or_propofol' : 'monitor_only',
    intubation_indication: mental_status === 'unresponsive' || blood_pressure === 'severe_hypotension' ? 'yes_for_airway_protection_and_oxygenation' : 'no_yet',
    citation: CITATIONS.GOLD,
  };
}

function toxicologyScreening(input) {
  const { suspected_substance, symptoms, labs_ordered, time_to_screen } = input;
  return {
    recommended_screenings: suspected_substance === 'alcohol' ? ['BAL_breath_or_serum', 'basic_metabolic_panel', 'osmolar_gap', 'acetaminophen_and_salicylate_levels', 'glucose'] : suspected_substance === 'opioids' ? ['urine_drug_screen', 'serum_levels_if_specific_opioid', 'creatinine_kinase_for_rhabdomyolysis'] : suspected_substance === 'amphetamines' ? ['urine_drug_screen', 'creatinine', 'CK', 'liver_function'] : ['urine_drug_screen_comprehensive', 'serum_acetaminophen', 'serum_salicylate', 'BAL', 'basic_metabolic_panel', 'osmolar_gap'],
    toxicology_consultation: 'yes_for_unknown_substance_or_unusual_toxidrome_or_severe_symptoms',
    time_to_screen: time_to_screen, labs_ordered, symptoms,
    citation: CITATIONS.GOLD,
  };
}

module.exports = { acetaminophenToxicity, salicylateToxicity, opioidOverdose, tcaOverdose, toxicologyScreening, CITATIONS, ValidationError };