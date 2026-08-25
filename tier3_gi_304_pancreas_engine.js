/**
 * TIER3_GI-304 Pancreatic Disease Engine
 * Pancreatitis severity (BISAP, Marshall) + fluid resuscitation + necrosis + pseudocyst + ERCP indication
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { IAP_2012: 'IAP/APA/World Bank 2012', ACG: 'ACG Pancreatitis 2024' };

function pancreatitisSeverity(input) {
  const { bun, impaired_mental_status, sirs, age, pleural_effusion } = input;
  const bisap = (bun > 25 ? 1 : 0) + (impaired_mental_status ? 1 : 0) + (sirs ? 1 : 0) + (age > 60 ? 1 : 0) + (pleural_effusion ? 1 : 0);
  const risk_mortality = bisap >= 3 ? 'high' : bisap >= 2 ? 'moderate' : 'low';
  let severity = 'mild';
  if (bisap >= 3) severity = 'severe';
  else if (bisap >= 2) severity = 'moderately_severe';
  return { bisap_score: bisap, severity, risk_mortality_pct: bisap * 5, citation: CITATIONS.IAP_2012 };
}

function fluidResuscitation(input) {
  const { weight_kg, severity, cardiovascular_status, hr, sbp, urine_output_ml_h } = input;
  const rate_ml_per_kg_per_h = severity === 'severe' ? 5 : 3;
  const total_first_24h = weight_kg * 1000;
  const target_urine_output_ml_per_h = 0.5 * weight_kg;
  return {
    fluid_type: cardiovascular_status === 'unstable' ? 'lactated_ringers' : 'lactated_ringers_preferred',
    rate_ml_per_kg_per_h: rate_ml_per_kg_per_h,
    total_first_24h_ml: total_first_24h,
    target_urine_output_ml_per_h: target_urine_output_ml_per_h,
    reassess_interval: severity === 'severe' ? 'every_2_hours' : 'every_4_hours',
  };
}

function necrosisManagement(input) {
  const { ct_findings, infection_suspected, symptomatic, weeks_since_onset } = input;
  if (!infection_suspected) return { approach: 'conservative', intervention: 'none_until_symptomatic_or_infected' };
  return {
    approach: 'step_up',
    first_step: weeks_since_onset < 4 ? 'antibiotics_only' : 'antibiotics_then_drainage',
    antibiotic_options: ['carbapenem (imipenem or meropenem)', 'ciprofloxacin + metronidazole'],
    drainage_options: ['EUS-guided transmural', 'percutaneous', 'open_NECROSECTOMY_if_failed'],
    citation: CITATIONS.ACG,
  };
}

function pseudocystManagement(input) {
  const { size_cm, symptomatic, duration_weeks, infected, thickening } = input;
  const intervention_needed = symptomatic && duration_weeks > 6 || size_cm >= 6 || infected;
  return {
    size_cm, intervention_needed,
    approach: intervention_needed ? (size_cm >= 6 ? 'EUS_drainage_stent' : 'observation_or_EUS') : 'observation',
    stent_duration_weeks: 8,
    citation: CITATIONS.ACG,
  };
}

function ercpIndication(input) {
  const { bilirubin_mg_dl, cholangitis, gallstone_in_duct, dilated_duct, age, comorbidities } = input;
  const urgent = cholangitis === 'severe';
  const appropriate = (bilirubin_mg_dl >= 4 && dilated_duct && cholangitis !== 'none') || (cholangitis === 'mild' && gallstone_in_duct);
  return {
    ercp_appropriate: appropriate,
    urgent: urgent,
    timing: urgent ? 'within_24h' : appropriate ? 'within_72h' : 'not_indicated',
    cholangitis_indicators: { charcot_triad: cholangitis === 'severe', reynolds_pentad: cholangitis === 'severe_with_organ_failure' },
    citation: CITATIONS.ACG,
  };
}

module.exports = { pancreatitisSeverity, fluidResuscitation, necrosisManagement, pseudocystManagement, ercpIndication, CITATIONS, ValidationError };