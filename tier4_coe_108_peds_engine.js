/**
 * TIER4_COE-108 Pediatric Center of Excellence Engine
 * Pediatric COE + Age-specific care + Family-centered care + Pediatric medication + Transition
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAP_PEDS_COE: 'AAP Center of Excellence 2024', NACHRI_PEDS: 'Children Hospital Association Standards 2024' };

function pediatricCOECertification(input) {
  const { annual_pediatric_admits, age_specific_protocols_present, pediatric_specialists_available, pediatric_emergency_department_present, pediatric_icu_present, child_life_specialist_program, family_centered_care_program, transition_to_adult_program, pediatric_quality_program } = input;
  let certification = 'pediatric_general_care_program';
  if (annual_pediatric_admits >= 1000 && pediatric_specialists_available === 'yes' && age_specific_protocols_present === 'yes') certification = 'pediatric_center_with_specialty_care';
  if (pediatric_emergency_department_present === 'yes' && pediatric_icu_present === 'yes' && child_life_specialist_program === 'yes' && family_centered_care_program === 'yes') certification = 'comprehensive_pediatric_center_with_quaternary_care';
  return {
    certification,
    team_requirements: ['pediatric_hospitalists_with_specialty_board_certification', 'pediatric_subspecialists_per_subspecialty_on_call_or_in_house', 'pediatric_nurses_with_specialty_certification_CPN_or_PCCN_for_ICU', 'pediatric_surgeons_with_specialty_certification', 'pediatric_anesthesiologists_with_PALS_fellowship_training', 'child_life_specialists_with_play_therapy_and_preparation_for_procedures'],
    environment: ['pediatric_friendly_environment_with_age_appropriate_decor', 'play_rooms_for_development_and_family_time', 'family_accommodations_with_Ronald_McDonald_House_or_hotel_options_for_long_stays', 'sibling_areas_for_visiting_siblings_with_child_care_support', 'school_program_with_hospital_school_for_continuing_education_during_long_admissions'],
    citation: CITATIONS.AAP_PEDS_COE,
  };
}

function pediatricAgeSpecificCare(input) {
  const { age_years, developmental_stage, vital_signs_normal_for_age, weight_kg, growth_chart_position, immunization_status, social_emotional_development, family_engaged, school_continuity, chronic_conditions_present } = input;
  let plan = 'age_appropriate_care_with_developmental_milestones_assessment_with_age_specific_vital_sign_thresholds_per_PALS_and_age_appropriate_communication';
  if (age_years < 3) plan = plan + '_infant_toddler_care_with_attachment_based_care_with_parent_rooming_in_with_lactation_support';
  if (age_years >= 3 && age_years < 6) plan = plan + '_preschool_care_with_developmental_play_with_preparation_for_procedures_with_child_life';
  if (age_years >= 6 && age_years < 12) plan = plan + '_school_age_care_with_cognitive_appropriate_explanations_with_school_program_for_long_admissions';
  if (age_years >= 12) plan = plan + '_adolescent_care_with_peer_support_with_developmental_appropriate_privacy_with_consent_per_age_with_mature_minor_doctrine';
  return {
    plan,
    vital_signs: 'age_specific_normal_ranges_per_PALS_with_tachycardia_and_hypotension_threshold_age_specific_for_sepsis_recognition',
    growth: 'growth_chart_per_WHO_or_CDC_with_failure_to_thrive_or_obesity_assessment_with_nutrition_intervention',
    development: 'developmental_milestone_screening_with_Ages_and_Stages_questionnaire_or_others_with_early_intervention_referral_for_delays',
    family: 'family_centered_rounds_with_family_presence_at_handoffs_with_shared_decision_making_per_Family_Centered_Care_principles',
    citation: CITATIONS.AAP_PEDS_COE,
  };
}

function pediatricMedicationDosing(input) {
  const { age_years, weight_kg, bsa_m2, drug_name, indication, renal_function_egfr, hepatic_function, prior_allergy, drug_interaction_review, age_appropriate_formulation } = input;
  let dose_calculation = 'dose_per_kg_or_per_kg_per_day_or_per_kg_per_dose_with_maximum_adult_dose_cap';
  let route = 'oral_liquid_or_suspension_for_young_children_who_cannot_swallow_tablets_with_appropriate_palatable_formulation';
  if (age_appropriate_formulation !== 'available') route = route + '_consider_compounding_pharmacy_or_alternate_drug_with_pediatric_appropriate_formulation';
  let caution = ['weight_based_dosing_for_obese_children_with_actual_or_ideal_body_weight_per_drug_with_dose_per_ideal_weight_to_avoid_overdose', 'renal_adjustment_for_drugs_cleared_renally_with_schwartz_formula_egfr_for_pediatric', 'hepatic_adjustment_for_drugs_cleared_hepatically_per_liver_function'];
  return {
    dose_calculation, route, caution,
    safety: ['double_check_with_two_nurses_or_physician_for_high_risk_medications_chemo_insulin_opioids', 'pediatric_specific_dose_limits_with_max_adult_dose', 'use_pediatric_compounding_pharmacy_for_unavailable_formulations', 'Broselow_tape_or_pediatric_dose_calculator_at_bedside_for_emergencies'],
    adherence: 'palatable_formulation_with_caregiver_education_for_dose_administration_with_QOL_adherence_assessment_for_chronic_conditions',
    citation: CITATIONS.AAP_PEDS_COE,
  };
}

function familyCenteredRounds(input) {
  const { family_present_at_rounds, child_engaged, language_access, family_meeting_held, shared_decision_making_used, social_work_involved, interpreter_used, family_questions_addressed, plan_communicated } = input;
  let plan = 'daily_family_centered_rounds_with_family_presence_with_physician_nurse_team_with_shared_decision_making';
  let elements = ['introduce_team_members_with_role_description', 'open_with_what_concerns_brought_you_to_the_hospital', 'review_overnight_events_labs_imaging', 'share_today_plan_with_visual_aids_if_appropriate', 'ask_family_questions_and_concerns_with_teach_back', 'confirm_discharge_plan_with_criteria'];
  return {
    plan, elements,
    benefits: ['family_satisfaction_improved_with_Press_Ganey_top_box_above_85pct', 'medication_adherence_improved_with_understanding', 'reduce_medical_errors_with_family_involvement', 'reduce_LOS_with_clear_communication', 'reduce_readmissions_with_preparation'],
    documentation: 'rounds_documented_with_family_presence_attendees_shared_decision_making_actions',
    barriers: ['language_barrier_with_interpreter_required_per_Title_VI', 'cultural_barriers_with_cultural_competence_training', 'social_determinants_with_social_work_intervention', 'caregiver_burden_with_respite_options'],
    citation: CITATIONS.AAP_PEDS_COE,
  };
}

function pediatricToAdultTransition(input) {
  const { age_years, transition_age_target_18_to_25, chronic_conditions_list, current_pediatric_care_team, transition_readiness_assessment, transition_coordinator_present, joint_clinic_with_adult_team, transition_plan_documented, insurance_review } = input;
  let plan = 'structured_transition_program_starting_age_12_with_annual_readiness_assessment_with_transition_coordinator_for_complex_chronic_conditions';
  if (age_years >= 18 && transition_plan_documented !== 'yes') plan = plan + '_develop_transition_plan_immediately_with_adult_team_collaboration';
  if (joint_clinic_with_adult_team === 'no') plan = plan + '_transition_to_adult_team_with_joint_clinic_visits_for_seamless_handoff_with_Q_year_dual_follow_up';
  let readiness = ['Transition_Readiness_Assessment_Questionnaire_TRAQ_or_Am_I_On_Track_with_self_management_skills', 'medication_management_independence', 'appointment_management_independence', 'communication_with_provider_self_advocacy', 'knowledge_of_condition_and_treatment'];
  return {
    plan, readiness,
    components: ['structured_transition_visit_age_16_to_18_with_summary_letter_to_adult_team', 'medical_summary_passport_for_complex_conditions_with_diagnosis_medications_specialists_emergency_plan', 'adult_team_warm_handoff_with_first_visit_within_3_to_6_months_of_pediatric_last_visit', 'family_role_transition_with_adolescent_becoming_primary_decision_maker_with_caregiver_support'],
    insurance: 'review_insurance_for_adult_coverage_with_medicaid_or_chip_or_employer_based_with_transition_for_young_adults_age_19_to_26_with_special_provisions',
    citation: CITATIONS.NACHRI_PEDS,
  };
}

module.exports = { pediatricCOECertification, pediatricAgeSpecificCare, pediatricMedicationDosing, familyCenteredRounds, pediatricToAdultTransition, CITATIONS, ValidationError };