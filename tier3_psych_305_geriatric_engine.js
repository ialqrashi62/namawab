/**
 * TIER3_PSYCH-305 Geriatric Psychiatry Engine
 * Mini-Mental State Exam (MMSE) + Montreal Cognitive Assessment (MoCA) + Geriatric Depression Scale (GDS) + Dementia screening + Delirium assessment (CAM)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { APA_GERI: 'APA Geriatric Psychiatry 2024', NIA_AA: "Alzheimer's Association 2024" };

function miniMentalStateExam(input) {
  const { orientation_5, registration_3, attention_5, recall_3, language_8, visuospatial_1 } = input;
  const total = orientation_5 + registration_3 + attention_5 + recall_3 + language_8 + visuospatial_1;
  let severity = 'normal_cognition';
  if (total < 10) severity = 'severe_cognitive_impairment';
  else if (total < 20) severity = 'moderate_cognitive_impairment';
  else if (total < 25) severity = 'mild_cognitive_impairment';
  return {
    mmse_total: total, severity, max_score: 30,
    note: 'MMSE_education_level_adjustment_required',
    next_step: severity === 'severe_cognitive_impairment' || severity === 'moderate_cognitive_impairment' ? 'comprehensive_dementia_evaluation_neuropsych_testing_brain_imaging' : 'continue_routine_cognitive_monitoring',
    citation: CITATIONS.APA_GERI,
  };
}

function montrealCognitiveAssessment(input) {
  const { visuospatial, naming, attention, language, abstraction, recall, orientation, education_years } = input;
  const total = visuospatial + naming + attention + language + abstraction + recall + orientation;
  const adjusted_total = education_years <= 12 ? total + 1 : total;
  let severity = 'normal_cognition';
  if (adjusted_total < 10) severity = 'severe_cognitive_impairment';
  else if (adjusted_total < 17) severity = 'moderate_cognitive_impairment';
  else if (adjusted_total < 26) severity = 'mild_cognitive_impairment';
  return {
    moca_total: adjusted_total, severity, max_score: 30,
    note: 'MoCA_more_sensitive_than_MMSE_for_mild_cognitive_impairment_and_vascular_dementia',
    next_step: severity !== 'normal_cognition' ? 'refer_geriatric_psychiatry_and_neuropsychological_testing' : 'continue_routine_cognitive_monitoring',
    citation: CITATIONS.APA_GERI,
  };
}

function geriatricDepressionScale(input) {
  const { life_satisfaction, drops_activities, life_empty, often_bored, good_spirits_most, afraid_something_bad, happy_most, often_helpless, prefer_stay_home, memory_problems, wonderful_to_be_alive, worthless, full_of_energy, hopeless, better_off_dead } = input;
  const positive_answers = [drops_activities, life_empty, often_bored, afraid_something_bad, helpless, prefer_stay_home, worthless, hopeless, better_off_dead].filter(v => v === 'yes').length;
  let severity = 'normal';
  if (positive_answers >= 10) severity = 'severe_depression';
  else if (positive_answers >= 5) severity = 'moderate_depression';
  else if (positive_answers >= 3) severity = 'mild_depression';
  return {
    gds_positive_score: positive_answers, severity,
    treatment: severity === 'severe_depression' ? 'SSRI_sertraline_or_escitalopram_with_close_monitoring_and_psychotherapy' : severity === 'moderate_depression' ? 'SSRI_or_psychotherapy_or_combination' : severity === 'mild_depression' ? 'psychoeducation_supportive_therapy' : 'no_depression',
    caution: 'geriatric_patients_sensitive_to_anticholinergic_side_effects_choose_SSRI_with_low_drug_interactions',
    citation: CITATIONS.APA_GERI,
  };
}

function dementiaScreening(input) {
  const { cognitive_decline_progressive, functional_impairment_in_daily_living, behavioral_changes, hallucinations, parkinsonism, fluctuating_cognition, age_of_onset_years } = input;
  let suspected_type = 'no_dementia';
  if (cognitive_decline_progressive === 'yes' && functional_impairment_in_daily_living === 'yes') {
    if (hallucinations === 'yes' || parkinsonism === 'yes') suspected_type = 'lewy_body_dementia';
    else if (behavioral_changes === 'early_and_prominent') suspected_type = 'frontotemporal_dementia';
    else if (age_of_onset_years < 65) suspected_type = 'early_onset_alzheimers_disease';
    else suspected_type = 'alzheimer_disease_most_likely';
  }
  return {
    suspected_dementia_type: suspected_type,
    next_step: suspected_type !== 'no_dementia' ? 'comprehensive_dementia_evaluation_MRI_brain_neuropsych_testing_lumbar_puncture_optional' : 'continue_routine_cognitive_monitoring',
    citation: CITATIONS.NIA_AA,
  };
}

function deliriumCamAssessment(input) {
  const { acute_onset_fluctuating_course, inattention, disorganized_thinking, altered_level_of_consciousness } = input;
  const feature1 = acute_onset_fluctuating_course === 'yes';
  const feature2 = inattention === 'yes';
  const feature3 = disorganized_thinking === 'yes';
  const feature4 = altered_level_of_consciousness === 'yes';
  let cam_result = 'negative_no_delirium';
  if (feature1 && feature2 && (feature3 || feature4)) cam_result = 'positive_delirium_present';
  return {
    cam_result, features: { acute_onset_fluctuating: feature1, inattention: feature2, disorganized_thinking: feature3, altered_consciousness: feature4 },
    next_step: cam_result === 'positive_delirium_present' ? 'identify_and_treat_underlying_cause_infection_metabolic_drugs_screen_for_reversible_causes_non_pharmacologic_interventions_then_pharmacologic_if_agitation' : 'continue_monitoring',
    citation: CITATIONS.APA_GERI,
  };
}

module.exports = { miniMentalStateExam, montrealCognitiveAssessment, geriatricDepressionScale, dementiaScreening, deliriumCamAssessment, CITATIONS, ValidationError };