/**
 * TIER3_ICU-104 ICU Sedation / Delirium / Analgesia Engine
 * Analgesia-first sedation + RASS targeting + Delirium prevention + Early mobility
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { PADIS: 'SCCM PADIS Guidelines 2018', ICU_LIBS: 'ICU Liberation 2020' };

function analgesiaFirstSedation(input) {
  const { pain_score_nrs_0_to_10, current_opioid_dose, opioid_side_effect_present, renal_function_gfr, hepatic_failure, chronic_opioid_use, neuropathic_pain_component, abdominal_pain_postop, anticipated_vent_duration_days } = input;
  let first_line = 'IV_fentanyl_25_to_100mcg_Q5min_PRN_or_morphine_2_to_4mg_Q4h_PRN_or_hydromorphone_0.5_to_2mg_Q4h_PRN';
  if (renal_function_gfr < 30) first_line = 'fentanyl_or_hydromorphone_avoid_morphine_metabolites_accumulate';
  if (chronic_opioid_use === 'yes') first_line = 'maintain_baseline_opioid_plus_rotation_to_avoid_withdrawal_hydromorphone_preferred';
  if (neuropathic_pain_component === 'yes') first_line = 'gabapentin_300mg_TID_or_pregabalin_50mg_BID_plus_IV_opioid';
  return {
    first_line,
    non_opioid_adjuncts: ['IV_acetaminophen_1g_Q6h', 'IV_ketorolac_15_to_30mg_Q6h_short_term_if_renal_function_OK', 'IV_lidocaine_1.5mg_per_kg_bolus_then_1.5mg_per_kg_per_hour_short_term', 'epidural_or_nerve_block_for_postop'],
    monitoring: 'NRS_or_BPS_pain_score_Q1h_during_interventions_Q4h_when_stable_side_effects_sedation_respiratory_depression_constipation',
    weaning: 'taper_10_to_20pct_per_day_avoid_withdrawal_in_chronic_users',
    citation: CITATIONS.PADIS,
  };
}

function rassTargetingSedation(input) {
  const { current_rass, target_rass, agitation_present, ventilated_required, neuromuscular_blockade_active, prior_delirium, alcohol_use_history, expected_icu_stay_above_3d } = input;
  let sedation_target = target_rass;
  let strategy = 'light_sedation_RASS_0_to_minus_2_with_daily_sedation_interruption';
  if (ventilated_required === 'yes' && expected_icu_stay_above_3d === 'no') strategy = 'light_sedation_RASS_0_to_minus_1_daily_interruption_with_SBT';
  if (agitation_present === 'yes') strategy = 'analgesia_first_then_low_dose_dexmedetomidine_or_propofol_for_RASS_0_to_minus_2';
  if (neuromuscular_blockade_active === 'yes') strategy = 'deep_sedation_RASS_minus_4_to_minus_5_during_NMBA_BIS_monitoring_50_to_70';
  return {
    strategy, sedation_target,
    sedation_agents: ['propofol_5_to_50mcg_per_kg_per_min_titrate_short_term_max_48h_due_to_propofol_infusion_syndrome', 'dexmedetomidine_0.2_to_1.5mcg_per_kg_per_hour_no_respiratory_depression', 'midazolam_0.02_to_0.1mg_per_kg_per_hour_short_term_only_risk_of_accumulation'],
    daily_interruption: 'daily_sedation_interruption_Q_day_awaken_trial_then_SBT_to_assess_readiness',
    citation: CITATIONS.PADIS,
  };
}

function deliriumPreventionManagement(input) {
  const { icam_cam_icu_positive, hyperactive_hypoactive_mixed, sedation_dose_high, benzodiazepine_use, restraints_present, sleep_deprivation, vision_or_hearing_impairment, alcohol_withdrawal_suspected, infection_source, metabolic_cause } = input;
  let plan = 'identify_and_treat_underlying_cause_non_pharmacologic_first';
  let non_pharm = 'reorientation_protocol_sleep_wake_cycle_eyeglasses_hearing_aids_early_mobility_family_presence_remove_lines_and_tubes_when_possible';
  if (benzodiazepine_use === 'yes') plan = 'tapering_off_benzodiazepines_to_dexmedetomidine_for_better_delirium_profile';
  if (alcohol_withdrawal_suspected === 'yes') plan = 'CIWA_Ar_protocol_with_benzodiazepines_symptom_triggered';
  if (hyperactive_hypoactive_mixed === 'hyperactive' && safety_risk === 'yes') plan = 'low_dose_haloperidol_0.5_to_2mg_Q4h_PRN_or_quetiapine_25_to_50mg_BID_monitor_QTc';
  return {
    plan, non_pharm,
    prevention_abcdef_bundle: ['A_Assess_prevent_and_manage_pain', 'B_Both_Spontaneous_awakening_trials_and_Spontaneous_breathing_trials', 'C_Choice_of_analgesia_and_sedation', 'D_Delirium_assess_prevent_manage', 'E_Early_mobility_and_exercise', 'F_Family_engagement_and_empowerment'],
    pharmacologic_options: 'haloperidol_or_quetiapine_or_dexmedetomidine_only_for_safety_risk_or_severe_distress_after_non_pharmacologic_failed',
    citation: CITATIONS.PADIS,
  };
}

function earlyMobilityICU(input) {
  const { mobility_level, safety_screening_passed, vasopressor_or_impella_present, lines_tubes_present_count, sedation_light_enough, prior_mobility_status, time_since_admission_hours, neuromuscular_weakness_present } = input;
  let plan = 'passive_range_of_motion_then_sit_on_bedside_then_stand_then_ambulate';
  if (safety_screening_passed !== 'yes') plan = 'safety_screen_failure_passive_only_daily_stretching';
  if (vasopressor_or_impella_present === 'yes' && lines_tubes_present_count >= 3) plan = 'in_bed_mobility_only_with_physiotherapy';
  if (sedation_light_enough === 'no') plan = 'first_lighten_sedation_then_progress_mobility';
  return {
    plan,
    progression: ['level_1_passive_range_of_motion_in_bed', 'level_2_sit_up_in_bed_or_dangle_legs', 'level_3_stand_at_bedside', 'level_4_transfer_to_chair', 'level_5_ambulate_in_room_or_hallway'],
    safety_screening: ['no_active_myocardial_ischemia', 'stable_hemodynamics_no_escalating_vasopressors', 'secure_airway_no_escalating_vent_support', 'no_active_bleeding', 'cooperative_and_able_to_follow_commands'],
    benefit: 'reduce_ICU_acquired_weakness_shorten_ventilator_days_reduce_delirium_decrease_LOS_and_mortality',
    citation: CITATIONS.ICU_LIBS,
  };
}

function alcoholAndSubstanceWithdrawal(input) {
  const { ciwa_ar_score, last_drink_hours_ago, history_of_dt_seizure, prior_withdrawal_severity, hepatic_dysfunction_present, active_delirium_tremens, wernickes_encephalopathy_risk, thiamine_replacement_given } = input;
  let plan = 'symptom_triggered_CIWA_Ar_protocol_with_diazepam_or_chlordiazepoxide_or_lorazepam';
  if (active_delirium_tremens === 'yes') plan = 'IV_lorazepam_high_dose_protocol_or_diazepam_infusion_then_PICU_with_ICU_monitoring';
  if (hepatic_dysfunction_present === 'yes') plan = 'lorazepam_or_oxazepam_short_acting_preferred_over_chlordiazepoxide';
  if (wernickes_encephalopathy_risk === 'yes') plan = 'IV_thiamine_500mg_TID_for_3_to_5_days_before_glucose_then_maintenance_oral_thiamine';
  return {
    plan,
    seizure_prophylaxis: 'consider_levetiracetam_or_phenobarbital_in_high_risk_for_alcohol_withdrawal_seizure',
    monitoring: 'CIWA_Ar_Q1h_then_Q4h_when_stable_chem8_liver_function_Magnesium_replacement_tight_glucose_control',
    when_to_escalate_to_icu: ['delirium_tremens', 'seizure', 'severe_agitation_or_safety_risk', 'autonomic_instability_hypertension_tachycardia_fever', 'Wernickes_encephalopathy_signs_ophthalmoplegia_ataxia_confusion'],
    citation: CITATIONS.PADIS,
  };
}

module.exports = { analgesiaFirstSedation, rassTargetingSedation, deliriumPreventionManagement, earlyMobilityICU, alcoholAndSubstanceWithdrawal, CITATIONS, ValidationError };