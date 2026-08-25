/**
 * TIER3_PSYCH-303 Substance Use Disorders Engine
 * AUDIT alcohol + DAST drug abuse + CIWA-Ar alcohol withdrawal + opioid withdrawal (COWS) + SBIRT brief intervention
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_AUDIT: 'WHO AUDIT 2001', ASAM: 'ASAM Criteria 2024' };

function auditAlcoholScreening(input) {
  const { freq_drinking, typical_drinks, six_or_more_drinks, inability_to_stop, failed_expectations, guilty_feelings, memory_blackouts, injury_to_others, concerned_others } = input;
  const total = freq_drinking + typical_drinks + six_or_more_drinks + inability_to_stop + failed_expectations + guilty_feelings + memory_blackouts + injury_to_others + concerned_others;
  let risk_level = 'low_risk';
  if (total >= 20) risk_level = 'possible_dependence_refer_specialist';
  else if (total >= 16) risk_level = 'high_risk_harmful_drinking';
  else if (total >= 8) risk_level = 'hazardous_drinking';
  return {
    audit_total: total, risk_level,
    intervention: risk_level === 'possible_dependence_refer_specialist' ? 'refer_to_addiction_specialist' : risk_level === 'high_risk_harmful_drinking' ? 'brief_therapy_continued_monitoring' : risk_level === 'hazardous_drinking' ? 'simple_advice_and_reduction_strategies' : 'alcohol_education',
    citation: CITATIONS.WHO_AUDIT,
  };
}

function dastDrugScreening(input) {
  const { used_non_prescription_drugs, abused_prescription_drugs, used_more_than_intended, blackout_from_drugs, felt_bad_or_guilty, family_friends_complained, neglected_family, engaged_in_illegal_activities, withdrawal_symptoms, medical_problems_from_drugs } = input;
  const total = [used_non_prescription_drugs, abused_prescription_drugs, used_more_than_intended, blackout_from_drugs, felt_bad_or_guilty, family_friends_complained, neglected_family, engaged_in_illegal_activities, withdrawal_symptoms, medical_problems_from_drugs].filter(v => v === 'yes').length;
  let severity = 'no_problems_reported';
  if (total >= 9) severity = 'severe_substance_use_disorder';
  else if (total >= 6) severity = 'substantial_use_disorder';
  else if (total >= 3) severity = 'moderate_problems';
  else if (total >= 1) severity = 'low_level_problems';
  return { dast_score: total, severity, intervention: severity === 'severe_substance_use_disorder' || severity === 'substantial_use_disorder' ? 'refer_to_addiction_specialist_or_treatment_program' : 'brief_intervention_and_monitoring', citation: CITATIONS.WHO_AUDIT };
}

function ciwaArAlcoholWithdrawal(input) {
  const { nausea_vomiting, tremor, paroxysmal_sweats, anxiety, agitation, tactile_disturbances, auditory_disturbances, visual_disturbances, headache_fullness, orientation_clouding } = input;
  const total = nausea_vomiting + tremor + paroxysmal_sweats + anxiety + agitation + tactile_disturbances + auditory_disturbances + visual_disturbances + headache_fullness + orientation_clouding;
  let severity = 'minimal_withdrawal';
  if (total >= 20) severity = 'severe_withdrawal_high_risk_for_DTs';
  else if (total >= 10) severity = 'moderate_withdrawal';
  return {
    ciwa_ar_total: total, severity,
    treatment: severity === 'severe_withdrawal_high_risk_for_DTs' ? 'ICU_admission_diazepam_IV_symptom_triggered_or_front_loading' : severity === 'moderate_withdrawal' ? 'diazepam_PO_or_IV_symptom_triggered_Q1h' : 'monitoring_and_oral_benzodiazepines_as_needed',
    monitoring: 'CIWA_ar_Q1_to_2h_until_score_less_than_10_for_24h',
    citation: CITATIONS.ASAM,
  };
}

function opioidWithdrawalCows(input) {
  const { pulse_rate, sweating, restlessness, pupil_size, bone_joint_aches, runny_nose, teary_eyes, gi_upset, yawning, anxiety, gooseflesh } = input;
  const total = pulse_rate + sweating + restlessness + pupil_size + bone_joint_aches + runny_nose + teary_eyes + gi_upset + yawning + anxiety + gooseflesh;
  let severity = 'no_or_minimal_withdrawal';
  if (total >= 36) severity = 'severe_withdrawal';
  else if (total >= 25) severity = 'moderately_severe_withdrawal';
  else if (total >= 13) severity = 'moderate_withdrawal';
  else if (total >= 5) severity = 'mild_withdrawal';
  return {
    cows_total: total, severity,
    treatment: severity === 'severe_withdrawal' ? 'consider_buprenorphine_induction_or_methadone_maintenance' : severity === 'moderately_severe_withdrawal' ? 'consider_buprenorphine_induction' : severity === 'moderate_withdrawal' ? 'clonidine_for_symptomatic_relief_consider_medication_assisted_treatment' : severity === 'mild_withdrawal' ? 'symptomatic_treatment_clonidine_ondansetron_loperamide' : 'no_pharmacologic_treatment_needed',
    citation: CITATIONS.ASAM,
  };
}

function sbirtBriefIntervention(input) {
  const { screening_result, readiness_to_change_score, previous_attempts, social_support } = input;
  return {
    brief_intervention_steps: [
      'raise_the_subject_with_permission',
      'provide_feedback_on_screening_results',
      'enhance_motivation_through_motivational_interviewing',
      'negotiate_goals_and_plan',
      'follow_up_and_reinforce_progress',
    ],
    referral_recommendation: screening_result === 'dependence_risk' || readiness_to_change_score < 5 ? 'refer_to_specialty_treatment' : 'continue_within_primary_care',
    citation: CITATIONS.ASAM,
  };
}

module.exports = { auditAlcoholScreening, dastDrugScreening, ciwaArAlcoholWithdrawal, opioidWithdrawalCows, sbirtBriefIntervention, CITATIONS, ValidationError };