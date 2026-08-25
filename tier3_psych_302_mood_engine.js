/**
 * TIER3_PSYCH-302 Mood & Anxiety Disorders Engine
 * PHQ-9 depression + GAD-7 anxiety + Bipolar screening + Panic disorder + PTSD screening (PCL-5)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { APA_PRACTICE: 'APA Practice Guidelines 2024', NICE_MOOD: 'NICE Depression 2022' };

function phq9Depression(input) {
  const { interest, mood, sleep, energy, appetite, self_worth, concentration, psychomotor, suicidality } = input;
  const total = interest + mood + sleep + energy + appetite + self_worth + concentration + psychomotor + suicidality;
  let severity = 'none_minimal';
  if (total >= 20) severity = 'severe_depression';
  else if (total >= 15) severity = 'moderately_severe_depression';
  else if (total >= 10) severity = 'moderate_depression';
  else if (total >= 5) severity = 'mild_depression';
  return {
    phq9_total: total, severity,
    suicidality_flag: suicidality >= 1 ? 'positive_screen_for_suicidal_ideation_further_assessment_needed' : 'no_suicidal_ideation',
    treatment: severity === 'severe_depression' ? 'initiate_antidepressant_SSRI_plus_psychotherapy_and_refer_psychiatry' : severity === 'moderately_severe_depression' ? 'initiate_antidepressant_or_psychotherapy' : severity === 'moderate_depression' ? 'consider_psychotherapy_or_antidepressant' : severity === 'mild_depression' ? 'watchful_waiting_or_psychoeducation' : 'no_treatment_needed',
    citation: CITATIONS.APA_PRACTICE,
  };
}

function gad7Anxiety(input) {
  const { nervousness, control_worry, worry_too_much, relaxation_difficulty, restlessness, irritability, fear_awful } = input;
  const total = nervousness + control_worry + worry_too_much + relaxation_difficulty + restlessness + irritability + fear_awful;
  let severity = 'minimal';
  if (total >= 15) severity = 'severe_generalized_anxiety';
  else if (total >= 10) severity = 'moderate_generalized_anxiety';
  else if (total >= 5) severity = 'mild_generalized_anxiety';
  return {
    gad7_total: total, severity,
    treatment: severity === 'severe_generalized_anxiety' ? 'initiate_SSRI_or_SNRI_and_CBT' : severity === 'moderate_generalized_anxiety' ? 'CBT_or_SSRI_or_SNRI' : severity === 'mild_generalized_anxiety' ? 'psychoeducation_self_help_CBT' : 'no_treatment_needed',
    citation: CITATIONS.APA_PRACTICE,
  };
}

function bipolarScreening(input) {
  const { elevated_mood_episodes, decreased_need_for_sleep, grandiosity, pressured_speech, racing_thoughts, increased_goal_directed_activity, risky_behavior, duration_days } = input;
  const mania_criteria = [elevated_mood_episodes === 'yes', decreased_need_for_sleep === 'yes', grandiosity === 'yes', pressured_speech === 'yes', racing_thoughts === 'yes', increased_goal_directed_activity === 'yes', risky_behavior === 'yes'].filter(Boolean).length;
  return {
    mania_criteria_count: mania_criteria,
    suspected_bipolar: mania_criteria >= 3 && duration_days >= 7 ? 'bipolar_I_or_II_disorder_possible' : 'no_clear_bipolar_features',
    next_step: mania_criteria >= 3 && duration_days >= 7 ? 'full_psychiatric_evaluation_for_bipolar_disorder_mood_disorder_questionnaire_MDQ' : 'continue_monitoring_for_mood_episodes',
    caution: 'antidepressant_monotherapy_can_trigger_mania_in_bipolar_patients_consider_mood_stabilizer_first',
    citation: CITATIONS.APA_PRACTICE,
  };
}

function panicDisorderAssessment(input) {
  const { recurrent_panic_attacks, worry_about_future_attacks, behavioral_change_due_to_attacks, agoraphobia, panic_symptoms_count } = input;
  return {
    panic_disorder_likely: recurrent_panic_attacks === 'yes' && worry_about_future_attacks === 'yes' && behavioral_change_due_to_attacks === 'yes',
    agoraphobia_present: agoraphobia === 'yes',
    panic_symptoms_count,
    treatment: ['CBT_with_panic_focus_first_line', 'SSRI_SSRI_fluoxetine_sertraline_paroxetine', 'benzodiazepine_short_term_only', 'breathing_retraining_psychoeducation'],
    citation: CITATIONS.APA_PRACTICE,
  };
}

function ptsdScreeningPcl5(input) {
  const { intrusive_memories, avoidance_of_reminders, negative_cognitions, hyperarousal, reactivity_changes, duration_weeks, trauma_exposure } = input;
  if (trauma_exposure === 'no') return { ptsd_unlikely: 'no_trauma_exposure_reported', recommendation: 'if_no_trauma_no_PTSD_assessment_needed' };
  const criteria_met = [intrusive_memories === 'yes', avoidance_of_reminders === 'yes', negative_cognitions === 'yes', hyperarousal === 'yes', reactivity_changes === 'yes'].filter(Boolean).length;
  return {
    ptsd_likely: criteria_met >= 4 && duration_weeks >= 4,
    criteria_met_count: criteria_met, duration_weeks,
    treatment: ['trauma_focused_CBT_first_line', 'EMDR_eye_movement_desensitization_and_reprocessing', 'SSRI_SSRI_fluoxetine_sertraline_paroxetine', 'Prazosin_for_trauma_related nightmares'],
    citation: CITATIONS.APA_PRACTICE,
  };
}

module.exports = { phq9Depression, gad7Anxiety, bipolarScreening, panicDisorderAssessment, ptsdScreeningPcl5, CITATIONS, ValidationError };