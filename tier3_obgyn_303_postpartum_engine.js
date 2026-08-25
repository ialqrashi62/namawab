/**
 * TIER3_OBGYN-303 Postpartum Care Engine
 * Discharge readiness + postpartum depression (EPDS) screening + mastitis + postpartum contraception + 6-week visit
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACOG_PP: 'ACOG Postpartum 2024', AAP_2018: 'AAP Postpartum 2018', WHO_MCH: 'WHO Maternal Health 2024' };

function postpartumDischargeReadiness(input) {
  const { days_post_delivery, mode_of_delivery, vital_signs_stable, ambulating_well, pain_controlled, voiding_well, hgb } = input;
  const criteria = { vital_signs_stable, ambulating_well, pain_controlled, voiding_well };
  const all_met = Object.values(criteria).every(Boolean);
  return {
    ready_for_discharge: all_met && days_post_delivery >= 1 && (mode_of_delivery === 'vaginal' || (mode_of_delivery === 'cesarean' && days_post_delivery >= 2)),
    criteria: criteria, hgb_value: hgb, days_post_delivery, mode_of_delivery,
    citation: CITATIONS.ACOG_PP,
  };
}

function postpartumDepressionScreen(input) {
  const { epds_score, suicide_ideation_present, sleep_disruption, social_support, edinburgh_responses } = input;
  let category = 'unlikely_depression';
  if (epds_score >= 13) category = 'likely_severe_PPD';
  else if (epds_score >= 10) category = 'possible_PPD_refer_for_mental_health_assessment';
  else if (epds_score >= 1 && suicide_ideation_present === 'positive') category = 'urgent_psychiatric_evaluation_suicide_risk';
  return {
    epds_score, category,
    screen_positive: epds_score >= 10,
    immediate_action: suicide_ideation_present === 'positive' ? 'urgent_psychiatric_consult_within_24h_and_supervised_care' : epds_score >= 13 ? 'initiate_PPD_treatment_psychotherapy_or_pharmacotherapy' : 'continue_monitoring_and_refer_to_social_services_if_needed',
    citation: CITATIONS.AAP_2018,
  };
}

function mastitisManagement(input) {
  const { breast_redness, fever, milk_stagnation, abscess_present, breastfeeding_status } = input;
  return {
    diagnosis: breast_redness && fever ? 'lactational_mastitis_likely' : 'breast_pain_only_per_blocked_duct',
    treatment: ['continue_breastfeeding_with_good_latch', 'warm_compresses_then_cold_between_feeds', 'antibiotics_dicloxacillin_500mg_PO_QID_x_10_to_14_days', 'ibuprofen_for_pain', 'drainage_if_abscess'],
    abscess_drainage: abscess_present ? 'incision_and_drainage_or_needle_aspiration_with_ultrasound_guidance' : 'not_indicated',
    return_to_breastfeeding: breastfeeding_status,
    citation: CITATIONS.ACOG_PP,
  };
}

function contraceptionPostpartum(input) {
  const { breastfeeding_status, time_postpartum_weeks, prior_thromboembolism, migraine_with_aura, vte_risk, age } = input;
  let first_line = 'progestin_only_pill_OR_implant_safe_during_breastfeeding';
  if (breastfeeding_status === 'not_breastfeeding' && time_postpartum_weeks >= 6) first_line = 'combined_oral_contraceptive_if_no_migraine_with_aura';
  if (time_postpartum_weeks < 6) first_line = 'progestin_only_until_6_weeks_then_reassess';
  if (prior_thromboembolism) first_line = 'avoid_estrogen_containing_methods';
  return {
    first_line,
    contraindications: ['estrogen_containing_if_history_vte', 'migraine_with_aura_any_age', 'breast_cancer_diagnosed_within_5_years'],
    lactational_amenorrhea_method: breastfeeding_status === 'exclusive' && time_postpartum_weeks < 6 ? 'reliable_99pct_if_exclusive_breastfeeding_no_supplementation' : 'consider_other_method',
    citation: CITATIONS.WHO_MCH,
  };
}

function postpartumFollowUp(input) {
  const { delivery_date, current_postpartum_week, breastfeeding_status, depression_screen_completed, contraceptive_planning_done, chronic_disease } = input;
  return {
    visit_1_recommended: current_postpartum_week < 1 ? 'within_first_3_days_postpartum' : 'already_due_or_completed',
    visit_2_recommended: current_postpartum_week >= 2 && current_postpartum_week < 6 ? 'at_2_weeks_for_mood_breastfeeding_check' : 'next_milestone',
    visit_3_recommended: current_postpartum_week >= 6 && current_postpartum_week < 12 ? '6_to_8_weeks_for_full_assessment_contraception_cervical_screening' : 'continue_per_protocol',
    chronic_disease_followup: chronic_disease ? 'refer_to_primary_care_within_4_weeks_postpartum' : 'standard',
    citation: CITATIONS.ACOG_PP,
  };
}

module.exports = { postpartumDischargeReadiness, postpartumDepressionScreen, mastitisManagement, contraceptionPostpartum, postpartumFollowUp, CITATIONS, ValidationError };