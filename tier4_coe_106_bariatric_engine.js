/**
 * TIER4_COE-106 Bariatric Surgery Center of Excellence Engine
 * Bariatric COE + Patient selection + Surgical options + Pre/post-op care + Outcomes
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASMBS_COE: 'ASMBS Center of Excellence 2024', MBSAQIP: 'MBSAQIP Standards 2024' };

function bariatricCOECertification(input) {
  const { annual_bariatric_volume, surgeon_volume_per_year, mbsaqip_accredited, multidisciplinary_team, dietitian_support, psychologist_evaluation, exercise_specialist, medical_weight_management_program, comorbidity_resolution_tracking, complication_tracking, long_term_follow_up_program } = input;
  let certification = 'low_volume_bariatric_program';
  if (annual_bariatric_volume >= 125 && surgeon_volume_per_year >= 50 && mbsaqip_accredited === 'yes' && multidisciplinary_team === 'yes') certification = 'MBSAQIP_comprehensive_center_with_accreditation';
  if (comorbidity_resolution_tracking === 'yes' && complication_tracking === 'yes' && long_term_follow_up_program === '5_years_or_more') certification = 'center_of_excellence_with_robust_QM_and_outcomes';
  let gaps = [];
  if (surgeon_volume_per_year < 50) gaps.push('surgeon_volume_below_50_per_year_threshold_for_MBSAQIP_optimal_outcomes');
  if (psychologist_evaluation !== 'yes') gaps.push('psychologist_evaluation_required_pre_op_for_MBSAQIP_clearance_with_depression_eating_disorder_assessment');
  return {
    certification, gaps,
    team_requirements: ['bariatric_surgeons_with_minimum_50_lifetime_cases_and_25_per_year', 'registered_dietitian_with_bariatric_specialty', 'clinical_psychologist_with_pre_op_evaluation', 'exercise_physiologist_for_pre_and_post_op_program', 'medical_weight_management_clinician_for_pre_op_optimization', 'coordinator_nurse_for_continuity_of_care_and_Q_year_follow_up'],
    program_components: ['patient_selection_with_NIH_criteria_or_ASMBS', 'medical_weight_management_pre_op_3_to_12_months', 'pre_op_diet_2_to_4_weeks_with_liquid_or_very_low_calorie_for_liver_shrinkage', 'intra_op_standardized_with_drain_or_drain_free_with_QI_imaging'],
    citation: CITATIONS.ASMBS_COE,
  };
}

function bariatricPatientSelection(input) {
  const { bmi_initial, age_years, comorbidities_diabetes_HTN_apnea, prior_weight_loss_attempts, surgical_risk_assessment, psychosocial_assessment, contraindications_screening, candidate_for_RYGB_or_sleeve_or_banding, bariatric_team_review } = input;
  let surgical_indication = bmi_initial >= 40 || (bmi_initial >= 35 && comorbidities_diabetes_HTN_apnea === 'yes') || (bmi_initial >= 30 && metabolic_disease_uncontrolled);
  let procedure_choice = 'sleeve_gastrectomy_SG_first_choice_for_most_patients_with_balance_of_outcomes_and_lower_nutritional_risk';
  if (bmi_initial >= 50) procedure_choice = 'Roux_en_Y_gastric_bypass_RYGB_or_biliopancreatic_diversion_with_duodenal_switch_BPD_DS_for_higher_BMI_with_adequate_nutritional_follow_up_capacity';
  if (diabetes_uncontrolled === 'yes' && bmi_initial < 35) procedure_choice = 'RYGB_for_diabetes_remission_with_diabetes_counseling_for_metabolic_surgery_in_BMI_30_to_35';
  if (psychosocial_assessment === 'uncontrolled_psychiatric_or_eating_disorder') surgical_indication = 'POSTPONE_surgery_until_psychological_treatment_optimized';
  return {
    surgical_indication, procedure_choice,
    contraindications: ['uncontrolled_substance_use', 'uncontrolled_psychiatric_illness', 'active_eating_disorder_binge_eating_purging', 'medical_conditions_elevating_surgical_risk_unacceptable', 'inability_to_commit_to_lifelong_nutritional_follow_up_and_vitamin_replacement'],
    pre_op_workup: ['endoscopy_to_rule_out_H_pylori_or_other_pathology', 'sleep_study_for_obstructive_sleep_apnea', 'echo_or_stress_test_if_cardiac_risk', 'HBA1c_diabetes_control_assessment', 'thiamine_B12_folate_iron_vitamin_D_baseline', 'vitamin_D_replacement_if_deficient_to_avoid_post_op_secondary_hyperparathyroidism'],
    citation: CITATIONS.MBSAQIP,
  };
}

function bariatricPostOpManagement(input) {
  const { procedure_done, days_post_op, vitamin_compliance, protein_intake_g_per_day, hydration_liters, exercise_progression, dumping_syndrome, marginal_ulcer_for_RYGB, leak_or_stricture_present, weight_loss_pct, comorbidity_resolution } = input;
  let plan = 'standardized_post_op_protocol_with_diet_progression_clear_liquids_Q_week_then_full_liquids_then_pureed_then_soft_then_regular_with_target_60_to_80g_protein_per_day';
  if (dumping_syndrome === 'yes') plan = plan + '_with_dietary_counseling_for_dumping_prevention_with_small_frequent_meals_low_simple_carbs_separate_liquids_30min_from_meals';
  if (marginal_ulcer_for_RYGB === 'yes') plan = plan + '_PPI_for_3_to_6_months_post_op_or_longer_for_marginal_ulcer_resolution_with_smoking_cessation_and_H_pylori_treatment';
  if (leak_or_stricture_present === 'yes') plan = plan + '_urgent_imaging_CT_or_upper_GI_with_operative_or_endoscopic_intervention_per_urgent_protocol';
  let vitamin_protocol = 'lifelong_multivitamin_with_B12_1000mcg_daily_oral_or_sublingual_or_IM_monthly_thiamine_50mg_daily_iron_Ca_Vit_D_for_sleeve_or_RYGB_with_Q_year_labs_for_lifelong_monitoring';
  return {
    plan, vitamin_protocol,
    followup: 'Q3_to_6_months_year_1_Q6_to_12_months_year_2_then_Q_year_for_life_with_Q_year_labs_for_vitamin_deficiency_screening',
    exercise: 'progressive_exercise_with_walking_first_2_weeks_then_light_cardio_at_4_weeks_then_resistance_at_8_weeks_per_protocol_with_target_150_min_weekly',
    ppx: 'post_op_PPI_3_to_6_months_ursodeoxycholic_acid_for_6_months_post_RYGB_or_sleeve_for_gallstone_prophylaxis_with_high_risk_patients',
    citation: CITATIONS.MBSAQIP,
  };
}

function bariatricOutcomesRegistry(input) {
  const { one_year_weight_loss_pct_ewl, comorbidity_resolution_diabetes_pct, comorbidity_resolution_HTN_pct, sleep_apnea_resolution_pct, complication_rate_30d_pct, readmission_rate_30d_pct, reoperation_rate_pct, long_term_follow_up_compliance_pct } = input;
  let performance = {
    one_year_ewl_pct: one_year_weight_loss_pct_ewl,
    diabetes_resolution_pct: comorbidity_resolution_diabetes_pct,
    htn_resolution_pct: comorbidity_resolution_HTN_pct,
    sleep_apnea_resolution_pct: sleep_apnea_resolution_pct,
    complication_30d_pct: complication_rate_30d_pct,
    readmission_30d_pct: readmission_rate_30d_pct,
    reoperation_pct: reoperation_rate_pct,
    long_term_follow_up_compliance_pct: long_term_follow_up_compliance_pct
  };
  let targets_met = {
    ewl_above_50: one_year_weight_loss_pct_ewl >= 50,
    diabetes_resolution_above_60: comorbidity_resolution_diabetes_pct >= 60,
    htn_resolution_above_50: comorbidity_resolution_HTN_pct >= 50,
    complication_rate_below_10: complication_rate_30d_pct < 10,
    readmission_below_5: readmission_rate_30d_pct < 5
  };
  return {
    performance, targets_met,
    benchmarking: 'MBSAQIP_with_risk_adjusted_outcomes_review_with_Q_quarter_QI_audit',
    long_term: '5_year_follow_up_data_collection_with_Q_year_audit_for_optimal_outcomes_per_evidence_based_protocols',
    improvement: 'Q_quarter_review_with_action_plan_for_below_target_metrics_share_with_multidisciplinary_team_for_accountability',
    citation: CITATIONS.MBSAQIP,
  };
}

function bariatricRevisionalSurgery(input) {
  const { initial_procedure, indication_for_revision_weight_regain_or_complication, time_since_initial_years, current_bmi, workup_before_revision, multidisciplinary_review, surgical_options_revision_or_conversion, expected_outcomes, nutritional_risk_assessment } = input;
  let plan = 'revisional_bariatric_surgery_for_appropriate_indication_with_extensive_pre_op_workup_with_documented_failure_of_medical_management';
  let indication = 'weight_regain_or_inadequate_weight_loss_or_complication_of_initial_procedure_evaluated_individually';
  let workup = ['upper_endoscopy_for_anatomy_assessment', 'upper_GI_or_imaging_for_anatomy_review', 'psychosocial_assessment_with_realistic_expectations', 'medical_optimization_for_diabetes_nutrition_status_anemia_correction', 'second_surgical_opinion_for_revisional_complexity'];
  if (time_since_initial_years < 2) plan = plan + '_delay_revision_for_2_years_post_initial_for_full_adaptation_then_reassess';
  if (surgical_options_revision_or_conversion === 'conversion_to_RYGB') plan = plan + '_conversion_to_RYGB_for_sleeve_with_severe_reflux_or_weight_regain_with_RYGB_risk_for_nutritional_deficiency';
  return {
    plan, indication, workup,
    options: ['endoscopic_revision_for_dilated_GJ_anastomosis', 'laparoscopic_revisional_RYGB_for_sleeve_gastrectomy_failure', 'conversion_to_BPD_DS_for_extreme_BMI_with_adequate_follow_up_capacity', 'reversal_with_conversion_for_intolerance_or_nutritional_failure'],
    risk: 'revisional_surgery_higher_complication_rate_than_primary_with_increased_leak_bleeding_thromboembolism_with_informed_consent',
    citation: CITATIONS.ASMBS_COE,
  };
}

module.exports = { bariatricCOECertification, bariatricPatientSelection, bariatricPostOpManagement, bariatricOutcomesRegistry, bariatricRevisionalSurgery, CITATIONS, ValidationError };