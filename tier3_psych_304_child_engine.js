/**
 * TIER3_PSYCH-304 Child & Adolescent Psychiatry Engine
 * Vanderbilt ADHD + Pediatric anxiety (SCARED) + Pediatric depression (CDI-2) + Autism (M-CHAT-R) + Eating disorder (SCOFF)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AACAP: 'AACAP Practice Parameters 2024', AAP_ADHD: 'AAP ADHD Guidelines 2019' };

function vanderbiltAdhd(input) {
  const { inattention_score, hyperactivity_score, impairment_count, age_years } = input;
  if (age_years < 4 || age_years > 18) return { invalid: 'age_outside_screening_range_4_to_18' };
  const meets_dsm_criteria = (inattention_score >= 6 || hyperactivity_score >= 6) && impairment_count >= 2;
  let subtype = 'none_predominantly';
  if (inattention_score >= 6 && hyperactivity_score < 6) subtype = 'predominantly_inattentive';
  else if (inattention_score < 6 && hyperactivity_score >= 6) subtype = 'predominantly_hyperactive_impulsive';
  else if (inattention_score >= 6 && hyperactivity_score >= 6) subtype = 'combined_type';
  return {
    vanderbilt_result: meets_dsm_criteria ? 'positive_screen_for_ADHD' : 'negative_screen',
    subtype,
    next_step: meets_dsm_criteria ? 'comprehensive_ADHD_evaluation_with_psychologist_or_psychiatrist' : 'continue_routine_monitoring',
    first_line_treatment: subtype !== 'none_predominantly' ? ['parent_training_in_behavior_management', 'school_based_interventions', 'stimulant_medication_for_children_gt_6_years'] : [],
    citation: CITATIONS.AAP_ADHD,
  };
}

function pediatricAnxietyScared(input) {
  const { panic_symptoms, generalized_worry, separation_anxiety, social_anxiety, school_anxiety } = input;
  const total = panic_symptoms + generalized_worry + separation_anxiety + social_anxiety + school_anxiety;
  let diagnosis = 'no_anxiety_disorder';
  if (total >= 25) diagnosis = 'anxiety_disorder_present_refer_specialist';
  else if (total >= 15) diagnosis = 'clinically_significant_anxiety';
  return {
    scared_total: total, diagnosis,
    treatment: diagnosis === 'anxiety_disorder_present_refer_specialist' ? 'CBT_first_line_then_SSRI_if_no_response' : diagnosis === 'clinically_significant_anxiety' ? 'psychoeducation_parenting_intervention_CBT' : 'monitoring',
    citation: CITATIONS.AACAP,
  };
}

function pediatricDepressionCdi2(input) {
  const { emotional_problems, functional_problems, depressive_symptoms_count, age_years } = input;
  let severity = 'minimal';
  if (depressive_symptoms_count >= 20) severity = 'severe_depression';
  else if (depressive_symptoms_count >= 14) severity = 'moderate_depression';
  else if (depressive_symptoms_count >= 7) severity = 'mild_depression';
  return {
    cdi2_severity: severity, age_years,
    treatment: severity === 'severe_depression' ? 'SSRI_fluoxetine_first_line_for_adolescent_CBT_for_all_ages' : severity === 'moderate_depression' ? 'CBT_first_line_then_SSRI' : severity === 'mild_depression' ? 'psychoeducation_supportive_therapy_family_intervention' : 'monitoring',
    warning: 'FDA_black_box_SSRI_suicidality_first_4_weeks_for_children_and_adolescents_monitor_Q_week_for_first_4_weeks',
    citation: CITATIONS.AACAP,
  };
}

function autismScreeningMchatR(input) {
  const { fails_to_point_to_indicate_interest, fails_to_pretend_play, fails_to_follow_pointing, fails_to_make_eye_contact, fails_to_respond_to_name, repetitive_movements, unusual_speech, loses_skills } = input;
  const total = [fails_to_point_to_indicate_interest, fails_to_pretend_play, fails_to_follow_pointing, fails_to_make_eye_contact, fails_to_respond_to_name, repetitive_movements, unusual_speech, loses_skills].filter(v => v === 'yes').length;
  let risk_level = 'low_risk';
  if (total >= 8) risk_level = 'high_risk_refer_specialist';
  else if (total >= 3) risk_level = 'moderate_risk_administrate_follow_up_interview';
  return {
    mchat_r_score: total, risk_level,
    next_step: risk_level === 'high_risk_refer_specialist' ? 'refer_for_comprehensive_autism_diagnostic_evaluation_ADOS_Golden_standard' : risk_level === 'moderate_risk_administrate_follow_up_interview' ? 'follow_up_interview_M_CHAT_R_F_with_caregiver' : 'continue_routine_monitoring',
    citation: CITATIONS.AACAP,
  };
}

function eatingDisorderScoff(input) {
  const { make_sick_after_eating, worry_about_lost_control_of_eating, lost_more_than_one_stone_weight_in_three_months, believe_fat_when_others_say_thin, food_dominates_life } = input;
  const total = [make_sick_after_eating, worry_about_lost_control_of_eating, lost_more_than_one_stone_weight_in_three_months, believe_fat_when_others_say_thin, food_dominates_life].filter(v => v === 'yes').length;
  return {
    scoff_score: total, suspected_eating_disorder: total >= 2 ? 'yes' : 'no',
    next_step: total >= 2 ? 'comprehensive_eating_disorder_evaluation_BMI_electrolytes_psychiatric_evaluation' : 'continue_routine_monitoring',
    citation: CITATIONS.AACAP,
  };
}

module.exports = { vanderbiltAdhd, pediatricAnxietyScared, pediatricDepressionCdi2, autismScreeningMchatR, eatingDisorderScoff, CITATIONS, ValidationError };