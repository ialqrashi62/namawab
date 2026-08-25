/**
 * TIER3_ALLERGY-301 Asthma Engine
 * Asthma control (ACT) + Asthma severity classification + Stepwise management (GINA) + Asthma exacerbation + Biologics eligibility
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { GINA: 'GINA 2024', NAEPP: 'NAEPP EPR-4 2024' };

function asthmaControlAct(input) {
  const { day_symptoms, night_symptoms, reliever_use, activity_limitation, patient_perception } = input;
  let score = 25 - (day_symptoms * 5) - (night_symptoms * 5) - (reliever_use * 4) - (activity_limitation * 5) - patient_perception;
  if (score < 0) score = 0;
  let control_level = 'well_controlled';
  if (score <= 15) control_level = 'very_poorly_controlled';
  else if (score <= 19) control_level = 'poorly_controlled';
  return {
    act_score: score, control_level,
    next_step: control_level === 'well_controlled' ? 'maintain_current_therapy' : control_level === 'very_poorly_controlled' ? 'step_up_2_steps_and_re_evaluate_Q2_to_4_weeks' : 'step_up_one_step_Q2_to_4_weeks',
    triggers_to_assess: ['inhaler_technique', 'adherence', 'comorbid_allergic_rhinitis_or_obesity_or_GERD', 'environmental_triggers_dust_mites_pets_cockroach_mold_smoking'],
    citation: CITATIONS.GINA,
  };
}

function asthmaSeverityClassification(input) {
  const { age_years, daytime_symptoms, nighttime_symptoms, fev1_pct_predicted, fev1_fvc_ratio } = input;
  let severity = 'intermittent';
  if (daytime_symptoms === 'throughout_the_day' || fev1_pct_predicted < 60) severity = 'severe_persistent';
  else if (daytime_symptoms === 'daily' || fev1_pct_predicted < 80) severity = 'moderate_persistent';
  else if (daytime_symptoms >= 3 || nighttime_symptoms >= 1 || fev1_pct_predicted >= 80) severity = 'mild_persistent';
  return {
    severity, age_years, fev1_pct_predicted,
    initial_step: severity === 'severe_persistent' ? 'step_4_to_5_high_dose_ICS_LABA' : severity === 'moderate_persistent' ? 'step_3_medium_dose_ICS_LABA' : severity === 'mild_persistent' ? 'step_2_low_dose_ICS' : 'step_1_PRN_SABA_or_low_dose_ICS',
    citation: CITATIONS.GINA,
  };
}

function stepwiseManagement(input) {
  const { current_step, control_level, risk_factors_present, adherence_status, inhaler_technique_correct } = input;
  let action = 'maintain_current_step';
  if (control_level !== 'well_controlled' && inhaler_technique_correct === 'yes' && adherence_status === 'good') action = 'step_up_consider_adding_LTRA_or_LABA_or_increasing_ICS_dose';
  else if (control_level !== 'well_controlled' && adherence_status === 'poor') action = 'address_adherence_first_then_re_evaluate';
  else if (control_level === 'well_controlled' && current_step >= 4) action = 'consider_step_down_Q3_to_6_months_with_close_monitoring';
  return {
    current_step, control_level, action,
    preferred_controllers_per_step: ['step_1_PRN_low_dose_ICS_formoterol', 'step_2_daily_low_dose_ICS', 'step_3_low_dose_ICS_LABA', 'step_4_medium_dose_ICS_LABA', 'step_5_high_dose_ICS_LABA_plus_biologic_or_oral_steroid'],
    smart_therapy_mart: 'BUD_formoterol_maintenance_and_reliever_therapy_preferred_for_GINA_step_3_to_5',
    citation: CITATIONS.GINA,
  };
}

function asthmaExacerbation(input) {
  const { severity_severity, peak_flow_pct_predicted, spo2_pct, ability_to_speak, mental_status } = input;
  let severity_class = 'mild_exacerbation';
  if (peak_flow_pct_predicted < 50 || spo2_pct < 92 || ability_to_speak === 'words_only' || mental_status === 'altered') severity_class = 'severe_exacerbation';
  else if (peak_flow_pct_predicted < 75 || spo2_pct < 95 || ability_to_speak === 'phrases') severity_class = 'moderate_exacerbation';
  let disposition = 'discharge_with_oral_steroid_burst_Q5_days';
  if (severity_class === 'severe_exacerbation') disposition = 'admit_for_observation_or_ICU_for_intubation_consideration';
  return {
    severity_class, peak_flow_pct_predicted, spo2_pct, ability_to_speak,
    treatment: ['continuous_albuterol_Q1h_or_back_to_back_nebs', 'systemic_steroid_IV_or_PO_prednisone_60mg_or_dexamethasone', 'supplemental_O2_to_target_SpO2_93_to_95', 'consider_Mg_sulfate_IV_2g_over_20min_for_severe'],
    disposition,
    citation: CITATIONS.GINA,
  };
}

function biologicsEligibility(input) {
  const { eosinophil_count_cells_per_ul, ige_level_ku_l, allergic_triggers_identified, oral_steroid_bursts_per_year, asthma_severity_persistent } = input;
  let biologic_eligible = false;
  if (asthma_severity_persistent === 'severe' && (eosinophil_count_cells_per_ul >= 150 || ige_level_ku_l >= 30) && oral_steroid_bursts_per_year >= 2) biologic_eligible = true;
  let biologic_choice = 'omalizumab_anti_ige_if_allergic_phenotype';
  if (eosinophil_count_cells_per_ul >= 300) biologic_choice = 'mepolizumab_or_benralizumab_or_dupilumab_anti_eosinophilic';
  else if (ige_level_ku_l >= 30 && allergic_triggers_identified === 'yes') biologic_choice = 'omalizumab_anti_ige';
  else if (asthma_severity_persistent === 'severe' && (eosinophil_count_cells_per_ul >= 150 || oral_steroid_bursts_per_year >= 2)) biologic_choice = 'dupilumab_anti_il4_il13_preferred_first_line';
  return {
    biologic_eligible, biologic_choice, eosinophil_count_cells_per_ul, ige_level_ku_l,
    workup_before_starting: ['serum_IgE', 'CBC_with_differential_eosinophil', 'comprehensive_metabolic_panel', 'hepatitis_B_and_C_serology', 'consider_latent_TB_screening'],
    citation: CITATIONS.NAEPP,
  };
}

module.exports = { asthmaControlAct, asthmaSeverityClassification, stepwiseManagement, asthmaExacerbation, biologicsEligibility, CITATIONS, ValidationError };