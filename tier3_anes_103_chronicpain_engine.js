/**
 * TIER3_ANES-103 Chronic Pain Engine
 * Multimodal pain + Opioid stewardship + Neuropathic pain + Interventional procedures + Pain psychology
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { CDC_OPIOID: 'CDC Opioid Prescribing 2022', AAPM_PAIN: 'AAPM Chronic Pain 2024' };

function multimodalPainManagement(input) {
  const { pain_chronicity_acute_or_chronic, pain_type_nociceptive_neuropathic_mixed, location, intensity_nrs_0_to_10, prior_medications_tried, comorbidities, age_above_65, opioid_use_current, social_determinants } = input;
  let plan = 'multimodal_analgesia_with_combination_of_mechanisms_nsaid_acetaminophen_gabapentinoid_topical_physical_therapy_cognitive';
  if (pain_type_nociceptive_neuropathic_mixed === 'yes') plan = plan + '_with_combined_nsaid_for_nociceptive_and_gabapentin_or_duloxetine_for_neuropathic';
  if (intensity_nrs_0_to_10 >= 7 && opioid_use_current === 'no') plan = plan + '_consider_short_term_opioid_with_clear_goals_and_plan_for_weaning';
  if (age_above_65 === 'yes') plan = plan + '_with_reduced_doses_and_avoidance_of_anticholinergic_and_high_dose_opioids';
  if (social_determinants === 'low_health_literacy_or_financial') plan = plan + '_with_low_cost_generics_and_clear_teach_back_education';
  return {
    plan,
    components: ['non_opioid_analgesics', 'adjuvant_medications', 'physical_therapy', 'cognitive_behavioral_therapy', 'interventional_procedures', 'lifestyle_modifications', 'complementary_medicine'],
    opioid_indications: ['cancer_pain', 'end_of_life_pain', 'acute_post_op_pain_with_clear_plan', 'failed_non_opioid_with_documented_goal_oriented_care_plan'],
    citation: CITATIONS.CDC_OPIOID,
  };
}

function opioidStewardshipProtocol(input) {
  const { patient_on_chronic_opioid, morphine_equivalent_daily_dose_MED, opioid_indication_documented, risk_factors_overdose, naloxone_co_prescribed, controlled_substance_agreement_signed, urine_drug_screen_Q_year, pdmp_review_Q_year, opioid_rotation_considered } = input;
  let plan = 'chronic_opioid_therapy_protocol_with_all_safety_measures';
  if (morphine_equivalent_daily_dose_MED >= 50) plan = plan + '_consider_tapering_to_below_50_MED_with_caveat_for_cancer_or_palliative_patients';
  if (morphine_equivalent_daily_dose_MED >= 90) plan = plan + '_mandatory_tapering_consultation_with_pain_specialist_or_palliative_care';
  if (risk_factors_overdose === 'yes') plan = plan + '_co_prescribe_naloxone_with_education_and_controlled_substance_agreement_signed_annually';
  return {
    plan,
    cdc_recommendations: ['start_low_and_go_slow_for_chronic_non_cancer_pain', 'limit_30_to_50_MED_for_most_patients_above_50_MED_review_risks', 'co_prescribe_naloxone_for_above_50_MED_or_overdose_risk_factors', 'use_PDMP_review_Q_year_for_all_opioid_prescriptions', 'urine_drug_screen_Q_year', 'controlled_substance_agreement_signed_annually'],
    documentation: ['risk_benefit_discussion_documented', 'function_improvement_goals_documented_with_PROMIS_or_other', 'trial_withdrawal_per_period_for_efficacy_review', 'coordinated_care_with_other_prescribers_to_avoid_duplication'],
    citation: CITATIONS.CDC_OPIOID,
  };
}

function neuropathicPainManagement(input) {
  const { pain_type_diagnosis, diabetes_present, post_herpetic_neuralgia, trigeminal_neuralgia, central_pain_stroke_or_ms, prior_treatments_tried, mood_disorder_present, age_above_65, opioid_consideration } = input;
  let first_line = 'gabapentin_300mg_TID_titrate_to_1800_to_3600mg_per_day_divided_or_pregabalin_75mg_BID_titrate_to_300_to_600mg_per_day';
  if (post_herpetic_neuralgia === 'yes') first_line = 'gabapentin_or_pregabalin_or_8pct_capsaicin_patch_or_lidocaine_5pct_patch_for_local_PHN';
  if (trigeminal_neuralgia === 'yes') first_line = 'carbamazepine_200mg_BID_titrate_to_400_to_800mg_per_day_with_liver_function_monitoring_for_neutropenia_SJS_risk';
  if (central_pain_stroke_or_ms === 'yes') first_line = 'gabapentin_or_pregabalin_or_consider_IV_lidocaine_or_IV_ketamine_infusion_with_anesthesia_pain_team';
  if (mood_disorder_present === 'yes') first_line = 'duloxetine_30_to_60mg_daily_with_dual_benefit_for_depression_and_neuropathic_pain';
  return {
    first_line,
    second_line: ['duloxetine_30_to_60mg_daily', 'amitriptyline_25_to_75mg_daily_with_QTc_monitoring_avoid_above_age_65_or_cardiac_history', 'topiramate_for_neuropathic_with_migraine', 'tramadol_or_tapentadol_with_caution_for_seizure_serotonin_syndrome_risk'],
    third_line: ['lidocaine_5pct_patch_topical', 'capsaicin_patch_8pct_for_PHN', 'botulinum_toxin_for_focal_neuropathic', 'spinal_cord_stimulation_for_refractory_CRPGN_failed_back_surgery_syndrome'],
    citation: CITATIONS.AAPM_PAIN,
  };
}

function interventionalPainProcedures(input) {
  const { procedure_indication, target_anatomy, contrast_use, fluoroscopy_or_ultrasound, prior_response, anticoagulation_status, infection_status, prior_dual_antiplatelet } = input;
  let plan = 'interventional_procedure_per_indication_with_image_guidance_for_accuracy_and_safety';
  if (procedure_indication === 'lumbar_epidural_steroid') plan = plan + '_for_radiculopathy_with_image_guidance_and_review_anti_coag_status_per_ASRA';
  if (procedure_indication === 'facet_joint_injection') plan = plan + '_for_facet_arthropathy_with_medial_branch_block_diagnostic_then_radiofrequency_ablation_therapeutic';
  if (procedure_indication === 'sacroiliac_joint_injection') plan = plan + '_for_SI_joint_dysfunction_with_image_guidance_and_diagnostic_followed_by_radiofrequency';
  if (procedure_indication === 'spinal_cord_stimulation') plan = 'trial_stimulator_5_to_7_days_with_pain_diary_then_permanent_implant_if_greater_than_50pct_improvement';
  return {
    plan,
    considerations: ['review_imaging_to_confirm_anatomy_and_pathology', 'informed_consent_with_risks_benefits_alternatives', 'anticoagulation_review_per_ASRA_2018_per_procedure_type', 'consider_diagnostic_vs_therapeutic_injection_with_dual_block_design'],
    safety: ['avoid_intrathecal_or_intravascular_injection_with_aspiration_and_live_imaging', 'limit_steroid_dose_per_year_to_under_300mg_equivalent_triamcinolone_to_avoid_adrenal_suppression', 'monitor_for_procedural_complications_hematoma_infection_nerve_injury'],
    citation: CITATIONS.AAPM_PAIN,
  };
}

function painPsychologyAndBehavioral(input) {
  const { chronic_pain_duration_years, depression_present, anxiety_present, catastrophizing_score, fear_avoidance_present, substance_use_history, motivation_for_psychology, prior_psychotherapy_trial } = input;
  let plan = 'pain_psychology_assessment_and_intervention_with_CBT_mindfulness_acceptance_and_commitment_therapy_ACTT';
  if (depression_present === 'yes') plan = plan + '_plus_psychiatric_treatment_for_depression_optimization_to_support_pain_outcomes';
  if (catastrophizing_score === 'high') plan = plan + '_focus_on_catastrophizing_reduction_with_cognitive_restructuring';
  if (fear_avoidance_present === 'yes') plan = plan + '_graded_exposure_to_feared_activities_with_activity_pacing';
  if (substance_use_history === 'yes') plan = plan + '_collaborative_care_with_addiction_specialty_for_safe_pain_management';
  return {
    plan,
    modalities: ['cognitive_behavioral_therapy_for_pain_CBT_P', 'mindfulness_based_stress_reduction_MBSR', 'acceptance_and_commitment_therapy_ACT', 'biofeedback_4_to_8_sessions_for_muscle_tension_headache_FMS', 'sleep_hygiene_for_pain_sleep_disturbance'],
    outcomes: 'pain_psychology_associated_with_reduced_catastrophizing_improved_function_reduced_disability_reduced_medication_use_better_quality_of_life',
    access: 'in_patient_pain_clinic_or_telehealth_options_with_psychologist_or_psychiatrist_with_pain_fellowship_training',
    citation: CITATIONS.AAPM_PAIN,
  };
}

module.exports = { multimodalPainManagement, opioidStewardshipProtocol, neuropathicPainManagement, interventionalPainProcedures, painPsychologyAndBehavioral, CITATIONS, ValidationError };