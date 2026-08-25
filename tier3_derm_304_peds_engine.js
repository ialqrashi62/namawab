/**
 * TIER3_DERM-304 Pediatric Dermatology Engine
 * Atopic dermatitis (SCORAD) + Diaper dermatitis + Hemangioma management + Congenital melanocytic nevus + Pediatric skin infections (HSV/VZV)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { SPD: 'Society Pediatric Dermatology 2024', AAP_DERM: 'AAP Pediatric Dermatology 2024' };

function atopicDermatitisScorad(input) {
  const { extent_pct, intensity_score, subjective_symptoms_vas, sleep_disturbance, family_atopy_history } = input;
  let score = 0;
  score += extent_pct || 0;
  score += intensity_score || 0;
  score += subjective_symptoms_vas || 0;
  let severity = 'mild_atopic_dermat';
  if (score >= 50) severity = 'severe_atopic_dermat';
  else if (score >= 25) severity = 'moderate_atopic_dermat';
  return {
    score, severity, sleep_disturbance,
    treatment: severity === 'severe_atopic_dermat' ? ['wet_wrap_therapy_with_topical_steroid', 'systemic_immunosuppressant_or_biologic_dupilumab_for_age_6_plus', 'phototherapy_for_adolescent'] : severity === 'moderate_atopic_dermat' ? ['topical_steroid_QD_to_BID_with_taper', 'topical_tacrolimus_or_pimecrolimus_for_sensitive_areas', 'frequent_emollients_QID'] : ['emollient_QID', 'low_potency_topical_steroid_for_flares', 'avoid_triggers_dust_mites_heat_wool'],
    family_atopy_history,
    citation: CITATIONS.AAP_DERM,
  };
}

function diaperDermatitisManagement(input) {
  const { candidal_overlap, irritant_vs_infectious, duration_days, prior_treatment } = input;
  let treatment = 'frequent_diaper_changes_and_air_exposure';
  if (irritant_vs_infectious === 'infectious_candidal') treatment = 'topical_antifungal_nystatin_or_clotrimazole_BID_x_10_to_14_days';
  if (irritant_vs_infectious === 'irritant_contact') treatment = 'zinc_oxide_barrier_cream_QD_with_each_change_plus_frequent_changing';
  if (irritant_vs_infectious === 'bacterial_impetiginized') treatment = 'topical_mupirocin_TID';
  return {
    treatment, candidal_overlap, irritant_vs_infectious, duration_days,
    prevention: ['superabsorbent_diaper', 'change_diaper_Q2_to_3_hours_during_day', 'clean_with_warm_water_not_wipes', 'barrier_cream_with_each_change'],
    citation: CITATIONS.AAP_DERM,
  };
}

function hemangiomaManagement(input) {
  const { age_at_presentation_weeks, lesion_location, ulceration_present, functional_impairment, size_growth_pattern, subglottic_or_periocular } = input;
  let treatment_indicated = false;
  if (ulceration_present === 'yes' || functional_impairment === 'yes' || subglottic_or_periocular === 'yes') treatment_indicated = true;
  let treatment = 'observation_with_serial_photographs';
  if (treatment_indicated) treatment = 'oral_propranolol_2_to_3mg_per_kg_daily_or_topical_timolol_for_superficial_small_lesions';
  return {
    treatment, treatment_indicated, age_at_presentation_weeks,
    monitoring: 'photographs_Q4_to_8_weeks_Q6_to_12_months_for_involution_then_Q12M',
    complication_management: ['ulceration_wound_care_topical_timolol_or_oral_propranolol_for_pain', 'subglottic_hemangioma_urgent_airway_management_with_oral_propranolol_and_ENT_consultation'],
    citation: CITATIONS.SPD,
  };
}

function congenitalMelanocyticNevus(input) {
  const { nevus_size_cm, location, satellite_lesions, family_history_neurocutaneous, neuromelanocytosis_risk_factors } = input;
  let melanoma_risk = 'low';
  if (nevus_size_cm >= 20 || location === 'head_neck_or_posterior_axial' || satellite_lesions >= 50) melanoma_risk = 'increased_risk';
  return {
    nevus_size_cm, satellite_lesions,
    melanoma_risk,
    follow_up: melanoma_risk === 'increased_risk' ? 'dermatology_Q6_to_12_months_with_consideration_of_MRI_brain_and_spinal_cord_for_neurocutaneous_melanosis' : 'routine_annual_skin_exam',
    surgical_consideration: 'consider_surgical_excision_if_functional_or_cosmetically_distressing_with_discussion_of_risks_recurrence_scarring',
    citation: CITATIONS.SPD,
  };
}

function pediatricSkinInfection(input) {
  const { presentation, fever, location, neonatal_ema, immunocompromised, contact_history } = input;
  let diagnosis = 'unknown';
  if (neonatal_ema === 'neonatal' && presentation === 'vesicles_with_erythematous_base') diagnosis = 'neonatal_HSV_urgent_evaluation_required';
  if (presentation === 'vesicles_in_dermatomal_distribution') diagnosis = 'herpes_zoster_shingles';
  if (presentation === 'grouped_vesicles_oral_or_genital') diagnosis = 'HSV_1_or_2';
  if (presentation === 'multiple_stages_vesicles_pustules_crusted_all_over_body') diagnosis = 'varicella_chickenpox';
  if (presentation === 'honey_crusted_lesions_perioral_or_extremity') diagnosis = 'impetigo_bullous_or_non_bullous';
  return {
    diagnosis, presentation, fever, immunocompromised,
    treatment: diagnosis === 'neonatal_HSV_urgent_evaluation_required' ? ['urgent_IV_acyclovir_20mg_per_kg_Q8h', 'CSF_evaluation_for_HSV_PCR', 'ophthalmology_exam_for_keratitis'] : diagnosis === 'HSV_1_or_2' || diagnosis === 'herpes_zoster_shingles' ? ['oral_acyclovir_or_valacyclovir_weight_based', 'analgesia', 'cool_compresses'] : diagnosis === 'varicella_chickenpox' ? ['supportive_care_antihistamines_antipyretics', 'oral_acyclovir_for_high_risk_immunocompromised_or_secondary_household'] : ['topical_mupirocin_TID_or_oral_antibiotic_for_extensive'],
    citation: CITATIONS.AAP_DERM,
  };
}

module.exports = { atopicDermatitisScorad, diaperDermatitisManagement, hemangiomaManagement, congenitalMelanocyticNevus, pediatricSkinInfection, CITATIONS, ValidationError };