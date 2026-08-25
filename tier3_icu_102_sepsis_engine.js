/**
 * TIER3_ICU-102 Sepsis Resuscitation Engine
 * SSC bundles + Source control + Antimicrobial timing + Vasopressor selection
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { SSC_2021: 'Surviving Sepsis Campaign 2021' };

function sepsisHour1Bundle(input) {
  const { lactate_level_initial, hypotension_present, lactate_above_2, blood_culture_drawn_before_antibiotics, broad_spectrum_antibiotic_within_1h, iv_fluid_30ml_per_kg_started, vasopressor_indicated } = input;
  let bundle_compliance = 0;
  if (lactate_level_initial !== undefined) bundle_compliance += 1;
  if (blood_culture_drawn_before_antibiotics === 'yes') bundle_compliance += 1;
  if (broad_spectrum_antibiotic_within_1h === 'yes') bundle_compliance += 1;
  if (iv_fluid_30ml_per_kg_started === 'yes' || hypotension_present !== 'yes') bundle_compliance += 1;
  let complete = bundle_compliance === 4;
  return {
    hour_1_elements: ['measure_lactate_repeat_if_above_2', 'obtain_blood_cultures_BEFORE_antibiotics', 'administer_broad_spectrum_antibiotics_within_1h', 'begin_30mL_per_kg_crystalloid_for_hypotension_or_lactate_greater_than_or_equal_to_4', 'vasopressors_if_hypotensive_during_or_after_fluid_to_keep_MAP_greater_than_65'],
    bundle_compliance, complete,
    initial_fluid_choice: 'balanced_crystalloid_lactated_Ringers_preferred_over_normal_saline_reduces_RRT',
    monitoring: 'MAP_target_greater_than_or_equal_to_65_UOP_target_0.5mL_per_kg_per_hour_lactate_clearance_at_2h_and_6h',
    citation: CITATIONS.SSC_2021,
  };
}

function vasopressorSelection(input) {
  const { map_below_65_persistent_after_fluid, central_line_placed, shock_type_category, tachyarrhythmia_concern, severe_bradycardia, cardiac_output_low_with_high_svr, prior_pressor_response } = input;
  let first_line = 'norepinephrine_start_at_0.05_mcg_per_kg_per_min_and_titrate_to_MAP_greater_than_65';
  if (shock_type_category === 'cardiogenic') first_line = 'norepinephrine_with_dobutamine_for_low_CO_or_epinephrine_alternative';
  if (shock_type_category === 'distributive_septic_or_anaphylactic') first_line = 'norepinephrine_first_then_add_vasopressin_0.03_units_per_min_for_MAP_below_target';
  if (tachyarrhythmia_concern === 'yes' && prior_pressor_response === 'poor') first_line = 'vasopressin_to_reduce_norepi_dose_or_phenylephrine_short_term';
  let second_line_additions = [];
  if (shock_type_category === 'distributive_septic_or_anaphylactic') second_line_additions.push('add_vasopressin_0.03_units_per_min');
  if (shock_type_category === 'cardiogenic') second_line_additions.push('add_dobutamine_2_to_20_mcg_per_kg_per_min_for_CO_improvement');
  return {
    first_line, second_line_additions,
    targets: 'MAP_greater_than_65mmHg_SBP_greater_than_90mmHg_peripheral_perfusion_lactate_clearance',
    monitoring: 'arterial_line_continuous_BP_CVP_or_PiCCO_for_fluid_responsiveness_lactate_Q1_to_2h_until_clearance',
    wean: 'taper_norepinephrine_when_MAP_stable_above_65_reduce_by_0.05_mcg_per_kg_per_min_Q5min',
    citation: CITATIONS.SSC_2021,
  };
}

function sourceControlSepsis(input) {
  const { infection_source_category, intra_abdominal_collection, necrotizing_soft_tissue, obstructive_pyelo_nephritis, empyema, device_line_related, surgical_intervention_within_6h, drainage_performed } = input;
  let intervention = 'antibiotics_alone_if_source_unclear_or_not_drainable';
  let urgent = false;
  if (intra_abdominal_collection === 'yes') { intervention = 'urgent_percutaneous_drainage_or_surgical_laparotomy_within_6h'; urgent = true; }
  if (necrotizing_soft_tissue === 'yes') { intervention = 'emergent_surgical_debridement_within_6h_within_24h_re_exploration'; urgent = true; }
  if (obstructive_pyelo_nephritis === 'yes') { intervention = 'urgent_urology_consult_for_stent_or_percutaneous_nephrostomy'; urgent = true; }
  if (empyema === 'yes') { intervention = 'urgent_chest_tube_drainage_or_VATS_decortication'; urgent = true; }
  if (device_line_related === 'yes') { intervention = 'remove_device_or_line_send_culture_replace_if_needed'; urgent = true; }
  return {
    intervention, urgent,
    timing_target: 'source_control_within_6h_of_diagnosis_if_drainable_or_surgical',
    antibiotic_duration: 'typically_7_to_10_days_for_source_controlled_longer_for_immunocompromised_or_uncontrolled_source',
    citation: CITATIONS.SSC_2021,
  };
}

function antimicrobialTimingDosing(input) {
  const { suspected_source, prior_antibiotic_30d, hospital_acquired, mrsa_risk_factors, pseudomonas_risk, renal_function_gfr, egfr_below_30, immunocompromised, central_nervous_system_infection } = input;
  let regimen = 'piperacillin_tazobactam_4.5g_IV_Q6h';
  if (hospital_acquired === 'yes' || immunocompromised === 'yes') regimen = 'piperacillin_tazobactam_4.5g_IV_Q6h_plus_vancomycin_for_MRSA_coverage_consider_cefepime_or_meropenem_for_pseudomonas_risk';
  if (egfr_below_30 === 'yes') regimen = 'adjust_dosing_per_renal_function_monitor_trough_levels_for_vancomycin_target_15_to_20';
  if (central_nervous_system_infection === 'yes') regimen = 'ceftriaxone_2g_IV_Q12h_plus_vancomycin_30_to_45mg_per_kg_daily_consider_ampicillin_for_listeria_age_50_plus';
  let timing = 'within_1h_of_recognition_for_septic_shock_or_lactate_above_4_within_3h_for_sepsis_without_shock';
  return {
    regimen, timing,
    de_escalation: 'review_cultures_at_48_to_72h_narrow_to_targeted_therapy_discontinue_anti_MRSA_if_no_isolation_at_48h',
    procalcitonin_guidance: 'consider_discontinuation_if_procalcitonin_below_0.5_or_decreased_by_80pct_from_peak',
    citation: CITATIONS.SSC_2021,
  };
}

function postResuscitationCare(input) {
  const { initial_lactate, lactate_2h, lactate_6h, fluid_balance_positive_24h, map_stable_above_65, urine_output_adequate, vasopressor_weaned_within_24h, organ_failure_count, sofa_score_trending } = input;
  let prognosis = 'favorable';
  if (lactate_6h === undefined || lactate_6h >= 4) prognosis = 'persistent_lactic_acidosis_high_mortality';
  if (fluid_balance_positive_24h >= 5) prognosis = 'fluid_overload_consider_diuresis_or_RRT';
  if (organ_failure_count >= 4) prognosis = 'high_MOF_mortality_consider_baseline_and_goals_of_care';
  return {
    prognosis,
    lactate_clearance_target: '20_to_50pct_decrease_at_2h_normalization_below_2_within_6h',
    conservative_fluid_strategy: 'after_initial_resuscitation_maintain_euvolemia_diurese_if_fluid_overload_balanced_crystalloid',
    rrt_indications: ['severe_metabolic_acidosis_pH_less_than_7.15', 'fluid_overload_refractory_to_diuretics', 'hyperkalemia_K_greater_than_6.5', 'uremic_complications', 'persistent_AKI_with_critical_illness'],
    nutritional: 'early_enteral_feeding_within_24_to_48h_trophic_or_full_caloric_per_protocol_target_25_to_30kcal_per_kg_per_day',
    citation: CITATIONS.SSC_2021,
  };
}

module.exports = { sepsisHour1Bundle, vasopressorSelection, sourceControlSepsis, antimicrobialTimingDosing, postResuscitationCare, CITATIONS, ValidationError };