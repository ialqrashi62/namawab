/**
 * TIER4_COE-105 Trauma Center of Excellence Engine
 * Trauma center level verification + Massive transfusion + Damage control surgery + Outcomes
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACS_TRAUMA: 'ACS Trauma Center Levels 2024', EAST_TRAUMA: 'EAST Trauma Guidelines 2024' };

function traumaCenterLevelVerification(input) {
  const { annual_trauma_volume, patients_with_iss_above_15_count, surgical_specialties_available, neurosurgery_24_7, orthopedic_surgery_24_7, anesthesia_24_7, ed_physicians_24_7_in_house, surgical_resident_24_7_in_house, icu_intensivist_present, tqip_participation, trauma_pgm_manager, outreach_program, prevention_program, rehab_program } = input;
  let level = 'level_4_basic_trauma_center';
  if (annual_trauma_volume >= 1200 && surgical_specialties_available === 'yes' && tqip_participation === 'yes' && icu_intensivist_present === 'yes') level = 'level_2_or_3_trauma_center';
  if (patients_with_iss_above_15_count >= 400 && neurosurgery_24_7 === 'yes' && surgical_resident_24_7_in_house === 'yes' && annual_trauma_volume >= 2400) level = 'level_1_trauma_center';
  let gaps = [];
  if (neurosurgery_24_7 !== 'yes') gaps.push('neurosurgery_coverage_24_7_required_for_level_1');
  if (tqip_participation !== 'yes') gaps.push('TQIP_participation_required_for_level_1_or_2_with_outcome_benchmarking');
  return {
    level, gaps,
    team: ['trauma_program_medical_director_surgical_specialty', 'trauma_program_manager_nurse_or_PA_with_quality_focus', 'trauma_registrar_with_data_collection_for_TQIP', 'ED_physicians_24_7_in_house_for_level_1_2_3', 'surgical_residents_24_7_for_level_1', 'multidisciplinary_team_with_rehab_PT_OT_psychology'],
    qm: ['TQIP_outcome_review_Q_quarter', 'mortality_and_morbidity_conference_Q_month', 'audit_of_process_measures_with_door_to_imaging_door_to_OR_door_to_consult_time', 'preventable_death_review_with_committee_oversight'],
    citation: CITATIONS.ACS_TRAUMA,
  };
}

function massiveTransfusionProtocol(input) {
  const { patient_age, mechanism_blunt_or_penetrating, systolic_bp_mmhg, hr_bpm, lactate, base_deficit, hemoglobin_initial, coagulopathy_present_inr_pt, anticoagulant_use, suspected_hemorrhage_source, platelets_available, fibrinogen_available, cryoprecipitate_available, activate_MTP } = input;
  let plan = 'massive_transfusion_protocol_1_to_1_to_1_ratio_PRP_RBC_to_FFP_with_platelet_early_with_cryoprecipitate_for_fibrinogen_below_150_to_200';
  if (activate_MTP === 'yes') plan = plan + '_with_Q15min_reassessment_with_hemorrhage_control_surgery_or_interventional_radiology';
  if (anticoagulant_use === 'warfarin') plan = plan + '_with_4_factor_prothrombin_complex_concentrate_PCC_for_rapid_reversal_with_vitamin_K_10mg_IV';
  if (anticoagulant_use === 'DOAC') plan = plan + '_with_specific_reversal_agent_idarucizumab_for_dabigatran_or_4_factor_PCC_for_factor_Xa_inhibitors';
  let goals = 'perfusion_target_MAP_65_with_warm_resuscitation_with_plasma_RBC_platelet_and_cryo_with_point_of_care_testing_TEG_or_ROTEM_directed';
  return {
    plan, goals,
    txa: 'tranexamic_acid_1g_IV_loading_then_1g_over_8h_within_3h_of_injury_for_significant_hemorrhage_with_CRASH_2_or_MATTERs_data_support',
    calcium: 'monitor_ionized_calcium_with_replacement_during_MTP_for_citrate_toxicity_prevention_with_aim_above_1.1',
    termination: 'terminate_MTP_with_attending_decision_when_hemorrhage_control_achieved_with_transition_to_goal_directed_resuscitation_with_labs_Q1h',
    citation: CITATIONS.EAST_TRAUMA,
  };
}

function damageControlSurgery(input) {
  const { mechanism_penetrating_or_blunt, physiology_acidosis_coagulopathy_hypothermia, surgical_phase_initial_or_intermediate_or_definitive, abbreviated_laparotomy_planned, packing_used, vacuum_assisted_closure_planned, definitive_surgery_timing_planned } = input;
  let plan = 'damage_control_surgery_in_3_phases_initial_life_saving_intermediate_PICU_resuscitation_then_definitive_reconstruction_with_24_to_48h_interval';
  if (physiology_acidosis_coagulopathy_hypothermia === 'lethal_triad_present') plan = plan + '_with_abbreviated_laparotomy_then_packing_then_vacuum_then_PI';
  if (vacuum_assisted_closure_planned === 'yes') plan = plan + '_with_negative_pressure_wound_therapy_Q48h_until_edema_resolves_then_definitive_closure';
  return {
    plan,
    principles: ['control_hemorrhage_with_packing_ligation_temporar_shunting', 'control_contamination_with_stapled_resection_or_diversion_with_no_anastomosis_in_acidosis', 'temporar_abdomen_closure_with_vacuum_or_zipper', 'ICU_resuscitation_for_24_to_48h_with_rewarming_correction_coagulopathy_with_relook_planned'],
    relook: 'second_look_within_24_to_48h_with_reassessment_and_definitive_repair_with_delayed_anastomosis_within_48_to_72h_or_stoma_formation',
    citation: CITATIONS.EAST_TRAUMA,
  };
}

function traumaOutcomesAndRegistry(input) {
  const { iss_average, mortality_overall_pct, mortality_blunt_pct, mortality_penetrating_pct, tqip_overall_mortality_observed_vs_expected, complication_rate_overall_pct, average_icu_los, average_hospital_los, rehab_discharge_rate } = input;
  let performance = {
    iss_average: iss_average,
    overall_mortality_pct: mortality_overall_pct,
    blunt_mortality_pct: mortality_blunt_pct,
    penetrating_mortality_pct: mortality_penetrating_pct,
    tqip_observed_vs_expected: tqip_overall_mortality_observed_vs_expected,
    complication_pct: complication_rate_overall_pct,
    avg_icu_los: average_icu_los + '_days',
    avg_hospital_los: average_hospital_los + '_days',
    rehab_discharge_pct: rehab_discharge_rate + 'pct'
  };
  let targets_met = {
    mortality_below_8: mortality_overall_pct < 8,
    observed_vs_expected_below_1: tqip_overall_mortality_observed_vs_expected < 1,
    complication_below_30: complication_rate_overall_pct < 30,
    rehab_discharge_above_40: rehab_discharge_rate >= 40
  };
  return {
    performance, targets_met,
    benchmarking: 'TQIP_with_observed_vs_expected_outcomes_with_Q_year_risk_adjustment_per_TQIP_algorithms',
    improvement: 'Q_quarter_TQIP_review_with_action_plan_for_below_expected_outcomes_with_quality_team_oversight',
    citation: CITATIONS.ACS_TRAUMA,
  };
}

function pediatricTraumaCare(input) {
  const { age_years, weight_kg, mechanism, vital_signs_normalized_or_not, family_present, child_life_specialist, pediatric_or_adult_ed, pediatric_trauma_team_available, image_gently_principle, transfer_protocol } = input;
  let plan = 'pediatric_trauma_team_activation_per_age_with_age_specific_vital_sign_thresholds_per_PALS';
  if (age_years < 12 && pediatric_trauma_team_available === 'no') plan = plan + '_transfer_to_pediatric_trauma_center_via_existing_protocol_with_image_gently_dose_reduction';
  if (age_years >= 12 && pediatric_or_adult_ed === 'adult_ed') plan = plan + '_adult_team_with_pediatric_consultation_and_age_specific_dosing';
  if (family_present === 'yes') plan = plan + '_with_family_centered_care_with_child_life_specialist_for_anxiolysis';
  return {
    plan,
    age_specific_dose: 'use_Broselow_tape_or_pediatric_weight_based_dose_calculator_for_all_medications_fluids_per_image_gently_low_radiation_dose_imaging',
    pain_management: 'non_pharmacologic_distraction_with_child_life_for_minor_injuries_IV_opioid_for_severe_with_age_dose',
    social: 'mandatory_reporter_assessment_with_child_protective_services_for_unexplained_or_suspicious_injuries_with_documented_findings',
    transfer: 'transfer_to_pediatric_trauma_center_for_pediatric_specialty_care_with_appropriate_level_per_ACS_pediatric_trauma_levels',
    citation: CITATIONS.ACS_TRAUMA,
  };
}

module.exports = { traumaCenterLevelVerification, massiveTransfusionProtocol, damageControlSurgery, traumaOutcomesAndRegistry, pediatricTraumaCare, CITATIONS, ValidationError };