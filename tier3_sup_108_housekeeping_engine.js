/**
 * TIER3_SUP-108 Environmental Services / Housekeeping Engine
 * Cleaning protocols + Cleaning schedule + Infection prevention + EVS staffing + Quality audit
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { CDC_EVS: 'CDC Environmental Infection Control 2024', AHE_EVS: 'AHE Practice Guidance 2024' };

function roomCleaningProtocol(input) {
  const { room_status_discharge_or_occupied, isolation_discharge_cleaning, organism_known, cleaning_checklist, terminal_cleaning_required, uv_disinfection_used, contact_time_held, cleaning_time_min } = input;
  let plan = 'standard_protocol_with_3_bucket_cleaning_to_dirty_and_disinfection_with_appropriate_disinfectant_per_organism';
  if (isolation_discharge_cleaning === 'yes') plan = 'enhanced_terminal_cleaning_with_UV_disinfection_for_C_difficile_norovirus_with_bleach_based_disinfectant';
  if (organism_known === 'C_difficile') plan = plan + '_with_5000_ppm_bleach_for_3_min_contact_time_then_clean_other_areas';
  if (organism_known === 'norovirus') plan = plan + '_with_bleach_based_disinfectant_and_quiet_cleaning_for_aerosol_avoidance';
  return {
    plan,
    high_touch_surfaces: ['bed_rails', 'call_light', 'overbed_table', 'bedside_table', 'TV_remote', 'door_handles', 'sink_faucet', 'toilet_seat_and_flush_handle', 'IV_pole', 'monitor_screen_and_cables'],
    disinfection_products: ['EPA_registered_hospital_grade_disinfectant_per_organism', 'bleach_1_to_10_or_5000_ppm_for_C_difficile', 'quaternary_ammonium_for_general_cleaning', 'hydrogen_peroxide_based_for_C_difficile_and_norovirus'],
    monitoring: 'ATP_swab_testing_Q_month_audit_for_cleanliness_validation_target_under_100_RLU_pass_above_500_RLU_fail',
    citation: CITATIONS.CDC_EVS,
  };
}

function dailyCleaningSchedule(input) {
  const { occupied_room_cleaning_frequency, discharge_cleaning_turnover_min, occupied_bathroom_cleaning_daily, high_touch_cleaning_frequency, isolation_room_cleaning_schedule, icu_or_critical_unit_q_hr_cleaning } = input;
  let schedule = 'daily_cleaning_with_high_touch_surfaces_Q_shift_with_bathroom_cleaned_daily_and_terminal_cleaning_at_discharge';
  let frequency = {
    high_touch: 'Q_shift_3x_daily_with_documented_competency',
    occupied_bathroom: 'daily_with_daily_cleaning_checklist',
    discharge_room: 'within_2h_of_discharge_with_priority_assignment',
    isolation_room: 'enhanced_cleaning_with_discharge_protocol_Q_discharge_with_terminal_cleaning',
    icu_or_critical_unit: 'Q_4h_high_touch_cleaning_within_critical_care_environment'
  };
  if (discharge_cleaning_turnover_min >= 90) schedule = schedule + '_improve_efficiency_with_QI_initiative';
  return {
    schedule, frequency,
    staffing: 'adequate_EVS_staffing_with_1_EVS_per_25_to_30_inpatient_beds_with_unit_specific_dedicated_staff',
    quality: 'Q_month_audit_with_QI_scorecard_for_cleanliness_turnover_time_compliance_with_checklists',
    citation: CITATIONS.AHE_EVS,
  };
}

function evsStaffTraining(input) {
  const { orientation_completed, bloodborne_pathogen_training, isolation_protocols_training, hand_hygiene_compliance, cleaning_protocol_competency, performance_observation_audit, ongoing_education } = input;
  let plan = 'comprehensive_orientation_with_Q_quarter_competency_assessment_for_all_EVS_staff';
  let modules = ['bloodborne_pathogens_standard_precautions_with_Q_year_training', 'isolation_precautions_contact_droplet_airborne_with_demonstrated_competency', 'hand_hygiene_compliance_Q_month_observation_audit', 'cleaning_protocols_with_unit_specific_orientation', 'chemical_safety_with_SDS_review', 'ergonomics_and_injury_prevention', 'patient_communication_for_EVS_in_room_engagement', 'CPR_or_basic_life_support_for_first_response'];
  return {
    plan, modules,
    competency: 'return_demonstration_for_cleaning_protocols_with_quality_audit_Q_quarter_pass_above_85pct_compliance',
    documentation: 'training_records_per_employee_with_Q_year_update_for_mandatory_topics',
    citation: CITATIONS.AHE_EVS,
  };
}

function cleaningQualityAudit(input) {
  const { audit_method_used, atp_swab_testing_done, visual_inspection_done, bacterial_swab_culture_done, turnover_time_tracked, compliance_pct, audit_frequency, action_plan_for_gaps } = input;
  let plan = 'multi_modal_audit_with_ATP_swab_Q_month_visual_inspection_Q_week_and_culture_Q_quarter';
  let metrics = ['ATP_swab_target_below_100_RLU_pass', 'visual_cleanliness_checklist_above_85pct_compliance', 'bacterial_culture_under_5_CFU_per_cm2_pass', 'turnover_time_under_90_min_for_discharge_cleaning'];
  let action_plan = 'address_audit_gaps_with_EVS_team_daily_huddle_review_root_causes_implement_corrective_action';
  return {
    plan, metrics, action_plan,
    dashboard: 'real_time_dashboard_for_cleanliness_turnover_compliance_Q_week_review_with_quality_team',
    benchmarking: 'compare_to_industry_standards_with_AHE_or_other_benchmarking_consortiums',
    citation: CITATIONS.AHE_EVS,
  };
}

function environmentalInfectionSurveillance(input) {
  const { infection_type_organism, environment_culture_positive, source_likely_environment, unit_affected, transmission_identified, additional_precautions_initiated, environmental_culture_follow_up } = input;
  let plan = 'environmental_culture_investigation_with_unit_assessment_and_enhanced_cleaning';
  let actions = ['identify_reservoir_in_environment_with_targeted_culture', 'enhanced_cleaning_with_appropriate_disinfectant_per_organism', 'review_cleaning_protocol_competency_of_staff', 'consider_no_touch_disinfection_UV_C_or_hydrogen_peroxide_fogger', 'contact_precautions_with_active_surveillance_culture_for_high_risk_pathogens', 'closure_of_unit_if_required_for_terminal_cleaning'];
  if (transmission_identified === 'ongoing') plan = plan + '_with_unit_closure_for_terminal_cleaning_and_no_admission_until_culture_cleared';
  return {
    plan, actions,
    monitoring: 'Q_week_follow_up_culture_to_confirm_cleared_then_Q_month_surveillance_culture_for_recurrence',
    reporting: 'infection_control_team_review_with_quality_CBAHI_or_JCI_reporting_per_outbreak_definition',
    citation: CITATIONS.CDC_EVS,
  };
}

module.exports = { roomCleaningProtocol, dailyCleaningSchedule, evsStaffTraining, cleaningQualityAudit, environmentalInfectionSurveillance, CITATIONS, ValidationError };