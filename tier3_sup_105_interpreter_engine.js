/**
 * TIER3_SUP-105 Language Interpreter Services Engine
 * Interpreter access + Qualified interpreter + Document translation + Health literacy + Video remote
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NCIHC_INTERP: 'NCIHC Standards 2024', TITLE_VI: 'Title VI Civil Rights Act Limited English 2024' };

function interpreterAccessDetermination(input) {
  const { primary_language, language_proficiency_english, prior_interpreter_use, visit_type_complexity, sensitive_topic_discussion, consent_required, advance_directive_discussion, end_of_life_discussion } = input;
  let plan = 'professional_medical_interpreter_for_all_non_english_speaking_patients_per_Title_VI_Civil_Rights_Act';
  if (language_proficiency_english === 'limited' || language_proficiency_english === 'not_at_all') plan = 'professional_medical_interpreter_required_at_every_clinical_encounter';
  if (sensitive_topic_discussion === 'yes' || consent_required === 'yes' || end_of_life_discussion === 'yes') plan = plan + '_with_certified_medical_interpreter_per_NCIHC_standards_no_family_or_minor_interpreter';
  let modes = ['in_person_interpreter_for_complex_visits_OB_oncology_pediatric_end_of_life', 'video_remote_interpreter_VRI_for_business_hours_visits', 'telephonic_interpreter_for_after_hours_or_emergency_visits', 'written_translation_for_discharge_instructions_consent_forms_advance_directives'];
  return {
    plan, modes,
    prohibition: 'NO_family_member_or_minor_under_18_for_interpretation_per_Title_VI_or_for_consent_discussion',
    legal: 'Title_VI_of_Civil_Rights_Act_requires_facilities_receiving_federal_funds_to_provide_meaningful_access_for_LEP_limited_english_proficient',
    citation: CITATIONS.NCIHC_INTERP,
  };
}

function qualifiedInterpreterVerification(input) {
  const { interpreter_credential, language_pair, certification_status, prior_healthcare_interpreter_experience, knowledge_medical_terminology, professional_or_volunteer } = input;
  let qualified = 'qualified_if_certified_NCIHC_or_CHI_or_CCHI_per_language_with_medical_terminology_proficiency';
  if (interpreter_credential === 'certified_NCIHC_CHI_CCHI') qualified = 'certified_qualified_for_complex_medical_interpretation';
  if (professional_or_volunteer === 'volunteer') qualified = 'volunteer_unqualified_for_complex_or_consent_discussion_refer_to_professional';
  if (knowledge_medical_terminology === 'limited') qualified = 'not_qualified_for_medical_interpretation_refer_to_certified_interpreter';
  return {
    qualified,
    credentials: ['NCIHC_National_Council_on_Interpreting_in_Health_Care', 'CHI_Certification_for_Health_Care_Interpreters', 'CCHI_Commission_for_Certification_of_Healthcare_Interpreters', 'state_certification_per_MOH_KSA_or_MOH_other_govt'],
    competency: 'certified_interpreter_with_passing_score_in_oral_and_medical_interpretation_examination_in_target_language_pair',
    citation: CITATIONS.NCIHC_INTERP,
  };
}

function documentTranslation(input) {
  const { document_type, source_language, target_language, urgency, document_length, medical_jargon_density, regulatory_required_translation, certified_translation_required } = input;
  let plan = 'professional_translation_service_for_all_clinical_documents_consent_forms_advance_directives_discharge_instructions';
  if (document_type === 'consent_form' || document_type === 'advance_directive') plan = 'certified_legal_translation_with_notarization_or_legal_review';
  if (document_type === 'discharge_instructions') plan = 'plain_language_translation_with_pictograms_for_health_literacy_reduced_medical_jargon_5th_to_8th_grade_level';
  if (urgency === 'emergency') plan = 'immediate_translation_within_24h_with_team_pickup_for_critical_emergency_visit_documentation';
  return {
    plan,
    considerations: ['avoid_machine_translation_for_critical_clinical_documents', 'professional_human_translator_with_healthcare_specialization', 'formatting_culturally_adapted_with_appropriate_imagery_for_understanding', 'audit_Q_quarter_for_quality_assurance_of_translations'],
    citation: CITATIONS.NCIHC_INTERP,
  };
}

function healthLiteracyCommunication(input) {
  const { health_literacy_assessment, education_level, language_complexity_level, reading_level_5th_to_8th, teach_back_used, visual_aids_used, plain_language_used } = input;
  let plan = 'plain_language_at_5th_to_8th_grade_level_with_teach_back_for_all_patient_education';
  let strategies = ['avoid_medical_jargon_use_plain_language', 'use_teach_back_method_to_assess_understanding', 'provide_written_material_at_appropriate_reading_level', 'use_pictograms_and_visual_aids_for_complex_concepts', 'limit_information_to_3_key_points_per_encounter', 'use_show_me_technique_for_medication_administration'];
  if (health_literacy_assessment === 'low') plan = plan + '_with_visual_aids_family_caregiver_engagement_simplified_written_instructions_and_repeated_teach_back';
  return {
    plan, strategies,
    teach_back: 'ask_patient_to_explain_in_their_own_words_what_they_need_to_know_or_do_then_re_teach_if_gap',
    universal_precautions: 'assume_all_patients_have_low_health_literacy_for_safety_with_clear_communication',
    citation: CITATIONS.NCIHC_INTERP,
  };
}

function remoteVideoInterpreter(input) {
  const { vri_available, language_pair_supported, technical_setup_quality, prior_vri_use, visit_type_complexity, urgent_or_routine, time_to_connect_min } = input;
  let plan = 'video_remote_interpreter_VRI_for_routine_visits_with_quick_24_7_access_for_after_hours_emergency_visits';
  let qualifications = 'use_certified_interpreter_via_secure_VRI_platform_with_HIPAA_compliant_video_software_and_audio_quality';
  if (visit_type_complexity === 'high' || urgent_or_routine === 'complex_decision') plan = plan + '_consider_in_person_interpreter_for_complex_sensitive_visits';
  if (technical_setup_quality === 'poor') plan = plan + '_fall_back_to_telephonic_interpreter_within_5_min_if_VRI_fails';
  return {
    plan, qualifications,
    advantages: ['rapid_access_24_7_for_over_200_languages', 'visual_cues_and_nonverbal_communication_visible', 'cost_effective_for_less_frequent_languages', 'no_interpreter_travel_required'],
    disadvantages: ['technology_failure_risk', 'less_personal_than_in_person', 'limited_for_deaf_with_sign_language_preferred_in_person', 'privacy_in_open_ward_areas_concern_for_sensitive_topics'],
    citation: CITATIONS.NCIHC_INTERP,
  };
}

module.exports = { interpreterAccessDetermination, qualifiedInterpreterVerification, documentTranslation, healthLiteracyCommunication, remoteVideoInterpreter, CITATIONS, ValidationError };