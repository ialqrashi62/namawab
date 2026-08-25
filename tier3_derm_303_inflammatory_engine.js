/**
 * TIER3_DERM-303 Inflammatory Derm Engine
 * Atopic dermatitis severity + Contact dermatitis + Urticaria/angioedema + Cutaneous lupus + Pemphigus vs bullous pemphigoid
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAD_INFL: 'AAD Inflammatory Derm 2024', EDF: 'European Dermatology Forum 2024' };

function atopicDermatitisSeverity(input) {
  const { body_surface_area_pct, iga_score, eosi_score, sleep_quality, prior_treatment_failure } = input;
  let severity = 'mild';
  if (iga_score === 4 || eosi_score >= 21 || body_surface_area_pct >= 16) severity = 'severe';
  else if (iga_score === 3 || eosi_score >= 16 || body_surface_area_pct >= 7) severity = 'moderate';
  let biologic_candidate = false;
  if (severity === 'severe' && prior_treatment_failure === 'yes') biologic_candidate = true;
  return {
    severity, iga_score, eosi_score, body_surface_area_pct,
    biologic_candidate,
    biologic_options: ['dupilumab_anti_IL4_IL13_first_line_biologic', 'tralokinumab_anti_IL13', 'lebrikizumab_anti_IL13', 'JAK_inhibitors_upadacitinib_abrocitinib'],
    citation: CITATIONS.EDF,
  };
}

function contactDermatitis(input) {
  const { patch_test_results, suspected_allergen, distribution_pattern, chronic_vs_acute } = input;
  let interpretation = 'allergic_contact_dermatitis';
  if (chronic_vs_acute === 'chronic' && distribution_pattern === 'palm_soles_face_or_eyelids') interpretation = 'consider_aeroallergen_or_conservative_patch_testing';
  return {
    interpretation, suspected_allergen, distribution_pattern,
    avoidance_counseling: ['provide_specific_product_avoidance_list', 'review_CIR_database_for_ingredients', 'avoid_cross_reactors'],
    treatment: ['topical_steroid_QD_to_BID_with_taper', 'oral_antihistamine_for_pruritus', 'moisturizer_QID'],
    patch_test_recommendation: suspected_allergen === 'unknown' ? 'yes_consider_patch_testing_after_lesion_resolution' : 'no_specific_avoidance_advised',
    citation: CITATIONS.AAD_INFL,
  };
}

function urticariaAngioedema(input) {
  const { chronic_vs_acute, trigger_identified, angioedema_present, airway_involvement, thyroid_autoantibody, dermatographism } = input;
  let severity = 'mild_urticaria';
  if (airway_involvement === 'yes') severity = 'severe_with_airway_compromise_emergency';
  else if (angioedema_present === 'yes' && chronic_vs_acute === 'acute') severity = 'moderate_angioedema_observation';
  return {
    severity, chronic_vs_acute, angioedema_present,
    treatment: severity === 'severe_with_airway_compromise_emergency' ? ['IM_epinephrine_0.3_to_0.5mg_immediate', 'airway_management', 'IV_steroid_dexamethasone', 'IV_antihistamine_diphenhydramine', 'ICU_observation'] : chronic_vs_acute === 'acute' ? ['oral_second_generation_antihistamine_cetirizine_10mg_QD', 'consider_H2_blocker', 'short_course_steroid_for_severe_symptoms'] : 'second_gen_antihistamine_QD_then_consider_up_to_4x_dose_then_omalizumab_300mg_Q4W_then_cyclosporine',
    workup_for_chronic: 'CBC_ANA_thyroid_function_thyroid_autoantibody_consider_H_pylori_test',
    citation: CITATIONS.EDF,
  };
}

function cutaneousLupusSledai(input) {
  const { malar_rash_present, discoid_lesions_count, photosensitivity, oral_ulcers, arthritis, serositis, renal_involvement, neurologic_involvement, anti_dsdna_positive } = input;
  let sledai_score = 0;
  if (seizure_or_psychosis === 'yes') sledai_score += 8;
  if ('organic_brain_syndrome' === 'yes') sledai_score += 7;
  if ('visual_disturbance' === 'yes') sledai_score += 8;
  if ('cranial_nerve_disorder' === 'yes') sledai_score += 8;
  if ('headache' === 'yes') sledai_score += 8;
  if ('cerebrovascular_accident' === 'yes') sledai_score += 8;
  if (vasculitis) sledai_score += 8;
  if (arthritis) sledai_score += 4;
  if (myositis) sledai_score += 4;
  if (renal_involvement) sledai_score += 4;
  if (chest_pain_or_pericarditis) sledai_score += 4;
  if (fever) sledai_score += 2;
  return {
    sledai_score: sledai_score || 0,
    classification: malar_rash_present === 'yes' || discoid_lesions_count >= 4 ? 'cutaneous_lupus_ACR_criteria_met' : 'incomplete_lupus',
    treatment: ['sun_protection_essential_SPF_50_PPD_UVA_clothing', 'topical_steroid_or_topical_calcineurin_inhibitor_for_skin_lesions', 'hydroxychloroquine_200_to_400mg_daily_baseline_then_annual_eye_exam', 'methotrexate_or_azathioprine_for_refractory_or_systemic', 'anifrolumab_or_belimumab_for_severe_refractory'],
    citation: CITATIONS.AAD_INFL,
  };
}

function pemphigusVsBullousPemphigoid(input) {
  const { age_years, mucosal_involvement_present, Nikolsky_sign, tense_vs_flaccid_blisters, immunofluorescence_findings } = input;
  let diagnosis = 'uncertain';
  if (age_years >= 60 && tense_vs_flaccid_blisters === 'tense' && mucosal_involvement_present === 'no') diagnosis = 'bullous_pemphigoid_likely';
  if (age_years <= 50 && tense_vs_flaccid_blisters === 'flaccid' && mucosal_involvement_present === 'yes') diagnosis = 'pemphigus_vulgaris_likely';
  if (Nikolsky_sign === 'positive') diagnosis = 'pemphigus_vulgaris_more_likely';
  return {
    diagnosis, Nikolsky_sign, mucosal_involvement_present,
    workup: ['perilesional_skin_biopsy_for_direct_immunofluorescence', 'serology_for_anti_desmoglein_3_for_pv_or_anti_BP180_BP230_for_bp', 'consider_indirect_immunofluorescence_serum'],
    treatment: (diagnosis === 'pemphigus_vulgaris_likely') ? ['high_dose_prednisone_1mg_per_kg_per_day_or_IV_methylprednisolone', 'rituximab_first_line_per_JAMA_2017_protocol', 'IVIG_immunoadsorption_for_refractory'] : (diagnosis === 'bullous_pemphigoid_likely') ? ['super_potent_topical_clobetasol_QD_to_BID', 'systemic_steroid_taper', 'consider_omalizumab_or_dupilumab_for_refractory'] : ['refer_to_dermatology_for_further_evaluation'],
    citation: CITATIONS.AAD_INFL,
  };
}

module.exports = { atopicDermatitisSeverity, contactDermatitis, urticariaAngioedema, cutaneousLupusSledai, pemphigusVsBullousPemphigoid, CITATIONS, ValidationError };