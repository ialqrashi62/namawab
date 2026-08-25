/**
 * TIER3_ICU-103 Shock Management Engine
 * Shock classification + Fluid responsiveness + Cardiogenic shock + Hemodynamic monitoring
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ESICM_SHOCK: 'ESICM Shock 2014', ACC_CARDIOGENIC: 'ACC Cardiogenic Shock 2024' };

function shockClassification(input) {
  const { cardiac_index_l_min_m2, svr_dyne_s_cm5, cvp_mm_hg, mixed_venous_o2_saturation, skin_temperature, urine_output_adequate, lactate_level, etiology_hint } = input;
  let shock_type = 'undifferentiated';
  if (cardiac_index_l_min_m2 >= 2.2 && svr_dyne_s_cm5 < 800) shock_type = 'distributive_septic_or_anaphylactic_or_neurogenic';
  if (cardiac_index_l_min_m2 < 2.2 && svr_dyne_s_cm5 > 800 && cvp_mm_hg >= 15) shock_type = 'cardiogenic';
  if (cardiac_index_l_min_m2 < 2.2 && svr_dyne_s_cm5 > 800 && cvp_mm_hg < 8) shock_type = 'hypovolemic';
  if (cardiac_index_l_min_m2 >= 2.2 && svr_dyne_s_cm5 >= 800 && cvp_mm_hg >= 15) shock_type = 'obstructive_tamponade_pe_tension_pneumothorax';
  return {
    shock_type,
    phenotype_features: {
      distributive_septic_or_anaphylactic_or_neurogenic: 'warm_extremities_high_CO_low_SVR_low_MAP_low_Diastolic_Pressure_Narrow_PP',
      cardiogenic: 'cold_extremities_low_CO_high_SVR_high_CVP_low_UOP_low_SVO2',
      hypovolemic: 'cold_extremities_low_CO_high_SVR_low_CVP_low_UOP',
      obstructive_tamponade_pe_tension_pneumothorax: 'similar_to_cardiogenic_with_distinct_etiology'
    },
    initial_workup: ['lactate_Q1_to_2h', 'ABG_with_lactate', 'CBC_CMP_coag_panel', 'ECG_CXR_echo_within_6h', 'cultures_before_antibiotics', 'troponin_procalcitonin_bnp'],
    citation: CITATIONS.ESICM_SHOCK,
  };
}

function fluidResponsivenessAssessment(input) {
  const { passive_leg_raise_plr_change_in_co, ppv_variation_percent, svv_variation_percent, tidal_volume_ml_per_kg_ibw, tidal_volume_less_than_8, spontaneous_breathing_trial, mini_fluid_challenge_100ml_response, ivc_diameter_change_percent, et_seat_test } = input;
  let fluid_responsive = false;
  if (passive_leg_raise_plr_change_in_co >= 10) fluid_responsive = true;
  if (tidal_volume_less_than_8 !== 'yes' && ppv_variation_percent >= 13) fluid_responsive = true;
  if (tidal_volume_less_than_8 !== 'yes' && svv_variation_percent >= 10) fluid_responsive = true;
  if (mini_fluid_challenge_100ml_response >= 6) fluid_responsive = true;
  if (ivc_diameter_change_percent >= 18) fluid_responsive = true;
  return {
    fluid_responsive,
    dynamic_tests: 'dynamic_indices_preferred_over_static_CVP_or_PAOP_PLR_pp_variation_svv_IVC_variability',
    thresholds: {
      passive_leg_raise_plr_change_in_co: 'delta_CO_greater_than_or_equal_to_10pct_predicts_fluid_response',
      ppv_variation_percent: 'PPV_greater_than_or_equal_to_13pct_predicts_fluid_response_only_in_mechanically_ventilated_TV_greater_than_or_equal_to_8mL_per_kg',
      mini_fluid_challenge_100ml_response: 'CO_increase_greater_than_or_equal_to_6pct_after_100mL',
    },
    non_applicable: 'spontaneous_breathing_arrhythmia_open_chest_low_tidal_volume',
    citation: CITATIONS.ESICM_SHOCK,
  };
}

function cardiogenicShock(input) {
  const { ami_anterior_present, lv_ef_percent, cardiac_index_low, cardiac_power_output_w, bnp_or_nt_probnp, lactate_above_4, sbp_less_than_90, mechanical_circulatory_support_considered, ami_revascularization_done, swan_ganz_placed } = input;
  let severity = 'class_C_Classic_CardiogenicShock';
  if (lactate_above_4 === 'yes' && sbp_less_than_90 === 'yes' && mechanical_circulatory_support_considered === 'no') severity = 'class_D_Do_or_Die';
  if (lactate_above_4 === 'yes' && mechanical_circulatory_support_considered === 'yes') severity = 'class_C_with_MCS';
  let plan = 'revascularization_if_AMI_within_2h_of_symptom_onset_plus_MCS_evaluation_IABP_impella_or_VA_ECMO';
  if (mechanical_circulatory_support_considered === 'yes') plan = 'escalate_to_impella_CP_or_VA_ECMO_for_continued_hypoperfusion';
  return {
    severity, plan,
    shock_team_activation: 'multidisciplinary_cardiogenic_shock_team_cardiologist_intensivist_interventional_MCS_surgeon',
    targets: 'MAP_greater_than_65_SBP_greater_than_90_CPO_greater_than_0.6_W_lactate_clearance_UOP_greater_than_0.5mL_per_kg_per_hour',
    monitoring: 'pulmonary_artery_catheter_for_CPO_and_SVO2_or_PiCCO_or_FloTrac_echo_Q6_to_12h',
    citation: CITATIONS.ACC_CARDIOGENIC,
  };
}

function distributiveShockManagement(input) {
  const { septic_etiology, anaphylaxis_suspected, neurogenic_after_sci_or_brain_injury, refractory_to_norepinephrine, vasopressin_added, methylene_blue_considered, hydrocortisone_200mg_per_day } = input;
  let plan = 'norepinephrine_first_line_then_add_vasopressin_for_MAP_persistence';
  if (anaphylaxis_suspected === 'yes') plan = 'epinephrine_0.3_to_0.5mg_IM_repeat_Q5min_then_IV_epinephrine_infusion_fluid_bolus_H1_and_H2_blocker_steroids';
  if (neurogenic_after_sci_or_brain_injury === 'yes') plan = 'phenylephrine_or_norepinephrine_for_loss_of_sympathetic_tone_avoid_over_resuscitation';
  if (refractory_to_norepinephrine === 'yes' && vasopressin_added === 'yes') plan = 'add_vasopressin_then_consider_angiotensin_II_or_methylene_blue_50_to_100mg_IV_then_hydrocortisone_200mg_per_day';
  return {
    plan,
    monitoring: 'MAP_target_greater_than_65_with_adequate_end_organ_perfusion_lactate_clearance_UOP',
    hpa_axis_assessment: 'cosyntropin_stimulation_test_or_empiric_hydrocortisone_200mg_per_day_for_refractory_shock',
    citation: CITATIONS.ESICM_SHOCK,
  };
}

function obstructiveShockRecognition(input) {
  const { tamponade_suspected, pe_massive_suspected, tension_pneumothorax_suspected, aortic_cross_clamp_or_dissection, cardiac_arrest_with_pocus, jvd_distended, pulsus_paradoxus, tracheal_deviation, bedside_echo_finding } = input;
  let diagnosis = 'unclear';
  let immediate = 'continue_resuscitation_evaluate_cause_within_minutes';
  if (tamponade_suspected === 'yes' || bedside_echo_finding === 'pericardial_effusion_with_collapse') { diagnosis = 'cardiac_tamponade'; immediate = 'emergent_pericardiocentesis_or_subxiphoid_window'; }
  if (pe_massive_suspected === 'yes') { diagnosis = 'massive_pulmonary_embolism'; immediate = 'systemic_thrombolysis_alteplase_100mg_over_2h_or_catheter_thrombectomy_consider_VA_ECMO'; }
  if (tension_pneumothorax_suspected === 'yes') { diagnosis = 'tension_pneumothorax'; immediate = 'immediate_needle_decompression_2nd_intercostal_midclavicular_or_5th_intercostal_anterior_axillary_then_tube_thoracostomy'; }
  return {
    diagnosis, immediate,
    pocus_protocol: 'rule_out_tamponade_RV_dilation_for_PE_pneumothorax_signs_for_tension_assess_LV_function',
    definitive_treatment: ['tamponade_pericardiocentesis', 'massive_PE_thrombolysis_versus_catheter_thrombectomy_or_embolectomy', 'tension_pneumothorax_chest_tube'],
    citation: CITATIONS.ESICM_SHOCK,
  };
}

module.exports = { shockClassification, fluidResponsivenessAssessment, cardiogenicShock, distributiveShockManagement, obstructiveShockRecognition, CITATIONS, ValidationError };