/**
 * TIER3_INFECT-305 Tropical & Travel Medicine Engine
 * Malaria classification + Dengue severity + Typhoid + Meningitis empiric + Travel prophylaxis
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_MALARIA: 'WHO Malaria 2023', WHO_DENGUE: 'WHO Dengue 2009', WHO_TYPHID: 'WHO Typhoid 2022' };

function malariaClassification(input) {
  const { species, parasitemia_pct, severity_signs, alt, bilirubin, creatinine, mental_status, respiratory_distress, pregnancy, age } = input;
  const severe = severity_signs === 'yes' || (species === 'falciparum' && parasitemia_pct >= 2) || alt > 3 || bilirubin > 3 || creatinine > 3 || mental_status !== 'alert' || respiratory_distress === 'yes';
  return {
    species,
    severity: severe ? 'severe' : 'uncomplicated',
    treatment: severe ? 'IV_artesunate_2.4mg_per_kg_dose_0_then_12h_then_24h_then_daily' : 'ACT_artemether_lumefantrine_x_3_days',
    species_specific_notes: species === 'falciparum' && pregnancy ? 'use_ACT_in_2nd_3rd_trimester' : 'standard_protocol',
    citation: CITATIONS.WHO_MALARIA,
  };
}

function dengueSeverityWHO(input) {
  const { warning_signs, plasma_leakage, bleeding_severe, organ_dysfunction, hematocrit_increase, platelet_count } = input;
  let classification = 'dengue_without_warning_signs';
  if (warning_signs && !plasma_leakage && !bleeding_severe && !organ_dysfunction) classification = 'dengue_with_warning_signs';
  if (plasma_leakage || bleeding_severe || organ_dysfunction) classification = 'severe_dengue';
  return {
    classification,
    severe_warning: classification === 'severe_dengue' ? 'ICU_admission_and_fluid_resuscitation' : 'outpatient_or_inpatient_fluid_management',
    fluid_protocol: classification === 'severe_dengue' ? 'IV_crystalloid_5_to_7ml_per_kg_per_h_x_1_to_2h_then_maintenance_3ml_per_kg_per_h' : 'oral_rehydration_Q4h_x_24h_then_taper',
    platelet_threshold_for_transfusion: bleeding_severe && platelet_count < 50 ? 'transfuse_platelets' : 'monitor',
    citation: CITATIONS.WHO_DENGUE,
  };
}

function typhoidTreatment(input) {
  const { susceptibility, severity, age, on_fluoroquinolones, child_a } = input;
  let regimen = 'ceftriaxone_2g_IV_daily_x_10_to_14_days';
  if (susceptibility && susceptibility.cipro === 'susceptible') regimen = 'ciprofloxacin_500mg_PO_BID_x_10_to_14_days';
  if (severity === 'severe_with_perforation') regimen = 'ceftriaxone_2g_IV_daily_x_14_to_21_days_evaluate_surgery';
  if (child_a) regimen += '_pregnancy_safe_ceftriaxone_2g_IV_daily';
  return { regimen, duration_days: 14, follow_up: 'blood_culture_Q48h_to_confirm_clearance_3_consecutive_negatives', citation: CITATIONS.WHO_TYPHID };
}

function meningitisEmpiricTherapy(input) {
  const { age, immunocompromised, post_neurosurgery, hypersensitivity_penicillin, csf_gram_stain } = input;
  const regimens = {
    neonate_0_to_1_month: 'ampicillin_75mg_per_kg_IV_Q6h + cefotaxime_50mg_per_kg_IV_Q6h OR_gentamicin',
    child_1_month_to_50_years: 'ceftriaxone_2g_IV_Q12h + vancomycin_30mg_per_kg_IV_Q12h + dexamethasone_10mg_IV_Q6h',
    adult_50_plus: 'ceftriaxone_2g_IV_Q12h + vancomycin + ampicillin_3g_IV_Q4h',
    immunocompromised: 'ampicillin_3g_IV_Q4h + cefepime_2g_IV_Q8h + vancomycin',
    post_neurosurgery: 'vancomycin_30mg_per_kg_IV_Q12h + cefepime_2g_IV_Q8h',
  };
  let regimen = regimens[`adult_50_plus`];
  if (age < 28) regimen = regimens.neonate_0_to_1_month;
  else if (age < 50) regimen = regimens.child_1_month_to_50_years;
  if (immunocompromised) regimen = regimens.immunocompromised;
  if (post_neurosurgery) regimen = regimens.post_neurosurgery;
  if (hypersensitivity_penicillin) regimen = regimen.replace(/ceftriaxone|cefotaxime|cefepime/gi, 'aztreonam');
  if (csf_gram_stain === 'gram_positive_cocci') regimen += ' add_daptomycin_if_vancomycin_MIC_high';
  if (csf_gram_stain === 'gram_negative_rods') regimen += ' add_intrathecal_gentamicin_if_critical';
  return { regimen, duration_days: 21, dexamethasone_documented: age >= 1, citation: CITATIONS.WHO_TYPHID };
}

function travelProphylaxis(input) {
  const { destination, traveler_type, duration_days, current_medications, immunocompromised, pregnancy, prior_vaccinations } = input;
  const prophylaxis_map = {
    malaria_zone_sub_saharan_africa: 'atovaquone_proguanil_daily_x_trip_plus_7_days_after_OR_doxycycline_daily',
    malaria_zone_southeast_asia: 'doxycycline_daily_x_trip_plus_4_weeks_after',
    yellow_fever_zone: 'yellow_fever_vaccine_at_least_10_days_before_travel',
    japanese_encephalitis_zone: 'japanese_encephalitis_vaccine_x_2_doses_28_days_apart_if_extended_travel',
    hepatitis_a_risk: 'hepatitis_a_vaccine_x_2_doses_6_to_12_months_apart',
    typhoid_risk: 'typhoid_vaccine_injectable_OR_oral_x_4_doses',
    meningococcal_risk: 'meningococcal_vaccine_ACWY_x_1_dose_if_hajj_or_sub_saharan',
  };
  const recommended = [];
  if (destination.includes('malaria')) recommended.push('atovaquone_proguanil_or_doxycycline');
  if (destination.includes('yellow_fever')) recommended.push('yellow_fever_vaccine');
  if (destination.includes('japanese_encephalitis')) recommended.push('je_vaccine');
  if (destination.includes('hepatitis_a')) recommended.push('hep_a_vaccine');
  if (destination.includes('typhoid')) recommended.push('typhoid_vaccine');
  if (destination.includes('meningitis')) recommended.push('meningococcal_vaccine');
  if (pregnancy && recommended.some(p => p.includes('doxycycline'))) recommended.splice(recommended.indexOf('doxycycline'));
  return {
    destination, traveler_type,
    recommended_measures: recommended,
    travel_kit: ['standing_water_avoidance', 'mosquito_repellent_DEET_30pct', 'ORS', 'antimalarial_chloroquine_if_compatible', 'ciprofloxacin_for_TD_self_treatment'],
    citation: CITATIONS.WHO_MALARIA,
  };
}

module.exports = { malariaClassification, dengueSeverityWHO, typhoidTreatment, meningitisEmpiricTherapy, travelProphylaxis, CITATIONS, ValidationError };