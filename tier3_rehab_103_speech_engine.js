/**
 * TIER3_REHAB-103 Speech-Language Pathology Engine
 * Pediatric speech + Adult voice disorders + Cognitive-communication therapy + AAC + Stuttering
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASHA_SPEECH: 'ASHA Practice Portal 2024', ASHA_VOICE: 'ASHA Voice Disorders 2022' };

function pediatricSpeechDelay(input) {
  const { age_months, expressive_language_age_equivalent_months, receptive_language_age_equivalent_months, hearing_test_passed, autism_screening_result, prior_early_intervention, family_history_speech_delay } = input;
  let diagnosis = 'expressive_language_delay_isolated';
  if (receptive_language_age_equivalent_months < 12 && age_months >= 18) diagnosis = 'global_language_delay_or_autism_spectrum_disorder_screen';
  let plan = 'early_intervention_services_2x_per_week_with_parent_coaching_Hanen_It_Takes_Two_to_Talk';
  if (age_months >= 36 && expressive_language_age_equivalent_months < 24) plan = 'augment_communication_picture_exchange_plus_intensive_SLP_3x_per_week';
  return {
    diagnosis, plan,
    milestones: ['6mo_cooing_12mo_first_words_24mo_2_word_phrases_36mo_3_word_sentences_4y_conversation'],
    red_flags_for_referral: ['no_first_words_by_18_months', 'no_2_word_phrases_by_24_months', 'regression_in_speech_or_social_skills', 'limited_eye_contact_or_joint_attention', 'not_responding_to_name_by_12_months'],
    hearing: 'audiology_assessment_must_rule_out_hearing_loss_before_SLP_diagnosis',
    citation: CITATIONS.ASHA_SPEECH,
  };
}

function adultVoiceDisorders(input) {
  const { voice_quality_grade_roughness_breathiness, vocal_fold_lesion_suspected, reflux_laryngitis, vocal_overuse_professional_singer_teacher, paradoxical_vocal_fold_motion, neurological_voice_disorder } = input;
  let plan = 'behavioral_voice_therapy_with_stevens_protocol_or_vocal_function_exercises';
  if (vocal_fold_lesion_suspected === 'yes' || neurological_voice_disorder === 'yes') plan = 'refer_ENT_for_video_laryngoscopy_then_targeted_voice_therapy';
  if (reflux_laryngitis === 'yes') plan = 'PPI_8_weeks_plus_voice_therapy_and_dietary_modifications';
  if (paradoxical_vocal_fold_motion === 'yes') plan = 'PVFM_protocol_with_respiratory_retraining_and_as_needed_inhalers';
  return {
    plan,
    risk_factors: ['smoking_alcohol', 'reflux_laryngopharyngeal', 'phonotrauma_teachers_singers_call_center', 'neurological_PD_or_ALS_or_spasm_dysphonia'],
    voice_hygiene: ['adequate_hydration_8_to_10_glasses_water', 'limit_caffeine_alcohol', 'avoid_throat_clearing', 'use_amplification_for_professional_users'],
    citation: CITATIONS.ASHA_VOICE,
  };
}

function cognitiveCommunicationTherapy(input) {
  const { tbi_or_stroke_etiology, attention_deficit_score, memory_deficit_present, executive_function_deficit, social_pragmatic_deficit, anosognosia_present, return_to_work_goal } = input;
  let plan = 'metacognitive_strategy_training_with_external_memory_aids_calendar_apps_alarms';
  let session_focus = ['attention_training_pomodoro_technique_Q_session', 'memory_compensatory_strategies_external_aids', 'executive_function_goal_management_training', 'social_pragmatic_skills_role_play_scenarios'];
  if (return_to_work_goal === 'yes') session_focus.push('vocational_rehab_with_workplace_cognitive_accommodations_supported_employment');
  return {
    plan, session_focus,
    specific_protocols: ['goal_management_training_GMT', 'attention_processing_training_TAP', 'prospective_memory_training_with_alarms', 'social_skills_training_for_pragmatics'],
    family_education: 'family_education_on_cognitive_deficits_recovery_timeline_avoidance_of_overstimulation',
    citation: CITATIONS.ASHA_SPEECH,
  };
}

function augmentativeAlternativeCommunication(input) {
  const { communication_impairment_severity, motor_skills_for_device, vision_ok, cognition_to_use_aac, no_tech_low_tech_high_tech, partner_training_needed, progressive_disorder } = input;
  let device_recommendation = 'low_tech_picture_communication_board_or_PECS_first_step';
  if (motor_skills_for_device === 'good') device_recommendation = 'dedicated_SGD_speech_generating_device_with_dynamic_display_touch_or_eye_gaze';
  if (progressive_disorder === 'yes') device_recommendation = 'AAC_introduced_early_for_motor_decline_progressive_als_or_late_stage_dementia';
  return {
    device_recommendation,
    selection_factors: ['motor_access_touch_or_eye_gaze_or_switch', 'language_complexity_picture_vs_orthographic', 'portability_must_attach_to_wheelchair', 'voice_output_high_quality_for_adult'],
    partner_training: 'communication_partner_training_for_understanding_AAC_user_response_time_signaling_use_of_yes_no_consistent_responses',
    monitoring: 'use_frequency_Q1_month_communication_success_rate_Q3_months_device_maintenance_Q6_months',
    citation: CITATIONS.ASHA_SPEECH,
  };
}

function stutteringManagement(input) {
  const { age_years, family_history_stuttering, duration_years, secondary_behaviors_present, impact_on_communication, social_anxiety_present } = input;
  let plan = 'Lidcombe_program_for_preschool_age_or_RESTART_demands_and_capacities_model_for_school_age';
  if (impact_on_communication === 'severe' || social_anxiety_present === 'yes') plan = 'comprehensive_stuttering_program_with_anxiety_treatment_CBT';
  return {
    plan,
    therapy_approaches: ['Lidcombe_program_age_2_to_6_parent_led', 'gradual_increase_in_length_and_complexity_of_utterance_GILCU', 'prolonged_speech_school_age_adults', 'avoidance_reduction_therapy_adults_for_anxiety', 'speech_easier_when_stuttering_more_fluent_speech_techniques'],
    parent_training: 'reduce_time_pressure_reduce_questions_praise_fluent_speech_praise_attempted_repair_of_stuttered_speech',
    self_help: 'National_Stuttering_Association_self_help_groups_online_resources_NSA_friends',
    citation: CITATIONS.ASHA_SPEECH,
  };
}

module.exports = { pediatricSpeechDelay, adultVoiceDisorders, cognitiveCommunicationTherapy, augmentativeAlternativeCommunication, stutteringManagement, CITATIONS, ValidationError };