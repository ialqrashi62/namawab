/**
 * TIER3_ONC-104 Cancer Survivorship Engine
 * Survivorship care plan + Late effects surveillance + Psychosocial + Fertility + Secondary cancer screening
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASCO_SURVIVORSHIP: 'ASCO Survivorship 2024', COC_SURVIVORSHIP: 'Commission on Cancer Survivorship 2024' };

function survivorshipCarePlan(input) {
  const { cancer_type_treated, treatment_modality, treatment_completion_date, current_status_disease_free, comorbidities, age_at_survivorship, follow_up_provider, treatment_summary_needed } = input;
  let plan = 'treatment_summary_with_cancer_type_stage_treatments_received_dates_then_surveillance_plan_per_NCCN';
  let components = ['treatment_summary_with_chemo_doses_radiation_dose_surgery_details', 'surveillance_imaging_labs_per_cancer_type', 'screening_for_recurrence_per_protocol', 'late_effects_monitoring', 'psychosocial_assessment_and_support', 'healthy_lifestyle_counseling', 'vaccination_per_immunocompromised_status', 'comorbidity_management_cardiovascular_diabetes_obesity_bone_health'];
  let transition = 'transition_to_PCP_with_clear_surveillance_plan_and_who_follows_which_aspects_oncologist_or_PCP_define';
  return {
    plan, transition, components,
    recommended_lifestyle: ['smoking_cessation_critical_for_cancer_recurrence_risk_reduction', 'alcohol_limit_reduce_if_above_drink_per_day_for_women_2_for_men', 'physical_activity_150_min_weekly_plus_resistance', 'weight_management_for_healthy_BMI_18_to_25', 'Mediterranean_diet_or_DASH_high_fruits_vegetables_whole_grains'],
    citation: CITATIONS.ASCO_SURVIVORSHIP,
  };
}

function lateEffectsSurveillance(input) {
  const { prior_chemo_drugs, prior_radiation_site, prior_surgery_type, years_post_treatment, age_at_survivorship, baseline_cardiac_function, persistent_symptoms } = input;
  let monitoring = 'late_effects_surveillance_based_on_specific_exposures';
  let cardiac_monitoring = [];
  if (prior_chemo_drugs === 'anthracyclines' || prior_chemo_drugs === 'trastuzumab') cardiac_monitoring.push('echo_or_MUGA_Q_year_x_5_years_then_Q3_to_5_years_asymptomatic_assess_LVEF_known_anthracycline_dose_above_300mg_per_m2_increases_risk');
  let second_malignancy_risk = [];
  if (prior_radiation_site === 'mantle_field_lymphoma') second_malignancy_risk.push('breast_cancer_screening_mammography_Q_year_start_age_40_or_8_years_post_radiation');
  if (prior_chemo_drugs === 'alkylating_agents' || prior_radiation_site === 'pelvis') second_malignancy_risk.push('secondary_leukemia_risk_with_alkylators_MDS_surveillance_Q_year_CBC_for_10_years');
  let pulmonary = [];
  if (prior_chemo_drugs === 'bleomycin' || prior_radiation_site === 'chest') pulmonary.push('pulmonary_function_test_Q_year_baseline_or_bleomycin_dose_above_400units_increases_risk');
  return {
    monitoring, cardiac_monitoring, second_malignancy_risk, pulmonary,
    renal_neuro_endocrine: ['cisplatin_ototoxicity_and_peripheral_neuropathy_baseline_audiometry_Q_year_for_5_years', 'ifosfamide_renal_tubular_dysfunction_baseline_Q_year_creatinine_electrolytes_phosphate', 'bone_marrow_transplant_chronic_GVHD_long_term_follow_up'],
    citation: CITATIONS.COC_SURVIVORSHIP,
  };
}

function psychosocialSupportSurvivors(input) {
  const { depression_screen_score_phq_9, anxiety_screen_score_gad_7, fatigue_present, pain_present, financial_toxicity_present, return_to_work_status, social_support_quality, sexual_health_concerns, body_image_concerns, fear_of_recurrence_score } = input;
  let plan = 'screen_and_refer_to_supportive_services_per_ASCO_survivorship_guidelines';
  let referrals = [];
  if (depression_screen_score_phq_9 >= 10) referrals.push('psychiatry_or_psychology_for_depression_treatment_CBT_medication');
  if (anxiety_screen_score_gad_7 >= 10) referrals.push('psychology_for_anxiety_CBT_mindfulness_stress_reduction');
  if (fatigue_present === 'yes') referrals.push('cancer_rehabilitation_for_fatigue_assessment_exercise_program_hematologic_workup_rule_out_anemia_thyroid');
  if (pain_present === 'yes') referrals.push('pain_clinic_with_palliative_care_or_pain_specialist');
  if (financial_toxicity_present === 'yes') referrals.push('social_work_financial_navigator_for_disability_insurance_employment_rights_pharmacy_assistance');
  if (return_to_work_status === 'struggling') referrals.push('vocational_rehab_with_workplace_accommodations_support');
  if (fear_of_recurrence_score >= 5) referrals.push('cognitive_behavioral_therapy_for_fear_of_recurrence_with_acceptance_and_commitment_therapy');
  return {
    plan, referrals,
    survivor_support_groups: 'cancer_survivor_support_groups_in_person_or_online_per_cancer_type_or_age_group',
    sexual_health: 'sexual_health_counseling_for_post_treatment_dysfunction_fertility_concerns_body_image_referral_to_sexual_health_clinic',
    citation: CITATIONS.ASCO_SURVIVORSHIP,
  };
}

function fertilityPreservation(input) {
  const { sex, age_years, cancer_type, treatment_planned, pretreatment_fertility_discussion_done, partner_status, time_to_treatment_weeks, fertility_preservation_interest } = input;
  let plan = 'oncofertility_consultation_before_treatment_initiation_for_all_patients_of_reproductive_age';
  if (sex === 'female' && fertility_preservation_interest === 'yes') plan = 'embryo_egg_freezing_with_IVF_partner_or_donor_sperm_oocyte_cryopreservation_ovarian_tissue_freezing_consider_ovarian_transposition_if_radiation_to_pelvis';
  if (sex === 'male' && fertility_preservation_interest === 'yes') plan = 'sperm_banking_before_treatment_with_2_to_3_specimens_2_to_3_days_abstinence_each_testicular_sperm_extraction_TESE_for_azoospermia';
  if (time_to_treatment_weeks < 1) plan = 'urgent_treatment_with_consideration_of_GnRH_agonist_for_ovarian_protection_during_chemo_or_random_start_ovarian_stimulation';
  return {
    plan,
    post_treatment_assessment: 'post_treatment_fertility_assessment_at_6_to_12_months_with_AMH_for_ovarian_reserve_and_semen_analysis_for_male',
    gonadoprotection: ['GnRH_agonist_leuprolide_during_chemo_for_ovarian_protection_in_breast_cancer_evidence', 'testicular_shielding_during_radiation_when_feasible', 'ovarian_transposition_oophoropexy_before_pelvic_radiation'],
    contraception: 'effective_contraception_during_treatment_and_for_6_to_12_months_post_chemotherapy_to_avoid_pregnancy_during_teratogenic_exposure',
    citation: CITATIONS.ASCO_SURVIVORSHIP,
  };
}

function secondaryCancerScreening(input) {
  const { age_years, sex, prior_cancer_type, prior_treatments, family_history_other_cancers, genetic_syndrome_known, smoking_status, current_age_followup_years } = input;
  let screening = 'routine_cancer_screening_per_age_and_sex_population_guidelines_plus_cancer_specific_surveillance';
  let special_screening = [];
  if (prior_cancer_type === 'lymphoma_breast_cancer_with_chest_radiation') special_screening.push('breast_cancer_mammography_start_age_40_or_8_years_post_radiation_annual_MRI_if_BRCA_or_high_risk');
  if (prior_treatments === 'alkylating_agents_or_topoisomerase_II_inhibitors') special_screening.push('secondary_leukemia_risk_CBC_Q_year_for_10_years_post_treatment');
  if (genetic_syndrome_known === 'yes' && (genetic_syndrome === 'Lynch' || genetic_syndrome === 'FAP' || genetic_syndrome === 'BRCA')) special_screening.push('genetic_syndrome_specific_screening_per_NCCN_or_genetic_counseling_referral');
  if (smoking_status === 'current') special_screening.push('lung_cancer_LDCT_screening_Q_year_age_50_to_80_with_30_pack_year_smoking_history');
  return {
    screening, special_screening,
    standard_screenings: ['breast_mammography_age_40_to_74_Q1_to_2_years', 'cervical_pap_Q3_years_age_21_to_65_or_HPV_Q5_years', 'colon_Q_year_FIT_or_Q10_year_colonoscopy_age_45_to_75', 'lung_LDCT_Q_year_age_50_to_80_30_pack_year_smoking', 'prostate_PSA_shared_decision_age_55_to_69'],
    citation: CITATIONS.COC_SURVIVORSHIP,
  };
}

module.exports = { survivorshipCarePlan, lateEffectsSurveillance, psychosocialSupportSurvivors, fertilityPreservation, secondaryCancerScreening, CITATIONS, ValidationError };