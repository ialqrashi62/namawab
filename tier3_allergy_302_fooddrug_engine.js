/**
 * TIER3_ALLERGY-302 Food/Drug Allergy Engine
 * Anaphylaxis food allergen + Oral immunotherapy candidacy + Drug allergy de-labeling + Penicillin allergy testing + Latex allergy
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAAAI_FOOD: 'AAAAI Food Allergy 2024', ACAAI_DRUG: 'ACAAI Drug Allergy 2024' };

function anaphylaxisFoodAllergen(input) {
  const { allergen, symptom_onset_minutes, biphasic_reaction_history, asthma_history, reaction_severity, prior_epinephrine_use } = input;
  let severity = 'mild_reaction';
  if (reaction_severity === 'severe_anaphylaxis') severity = 'severe_with_airway_or_cardiovascular';
  return {
    allergen, severity, symptom_onset_minutes,
    emergency_plan: ['prescribe_2_epinephrine_auto_injectors_0.15mg_for_lt_25kg_or_0.3mg_for_gt_25kg', 'train_on_auto_injector_use', 'written_anaphylaxis_action_plan', 'refer_to_allergist_for_food_allergy_evaluation', 'consider_oral_immunotherapy_for_selected_allergens'],
    biphasic_reaction_risk: biphasic_reaction_history === 'yes' ? 'high_observe_Q4_to_24h_after_initial_reaction' : 'standard_observation_Q4_to_8h',
    epinephrine_use_now: reaction_severity === 'severe_anaphylaxis' ? 'IM_epinephrine_0.3_to_0.5mg_in_mid_anterolateral_thigh_repeat_Q5_to_15min_if_needed' : 'no_immediate_epinephrine_needed',
    citation: CITATIONS.AAAAI_FOOD,
  };
}

function oralImmunotherapyCandidacy(input) {
  const { confirmed_allergen, ige_level_ku_l, age_years, asthma_control, reaction_history_severity, adherence_to_clinic_visits } = input;
  let candidate = false;
  if (age_years >= 4 && age_years <= 17 && asthma_control === 'well_controlled' && reaction_history_severity !== 'life_threatening' && adherence_to_clinic_visits === 'yes') candidate = true;
  return {
    candidate, allergen: confirmed_allergen, ige_level_ku_l,
    eligible_allergens: ['peanut_OIT_approved', 'milk_OIT_research', 'egg_OIT_research'],
    requirements_for_initiation: ['confirmed_IgE_mediated_allergy_via_skin_test_or_serum_IgE', 'medically_supervised_dose_escalation', 'written_informed_consent', 'epinephrine_prescription_and_training'],
    citation: CITATIONS.AAAAI_FOOD,
  };
}

function drugAllergyDelabeling(input) {
  const { reported_drug, reaction_description, time_since_reaction_years, original_reaction_type, multiple_drug_history } = input;
  let delabeling_eligible = false;
  if (original_reaction_type === 'non_immediate_mild' && reaction_description !== 'severe') delabeling_eligible = true;
  if (multiple_drug_history === 'true' && time_since_reaction_years >= 5 && original_reaction_type === 'maculopapular_rash') delabeling_eligible = true;
  return {
    delabeling_eligible, reported_drug, time_since_reaction_years,
    approach: delabeling_eligible ? ['structured_drug_allergy_history_review', 'consider_graded_drug_challenge_or_skin_test', 'document_negative_drug_challenge_to_remove_label'] : 'continue_to_record_drug_allergy_with_current_label',
    benefits_of_delabeling: ['reduce_use_of_broader_spectrum_alternatives', 'reduce_cost', 'reduce_antibiotic_resistance', 'improve_care_quality'],
    citation: CITATIONS.ACAAI_DRUG,
  };
}

function penicillinAllergyTesting(input) {
  const { reported_reaction, skin_test_components, oral_challenge_planned, age_years, comorbid_severe_skin_disease } = input;
  let testing_indicated = true;
  if (reported_reaction === 'anaphylaxis_or_SJS_or_DRESS' || comorbid_severe_skin_disease === 'yes') testing_indicated = false;
  return {
    testing_indicated, reported_reaction,
    approach: testing_indicated ? ['penicillin_skin_testing_with_PPL_and_minor_determinant_mixture', 'if_negative_then_oral_amoxicillin_challenge_250mg_then_observation_60min', 'document_negative_and_remove_label'] : 'avoid_testing_use_alternative_antibiotic',
    follow_up: 'after_negative_challenge_patient_can_take_all_penicillin_antibiotics_with_no_restrictions',
    citation: CITATIONS.ACAAI_DRUG,
  };
}

function latexAllergyAssessment(input) {
  const { occupation, multiple_surgery_history, spina_bifida_or_neural_tube_defect, immediate_reaction_history, allergy_to_fruits } = input;
  let high_risk = false;
  if (spina_bifida_or_neural_tube_defect === 'yes') high_risk = true;
  if (occupation === 'healthcare_worker' && immediate_reaction_history === 'yes_to_latex') high_risk = true;
  let latex_fruit_syndrome = allergy_to_fruits === 'yes' ? 'consider_latex_fruit_syndrome_banana_kiwi_avocado_chestnut' : 'no_latex_fruit_syndrome';
  return {
    high_risk, latex_fruit_syndrome,
    testing: ['serum_IgE_to_latex', 'skin_prick_test_to_latex_extract_with_positive_and_negative_controls'],
    precautions: ['latex_free_environment', 'non_powdered_latex_or_non_latex_gloves', 'premedication_for_surgery_if_history_severe_reaction', 'allergist_consultation'],
    citation: CITATIONS.ACAAI_DRUG,
  };
}

module.exports = { anaphylaxisFoodAllergen, oralImmunotherapyCandidacy, drugAllergyDelabeling, penicillinAllergyTesting, latexAllergyAssessment, CITATIONS, ValidationError };