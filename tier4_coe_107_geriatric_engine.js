/**
 * TIER4_COE-107 Geriatric Center of Excellence Engine
 * Geriatric COE + Comprehensive geriatric assessment + Falls prevention + Polypharmacy + Dementia
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AGS_GERIATRIC: 'AGS Geriatric Standards 2024', ACE_GERIA: 'Acute Care for Elders 2024' };

function geriatricCOECertification(input) {
  const { age_65_plus_program, geriatricians_count, age_friendly_health_system_participation, comprehensive_geriatric_assessment, falls_prevention_program, polypharmacy_review, delirium_prevention, dementia_program, palliative_care_integration, caregiver_support_program, community_partnerships } = input;
  let certification = 'age_friendly_initiative_participant';
  if (age_65_plus_program === 'yes' && geriatricians_count >= 1 && age_friendly_health_system_participation === 'yes' && comprehensive_geriatric_assessment === 'yes') certification = 'geriatric_center_of_excellence_basic';
  if (falls_prevention_program === 'yes' && polypharmacy_review === 'yes' && delirium_prevention === 'yes' && dementia_program === 'yes' && palliative_care_integration === 'yes') certification = 'comprehensive_geriatric_center_with_age_friendly_4Ms';
  let gaps = [];
  if (comprehensive_geriatric_assessment !== 'yes') gaps.push('CGA_comprehensive_geriatric_assessment_required_for_age_friendly_recognition');
  if (polypharmacy_review !== 'yes') gaps.push('deprescribing_protocol_for_polypharmacy_required_for_4Ms_medication');
  return {
    certification, gaps,
    team_requirements: ['geriatrician_certified_with_fellowship_or_geriatric_specialty', 'geriatric_nurse_with_specialty_certification', 'social_worker_with_geriatric_specialty', 'pharmacist_with_geriatric_review', 'physical_therapist_with_balance_and_falls_expertise', 'dietitian_with_undernutrition_geriatric_expertise'],
    age_friendly_4Ms: ['what_MATTERS_align_with_patient_preferences_and_values', 'what_MEDICATION_review_with_deprescribing', 'what_MENTATION_screen_for_dementia_depression_delirium', 'what_MOBILITY_screen_for_falls_with_balance_intervention'],
    citation: CITATIONS.AGS_GERIATRIC,
  };
}

function comprehensiveGeriatricAssessment(input) {
  const { age_years, functional_status_adl_iadl, mobility_assessment_tug, cognitive_screen_moca_or_mmse, mood_screen_phq_9, nutrition_screen_mna, polypharmacy_medication_count, sensory_vision_hearing, social_support, advance_directive_present, goals_of_care_aligned } = input;
  let plan = 'CGA_with_multidimensional_assessment_with_interdisciplinary_team_geriatrician_nurse_social_worker_pharmacist_PT_with_documented_plan';
  let domains = ['medical_chronic_diseases_polyparmacy_symptom_burden', 'functional_ADL_IADL_with_patient_and_caregiver', 'mobility_with_TUG_30_sec_chair_stand_balance_with_falls_risk', 'cognition_with_MoCA_or_MMSE_with_serious_consideration_for_dementia_diagnosis', 'mood_with_PHQ_9_GDS_5_with_depression_treatment', 'nutrition_with_MNA_SGA_with_intervention_for_undernutrition', 'sensory_with_vision_hearing_assessment', 'social_with_caregiver_burden_financial_legal_advance_care_planning'];
  let intervention = 'individualized_care_plan_with_medication_optimization_falls_prevention_cognitive_support_nutrition_intervention_caregiver_support';
  return {
    plan, domains, intervention,
    documentation: 'CGA_documented_with_shared_decision_making_with_patient_and_family_with_Q_quarter_reassessment_for_active_issues',
    outcomes: 'reduce_adverse_events_falls_delirium_medication_related_problems_reduce_readmissions_improve_function_and_QOL',
    citation: CITATIONS.AGS_GERIATRIC,
  };
}

function polypharmacyDeprescribing(input) {
  const { patient_age, current_medication_count, polypharmacy_above_5_or_above_10, inappropriate_medications_beers_criteria, anticholinergic_burden, high_risk_medications_anticoagulant_antiplatelet_insulin_opioid, falls_history, cognitive_impairment, deprescribing_target_medications, goal_of_care } = input;
  let plan = 'review_medications_Q3_months_for_polypharmacy_with_deprescribing_protocol_per_deprescribing_org_with_5_step_protocol';
  let high_risk = ['anticholinergics_for_cognitive_risk', 'benzodiazepines_Z_drugs_for_falls_risk', 'antipsychotics_for_mortality_risk_in_dementia', 'PPIs_for_long_term_risk', 'NSAIDs_for_renal_GI_risk', 'sulfonylureas_for_hypoglycemia_risk'];
  if (falls_history === 'yes') plan = plan + '_consider_deprescribing_high_fall_risk_medications_per_deprescribing_org_protocols';
  if (cognitive_impairment === 'yes') plan = plan + '_consider_deprescribing_anticholinergics_with_consider_alternative_for_pain_sleep_psychiatric';
  return {
    plan, high_risk,
    deprescribing_protocol: ['review_indication_for_each_medication', 'assess_harm_vs_benefit_with_patient_goals', 'consider_deprescribing_one_medication_at_a_time_with_monitoring_plan', 'monitor_for_withdrawal_or_disease_flare_with_Q1_to_2_week_reassessment', 'document_shared_decision_making_with_patient_family_and_provider'],
    beers_criteria: 'AGS_Beers_Criteria_for_Potentially_Inappropriate_Medication_Use_in_Older_Adults_Q_year_update',
    citation: CITATIONS.AGS_GERIATRIC,
  };
}

function fallsPreventionProgram(input) {
  const { age_years, history_of_falls, mobility_TUG_score, gait_balance_assessment, vision_assessment, hearing_assessment, polypharmacy_medication_count, environmental_hazards_home_assessment, vitamin_d_level, prior_fall_injury_hip_fracture } = input;
  let plan = 'multifactorial_falls_assessment_with_otago_exercise_or_tai_chi_with_environmental_modification_with_medication_review';
  if (history_of_falls === 'recent_3_months') plan = plan + '_with_high_priority_intensity_with_home_safety_evaluation_with_PT_OT_visit';
  if (vitamin_d_level < 30) plan = plan + '_with_vitamin_D_replacement_1000_to_2000_IU_daily_with_calcium_for_bone_health_and_muscle_strength';
  let exercise = 'Otago_exercise_program_with_balance_strength_and_walking_5x_per_week_30_min_per_session_with_progression';
  if (prior_fall_injury_hip_fracture === 'yes') plan = plan + '_with_bone_density_assessment_with_DEXA_with_treatment_per_NOF_guidelines_with_PC_reduction_25pct_risk_of_refracture';
  return {
    plan, exercise,
    environment: ['remove_rugs_and_clutter', 'install_grab_bars_in_bathroom_and_shower', 'improve_lighting_with_night_lights', 'wear_sturdy_shoes_with_nonslip_soles', 'consider_hip_protectors_for_high_fall_risk_in_institutional_care'],
    medications: ['review_psychotropic_medications_benzodiazepines_antipsychotics_anticholinergics', 'review_cardiovascular_medications_antihypertensives_diuretics', 'review_pain_medications_opioids', 'review_sleep_aids'],
    monitoring: 'TUG_Q3_month_balance_Q3_month_engagement_with_home_exercise_per_QOL_function_Q3_month_with_PHQ_9_for_falls_anxiety',
    citation: CITATIONS.ACE_GERIA,
  };
}

function dementiaManagement(input) {
  const { dementia_stage_mild_moderate_severe, diagnosis_type_alzheimer_vascular_lewy_frontotemporal, mmse_or_moca_score, behavioral_symptoms, function_adl_iadl, caregiver_support, advance_directive_present, driving_safety_evaluation, pharmacologic_treatment_current } = input;
  let plan = 'comprehensive_dementia_care_with_non_pharmacologic_interventions_first_with_drug_treatment_when_indicated';
  if (dementia_stage_mild_moderate_severe === 'mild_to_moderate' && diagnosis_type_alzheimer_vascular_lewy_frontotemporal === 'alzheimer') plan = plan + '_with_cholinesterase_inhibitors_donepezil_rivastigmine_galantamine_with_Q3_month_assessment';
  if (behavioral_symptoms === 'present') plan = plan + '_with_non_pharmacologic_interventions_first_redirection_validation_engagement_routine_with_pharmacologic_treatment_per_need';
  if (dementia_stage_mild_moderate_severe === 'moderate_to_severe') plan = plan + '_consider_memantine_with_cholinesterase_inhibitor_for_combined_benefit_per_evidence';
  if (caregiver_support === 'frail_or_burdened') plan = plan + '_with_caregiver_support_respite_adult_day_services_caregiver_education_Alzheimers_Association_resources';
  return {
    plan,
    non_pharmacologic: ['structured_daily_routine_with_familiar_activities', 'environmental_safety_assessment_with_home_modifications', 'communication_strategies_simple_clear_reassuring', 'caregiver_education_with_Alzheimers_Association_TEACH_program', 'music_therapy_reminiscence_therapy_validation_therapy_for_BPSD_reduction'],
    pharmacologic_BPSD: ['risperidone_0.25_to_1mg_olanzapine_2.5_to_5mg_with_box_warning_for_increased_mortality_in_dementia_with_short_term_use_only', 'dextromethorphan_quinidine_for_agitation_in_alzheimer_dementia', 'consider_deprescribing_anticholinergics_with_worsening_cognition'],
    driving: 'driving_evaluation_with_neuropsychologist_or_OT_for_safety_with_state_DMV_referral_per_protocol_with_family_discussion',
    citation: CITATIONS.AGS_GERIATRIC,
  };
}

module.exports = { geriatricCOECertification, comprehensiveGeriatricAssessment, polypharmacyDeprescribing, fallsPreventionProgram, dementiaManagement, CITATIONS, ValidationError };