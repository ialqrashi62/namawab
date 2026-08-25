/**
 * TIER3_INT-106 Pre-Operative Medical Clearance Engine
 * Pre-op risk + Cardiac risk + Pulmonary risk + Anticoag management + Medication management
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACC_AHA_PERIOP: 'ACC/AHA Perioperative 2014', ESA_PERIOP: 'ESA Perioperative Bleeding 2023' };

function preOpCardiacRisk(input) {
  const { functional_capacity_mets, revised_cardiac_risk_index_score, surgery_specific_risk, active_cardiac_condition, age_years, prior_revascularization, valve_disease_severe } = input;
  let recommendation = 'low_risk_proceed_with_surgery';
  if (revised_cardiac_risk_index_score >= 3 || active_cardiac_condition === 'yes') recommendation = 'high_risk_consider_noninvasive_stress_test_or_delay_elective_until_optimization';
  if (functional_capacity_mets < 4 && surgery_specific_risk === 'high') recommendation = 'high_risk_with_poor_functional_capacity_noninvasive_stress_testing_or_alternative_surgical_approach';
  return {
    recommendation,
    functional_capacity: ['1_met_ADLs_around_home', '4_mets_climb_one_flight_of_stairs_walk_on_flat_at_4mph', 'above_10_mets_strenuous_sports_good_functional_capacity_for_non_cardiac_surgery'],
    active_cardiac_conditions: ['unstable_angina_or_recent_MI_30d', 'decompensated_HF', 'severe_arrhythmia', 'severe_valvular_disease'],
    citation: CITATIONS.ACC_AHA_PERIOP,
  };
}

function preOpPulmonaryRisk(input) {
  const { age_years, smoking_status, copd_present, obesity_bmi, surgery_type, general_anesthesia_planned, oxygen_dependency, asa_class, obstructive_sleep_apnea_positive } = input;
  let risk_score = (age_years > 65 ? 1 : 0) + (smoking_status === 'current' ? 1 : 0) + (copd_present === 'yes' ? 1 : 0) + (obesity_bmi >= 30 ? 1 : 0) + (asa_class >= 3 ? 1 : 0);
  let risk = risk_score >= 3 ? 'high_risk_for_post_op_respiratory_complications' : 'moderate_or_low_risk';
  let plan = 'pre_op_smoking_cessation_4_to_8_weeks_pre_op_breathing_exercises_with_incentive_spirometry_training';
  if (obstructive_sleep_apnea_positive === 'yes') plan = plan + '_continue_CPAP_perioperatively_and_bring_CPAP_to_hospital';
  return {
    risk, plan, risk_score,
    pre_op_optimization: ['smoking_cessation_4_to_8_weeks', 'incentive_spirometry_training_pre_op', 'treat_uncontrolled_asthma_or_COPD_optimization', 'weight_loss_for_obesity_if_time_allows', 'CPAP_or_BiPAP_for_known_OSA'],
    citation: CITATIONS.ACC_AHA_PERIOP,
  };
}

function periOpAnticoagManagement(input) {
  const { indication_warfarin, indication_dapt, thrombotic_risk_high, surgery_bleeding_risk, renal_function_gfr, last_dose_hours_ago, bridging_anticoagulation_considered, neuraxial_anesthesia_planned } = input;
  let plan = 'stop_warfarin_5d_before_surgery_check_INR_day_of_surgery_resume_24h_post_op_if_bleeding_risk_low';
  if (indication_dapt === 'yes' && surgery_bleeding_risk === 'high') plan = 'stop_aspirin_7d_clopidogrel_5d_before_surgery_for_high_bleeding_risk_surgery_continue_aspirin_only_for_low_bleeding_risk';
  if (thrombotic_risk_high === 'yes' && bridging_anticoagulation_considered === 'yes') plan = plan + '_bridge_with_LMWH_discontinue_LMWH_24h_before_surgery_then_resume';
  if (neuraxial_anesthesia_planned === 'yes') plan = plan + '_per_ASRA_guidelines_LMWH_24h_before_spinal_epidural_antiplatelet_review_per_recommendations';
  return {
    plan,
    doac_management: 'dabigatran_stop_24_to_48h_apixaban_or_rivaroxaban_stop_48h_before_surgery_per_renal_function_resume_24_to_48h_post_op',
    monitoring: 'INR_pre_op_if_warfarin_reversal_vitamin_K_or_FFP_per_INR_high_anti_Xa_levels_for_LMWH_bridging',
    citation: CITATIONS.ESA_PERIOP,
  };
}

function periOpMedicationManagement(input) {
  const { ace_inhibitor_arb, beta_blocker, statin, aspirin_primary_prevention, metformin, sglt2_inhibitor, insulin_basal, insulin_bolus, oral_diabetes_medication, nsaid_use, herbal_supplement_use } = input;
  let plan = 'continue_beta_blocker_and_statin_perioperatively_avoid_withdrawal_rebound';
  if (ace_inhibitor_arb === 'yes') plan = plan + '_hold_AM_of_surgery_for_hypotension_risk_resume_post_op';
  if (metformin === 'yes') plan = plan + '_hold_metformin_24h_before_surgery_due_to_lactic_acidosis_risk_if_contrast_or_renal_issues';
  if (sglt2_inhibitor === 'yes') plan = plan + '_hold_SGLT2_inhibitor_3d_before_surgery_due_to_euglycemic_DKA_risk';
  if (insulin_basal === 'yes') plan = plan + '_give_50_to_80pct_of_basal_insulin_morning_of_surgery_with_dextrose_IV_to_maintain_glucose_140_to_180';
  if (aspirin_primary_prevention === 'yes') plan = plan + '_stop_aspirin_7d_before_non_cardiac_surgery_to_reduce_bleeding';
  if (nsaid_use === 'yes') plan = plan + '_stop_NSAIDs_3d_before_surgery_for_bleeding_risk';
  return {
    plan,
    herbal_supplements: 'stop_garlic_ginkgo_ginger_echinacea_st_johns_wort_5_to_7d_pre_op',
    citation: CITATIONS.ACC_AHA_PERIOP,
  };
}

function postOpComplicationPrevention(input) {
  const { surgery_type, post_op_afib_risk, dvt_risk, ileus_risk, surgical_site_infection_risk, glucose_target, mobilization_day1, pain_control_adequate } = input;
  let plan = 'caprini_score_assessment_for_VTE_prophylaxis_with_LMWH_or_UFH_plus_intermittent_pneumatic_compression';
  if (post_op_afib_risk === 'high') plan = plan + '_monitor_telemetry_48_to_72h_post_cardiac_surgery_avoid_hypokalemia_and_hypomagnesemia';
  if (surgical_site_infection_risk === 'high') plan = plan + '_antibiotic_within_60min_of_incision_discontinue_within_24h_clean_surgery_48h_contaminated_normothermia_oxygenation_glycemic_control';
  let glucose_plan = 'target_glucose_140_to_180_mg_per_dL_with_insulin_protocol_avoid_hypoglycemia_and_hyperglycemia';
  return {
    plan, glucose_plan,
    early_mobilization: 'day1_sit_stand_walk_within_24h_reduces_DVT_ileus_pneumonia_deconditioning_LOS',
    pain_management: 'multimodal_acetaminophen_NSAIDs_gabapentin_with_opioid_sparing_to_reduce_opioid_complications_ileus_respiratory_depression',
    citation: CITATIONS.ACC_AHA_PERIOP,
  };
}

module.exports = { preOpCardiacRisk, preOpPulmonaryRisk, periOpAnticoagManagement, periOpMedicationManagement, postOpComplicationPrevention, CITATIONS, ValidationError };