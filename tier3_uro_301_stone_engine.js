/**
 * TIER3_URO-301 Urolithiasis / Stone Disease Engine
 * Renal colic initial management + Stone size/location decision + ESWL vs ureteroscopy + Stone prevention (24h urine) + Stent management
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AUA_STONE: 'AUA Urolithiasis 2024', EAU_STONE: 'EAU Urolithiasis 2024' };

function renalColicInitial(input) {
  const { pain_severity, flank_location, hematuria, fever_present, nausea_vomiting, stone_size_mm, location_stone, hydronephrosis_present, pregnancy, solitary_kidney } = input;
  let severity = 'uncomplicated_small_distal_stone';
  if (fever_present === 'yes' || (stone_size_mm >= 10 && hydronephrosis_present === 'yes')) severity = 'obstructed_with_infection_or_high_grade_obstruction';
  if (solitary_kidney === 'yes') severity = 'urgent_urology_consult';
  return {
    severity, immediate_management: ['IV_NSAID_ketorolac_15_to_30mg_IV_or_oral_ibuprofen_400mg_optimal_for_renal_colic', 'IV_opioid_morphine_2_to_4mg_IV_PRN_for_breakthrough_pain', 'IV_fluids_normal_saline_bolus_20mL_per_kg_then_maintenance', 'antiemetic_ondansetron_4mg_IV', 'urine_dipstick_culture_urinalysis', 'alpha_blocker_tamsulosin_0.4mg_daily_for_medical_expulsive_therapy_for_distal_stones_5_to_10mm'],
    admission_required: severity === 'obstructed_with_infection_or_high_grade_obstruction' || severity === 'urgent_urology_consult' ? 'yes_urology_consult_for_emergent_decompression' : 'no_discharge_with_pain_control_and_urology_follow_up',
    imaging: 'non_contrast_CT_is_gold_standard_for_suspected_stone_in_non_pregnant_patient',
    citation: CITATIONS.AUA_STONE,
  };
}

function stoneSizeLocationDecision(input) {
  const { stone_size_mm, stone_location, stone_composition_if_known, ct_hounsfield_units, patient_preference } = input;
  let first_choice = 'observation_with_medical_expulsive_therapy';
  if (stone_size_mm >= 10 && stone_location === 'renal') first_choice = 'ESWL_or_ureteroscopy_per_preference';
  if (stone_size_mm >= 15) first_choice = 'ureteroscopy_with_laser_lithotripsy_for_renal_and_ureteral_stones';
  if (stone_size_mm >= 20) first_choice = 'PCNL_percutaneous_nephrolithotomy';
  if (stone_location === 'lower_pole_calyx' && stone_size_mm <= 10) first_choice = 'ESWL_or_ureteroscopy_with_flexible_scope';
  if (stone_location === 'proximal_ureter') first_choice = 'ureteroscopy_with_laser_lithotripsy';
  if (stone_location === 'distal_ureter' && stone_size_mm <= 10) first_choice = 'ESWL_or_ureteroscopy_or_observation_with_MET';
  return {
    first_choice, stone_size_mm, stone_location,
    success_rate: 'ESWL_70_to_80pct_for_renal_stones_lt_2cm_ureteroscopy_90_to_95pct_overall',
    follow_up: 'KUB_xray_Q1_month_to_Q3_months_to_assess_passing_imaging_after_procedure',
    citation: CITATIONS.AUA_STONE,
  };
}

function eswlVsUreteroscopy(input) {
  const { stone_size_mm, stone_location, stone_density_hu, skin_to_stone_distance_cm, bleeding_diathesis, pregnancy, stent_already_in_place } = input;
  let first_choice = 'ESWL';
  let reason = [];
  if (stone_size_mm >= 15) { first_choice = 'ureteroscopy'; reason.push('stone_size_too_large_for_ESWL'); }
  else if (stone_density_hu && stone_density_hu >= 1000) { first_choice = 'ureteroscopy'; reason.push('high_density_resistant_to_ESWL'); }
  else if (skin_to_stone_distance_cm >= 11) { first_choice = 'ureteroscopy'; reason.push('large_skin_to_stone_distance_reducing_ESWL_efficacy'); }
  else if (pregnancy === 'yes') { first_choice = 'ureteroscopy_or_stent_only'; reason.push('pregnancy_is_contraindication_to_ESWL_and_radiation'); }
  else if (bleeding_diathesis === 'yes') { first_choice = 'ureteroscopy'; reason.push('bleeding_diathesis_is_relative_contraindication_to_ESWL'); }
  return {
    first_choice, stone_size_mm, stone_location, reason,
    eswl_considerations: 'outpatient_procedure_low_complication_stone_free_rate_70_to_80pct_for_renal_stones_lt_2cm',
    ureteroscopy_considerations: 'minimally_invasive_stone_free_rate_90_to_95pct_higher_complication_for_large_stones',
    follow_up: 'post_procedure_KUB_Q1_month_Q3_month_Q6_month_then_as_needed',
    citation: CITATIONS.AUA_STONE,
  };
}

function stonePrevention24hUrine(input) {
  const { urine_calcium_mg_24h, urine_oxalate_mg_24h, urine_uric_acid_mg_24h, urine_citrate_mg_24h, urine_volume_l_24h, stone_type_history } = input;
  const abnormalities = [];
  if (urine_calcium_mg_24h >= 200) abnormalities.push('hypercalciuria_increase_fluid_and_thiazide_diuretic_consider');
  if (urine_oxalate_mg_24h >= 40) abnormalities.push('hyperoxaluria_oxalate_restricted_diet');
  if (urine_uric_acid_mg_24h >= 600) abnormalities.push('hyperuricosuria_allopurinol_consider');
  if (urine_citrate_mg_24h < 320) abnormalities.push('hypocitraturia_potassium_citrate_supplementation');
  if (urine_volume_l_24h < 2) abnormalities.push('low_fluid_intake_target_2.5_to_3L_daily');
  return {
    abnormalities,
    treatment_recommendations: ['fluid_intake_target_2.5L_to_3L_per_24h_to_produce_2.5L_urine', 'low_sodium_lt_2300mg_per_day', 'normal_calcium_intake_1000_to_1200mg_per_day', 'limit_oxalate_high_oxalate_foods_rhubarb_spinach_beets_nuts_chocolate', 'limit_animal_protein_lt_1g_per_kg', 'increase_fruits_and_vegetables'],
    stone_specific_therapy: stone_type_history === 'calcium_oxalate' ? 'consider_thiazide_diuretic_for_hypercalciuria_potassium_citrate_for_hypocitraturia' : stone_type_history === 'uric_acid' ? 'urinary_alkalinization_with_potassium_citrate_target_pH_6.5_to_7_allopurinol' : stone_type_history === 'cystine' ? 'aggressive_alkalinization_target_pH_7_to_8_D_penicillamine_or_tiopronin' : 'no_specific_therapy',
    citation: CITATIONS.AUA_STONE,
  };
}

function ureteralStentManagement(input) {
  const { stent_indication, duration_stent_days, stent_symptoms_severity, encrustation_present, infection_present, pregnancy_stent } = input;
  let stent_removal_indicated = duration_stent_days >= 90;
  return {
    stent_removal_indicated, duration_stent_days, stent_symptoms_severity,
    management: ['antibiotic_prophylaxis_if_UTI_history', 'alpha_blocker_tamsulosin_for_stent_related_pain', 'anticholinergic_for_stent_related_frequency_urgency', 'plan_stent_removal_or_replacement_Q2_to_3_months_to_avoid_encrustation'],
    encrustation_risk: duration_stent_days >= 90 ? 'high_risk_for_encrustation_difficult_removal' : 'low_risk_if_removed_before_3_months',
    pregnancy: pregnancy_stent === 'yes' ? 'stent_for_obstructing_stone_in_pregnancy_with_Q4_to_8_weeks_exchange_or_removal_post_delivery' : 'standard_care',
    citation: CITATIONS.AUA_STONE,
  };
}

module.exports = { renalColicInitial, stoneSizeLocationDecision, eswlVsUreteroscopy, stonePrevention24hUrine, ureteralStentManagement, CITATIONS, ValidationError };