/**
 * TIER3_ICU-101 Mechanical Ventilation Engine
 * ARDSNet protocol + Vent weaning + VILI prevention + NIV indications
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ARDSNET: 'ARDSNet LOW_TIDAL 2000', ATS_VENT: 'ATS Mechanical Vent 2017' };

function ardsVentilationManagement(input) {
  const { pao2_fio2_ratio, peep_cm_h2o, plateau_pressure_cm_h2o, tidal_volume_ml_per_kg_ideal_body_weight, fio2, prone_positioning_done, neuromuscular_blockade_indicated, recruitment_maneuver_done } = input;
  let severity = 'mild';
  if (pao2_fio2_ratio >= 200 && pao2_fio2_ratio <= 300) severity = 'mild';
  else if (pao2_fio2_ratio >= 100 && pao2_fio2_ratio < 200) severity = 'moderate';
  else if (pao2_fio2_ratio < 100) severity = 'severe';
  let tidal_volume_target = tidal_volume_ml_per_kg_ideal_body_weight <= 6.5 ? 'within_ardsnet_target_6mL_per_kg' : 'REDUCE_to_6mL_per_kg_per_ardsnet';
  let peep_target = peep_cm_h2o >= 5 ? 'within_peep_range' : 'increase_peep_per_ardsnet_lower_table';
  let plateau_target = plateau_pressure_cm_h2o <= 30 ? 'within_target' : 'REDUCE_tidal_volume_or_PEEP_to_keep_plateau_at_or_below_30';
  return {
    severity, tidal_volume_target, peep_target, plateau_target,
    vent_strategy: 'volume_control_or_pressure_control_ARDSnet_LOW_TIDAL_6mL_per_kg_IBW',
    adjuncts: ['prone_positioning_16h_per_day_if_pao2_fio2_below_150', 'consider_NMBA_48h_in_early_severe_ards_with_pao2_fio2_below_150', 'recruitment_maneuver_then_high_peep_or_low_PEEP_per_protocol', 'consider_HFOV_or_ECMO_for_refractory'],
    monitoring: 'ABG_Q6h_vent_parameters_Q1h_plateau_pressure_daily_CXR_Q_day_capnography_continuous',
    citation: CITATIONS.ARDSNET,
  };
}

function ventilatorWeaning(input) {
  const { spontaneous_breathing_trial_eligible, fio2_current, peep_current, mental_status_adequate, cough_reflex_adequate, minute_ventilation_lt_15L_min, rapid_shallow_breathing_index, prior_wean_failure_cause } = input;
  let sbt_eligible = spontaneous_breathing_trial_eligible === 'yes' && fio2_current <= 0.5 && peep_current <= 5 && mental_status_adequate === 'yes' && cough_reflex_adequate === 'yes';
  let weaning_plan = 'assess_SBT_eligibility_daily_safety_screen_then_perform_30_to_120_min_SBT_on_T_piece_or_PSV';
  if (rapid_shallow_breathing_index < 105) weaning_plan = 'PASS_SBT_extubate_to_room_air_or_NIV';
  if (rapid_shallow_breathing_index >= 105) weaning_plan = 'FAIL_SBT_treat_cause_then_reassess_24h';
  return {
    weaning_plan, sbt_eligible,
    daily_screening: 'RASS_minus_2_to_plus_1_screened_daily_for_SBT_eligibility',
    sbt_failure_criteria: ['RR_greater_than_35_for_5min', 'SpO2_less_than_90_for_30sec', 'HR_greater_than_140_or_less_than_50', 'systolic_BP_greater_than_180_or_less_than_90', 'agitation_or_diaphoresis_or_anxiety', 'abdominal_paradox_or_accessory_muscle_use'],
    extubation_failure_risk: 'reintubation_rate_10_to_15pct_NIV_rescue_for_high_risk_copd_or_ards',
    citation: CITATIONS.ATS_VENT,
  };
}

function ventilatorInducedLungInjury(input) {
  const { tidal_volume_ml_per_kg, plateau_pressure_cm_h2o, driving_pressure_cm_h2o, peep_cm_h2o, oxygen_fraction_long_term, aspiration_event, pneumothorax_present } = input;
  let risk_level = 'low';
  if (tidal_volume_ml_per_kg > 8 || plateau_pressure_cm_h2o > 30 || driving_pressure_cm_h2o > 15) risk_level = 'elevated_vili_risk';
  if (pneumothorax_present === 'yes' || aspiration_event === 'yes') risk_level = 'active_VILI_with_barotrauma_or_aspiration';
  return {
    risk_level,
    targets: ['tidal_volume_less_than_or_equal_to_6mL_per_kg_IBW', 'plateau_pressure_less_than_or_equal_to_30_cm_h2o', 'driving_pressure_less_than_or_equal_to_15_cm_h2o', 'SpO2_target_88_to_92_in_ards_to_limit_FiO2_exposure', 'FiO2_target_less_than_60pct_whenever_feasible'],
    adjuncts: ['prone_positioning_for_moderate_to_severe_ards', 'low_stretch_and_driving_pressure_targeted', 'reduce_set_rate_or_sedation_to_allow_spontaneous_breathing_when_stable'],
    citation: CITATIONS.ARDSNET,
  };
}

function nonInvasiveVentilation(input) {
  const { indication_category, copd_exacerbation_with_acidotic, cardiogenic_pulmonary_oedema, immunocompromised_ards_mild, post_extubation_rescue, do_not_intubate_patient } = input;
  let first_line = 'NIV_with_biPAP_IPAP_10_to_15_EPAP_5_to_10_aim_for_tidal_volume_6_to_8mL_per_kg';
  if (copd_exacerbation_with_acidotic === 'yes' && indication_category === 'hypercapnic') first_line = 'NIV_first_line_for_copd_with_ph_below_7.35_pCO2_above_45_BiPAP_for_24_to_48h_then_reassess';
  if (cardiogenic_pulmonary_oedema === 'yes') first_line = 'CPAP_10_to_12.5_cm_h2O_with_NIPPV_alternative';
  if (immunocompromised_ards_mild === 'yes') first_line = 'NIV_to_avoid_intubation_preferred_HFNC_alternative';
  if (post_extubation_rescue === 'yes') first_line = 'NIV_rescue_within_48h_post_extubation_for_high_risk';
  let success_predicted = do_not_intubate_patient === 'no' ? 'NIV_with_intubation_backup' : 'NIV_palliative_for_dni_or_dnrh';
  return {
    first_line, success_predicted,
    contraindications: ['cardiac_or_respiratory_arrest', 'hemodynamic_instability_unstable_arrhythmia', 'inability_to_protect_airway_or_clear_secretions', 'agitation_uncooperative', 'upper_airway_obstruction', 'recent_facial_or_esophageal_surgery', 'high_aspiration_risk'],
    monitoring: 'ABG_at_1h_4h_12h_clinical_assessment_dyspnea_RR_tolerance',
    failure_criteria: ['worsening_pH_or_pCO2', 'increased_WOB_or_tachypnea_greater_than_30', 'decreased_consciousness', 'inability_to_tolerate_interface'],
    citation: CITATIONS.ATS_VENT,
  };
}

function difficultAirwayManagement(input) {
  const { mallampati_score_3_or_4, limited_mouth_opening_cm, neck_mobility_restricted, prior_difficult_intubation, obesity_bmi_40_plus, obstructive_sleep_apnea, stridor_present } = input;
  let plan = 'standard_direct_laryngoscopy_with_video_laryngoscope_backup';
  if (mallampati_score_3_or_4 === 'yes' || limited_mouth_opening_cm === 'yes') plan = 'awake_fiberoptic_or_video_laryngoscope_with_backup_SGA';
  if (obesity_bmi_40_plus === 'yes' || obstructive_sleep_apnea === 'yes') plan = 'video_laryngoscope_ramped_position_spare_ETT_sizes_airway_exchange_catheter';
  let surgical_airway_ready = mallampati_score_3_or_4 === 'yes' && prior_difficult_intubation === 'yes';
  return {
    plan, surgical_airway_ready,
    difficult_airway_society_algo: ['assessment_for_difficulty_dentition_neck_opening_mallampati', 'plan_A_video_laryngoscopy_or_direct_laryngoscopy', 'plan_B_SGA_lma_or_i-gel', 'plan_c_front_of_neck_access_cricothyroidotomy_pre_oxygenate_surgical_skin_mark'],
    extubation_strategy: 'leak_test_cuff_leak_volume_above_110mL_safe_then_exchange_catheter_or_remifentanil_awake_extubation',
    citation: CITATIONS.ATS_VENT,
  };
}

module.exports = { ardsVentilationManagement, ventilatorWeaning, ventilatorInducedLungInjury, nonInvasiveVentilation, difficultAirwayManagement, CITATIONS, ValidationError };