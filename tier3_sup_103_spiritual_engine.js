/**
 * TIER3_SUP-103 Spiritual Care Engine
 * Spiritual assessment + End-of-life coordination + Grief/bereavement + Cultural/religious + Chaplain
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { CPSC_SPIRITUAL: 'CPSC Spiritual Care 2024', NASW_SPIRITUAL: 'NASW Spiritual Care 2023' };

function spiritualCareAssessment(input) {
  const { faith_religion, importance_of_spirituality, spiritual_practice, source_of_strength, spiritual_distress_present, life_meaning_purpose, religious_dietary_restrictions, religious_practice_interfered_by_treatment, family_religious_engagement } = input;
  let plan = 'screen_with_FICA_Faith_Importance_Community_Address_in_care_or_similar_spiritual_history_tool';
  if (spiritual_distress_present === 'yes') plan = 'refer_to_facility_chaplain_or_religious_leader_within_24h_for_spiritual_support_visit';
  if (religious_dietary_restrictions === 'yes') plan = 'notify_dietary_services_of_religious_dietary_restrictions_halal_kosher_vegetarian_other';
  if (religious_practice_interfered_by_treatment === 'yes') plan = 'work_with_medical_team_to_accommodate_religious_practices_prayer_times_or_observances';
  return {
    plan,
    elements: ['FICA_Faith', 'I_Importance_and_influence_on_care_decisions', 'C_Community_religious_or_spiritual_community', 'A_Address_spiritual_needs_in_care_plan'],
    documentation: 'spiritual_history_document_in_chart_with_consent_for_chaplain_referral',
    citation: CITATIONS.CPSC_SPIRITUAL,
  };
}

function endOfLifeCareCoordination(input) {
  const { advance_directive_present, code_status, surrogate_decision_maker, palliative_care_consult, hospice_eligible, life_expectancy_estimate, goals_of_care_discussion_documented, comfort_care_plan, family_meeting_held } = input;
  let plan = 'goals_of_care_discussion_with_patient_and_family_within_24h_of_recognition_of_life_limiting_illness';
  if (palliative_care_consult === 'no' && life_expectancy_estimate === 'below_12_months') plan = 'palliative_care_consult_for_symptom_management_goals_of_care_clarification';
  if (hospice_eligible === 'yes' && life_expectancy_estimate === 'below_6_months') plan = 'hospice_referral_for_end_of_life_care_at_home_or_inpatient_hospice_or_nursing_facility';
  if (comfort_care_plan === 'yes') plan = plan + '_comfort_measures_only_with_dyspnea_pain_delirium_secretions_nausea_management';
  let elements = ['assess_understanding_of_diagnis_and_prognosis', 'explore_values_goals_and_priorities', 'recommend_treatment_options_with_realistic_benefits_and_burdens', 'establish_treatment_decisions_and_documentation', 'plan_follow_up_with_communication'];
  return {
    plan, elements,
    legal: 'advance_directive_review_with_surrogate_decision_maker_clarification_code_status_documented',
    caregiver: 'caregiver_assessment_for_capacity_and_support_during_end_of_life_care_grief_resources_provided',
    citation: CITATIONS.CPSC_SPIRITUAL,
  };
}

function griefAndBereavement(input) {
  const { grief_stage, support_system_present, prior_loss_history, complicated_grief_risk_factors, professional_grief_counseling_needed, bereavement_followup_offered, cultural_bereavement_practices, immediate_family_count } = input;
  let plan = 'provide_immediate_grief_support_then_offer_long_term_bereavement_services_Q_months_per_need';
  let phases = ['anticipatory_grief_recognize_during_illness', 'acute_grief_first_6_months_intense_emotional_response', 'integrated_grief_6_to_24_months_adapt_to_loss', 'longing_grief_continuing_with_normal_growth'];
  if (complicated_grief_risk_factors === 'yes') plan = 'professional_grief_therapy_referral_with_early_recognition_of_prolonged_grief_disorder_above_12_months_with_impairment';
  return {
    plan, phases,
    risk_factors: ['sudden_or_unexpected_loss', 'violent_death_trauma', 'multiple_losses_concurrent', 'no_support_system', 'prior_mental_health_history', 'children_grieving_parent_loss', 'caregiver_complex_relationship_with_deceased'],
    resources: ['grief_support_groups_hospital_or_community_based', 'professional_grief_counseling', 'online_grief_resources_Winston_Child_foundation', 'religious_or_spiritual_support_per_family_preference', 'family_friends_for_informal_support'],
    citation: CITATIONS.NASW_SPIRITUAL,
  };
}

function culturalAndReligiousConsiderations(input) {
  const { primary_language, cultural_background, gender_care_provider_preference, family_decision_making_structure, end_of_life_cultural_practice, modesty_considerations, religious_observance_during_admission, body_handling_cultural, dietary_restrictions } = input;
  let plan = 'cultural_assessment_at_admission_with_documentation_and_team_briefing';
  if (gender_care_provider_preference === 'yes') plan = 'offer_same_gender_provider_when_possible_per_availability_and_clinical_appropriateness';
  if (family_decision_making_structure === 'collective') plan = 'engage_family_leadership_with_collective_decision_making_while_assuring_patient_capacity_and_autonomy';
  if (end_of_life_cultural_practice === 'specific_religious_rituals') plan = 'coordinate_with_chaplain_or_religious_leader_for_rituals_during_end_of_life_per_family_request';
  if (body_handling_cultural === 'specific_post_mortem_care') plan = 'coordinate_with_morgue_and_familial_religious_leader_for_specific_post_mortem_practices';
  return {
    plan,
    modesty: 'provide_gender_concordant_care_when_requested_use_drape_for_exams_provide_privacy_for_dressing_changing_ablutions',
    language: 'professional_interpreter_for_non_english_speaking_patients_with_family_or_staff_interpreter_engaged_in_emergency_brief_interactions_only',
    citation: CITATIONS.CPSC_SPIRITUAL,
  };
}

function facilityChaplainReferral(input) {
  const { reason_for_referral, religion_preferred, urgency, location_in_unit, family_present, prior_chaplain_visit, prior_religious_engagement } = input;
  let plan = 'facility_chaplain_visit_within_24h_per_non_urgent_consult_within_4h_for_urgent_consult_within_1h_for_end_of_life_or_crisis';
  if (religion_preferred === 'muslim') plan = 'Muslim_chaplain_visit_with_Quran_prayer_arrangements_ablution_facility_privacy_for_patient_Qibla_direction';
  if (religion_preferred === 'christian') plan = 'Christian_chaplain_visit_with_communion_or_prayer_engagement_as_desired';
  if (religion_preferred === 'jewish') plan = 'Jewish_chaplain_or_rabbi_visit_with_Halachic_considerations_Shabbat_observance_hospital_kosher_food_options';
  if (urgency === 'end_of_life' || urgency === 'crisis') plan = 'immediate_chaplain_response_with_24_7_on_call_availability';
  return {
    plan,
    resources: ['sacred_texts_or_prayer_books_available_per_religion', 'prayer_room_or_quiet_space_in_facility', 'religious_items_or_articles_accommodated_per_patient_request', 'community_religious_leaders_welcome_to_visit_24_7_with_security_clearance'],
    documentation: 'chaplain_visit_documented_with_interventions_offered_and_outcomes',
    citation: CITATIONS.CPSC_SPIRITUAL,
  };
}

module.exports = { spiritualCareAssessment, endOfLifeCareCoordination, griefAndBereavement, culturalAndReligiousConsiderations, facilityChaplainReferral, CITATIONS, ValidationError };