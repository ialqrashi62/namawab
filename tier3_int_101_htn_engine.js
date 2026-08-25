/**
 * TIER3_INT-101 Hypertension Engine
 * HTN classification + Initial therapy + Resistant HTN + Urgency/Emergency + Follow-up
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACC_AHA_2017: 'ACC/AHA Hypertension 2017', ESC_ESH_2018: 'ESC/ESH Hypertension 2018' };

function hypertensionClassification(input) {
  const { sbp_mmhg, dbp_mmhg, prior_bp_readings, target_organ_damage, cv_risk_factors, comorbidities } = input;
  let stage = 'normal';
  if (sbp_mmhg < 120 && dbp_mmhg < 80) stage = 'normal';
  else if (sbp_mmhg >= 120 && sbp_mmhg < 130 && dbp_mmhg < 80) stage = 'elevated_BP';
  else if ((sbp_mmhg >= 130 && sbp_mmhg < 140) || (dbp_mmhg >= 80 && dbp_mmhg < 90)) stage = 'stage_1_HTN';
  else if ((sbp_mmhg >= 140 && sbp_mmhg < 180) || (dbp_mmhg >= 90 && dbp_mmhg < 120)) stage = 'stage_2_HTN';
  else if (sbp_mmhg >= 180 || dbp_mmhg >= 120) stage = 'hypertensive_crisis_urgency_or_emergency';
  let recommendation = 'lifestyle_modifications_first_then_pharmacotherapy_if_BP_still_above_target';
  if (target_organ_damage === 'yes' || cv_risk_factors >= 3) recommendation = 'lifestyle_plus_pharmacotherapy_initiate_at_diagnosis';
  return {
    stage, recommendation,
    measurement_method: 'average_of_2_to_3_readings_on_2_to_3_separate_visits_with_proper_cuff_size_and_technique',
    target: 'goal_BP_below_130_over_80_for_most_adults_below_140_over_90_for_older_adults_above_65_per_ACC_AHA_or_below_130_over_80_per_ESC_ESH',
    citation: CITATIONS.ACC_AHA_2017,
  };
}

function initialAntihypertensiveTherapy(input) {
  const { age_years, race, comorbidities, sbp_initial, dbp_initial, prior_response, fraility_present, side_effect_history, pregnancy } = input;
  let first_line = 'thiazide_diuretic_or_ACE_inhibitor_or_ARB_or_CCB_any_of_four_classes';
  if (race === 'black' || race === 'african_origin') first_line = 'thiazide_or_CCB_amlodipine_first_line_per_ACC_AHA';
  if (comorbidities === 'diabetes_proteinuria') first_line = 'ACE_inhibitor_or_ARB_renal_protective';
  if (comorbidities === 'heart_failure_reduced_ef') first_line = 'ACE_inhibitor_or_ARB_or_ARNI_plus_evidence_based_beta_blocker_MRA_diuretic';
  if (comorbidities === 'post_MI') first_line = 'beta_blocker_plus_ACE_inhibitor';
  if (pregnancy === 'yes') first_line = 'labetalol_or_nifedipine_or_methyldopa_AVOID_ACE_ARB_teratogenic';
  if (fraility_present === 'yes') first_line = 'start_low_dose_titrate_slowly_avoid_intensive_lowering_orthostatic_risk';
  return {
    first_line,
    classes: ['thiazide_HCTZ_chlorthalidone_indapamide', 'ACE_I_lisinopril_enalapril_ramipril', 'ARB_losartan_valsartan', 'CCB_amlodipine_diltiazem_verapamil', 'beta_blocker_metoprolol_carvedilol_bisoprolol_reserved_post_MI_or_HFrEF'],
    combination: 'SPC_single_pill_combination_first_line_for_SBP_above_20_target_to_improve_adherence',
    citation: CITATIONS.ACC_AHA_2017,
  };
}

function resistantHypertension(input) {
  const { bp_above_target_on_3_drugs, secondary_cause_screen_done, medication_adherence_verified, white_coat_hypertension_ruled_out, sleep_apnea_assessed, primary_aldosteronism_screen, renal_artery_stenosis_screen, pheochromocytoma_screen } = input;
  let plan = 'confirm_true_resistant_HTN_with_ambulatory_BP_monitoring_and_ensure_adherence';
  if (secondary_cause_screen_done !== 'yes') plan = plan + '_screen_for_secondary_causes_aldosteronism_renal_artery_stenosis_pheochromocytoma_Cushing_obstructive_sleep_apnea';
  if (sleep_apnea_assessed === 'no_obstructive_sleep_apnea') plan = plan + '_refer_for_sleep_study_and_CPAP_if_osa_diagnosed';
  let next_drug = 'spironolactone_25_to_50mg_per_day_first_add_on_for_resistant_HTN_per_PATHWAY_2_trial';
  return {
    plan, next_drug,
    secondary_causes: ['primary_aldosteronism_ARR_screening', 'renal_artery_stenosis_renal_US_or_MRA', 'pheochromocytoma_24h_urine_metanephrines', 'Cushing_syndrome_dexamethasone_suppression', 'OSA_obstructive_sleep_apnea', 'renal_parenchymal_disease_creatinine_eGFR', 'thyroid_disease_TSH'],
    monitoring: 'BP_Q2_to_4_weeks_during_titration_electrolytes_renal_function_Q1_to_3_months',
    citation: CITATIONS.ESC_ESH_2018,
  };
}

function hypertensiveUrgencyEmergency(input) {
  const { sbp_mmhg, dbp_mmhg, target_organ_damage_acute, neurologic_symptoms, chest_pain, dyspnea, aortic_dissection_suspected, pregnancy_eclampsia, cocaine_or_stimulant_use, prior_bp_control } = input;
  let diagnosis = 'hypertensive_urgency_BP_above_180_over_120_without_TOD';
  if (target_organ_damage_acute === 'yes' || neurologic_symptoms === 'yes' || chest_pain === 'yes') diagnosis = 'HYPERTENSIVE_EMERGENCY_require_IV_therapy_and_admission_to_monitored_unit';
  let plan = 'oral_therapy_reduce_BP_gradually_over_24_to_48h_avoid_rapid_drop_risk_of_organ_hypoperfusion';
  if (target_organ_damage_acute === 'yes') plan = 'IV_labetalol_or_nic_cardipine_or_enalaprilat_to_reduce_BP_by_20pct_in_first_hour_then_5_to_15pct_per_hour_to_below_160_over_100_then_oral';
  if (aortic_dissection_suspected === 'yes') plan = 'URGENT_CT_angiography_then_IV_beta_blocker_first_esmolol_then_labetalol_target_SBP_below_120_within_20_minutes_plus_opioid_pain_control';
  if (pregnancy_eclampsia === 'yes') plan = 'IV_magnesium_sulfate_for_seizure_prophylaxis_plus_IV_labetalol_or_hydralazine_target_SBP_below_160_then_emergent_delivery';
  return {
    diagnosis, plan,
    iv_options: ['labetalol_20_to_80mg_IV_Q10min_or_infusion_2mg_per_min', 'nicardipine_5_to_15mg_per_hour_IV_titrate', 'clevidipine_1_to_2mg_per_hour_IV_titrate_for_acute', 'nitroprusside_0.25_to_10mcg_per_kg_per_min_for_resistant_caution_cyanide_thiocyanate_toxicity', 'enalaprilat_1.25mg_IV_Q6h', 'esmolol_loading_500mcg_per_kg_then_50_to_200mcg_per_kg_per_min'],
    avoid: 'sublingual_nifedipine_rapid_BP_drop_with_organ_hypoperfusion',
    citation: CITATIONS.ACC_AHA_2017,
  };
}

function followUpMonitoring(input) {
  const { weeks_on_therapy, bp_at_followup, side_effects, adherence_pct, target_bp, dose_titration_count, comorbidities } = input;
  let visit_cadence = 'every_4_to_6_weeks_until_BP_at_target_then_Q3_to_6_months';
  if (side_effects === 'present') visit_cadence = '2_to_4_weeks_for_reassessment';
  let labs = 'basic_metabolic_panel_including_renal_function_potassium_at_2_to_4_weeks_then_Q_year';
  let assessment = 'BP_target_met_with_good_adherence_and_no_side_effects';
  if (bp_at_followup > target_bp) assessment = 'above_target_consider_dose_titration_or_add_second_agent_or_assess_adherence';
  return {
    visit_cadence, assessment,
    labs, monitoring_targets: 'BP_below_target_adherence_greater_than_80pct_no_side_effects_Q_quarter_review_of_medication_list',
    home_monitoring: 'home_BP_monitoring_with_proper_technique_Q_day_for_first_week_then_Q_week_when_stable_to_assess_white_coat_vs_sustained',
    citation: CITATIONS.ACC_AHA_2017,
  };
}

module.exports = { hypertensionClassification, initialAntihypertensiveTherapy, resistantHypertension, hypertensiveUrgencyEmergency, followUpMonitoring, CITATIONS, ValidationError };