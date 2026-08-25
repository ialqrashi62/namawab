/**
 * TIER3_PSYCH-301 General Psychiatry Engine
 * Psychiatric Mental Status Exam (MSE) + Suicide Risk Assessment (SAD PERSONS) + Capacity assessment + Diagnosis using DSM-5
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { APA_DSM5: 'APA DSM-5-TR 2022', APA_PRACTICE: 'APA Practice Guidelines 2024' };

function mentalStatusExam(input) {
  const { appearance, behavior, speech, mood, affect, thought_process, thought_content, perception, cognition, insight, judgment } = input;
  const sections = { appearance, behavior, speech, mood, affect, thought_process, thought_content, perception, cognition, insight, judgment };
  const abnormalities = [];
  if (appearance === 'disheveled_or_unkept') abnormalities.push('appearance_abnormal');
  if (behavior === 'agitated_or_withdrawn') abnormalities.push('behavior_abnormal');
  if (speech === 'pressured_or_slow_or_sparse') abnormalities.push('speech_abnormal');
  if (mood === 'depressed_or_euphoric_or_anxious') abnormalities.push('mood_disturbed');
  if (affect === 'flat_or_blunted_or_labile') abnormalities.push('affect_abnormal');
  if (thought_process === 'tangential_or_loose_or_circumstantial') abnormalities.push('thought_process_abnormal');
  if (thought_content === 'paranoid_or_grandiosity_or_obsession') abnormalities.push('thought_content_abnormal');
  if (perception === 'hallucinations_or_illusions') abnormalities.push('perceptual_disturbances');
  if (cognition === 'impaired_orientation_or_memory') abnormalities.push('cognitive_impairment');
  if (insight === 'impaired_or_absent') abnormalities.push('insight_impaired');
  if (judgment === 'impaired_or_poor') abnormalities.push('judgment_impaired');
  return { mse: sections, abnormalities_count: abnormalities.length, abnormalities_list: abnormalities, severity: abnormalities.length >= 4 ? 'significant_psychiatric_disturbance' : abnormalities.length >= 1 ? 'mild_to_moderate_findings' : 'normal_mse', citation: CITATIONS.APA_DSM5 };
}

function sadPersonsScale(input) {
  const { sex_male, age_under_19_or_over_45, depression_previous, previous_psychiatric_attempt, ethanol_use, rational_thinking_loss, social_support_lacking, organized_plan, no_spouse } = input;
  let score = 0;
  if (sex_male === 'yes') score += 1;
  if (age_under_19_or_over_45 === 'yes') score += 1;
  if (depression_previous === 'yes') score += 1;
  if (previous_psychiatric_attempt === 'yes') score += 1;
  if (ethanol_use === 'yes') score += 1;
  if (rational_thinking_loss === 'yes') score += 1;
  if (social_support_lacking === 'yes') score += 1;
  if (organized_plan === 'yes') score += 1;
  if (no_spouse === 'yes') score += 1;
  let risk_level = 'low';
  if (score >= 7) risk_level = 'very_high_imminent_risk';
  else if (score >= 5) risk_level = 'high_risk';
  else if (score >= 3) risk_level = 'moderate_risk';
  return {
    sad_persons_score: score, risk_level,
    management: risk_level === 'very_high_imminent_risk' ? 'psychiatric_hospitalization_with_safety_precautions_1_to_1_supervision' : risk_level === 'high_risk' ? 'consider_voluntary_or_involuntary_hospitalization_safety_plan' : risk_level === 'moderate_risk' ? 'outpatient_psychiatric_follow_up_within_24_to_72h_safety_plan' : 'outpatient_psychotherapy_follow_up',
    citation: CITATIONS.APA_PRACTICE,
  };
}

function decisionMakingCapacity(input) {
  const { ability_to_understand, ability_to_appreciate, ability_to_reason, ability_to_communicate_choice } = input;
  const criteria = { understanding: ability_to_understand, appreciation: ability_to_appreciate, reasoning: ability_to_reason, communication: ability_to_communicate_choice };
  const count_yes = Object.values(criteria).filter(v => v === 'yes').length;
  return {
    criteria, criteria_met: count_yes,
    has_capacity: count_yes === 4 ? 'yes_full_capacity' : 'no_impaired_capacity',
    intervention: count_yes === 4 ? 'proceed_with_informed_consent' : 'engage_surrogate_decision_maker_or_guardian',
    citation: CITATIONS.APA_PRACTICE,
  };
}

function dsm5Categorization(input) {
  const { primary_symptoms, duration_weeks, functional_impairment, history, exclusion_general_medical_or_substance } = input;
  let category = 'unclassified_need_further_evaluation';
  if (exclusion_general_medical_or_substance === 'no' && duration_weeks >= 2 && functional_impairment === 'yes') {
    if (primary_symptoms === 'depressed_mood_or_anxiety_with_avoidance') category = 'mood_or_anxiety_disorder';
    else if (primary_symptoms === 'psychotic_features') category = 'schizophrenia_spectrum_or_psychotic_disorder';
    else if (primary_symptoms === 'obsessions_or_compulsions') category = 'obsessive_compulsive_disorder';
    else if (primary_symptoms === 'cognitive_decline') category = 'neurocognitive_disorder';
  }
  return {
    suspected_category: category,
    next_step: 'comprehensive_psychiatric_evaluation_include_collateral_history_mental_status_exam_dsm_5_criteria',
    citation: CITATIONS.APA_DSM5,
  };
}

function psychotropicSideEffectsMonitoring(input) {
  const { medication_class, weight_gain_present, sedation_present, metabolic_syndrome_signs, extrapyramidal_signs, prolonged_qt_risk } = input;
  return {
    medication_class,
    monitoring: medication_class === 'antipsychotic' ? ['weight_BMI_Q3M', 'fasting_glucose_and_lipids_Q6M', 'AIMS_for_tardive_dyskinesia_Q6M', 'ECG_for_QTc_if_indicated'] : medication_class === 'mood_stabilizer' ? ['lithium_level_Q3_to_6M', 'renal_function_Q6M', 'thyroid_function_Q6M', 'weight_Q3M'] : medication_class === 'antidepressant_ssri' ? ['suicidal_ideation_monitoring_first_4_weeks', 'serotonin_syndrome_signs', 'sexual_dysfunction_Q3M'] : ['review_side_effects_each_visit'],
    flags: { weight_gain_present, sedation_present, metabolic_syndrome_signs, extrapyramidal_signs, prolonged_qt_risk },
    action: 'continue_with_monitoring_or_consider_medication_adjustment',
    citation: CITATIONS.APA_PRACTICE,
  };
}

module.exports = { mentalStatusExam, sadPersonsScale, decisionMakingCapacity, dsm5Categorization, psychotropicSideEffectsMonitoring, CITATIONS, ValidationError };